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
          'mb-5 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm leading-relaxed text-left',
          isError
            ? 'bg-red-50 border border-red-200 text-red-600'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-700',
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
