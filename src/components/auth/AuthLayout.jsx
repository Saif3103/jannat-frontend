import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const panelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Shared two-column luxury auth shell.
 * Desktop: brand panel left + glass form card right.
 * Mobile: stacked single column.
 */
export default function AuthLayout({
  title,
  subtitle,
  panelTitle,
  panelTagline,
  panelCta,
  panelCtaTo,
  children,
  reverse = false,
}) {
  return (
    <>
      <Helmet>
        <title>{title} | Jannat Rugs Co.</title>
      </Helmet>

      <div className="auth-page min-h-screen bg-[#0B0B0B] flex items-stretch justify-center text-left">
        <div
          className={`w-full max-w-6xl mx-auto flex flex-col ${
            reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
          } min-h-screen lg:min-h-[100dvh] lg:p-6 xl:p-8`}
        >
          {/* Brand panel */}
          <motion.aside
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            className="relative lg:w-[46%] min-h-[220px] sm:min-h-[280px] lg:min-h-0 lg:rounded-[24px] overflow-hidden flex flex-col items-center justify-center px-8 py-14 sm:py-16 lg:py-12"
          >
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: "url('/about-hero.png')" }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/85" aria-hidden="true" />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 30%, #C9A96E 0%, transparent 45%), radial-gradient(circle at 80% 70%, #E7C78A 0%, transparent 40%)',
              }}
              aria-hidden="true"
            />

            {/* Decorative frame accents */}
            <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-[#C9A96E]/35" aria-hidden="true" />
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-[#C9A96E]/35" aria-hidden="true" />

            <div className="relative z-10 text-center max-w-xs mx-auto">
              <Link to="/" className="inline-flex flex-col items-center gap-3 mb-10 group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#C9A96E]/40 shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-[1.03]">
                  <img src="/logo.png" alt="Jannat Rugs Co." className="w-full h-full object-cover" />
                </div>
                <span className="text-[#C9A96E] text-[11px] font-medium tracking-[0.35em] uppercase">
                  Jannat Rugs Co.
                </span>
              </Link>

              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent mx-auto mb-8" />

              <h2 className="font-luxury text-[2.5rem] sm:text-5xl text-white leading-[1.15] mb-5">
                {panelTitle}
              </h2>
              <p className="text-[#A0A0A0] text-sm sm:text-[15px] leading-relaxed mb-10">
                {panelTagline}
              </p>

              {panelCta && panelCtaTo && (
                <Link
                  to={panelCtaTo}
                  className="inline-block border border-white/25 text-white text-[11px] font-semibold tracking-[0.22em] uppercase px-9 py-3.5 rounded-full hover:border-[#C9A96E] hover:text-[#E7C78A] hover:bg-[#C9A96E]/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {panelCta}
                </Link>
              )}
            </div>
          </motion.aside>

          {/* Form panel */}
          <motion.section
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-10 xl:px-14"
          >
            <div className="w-full max-w-[420px] auth-glass rounded-[22px] sm:rounded-3xl px-6 py-9 sm:px-9 sm:py-11 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <header className="mb-8 sm:mb-10 text-center">
                <h1 className="font-luxury text-[2.15rem] sm:text-[2.5rem] text-white leading-tight mb-3">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[#A0A0A0] text-sm leading-relaxed tracking-wide">{subtitle}</p>
                )}
              </header>

              {children}
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
}
