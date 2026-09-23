import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Pencil, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { useDeletePostMutation, useGetAllPostsQuery, useSavePostMutation } from '../../../store/blogApi';
import { formatPostDate, readMinutes, type Post, type PostStatus } from '../../../lib/blog';
import { EmptyState, errorMessage, timeAgo } from '../shared';
import { useConfirm, useToast } from '../../../components/ui/Feedback';

export default function BlogListView() {
  const { data: posts = [], isLoading, error } = useGetAllPostsQuery();
  const [savePost] = useSavePostMutation();
  const [deletePost] = useDeletePostMutation();
  const confirm = useConfirm();
  const toast = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PostStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return posts.filter(
      (p) => (filter === 'all' || p.status === filter) && (!s || [p.title, p.excerpt, ...p.tags].some((v) => v.toLowerCase().includes(s)))
    );
  }, [posts, filter, q]);

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    draft: posts.filter((p) => p.status === 'draft').length,
  };

  const togglePublish = async (p: Post) => {
    setBusyId(p.id);
    try {
      const { id, publishedAt, createdAt, updatedAt, ...input } = p;
      void createdAt;
      void updatedAt;
      await savePost({
        id,
        post: { ...input, status: p.status === 'published' ? 'draft' : 'published' },
        wasPublished: publishedAt != null,
      }).unwrap();
      toast.success(p.status === 'published' ? `“${p.title}” is now a draft.` : `“${p.title}” is live on the blog.`);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p: Post) => {
    const ok = await confirm({
      title: `Delete “${p.title || 'Untitled'}”?`,
      message: p.status === 'published'
        ? "It will disappear from the blog straight away and links to it will stop working. This can't be undone."
        : "This draft will be removed. This can't be undone.",
      confirmLabel: 'Delete post',
      tone: 'danger',
    });
    if (!ok) return;
    setBusyId(p.id);
    try {
      await deletePost({ id: p.id, slug: p.slug }).unwrap();
      toast.success(`Deleted “${p.title || 'Untitled'}”.`);
    } catch (e) {
      toast.error(`Couldn't delete the post: ${errorMessage(e)}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {(['all', 'published', 'draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full border font-display font-semibold text-sm capitalize transition-colors ${
                filter === s ? 'bg-ink text-paper border-ink' : 'bg-card border-rule text-muted hover:text-ink'
              }`}
            >
              {s === 'all' ? 'All posts' : s === 'draft' ? 'Drafts' : 'Published'}
              <span className={`text-xs tabular-nums ${filter === s ? 'text-paper/70' : 'text-muted'}`}>{counts[s]}</span>
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts"
            className="w-full rounded-xl border border-rule bg-card pl-10 pr-3.5 py-2.5 text-ink outline-none focus:border-accent"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2">
          <Link
            to="/admin/blog/new?ai=1"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-accent/40 bg-lav text-accent px-4 py-2.5 font-display font-semibold text-sm hover:bg-lav-2"
          >
            <Sparkles className="w-4 h-4" /> Write with AI
          </Link>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent text-white px-4 py-2.5 font-display font-semibold text-sm hover:bg-accent-hover"
          >
            <Plus className="w-4 h-4" /> New post
          </Link>
        </div>
      </div>


      <div className="bg-card border border-rule rounded-2xl overflow-hidden">
        {error ? (
          <EmptyState title="Couldn't load posts" body={errorMessage(error)} />
        ) : isLoading ? (
          <EmptyState title="Loading posts…" />
        ) : !shown.length ? (
          <EmptyState
            title={posts.length ? 'No posts match' : 'No posts yet'}
            body={posts.length ? 'Try another filter or search.' : 'Write your first post. It stays a draft until you publish it.'}
          />
        ) : (
          <ul className="divide-y divide-rule">
            {shown.map((p) => (
              <li key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5">
                <button onClick={() => navigate(`/admin/blog/${p.id}`)} className="flex items-center gap-4 min-w-0 flex-1 text-left group">
                  <div className="w-24 h-16 sm:w-28 sm:h-[72px] shrink-0 rounded-xl overflow-hidden bg-lav border border-rule">
                    {p.coverImage && <img src={p.coverImage} alt="" className="w-full h-full object-cover" loading="lazy" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-display font-semibold px-2 py-0.5 rounded-full border ${
                          p.status === 'published' ? 'bg-good/10 text-good border-good/30' : 'bg-gold/20 text-ink border-gold/50'
                        }`}
                      >
                        {p.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      {p.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[11px] font-display text-muted">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <p className="font-display font-bold text-ink truncate mt-1 group-hover:text-accent">{p.title || 'Untitled'}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {p.status === 'published' ? `Published ${formatPostDate(p.publishedAt)}` : `Edited ${timeAgo(p.updatedAt)}`} ·{' '}
                      {readMinutes(p.content)} min read
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={() => togglePublish(p)}
                    disabled={busyId === p.id}
                    className="px-3 py-1.5 rounded-lg border border-rule text-sm font-display font-semibold text-ink hover:border-accent hover:text-accent disabled:opacity-50"
                  >
                    {p.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link to={`/admin/blog/${p.id}`} className="p-2 rounded-lg text-muted hover:bg-lav hover:text-ink" aria-label="Edit" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  {p.status === 'published' && (
                    <a
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg text-muted hover:bg-lav hover:text-ink"
                      aria-label="View on site"
                      title="View on site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => remove(p)}
                    disabled={busyId === p.id}
                    className="p-2 rounded-lg text-muted hover:bg-bad/10 hover:text-bad disabled:opacity-50"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
