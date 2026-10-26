import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { slugify, type GeneratedDraft, type GenerateInput, type Post, type PostInput, type PostStatus, type SeoSuggestInput, type SeoSuggestion } from '../lib/blog';
import type { ApiError } from './leadsApi';

// Firebase is imported on demand so the SDK stays out of the main page bundle.
async function firestore() {
  const [{ db, isFirebaseConfigured }, fs] = await Promise.all([import('../lib/firebase'), import('firebase/firestore')]);
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* environment variables.');
  return { db: db(), ...fs };
}

const toError = (err: unknown): ApiError => {
  if ((err as { code?: string })?.code === 'permission-denied') {
    return { message: "Firestore refused the request. Check you're an admin and that the latest firestore.rules are deployed." };
  }
  return { message: err instanceof Error ? err.message : String(err) };
};

const STATUSES: PostStatus[] = ['draft', 'published', 'scheduled'];

/**
 * Scheduled posts become visible once their time passes (see firestore.rules).
 * Visitors' clocks can run ahead of the server's, so ask for posts that went
 * live a couple of minutes ago or earlier; the rules would refuse anything later.
 */
const dueBefore = () => Date.now() - 2 * 60 * 1000;

const millis = (v: unknown) => (v && typeof (v as { toMillis?: () => number }).toMillis === 'function' ? (v as { toMillis: () => number }).toMillis() : null);

// Redux state must be serializable, so Firestore Timestamps become epoch millis.
function toPost(d: DocumentSnapshot<DocumentData>): Post {
  const data = d.data() ?? {};
  return {
    id: d.id,
    title: data.title ?? '',
    slug: data.slug ?? '',
    excerpt: data.excerpt ?? '',
    content: data.content ?? '',
    coverImage: data.coverImage ?? '',
    coverAlt: data.coverAlt ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author ?? '',
    status: STATUSES.includes(data.status) ? data.status : 'draft',
    seoTitle: data.seoTitle ?? '',
    seoDescription: data.seoDescription ?? '',
    keywords: data.keywords ?? '',
    scheduledAt: millis(data.scheduledAt),
    publishedAt: millis(data.publishedAt),
    createdAt: millis(data.createdAt),
    updatedAt: millis(data.updatedAt),
    ...(data.sourceHash ? { sourceHash: data.sourceHash, sourceFile: data.sourceFile ?? '' } : {}),
  };
}

