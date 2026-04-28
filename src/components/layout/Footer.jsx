import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiInstagram, FiFacebook, FiYoutube, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
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
    <footer className="relative mt-20" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      {/* Newsletter Section (Centered) */}
      <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.05), rgba(201,168,76,0.02))' }} className="py-16 border-b border-amber-900/20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h3 className="font-luxury text-3xl text-gold-gradient mb-3">Stay In The Loop</h3>
          <p className="text-amber-100/50 text-sm mb-8">Subscribe for exclusive offers, new collections & carpet care tips.</p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="input-luxury w-full sm:w-72 text-center sm:text-left"
              id="newsletter-input"
            />
            <button type="submit" disabled={loading} className="btn-gold flex items-center justify-center gap-2 px-8" id="newsletter-submit">
              <FiSend size={16} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer (Full Width Layout) */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-between">
          
          {/* Brand & Logo (Left) */}
          <div className="flex flex-col items-start md:max-w-sm">
            <img src="/logo.png" alt="Jannat Rugs Co." className="w-24 h-24 object-cover rounded-full border border-amber-900/30 mb-6 p-1 bg-[#0a0a0a]"
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
            <div style={{ display: 'none' }}>
              <div className="font-luxury text-gold-gradient text-3xl font-bold tracking-wider mb-2">JANNAT</div>
            </div>
            <p className="text-amber-100/50 text-sm leading-relaxed text-left">
              Crafting luxury carpets and rugs with heritage artistry. Each piece is a masterwork of tradition and elegance.
            </p>
          </div>

          {/* Links (Center) */}
          <div className="flex flex-col items-start md:items-center">
            <div className="flex flex-col items-start">
              <h4 className="text-amber-400 text-xs tracking-widest uppercase mb-6">Quick Links</h4>
              <div className="flex flex-col gap-3">
                {links.map(link => (
                  <Link key={link.path} to={link.path}
                    className="text-amber-100/60 hover:text-amber-400 transition-colors text-sm uppercase tracking-wider text-left">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact (Right) */}
          <div className="flex flex-col items-start md:items-end text-left md:text-right">
            <h4 className="text-amber-400 text-xs tracking-widest uppercase mb-6">Get In Touch</h4>
            <div className="flex flex-col gap-4 text-sm text-amber-100/50 mb-6 w-full items-start md:items-end">
              <a href="mailto:jannatrugs786@gmail.com" className="flex items-center gap-3 hover:text-amber-400 transition-colors justify-end">
                <FiMail size={16} /> jannatrugs786@gmail.com
              </a>
              <a href="tel:+919235508422" className="flex items-center gap-3 hover:text-amber-400 transition-colors justify-end">
                <FiPhone size={16} /> +91 9235508422
              </a>
            </div>
            <div className="flex gap-4">
              {[
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiYoutube, href: '#', label: 'YouTube' },
                { icon: FaWhatsapp, href: 'https://wa.me/919235508422', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="w-10 h-10 rounded-full border border-amber-900/40 flex items-center justify-center text-amber-100/50 hover:border-amber-400 hover:text-amber-400 transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-amber-900/15" style={{ background: 'rgba(201,168,76,0.02)' }}>
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-wrap justify-center gap-8">
          {['100% Handmade', 'Free Returns', 'Secure Pay', 'Fast Delivery'].map(badge => (
            <div key={badge} className="text-amber-100/40 text-xs tracking-widest uppercase flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-700/50" />
              {badge}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-amber-900/15 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <p className="text-amber-100/30 text-xs tracking-wider">
            © {new Date().getFullYear()} JANNAT RUGS CO. ALL RIGHTS RESERVED.
          </p>
          <p className="text-amber-100/20 text-[10px] tracking-widest uppercase">
            Premium Handmade Carpets & Luxury Rugs
          </p>
        </div>
      </div>
    </footer>
  );
}
