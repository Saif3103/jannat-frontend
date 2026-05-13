import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiClock, FiShield, FiArrowRight } from 'react-icons/fi';
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

  // Determine button color based on product
  const isBespoke = product.name?.toLowerCase().includes('bespoke') || product.isBestSeller;
  const buyNowBg = isBespoke ? 'bg-[#C9A84C]' : 'bg-[#E31E24]';
  const buyNowText = isBespoke ? 'text-black' : 'text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <div className="bg-white rounded-[2rem] overflow-hidden border border-black/10 shadow-2xl transition-all duration-500 flex flex-col group/card h-full">
        {/* Horizontal Split */}
        <div className="flex flex-col sm:flex-row flex-1">
          {/* Left Side: Image Area */}
          <div className="relative w-full sm:w-[45%] h-[240px] sm:h-full overflow-hidden">
             <Link to={`/product/${product._id}`} className="h-full block">
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                />
             </Link>
             
             {/* Badges - Top Left of Image */}
             <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.isBestSeller && (
                   <span className="bg-[#1A1A1A] text-white text-[7px] font-bold px-2.5 py-1 rounded-md uppercase tracking-[0.2em] border border-white/10 shadow-lg">Best Seller</span>
                )}
                <span className="bg-[#00A699] text-white text-[7px] font-bold px-2.5 py-1 rounded-md uppercase tracking-[0.2em] shadow-lg">New</span>
             </div>
          </div>

          {/* Right Side: Info Area */}
          <div className="w-full sm:w-[55%] p-5 sm:p-7 flex flex-col relative">
             {/* Heart Icon - Top Right of Content */}
             <button 
                onClick={(e) => { e.preventDefault(); toggleWishlist(product._id, !!user); }}
                className={`absolute top-6 right-6 z-10 transition-all ${inWishlist ? 'text-red-500' : 'text-black/30 hover:text-black'}`}>
                <FiHeart size={22} fill={inWishlist ? 'currentColor' : 'none'} />
             </button>

             {/* Category */}
             <p className="text-[#C9A84C] text-[9px] font-bold uppercase tracking-[0.4em] mb-2">{product.category?.name || 'Modern Collection'}</p>
             
             {/* Title */}
             <Link to={`/product/${product._id}`}>
                <h3 className="text-[#1A1A1A] font-bold text-xl sm:text-2xl mb-3 leading-tight group-hover/card:text-[#C9A84C] transition-colors">{product.name}</h3>
             </Link>
             
             {/* Rating */}
             <div className="flex items-center gap-2 mb-5">
                <div className="flex text-amber-500">
                   {[...Array(5)].map((_, i) => <FiStar key={i} size={12} fill="currentColor" />)}
                </div>
                <span className="text-[11px] text-black/60 font-bold">4.8 (128)</span>
             </div>

             {/* Price */}
             <div className="mb-6">
                <p className="text-[#1A1A1A] text-3xl font-bold tracking-tight">₹{price?.toLocaleString()}</p>
                <p className="text-[10px] text-black/30 uppercase tracking-widest mt-1">Inclusive of all taxes</p>
             </div>

             {/* Detailed Specs Icons */}
             <div className="grid grid-cols-4 gap-1 mb-8 pt-4 border-t border-black/5">
                <div className="flex flex-col items-center">
                   <div className="text-[#C9A84C] mb-1.5"><FiGrid size={14}/></div>
                   <span className="text-[7px] text-black/40 uppercase font-medium text-center leading-tight">Hand Knotted</span>
                </div>
                <div className="flex flex-col items-center">
                   <div className="text-[#C9A84C] mb-1.5"><FiFeather size={14}/></div>
                   <span className="text-[7px] text-black/40 uppercase font-medium text-center leading-tight">Premium Wool</span>
                </div>
                <div className="flex flex-col items-center">
                   <div className="text-[#C9A84C] mb-1.5"><FiShield size={14}/></div>
                   <span className="text-[7px] text-black/40 uppercase font-medium text-center leading-tight">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center">
                   <div className="text-[#C9A84C] mb-1.5"><FiClock size={14}/></div>
                   <span className="text-[7px] text-black/40 uppercase font-medium text-center leading-tight">7-Day Return</span>
                </div>
             </div>

             {/* Redesigned Offer Box */}
             <div className="mt-auto border border-[#E31E24]/30 rounded-2xl p-4 flex items-center justify-between bg-[#E31E24]/10">
                <div>
                   <p className="text-[8px] text-[#B69640] font-extrabold uppercase tracking-[0.2em] mb-1">Limited Time Offer</p>
                   <p className="text-[#E31E24] text-sm font-black uppercase">Flat {discount || '15'}% OFF</p>
                </div>
                <div className="bg-[#E31E24] text-white px-4 py-2.5 rounded-xl text-[9px] font-bold tracking-widest uppercase shadow-lg shadow-red-900/10 active:scale-95 transition-transform cursor-pointer">
                   Use Code: JANNAT{discount || '15'}
                </div>
             </div>
          </div>
        </div>

        {/* Action Buttons Area */}
        <div className="flex p-4 gap-3 bg-white border-t border-black/5">
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); toast.success('Added to bag'); }}
             className="flex-1 py-4.5 rounded-2xl flex items-center justify-center gap-3 text-black font-bold text-[10px] sm:text-xs tracking-[0.2em] border border-black/10 hover:bg-black/5 transition-all uppercase">
             <FiShoppingCart size={18}/> Add to Cart
           </button>
           <button 
             onClick={handleBuyNow}
             className={`flex-1 py-4.5 rounded-2xl flex items-center justify-center gap-3 ${buyNowBg} ${buyNowText} font-bold text-[10px] sm:text-xs tracking-[0.2em] hover:opacity-90 transition-all shadow-xl uppercase`}>
             Buy Now <FiArrowRight size={18}/>
           </button>
        </div>
      </div>
    </motion.div>
  );
}

// Icon Helpers
const FiGrid = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const FiFeather = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>;
