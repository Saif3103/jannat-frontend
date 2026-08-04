import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuthStore, useCartStore } from '../store';

export default function BookShowroom() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { clearCart } = useCartStore();
  const [ctx, setCtx] = useState(null);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ branch: '', date: '', time: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=book-showroom');
      return;
    }
    try {
      const raw = sessionStorage.getItem('jannat_checkout_context');
      setCtx(raw ? JSON.parse(raw) : null);
    } catch {
      setCtx(null);
    }
    api.get('/showroom-bookings/branches').then((r) => {
      setBranches(r.data.branches || []);
      if (r.data.branches?.[0]) setForm((f) => ({ ...f, branch: r.data.branches[0] }));
    });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/showroom-bookings', {
        ...form,
        product: ctx?.product,
        productSnapshot: ctx?.productSnapshot,
        customer: ctx?.customer,
      });
      clearCart();
      sessionStorage.removeItem('jannat_checkout_context');
      setDone(data.booking);
      toast.success('Showroom visit reserved');
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
          <title>Showroom Reserved | Jannat Rugs Co.</title>
        </Helmet>
        <div className="pt-24 pb-28 min-h-screen bg-[#FAF7F2]">
          <div className="max-w-lg mx-auto px-4 py-12 text-center">
            <h1 className="font-luxury text-4xl text-[#1A1A1A] mb-3">Visit Reserved</h1>
            <p className="text-sm text-gray-500 mb-1">
              Booking ID: <strong>{done.bookingId}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {done.branch}
              <br />
              {done.date} · {done.time}
            </p>
            <div className="mx-auto w-40 h-40 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-6">
              <div className="text-center px-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">QR / Code</p>
                <p className="text-xs font-mono font-bold text-[#1A1A1A] break-all">{done.qrCode}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-8">
              Show this code at the showroom. Complete purchase in person.
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
        <title>Showroom Visit | Jannat Rugs Co.</title>
      </Helmet>
      <div className="pt-24 pb-28 min-h-screen bg-[#FAF7F2]">
        <div className="max-w-lg mx-auto px-4 py-8">
          <h1 className="font-luxury text-3xl text-[#1A1A1A] mb-2">Visit Our Showroom</h1>
          <p className="text-sm text-gray-500 mb-8">
            Reserve your rug and complete purchase at the showroom.
          </p>
          {ctx?.productSnapshot?.name && (
            <p className="text-sm text-[#B69640] mb-6 font-medium">
              Reserved product: {ctx.productSnapshot.name}
            </p>
          )}
          <form
            onSubmit={submit}
            className="rounded-[24px] bg-white border border-black/[0.06] p-6 space-y-4"
          >
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                Branch *
              </label>
              <select
                required
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C] bg-white"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                Date *
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                Time *
              </label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 block">
                Notes
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#C9A84C] text-[#1A1A1A] font-semibold text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Reserving…' : 'Reserve visit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
