import { motion } from 'framer-motion';
import { TickIcon } from './BrandIcons';

interface Props {
  name: string;
  email: string;
  /** What happens next, in the page's own words. */
  next: string;
  className?: string;
}

/** Shown after a form's lead has been saved. */
export default function LeadThankYou({ name, email, next, className = '' }: Props) {
  const first = name.trim().split(/\s+/)[0] || 'there';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-6 ${className}`}
      role="status"
    >
      <span className="w-12 h-12 rounded-full bg-good/20 flex items-center justify-center mx-auto mb-4">
        <TickIcon className="w-6 h-6 text-good" />
      </span>
      <h3 className="text-2xl font-display font-extrabold text-ink">Thank you, {first}.</h3>
      <p className="text-muted font-body mt-2 text-sm max-w-sm mx-auto leading-relaxed">
        Your details reached me. {next} I'll reply to <span className="text-ink font-semibold break-all">{email.trim()}</span>.
      </p>
    </motion.div>
  );
}
