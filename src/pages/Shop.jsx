import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiShoppingBag } from 'react-icons/fi';
import api from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

const COLORS = ['Red', 'Blue', 'Green', 'Beige', 'Brown', 'Gold', 'Black', 'White', 'Multi'];
const TYPES = ['Handmade', 'Machine Made', 'Hand-Tufted', 'Hand-Knotted', 'Modern'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const sort = searchParams.get('sort') || 'newest';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const color = searchParams.get('color') || '';
  const type = searchParams.get('type') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, sort, limit: 12, ...(category && { category }), ...(minPrice && { minPrice }), ...(maxPrice && { maxPrice }), ...(color && { color }), ...(type && { type }), ...(search && { search }) });
    api.get(`/products?${params}`).then(r => {
      setProducts(r.data.products);
      setTotal(r.data.total);
      setPages(r.data.pages);
    }).finally(() => setLoading(false));
  }, [searchParams]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    // Reset to page 1 only if we are applying a new filter/sort, not when paginating
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = category || minPrice || maxPrice || color || type;

  return (
    <>
      <Helmet>
        <title>Shop Luxury Carpets | Jannat Rugs Co.</title>
        <meta name="description" content="Browse our full collection of handmade luxury carpets, Persian rugs, and premium floor coverings." />
      </Helmet>
    <div className="pt-24 min-h-screen bg-white">
      <Helmet>
        <title>Shop Luxury Carpets | Jannat Rugs Co.</title>
        <meta name="description" content="Browse our full collection of handmade luxury carpets, Persian rugs, and premium floor coverings." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.4em] mb-4">Our Collection</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">Artisanal Masterpieces</h1>
              <p className="text-gray-400 text-sm max-w-xl font-medium">Explore our curated gallery of hand-knotted treasures, each carrying a legacy of centuries-old craftsmanship.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Available Pieces</p>
                <p className="text-sm font-bold text-gray-900">{total} Collections</p>
              </div>
              <select 
                value={sort} 
                onChange={e => setParam('sort', e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Toolbar & Filters Toggle */}
        <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-gray-100">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition-all ${showFilters ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <FiFilter size={16} /> 
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasFilters && <span className="ml-1 w-2 h-2 bg-[#C9A84C] rounded-full" />}
          </button>
          
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">
              Clear All Filters
            </button>
          )}

          {/* Active Tags */}
          <div className="flex flex-wrap gap-2 ml-auto">
             {category && (
               <div className="bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                 Category: {categories.find(c => c._id === category)?.name}
                 <FiX className="cursor-pointer" onClick={() => setParam('category', '')} />
               </div>
             )}
             {color && (
               <div className="bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                 Color: {color}
                 <FiX className="cursor-pointer" onClick={() => setParam('color', '')} />
               </div>
             )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full lg:w-72 space-y-8 lg:sticky lg:top-32 h-fit"
              >
                <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
                  <FilterSection title="Categories">
                    <div className="flex flex-col gap-3 pt-2">
                      <button 
                        onClick={() => setParam('category', '')}
                        className={`text-left text-sm font-bold transition-all ${!category ? 'text-[#C9A84C]' : 'text-gray-400 hover:text-gray-900'}`}
                      >
                        All Categories
                      </button>
                      {categories.map(c => (
                        <button 
                          key={c._id}
                          onClick={() => setParam('category', c._id)}
                          className={`text-left text-sm font-bold transition-all ${category === c._id ? 'text-[#C9A84C]' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Price Range">
                    <div className="flex gap-3 pt-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">₹</span>
                        <input 
                          type="number" 
                          placeholder="Min" 
                          value={minPrice} 
                          onChange={e => setParam('minPrice', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-6 pr-2 py-2 text-xs font-bold outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">₹</span>
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={maxPrice} 
                          onChange={e => setParam('maxPrice', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-6 pr-2 py-2 text-xs font-bold outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                    </div>
                  </FilterSection>

                  <FilterSection title="Color Palette">
                    <div className="flex flex-wrap gap-2 pt-2">
                      {COLORS.map(c => (
                        <button 
                          key={c}
                          onClick={() => setParam('color', color === c ? '' : c)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${color === c ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Craft Type">
                    <div className="flex flex-col gap-3 pt-2">
                      {TYPES.map(t => (
                        <label key={t} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={type === t} 
                            onChange={() => setParam('type', type === t ? '' : t)}
                            className="w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]" 
                          />
                          <span className={`text-sm font-bold transition-all ${type === t ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>{t}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <div key={i} className="h-[400px] bg-gray-50 rounded-[2.5rem] shimmer" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                <FiShoppingBag className="mx-auto text-gray-200 mb-6" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No masterpieces found</h3>
                <p className="text-gray-400 text-sm mb-8">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="bg-black text-white px-8 py-3 rounded-2xl font-bold text-sm">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((p, i) => (
                    <ProductCard key={p._id} product={p} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-20">
                    {[...Array(pages)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setParam('page', i + 1)}
                        className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${page === i + 1 ? 'bg-black text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-amber-900/20 pb-5">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-3">
        <h3 className="text-amber-400 text-xs tracking-widest uppercase font-medium">{title}</h3>
        <motion.span animate={{ rotate: open ? 180 : 0 }}><FiChevronDown size={14} className="text-amber-100/40" /></motion.span>
      </button>
      <motion.div animate={{ height: open ? 'auto' : 0, overflow: 'hidden' }}>{children}</motion.div>
    </div>
  );
}
