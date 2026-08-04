import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AuthLayout,
  AuthCard,
  AuthButton,
  AuthFooter,
  AuthFooterLink,
  AuthFooterText,
  AuthMessage,
} from '../components/auth';
import api from '../api/axios';

const OTP_LENGTH = 6;

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';
  const email = emailFromQuery || sessionStorage.getItem('jannat_reset_email') || '';

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const code = otp.join('');

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setFormError('');
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!email) {
      setFormError('Email missing. Please restart password recovery.');
      return;
    }
    if (code.length !== OTP_LENGTH) {
      setFormError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/verify-otp', { email, otp: code });
      sessionStorage.setItem('jannat_reset_otp', code);
      setSuccess('Code verified successfully.');
      toast.success('OTP verified');
      setTimeout(
        () => navigate(`/reset-password?email=${encodeURIComponent(email)}`),
        800
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? 'OTP verification is temporarily unavailable. Please contact support.'
          : 'Invalid or expired code. Please try again.');
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setFormError('Email missing. Please restart password recovery.');
      return;
    }
    setResending(true);
    setFormError('');
    try {
      await api.post('/users/forgot-password', { email });
      toast.success('A new code has been sent');
      setSuccess('A new verification code has been sent.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 404
          ? 'Unable to resend code right now. Please contact support.'
          : 'Could not resend code. Please try again.');
      setFormError(message);
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Verify OTP">
      <AuthCard
        title="Verify OTP"
        subtitle={
          email
            ? `Enter the 6-digit code sent to ${email}`
            : 'Enter the 6-digit verification code'
        }
      >
        <AuthMessage type="error" message={formError} />
        <AuthMessage type="success" message={success} />

        <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
          <fieldset>
            <legend className="sr-only">One-time password</legend>
            <div className="flex justify-center gap-2.5 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  value={digit}
                  aria-label={`Digit ${index + 1}`}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 h-14 sm:w-12 sm:h-14 rounded-2xl text-center text-xl font-light text-white bg-[#121212] border border-white/[0.08] outline-none transition-all duration-300 focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20"
                />
              ))}
            </div>
          </fieldset>

          <div className="mt-8">
            <AuthButton loading={loading}>Verify Code</AuthButton>
          </div>
        </form>

        <AuthFooter>
          <AuthFooterText>
            Didn’t receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="text-[#C9A96E] transition-colors duration-300 hover:text-white cursor-pointer bg-transparent border-0 p-0 text-sm focus-visible:outline-none focus-visible:underline"
            >
              {resending ? 'Sending…' : 'Resend'}
            </button>
          </AuthFooterText>
          <AuthFooterLink to="/forgot-password">← Change email</AuthFooterLink>
          <AuthFooterLink to="/login">Back to Sign In</AuthFooterLink>
        </AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}
