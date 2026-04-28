import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const EMPTY = { title: '', description: '', discountPercent: '', couponCode: '', minOrderAmount: '', validFrom: '', validUntil: '', isActive: true };

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/offers/all'); setOffers(data.offers); }
    catch {} finally { setLoading(false); }
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.post('/offers', form); toast.success('Offer created!'); setShowModal(false); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete offer?')) return;
    try { await api.delete(`/offers/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const toggleActive = async (offer) => {
    try { await api.put(`/offers/${offer._id}`, { isActive: !offer.isActive }); load(); }
    catch {}
  };

  return (
    <AdminLayout>
      <Helmet><title>Offers | Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-luxury text-2xl text-white">Offers & Coupons</h1>
        <button onClick={() => { setForm(EMPTY); setShowModal(true); }} className="btn-gold flex items-center gap-2 py-2 px-4 text-sm">
          <FiPlus size={16} /> Add Offer
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="glass-card h-44 shimmer rounded-2xl" />) :
          offers.map(offer => (
            <div key={offer._id} className={`glass-card rounded-2xl p-5 border ${offer.isActive ? 'border-amber-700/20' : 'border-red-900/20 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-amber-100 font-medium">{offer.title}</h3>
                  {offer.discountPercent > 0 && <span className="badge-gold text-xs mt-1 inline-block">{offer.discountPercent}% OFF</span>}
                </div>
                <button onClick={() => del(offer._id)} className="text-red-400/50 hover:text-red-400 p-1"><FiTrash2 size={14} /></button>
              </div>
              <p className="text-amber-100/50 text-xs mb-3">{offer.description}</p>
              {offer.couponCode && (
                <code className="text-xs bg-amber-900/30 text-amber-400 px-2 py-1 rounded border border-amber-800/30 block mb-3">{offer.couponCode}</code>
              )}
              <div className="flex items-center justify-between">
                {offer.validUntil && <span className="text-xs text-amber-100/30">Expires: {new Date(offer.validUntil).toLocaleDateString()}</span>}
                <button onClick={() => toggleActive(offer)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${offer.isActive ? 'bg-emerald-900/20 text-emerald-400' : 'bg-red-900/20 text-red-400'}`}>
                  {offer.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="glass-card w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-luxury text-xl text-amber-400">Create Offer</h2>
                <button onClick={() => setShowModal(false)} className="text-amber-100/40 hover:text-amber-100"><FiX size={18} /></button>
              </div>
              <form onSubmit={save} className="space-y-4">
                {[
                  { key: 'title', label: 'Offer Title', type: 'text', required: true },
                  { key: 'description', label: 'Description', type: 'text' },
                  { key: 'discountPercent', label: 'Discount %', type: 'number' },
                  { key: 'couponCode', label: 'Coupon Code', type: 'text' },
                  { key: 'minOrderAmount', label: 'Min Order Amount (₹)', type: 'number' },
                  { key: 'validFrom', label: 'Valid From', type: 'date' },
                  { key: 'validUntil', label: 'Valid Until', type: 'date' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">{f.label}</label>
                    <input type={f.type} required={f.required} value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="input-luxury" />
                  </div>
                ))}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-outline-gold flex-1 py-2.5">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-gold flex-1 py-2.5">{saving ? 'Creating...' : 'Create Offer'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
