import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiStar, FiHeart, FiShoppingCart, FiTruck, FiShield, 
  FiRefreshCw, FiChevronLeft, FiChevronRight, FiShoppingBag,
  FiCheckCircle, FiEdit3, FiPackage
} from 'react-icons/fi';
import { GiRugbyConversion as LuRug } from 'react-icons/gi';
import { TbCircleCheckFilled } from 'react-icons/tb';
import api, { BASE_URL } from '../api/axios';
import { useCartStore, useAuthStore, useWishlistStore } from '../store';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
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

  if (loading) return <div className="pt-24"><Loader fullscreen /></div>;
  if (!product) return <div className="pt-24 text-center text-gray-400 py-20 font-luxury text-2xl">Product not found</div>;

  const basePrice = product.discountPrice || product.price;
  const price = selectedSize?.price || basePrice;
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

            {/* Feature Icons Grid */}
            <div className="grid grid-cols-4 gap-4 py-10 border-t border-gray-100/50">
               {[
                 { icon: LuRug, label: '100% Wool' },
                 { icon: FiGrid, label: 'Hand Knotted' },
                 { icon: FiShield, label: 'Durable & Long Lasting' },
                 { icon: FiStar, label: 'Rich Colors & Design' }
               ].map((f, i) => (
                 <div key={i} className="flex flex-col items-center text-center">
                   <f.icon size={24} className="text-[#1A1A1A] mb-3 opacity-80" />
                   <p className="text-[10px] font-bold text-[#1A1A1A]/60 uppercase tracking-widest leading-tight">{f.label}</p>
                 </div>
               ))}
            </div>

            {/* Policy Info */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 grid grid-cols-2 gap-y-6 gap-x-10">
               <div className="flex items-start gap-4">
                 <FiTruck size={20} className="text-[#1A1A1A] mt-1" />
                 <div>
                   <p className="text-xs font-bold">Free Delivery</p>
                   <p className="text-[10px] text-gray-400">On Orders Above ₹999</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <FiRefreshCw size={20} className="text-[#1A1A1A] mt-1" />
                 <div>
                   <p className="text-xs font-bold">7-Day Return Policy</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <FiPackage size={20} className="text-[#1A1A1A] mt-1" />
                 <div>
                   <p className="text-xs font-bold">Authenticity</p>
                 </div>
               </div>
               <div className="flex items-start gap-4">
                 <FiCheckCircle size={20} className="text-[#1A1A1A] mt-1" />
                 <div>
                   <p className="text-xs font-bold">100% Genuine Product</p>
                 </div>
               </div>
            </div>

            {/* Social Notification Mockup */}
            <div className="hidden lg:flex items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-max shadow-sm">
               <div className="w-12 h-12 rounded-lg overflow-hidden">
                 <img src={getImageUrl(images[0])} alt="" className="w-full h-full object-cover" />
               </div>
               <div>
                 <p className="text-[10px] text-gray-400">Someone in Delhi just added</p>
                 <p className="text-[11px] font-bold">{product.name} to cart</p>
                 <p className="text-[9px] text-gray-400">2 mins ago</p>
               </div>
               <div className="ml-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#1A1A1A]">
                 <FiShoppingCart size={14} />
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
                 <p className="text-4xl sm:text-5xl font-bold tracking-tight">₹{price?.toLocaleString()}</p>
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
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
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

            {/* "Why You'll Love It" Section */}
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
            <div className="space-y-4">
               <button onClick={handleAddToCart} className="w-full bg-[#C9A84C] text-white py-5 rounded-2xl font-bold tracking-[0.1em] hover:bg-[#B69640] transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-500/10">
                  <FiShoppingCart size={20} /> ADD TO CART
               </button>
               <button onClick={handleBuyNow} className="w-full bg-[#1A1A1A] text-white py-5 rounded-2xl font-bold tracking-[0.1em] hover:bg-black transition-all shadow-xl">
                  BUY NOW
               </button>
               <div className="flex items-center justify-center gap-6 pt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><FiShield /> Secure Payment</span>
                  <span className="flex items-center gap-2">COD Available</span>
               </div>
            </div>
          </div>
        </div>

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
    </div>
  );
}

// Icon fallbacks
const FiGrid = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const FiMapPin = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const FiArrowUp = (props) => <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
