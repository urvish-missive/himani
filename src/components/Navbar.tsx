import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { CrownIcon } from './ui/BrandIcons';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Virtual CMO', href: '/virtual-cmo' },
    { label: 'Founder Coaching', href: '/founder-coaching' },
    { label: 'Team Training', href: '/team-training' },
    { label: 'Speaking', href: '/speaking' },
    { label: 'Blog', href: '/blog' },
  ];

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-rule">
      <div className="max-w-[1160px] mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 font-display font-extrabold text-[1.12rem] text-ink hover:opacity-95 transition-opacity"
        >
          <CrownIcon className="w-[22px] height-[22px] text-gold" />
          <span>Himani Kankaria</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 ml-auto" aria-label="Main">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`font-display text-[0.95rem] py-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-ink font-semibold border-gold'
                    : 'text-muted hover:text-ink border-transparent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="/#hire"
            className="btn solid sm ml-2"
          >
            Hire me
          </a>
        </nav>

        {/* Mobile Burger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
          className="lg:hidden flex items-center gap-2 font-display font-semibold text-[0.92rem] border border-rule rounded-full px-3.5 py-1.5 text-ink hover:bg-paper-2 transition-colors cursor-pointer"
        >
          {mobileOpen ? (
            <X className="w-4 h-4 text-ink" />
          ) : (
            <Menu className="w-4 h-4 text-ink" />
          )}
          <span>{mobileOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-paper border-b border-rule px-6 py-4 shadow-lg animate-fade-in flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={handleLinkClick}
                className={`font-display py-2.5 text-[1rem] border-b border-rule/60 transition-colors ${
                  isActive
                    ? 'text-accent font-semibold'
                    : 'text-ink hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 pb-1">
            <a
              href="/#hire"
              onClick={handleLinkClick}
              className="btn solid sm w-full justify-center"
            >
              Hire me
            </a>
          </div>
        </div>
      )}
    </header>
  );
}