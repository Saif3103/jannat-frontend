import { motion } from 'framer-motion';

export default function Loader({ fullscreen = false }) {
  return (
    <div className={`flex items-center justify-center ${fullscreen ? 'min-h-screen' : 'py-20'}`}
      style={{ background: fullscreen ? '#0D0D0D' : 'transparent' }}>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="luxury-loader mx-auto mb-4"
        />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-luxury text-gold-gradient text-xl tracking-widest"
        >
          JANNAT RUGS CO.
        </motion.p>
      </div>
    </div>
  );
}
