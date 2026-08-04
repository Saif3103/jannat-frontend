import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Centered glass authentication card.
 */
export default function AuthCard({ title, subtitle, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[480px] rounded-[28px] bg-[rgba(20,20,20,0.95)] border border-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-[20px] px-8 py-10 sm:p-12 text-left"
    >
      <div className="flex flex-col items-center">
        <Link
          to="/"
          className="mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded-2xl"
        >
          <img
            src="/logo.png"
            alt="Jannat Rugs Co."
            className="w-14 h-14 rounded-2xl object-cover"
          />
        </Link>

        <h1 className="font-luxury text-[40px] sm:text-[48px] font-light text-white leading-none tracking-tight text-center">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 text-base text-[#A5A5A5] text-center leading-relaxed max-w-sm">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8">{children}</div>
    </motion.div>
  );
}
