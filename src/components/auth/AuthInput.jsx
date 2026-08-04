import { useId, useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Luxury auth field — icon inset, 56px height, gold focus.
 */
const AuthInput = forwardRef(function AuthInput(
  {
    label,
    type = 'text',
    icon: Icon,
    error,
    className = '',
    id,
    ...props
  },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-medium uppercase tracking-[0.2em] text-[#C9A96E] mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <span
            className="pointer-events-none absolute left-0 top-0 z-10 flex h-14 w-[52px] items-center justify-center text-[#A5A5A5]"
            aria-hidden="true"
          >
            <Icon size={20} strokeWidth={1.5} />
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={[
            'w-full h-14 rounded-2xl bg-[#121212] text-[15px] text-white placeholder:text-[#A5A5A5]/70',
            'border border-white/[0.08] outline-none transition-all duration-300',
            'hover:border-white/[0.14]',
            'focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20',
            Icon ? 'pl-[52px]' : 'pl-4',
            isPassword ? 'pr-[52px]' : 'pr-4',
            error ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/15' : '',
          ].join(' ')}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-0 top-0 flex h-14 w-[52px] items-center justify-center text-[#A5A5A5] hover:text-[#C9A96E] transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:text-[#C9A96E]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default AuthInput;
