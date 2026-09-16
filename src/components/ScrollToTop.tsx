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
          initial={{ opacity: 0, y: 24, scale: 0.6, rotate: -45 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 24, scale: 0.6, rotate: 45 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.12, rotate: 90 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
          className="group fixed bottom-[5.25rem] sm:bottom-[5.75rem] right-[1.625rem] sm:right-[2.125rem] z-[55] w-11 h-11 rounded-full flex items-center justify-center"
        >
          <svg
            className="absolute -inset-[5px] w-[calc(100%+10px)] h-[calc(100%+10px)] -rotate-90"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#F97316" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="3" />
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="url(#top-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="97.4"
              animate={{ strokeDashoffset: 97.4 * (1 - progress) }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </svg>

          <span className="absolute inset-0 rounded-full bg-white/95 backdrop-blur-md border border-purple/20 shadow-lg shadow-purple/20 group-hover:shadow-purple/35 transition-shadow duration-300" />

          <motion.span
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex"
          >
            <ArrowUp className="w-5 h-5 text-purple group-hover:text-orange transition-colors duration-300" strokeWidth={2.5} />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}