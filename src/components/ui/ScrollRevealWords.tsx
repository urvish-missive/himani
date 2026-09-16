import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}{' '}
    </motion.span>
  );
}

interface ScrollRevealWordsProps {
  text: string;
  className?: string;
}

export default function ScrollRevealWords({ text, className = '' }: ScrollRevealWordsProps) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 0.9', 'start 0.35'],
  });

  const words = text.split(' ');

  return (
    <p ref={container} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}
