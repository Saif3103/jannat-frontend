import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import api, { BASE_URL } from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiUpload } from 'react-icons/fi';

const EMPTY = { title: '', description: '', subtitle: '', link: '', discountPercent: '', couponCode: '', minOrderAmount: '', validFrom: '', validUntil: '', isActive: true };

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${BASE_URL}/${url}`;
  };

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/offers/all'); setOffers(data.offers); }
    catch {} finally { setLoading(false); }
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => fd.append(key, form[key]));
      if (image) fd.append('image', image);
      
      await api.post('/offers', fd); 
      toast.success('Offer created!'); 
      setShowModal(false); 
      load(); 
      setForm(EMPTY);
      setImage(null);
    }
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
            <div key={offer._id} className={`glass-card rounded-2xl overflow-hidden border ${offer.isActive ? 'border-amber-700/20' : 'border-red-900/20 opacity-60'}`}>
              <div className="h-32 relative">
                <img src={getImageUrl(offer.image)} alt={offer.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-3 right-3">
                  <button onClick={() => del(offer._id)} className="p-1.5 bg-black/50 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all"><FiTrash2 size={12} /></button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-white font-medium text-sm">{offer.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-amber-100/40 text-[10px] mb-3 line-clamp-1">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${offer.isActive ? 'bg-emerald-900/20 text-emerald-400' : 'bg-red-900/20 text-red-400'}`}>{offer.isActive ? 'Active' : 'Inactive'}</span>
                  <button onClick={() => toggleActive(offer)} className="text-[10px] text-amber-400 hover:underline">Toggle</button>
                </div>
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
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'title', label: 'Title', type: 'text', required: true },
                    { key: 'subtitle', label: 'Subtitle (e.g. Flash Sale)', type: 'text' },
                    { key: 'discountPercent', label: 'Discount %', type: 'number' },
                    { key: 'couponCode', label: 'Coupon Code', type: 'text' },
                    { key: 'link', label: 'Action Link (e.g. /shop)', type: 'text' },
                    { key: 'validUntil', label: 'Expires', type: 'date' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-[10px] text-amber-100/50 block mb-1 uppercase tracking-widest">{f.label}</label>
                      <input type={f.type} required={f.required} value={form[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="input-luxury py-2 text-sm" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-[10px] text-amber-100/50 block mb-1 uppercase tracking-widest">Banner Image</label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-amber-900/30 rounded-xl p-4 cursor-pointer hover:border-amber-500/50 transition-all aspect-video bg-black/20 group overflow-hidden">
                    {image ? (
                      <img src={URL.createObjectURL(image)} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                    ) : (
                      <>
                        <FiUpload size={20} className="text-amber-500/30 group-hover:text-amber-400 transition-colors" />
                        <span className="text-[10px] text-amber-100/20 mt-2 font-bold uppercase tracking-widest">Upload Banner</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files[0])} />
                  </label>
                </div>
                <div>
                  <label className="text-[10px] text-amber-100/50 block mb-1 uppercase tracking-widest">Description</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-luxury resize-none text-sm" />
                </div>
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
