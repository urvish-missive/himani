import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  description?: string;
  dark?: boolean;
}

export default function Stat({ value, suffix = '', label, description, dark = false }: StatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text`}>
        {count}{suffix}
      </div>
      <p className={`mt-2 text-sm font-medium tracking-wide uppercase ${dark ? 'text-white/70' : 'text-secondary'}`}>
        {label}
      </p>
      {description && (
        <p className={`mt-1 text-xs ${dark ? 'text-white/40' : 'text-secondary/60'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
