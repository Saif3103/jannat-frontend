import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import AuthLink from '../components/auth/AuthLink';
import AuthMessage from '../components/auth/AuthMessage';
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
    <AuthLayout
      title="Create Account"
      subtitle="Join Jannat Rugs Co. and discover handcrafted luxury"
      panelTitle={<>Hello,<br />Friend</>}
      panelTagline="Already part of the family? Sign in to continue your collection."
      panelCta="Sign In"
      panelCtaTo="/login"
      reverse
    >
      <AuthMessage type="error" message={formError} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthInput
          label="Full Name"
          type="text"
          autoComplete="name"
          autoFocus
          required
          icon={FiUser}
          value={form.name}
          onChange={setField('name')}
          placeholder="Your full name"
          error={errors.name}
        />

        <AuthInput
          label="Phone"
          type="tel"
          autoComplete="tel"
          icon={FiPhone}
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
          icon={FiMail}
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
          icon={FiLock}
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
          icon={FiLock}
          value={form.confirm}
          onChange={setField('confirm')}
          placeholder="Re-enter password"
          error={errors.confirm}
        />

        <div className="pt-3">
          <AuthButton loading={isLoading}>Create Account</AuthButton>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-sm text-[#A0A0A0]">
          Already have an account?{' '}
          <AuthLink to="/login" className="text-[#C9A96E] hover:text-[#E7C78A]">
            Sign in
          </AuthLink>
        </p>
        <AuthLink to="/" className="text-[#A0A0A0]/70">
          ← Return to Home
        </AuthLink>
      </div>
    </AuthLayout>
  );
}
