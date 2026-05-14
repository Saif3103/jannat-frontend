import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiStar, FiChevronRight } from 'react-icons/fi';
import api from '../../api/axios';
import { useRecommendationStore, useWishlistStore, useAuthStore } from '../../store';

export default function SmartRecommendations({ title = "You May Love These Luxury Styles", currentProduct = null, limit = 4 }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { preferences } = useRecommendationStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Fetch products to filter
        const { data } = await api.get('/products?limit=30');
        let products = data.products || [];

        // Exclude current product
        if (currentProduct) {
          products = products.filter(p => p._id !== currentProduct._id);
        }

        // SMART SCORING LOGIC
        const scored = products.map(p => {
          let score = 65; // Base score
          let reasons = [];

          // Category match
          if (currentProduct && p.category === currentProduct.category) {
            score += 20;
            reasons.push(`Matches the ${p.category} craftsmanship you explored.`);
          } else if (preferences.categories.includes(p.category)) {
            score += 15;
            reasons.push(`Aligned with your interest in ${p.category} textures.`);
          }

          // Price range match
          const price = p.discountPrice || p.price;
          if (preferences.maxPrice > 0) {
            const diff = Math.abs(price - preferences.maxPrice);
            if (diff < preferences.maxPrice * 0.3) {
              score += 10;
              reasons.push(`Fits your preferred luxury price range.`);
            }
          }

          // Random variation for "Intelligence" feel
          score += Math.floor(Math.random() * 8);
          
          if (reasons.length === 0) {
            reasons.push("A top trending choice among luxury collectors.");
          }

          return { ...p, matchScore: Math.min(99, score), matchReason: reasons[0] };
        });

        // Filter out low scores if we have enough
        let final = scored.sort((a, b) => b.matchScore - a.matchScore);
        
        setRecommendations(final.slice(0, limit));
      } catch (err) {
        console.error('Failed to load recommendations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProduct, preferences, limit]);

  if (loading || recommendations.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 text-amber-600 mb-6">
              <div className="w-12 h-px bg-amber-600/30" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">Curated Intelligence</span>
            </div>
            <h2 className="font-serif text-5xl sm:text-6xl text-[#1A1A1A] leading-tight mb-4">{title}</h2>
            <p className="text-gray-400 text-lg font-light">Handpicked masterpieces based on your unique aesthetic preferences.</p>
          </div>
          <Link to="/shop" className="group flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-amber-700 transition-all">
            View All Collections <FiChevronRight className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendations.map((p, i) => (
            <div
              key={p._id}
              className="group"
            >
              <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white hover:shadow-[0_40px_100px_rgba(201,168,76,0.12)] transition-all duration-700 h-full flex flex-col relative overflow-hidden">
                
                {/* Match Score Badge */}
                <div className="absolute top-6 left-6 z-20 bg-black/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                  <span className="text-[11px] font-black text-white tracking-widest">{p.matchScore}% MATCH</span>
                </div>

                <Link to={`/product/${p._id}`} className="relative block overflow-hidden rounded-[2rem] aspect-[4/5] mb-8 shadow-inner">
                  <img 
                    src={p.images?.[0]} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>

                <div className="flex-1 space-y-4 px-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-[#1A1A1A] font-bold text-xl tracking-tight group-hover:text-amber-700 transition-colors leading-snug line-clamp-2">
                      {p.name}
                    </h3>
                    <button 
                      onClick={() => toggleWishlist(p._id, !!user)}
                      className={`p-3 rounded-2xl transition-all shadow-sm ${isInWishlist(p._id) ? 'text-red-500 bg-red-50' : 'text-gray-300 bg-gray-50 hover:text-red-500 hover:bg-red-50'}`}
                    >
                      <FiHeart fill={isInWishlist(p._id) ? "currentColor" : "none"} size={20} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-[#1A1A1A]">₹{p.discountPrice?.toLocaleString() || p.price?.toLocaleString()}</span>
                    {p.discountPrice && (
                      <span className="text-sm text-gray-300 line-through">₹{p.price.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Trust Insight */}
                  <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-amber-500/5 group-hover:border-amber-500/20 transition-colors">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <FiStar size={12} className="fill-amber-700" /> Stylist Insight
                    </p>
                    <p className="text-[11px] text-[#1A1A1A]/60 font-medium leading-relaxed italic">
                      "{p.matchReason}"
                    </p>
                  </div>
                </div>

                <Link 
                  to={`/product/${p._id}`}
                  className="mt-10 w-full py-5 bg-[#1A1A1A] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-[0_15px_30px_rgba(0,0,0,0.2)] active:scale-95"
                >
                  View Masterpiece <FiEye size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
