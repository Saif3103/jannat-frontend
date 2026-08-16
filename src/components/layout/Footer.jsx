import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiInstagram, FiFacebook, FiYoutube, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Container from './Container';

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
    <footer className="relative font-sans pb-[72px] md:pb-0">
      
      {/* 1. CTA SECTION */}
      <div className="relative h-[360px] sm:h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/rug-cta-bg.jpg" 
            alt="Luxury Handmade Rug" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/95 via-[#FAF7F2]/50 to-[#FAF7F2]/80" />
        </div>
        
        <Container className="relative z-10 text-center">
          <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4 font-medium">Begin Your Journey</p>
          <h2 className="heading-section text-black mb-5">Ready to Transform<br />Your Space?</h2>
          <p className="text-black/60 text-sm sm:text-base mb-0 text-measure mx-auto leading-relaxed">
            Explore our exclusive collection of handmade luxury carpets and find the perfect masterpiece for your home.
          </p>
        </Container>
      </div>

      {/* 2. NEWSLETTER SECTION */}
      <div className="bg-[#1A1A1A] section-pad">
        <Container narrow className="text-center">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.4em] uppercase font-bold mb-3">Exclusive Access</p>
          <h3 className="heading-section text-white mb-4">Stay In The Loop</h3>
          <div className="w-12 h-[1px] bg-[#C9A84C] mx-auto mb-5" />
          <p className="text-white/50 text-sm tracking-wide mb-8 text-measure mx-auto">
            Subscribe for exclusive offers, new collections &amp; carpet care tips delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-0 w-full mx-auto shadow-2xl">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white/10 border border-white/20 px-5 py-4 text-sm text-white placeholder-white/40 outline-none focus:bg-white/20 focus:border-[#C9A84C] transition-all rounded-t-xl sm:rounded-t-none sm:rounded-l-xl"
            />
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-[#C9A84C] to-[#B69640] text-black font-bold whitespace-nowrap px-8 py-4 rounded-b-xl sm:rounded-b-none sm:rounded-r-xl flex items-center justify-center gap-3 text-xs tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60">
              <FiSend size={14} /> Subscribe
            </button>
          </form>
        </Container>
      </div>

      {/* 3. MAIN FOOTER */}
      <div className="bg-[#FAF7F2] pt-20 pb-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Quick Links */}
          <div className="space-y-6 text-center md:text-left">
            <h4 className="text-[#1A1A1A] text-[10px] tracking-[0.35em] uppercase font-bold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {links.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-black/55 hover:text-[#1A1A1A] text-xs tracking-wider uppercase transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-6 flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="text-[#1A1A1A] text-[10px] tracking-[0.35em] uppercase font-bold">Get In Touch</h4>
            <div className="space-y-4">
              <a href="mailto:jannatrugs786@gmail.com" className="flex items-center gap-2.5 text-black/55 hover:text-[#1A1A1A] transition-colors text-sm justify-center md:justify-end">
                <FiMail size={14} /> jannatrugs786@gmail.com
              </a>
              <a href="tel:+919235508422" className="flex items-center gap-2.5 text-black/55 hover:text-[#1A1A1A] transition-colors text-sm justify-center md:justify-end">
                <FiPhone size={14} /> +91 9235508422
              </a>
            </div>
            
            <div className="flex gap-4 pt-2 justify-center md:justify-end">
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
                  className="w-10 h-10 rounded-full border border-amber-900/20 flex items-center justify-center text-black/55 hover:border-amber-600 hover:text-[#1A1A1A] transition-all duration-300 shadow-sm bg-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          </div>
        </Container>
      </div>

      {/* 4. COPYRIGHT */}
      <div className="bg-[#1A1A1A] py-6">
        <Container>
          <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase text-center">
            © {new Date().getFullYear()} Jannat Rugs Co. All Rights Reserved.
          </p>
        </Container>
      </div>

    </footer>
  );
}
