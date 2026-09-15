import Reveal from './Reveal';

interface SectionHeaderProps {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  centered?: boolean;
  dark?: boolean;
  headingClassName?: string;
}

export default function SectionHeader({ eyebrow, heading, subheading, centered = false, dark = false, headingClassName = '' }: SectionHeaderProps) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}>
      {eyebrow && (
        <Reveal>
          <p className={`text-xs font-semibold tracking-[0.2em] uppercase mb-4 ${dark ? 'text-orange/60' : 'text-orange'}`}>
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.1}>
        <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] ${dark ? 'text-white' : 'text-primary'} ${headingClassName}`}>
          {heading}
        </h2>
      </Reveal>
      {subheading && (
        <Reveal delay={0.2}>
          <p className={`mt-5 text-base md:text-lg leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''} ${dark ? 'text-white/60' : 'text-secondary'}`}>
            {subheading}
          </p>
        </Reveal>
      )}
    </div>
  );
}
