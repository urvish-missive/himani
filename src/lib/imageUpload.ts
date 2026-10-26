import { firebaseApp } from './firebase';

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

/** Converts a base64 Data URL to a Blob. */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const bin = atob(base64);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    u8[i] = bin.charCodeAt(i);
  }
  return new Blob([u8], { type: mime });
}

/**
 * Uploads an image Blob or File to Firebase Storage under `blog-images/visuals/`.
 * Returns the public download URL.
 */
export async function uploadPostImage(blobOrFile: Blob | File, customName?: string): Promise<string> {
  const { getStorage, ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
  const storage = getStorage(firebaseApp());

  const type = blobOrFile.type || 'image/png';
  const ext = EXT[type] || 'png';
  const safeBase = (customName || 'visual')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .slice(0, 40);
  const filename = `${safeBase}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const storageRef = ref(storage, `blog-images/visuals/${filename}`);

  await uploadBytes(storageRef, blobOrFile, {
    contentType: type,
    cacheControl: 'public, max-age=31536000, immutable',
  });

  return getDownloadURL(storageRef);
}
