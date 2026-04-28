import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCartStore, useAuthStore, useWishlistStore } from '../../store';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

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
      className="product-card group"
    >
      <div className="glass-card overflow-hidden h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {discount > 0 && (
              <span className="badge-gold text-xs">-{discount}%</span>
            )}
            {product.isBestSeller && (
              <span className="bg-amber-800 text-amber-100 text-xs px-2 py-0.5 rounded font-medium tracking-wide">Best Seller</span>
            )}
            {product.isNewArrival && (
              <span className="bg-emerald-900 text-emerald-300 text-xs px-2 py-0.5 rounded font-medium tracking-wide">New</span>
            )}
            {product.offerLabel && (
              <span className="bg-rose-900 text-rose-300 text-xs px-2 py-0.5 rounded font-medium tracking-wide">{product.offerLabel}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleWishlist(product._id, !!user)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${inWishlist ? 'bg-amber-500 text-black' : 'bg-black/40 text-white hover:bg-amber-500/20 hover:text-amber-400'}`}
              id={`wishlist-${product._id}`}
            >
              <FiHeart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
            </motion.button>

            <Link to={`/product/${product._id}`}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-amber-500/20 hover:text-amber-400 transition-colors">
              <FiEye size={15} />
            </Link>
          </div>

          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => addToCart(product, 1)}
              className="w-full btn-gold py-2.5 text-xs flex items-center justify-center gap-2"
              id={`add-cart-${product._id}`}
            >
              <FiShoppingCart size={14} /> Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1 items-center text-center">
          <Link to={`/product/${product._id}`} className="hover:text-amber-400 transition-colors">
            <h3 className="font-luxury text-amber-100 text-base leading-snug mb-1 line-clamp-2 tracking-wide">
              {product.name}
            </h3>
          </Link>

          {/* Category */}
          {product.category && (
            <span className="text-xs text-amber-100/40 mb-2 uppercase tracking-widest">
              {product.category.name}
            </span>
          )}

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={11}
                  className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-amber-900'}
                  fill={i < Math.round(product.rating) ? 'currentColor' : 'none'}
                />
              ))}
              <span className="text-xs text-amber-100/40 ml-1">({product.numReviews})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-center gap-3 mt-auto">
            <span className="text-amber-400 font-bold text-lg">₹{price?.toLocaleString()}</span>
            {discount > 0 && (
              <span className="text-amber-100/30 text-sm line-through">₹{product.price?.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
