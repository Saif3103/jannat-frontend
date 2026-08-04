import { motion } from 'framer-motion';

/**
 * Solid gold luxury CTA — no cheap gradients.
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
      whileHover={isDisabled ? undefined : { y: -2 }}
      whileTap={isDisabled ? undefined : { scale: 0.99 }}
      className={[
        'w-full h-14 rounded-2xl bg-[#C9A96E] text-[#0A0A0A]',
        'text-[12px] font-semibold uppercase tracking-[0.22em]',
        'shadow-[0_8px_24px_rgba(201,169,110,0.22)]',
        'transition-shadow duration-300 cursor-pointer',
        'hover:shadow-[0_12px_32px_rgba(201,169,110,0.35)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        className,
      ].join(' ')}
      {...props}
    >
      <span className="flex items-center justify-center gap-3">
        {loading ? (
          <>
            <span
              className="w-5 h-5 border-2 border-[#0A0A0A]/25 border-t-[#0A0A0A] rounded-full animate-spin"
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
