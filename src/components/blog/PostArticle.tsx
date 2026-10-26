import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { formatPostDate, readMinutes, type Post } from '../../lib/blog';
import Markdown from './Markdown';
import { enter, reveal } from '../../lib/motion';

export type ArticlePost = Pick<Post, 'title' | 'excerpt' | 'content' | 'coverImage' | 'coverAlt' | 'tags' | 'author' | 'publishedAt'>;

/**
 * A blog post laid out as it appears on the site. The admin preview uses the
 * same component, with links switched off so it can't navigate away.
 */
export default function PostArticle({ post, preview = false }: { post: ArticlePost; preview?: boolean }) {
  const date = post.publishedAt ?? (preview ? Date.now() : null);
  return (
    <article>
      <header className="pt-10 sm:pt-14 pb-10 bg-gradient-to-b from-lav to-paper">
        <motion.div {...enter('clipUp')} className="max-w-[760px] mx-auto px-6">
          {preview ? (
            <span className="inline-flex items-center gap-1.5 font-display font-semibold text-sm text-muted">
              <ArrowLeft className="w-4 h-4" /> All posts
            </span>
          ) : (
            <Link to="/blog" className="inline-flex items-center gap-1.5 font-display font-semibold text-sm text-muted hover:text-accent">
              <ArrowLeft className="w-4 h-4" /> All posts
            </Link>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((t) => {
                const cls = 'text-xs font-display font-semibold uppercase tracking-wider text-accent bg-card border border-rule px-2.5 py-1 rounded-full hover:border-accent';
                return preview ? (
                  <span key={t} className={cls}>
                    {t}
                  </span>
                ) : (
                  <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`} className={cls}>
                    {t}
                  </Link>
                );
              })}
            </div>
          )}
          <h1 className="mt-4 font-display font-extrabold text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] tracking-[-0.03em] text-ink">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-5 text-lg sm:text-xl text-muted leading-relaxed">{post.excerpt}</p>}
          <p className="mt-6 font-display text-sm text-muted">
            {post.author && <span className="text-ink font-semibold">{post.author}</span>}
            {post.author && ' · '}
            <time dateTime={date ? new Date(date).toISOString() : undefined}>{formatPostDate(date)}</time>
            {' · '}
            {readMinutes(post.content)} min read
          </p>
        </motion.div>
      </header>

      {post.coverImage && (
        <motion.div {...enter('zoomBlur', { delay: 0.2 })} className="max-w-[1000px] mx-auto px-6">
          <img src={post.coverImage} alt={post.coverAlt} className="w-full aspect-[16/9] object-cover rounded-3xl border border-rule" />
        </motion.div>
      )}

      <div className="max-w-[760px] mx-auto px-6 py-12">
        <Markdown>{post.content}</Markdown>

        <motion.aside {...reveal('tilt3d')} className="mt-16 rounded-3xl bg-ink text-paper p-8 sm:p-10">
          <p className="font-display font-semibold text-gold text-sm uppercase tracking-wider">Working on this problem?</p>
          <p className="mt-3 font-display font-extrabold text-2xl sm:text-3xl leading-tight">
            Tell me where your marketing is stuck and I'll suggest where to start.
          </p>
          {preview ? (
            <span className="btn gold mt-6 inline-flex">Send me a brief</span>
          ) : (
            <Link to="/#hire" className="btn gold mt-6 inline-flex">
              Send me a brief
            </Link>
          )}
        </motion.aside>
      </div>
    </article>
  );
}
