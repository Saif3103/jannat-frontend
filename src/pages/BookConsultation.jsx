import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuthStore, useCartStore } from '../store';

const TYPES = ['Video Call', 'Phone Call', 'WhatsApp', 'Google Meet'];

export default function BookConsultation() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { clearCart } = useCartStore();
  const [ctx, setCtx] = useState(null);
  const [form, setForm] = useState({
    preferredDate: '',
    preferredTime: '',
    consultationType: 'WhatsApp',
    specialRequirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=book-consultation');
      return;
    }
    try {
      const raw = sessionStorage.getItem('jannat_checkout_context');
      setCtx(raw ? JSON.parse(raw) : null);
    } catch {
      setCtx(null);
    }
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/consultations', {
        ...form,
        product: ctx?.product,
        productSnapshot: ctx?.productSnapshot,
        customer: ctx?.customer,
      });
      clearCart();
      sessionStorage.removeItem('jannat_checkout_context');
      setDone(data.consultation);
      toast.success('Consultation booked');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <>
        <Helmet>
          <title>Consultation Booked | Jannat Rugs Co.</title>
        </Helmet>
        <div className="pt-24 pb-28 min-h-screen bg-[#FAF7F2]">
          <div className="max-w-lg mx-auto px-4 py-12 text-center">
            <h1 className="font-luxury text-4xl text-[#1A1A1A] mb-3">Booking Confirmed</h1>
            <p className="text-sm text-gray-500 mb-2">
              ID: <strong>{done.bookingId}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              {done.preferredDate} · {done.preferredTime} · {done.consultationType}
            </p>
            <p className="text-sm text-gray-600 mb-8">
              Our team will accept or reschedule your consultation shortly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/shop"
                className="h-11 px-5 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold inline-flex items-center justify-center"
              >
                Continue Shopping
              </Link>
              <Link
                to="/dashboard"
                className="h-11 px-5 rounded-xl border border-gray-200 text-sm font-medium inline-flex items-center justify-center"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Design Consultation | Jannat Rugs Co.</title>
      </Helmet>
      <div className="pt-24 pb-28 min-h-screen bg-[#FAF7F2]">
        <div className="max-w-lg mx-auto px-4 py-8">
          <h1 className="font-luxury text-3xl text-[#1A1A1A] mb-2">Design Consultation</h1>
          <p className="text-sm text-gray-500 mb-8">
            Book a free session with our rug expert before payment.
          </p>
          {ctx?.productSnapshot?.name && (
            <p className="text-sm text-[#B69640] mb-6 font-medium">
              Regarding: {ctx.productSnapshot.name}
            </p>
          )}
          <form
            onSubmit={submit}
            className="rounded-[24px] bg-white border border-black/[0.06] p-6 space-y-4"
          >
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                Preferred date *
              </label>
              <input
                type="date"
                required
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                Preferred time *
              </label>
              <input
                type="time"
                required
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-2 block">
                Consultation type
              </label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, consultationType: t })}
                    className={`h-9 px-3 rounded-full text-xs font-semibold border cursor-pointer ${
                      form.consultationType === t
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                Special requirements
              </label>
              <textarea
                rows={3}
                value={form.specialRequirements}
                onChange={(e) => setForm({ ...form, specialRequirements: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Submitting…' : 'Submit booking'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
