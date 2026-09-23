import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bold,
  Code,
  ExternalLink,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Trash2,
} from 'lucide-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useDeletePostMutation, useGetPostQuery, useSavePostMutation } from '../../../store/blogApi';
import {
  DEFAULT_AUTHOR,
  POST_LIMITS,
  formatPostDate,
  parseTags,
  readMinutes,
  slugify,
  validatePost,
  type GeneratedDraft,
  type PostInput,
  type PostStatus,
} from '../../../lib/blog';
import Markdown from '../../../components/blog/Markdown';
import { errorMessage, timeAgo } from '../shared';
import AiDraftPanel from '../AiDraftPanel';
import { useConfirm, useToast } from '../../../components/ui/Feedback';

interface Draft {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  tags: string;
  author: string;
}

const EMPTY: Draft = { title: '', slug: '', excerpt: '', content: '', coverImage: '', coverAlt: '', tags: '', author: DEFAULT_AUTHOR };

const inputCls = 'w-full rounded-xl border border-rule bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent';
const labelCls = 'block font-display text-sm font-semibold text-ink mb-1.5';

export default function PostEditorView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [searchParams] = useSearchParams();
  const { data: existing, isLoading, error: loadError } = useGetPostQuery(id ?? skipToken);
  const [savePost, { isLoading: saving }] = useSavePostMutation();
  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();
  const confirm = useConfirm();
  const toast = useToast();

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saved, setSaved] = useState<Draft>(EMPTY);
  const [status, setStatus] = useState<PostStatus>('draft');
  const [slugTouched, setSlugTouched] = useState(false);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [error, setError] = useState('');
  const loadedId = useRef<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Load the post into the form once.
  useEffect(() => {
    if (!existing || loadedId.current === existing.id) return;
    loadedId.current = existing.id;
    const d: Draft = {
      title: existing.title,
      slug: existing.slug,
      excerpt: existing.excerpt,
      content: existing.content,
      coverImage: existing.coverImage,
      coverAlt: existing.coverAlt,
      tags: existing.tags.join(', '),
      author: existing.author,
    };
    setDraft(d);
    setSaved(d);
    setStatus(existing.status);
    setSlugTouched(true);
  }, [existing]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => {
      const next = { ...d, [key]: value };
      // The URL follows the title until it's edited by hand.
      if (key === 'title' && !slugTouched) next.slug = slugify(value as string);
      return next;
    });
  };

  const wasPublished = existing?.publishedAt != null;

  // Fill the form from an AI draft; asks first if there's writing to replace.
  const applyDraft = async (d: GeneratedDraft) => {
    if (draft.content.trim()) {
      const ok = await confirm({
        title: 'Replace your current draft?',
        message: 'The AI draft will replace the title, summary, tags and text in the editor. Save first if you want to keep what is there.',
        confirmLabel: 'Replace with AI draft',
      });
      if (!ok) return false;
    }
    setError('');
    setDraft((prev) => ({
      ...prev,
      title: d.title || prev.title,
      slug: slugTouched && prev.slug ? prev.slug : slugify(d.title || prev.title),
      excerpt: d.excerpt || prev.excerpt,
      tags: d.tags.length ? d.tags.join(', ') : prev.tags,
      content: d.content,
    }));
    setTab('write');
    return true;
  };

  const save = useCallback(
    async (nextStatus: PostStatus) => {
      setError('');
      const post: PostInput = {
        title: draft.title,
        slug: draft.slug || slugify(draft.title),
        excerpt: draft.excerpt,
        content: draft.content,
        coverImage: draft.coverImage.trim(),
        coverAlt: draft.coverAlt,
        tags: parseTags(draft.tags),
        author: draft.author || DEFAULT_AUTHOR,
        status: nextStatus,
      };
      const invalid = validatePost(post);
      if (invalid) return setError(invalid);
      try {
        const newId = await savePost({ id, post, wasPublished }).unwrap();
        const clean = { ...draft, slug: post.slug, tags: post.tags.join(', ') };
        setDraft(clean);
        setSaved(clean);
        setStatus(nextStatus);
        toast.success(
          nextStatus === 'published'
            ? status === 'published'
              ? 'Changes are live.'
              : 'Published. It is now on the blog.'
            : status === 'published'
            ? 'Unpublished. It is now a draft.'
            : 'Draft saved.'
        );
        if (isNew) {
          loadedId.current = newId;
          navigate(`/admin/blog/${newId}`, { replace: true });
        }
      } catch (e) {
        setError(errorMessage(e));
      }
    },
    [draft, id, isNew, navigate, savePost, status, toast, wasPublished]
  );

  // Ctrl/Cmd + S saves without changing the status.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!saving) save(status);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save, saving, status]);

  const remove = async () => {
    if (!id || !existing) return;
    const ok = await confirm({
      title: `Delete “${draft.title || 'Untitled'}”?`,
      message:
        status === 'published'
          ? "It will disappear from the blog straight away and links to it will stop working. This can't be undone."
          : "This draft will be removed. This can't be undone.",
      confirmLabel: 'Delete post',
      tone: 'danger',
    });
    if (!ok) return;
    try {
      await deletePost({ id, slug: existing.slug }).unwrap();
      setSaved(draft); // nothing left to warn about
      toast.success(`Deleted “${draft.title || 'Untitled'}”.`);
      navigate('/admin/blog', { replace: true });
    } catch (e) {
      toast.error(`Couldn't delete the post: ${errorMessage(e)}`);
    }
  };

  const leave = async (e: React.MouseEvent) => {
    if (!dirty) return;
    e.preventDefault();
    const ok = await confirm({
      title: 'Leave without saving?',
      message: 'Your changes to this post will be lost.',
      confirmLabel: 'Leave without saving',
      cancelLabel: 'Keep editing',
      tone: 'danger',
    });
    if (ok) navigate('/admin/blog');
  };

  // Toolbar: wrap the selection, or insert at the cursor.
  const format = (before: string, after = '', placeholder = '', block = false) => {
    const el = editorRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || placeholder;
    const needsNewline = block && s > 0 && value[s - 1] !== '\n';
    const insert = `${needsNewline ? '\n' : ''}${before}${selected}${after}`;
    const next = value.slice(0, s) + insert + value.slice(e);
    set('content', next);
    setTimeout(() => {
      el.focus();
      const start = s + (needsNewline ? 1 : 0) + before.length;
      el.setSelectionRange(start, start + selected.length);
    });
  };

  const tools = [
    { icon: Heading2, label: 'Heading', run: () => format('## ', '', 'Heading', true) },
    { icon: Heading3, label: 'Subheading', run: () => format('### ', '', 'Subheading', true) },
    { icon: Bold, label: 'Bold', run: () => format('**', '**', 'bold text') },
    { icon: Italic, label: 'Italic', run: () => format('_', '_', 'italic text') },
    { icon: Link2, label: 'Link', run: () => format('[', '](https://)', 'link text') },
    { icon: List, label: 'Bulleted list', run: () => format('- ', '', 'List item', true) },
    { icon: ListOrdered, label: 'Numbered list', run: () => format('1. ', '', 'List item', true) },
    { icon: Quote, label: 'Quote', run: () => format('> ', '', 'Quote', true) },
    { icon: Code, label: 'Code', run: () => format('`', '`', 'code') },
    { icon: ImageIcon, label: 'Image', run: () => format('![', '](https://)', 'Describe the image') },
    { icon: Minus, label: 'Divider', run: () => format('\n---\n', '', '', true) },
  ];

  if (!isNew && isLoading) return <p className="text-muted font-display">Loading post…</p>;
  if (!isNew && (loadError || !existing)) {
    return (
      <div className="text-center py-16">
        <p className="font-display font-bold text-ink text-lg">{loadError ? "Couldn't load this post" : "This post doesn't exist"}</p>
        {loadError && <p className="text-muted text-sm mt-1">{errorMessage(loadError)}</p>}
        <Link to="/admin/blog" className="btn ghost sm mt-5 inline-flex">
          Back to posts
        </Link>
      </div>
    );
  }

  const publicUrl = `/blog/${draft.slug || slugify(draft.title) || 'your-post'}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/admin/blog" onClick={leave} className="inline-flex items-center gap-1.5 text-sm font-display font-semibold text-muted hover:text-ink">
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>
        <span
          className={`text-xs font-display font-semibold px-2.5 py-1 rounded-full border ${
            status === 'published' ? 'bg-good/10 text-good border-good/30' : 'bg-gold/20 text-ink border-gold/50'
          }`}
        >
          {status === 'published' ? 'Published' : 'Draft'}
        </span>
        <span className="text-xs text-muted font-display">
          {dirty ? 'Unsaved changes' : existing ? `Saved ${timeAgo(existing.updatedAt)}` : 'Not saved yet'}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Main column */}
        <div className="space-y-5 min-w-0">
          <AiDraftPanel defaultOpen={isNew && (searchParams.get('ai') === '1' || !draft.content)} onDraft={applyDraft} />
          <div className="bg-card border border-rule rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <label htmlFor="post-title" className="sr-only">
                Title
              </label>
              <input
                id="post-title"
                value={draft.title}
                onChange={(e) => set('title', e.target.value)}
                maxLength={POST_LIMITS.title}
                placeholder="Post title"
                className="w-full bg-transparent font-display font-extrabold text-2xl sm:text-3xl text-ink outline-none placeholder:text-muted/50"
              />
            </div>
            <div>
              <label htmlFor="post-slug" className={labelCls}>
                URL
              </label>
              <div className="flex items-center rounded-xl border border-rule bg-paper focus-within:border-accent overflow-hidden">
                <span className="pl-3.5 text-sm text-muted font-mono shrink-0">/blog/</span>
                <input
                  id="post-slug"
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-{2,}/g, '-'));
                  }}
                  onBlur={() => set('slug', slugify(draft.slug))}
                  maxLength={POST_LIMITS.slug}
                  placeholder="post-url"
                  className="flex-1 min-w-0 bg-transparent py-2.5 pr-3.5 text-ink font-mono text-sm outline-none"
                />
              </div>
              {wasPublished && draft.slug !== saved.slug && (
                <p className="text-xs text-bad font-display mt-1.5">Changing the URL of a live post breaks links people have already shared.</p>
              )}
            </div>
            <div>
              <label htmlFor="post-excerpt" className={labelCls}>
                Summary
                <span className="font-normal text-muted"> · shown on the blog list and in search results</span>
              </label>
              <textarea
                id="post-excerpt"
                value={draft.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                maxLength={POST_LIMITS.excerpt}
                rows={2}
                placeholder="One or two sentences on what the reader will learn."
                className={`${inputCls} resize-y`}
              />
              <p className={`text-xs mt-1 text-right font-display ${draft.excerpt.length > 160 ? 'text-muted' : 'text-muted/70'}`}>
                {draft.excerpt.length}/{POST_LIMITS.excerpt}
                {draft.excerpt.length > 160 && ' · search results usually show about 160'}
              </p>
            </div>
          </div>

          {/* Content editor */}
          <div className="bg-card border border-rule rounded-2xl overflow-hidden">
            <div className="flex items-center gap-1 border-b border-rule px-2 sm:px-3 py-2 overflow-x-auto">
              <div className="flex rounded-lg bg-paper-2 p-0.5 mr-2 shrink-0">
                {(['write', 'preview'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 rounded-md text-sm font-display font-semibold capitalize ${
                      tab === t ? 'bg-card text-ink shadow-xs' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {tab === 'write' &&
                tools.map(({ icon: Icon, label, run }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={run}
                    className="p-2 rounded-lg text-muted hover:bg-lav hover:text-ink shrink-0"
                    aria-label={label}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              <span className="ml-auto pl-2 text-xs text-muted font-display whitespace-nowrap shrink-0">
                {readMinutes(draft.content)} min read
              </span>
            </div>
            {tab === 'write' ? (
              <textarea
                ref={editorRef}
                value={draft.content}
                onChange={(e) => set('content', e.target.value)}
                maxLength={POST_LIMITS.content}
                placeholder={'Write in Markdown.\n\n## A heading\n\nA paragraph with **bold** text and a [link](https://example.com).\n\n- A list item'}
                aria-label="Post content"
                className="w-full min-h-[480px] p-5 sm:p-6 bg-card text-ink font-mono text-[0.92rem] leading-relaxed outline-none resize-y"
              />
            ) : (
              <div className="p-5 sm:p-8 min-h-[480px]">
                {draft.content.trim() ? <Markdown>{draft.content}</Markdown> : <p className="text-muted">Nothing to preview yet.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 xl:sticky xl:top-24">
          <div className="bg-card border border-rule rounded-2xl p-5 space-y-3">
            <h2 className="font-display font-bold text-ink">Publish</h2>
            {status === 'published' && existing?.publishedAt && (
              <p className="text-sm text-muted">Live since {formatPostDate(existing.publishedAt)}.</p>
            )}
            {status === 'published' ? (
              <>
                <button onClick={() => save('published')} disabled={saving} className="btn solid w-full justify-center disabled:opacity-60">
                  {saving ? 'Saving…' : 'Update live post'}
                </button>
                <div className="flex gap-2">
                  <a href={publicUrl} target="_blank" rel="noreferrer" className="btn ghost sm flex-1 justify-center">
                    <ExternalLink className="w-4 h-4" /> View
                  </a>
                  <button onClick={() => save('draft')} disabled={saving} className="btn ghost sm flex-1 justify-center disabled:opacity-60">
                    Unpublish
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => save('published')} disabled={saving} className="btn solid w-full justify-center disabled:opacity-60">
                  {saving ? 'Saving…' : 'Publish'}
                </button>
                <button onClick={() => save('draft')} disabled={saving} className="btn ghost w-full justify-center disabled:opacity-60">
                  Save draft
                </button>
              </>
            )}
            <p className="text-[11px] text-muted font-display">Ctrl + S saves at any time.</p>
            {error && <p className="text-bad text-sm font-display" role="alert">{error}</p>}
          </div>

          <div className="bg-card border border-rule rounded-2xl p-5 space-y-4">
            <h2 className="font-display font-bold text-ink">Cover image</h2>
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-lav border border-rule flex items-center justify-center">
              {draft.coverImage ? (
                <img src={draft.coverImage} alt={draft.coverAlt} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted/50" />
              )}
            </div>
            <div>
              <label htmlFor="post-cover" className={labelCls}>
                Image link
              </label>
              <input
                id="post-cover"
                value={draft.coverImage}
                onChange={(e) => set('coverImage', e.target.value)}
                maxLength={POST_LIMITS.coverImage}
                placeholder="https://…"
                className={`${inputCls} text-sm`}
              />
            </div>
            <div>
              <label htmlFor="post-cover-alt" className={labelCls}>
                Image description
              </label>
              <input
                id="post-cover-alt"
                value={draft.coverAlt}
                onChange={(e) => set('coverAlt', e.target.value)}
                maxLength={POST_LIMITS.coverAlt}
                placeholder="What the image shows, for screen readers"
                className={`${inputCls} text-sm`}
              />
            </div>
          </div>

          <div className="bg-card border border-rule rounded-2xl p-5 space-y-4">
            <h2 className="font-display font-bold text-ink">Details</h2>
            <div>
              <label htmlFor="post-tags" className={labelCls}>
                Tags <span className="font-normal text-muted">· comma separated</span>
              </label>
              <input
                id="post-tags"
                value={draft.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="Content strategy, SEO"
                className={`${inputCls} text-sm`}
              />
              {parseTags(draft.tags).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {parseTags(draft.tags).map((t) => (
                    <span key={t} className="text-xs font-display font-semibold text-accent bg-lav px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="post-author" className={labelCls}>
                Author
              </label>
              <input
                id="post-author"
                value={draft.author}
                onChange={(e) => set('author', e.target.value)}
                maxLength={80}
                className={`${inputCls} text-sm`}
              />
            </div>
          </div>

          {!isNew && (
            <button
              onClick={remove}
              disabled={deleting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-bad/40 text-bad px-4 py-2.5 font-display font-semibold text-sm hover:bg-bad/10 disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" /> Delete post
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
