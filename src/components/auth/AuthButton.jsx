import { motion } from 'framer-motion';

/**
 * Full-width gold luxury CTA with loading spinner and soft press feedback.
 */
export default function AuthButton({
  children,
  loading = false,
  disabled = false,
  type = 'submit',
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.01, y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.985 }}
      className={[
        'auth-btn relative w-full h-14 rounded-2xl overflow-hidden',
        'font-semibold text-[12px] tracking-[0.28em] uppercase',
        'text-[#0B0B0B] shadow-[0_10px_30px_rgba(201,169,110,0.28)]',
        'transition-shadow duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7C78A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]',
        'disabled:opacity-55 disabled:cursor-not-allowed disabled:shadow-none',
        'cursor-pointer',
        className,
      ].join(' ')}
      {...props}
    >
      <span
        className="absolute inset-0 bg-gradient-to-r from-[#C9A96E] via-[#E7C78A] to-[#C9A96E] bg-[length:200%_100%] animate-[auth-shimmer_4s_linear_infinite]"
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center justify-center gap-3">
        {loading ? (
          <>
            <span
              className="w-5 h-5 border-2 border-[#0B0B0B]/25 border-t-[#0B0B0B] rounded-full animate-spin"
              aria-hidden="true"
            />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
