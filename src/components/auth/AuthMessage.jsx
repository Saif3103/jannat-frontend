import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

/**
 * Inline success / error banner for auth forms.
 */
export default function AuthMessage({ type = 'error', message }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <AnimatePresence>
      <motion.div
        role={isError ? 'alert' : 'status'}
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        className={[
          'mb-6 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm leading-relaxed text-left',
          isError
            ? 'bg-red-500/10 border border-red-400/25 text-red-300'
            : 'bg-emerald-500/10 border border-emerald-400/25 text-emerald-300',
        ].join(' ')}
      >
        {isError ? (
          <FiAlertCircle className="shrink-0 mt-0.5" size={18} aria-hidden="true" />
        ) : (
          <FiCheckCircle className="shrink-0 mt-0.5" size={18} aria-hidden="true" />
        )}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
