import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const EMPTY = { name: '', description: '', price: '', discountPrice: '', category: '', material: '', type: 'Handmade', stock: '', tags: '', colors: '', offerLabel: '', isFeatured: false, isBestSeller: false, isNewArrival: true, isTrending: false, isLuxury: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    load();
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/products?limit=50'); setProducts(data.products); }
    catch {} finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setImages([]); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, category: p.category?._id, tags: p.tags?.join(', '), colors: p.colors?.join(', ') }); setImages([]); setShowModal(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        // Skip system fields and the old images array to prevent multer from crashing
        if (['images', '_id', '__v', 'createdAt', 'updatedAt', 'reviews', 'slug'].includes(k)) return;
        
        // Handle booleans properly
        if (typeof v === 'boolean') {
          fd.append(k, v.toString());
        } else if (v !== null && v !== undefined) {
          fd.append(k, v);
        }
      });
      
      // Append actual file objects
      images.forEach(img => {
        fd.append('images', img);
      });

      if (editing) { 
        await api.put(`/products/${editing._id}`, fd); 
        toast.success('Product updated!'); 
      } else { 
        await api.post('/products', fd); 
        toast.success('Product added!'); 
      }
      setShowModal(false); 
      load();
    } catch (err) { 
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save product'); 
    }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <Helmet><title>Products | Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-luxury text-2xl text-white">Products</h1>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2 py-2 px-4 text-sm" id="add-product-btn">
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="input-luxury max-w-xs" id="admin-product-search" />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-amber-100/40 text-xs uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-amber-900/10">
                  {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-8 shimmer rounded" /></td>)}
                </tr>
              )) : filtered.map(p => (
                <tr key={p._id} className="border-b border-amber-900/10 hover:bg-amber-500/5 transition-colors">
                  <td className="px-4 py-3">
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=100'} alt={p.name} className="w-12 h-12 object-cover rounded-lg" />
                  </td>
                  <td className="px-4 py-3 text-amber-100 max-w-[180px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-amber-100/50">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-amber-400 font-medium">₹{p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${p.stock > 0 ? 'text-emerald-400 bg-emerald-900/20' : 'text-red-400 bg-red-900/20'}`}>
                      {p.stock > 0 ? p.stock : 'Out'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.isFeatured && <span className="text-xs text-amber-400 bg-amber-900/20 px-2 py-0.5 rounded">Yes</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => del(p._id)} className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 text-amber-100/30">No products found</div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-luxury text-xl text-amber-400">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowModal(false)} className="text-amber-100/40 hover:text-amber-100 p-1"><FiX size={20} /></button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Product Name *</label>
                    <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-luxury" />
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Price (₹) *</label>
                    <input type="number" required value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="input-luxury" />
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Discount Price (₹)</label>
                    <input type="number" value={form.discountPrice} onChange={e => setForm(p => ({ ...p, discountPrice: e.target.value }))} className="input-luxury" />
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Category *</label>
                    <select required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-luxury">
                      <option value="" style={{ background: '#1a1008' }}>Select category</option>
                      {categories.map(c => <option key={c._id} value={c._id} style={{ background: '#1a1008' }}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Type</label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-luxury">
                      {['Handmade', 'Machine Made', 'Hand-Tufted', 'Hand-Knotted', 'Modern'].map(t => (
                        <option key={t} value={t} style={{ background: '#1a1008' }}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Material</label>
                    <input value={form.material} onChange={e => setForm(p => ({ ...p, material: e.target.value }))} className="input-luxury" placeholder="e.g. Pure Wool, Silk" />
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className="input-luxury" />
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Tags (comma separated)</label>
                    <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="input-luxury" placeholder="persian, wool, luxury" />
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Colors (comma separated)</label>
                    <input value={form.colors} onChange={e => setForm(p => ({ ...p, colors: e.target.value }))} className="input-luxury" placeholder="Red, Gold, Beige" />
                  </div>
                  <div>
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Offer Label</label>
                    <input value={form.offerLabel} onChange={e => setForm(p => ({ ...p, offerLabel: e.target.value }))} className="input-luxury" placeholder="Hot Deal, 20% Off" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Description</label>
                    <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-luxury resize-none" />
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap gap-4">
                    {[
                      { key: 'isFeatured', label: 'Featured' },
                      { key: 'isBestSeller', label: 'Best Seller' },
                      { key: 'isNewArrival', label: 'New Arrival' },
                      { key: 'isTrending', label: 'Trending' },
                      { key: 'isLuxury', label: 'Luxury' },
                    ].map(f => (
                      <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.checked }))} className="accent-amber-500" />
                        <span className="text-sm text-amber-100/70">{f.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">Product Images</label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-amber-900/40 rounded-xl p-6 cursor-pointer hover:border-amber-700/60 transition-colors">
                      <FiUpload size={24} className="text-amber-400/50 mb-2" />
                      <span className="text-amber-100/40 text-sm">Click to upload images (max 50)</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={e => setImages([...e.target.files])} />
                    </label>
                    {images.length > 0 && <p className="text-xs text-amber-400 mt-2">{images.length} image(s) selected</p>}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-outline-gold flex-1 py-2.5">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-gold flex-1 py-2.5">
                    {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
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
