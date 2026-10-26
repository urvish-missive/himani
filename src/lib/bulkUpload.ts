// Bulk blog upload: turns a batch of Word documents into blog posts in the
// background. The queue lives outside React, so files keep processing while the
// admin moves around the admin panel, and it survives the upload page unmounting.
//
//   const { items, settings } = useBulkUpload();
//   bulkUpload.addFiles(files);

import { useSyncExternalStore } from 'react';
import { store } from '../store';
import { blogApi } from '../store/blogApi';
import {
  DEFAULT_AUTHOR,
  POST_LIMITS,
  SEO_HINTS,
  isLive,
  nextFreeSlug,
  parseTags,
  slugify,
  validatePost,
  type Post,
  type PostInput,
  type PostStatus,
  type SeoSuggestInput,
} from './blog';
import type { DocImage } from './documentImport';

/** Stands in for an image's URL in a parsed document until the image is uploaded. */
export const IMAGE_PLACEHOLDER = 'bulk-image:';

/** File types that can be imported, for file pickers. */
export const IMPORT_ACCEPT =
  '.docx,.doc,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/pdf';

export type Stage =
  | 'queued'
  | 'reading' // extracting text and images from the document
  | 'images' // uploading images
  | 'checking' // looking for duplicates
  | 'ready' // waiting for the admin to review it
  | 'saving'
  | 'done'
  | 'duplicate' // the same file was imported before
  | 'error'; // processing failed; can be retried

/** What to do once a file has been read and checked. */
export type Intent = 'review' | 'draft' | 'publish' | 'schedule';

export interface Issue {
  /** Errors stop a post being published; warnings are flagged for editing. */
  level: 'error' | 'warning';
  field?: 'title' | 'slug' | 'excerpt' | 'seoTitle' | 'seoDescription' | 'tags' | 'keywords' | 'coverImage' | 'coverAlt' | 'content';
  message: string;
}

/** Editable post fields; tags stay as typed until saving. */
export type Fields = Omit<PostInput, 'tags' | 'status' | 'scheduledAt' | 'sourceHash' | 'sourceFile'> & { tags: string };

export interface BulkItem {
  id: string;
  file: File;
  stage: Stage;
  /** 0 to 100 while processing. */
  progress: number;
  /** What failed, for the error stage or a failed save. */
  error: string;
  intent: Intent;
  /** When this item should go live, for the schedule intent. */
  scheduleAt: number | null;
  hash: string;
  fields: Fields | null;
  /** Problems found in the document itself (images that couldn't upload, a guessed title). */
  docIssues: Issue[];
  issues: Issue[];
  /** Fields the AI filled in, so they can be checked. */
  aiFilled: string[];
  aiBusy: boolean;
  /** Another post already using this URL. */
  slugTaken: Pick<Post, 'id' | 'title' | 'slug'> | null;
  /** A post made from this same file before. */
  duplicateOf: Pick<Post, 'id' | 'title' | 'slug' | 'status'> | null;
  /** The admin chose to import it again anyway. */
  allowDuplicate: boolean;
  /** The saved post. */
  saved: { id: string; slug: string; status: PostStatus; scheduledAt: number | null } | null;
  stats: { images: number; headings: number; tables: number; links: number; words: number } | null;
}

export interface Settings {
  intent: Intent;
  /** First publish time for the schedule intent. */
  scheduleAt: number | null;
  /** Hours between scheduled posts, so a batch doesn't all go out at once. */
  spacingHours: number;
}

interface State {
  items: BulkItem[];
  settings: Settings;
}

const ACCEPT = /\.(docx|doc|pdf)$/i;
const MAX_FILE = 30 * 1024 * 1024;
const CONCURRENCY = 2;

let state: State = {
  items: [],
  settings: { intent: 'review', scheduleAt: null, spacingHours: 0 },
};
const listeners = new Set<() => void>();
let running = 0;

function emit() {
  listeners.forEach((l) => l());
}

function patch(id: string, change: Partial<BulkItem> | ((item: BulkItem) => Partial<BulkItem>)) {
  state = {
    ...state,
    items: state.items.map((it) => {
      if (it.id !== id) return it;
      const next = { ...it, ...(typeof change === 'function' ? change(it) : change) };
      return { ...next, issues: next.fields ? computeIssues(next) : next.issues };
    }),
  };
  emit();
}

const get = (id: string) => state.items.find((i) => i.id === id);

// ---------------------------------------------------------------- Validation

