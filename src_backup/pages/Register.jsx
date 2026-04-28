import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '../store';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
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
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="font-luxury text-gold-gradient text-4xl font-bold tracking-wider">JANNAT</div>
              <div className="text-xs tracking-[0.4em] text-amber-200/40 font-light">RUGS CO.</div>
            </Link>
          </div>
          <div className="glass-card p-8">
            <h1 className="font-luxury text-3xl text-white text-center mb-2">Create Account</h1>
            <p className="text-amber-100/40 text-sm text-center mb-8">Join the Jannat Rugs family</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text', icon: FiUser, placeholder: 'Your full name', id: 'reg-name' },
                { key: 'email', label: 'Email Address', type: 'email', icon: FiMail, placeholder: 'your@email.com', id: 'reg-email' },
                { key: 'phone', label: 'Phone Number', type: 'tel', icon: FiPhone, placeholder: '+91 9XXXXXXXXX', id: 'reg-phone', required: false },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">{f.label}</label>
                  <div className="relative">
                    <f.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                    <input type={f.type} required={f.required !== false} value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="input-luxury pl-10" placeholder={f.placeholder} id={f.id} />
                  </div>
                </div>
              ))}
              <div>
                <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                  <input type={showPw ? 'text' : 'password'} required minLength={6} value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="input-luxury pl-10 pr-10" placeholder="Min 6 characters" id="reg-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-100/30 hover:text-amber-400">
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-100/30" />
                  <input type="password" required value={form.confirm}
                    onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                    className="input-luxury pl-10" placeholder="Repeat password" id="reg-confirm" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} id="reg-submit" className="btn-gold w-full py-3 mt-2">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-amber-100/40 text-sm text-center mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
