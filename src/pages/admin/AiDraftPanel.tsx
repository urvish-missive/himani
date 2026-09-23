import { useState, type FormEvent } from 'react';
import { ChevronDown, LoaderCircle, Sparkles } from 'lucide-react';
import { useGeneratePostMutation } from '../../store/blogApi';
import type { GeneratedDraft, GenerateInput } from '../../lib/blog';
import { errorMessage } from './shared';

const inputCls = 'w-full rounded-xl border border-rule bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent text-sm';
const labelCls = 'block font-display text-sm font-semibold text-ink mb-1.5';

const LENGTHS: { id: GenerateInput['length']; label: string }[] = [
  { id: 'short', label: 'Short · ~700 words' },
  { id: 'standard', label: 'Standard · ~1,200 words' },
  { id: 'long', label: 'Long · ~1,800 words' },
];

interface Props {
  defaultOpen: boolean;
  /** Called with the AI draft; resolves false if the admin cancels applying it. */
  onDraft: (draft: GeneratedDraft) => Promise<boolean>;
}

/** Topic + introduction + conclusion in, a full draft post out. */
export default function AiDraftPanel({ defaultOpen, onDraft }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [generate, { isLoading }] = useGeneratePostMutation();
  const [form, setForm] = useState<GenerateInput>({
    topic: '',
    introduction: '',
    conclusion: '',
    keepVerbatim: true,
    keyword: '',
    length: 'standard',
  });
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const set = <K extends keyof GenerateInput>(key: K, value: GenerateInput[K]) => {
    setError('');
    setDone('');
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!form.topic.trim()) return setError('Add a topic first.');
    setError('');
    setDone('');
    try {
      const draft = await generate(form).unwrap();
      if (await onDraft(draft)) {
        setDone(`Draft added below (written by ${draft.provider}). Read it through, check any facts, then save.`);
        setOpen(false);
      }
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const hasBookends = Boolean(form.introduction.trim() || form.conclusion.trim());

  return (
    <section className="bg-gradient-to-br from-lav to-card border border-accent/25 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 px-5 sm:px-6 py-4 text-left"
      >
        <span className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shrink-0">
          <Sparkles className="w-[18px] h-[18px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-bold text-ink">Draft with AI</span>
          <span className="block text-xs text-muted truncate">Give a topic, your introduction and conclusion. AI writes the rest for you to edit.</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {done && !open && <p className="px-5 sm:px-6 pb-4 -mt-1 text-sm text-good font-display">{done}</p>}

      {open && (
        <form onSubmit={submit} className="px-5 sm:px-6 pb-6 space-y-4 border-t border-accent/15 pt-5">
          <div>
            <label htmlFor="ai-topic" className={labelCls}>
              Topic <span className="text-bad" aria-hidden="true">*</span>
            </label>
            <input
              id="ai-topic"
              value={form.topic}
              onChange={(e) => set('topic', e.target.value)}
              maxLength={300}
              aria-required="true"
              placeholder="e.g. Why B2B content calendars stall, and how to plan around buying questions"
              className={inputCls}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ai-intro" className={labelCls}>
                Introduction
              </label>
              <textarea
                id="ai-intro"
                value={form.introduction}
                onChange={(e) => set('introduction', e.target.value)}
                maxLength={4000}
                rows={5}
                placeholder="Your opening paragraph, or notes on what it should say."
                className={`${inputCls} resize-y`}
              />
            </div>
            <div>
              <label htmlFor="ai-outro" className={labelCls}>
                Conclusion
              </label>
              <textarea
                id="ai-outro"
                value={form.conclusion}
                onChange={(e) => set('conclusion', e.target.value)}
                maxLength={4000}
                rows={5}
                placeholder="Your closing paragraph, or the point it should land on."
                className={`${inputCls} resize-y`}
              />
            </div>
          </div>

          {hasBookends && (
            <fieldset className="flex flex-col sm:flex-row gap-2 sm:gap-5 text-sm">
              <legend className="sr-only">How to use the introduction and conclusion</legend>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ai-mode" checked={form.keepVerbatim} onChange={() => set('keepVerbatim', true)} className="accent-accent" />
                <span className="text-ink">Use my text word for word</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ai-mode" checked={!form.keepVerbatim} onChange={() => set('keepVerbatim', false)} className="accent-accent" />
                <span className="text-ink">Treat it as notes and rewrite</span>
              </label>
            </fieldset>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ai-keyword" className={labelCls}>
                Search keyword <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="ai-keyword"
                value={form.keyword}
                onChange={(e) => set('keyword', e.target.value)}
                maxLength={100}
                placeholder="e.g. B2B content strategy"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="ai-length" className={labelCls}>
                Length
              </label>
              <select
                id="ai-length"
                value={form.length}
                onChange={(e) => set('length', e.target.value as GenerateInput['length'])}
                className={inputCls}
              >
                {LENGTHS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-bad text-sm font-display" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button type="submit" disabled={isLoading} className="btn solid justify-center disabled:opacity-70">
              {isLoading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" /> Writing the draft…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate draft
                </>
              )}
            </button>
            <p className="text-xs text-muted">
              {isLoading ? 'This usually takes 20 to 60 seconds.' : 'Nothing is saved or published until you review it and click Save.'}
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
