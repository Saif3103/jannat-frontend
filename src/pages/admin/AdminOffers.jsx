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
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Offers & Promotions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage marketing banners and seasonal coupons</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setShowModal(true); }} 
          className="bg-[#222] text-white hover:bg-black px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2">
          <FiPlus size={18} /> Add New Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="bg-white border border-gray-100 h-64 animate-pulse rounded-2xl" />) :
          offers.map(offer => (
            <div key={offer._id} className={`bg-white rounded-2xl overflow-hidden border transition-all ${offer.isActive ? 'border-gray-200 shadow-sm hover:shadow-md' : 'border-red-100 opacity-60'}`}>
              <div className="h-40 relative group">
                <img src={getImageUrl(offer.image)} alt={offer.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-4 right-4">
                  <button onClick={() => del(offer._id)} className="w-8 h-8 flex items-center justify-center bg-white/90 text-red-500 hover:bg-red-500 hover:text-white rounded-lg shadow-sm transition-all"><FiTrash2 size={14} /></button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-900 font-bold text-base truncate pr-2">{offer.title}</h3>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${offer.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>{offer.isActive ? 'Active' : 'Paused'}</span>
                </div>
                <p className="text-gray-500 text-xs mb-5 line-clamp-2 min-h-[32px]">{offer.description || 'No description provided.'}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Discount</span>
                    <span className="text-sm font-bold text-gray-900">{offer.discountPercent}% OFF</span>
                  </div>
                  <button onClick={() => toggleActive(offer)} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    {offer.isActive ? 'Pause Offer' : 'Resume Offer'}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create New Offer</h2>
                  <p className="text-sm text-gray-500 mt-1">Configure your promotional campaign</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all shadow-sm"><FiX size={20} /></button>
              </div>
              
              <form onSubmit={save} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { key: 'title', label: 'Offer Title', type: 'text', placeholder: 'e.g. Summer Sale', required: true },
                    { key: 'subtitle', label: 'Subtitle/Tagline', type: 'text', placeholder: 'e.g. Up to 50% Off' },
                    { key: 'discountPercent', label: 'Discount (%)', type: 'number', placeholder: '20' },
                    { key: 'couponCode', label: 'Coupon Code', type: 'text', placeholder: 'SUMMER20' },
                    { key: 'link', label: 'CTA Link', type: 'text', placeholder: '/shop' },
                    { key: 'validUntil', label: 'Expiry Date', type: 'date' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">{f.label}</label>
                      <input type={f.type} required={f.required} value={form[f.key]} placeholder={f.placeholder}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300" />
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">Campaign Banner</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all aspect-video group overflow-hidden relative shadow-inner">
                    {image ? (
                      <img src={URL.createObjectURL(image)} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-gray-900 shadow-sm transition-all mb-3"><FiUpload size={24} /></div>
                        <p className="text-xs font-bold text-gray-900">Upload Banner Image</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium italic">Recommended ratio 16:9</p>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files[0])} />
                  </label>
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">Promotion Details</label>
                  <textarea rows={3} value={form.description} placeholder="Describe the offer for your customers..."
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300 resize-none" />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all border border-gray-100">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-3.5 bg-[#222] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving ? 'Creating Campaign...' : 'Launch Offer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
