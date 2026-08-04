import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCartStore, useAuthStore, useWishlistStore } from '../../store';
import { BASE_URL } from '../../api/axios';
import toast from 'react-hot-toast';

// Robust Cloudinary optimizer — works with ANY cloud name, not hardcoded
const optimizeCloudinaryUrl = (url, width = 400) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.includes('/upload/q_auto')) return url; // already optimized
  // Insert transformations right after /upload/
  return url.replace('/upload/', `/upload/q_auto:eco,f_auto,w_${width},c_fill/`);
};

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&q=60';
  if (typeof url !== 'string') return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&q=60';
  if (url.startsWith('http')) return optimizeCloudinaryUrl(url, 400);
  return `${BASE_URL}/${url}`;
};

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

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
  // First 4 products load eagerly for better LCP (Largest Contentful Paint)
  const isAboveFold = index < 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group h-full"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">

        {/* Image with shimmer skeleton */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 flex-shrink-0">
          {/* Shimmer placeholder — hidden once image loads */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
          )}

          <Link to={`/product/${product._id}`} className="block h-full">
            <img
              src={getImageUrl(product.images?.[0])}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading={isAboveFold ? 'eager' : 'lazy'}
              fetchPriority={isAboveFold ? 'high' : 'low'}
              decoding="async"
              onLoad={() => setImgLoaded(true)}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.isBestSeller && (
              <span className="bg-black text-white text-[7px] sm:text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow">
                Best Seller
              </span>
            )}
            {discount > 0 && (
              <span className="bg-[#E31E24] text-white text-[7px] sm:text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product._id, !!user); }}
            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all shadow ${inWishlist ? 'text-red-500' : 'text-black/30 hover:text-black'}`}
          >
            <FiHeart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 gap-0 text-left">
          <p className="text-black/35 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2">
            {product.category?.name || 'Collection'}
          </p>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-serif text-[13px] sm:text-[15px] text-[#1A1A1A] mb-2.5 leading-snug line-clamp-2 hover:text-black transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={10} fill="currentColor" />
              ))}
            </div>
            <span className="text-[9px] text-black/30 font-semibold">(128)</span>
          </div>

          <div className="mt-auto pt-3 border-t border-black/[0.05]">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[#1A1A1A] text-base sm:text-lg font-black tracking-tight">
                ₹{price?.toLocaleString('en-IN')}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-black/30 line-through font-medium">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); toast.success('Added to bag'); }}
                className="flex-1 bg-[#1A1A1A] text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-[10px] sm:text-[11px] tracking-widest hover:bg-black transition-all active:scale-95 uppercase cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50"
              >
                <FiShoppingCart size={13} /> Add
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-[#C9A84C] to-[#B69640] text-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 font-bold text-[10px] sm:text-[11px] tracking-widest hover:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all active:scale-95 uppercase border border-[#B69640]/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
