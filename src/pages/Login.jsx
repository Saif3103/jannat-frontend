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
          className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
        >
          <h1 className="font-serif text-2xl text-[#111827] mb-1 text-center">Welcome back</h1>
          <p className="text-[#aaa] text-xs text-center mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-widest mb-1.5">Email</label>
              <div className="relative">
                <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                <input
                  type="email" required autoFocus
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[#FAF7F2] border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-[#555] uppercase tracking-widest mb-1.5">Password</label>
              <div className="relative">
                <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A84C]" />
                <input
                  type={showPw ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-[#FAF7F2] border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 outline-none transition-all"
                  placeholder="Enter password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-[#111827] text-white rounded-xl font-semibold text-sm tracking-widest uppercase shadow hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-xs text-[#888]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#C9A84C] font-semibold hover:text-[#B08D3E] transition-colors">
              Create one
            </Link>
          </p>

          {/* Admin */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={async () => {
                try { const u = await login('admin@jannatrugs.com', 'admin123456'); if (u.role === 'admin') navigate('/admin'); } catch (e) {}
              }}
              className="w-full py-3 bg-[#FAF7F2] border border-gray-200 rounded-xl text-[#666] text-[11px] font-semibold uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <FiShield size={14} className="text-[#C9A84C]" /> Admin Access
            </button>
          </div>
        </motion.div>

        <Link to="/" className="mt-8 text-xs text-[#bbb] hover:text-[#888] transition-colors font-medium">
          ← Back to Home
        </Link>
      </div>
    </>
  );
}
