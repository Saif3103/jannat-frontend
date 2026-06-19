import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919235508422?text=Hello%20Jannat%20Rugs%20Co.%2C%20I%27m%20interested%20in%20your%20carpets!"
      target="_blank"
      rel="noreferrer"
      id="whatsapp-btn"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Pulse ring animation */}
      <span className="absolute inset-0 rounded-2xl bg-[#25D366]/30 animate-whatsapp-pulse pointer-events-none" />
      <span className="absolute inset-0 rounded-2xl bg-[#25D366]/15 animate-whatsapp-pulse pointer-events-none" style={{ animationDelay: '0.5s' }} />

      {/* Button */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#25D366]/95 backdrop-blur-xl text-white flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(37,211,102,0.5)] transition-all duration-300 border border-white/20 group-hover:scale-110 group-hover:shadow-[0_10px_40px_-5px_rgba(37,211,102,0.5),0_0_30px_rgba(201,169,110,0.3)] group-hover:rotate-[-5deg] active:scale-95">
        <FaWhatsapp size={28} />
      </div>

      {/* Tooltip (appears on left since button is on the right) */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl text-white text-[10px] font-bold px-4 py-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap tracking-[0.2em] border border-[#C9A96E]/20 pointer-events-none uppercase shadow-xl group-hover:translate-x-0 translate-x-2">
        <span className="text-[#C9A96E]">Chat</span> on WhatsApp
        {/* Arrow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-black/80 rotate-45 border-r border-t border-[#C9A96E]/20" />
      </div>
    </motion.a>
  );
}
