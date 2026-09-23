import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Search, Trash2, X } from 'lucide-react';
import { LEAD_SOURCES, LEAD_STATUSES, type Lead, type LeadSource, type LeadStatus } from '../../../lib/leads';
import { useBulkUpdateStatusMutation, useDeleteLeadsMutation, useGetLeadsQuery } from '../../../store/leadsApi';
import { useAdmin } from '../AdminLayout';
import { useConfirm, useToast } from '../../../components/ui/Feedback';
import { Avatar, DAY, EmptyState, errorMessage, exportCsv, formatDate, sourceLabel, STATUS_META, StatusBadge, timeAgo } from '../shared';

const PAGE_SIZE = 25;
const RANGES = { all: 'All time', '7': 'Last 7 days', '30': 'Last 30 days', '90': 'Last 90 days' } as const;
type Range = keyof typeof RANGES;
type Sort = 'newest' | 'oldest' | 'name';

const selectCls =
  'rounded-xl border border-rule bg-card px-3 py-2.5 text-ink font-display text-sm outline-none focus:border-accent';

export default function LeadsView() {
  const { data: leads = [], isLoading, error } = useGetLeadsQuery();
  const { openLead } = useAdmin();
  const [params, setParams] = useSearchParams();
  const [bulkUpdate, { isLoading: bulkUpdating }] = useBulkUpdateStatusMutation();
  const [deleteLeads, { isLoading: deleting }] = useDeleteLeadsMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  // Filters live in the URL so they survive refresh and can be linked from the dashboard.
  const q = params.get('q') ?? '';
  const source = (params.get('source') ?? 'all') as LeadSource | 'all';
  const status = (params.get('status') ?? 'all') as LeadStatus | 'all';
  const range = (params.get('range') ?? 'all') as Range;
  const sort = (params.get('sort') ?? 'newest') as Sort;

  const setParam = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === fallback) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const since = range === 'all' ? 0 : Date.now() - Number(range) * DAY;
    const out = leads.filter(
      (l) =>
        (source === 'all' || l.source === source) &&
        (status === 'all' || l.status === status) &&
        (l.createdAt ?? Date.now()) >= since &&
        (!s || [l.name, l.email, l.company, l.message, l.notes].some((v) => v?.toLowerCase().includes(s)))
    );
    if (sort === 'oldest') out.sort((a, b) => (a.createdAt ?? Infinity) - (b.createdAt ?? Infinity));
    else if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name));
    return out; // API already returns newest first
  }, [leads, q, source, status, range, sort]);

  // Reset paging and selection whenever the filters change.
  useEffect(() => {
    setPage(0);
    setSelected(new Set());
  }, [q, source, status, range, sort]);

  // Drop selections for leads that were deleted elsewhere.
  useEffect(() => {
    setSelected((prev) => {
      const ids = new Set(leads.map((l) => l.id));
      const next = new Set([...prev].filter((id) => ids.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [leads]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const allVisibleSelected = visible.length > 0 && visible.every((l) => selected.has(l.id));
  const hasFilters = q || source !== 'all' || status !== 'all' || range !== 'all';

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAllVisible = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      visible.forEach((l) => (allVisibleSelected ? next.delete(l.id) : next.add(l.id)));
      return next;
    });

  const selectedLeads = leads.filter((l) => selected.has(l.id));

  const applyBulkStatus = async (s: LeadStatus) => {
    const count = selected.size;
    try {
      await bulkUpdate({ ids: [...selected], status: s }).unwrap();
      setSelected(new Set());
      toast.success(`Moved ${count} lead${count === 1 ? '' : 's'} to ${STATUS_META[s].label}.`);
    } catch (e) {
      toast.error(`Couldn't update the leads: ${errorMessage(e)}`);
    }
  };

  const applyBulkDelete = async () => {
    const count = selected.size;
    const ok = await confirm({
      title: `Delete ${count} lead${count === 1 ? '' : 's'}?`,
      message: "Their details, messages and your notes will be removed. This can't be undone.",
      confirmLabel: count === 1 ? 'Delete lead' : `Delete ${count} leads`,
      tone: 'danger',
    });
    if (!ok) return;
    try {
      await deleteLeads([...selected]).unwrap();
      setSelected(new Set());
      toast.success(`Deleted ${count} lead${count === 1 ? '' : 's'}.`);
    } catch (e) {
      toast.error(`Couldn't delete the leads: ${errorMessage(e)}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {(['all', ...LEAD_STATUSES] as const).map((s) => {
          const count = s === 'all' ? leads.length : leads.filter((l) => l.status === s).length;
          const active = status === s;
          return (
            <button
              key={s}
              onClick={() => setParam('status', s, 'all')}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full border font-display font-semibold text-sm transition-colors ${
                active ? 'bg-ink text-paper border-ink' : 'bg-card border-rule text-muted hover:text-ink hover:border-ink/30'
              }`}
            >
              {s !== 'all' && <span className={`w-2 h-2 rounded-full ${STATUS_META[s].dot}`} aria-hidden="true" />}
              {s === 'all' ? 'All' : STATUS_META[s].label}
              <span className={`text-xs tabular-nums ${active ? 'text-paper/70' : 'text-muted'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col xl:flex-row gap-3 xl:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setParam('q', e.target.value, '')}
            placeholder="Search name, email, company, message or notes"
            className="w-full rounded-xl border border-rule bg-card pl-10 pr-3.5 py-2.5 text-ink outline-none focus:border-accent"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-3">
          <select value={source} onChange={(e) => setParam('source', e.target.value, 'all')} className={selectCls} aria-label="Form">
            <option value="all">All forms</option>
            {Object.entries(LEAD_SOURCES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <select value={range} onChange={(e) => setParam('range', e.target.value, 'all')} className={selectCls} aria-label="Date range">
            {Object.entries(RANGES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <label className="relative">
            <ArrowUpDown className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select value={sort} onChange={(e) => setParam('sort', e.target.value, 'newest')} className={`${selectCls} pl-9 w-full`} aria-label="Sort">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
          <button
            onClick={() => exportCsv(filtered)}
            disabled={!filtered.length}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink text-paper px-4 py-2.5 font-display font-semibold text-sm disabled:opacity-40"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 text-sm font-display text-muted">
          <span>
            {filtered.length} of {leads.length} leads match
          </span>
          <button onClick={() => setParams(new URLSearchParams(), { replace: true })} className="inline-flex items-center gap-1 text-accent font-semibold hover:underline">
            <X className="w-3.5 h-3.5" /> Clear filters
          </button>
        </div>
      )}

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="sticky top-20 z-20 flex flex-wrap items-center gap-2 sm:gap-3 bg-ink text-paper rounded-2xl px-4 py-3 shadow-xl shadow-ink/20">
          <span className="font-display font-semibold text-sm mr-auto">{selected.size} selected</span>
          <span className="text-xs text-paper/70 font-display hidden sm:inline">Move to</span>
          {LEAD_STATUSES.map((s) => (
            <button
              key={s}
              disabled={bulkUpdating}
              onClick={() => applyBulkStatus(s)}
              className="px-3 py-1.5 rounded-full bg-paper/10 hover:bg-paper/20 text-sm font-display font-semibold disabled:opacity-50"
            >
              {STATUS_META[s].label}
            </button>
          ))}
          <button
            onClick={() => exportCsv(selectedLeads, 'leads-selected')}
            className="p-2 rounded-full hover:bg-paper/20"
            aria-label="Export selected"
            title="Export selected"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={applyBulkDelete}
            disabled={deleting}
            className="p-2 rounded-full hover:bg-bad/80 disabled:opacity-50"
            aria-label="Delete selected"
            title="Delete selected"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => setSelected(new Set())} className="p-2 rounded-full hover:bg-paper/20" aria-label="Clear selection" title="Clear selection">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-card border border-rule rounded-2xl overflow-hidden">
        {error ? (
          <EmptyState title="Couldn't load leads" body={errorMessage(error)} />
        ) : isLoading ? (
          <EmptyState title="Loading leads…" />
        ) : !filtered.length ? (
          <EmptyState
            title={leads.length ? 'No leads match these filters' : 'No leads yet'}
            body={leads.length ? 'Try clearing a filter or searching for something else.' : 'They appear here as soon as someone submits a form on the site.'}
          />
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden lg:table w-full text-sm">
              <thead>
                <tr className="text-left font-display text-xs uppercase tracking-wider text-muted border-b border-rule bg-paper-2">
                  <th className="pl-5 pr-2 py-3 w-10">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} aria-label="Select all on this page" className="accent-accent w-4 h-4" />
                  </th>
                  <th className="px-3 py-3 font-semibold">Lead</th>
                  <th className="px-3 py-3 font-semibold">Company</th>
                  <th className="px-3 py-3 font-semibold">Form</th>
                  <th className="px-3 py-3 font-semibold">Stage</th>
                  <th className="px-5 py-3 font-semibold text-right">Received</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((l) => (
                  <Row key={l.id} lead={l} selected={selected.has(l.id)} onToggle={() => toggle(l.id)} onOpen={() => openLead(l.id)} />
                ))}
              </tbody>
            </table>

            {/* Mobile list */}
            <ul className="lg:hidden divide-y divide-rule">
              {visible.map((l) => (
                <li key={l.id} className={`flex items-start gap-3 p-4 ${selected.has(l.id) ? 'bg-lav/60' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selected.has(l.id)}
                    onChange={() => toggle(l.id)}
                    aria-label={`Select ${l.name}`}
                    className="accent-accent w-4 h-4 mt-1"
                  />
                  <button onClick={() => openLead(l.id)} className="min-w-0 flex-1 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-ink truncate">{l.name}</div>
                        <div className="text-muted text-xs truncate">{l.company || l.email}</div>
                      </div>
                      <StatusBadge status={l.status} />
                    </div>
                    <div className="flex justify-between gap-3 mt-2 text-xs text-muted font-display">
                      <span>{sourceLabel(l)}</span>
                      <span>{timeAgo(l.createdAt)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-rule text-sm font-display text-muted">
              <span>
                {safePage * PAGE_SIZE + 1}–{Math.min(filtered.length, (safePage + 1) * PAGE_SIZE)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage === 0}
                  className="p-2 rounded-lg hover:bg-lav disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 tabular-nums">
                  {safePage + 1} / {pages}
                </span>
                <button
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage >= pages - 1}
                  className="p-2 rounded-lg hover:bg-lav disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ lead: l, selected, onToggle, onOpen }: { lead: Lead; selected: boolean; onToggle: () => void; onOpen: () => void }) {
  return (
    <tr onClick={onOpen} className={`border-b border-rule last:border-0 cursor-pointer transition-colors ${selected ? 'bg-lav/60' : 'hover:bg-paper-2'}`}>
      <td className="pl-5 pr-2 py-3.5" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Select ${l.name}`} className="accent-accent w-4 h-4" />
      </td>
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={l.name} size="sm" />
          <div className="min-w-0">
            <div className="font-display font-semibold text-ink truncate max-w-[220px]">{l.name}</div>
            <div className="text-muted text-xs truncate max-w-[220px]">{l.email}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3.5 text-ink truncate max-w-[180px]">{l.company || <span className="text-muted">—</span>}</td>
      <td className="px-3 py-3.5 text-ink font-display">{sourceLabel(l)}</td>
      <td className="px-3 py-3.5">
        <StatusBadge status={l.status} />
      </td>
      <td className="px-5 py-3.5 text-right whitespace-nowrap" title={formatDate(l.createdAt)}>
        <div className="text-ink">{timeAgo(l.createdAt)}</div>
        <div className="text-xs text-muted">{formatDate(l.createdAt, false)}</div>
      </td>
    </tr>
  );
}
