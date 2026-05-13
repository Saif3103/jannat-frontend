import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useCartStore, useAuthStore } from '../store';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
  { id: 'UPI', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm', icon: '📱' },
  { id: 'Razorpay', label: 'Razorpay', desc: 'Cards, Net Banking, Wallets', icon: '💳' },
  { id: 'Card', label: 'Credit / Debit Card', desc: 'All major cards accepted', icon: '🏧' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India'
  });

  const subtotal = items.reduce((a, i) => a + ((i.discountPrice || i.price) * i.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 299;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleAddressSubmit = (e) => { e.preventDefault(); setStep(2); };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: items.map(i => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.discountPrice || i.price, quantity: i.quantity, size: i.size, color: i.color })),
        shippingAddress: address, paymentMethod,
        itemsPrice: subtotal, shippingPrice: shipping, taxPrice: tax, totalPrice: total,
      };
      const { data } = await api.post('/orders', orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/dashboard?tab=orders&orderId=${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const steps = ['Shipping Address', 'Payment', 'Confirm Order'];

  return (
    <>
      <Helmet><title>Checkout | Jannat Rugs Co.</title></Helmet>
      <div className="pt-24 min-h-screen max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-luxury text-4xl text-white mb-8 text-center">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-amber-500 text-black' : 'border border-amber-900/30 text-[#1A1A1A]/30'}`}>
                {step > i + 1 ? <FiCheck size={14} /> : i + 1}
              </div>
              <span className={`text-sm hidden md:block ${step === i + 1 ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/30'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-12 h-px ${step > i + 1 ? 'bg-emerald-500' : 'bg-amber-900/30'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1 */}
            {step === 1 && (
              <motion.form onSubmit={handleAddressSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-4">
                <h2 className="font-luxury text-2xl text-[#1A1A1A] mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name', type: 'text', required: true },
                    { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
                    { key: 'street', label: 'Street Address', type: 'text', required: true, full: true },
                    { key: 'city', label: 'City', type: 'text', required: true },
                    { key: 'state', label: 'State', type: 'text', required: true },
                    { key: 'pincode', label: 'PIN Code', type: 'text', required: true },
                  ].map(f => (
                    <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                      <label className="text-xs text-[#1A1A1A]/50 block mb-1.5 tracking-wider uppercase">{f.label}</label>
                      <input type={f.type} required={f.required} value={address[f.key]}
                        onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                        className="input-luxury" />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn-gold py-3 w-full mt-2">Continue to Payment</button>
              </motion.form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
                <h2 className="font-luxury text-2xl text-[#1A1A1A] mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${paymentMethod === m.id ? 'border-amber-500 bg-amber-500/10' : 'border-amber-900/30 hover:border-amber-800/50'}`}>
                      <span className="text-2xl">{m.icon}</span>
                      <div className="flex-1">
                        <p className={`font-medium ${paymentMethod === m.id ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/80'}`}>{m.label}</p>
                        <p className="text-xs text-[#1A1A1A]/40">{m.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.id ? 'border-amber-500 bg-amber-500' : 'border-amber-900/40'}`}>
                        {paymentMethod === m.id && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-outline-gold flex-1 py-2.5">Back</button>
                  <button onClick={() => setStep(3)} className="btn-gold flex-1 py-2.5">Review Order</button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="glass-card p-5">
                  <h3 className="text-[#1A1A1A] font-medium mb-3">Shipping To</h3>
                  <p className="text-[#1A1A1A]/70 text-sm">{address.name} • {address.phone}</p>
                  <p className="text-[#1A1A1A]/50 text-sm">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                </div>
                <div className="glass-card p-5">
                  <h3 className="text-[#1A1A1A] font-medium mb-3">Payment</h3>
                  <p className="text-[#1A1A1A]/70 text-sm">{PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline-gold flex-1 py-2.5">Back</button>
                  <button onClick={placeOrder} disabled={loading} className="btn-gold flex-1 py-2.5">
                    {loading ? 'Placing Order...' : 'Place Order 🎉'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="glass-card p-5 h-fit sticky top-24">
            <h3 className="font-luxury text-xl text-white mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={`${item._id}-${item.size}`} className="flex gap-3">
                  <img src={item.images?.[0]} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[#1A1A1A] text-sm truncate">{item.name}</p>
                    <p className="text-[#1A1A1A]/40 text-xs">Qty: {item.quantity}</p>
                    <p className="text-[#1A1A1A] text-sm font-medium">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-amber-900/20 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-[#1A1A1A]/50">Subtotal</span><span className="text-[#1A1A1A]">₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#1A1A1A]/50">Shipping</span><span className={shipping === 0 ? 'text-emerald-400' : 'text-[#1A1A1A]'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#1A1A1A]/50">Tax</span><span className="text-[#1A1A1A]">₹{tax.toLocaleString()}</span></div>
              <div className="flex justify-between pt-2 border-t border-amber-900/20">
                <span className="font-luxury text-[#1A1A1A]">Total</span>
                <span className="font-luxury text-xl text-[#1A1A1A]">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
