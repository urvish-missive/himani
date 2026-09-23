import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CrownIcon } from '../components/ui/BrandIcons';
import { useGetPublishedPostsQuery } from '../store/blogApi';
import { formatPostDate, readMinutes, type Post } from '../lib/blog';
import { usePageMeta } from '../hooks/usePageMeta';
import { alternate, enter, reveal } from '../lib/motion';

export default function BlogPage() {
  usePageMeta({
    title: 'Blog · Himani Kankaria',
    description:
      'Writing by Himani Kankaria on content strategy, brand, search and marketing leadership for B2B, SaaS and tech teams.',
  });

  const { data: posts = [], isLoading, isError } = useGetPublishedPostsQuery();
  const [params, setParams] = useSearchParams();
  const activeTag = params.get('tag') ?? '';

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [posts]);

  const shown = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;
  const [featured, ...rest] = shown;

  const pickTag = (t: string) => {
    const next = new URLSearchParams(params);
    if (t) next.set('tag', t);
    else next.delete('tag');
    setParams(next, { replace: true });
  };

  return (
    <main className="bg-paper">
      <section className="pt-10 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-lav to-paper border-b border-rule">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <motion.div {...enter('clipUp')}>
            <div className="inline-flex items-center gap-2 font-display font-semibold text-sm text-accent mb-4">
              <CrownIcon className="w-5 h-5 text-gold" />
              <span>Blog</span>
            </div>
            <h1 className="font-display font-extrabold text-[clamp(2.3rem,5.5vw,4rem)] leading-[1.06] tracking-[-0.03em] text-ink max-w-[20ch]">
              Notes on content, brand and marketing leadership
            </h1>
            <p className="mt-5 text-lg text-muted max-w-[56ch] leading-relaxed">
              What I see working with B2B, SaaS and tech teams, written up so you can use it without hiring me.
            </p>
          </motion.div>

          {tags.length > 0 && (
            <motion.div {...enter('blurLeft', { delay: 0.25 })} className="mt-8 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Filter by topic">
              {['', ...tags].map((t) => {
                const active = activeTag === t;
                return (
                  <button
                    key={t || 'all'}
                    onClick={() => pickTag(t)}
                    aria-pressed={active}
                    className={`shrink-0 px-4 py-2 rounded-full border font-display font-semibold text-sm transition-colors ${
                      active ? 'bg-ink text-paper border-ink' : 'bg-card border-rule text-muted hover:text-ink hover:border-ink/30'
                    }`}
                  >
                    {t || 'All posts'}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-3xl border border-rule overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-lav" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-24 bg-lav rounded" />
                    <div className="h-5 w-4/5 bg-lav rounded" />
                    <div className="h-3 w-full bg-lav rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <Empty title="The blog couldn't load" body="Refresh the page in a moment." />
          ) : !shown.length ? (
            <Empty
              title={activeTag ? `No posts tagged “${activeTag}” yet` : 'The first post is on its way'}
              body={activeTag ? undefined : 'Check back soon.'}
              action={activeTag ? <button onClick={() => pickTag('')} className="btn ghost sm mt-5">Show all posts</button> : undefined}
            />
          ) : (
            <>
              <motion.div key={featured.id} {...reveal('tilt3d')}>
                <FeaturedCard post={featured} />
              </motion.div>
              {rest.length > 0 && (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, i) => (
                    <motion.div key={p.id} {...alternate('rotateLeft', 'rotateRight', i % 3, 0.1)} className="flex">
                      <PostCard post={p} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function Empty({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-16 border border-dashed border-rule rounded-3xl">
      <p className="font-display font-bold text-xl text-ink">{title}</p>
      {body && <p className="text-muted mt-2">{body}</p>}
      {action}
    </div>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="font-display text-sm text-muted">
      {formatPostDate(post.publishedAt)} · {readMinutes(post.content)} min read
    </p>
  );
}

function Cover({ post, className = '' }: { post: Post; className?: string }) {
  return post.coverImage ? (
    <img
      src={post.coverImage}
      alt={post.coverAlt}
      loading="lazy"
      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    />
  ) : (
    <div className={`w-full h-full bg-gradient-to-br from-lav-2 via-lav to-paper flex items-end p-6 ${className}`} aria-hidden="true">
      <CrownIcon className="w-10 h-10 text-gold" />
    </div>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid lg:grid-cols-[1.25fr_1fr] gap-0 rounded-3xl border border-rule overflow-hidden bg-card hover:border-accent/50 hover:shadow-xl hover:shadow-ink/5 transition-all"
    >
      <div className="aspect-[16/9] lg:aspect-auto lg:min-h-[340px] overflow-hidden">
        <Cover post={post} />
      </div>
      <div className="p-7 sm:p-9 flex flex-col justify-center">
        {post.tags[0] && (
          <span className="self-start text-xs font-display font-semibold uppercase tracking-wider text-accent bg-lav px-2.5 py-1 rounded-full mb-4">
            {post.tags[0]}
          </span>
        )}
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink leading-tight group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        {post.excerpt && <p className="mt-3 text-muted leading-relaxed line-clamp-4">{post.excerpt}</p>}
        <div className="mt-6 flex items-center justify-between gap-4">
          <Meta post={post} />
          <span className="inline-flex items-center gap-1 font-display font-semibold text-sm text-accent">
            Read <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group w-full flex flex-col rounded-3xl border border-rule overflow-hidden bg-card hover:border-accent/50 hover:shadow-xl hover:shadow-ink/5 transition-all"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <Cover post={post} />
      </div>
      <div className="p-6 flex flex-col flex-1">
        {post.tags[0] && (
          <span className="self-start text-[11px] font-display font-semibold uppercase tracking-wider text-accent bg-lav px-2.5 py-1 rounded-full mb-3">
            {post.tags[0]}
          </span>
        )}
        <h3 className="font-display font-extrabold text-xl text-ink leading-snug group-hover:text-accent transition-colors">{post.title}</h3>
        {post.excerpt && <p className="mt-2 text-muted text-[0.98rem] leading-relaxed line-clamp-3">{post.excerpt}</p>}
        <div className="mt-auto pt-5">
          <Meta post={post} />
        </div>
      </div>
    </Link>
  );
}
