import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const serviceLinks = [
  { label: 'Consulting', href: '/consulting', description: 'Organic strategy for brands ready to re-architect growth.' },
  { label: 'Coaching', href: '/coaching', description: 'Executive advisory for marketing leaders and founders.' },
  { label: 'Training', href: '/training', description: 'Interactive workshops that build lasting team capability.' },
  { label: 'Speaking', href: '/speaking', description: 'Keynotes and masterclasses for global stages.' },
];

const detailLinks = [
  { label: 'Podcast & Interviews', href: '/podcast', description: 'Long-form conversations and live talks.' },
  { label: 'About Himani', href: '/about', description: '15 years in search, still learning in public.' },
  { label: 'Speaking Highlights', href: '/#speaking', description: 'BrightonSEO, ISS, WordCamp and more.' },
  { label: 'Book a Consultation', href: 'https://calendly.com/missivedigital/30min', description: 'A free 30-minute strategy call.' },
];

interface NavLink {
  label: string;
  href: string;
}

interface NavDropdown {
  label: string;
  children: {
    services: typeof serviceLinks;
    details: typeof detailLinks;
  };
}

const navLinks: (NavLink | NavDropdown)[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Insights',
    children: { services: serviceLinks, details: detailLinks },
  },
  { label: 'Podcast', href: '/podcast' },
];

function isDropdown(link: NavLink | NavDropdown): link is NavDropdown {
  return 'children' in link;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
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
            {navLinks.map((link) => {
              if (isDropdown(link)) {
                return (
                  <div key={link.label} className="relative group">
                    <button
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary hover:text-purple transition-colors duration-200 tracking-wide relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-purple after:to-orange after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-200"
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </button>

                    {/* Dropdown */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                      <div className="w-[600px] rounded-2xl bg-white border border-purple/10 shadow-[0_24px_50px_-12px_rgba(26,16,40,0.18)] p-6 grid grid-cols-[1.25fr_1fr] gap-6">
                        {/* Services column */}
                        <div>
                          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-purple/60 mb-4">
                            Services
                          </p>
                          <div className="space-y-1">
                            {link.children.services.map((item) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                className="group/item flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-purple/5 transition-colors duration-200"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-primary group-hover/item:text-purple transition-colors flex items-center gap-1.5">
                                    {item.label}
                                    <ArrowRight className="w-3.5 h-3.5 text-secondary/40 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                                  </p>
                                  <p className="text-xs text-secondary/70 mt-0.5 leading-snug">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Details column */}
                        <div className="border-l border-purple/10 pl-6">
                          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-purple/60 mb-4">
                            Details
                          </p>
                          <div className="space-y-1">
                            {link.children.details.map((item) => (
                              item.href.startsWith('/') || item.href.startsWith('#') ? (
                                <Link
                                  key={item.label}
                                  to={resolveHref(item.href)}
                                  className="group/item flex items-start justify-between gap-2 px-3 py-2.5 rounded-xl hover:bg-orange/5 transition-colors duration-200"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-primary group-hover/item:text-purple transition-colors">
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-secondary/70 mt-0.5 leading-snug">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              ) : (
                                <a
                                  key={item.label}
                                  href={item.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/item flex items-start justify-between gap-2 px-3 py-2.5 rounded-xl hover:bg-orange/5 transition-colors duration-200"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-primary group-hover/item:text-purple transition-colors">
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-secondary/70 mt-0.5 leading-snug">
                                      {item.description}
                                    </p>
                                  </div>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-secondary/40 shrink-0 mt-0.5 group-hover/item:text-purple" />
                                </a>
                              )
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return link.href.startsWith('/') ? (
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
              );
            })}
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
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl pt-24 px-6 flex flex-col justify-between pb-10 overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link) => {
                if (isDropdown(link)) {
                  return (
                    <div key={link.label} className="w-full max-w-sm">
                      <button
                        onClick={() => setInsightsOpen(!insightsOpen)}
                        className="w-full flex items-center justify-center gap-1.5 text-lg font-medium text-primary hover:text-purple transition-colors py-1"
                      >
                        {link.label}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${insightsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {insightsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 pb-2">
                              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-purple/60 mb-2 text-center">
                                Services
                              </p>
                              <div className="flex flex-col items-center gap-3 mb-5">
                                {link.children.services.map((item) => (
                                  <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-base font-medium text-secondary hover:text-purple transition-colors"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-purple/60 mb-2 text-center">
                                Details
                              </p>
                              <div className="flex flex-col items-center gap-3">
                                {link.children.details.map((item) => (
                                  item.href.startsWith('/') || item.href.startsWith('#') ? (
                                    <Link
                                      key={item.label}
                                      to={resolveHref(item.href)}
                                      onClick={() => setMobileOpen(false)}
                                      className="text-base font-medium text-secondary hover:text-purple transition-colors"
                                    >
                                      {item.label}
                                    </Link>
                                  ) : (
                                    <a
                                      key={item.label}
                                      href={item.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => setMobileOpen(false)}
                                      className="text-base font-medium text-secondary hover:text-purple transition-colors"
                                    >
                                      {item.label}
                                    </a>
                                  )
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return link.href.startsWith('/') ? (
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
                );
              })}
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

            <div className="text-center text-xs text-secondary/70 mt-8">
              © {new Date().getFullYear()} Himani Kankaria · Missive Digital
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}