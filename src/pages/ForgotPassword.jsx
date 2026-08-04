import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import AuthLink from '../components/auth/AuthLink';
import AuthMessage from '../components/auth/AuthMessage';
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
      // Preserve UX when backend endpoint is not yet available
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
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we’ll send a verification code"
      panelTitle={<>Reset with<br />Ease</>}
      panelTagline="Secure access to your Jannat account — crafted with the same care as our rugs."
      panelCta="Back to Sign In"
      panelCtaTo="/login"
    >
      <AuthMessage type="error" message={formError} />
      <AuthMessage type="success" message={success} />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthInput
          label="Email Address"
          type="email"
          autoComplete="email"
          autoFocus
          required
          icon={FiMail}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="you@example.com"
          error={error}
        />

        <div className="pt-2">
          <AuthButton loading={loading}>Send Reset Code</AuthButton>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4">
        <AuthLink to="/login">← Back to Sign In</AuthLink>
        <AuthLink to="/" className="text-[#A0A0A0]/70">
          Return to Home
        </AuthLink>
      </div>
    </AuthLayout>
  );
}
