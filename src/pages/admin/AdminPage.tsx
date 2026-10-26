import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithCustomToken, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { skipToken } from '@reduxjs/toolkit/query';
import { Crown } from 'lucide-react';
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { leadsApi, useCheckAdminQuery } from '../../store/leadsApi';
import { blogApi } from '../../store/blogApi';
import type { AppDispatch } from '../../store';
import AdminLayout from './AdminLayout';
import DashboardView from './views/DashboardView';
import LeadsView from './views/LeadsView';
import PipelineView from './views/PipelineView';
import SettingsView from './views/SettingsView';
import BlogListView from './views/BlogListView';
import PostEditorView from './views/PostEditorView';
import BulkUploadView from './views/BulkUploadView';
import { bulkUpload } from '../../lib/bulkUpload';

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Admin · Himani Kankaria';
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);
}

export default function AdminPage() {
  useNoIndex();
  const dispatch = useDispatch<AppDispatch>();
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(auth(), (u) => {
      setUser(u);
      setAuthReady(true);
      // Drop cached admin data so the next account never sees the previous one's leads.
      if (!u) {
        dispatch(leadsApi.util.resetApiState());
        dispatch(blogApi.util.resetApiState());
        bulkUpload.reset();
      }
    });
  }, [dispatch]);

  const { data: isAdmin, isFetching: checkingAdmin } = useCheckAdminQuery(user?.uid ?? skipToken);

  if (!isFirebaseConfigured) {
    return (
      <Shell>
        <Panel title="Firebase isn't set up yet">
          <p className="text-muted">
            Add the <code className="text-ink">VITE_FIREBASE_*</code> variables to <code className="text-ink">.env</code> locally
            and to your Vercel project settings, then redeploy.
          </p>
        </Panel>
      </Shell>
    );
  }

  if (!authReady || (user && checkingAdmin)) {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3 text-muted font-display">
          <span className="w-8 h-8 rounded-full border-2 border-rule border-t-accent animate-spin" aria-hidden="true" />
          Loading…
        </div>
      </Shell>
    );
  }

  if (!user) return <LoginScreen />;

  if (!isAdmin) {
    return (
      <Shell>
        <Panel title="No admin access">
          <p className="text-muted">
            <span className="text-ink font-semibold">{user.email}</span> is signed in but isn't listed as an admin.
          </p>
          <p className="text-muted text-sm mt-3">
            UID: <code className="text-ink break-all select-all">{user.uid}</code>
          </p>
          <button onClick={() => signOut(auth())} className="btn ghost mt-6 w-full justify-center">
            Sign out
          </button>
        </Panel>
      </Shell>
    );
  }

  return (
    <Routes>
      <Route element={<AdminLayout user={user} />}>
        <Route index element={<DashboardView />} />
        <Route path="leads" element={<LeadsView />} />
        <Route path="pipeline" element={<PipelineView />} />
        <Route path="blog" element={<BlogListView />} />
        <Route path="blog/new" element={<PostEditorView />} />
        <Route path="blog/bulk" element={<BulkUploadView />} />
        <Route path="blog/:id" element={<PostEditorView />} />
        <Route path="settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-gradient-to-b from-lav to-paper-2 flex items-center justify-center px-4 py-12">{children}</main>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-sm bg-card border border-rule rounded-3xl p-7 sm:p-8 shadow-xl shadow-ink/5">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="w-5 h-5 text-gold" />
        <span className="font-display font-extrabold text-ink">Himani Kankaria</span>
        <span className="ml-auto text-[0.7rem] font-display font-semibold uppercase tracking-wider text-accent bg-lav px-2 py-0.5 rounded-full">Admin</span>
      </div>
      <h1 className="font-display font-extrabold text-2xl text-ink mb-2">{title}</h1>
      {children}
    </div>
  );
}

const PIN_LENGTH = 6;

/** Sign in with the admin PIN, checked on the server by /api/pin-login. */
function LoginScreen() {
  const [useEmail, setUseEmail] = useState(false);
  if (useEmail) return <EmailLoginScreen onUsePin={() => setUseEmail(false)} />;
  return <PinLoginScreen onUseEmail={() => setUseEmail(true)} />;
}

