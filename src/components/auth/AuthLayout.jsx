import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

/**
 * Cream luxury shell — matches Jannat Rugs homepage.
 */
export default function AuthLayout({ title, children }) {
  return (
    <>
      <Helmet>
        <title>{title} | Jannat Rugs Co.</title>
      </Helmet>

      <div className="auth-page relative min-h-screen min-h-[100dvh] bg-[#FAF7F2] flex items-center justify-center px-4 py-12 sm:px-6 overflow-hidden">
        {/* Soft brand atmosphere */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#C9A84C]/10 blur-[100px]" />
          <div className="absolute -bottom-32 -left-24 w-[380px] h-[380px] rounded-full bg-[#B69640]/08 blur-[90px]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full flex justify-center"
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}
