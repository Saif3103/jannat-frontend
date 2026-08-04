import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AuthLayout,
  AuthCard,
  AuthInput,
  AuthButton,
  AuthFooter,
  AuthFooterLink,
  AuthMessage,
} from '../components/auth';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/forgot-password', { email: email.trim() });
      sessionStorage.setItem('jannat_reset_email', email.trim());
      setSuccess('A verification code has been sent to your email.');
      toast.success('Check your inbox for the code');
      setTimeout(() => navigate(`/verify-otp?email=${encodeURIComponent(email.trim())}`), 900);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? 'Password reset is temporarily unavailable. Please contact support.'
          : 'Unable to send reset code. Please try again.');
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password">
      <AuthCard
        title="Forgot Password"
        subtitle="Enter your email and we’ll send a verification code"
      >
        <AuthMessage type="error" message={formError} />
        <AuthMessage type="success" message={success} />

        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          <AuthInput
            label="Email Address"
            type="email"
            autoComplete="email"
            autoFocus
            required
            icon={Mail}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="you@example.com"
            error={error}
          />

          <div className="mt-8">
            <AuthButton loading={loading}>Send Reset Code</AuthButton>
          </div>
        </form>

        <AuthFooter>
          <AuthFooterLink to="/login">← Back to Sign In</AuthFooterLink>
          <AuthFooterLink to="/">Return Home</AuthFooterLink>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}
