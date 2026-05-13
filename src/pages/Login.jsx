import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield } from 'react-icons/fi';
import { useAuthStore } from '../store';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect ? `/${redirect}` : '/');
      }
    } catch (err) {}
  };

  return (
    <>
      <Helmet><title>Login | Jannat Rugs Co.</title></Helmet>
      
      {/* LUXURY SILK BACKGROUND */}
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#FAF7F2]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=80" 
            alt="Silk Texture" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-[#D4AF37]/5" />
        </div>

        {/* BACK TO HOME */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 z-30 flex items-center gap-2 text-[#1A1A1A]/40 hover:text-[#C9A84C] transition-colors font-bold text-[10px] uppercase tracking-[0.2em]"
        >
          <FiArrowRight className="rotate-180" /> Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[580px] relative z-10 pt-16"
        >
          {/* OVERLAPPING LOGO */}
          <Link to="/" className="absolute top-0 left-1/2 -translate-x-1/2 z-20 block group">
            <div className="w-28 h-28 bg-[#1A1A1A] rounded-[2.2rem] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-[#C9A84C]/40 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
               <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
            </div>
          </Link>

          {/* LOGIN CARD */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-[5rem] p-12 sm:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-white relative overflow-hidden">
            
            {/* GEOMETRIC CORNER PATTERNS */}
            <div className="absolute top-0 left-0 w-48 h-48 opacity-[0.04] pointer-events-none">
               <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="pattern-circles-login" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="9" stroke="#1A1A1A" strokeWidth="0.5" />
                    <circle cx="10" cy="10" r="5" stroke="#1A1A1A" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100" height="100" fill="url(#pattern-circles-login)" />
               </svg>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04] pointer-events-none rotate-90">
               <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="url(#pattern-circles-login)" />
               </svg>
            </div>

            {/* TITLES */}
            <div className="text-center mb-12 mt-4">
              <h1 className="font-serif text-5xl sm:text-6xl text-[#1A1A1A] mb-4 tracking-tight">Welcome Back</h1>
              <p className="text-[#C9A84C] text-sm sm:text-base font-bold uppercase tracking-[0.2em] opacity-80">Continue your journey in luxury</p>
              
              {/* Luxury Divider */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
                <div className="w-2 h-2 rotate-45 border border-[#C9A84C] bg-white shadow-sm" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#C9A84C] group-focus-within:scale-110 transition-transform">
                  <FiMail size={20} />
                </div>
                <input 
                  type="email" 
                  required 
                  autoFocus
                  value={form.email} 
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white border border-[#F1F5F9] rounded-[2rem] pl-16 pr-6 py-5 text-[#1A1A1A] placeholder:text-[#94A3B8] focus:border-[#C9A84C] focus:ring-8 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium shadow-sm" 
                  placeholder="Email address"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#C9A84C] group-focus-within:scale-110 transition-transform">
                  <FiLock size={20} />
                </div>
                <input 
                  type={showPw ? 'text' : 'password'} 
                  required 
                  value={form.password} 
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white border border-[#F1F5F9] rounded-[2rem] pl-16 pr-16 py-5 text-[#1A1A1A] placeholder:text-[#94A3B8] focus:border-[#C9A84C] focus:ring-8 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium shadow-sm" 
                  placeholder="Password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1A1A1A] transition-colors"
                >
                  {showPw ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-18 bg-gradient-to-r from-[#111827] to-[#1F2937] text-white rounded-[2rem] font-bold tracking-[0.2em] text-sm shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 mt-10"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    SIGN IN
                    <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* CREATE ACCOUNT */}
            <div className="mt-10 text-center">
              <p className="text-[#64748B] text-sm font-medium">
                New to Jannat Rugs?{' '}
                <Link to="/register" className="text-[#C9A84C] hover:text-[#B08D3E] transition-colors font-bold ml-1">Create an account</Link>
              </p>
            </div>

            {/* INTERNAL ACCESS SECTION */}
            <div className="mt-16">
              <div className="flex items-center gap-6 mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#E2E8F0]" />
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-[0.3em] whitespace-nowrap">Internal Access Only</p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#E2E8F0]" />
              </div>

              <button 
                onClick={async () => {
                  setForm({ email: 'admin@jannatrugs.com', password: 'admin123456' });
                  try {
                    const user = await login('admin@jannatrugs.com', 'admin123456');
                    if (user.role === 'admin') navigate('/admin');
                  } catch (e) {}
                }}
                className="w-full h-16 bg-white hover:bg-[#FAF7F2] border border-[#F1F5F9] rounded-[2rem] text-[#475569] text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-between px-8 group"
              >
                <div className="flex items-center gap-4">
                  <FiShield className="text-[#C9A84C]" size={20} />
                  Login as Administrator
                </div>
                <FiArrowRight className="text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-8 text-[#94A3B8]">
                 <FiShield size={14} className="text-[#C9A84C]/50" />
                 <p className="text-[10px] font-bold uppercase tracking-widest">
                   Demo: admin@jannatrugs.com / admin123456
                 </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
