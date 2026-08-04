import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

/**
 * Full-page dark shell for authentication screens.
 */
export default function AuthLayout({ title, children }) {
  return (
    <>
      <Helmet>
        <title>{title} | Jannat Rugs Co.</title>
      </Helmet>

      <div className="auth-page min-h-screen min-h-[100dvh] bg-[#0A0A0A] flex items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex justify-center"
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}
