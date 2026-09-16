import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Podcast', href: '/podcast' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const onHome = location.pathname === '/';
  const resolveHref = (href: string) => (href.startsWith('/') || onHome ? href : `/${href}`);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      setScrolled(currentScrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
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
        animate={{ y: 0 }}
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
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[13px] font-medium text-secondary hover:text-purple transition-colors duration-200 tracking-wide relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-purple after:to-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={resolveHref(link.href)}
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
              href="https://calendly.com/missivedigital/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-10 px-5 text-sm font-semibold bg-gradient-to-r from-purple to-orange text-white rounded-full hover:shadow-lg hover:shadow-purple/25 transition-all duration-300 tracking-wide hover:opacity-95"
            >
              Book a Consultation
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
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-primary hover:text-purple transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={resolveHref(link.href)}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-primary hover:text-purple transition-colors"
                  >
                    {link.label}
                  </a>
                )
              ))}
              <a
                href="https://calendly.com/missivedigital/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center h-12 px-8 text-base font-semibold bg-gradient-to-r from-purple to-orange text-white rounded-full shadow-lg shadow-purple/20"
              >
                Book a Consultation
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
