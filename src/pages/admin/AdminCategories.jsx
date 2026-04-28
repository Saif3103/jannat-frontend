import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/categories'); setCats(data.categories); }
    catch {} finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '' }); setImage(null); setShowModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description }); setImage(null); setShowModal(true); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name); fd.append('description', form.description);
      if (image) fd.append('categoryImage', image);
      if (editing) { await api.put(`/categories/${editing._id}`, fd); toast.success('Updated!'); }
      else { await api.post('/categories', fd); toast.success('Category added!'); }
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete category?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <AdminLayout>
      <Helmet><title>Categories | Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-luxury text-2xl text-white">Categories</h1>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2 py-2 px-4 text-sm"><FiPlus size={16} /> Add Category</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(6)].map((_, i) => <div key={i} className="glass-card h-40 shimmer rounded-2xl" />) :
          cats.map(cat => (
            <div key={cat._id} className="glass-card rounded-2xl overflow-hidden">
              <div className="h-32 relative">
                <img src={cat.image || 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400'} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-luxury text-lg">{cat.name}</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-amber-100/40 text-xs line-clamp-1">{cat.description || 'No description'}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(cat)} className="p-1.5 text-amber-400/60 hover:text-amber-400 rounded transition-colors"><FiEdit2 size={14} /></button>
                  <button onClick={() => del(cat._id)} className="p-1.5 text-red-400/60 hover:text-red-400 rounded transition-colors"><FiTrash2 size={14} /></button>
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
              className="glass-card w-full max-w-md rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-luxury text-xl text-amber-400">{editing ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => setShowModal(false)} className="text-amber-100/40 hover:text-amber-100"><FiX size={18} /></button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Name *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-luxury" />
                </div>
                <div>
                  <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-luxury resize-none" />
                </div>
                <div>
                  <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Category Image</label>
                  <label className="flex items-center gap-3 border border-dashed border-amber-900/40 rounded-xl p-4 cursor-pointer hover:border-amber-700/60 transition-colors">
                    <FiUpload size={18} className="text-amber-400/50" />
                    <span className="text-amber-100/40 text-sm">{image ? image.name : 'Click to upload'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files[0])} />
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-outline-gold flex-1 py-2.5">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-gold flex-1 py-2.5">
                    {saving ? 'Saving...' : editing ? 'Update' : 'Add Category'}
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
