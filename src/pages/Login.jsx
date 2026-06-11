import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiChevronLeft } from 'react-icons/fi';
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

      <div className="min-h-screen flex bg-[#FAF7F2]">
        
        {/* ─── LEFT PANEL: Brand ─── */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&q=80"
            alt="Jannat Rugs"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/90 via-[#111827]/70 to-[#C9A84C]/30" />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full px-16 py-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden flex items-center justify-center shadow-lg">
                <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-serif text-xl tracking-wide">Jannat Rugs Co.</span>
            </Link>

            {/* Center text */}
            <div className="flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
              >
                <div className="w-12 h-1 bg-[#C9A84C] rounded-full mb-10" />
                <h2 className="font-serif text-5xl text-white leading-snug mb-6">
                  The Art of<br />Living Begins<br />Here
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                  Hand-knotted rugs crafted by master artisans. Each piece tells a story of heritage, craftsmanship, and beauty.
                </p>
              </motion.div>
            </div>

            {/* Bottom quote */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em]">
                Est. 2005 · Lahore, Pakistan
              </p>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL: Form ─── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 py-16 relative overflow-y-auto">

          {/* Back to home — top left */}
          <Link
            to="/"
            className="absolute top-8 left-8 flex items-center gap-2 text-[#888] hover:text-[#1A1A1A] transition-colors text-xs font-semibold uppercase tracking-widest group"
          >
            <FiChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-[440px]"
          >
            {/* Logo (mobile only) */}
            <div className="flex lg:hidden justify-center mb-10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#C9A84C]/30 shadow-lg">
                <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Header */}
            <div className="mb-10">
              <h1 className="font-serif text-4xl text-[#111827] mb-3">Welcome back</h1>
              <p className="text-[#888] text-sm leading-relaxed">
                Sign in to your account to continue your journey with us.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#444] uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]">
                    <FiMail size={17} />
                  </div>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-5 py-4 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all text-sm shadow-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#444] uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]">
                    <FiLock size={17} />
                  </div>
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-12 py-4 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all text-sm shadow-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A1A1A] transition-colors"
                  >
                    {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#111827] text-white rounded-xl font-semibold text-sm tracking-widest uppercase shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-gray-300 text-xs font-semibold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Register link */}
            <div className="text-center">
              <p className="text-[#888] text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-[#C9A84C] font-semibold hover:text-[#B08D3E] transition-colors"
                >
                  Create one for free
                </Link>
              </p>
            </div>

            {/* Admin Access */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <button
                onClick={async () => {
                  setForm({ email: 'admin@jannatrugs.com', password: 'admin123456' });
                  try {
                    const user = await login('admin@jannatrugs.com', 'admin123456');
                    if (user.role === 'admin') navigate('/admin');
                  } catch (e) {}
                }}
                className="w-full py-3.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-[#555] text-xs font-semibold uppercase tracking-widest transition-all hover:bg-[#F3EFE9] hover:border-gray-300 flex items-center justify-center gap-3 group cursor-pointer"
              >
                <FiShield size={16} className="text-[#C9A84C]" />
                Administrator Access
              </button>
              <p className="text-center text-[10px] text-gray-300 font-semibold uppercase tracking-widest mt-4">
                Jannat Rugs Co. Internal System
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
