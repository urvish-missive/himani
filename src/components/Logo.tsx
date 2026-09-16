import { Link } from 'react-router-dom';

interface LogoProps {
  markSize?: number;
  textClassName?: string;
  showSubtitle?: boolean;
}

export default function Logo({
  textClassName = 'text-xl md:text-2xl',
  showSubtitle = false,
}: LogoProps) {
  return (
    <Link
      to="/"
      className="inline-flex flex-col group focus:outline-none"
      aria-label="Himani Kankaria — Home"
    >
      <div className="inline-flex items-baseline">
        <span
          className={`font-serif tracking-tight font-bold gradient-text transition-all duration-300 group-hover:opacity-90 ${textClassName}`}
        >
          Himani Kankaria
        </span>
        {/* Luminous brand beacon dot */}
        <span className="inline-block w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-gradient-to-tr from-purple via-purple-light to-orange ml-1.5 align-baseline shadow-xs shadow-orange/40 group-hover:scale-125 transition-transform duration-300" />
      </div>
      {showSubtitle && (
        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-secondary/60 mt-1">
          Founder, Missive Digital
        </span>
      )}
    </Link>
  );
}
