import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'dark';
  size?: 'md' | 'lg';
  onClick?: () => void;
}

export default function CTAButton({ children, href = '#', variant = 'primary', size = 'md', onClick }: CTAButtonProps) {
  const sizeClasses = size === 'lg'
    ? 'h-14 px-8 text-base'
    : 'h-12 px-6 text-sm';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple to-orange text-white hover:shadow-lg hover:shadow-purple/25 hover:scale-105',
    secondary: 'bg-white text-purple border-2 border-purple/20 hover:border-purple/40 hover:bg-purple/5',
    dark: 'bg-gradient-to-r from-purple to-orange text-white hover:shadow-lg hover:shadow-orange/25 hover:scale-105',
  };

  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 font-semibold tracking-wide rounded-full transition-all duration-300 ${sizeClasses} ${variantClasses[variant]} group`}
    >
      {children}
      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}