const newestFirst = (a: Post, b: Post) => (b.publishedAt ?? b.createdAt ?? 0) - (a.publishedAt ?? a.createdAt ?? 0);

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fakeBaseQuery<ApiError>(),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    /** Public: every published post, newest first. */
    getPublishedPosts: build.query<Post[], void>({
      async queryFn() {
        try {
          const { db, collection, getDocs, query, where, Timestamp } = await firestore();
          // Equality-only filter, so no composite index is needed; sorted here instead.
          const snap = await getDocs(query(collection(db, 'posts'), where('status', '==', 'published')));
          const posts = snap.docs.map(toPost);
          // Scheduled posts whose time has come. Needs the index in firestore.indexes.json;
          // until it exists they appear once an admin opens the admin panel.
          try {
            const due = await getDocs(
              query(collection(db, 'posts'), where('status', '==', 'scheduled'), where('scheduledAt', '<=', Timestamp.fromMillis(dueBefore())))
            );
            posts.push(...due.docs.map(toPost));
          } catch {
            // Index or rules not deployed yet.
          }
          return { data: posts.sort(newestFirst) };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    /** Public: one published post by its URL slug; null when there is none. */
    getPostBySlug: build.query<Post | null, string>({
      async queryFn(slug) {
        try {
          const { db, collection, getDocs, limit, query, where, Timestamp } = await firestore();
          const snap = await getDocs(
            query(collection(db, 'posts'), where('slug', '==', slug), where('status', '==', 'published'), limit(1))
          );
          if (!snap.empty) return { data: toPost(snap.docs[0]) };
          try {
            const due = await getDocs(
              query(
                collection(db, 'posts'),
                where('slug', '==', slug),
                where('status', '==', 'scheduled'),
                where('scheduledAt', '<=', Timestamp.fromMillis(dueBefore())),
                limit(1)
              )
            );
            return { data: due.empty ? null : toPost(due.docs[0]) };
          } catch {
            return { data: null };
          }
        } catch (err) {
          return { error: toError(err) };
        }
      },
      providesTags: (_r, _e, slug) => [{ type: 'Post', id: `slug:${slug}` }],
    }),

    /** Admin: every post including drafts. */
    getAllPosts: build.query<Post[], void>({
      async queryFn() {
        try {
          const { db, collection, getDocs } = await firestore();
          const snap = await getDocs(collection(db, 'posts'));
          return { data: snap.docs.map(toPost).sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)) };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      providesTags: [{ type: 'Post', id: 'ADMIN_LIST' }],
    }),

    /** Admin: one post by id, drafts included. */
    getPost: build.query<Post | null, string>({
      async queryFn(id) {
        try {
          const { db, doc, getDoc } = await firestore();
          const snap = await getDoc(doc(db, 'posts', id));
          return { data: snap.exists() ? toPost(snap) : null };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      providesTags: (_r, _e, id) => [{ type: 'Post', id }],
    }),

    /** Admin: create (no id) or update a post. Resolves to the post id. */
    savePost: build.mutation<string, { id?: string; post: PostInput; wasPublished?: boolean }>({
      async queryFn({ id, post, wasPublished }) {
        try {
          const { db, addDoc, collection, doc, getDocs, limit, query, serverTimestamp, updateDoc, where, Timestamp } = await firestore();

          const cleanSlug = slugify(post.slug || post.title);

          // Slugs are the public URL, so they must be unique.
          const clash = await getDocs(query(collection(db, 'posts'), where('slug', '==', cleanSlug), limit(2)));
          if (clash.docs.some((d) => d.id !== id)) {
            return { error: { message: 'Another post already uses that URL. Change the URL field.' } };
          }

          const data: Record<string, unknown> = {
            ...post,
            slug: cleanSlug,
            title: post.title.trim(),
            excerpt: post.excerpt.trim(),
            coverImage: post.coverImage.trim(),
            coverAlt: post.coverAlt.trim(),
            author: post.author.trim(),
            seoTitle: post.seoTitle.trim(),
            seoDescription: post.seoDescription.trim(),
            keywords: post.keywords.trim(),
            scheduledAt: post.status === 'scheduled' && post.scheduledAt != null ? Timestamp.fromMillis(post.scheduledAt) : null,
            updatedAt: serverTimestamp(),
          };
          // Only set where known, so an edit never wipes where an imported post came from.
          if (!post.sourceHash) {
            delete data.sourceHash;
            delete data.sourceFile;
          }
          // The publish date is stamped once, the first time a post goes live.
          // A scheduled post is dated for when it goes live; one that never went live has none.
          if (post.status === 'scheduled' && !wasPublished) data.publishedAt = data.scheduledAt;
          else if (post.status === 'published' && !wasPublished) data.publishedAt = serverTimestamp();
          else if (post.status === 'draft' && !wasPublished) data.publishedAt = null;

          if (id) {
            await updateDoc(doc(db, 'posts', id), data);
            return { data: id };
          }
          const ref = await addDoc(collection(db, 'posts'), {
            publishedAt: null,
            ...data,
            createdAt: serverTimestamp(),
          });
          return { data: ref.id };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      invalidatesTags: (id, _e, arg) =>
        id
          ? [
              { type: 'Post', id },
              { type: 'Post', id: 'LIST' },
              { type: 'Post', id: 'ADMIN_LIST' },
              { type: 'Post', id: `slug:${arg.post.slug}` },
            ]
          : [],
    }),

    /** Admin: permanently delete a post. */
    deletePost: build.mutation<null, { id: string; slug: string }>({
      async queryFn({ id }) {
        try {
          const { db, deleteDoc, doc } = await firestore();
          await deleteDoc(doc(db, 'posts', id));
          return { data: null };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      invalidatesTags: (_r, _e, { id, slug }) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
        { type: 'Post', id: 'ADMIN_LIST' },
        { type: 'Post', id: `slug:${slug}` },
      ],
    }),

    /**
     * Admin: posts a bulk upload would duplicate. `byHash` is a post made from
     * the same Word file; `bySlug` is any post already using the URL.
     */
    findImportDuplicates: build.mutation<{ byHash: Post | null; bySlug: Post | null }, { hash: string; slug: string }>({
      async queryFn({ hash, slug }) {
        try {
          const { db, collection, getDocs, limit, query, where } = await firestore();
          const [byHash, bySlug] = await Promise.all([
            getDocs(query(collection(db, 'posts'), where('sourceHash', '==', hash), limit(1))),
            slug ? getDocs(query(collection(db, 'posts'), where('slug', '==', slug), limit(1))) : null,
          ]);
          return {
            data: {
              byHash: byHash.empty ? null : toPost(byHash.docs[0]),
              bySlug: !bySlug || bySlug.empty ? null : toPost(bySlug.docs[0]),
            },
          };
        } catch (err) {
          return { error: toError(err) };
        }
      },
    }),

    /** Admin: mark scheduled posts whose time has passed as published. Resolves to how many changed. */
    publishDuePosts: build.mutation<number, Post[]>({
      async queryFn(posts) {
        try {
          const { db, doc, serverTimestamp, updateDoc } = await firestore();
          const due = posts.filter((p) => p.status === 'scheduled' && p.scheduledAt != null && p.scheduledAt <= Date.now());
          await Promise.all(due.map((p) => updateDoc(doc(db, 'posts', p.id), { status: 'published', updatedAt: serverTimestamp() })));
          return { data: due.length };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      invalidatesTags: (n) => (n ? [{ type: 'Post', id: 'LIST' }, { type: 'Post', id: 'ADMIN_LIST' }] : []),
    }),

    /** Admin: suggest missing SEO details with AI. The post body is never changed. */
    suggestSeo: build.mutation<SeoSuggestion, SeoSuggestInput>({
      async queryFn(input) {
        try {
          const { auth } = await import('../lib/firebase');
          const user = auth().currentUser;
          if (!user) return { error: { message: 'Sign in again to use AI suggestions.' } };
          const token = await user.getIdToken();
          const res = await fetch('/api/suggest-seo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(input),
          });
          const body = await res.json().catch(() => null);
          if (!res.ok) return { error: { message: body?.error ?? `AI suggestions failed (${res.status}).` } };
          return { data: body as SeoSuggestion };
        } catch (err) {
          return { error: toError(err) };
        }
      },
    }),

    /** Admin: draft a post with AI. Runs on the server so AI keys stay private. */
    generatePost: build.mutation<GeneratedDraft, GenerateInput>({
      async queryFn(input) {
        try {
          const { auth } = await import('../lib/firebase');
          const user = auth().currentUser;
          if (!user) return { error: { message: 'Sign in again to use AI drafting.' } };
          const token = await user.getIdToken();
          const res = await fetch('/api/generate-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(input),
          });
          const body = await res.json().catch(() => null);
          if (!res.ok) return { error: { message: body?.error ?? `AI drafting failed (${res.status}).` } };
          return { data: body as GeneratedDraft };
        } catch (err) {
          return { error: toError(err) };
        }
      },
    }),

    /** Admin: generate an image for a visual placeholder. Runs on the server. */
    generateVisual: build.mutation<
      { imageUrl: string; dataUrl: string; prompt: string; label?: string },
      { prompt: string; label?: string; style?: 'mockup' | 'infographic' | 'editorial' | 'photo' | 'auto'; width?: number; height?: number }
    >({
      async queryFn(input) {
        try {
          const { auth } = await import('../lib/firebase');
          const user = auth().currentUser;
          if (!user) return { error: { message: 'Sign in again to generate visuals.' } };
          const token = await user.getIdToken();
          const res = await fetch('/api/generate-visual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(input),
          });
          const body = await res.json().catch(() => null);
          if (!res.ok) return { error: { message: body?.error ?? `Visual generation failed (${res.status}).` } };
          return { data: body };
        } catch (err) {
          return { error: toError(err) };
        }
      },
    }),
  }),
});

export const {
  useGeneratePostMutation,
  useGenerateVisualMutation,
  useGetPublishedPostsQuery,
  useGetPostBySlugQuery,
  useGetAllPostsQuery,
  useGetPostQuery,
  useSavePostMutation,
  useDeletePostMutation,
  usePublishDuePostsMutation,
  useSuggestSeoMutation,
  useFindImportDuplicatesMutation,
} = blogApi;
