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

      {/* Page Background */}
      <div className="min-h-screen bg-[#F0EDE8] flex items-center justify-center p-4 sm:p-8">

        {/* Floating Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[580px]"
        >

          {/* ── LEFT PANEL ── */}
          <div className="relative md:w-[42%] bg-[#1A1A1A] flex flex-col items-center justify-center p-10 overflow-hidden">

            {/* Decorative shapes */}
            <div className="absolute top-6 right-6 w-10 h-10 rotate-45 border-2 border-[#C9A84C]/40 rounded-sm" />
            <div className="absolute top-16 right-10 w-5 h-5 rotate-45 bg-[#C9A84C]/20 rounded-sm" />
            <div className="absolute bottom-10 left-6 w-14 h-14 rotate-45 border-2 border-[#C9A84C]/30 rounded-sm" />
            <div className="absolute bottom-24 left-12 w-6 h-6 rotate-45 bg-[#C9A84C]/15 rounded-sm" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full border border-[#C9A84C]/10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-[#C9A84C]/10" />

            {/* Logo */}
            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#C9A84C]/40">
                <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
              </div>
              <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Jannat Rugs</span>
            </Link>

            {/* Text */}
            <div className="text-center relative z-10">
              <div className="w-12 h-px bg-[#C9A84C]/60 mx-auto mb-6" />
              <h2 className="font-luxury text-4xl text-white mb-4 leading-tight">
                Welcome<br />Back!
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-[200px] mx-auto mb-10">
                Sign in with your personal info to stay connected with us.
              </p>

              {/* Switch to Register */}
              <Link
                to="/register"
                className="inline-block border-2 border-white/30 text-white text-xs font-bold tracking-[0.25em] uppercase px-8 py-3 rounded-full hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-14 py-12">

            <div className="w-full max-w-sm">
              <h1 className="font-luxury text-3xl sm:text-4xl text-[#1A1A1A] text-center mb-2">Sign In</h1>
              <p className="text-[#999] text-xs text-center mb-8 tracking-wide">Enter your credentials to continue</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                  <input
                    type="email" required autoFocus
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-[#F7F5F2] border border-gray-200 rounded-xl pl-11 pr-4 py-4 text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                    placeholder="Email"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                  <input
                    type={showPw ? 'text' : 'password'} required
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-[#F7F5F2] border border-gray-200 rounded-xl pl-11 pr-12 py-4 text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                    placeholder="Password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A84C] transition-colors">
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit" disabled={isLoading}
                  className="w-full py-4 mt-2 bg-[#1A1A1A] text-white rounded-full font-bold text-xs tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-black transition-all duration-300 shadow-lg shadow-black/10 flex items-center justify-center disabled:opacity-60 cursor-pointer"
                >
                  {isLoading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : 'Sign In'}
                </button>
              </form>

              {/* Bottom Links */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  onClick={async () => {
                    try { const u = await login('admin@jannatrugs.com', 'admin123456'); if (u.role === 'admin') navigate('/admin'); } catch (e) {}
                  }}
                  className="text-[10px] text-gray-400 hover:text-[#C9A84C] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                >
                  <FiShield size={11} /> Admin Access
                </button>
                <Link to="/" className="text-[10px] text-gray-400 hover:text-gray-700 transition-colors font-medium">
                  ← Return to Home
                </Link>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </>
  );
}
