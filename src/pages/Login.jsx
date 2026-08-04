import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  AuthButton,
  AuthFooter,
  AuthFooterLink,
  AuthFooterText,
  AuthInlineLink,
  AuthMessage,
} from '../components/auth';
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
    <AuthLayout title="Sign In">
      <AuthCard title="Sign In" subtitle="Welcome back to handmade luxury">
        <AuthMessage type="error" message={formError} />

        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          <div className="flex flex-col gap-5">
            <AuthInput
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              icon={Mail}
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
              icon={Lock}
              value={form.password}
              onChange={setField('password')}
              placeholder="Enter your password"
              error={errors.password}
            />
          </div>

          <div className="mt-3 flex justify-end">
            <AuthFooterLink to="/forgot-password">Forgot password?</AuthFooterLink>
          </div>

          <div className="mt-7">
            <AuthButton loading={isLoading}>Sign In</AuthButton>
          </div>
        </form>

        <AuthFooter>
          <AuthFooterText>
            New here?{' '}
            <AuthInlineLink to="/register">Create Account</AuthInlineLink>
          </AuthFooterText>
          <AuthFooterLink to="/">← Return Home</AuthFooterLink>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}
