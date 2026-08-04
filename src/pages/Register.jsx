import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock } from 'lucide-react';
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

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (form.phone && !/^[+\d][\d\s-]{6,}$/.test(form.phone)) next.phone = 'Enter a valid phone number';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (!form.confirm) next.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      navigate('/');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to create account. Please try again.');
    }
  };

  const setField = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  return (
    <AuthLayout title="Create Account">
      <AuthCard title="Create Account" subtitle="Join Jannat Rugs Co. for handcrafted luxury">
        <AuthMessage type="error" message={formError} />

        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          <div className="flex flex-col gap-4">
            <AuthInput
              label="Full Name"
              type="text"
              autoComplete="name"
              autoFocus
              required
              icon={User}
              value={form.name}
              onChange={setField('name')}
              placeholder="Your full name"
              error={errors.name}
            />

            <AuthInput
              label="Phone"
              type="tel"
              autoComplete="tel"
              icon={Phone}
              value={form.phone}
              onChange={setField('phone')}
              placeholder="Optional"
              error={errors.phone}
            />

            <AuthInput
              label="Email"
              type="email"
              autoComplete="email"
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
              autoComplete="new-password"
              required
              minLength={6}
              icon={Lock}
              value={form.password}
              onChange={setField('password')}
              placeholder="Min. 6 characters"
              error={errors.password}
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              required
              icon={Lock}
              value={form.confirm}
              onChange={setField('confirm')}
              placeholder="Re-enter password"
              error={errors.confirm}
            />
          </div>

          <div className="mt-7">
            <AuthButton loading={isLoading}>Create Account</AuthButton>
          </div>
        </form>

        <AuthFooter>
          <AuthFooterText>
            Already have an account?{' '}
            <AuthInlineLink to="/login">Sign In</AuthInlineLink>
          </AuthFooterText>
          <AuthFooterLink to="/">← Return Home</AuthFooterLink>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}
