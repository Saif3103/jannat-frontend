import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiTag, FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/offers').then(r => setOffers(r.data.offers)).finally(() => setLoading(false));
  }, []);

  const defaultOffers = [
    { title: 'Summer Sale', description: 'Get 20% off on all handmade wool carpets', discountPercent: 20, couponCode: 'SUMMER20', validUntil: new Date(Date.now() + 7 * 86400000) },
    { title: 'New Arrival Offer', description: 'Extra 15% on all new arrivals this month', discountPercent: 15, couponCode: 'NEW15', validUntil: new Date(Date.now() + 14 * 86400000) },
    { title: 'Free Shipping', description: 'Free shipping on all orders above ₹5,000', discountPercent: 0, couponCode: 'FREESHIP', validUntil: new Date(Date.now() + 30 * 86400000) },
  ];

  const displayOffers = offers.length > 0 ? offers : defaultOffers;

  return (
    <>
      <Helmet>
        <title>Special Offers | Jannat Rugs Co.</title>
        <meta name="description" content="Explore exclusive deals and discounts on luxury handmade carpets at Jannat Rugs Co." />
      </Helmet>
      <div className="pt-20 min-h-screen bg-[#0D0D0D]">
        <div className="py-16 text-center" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 100%)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-2">Limited Time Deals</p>
          <h1 className="font-luxury text-5xl text-white mb-3">Exclusive Offers</h1>
          <div className="divider-gold" />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16">
          {loading ? (
            <div className="text-center py-12 text-amber-100/30">Loading offers...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayOffers.map((offer, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }} className="glass-card p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5" style={{
                    background: 'radial-gradient(circle, #C9A84C, transparent)'
                  }} />
                  {offer.discountPercent > 0 && (
                    <div className="badge-gold pulse-gold inline-block mb-4">{offer.discountPercent}% OFF</div>
                  )}
                  <h3 className="font-luxury text-2xl text-white mb-2">{offer.title}</h3>
                  <p className="text-amber-100/50 text-sm leading-relaxed mb-5">{offer.description}</p>
                  {offer.couponCode && (
                    <div className="flex items-center gap-3 mb-5">
                      <FiTag size={16} className="text-amber-400" />
                      <span className="text-amber-100/50 text-sm">Use code:</span>
                      <code className="bg-amber-900/30 text-amber-400 px-3 py-1 rounded text-sm font-mono border border-amber-800/30">
                        {offer.couponCode}
                      </code>
                    </div>
                  )}
                  {offer.validUntil && (
                    <div className="flex items-center gap-2 text-xs text-amber-100/30 mb-5">
                      <FiClock size={12} /> Valid until {new Date(offer.validUntil).toLocaleDateString()}
                    </div>
                  )}
                  <Link to="/shop" className="btn-outline-gold inline-flex items-center gap-2 text-xs py-2 px-4">
                    Shop Now <FiArrowRight size={12} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
