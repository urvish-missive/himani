import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Copy,
  Eye,
  FileText,
  FileUp,
  LoaderCircle,
  Pencil,
  RotateCcw,
  Send,
  Sparkles,
  TriangleAlert,
  X,
} from 'lucide-react';
import { IMPORT_ACCEPT, bulkUpload, hasErrors, isProcessing, useBulkUpload, type BulkItem, type Fields, type Intent, type Issue } from '../../../lib/bulkUpload';
import { POST_LIMITS, SEO_HINTS, fromLocalInput, isLive, parseTags, slugify, toLocalInput } from '../../../lib/blog';
import PostArticle from '../../../components/blog/PostArticle';
import { useScrollLock, useToast } from '../../../components/ui/Feedback';

const inputCls = 'w-full rounded-xl border border-rule bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent text-sm';
const labelCls = 'block font-display text-sm font-semibold text-ink mb-1.5';

const INTENTS: { id: Intent; label: string; body: string }[] = [
  { id: 'review', label: 'Review first', body: 'Preview each post, then save it as a draft, publish or schedule it.' },
  { id: 'draft', label: 'Save as drafts', body: 'Every post is saved as a draft to finish in the editor.' },
  { id: 'publish', label: 'Publish when valid', body: 'Posts with no problems go live. The rest are saved as drafts.' },
  { id: 'schedule', label: 'Schedule', body: 'Posts with no problems go live at the time you pick.' },
];

const STAGE: Record<BulkItem['stage'], { label: string; cls: string }> = {
  queued: { label: 'Waiting', cls: 'bg-paper-2 text-muted border-rule' },
  reading: { label: 'Reading document', cls: 'bg-accent/10 text-accent border-accent/25' },
  images: { label: 'Uploading images', cls: 'bg-accent/10 text-accent border-accent/25' },
  checking: { label: 'Checking', cls: 'bg-accent/10 text-accent border-accent/25' },
  ready: { label: 'Ready to review', cls: 'bg-gold/20 text-ink border-gold/50' },
  saving: { label: 'Saving', cls: 'bg-accent/10 text-accent border-accent/25' },
  done: { label: 'Saved', cls: 'bg-good/10 text-good border-good/30' },
  duplicate: { label: 'Already imported', cls: 'bg-paper-2 text-muted border-rule' },
  error: { label: 'Failed', cls: 'bg-bad/10 text-bad border-bad/25' },
};

