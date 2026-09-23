import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';

/*
 * App-wide toasts and confirm dialog, replacing window.alert / window.confirm.
 *
 *   const toast = useToast();
 *   toast.success('Lead deleted.');
 *
 *   const confirm = useConfirm();
 *   if (await confirm({ title: 'Delete lead?', message: '…', confirmLabel: 'Delete', tone: 'danger' })) { … }
 */

type ToastKind = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
  title?: string;
  duration: number;
}

interface ToastOptions {
  title?: string;
  /** Milliseconds before it hides; errors stay a little longer by default. */
  duration?: number;
}

export interface ToastApi {
  success: (message: string, opts?: ToastOptions) => void;
  error: (message: string, opts?: ToastOptions) => void;
  info: (message: string, opts?: ToastOptions) => void;
}

export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" styles the confirm button red and focuses Cancel first. */
  tone?: 'default' | 'danger';
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

/*
 * Shared page-scroll lock. Drawers and dialogs can open and close in any order
 * (a confirm box on top of a drawer, say), so each one takes a lock and the
 * page only scrolls again once the last lock is released.
 */
let scrollLocks = 0;
let savedOverflow = '';

export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return;
    if (scrollLocks++ === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (--scrollLocks === 0) document.body.style.overflow = savedOverflow;
    };
  }, [active]);
}

const ToastContext = createContext<ToastApi | null>(null);
const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <FeedbackProvider>.');
  return ctx;
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside <FeedbackProvider>.');
  return ctx;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);

  const toast = useMemo<ToastApi>(() => {
    const push = (kind: ToastKind) => (message: string, opts: ToastOptions = {}) => {
      const id = nextId.current++;
      const duration = opts.duration ?? (kind === 'error' ? 7000 : 4500);
      // Keep the stack short; the oldest goes first.
      setToasts((all) => [...all.slice(-3), { id, kind, message, title: opts.title, duration }]);
    };
    return { success: push('success'), error: push('error'), info: push('info') };
  }, []);

  const confirm = useCallback<ConfirmFn>(
    (opts) =>
      new Promise<boolean>((resolve) => {
        // A second request while one is open cancels the first.
        setDialog((prev) => {
          prev?.resolve(false);
          return { ...opts, resolve };
        });
      }),
    []
  );

  const close = (ok: boolean) => {
    dialog?.resolve(ok);
    setDialog(null);
  };

  return (
    <ToastContext.Provider value={toast}>
      <ConfirmContext.Provider value={confirm}>
        {children}
        <ToastStack toasts={toasts} onDismiss={dismiss} />
        <AnimatePresence>{dialog && <ConfirmDialog key="confirm" {...dialog} onClose={close} />}</AnimatePresence>
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}

/* ----------------------------------------------------------------- Toasts */

const KIND_STYLE: Record<ToastKind, { icon: typeof Info; iconCls: string; bar: string }> = {
  success: { icon: CircleCheck, iconCls: 'text-good', bar: 'bg-good' },
  error: { icon: CircleAlert, iconCls: 'text-bad', bar: 'bg-bad' },
  info: { icon: Info, iconCls: 'text-accent', bar: 'bg-accent' },
};

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div
      className="fixed z-[110] inset-x-4 bottom-4 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[380px] flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-relevant="additions"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { icon: Icon, iconCls, bar } = KIND_STYLE[toast.kind];
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.duration);
  const startedAt = useRef(Date.now());

  // Auto-hide, pausing while hovered or focused so it can be read.
  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = setTimeout(onDismiss, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      role={toast.kind === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto relative overflow-hidden flex items-start gap-3 bg-card border border-rule rounded-2xl shadow-xl shadow-ink/10 pl-4 pr-2 py-3"
    >
      <span className={`absolute left-0 inset-y-0 w-1 ${bar}`} aria-hidden="true" />
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconCls}`} aria-hidden="true" />
      <div className="min-w-0 flex-1 py-0.5">
        {toast.title && <p className="font-display font-bold text-sm text-ink">{toast.title}</p>}
        <p className="text-sm text-ink leading-snug break-words">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="p-1.5 rounded-lg text-muted hover:bg-lav hover:text-ink shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/* ---------------------------------------------------------- Confirm modal */

function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onClose,
}: ConfirmOptions & { onClose: (ok: boolean) => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const danger = tone === 'danger';
  // Latest onClose without re-running the setup effect (which would steal focus).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useScrollLock();

  useEffect(() => {
    const onClose = (ok: boolean) => onCloseRef.current(ok);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Destructive actions start on Cancel so Enter can't delete by accident.
    (danger ? cancelRef : confirmRef).current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose(false);
      }
      // Keep Tab inside the dialog.
      if (e.key === 'Tab' && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>('button');
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    // Capture phase so page-level Escape handlers (e.g. drawers) don't also fire.
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      previouslyFocused?.focus?.();
    };
  }, [danger]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={() => onClose(false)} aria-hidden="true" />
      <motion.div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={message ? 'confirm-message' : undefined}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="relative w-full max-w-md bg-card border border-rule rounded-3xl shadow-2xl shadow-ink/20 p-6 sm:p-7"
      >
        <div className="flex items-start gap-4">
          <span
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${danger ? 'bg-bad/10 text-bad' : 'bg-lav text-accent'}`}
            aria-hidden="true"
          >
            {danger ? <TriangleAlert className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </span>
          <div className="min-w-0 pt-0.5">
            <h2 id="confirm-title" className="font-display font-extrabold text-lg text-ink leading-snug">
              {title}
            </h2>
            {message && (
              <div id="confirm-message" className="mt-1.5 text-sm text-muted leading-relaxed">
                {message}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            ref={cancelRef}
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2.5 rounded-xl border border-rule font-display font-semibold text-sm text-ink hover:bg-lav focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => onClose(true)}
            className={`px-4 py-2.5 rounded-xl font-display font-semibold text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${
              danger ? 'bg-bad hover:bg-bad/90 focus-visible:outline-bad' : 'bg-accent hover:bg-accent-hover focus-visible:outline-accent'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
