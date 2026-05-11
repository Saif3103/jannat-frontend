import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage, FiVideo, FiX } from 'react-icons/fi';
import api, { BASE_URL } from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

const EMPTY = { name: '', description: '', price: '', discountPrice: '', category: '', material: '', type: 'Handmade', stock: '', tags: '', colors: '', isFeatured: false };

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
    setForm({ ...p, category: p.category?._id, tags: p.tags?.join(', '), colors: p.colors?.join(', ') }); 
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
        if (typeof v === 'boolean') fd.append(k, v.toString());
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
        <Helmet><title>Listings | Shop Manager</title></Helmet>
        
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
        <Helmet><title>{editingProduct ? 'Edit Listing' : 'Add Listing'} | Shop Manager</title></Helmet>
        
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
                <div key={s.label} className={`flex items-center gap-4 px-4 py-3 border-b border-gray-200 ${i === 5 ? 'bg-gray-200/60 rounded' : ''}`}>
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                  <div className="w-24 text-sm font-medium">{s.label}</div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input type="text" defaultValue={s.price} className="w-full pl-7 p-2 border border-gray-300 rounded bg-white text-sm" />
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input type="text" defaultValue={s.price} className="w-full pl-7 p-2 border border-gray-300 rounded bg-white text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Personalisation */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="font-semibold text-[17px] mb-1">Personalisation</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-3xl">Make it easier for buyers to add the info you need to personalise their item.</p>
            <button className="px-5 py-2 bg-gray-100 rounded-full text-[13px] font-semibold hover:bg-gray-200 mb-8 shadow-sm">Remove personalisation</button>
            
            <div className="mb-6 max-w-3xl">
              <label className="font-semibold text-[13px] block mb-1">Instructions for buyers</label>
              <p className="text-xs text-gray-500 mb-2">Enter the personalisation instructions you want buyers to see.</p>
              <textarea rows={3} className="w-full p-4 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-1 focus:ring-black resize-none" defaultValue="Enter your exact size (Width x Length). Custom sizes available—message us for perfect fit. Each rug is handmade specially for you, so please confirm details carefully. No return/exchange on custom orders."></textarea>
              <div className="text-right text-xs text-gray-400 mt-1">204/256</div>
            </div>
            
            <div className="mb-6">
              <label className="font-semibold text-[13px] block mb-1">Character limit for buyer response <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-2">Enter number between 1 and 1024</p>
              <input type="text" defaultValue="256" className="w-32 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-black rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
              <span className="text-sm font-medium">Make personalisation optional for the buyer</span>
            </div>
          </div>
          
          {/* Attributes */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="font-semibold text-[17px] mb-1">Attributes</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-3xl">These details help buyers find your item in search as they get specific about what they're looking for.</p>
            
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="font-semibold text-[13px] block mb-1">Tags</label>
                <p className="text-xs text-gray-500 mb-2">Add up to 13 tags to help people search for your listings.</p>
                <div className="flex gap-2 mb-3">
                  <input type="text" id="tagInput" placeholder="Shape, colour, style, function, etc." className="flex-1 p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black" />
                  <button type="button" onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('tagInput');
                    if(el.value.trim()) { 
                      const currentTags = form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : [];
                      if(currentTags.length < 13 && !currentTags.includes(el.value.trim())) {
                        setForm({...form, tags: [...currentTags, el.value.trim()].join(', ')});
                      }
                      el.value = ''; 
                    }
                  }} className="px-5 py-3 text-sm font-semibold rounded-lg bg-white border border-gray-300 hover:bg-gray-50">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.tags ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : []).map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-[13px] text-gray-700">
                      {tag} <FiX size={14} className="cursor-pointer hover:text-black" onClick={() => {
                        const newTags = form.tags.split(',').map(t=>t.trim()).filter(t=> t && t !== tag).join(', ');
                        setForm({...form, tags: newTags});
                      }} />
                    </span>
                  ))}
                </div>
                <div className="text-right text-xs text-gray-500 mt-2 font-medium">{(form.tags ? form.tags.split(',').filter(t=>t.trim()).length : 0)} used</div>
              </div>
              
              <div>
                <label className="font-semibold text-[13px] block mb-1">Materials</label>
                <p className="text-xs text-gray-500 mb-2">Select up to 3 more</p>
                <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm mb-3 outline-none focus:ring-1 focus:ring-black"><option>Type to search...</option></select>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-[13px] text-gray-700">Cotton <FiX size={14} className="cursor-pointer" /></span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-[13px] text-gray-700">Wool <FiX size={14} className="cursor-pointer" /></span>
                </div>
              </div>
              
              <div>
                <label className="font-semibold text-[13px] block mb-1">Primary colour</label>
                <div className="flex items-center gap-4">
                  <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>Beige</option></select>
                </div>
                <button className="text-[13px] font-semibold text-gray-700 hover:underline mt-2">Offer more than one &rarr;</button>
              </div>
              
              <div>
                <label className="font-semibold text-[13px] block mb-1">Secondary colour</label>
                <div className="flex items-center gap-4">
                  <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>Green</option></select>
                </div>
                <button className="text-[13px] font-semibold text-gray-700 hover:underline mt-2">Offer more than one &rarr;</button>
              </div>
              
              <div>
                <label className="font-semibold text-[13px] block mb-1">Width</label>
                <div className="flex gap-2 w-64">
                  <input type="text" defaultValue="6" className="flex-1 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black" />
                  <select className="flex-1 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>Feet</option></select>
                </div>
                <button className="text-[13px] font-semibold text-gray-700 hover:underline mt-2">Offer more than one &rarr;</button>
              </div>
              
              <div>
                <label className="font-semibold text-[13px] block mb-1">Length</label>
                <div className="flex gap-2 w-64">
                  <input type="text" defaultValue="6" className="flex-1 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black" />
                  <select className="flex-1 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>Feet</option></select>
                </div>
                <button className="text-[13px] font-semibold text-gray-700 hover:underline mt-2">Offer more than one &rarr;</button>
              </div>
              
              <div>
                <label className="font-semibold text-[13px] block mb-1">Pattern</label>
                <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>Abstract</option></select>
              </div>
              <div>
                <label className="font-semibold text-[13px] block mb-1">Shape</label>
                <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>Irregular</option></select>
              </div>
              <div>
                <label className="font-semibold text-[13px] block mb-1">Indoor/Outdoor</label>
                <p className="text-xs text-gray-500 mb-2">Select up to 1 more</p>
                <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm mb-3 outline-none focus:ring-1 focus:ring-black"><option>Type to search...</option></select>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-[13px] text-gray-700">Indoor <FiX size={14} className="cursor-pointer" /></span>
                </div>
              </div>
              <div>
                <label className="font-semibold text-[13px] block mb-1">Type</label>
                <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>Area</option></select>
              </div>
              <div>
                <label className="font-semibold text-[13px] block mb-1">Pile height</label>
                <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>Medium</option></select>
              </div>
              <div>
                <label className="font-semibold text-[13px] block mb-1">Home style</label>
                <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>Contemporary</option></select>
              </div>
              <div>
                <label className="font-semibold text-[13px] block mb-1">Occasion</label>
                <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-black"><option>House warming</option></select>
              </div>
              <div>
                <label className="font-semibold text-[13px] block mb-1">Room</label>
                <p className="text-xs text-gray-500 mb-2">All 5 selected</p>
                <select className="w-64 p-3 border border-gray-300 rounded-lg text-sm mb-3 outline-none focus:ring-1 focus:ring-black"><option>Type to search...</option></select>
                <div className="flex flex-wrap gap-2">
                  {['Bedroom', 'Entryway', 'Living room', 'Nursery', 'Office'].map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-[13px] text-gray-700">
                      {tag} <FiX size={14} className="cursor-pointer" />
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <label className="font-semibold text-[13px] block mb-3">Can be personalised <span className="font-normal text-gray-500 underline ml-2 cursor-pointer hover:text-gray-800">Reset</span></label>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" defaultChecked className="accent-black w-4 h-4" /> Yes</label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" className="accent-black w-4 h-4" /> No</label>
                </div>
              </div>
              
              <button className="w-full py-3.5 bg-gray-100 rounded-full font-semibold text-[13px] hover:bg-gray-200 mt-6 shadow-sm transition-colors">Show all attributes</button>
            </div>
          </div>
        </div>

        {/* Pricing and inventory */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-1">Price and inventory</h2>
          <p className="text-sm text-gray-500 mb-6">Set your item price, and how many are available for sale.</p>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[15px]">Domestic and global pricing</h3>
                <p className="text-sm text-gray-500">Set prices for buyers in different locations.</p>
              </div>
              <div className="w-10 h-6 bg-black rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div>
              <label className="font-semibold text-[15px] block mb-1">Price <span className="text-red-500">*</span></label>
              <p className="text-sm text-gray-500 mb-2">Domestic and global pricing vary for each Size Feet</p>
              <button className="text-[13px] font-semibold text-blue-600 hover:underline mb-2">Edit in variations &rarr;</button>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-blue-600 mt-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                Estimated earnings: ₹ 14,293 to ₹ 358,381 &or;
              </div>
            </div>
            
            <div>
              <label className="font-semibold text-[15px] block mb-1">Quantity <span className="text-red-500">*</span></label>
              <input type="text" defaultValue="1" className="w-full max-w-sm p-3 border border-gray-300 rounded-lg text-sm" />
            </div>
            
            <button className="px-4 py-2 bg-gray-100 rounded-full font-semibold text-[13px] hover:bg-gray-200 flex items-center gap-2 w-max">
              <FiPlus /> Add SKU
            </button>
          </div>
        </div>



      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-[#E0E0E0] py-4 px-6 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1000px] mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-600">You have unsaved changes.</p>
          <div className="flex gap-3">
            <button onClick={closeEdit} className="px-6 py-2.5 bg-white border border-gray-300 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
              Cancel
            </button>
            <button onClick={() => save()} disabled={saving} className="px-6 py-2.5 bg-[#222] text-white rounded-full font-bold text-sm hover:bg-black transition-colors shadow-sm">
              {saving ? 'Publishing...' : 'Publish changes'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}
