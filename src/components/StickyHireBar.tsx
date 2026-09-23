import { useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';

export default function StickyHireBar() {
  const { isOpen, toggleChat, isHireBarVisible, setIsHireBarVisible } = useChatbot();

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 400px
      const shouldShow = window.scrollY > 400;
      setIsHireBarVisible(shouldShow);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      setIsHireBarVisible(false);
    };
  }, [setIsHireBarVisible]);

  if (!isHireBarVisible) return null;

  return (
    <div className="fixed md:hidden left-3 right-3 bottom-[calc(14px+env(safe-area-inset-bottom,0px))] z-40 bg-ink text-paper rounded-full py-2 px-3 sm:px-4 flex items-center justify-between font-display text-[0.88rem] shadow-[0_12px_28px_-10px_rgba(0,0,0,0.5)] border border-rule/20 animate-fade-in">
      <div className="flex items-center gap-2 min-w-0 mr-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="font-medium text-paper/90 text-xs sm:text-[0.85rem] truncate">
          Taking new clients
        </span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={toggleChat}
          aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
          title={isOpen ? 'Close chat' : 'Ask Himani AI'}
          className="relative h-8 px-2.5 rounded-full bg-gradient-to-r from-purple to-orange text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          {isOpen ? (
            <>
              <X className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-bold">Close</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] font-bold">Chat</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange" />
              </span>
            </>
          )}
        </button>
        <a
          href="#hire"
          className="btn gold sm shrink-0 text-xs py-1.5 px-3 sm:px-4 font-bold"
        >
          Hire Himani
        </a>
      </div>
    </div>
  );
}
