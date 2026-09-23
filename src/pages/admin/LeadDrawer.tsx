import { useEffect, useState } from 'react';
import { Check, Copy, Mail, Trash2, X } from 'lucide-react';
import { LEAD_STATUSES, type Lead } from '../../lib/leads';
import { useDeleteLeadsMutation, useUpdateLeadMutation } from '../../store/leadsApi';
import { Avatar, errorMessage, formatDate, sourceLabel, STATUS_META, timeAgo } from './shared';
import { useConfirm, useScrollLock, useToast } from '../../components/ui/Feedback';

export default function LeadDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [updateLead, { isLoading: updating }] = useUpdateLeadMutation();
  const [deleteLeads, { isLoading: deleting }] = useDeleteLeadsMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const [notes, setNotes] = useState(lead.notes);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Reset the editor when a different lead opens.
  useEffect(() => {
    setNotes(lead.notes);
    setSavedAt(null);
    setError('');
  }, [lead.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useScrollLock();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const notesDirty = notes !== lead.notes;

  const run = async (fn: () => Promise<unknown>, what: string) => {
    setError('');
    try {
      await fn();
      return true;
    } catch (e) {
      setError(`Couldn't ${what}: ${errorMessage(e)}`);
      return false;
    }
  };

  const saveNotes = async () => {
    if (await run(() => updateLead({ id: lead.id, notes }).unwrap(), 'save notes')) setSavedAt(Date.now());
  };

  const remove = async () => {
    const ok = await confirm({
      title: `Delete the lead from ${lead.name}?`,
      message: "Their details, message and your notes will be removed. This can't be undone.",
      confirmLabel: 'Delete lead',
      tone: 'danger',
    });
    if (!ok) return;
    onClose();
    try {
      await deleteLeads([lead.id]).unwrap();
      toast.success(`Deleted the lead from ${lead.name}.`);
    } catch (e) {
      toast.error(`Couldn't delete the lead: ${errorMessage(e)}`);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(lead.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the email is still selectable.
    }
  };

  const rows: [string, string][] = (
    [
      ['Company', lead.company],
      ['Form', sourceLabel(lead)],
      ['Page', lead.page],
      ...Object.entries(lead.details ?? {}),
    ] as [string, string][]
  ).filter(([, v]) => Boolean(v));

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label={`Lead: ${lead.name}`}>
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <aside className="relative w-full max-w-lg h-full bg-card border-l border-rule flex flex-col shadow-2xl">
        <header className="px-6 py-5 border-b border-rule flex items-start gap-4">
          <Avatar name={lead.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="font-display font-extrabold text-xl text-ink truncate">{lead.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <a href={`mailto:${lead.email}`} className="text-sm text-accent hover:underline truncate">
                {lead.email}
              </a>
              <button onClick={copyEmail} className="p-1 rounded text-muted hover:text-ink" aria-label="Copy email" title="Copy email">
                {copied ? <Check className="w-3.5 h-3.5 text-good" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-muted mt-1">
              {sourceLabel(lead)} · received {timeAgo(lead.createdAt)}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 rounded-full hover:bg-lav text-muted hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          <section>
            <h3 className="font-display text-xs uppercase tracking-wider text-muted font-semibold mb-2.5">Stage</h3>
            <div className="grid grid-cols-4 gap-2">
              {LEAD_STATUSES.map((s) => {
                const active = lead.status === s;
                return (
                  <button
                    key={s}
                    disabled={updating}
                    onClick={() => !active && run(() => updateLead({ id: lead.id, status: s }).unwrap(), 'update stage')}
                    aria-pressed={active}
                    className={`font-display font-semibold text-sm py-2 rounded-xl border transition-colors disabled:opacity-60 ${
                      active ? STATUS_META[s].badge : 'border-rule text-muted hover:border-accent hover:text-accent'
                    }`}
                  >
                    {STATUS_META[s].label}
                  </button>
                );
              })}
            </div>
          </section>

          {lead.message && (
            <section>
              <h3 className="font-display text-xs uppercase tracking-wider text-muted font-semibold mb-2.5">Their message</h3>
              <p className="text-ink whitespace-pre-wrap bg-paper-2 border border-rule rounded-xl p-4 text-sm leading-relaxed">{lead.message}</p>
            </section>
          )}

          <section>
            <h3 className="font-display text-xs uppercase tracking-wider text-muted font-semibold mb-2.5">Details</h3>
            <dl className="divide-y divide-rule border border-rule rounded-xl">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-3 text-sm">
                  <dt className="font-display text-muted">{k}</dt>
                  <dd className="text-ink break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-display text-xs uppercase tracking-wider text-muted font-semibold">Private notes</h3>
              {savedAt && !notesDirty && <span className="text-xs text-good font-display">Saved</span>}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={5000}
              rows={5}
              placeholder="Call notes, next steps, budget… Only admins see this."
              className="w-full rounded-xl border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-accent resize-y"
            />
            <div className="flex justify-end gap-2 mt-2">
              {notesDirty && (
                <button onClick={() => setNotes(lead.notes)} className="px-3.5 py-2 rounded-xl text-sm font-display font-semibold text-muted hover:bg-lav">
                  Discard
                </button>
              )}
              <button
                onClick={saveNotes}
                disabled={!notesDirty || updating}
                className="px-4 py-2 rounded-xl bg-ink text-paper text-sm font-display font-semibold disabled:opacity-40"
              >
                {updating && notesDirty ? 'Saving…' : 'Save notes'}
              </button>
            </div>
          </section>

          <section>
            <h3 className="font-display text-xs uppercase tracking-wider text-muted font-semibold mb-2.5">Activity</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
                <span className="text-ink">
                  Submitted the {sourceLabel(lead)} form <span className="text-muted">· {formatDate(lead.createdAt)}</span>
                </span>
              </li>
              {lead.updatedAt && (
                <li className="flex gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                  <span className="text-ink">
                    Last updated <span className="text-muted">· {formatDate(lead.updatedAt)}</span>
                  </span>
                </li>
              )}
            </ol>
          </section>

          {error && <p className="text-bad text-sm font-display">{error}</p>}
        </div>

        <footer className="px-6 py-4 border-t border-rule flex gap-3">
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: your ${sourceLabel(lead)} enquiry`)}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-white px-4 py-2.5 font-display font-semibold text-sm hover:bg-accent-hover"
          >
            <Mail className="w-4 h-4" /> Reply by email
          </a>
          <button
            onClick={remove}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl border border-bad/40 text-bad px-4 py-2.5 font-display font-semibold text-sm hover:bg-bad/10 disabled:opacity-60"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </footer>
      </aside>
    </div>
  );
}
