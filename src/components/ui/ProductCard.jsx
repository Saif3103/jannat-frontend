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
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/5] bg-gray-50">
          <Link to={`/product/${product._id}`}>
            <img
              src={getImageUrl(product.images?.[0])}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
          </Link>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {discount > 0 && (
              <span className="bg-[#C9A84C] text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">-{discount}%</span>
            )}
            {product.isBestSeller && (
              <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg uppercase tracking-wider">Best Seller</span>
            )}
            {product.isNewArrival && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg uppercase tracking-wider">New</span>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-4 right-4 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleWishlist(product._id, !!user)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg transition-all ${inWishlist ? 'bg-[#C9A84C] text-white' : 'bg-white/90 text-gray-400 hover:text-[#C9A84C]'}`}
              id={`wishlist-${product._id}`}
            >
              <FiHeart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            </motion.button>
          </div>

          {/* Quick View Button (Desktop only) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-500">
               <FiEye size={24} className="text-white" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] truncate">
              {product.category?.name || 'Handmade Luxury'}
            </span>
            {product.numReviews > 0 && (
              <div className="flex items-center gap-1">
                <FiStar size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-bold text-gray-400">({product.numReviews})</span>
              </div>
            )}
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="text-gray-900 font-bold text-lg mb-4 line-clamp-1 group-hover:text-[#C9A84C] transition-colors tracking-tight">
              {product.name}
            </h3>
          </Link>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through mb-1">₹{product.price?.toLocaleString()}</span>
              )}
              <span className="text-xl font-bold text-gray-900">₹{price?.toLocaleString()}</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); toast.success('Added to cart'); }}
                className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
                id={`add-cart-${product._id}`}
                title="Add to Cart"
              >
                <FiShoppingCart size={18} />
              </button>
              <button
                onClick={handleBuyNow}
                className="px-4 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-[10px] tracking-widest hover:bg-gray-900 transition-all shadow-lg active:scale-95"
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
