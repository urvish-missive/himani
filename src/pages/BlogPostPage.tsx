import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGetPostBySlugQuery, useGetPublishedPostsQuery } from '../store/blogApi';
import { formatPostDate, readMinutes, type Post } from '../lib/blog';
import { usePageMeta } from '../hooks/usePageMeta';
import Markdown from '../components/blog/Markdown';
import { PostCard } from './BlogPage';
import { alternate, enter, reveal } from '../lib/motion';

export default function BlogPostPage() {
  const { slug = '' } = useParams();
  const { data: post, isLoading, isError } = useGetPostBySlugQuery(slug);

  usePageMeta({
    title: post ? `${post.title} · Himani Kankaria` : 'Blog · Himani Kankaria',
    description: post?.excerpt || undefined,
    image: post?.coverImage || undefined,
    type: post ? 'article' : 'website',
  });

  if (isLoading) {
    return (
      <main className="max-w-[760px] mx-auto px-6 py-16 animate-pulse" aria-busy="true">
        <div className="h-4 w-32 bg-lav rounded" />
        <div className="h-10 w-full bg-lav rounded mt-6" />
        <div className="h-10 w-2/3 bg-lav rounded mt-3" />
        <div className="aspect-[16/9] bg-lav rounded-3xl mt-10" />
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="max-w-[760px] mx-auto px-6 py-24 text-center">
        <p className="font-display font-semibold text-accent text-sm uppercase tracking-wider">Blog</p>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mt-3">
          {isError ? "This post couldn't load" : "This post isn't available"}
        </h1>
        <p className="text-muted mt-4">
          {isError ? 'Refresh the page in a moment.' : 'It may have been moved or unpublished.'}
        </p>
        <Link to="/blog" className="btn ghost mt-8 inline-flex">
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-paper">
      <article key={post.id}>
        <header className="pt-10 sm:pt-14 pb-10 bg-gradient-to-b from-lav to-paper">
          <motion.div {...enter('clipUp')} className="max-w-[760px] mx-auto px-6">
            <Link to="/blog" className="inline-flex items-center gap-1.5 font-display font-semibold text-sm text-muted hover:text-accent">
              <ArrowLeft className="w-4 h-4" /> All posts
            </Link>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    to={`/blog?tag=${encodeURIComponent(t)}`}
                    className="text-xs font-display font-semibold uppercase tracking-wider text-accent bg-card border border-rule px-2.5 py-1 rounded-full hover:border-accent"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}
            <h1 className="mt-4 font-display font-extrabold text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] tracking-[-0.03em] text-ink">
              {post.title}
            </h1>
            {post.excerpt && <p className="mt-5 text-lg sm:text-xl text-muted leading-relaxed">{post.excerpt}</p>}
            <p className="mt-6 font-display text-sm text-muted">
              {post.author && <span className="text-ink font-semibold">{post.author}</span>}
              {post.author && ' · '}
              <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>{formatPostDate(post.publishedAt)}</time>
              {' · '}
              {readMinutes(post.content)} min read
            </p>
          </motion.div>
        </header>

        {post.coverImage && (
          <motion.div {...enter('zoomBlur', { delay: 0.2 })} className="max-w-[1000px] mx-auto px-6">
            <img
              src={post.coverImage}
              alt={post.coverAlt}
              className="w-full aspect-[16/9] object-cover rounded-3xl border border-rule"
            />
          </motion.div>
        )}

        <div className="max-w-[760px] mx-auto px-6 py-12">
          <Markdown>{post.content}</Markdown>

          <motion.aside {...reveal('tilt3d')} className="mt-16 rounded-3xl bg-ink text-paper p-8 sm:p-10">
            <p className="font-display font-semibold text-gold text-sm uppercase tracking-wider">Working on this problem?</p>
            <p className="mt-3 font-display font-extrabold text-2xl sm:text-3xl leading-tight">
              Tell me where your marketing is stuck and I'll suggest where to start.
            </p>
            <Link to="/#hire" className="btn gold mt-6 inline-flex">
              Send me a brief
            </Link>
          </motion.aside>
        </div>
      </article>

      <RelatedPosts post={post} />
    </main>
  );
}

function RelatedPosts({ post }: { post: Post }) {
  const { data: posts = [] } = useGetPublishedPostsQuery();
  const others = posts.filter((p) => p.id !== post.id);
  const shared = others.filter((p) => p.tags.some((t) => post.tags.includes(t)));
  const related = [...shared, ...others.filter((p) => !shared.includes(p))].slice(0, 3);
  if (!related.length) return null;

  return (
    <section className="border-t border-rule bg-paper-2 py-14">
      <div className="max-w-[1160px] mx-auto px-6">
        <motion.h2 {...reveal('skewLeft')} className="font-display font-extrabold text-2xl sm:text-3xl text-ink mb-8">
          Keep reading
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <motion.div key={p.id} {...alternate('rotateLeft', 'rotateRight', i, 0.1)} className="flex">
              <PostCard post={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
