import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { signOut, type User } from 'firebase/auth';
import {
  Bell,
  ChevronDown,
  Crown,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Search,
  Settings,
  SquareKanban,
  Users,
  X,
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { useGetLeadsQuery } from '../../store/leadsApi';
import LeadDrawer from './LeadDrawer';
import { Avatar } from './shared';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, subtitle: 'How your forms are performing' },
  { to: '/admin/leads', label: 'Leads', icon: Users, end: false, subtitle: 'Every enquiry from the website' },
  { to: '/admin/pipeline', label: 'Pipeline', icon: SquareKanban, end: false, subtitle: 'Drag leads between stages' },
  { to: '/admin/blog', label: 'Blog', icon: Newspaper, end: false, subtitle: 'Write and publish posts' },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false, subtitle: 'Your account and data' },
];

export interface AdminContext {
  user: User;
  openLead: (id: string) => void;
}

export function useAdmin() {
  return useOutletContext<AdminContext>();
}

export default function AdminLayout({ user }: { user: User }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { data: leads = [] } = useGetLeadsQuery();
  const newCount = leads.filter((l) => l.status === 'new').length;

  const current = [...NAV].reverse().find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))) ?? NAV[0];

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const openLeadId = searchParams.get('lead');
  const openLead = leads.find((l) => l.id === openLeadId) ?? null;

  const setOpenLead = (id: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (id) next.set('lead', id);
    else next.delete('lead');
    setSearchParams(next, { replace: !id });
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'Admin';

  return (
    <div className="min-h-screen bg-paper-2 text-ink">
      {/* Mobile overlay */}
      {menuOpen && <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden" onClick={() => setMenuOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-rule flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-rule">
          <Link to="/admin" className="flex items-center gap-2 min-w-0">
            <Crown className="w-5 h-5 text-gold shrink-0" />
            <span className="font-display font-extrabold text-ink truncate">Himani Kankaria</span>
          </Link>
          <button onClick={() => setMenuOpen(false)} className="lg:hidden p-1.5 rounded-lg text-muted hover:bg-lav" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <p className="px-3 pt-2 pb-2 font-display text-[0.7rem] font-semibold uppercase tracking-wider text-muted">Workspace</p>
          <ul className="space-y-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-semibold text-[0.95rem] transition-colors ${
                      isActive ? 'bg-accent text-white shadow-sm shadow-accent/20' : 'text-muted hover:bg-lav hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      <span className="flex-1">{label}</span>
                      {label === 'Leads' && newCount > 0 && (
                        <span
                          className={`min-w-6 h-6 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${
                            isActive ? 'bg-white text-accent' : 'bg-gold text-gold-ink'
                          }`}
                        >
                          {newCount > 99 ? '99+' : newCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <p className="px-3 pt-6 pb-2 font-display text-[0.7rem] font-semibold uppercase tracking-wider text-muted">Website</p>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-semibold text-[0.95rem] text-muted hover:bg-lav hover:text-ink transition-colors"
          >
            <ExternalLink className="w-[18px] h-[18px]" />
            View live site
          </a>
        </nav>

        <div className="p-3 border-t border-rule">
          <div className="flex items-center gap-3 p-2">
            <Avatar name={displayName} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-sm text-ink truncate">{displayName}</p>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>
            <button
              onClick={() => signOut(auth())}
              className="p-2 rounded-lg text-muted hover:bg-lav hover:text-bad transition-colors"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64 min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-card/90 backdrop-blur-md border-b border-rule">
          <div className="h-full px-4 sm:px-6 flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-ink hover:bg-lav"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0 mr-auto">
              <h1 className="font-display font-extrabold text-lg sm:text-xl text-ink leading-tight truncate">{current.label}</h1>
              <p className="hidden sm:block text-xs text-muted truncate">{current.subtitle}</p>
            </div>

            <HeaderSearch />

            <Link
              to="/admin/leads?status=new"
              className="relative p-2.5 rounded-xl text-muted hover:bg-lav hover:text-ink transition-colors"
              aria-label={`${newCount} new leads`}
              title={`${newCount} new leads`}
            >
              <Bell className="w-5 h-5" />
              {newCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-bad text-white text-[10px] font-bold flex items-center justify-center">
                  {newCount > 9 ? '9+' : newCount}
                </span>
              )}
            </Link>

            <UserMenu name={displayName} email={user.email ?? ''} />
          </div>
        </header>

        <main className="px-4 sm:px-6 py-6 max-w-[1400px] mx-auto">
          <Outlet context={{ user, openLead: (id: string) => setOpenLead(id) } satisfies AdminContext} />
        </main>
      </div>

      {openLead && <LeadDrawer lead={openLead} onClose={() => setOpenLead(null)} />}
    </div>
  );
}

function HeaderSearch() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const [q, setQ] = useState(location.pathname === '/admin/leads' ? params.get('q') ?? '' : '');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/admin/leads${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  return (
    <form onSubmit={submit} className="hidden md:block relative w-64 xl:w-80">
      <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search leads…"
        className="w-full rounded-xl border border-rule bg-paper-2 pl-9 pr-3 py-2 text-sm text-ink outline-none focus:border-accent focus:bg-card"
      />
    </form>
  );
}

function UserMenu({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-lav transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={name} size="sm" />
        <ChevronDown className="hidden sm:block w-4 h-4 text-muted" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-60 bg-card border border-rule rounded-2xl shadow-xl shadow-ink/10 p-2">
          <div className="px-3 py-2.5 border-b border-rule mb-1">
            <p className="font-display font-semibold text-sm text-ink truncate">{name}</p>
            <p className="text-xs text-muted truncate">{email}</p>
          </div>
          <Link
            to="/admin/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-display text-ink hover:bg-lav"
          >
            <Settings className="w-4 h-4 text-muted" /> Settings
          </Link>
          <button
            onClick={() => signOut(auth())}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-display text-bad hover:bg-bad/10"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
