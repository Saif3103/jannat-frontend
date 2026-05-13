import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiStar, FiHeart, FiShoppingCart, FiTruck, FiShield, 
  FiRefreshCw, FiChevronLeft, FiChevronRight, FiShoppingBag,
  FiCheckCircle, FiEdit3, FiPackage, FiMaximize
} from 'react-icons/fi';
import { GiRugbyConversion as LuRug } from 'react-icons/gi';
import { TbCircleCheckFilled } from 'react-icons/tb';
import api, { BASE_URL } from '../api/axios';
import { useCartStore, useAuthStore, useWishlistStore } from '../store';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import RoomVisualizer from '../components/ui/RoomVisualizer';
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
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    api.get(`/products/${id}`).then(r => {
      setProduct(r.data.product);
      setActiveImg(0);
      if (r.data.product.sizes?.length) setSelectedSize(r.data.product.sizes[0]);
      
      if (r.data.product.category?._id) {
        api.get(`/products?category=${r.data.product.category._id}&limit=4`).then(rel => {
          setRelated(rel.data.products.filter(p => p._id !== id));
        });
      }
    }).catch(() => toast.error('Product not found')).finally(() => setLoading(false));
  }, [id, user]);

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

  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling down 600px
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <div className="pt-24"><Loader fullscreen /></div>;
  if (!product) return <div className="pt-24 text-center text-gray-400 py-20 font-luxury text-2xl">Product not found</div>;

  const basePrice = product.discountPrice || product.price;
  const priceDisplay = selectedSize?.price || basePrice;
  const originalPrice = product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  
  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800'];

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-24 pb-20 font-sans text-[#1A1A1A]">
      <Helmet>
        <title>{product.name} | Jannat Rugs Co.</title>
      </Helmet>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white shadow-sm border border-gray-100 group">
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-[#1A1A1A] text-white px-5 py-2 rounded-lg font-bold text-[10px] tracking-[0.2em] uppercase">New</span>
              </div>
              <button 
                onClick={() => toggleWishlist(product._id, !!user)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-lg border border-gray-100 group">
                <FiHeart size={20} className={isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''} />
              </button>

              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImg}
                  src={getImageUrl(images[activeImg])} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#1A1A1A] shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <FiChevronLeft size={24} />
              </button>
              <button onClick={() => setActiveImg(p => (p + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#1A1A1A] shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                <FiChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#C9A84C]' : 'border-transparent opacity-60'}`}>
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              <button className="flex-shrink-0 w-24 h-24 rounded-2xl border-2 border-transparent bg-white/50 flex items-center justify-center text-gray-400">
                <FiChevronRight size={24} />
              </button>
            </div>

            {/* Feature Icons Grid - Clean Unified Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-t border-b border-gray-100/50">
               {[
                 { icon: LuRug, label: '100% Premium Wool' },
                 { icon: FiGrid, label: 'Traditional Hand Knotted' },
                 { icon: FiShield, label: 'Durable & Long Lasting' },
                 { icon: FiStar, label: 'Rich Colors & Design' }
               ].map((f, i) => (
                 <div key={i} className="flex flex-col items-center text-center group">
                   <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] flex items-center justify-center text-[#1A1A1A] mb-4 transition-all group-hover:bg-[#C9A84C] group-hover:text-white">
                     <f.icon size={20} />
                   </div>
                   <p className="text-[10px] font-bold text-[#1A1A1A]/80 uppercase tracking-widest leading-tight px-2">{f.label}</p>
                 </div>
               ))}
            </div>

            {/* Policy Info - Premium Organized Layout */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { icon: FiTruck, title: 'Free Delivery', desc: 'On Orders Above \u20B9999' },
                    { icon: FiRefreshCw, title: '7-Day Returns', desc: 'Hassle-free exchanges' },
                    { icon: FiPackage, title: 'Authenticity', desc: 'Verified Masterpiece' },
                    { icon: FiCheckCircle, title: '100% Genuine', desc: 'Premium Craftsmanship' }
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-5">
                       <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1A1A1A]/60 border border-gray-100">
                         <p.icon size={18} />
                       </div>
                       <div>
                         <p className="text-xs font-bold text-[#1A1A1A]">{p.title}</p>
                         <p className="text-[10px] text-gray-400 mt-0.5">{p.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-10">
            <div>
              <p className="text-[#1A1A1A] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">{product.category?.name || 'Collection'}</p>
              <h1 className="font-luxury text-5xl sm:text-6xl text-[#1A1A1A] mb-6 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-8">
                 <div className="flex text-[#1A1A1A]">
                    {[...Array(5)].map((_, i) => <FiStar key={i} size={16} fill="currentColor" />)}
                 </div>
                 <span className="text-sm text-gray-400">(128 Reviews)</span>
                 <span className="text-gray-300">|</span>
                 <span className="flex items-center gap-2 text-sm font-bold">4.8 <FiStar size={14} className="fill-amber-400 text-[#1A1A1A]" /></span>
              </div>

              <div className="space-y-1">
                 <div className="flex items-baseline gap-4">
                    <p className="text-4xl sm:text-5xl font-bold tracking-tight text-[#111827]">₹{priceDisplay?.toLocaleString()}</p>
                    {hasDiscount && (
                      <div className="flex items-center gap-3">
                        <span className="text-lg text-gray-400 line-through">₹{originalPrice?.toLocaleString()}</span>
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{discountPercent}% OFF</span>
                      </div>
                    )}
                 </div>
                 <p className="text-xs text-gray-400">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Material', value: product.material || 'Wool', icon: LuRug },
                 { label: 'Weave', value: 'Hand Knotted', icon: FiGrid },
                 { label: 'Origin', value: 'Turkey', icon: FiMapPin },
                 { label: 'Pile Height', value: '8-10 mm', icon: FiArrowUp }
               ].map((s, i) => (
                 <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 transition-all hover:shadow-sm">
                    <div className="text-gray-400"><s.icon size={18} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                      <p className="text-xs font-bold mt-1">{s.value}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Size Selector */}
            <div className="space-y-6">
               <p className="text-sm font-bold uppercase tracking-widest">Size</p>
               <div className="grid grid-cols-3 gap-4">
                  {(product.sizes?.length > 0 ? product.sizes : [{label: '120 x 180 cm'}, {label: '160 x 230 cm'}, {label: '200 x 290 cm'}, {label: '240 x 340 cm'}]).map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedSize(s)}
                      className={`py-4 rounded-xl border text-sm font-bold transition-all ${selectedSize?.label === s.label ? 'border-[#C9A84C] bg-[#FAF7F2] text-[#1A1A1A] ring-1 ring-[#C9A84C]' : 'border-gray-200 hover:border-gray-400'}`}>
                      {s.label}
                    </button>
                  ))}
               </div>
               <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors">
                  <FiEdit3 /> Custom size available
               </button>
            </div>

            {/* Highlights */}
            <div className="space-y-6 pt-10 border-t border-gray-100/50">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Highlights</h3>
               <div className="space-y-4">
                  {[
                    'Traditional Turkish craftsmanship',
                    'Premium wool for extra softness',
                    'Vibrant colors that last for years',
                    'Perfect for living room & bedroom'
                  ].map((h, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <TbCircleCheckFilled size={20} className="text-[#1A1A1A] opacity-60" />
                       <p className="text-sm font-medium text-[#1A1A1A]/80">{h}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Why You'll Love It Section */}
            <div className="bg-[#FAF7F2] p-8 rounded-[2rem] border border-[#C9A84C]/20 relative">
               <div className="flex items-center gap-3 mb-4">
                  <FiHeart className="text-[#1A1A1A]" />
                  <h4 className="font-luxury text-xl">Why You'll Love It</h4>
               </div>
               <p className="font-luxury text-lg leading-relaxed text-[#1A1A1A]/70">
                 The {product.name} brings timeless elegance and warmth to your space. Handcrafted with precision, this rug combines durability with rich cultural heritage.
               </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
               {/* VISUALIZE IN YOUR SPACE CTA */}
               <button 
                 onClick={() => setIsVisualizerOpen(true)}
                 className="w-full bg-[#FAF7F2] border-2 border-dashed border-[#C9A84C]/30 text-[#1A1A1A] py-5 rounded-2xl font-bold tracking-[0.1em] hover:border-[#C9A84C] transition-all flex items-center justify-center gap-3 group mb-2"
               >
                  <FiMaximize className="text-[#C9A84C] group-hover:scale-110 transition-transform" size={20} /> TRY IN YOUR ROOM
               </button>

               <div className="flex items-center gap-4 mb-2">
                 <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-14 bg-white">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-100">
                      <FiMinus size={14} />
                    </button>
                    <span className="w-14 text-center font-bold text-lg">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-100">
                      <FiPlus size={14} />
                    </button>
                 </div>
                 <button onClick={handleAddToCart} className="flex-1 bg-white border border-gray-200 text-[#111827] h-14 rounded-xl font-bold tracking-[0.05em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
                   <FiShoppingCart size={18} /> ADD TO CART
                 </button>
               </div>
               <button onClick={handleBuyNow} className="w-full bg-gradient-to-r from-[#111827] to-[#1F2937] text-white h-14 rounded-xl font-bold tracking-[0.1em] hover:scale-[1.01] active:scale-95 transition-all shadow-xl">
                  BUY NOW
               </button>
               <div className="flex items-center justify-center gap-6 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><FiShield /> Secure Payment</span>
                  <span className="flex items-center gap-2"><FiTruck /> Free Shipping</span>
               </div>
            </div>
          </div>
        </div>

        <RoomVisualizer 
          isOpen={isVisualizerOpen} 
          onClose={() => setIsVisualizerOpen(false)} 
          product={product} 
        />

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-40 pt-20 border-t border-gray-100">
            <div className="text-center mb-16">
              <p className="text-[#1A1A1A] text-[11px] font-bold tracking-[0.4em] uppercase mb-4">You May Also Like</p>
              <h2 className="font-luxury text-5xl">Related Masterpieces</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* STICKY ADD TO CART BAR */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 md:bottom-8 left-0 right-0 z-[999] px-0 md:px-4 pointer-events-none"
          >
            <div className="max-w-[1200px] mx-auto w-full pointer-events-auto">
               <div className="bg-white/92 backdrop-blur-[18px] border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.12)] rounded-none md:rounded-[22px] px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
                  
                  {/* Left: Product Info (Desktop Only) */}
                  <div className="hidden md:flex items-center gap-5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img src={getImageUrl(images[0])} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-[#111827] text-base truncate max-w-[200px]">{product.name}</h4>
                      <div className="flex items-center gap-3 text-[13px] text-gray-500 font-medium">
                        <span>\uD83D\uDE9A Free Shipping</span>
                        <span>\u2022</span>
                        <span>\uD83D\uDD12 Secure Checkout</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle/Left: Price Section */}
                  <div className="flex-1 md:flex-none flex flex-col md:items-end">
                    <div className="flex items-center gap-3">
                      <span className="text-xl md:text-2xl font-bold text-[#111827]">\u20B9{priceDisplay?.toLocaleString()}</span>
                      {hasDiscount && (
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold">{discountPercent}% OFF</span>
                      )}
                    </div>
                    {hasDiscount && (
                      <span className="text-[10px] md:text-xs text-gray-400 line-through md:mt-0.5">\u20B9{originalPrice?.toLocaleString()}</span>
                    )}
                    <span className="text-[9px] text-gray-400 md:hidden">Inclusive of taxes</span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 md:gap-4">
                    {/* Qty Selector (Desktop Only) */}
                    <div className="hidden lg:flex items-center border border-gray-200 rounded-xl overflow-hidden h-12 bg-white">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-r border-gray-100">
                        <FiMinus size={12} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{qty}</span>
                      <button onClick={() => setQty(q => q + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors border-l border-gray-100">
                        <FiPlus size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <button 
                        onClick={handleAddToCart}
                        className="bg-white border border-gray-200 text-[#111827] h-12 md:h-14 px-4 md:px-8 rounded-xl font-bold text-[11px] md:text-sm tracking-wide hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      >
                        <FiShoppingCart size={16} className="hidden md:block" /> ADD
                      </button>
                      <button 
                        onClick={handleBuyNow}
                        className="bg-gradient-to-r from-[#111827] to-[#1F2937] text-white h-12 md:h-14 px-5 md:px-10 rounded-xl font-bold text-[11px] md:text-sm tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center"
                      >
                        BUY NOW
                      </button>
                    </div>
                  </div>

               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Icon fallbacks
const FiGrid = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const FiMapPin = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const FiArrowUp = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const FiMinus = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const FiPlus = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
