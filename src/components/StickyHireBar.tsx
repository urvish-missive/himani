import { useEffect, useState } from 'react';

export default function StickyHireBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 400px
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed md:hidden left-3 right-3 bottom-[calc(14px+env(safe-area-inset-bottom,0px))] z-40 bg-ink text-paper rounded-full py-2.5 px-4 flex items-center justify-between font-display text-[0.88rem] shadow-[0_12px_28px_-10px_rgba(0,0,0,0.5)] border border-rule/20 animate-fade-in">
      <span className="font-medium text-paper/90 truncate mr-2">
        Taking new clients this quarter
      </span>
      <a
        href="#hire"
        className="btn gold sm shrink-0 text-xs py-1.5 px-4 font-bold"
      >
        Hire Himani
      </a>
    </div>
  );
}
