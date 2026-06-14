import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';
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

      <div className="min-h-screen bg-[#F0EDE8] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[640px]"
        >

          {/* ── RIGHT PANEL (dark) ── */}
          <div className="relative md:w-[42%] bg-[#1A1A1A] flex flex-col items-center justify-center p-12 overflow-hidden">
            <div className="absolute top-6 left-6 w-10 h-10 rotate-45 border-2 border-[#C9A84C]/40 rounded-sm" />
            <div className="absolute top-16 left-10 w-5 h-5 rotate-45 bg-[#C9A84C]/20 rounded-sm" />
            <div className="absolute bottom-10 right-6 w-14 h-14 rotate-45 border-2 border-[#C9A84C]/30 rounded-sm" />
            <div className="absolute bottom-24 right-12 w-6 h-6 rotate-45 bg-[#C9A84C]/15 rounded-sm" />
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border border-[#C9A84C]/10" />
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full border border-[#C9A84C]/10" />

            <Link to="/" className="absolute top-8 right-8 flex items-center gap-2">
              <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">Jannat Rugs</span>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#C9A84C]/40">
                <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
              </div>
            </Link>

            <div className="text-center relative z-10">
              <div className="w-14 h-px bg-[#C9A84C]/60 mx-auto mb-8" />
              <h2 className="font-luxury text-5xl text-white mb-5 leading-tight">
                Hello,<br />Friend!
              </h2>
              <p className="text-white/50 text-base leading-relaxed max-w-[200px] mx-auto mb-12">
                Already have an account? Sign in to continue.
              </p>
              <Link
                to="/login"
                className="inline-block border-2 border-white/30 text-white text-sm font-bold tracking-[0.2em] uppercase px-10 py-4 rounded-full hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* ── LEFT PANEL (form) ── */}
          <div className="flex-1 flex flex-col items-center justify-center px-10 sm:px-16 py-12">
            <div className="w-full max-w-sm">

              <h1 className="font-luxury text-4xl sm:text-5xl text-[#1A1A1A] text-center mb-3">Create Account</h1>
              <p className="text-[#aaa] text-sm text-center mb-10 tracking-wide">Join the Jannat family today</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" required autoFocus
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#F7F5F2] border border-gray-200 rounded-2xl px-6 py-5 text-base text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                  placeholder="Full Name"
                />

                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-[#F7F5F2] border border-gray-200 rounded-2xl px-6 py-5 text-base text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                  placeholder="Phone (optional)"
                />

                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[#F7F5F2] border border-gray-200 rounded-2xl px-6 py-5 text-base text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                  placeholder="Email"
                />

                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} required minLength={6}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-[#F7F5F2] border border-gray-200 rounded-2xl px-6 pr-14 py-5 text-base text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                    placeholder="Password (min 6)"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A84C] transition-colors">
                    {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>

                <input
                  type={showPw ? 'text' : 'password'} required
                  value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full bg-[#F7F5F2] border border-gray-200 rounded-2xl px-6 py-5 text-base text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                  placeholder="Confirm Password"
                />

                <button
                  type="submit" disabled={isLoading}
                  className="w-full py-5 mt-2 bg-[#1A1A1A] text-white rounded-full font-bold text-sm tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-black transition-all duration-300 shadow-lg flex items-center justify-center disabled:opacity-60 cursor-pointer"
                >
                  {isLoading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : 'Create Account'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link to="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium">
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
