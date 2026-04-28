import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiYoutube, FiTwitter, FiSend } from 'react-icons/fi';
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

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'Offers', path: '/offers' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const policyLinks = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Order Tracking', path: '/order-tracking' },
    { label: 'Wishlist', path: '/wishlist' },
  ];

  return (
    <footer style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
      {/* Newsletter */}
      <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))' }}
        className="py-12 border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-luxury text-2xl text-gold-gradient mb-1">Stay In The Loop</h3>
            <p className="text-amber-100/50 text-sm">Subscribe for exclusive offers, new collections & carpet care tips</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex gap-3 w-full md:w-auto min-w-[340px]">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="input-luxury flex-1"
              id="newsletter-input"
            />
            <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 whitespace-nowrap" id="newsletter-submit">
              <FiSend size={16} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <div className="font-luxury text-gold-gradient text-3xl font-bold tracking-wider">JANNAT</div>
              <div className="text-xs tracking-[0.4em] text-amber-200/40 font-light mt-1">RUGS CO.</div>
            </div>
            <p className="text-amber-100/50 text-sm leading-relaxed mb-6">
              Crafting luxury carpets and rugs with heritage artistry. Each piece is a masterwork of tradition and elegance.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiYoutube, href: '#', label: 'YouTube' },
                { icon: FaWhatsapp, href: 'https://wa.me/919235508422', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-full border border-amber-900/40 flex items-center justify-center text-amber-100/50 hover:border-amber-500 hover:text-amber-400 transition-all duration-300">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-luxury text-lg text-amber-400 mb-5 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="text-amber-100/50 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-4 h-px bg-amber-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy Links */}
          <div>
            <h4 className="font-luxury text-lg text-amber-400 mb-5 tracking-wide">Information</h4>
            <ul className="space-y-3">
              {policyLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="text-amber-100/50 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-4 h-px bg-amber-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-luxury text-lg text-amber-400 mb-5 tracking-wide">Contact Us</h4>
            <div className="space-y-4">
              <a href="mailto:jannatrugs786@gmail.com"
                className="flex items-start gap-3 text-amber-100/50 hover:text-amber-400 transition-colors group">
                <FiMail size={16} className="mt-0.5 flex-shrink-0 group-hover:text-amber-400" />
                <span className="text-sm">jannatrugs786@gmail.com</span>
              </a>
              <a href="tel:+919235508422"
                className="flex items-center gap-3 text-amber-100/50 hover:text-amber-400 transition-colors group">
                <FiPhone size={16} className="group-hover:text-amber-400" />
                <span className="text-sm">+91 9235508422</span>
              </a>
              <a href="tel:+919696700737"
                className="flex items-center gap-3 text-amber-100/50 hover:text-amber-400 transition-colors group">
                <FiPhone size={16} className="group-hover:text-amber-400" />
                <span className="text-sm">+91 9696700737</span>
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-2">
              {['100% Handmade', 'Free Returns', 'Secure Pay', 'Fast Delivery'].map(badge => (
                <div key={badge} className="text-center py-2 border border-amber-900/30 rounded text-amber-100/40 text-xs hover:border-amber-500/30 transition-colors">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-amber-900/15 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-amber-100/30 text-xs text-center">
            © {new Date().getFullYear()} Jannat Rugs Co. All rights reserved.
          </p>
          <p className="text-amber-100/20 text-xs">
            Premium Handmade Carpets & Luxury Rugs
          </p>
        </div>
      </div>
    </footer>
  );
}
