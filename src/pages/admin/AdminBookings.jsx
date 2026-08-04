import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminBookings() {
  const [tab, setTab] = useState('consultations');
  const [consultations, setConsultations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [todays, setTodays] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([
        api.get('/consultations/admin/all'),
        api.get('/showroom-bookings/admin/all'),
      ]);
      setConsultations(c.data.consultations || []);
      setBookings(s.data.bookings || []);
      setTodays(s.data.todaysVisits || []);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateConsultation = async (id, status) => {
    try {
      await api.patch(`/consultations/${id}`, { status });
      toast.success(`Marked ${status}`);
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  const updateShowroom = async (id, status) => {
    try {
      await api.patch(`/showroom-bookings/${id}`, { status });
      toast.success(`Marked ${status}`);
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  const consCounts = useMemo(() => {
    const c = { Pending: 0, Accepted: 0, Completed: 0, Cancelled: 0 };
    consultations.forEach((x) => {
      if (c[x.status] !== undefined) c[x.status] += 1;
    });
    return c;
  }, [consultations]);

  return (
    <AdminLayout>
      <Helmet>
        <title>Bookings | Admin</title>
      </Helmet>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'consultations', label: 'Consultations' },
            { id: 'showroom', label: 'Showroom' },
            { id: 'today', label: `Today's Visits (${todays.length})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`h-9 px-4 rounded-full text-xs font-semibold cursor-pointer ${
                tab === t.id ? 'bg-[#1A1A1A] text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'consultations' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
            {Object.entries(consCounts).map(([k, v]) => (
              <div key={k} className="bg-white rounded-xl border border-gray-100 p-3">
                <p className="text-[11px] text-gray-400">{k}</p>
                <p className="text-lg font-bold">{v}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-400 py-10 text-center">Loading…</p>
        ) : tab === 'consultations' ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {consultations.length === 0 ? (
              <p className="text-sm text-gray-400 p-8 text-center">No consultations</p>
            ) : (
              consultations.map((c) => (
                <div key={c._id} className="p-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">{c.bookingId} · {c.customer?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {c.preferredDate} {c.preferredTime} · {c.consultationType} · {c.status}
                    </p>
                    {c.productSnapshot?.name && (
                      <p className="text-xs text-[#B69640] mt-1">{c.productSnapshot.name}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Accepted', 'Rejected', 'Rescheduled', 'Completed', 'Cancelled'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateConsultation(c._id, s)}
                        className="h-8 px-2.5 rounded-lg text-[11px] font-medium border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {(tab === 'today' ? todays : bookings).length === 0 ? (
              <p className="text-sm text-gray-400 p-8 text-center">No visits</p>
            ) : (
              (tab === 'today' ? todays : bookings).map((b) => (
                <div key={b._id} className="p-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">{b.bookingId} · {b.customer?.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {b.branch} · {b.date} {b.time} · {b.status}
                    </p>
                    <p className="text-[11px] font-mono text-gray-400 mt-1">{b.qrCode}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Confirmed', 'Completed', 'Cancelled', 'No Show'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => updateShowroom(b._id, s)}
                        className="h-8 px-2.5 rounded-lg text-[11px] font-medium border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
