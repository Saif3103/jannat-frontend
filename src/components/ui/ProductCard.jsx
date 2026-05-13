import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCartStore, useAuthStore, useWishlistStore } from '../../store';
import { BASE_URL } from '../../api/axios';

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

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}/${url}`;
  };

  const price = product.discountPrice || product.price;
  const discount = product.price && product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const inWishlist = isInWishlist(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <div className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 h-full flex flex-col group/card">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/5] bg-[#222]">
          <Link to={`/product/${product._id}`}>
            <img
              src={getImageUrl(product.images?.[0])}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
              loading="lazy"
            />
            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors duration-500" />
          </Link>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <span className="bg-[#C9A84C] text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">-{discount}%</span>
            )}
            {product.isBestSeller && (
              <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg uppercase tracking-wider border border-white/10">Best Seller</span>
            )}
            {product.isNewArrival && (
              <span className="bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg uppercase tracking-wider border border-white/10">New</span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-4 right-4 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleWishlist(product._id, !!user)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg transition-all ${inWishlist ? 'bg-[#C9A84C] text-white' : 'bg-black/30 text-white hover:text-[#C9A84C]'}`}
              id={`wishlist-${product._id}`}
            >
              <FiHeart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            </motion.button>
          </div>

          {/* Quick View Button (Desktop only) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20 transform scale-90 group-hover/card:scale-100 transition-transform duration-500">
               <FiEye size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-6 flex flex-col flex-1">
          <div className="mb-1 sm:mb-2 flex items-center justify-between gap-2">
            <span className="text-[8px] sm:text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] truncate">
              {product.category?.name || 'Handmade Luxury'}
            </span>
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1">
                <FiStar size={10} className="text-[#C9A84C] fill-[#C9A84C] sm:w-3 sm:h-3" />
                <span className="text-[9px] sm:text-[11px] font-bold text-amber-100/40">({product.numReviews})</span>
              </div>
            )}
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="text-white font-bold text-sm sm:text-lg mb-2 sm:mb-4 line-clamp-1 group-hover/card:text-[#C9A84C] transition-colors tracking-tight">
              {product.name}
            </h3>
          </Link>

          <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col">
              {discount > 0 && (
                <span className="text-[10px] sm:text-xs text-amber-100/20 line-through mb-0 sm:mb-1">₹{(Number(product.price) || 0).toLocaleString()}</span>
              )}
              <span className="text-base sm:text-xl font-bold text-white tracking-tight">₹{(Number(price) || 0).toLocaleString()}</span>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); }}
                className="flex-1 sm:w-12 sm:h-12 h-10 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-sm"
                id={`add-cart-${product._id}`}
                title="Add to Cart"
              >
                <FiShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-[2] sm:px-6 sm:h-12 h-10 bg-[#E31E24] text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-[9px] sm:text-[11px] tracking-[0.1em] hover:bg-[#ff242b] transition-all shadow-xl shadow-[#E31E24]/20 active:scale-95 whitespace-nowrap"
                id={`buy-now-${product._id}`}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
