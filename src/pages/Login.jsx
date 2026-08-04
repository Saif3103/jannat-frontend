import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import AuthLink from '../components/auth/AuthLink';
import AuthMessage from '../components/auth/AuthMessage';
import { useAuthStore } from '../store';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const { login, isLoading } = useAuthStore();

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to sign in. Please try again.');
    }
  };

  const setField = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Enter your credentials to continue shopping"
      panelTitle={<>Welcome<br />Back</>}
      panelTagline="Sign in to explore handcrafted carpets curated for timeless interiors."
      panelCta="Create Account"
      panelCtaTo="/register"
    >
      <AuthMessage type="error" message={formError} />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthInput
          label="Email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          icon={FiMail}
          value={form.email}
          onChange={setField('email')}
          placeholder="you@example.com"
          error={errors.email}
        />

        <AuthInput
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          icon={FiLock}
          value={form.password}
          onChange={setField('password')}
          placeholder="Enter your password"
          error={errors.password}
        />

        <div className="flex justify-end pt-1">
          <AuthLink to="/forgot-password">Forgot password?</AuthLink>
        </div>

        <div className="pt-2">
          <AuthButton loading={isLoading}>Sign In</AuthButton>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-sm text-[#A0A0A0]">
          New here?{' '}
          <AuthLink to="/register" className="text-[#C9A96E] hover:text-[#E7C78A]">
            Create an account
          </AuthLink>
        </p>

        <button
          type="button"
          onClick={async () => {
            try {
              const u = await login('admin@jannatrugs.com', 'admin123456');
              if (u.role === 'admin') navigate('/admin');
            } catch {
              setFormError('Admin access unavailable.');
            }
          }}
          className="text-[11px] text-[#A0A0A0]/80 hover:text-[#C9A96E] font-semibold uppercase tracking-[0.2em] flex items-center gap-2 transition-colors duration-300 focus-visible:outline-none focus-visible:text-[#C9A96E]"
        >
          <FiShield size={13} aria-hidden="true" />
          Admin Access
        </button>

        <AuthLink to="/" className="text-[#A0A0A0]/70">
          ← Return to Home
        </AuthLink>
      </div>
    </AuthLayout>
  );
}
