import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919235508422?text=Hello%20Jannat%20Rugs%20Co.%2C%20I%27m%20interested%20in%20your%20carpets!"
      target="_blank"
      rel="noreferrer"
      id="whatsapp-btn"
      className="fixed bottom-[88px] left-4 md:bottom-8 md:left-8 z-[100] w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(37,211,102,0.5)] transition-all group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      whileHover={{ scale: 1.1, rotate: -5 }}
      whileTap={{ scale: 0.9 }}
      title="Chat on WhatsApp"
    >
      <FaWhatsapp size={22} className="md:w-7 md:h-7" />
      
      {/* Tooltip */}
      <div className="absolute left-full ml-4 bg-black/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-[0.2em] border border-white/10 pointer-events-none uppercase">
        WhatsApp Us
      </div>
    </motion.a>
  );
}
