import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
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
    p.delete('page');
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
      <div className="pt-20 min-h-screen">
        {/* Banner */}
        <div className="py-16 px-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 100%)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-2">Our Collection</p>
          <h1 className="font-luxury text-4xl md:text-5xl text-white mb-2">Shop All Rugs</h1>
          {search && <p className="text-amber-100/50 mt-2">Results for: <span className="text-amber-400">"{search}"</span></p>}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)} id="filter-toggle"
                className="flex items-center gap-2 btn-outline-gold py-2 px-4 text-xs">
                <FiFilter size={14} /> Filters {hasFilters && <span className="bg-amber-500 text-black rounded-full w-4 h-4 flex items-center justify-center text-xs">!</span>}
              </button>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
                  <FiX size={12} /> Clear All
                </button>
              )}
              <span className="text-amber-100/40 text-sm">{total} products</span>
            </div>
            <select value={sort} onChange={e => setParam('sort', e.target.value)}
              className="input-luxury w-auto text-sm py-2" id="sort-select">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: '#1a1008' }}>{o.label}</option>)}
            </select>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <motion.aside
              animate={{ width: showFilters ? '260px' : '0px', opacity: showFilters ? 1 : 0 }}
              className="flex-shrink-0 overflow-hidden hidden lg:block"
            >
              <div className="w-64 space-y-6 pr-4">
                <FilterSection title="Category">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" checked={!category} onChange={() => setParam('category', '')}
                        className="accent-amber-500" /> <span className="text-sm text-amber-100/70">All</span>
                    </label>
                    {categories.map(c => (
                      <label key={c._id} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="category" checked={category === c._id} onChange={() => setParam('category', c._id)}
                          className="accent-amber-500" />
                        <span className="text-sm text-amber-100/70 hover:text-amber-400 transition-colors">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Price Range">
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min ₹" value={minPrice} onChange={e => setParam('minPrice', e.target.value)}
                      className="input-luxury text-xs py-2 w-1/2" />
                    <input type="number" placeholder="Max ₹" value={maxPrice} onChange={e => setParam('maxPrice', e.target.value)}
                      className="input-luxury text-xs py-2 w-1/2" />
                  </div>
                </FilterSection>

                <FilterSection title="Color">
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setParam('color', color === c ? '' : c)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${color === c ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-amber-900/40 text-amber-100/50 hover:border-amber-700'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Type">
                  <div className="space-y-2">
                    {TYPES.map(t => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="type" checked={type === t} onChange={() => setParam('type', type === t ? '' : t)}
                          className="accent-amber-500" />
                        <span className="text-sm text-amber-100/70">{t}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </div>
            </motion.aside>

            {/* Products */}
            <div className="flex-1">
              {loading ? <Loader /> : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-luxury text-3xl text-amber-100/30 mb-4">No Products Found</p>
                  <button onClick={clearFilters} className="btn-outline-gold text-xs">Clear Filters</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                  </div>
                  {pages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      {[...Array(pages)].map((_, i) => (
                        <button key={i} onClick={() => setParam('page', i + 1)}
                          className={`w-10 h-10 rounded text-sm transition-all ${page === i + 1 ? 'bg-amber-500 text-black' : 'border border-amber-900/40 text-amber-100/50 hover:border-amber-500'}`}>
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
