import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate('/');
    } catch {}
  };

  return (
    <>
      <Helmet><title>Create Account | Jannat Rugs Co.</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), #0D0D0D'
      }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="Jannat Rugs Co." className="h-28 w-28 mx-auto aspect-square rounded-full object-cover border border-amber-500/30 shadow-[0_0_20px_rgba(201,168,76,0.15)]" />
            </Link>
          </div>
          <div className="glass-card p-10">
            <h1 className="font-luxury text-3xl text-white text-center mb-2">Create Account</h1>
            <p className="text-amber-100/40 text-sm text-center mb-8">Join the Jannat Rugs family</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { key: 'name', type: 'text', icon: FiUser, placeholder: 'Enter your full name', id: 'reg-name', required: true },
                { key: 'email', type: 'email', icon: FiMail, placeholder: 'Enter your email address', id: 'reg-email', required: true },
                { key: 'phone', type: 'tel', icon: FiPhone, placeholder: 'Enter your phone number', id: 'reg-phone', required: false },
              ].map(f => (
                <div key={f.key}>
                  <div className="relative">
                    <f.icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                    <input type={f.type} required={f.required} value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="input-luxury pl-12 py-4" placeholder={f.placeholder} id={f.id} />
                  </div>
                </div>
              ))}
              <div>
                <div className="relative">
                  <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                  <input type={showPw ? 'text' : 'password'} required minLength={6} value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="input-luxury pl-12 pr-12 py-4" placeholder="Create password (min 6 chars)" id="reg-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-100/30 hover:text-amber-400">
                    {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <div className="relative">
                  <FiLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                  <input type="password" required value={form.confirm}
                    onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                    className="input-luxury pl-12 py-4" placeholder="Confirm your password" id="reg-confirm" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} id="reg-submit" className="btn-gold w-full py-4 mt-2 text-sm">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-amber-100/40 text-sm text-center mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
