import { useState } from 'react';
import { GripVertical, StickyNote } from 'lucide-react';
import { LEAD_SOURCES, LEAD_STATUSES, type Lead, type LeadSource, type LeadStatus } from '../../../lib/leads';
import { useGetLeadsQuery, useUpdateLeadMutation } from '../../../store/leadsApi';
import { useAdmin } from '../AdminLayout';
import { errorMessage, sourceLabel, STATUS_META, timeAgo } from '../shared';

const COLUMN_HINT: Record<LeadStatus, string> = {
  new: 'Not replied to yet',
  contacted: 'Conversation started',
  won: 'Became a client',
  lost: 'Not going ahead',
};

export default function PipelineView() {
  const { data: leads = [], isLoading } = useGetLeadsQuery();
  const [updateLead] = useUpdateLeadMutation();
  const { openLead } = useAdmin();
  const [source, setSource] = useState<LeadSource | 'all'>('all');
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<LeadStatus | null>(null);
  const [error, setError] = useState('');

  const move = async (id: string, status: LeadStatus) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.status === status) return;
    setError('');
    try {
      await updateLead({ id, status }).unwrap();
    } catch (e) {
      setError(`Couldn't move ${lead.name}: ${errorMessage(e)}`);
    }
  };

  if (isLoading) return <p className="text-muted font-display">Loading pipeline…</p>;

  const shown = leads.filter((l) => source === 'all' || l.source === source);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <p className="text-sm text-muted font-display">
          Drag a card to another column to change its stage. On a phone, use the menu on each card.
        </p>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as LeadSource | 'all')}
          className="rounded-xl border border-rule bg-card px-3 py-2 text-ink font-display text-sm outline-none focus:border-accent"
          aria-label="Filter by form"
        >
          <option value="all">All forms</option>
          {Object.entries(LEAD_SOURCES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-bad text-sm font-display">{error}</p>}

      <div className="grid grid-flow-col auto-cols-[minmax(270px,1fr)] gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {LEAD_STATUSES.map((status) => {
          const items = shown.filter((l) => l.status === status);
          const isOver = overCol === status && dragId != null;
          return (
            <section
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (overCol !== status) setOverCol(status);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverCol(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain');
                setOverCol(null);
                setDragId(null);
                if (id) move(id, status);
              }}
              className={`flex flex-col min-h-[420px] rounded-2xl border transition-colors ${
                isOver ? 'border-accent bg-lav' : 'border-rule bg-paper'
              }`}
            >
              <header className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_META[status].dot}`} aria-hidden="true" />
                  <h2 className="font-display font-bold text-ink">{STATUS_META[status].label}</h2>
                  <span className="ml-auto text-xs font-display font-semibold text-muted bg-card border border-rule rounded-full px-2 py-0.5 tabular-nums">
                    {items.length}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1">{COLUMN_HINT[status]}</p>
              </header>

              <ul className="flex-1 px-3 pb-3 space-y-2.5">
                {items.map((l) => (
                  <PipelineCard
                    key={l.id}
                    lead={l}
                    dragging={dragId === l.id}
                    onDragStart={() => setDragId(l.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCol(null);
                    }}
                    onOpen={() => openLead(l.id)}
                    onMove={(s) => move(l.id, s)}
                  />
                ))}
                {!items.length && (
                  <li className="border-2 border-dashed border-rule rounded-xl py-8 text-center text-xs text-muted font-display">Drop leads here</li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function PipelineCard({
  lead: l,
  dragging,
  onDragStart,
  onDragEnd,
  onOpen,
  onMove,
}: {
  lead: Lead;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onOpen: () => void;
  onMove: (s: LeadStatus) => void;
}) {
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', l.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`group bg-card border border-rule rounded-xl p-3.5 shadow-xs hover:border-accent/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
        dragging ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-rule group-hover:text-muted mt-0.5 shrink-0 hidden sm:block" aria-hidden="true" />
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className="font-display font-semibold text-sm text-ink truncate hover:text-accent">{l.name}</p>
          <p className="text-xs text-muted truncate">{l.company || l.email}</p>
        </button>
      </div>
      <div className="flex items-center justify-between gap-2 mt-3">
        <span className="text-[11px] font-display font-semibold text-accent bg-lav px-2 py-0.5 rounded-full truncate">{sourceLabel(l)}</span>
        <span className="flex items-center gap-2 shrink-0">
          {l.notes && <StickyNote className="w-3.5 h-3.5 text-muted" aria-label="Has notes" />}
          <span className="text-[11px] text-muted font-display">{timeAgo(l.createdAt)}</span>
        </span>
      </div>
      <select
        value={l.status}
        onChange={(e) => onMove(e.target.value as LeadStatus)}
        onClick={(e) => e.stopPropagation()}
        className="sm:hidden mt-3 w-full rounded-lg border border-rule bg-paper px-2 py-1.5 text-xs font-display text-ink"
        aria-label={`Move ${l.name} to`}
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            Move to: {STATUS_META[s].label}
          </option>
        ))}
      </select>
    </li>
  );
}
