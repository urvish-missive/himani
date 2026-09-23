import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import type { GeneratedDraft, GenerateInput, Post, PostInput } from '../lib/blog';
import type { ApiError } from './leadsApi';

// Firebase is imported on demand so the SDK stays out of the main page bundle.
async function firestore() {
  const [{ db, isFirebaseConfigured }, fs] = await Promise.all([import('../lib/firebase'), import('firebase/firestore')]);
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* environment variables.');
  return { db: db(), ...fs };
}

const toError = (err: unknown): ApiError => ({ message: err instanceof Error ? err.message : String(err) });

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
    status: data.status === 'published' ? 'published' : 'draft',
    publishedAt: millis(data.publishedAt),
    createdAt: millis(data.createdAt),
    updatedAt: millis(data.updatedAt),
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
          const { db, collection, getDocs, query, where } = await firestore();
          // Equality-only filter, so no composite index is needed; sorted here instead.
          const snap = await getDocs(query(collection(db, 'posts'), where('status', '==', 'published')));
          return { data: snap.docs.map(toPost).sort(newestFirst) };
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
          const { db, collection, getDocs, limit, query, where } = await firestore();
          const snap = await getDocs(
            query(collection(db, 'posts'), where('slug', '==', slug), where('status', '==', 'published'), limit(1))
          );
          return { data: snap.empty ? null : toPost(snap.docs[0]) };
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
          const { db, addDoc, collection, doc, getDocs, limit, query, serverTimestamp, updateDoc, where } = await firestore();

          // Slugs are the public URL, so they must be unique.
          const clash = await getDocs(query(collection(db, 'posts'), where('slug', '==', post.slug), limit(2)));
          if (clash.docs.some((d) => d.id !== id)) {
            return { error: { message: 'Another post already uses that URL. Change the URL field.' } };
          }

          const data: Record<string, unknown> = {
            ...post,
            title: post.title.trim(),
            excerpt: post.excerpt.trim(),
            coverImage: post.coverImage.trim(),
            coverAlt: post.coverAlt.trim(),
            author: post.author.trim(),
            updatedAt: serverTimestamp(),
          };
          // The publish date is stamped once, the first time a post goes live.
          if (post.status === 'published' && !wasPublished) data.publishedAt = serverTimestamp();

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
  }),
});

export const {
  useGeneratePostMutation,
  useGetPublishedPostsQuery,
  useGetPostBySlugQuery,
  useGetAllPostsQuery,
  useGetPostQuery,
  useSavePostMutation,
  useDeletePostMutation,
} = blogApi;
