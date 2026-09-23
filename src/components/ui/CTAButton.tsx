import React from 'react';
import { ArrowRight } from 'lucide-react';

export type CTAButtonVariant =
  | 'primary'
  | 'secondary'
  | 'dark'
  | 'gradient-border'
  | 'gradient-border-dark';

interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: CTAButtonVariant;
  size?: 'md' | 'lg';
  target?: string;
  rel?: string;
  className?: string;
  onClick?: () => void;
}

// Default destination: the Get In Touch form on the home page.
const CONTACT_FORM = '/#hire';

export default function CTAButton({
  children,
  href = CONTACT_FORM,
  variant = 'primary',
  size = 'md',
  target,
  rel,
  className = '',
  onClick,
}: CTAButtonProps) {
  // Links within the site never open a new tab.
  if (href.startsWith('/') || href.startsWith('#')) {
    target = undefined;
    rel = undefined;
  }

  const isGradientBorder =
    variant === 'secondary' ||
    variant === 'gradient-border' ||
    variant === 'gradient-border-dark';

  const isDarkBorder = variant === 'gradient-border-dark';

  const sizeOuter = size === 'lg' ? 'h-14' : 'h-12';
  const innerSize = size === 'lg' ? 'h-[52px] px-8 text-base' : 'h-[44px] px-6 text-sm';
  const primarySize = size === 'lg' ? 'h-14 px-8 text-base' : 'h-12 px-6 text-sm';

  // ----------------------------------------------------
  // Gradient Border Button (Secondary / Outline / Dark)
  // ----------------------------------------------------
  if (isGradientBorder) {
    const innerBgClasses = isDarkBorder
      ? 'bg-dark/95 text-white group-hover:bg-dark/80'
      : 'bg-white text-primary group-hover:text-purple group-hover:bg-bg-alt/90';

    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={`group relative inline-flex items-center justify-center rounded-full p-[2px] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${sizeOuter} ${className}`}
      >
        {/* Ambient atmospheric neon glow behind the border */}
        <span
          className="absolute -inset-[2px] rounded-full opacity-0 blur-md transition-all duration-300 group-hover:opacity-70 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, var(--color-purple), var(--color-orange))',
          }}
        />

        {/* 2px Gradient border ring */}
        <span
          className="relative flex items-center justify-center w-full h-full rounded-full transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, var(--color-purple), var(--color-orange))',
          }}
        >
          {/* Inner button capsule */}
          <span
            className={`flex items-center justify-center gap-2.5 font-semibold tracking-wide rounded-full transition-all duration-300 ${innerSize} ${innerBgClasses}`}
          >
            <span>{children}</span>
            <ArrowRight className="w-4 h-4 text-orange transition-all duration-300 group-hover:text-purple group-hover:translate-x-1" />
          </span>
        </span>
      </a>
    );
  }

  // ----------------------------------------------------
  // Solid Gradient Fill Button (Primary / Dark)
  // ----------------------------------------------------
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2.5 font-semibold tracking-wide rounded-full text-white transition-all duration-300 shadow-lg shadow-purple/20 hover:shadow-xl hover:shadow-orange/30 hover:scale-[1.03] active:scale-[0.98] ${primarySize} ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--color-purple), var(--color-orange))',
      }}
    >
      {/* Ambient hover glow */}
      <span
        className="absolute -inset-[2px] rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--color-purple), var(--color-orange))',
        }}
      />
      <span className="relative z-10 flex items-center gap-2.5">
        <span>{children}</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </a>
  );
}
