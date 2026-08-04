import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUIStore } from '../../store';
import CheckoutFlow from './CheckoutFlow';

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout } = useUIStore();

  useEffect(() => {
    if (!isCheckoutOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isCheckoutOpen]);

  useEffect(() => {
    if (!isCheckoutOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeCheckout();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCheckoutOpen, closeCheckout]);

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[10050] flex items-end sm:items-center justify-center">
          <motion.button
            type="button"
            aria-label="Close checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCheckout}
            className="absolute inset-0 bg-[#1A1A1A]/45 backdrop-blur-[3px] cursor-pointer border-0"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            initial={{ opacity: 0, y: 48, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 48, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative z-10 w-full sm:w-[95%] sm:max-w-[960px] max-h-[94dvh] sm:max-h-[92vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] bg-[#FAF7F2] border border-white/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.35)]"
          >
            <div className="sm:hidden flex justify-center pt-3 pb-1 sticky top-0 bg-[#FAF7F2] z-10">
              <span className="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div className="px-5 sm:px-10 py-6 sm:py-10">
              <CheckoutFlow variant="modal" onClose={closeCheckout} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
