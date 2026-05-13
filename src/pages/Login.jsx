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
      
      {/* LUXURY RUG BACKGROUND */}
      <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden bg-[#FAF7F2]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80" 
            alt="Hand-knotted Rug Texture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/60 via-transparent to-[#1A1A1A]/80" />
        </div>

        {/* BACK TO HOME */}
        <Link 
          to="/" 
          className="absolute top-10 left-10 z-30 flex items-center gap-3 text-white/60 hover:text-white transition-all font-bold text-[11px] uppercase tracking-[0.3em]"
        >
          <FiArrowRight className="rotate-180" /> Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[540px] relative z-10 flex flex-col items-center"
        >
          {/* LOGO (Positioned Above Card) */}
          <Link to="/" className="mb-12 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 bg-[#1A1A1A] rounded-[2.5rem] p-1 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-2 border-[#C9A84C]/50 flex items-center justify-center overflow-hidden"
            >
               <img src="/logo.png" alt="Jannat Rugs" className="w-full h-full object-cover" />
            </motion.div>
          </Link>

          {/* LOGIN GLASS CARD */}
          <div className="bg-white/95 backdrop-blur-3xl rounded-[4rem] p-12 sm:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-white/20 w-full relative overflow-hidden">
            
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* TITLES */}
            <div className="text-center mb-12">
              <h1 className="font-serif text-5xl text-[#111827] mb-4">Welcome Back</h1>
              <p className="text-[#C9A84C] text-[10px] font-black uppercase tracking-[0.4em]">The Art of Living Begins Here</p>
              
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#C9A84C]/40" />
                <div className="w-2 h-2 rotate-45 border border-[#C9A84C] bg-white" />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#C9A84C]/40" />
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#C9A84C] transition-transform group-focus-within:scale-110">
                  <FiMail size={20} />
                </div>
                <input 
                  type="email" 
                  required 
                  autoFocus
                  value={form.email} 
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white border border-gray-100 rounded-[2rem] pl-16 pr-6 py-5 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-8 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium shadow-sm" 
                  placeholder="Email address"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#C9A84C] transition-transform group-focus-within:scale-110">
                  <FiLock size={20} />
                </div>
                <input 
                  type={showPw ? 'text' : 'password'} 
                  required 
                  value={form.password} 
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white border border-gray-100 rounded-[2rem] pl-16 pr-16 py-5 text-[#1A1A1A] placeholder:text-gray-300 focus:border-[#C9A84C] focus:ring-8 focus:ring-[#C9A84C]/5 outline-none transition-all font-medium shadow-sm" 
                  placeholder="Password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1A1A1A] transition-colors"
                >
                  {showPw ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-18 bg-gradient-to-r from-[#111827] to-[#1F2937] text-white rounded-[2rem] font-bold tracking-[0.2em] text-[11px] shadow-2xl hover:translate-y-[-2px] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 mt-10"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    SIGN IN <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#C9A84C] hover:text-[#B08D3E] transition-colors ml-1">Join the family</Link>
              </p>
            </div>

            {/* ADMIN ACCESS SECTION */}
            <div className="mt-16 pt-12 border-t border-gray-50">
              <button 
                onClick={async () => {
                  setForm({ email: 'admin@jannatrugs.com', password: 'admin123456' });
                  try {
                    const user = await login('admin@jannatrugs.com', 'admin123456');
                    if (user.role === 'admin') navigate('/admin');
                  } catch (e) {}
                }}
                className="w-full h-16 bg-[#FAF7F2] border border-gray-100 rounded-[2rem] text-[#1A1A1A]/60 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[#F3EFE9] flex items-center justify-center gap-4 group"
              >
                <FiShield className="text-[#C9A84C]" size={20} />
                Administrator Access
              </button>
              
              <p className="text-[9px] text-gray-300 text-center font-bold uppercase tracking-[0.3em] mt-8">
                Official Jannat Rugs Co. Internal System
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
