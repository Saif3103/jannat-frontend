import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
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

  const fields = [
    { key: 'name',    icon: FiUser,  type: 'text',     placeholder: 'Full Name',         required: true,  autoFocus: true },
    { key: 'phone',   icon: FiPhone, type: 'tel',      placeholder: 'Phone (optional)',   required: false },
    { key: 'email',   icon: FiMail,  type: 'email',    placeholder: 'Email',             required: true },
    { key: 'password',icon: FiLock,  type: 'password', placeholder: 'Password (min 6)',  required: true,  minLength: 6 },
    { key: 'confirm', icon: FiLock,  type: 'password', placeholder: 'Confirm Password',  required: true },
  ];

  return (
    <>
      <Helmet><title>Create Account | Jannat Rugs Co.</title></Helmet>

      {/* Page Background */}
      <div className="min-h-screen bg-[#F0EDE8] flex items-center justify-center p-4 sm:p-8">

        {/* Floating Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[620px]"
        >

          {/* ── RIGHT PANEL (reversed = left on screen) ── */}
          <div className="relative md:w-[42%] bg-[#1A1A1A] flex flex-col items-center justify-center p-10 overflow-hidden">

            {/* Decorative shapes */}
            <div className="absolute top-6 left-6 w-10 h-10 rotate-45 border-2 border-[#C9A84C]/40 rounded-sm" />
            <div className="absolute top-16 left-10 w-5 h-5 rotate-45 bg-[#C9A84C]/20 rounded-sm" />
            <div className="absolute bottom-10 right-6 w-14 h-14 rotate-45 border-2 border-[#C9A84C]/30 rounded-sm" />
            <div className="absolute bottom-24 right-12 w-6 h-6 rotate-45 bg-[#C9A84C]/15 rounded-sm" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-[#C9A84C]/10" />
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full border border-[#C9A84C]/10" />

            {/* Logo */}
            <Link to="/" className="absolute top-8 right-8 flex items-center gap-2">
              <span className="text-white/70 text-xs font-semibold tracking-widest uppercase">Jannat Rugs</span>
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#C9A84C]/40">
                <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
              </div>
            </Link>

            {/* Text */}
            <div className="text-center relative z-10">
              <div className="w-12 h-px bg-[#C9A84C]/60 mx-auto mb-6" />
              <h2 className="font-luxury text-4xl text-white mb-4 leading-tight">
                Hello,<br />Friend!
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-[200px] mx-auto mb-10">
                Already have an account? Sign in and continue your luxury journey.
              </p>

              {/* Switch to Login */}
              <Link
                to="/login"
                className="inline-block border-2 border-white/30 text-white text-xs font-bold tracking-[0.25em] uppercase px-8 py-3 rounded-full hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* ── LEFT PANEL (form) ── */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 sm:px-14 py-10">

            <div className="w-full max-w-sm">
              <h1 className="font-luxury text-3xl sm:text-4xl text-[#1A1A1A] text-center mb-2">Create Account</h1>
              <p className="text-[#999] text-xs text-center mb-8 tracking-wide">Join the Jannat family today</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {fields.map(({ key, icon: Icon, type, placeholder, required, autoFocus, minLength }) => (
                  <div key={key} className="relative">
                    <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                    <input
                      type={key === 'password' && showPw ? 'text' : key === 'confirm' && showPw ? 'text' : type}
                      required={required}
                      autoFocus={autoFocus}
                      minLength={minLength}
                      value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full bg-[#F7F5F2] border border-gray-200 rounded-xl pl-11 pr-4 py-4 text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                      placeholder={placeholder}
                    />
                    {key === 'password' && (
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A84C] transition-colors">
                        {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    )}
                  </div>
                ))}

                {/* Sign Up Button */}
                <button
                  type="submit" disabled={isLoading}
                  className="w-full py-4 mt-2 bg-[#1A1A1A] text-white rounded-full font-bold text-xs tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-black transition-all duration-300 shadow-lg shadow-black/10 flex items-center justify-center disabled:opacity-60 cursor-pointer"
                >
                  {isLoading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : 'Create Account'}
                </button>
              </form>

              {/* Bottom link */}
              <div className="mt-6 text-center">
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
