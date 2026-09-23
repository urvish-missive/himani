import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrossIcon } from './BrandIcons';
import { useScrollLock } from './Feedback';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: string;
    title: string;
    show?: string;
    url: string;
    isShort?: boolean;
  } | null;
}

export default function VideoPreviewModal({
  isOpen,
  onClose,
  video,
}: VideoPreviewModalProps) {
  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full bg-[#2A2440] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
            video.isShort
              ? 'max-w-[380px] h-[85vh] max-h-[720px]'
              : 'max-w-4xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#352D50]">
            <div className="min-w-0 pr-3">
              {video.show && (
                <span className="text-xs font-display font-semibold text-[#F2C230] uppercase tracking-wider block truncate">
                  {video.show}
                </span>
              )}
              <h4 className="text-sm sm:text-base font-display font-bold text-white truncate">
                {video.title}
              </h4>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-display font-medium text-white/75 hover:text-white underline hover:no-underline hidden sm:inline"
              >
                Open in YouTube ↗
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close video preview"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <CrossIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div
            className={`w-full relative bg-black ${
              video.isShort ? 'flex-1' : 'aspect-video'
            }`}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* Footer note for mobile */}
          <div className="px-4 py-2 bg-[#12152A] flex justify-between items-center text-xs text-white/60 font-display">
            <span>Video preview</span>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F2C230] hover:underline"
            >
              Watch full episode on YouTube ↗
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
