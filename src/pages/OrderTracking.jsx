import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiPackage, FiCheck } from 'react-icons/fi';
import api from '../api/axios';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export default function OrderTracking() {
  const [trackingNum, setTrackingNum] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const track = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setOrder(null);
    try {
      const { data } = await api.get(`/orders/track/${trackingNum.trim()}`);
      setOrder(data.order);
    } catch { setError('Order not found. Please check your tracking number.'); }
    finally { setLoading(false); }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.orderStatus) : -1;

  return (
    <>
      <Helmet><title>Track Your Order | Jannat Rugs Co.</title></Helmet>
      <div className="pt-20 min-h-screen">
        <div className="py-16 text-center" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 100%)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <p className="text-[#1A1A1A] text-xs tracking-[0.4em] uppercase mb-2">Know Where Your Order Is</p>
          <h1 className="font-luxury text-5xl text-white mb-3">Order Tracking</h1>
          <div className="divider-gold" />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16">
          <form onSubmit={track} className="flex gap-3 mb-10">
            <input value={trackingNum} onChange={e => setTrackingNum(e.target.value)}
              placeholder="Enter tracking number (e.g. JRC-XXXXXXXX)"
              className="input-luxury flex-1" required id="tracking-input" />
            <button type="submit" disabled={loading} className="btn-gold px-6 flex items-center gap-2" id="tracking-submit">
              <FiSearch size={16} /> {loading ? '...' : 'Track'}
            </button>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-8 text-red-400/80">{error}</motion.div>
          )}

          {order && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-wider mb-1">Tracking Number</p>
                    <p className="text-[#1A1A1A] font-bold text-lg">{order.trackingNumber}</p>
                  </div>
                  <span className={`badge-gold ${order.orderStatus === 'Delivered' ? 'bg-emerald-900 text-emerald-300' : order.orderStatus === 'Cancelled' ? 'bg-red-900 text-red-300' : ''}`}>
                    {order.orderStatus}
                  </span>
                </div>

                {/* Progress bar */}
                {order.orderStatus !== 'Cancelled' && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-amber-900/30">
                        <div className="h-full bg-amber-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%` }} />
                      </div>
                      {STATUS_STEPS.map((step, i) => (
                        <div key={step} className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${i <= currentStep ? 'bg-amber-500 text-black' : 'bg-amber-950 border border-amber-900/30 text-[#1A1A1A]/30'}`}>
                            {i < currentStep ? <FiCheck size={14} /> : i + 1}
                          </div>
                          <span className={`text-xs mt-2 hidden sm:block ${i <= currentStep ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/30'}`}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* History */}
                <div className="space-y-3">
                  <p className="text-xs text-[#1A1A1A]/40 uppercase tracking-wider">Status History</p>
                  {order.statusHistory?.slice().reverse().map((h, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-[#1A1A1A] text-sm font-medium">{h.status}</p>
                        <p className="text-[#1A1A1A]/40 text-xs">{h.message} • {new Date(h.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {!order && !error && !loading && (
            <div className="text-center py-10">
              <FiPackage size={64} className="text-[#1A1A1A]/20 mx-auto mb-4" />
              <p className="text-[#1A1A1A]/30">Enter your tracking number to see the latest updates on your order.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
