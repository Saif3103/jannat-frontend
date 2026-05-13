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
      if (r?.data?.products) setProducts(r.data.products);
      if (r?.data?.total !== undefined) setTotal(r.data.total);
      if (r?.data?.pages !== undefined) setPages(r.data.pages);
    }).catch(err => {
      console.error('Failed to load products:', err);
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
    <div className="pt-24 min-h-screen">
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
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight mb-4 font-luxury">Artisanal Masterpieces</h1>
              <p className="text-black/40 text-sm max-w-xl font-medium">Explore our curated gallery of hand-knotted treasures, each carrying a legacy of centuries-old craftsmanship.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-bold text-amber-100/30 uppercase tracking-widest mb-1">Available Pieces</p>
                <p className="text-sm font-bold text-white">{total} Collections</p>
              </div>
              <select 
                value={sort} 
                onChange={e => setParam('sort', e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-4 focus:ring-[#C9A84C]/10 transition-all outline-none"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-black text-white">{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Toolbar & Filters Toggle */}
        <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-amber-900/10">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition-all ${showFilters ? 'bg-[#C9A84C] text-black' : 'bg-white/5 text-amber-100/60 hover:bg-white/10'}`}
          >
            <FiFilter size={16} /> 
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasFilters && <span className="ml-1 w-2 h-2 bg-[#C9A84C] rounded-full" />}
          </button>
          
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors">
              Clear All Filters
            </button>
          )}

          {/* Active Tags */}
          <div className="flex flex-wrap gap-2 ml-auto">
             {category && (
               <div className="bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border border-[#C9A84C]/20">
                 Category: {categories.find(c => c._id === category)?.name}
                 <FiX className="cursor-pointer" onClick={() => setParam('category', '')} />
               </div>
             )}
             {color && (
               <div className="bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border border-[#C9A84C]/20">
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
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-amber-900/10">
                  <FilterSection title="Categories">
                    <div className="flex flex-col gap-3 pt-2">
                      <button 
                         onClick={() => setParam('category', '')}
                         className={`text-left text-sm font-bold transition-all ${!category ? 'text-[#C9A84C]' : 'text-amber-100/40 hover:text-white'}`}
                      >
                        All Categories
                      </button>
                      {categories.map(c => (
                        <button 
                          key={c._id}
                          onClick={() => setParam('category', c._id)}
                          className={`text-left text-sm font-bold transition-all ${category === c._id ? 'text-[#C9A84C]' : 'text-amber-100/40 hover:text-white'}`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  <FilterSection title="Price Range">
                    <div className="flex gap-3 pt-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-100/20 text-[10px] font-bold">₹</span>
                        <input 
                          type="number" 
                          placeholder="Min" 
                          value={minPrice} 
                          onChange={e => setParam('minPrice', e.target.value)}
                          className="w-full bg-black/40 border border-amber-900/10 rounded-xl pl-6 pr-2 py-2 text-xs font-bold text-white outline-none focus:border-[#C9A84C]/50"
                        />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-100/20 text-[10px] font-bold">₹</span>
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={maxPrice} 
                          onChange={e => setParam('maxPrice', e.target.value)}
                          className="w-full bg-black/40 border border-amber-900/10 rounded-xl pl-6 pr-2 py-2 text-xs font-bold text-white outline-none focus:border-[#C9A84C]/50"
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
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${color === c ? 'bg-[#C9A84C] text-black' : 'bg-black/40 text-amber-100/40 border border-amber-900/10 hover:border-amber-900/30'}`}
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
                            className="w-4 h-4 rounded border-amber-900/30 bg-black text-[#C9A84C] focus:ring-[#C9A84C]" 
                          />
                          <span className={`text-sm font-bold transition-all ${type === t ? 'text-white' : 'text-amber-100/40 group-hover:text-amber-100/60'}`}>{t}</span>
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
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-8">
                {[...Array(6)].map((_, i) => <div key={i} className="h-[300px] sm:h-[400px] bg-white/5 rounded-2xl sm:rounded-[2.5rem] animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-amber-900/20">
                <FiShoppingBag className="mx-auto text-amber-900/20 mb-6" size={48} />
                <h3 className="text-xl font-bold text-white mb-2 font-luxury">No masterpieces found</h3>
                <p className="text-amber-100/30 text-sm mb-8">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="btn-gold px-8 py-3 rounded-2xl font-bold text-sm">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-8">
                  {products.map((p, i) => (
                    <ProductCard key={p._id} product={p} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-20">
                    {[...Array(Math.max(0, Number(pages) || 0))].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setParam('page', i + 1)}
                        className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all ${page === i + 1 ? 'bg-[#C9A84C] text-black shadow-xl shadow-[#C9A84C]/20' : 'bg-white/5 text-amber-100/40 hover:bg-white/10'}`}
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
