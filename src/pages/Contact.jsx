import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiSearch } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We\'ll get back to you soon. 📩');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch { toast.error('Failed to send message'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Jannat Rugs Co.</title>
        <meta name="description" content="Get in touch with Jannat Rugs Co. for inquiries about our luxury handmade carpets." />
      </Helmet>
      <div className="pt-20 min-h-screen">
        <div className="py-20 px-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 100%)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">We're Here For You</p>
          <h1 className="font-luxury text-5xl md:text-6xl text-white mb-4">Get In Touch</h1>
          <div className="divider-gold mx-auto mb-4" />
          <p className="text-amber-100/50 max-w-lg mx-auto text-sm leading-relaxed">
            Have a question about a carpet, or need a custom design? We're here to help you bring luxury into your home.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="flex flex-col items-center gap-16">
            
            {/* Info Cards (Centered) */}
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {[
                { icon: FiMail, label: 'Email Us', value: 'jannatrugs786@gmail.com', href: 'mailto:jannatrugs786@gmail.com' },
                { icon: FiPhone, label: 'Call Us', value: '+91 9235508422\n+91 9696700737', href: 'tel:+919235508422' },
                { icon: FiMapPin, label: 'Our Location', value: 'Ghantaghar, Mirzapur\nUttar Pradesh, India', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="glass-card p-8 flex flex-col items-center text-center w-full sm:w-[280px]">
                  <div className="w-16 h-16 rounded-full border border-amber-900/40 flex items-center justify-center mb-6 bg-amber-900/10">
                    <Icon size={24} className="text-amber-400" />
                  </div>
                  <h3 className="font-luxury text-xl text-white mb-2">{label}</h3>
                  {href ? (
                    <a href={href} className="text-amber-100/60 hover:text-amber-400 transition-colors text-sm whitespace-pre-line leading-relaxed">{value}</a>
                  ) : (
                    <p className="text-amber-100/60 text-sm whitespace-pre-line leading-relaxed">{value}</p>
                  )}
                </div>
              ))}
            </div>

            <a href="https://wa.me/919235508422?text=Hello%20Jannat%20Rugs%20Co.!"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full border border-green-700/40 bg-green-900/10 text-green-400 hover:bg-green-900/20 hover:scale-105 transition-all w-full sm:w-auto">
              <FaWhatsapp size={24} /> Chat on WhatsApp
            </a>

            <div className="w-full h-px bg-amber-900/20 my-4" />

            {/* Form (Centered) */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
              <div className="glass-card p-10 sm:p-14">
                <div className="text-center mb-10">
                  <h2 className="font-luxury text-4xl text-white mb-3">Send a Message</h2>
                  <p className="text-amber-100/40 text-sm tracking-wider uppercase">We'll respond within 24 hours.</p>
                </div>
                
                <form onSubmit={submit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-amber-100/50 block mb-2 uppercase tracking-wider pl-1">Your Name</label>
                      <input type="text" required value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="input-luxury w-full" id="contact-name" />
                    </div>
                    <div>
                      <label className="text-xs text-amber-100/50 block mb-2 uppercase tracking-wider pl-1">Phone Number</label>
                      <input type="tel" value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="input-luxury w-full" id="contact-phone" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-2 uppercase tracking-wider pl-1">Email Address</label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="input-luxury w-full" id="contact-email" />
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-2 uppercase tracking-wider pl-1">Message</label>
                    <textarea rows={6} required value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your carpet requirements..."
                      className="input-luxury resize-none w-full" id="contact-message" />
                  </div>
                  <div className="pt-4 text-center">
                    <button type="submit" disabled={loading} id="contact-submit" className="btn-gold inline-flex items-center justify-center gap-2 px-16 py-4">
                      <FiSend size={16} /> {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
