import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, X, Sparkles, Droplets, Layers } from 'lucide-react';
import { THEMES, applyTheme, getSavedTheme } from '../lib/theme';

type FilterCategory = 'all' | 'solid' | 'gradient';

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState(getSavedTheme);
  const [filter, setFilter] = useState<FilterCategory>('all');

  // Apply theme on mount
  useEffect(() => {
    const saved = getSavedTheme();
    setActiveThemeId(saved);
    applyTheme(saved);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const handleSelectTheme = (id: string) => {
    setActiveThemeId(id);
    applyTheme(id);
  };

  const activeTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  const solidCount = useMemo(() => THEMES.filter((t) => t.styleType === 'solid').length, []);
  const gradientCount = useMemo(() => THEMES.filter((t) => t.styleType === 'gradient').length, []);

  const filteredThemes = useMemo(() => {
    if (filter === 'solid') return THEMES.filter((t) => t.styleType === 'solid');
    if (filter === 'gradient') return THEMES.filter((t) => t.styleType === 'gradient');
    return THEMES;
  }, [filter]);

  return (
    <>
      {/* Floating Theme Button (Bottom-Left) */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 200, damping: 16 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change theme colors"
        className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[60] h-12 px-4 rounded-full bg-white/95 backdrop-blur-md border border-border shadow-lg shadow-black/5 flex items-center gap-2.5 text-primary text-xs font-semibold cursor-pointer hover:border-purple/40 transition-all group"
      >
        <div
          className="w-4 h-4 rounded-full shadow-xs border border-white shrink-0"
          style={{
            backgroundColor: activeTheme.primarySwatch,
            background:
              activeTheme.styleType === 'solid'
                ? activeTheme.primarySwatch
                : `linear-gradient(135deg, ${activeTheme.primarySwatch}, ${activeTheme.secondarySwatch})`,
          }}
        />
        <Palette className="w-4 h-4 text-purple group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline">Theme Palette ({THEMES.length})</span>
      </motion.button>

      {/* Theme Palette Modal / Popover */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-3 sm:p-6 pointer-events-none">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.22, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative w-full max-w-sm sm:max-w-2xl bg-white rounded-3xl p-4 sm:p-6 border border-border shadow-2xl shadow-black/20 pointer-events-auto overflow-hidden flex flex-col max-h-[88vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-purple/10 flex items-center justify-center text-purple shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-primary">Select Color Palette</h3>
                    <p className="text-xs text-secondary">
                      Choose simple solid single-colors or dual-tone gradients
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
                  aria-label="Close theme modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Tabs (All / Simple & Solid / Gradients) */}
              <div className="flex items-center gap-1.5 my-3 p-1 rounded-2xl bg-bg border border-border/80">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filter === 'all'
                      ? 'bg-white text-primary shadow-xs'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All ({THEMES.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilter('solid')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filter === 'solid'
                      ? 'bg-white text-primary shadow-xs'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Droplets className="w-3.5 h-3.5 text-purple" />
                  <span>Simple & Solid ({solidCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilter('gradient')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filter === 'gradient'
                      ? 'bg-white text-primary shadow-xs'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange" />
                  <span>Gradients ({gradientCount})</span>
                </button>
              </div>

              {/* Currently Selected Pill Indicator */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-purple/5 border border-purple/15 mb-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0 border border-white"
                    style={{
                      backgroundColor: activeTheme.primarySwatch,
                      background:
                        activeTheme.styleType === 'solid'
                          ? activeTheme.primarySwatch
                          : `linear-gradient(135deg, ${activeTheme.primarySwatch}, ${activeTheme.secondarySwatch})`,
                    }}
                  />
                  <span className="text-secondary truncate">
                    Active:{' '}
                    <strong className="text-primary font-medium">{activeTheme.name}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-purple/20 text-purple shrink-0">
                  {activeTheme.styleType === 'solid' ? 'Pure Solid' : 'Dual-Tone'}
                </span>
              </div>

              {/* Theme Options Grid (2 columns on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1 max-h-[52vh]">
                {filteredThemes.map((theme) => {
                  const isSelected = theme.id === activeThemeId;
                  const isSolid = theme.styleType === 'solid';

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme.id)}
                      className={`group w-full text-left p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-purple bg-purple/5 shadow-xs ring-2 ring-purple/20'
                          : 'border-border hover:border-purple/30 hover:bg-bg/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Swatch circle with checkmark */}
                        <div
                          className="w-9 h-9 rounded-xl shadow-xs border border-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: theme.primarySwatch,
                            background: isSolid
                              ? theme.primarySwatch
                              : `linear-gradient(135deg, ${theme.primarySwatch}, ${theme.secondarySwatch})`,
                          }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-primary truncate">
                            {theme.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: theme.primarySwatch }}
                            />
                            <p className="text-[11px] text-secondary truncate">
                              {theme.category}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Small badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium ${
                          isSolid
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-purple/10 text-purple border border-purple/20'
                        }`}
                      >
                        {theme.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-secondary">
                <span>Theme is saved to your browser</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple to-orange text-white font-medium text-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Apply & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
