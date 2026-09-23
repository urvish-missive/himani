import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { Lead, LeadInput, LeadStatus } from '../lib/leads';

export interface ApiError {
  message: string;
}

// Firebase is imported on demand so the SDK stays out of the main page bundle.
async function firestore() {
  const [{ db, isFirebaseConfigured }, fs] = await Promise.all([import('../lib/firebase'), import('firebase/firestore')]);
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* environment variables.');
  return { db: db(), ...fs };
}

const toError = (err: unknown): ApiError => ({ message: err instanceof Error ? err.message : String(err) });

// Redux state must be serializable, so the Firestore Timestamp becomes epoch millis.
function toLead(d: QueryDocumentSnapshot<DocumentData>): Lead {
  const data = d.data();
  return {
    id: d.id,
    source: data.source,
    name: data.name ?? '',
    email: data.email ?? '',
    company: data.company ?? '',
    message: data.message ?? '',
    details: data.details ?? {},
    status: data.status ?? 'new',
    page: data.page ?? '',
    createdAt: data.createdAt?.toMillis?.() ?? null,
    notes: data.notes ?? '',
    updatedAt: data.updatedAt?.toMillis?.() ?? null,
  };
}

/** Applies a change to cached leads immediately and rolls it back if the write fails. */
function optimistic(
  dispatch: (action: unknown) => unknown,
  queryFulfilled: Promise<unknown>,
  recipe: (draft: Lead[]) => Lead[] | void
) {
  const patch = dispatch(leadsApi.util.updateQueryData('getLeads', undefined, recipe)) as { undo: () => void };
  queryFulfilled.catch(patch.undo);
}

const clean = (v: string | undefined, max: number) => (v ?? '').trim().slice(0, max);

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
  baseQuery: fakeBaseQuery<ApiError>(),
  tagTypes: ['Leads', 'Admin'],
  endpoints: (build) => ({
    /** Public: saves a form submission. */
    submitLead: build.mutation<{ id: string }, LeadInput>({
      async queryFn(input) {
        try {
          // A missing config (e.g. env vars not set on Vercel) must not block visitors from booking.
          const { isFirebaseConfigured } = await import('../lib/firebase');
          if (!isFirebaseConfigured) {
            console.warn('[leads] Firebase is not configured; lead not saved.');
            return { data: { id: '' } };
          }
          const { db, addDoc, collection, serverTimestamp } = await firestore();
          const details: Record<string, string> = {};
          for (const [k, v] of Object.entries(input.details ?? {})) {
            const value = clean(v, 500);
            if (value) details[clean(k, 60)] = value;
          }
          const ref = await addDoc(collection(db, 'leads'), {
            source: input.source,
            name: clean(input.name, 120),
            email: clean(input.email, 200).toLowerCase(),
            company: clean(input.company, 160),
            message: clean(input.message, 2000),
            details,
            status: 'new',
            page: window.location.pathname.slice(0, 200),
            createdAt: serverTimestamp(),
          });
          return { data: { id: ref.id } };
        } catch (err) {
          console.error('[leads] Failed to save lead', err);
          return { error: toError(err) };
        }
      },
    }),

    /** Admin: whether this signed-in user has a document in /admins. */
    checkAdmin: build.query<boolean, string>({
      async queryFn(uid) {
        try {
          const { db, doc, getDoc } = await firestore();
          const snap = await getDoc(doc(db, 'admins', uid));
          return { data: snap.exists() };
        } catch (err) {
          // Firestore rules deny the read for non-admins in some setups; treat as "not an admin".
          console.warn('[admin] Admin check failed', err);
          return { data: false };
        }
      },
      providesTags: ['Admin'],
    }),

    /** Admin: newest leads first, kept live with a Firestore listener while the query is in use. */
    getLeads: build.query<Lead[], void>({
      async queryFn() {
        try {
          const { db, collection, getDocs, limit, orderBy, query } = await firestore();
          const snap = await getDocs(query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(1000)));
          return { data: snap.docs.map(toLead) };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          const { db, collection, limit, onSnapshot, orderBy, query } = await firestore();
          unsubscribe = onSnapshot(
            query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(1000)),
            (snap) => updateCachedData(() => snap.docs.map(toLead)),
            (err) => console.error('[leads] Live updates stopped', err)
          );
        } catch {
          // Initial load failed; the query's error state already covers it.
        }
        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['Leads'],
    }),

    /** Admin: change a lead's status and/or private notes (applied optimistically). */
    updateLead: build.mutation<null, { id: string; status?: LeadStatus; notes?: string }>({
      async queryFn({ id, ...changes }) {
        try {
          const { db, doc, updateDoc, serverTimestamp } = await firestore();
          const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
          if (changes.status) data.status = changes.status;
          if (changes.notes !== undefined) data.notes = changes.notes.slice(0, 5000);
          await updateDoc(doc(db, 'leads', id), data);
          return { data: null };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      onQueryStarted({ id, ...changes }, { dispatch, queryFulfilled }) {
        optimistic(dispatch, queryFulfilled, (draft) => {
          const lead = draft.find((l) => l.id === id);
          if (!lead) return;
          if (changes.status) lead.status = changes.status;
          if (changes.notes !== undefined) lead.notes = changes.notes;
          lead.updatedAt = Date.now();
        });
      },
    }),

    /** Admin: set the same status on many leads at once. */
    bulkUpdateStatus: build.mutation<null, { ids: string[]; status: LeadStatus }>({
      async queryFn({ ids, status }) {
        try {
          const { db, doc, writeBatch, serverTimestamp } = await firestore();
          // Firestore batches are capped at 500 writes.
          for (let i = 0; i < ids.length; i += 450) {
            const batch = writeBatch(db);
            ids.slice(i, i + 450).forEach((id) => batch.update(doc(db, 'leads', id), { status, updatedAt: serverTimestamp() }));
            await batch.commit();
          }
          return { data: null };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      onQueryStarted({ ids, status }, { dispatch, queryFulfilled }) {
        const set = new Set(ids);
        optimistic(dispatch, queryFulfilled, (draft) => {
          draft.forEach((l) => {
            if (set.has(l.id)) l.status = status;
          });
        });
      },
    }),

    /** Admin: permanently delete one or more leads (applied optimistically). */
    deleteLeads: build.mutation<null, string[]>({
      async queryFn(ids) {
        try {
          const { db, doc, writeBatch } = await firestore();
          for (let i = 0; i < ids.length; i += 450) {
            const batch = writeBatch(db);
            ids.slice(i, i + 450).forEach((id) => batch.delete(doc(db, 'leads', id)));
            await batch.commit();
          }
          return { data: null };
        } catch (err) {
          return { error: toError(err) };
        }
      },
      onQueryStarted(ids, { dispatch, queryFulfilled }) {
        const set = new Set(ids);
        optimistic(dispatch, queryFulfilled, (draft) => draft.filter((l) => !set.has(l.id)));
      },
    }),
  }),
});

export const {
  useSubmitLeadMutation,
  useCheckAdminQuery,
  useGetLeadsQuery,
  useUpdateLeadMutation,
  useBulkUpdateStatusMutation,
  useDeleteLeadsMutation,
} = leadsApi;
