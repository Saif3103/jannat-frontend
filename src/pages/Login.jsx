import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

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
    } catch (err) {
      // toast already shown by store
    }
  };

  return (
    <>
      <Helmet><title>Sign In | Jannat Rugs Co.</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-50 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C9A84C]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block group">
              <div className="w-24 h-24 mx-auto bg-black rounded-3xl shadow-xl flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                <img src="/logo.png" alt="Jannat Rugs Co." className="w-full h-full object-cover" />
              </div>
            </Link>
          </div>
          
          <div className="bg-black p-10 rounded-[2.5rem] shadow-2xl border border-white/5">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
              <p className="text-gray-400 text-sm font-medium">Continue your journey in luxury</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C9A84C] transition-colors">
                    <FiMail size={20} />
                  </div>
                  <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 py-4 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] outline-none transition-all font-medium" 
                    placeholder="Email Address" id="login-email" />
                </div>
                
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C9A84C] transition-colors">
                    <FiLock size={20} />
                  </div>
                  <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-12 py-4 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] outline-none transition-all font-medium" 
                    placeholder="Password" id="login-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors">
                    {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} id="login-submit"
                className="w-full bg-[#222] text-white py-4 rounded-2xl font-bold tracking-[0.1em] shadow-xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 mt-4">
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm font-medium">
                New to Jannat Rugs?{' '}
                <Link to="/register" className="text-[#C9A84C] hover:text-[#B08D3E] transition-colors font-bold underline-offset-4 hover:underline">Create an account</Link>
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-50">
              <p className="text-[10px] text-gray-300 text-center font-bold uppercase tracking-[0.2em] mb-4">Internal Access Only</p>
              <button 
                onClick={async () => {
                  setForm({ email: 'admin@jannatrugs.com', password: 'admin123456' });
                  try {
                    const user = await login('admin@jannatrugs.com', 'admin123456');
                    if (user.role === 'admin') navigate('/admin');
                  } catch (e) {}
                }}
                className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-xs font-bold transition-all mb-2 flex items-center justify-center gap-2 group"
              >
                Login as Administrator
              </button>
              <p className="text-[9px] text-gray-300 text-center font-medium italic">Demo: admin@jannatrugs.com / admin123456</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
