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
      <Helmet><title>Join the Family | Jannat Rugs Co.</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-50 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C9A84C]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <Link to="/" className="inline-block group">
              <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-xl flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                <img src="/logo.png" alt="Jannat Rugs Co." className="w-full h-full object-cover" />
              </div>
            </Link>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create Account</h1>
              <p className="text-gray-400 text-sm font-medium">Experience artisanal luxury every day</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', type: 'text', icon: FiUser, placeholder: 'Full Name', id: 'reg-name', required: true },
                { key: 'email', type: 'email', icon: FiMail, placeholder: 'Email Address', id: 'reg-email', required: true },
                { key: 'phone', type: 'tel', icon: FiPhone, placeholder: 'Phone (Optional)', id: 'reg-phone', required: false },
              ].map(f => (
                <div key={f.key} className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C9A84C] transition-colors">
                    <f.icon size={20} />
                  </div>
                  <input type={f.type} required={f.required} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 py-4 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] outline-none transition-all font-medium" 
                    placeholder={f.placeholder} id={f.id} />
                </div>
              ))}
              
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C9A84C] transition-colors">
                  <FiLock size={20} />
                </div>
                <input type={showPw ? 'text' : 'password'} required minLength={6} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-12 py-4 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] outline-none transition-all font-medium" 
                  placeholder="Password" id="reg-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors">
                  {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#C9A84C] transition-colors">
                  <FiLock size={20} />
                </div>
                <input type="password" required value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 py-4 text-gray-900 placeholder:text-gray-300 focus:ring-4 focus:ring-[#C9A84C]/10 focus:border-[#C9A84C] outline-none transition-all font-medium" 
                  placeholder="Confirm Password" id="reg-confirm" />
              </div>

              <button type="submit" disabled={isLoading} id="reg-submit" 
                className="w-full bg-[#222] text-white py-4 rounded-2xl font-bold tracking-[0.1em] shadow-xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 mt-6">
                {isLoading ? 'CREATING ACCOUNT...' : 'JOIN THE FAMILY'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-[#C9A84C] hover:text-[#B08D3E] transition-colors font-bold underline-offset-4 hover:underline">Sign in instead</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