function toInput(item: BulkItem, status: PostStatus, scheduledAt: number | null): PostInput {
  const f = item.fields!;
  return {
    ...f,
    slug: f.slug || slugify(f.title),
    tags: parseTags(f.tags),
    author: f.author || DEFAULT_AUTHOR,
    status,
    scheduledAt: status === 'scheduled' ? scheduledAt : null,
    sourceHash: item.hash,
    sourceFile: item.file.name.slice(0, 300),
  };
}

function computeIssues(item: BulkItem): Issue[] {
  const f = item.fields!;
  const issues: Issue[] = [...item.docIssues];
  const invalid = validatePost(toInput(item, 'published', Date.now()));
  if (invalid) issues.push({ level: 'error', message: invalid, field: /URL/.test(invalid) ? 'slug' : /title/i.test(invalid) ? 'title' : 'content' });
  if (item.slugTaken) {
    issues.push({ level: 'error', field: 'slug', message: `“${item.slugTaken.title || 'Another post'}” already uses /blog/${item.slugTaken.slug}. Change the URL.` });
  }
  const sameUrl = state.items.find((o) => o.id !== item.id && o.fields && o.stage !== 'duplicate' && (o.fields.slug || slugify(o.fields.title)) === (f.slug || slugify(f.title)));
  if (sameUrl) issues.push({ level: 'error', field: 'slug', message: `${sameUrl.file.name} in this upload has the same URL. Change one of them.` });

  const description = f.seoDescription || f.excerpt;
  if (!description) issues.push({ level: 'warning', field: 'seoDescription', message: 'No meta description or summary in the document.' });
  else if (description.length > SEO_HINTS.description) {
    issues.push({ level: 'warning', field: 'seoDescription', message: `Meta description is ${description.length} characters; search results show about ${SEO_HINTS.description}.` });
  }
  if (!f.excerpt) issues.push({ level: 'warning', field: 'excerpt', message: 'No summary for the blog list.' });
  const seoTitle = f.seoTitle || f.title;
  if (seoTitle.length > SEO_HINTS.title) {
    issues.push({ level: 'warning', field: 'seoTitle', message: `SEO title is ${seoTitle.length} characters; search results show about ${SEO_HINTS.title}.` });
  }
  if (!parseTags(f.tags).length) issues.push({ level: 'warning', field: 'tags', message: 'No tags, so the post won’t show under a topic filter.' });
  if (!f.keywords) issues.push({ level: 'warning', field: 'keywords', message: 'No focus keyword.' });
  if (!f.coverImage) issues.push({ level: 'warning', field: 'coverImage', message: 'No cover image.' });
  else if (!f.coverAlt) issues.push({ level: 'warning', field: 'coverAlt', message: 'The cover image has no description for screen readers.' });
  const noAlt = (f.content.match(/!\[\]\(/g) ?? []).length;
  if (noAlt) issues.push({ level: 'warning', field: 'content', message: `${noAlt} image${noAlt > 1 ? 's have' : ' has'} no alt text. Add it in Word or in the editor.` });
  return issues;
}

export const hasErrors = (item: BulkItem) => item.issues.some((i) => i.level === 'error');

// ---------------------------------------------------------------- Processing

async function sha256(buf: ArrayBuffer) {
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const BROWSER_IMAGES = /^image\/(png|jpe?g|gif|webp|svg\+xml|avif|bmp)$/;
const EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/avif': 'avif', 'image/bmp': 'bmp' };

/** Large photos are resized to 2000px wide and saved as WebP, so posts load quickly. */
async function shrink(img: DocImage): Promise<{ blob: Blob; type: string }> {
  const original = new Blob([img.data], { type: img.contentType });
  if (!/^image\/(png|jpe?g|bmp)$/.test(img.contentType) || original.size < 400 * 1024) return { blob: original, type: img.contentType };
  try {
    const bitmap = await createImageBitmap(original);
    const scale = Math.min(1, 2000 / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const webp = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.86));
    if (webp && webp.type === 'image/webp' && webp.size < original.size) return { blob: webp, type: 'image/webp' };
  } catch {
    // Keep the original.
  }
  return { blob: original, type: img.contentType };
}

/** Uploads the document's images to Cloud Storage. Resolves to each image's URL, or an error. */
async function uploadImages(hash: string, images: DocImage[], onProgress: (done: number) => void) {
  const [{ firebaseApp }, { getStorage, ref, uploadBytes, getDownloadURL }] = await Promise.all([import('./firebase'), import('firebase/storage')]);
  const storage = getStorage(firebaseApp());
  const urls: (string | Error)[] = [];
  let done = 0;
  for (const img of images) {
    if (!BROWSER_IMAGES.test(img.contentType)) {
      const kind = img.contentType.replace(/^image\/(x-)?/, '').toUpperCase();
      urls[img.index] = new Error(`Image ${img.index + 1} is a ${kind} file, which browsers can't show. Save it as PNG or JPG in Word and upload again, or add it in the editor.`);
    } else {
      try {
        const { blob, type } = await shrink(img);
        // Named by the file's hash, so a retry overwrites rather than duplicates.
        const path = `blog-images/${hash.slice(0, 20)}/${img.index + 1}.${EXT[type] ?? 'img'}`;
        const r = ref(storage, path);
        await uploadBytes(r, blob, { contentType: type, cacheControl: 'public, max-age=31536000, immutable' });
        urls[img.index] = await getDownloadURL(r);
      } catch (err) {
        const code = (err as { code?: string }).code ?? '';
        urls[img.index] = new Error(
          code === 'storage/unauthorized'
            ? 'Image upload was refused. Deploy storage.rules (see README) and check you are an admin.'
            : code === 'storage/no-default-bucket' || code === 'storage/unknown'
            ? 'Image upload failed. Make sure Firebase Storage is enabled for this project.'
            : `Image ${img.index + 1} couldn't upload: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
    onProgress(++done);
  }
  return urls;
}

export interface Converted {
  fields: Fields;
  /** Problems found in the document itself. */
  docIssues: Issue[];
  stats: NonNullable<BulkItem['stats']>;
}

/**
 * Reads one file into post fields and uploads its images. `check` runs after
 * reading and before uploading; returning false stops there (such as for a duplicate).
 */
async function convert(
  file: File,
  hash: string,
  onProgress: (stage: 'images', progress: number) => void,
  check: (slug: string) => Promise<boolean> = async () => true
): Promise<Converted | null> {
  const { parseDocument } = await import('./documentImport');
  const doc = await parseDocument(file);
  const slug = doc.meta.slug || slugify(doc.title);
  if (!(await check(slug))) return null;

  const docIssues: Issue[] = doc.notes.map((message) => ({ level: 'warning', field: 'content', message }));
  let content = doc.content;
  let coverImage = doc.meta.coverImage;
  let coverAlt = doc.meta.coverAlt;

  if (doc.images.length) {
    onProgress('images', 40);
    const urls = await uploadImages(hash, doc.images, (n) => onProgress('images', 40 + Math.round((n / doc.images.length) * 45)));
    const failed = urls.filter((u): u is Error => u instanceof Error);
    // Images that couldn't upload are taken out, and the post can't be published until they're added back.
    content = content.replace(new RegExp(`!\\[([^\\]]*)\\]\\(${IMAGE_PLACEHOLDER}(\\d+)\\)`, 'g'), (_m, alt: string, i: string) => {
      const url = urls[Number(i)];
      return typeof url === 'string' ? `![${alt}](${url})` : '';
    });
    content = content.replace(/\n{3,}/g, '\n\n').trim();
    if (doc.coverImageIndex != null) {
      const url = urls[doc.coverImageIndex];
      if (typeof url === 'string') {
        coverImage = url;
        coverAlt = coverAlt || doc.images[doc.coverImageIndex].alt;
      }
    }
    [...new Set(failed.map((e) => e.message))].forEach((message) => docIssues.push({ level: 'error', field: 'content', message }));
  }

  if (doc.titleFrom === 'file') {
    docIssues.push({ level: 'warning', field: 'title', message: 'No title heading in the document, so the file name was used.' });
  }
  if (content.length > POST_LIMITS.content) docIssues.push({ level: 'error', field: 'content', message: 'The document is too long for one post. Split it in two.' });

  const fields: Fields = {
    title: doc.title.slice(0, POST_LIMITS.title),
    slug: slug.slice(0, POST_LIMITS.slug),
    excerpt: (doc.meta.excerpt || doc.meta.seoDescription).slice(0, POST_LIMITS.excerpt),
    content,
    coverImage: coverImage.slice(0, POST_LIMITS.coverImage),
    coverAlt: coverAlt.slice(0, POST_LIMITS.coverAlt),
    tags: parseTags(doc.meta.tags.join(',')).join(', '),
    author: (doc.meta.author || DEFAULT_AUTHOR).slice(0, 80),
    seoTitle: doc.meta.seoTitle.slice(0, POST_LIMITS.seoTitle),
    seoDescription: doc.meta.seoDescription.slice(0, POST_LIMITS.seoDescription),
    keywords: doc.meta.keywords.slice(0, POST_LIMITS.keywords),
  };
  const words = content.replace(/!\[[^\]]*\]\([^)]*\)|[#>*_`~|\-[\]()\\]/g, ' ').split(/\s+/).filter(Boolean).length;
  return { fields, docIssues, stats: { images: doc.images.length, headings: doc.headingCount, tables: doc.tableCount, links: doc.linkCount, words } };
}

/**
 * Imports one document for the post editor: the same reading and image upload
 * as a bulk upload, without the queue. Rejects with a readable message.
 */
export async function importSingleFile(file: File): Promise<Converted & { hash: string }> {
  if (!ACCEPT.test(file.name)) throw new Error('Choose a .docx, .doc or .pdf file.');
  if (file.size > MAX_FILE) throw new Error('That file is larger than 30 MB.');
  try {
    const hash = await sha256(await file.arrayBuffer());
    const result = await convert(file, hash, () => {});
    return { ...result!, hash };
  } catch (err) {
    throw new Error(friendly(err));
  }
}

async function process(id: string) {
  const item = get(id);
  if (!item) return;
  try {
    patch(id, { stage: 'reading', progress: 5, error: '' });
    const buf = await item.file.arrayBuffer();
    const hash = await sha256(buf);

    // The same file twice in one upload.
    const twin = state.items.find((o) => o.id !== id && o.hash === hash && o.stage !== 'duplicate');
    if (twin && !item.allowDuplicate) {
      patch(id, { hash, stage: 'duplicate', progress: 100, duplicateOf: null, error: `Same file as ${twin.file.name} in this upload.` });
      return;
    }
    patch(id, { hash, progress: 15 });

    let slugTaken: BulkItem['slugTaken'] = null;
    let freeSlug = '';
    const result = await convert(
      item.file,
      hash,
      (stage, progress) => get(id) && patch(id, { stage, progress }),
      async (slug) => {
        if (!get(id)) return false; // removed meanwhile
        patch(id, { progress: 35 });
        // Was this file imported before?
        const dupes = await store.dispatch(blogApi.endpoints.findImportDuplicates.initiate({ hash, slug })).unwrap();
        if (dupes.byHash && !item.allowDuplicate) {
          const { id: postId, title, slug: s, status } = dupes.byHash;
          patch(id, { stage: 'duplicate', progress: 100, duplicateOf: { id: postId, title, slug: s, status } });
          return false;
        }
        if (dupes.bySlug) {
          // A deliberate re-import gets the next free URL instead of clashing with the first copy.
          const taken = dupes.bySlug.slug;
          if (item.allowDuplicate) freeSlug = nextFreeSlug(slug, (x) => x === taken);
          else slugTaken = { id: dupes.bySlug.id, title: dupes.bySlug.title, slug: taken };
        }
        return true;
      }
    );
    if (!result || !get(id)) return;
    if (freeSlug) result.fields.slug = freeSlug;

    patch(id, { stage: 'ready', progress: 100, fields: result.fields, docIssues: result.docIssues, slugTaken, stats: result.stats });

    const ready = get(id)!;
    if (ready.intent !== 'review') await save(id, ready.intent);
  } catch (err) {
    patch(id, { stage: 'error', progress: 0, error: friendly(err) });
  }
}

function friendly(err: unknown) {
  const msg = (err as { message?: string })?.message ?? String(err);
  if (/end of central directory|zip|corrupted|CFB|Header Signature/i.test(msg)) return "This file couldn't be opened as a Word document. Re-save it as .docx and try again.";
  if (/Invalid PDF|InvalidPDFException/i.test(msg)) return "This file couldn't be opened as a PDF. Re-save it and try again.";
  if (/PasswordException|password/i.test(msg) && !/protected\./.test(msg)) return 'This file is password protected. Remove the password and try again.';
  return msg;
}

function pump() {
  while (running < CONCURRENCY) {
    const next = state.items.find((i) => i.stage === 'queued');
    if (!next) return;
    running++;
    patch(next.id, { stage: 'reading' });
    process(next.id).finally(() => {
      running--;
      pump();
    });
  }
}

/** When the next post in a scheduled batch goes live. */
function scheduleTimeFor(item: BulkItem) {
  if (item.scheduleAt) return item.scheduleAt;
  const { scheduleAt, spacingHours } = state.settings;
  if (!scheduleAt) return null;
  const alreadyScheduled = state.items.filter((i) => i.id !== item.id && i.saved?.status === 'scheduled').length;
  return scheduleAt + alreadyScheduled * spacingHours * 3600_000;
}

/**
 * Saves the post. Publishing and scheduling only happen when nothing blocks
 * them; otherwise the post is kept as a draft with its problems listed.
 */
async function save(id: string, intent: Exclude<Intent, 'review'>) {
  const item = get(id);
  if (!item?.fields) return;
  let status: PostStatus = intent === 'publish' ? 'published' : intent === 'schedule' ? 'scheduled' : 'draft';
  const scheduledAt = status === 'scheduled' ? scheduleTimeFor(item) : null;
  let note = '';
  if (status === 'scheduled' && !scheduledAt) {
    status = 'draft';
    note = 'Saved as a draft because no publish time was picked.';
  }
  // A URL clash can't be saved at all, even as a draft.
  if (item.issues.some((i) => i.level === 'error' && i.field === 'slug')) {
    patch(id, { stage: item.saved ? 'done' : 'ready', error: 'Change the URL before saving.' });
    return;
  }
  if (status !== 'draft' && hasErrors(item)) {
    status = 'draft';
    note = 'Saved as a draft. Fix the problems below, then publish.';
  }

  patch(id, { stage: 'saving', error: '' });
  try {
    const post = toInput(item, status, scheduledAt);
    const postId = await store
      .dispatch(blogApi.endpoints.savePost.initiate({ id: item.saved?.id, post, wasPublished: item.saved ? isLive(item.saved) : false }))
      .unwrap();
    patch(id, { stage: 'done', saved: { id: postId, slug: post.slug, status, scheduledAt }, error: note, intent });
  } catch (err) {
    const message = friendly(err);
    patch(id, (it) => ({
      stage: it.saved ? 'done' : 'ready',
      error: message,
      // Someone took the URL since it was checked.
      slugTaken: /already uses that URL/.test(message) ? { id: '', title: 'Another post', slug: it.fields!.slug } : it.slugTaken,
    }));
  }
}

// ---------------------------------------------------------------- Public API

export const bulkUpload = {
  /** Queues Word documents. Resolves to the names of files that were skipped and why. */
  addFiles(files: Iterable<File>) {
    const skipped: string[] = [];
    const added: BulkItem[] = [];
    for (const file of files) {
      if (!ACCEPT.test(file.name)) {
        skipped.push(`${file.name}: only Word (.docx, .doc) and PDF files can be imported.`);
        continue;
      }
      if (file.size > MAX_FILE) {
        skipped.push(`${file.name}: larger than 30 MB.`);
        continue;
      }
      if (file.name.startsWith('~$')) continue; // Word's lock files
      if ([...state.items, ...added].some((i) => i.file.name === file.name && i.file.size === file.size && i.file.lastModified === file.lastModified && i.stage !== 'error')) {
        skipped.push(`${file.name}: already in this upload.`);
        continue;
      }
      added.push({
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        stage: 'queued',
        progress: 0,
        error: '',
        intent: state.settings.intent,
        scheduleAt: null,
        hash: '',
        fields: null,
        docIssues: [],
        issues: [],
        aiFilled: [],
        aiBusy: false,
        slugTaken: null,
        duplicateOf: null,
        allowDuplicate: false,
        saved: null,
        stats: null,
      });
    }
    state = { ...state, items: [...state.items, ...added] };
    emit();
    pump();
    return skipped;
  },

  setSettings(change: Partial<Settings>) {
    state = { ...state, settings: { ...state.settings, ...change } };
    emit();
  },

  /** Edits a post's details before (or after) saving. */
  edit(id: string, change: Partial<Fields>) {
    patch(id, (it) => ({
      fields: it.fields ? { ...it.fields, ...change } : it.fields,
      // A new URL needs checking again when saved.
      slugTaken: 'slug' in change || 'title' in change ? null : it.slugTaken,
      aiFilled: it.aiFilled.filter((f) => !(f in change)),
      error: '',
    }));
    // Other files' URL checks depend on this one.
    if ('slug' in change || 'title' in change) state.items.forEach((o) => o.id !== id && o.fields && patch(o.id, {}));
  },

  /** Gives the post a URL nobody else is using. */
  freeSlug(id: string) {
    const item = get(id);
    if (!item?.fields) return;
    const taken = new Set([item.slugTaken?.slug, ...state.items.filter((o) => o.id !== id && o.fields).map((o) => o.fields!.slug)]);
    const base = item.fields.slug || slugify(item.fields.title);
    bulkUpload.edit(id, { slug: nextFreeSlug(base, (s) => taken.has(s)) });
  },

  save(id: string, intent: Exclude<Intent, 'review'>, scheduleAt?: number) {
    if (scheduleAt) patch(id, { scheduleAt });
    return save(id, intent);
  },

  /** Saves every reviewed post that hasn't been saved yet. */
  saveAll(intent: Exclude<Intent, 'review'>) {
    return Promise.all(state.items.filter((i) => i.stage === 'ready').map((i) => save(i.id, intent)));
  },

  /** Tries a failed file again from the start. */
  retry(id: string) {
    patch(id, { stage: 'queued', progress: 0, error: '', fields: null, docIssues: [], issues: [], duplicateOf: null, slugTaken: null });
    pump();
  },

  /** Imports a file that was imported before, as a separate post with its own URL. */
  importAnyway(id: string) {
    patch(id, { stage: 'queued', progress: 0, duplicateOf: null, error: '', allowDuplicate: true });
    pump();
  },

  /** Fills empty SEO fields with AI suggestions. The article text is never changed. */
  async suggestSeo(id: string) {
    const item = get(id);
    if (!item?.fields || item.aiBusy) return;
    const f = item.fields;
    const want = (
      [
        ['excerpt', f.excerpt],
        ['seoTitle', f.seoTitle],
        ['seoDescription', f.seoDescription],
        ['tags', f.tags],
        ['keywords', f.keywords],
      ] as const
    )
      .filter(([, v]) => !v.trim())
      .map(([k]) => k) as SeoSuggestInput['want'];
    if (!want.length) return;
    patch(id, { aiBusy: true, error: '' });
    try {
      const s = await store.dispatch(blogApi.endpoints.suggestSeo.initiate({ title: f.title, content: f.content.slice(0, 24_000), want })).unwrap();
      const current = get(id)?.fields;
      if (!current) return;
      const change: Partial<Fields> = {};
      if (want.includes('excerpt') && s.excerpt && !current.excerpt) change.excerpt = s.excerpt.slice(0, POST_LIMITS.excerpt);
      if (want.includes('seoTitle') && s.seoTitle && !current.seoTitle) change.seoTitle = s.seoTitle.slice(0, POST_LIMITS.seoTitle);
      if (want.includes('seoDescription') && s.seoDescription && !current.seoDescription) change.seoDescription = s.seoDescription.slice(0, POST_LIMITS.seoDescription);
      if (want.includes('tags') && s.tags?.length && !current.tags) change.tags = parseTags(s.tags.join(',')).join(', ');
      if (want.includes('keywords') && s.keywords && !current.keywords) change.keywords = s.keywords.slice(0, POST_LIMITS.keywords);
      patch(id, (it) => ({ fields: { ...it.fields!, ...change }, aiFilled: [...new Set([...it.aiFilled, ...Object.keys(change)])], aiBusy: false }));
    } catch (err) {
      patch(id, { aiBusy: false, error: friendly(err) });
    }
  },

  remove(id: string) {
    state = { ...state, items: state.items.filter((i) => i.id !== id) };
    state.items.forEach((o) => o.fields && patch(o.id, {}));
    emit();
  },

  /** Clears finished and skipped files from the list. */
  clearFinished() {
    state = { ...state, items: state.items.filter((i) => !['done', 'duplicate'].includes(i.stage)) };
    emit();
  },

  /** Forgets everything, such as on sign out. */
  reset() {
    state = { ...state, items: [] };
    emit();
  },

  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  getState: () => state,
};

/** Files still processing. */
export const isProcessing = (i: BulkItem) => ['queued', 'reading', 'images', 'checking', 'saving'].includes(i.stage);

/** Work that would be lost if the tab closed: files processing, or read but not saved. */
export const isUnsaved = (i: BulkItem) => isProcessing(i) || i.stage === 'ready';

export function useBulkUpload() {
  return useSyncExternalStore(bulkUpload.subscribe, bulkUpload.getState);
}
