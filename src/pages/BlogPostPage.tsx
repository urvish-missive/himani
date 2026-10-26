import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGetPostBySlugQuery, useGetPublishedPostsQuery } from '../store/blogApi';
import type { Post } from '../lib/blog';
import { usePageMeta } from '../hooks/usePageMeta';
import PostArticle from '../components/blog/PostArticle';
import { PostCard } from './BlogPage';
import { alternate, reveal } from '../lib/motion';

export default function BlogPostPage() {
  const { slug = '' } = useParams();
  const { data: post, isLoading, isError } = useGetPostBySlugQuery(slug);

  usePageMeta({
    title: post ? post.seoTitle || `${post.title} · Himani Kankaria` : 'Blog · Himani Kankaria',
    description: post?.seoDescription || post?.excerpt || undefined,
    image: post?.coverImage || undefined,
    type: post ? 'article' : 'website',
    keywords: post?.keywords || undefined,
    canonical: post ? `${window.location.origin}/blog/${post.slug}` : undefined,
    publishedTime: post?.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
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
      <PostArticle key={post.id} post={post} />

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
