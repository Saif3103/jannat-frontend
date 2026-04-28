import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '../store';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : `/${redirect}`);
    } catch {}
  };

  return (
    <>
      <Helmet><title>Login | Jannat Rugs Co.</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(155,123,46,0.06) 0%, transparent 60%), #0D0D0D'
      }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="font-luxury text-gold-gradient text-4xl font-bold tracking-wider">JANNAT</div>
              <div className="text-xs tracking-[0.4em] text-amber-200/40 font-light">RUGS CO.</div>
            </Link>
          </div>
          <div className="glass-card p-8">
            <h1 className="font-luxury text-3xl text-white text-center mb-2">Welcome Back</h1>
            <p className="text-amber-100/40 text-sm text-center mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                  <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="input-luxury pl-10" placeholder="your@email.com" id="login-email" />
                </div>
              </div>
              <div>
                <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                  <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="input-luxury pl-10 pr-10" placeholder="••••••••" id="login-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-100/30 hover:text-amber-400">
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={isLoading} id="login-submit"
                className="btn-gold w-full py-3 mt-2">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-amber-100/40 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors">Create Account</Link>
              </p>
            </div>

            {/* Demo credentials hint */}
            <div className="mt-4 p-3 border border-amber-900/20 rounded-lg">
              <p className="text-xs text-amber-100/30 text-center">Admin: admin@jannatrugs.com / admin123456</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
