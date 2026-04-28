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
      <Helmet><title>Login | Jannat Rugs Co.</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(155,123,46,0.06) 0%, transparent 60%), #0D0D0D'
      }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="Jannat Rugs Co." className="h-28 w-28 mx-auto aspect-square rounded-full object-cover border border-amber-500/30 shadow-[0_0_20px_rgba(201,168,76,0.15)]" />
            </Link>
          </div>
          <div className="glass-card p-10">
            <h1 className="font-luxury text-3xl text-white text-center mb-2">Welcome Back</h1>
            <p className="text-amber-100/40 text-sm text-center mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <FiMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                  <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="input-luxury pl-12 py-4" placeholder="Enter your email address" id="login-email" />
                </div>
              </div>
              <div>
                <div className="relative">
                  <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                  <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="input-luxury pl-12 pr-12 py-4" placeholder="Enter your password" id="login-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-100/30 hover:text-amber-400">
                    {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isLoading} id="login-submit"
                className="btn-gold w-full py-4 mt-2 text-sm">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-amber-100/40 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">Create Account</Link>
              </p>
            </div>

            <div className="mt-5 p-4 border border-amber-900/20 rounded-xl">
              <p className="text-xs text-amber-100/30 text-center font-medium mb-2">Admin Demo Access</p>
              <button 
                onClick={async () => {
                  setForm({ email: 'admin@jannatrugs.com', password: 'admin123456' });
                  try {
                    const user = await login('admin@jannatrugs.com', 'admin123456');
                    if (user.role === 'admin') navigate('/admin');
                  } catch (e) {}
                }}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-xs transition-colors mb-2"
              >
                Auto Login as Admin
              </button>
              <p className="text-[10px] text-amber-100/20 text-center">admin@jannatrugs.com / admin123456</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
