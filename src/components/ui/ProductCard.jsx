import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiArrowRight } from 'react-icons/fi';
import { useCartStore, useAuthStore, useWishlistStore } from '../../store';
import { BASE_URL } from '../../api/axios';
import toast from 'react-hot-toast';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400';
  if (typeof url !== 'string') return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  const price = product.discountPrice || product.price;
  const discount = product.price && product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const inWishlist = isInWishlist(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group h-full"
    >
      <div className="bg-white rounded-[2rem] overflow-hidden border border-black/[0.08] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative group/card">
        
        {/* Image Area - Vertical Layout */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
           <Link to={`/product/${product._id}`} className="h-full block">
              <img
                src={getImageUrl(product.images?.[0])}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
              />
           </Link>
           
           {/* Floating Badges */}
           <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.isBestSeller && (
                 <span className="bg-black text-white text-[8px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Best Seller</span>
              )}
              {discount > 0 && (
                <span className="bg-[#E31E24] text-white text-[8px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">-{discount}% OFF</span>
              )}
           </div>

           {/* Wishlist Button */}
           <button 
              onClick={(e) => { e.preventDefault(); toggleWishlist(product._id, !!user); }}
              className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all shadow-md ${inWishlist ? 'text-red-500' : 'text-black/30 hover:text-black'}`}>
              <FiHeart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
           </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 flex flex-col flex-1 text-center">
           {/* Category */}
           <p className="text-black/40 text-[9px] font-bold uppercase tracking-[0.3em] mb-3">{product.category?.name || 'Modern Collection'}</p>
           
           {/* Title */}
           <Link to={`/product/${product._id}`}>
              <h3 className="font-luxury text-xl sm:text-2xl text-[#1A1A1A] mb-3 leading-tight group-hover/card:text-black transition-colors">{product.name}</h3>
           </Link>
           
           {/* Rating */}
           <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex text-amber-500">
                 {[...Array(5)].map((_, i) => <FiStar key={i} size={12} fill="currentColor" />)}
              </div>
              <span className="text-[10px] text-black/30 font-bold uppercase tracking-widest">4.8 (128)</span>
           </div>

           {/* Price */}
           <div className="mb-8 mt-auto">
              <p className="text-[#1A1A1A] text-3xl font-bold tracking-tight">₹{price?.toLocaleString()}</p>
              <p className="text-[9px] text-black/20 uppercase tracking-[0.2em] mt-1 font-bold">Inclusive of all taxes</p>
           </div>

           {/* Minimal Specs icons */}
           <div className="flex items-center justify-center gap-6 mb-8 pt-6 border-t border-black/[0.05]">
              <div className="group/spec relative cursor-help">
                 <FiGrid size={16} className="text-black/30 group-hover/spec:text-black transition-colors" />
                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover/spec:opacity-100 transition-opacity whitespace-nowrap">Hand Knotted</span>
              </div>
              <div className="group/spec relative cursor-help">
                 <FiFeather size={16} className="text-black/30 group-hover/spec:text-black transition-colors" />
                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover/spec:opacity-100 transition-opacity whitespace-nowrap">Premium Wool</span>
              </div>
              <div className="group/spec relative cursor-help">
                 <FiShield size={16} className="text-black/30 group-hover/spec:text-black transition-colors" />
                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover/spec:opacity-100 transition-opacity whitespace-nowrap">100% Genuine</span>
              </div>
           </div>

           {/* Buttons Area */}
           <div className="grid grid-cols-1 gap-3 mt-auto">
              <button 
                onClick={handleBuyNow}
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-[11px] tracking-[0.2em] hover:bg-black transition-all shadow-lg active:scale-95 uppercase">
                BUY NOW <FiArrowRight size={16}/>
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); toast.success('Added to bag'); }}
                className="w-full bg-white text-black py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-[11px] tracking-[0.2em] border border-black/10 hover:bg-black/5 transition-all uppercase">
                <FiShoppingCart size={16}/> Add to Bag
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

// Icon Helpers
const FiGrid = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const FiFeather = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>;
const FiShield = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
