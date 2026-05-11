import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiVideo, FiX } from 'react-icons/fi';
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
  isFeatured: false,
  processingTime: '1-2 weeks',
  originPostcode: '281001',
  returnPolicy: '7 days',
  manufacturerInfo: ''
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState(Array(10).fill(null));
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=100';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${BASE_URL}/${url}`;
  };

  useEffect(() => {
    load();
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/products?limit=50'); setProducts(data.products); }
    catch {} finally { setLoading(false); }
  };

  const openAdd = () => { setEditingProduct(null); setForm(EMPTY); setImages(Array(10).fill(null)); setIsEditing(true); };
  const openEdit = (p) => { 
    setEditingProduct(p); 
    setForm({ 
      ...p, 
      category: p.category?._id, 
      tags: p.tags?.join(', '), 
      colors: p.colors?.join(', '),
      processingTime: p.processingTime || '1-2 weeks',
      originPostcode: p.originPostcode || '281001',
      returnPolicy: p.returnPolicy || '7 days',
      manufacturerInfo: p.manufacturerInfo || ''
    }); 
    const loadedImages = Array(10).fill(null);
    p.images?.forEach((img, i) => { if(i < 10) loadedImages[i] = img; });
    setImages(loadedImages); 
    setIsEditing(true); 
  };
  const closeEdit = () => { setIsEditing(false); setEditingProduct(null); };

  const save = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (['images', '_id', '__v', 'createdAt', 'updatedAt', 'reviews', 'slug'].includes(k)) return;
        if (k === 'sizes') fd.append(k, JSON.stringify(v));
        else if (typeof v === 'boolean') fd.append(k, v.toString());
        else if (v !== null && v !== undefined) fd.append(k, v);
      });
      
      images.forEach(img => {
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
      toast.error('Failed to save listing'); 
    }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // -------------------------
  // LISTINGS VIEW
  // -------------------------
  if (!isEditing) {
    return (
      <AdminLayout>
        <Helmet><title>Listings | Jannat Rugs Co.</title></Helmet>
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[#222]">Listings</h1>
          <button onClick={openAdd} className="bg-[#222] text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-black transition-colors shadow-sm">
            Add a listing
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#E0E0E0] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E0E0E0] flex gap-4 bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={search} onChange={e => setSearch(e.target.value)} 
                placeholder="Search your listings..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/5" 
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white border-b border-[#E0E0E0] text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4 font-normal">Listing details</th>
                  <th className="px-6 py-4 font-normal">Category</th>
                  <th className="px-6 py-4 font-normal">Price</th>
                  <th className="px-6 py-4 font-normal">Stock</th>
                  <th className="px-6 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {loading ? [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan="5" className="px-6 py-4"><div className="h-10 bg-gray-100 animate-pulse rounded" /></td></tr>
                )) : filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={getImageUrl(p.images?.[0])} alt={p.name} className="w-12 h-12 object-cover rounded border border-gray-200" />
                      <div>
                        <p className="font-semibold text-[#222] max-w-[250px] truncate">{p.name}</p>
                        <p className="text-xs text-gray-500 mt-1">ID: {p._id.slice(-6)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#595959]">{p.category?.name || '—'}</td>
                    <td className="px-6 py-4 font-medium text-[#222]">₹{p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="text-[#595959]">{p.stock > 0 ? `${p.stock} in stock` : <span className="text-red-500">Sold out</span>}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(p)} className="text-gray-500 hover:text-black p-2 font-medium bg-gray-100 rounded-full mx-1 opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                      <button onClick={() => del(p._id)} className="text-red-500 hover:bg-red-50 p-2 font-medium rounded-full mx-1 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && filtered.length === 0 && (
              <div className="text-center py-16 text-gray-500">No listings found.</div>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // -------------------------
  // EDITOR VIEW (Jannat Style)
  // -------------------------
  const sizes = [
    { label: "3x3", price: "16,200" },
    { label: "4x4", price: "28,800" },
    { label: "5x5", price: "45,000" },
    { label: "6x6", price: "64,800" },
    { label: "7x7", price: "88,200" },
    { label: "8x8", price: "115,200" },
    { label: "9x9", price: "145,800" },
  ];

  return (
    <AdminLayout>
      <div className="bg-white pb-24 font-sans text-[#222] -mx-6 lg:-mx-10 -mt-6 lg:-mt-10 min-h-screen">
        <Helmet><title>{editingProduct ? 'Edit Listing' : 'Add Listing'} | Jannat Rugs Co.</title></Helmet>
        
        {/* Top Navigation */}
        <div className="bg-white border-b border-[#E0E0E0] sticky top-0 z-40">
          <div className="max-w-[1000px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={closeEdit} className="text-sm font-semibold hover:underline">&larr; Back to Listings</button>
              <h1 className="text-xl font-semibold border-l pl-4 border-gray-300">{editingProduct ? 'Edit listing' : 'Add a new listing'}</h1>
            </div>
          </div>
          
          {/* Anchor Tabs */}
          <div className="max-w-[1000px] mx-auto px-6 flex gap-6 text-sm font-medium text-gray-500 overflow-x-auto">
            {['Photo & Video', 'Category', 'Item Details', 'Item Options'].map((tab, i) => (
              <button key={tab} className={`pb-3 border-b-2 whitespace-nowrap ${i === 0 ? 'border-black text-black' : 'border-transparent hover:text-gray-800'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tip Banner (Subtle Light Theme) */}
        <div className="max-w-[1000px] mx-auto px-6 mt-6">
          <div className="bg-blue-50 border border-blue-100 text-blue-800 px-6 py-4 text-sm flex items-center justify-between rounded-2xl shadow-sm">
            <div>
              <p className="font-bold mb-0.5">We're building a better listing form</p>
              <p className="text-blue-600 font-medium">First up: a refreshed order that's easier to follow...</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-white border border-blue-200 rounded-full hover:bg-blue-50 font-bold transition-all">Dismiss</button>
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all">Feedback</button>
            </div>
          </div>
        </div>

      <div className="max-w-[1000px] mx-auto px-6 py-8 space-y-8">
        
        {/* Photos & Video */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-1">Photo and video</h2>
          <p className="text-sm text-gray-500 mb-6">Show off different angles, available options, or even a peek behind the scenes.</p>
          
          <div className="mb-4">
            <p className="font-semibold text-[15px] mb-2 flex items-center gap-1">Add up to 10 photos and 1 video. <span className="text-red-500">*</span></p>
            <div className="flex flex-wrap gap-3">
              {/* Photo Slots */}
              {images.map((img, i) => (
                <div key={i} className={`relative w-28 h-28 rounded-lg border ${img ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50'} overflow-hidden flex items-center justify-center group`}>
                  {img ? (
                    <>
                      <img src={getImageUrl(img instanceof File ? URL.createObjectURL(img) : img)} alt="" className="w-full h-full object-cover" />
                      {i === 0 && <span className="absolute top-1 left-1 bg-white px-2 py-0.5 text-[10px] font-bold rounded shadow-sm">Primary</span>}
                      <button 
                        onClick={() => { const newImgs = [...images]; newImgs[i] = null; setImages(newImgs); }}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiTrash2 size={20} />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                      <FiImage className="text-gray-400" size={24} />
                      <input type="file" className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files[0];
                        if(file) { const newImgs = [...images]; newImgs[i] = file; setImages(newImgs); }
                      }} />
                    </label>
                  )}
                </div>
              ))}
              
              {/* Video Slot */}
              <div className="relative w-28 h-28 rounded-lg border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <FiVideo size={24} />
                  <span className="text-[10px] font-semibold uppercase">Video</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Category</h2>
          <div className="max-w-2xl">
            <label className="font-semibold text-[15px] mb-2 block">Selected category <span className="text-red-500">*</span></label>
            <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg">
              <div>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="font-medium text-lg bg-transparent focus:outline-none cursor-pointer">
                  <option value="">Select a category...</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-1">Physical item • Made to order</p>
              </div>
              <button className="px-4 py-1.5 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-50">Change</button>
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-1">Item details</h2>
          <p className="text-sm text-gray-500 mb-6">Help buyers understand your item better.</p>
          
          <div className="max-w-2xl space-y-6">
            <div>
              <label className="font-semibold text-[15px] mb-2 block">Title <span className="text-red-500">*</span></label>
              <p className="text-sm text-gray-500 mb-2">Make sure your title is easy to understand and clearly describes the items you're selling.</p>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none" placeholder="e.g. Handmade Abstract Tufted Wool Cotton Rug..." />
              <div className="text-right text-xs text-gray-400 mt-1">{form.name.length}/140</div>
            </div>
            
            <div>
              <label className="font-semibold text-[15px] mb-2 block">Description <span className="text-red-500">*</span></label>
              <p className="text-sm text-gray-500 mb-2">What makes your item special? Buyers will only see the first few lines unless they expand the description.</p>
              <textarea rows={8} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none resize-y" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[15px] mb-2 block">Price (₹) <span className="text-red-500">*</span></label>
                <input type="text" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="font-semibold text-[15px] mb-2 block">Stock</label>
                <input type="text" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Item Options / Variations */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-1">Item options</h2>
          <p className="text-sm text-gray-500 mb-6">Share any standard options or special personalization choices available for this item.</p>
          
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Variations</h3>
                <p className="text-sm text-gray-500">Add available options like colour or size.</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 bg-white rounded-full text-sm font-semibold hover:bg-gray-50 shadow-sm">Manage variations</button>
            </div>
            
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Size Feet <span className="font-normal lowercase">({sizes.length} variants)</span></p>
            
            <div className="space-y-0">
              <div className="flex gap-4 px-4 py-2 text-xs font-bold border-b border-gray-200">
                <div className="w-8"></div>
                <div className="w-24 border-b border-black pb-1 inline-block">Size Feet</div>
                <div className="flex-1 border-b border-black pb-1 inline-block">Price in India</div>
                <div className="flex-1 border-b border-black pb-1 inline-block">Price in United States</div>
              </div>
              
              {sizes.map((s, i) => (
                <div key={s.label} className={`flex items-center gap-4 px-4 py-3 border-b border-gray-200`}>
                  <input 
                    type="checkbox" 
                    checked={(form.sizes || []).some(v => v.label === s.label)}
                    onChange={(e) => {
                      const current = form.sizes || [];
                      if(e.target.checked) {
                        setForm({...form, sizes: [...current, { label: s.label, price: Number(s.price.replace(/,/g, '')) }]});
                      } else {
                        setForm({...form, sizes: current.filter(v => v.label !== s.label)});
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" 
                  />
                  <div className="w-24 text-sm font-medium">{s.label}</div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input 
                      type="text" 
                      value={(form.sizes || []).find(v => v.label === s.label)?.price || s.price} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/,/g, '');
                        const current = [...(form.sizes || [])];
                        const idx = current.findIndex(v => v.label === s.label);
                        if(idx > -1) {
                          current[idx].price = Number(val);
                          setForm({...form, sizes: current});
                        }
                      }}
                      className="w-full pl-7 p-2 border border-gray-300 rounded bg-white text-sm" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery, Processing and Returns */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-1">Delivery, processing, and returns</h2>
          <p className="text-sm text-gray-500 mb-6">Give clear expectations about delivery time and cost by making sure your delivery info is accurate.</p>
          
          <div className="space-y-8 max-w-2xl">
            <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/30">
              <label className="font-semibold text-[15px] mb-1 block">Processing profile <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-bold text-sm">Made to order</p>
                  <p className="text-xs text-gray-500">{form.processingTime || '1-2 weeks'}</p>
                </div>
                <select 
                  value={form.processingTime} 
                  onChange={e => setForm({...form, processingTime: e.target.value})}
                  className="bg-white border border-gray-300 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm"
                >
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-3 weeks">2-3 weeks</option>
                  <option value="3-4 weeks">3-4 weeks</option>
                  <option value="1 month">1 month</option>
                </select>
              </div>

              <div className="mt-6">
                <label className="font-semibold text-[15px] mb-1 block">Delivery option <span className="text-red-500">*</span></label>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-bold text-sm">Standard Delivery (Fixed)</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">From</span>
                       <input 
                         type="text" 
                         value={form.originPostcode} 
                         onChange={e => setForm({...form, originPostcode: e.target.value})}
                         className="bg-transparent border-b border-gray-300 focus:border-black outline-none text-xs font-bold w-16"
                       />
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                </div>
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-2xl">
              <label className="font-semibold text-[15px] mb-1 block">Returns and exchanges <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-bold text-sm">Returns and exchanges policy</p>
                  <p className="text-xs text-gray-500 mt-1">{form.returnPolicy || '7 days'} return window</p>
                </div>
                <select 
                  value={form.returnPolicy} 
                  onChange={e => setForm({...form, returnPolicy: e.target.value})}
                  className="bg-white border border-gray-300 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm"
                >
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                  <option value="No returns">No returns</option>
                </select>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-2 italic">Buyer is responsible for return postage costs and any loss in value if an item isn't returned in original condition.</p>
            </div>
          </div>
        </div>

        {/* GPSR manufacturer and safety information */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">GPSR manufacturer and safety information</h2>
            <button className="text-xs font-bold text-red-500 hover:underline">Remove info</button>
          </div>
          <p className="text-sm text-gray-500 mb-8 max-w-2xl">If you're a "trader" selling to EEA states or Northern Ireland (NI), you may need to include manufacturer and safety info to comply with GPSR.</p>
          
          <div className="max-w-2xl">
             <label className="font-semibold text-[13px] block mb-2">Manufacturer Details</label>
             <textarea 
               value={form.manufacturerInfo} 
               onChange={e => setForm({...form, manufacturerInfo: e.target.value})}
               placeholder="Enter name, email, and mailing address of the manufacturer..."
               className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:border-black transition-all"
               rows={4}
             />
          </div>
        </div>

      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-white border-t border-[#E0E0E0] py-4 px-6 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">Draft saved automatically</p>
          <div className="flex gap-4">
            <button onClick={closeEdit} className="px-8 py-3 bg-white border border-gray-300 rounded-full font-bold text-sm hover:bg-gray-50 transition-all active:scale-[0.98]">
              Cancel
            </button>
            <button onClick={() => save()} disabled={saving} className="px-10 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50">
              {saving ? 'Publishing...' : 'Publish to Jannat Rugs Co.'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
