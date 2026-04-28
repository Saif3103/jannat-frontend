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
        <div className="py-16 text-center" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 100%)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-2">We're Here For You</p>
          <h1 className="font-luxury text-5xl text-white mb-3">Get In Touch</h1>
          <div className="divider-gold" />
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="font-luxury text-3xl text-amber-400 mb-8">Contact Information</h2>
              <div className="space-y-6">
                {[
                  { icon: FiMail, label: 'Email', value: 'jannatrugs786@gmail.com', href: 'mailto:jannatrugs786@gmail.com' },
                  { icon: FiPhone, label: 'Phone 1', value: '+91 9235508422', href: 'tel:+919235508422' },
                  { icon: FiPhone, label: 'Phone 2', value: '+91 9696700737', href: 'tel:+919696700737' },
                  { icon: FiMapPin, label: 'Location', value: 'India – Serving Nationwide', href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-xl border border-amber-900/30 flex items-center justify-center flex-shrink-0 group-hover:border-amber-500/50 transition-colors">
                      <Icon size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-amber-100/40 text-xs uppercase tracking-widest mb-1">{label}</p>
                      {href ? (
                        <a href={href} className="text-amber-100 hover:text-amber-400 transition-colors">{value}</a>
                      ) : (
                        <p className="text-amber-100">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <a href="https://wa.me/919235508422?text=Hello%20Jannat%20Rugs%20Co.!"
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-3 mt-10 px-6 py-4 rounded-xl border border-green-700/40 bg-green-900/10 text-green-400 hover:bg-green-900/20 transition-all">
                <FaWhatsapp size={24} /> Chat on WhatsApp
              </a>

              {/* Map embed placeholder */}
              <div className="mt-8 rounded-2xl overflow-hidden border border-amber-900/20" style={{ height: '220px' }}>
                <iframe
                  title="Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14728.56!2d81.0!3d26.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQ4JzAwLjAiTiA4McKwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin"
                  width="100%" height="100%" style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(80%)' }}
                  allowFullScreen loading="lazy"
                />
              </div>
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card p-8">
                <h2 className="font-luxury text-3xl text-white mb-2">Send a Message</h2>
                <p className="text-amber-100/40 text-sm mb-8">We'll respond within 24 hours.</p>
                <form onSubmit={submit} className="space-y-5">
                  {[
                    { key: 'name', label: 'Your Name', type: 'text', required: true },
                    { key: 'email', label: 'Email Address', type: 'email', required: true },
                    { key: 'phone', label: 'Phone Number', type: 'tel', required: false },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">{f.label}</label>
                      <input type={f.type} required={f.required} value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="input-luxury" id={`contact-${f.key}`} />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Message</label>
                    <textarea rows={5} required value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your carpet requirements..."
                      className="input-luxury resize-none" id="contact-message" />
                  </div>
                  <button type="submit" disabled={loading} id="contact-submit" className="btn-gold w-full py-3 flex items-center justify-center gap-2">
                    <FiSend size={16} /> {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
