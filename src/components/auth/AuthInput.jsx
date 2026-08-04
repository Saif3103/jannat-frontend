import { useId, useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Auth field with icon as flex sibling (never overlaps text).
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
    <div className={`w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B69640] mb-2"
        >
          {label}
        </label>
      )}

      <div
        className={[
          'auth-field group flex items-center h-14 rounded-2xl bg-[#FAF7F2] border transition-all duration-300',
          error
            ? 'border-red-400/60 ring-2 ring-red-400/10'
            : 'border-black/[0.08] hover:border-[#C9A84C]/50 focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/15',
        ].join(' ')}
      >
        {Icon && (
          <span
            className="flex h-full w-12 shrink-0 items-center justify-center text-[#1A1A1A]/35 group-focus-within:text-[#B69640] transition-colors"
            aria-hidden="true"
          >
            <Icon size={18} strokeWidth={1.75} />
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={[
            'auth-field-input min-w-0 flex-1 h-full bg-transparent text-[15px] text-[#1A1A1A]',
            'placeholder:text-[#1A1A1A]/35 outline-none border-0 shadow-none',
            Icon ? 'pl-0' : 'pl-4',
            isPassword ? 'pr-2' : 'pr-4',
          ].join(' ')}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="flex h-full w-12 shrink-0 items-center justify-center text-[#1A1A1A]/35 hover:text-[#B69640] transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-[#B69640]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
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
            className="mt-2 text-xs text-red-500 text-left"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default AuthInput;
