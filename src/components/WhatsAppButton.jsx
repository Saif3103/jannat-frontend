import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919235508422?text=Hello%20Jannat%20Rugs%20Co.%2C%20I%27m%20interested%20in%20your%20carpets!"
      target="_blank"
      rel="noreferrer"
      id="whatsapp-btn"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(37,211,102,0.5)] transition-all group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      whileHover={{ scale: 1.1, rotate: -5 }}
      whileTap={{ scale: 0.9 }}
      title="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
      
      {/* Tooltip - now on left side since button is on right */}
      <div className="absolute right-full mr-4 bg-black/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-[0.2em] border border-white/10 pointer-events-none uppercase">
        WhatsApp Us
      </div>
    </motion.a>
  );
}
