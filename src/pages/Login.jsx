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
      
      {/* SILK TEXTURE BACKGROUND */}
      <div className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-[#FAF7F2]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=80" 
            alt="Silk Texture" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-[#E5C266]/10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[480px] relative z-10"
        >
          {/* LOGIN CARD */}
          <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] p-10 sm:p-14 shadow-[0_20px_80px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden">
            {/* Corner Patterns */}
            <div className="absolute top-0 left-0 w-32 h-32 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)', backgroundSize: '12px 12px' }} />

            {/* LOGO */}
            <div className="flex justify-center mb-10">
              <div className="w-24 h-24 bg-[#0A0A0A] rounded-[2rem] p-1 shadow-2xl border-2 border-[#C9A84C]/30 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* TITLES */}
            <div className="text-center mb-10">
              <h1 className="font-serif text-3xl sm:text-4xl text-[#0F172A] mb-3">Welcome Back</h1>
              <p className="text-[#64748B] text-sm font-medium tracking-wide">Continue your journey in luxury</p>
              
              {/* Decorative Divider */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/30" />
                <div className="w-1.5 h-1.5 rotate-45 border border-[#C9A84C] bg-white" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/30" />
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C9A84C]">
                  <FiMail size={18} />
                </div>
                <input 
                  type="email" 
                  required 
                  value={form.email} 
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white border border-[#E2E8F0] rounded-2xl pl-14 pr-5 py-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium" 
                  placeholder="email@example.com"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C9A84C]">
                  <FiLock size={18} />
                </div>
                <input 
                  type={showPw ? 'text' : 'password'} 
                  required 
                  value={form.password} 
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white border border-[#E2E8F0] rounded-2xl pl-14 pr-14 py-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium" 
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                >
                  {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] text-white rounded-2xl font-bold tracking-[0.1em] shadow-xl hover:shadow-[#000]/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-8"
              >
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
                {!isLoading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* CREATE ACCOUNT */}
            <div className="mt-8 text-center">
              <p className="text-[#64748B] text-sm font-medium">
                New to Jannat Rugs?{' '}
                <Link to="/register" className="text-[#C9A84C] hover:text-[#B08D3E] transition-colors font-bold">Create an account</Link>
              </p>
            </div>

            {/* INTERNAL ACCESS ONLY */}
            <div className="mt-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-[#E2E8F0]" />
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-[0.2em] whitespace-nowrap">Internal Access Only</p>
                <div className="h-px flex-1 bg-[#E2E8F0]" />
              </div>

              <button 
                onClick={async () => {
                  setForm({ email: 'admin@jannatrugs.com', password: 'admin123456' });
                  try {
                    const user = await login('admin@jannatrugs.com', 'admin123456');
                    if (user.role === 'admin') navigate('/admin');
                  } catch (e) {}
                }}
                className="w-full h-14 bg-white hover:bg-[#FAF7F2] border border-[#E2E8F0] rounded-2xl text-[#475569] text-sm font-bold transition-all flex items-center justify-between px-6 group"
              >
                <div className="flex items-center gap-3">
                  <FiShield className="text-[#C9A84C]" size={18} />
                  Login as Administrator
                </div>
                <FiArrowRight className="text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-[9px] text-[#94A3B8] text-center font-medium mt-6">
                Demo: admin@jannatrugs.com / admin123456
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
