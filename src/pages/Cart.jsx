import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import { useCartStore, useAuthStore } from '../store';
import { BASE_URL } from '../api/axios';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=200';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const subtotal = items.reduce((a, i) => a + ((i.discountPrice || i.price) * i.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 299;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <>
      <Helmet>
        <title>My Cart | Jannat Rugs Co.</title>
      </Helmet>
      <div className="pt-20 sm:pt-24 min-h-screen max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="font-luxury text-3xl sm:text-4xl text-white">Shopping Cart</h1>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-xs sm:text-sm text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1">
              <FiTrash2 size={12} className="sm:w-3.5 sm:h-3.5" /> Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 sm:py-24">
            <FiShoppingCart size={48} className="text-[#1A1A1A]/30 mx-auto mb-6 sm:w-16 sm:h-16" />
            <h2 className="font-luxury text-2xl sm:text-3xl text-[#1A1A1A]/30 mb-4">Your Cart is Empty</h2>
            <p className="text-[#1A1A1A]/20 text-sm mb-8">Discover our luxury carpet collection today.</p>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2 py-3 px-6 text-xs sm:text-sm">
              <FiArrowLeft size={14} /> Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div key={`${item._id}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-3 sm:p-4 flex gap-3 sm:gap-4">
                  <Link to={`/product/${item._id}`} className="flex-shrink-0">
                    <img src={getImageUrl(item.images?.[0])}
                      alt={item.name} className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg sm:rounded-xl" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link to={`/product/${item._id}`} className="font-luxury text-[#1A1A1A] hover:text-[#1A1A1A] transition-colors text-sm sm:text-lg block truncate pr-4">{item.name}</Link>
                      <button onClick={() => removeFromCart(item._id, item.size, item.color)} className="text-red-400/60 hover:text-red-400 transition-colors shrink-0">
                        <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 mb-2 sm:mb-3">
                      {item.size && <span className="text-[10px] sm:text-xs text-[#1A1A1A]/40 uppercase tracking-wider">Size: {item.size}</span>}
                      {item.color && <span className="text-[10px] sm:text-xs text-[#1A1A1A]/40 uppercase tracking-wider">Color: {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center border border-amber-900/30 rounded overflow-hidden h-8 sm:h-10">
                        <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)} className="px-2.5 sm:px-3 text-[#1A1A1A] hover:bg-amber-500/10 transition-colors">−</button>
                        <span className="px-2 sm:px-3 text-[#1A1A1A] text-xs sm:text-sm min-w-[28px] sm:min-w-[32px] text-center font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)} className="px-2.5 sm:px-3 text-[#1A1A1A] hover:bg-amber-500/10 transition-colors">+</button>
                      </div>
                      <span className="text-[#1A1A1A] font-bold text-base sm:text-lg">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass-card p-5 sm:p-6 h-fit lg:sticky lg:top-24 mt-4 lg:mt-0">
              <h3 className="font-luxury text-xl sm:text-2xl text-white mb-5 sm:mb-6">Order Summary</h3>
              <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
                <div className="flex justify-between text-xs sm:text-sm"><span className="text-[#1A1A1A]/60 uppercase tracking-widest text-[10px] sm:text-xs">Subtotal</span><span className="text-[#1A1A1A] font-bold">₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs sm:text-sm"><span className="text-[#1A1A1A]/60 uppercase tracking-widest text-[10px] sm:text-xs">Shipping</span><span className={shipping === 0 ? 'text-emerald-400 font-bold' : 'text-[#1A1A1A] font-bold'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-xs sm:text-sm"><span className="text-[#1A1A1A]/60 uppercase tracking-widest text-[10px] sm:text-xs">Tax (5%)</span><span className="text-[#1A1A1A] font-bold">₹{tax.toLocaleString()}</span></div>
                {shipping > 0 && <p className="text-[9px] sm:text-[10px] text-[#1A1A1A]/30 uppercase tracking-wider">Add ₹{(5000 - subtotal).toLocaleString()} for free delivery</p>}
              </div>
              <div className="border-t border-amber-900/20 pt-4 mb-6 sm:mb-8">
                <div className="flex justify-between items-center"><span className="font-luxury text-lg text-[#1A1A1A] uppercase tracking-widest">Total</span><span className="font-luxury text-2xl sm:text-3xl text-[#1A1A1A]">₹{total.toLocaleString()}</span></div>
              </div>
              {user ? (
                <Link to="/checkout" className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 text-xs font-bold tracking-[0.2em]">
                  CHECKOUT <FiArrowRight size={14} />
                </Link>
              ) : (
                <Link to="/login?redirect=checkout" className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 text-xs font-bold tracking-[0.2em]">
                  LOGIN TO ORDER <FiArrowRight size={14} />
                </Link>
              )}
              <Link to="/shop" className="btn-outline-gold w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 mt-3 text-[10px] sm:text-xs tracking-widest">
                <FiArrowLeft size={12} /> BACK TO SHOP
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
