import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-rule py-7 text-muted font-display text-[0.9rem] bg-paper">
      <div className="max-w-[1160px] mx-auto px-6 flex flex-wrap gap-4 justify-between items-center">
        <span>© 2026 Himani Kankaria, the Content Queen of India</span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to="/" className="text-muted hover:text-ink hover:underline transition-colors">
            Home
          </Link>
          <Link to="/virtual-cmo" className="text-muted hover:text-ink hover:underline transition-colors">
            Virtual CMO
          </Link>
          <Link to="/founder-coaching" className="text-muted hover:text-ink hover:underline transition-colors">
            Founder Coaching
          </Link>
          <Link to="/team-training" className="text-muted hover:text-ink hover:underline transition-colors">
            Team Training
          </Link>
          <Link to="/speaking" className="text-muted hover:text-ink hover:underline transition-colors">
            Speaking
          </Link>
          <a
            href="https://www.linkedin.com/in/himanikankaria/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-ink hover:underline transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://x.com/himani_kankaria"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-ink hover:underline transition-colors"
          >
            X (Twitter)
          </a>
        </div>
      </div>
    </footer>
  );
}
