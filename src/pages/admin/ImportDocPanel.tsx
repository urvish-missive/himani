import { useRef, useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, FileUp, LoaderCircle, TriangleAlert } from 'lucide-react';
import { IMPORT_ACCEPT, importSingleFile, type Converted, type Issue } from '../../lib/bulkUpload';
import { useFindImportDuplicatesMutation } from '../../store/blogApi';
import type { Post } from '../../lib/blog';
import { errorMessage } from './shared';

interface Props {
  /** Fills the editor; resolves false if the admin cancels replacing what's there. */
  onImport: (result: Converted & { hash: string }, fileName: string) => Promise<boolean>;
}

/** One Word or PDF file in, the editor filled with its title, text, images and SEO details. */
export default function ImportDocPanel({ onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [done, setDone] = useState('');
  const [duplicate, setDuplicate] = useState<Pick<Post, 'id' | 'title'> | null>(null);
  const [dragging, setDragging] = useState(false);
  const [findDuplicates] = useFindImportDuplicatesMutation();

  const run = async (file: File) => {
    setBusy(file.name);
    setError('');
    setIssues([]);
    setDone('');
    setDuplicate(null);
    try {
      const result = await importSingleFile(file);
      const dupes = await findDuplicates({ hash: result.hash, slug: '' }).unwrap().catch(() => null);
      if (await onImport(result, file.name)) {
        setIssues(result.docIssues);
        setDone(`Imported ${file.name}. Check the post below, then save it.`);
        if (dupes?.byHash) setDuplicate({ id: dupes.byHash.id, title: dupes.byHash.title });
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy('');
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) run(file);
  };

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`border rounded-2xl p-4 sm:p-5 transition-colors ${dragging ? 'border-accent bg-lav' : 'border-rule bg-card'}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <FileUp className="hidden sm:block w-6 h-6 text-accent shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 className="font-display font-bold text-ink">Import from a document</h2>
          <p className="text-sm text-muted">One Word (.docx, .doc) or PDF file, kept exactly as written. For many files, use <Link to="/admin/blog/bulk" className="text-accent font-semibold hover:underline">Bulk upload</Link>.</p>
        </div>
        <button onClick={() => inputRef.current?.click()} disabled={!!busy} className="btn ghost sm shrink-0 justify-center disabled:opacity-60">
          {busy ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
          {busy ? 'Importing…' : 'Choose file'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={IMPORT_ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) run(file);
            e.target.value = '';
          }}
        />
      </div>
      {busy && <p className="text-sm text-muted mt-3">Reading {busy} and uploading its images…</p>}
      {error && (
        <p className="text-sm text-bad mt-3" role="alert">
          {error}
        </p>
      )}
      {done && <p className="text-sm text-good mt-3">{done}</p>}
      {duplicate && (
        <p className="text-sm text-ink mt-2">
          <TriangleAlert className="inline w-4 h-4 text-gold mr-1 -mt-0.5" />
          This file was imported before as{' '}
          <Link to={`/admin/blog/${duplicate.id}`} className="text-accent font-semibold hover:underline">
            “{duplicate.title || 'Untitled'}”
          </Link>
          . Saving creates a second copy.
        </p>
      )}
      {issues.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {issues.map((i, n) => (
            <li key={n} className={`flex items-start gap-2 text-sm ${i.level === 'error' ? 'text-bad' : 'text-ink'}`}>
              {i.level === 'error' ? <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" /> : <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-gold" />}
              <span>{i.message}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
