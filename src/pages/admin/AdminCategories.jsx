import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiFolder } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import api, { BASE_URL } from '../../api/axios';
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

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${BASE_URL}/${url}`;
  };

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-2xl text-[#222]">Categories</h1>
        <button onClick={openAdd} className="bg-[#222] text-white flex items-center gap-2 py-2.5 px-5 rounded-full font-bold text-sm hover:bg-black transition-all shadow-sm">
          <FiPlus size={18} /> Add Category
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="bg-white h-48 shimmer rounded-3xl border border-gray-100" />) :
          cats.map(cat => (
            <div key={cat._id} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="h-40 relative overflow-hidden">
                <img src={getImageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-lg tracking-tight">{cat.name}</p>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <p className="text-gray-400 text-xs font-medium line-clamp-1 flex-1 pr-4">{cat.description || 'No description'}</p>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="p-2 text-gray-400 hover:text-[#1A1A1A] hover:bg-[#FFF9E6] rounded-full transition-all"><FiEdit2 size={16} /></button>
                  <button onClick={() => del(cat._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        {!loading && cats.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <FiFolder className="mx-auto text-gray-300 mb-4" size={40} />
            <p className="text-gray-400 font-medium">No categories found yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-xl text-[#222]">{editing ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 transition-colors"><FiX size={20} /></button>
              </div>
              <form onSubmit={save} className="space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-widest">Category Name</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-2xl text-sm font-bold text-[#222] outline-none focus:ring-1 focus:ring-[#C9A84C]/50" 
                    placeholder="e.g. Modern Rugs" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-widest">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} 
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-2xl text-sm font-medium text-[#222] outline-none focus:ring-1 focus:ring-[#C9A84C]/50 resize-none" 
                    placeholder="Tell us about this category..." />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-widest">Category Image</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:bg-gray-50 transition-all group overflow-hidden aspect-video relative">
                    {image || editing?.image ? (
                      <img 
                        src={getImageUrl(image ? URL.createObjectURL(image) : editing?.image)} 
                        className="w-full h-full object-cover rounded-xl" 
                        alt="Preview" 
                      />
                    ) : (
                      <div className="text-center">
                        <FiUpload size={24} className="text-gray-300 mx-auto mb-2 group-hover:text-[#1A1A1A] transition-colors" />
                        <span className="text-gray-400 text-xs font-medium">Click to upload image</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files[0])} />
                  </label>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 bg-[#222] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-sm">
                    {saving ? 'Saving...' : editing ? 'Update' : 'Add Category'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
