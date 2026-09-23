import { useState, type FormEvent } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword, updateProfile } from 'firebase/auth';
import { Check, Copy, Database, Download, KeyRound, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import { auth } from '../../../lib/firebase';
import { useGetLeadsQuery } from '../../../store/leadsApi';
import { useAdmin } from '../AdminLayout';
import { Avatar, exportCsv, formatDate } from '../shared';

const inputCls = 'mt-1.5 w-full rounded-xl border border-rule bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent';
const labelCls = 'font-display text-sm font-semibold text-ink';

export default function SettingsView() {
  const { user } = useAdmin();
  const { data: leads = [] } = useGetLeadsQuery();

  return (
    <div className="max-w-3xl space-y-6">
      <Section icon={UserRound} title="Profile" body="How your name appears in the admin panel.">
        <ProfileForm />
      </Section>

      <Section icon={KeyRound} title="Change password" body="You'll need your current password to set a new one.">
        <PasswordForm email={user.email ?? ''} />
      </Section>

      <Section icon={Database} title="Your data" body="Leads are stored in Firebase Firestore, in your own Google project.">
        <dl className="grid sm:grid-cols-3 gap-3 mb-5">
          <Fact label="Leads stored" value={String(leads.length)} />
          <Fact label="Firebase project" value={import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '—'} />
          <Fact label="Oldest lead" value={leads.length ? formatDate(leads[leads.length - 1].createdAt, false) : '—'} />
        </dl>
        <button
          onClick={() => exportCsv(leads, 'leads-all')}
          disabled={!leads.length}
          className="inline-flex items-center gap-2 rounded-xl bg-ink text-paper px-4 py-2.5 font-display font-semibold text-sm disabled:opacity-40"
        >
          <Download className="w-4 h-4" /> Download all leads (CSV)
        </button>
      </Section>

      <Section icon={ShieldCheck} title="Admin access" body="Who can open this panel.">
        <p className="text-sm text-ink leading-relaxed">
          An admin is a Firebase user whose UID has a document in the <code className="bg-lav px-1.5 py-0.5 rounded">admins</code> collection.
          For security this can only be changed in the Firebase console, never from the website.
        </p>
        <ol className="list-decimal pl-5 mt-3 space-y-1.5 text-sm text-ink">
          <li>
            In <b>Authentication → Users</b>, click <b>Add user</b> and set their email and password.
          </li>
          <li>Copy the new user's UID from the same list.</li>
          <li>
            In <b>Firestore → admins</b>, add a document whose ID is that UID (add any field, e.g. <code>role: admin</code>).
          </li>
        </ol>
        <p className="text-sm text-muted mt-3">To remove someone, delete their document in admins.</p>
        <div className="mt-5 flex items-center gap-2 text-sm">
          <span className="text-muted font-display">Your UID:</span>
          <CopyText text={user.uid} />
        </div>
      </Section>

      <Section icon={LogOut} title="Session" body={`Signed in as ${user.email}. Last sign-in ${formatDate(user.metadata.lastSignInTime ? Date.parse(user.metadata.lastSignInTime) : null)}.`}>
        <button
          onClick={() => signOut(auth())}
          className="inline-flex items-center gap-2 rounded-xl border border-bad/40 text-bad px-4 py-2.5 font-display font-semibold text-sm hover:bg-bad/10"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </Section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card border border-rule rounded-2xl p-5 sm:p-6">
      <header className="flex items-start gap-3 mb-5">
        <span className="w-10 h-10 rounded-xl bg-lav text-accent flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </span>
        <div>
          <h2 className="font-display font-bold text-lg text-ink">{title}</h2>
          <p className="text-sm text-muted">{body}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper-2 border border-rule rounded-xl px-4 py-3">
      <dt className="text-xs text-muted font-display">{label}</dt>
      <dd className="font-display font-semibold text-ink truncate mt-0.5">{value}</dd>
    </div>
  );
}

function CopyText({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard blocked; the text is still selectable.
        }
      }}
      className="inline-flex items-center gap-1.5 font-mono text-xs bg-paper-2 border border-rule rounded-lg px-2.5 py-1.5 text-ink hover:border-accent select-all"
      title="Copy"
    >
      <span className="truncate max-w-[220px] sm:max-w-none">{text}</span>
      {copied ? <Check className="w-3.5 h-3.5 text-good shrink-0" /> : <Copy className="w-3.5 h-3.5 text-muted shrink-0" />}
    </button>
  );
}

function Feedback({ ok, error }: { ok?: string; error?: string }) {
  if (error) return <p className="text-bad text-sm font-display">{error}</p>;
  if (ok) return <p className="text-good text-sm font-display">{ok}</p>;
  return null;
}

function ProfileForm() {
  const { user } = useAdmin();
  const [name, setName] = useState(user.displayName ?? '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg({});
    try {
      await updateProfile(user, { displayName: name.trim() || null });
      setMsg({ ok: 'Saved. It will show everywhere after a refresh.' });
    } catch {
      setMsg({ error: "Couldn't save your name. Try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
        <Avatar name={name || user.email || '?'} size="lg" />
        <label className="block flex-1">
          <span className={labelCls}>Display name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Himani Kankaria" className={inputCls} />
        </label>
        <button type="submit" disabled={busy} className="btn solid justify-center disabled:opacity-60">
          {busy ? 'Saving…' : 'Save'}
        </button>
      </div>
      <Feedback {...msg} />
    </form>
  );
}

function PasswordForm({ email }: { email: string }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg({});
    if (next.length < 8) return setMsg({ error: 'Use at least 8 characters for the new password.' });
    if (next !== confirm) return setMsg({ error: "The new passwords don't match." });

    const u = auth().currentUser;
    if (!u) return;
    setBusy(true);
    try {
      await reauthenticateWithCredential(u, EmailAuthProvider.credential(email, current));
      await updatePassword(u, next);
      setCurrent('');
      setNext('');
      setConfirm('');
      setMsg({ ok: 'Password changed.' });
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      setMsg({
        error:
          code.includes('wrong-password') || code.includes('invalid-credential')
            ? 'Your current password is incorrect.'
            : code.includes('weak-password')
            ? 'That password is too weak. Try a longer one.'
            : code.includes('too-many-requests')
            ? 'Too many attempts. Wait a few minutes and try again.'
            : "Couldn't change the password. Try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-3 gap-4">
      {/* Hidden username helps password managers pair the new password with this account. */}
      <input type="email" autoComplete="username" value={email} readOnly hidden />
      <label className="block">
        <span className={labelCls}>Current password</span>
        <input type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>New password</span>
        <input type="password" autoComplete="new-password" required value={next} onChange={(e) => setNext(e.target.value)} className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Confirm new password</span>
        <input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} />
      </label>
      <div className="sm:col-span-3 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy} className="btn solid justify-center disabled:opacity-60">
          {busy ? 'Updating…' : 'Update password'}
        </button>
        <Feedback {...msg} />
      </div>
    </form>
  );
}
