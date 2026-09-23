import React from 'react';

export function CrownIcon({ className = 'w-5 h-5 text-gold' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 7.5l4.6 4 4.4-7 4.4 7 4.6-4-1.8 10.5H4.8L3 7.5zm1.9 12h14.2v2H4.9z" />
    </svg>
  );
}

export function TickIcon({ className = 'w-5 h-5 text-accent' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function PlayIcon({ className = 'w-5 h-5 text-gold-ink' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

export function CrossIcon({ className = 'w-5 h-5 text-bad' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}


