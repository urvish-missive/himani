import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollTop > 400);
      setProgress(scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="group fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-24 right-3.5 sm:right-6 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer select-none"
        >
          {/* Progress Ring */}
          <svg
            className="absolute -inset-[3px] sm:-inset-[4px] w-[calc(100%+6px)] sm:w-[calc(100%+8px)] h-[calc(100%+6px)] sm:h-[calc(100%+8px)] -rotate-90 pointer-events-none"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6A45B8" />
                <stop offset="100%" stopColor="#F2C230" />
              </linearGradient>
            </defs>
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#6A45B8"
              strokeOpacity="0.15"
              strokeWidth="2.5"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="url(#top-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="97.4"
              animate={{ strokeDashoffset: 97.4 * (1 - progress) }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </svg>

          {/* Button Surface */}
          <span className="absolute inset-0 rounded-full bg-paper/95 backdrop-blur-md border border-purple/20 shadow-[0_6px_20px_-3px_rgba(106,69,184,0.25)] group-hover:shadow-[0_10px_26px_-2px_rgba(106,69,184,0.4)] group-hover:border-purple/35 transition-all duration-300" />

          {/* Arrow Icon with subtle bounce */}
          <motion.span
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex items-center justify-center text-purple group-hover:text-accent-hover transition-colors duration-300"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.6} />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}