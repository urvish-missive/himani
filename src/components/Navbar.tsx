import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Speaking', href: '#speaking' },
  { label: 'Coaching', href: '#coaching' },
  { label: 'Consulting', href: '#consulting' },
  { label: 'Training', href: '#training' },
  { label: 'Insights', href: '#insights' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const onHome = location.pathname === '/';
  const resolveHref = (href: string) => (href.startsWith('/') || onHome ? href : `/${href}`);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;

      // When near the top, always keep header visible and un-scrolled
      if (currentScrollY <= 20) {
        setVisible(true);
        setScrolled(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      setScrolled(true);

      const delta = currentScrollY - lastScrollY.current;

      // Ignore tiny jitter movements
      if (Math.abs(delta) < 8) return;

      // Scrolling DOWN -> hide header; Scrolling UP -> reveal header
      if (delta > 0 && currentScrollY > 80) {
        setVisible(false);
      } else if (delta < 0) {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      setVisible(true);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: visible || mobileOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-purple/10 shadow-[0_4px_20px_-4px_rgba(26,16,40,0.08)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div
          className={`mx-auto max-w-7xl px-5 md:px-8 lg:px-12 flex items-center justify-between transition-[height] duration-300 ${
            scrolled ? 'h-16' : 'h-16 md:h-20'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="font-serif text-xl md:text-2xl tracking-tight gradient-text font-bold">
            Himani Kankaria
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setVisible(true)}
                  className="text-[13px] font-medium text-secondary hover:text-purple transition-colors duration-200 tracking-wide relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-purple after:to-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={resolveHref(link.href)}
                  onClick={() => setVisible(true)}
                  className="text-[13px] font-medium text-secondary hover:text-purple transition-colors duration-200 tracking-wide relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-purple after:to-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <a
              href={resolveHref('#contact')}
              onClick={() => setVisible(true)}
              className="inline-flex items-center h-10 px-5 text-sm font-semibold bg-gradient-to-r from-purple to-orange text-white rounded-full hover:shadow-lg hover:shadow-purple/25 transition-all duration-300 tracking-wide hover:opacity-95"
            >
              Work With Me
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-primary hover:text-purple transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl pt-24 px-6 flex flex-col justify-between pb-10"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => {
                      setMobileOpen(false);
                      setVisible(true);
                    }}
                    className="text-lg font-medium text-primary hover:text-purple transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={resolveHref(link.href)}
                    onClick={() => {
                      setMobileOpen(false);
                      setVisible(true);
                    }}
                    className="text-lg font-medium text-primary hover:text-purple transition-colors"
                  >
                    {link.label}
                  </a>
                )
              ))}
              <a
                href={resolveHref('#contact')}
                onClick={() => {
                  setMobileOpen(false);
                  setVisible(true);
                }}
                className="mt-4 inline-flex items-center h-12 px-8 text-base font-semibold bg-gradient-to-r from-purple to-orange text-white rounded-full shadow-lg shadow-purple/20"
              >
                Work With Me
              </a>
            </div>

            <div className="text-center text-xs text-secondary/70">
              © {new Date().getFullYear()} Himani Kankaria · Missive Digital
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
