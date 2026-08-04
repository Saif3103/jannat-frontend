import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiVideo, FiX, FiPackage } from 'react-icons/fi';
import api, { BASE_URL } from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const EMPTY = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  category: '',
  material: '',
  type: 'Handmade',
  stock: '1',
  tags: '',
  colors: '',
  sizes: [],
  isFeatured: false,
  processingTime: '1-2 weeks',
  originPostcode: '281001',
  returnPolicy: '7 days',
  manufacturerInfo: '',
};

/** Currency-prefixed price input with aligned ₹ icon */
function PriceInput({ value, onChange, disabled, placeholder, className = '' }) {
  return (
    <div
      className={`flex items-center h-11 rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/15 ${
        disabled ? 'bg-gray-50 border-gray-100' : ''
      } ${className}`}
    >
      <span
        className={`w-8 shrink-0 flex items-center justify-center text-sm leading-none select-none ${
          disabled ? 'text-gray-300' : 'text-gray-500'
        }`}
        aria-hidden
      >
        ₹
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="flex-1 min-w-0 h-full pr-3 bg-transparent text-sm text-[#1A1A1A] outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
      />
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState(Array(10).fill(null));
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [dismissTip, setDismissTip] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=100';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${BASE_URL}/${url}`;
  };

  useEffect(() => {
    load();
    api.get('/categories').then((r) => setCategories(r.data.categories));
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?limit=50');
      setProducts(data.products);
    } catch {} finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY);
    setImages(Array(10).fill(null));
    setIsEditing(true);
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setForm({
      ...p,
      category: p.category?._id,
      tags: p.tags?.join(', '),
      colors: p.colors?.join(', '),
      sizes: Array.isArray(p.sizes) ? p.sizes.map((s) => ({ label: s.label, price: s.price ?? '' })) : [],
      processingTime: p.processingTime || '1-2 weeks',
      originPostcode: p.originPostcode || '281001',
      returnPolicy: p.returnPolicy || '7 days',
      manufacturerInfo: p.manufacturerInfo || '',
    });
    const loadedImages = Array(10).fill(null);
    p.images?.forEach((img, i) => {
      if (i < 10) loadedImages[i] = img;
    });
    setImages(loadedImages);
    setIsEditing(true);
  };

  const closeEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
  };

  const save = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    if (!form.name || !form.price || !form.category) {
      toast.error('Please fill name, price and category');
      setSaving(false);
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (['images', '_id', '__v', 'createdAt', 'updatedAt', 'reviews', 'slug'].includes(k)) return;
        if (k === 'sizes') {
          const normalized = (Array.isArray(v) ? v : [])
            .filter((s) => s?.label)
            .map((s) => ({
              label: s.label,
              price: Number(String(s.price).replace(/,/g, '')) || 0,
            }));
          fd.append(k, JSON.stringify(normalized));
        } else if (typeof v === 'boolean') fd.append(k, v.toString());
        else if (v !== null && v !== undefined) fd.append(k, v);
      });

      images.forEach((img) => {
        if (img instanceof File) fd.append('images', img);
      });

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, fd);
        toast.success('Listing updated!');
      } else {
        await api.post('/products', fd);
        toast.success('Listing published!');
      }
      setIsEditing(false);
      load();
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Failed to save listing');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));

  const sizes = [
    { label: '3x3', price: '16,200' },
    { label: '4x4', price: '28,800' },
    { label: '5x5', price: '45,000' },
    { label: '6x6', price: '64,800' },
    { label: '7x7', price: '88,200' },
    { label: '8x8', price: '115,200' },
    { label: '9x9', price: '145,800' },
  ];

  const fieldClass =
    'w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15';
  const labelClass = 'text-[13px] font-semibold text-[#1A1A1A] mb-1.5 block text-left';
  const helpClass = 'text-[12px] text-gray-500 mb-2 text-left';

  // -------------------------
  // LISTINGS VIEW
  // -------------------------
  if (!isEditing) {
    return (
      <AdminLayout>
        <Helmet>
          <title>Listings | Jannat Rugs Co.</title>
        </Helmet>

        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings..."
                className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15"
              />
            </div>
            <button
              type="button"
              onClick={openAdd}
              className="h-11 px-5 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <FiPlus size={16} />
              Add listing
            </button>
          </div>

          <p className="text-xs text-gray-500 text-left">
            {loading ? 'Loading...' : `${filtered.length} listing${filtered.length === 1 ? '' : 's'}`}
          </p>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-2.5">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 bg-white border border-gray-100 rounded-2xl animate-pulse" />
                ))
              : filtered.map((p) => (
                  <div key={p._id} className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm text-left">
                    <div className="flex gap-3">
                      <img
                        src={getImageUrl(p.images?.[0])}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#1A1A1A] line-clamp-2 leading-snug">{p.name}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{p.category?.name || 'Uncategorized'}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-sm font-bold text-[#1A1A1A]">
                            ₹{(p.discountPrice || p.price)?.toLocaleString('en-IN')}
                          </span>
                          {p.discountPrice > 0 && p.discountPrice < p.price && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{p.price?.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className={`text-[11px] font-medium ${p.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {p.stock > 0 ? `${p.stock} in stock` : 'Sold out'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="flex-1 h-10 rounded-xl bg-gray-50 text-[#1A1A1A] text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-100 cursor-pointer"
                      >
                        <FiEdit2 size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => del(p._id)}
                        className="flex-1 h-10 rounded-xl bg-red-50 text-red-600 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-red-100 cursor-pointer"
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
            {!loading && filtered.length === 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl py-14 text-center">
                <FiPackage size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No listings found</p>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-[12px]">Listing</th>
                    <th className="px-5 py-3.5 font-semibold text-[12px]">Category</th>
                    <th className="px-5 py-3.5 font-semibold text-[12px]">Price</th>
                    <th className="px-5 py-3.5 font-semibold text-[12px]">Stock</th>
                    <th className="px-5 py-3.5 font-semibold text-[12px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading
                    ? [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan="5" className="px-5 py-4">
                            <div className="h-10 bg-gray-50 animate-pulse rounded-lg" />
                          </td>
                        </tr>
                      ))
                    : filtered.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={getImageUrl(p.images?.[0])}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded-xl border border-gray-100"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-[#1A1A1A] max-w-[280px] truncate">{p.name}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">ID: {p._id.slice(-6)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">{p.category?.name || '—'}</td>
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-[#1A1A1A]">
                              ₹{(p.discountPrice || p.price)?.toLocaleString('en-IN')}
                            </p>
                            {p.discountPrice > 0 && p.discountPrice < p.price && (
                              <p className="text-[11px] text-gray-400 line-through">
                                ₹{p.price?.toLocaleString('en-IN')}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[13px] font-medium ${p.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {p.stock > 0 ? `${p.stock} in stock` : 'Sold out'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(p)}
                                className="h-9 px-3.5 rounded-lg bg-gray-100 text-[#1A1A1A] text-[12px] font-semibold hover:bg-gray-200 inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <FiEdit2 size={13} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => del(p._id)}
                                className="h-9 px-3.5 rounded-lg bg-red-50 text-red-600 text-[12px] font-semibold hover:bg-red-100 inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <FiTrash2 size={13} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
              {!loading && filtered.length === 0 && (
                <div className="text-center py-16 text-gray-500 text-sm">No listings found.</div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // -------------------------
  // EDITOR VIEW
  // -------------------------
  return (
    <AdminLayout>
      <Helmet>
        <title>{editingProduct ? 'Edit Listing' : 'Add Listing'} | Jannat Rugs Co.</title>
      </Helmet>

      <div className="pb-28 lg:pb-24 text-left">
        {/* Editor header */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-4 overflow-hidden">
          <div className="px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={closeEdit}
                className="text-sm font-semibold text-gray-600 hover:text-[#1A1A1A] shrink-0 cursor-pointer"
              >
                ← Back
              </button>
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] truncate border-l border-gray-200 pl-3">
                {editingProduct ? 'Edit listing' : 'Add a new listing'}
              </h2>
            </div>
          </div>

          <div className="px-4 sm:px-5 flex gap-4 text-[12px] sm:text-[13px] font-medium text-gray-500 overflow-x-auto">
            {['Photos', 'Category', 'Details', 'Options'].map((tab, i) => (
              <span
                key={tab}
                className={`py-3 whitespace-nowrap border-b-2 ${
                  i === 0 ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent'
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>

        {!dismissTip && (
          <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3.5 text-sm rounded-2xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-left">
              <p className="font-semibold mb-0.5">Tips for better listings</p>
              <p className="text-blue-600 text-[12px]">Use clear photos, accurate sizes, and honest pricing.</p>
            </div>
            <button
              type="button"
              onClick={() => setDismissTip(true)}
              className="h-9 px-4 bg-white border border-blue-200 rounded-xl text-xs font-semibold hover:bg-blue-50 self-start sm:self-center cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="space-y-4">
          {/* Photos & Video */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-1">Photo and video</h3>
            <p className={helpClass}>Show different angles and details of your rug.</p>
            <p className="text-[13px] font-semibold mb-3">
              Add up to 10 photos and 1 video <span className="text-red-500">*</span>
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`relative aspect-square rounded-xl border overflow-hidden flex items-center justify-center group ${
                    img ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50'
                  }`}
                >
                  {img ? (
                    <>
                      <img
                        src={getImageUrl(img instanceof File ? URL.createObjectURL(img) : img)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-white px-1.5 py-0.5 text-[9px] font-bold rounded shadow-sm">
                          Primary
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newImgs = [...images];
                          newImgs[i] = null;
                          setImages(newImgs);
                        }}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                      <FiImage className="text-gray-400" size={22} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const newImgs = [...images];
                            newImgs[i] = file;
                            setImages(newImgs);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              ))}

              <div className="relative aspect-square rounded-xl border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <FiVideo size={22} />
                  <span className="text-[9px] font-semibold uppercase">Video</span>
                </div>
              </div>
            </div>
          </section>

          {/* Category */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-4">Category</h3>
            <label className={labelClass}>
              Selected category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={fieldClass}
            >
              <option value="">Select a category...</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-2">Physical item · Made to order</p>
          </section>

          {/* Item Details */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-1">Item details</h3>
            <p className={helpClass}>Help buyers understand your item better.</p>

            <div className="space-y-5 max-w-2xl">
              <div>
                <label className={labelClass}>
                  Title <span className="text-red-500">*</span>
                </label>
                <p className={helpClass}>Clear title that describes the rug.</p>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={fieldClass}
                  placeholder="e.g. Handmade Abstract Wool Rug..."
                  maxLength={140}
                />
                <div className="text-right text-[11px] text-gray-400 mt-1">{form.name?.length || 0}/140</div>
              </div>

              <div>
                <label className={labelClass}>
                  Description <span className="text-red-500">*</span>
                </label>
                <p className={helpClass}>What makes this rug special?</p>
                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15 resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>
                    Price <span className="text-red-500">*</span>
                  </label>
                  <PriceInput
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value.replace(/[^0-9.]/g, '') })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Sale price</label>
                  <PriceInput
                    value={form.discountPrice}
                    onChange={(e) =>
                      setForm({ ...form, discountPrice: e.target.value.replace(/[^0-9.]/g, '') })
                    }
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className={labelClass}>Stock</label>
                  <input
                    type="text"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Material</label>
                  <input
                    type="text"
                    value={form.material || ''}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g. Wool"
                  />
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <input
                    type="text"
                    value={form.type || ''}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g. Handmade"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Tags</label>
                  <input
                    type="text"
                    value={form.tags || ''}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className={fieldClass}
                    placeholder="Comma separated"
                  />
                </div>
                <div>
                  <label className={labelClass}>Colors</label>
                  <input
                    type="text"
                    value={form.colors || ''}
                    onChange={(e) => setForm({ ...form, colors: e.target.value })}
                    className={fieldClass}
                    placeholder="Comma separated"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-sm font-medium text-[#1A1A1A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                />
                Featured product
              </label>
            </div>
          </section>

          {/* Item Options / Variations */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-1">Item options</h3>
            <p className={helpClass}>Size variants and pricing for this listing.</p>

            <div className="border border-gray-100 rounded-2xl p-3 sm:p-5 bg-gray-50/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="font-semibold text-[15px]">Variations</h4>
                  <p className="text-[12px] text-gray-500">Select sizes and set a custom price for each</p>
                </div>
              </div>

              <div className="hidden sm:grid grid-cols-[7rem_1fr] gap-4 px-3 mb-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Size (ft)</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Price</p>
              </div>

              <div className="space-y-2">
                {sizes.map((s) => {
                  const selected = (form.sizes || []).some((v) => v.label === s.label);
                  const saved = (form.sizes || []).find((v) => v.label === s.label);
                  const defaultPrice = Number(s.price.replace(/,/g, ''));
                  const currentPrice =
                    saved?.price !== undefined && saved?.price !== null && saved?.price !== ''
                      ? saved.price
                      : defaultPrice;
                  return (
                    <div
                      key={s.label}
                      className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-3 py-3 rounded-xl border ${
                        selected ? 'bg-white border-[#C9A84C]/40' : 'bg-white/70 border-gray-100'
                      }`}
                    >
                      <label className="flex items-center gap-3 sm:w-28 shrink-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const current = form.sizes || [];
                            if (e.target.checked) {
                              setForm({
                                ...form,
                                sizes: [...current, { label: s.label, price: defaultPrice }],
                              });
                            } else {
                              setForm({ ...form, sizes: current.filter((v) => v.label !== s.label) });
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                        />
                        <span className="text-sm font-semibold">{s.label}</span>
                      </label>
                      <div className="flex-1 min-w-0">
                        <p className="sm:hidden text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                          Price
                        </p>
                        <PriceInput
                          value={currentPrice}
                          disabled={!selected}
                          placeholder={selected ? 'Enter price' : 'Select size to edit'}
                          className="h-10 rounded-lg"
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/[^0-9]/g, '');
                            const current = [...(form.sizes || [])];
                            const idx = current.findIndex((v) => v.label === s.label);
                            if (idx > -1) {
                              current[idx] = {
                                ...current[idx],
                                price: cleaned === '' ? '' : Number(cleaned),
                              };
                              setForm({ ...form, sizes: current });
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold mb-1">Delivery, processing & returns</h3>
            <p className={helpClass}>Set clear expectations for buyers.</p>

            <div className="space-y-4 max-w-2xl">
              <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/40">
                <label className={labelClass}>
                  Processing time <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
                  <div>
                    <p className="font-semibold text-sm">Made to order</p>
                    <p className="text-xs text-gray-500">{form.processingTime || '1-2 weeks'}</p>
                  </div>
                  <select
                    value={form.processingTime}
                    onChange={(e) => setForm({ ...form, processingTime: e.target.value })}
                    className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-[#C9A84C]"
                  >
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-3 weeks">2-3 weeks</option>
                    <option value="3-4 weeks">3-4 weeks</option>
                    <option value="1 month">1 month</option>
                  </select>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className={labelClass}>
                    Origin postcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.originPostcode}
                    onChange={(e) => setForm({ ...form, originPostcode: e.target.value })}
                    className={`${fieldClass} max-w-[160px]`}
                  />
                </div>
              </div>

              <div className="p-4 border border-gray-100 rounded-2xl">
                <label className={labelClass}>
                  Returns & exchanges <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-sm text-gray-600">Return window policy</p>
                  <select
                    value={form.returnPolicy}
                    onChange={(e) => setForm({ ...form, returnPolicy: e.target.value })}
                    className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-[#C9A84C]"
                  >
                    <option value="7 days">7 days</option>
                    <option value="14 days">14 days</option>
                    <option value="No returns">No returns</option>
                  </select>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
                  Buyer is responsible for return postage costs and any loss in value if an item isn&apos;t returned in original condition.
                </p>
              </div>
            </div>
          </section>

          {/* GPSR */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-bold">GPSR manufacturer & safety</h3>
              <button
                type="button"
                onClick={() => setForm({ ...form, manufacturerInfo: '' })}
                className="text-xs font-semibold text-red-500 hover:underline self-start cursor-pointer"
              >
                Remove info
              </button>
            </div>
            <p className={helpClass}>
              If selling to EEA states or Northern Ireland, include manufacturer and safety info for GPSR compliance.
            </p>
            <label className={labelClass}>Manufacturer details</label>
            <textarea
              value={form.manufacturerInfo}
              onChange={(e) => setForm({ ...form, manufacturerInfo: e.target.value })}
              placeholder="Enter name, email, and mailing address of the manufacturer..."
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15 transition-all"
              rows={4}
            />
          </section>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-[260px] right-0 bg-white/95 backdrop-blur border-t border-gray-200 py-3 px-4 z-40">
        <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
          <p className="hidden sm:block text-xs text-gray-400">Ready to publish</p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={closeEdit}
              className="flex-1 sm:flex-none h-11 px-5 bg-white border border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => save()}
              disabled={saving}
              className="flex-1 sm:flex-none h-11 px-6 bg-[#1A1A1A] text-white rounded-xl font-semibold text-sm hover:bg-black disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Publishing...' : editingProduct ? 'Save changes' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
