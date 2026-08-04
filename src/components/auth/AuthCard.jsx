import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Light luxury auth card matching site identity.
 */
export default function AuthCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[440px] rounded-[24px] bg-white border border-black/[0.06] shadow-[0_24px_60px_rgba(26,26,26,0.08)] px-7 py-9 sm:px-10 sm:py-11 text-left"
    >
      <div className="flex flex-col items-center">
        <Link
          to="/"
          className="mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-full"
        >
          <img
            src="/logo.png"
            alt="Jannat Rugs Co."
            className="w-16 h-16 rounded-full object-cover border border-[#C9A84C]/25 shadow-sm"
          />
        </Link>

        <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#B69640] mb-3">
          Jannat Rugs Co.
        </p>

        <h1 className="font-luxury text-[2.25rem] sm:text-[2.75rem] font-light text-[#1A1A1A] leading-none tracking-tight text-center">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 text-sm text-[#1A1A1A]/50 text-center leading-relaxed max-w-[300px]">
            {subtitle}
          </p>
        )}

        <div className="w-10 h-px bg-[#C9A84C]/60 mt-6" />
      </div>

      <div className="mt-8">{children}</div>
    </motion.div>
  );
}
