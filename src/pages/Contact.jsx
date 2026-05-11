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
    <div className="pt-24 min-h-screen bg-white">
      <Helmet>
        <title>Contact Us | Jannat Rugs Co.</title>
        <meta name="description" content="Get in touch with Jannat Rugs Co. for inquiries about our luxury handmade carpets." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-20">
          <p className="text-[#C9A84C] text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] mb-3 sm:mb-4">We're Here For You</p>
          <h1 className="text-3xl sm:text-6xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-6">Let's Connect</h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed px-4">Have a question about our collections or need a bespoke masterpiece? Our luxury consultants are ready to assist you.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-16 sm:mb-24">
          {[
            { icon: FiMail, label: 'Email', value: 'jannatrugs786@gmail.com', href: 'mailto:jannatrugs786@gmail.com' },
            { icon: FiPhone, label: 'Phone', value: '+91 9235508422', href: 'tel:+919235508422' },
            { icon: FiMapPin, label: 'Showroom', value: 'Mirzapur, UP', href: null },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="bg-gray-50 border border-gray-100 p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] text-center flex flex-col items-center group hover:bg-white hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-white flex items-center justify-center text-[#C9A84C] shadow-sm mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg sm:text-xl mb-1 sm:mb-2">{label}</h3>
              {href ? (
                <a href={href} className="text-gray-500 text-xs sm:text-sm font-medium hover:text-[#C9A84C] transition-colors truncate w-full px-2">{value}</a>
              ) : (
                <p className="text-gray-500 text-xs sm:text-sm font-medium">{value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12 sm:gap-20 items-start">
          {/* Form Side */}
          <div className="w-full lg:w-2/3 bg-gray-50 p-6 sm:p-16 rounded-[2rem] sm:rounded-[3rem] border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send an Inquiry</h2>
            <p className="text-gray-400 text-[10px] sm:text-sm mb-8 sm:mb-10 font-medium tracking-wide uppercase">Response within 24 hours</p>
            
            <form onSubmit={submit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5 sm:mb-2 pl-1">Full Name</label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] transition-all" />
                </div>
                <div>
                  <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5 sm:mb-2 pl-1">Email Address</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] transition-all" />
                </div>
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5 sm:mb-2 pl-1">Phone Number</label>
                <input type="tel" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] transition-all" />
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5 sm:mb-2 pl-1">Your Message</label>
                <textarea rows={5} required value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Share your requirements..."
                  className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] transition-all resize-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold tracking-widest text-[10px] sm:text-xs hover:bg-gray-900 transition-all active:scale-[0.98] shadow-xl">
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

          {/* Social Side */}
          <div className="w-full lg:w-1/3">
             <div className="sticky top-32 space-y-8 sm:space-y-12">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Concierge Support</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">Reach out via our direct WhatsApp channel for bespoke consultations. Available 24/7.</p>
                  <a href="https://wa.me/919235508422" className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-green-500/20 transition-all">
                    <FaWhatsapp size={20} className="sm:w-6 sm:h-6" /> WhatsApp Consultation
                  </a>
                </div>
                
                <div className="pt-6 sm:pt-8 border-t border-gray-100">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Visit Our Showroom</h3>
                  <div className="w-full aspect-video rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    <iframe 
                      title="Showroom Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.123456789!2d82.56!3d25.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA5JzAwLjAiTiA4MsKwMzMnMzYuMCJF!5e0!3m2!1sen!2sin!4v1234567890123" 
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
