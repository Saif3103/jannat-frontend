import { useId, useState, forwardRef } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium auth field with left icon, password toggle, and accessible labels.
 */
const AuthInput = forwardRef(function AuthInput(
  {
    label,
    type = 'text',
    icon: Icon,
    error,
    success,
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
    <div className={`w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold tracking-[0.18em] uppercase text-[#A0A0A0] mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0] group-focus-within:text-[#C9A96E] transition-colors duration-300 pointer-events-none"
            aria-hidden="true"
          >
            <Icon size={18} />
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={[
            'auth-input w-full h-14 rounded-2xl text-[15px] text-white placeholder:text-[#A0A0A0]/70',
            'bg-[#111111] border border-white/[0.08]',
            'transition-all duration-300 outline-none',
            Icon ? 'pl-12' : 'pl-4',
            isPassword ? 'pr-12' : 'pr-4',
            error
              ? 'border-red-400/60 focus:border-red-400 focus:ring-4 focus:ring-red-400/10'
              : success
                ? 'border-emerald-400/50 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10'
                : 'focus:border-[#C9A96E]/70 focus:ring-4 focus:ring-[#C9A96E]/12 hover:border-white/15',
          ].join(' ')}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#A0A0A0] hover:text-[#C9A96E] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-xs text-red-400/95 leading-relaxed"
          >
            {error}
          </motion.p>
        )}
        {!error && success && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-xs text-emerald-400/95 leading-relaxed"
          >
            {success}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default AuthInput;
