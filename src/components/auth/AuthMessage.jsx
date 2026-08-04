import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthMessage({ type = 'error', message }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <AnimatePresence>
      <motion.div
        role={isError ? 'alert' : 'status'}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={[
          'mb-5 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm leading-relaxed',
          isError
            ? 'bg-red-500/10 border border-red-400/20 text-red-300'
            : 'bg-emerald-500/10 border border-emerald-400/20 text-emerald-300',
        ].join(' ')}
      >
        {isError ? (
          <AlertCircle className="shrink-0 mt-0.5" size={18} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <CheckCircle2 className="shrink-0 mt-0.5" size={18} strokeWidth={1.5} aria-hidden="true" />
        )}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
