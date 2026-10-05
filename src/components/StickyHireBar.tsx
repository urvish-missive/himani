import { MessageCircle, X } from 'lucide-react';

interface StickyHireBarProps {
  chatOpen?: boolean;
  onToggleChat?: () => void;
  onCloseChat?: () => void;
}

export default function StickyHireBar({
  chatOpen = false,
  onToggleChat,
  onCloseChat,
}: StickyHireBarProps) {
  return (
    <div
      role="region"
      aria-label="Quick actions bar"
      className="fixed md:hidden left-3 right-3 bottom-[calc(14px+env(safe-area-inset-bottom,0px))] z-50 bg-ink/95 backdrop-blur-md text-paper rounded-full py-2 pl-3.5 pr-2 flex items-center justify-between font-display text-[0.85rem] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] border border-rule/20 animate-fade-in"
    >
      {/* Availability Status */}
      <div className="flex items-center gap-2 min-w-0 mr-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-medium text-paper/90 truncate text-[0.82rem] xs:text-[0.86rem]">
          <span className="hidden xs:inline">Taking new clients this quarter</span>
          <span className="xs:hidden">Taking clients</span>
        </span>
      </div>

      {/* Action Buttons: Chat popup button + Hire Me CTA */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleChat}
          aria-label={chatOpen ? 'Close AI chat' : 'Open AI chat'}
          className={`relative h-[34px] px-3 inline-flex items-center justify-center gap-1.5 rounded-full text-xs font-bold font-display transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 border ${
            chatOpen
              ? 'bg-paper text-ink border-paper/80 hover:bg-paper/90'
              : 'bg-gradient-to-r from-purple to-orange text-white border-transparent hover:opacity-95'
          }`}
        >
          {chatOpen ? (
            <>
              <X className="w-3.5 h-3.5 shrink-0" />
              <span>Close</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Chat</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange" />
              </span>
            </>
          )}
        </button>

        <a
          href="/#hire"
          onClick={() => {
            if (chatOpen && onCloseChat) {
              onCloseChat();
            }
          }}
          className="h-[34px] px-3.5 inline-flex items-center justify-center rounded-full bg-gold text-gold-ink font-display font-bold text-xs shadow-sm hover:brightness-95 active:scale-95 transition-all shrink-0 border border-gold"
        >
          Hire Himani
        </a>
      </div>
    </div>
  );
}

