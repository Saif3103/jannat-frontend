import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiArrowRight, FiChevronLeft } from 'react-icons/fi';
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
      <Helmet><title>Create Account | Jannat Rugs Co.</title></Helmet>

      <div className="min-h-screen flex bg-[#FAF7F2]">

        {/* ─── LEFT PANEL: Brand ─── */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1594051663162-8173ef89d2d8?w=1200&q=80"
            alt="Jannat Rugs"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#111827]/92 via-[#111827]/75 to-[#C9A84C]/25" />

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
                  Join Our<br />Artisanal<br />Heritage
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                  Become part of a community that cherishes timeless craftsmanship and the beauty of handmade rugs.
                </p>

                {/* Features */}
                <div className="mt-12 space-y-4">
                  {[
                    'Exclusive member discounts',
                    'Early access to new collections',
                    'Dedicated customer support',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                      </div>
                      <span className="text-white/60 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.3em]">
                Est. 2005 · Lahore, Pakistan
              </p>
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL: Form ─── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 py-16 relative overflow-y-auto">

          {/* Back to home */}
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
            className="w-full max-w-[480px]"
          >
            {/* Logo (mobile only) */}
            <div className="flex lg:hidden justify-center mb-10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#C9A84C]/30 shadow-lg">
                <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Header */}
            <div className="mb-10">
              <h1 className="font-serif text-4xl text-[#111827] mb-3">Create your account</h1>
              <p className="text-[#888] text-sm leading-relaxed">
                Join thousands of customers who love our handcrafted rugs.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#444] uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]">
                    <FiUser size={17} />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-5 py-4 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all text-sm shadow-sm"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#444] uppercase tracking-widest mb-2">
                  Phone Number <span className="normal-case font-normal text-gray-300">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]">
                    <FiPhone size={17} />
                  </div>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-5 py-4 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all text-sm shadow-sm"
                    placeholder="+92 300 000 0000"
                  />
                </div>
              </div>

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
                    minLength={6}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-12 py-4 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all text-sm shadow-sm"
                    placeholder="Min. 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-[#444] uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]">
                    <FiLock size={17} />
                  </div>
                  <input
                    type="password"
                    required
                    value={form.confirm}
                    onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-5 py-4 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all text-sm shadow-sm"
                    placeholder="Repeat your password"
                  />
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
                      Create Account
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

            {/* Login link */}
            <div className="text-center">
              <p className="text-[#888] text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#C9A84C] font-semibold hover:text-[#B08D3E] transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Terms note */}
            <p className="text-center text-xs text-gray-300 mt-8 leading-relaxed">
              By creating an account, you agree to our{' '}
              <span className="text-gray-400 font-semibold">Terms of Service</span>{' '}
              and{' '}
              <span className="text-gray-400 font-semibold">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
