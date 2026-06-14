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
    { key: 'name', label: 'Full Name', icon: FiUser, type: 'text', placeholder: 'Your full name', required: true, autoFocus: true },
    { key: 'phone', label: 'Phone', icon: FiPhone, type: 'tel', placeholder: '+92 300 000 0000', required: false },
    { key: 'email', label: 'Email', icon: FiMail, type: 'email', placeholder: 'you@example.com', required: true },
    { key: 'password', label: 'Password', icon: FiLock, type: 'password', placeholder: 'Min. 6 characters', required: true, minLength: 6 },
    { key: 'confirm', label: 'Confirm Password', icon: FiLock, type: 'password', placeholder: 'Repeat password', required: true },
  ];

  return (
    <>
      <Helmet><title>Create Account | Jannat Rugs Co.</title></Helmet>

      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-4 py-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-center gap-3"
        >
          <Link to="/">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#C9A84C]/30 shadow-md">
              <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
            </div>
          </Link>
          <p className="text-[#888] text-xs font-semibold uppercase tracking-[0.3em]">Jannat Rugs Co.</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-gray-100 p-10"
        >
          <h1 className="font-serif text-2xl text-[#111827] mb-1 text-center">Create Account</h1>
          <p className="text-[#aaa] text-xs text-center mb-8">Join the Jannat family today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, icon: Icon, type, placeholder, required, autoFocus, minLength }) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-widest mb-1.5">
                  {label} {!required && <span className="normal-case font-normal text-gray-300">(optional)</span>}
                </label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                  <input
                    type={key === 'password' && showPw ? 'text' : type}
                    required={required}
                    autoFocus={autoFocus}
                    minLength={minLength}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-[#FAF7F2] border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                    placeholder={placeholder}
                  />
                  {(key === 'password') && (
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                      {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="submit" disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-[#111827] text-white rounded-xl font-semibold text-sm tracking-widest uppercase shadow hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-xs text-[#888]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C9A84C] font-semibold hover:text-[#B08D3E] transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>

        <Link to="/" className="mt-8 text-xs text-[#bbb] hover:text-[#888] transition-colors font-medium">
          ← Back to Home
        </Link>
      </div>
    </>
  );
}
