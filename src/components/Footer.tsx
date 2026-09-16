import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe } from 'lucide-react';
import Container from './ui/Container';

const footerLinks = [
  { label: 'Speaking', href: '#speaking' },
  { label: 'Coaching', href: '#coaching' },
  { label: 'Consulting', href: '#consulting' },
  { label: 'Training', href: '#training' },
  { label: 'About', href: '#about' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '#contact' },
];

function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.98h4.56V23H.22V8.98zM8.98 8.98h4.38v1.92h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V23h-4.56v-6.7c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.74-2.57 3.54V23H8.98V8.98z" />
    </svg>
  );
}

function XIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.391.569A2.994 2.994 0 0 0 .502 6.186 31.34 31.34 0 0 0 0 12a31.34 31.34 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.117C4.495 20.5 12 20.5 12 20.5s7.505 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117A31.34 31.34 0 0 0 24 12a31.34 31.34 0 0 0-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/himanikankaria/', icon: LinkedinIcon, y: -140, rotate: -30 },
  { label: 'Missive Digital', href: 'https://missivedigital.com/', icon: Globe, y: -115, rotate: 24 },
  { label: 'X / Twitter', href: 'https://twitter.com/missivedigital', icon: XIcon, y: -165, rotate: -20 },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCr9k1x9bFRxfTHcH2fBJOoA', icon: YoutubeIcon, y: -125, rotate: 26 },
];

export default function Footer() {
  const socialRef = useRef(null);
  const socialInView = useInView(socialRef, { once: true, margin: '-30px 0px' });

  return (
    <footer className="py-16 md:py-20 bg-gradient-to-br from-bg to-purple/5 border-t border-purple/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Left: Brand */}
          <div>
            <a href="#" className="font-serif text-2xl gradient-text">
              Himani Kankaria
            </a>
            <p className="mt-4 text-sm text-secondary leading-relaxed max-w-xs">
              Founder of Missive Digital. Organic growth strategist, global speaker, and consultant helping B2B SaaS, tech, and ambitious brands re-architect search and AI discovery.
            </p>
          </div>

          {/* Center: Links */}
          <div className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-secondary hover:text-purple transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: Social */}
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-purple/50 mb-4">
              Connect
            </p>
            <div ref={socialRef} className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: link.y, rotate: link.rotate }}
                    animate={
                      socialInView
                        ? { opacity: 1, y: 0, rotate: 0 }
                        : { opacity: 0, y: link.y, rotate: link.rotate }
                    }
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: index * 0.1 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-purple/20 bg-white text-secondary shadow-sm transition-colors duration-200 hover:border-purple/40 hover:text-purple"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-purple/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary/50">
            © {new Date().getFullYear()} Himani Kankaria · Missive Digital. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-secondary/50 hover:text-purple transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-secondary/50 hover:text-purple transition-colors">
              Terms
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
