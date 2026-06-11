import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {}
  };

  return (
    <>
      <Helmet><title>Join the Family | Jannat Rugs Co.</title></Helmet>
      
      {/* LUXURY RUG BACKGROUND */}
      <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden bg-[#FAF7F2]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1594051663162-8173ef89d2d8?w=1600&q=80" 
            alt="Hand-woven Rug Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/70 via-transparent to-[#1A1A1A]/80" />
        </div>

        {/* BACK TO HOME */}
        <Link 
          to="/" 
          className="absolute top-10 left-10 z-30 flex items-center gap-3 text-white/60 hover:text-white transition-all font-bold text-[11px] uppercase tracking-[0.3em]"
        >
          <FiArrowRight className="rotate-180" /> Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[620px] relative z-10 flex flex-col items-center"
        >
          {/* LOGO (Positioned Above Card) */}
          <Link to="/" className="mb-12 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 bg-[#1A1A1A] rounded-[2.5rem] p-1 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-2 border-[#C9A84C]/50 flex items-center justify-center overflow-hidden"
            >
               <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
            </motion.div>
          </Link>

          {/* REGISTER GLASS CARD */}
          <div className="bg-white/95 backdrop-blur-3xl rounded-[4rem] p-14 sm:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.35)] border border-white/20 w-full relative overflow-hidden">
            
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* TITLES */}
            <div className="text-center mb-16">
              <h1 className="font-serif text-5xl text-[#111827] mb-6">Create Account</h1>
              <p className="text-[#C9A84C] text-[11px] font-black uppercase tracking-[0.5em] leading-relaxed">Become Part of the Artisanal Heritage</p>
              
              <div className="flex items-center justify-center gap-4 mt-10">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
                <div className="w-2.5 h-2.5 rotate-45 border border-[#C9A84C] bg-white shadow-sm" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                 <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C9A84C]/80 group-focus-within:text-[#C9A84C] group-focus-within:scale-110 transition-all"><FiUser size={18} /></div>
                    <input type="text" required autoFocus value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-14 pr-5 py-5 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-8 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium shadow-sm hover:border-gray-200" placeholder="Full Name" />
                 </div>
                 <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C9A84C]/80 group-focus-within:text-[#C9A84C] group-focus-within:scale-110 transition-all"><FiPhone size={18} /></div>
                    <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-14 pr-5 py-5 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-8 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium shadow-sm hover:border-gray-200" placeholder="Phone Number" />
                 </div>
              </div>

              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C9A84C]/80 group-focus-within:text-[#C9A84C] group-focus-within:scale-110 transition-all"><FiMail size={18} /></div>
                <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-14 pr-6 py-5 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-8 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium shadow-sm hover:border-gray-200" placeholder="Email Address" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                 <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C9A84C]/80 group-focus-within:text-[#C9A84C] group-focus-within:scale-110 transition-all"><FiLock size={18} /></div>
                    <input type={showPw ? 'text' : 'password'} required minLength={6} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-14 pr-12 py-5 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-8 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium shadow-sm hover:border-gray-200" placeholder="Password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1A1A1A] transition-colors">
                      {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                 </div>
                 <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C9A84C]/80 group-focus-within:text-[#C9A84C] group-focus-within:scale-110 transition-all"><FiLock size={18} /></div>
                    <input type="password" required value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                      className="w-full bg-white border border-gray-100 rounded-[2.5rem] pl-14 pr-5 py-5 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-8 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium shadow-sm hover:border-gray-200" placeholder="Confirm Password" />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-20 bg-gradient-to-r from-[#111827] to-[#1F2937] text-white rounded-[2.5rem] font-bold tracking-[0.25em] text-[11px] shadow-2xl hover:translate-y-[-2px] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 mt-12 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    JOIN THE FAMILY <FiArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-14 text-center">
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.15em] leading-relaxed">
                Already have an account?{' '}
                <Link to="/login" className="text-[#C9A84C] hover:text-[#B08D3E] transition-colors ml-1 font-black underline underline-offset-4 decoration-amber-500/30 hover:decoration-amber-500">Sign in here</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
