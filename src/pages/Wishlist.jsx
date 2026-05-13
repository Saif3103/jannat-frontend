import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHeart, FiArrowLeft } from 'react-icons/fi';
import { useAuthStore, useWishlistStore } from '../store';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import SmartRecommendations from '../components/ui/SmartRecommendations';

export default function Wishlist() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/users/profile').then(r => {
        setProducts(r.data.user.wishlist || []);
      }).finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <>
      <Helmet><title>My Wishlist | Jannat Rugs Co.</title></Helmet>
      <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-luxury text-4xl text-white mb-8 flex items-center gap-3">
          <FiHeart className="text-[#1A1A1A]" /> My Wishlist
        </h1>
        {loading ? (
          <p className="text-[#1A1A1A]/40 text-center py-20">Loading...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <FiHeart size={64} className="text-[#1A1A1A]/30 mx-auto mb-6" />
            <h2 className="font-luxury text-3xl text-[#1A1A1A]/30 mb-4">Nothing saved yet</h2>
            <p className="text-[#1A1A1A]/20 mb-8">Save your favourite carpets to come back to them later.</p>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2"><FiArrowLeft size={16} /> Browse Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </div>

      {/* SMART RECOMMENDATIONS */}
      <div className="max-w-7xl mx-auto px-4">
        <SmartRecommendations title="Luxury Styles You May Love" />
      </div>
    </>
  );
}
