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

const socialLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'X / Twitter', href: '#' },
  { label: 'Instagram', href: '#' },
];

export default function Footer() {
  return (
    <footer className="py-16 md:py-20 bg-gradient-to-br from-bg to-purple/5 border-t border-purple/10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Left: Brand */}
          <div>
            <a href="#" className="font-serif text-2xl gradient-text">
              Himani
            </a>
            <p className="mt-4 text-sm text-secondary leading-relaxed max-w-xs">
              Marketing strategist, speaker, coach and consultant helping brands and marketers navigate modern growth.
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
            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-secondary hover:text-purple transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-purple/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary/50">
            © {new Date().getFullYear()} Himani Sharma. All rights reserved.
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