function PinLoginScreen({ onUseEmail }: { onUseEmail: () => void }) {
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // The input is disabled while checking, which drops focus; take it back for the next try.
  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);

  const submit = async (value: string) => {
    if (busy || value.length !== PIN_LENGTH) return;
    setBusy(true);
    setErr('');
    try {
      const res = await fetch('/api/pin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: value }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.token) throw new Error(body?.error ?? `Sign-in failed (${res.status}).`);
      await signInWithCustomToken(auth(), body.token);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Sign-in failed.');
      setPin('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell>
      <Panel title="Enter your PIN">
        <p className="text-sm text-muted">Manage leads and blog posts.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(pin);
          }}
          className="mt-6"
        >
          <label htmlFor="admin-pin" className="sr-only">
            PIN
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="admin-pin"
              type="password"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={PIN_LENGTH}
              value={pin}
              disabled={busy}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH);
                setPin(v);
                setErr('');
                if (v.length === PIN_LENGTH) submit(v);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-text"
            />
            {/* One box per digit; the hidden input above takes the typing. */}
            <div className="grid grid-cols-6 gap-2 pointer-events-none" aria-hidden="true">
              {Array.from({ length: PIN_LENGTH }, (_, i) => (
                <span
                  key={i}
                  className={`h-14 rounded-xl border bg-paper flex items-center justify-center text-2xl text-ink transition-colors ${
                    err ? 'border-bad' : i === pin.length ? 'border-accent' : 'border-rule'
                  }`}
                >
                  {pin[i] ? '•' : ''}
                </span>
              ))}
            </div>
          </div>
          {err && (
            <p className="text-bad text-sm font-display mt-4" role="alert">
              {err}
            </p>
          )}
          <button type="submit" disabled={busy || pin.length !== PIN_LENGTH} className="btn solid w-full justify-center mt-6 disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <button onClick={onUseEmail} className="block w-full text-center text-sm text-muted hover:text-accent mt-5 font-display">
          Sign in with email instead
        </button>
        <Link to="/" className="block text-center text-sm text-muted hover:text-accent mt-3 font-display">
          ← Back to site
        </Link>
      </Panel>
    </Shell>
  );
}

function EmailLoginScreen({ onUsePin }: { onUsePin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    setInfo('');
    try {
      await signInWithEmailAndPassword(auth(), email.trim(), password);
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      setErr(code.includes('too-many-requests') ? 'Too many attempts. Wait a few minutes and try again.' : 'Wrong email or password.');
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setErr('');
    setInfo('');
    if (!email.trim()) return setErr('Enter your email above first.');
    try {
      await sendPasswordResetEmail(auth(), email.trim());
    } catch {
      // Same message either way so the form doesn't reveal which emails have accounts.
    }
    setInfo('If that email has an account, a reset link is on its way.');
  };

  return (
    <Shell>
      <Panel title="Sign in">
        <p className="text-sm text-muted">Manage leads and blog posts.</p>
        <form onSubmit={submit} className="space-y-4 mt-6">
          <label className="block">
            <span className="font-display text-sm font-semibold text-ink">Email</span>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-rule bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-ink">Password</span>
              <button type="button" onClick={reset} className="text-xs font-display font-semibold text-accent hover:underline">
                Forgot password?
              </button>
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-rule bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent"
            />
          </label>
          {err && <p className="text-bad text-sm font-display">{err}</p>}
          {info && <p className="text-good text-sm font-display">{info}</p>}
          <button type="submit" disabled={busy} className="btn solid w-full justify-center disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <button onClick={onUsePin} className="block w-full text-center text-sm text-muted hover:text-accent mt-6 font-display">
          Sign in with PIN instead
        </button>
        <Link to="/" className="block text-center text-sm text-muted hover:text-accent mt-3 font-display">
          ← Back to site
        </Link>
      </Panel>
    </Shell>
  );
}
