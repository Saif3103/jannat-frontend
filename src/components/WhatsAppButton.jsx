import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919235508422?text=Hello%20Jannat%20Rugs%20Co.%2C%20I%27m%20interested%20in%20your%20carpets!"
      target="_blank"
      rel="noreferrer"
      id="whatsapp-btn"
      className="whatsapp-btn"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      title="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} color="white" />
    </motion.a>
  );
}
