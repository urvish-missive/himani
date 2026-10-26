import { useState, useRef, type ChangeEvent } from 'react';
import {
  Sparkles,
  Upload,
  Link as LinkIcon,
  LoaderCircle,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Edit3,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  findVisualPlaceholders,
  replaceVisualPlaceholder,
  formatMarkdownImage,
  VISUAL_STYLES,
  type VisualPlaceholder,
  type VisualStyle,
} from '../../lib/visualPlaceholders';
import { useGenerateVisualMutation } from '../../store/blogApi';
import { uploadPostImage, dataUrlToBlob } from '../../lib/imageUpload';
import { useToast } from '../../components/ui/Feedback';

interface Props {
  content: string;
  onChangeContent: (nextContent: string) => void;
}

export default function VisualPlaceholdersManager({ content, onChangeContent }: Props) {
  const toast = useToast();
  const placeholders = findVisualPlaceholders(content);
  const [generateVisual] = useGenerateVisualMutation();

  const [activeTab, setActiveTab] = useState<Record<string, 'ai' | 'upload' | 'url'>>({});
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [selectedStyles, setSelectedStyles] = useState<Record<string, VisualStyle>>({});
  const [busyState, setBusyState] = useState<Record<string, string>>({});
  const [generatedImages, setGeneratedImages] = useState<
    Record<string, { dataUrl: string; imageUrl: string; prompt: string }>
  >({});
  const [urlInputs, setUrlInputs] = useState<Record<string, { url: string; alt: string }>>({});
  const [collapsed, setCollapsed] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (placeholders.length === 0) {
    return null;
  }

  const getMode = (raw: string): 'ai' | 'upload' | 'url' => activeTab[raw] || 'ai';
  const getPrompt = (p: VisualPlaceholder): string =>
    customPrompts[p.raw] !== undefined ? customPrompts[p.raw] : p.description;
  const getStyle = (raw: string): VisualStyle => selectedStyles[raw] || 'auto';

  // Handle AI Visual Generation
  const handleGenerate = async (p: VisualPlaceholder) => {
    const prompt = getPrompt(p);
    const style = getStyle(p.raw);

    setBusyState((prev) => ({ ...prev, [p.raw]: 'Generating image with AI…' }));
    try {
      const result = await generateVisual({
        prompt,
        label: p.label,
        style,
        width: 1024,
        height: 640,
      }).unwrap();

      setGeneratedImages((prev) => ({
        ...prev,
        [p.raw]: { dataUrl: result.dataUrl, imageUrl: result.imageUrl, prompt: result.prompt },
      }));
      toast.success(`Generated preview for ${p.label}. Review and click "Insert into Post".`, {
        title: 'Visual generated',
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not generate visual. You can upload an image manually.', {
        title: 'Generation failed',
      });
    } finally {
      setBusyState((prev) => {
        const next = { ...prev };
        delete next[p.raw];
        return next;
      });
    }
  };

  // Accept generated image & upload to Firebase Storage
  const handleInsertGenerated = async (p: VisualPlaceholder) => {
    const gen = generatedImages[p.raw];
    if (!gen) return;

    setBusyState((prev) => ({ ...prev, [p.raw]: 'Uploading visual to storage…' }));
    try {
      let finalUrl = gen.imageUrl;
      try {
        const blob = dataUrlToBlob(gen.dataUrl);
        finalUrl = await uploadPostImage(blob, p.label.toLowerCase().replace(/\s+/g, '-'));
      } catch (uploadErr) {
        console.warn('Direct storage upload failed, using generated image URL:', uploadErr);
      }

      const alt = p.suggestedAlt || p.description;
      const markdown = formatMarkdownImage(alt, finalUrl);
      const nextContent = replaceVisualPlaceholder(content, p.raw, markdown);
      onChangeContent(nextContent);

      toast.success(`${p.label} has been replaced with the generated image!`, {
        title: 'Visual added',
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to insert visual.', {
        title: 'Insert failed',
      });
    } finally {
      setBusyState((prev) => {
        const next = { ...prev };
        delete next[p.raw];
        return next;
      });
    }
  };

  // Handle Manual File Upload
  const handleFileUpload = async (p: VisualPlaceholder, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusyState((prev) => ({ ...prev, [p.raw]: `Uploading ${file.name}…` }));
    try {
      const url = await uploadPostImage(file, p.label.toLowerCase().replace(/\s+/g, '-'));
      const alt = p.suggestedAlt || file.name.replace(/\.[a-z0-9]+$/i, '');
      const markdown = formatMarkdownImage(alt, url);
      const nextContent = replaceVisualPlaceholder(content, p.raw, markdown);
      onChangeContent(nextContent);

      toast.success(`${p.label} has been replaced with your uploaded image!`, {
        title: 'Image uploaded',
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload image.', {
        title: 'Upload failed',
      });
    } finally {
      setBusyState((prev) => {
        const next = { ...prev };
        delete next[p.raw];
        return next;
      });
      e.target.value = '';
    }
  };

  // Handle Manual URL Insertion
  const handleInsertUrl = (p: VisualPlaceholder) => {
    const input = urlInputs[p.raw];
    if (!input?.url?.trim()) {
      toast.error('Please enter an image URL.', { title: 'URL required' });
      return;
    }
    const alt = input.alt.trim() || p.suggestedAlt || p.label;
    const markdown = formatMarkdownImage(alt, input.url.trim());
    const nextContent = replaceVisualPlaceholder(content, p.raw, markdown);
    onChangeContent(nextContent);

    toast.success(`${p.label} has been replaced with your image URL!`, {
      title: 'Visual added',
    });
  };

  // Dismiss / Remove placeholder
  const handleDismiss = (p: VisualPlaceholder) => {
    const nextContent = replaceVisualPlaceholder(content, p.raw, '');
    onChangeContent(nextContent);
    toast.info(`Removed ${p.label} placeholder from draft.`, {
      title: 'Placeholder removed',
    });
  };

  return (
    <div className="rounded-2xl border-2 border-accent/40 bg-card overflow-hidden shadow-sm transition-all">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-lav via-lav/60 to-card border-b border-rule">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent text-paper flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-ink text-base">
                Visual Placeholders Found ({placeholders.length})
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/25">
                Action Needed
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">
              The document has visual cues (e.g.{' '}
              <code className="text-ink font-mono bg-paper px-1 rounded text-[0.8rem]">
                {placeholders[0]?.label || 'VISUAL'}
              </code>
              ). Generate graphics with AI or upload images manually.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted hover:text-ink text-xs font-display font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rule hover:bg-paper"
        >
          {collapsed ? 'Expand' : 'Collapse'}
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Placeholders List */}
      {!collapsed && (
        <div className="p-4 sm:p-5 space-y-4 divide-y divide-rule/50">
          {placeholders.map((p, idx) => {
            const isBusy = !!busyState[p.raw];
            const busyMsg = busyState[p.raw];
            const mode = getMode(p.raw);
            const generated = generatedImages[p.raw];

            return (
              <div key={p.raw + idx} className={idx > 0 ? 'pt-4' : ''}>
                {/* Visual Label & Prompt Badge */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-display font-extrabold uppercase tracking-wider bg-accent text-paper shadow-2xs">
                      {p.label}
                    </span>
                    <span className="text-xs text-muted font-display">Placeholder in draft</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDismiss(p)}
                    className="text-xs text-muted hover:text-bad flex items-center gap-1 px-2 py-1 rounded hover:bg-bad/10 transition-colors"
                    title="Remove this placeholder text without adding an image"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove placeholder
                  </button>
                </div>

                {/* Original Description Quote Box */}
                <div className="p-3 rounded-xl bg-paper border border-rule mb-3.5">
                  <p className="text-xs font-semibold text-muted font-display uppercase tracking-wider mb-1">
                    Visual Prompt from Document:
                  </p>
                  <p className="text-sm text-ink font-medium leading-relaxed italic">
                    "{p.description}"
                  </p>
                </div>

                {/* Tabs: AI Generate vs Manual Upload vs Image URL */}
                <div className="flex items-center gap-1 border-b border-rule pb-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab((prev) => ({ ...prev, [p.raw]: 'ai' }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all ${
                      mode === 'ai'
                        ? 'bg-accent text-paper shadow-xs'
                        : 'text-muted hover:text-ink hover:bg-paper'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate with AI
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab((prev) => ({ ...prev, [p.raw]: 'upload' }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all ${
                      mode === 'upload'
                        ? 'bg-accent text-paper shadow-xs'
                        : 'text-muted hover:text-ink hover:bg-paper'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Image Manually
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab((prev) => ({ ...prev, [p.raw]: 'url' }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all ${
                      mode === 'url'
                        ? 'bg-accent text-paper shadow-xs'
                        : 'text-muted hover:text-ink hover:bg-paper'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> Add from URL
                  </button>
                </div>

                {/* Tab 1: AI Generation */}
                {mode === 'ai' && (
                  <div className="space-y-3 bg-paper-2/60 p-3.5 rounded-xl border border-rule">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-display font-semibold text-ink flex items-center gap-1">
                          <Sliders className="w-3.5 h-3.5 text-accent" /> Style preset:
                        </label>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                        {VISUAL_STYLES.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setSelectedStyles((prev) => ({ ...prev, [p.raw]: st.id }))}
                            className={`p-2 rounded-lg text-left border text-xs transition-all ${
                              getStyle(p.raw) === st.id
                                ? 'border-accent bg-accent/10 text-accent font-semibold shadow-2xs'
                                : 'border-rule bg-card text-muted hover:text-ink hover:border-rule/80'
                            }`}
                          >
                            <p className="truncate font-display">{st.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-display font-semibold text-ink block mb-1">
                        Refine Prompt (optional):
                      </label>
                      <textarea
                        value={getPrompt(p)}
                        onChange={(e) =>
                          setCustomPrompts((prev) => ({ ...prev, [p.raw]: e.target.value }))
                        }
                        rows={2}
                        disabled={isBusy}
                        className="w-full text-xs p-2.5 rounded-lg border border-rule bg-card text-ink outline-none focus:border-accent"
                        placeholder="Detailed visual description..."
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleGenerate(p)}
                        disabled={isBusy}
                        className="btn solid sm inline-flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {isBusy ? (
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        {isBusy ? busyMsg : generated ? 'Regenerate with AI' : 'Generate Visual with AI'}
                      </button>

                      {generated && (
                        <button
                          type="button"
                          onClick={() => handleInsertGenerated(p)}
                          disabled={isBusy}
                          className="btn gold sm inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Insert into Post
                        </button>
                      )}
                    </div>

                    {/* Preview of Generated Image */}
                    {generated && (
                      <div className="mt-3 p-3 rounded-xl bg-card border border-rule space-y-2">
                        <p className="text-xs font-display font-semibold text-good flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-good" />
                          Generated Preview (1024x640):
                        </p>
                        <div className="relative rounded-lg overflow-hidden border border-rule aspect-[16/10] max-w-md bg-paper">
                          <img
                            src={generated.dataUrl || generated.imageUrl}
                            alt={p.suggestedAlt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[0.75rem] text-muted italic">
                          Clicking "Insert into Post" will upload this image to Firebase Storage and replace {p.label}.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Manual Upload */}
                {mode === 'upload' && (
                  <div className="bg-paper-2/60 p-4 rounded-xl border border-rule space-y-3">
                    <div
                      onClick={() => fileInputRefs.current[p.raw]?.click()}
                      className="border-2 border-dashed border-rule hover:border-accent rounded-xl p-5 text-center cursor-pointer bg-card transition-colors"
                    >
                      <Upload className="w-7 h-7 text-accent mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-display font-semibold text-ink">
                        Click or drag an image file to upload
                      </p>
                      <p className="text-[0.75rem] text-muted mt-1">
                        PNG, JPG, WebP, GIF, or SVG up to 10 MB. Will replace {p.label}.
                      </p>
                      <input
                        ref={(el) => {
                          fileInputRefs.current[p.raw] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(p, e)}
                      />
                    </div>
                    {isBusy && (
                      <div className="flex items-center gap-2 text-xs text-accent">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        <span>{busyMsg}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Paste URL */}
                {mode === 'url' && (
                  <div className="bg-paper-2/60 p-4 rounded-xl border border-rule space-y-3">
                    <div>
                      <label className="text-xs font-display font-semibold text-ink block mb-1">
                        Image URL:
                      </label>
                      <input
                        type="url"
                        value={urlInputs[p.raw]?.url || ''}
                        onChange={(e) =>
                          setUrlInputs((prev) => ({
                            ...prev,
                            [p.raw]: {
                              url: e.target.value,
                              alt: prev[p.raw]?.alt ?? p.suggestedAlt,
                            },
                          }))
                        }
                        placeholder="https://example.com/healthcare-header-mockup.png"
                        className="w-full text-xs p-2.5 rounded-lg border border-rule bg-card text-ink outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-display font-semibold text-ink block mb-1">
                        Alt Text (Description for SEO & Accessibility):
                      </label>
                      <input
                        type="text"
                        value={urlInputs[p.raw]?.alt ?? p.suggestedAlt}
                        onChange={(e) =>
                          setUrlInputs((prev) => ({
                            ...prev,
                            [p.raw]: {
                              url: prev[p.raw]?.url || '',
                              alt: e.target.value,
                            },
                          }))
                        }
                        placeholder={p.suggestedAlt}
                        className="w-full text-xs p-2.5 rounded-lg border border-rule bg-card text-ink outline-none focus:border-accent"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInsertUrl(p)}
                      className="btn solid sm inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Insert Image URL for {p.label}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
