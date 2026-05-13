import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiInstagram, FiFacebook, FiYoutube, FiSend, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import ChatBot from '../ChatBot';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter', { email });
      toast.success('Subscribed to our newsletter! 🎉');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  const links = [
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Order Tracking', path: '/order-tracking' }
  ];

  return (
    <footer className="relative mt-20 font-sans">
      
      {/* 1. CTA SECTION: READY TO TRANSFORM YOUR SPACE */}
      <div className="relative h-[450px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80" 
            alt="Luxury Space" 
            className="w-full h-full object-cover grayscale-[0.3]"
          />
          {/* Light Overlay with Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/90 via-[#FAF7F2]/40 to-[#FAF7F2]/80" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <p className="text-amber-400 text-xs tracking-[0.5em] uppercase mb-6 font-medium">Begin Your Journey</p>
          <h2 className="font-luxury text-5xl md:text-7xl text-black mb-6 leading-tight">Ready to Transform<br />Your Space?</h2>
          <p className="text-black/60 text-sm md:text-base mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore our exclusive collection of handmade luxury carpets and find the perfect masterpiece for your home.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/shop" className="btn-gold px-10 py-4 flex items-center gap-3 group">
              SHOP COLLECTION <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="text-amber-400 text-xs tracking-widest uppercase font-bold hover:text-amber-300 transition-colors border-b border-amber-400/30 pb-1">
              Request a Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* 2. NEWSLETTER SECTION */}
      <div className="bg-[#FAF7F2] border-y border-amber-900/10 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <h3 className="font-luxury text-3xl text-gold-gradient mb-2">Stay In The Loop</h3>
            <p className="text-black/40 text-xs tracking-wider uppercase">Subscribe for exclusive offers, new collections & carpet care tips.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-0 w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-black/5 border border-amber-900/20 px-6 py-4 text-sm text-black outline-none focus:bg-black/10 w-full rounded-l-xl"
            />
            <button type="submit" disabled={loading} className="btn-gold whitespace-nowrap px-8 rounded-l-none rounded-r-xl flex items-center gap-2">
              <FiSend /> SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      {/* 3. MAIN FOOTER */}
      <div className="bg-[#FAF7F2] py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-amber-400 text-[10px] tracking-[0.4em] uppercase font-bold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-4">
              {links.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-black/60 hover:text-amber-600 text-sm tracking-wider uppercase transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-8 flex flex-col items-start md:items-end md:text-right">
            <h4 className="text-amber-400 text-[10px] tracking-[0.4em] uppercase font-bold">Get In Touch</h4>
            <div className="space-y-4">
              <a href="mailto:jannatrugs786@gmail.com" className="flex items-center gap-3 text-black/60 hover:text-amber-600 transition-colors justify-end text-sm">
                <FiMail /> jannatrugs786@gmail.com
              </a>
              <a href="tel:+919235508422" className="flex items-center gap-3 text-black/60 hover:text-amber-600 transition-colors justify-end text-sm">
                <FiPhone /> +91 9235508422
              </a>
            </div>
            
            <div className="flex gap-4 pt-4">
              {[
                { icon: FiInstagram, href: '#' },
                { icon: FiFacebook, href: '#' },
                { icon: FiYoutube, href: '#' },
                { icon: FaWhatsapp, href: 'https://wa.me/919235508422' },
              ].map(({ icon: Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-amber-900/10 flex items-center justify-center text-black/40 hover:border-amber-600 hover:text-amber-600 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. COPYRIGHT */}
      <div className="bg-[#FAF7F2] border-t border-amber-900/10 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
          <p className="text-black/20 text-[10px] tracking-[0.3em] uppercase">
            © {new Date().getFullYear()} Jannat Rugs Co. All Rights Reserved.
          </p>
        </div>
      </div>

    </footer>
  );
}
