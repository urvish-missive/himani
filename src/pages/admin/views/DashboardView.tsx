import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Inbox, TrendingDown, TrendingUp, Trophy, Users } from 'lucide-react';
import { LEAD_SOURCES, LEAD_STATUSES, type Lead, type LeadSource } from '../../../lib/leads';
import { useGetLeadsQuery } from '../../../store/leadsApi';
import { useAdmin } from '../AdminLayout';
import { Avatar, Card, DAY, EmptyState, sourceLabel, STATUS_META, StatusBadge, timeAgo } from '../shared';

const startOfDay = (ms: number) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export default function DashboardView() {
  const { data: leads = [], isLoading } = useGetLeadsQuery();
  const { openLead } = useAdmin();

  const stats = useMemo(() => {
    const now = Date.now();
    const at = (l: Lead) => l.createdAt ?? now;
    const thisWeek = leads.filter((l) => at(l) >= now - 7 * DAY).length;
    const lastWeek = leads.filter((l) => at(l) >= now - 14 * DAY && at(l) < now - 7 * DAY).length;
    const won = leads.filter((l) => l.status === 'won').length;
    const lost = leads.filter((l) => l.status === 'lost').length;
    return {
      total: leads.length,
      fresh: leads.filter((l) => l.status === 'new').length,
      thisWeek,
      delta: thisWeek - lastWeek,
      winRate: won + lost ? Math.round((won / (won + lost)) * 100) : null,
      won,
    };
  }, [leads]);

  const followUps = useMemo(
    () =>
      leads
        .filter((l) => l.status === 'new' && (l.createdAt ?? Date.now()) < Date.now() - 2 * DAY)
        .sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
        .slice(0, 5),
    [leads]
  );

  if (isLoading) return <p className="text-muted font-display">Loading dashboard…</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile icon={Users} label="Total leads" value={stats.total} hint="All time" />
        <StatTile icon={Inbox} label="Awaiting reply" value={stats.fresh} hint="Still marked new" to="/admin/leads?status=new" />
        <StatTile
          icon={stats.delta >= 0 ? TrendingUp : TrendingDown}
          label="Last 7 days"
          value={stats.thisWeek}
          hint={stats.delta === 0 ? 'Same as the week before' : `${stats.delta > 0 ? '+' : ''}${stats.delta} vs the week before`}
          hintTone={stats.delta > 0 ? 'good' : stats.delta < 0 ? 'bad' : 'muted'}
        />
        <StatTile
          icon={Trophy}
          label="Win rate"
          value={stats.winRate == null ? '—' : `${stats.winRate}%`}
          hint={stats.winRate == null ? 'Mark leads won or lost to see this' : `${stats.won} won`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Leads per day" action={<span className="text-xs text-muted font-display">Last 30 days</span>} className="xl:col-span-2">
          <DailyChart leads={leads} />
        </Card>
        <Card title="By form">
          <BySource leads={leads} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Pipeline" action={<ViewAll to="/admin/pipeline" />}>
          <PipelineSummary leads={leads} />
        </Card>

        <Card title="Needs a follow-up" action={<span className="text-xs text-muted font-display">New for 2+ days</span>}>
          {followUps.length ? (
            <ul className="-my-2 divide-y divide-rule">
              {followUps.map((l) => (
                <li key={l.id}>
                  <button onClick={() => openLead(l.id)} className="w-full flex items-center gap-3 py-2.5 text-left group">
                    <Clock className="w-4 h-4 text-bad shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-semibold text-sm text-ink truncate group-hover:text-accent">{l.name}</span>
                      <span className="block text-xs text-muted truncate">{sourceLabel(l)}</span>
                    </span>
                    <span className="text-xs text-bad font-display shrink-0">{timeAgo(l.createdAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="You're all caught up" body="No new leads have been waiting more than two days." />
          )}
        </Card>

        <Card title="Recent leads" action={<ViewAll to="/admin/leads" />}>
          {leads.length ? (
            <ul className="-my-2 divide-y divide-rule">
              {leads.slice(0, 5).map((l) => (
                <li key={l.id}>
                  <button onClick={() => openLead(l.id)} className="w-full flex items-center gap-3 py-2.5 text-left group">
                    <Avatar name={l.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-semibold text-sm text-ink truncate group-hover:text-accent">{l.name}</span>
                      <span className="block text-xs text-muted truncate">
                        {sourceLabel(l)} · {timeAgo(l.createdAt)}
                      </span>
                    </span>
                    <StatusBadge status={l.status} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No leads yet" body="They'll appear here as soon as someone submits a form on the site." />
          )}
        </Card>
      </div>
    </div>
  );
}

function ViewAll({ to }: { to: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-xs font-display font-semibold text-accent hover:underline">
      View all <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  hintTone = 'muted',
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  hint: string;
  hintTone?: 'good' | 'bad' | 'muted';
  to?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-sm font-semibold text-muted">{label}</span>
        <span className="w-9 h-9 rounded-xl bg-lav text-accent flex items-center justify-center">
          <Icon className="w-[18px] h-[18px]" />
        </span>
      </div>
      <div className="font-display font-extrabold text-3xl sm:text-4xl text-ink leading-none mt-3">{value}</div>
      <div className={`text-xs font-display mt-2 ${hintTone === 'good' ? 'text-good' : hintTone === 'bad' ? 'text-bad' : 'text-muted'}`}>{hint}</div>
    </>
  );
  const cls = 'block bg-card border border-rule rounded-2xl p-4 sm:p-5';
  return to ? (
    <Link to={to} className={`${cls} hover:border-accent transition-colors`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

function DailyChart({ leads }: { leads: Lead[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const days = useMemo(() => {
    const today = startOfDay(Date.now());
    const buckets = Array.from({ length: 30 }, (_, i) => ({ day: today - (29 - i) * DAY, count: 0 }));
    for (const l of leads) {
      const idx = 29 - Math.round((today - startOfDay(l.createdAt ?? Date.now())) / DAY);
      if (idx >= 0 && idx < 30) buckets[idx].count++;
    }
    return buckets;
  }, [leads]);

  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((s, d) => s + d.count, 0);
  const label = (ms: number) => new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

  if (!total) return <EmptyState title="No leads in the last 30 days" />;

  return (
    <figure>
      <div className="relative h-48 flex items-end gap-[2px] border-b border-rule" onMouseLeave={() => setHover(null)}>
        {/* Top gridline with the scale's max */}
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-rule" aria-hidden="true" />
        <span className="absolute -top-2.5 right-0 bg-card pl-1 text-[10px] text-muted font-display">{max}</span>

        {days.map((d, i) => (
          <div
            key={d.day}
            className="relative flex-1 h-full flex items-end cursor-default"
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            tabIndex={0}
            aria-label={`${label(d.day)}: ${d.count} lead${d.count === 1 ? '' : 's'}`}
          >
            <div
              className={`w-full rounded-t-[4px] transition-colors ${d.count ? (hover === i ? 'bg-accent-hover' : 'bg-accent') : 'bg-transparent'}`}
              style={{ height: d.count ? `${Math.max(4, (d.count / max) * 100)}%` : 0 }}
            />
            {hover === i && (
              <div
                className={`absolute bottom-full mb-2 z-10 whitespace-nowrap bg-ink text-paper rounded-lg px-2.5 py-1.5 text-xs font-display shadow-lg pointer-events-none ${
                  i < 4 ? 'left-0' : i > 25 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                }`}
              >
                <span className="font-semibold">{d.count}</span> lead{d.count === 1 ? '' : 's'} · {label(d.day)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[11px] text-muted font-display">
        <span>{label(days[0].day)}</span>
        <span>{label(days[15].day)}</span>
        <span>Today</span>
      </div>
      <figcaption className="sr-only">
        {total} leads in the last 30 days. Busiest day: {max} leads.
      </figcaption>
    </figure>
  );
}

function BySource({ leads }: { leads: Lead[] }) {
  const rows = (Object.keys(LEAD_SOURCES) as LeadSource[])
    .map((s) => ({ source: s, count: leads.filter((l) => l.source === s).length }))
    .sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <ul className="space-y-4">
      {rows.map((r) => (
        <li key={r.source}>
          <Link to={`/admin/leads?source=${r.source}`} className="block group">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-display font-semibold text-ink group-hover:text-accent">{LEAD_SOURCES[r.source]}</span>
              <span className="font-display text-muted tabular-nums">{r.count}</span>
            </div>
            <div className="h-2 rounded-full bg-lav overflow-hidden">
              <div className="h-full rounded-full bg-accent" style={{ width: `${(r.count / max) * 100}%` }} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PipelineSummary({ leads }: { leads: Lead[] }) {
  const total = Math.max(1, leads.length);
  return (
    <ul className="space-y-3">
      {LEAD_STATUSES.map((s) => {
        const count = leads.filter((l) => l.status === s).length;
        return (
          <li key={s}>
            <Link to={`/admin/leads?status=${s}`} className="flex items-center gap-3 group">
              <span className={`w-2.5 h-2.5 rounded-full ${STATUS_META[s].dot}`} aria-hidden="true" />
              <span className="font-display font-semibold text-sm text-ink flex-1 group-hover:text-accent">{STATUS_META[s].label}</span>
              <span className="font-display text-sm text-muted tabular-nums">{count}</span>
              <span className="w-12 text-right font-display text-xs text-muted tabular-nums">{Math.round((count / total) * 100)}%</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
