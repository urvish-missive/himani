import { LEAD_SOURCES, type Lead, type LeadStatus } from '../../lib/leads';

export const STATUS_META: Record<LeadStatus, { label: string; badge: string; dot: string }> = {
  new: { label: 'New', badge: 'bg-accent/10 text-accent border-accent/25', dot: 'bg-accent' },
  contacted: { label: 'Contacted', badge: 'bg-gold/20 text-ink border-gold/50', dot: 'bg-gold' },
  won: { label: 'Won', badge: 'bg-good/10 text-good border-good/30', dot: 'bg-good' },
  lost: { label: 'Lost', badge: 'bg-bad/10 text-bad border-bad/25', dot: 'bg-bad' },
};

export const DAY = 24 * 60 * 60 * 1000;

export function sourceLabel(lead: Lead) {
  return LEAD_SOURCES[lead.source] ?? lead.source;
}

export function formatDate(ms: number | null, withTime = true) {
  if (ms == null) return 'Just now';
  return new Date(ms).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function timeAgo(ms: number | null) {
  if (ms == null) return 'just now';
  const diff = Date.now() - ms;
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `${d}d ago`;
  return formatDate(ms, false);
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join('') || '?'
  );
}

export function errorMessage(e: unknown) {
  return (e as { message?: string })?.message ?? 'Unknown error';
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.new;
  return (
    <span className={`inline-flex items-center gap-1.5 shrink-0 font-display font-semibold text-xs px-2.5 py-1 rounded-full border ${meta.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-12 h-12 text-base' : 'w-10 h-10 text-sm';
  return (
    <span className={`${cls} shrink-0 rounded-full bg-lav-2 text-accent font-display font-bold flex items-center justify-center`}>
      {initials(name)}
    </span>
  );
}

export function Card({ title, action, children, className = '' }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-card border border-rule rounded-2xl ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 px-5 pt-5">
          <h2 className="font-display font-bold text-ink">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="py-12 px-6 text-center">
      <p className="font-display font-semibold text-ink">{title}</p>
      {body && <p className="text-muted text-sm mt-1.5 max-w-sm mx-auto">{body}</p>}
    </div>
  );
}

export function exportCsv(leads: Lead[], filename = 'leads') {
  const detailKeys = [...new Set(leads.flatMap((l) => Object.keys(l.details ?? {})))];
  const header = ['Received', 'Form', 'Status', 'Name', 'Email', 'Company', 'Message', 'Notes', ...detailKeys];
  const esc = (v: unknown) => {
    let s = String(v ?? '');
    if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheet formula injection
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = leads.map((l) =>
    [
      l.createdAt != null ? new Date(l.createdAt).toISOString() : '',
      sourceLabel(l),
      STATUS_META[l.status]?.label ?? l.status,
      l.name,
      l.email,
      l.company,
      l.message,
      l.notes,
      ...detailKeys.map((k) => l.details?.[k] ?? ''),
    ]
      .map(esc)
      .join(',')
  );
  const blob = new Blob(['﻿' + [header.map(esc).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
