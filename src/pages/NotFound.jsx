import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 Not Found | Jannat Rugs Co.</title></Helmet>
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-luxury text-[10rem] text-gold-gradient leading-none opacity-20 select-none">404</div>
          <h1 className="font-luxury text-4xl text-white mb-4 -mt-8">Page Not Found</h1>
          <p className="text-[#1A1A1A]/40 mb-8 max-w-md">The page you're looking for seems to have woven itself into another dimension.</p>
          <Link to="/" className="btn-gold inline-flex items-center gap-2 px-8 py-3"><FiArrowLeft size={16} /> Back to Home</Link>
        </motion.div>
      </div>
    </>
  );
}
