import { useState, useEffect } from 'react';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api, { BASE_URL } from '../../api/axios';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

export default function RugShowcaseStrip() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products?limit=6').then(res => {
      setProducts(res.data.products);
    });
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-[#FAF8F5] overflow-hidden relative">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A84C]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-16 px-4">
        <p className="text-[#C9A84C] text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Curated Excellence</p>
        <h2 className="font-heading text-4xl sm:text-5xl text-[#111827]">Luxury Masterpieces</h2>
      </div>

      <div className="relative px-4">
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((p) => (
            <Link 
              key={p._id}
              to={`/product/${p._id}`}
              className="w-full sm:w-[280px]"
            >
              <div className="bg-white/90 backdrop-blur-[18px] border border-white/40 rounded-[22px] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_20px_50px_rgba(201,168,76,0.1)] group">
                {/* Product Image */}
                <div className="aspect-[4/5] rounded-[18px] overflow-hidden bg-gray-50 mb-5 relative">
                  <img 
                    src={getImageUrl(p.images?.[0])} 
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Luxury Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-[#111827] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-white/50 shadow-sm">
                      ✨ Luxury Pick
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-1">
                  <h3 className="font-heading text-base font-semibold text-[#111827] truncate group-hover:text-[#C9A84C] transition-colors">{p.name}</h3>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-black text-[#111827] tracking-tight">₹{(p.discountPrice || p.price).toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                        <FiStar className="fill-amber-400 text-amber-400" size={12} />
                        <span>4.9</span>
                      </div>
                    </div>
                    {p.discountPrice && (
                      <p className="text-[10px] text-gray-400 line-through font-medium">₹{p.price.toLocaleString('en-IN')}</p>
                    )}
                  </div>
                  <div className="pt-3 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:opacity-100 transition-opacity">
                    View Details <FiArrowRight />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
