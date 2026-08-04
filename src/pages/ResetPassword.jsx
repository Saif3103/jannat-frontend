import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || sessionStorage.getItem('jannat_reset_email') || '';
  const otp = sessionStorage.getItem('jannat_reset_otp') || '';

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
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
    setSuccess('');
    if (!validate()) return;

    if (!email) {
      setFormError('Email missing. Please restart password recovery.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/reset-password', {
        email,
        otp,
        password: form.password,
      });
      sessionStorage.removeItem('jannat_reset_email');
      sessionStorage.removeItem('jannat_reset_otp');
      setSuccess('Password updated successfully. You can now sign in.');
      toast.success('Password reset successfully');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? 'Password reset is temporarily unavailable. Please contact support.'
          : 'Unable to reset password. Please try again.');
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const setField = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  return (
    <AuthLayout title="Reset Password">
      <AuthCard
        title="Reset Password"
        subtitle="Choose a new password for your account"
      >
        <AuthMessage type="error" message={formError} />
        <AuthMessage type="success" message={success} />

        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          <div className="flex flex-col gap-5">
            <AuthInput
              label="New Password"
              type="password"
              autoComplete="new-password"
              autoFocus
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
              placeholder="Re-enter new password"
              error={errors.confirm}
            />
          </div>

          <div className="mt-8">
            <AuthButton loading={loading}>Update Password</AuthButton>
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
