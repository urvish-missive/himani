/**
 * POST /api/pin-login
 *
 * Signs the admin in with a PIN instead of an email and password. The PIN is
 * checked here on the server (it never ships to the browser); when it matches,
 * this returns a Firebase custom token for the admin account, which the admin
 * page exchanges for a normal Firebase session. Firestore rules still decide
 * what that account can do.
 *
 * Needs these server environment variables:
 *   ADMIN_PIN                 the PIN, digits only
 *   ADMIN_UID                 UID of the Firebase user that is listed in /admins
 *   FIREBASE_SERVICE_ACCOUNT  the service account key JSON (raw or base64)
 *
 * Attempts are counted in Firestore (pinLogins, which the site itself can't
 * read or write): 5 tries per address per 15 minutes, and 30 tries per hour
 * from everyone together. Email sign-in keeps working while PIN sign-in waits.
 */
import { SignJWT, importPKCS8 } from 'jose';

declare const process: { env: Record<string, string | undefined> };

type Env = Record<string, string | undefined>;

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
}

const PER_IP = { attempts: 5, windowMs: 15 * 60_000 };
const GLOBAL = { attempts: 30, windowMs: 60 * 60_000 };

export async function POST(request: Request): Promise<Response> {
  return handlePinLogin(request, process.env);
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

function readServiceAccount(env: Env): ServiceAccount | null {
  const raw = env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (!raw) return null;
  try {
    const sa = JSON.parse(raw.startsWith('{') ? raw : atob(raw)) as ServiceAccount;
    return sa.client_email && sa.private_key ? { ...sa, private_key: sa.private_key.replace(/\\n/g, '\n') } : null;
  } catch {
    return null;
  }
}

async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Compares in constant time, so response timing doesn't reveal how much of the PIN was right. */
async function samePin(a: string, b: string) {
  const [x, y] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}

// ---------------------------------------------------------------- Firestore (attempt counting)

/** Counts attempts with atomic increments, so a burst of parallel guesses can't slip past the limit. */
async function attemptCounter(env: Env, sa: ServiceAccount) {
  const projectId = env.FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID || sa.project_id;
  const emulator = env.FIRESTORE_EMULATOR_HOST;
  const dbPath = `projects/${projectId}/databases/(default)`;
  const url = `${emulator ? `http://${emulator}` : 'https://firestore.googleapis.com'}/v1/${dbPath}/documents:commit`;

  let auth = 'Bearer owner';
  if (!emulator) {
    const key = await importPKCS8(sa.private_key, 'RS256');
    const assertion = await new SignJWT({ scope: 'https://www.googleapis.com/auth/datastore' })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(sa.client_email)
      .setSubject(sa.client_email)
      .setAudience('https://oauth2.googleapis.com/token')
      .setIssuedAt()
      .setExpirationTime('10m')
      .sign(key);
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    });
    if (!res.ok) throw new Error(`token exchange ${res.status}`);
    auth = `Bearer ${(await res.json()).access_token}`;
  }

  /** Adds one to each counter and resolves to their new values. */
  return async (ids: string[]): Promise<number[]> => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        writes: ids.map((id) => ({
          transform: {
            document: `${dbPath}/documents/pinLogins/${id}`,
            fieldTransforms: [{ fieldPath: 'attempts', increment: { integerValue: '1' } }],
          },
        })),
      }),
    });
    if (!res.ok) throw new Error(`count ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const body = await res.json();
    return body.writeResults.map((w: { transformResults: { integerValue: string }[] }) => Number(w.transformResults[0].integerValue));
  };
}

// ---------------------------------------------------------------- Handler

/** A Firebase custom token for the admin account, signed with the service account key. */
async function customToken(sa: ServiceAccount, uid: string) {
  const key = await importPKCS8(sa.private_key, 'RS256');
  return new SignJWT({ uid })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(sa.client_email)
    .setSubject(sa.client_email)
    .setAudience('https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key);
}

const wait = (min: number) => `Too many wrong PINs. Try again in ${Math.max(1, Math.ceil(min))} minute${min > 1 ? 's' : ''}, or sign in with email.`;

export async function handlePinLogin(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Use POST.' });

  const pinSetting = env.ADMIN_PIN?.trim();
  const uid = env.ADMIN_UID?.trim();
  const sa = readServiceAccount(env);
  if (!pinSetting || !uid || !sa) {
    return json(503, { error: 'PIN sign-in isn’t set up on the server yet. Sign in with email instead.' });
  }

  let pin = '';
  try {
    pin = String(((await request.json()) as { pin?: unknown }).pin ?? '').trim();
  } catch {
    return json(400, { error: 'Invalid request.' });
  }
  if (!/^\d{4,12}$/.test(pin)) return json(400, { error: 'Enter your PIN.' });

  // Counters per address per 15 minutes, and for everyone per hour.
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const ipBucket = Math.floor(now / PER_IP.windowMs);
  const allBucket = Math.floor(now / GLOBAL.windowMs);

  try {
    const count = await attemptCounter(env, sa);
    const [mine, all] = await count([`ip-${(await sha256(ip)).slice(0, 32)}-${ipBucket}`, `all-${allBucket}`]);
    if (mine > PER_IP.attempts) return json(429, { error: wait(((ipBucket + 1) * PER_IP.windowMs - now) / 60_000) });
    if (all > GLOBAL.attempts) return json(429, { error: wait(((allBucket + 1) * GLOBAL.windowMs - now) / 60_000) });

    if (await samePin(pin, pinSetting)) return json(200, { token: await customToken(sa, uid) });

    const left = PER_IP.attempts - mine;
    return json(401, { error: left > 0 ? `Wrong PIN. ${left} ${left === 1 ? 'try' : 'tries'} left.` : wait(((ipBucket + 1) * PER_IP.windowMs - now) / 60_000) });
  } catch (err) {
    console.error('[pin-login]', err instanceof Error ? err.message : err);
    return json(500, { error: 'PIN sign-in failed on the server. Sign in with email instead.' });
  }
}
