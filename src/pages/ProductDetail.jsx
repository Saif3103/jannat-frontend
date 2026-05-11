import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiHeart, FiShoppingCart, FiTruck, FiShield, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewVideo, setReviewVideo] = useState(null);
  const [reviewImages, setReviewImages] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    api.get(`/products/${id}`).then(r => {
      setProduct(r.data.product);
      setActiveImg(0);
      if (r.data.product.sizes?.length) setSelectedSize(r.data.product.sizes[0].label);
      if (r.data.product.colors?.length) setSelectedColor(r.data.product.colors[0]);
      
      // Check if user can review
      if (user) {
        api.get('/orders/myorders').then(ordersRes => {
          const delivered = ordersRes.data.orders?.some(o => 
            o.orderStatus === 'Delivered' && 
            o.orderItems.some(item => (item.product?._id || item.product) === r.data.product._id)
          );
          setCanReview(delivered);
        });
      }

      // Fetch related
      if (r.data.product.category?._id) {
        api.get(`/products?category=${r.data.product.category._id}&limit=4`).then(rel => {
          setRelated(rel.data.products.filter(p => p._id !== id));
        });
      }
    }).catch(() => toast.error('Product not found')).finally(() => setLoading(false));
  }, [id, user]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, qty, selectedSize, selectedColor);
    navigate('/checkout');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    if (!canReview) { toast.error('Only customers with delivered orders can review'); return; }
    
    setReviewLoading(true);
    try {
      const fd = new FormData();
      fd.append('rating', reviewRating);
      fd.append('comment', reviewText);
      if (reviewVideo) {
        if (reviewVideo.size > 50 * 1024 * 1024) {
          toast.error('Video size should be less than 50MB');
          setReviewLoading(false);
          return;
        }
        fd.append('video', reviewVideo);
      }
      reviewImages.forEach(img => fd.append('images', img));

      await api.post(`/products/${id}/review`, fd);
      toast.success('Thank you for your feedback!');
      setReviewText(''); setReviewRating(5); setReviewVideo(null); setReviewImages([]);
      const r = await api.get(`/products/${id}`);
      setProduct(r.data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setReviewLoading(false); }
  };

  if (loading) return <div className="pt-24"><Loader fullscreen /></div>;
  if (!product) return <div className="pt-24 text-center text-amber-100/40 py-20 font-luxury text-2xl">Product not found</div>;

  const price = product.discountPrice || product.price;
  const discount = product.price && product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800'];

  return (
    <>
      <Helmet>
        <title>{product.name} | Jannat Rugs Co.</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Helmet>
      <div className="pt-20 min-h-screen">
        {/* Breadcrumb */}
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <nav className="text-xs text-amber-100/40 flex items-center gap-2">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-amber-400 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-amber-100/70 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Images Left Column (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden bg-[#E8E8E8] mb-4 flex items-center justify-center p-8" style={{ aspectRatio: '4/3' }}>
                <AnimatePresence mode="wait">
                    <motion.img key={activeImg}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      src={getImageUrl(images[activeImg])} alt={product.name} className="w-full h-full object-contain rounded-xl drop-shadow-2xl" />
                </AnimatePresence>
                {discount > 0 && <span className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded font-bold text-sm tracking-wider">-{discount}%</span>}
                <button onClick={() => toggleWishlist(product._id, !!user)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black transition-colors">
                  <FiHeart size={18} fill={isInWishlist(product._id) ? 'white' : 'none'} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)} className="text-white hover:text-[#D4AF37] transition-colors"><FiChevronLeft size={24}/></button>
                 <div className="flex gap-4 overflow-hidden flex-1 justify-center">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 bg-[#E8E8E8] transition-all p-2 ${activeImg === i ? 'border-[#D4AF37]' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                        <img src={getImageUrl(img)} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                 </div>
                 <button onClick={() => setActiveImg(p => (p + 1) % images.length)} className="text-white hover:text-[#D4AF37] transition-colors"><FiChevronRight size={24}/></button>
              </div>
              
              <div className="mt-10 max-w-2xl">
                <h3 className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-4">DESCRIPTION</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.description}</p>
                <button onClick={() => {document.getElementById('reviews-tabs').scrollIntoView({behavior: 'smooth'})}} className="text-[#D4AF37] text-sm font-semibold hover:underline flex items-center gap-1 transition-all">Read More <FiChevronRight size={16}/></button>
              </div>
            </div>

            {/* Details Right Column (5 cols) */}
            <div className="lg:col-span-5 pt-4">
              {product.category && (
                <Link to={`/shop?category=${product.category._id}`} className="inline-block mb-2">
                  <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase hover:text-amber-300 transition-colors">HANDMADE {product.category.name}</p>
                </Link>
              )}
              {!product.category && <p className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-2">HANDMADE DOORMAT</p>}
              <h1 className="font-luxury text-3xl md:text-[34px] leading-tight text-white mb-3">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                 <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} size={14} className={i < Math.round(product.rating || 4.8) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-[#333]'} fill={i < Math.round(product.rating || 4.8) ? 'currentColor' : 'none'} />
                    ))}
                 </div>
                 <span className="text-sm text-gray-400">{product.rating || '4.8'} ({product.numReviews || '124'} reviews)</span>
              </div>
              
              {/* Price */}
              <div className="flex items-end gap-4 mb-2">
                 <span className="text-[32px] text-[#D4AF37] font-semibold tracking-tight leading-none">₹{(price || 750).toLocaleString()}</span>
                 {discount > 0 && <span className="text-xl text-gray-500 line-through leading-none pb-0.5">₹{(product.price || 1050).toLocaleString()}</span>}
                 {discount > 0 && <span className="text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded text-xs font-medium bg-[#D4AF37]/5 mb-1 tracking-wide">You Save ₹{((product.price||1050) - (price||750)).toLocaleString()} ({discount||29}%)</span>}
              </div>
              <p className="text-xs text-gray-500 mb-8">Inclusive of all taxes</p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-[#151515] rounded-xl p-4 flex items-center gap-4 border border-white/5 shadow-lg">
                    <div className="text-[#D4AF37] p-2 bg-[#D4AF37]/5 rounded-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                    </div>
                    <div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Material</p><p className="text-sm text-white font-medium">{product.material || 'Natural Fibers'}</p></div>
                 </div>
                 <div className="bg-[#151515] rounded-xl p-4 flex items-center gap-4 border border-white/5 shadow-lg">
                    <div className="text-[#D4AF37] p-2 bg-[#D4AF37]/5 rounded-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
                    </div>
                    <div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Type</p><p className="text-sm text-white font-medium">{product.type || 'Handmade'}</p></div>
                 </div>
                 <div className="bg-[#151515] rounded-xl p-4 flex items-center gap-4 border border-white/5 shadow-lg">
                    <div className="text-[#D4AF37] p-2 bg-[#D4AF37]/5 rounded-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    </div>
                    <div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Stock</p><p className="text-sm text-white font-medium">{product.stock || '50'} available</p></div>
                 </div>
                 <div className="bg-[#151515] rounded-xl p-4 flex items-center gap-4 border border-white/5 shadow-lg">
                    <div className="text-[#D4AF37] p-2 bg-[#D4AF37]/5 rounded-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                    </div>
                    <div><p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Color</p><p className="text-sm text-white font-medium">{selectedColor || 'Sand'}</p></div>
                 </div>
              </div>
              
              {/* Color Selector */}
              <div className="mb-8">
                 <p className="text-sm text-gray-400 mb-3">Color: <span className="text-[#D4AF37]">{selectedColor || 'Sand'}</span></p>
                 <div className="flex gap-3">
                    {product.colors?.length > 0 ? product.colors.map(c => (
                       <button key={c} onClick={() => setSelectedColor(c)} className={`px-6 py-2 rounded border text-sm transition-all shadow-lg ${selectedColor === c ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 text-gray-400 bg-[#151515] hover:bg-[#222]'}`}>{c}</button>
                    )) : ['Sand', 'Stone'].map(c => (
                       <button key={c} onClick={() => setSelectedColor(c)} className={`px-6 py-2 rounded border text-sm transition-all shadow-lg ${selectedColor === c ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 text-gray-400 bg-[#151515] hover:bg-[#222]'}`}>{c}</button>
                    ))}
                 </div>
              </div>

              {/* Sizes (If any) */}
              {product.sizes?.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-3">Size: <span className="text-[#D4AF37]">{selectedSize}</span></p>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(s => (
                      <button key={s.label} onClick={() => setSelectedSize(s.label)}
                        className={`px-6 py-2 rounded border text-sm transition-all shadow-lg ${selectedSize === s.label ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 text-gray-400 bg-[#151515] hover:bg-[#222]'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity and Buy Buttons */}
              <div className="mb-6">
                 <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div>
                       <p className="text-sm text-gray-400 mb-2">Quantity</p>
                       <div className="flex items-center bg-[#111] border border-white/10 rounded overflow-hidden w-[120px] shadow-lg">
                          <button onClick={() => setQty(q => Math.max(1, q-1))} className="flex-1 py-3 text-[#D4AF37] hover:bg-[#222] transition-colors">−</button>
                          <span className="flex-1 text-center text-white font-medium">{qty}</span>
                          <button onClick={() => setQty(q => Math.min(product.stock || 99, q+1))} className="flex-1 py-3 text-[#D4AF37] hover:bg-[#222] transition-colors">+</button>
                       </div>
                    </div>
                    <div className="flex-1">
                       <button onClick={handleBuyNow} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8529] text-black font-bold tracking-wider py-3.5 rounded hover:brightness-110 shadow-[0_4px_15px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center gap-2">
                          <FiShoppingCart size={18}/> BUY NOW
                       </button>
                    </div>
                 </div>
              </div>
              
              {/* Add to Cart and Wishlist */}
              <div className="flex gap-4 mb-10">
                 <button onClick={handleAddToCart} className="flex-1 border border-[#D4AF37]/50 text-[#D4AF37] font-bold tracking-wider py-3.5 rounded hover:bg-[#D4AF37]/10 transition-colors flex items-center justify-center gap-2 shadow-lg">
                    <FiShoppingCart size={18}/> ADD TO CART
                 </button>
                 <button onClick={() => toggleWishlist(product._id, !!user)} className="w-[52px] flex items-center justify-center border border-white/10 rounded text-[#D4AF37] hover:bg-[#222] transition-colors shadow-lg">
                    <FiHeart size={20} fill={isInWishlist(product._id) ? 'currentColor' : 'none'}/>
                 </button>
              </div>
              
              {/* Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-b border-white/10 py-6 text-xs">
                 <div className="flex items-center gap-3">
                    <FiTruck size={24} className="text-[#D4AF37] flex-shrink-0"/>
                    <div><p className="text-white font-medium mb-0.5">Free Shipping</p><p className="text-gray-500 text-[10px]">On all orders</p></div>
                 </div>
                 <div className="flex items-center gap-3 border-l-0 sm:border-l border-white/10 sm:pl-6">
                    <FiShield size={24} className="text-[#D4AF37] flex-shrink-0"/>
                    <div><p className="text-white font-medium mb-0.5">Secure Payment</p><p className="text-gray-500 text-[10px]">100% secure checkout</p></div>
                 </div>
                 <div className="flex items-center gap-3 border-l-0 sm:border-l border-white/10 sm:pl-6">
                    <FiRefreshCw size={24} className="text-[#D4AF37] flex-shrink-0"/>
                    <div><p className="text-white font-medium mb-0.5">7-day Returns</p><p className="text-gray-500 text-[10px]">Easy return policy</p></div>
                 </div>
              </div>

            </div>
          </div>

          {/* Bottom Strip */}
          <div className="mt-16 mb-8">
             <div className="bg-[#151515] border border-white/5 rounded-2xl py-6 px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 shadow-xl">
                <div className="flex items-center gap-4">
                   <div className="text-[#D4AF37]"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg></div>
                   <div><p className="text-white font-medium text-sm">Handmade</p><p className="text-gray-500 text-xs mt-0.5">with care</p></div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-[#D4AF37]"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></div>
                   <div><p className="text-white font-medium text-sm">Eco-friendly</p><p className="text-gray-500 text-xs mt-0.5">materials</p></div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-[#D4AF37]"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                   <div><p className="text-white font-medium text-sm">Made in India</p><p className="text-gray-500 text-xs mt-0.5">with pride</p></div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-[#D4AF37]"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                   <div><p className="text-white font-medium text-sm">Premium Quality</p><p className="text-gray-500 text-xs mt-0.5">durable & long lasting</p></div>
                </div>
             </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex border-b border-amber-900/20 mb-8">
              {['description', 'reviews'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize tracking-wider transition-all ${activeTab === tab ? 'text-amber-400 border-b-2 border-amber-400' : 'text-amber-100/40 hover:text-amber-100/70'}`}>
                  {tab} {tab === 'reviews' && `(${product.numReviews})`}
                </button>
              ))}
            </div>

            {activeTab === 'description' ? (
              <div className="max-w-3xl">
                <p className="text-amber-100/60 leading-relaxed text-base mb-6">{product.description}</p>
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-xs px-3 py-1 border border-amber-900/30 rounded-full text-amber-100/50">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-3xl space-y-6">
                {product.reviews?.map((r, i) => (
                  <div key={i} className="glass-card p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 font-bold font-luxury">{r.name?.[0]}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-amber-100 font-medium">{r.name}</p>
                          <span className="text-amber-100/30 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, j) => <FiStar key={j} size={12} className={j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-amber-900'} fill={j < r.rating ? 'currentColor' : 'none'} />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-amber-100/60 text-sm leading-relaxed mb-4">{r.comment}</p>
                    
                    {/* Review Media */}
                    {(r.video || r.images?.length > 0) && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {r.video && (
                          <div className="w-40 aspect-video rounded-lg overflow-hidden bg-black border border-amber-900/30">
                            <video src={getImageUrl(r.video)} className="w-full h-full object-cover" controls />
                          </div>
                        )}
                        {r.images?.map((img, idx) => (
                          <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-amber-900/30">
                            <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover cursor-zoom-in" 
                              onClick={() => window.open(getImageUrl(img), '_blank')} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {product.reviews?.length === 0 && <p className="text-amber-100/30 text-center py-8">No reviews yet. Be the first!</p>}
                {user && canReview ? (
                  <form onSubmit={handleReview} className="glass-card p-6 mt-8 border border-amber-500/20 shadow-[0_0_30px_rgba(201,168,76,0.05)]">
                    <h3 className="font-luxury text-xl text-amber-400 mb-4 flex items-center gap-2">
                      <FiStar className="text-amber-500" /> Share Your Experience
                    </h3>
                    <div className="flex gap-2 mb-6">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewRating(s)} className="text-2xl transition-transform hover:scale-110">
                          <FiStar size={28} className={s <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-amber-900'} fill={s <= reviewRating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                    
                    <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} required
                      rows={4} placeholder="How does the carpet feel in your space? Tell us about the texture, color, and quality..."
                      className="w-full bg-white/5 border border-amber-900/20 rounded-xl px-4 py-3 text-sm text-amber-100 placeholder:text-amber-100/20 focus:outline-none focus:border-amber-500/40 transition-all mb-4 resize-none" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Video Upload */}
                      <div>
                        <label className="text-[10px] text-amber-100/50 block mb-2 uppercase tracking-widest">Add Video Review</label>
                        <label className="flex items-center gap-3 p-3 border border-dashed border-amber-900/30 rounded-xl cursor-pointer hover:border-amber-500/50 transition-all bg-white/5">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <FiTruck size={20} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] text-amber-100/80 font-medium truncate">{reviewVideo ? reviewVideo.name : 'Upload short video'}</p>
                            <p className="text-[9px] text-amber-100/30">MP4, MOV up to 10MB</p>
                          </div>
                          <input type="file" accept="video/*" className="hidden" onChange={e => setReviewVideo(e.target.files[0])} />
                        </label>
                      </div>
                      
                      {/* Photo Upload */}
                      <div>
                        <label className="text-[10px] text-amber-100/50 block mb-2 uppercase tracking-widest">Add Photos ({reviewImages.length}/5)</label>
                        <label className="flex items-center gap-3 p-3 border border-dashed border-amber-900/30 rounded-xl cursor-pointer hover:border-amber-500/50 transition-all bg-white/5">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                            <FiHeart size={20} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] text-amber-100/80 font-medium truncate">{reviewImages.length > 0 ? `${reviewImages.length} photos selected` : 'Upload photos'}</p>
                            <p className="text-[9px] text-amber-100/30">JPG, PNG up to 5 files</p>
                          </div>
                          <input type="file" accept="image/*" multiple className="hidden" 
                            onChange={e => setReviewImages(Array.from(e.target.files).slice(0, 5))} />
                        </label>
                      </div>
                    </div>

                    <button type="submit" disabled={reviewLoading} 
                      className="w-full btn-gold py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10">
                      {reviewLoading ? 'Submitting Feedback...' : 'Post Verified Review'}
                    </button>
                  </form>
                ) : user ? (
                  <div className="glass-card p-10 mt-8 text-center border border-amber-900/10">
                    <FiShield size={30} className="text-amber-100/20 mx-auto mb-4" />
                    <p className="text-amber-100/50 font-luxury text-xl mb-2">Verified Purchase Required</p>
                    <p className="text-amber-100/30 text-xs uppercase tracking-widest">Only customers who have received their delivery can share reviews.</p>
                  </div>
                ) : (
                  <div className="glass-card p-10 mt-8 text-center border border-amber-900/10">
                    <p className="text-amber-100/50 font-luxury text-xl mb-4">Join the Conversation</p>
                    <Link to="/login" className="btn-outline-gold px-8 py-2.5 inline-block">Login to Review</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-luxury text-3xl text-white mb-8 text-center">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.slice(0,4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
