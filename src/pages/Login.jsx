import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
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
      if (user.role === 'admin') navigate('/admin');
      else navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {}
  };

  return (
    <>
      <Helmet><title>Login | Jannat Rugs Co.</title></Helmet>

      <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF7F2]">
        {/* Left Side - Image Showcase */}
        <div className="hidden md:flex md:w-1/2 relative bg-black overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80" 
            alt="Luxury Interior" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          
          <div className="absolute bottom-0 left-0 w-full p-16 z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
              <p className="text-[#C9A84C] text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase mb-4">Welcome to Excellence</p>
              <h2 className="font-luxury text-4xl lg:text-6xl text-white mb-6 leading-tight">
                Step Into <br/><span className="text-[#C9A84C] italic">Luxury.</span>
              </h2>
              <div className="w-16 h-px bg-[#C9A84C]/50 mb-6" />
              <p className="text-white/60 text-sm leading-relaxed max-w-md font-medium">
                Sign in to manage your orders, track your bespoke commissions, and access exclusive luxury collections reserved for our members.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20 bg-white relative min-h-screen md:min-h-0">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }} />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl relative z-10"
          >
            {/* Logo */}
            <div className="mb-10 flex flex-col items-center md:items-start text-center md:text-left">
              <Link to="/" className="inline-block mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#C9A84C]/30 shadow-md">
                  <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
                </div>
              </Link>
              <h1 className="font-luxury text-4xl sm:text-5xl text-[#1A1A1A] mb-3">Welcome Back</h1>
              <p className="text-[#888] text-sm sm:text-base">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-3">Email Address</label>
                <div className="relative group">
                  <input
                    type="email" required autoFocus
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-6 py-5 text-base text-[#1A1A1A] placeholder:text-gray-400 focus:bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-[0.2em] mb-3">Password</label>
                <div className="relative group">
                  <input
                    type={showPw ? 'text' : 'password'} required
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-6 pr-14 py-5 text-base text-[#1A1A1A] placeholder:text-gray-400 focus:bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-[#C9A84C] transition-colors">
                    {showPw ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={isLoading}
                className="w-full mt-2 py-5 bg-[#1A1A1A] text-white rounded-2xl font-bold text-sm tracking-[0.2em] uppercase shadow-xl shadow-black/10 hover:bg-black hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
              >
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Sign In'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[#888] font-medium">
                New to Jannat Rugs?{' '}
                <Link to="/register" className="text-[#C9A84C] font-bold hover:text-[#B08D3E] transition-colors underline underline-offset-4">
                  Create Account
                </Link>
              </p>
              
              <button
                onClick={async () => {
                  try { const u = await login('admin@jannatrugs.com', 'admin123456'); if (u.role === 'admin') navigate('/admin'); } catch (e) {}
                }}
                className="text-[10px] text-gray-400 hover:text-[#C9A84C] font-bold uppercase tracking-[0.1em] flex items-center gap-1.5 transition-colors"
              >
                <FiShield size={12} /> Admin Access
              </button>
            </div>
            
            <div className="mt-10 text-center md:text-left">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors font-medium">
                ← Return to Home
              </Link>
            </div>

          </motion.div>
        </div>
      </div>
    </>
  );
}