const sizeLabel = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const when = (ms: number) => new Date(ms).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function BulkUploadView() {
  const { items, settings } = useBulkUpload();
  const toast = useToast();
  const [dragging, setDragging] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (files: FileList | File[]) => {
    if (settings.intent === 'schedule' && !settings.scheduleAt) {
      toast.error('Pick when the first post should go live, or choose another option.');
      return;
    }
    const skipped = bulkUpload.addFiles(files);
    if (skipped.length) toast.error(skipped.join(' '), { title: `${skipped.length} file${skipped.length > 1 ? 's' : ''} skipped` });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) add(e.dataTransfer.files);
  };

  const counts = useMemo(
    () => ({
      processing: items.filter(isProcessing).length,
      ready: items.filter((i) => i.stage === 'ready').length,
      readyValid: items.filter((i) => i.stage === 'ready' && !hasErrors(i)).length,
      saved: items.filter((i) => i.stage === 'done').length,
      failed: items.filter((i) => i.stage === 'error').length,
      flagged: items.filter((i) => i.fields && i.issues.length).length,
      missingSeo: items.filter((i) => i.stage === 'ready' && i.issues.some((x) => x.level === 'warning' && ['excerpt', 'seoTitle', 'seoDescription', 'tags', 'keywords'].includes(x.field ?? ''))).length,
    }),
    [items]
  );

  const preview = items.find((i) => i.id === previewId && i.fields);

  return (
    <div className="space-y-5">
      <Link to="/admin/blog" className="inline-flex items-center gap-1.5 text-sm font-display font-semibold text-muted hover:text-ink">
        <ArrowLeft className="w-4 h-4" /> All posts
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">
        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-colors ${
            dragging ? 'border-accent bg-lav' : 'border-rule bg-card'
          }`}
        >
          <FileUp className="w-10 h-10 text-accent mx-auto" />
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-ink mt-4">Upload documents</h2>
          <p className="text-muted mt-2 max-w-[54ch] mx-auto text-sm sm:text-base">
            Drop one file or many: <span className="font-semibold text-ink">Word (.docx, .doc)</span> or{' '}
            <span className="font-semibold text-ink">PDF</span>. Each becomes a blog post with its title, headings, paragraphs, lists, tables, links
            and images kept exactly as written.
          </p>
          <button onClick={() => inputRef.current?.click()} className="btn solid mt-6 inline-flex">
            Choose files
          </button>
          <p className="text-xs text-muted mt-3 max-w-[56ch] mx-auto">
            .docx gives the most faithful result. PDFs keep text, headings, lists, links and images, but tables arrive as text. Old .doc files
            keep only the text.
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={IMPORT_ACCEPT}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) add(e.target.files);
              e.target.value = '';
            }}
          />
          <details className="mt-6 text-left max-w-[60ch] mx-auto text-sm text-muted">
            <summary className="cursor-pointer font-display font-semibold text-ink text-center">How SEO details are picked up</summary>
            <div className="mt-3 space-y-2">
              <p>
                The first heading (Word's <em>Title</em> or <em>Heading 1</em> style, or the largest text at the top of a PDF) becomes the post title. Add any of these lines at the top or
                bottom of the document, or under an “SEO details” heading, and they fill the matching field instead of appearing in the post:
              </p>
              <pre className="bg-paper-2 border border-rule rounded-xl p-3 text-xs text-ink whitespace-pre-wrap">
                {'Meta Title: …\nMeta Description: …\nSlug: …\nTags: Content strategy, SEO\nFocus Keyword: …\nExcerpt: …\nFeatured Image: https://…\nImage Alt: …'}
              </pre>
              <p>A two-column table of the same labels works too. Anything missing is flagged so you can fill it in.</p>
            </div>
          </details>
        </div>

        {/* Settings */}
        <div className="bg-card border border-rule rounded-2xl p-5 space-y-3">
          <h2 className="font-display font-bold text-ink">After each file is checked</h2>
          <div className="space-y-2" role="radiogroup" aria-label="What to do with each post">
            {INTENTS.map((o) => (
              <label
                key={o.id}
                className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  settings.intent === o.id ? 'border-accent bg-lav' : 'border-rule hover:border-accent/40'
                }`}
              >
                <input
                  type="radio"
                  name="bulk-intent"
                  checked={settings.intent === o.id}
                  onChange={() => bulkUpload.setSettings({ intent: o.id })}
                  className="mt-1 accent-[var(--color-accent)]"
                />
                <span>
                  <span className="block font-display font-semibold text-ink text-sm">{o.label}</span>
                  <span className="block text-xs text-muted mt-0.5">{o.body}</span>
                </span>
              </label>
            ))}
          </div>
          {settings.intent === 'schedule' && (
            <div className="grid grid-cols-[1fr_auto] gap-2 pt-1">
              <label className="block">
                <span className={labelCls}>First post goes live</span>
                <input
                  type="datetime-local"
                  value={toLocalInput(settings.scheduleAt)}
                  min={toLocalInput(Date.now())}
                  onChange={(e) => bulkUpload.setSettings({ scheduleAt: fromLocalInput(e.target.value) })}
                  className={inputCls}
                />
              </label>
              <label className="block w-28">
                <span className={labelCls}>Then every</span>
                <select
                  value={settings.spacingHours}
                  onChange={(e) => bulkUpload.setSettings({ spacingHours: Number(e.target.value) })}
                  className={inputCls}
                >
                  <option value={0}>Same time</option>
                  <option value={24}>Day</option>
                  <option value={48}>2 days</option>
                  <option value={72}>3 days</option>
                  <option value={168}>Week</option>
                </select>
              </label>
            </div>
          )}
          <p className="text-[11px] text-muted font-display">Applies to files you add from now on. Files keep processing while you use other admin pages.</p>
        </div>
      </div>

      {items.length > 0 && (
        <>
          {/* Summary and batch actions */}
          <div className="bg-card border border-rule rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-display">
              <span className="text-ink font-semibold">{items.length} file{items.length > 1 ? 's' : ''}</span>
              {counts.processing > 0 && (
                <span className="inline-flex items-center gap-1.5 text-accent">
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> {counts.processing} processing
                </span>
              )}
              {counts.ready > 0 && <span className="text-ink">{counts.ready} to review</span>}
              {counts.saved > 0 && <span className="text-good">{counts.saved} saved</span>}
              {counts.flagged > 0 && <span className="text-muted">{counts.flagged} flagged</span>}
              {counts.failed > 0 && <span className="text-bad">{counts.failed} failed</span>}
            </div>
            <div className="flex flex-wrap gap-2 lg:ml-auto">
              {counts.missingSeo > 0 && (
                <button
                  onClick={() => items.filter((i) => i.stage === 'ready').forEach((i) => bulkUpload.suggestSeo(i.id))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-lav text-accent px-3.5 py-2 font-display font-semibold text-sm hover:bg-lav-2"
                  title="Suggests only the SEO fields that are empty. The article text is never changed."
                >
                  <Sparkles className="w-4 h-4" /> Fill missing SEO with AI
                </button>
              )}
              {counts.ready > 0 && (
                <button onClick={() => bulkUpload.saveAll('draft')} className="btn ghost sm">
                  Save {counts.ready} as drafts
                </button>
              )}
              {counts.readyValid > 0 && (
                <button onClick={() => bulkUpload.saveAll('publish')} className="btn solid sm" title="Posts with problems are saved as drafts instead">
                  Publish {counts.readyValid} ready
                </button>
              )}
              {items.some((i) => i.stage === 'done' || i.stage === 'duplicate') && (
                <button onClick={() => bulkUpload.clearFinished()} className="btn ghost sm">
                  Clear finished
                </button>
              )}
            </div>
          </div>

          <ul className="space-y-3">
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                open={openId === item.id}
                onToggle={() => setOpenId((o) => (o === item.id ? null : item.id))}
                onPreview={() => setPreviewId(item.id)}
              />
            ))}
          </ul>
        </>
      )}

      {preview && <PreviewModal item={preview} onClose={() => setPreviewId(null)} />}
    </div>
  );
}

