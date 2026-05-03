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
      <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-luxury text-4xl text-white">Shopping Cart</h1>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-sm text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1">
              <FiTrash2 size={14} /> Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <FiShoppingCart size={64} className="text-amber-900/30 mx-auto mb-6" />
            <h2 className="font-luxury text-3xl text-amber-100/30 mb-4">Your Cart is Empty</h2>
            <p className="text-amber-100/20 mb-8">Discover our luxury carpet collection and find your perfect piece.</p>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2"><FiArrowLeft size={16} /> Browse Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div key={`${item._id}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex gap-4">
                  <Link to={`/product/${item._id}`} className="flex-shrink-0">
                    <img src={getImageUrl(item.images?.[0])}
                      alt={item.name} className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item._id}`} className="font-luxury text-amber-100 hover:text-amber-400 transition-colors text-lg block truncate">{item.name}</Link>
                    <div className="flex flex-wrap gap-3 mt-1 mb-3">
                      {item.size && <span className="text-xs text-amber-100/40">Size: {item.size}</span>}
                      {item.color && <span className="text-xs text-amber-100/40">Color: {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center border border-amber-900/30 rounded overflow-hidden">
                        <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)} className="px-3 py-1.5 text-amber-400 hover:bg-amber-500/10 transition-colors">−</button>
                        <span className="px-3 py-1.5 text-amber-100 text-sm min-w-[32px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)} className="px-3 py-1.5 text-amber-400 hover:bg-amber-500/10 transition-colors">+</button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-amber-400 font-bold text-lg">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                        <button onClick={() => removeFromCart(item._id, item.size, item.color)} className="text-red-400/60 hover:text-red-400 transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass-card p-6 h-fit sticky top-24">
              <h3 className="font-luxury text-2xl text-white mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-amber-100/60">Subtotal</span><span className="text-amber-100">₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-amber-100/60">Shipping</span><span className={shipping === 0 ? 'text-emerald-400' : 'text-amber-100'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-sm"><span className="text-amber-100/60">Tax (5%)</span><span className="text-amber-100">₹{tax.toLocaleString()}</span></div>
                {shipping > 0 && <p className="text-xs text-amber-100/30">Add ₹{(5000 - subtotal).toLocaleString()} more for free shipping</p>}
              </div>
              <div className="border-t border-amber-900/20 pt-4 mb-6">
                <div className="flex justify-between"><span className="font-luxury text-lg text-amber-100">Total</span><span className="font-luxury text-2xl text-amber-400">₹{total.toLocaleString()}</span></div>
              </div>
              {user ? (
                <Link to="/checkout" className="btn-gold w-full flex items-center justify-center gap-2 py-3">
                  Proceed to Checkout <FiArrowRight size={16} />
                </Link>
              ) : (
                <Link to="/login?redirect=checkout" className="btn-gold w-full flex items-center justify-center gap-2 py-3">
                  Login to Checkout <FiArrowRight size={16} />
                </Link>
              )}
              <Link to="/shop" className="btn-outline-gold w-full flex items-center justify-center gap-2 py-2.5 mt-3 text-xs">
                <FiArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
