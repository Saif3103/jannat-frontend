import { motion } from 'framer-motion';

/**
 * Solid gold CTA matching site buttons.
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
      whileHover={isDisabled ? undefined : { y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.99 }}
      className={[
        'w-full h-14 rounded-2xl bg-[#C9A84C] text-[#1A1A1A]',
        'text-[12px] font-bold uppercase tracking-[0.2em]',
        'shadow-[0_8px_24px_rgba(201,168,76,0.28)]',
        'transition-shadow duration-300 cursor-pointer',
        'hover:bg-[#B69640] hover:shadow-[0_12px_28px_rgba(201,168,76,0.38)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'disabled:opacity-55 disabled:cursor-not-allowed disabled:shadow-none',
        className,
      ].join(' ')}
      {...props}
    >
      <span className="flex items-center justify-center gap-3">
        {loading ? (
          <>
            <span
              className="w-5 h-5 border-2 border-[#1A1A1A]/20 border-t-[#1A1A1A] rounded-full animate-spin"
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