function ItemRow({ item, open, onToggle, onPreview }: { item: BulkItem; open: boolean; onToggle: () => void; onPreview: () => void }) {
  const stage = STAGE[item.stage];
  const errors = item.issues.filter((i) => i.level === 'error');
  const warnings = item.issues.filter((i) => i.level === 'warning');
  const f = item.fields;
  const busy = isProcessing(item);
  const live = item.saved && isLive(item.saved);

  return (
    <li className="bg-card border border-rule rounded-2xl overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-lav border border-rule overflow-hidden flex items-center justify-center">
            {f?.coverImage ? <img src={f.coverImage} alt="" className="w-full h-full object-cover" /> : <FileText className="w-5 h-5 text-accent" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-display font-semibold px-2 py-0.5 rounded-full border ${stage.cls}`}>
                {busy && <LoaderCircle className="w-3 h-3 animate-spin" />}
                {item.stage === 'done' && item.saved
                  ? item.saved.status === 'published'
                    ? 'Published'
                    : item.saved.status === 'scheduled'
                    ? live
                      ? 'Published'
                      : `Scheduled · ${when(item.saved.scheduledAt!)}`
                    : 'Saved as draft'
                  : stage.label}
              </span>
              {f && errors.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-display font-semibold text-bad">
                  <CircleAlert className="w-3.5 h-3.5" /> {errors.length} to fix
                </span>
              )}
              {f && warnings.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-display font-semibold text-muted">
                  <TriangleAlert className="w-3.5 h-3.5 text-gold" /> {warnings.length} flagged
                </span>
              )}
              {f && !item.issues.length && (
                <span className="inline-flex items-center gap-1 text-[11px] font-display font-semibold text-good">
                  <CircleCheck className="w-3.5 h-3.5" /> All details present
                </span>
              )}
            </div>
            <p className="font-display font-bold text-ink truncate mt-1">{f?.title || item.file.name}</p>
            <p className="text-xs text-muted mt-0.5 truncate">
              {item.file.name} · {sizeLabel(item.file.size)}
              {item.stats &&
                ` · ${item.stats.words.toLocaleString()} words · ${item.stats.headings} headings · ${item.stats.images} images · ${item.stats.tables} tables · ${item.stats.links} links`}
            </p>
            {busy && (
              <div className="mt-2 h-1.5 rounded-full bg-paper-2 overflow-hidden" role="progressbar" aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-accent transition-all duration-300" style={{ width: `${Math.max(item.progress, 4)}%` }} />
              </div>
            )}
            {item.stage === 'duplicate' && (
              <p className="text-sm text-muted mt-1.5">
                {item.duplicateOf ? (
                  <>
                    This file was imported before as{' '}
                    <Link to={`/admin/blog/${item.duplicateOf.id}`} className="text-accent font-semibold hover:underline">
                      “{item.duplicateOf.title || 'Untitled'}”
                    </Link>
                    . It was skipped so the post isn't duplicated.
                  </>
                ) : (
                  item.error
                )}
              </p>
            )}
            {item.error && item.stage !== 'duplicate' && (
              <p className={`text-sm mt-1.5 ${item.stage === 'done' && item.saved ? 'text-muted' : 'text-bad'}`} role="alert">
                {item.error}
              </p>
            )}
            {item.saved && (
              <p className="text-sm mt-1.5">
                {live ? (
                  <a href={`/blog/${item.saved.slug}`} target="_blank" rel="noreferrer" className="text-accent font-semibold hover:underline break-all">
                    {window.location.origin}/blog/{item.saved.slug}
                  </a>
                ) : (
                  <span className="text-muted break-all">
                    Will be at {window.location.origin}/blog/{item.saved.slug}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 md:justify-end shrink-0">
          {item.stage === 'error' && (
            <button onClick={() => bulkUpload.retry(item.id)} className="btn ghost sm">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          )}
          {item.stage === 'duplicate' && item.duplicateOf && (
            <button onClick={() => bulkUpload.importAnyway(item.id)} className="btn ghost sm" title="Creates a second post with its own URL">
              <Copy className="w-4 h-4" /> Import anyway
            </button>
          )}
          {f && (
            <>
              <button onClick={onPreview} className="btn ghost sm">
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button onClick={onToggle} className="btn ghost sm" aria-expanded={open}>
                <Pencil className="w-4 h-4" /> Details
                <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
            </>
          )}
          {f && item.stage !== 'saving' && <SaveActions item={item} />}
          {item.saved && (
            <Link to={`/admin/blog/${item.saved.id}`} className="btn ghost sm">
              Open in editor
            </Link>
          )}
          {!busy && (
            <button
              onClick={() => bulkUpload.remove(item.id)}
              className="p-2 rounded-lg text-muted hover:bg-lav hover:text-ink"
              aria-label={`Remove ${item.file.name} from the list`}
              title={item.saved ? 'Remove from list (the post stays)' : 'Remove'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {f && open && <DetailsPanel item={item} fields={f} />}
    </li>
  );
}

/** Draft / publish / schedule buttons for one post. */
function SaveActions({ item }: { item: BulkItem }) {
  const [scheduling, setScheduling] = useState(false);
  const [at, setAt] = useState(toLocalInput(item.scheduleAt ?? Date.now() + 24 * 3600_000));
  const blocked = hasErrors(item);
  const saved = item.saved;
  const live = saved && isLive(saved);

  if (scheduling) {
    return (
      <span className="inline-flex flex-wrap items-center gap-1.5">
        <input type="datetime-local" value={at} min={toLocalInput(Date.now())} onChange={(e) => setAt(e.target.value)} aria-label="Publish date and time" className="rounded-lg border border-rule bg-paper px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent" />
        <button
          onClick={() => {
            const ms = fromLocalInput(at);
            if (!ms || ms <= Date.now()) return;
            setScheduling(false);
            bulkUpload.save(item.id, 'schedule', ms);
          }}
          className="btn solid sm"
        >
          Schedule
        </button>
        <button onClick={() => setScheduling(false)} className="btn ghost sm">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <>
      {!live && (
        <button onClick={() => bulkUpload.save(item.id, 'draft')} className="btn ghost sm">
          {!saved ? 'Save draft' : saved.status === 'scheduled' ? 'Unschedule' : 'Save changes'}
        </button>
      )}
      {!live && (
        <>
          <button
            onClick={() => setScheduling(true)}
            disabled={blocked}
            className="btn ghost sm disabled:opacity-50"
            title={blocked ? 'Fix the problems first' : 'Pick when it goes live'}
          >
            <CalendarClock className="w-4 h-4" /> Schedule
          </button>
          <button
            onClick={() => bulkUpload.save(item.id, 'publish')}
            disabled={blocked}
            className="btn solid sm disabled:opacity-50"
            title={blocked ? 'Fix the problems first' : 'Publish to the blog now'}
          >
            <Send className="w-4 h-4" /> Publish
          </button>
        </>
      )}
      {live && saved && item.fields && (
        <button onClick={() => bulkUpload.save(item.id, 'publish')} className="btn ghost sm" title="Save edits made here to the live post">
          Update live post
        </button>
      )}
    </>
  );
}

function IssueList({ issues }: { issues: Issue[] }) {
  if (!issues.length) return null;
  return (
    <ul className="space-y-1.5">
      {issues.map((i, n) => (
        <li key={n} className={`flex items-start gap-2 text-sm ${i.level === 'error' ? 'text-bad' : 'text-ink'}`}>
          {i.level === 'error' ? <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" /> : <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-gold" />}
          <span>{i.message}</span>
        </li>
      ))}
    </ul>
  );
}

/** Edit the title, URL and SEO details an import found, and fill what's missing. */
function DetailsPanel({ item, fields: f }: { item: BulkItem; fields: Fields }) {
  const flagged = (field: Issue['field']) => item.issues.find((i) => i.field === field);
  const ring = (field: Issue['field']) => {
    const i = flagged(field);
    return i ? (i.level === 'error' ? ' border-bad' : ' border-gold') : '';
  };
  const ai = (field: string) => item.aiFilled.includes(field) && (
    <span className="ml-1.5 inline-flex items-center gap-1 text-[10px] font-display font-semibold uppercase tracking-wider text-accent bg-lav px-1.5 py-0.5 rounded">
      <Sparkles className="w-3 h-3" /> AI · check it
    </span>
  );
  const set = (change: Partial<Fields>) => bulkUpload.edit(item.id, change);
  const firstImage = f.content.match(/!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)/);
  const canSuggest = ['excerpt', 'seoTitle', 'seoDescription', 'tags', 'keywords'].some((k) => !f[k as keyof Fields]);

  return (
    <div className="border-t border-rule bg-paper-2/60 p-4 sm:p-5 grid gap-5 lg:grid-cols-[1fr_300px]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={labelCls}>Title</span>
          <input value={f.title} maxLength={POST_LIMITS.title} onChange={(e) => set({ title: e.target.value })} className={inputCls + ring('title')} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelCls}>URL</span>
          <div className={`flex items-center rounded-xl border bg-paper focus-within:border-accent overflow-hidden ${flagged('slug') ? 'border-bad' : 'border-rule'}`}>
            <span className="pl-3.5 text-sm text-muted font-mono shrink-0">/blog/</span>
            <input
              value={f.slug}
              maxLength={POST_LIMITS.slug}
              onChange={(e) => set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-{2,}/g, '-') })}
              onBlur={() => set({ slug: slugify(f.slug) || slugify(f.title) })}
              className="flex-1 min-w-0 bg-transparent py-2.5 pr-3.5 text-ink font-mono text-sm outline-none"
            />
          </div>
          {flagged('slug') && (
            <button type="button" onClick={() => bulkUpload.freeSlug(item.id)} className="mt-1.5 text-xs font-display font-semibold text-accent hover:underline">
              Use a free URL instead
            </button>
          )}
        </label>
        <label className="block sm:col-span-2">
          <span className={labelCls}>
            Summary <span className="font-normal text-muted">· shown on the blog list</span>
            {ai('excerpt')}
          </span>
          <textarea value={f.excerpt} rows={2} maxLength={POST_LIMITS.excerpt} onChange={(e) => set({ excerpt: e.target.value })} className={`${inputCls} resize-y${ring('excerpt')}`} />
        </label>
        <label className="block">
          <span className={labelCls}>
            SEO title {ai('seoTitle')}
          </span>
          <input value={f.seoTitle} maxLength={POST_LIMITS.seoTitle} placeholder={f.title} onChange={(e) => set({ seoTitle: e.target.value })} className={inputCls + ring('seoTitle')} />
          <Count n={(f.seoTitle || f.title).length} hint={SEO_HINTS.title} />
        </label>
        <label className="block">
          <span className={labelCls}>
            Focus keywords {ai('keywords')}
          </span>
          <input value={f.keywords} maxLength={POST_LIMITS.keywords} onChange={(e) => set({ keywords: e.target.value })} className={inputCls + ring('keywords')} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelCls}>
            Meta description <span className="font-normal text-muted">· the summary is used when empty</span>
            {ai('seoDescription')}
          </span>
          <textarea
            value={f.seoDescription}
            rows={2}
            maxLength={POST_LIMITS.seoDescription}
            placeholder={f.excerpt}
            onChange={(e) => set({ seoDescription: e.target.value })}
            className={`${inputCls} resize-y${ring('seoDescription')}`}
          />
          <Count n={(f.seoDescription || f.excerpt).length} hint={SEO_HINTS.description} />
        </label>
        <label className="block">
          <span className={labelCls}>
            Tags <span className="font-normal text-muted">· comma separated</span>
            {ai('tags')}
          </span>
          <input value={f.tags} onChange={(e) => set({ tags: e.target.value })} className={inputCls + ring('tags')} />
          {parseTags(f.tags).length > 0 && (
            <span className="flex flex-wrap gap-1.5 mt-2">
              {parseTags(f.tags).map((t) => (
                <span key={t} className="text-xs font-display font-semibold text-accent bg-lav px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </span>
          )}
        </label>
        <label className="block">
          <span className={labelCls}>Author</span>
          <input value={f.author} maxLength={80} onChange={(e) => set({ author: e.target.value })} className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Cover image link</span>
          <input value={f.coverImage} maxLength={POST_LIMITS.coverImage} placeholder="https://…" onChange={(e) => set({ coverImage: e.target.value.trim() })} className={inputCls + ring('coverImage')} />
          {!f.coverImage && firstImage && (
            <button
              type="button"
              onClick={() => set({ coverImage: firstImage[2], coverAlt: f.coverAlt || firstImage[1].replace(/\\(.)/g, '$1') })}
              className="mt-1.5 text-xs font-display font-semibold text-accent hover:underline"
            >
              Use the first image in the post
            </button>
          )}
        </label>
        <label className="block">
          <span className={labelCls}>Cover image description</span>
          <input value={f.coverAlt} maxLength={POST_LIMITS.coverAlt} onChange={(e) => set({ coverAlt: e.target.value })} className={inputCls + ring('coverAlt')} />
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-display font-bold text-ink text-sm mb-2">Checks</h3>
          {item.issues.length ? <IssueList issues={item.issues} /> : <p className="text-sm text-good">Everything a post needs is here.</p>}
        </div>
        {canSuggest && (
          <div className="rounded-xl border border-accent/30 bg-lav p-3.5">
            <p className="text-xs text-ink">AI can suggest the empty SEO fields from the article. It never changes the article itself.</p>
            <button onClick={() => bulkUpload.suggestSeo(item.id)} disabled={item.aiBusy} className="btn ghost sm mt-2.5 disabled:opacity-60">
              {item.aiBusy ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {item.aiBusy ? 'Suggesting…' : 'Suggest missing SEO'}
            </button>
          </div>
        )}
        <SearchSnippet fields={f} />
        <p className="text-xs text-muted">The article text can be edited in the full editor once the post is saved.</p>
      </div>
    </div>
  );
}

function Count({ n, hint }: { n: number; hint: number }) {
  return <span className={`block text-xs mt-1 text-right font-display ${n > hint ? 'text-bad' : 'text-muted/70'}`}>{n}/{hint}</span>;
}

/** Roughly how the post will look in Google results. */
function SearchSnippet({ fields: f }: { fields: Fields }) {
  const title = f.seoTitle || `${f.title} · Himani Kankaria`;
  const description = f.seoDescription || f.excerpt;
  return (
    <div className="rounded-xl border border-rule bg-card p-3.5">
      <p className="text-[11px] font-display font-semibold uppercase tracking-wider text-muted mb-2">Search result preview</p>
      <p className="text-xs text-muted truncate">
        {window.location.host}/blog/{f.slug || slugify(f.title)}
      </p>
      <p className="text-[#1a0dab] dark:text-[#8ab4f8] text-base leading-snug mt-0.5 line-clamp-2">
        {title.length > SEO_HINTS.title + 5 ? `${title.slice(0, SEO_HINTS.title)}…` : title}
      </p>
      <p className="text-xs text-muted mt-1 line-clamp-3">{description || <em>No description: search engines will pick some text from the page.</em>}</p>
    </div>
  );
}

/** The post as it will appear on the blog, with the save actions alongside. */
function PreviewModal({ item, onClose }: { item: BulkItem; onClose: () => void }) {
  useScrollLock();
  const f = item.fields!;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-paper" role="dialog" aria-modal="true" aria-label={`Preview of ${f.title}`}>
      <div className="shrink-0 border-b border-rule bg-card px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
        <div className="min-w-0 mr-auto">
          <p className="text-[11px] font-display font-semibold uppercase tracking-wider text-accent">Preview · as it will appear on the blog</p>
          <p className="font-display font-bold text-ink truncate">{f.title}</p>
        </div>
        {item.stage !== 'saving' && <SaveActions item={item} />}
        {item.stage === 'saving' && (
          <span className="inline-flex items-center gap-1.5 text-sm font-display text-accent">
            <LoaderCircle className="w-4 h-4 animate-spin" /> Saving…
          </span>
        )}
        <button onClick={onClose} className="p-2 rounded-lg text-muted hover:bg-lav hover:text-ink" aria-label="Close preview">
          <X className="w-5 h-5" />
        </button>
      </div>
      {(item.issues.length > 0 || item.error) && (
        <div className="shrink-0 border-b border-rule bg-paper-2 px-4 sm:px-6 py-3 max-h-36 overflow-y-auto">
          {item.error && <p className="text-sm text-bad mb-1.5">{item.error}</p>}
          <IssueList issues={item.issues} />
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <PostArticle preview post={{ ...f, tags: parseTags(f.tags), publishedAt: item.saved?.scheduledAt ?? null }} />
      </div>
    </div>
  );
}
