import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGift, FiX, FiCopy, FiCheck, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function OfferPill() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasClosed) return;
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 20) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasClosed]);

  useEffect(() => {
    if (isVisible && isExpanded) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isExpanded]);

  const copyCode = () => {
    navigator.clipboard.writeText('JANNAT15');
    setCopied(true);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible || hasClosed) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[998] flex items-end pointer-events-none hardware-accelerated"
          style={{ transform: "translateZ(0)" }}
        >
          <div className="relative pointer-events-auto">
            {/* Close Button (only when expanded) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => {
                    setHasClosed(true);
                    setIsVisible(false);
                  }}
                  className="absolute -top-3 -right-3 w-6 h-6 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-400 hover:text-[#1A1A1A] z-10 border border-gray-100"
                >
                  <FiX size={12} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* THE PILL */}
            <motion.div
              layout
              onClick={() => !isExpanded && setIsExpanded(true)}
              className={`
                bg-white/88 backdrop-blur-[18px] border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.12)] 
                flex items-center gap-3 overflow-hidden transition-all duration-500 cursor-pointer
                ${isExpanded ? 'px-4 py-3 rounded-[999px] max-w-[400px]' : 'w-14 h-14 rounded-full justify-center group'}
              `}
              whileHover={{ scale: 1.02 }}
            >
              {/* Icon / Mini Bubble State */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#111827] to-[#1F2937] 
                flex items-center justify-center text-white shadow-lg relative
              `}>
                <FiGift size={18} />
                {!isExpanded && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-[#C9A84C] rounded-full border-2 border-white" 
                  />
                )}
              </div>

              {/* Text & CTA (only when expanded) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-6 whitespace-nowrap pr-2"
                  >
                    <div>
                      <h4 className="text-[15px] font-bold text-[#111827] leading-tight">Extra 15% OFF</h4>
                      <p className="text-[11px] text-[#6B7280] font-medium tracking-tight">Unlock exclusive rug discount</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                      }}
                      className="bg-gradient-to-r from-[#111827] to-[#1F2937] text-white px-5 py-2.5 rounded-full text-[13px] font-bold shadow-lg hover:translate-y-[-2px] transition-all"
                    >
                      Claim
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* COUPON MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative shadow-2xl overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
              >
                <FiX size={24} />
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-[#FAF7F2] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#C9A84C]">
                  <FiGift size={40} />
                </div>
                <h2 className="font-heading text-3xl text-[#111827] mb-3">✨ Unlock Your Offer</h2>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Enjoy an exclusive 15% OFF on your next order. <br/>Crafted just for you.
                </p>
              </div>

              {/* Coupon Card */}
              <div className="bg-[#FAF7F2] border-2 border-dashed border-[#C9A84C]/30 rounded-3xl p-6 mb-8 relative group">
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-[0.2em] mb-2">Your Promo Code</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#111827] tracking-wider">JANNAT15</span>
                  <button 
                    onClick={copyCode}
                    className="flex items-center gap-2 bg-white text-[#111827] px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    {copied ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/shop" 
                  onClick={() => setShowModal(false)}
                  className="w-full bg-[#111827] text-white py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 group"
                >
                  Shop Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-[10px] text-gray-300 text-center font-bold uppercase tracking-widest">
                  Valid on all rug collections
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
