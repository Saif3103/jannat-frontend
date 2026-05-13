import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiEye, FiClock, FiShield, FiTruck } from 'react-icons/fi';
import { GiRugbyConversion as LuRug } from 'react-icons/gi';
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <div className="bg-[#0A0A0A] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl hover:border-amber-500/20 transition-all duration-500 flex flex-col group/card h-full">
        {/* Top Section: Horizontal Layout */}
        <div className="flex flex-col sm:flex-row flex-1">
          {/* Left: Image */}
          <div className="relative w-full sm:w-[45%] aspect-square sm:aspect-auto sm:h-full overflow-hidden">
             <Link to={`/product/${product._id}`} className="h-full block">
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover/card:bg-transparent transition-colors duration-500" />
             </Link>
             
             {/* Badges */}
             <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestSeller && (
                   <span className="bg-[#E31E24] text-white text-[8px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-xl">Best Seller</span>
                )}
                <span className="bg-[#00A699] text-white text-[8px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-xl">New</span>
             </div>

             {/* Heart Icon */}
             <button 
                onClick={(e) => { e.preventDefault(); toggleWishlist(product._id, !!user); }}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/20 backdrop-blur-md border border-white/10 ${inWishlist ? 'text-red-500' : 'text-white/40 hover:text-white'}`}>
                <FiHeart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
             </button>
          </div>

          {/* Right: Content */}
          <div className="w-full sm:w-[55%] p-4 sm:p-6 flex flex-col bg-black">
             <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.3em] mb-2">{product.category?.name || 'Modern Collection'}</p>
             <Link to={`/product/${product._id}`}>
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2 line-clamp-1 group-hover/card:text-[#C9A84C] transition-colors">{product.name}</h3>
             </Link>
             
             <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                   {[...Array(5)].map((_, i) => <FiStar key={i} size={10} fill="currentColor" />)}
                </div>
                <span className="text-[10px] text-white font-bold">4.8 (128)</span>
             </div>

             <div className="mb-4">
                <p className="text-white text-2xl font-bold">₹{price?.toLocaleString()}</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">Inclusive of all taxes</p>
             </div>

             {/* Icons Grid */}
             <div className="grid grid-cols-4 gap-2 mb-6 border-t border-white/5 pt-4">
                <div className="flex flex-col items-center"><FiGrid size={14} className="text-[#C9A84C] mb-1"/><span className="text-[7px] text-white/40 uppercase text-center leading-tight">Hand Knotted</span></div>
                <div className="flex flex-col items-center"><LuRug size={14} className="text-[#C9A84C] mb-1"/><span className="text-[7px] text-white/40 uppercase text-center leading-tight">Premium Wool</span></div>
                <div className="flex flex-col items-center"><FiShield size={14} className="text-[#C9A84C] mb-1"/><span className="text-[7px] text-white/40 uppercase text-center leading-tight">Secure Payment</span></div>
                <div className="flex flex-col items-center"><FiClock size={14} className="text-[#C9A84C] mb-1"/><span className="text-[7px] text-white/40 uppercase text-center leading-tight">7-Day Return</span></div>
             </div>

             {/* Offer Box */}
             <div className="mt-auto border border-[#E31E24]/30 rounded-2xl p-3 flex items-center justify-between bg-[#E31E24]/5">
                <div>
                   <p className="text-[8px] text-[#C9A84C] font-bold uppercase tracking-widest mb-1">Limited Time Offer</p>
                   <p className="text-[#E31E24] text-xs font-bold uppercase">Flat {discount || '15'}% OFF</p>
                </div>
                <div className="bg-[#E31E24] text-white px-3 py-2 rounded-xl text-[8px] font-bold tracking-widest uppercase">
                   Use Code: JANNAT15
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex border-t border-white/10">
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); toast.success('Added to bag'); }}
             className="flex-1 py-4 flex items-center justify-center gap-3 text-white font-bold text-[10px] sm:text-xs tracking-widest border-r border-white/10 hover:bg-white/5 transition-all">
             <FiShoppingCart size={16}/> ADD TO CART
           </button>
           <button 
             onClick={handleBuyNow}
             className="flex-1 py-4 flex items-center justify-center gap-3 bg-[#C9A84C] text-black font-bold text-[10px] sm:text-xs tracking-widest hover:bg-amber-400 transition-all">
             BUY NOW <FiArrowRight size={16}/>
           </button>
        </div>
      </div>
    </motion.div>
  );
}

// Icon helpers
const FiGrid = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const FiArrowRight = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
