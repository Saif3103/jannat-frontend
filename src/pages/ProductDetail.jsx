import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiStar, FiHeart, FiShoppingCart, FiTruck, FiShield,
  FiChevronLeft, FiChevronRight, FiEdit3, FiMaximize,
  FiMinus, FiPlus, FiMapPin, FiGrid, FiArrowUp
} from 'react-icons/fi';
import { GiRugbyConversion as LuRug } from 'react-icons/gi';
import { TbCircleCheckFilled } from 'react-icons/tb';
import api, { BASE_URL } from '../api/axios';
import Loader from '../components/ui/Loader';
import RoomVisualizer from '../components/ui/RoomVisualizer';
import SmartRecommendations from '../components/ui/SmartRecommendations';
import Container from '../components/layout/Container';
import { useCartStore, useAuthStore, useWishlistStore, useRecommendationStore } from '../store';
import toast from 'react-hot-toast';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSticky, setShowSticky] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);

  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    api.get(`/products/${id}`).then(r => {
      setProduct(r.data.product);
      useRecommendationStore.getState().addViewedProduct(r.data.product);
      setActiveImg(0);
      if (r.data.product.sizes?.length) setSelectedSize(r.data.product.sizes[0]);
    }).catch(() => toast.error('Product not found')).finally(() => setLoading(false));
  }, [id, user]);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 480);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty, selectedSize?.label);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, qty, selectedSize?.label);
    navigate('/checkout');
  };

  if (loading) return <div className="pt-24"><Loader fullscreen /></div>;
  if (!product) {
    return (
      <div className="pt-24 text-center text-gray-400 py-20 font-luxury text-2xl">
        Product not found
      </div>
    );
  }

  const basePrice = product.discountPrice || product.price;
  const priceDisplay = selectedSize?.price || basePrice;
  const originalPrice = product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const images = product.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800'];

  const sizeOptions = product.sizes?.length > 0
    ? product.sizes
    : [
        { label: '120 x 180 cm' },
        { label: '160 x 230 cm' },
        { label: '200 x 290 cm' },
        { label: '240 x 340 cm' },
      ];

  const inWishlist = isInWishlist(product._id);

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-20 sm:pt-24 pb-28 md:pb-20 font-sans text-[#1A1A1A] text-left">
      <Helmet>
        <title>{product.name} | Jannat Rugs Co.</title>
      </Helmet>

      <Container className="py-6 sm:py-8 lg:py-10">
        {/* Breadcrumb-style category */}
        <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-black/40 mb-5 sm:mb-6">
          Home / Shop / {product.category?.name || 'Collection'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">

          {/* ── LEFT: Gallery (sticky on desktop) ── */}
          <div className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-28 space-y-4">
            <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-sm border border-black/[0.06] group">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isBestSeller && (
                  <span className="bg-[#1A1A1A] text-white px-3 py-1.5 rounded-lg font-bold text-[9px] tracking-[0.15em] uppercase">
                    Best Seller
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-[#E31E24] text-white px-3 py-1.5 rounded-lg font-bold text-[9px] tracking-[0.15em] uppercase">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product._id, !!user)}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-md border border-gray-100 cursor-pointer"
              >
                <FiHeart size={18} className={inWishlist ? 'fill-red-500 text-red-500' : ''} />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={getImageUrl(images[activeImg])}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#1A1A1A] shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImg(p => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#1A1A1A] shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Next image"
                  >
                    <FiChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImg === i
                      ? 'border-[#C9A84C] opacity-100'
                      : 'border-transparent opacity-55 hover:opacity-85'
                  }`}
                >
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Feature strip */}
            <div className="hidden sm:grid grid-cols-4 gap-3 pt-2">
              {[
                { icon: LuRug, label: 'Premium Wool' },
                { icon: FiGrid, label: 'Hand Knotted' },
                { icon: FiShield, label: 'Long Lasting' },
                { icon: FiStar, label: 'Rich Design' },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center py-3 px-2 rounded-xl bg-white border border-black/[0.04]">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] flex items-center justify-center text-[#B69640] mb-2">
                    <f.icon size={16} />
                  </div>
                  <p className="text-[9px] font-bold text-[#1A1A1A]/70 uppercase tracking-wider leading-tight">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Buy panel ── */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-6 sm:space-y-7">

            {/* Title + rating + price — above the fold */}
            <div>
              <p className="text-[#B69640] text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase mb-2">
                {product.category?.name || 'Collection'}
              </p>
              <h1 className="font-luxury text-[1.75rem] sm:text-[2.25rem] lg:text-[2.5rem] text-[#1A1A1A] leading-[1.15] mb-3">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold">
                  4.8 <FiStar size={11} className="fill-current" />
                </div>
                <span className="text-sm text-gray-400">(128 Reviews)</span>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <p className="text-[1.75rem] sm:text-[2rem] font-black tracking-tight text-[#111827] leading-none">
                  ₹{priceDisplay?.toLocaleString('en-IN')}
                </p>
                {hasDiscount && (
                  <>
                    <span className="text-base text-gray-400 line-through pb-0.5">
                      ₹{originalPrice?.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-bold mb-0.5">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">Inclusive of all taxes · Free shipping above ₹5,000</p>
            </div>

            {/* Size — required before buy */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1A1A1A]">
                  Select Size
                </p>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <FiEdit3 size={12} /> Custom size
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {sizeOptions.map((s, i) => {
                  const active = selectedSize?.label === s.label;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-h-[48px] px-3 py-3 rounded-xl border text-[12px] sm:text-[13px] font-bold transition-all cursor-pointer ${
                        active
                          ? 'border-[#C9A84C] bg-[#FAF7F2] text-[#1A1A1A] ring-1 ring-[#C9A84C]'
                          : 'border-gray-200 bg-white hover:border-gray-400 text-[#1A1A1A]/80'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Qty + CTAs — Flipkart/Myntra style primary actions */}
            <div className="space-y-3 pt-1">
              <div className="flex items-stretch gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-12 sm:h-14 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-11 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-100 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-12 text-center font-bold text-base">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(q => q + 1)}
                    className="w-11 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-100 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-12 sm:h-14 rounded-xl border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] font-bold text-[11px] sm:text-xs tracking-[0.12em] uppercase hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiShoppingCart size={16} /> Add to Cart
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-12 sm:h-14 rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold text-[11px] sm:text-xs tracking-[0.14em] uppercase hover:bg-[#B69640] hover:shadow-[0_8px_24px_rgba(201,168,76,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() => setIsVisualizerOpen(true)}
                className="w-full h-11 rounded-xl bg-white border border-dashed border-[#C9A84C]/45 text-[#1A1A1A] font-bold text-[10px] tracking-[0.12em] uppercase hover:border-[#C9A84C] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiMaximize className="text-[#C9A84C]" size={16} /> Try in Your Room
              </button>

              <div className="flex items-center justify-center gap-5 pt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><FiShield size={12} /> Secure Payment</span>
                <span className="flex items-center gap-1.5"><FiTruck size={12} /> Free Shipping</span>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Material', value: product.material || 'Wool', icon: LuRug },
                { label: 'Weave', value: 'Hand Knotted', icon: FiGrid },
                { label: 'Origin', value: 'Turkey', icon: FiMapPin },
                { label: 'Pile Height', value: '8-10 mm', icon: FiArrowUp },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3"
                >
                  <div className="text-[#B69640] shrink-0"><s.icon size={16} /></div>
                  <div className="min-w-0 text-left">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                    <p className="text-xs font-bold mt-0.5 truncate">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="pt-5 border-t border-gray-200/70">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] mb-4">Highlights</h3>
              <div className="space-y-3">
                {[
                  'Traditional Turkish craftsmanship',
                  'Premium wool for extra softness',
                  'Vibrant colors that last for years',
                  'Perfect for living room & bedroom',
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-left">
                    <TbCircleCheckFilled size={18} className="text-[#B69640] shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-[#1A1A1A]/75 leading-snug">{h}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why you'll love it */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#C9A84C]/20">
              <div className="flex items-center gap-2.5 mb-3">
                <FiHeart className="text-[#B69640]" size={16} />
                <h4 className="font-luxury text-lg sm:text-xl text-[#1A1A1A]">Why You&apos;ll Love It</h4>
              </div>
              <p className="font-luxury text-base leading-relaxed text-[#1A1A1A]/65 text-left">
                The {product.name} brings timeless elegance and warmth to your space. Handcrafted with precision, this rug combines durability with rich cultural heritage.
              </p>
            </div>
          </div>
        </div>

        <RoomVisualizer
          isOpen={isVisualizerOpen}
          onClose={() => setIsVisualizerOpen(false)}
          product={product}
        />

        <div className="mt-12 sm:mt-16">
          <SmartRecommendations currentProduct={product} title="Perfect Matches For Your Space" />
        </div>
      </Container>

      {/* Sticky buy bar — Flipkart/Myntra style */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed bottom-[62px] md:bottom-0 left-0 right-0 z-[850] pointer-events-none pb-[env(safe-area-inset-bottom,0px)] md:pb-0"
          >
            <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border-t border-black/[0.08] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:border md:border-black/[0.06] md:rounded-2xl md:shadow-[0_10px_40px_rgba(0,0,0,0.12)] md:max-w-[1100px] md:mx-auto md:mb-5 md:overflow-hidden">
              <div className="px-3 py-2.5 sm:px-5 sm:py-3 flex items-center gap-3 sm:gap-4">

                <div className="hidden md:flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img src={getImageUrl(images[0])} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h4 className="font-bold text-[#111827] text-sm truncate max-w-[220px]">{product.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium truncate">
                      {selectedSize?.label || 'Standard size'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-lg sm:text-xl font-black text-[#111827] tracking-tight">
                    ₹{priceDisplay?.toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && (
                    <span className="hidden sm:inline bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 md:flex-none h-11 px-4 sm:px-6 rounded-xl border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] font-bold text-[10px] sm:text-xs tracking-wide uppercase hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FiShoppingCart size={14} className="hidden sm:block" />
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 md:flex-none h-11 px-4 sm:px-8 rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold text-[10px] sm:text-xs tracking-wide uppercase hover:bg-[#B69640] transition-all shadow-md flex items-center justify-center cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
