import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiHeart, FiShoppingCart, FiTruck, FiShield, FiRefreshCw, FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
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
      if (r.data.product.sizes?.length) setSelectedSize(r.data.product.sizes[0]);
      if (r.data.product.colors?.length) setSelectedColor(r.data.product.colors[0]);
      
      if (user) {
        api.get('/orders/my-orders').then(ordersRes => {
          const delivered = ordersRes.data.orders?.some(o => 
            o.orderStatus === 'Delivered' && 
            o.orderItems.some(item => (item.product?._id || item.product) === r.data.product._id)
          );
          setCanReview(delivered);
        }).catch(() => setCanReview(false));
      }

      if (r.data.product.category?._id) {
        api.get(`/products?category=${r.data.product.category._id}&limit=4`).then(rel => {
          setRelated(rel.data.products.filter(p => p._id !== id));
        });
      }
    }).catch(() => toast.error('Product not found')).finally(() => setLoading(false));
  }, [id, user]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty, selectedSize?.label, selectedColor);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, qty, selectedSize?.label, selectedColor);
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
      if (reviewVideo) fd.append('video', reviewVideo);
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
  if (!product) return <div className="pt-24 text-center text-gray-400 py-20 font-luxury text-2xl">Product not found</div>;

  const basePrice = product.discountPrice || product.price;
  const price = selectedSize?.price || basePrice;
  const discount = product.price && product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=800'];

  return (
    <>
      <Helmet>
        <title>{product.name} | Jannat Rugs Co.</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Helmet>
      <div className="pt-24 pb-20 min-h-screen">
        {/* Breadcrumb */}
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <nav className="text-xs text-gray-400 flex items-center gap-2 font-medium">
            <Link to="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-[#C9A84C] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="max-w-[1300px] mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Images Left Column */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 mb-4 sm:mb-6 flex items-center justify-center p-4 sm:p-12 border border-gray-100" style={{ aspectRatio: '1/1' }}>
                <AnimatePresence mode="wait">
                    <motion.img key={activeImg}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                      src={getImageUrl(images[activeImg])} alt={product.name} className="w-full h-full object-contain drop-shadow-xl" />
                </AnimatePresence>
                {discount > 0 && <span className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-[#C9A84C] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-bold text-[10px] sm:text-xs tracking-widest shadow-lg">-{discount}% OFF</span>}
                <button onClick={() => toggleWishlist(product._id, !!user)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-xl border border-gray-100 group">
                  <FiHeart size={18} className="group-active:scale-125 transition-transform" fill={isInWishlist(product._id) ? '#ef4444' : 'none'} stroke={isInWishlist(product._id) ? '#ef4444' : 'currentColor'} />
                </button>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 px-2 sm:px-4">
                 <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#C9A84C] hover:bg-gray-50 transition-all border border-gray-100 shadow-sm"><FiChevronLeft size={20}/></button>
                 <div className="flex gap-2 sm:gap-4 overflow-x-auto flex-1 justify-center no-scrollbar py-2">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 bg-gray-50 transition-all p-1 sm:p-2 ${activeImg === i ? 'border-[#C9A84C] shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={getImageUrl(img)} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                 </div>
                 <button onClick={() => setActiveImg(p => (p + 1) % images.length)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#C9A84C] hover:bg-gray-50 transition-all border border-gray-100 shadow-sm"><FiChevronRight size={20}/></button>
              </div>
              
              <div className="mt-8 sm:mt-16 bg-gray-50 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-gray-100">
                <h3 className="text-[#C9A84C] text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase mb-4">The Artisan Details</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium">{product.description}</p>
              </div>
            </div>

            {/* Details Right Column */}
            <div className="lg:col-span-5 pt-0 lg:pt-4">
              <div className="mb-6 sm:mb-8">
                {product.category && (
                  <Link to={`/shop?category=${product.category._id}`} className="inline-block mb-3">
                    <span className="bg-[#FFF9E6] text-[#C9A84C] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border border-[#C9A84C]/20">{product.category.name} Collection</span>
                  </Link>
                )}
                <h1 className="text-2xl sm:text-4xl md:text-[42px] font-bold leading-[1.2] sm:leading-[1.1] text-gray-900 mb-3 sm:mb-5 tracking-tight">{product.name}</h1>
                
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100">
                   <div className="flex gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={14} className={i < Math.round(Number(product.rating) || 4.8) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-200'} />
                      ))}
                   </div>
                   <span className="text-xs sm:text-sm text-gray-400 font-bold">{product.rating || '4.8'} <span className="font-medium text-gray-300">|</span> {product.numReviews || '124'} reviews</span>
                </div>
                
                <div className="flex items-baseline gap-3 sm:gap-4 mb-2">
                   <span className="text-3xl sm:text-[40px] text-gray-900 font-bold tracking-tighter">₹{price?.toLocaleString()}</span>
                   {discount > 0 && <span className="text-lg sm:text-xl text-gray-300 line-through font-medium">₹{product.price?.toLocaleString()}</span>}
                </div>
                {discount > 0 && <p className="text-[#C9A84C] text-[10px] sm:text-sm font-bold mb-6 sm:mb-8">Exclusive Online Offer: Save ₹{(product.price - price).toLocaleString()} Today</p>}
              </div>

              {/* Selection Sections */}
              <div className="space-y-8 sm:space-y-10 mb-10">
                {/* Color */}
                <div>
                   <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">Select Color: <span className="text-gray-900">{selectedColor || 'Sand'}</span></p>
                   <div className="flex flex-wrap gap-2 sm:gap-3">
                      {(product.colors?.length > 0 ? product.colors : ['Sand', 'Stone']).map(c => (
                         <button key={c} onClick={() => setSelectedColor(c)} 
                           className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all ${selectedColor === c ? 'border-[#C9A84C] text-[#C9A84C] bg-[#FFF9E6]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>{c}</button>
                      ))}
                   </div>
                </div>

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">Select Size (Feet): <span className="text-gray-900">{selectedSize?.label}</span></p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {product.sizes.map(s => (
                        <button key={s.label} onClick={() => setSelectedSize(s)}
                          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all ${selectedSize?.label === s.label ? 'border-[#C9A84C] text-[#C9A84C] bg-[#FFF9E6]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Qty & Action */}
                <div className="space-y-4 sm:space-y-5">
                   <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
                      <div className="w-full sm:w-32">
                         <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">Quantity</p>
                         <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl h-[48px] sm:h-[56px] px-2 shadow-inner">
                            <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors font-bold text-lg sm:text-xl">−</button>
                            <span className="flex-1 text-center text-gray-900 font-bold">{qty}</span>
                            <button onClick={() => setQty(q => Math.min(product.stock || 99, q+1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors font-bold text-lg sm:text-xl">+</button>
                         </div>
                      </div>
                      <button onClick={handleBuyNow} className="flex-1 h-[48px] sm:h-[56px] bg-[#222] text-white font-bold tracking-[0.1em] rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 sm:gap-3 active:scale-95">
                         <FiShoppingBag size={18} className="sm:w-5 sm:h-5"/> BUY IT NOW
                      </button>
                   </div>
                   <button onClick={handleAddToCart} className="w-full h-[48px] sm:h-[56px] border-2 border-gray-900 text-gray-900 font-bold tracking-[0.1em] rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 sm:gap-3 active:scale-95">
                      <FiShoppingCart size={18} className="sm:w-5 sm:h-5"/> ADD TO CART
                   </button>
                </div>
              </div>
              
              {/* Delivery & Returns Info */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 py-8 sm:py-10 border-t border-gray-100">
                 <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFF9E6] rounded-full flex items-center justify-center text-[#C9A84C] mb-2 sm:mb-3 shadow-sm border border-[#C9A84C]/10"><FiTruck size={18} className="sm:w-[22px] sm:h-[22px]"/></div>
                    <p className="text-gray-900 font-bold text-[9px] sm:text-xs">Standard</p>
                    <p className="text-gray-400 text-[8px] mt-0.5 sm:mt-1">{product.processingTime || '1-2 weeks'}</p>
                 </div>
                 <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center text-blue-600 mb-2 sm:mb-3 shadow-sm border border-blue-100"><FiShield size={18} className="sm:w-[22px] sm:h-[22px]"/></div>
                    <p className="text-gray-900 font-bold text-[9px] sm:text-xs">Returns</p>
                    <p className="text-gray-400 text-[8px] mt-0.5 sm:mt-1">{product.returnPolicy || '7-Day'}</p>
                 </div>
                 <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ECFDF5] rounded-full flex items-center justify-center text-green-600 mb-2 sm:mb-3 shadow-sm border border-green-100"><FiRefreshCw size={18} className="sm:w-[22px] sm:h-[22px]"/></div>
                    <p className="text-gray-900 font-bold text-[9px] sm:text-xs">Origin</p>
                    <p className="text-gray-400 text-[8px] mt-0.5 sm:mt-1">India</p>
                 </div>
              </div>

              {/* Product Specs List */}
              <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 space-y-3 sm:space-y-4">
                 <h3 className="text-[10px] sm:text-sm font-bold text-gray-900 uppercase tracking-widest mb-1 sm:mb-2">Specifications</h3>
                 <div className="flex justify-between items-center text-xs sm:text-sm border-b border-gray-200/50 pb-2 sm:pb-3">
                    <span className="text-gray-400 font-medium">Material</span>
                    <span className="text-gray-900 font-bold">{product.material || 'Premium Wool'}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs sm:text-sm border-b border-gray-200/50 pb-2 sm:pb-3">
                    <span className="text-gray-400 font-medium">Craft Type</span>
                    <span className="text-gray-900 font-bold">{product.type || 'Handmade'}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs sm:text-sm border-b border-gray-200/50 pb-2 sm:pb-3">
                    <span className="text-gray-400 font-medium">Stock Status</span>
                    <span className="text-gray-900 font-bold">{product.stock > 0 ? 'In Stock' : 'Made to Order'}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Product Tabs Section */}
          <div className="mt-16 sm:mt-24" id="reviews-tabs">
            <div className="flex gap-6 sm:gap-10 border-b border-gray-100 mb-8 sm:mb-12 justify-center">
              {['description', 'reviews'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-3 sm:pb-4 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}>
                  {tab} {tab === 'reviews' && `(${product.numReviews})`}
                  {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />}
                </button>
              ))}
            </div>

            <div className="max-w-4xl mx-auto px-2">
              {activeTab === 'description' ? (
                <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-medium text-center italic">"Preserving the soul of human craftsmanship."</p>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{product.description}</p>
                  {product.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center pt-4 sm:pt-6">
                      {product.tags.map(tag => (
                        <span key={tag} className="text-[8px] sm:text-[10px] px-3 sm:px-4 py-1 sm:py-1.5 bg-gray-50 border border-gray-100 rounded-full text-gray-400 font-bold uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6 sm:space-y-8">
                    {product.reviews?.map((r, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4 sm:mb-6">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center text-[#C9A84C] font-bold text-base sm:text-lg border border-gray-100 shadow-inner">{r.name?.[0]}</div>
                            <div>
                              <p className="text-gray-900 font-bold text-sm sm:text-base">{r.name}</p>
                              <div className="flex gap-0.5 mt-0.5">
                                {[...Array(5)].map((_, j) => <FiStar key={j} size={12} className={j < (Number(r.rating) || 5) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-100'} />)}
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-300 text-[10px] sm:text-xs font-medium">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed italic">"{r.comment}"</p>
                        
                        {(r.video || r.images?.length > 0) && (
                          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                            {r.video && (
                              <div className="w-32 sm:w-48 aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-gray-100">
                                <video src={getImageUrl(r.video)} className="w-full h-full object-cover" controls />
                              </div>
                            )}
                            {r.images?.map((img, idx) => (
                              <div key={idx} className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover cursor-zoom-in hover:scale-110 transition-transform duration-500" 
                                  onClick={() => window.open(getImageUrl(img), '_blank')} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {product.reviews?.length === 0 && (
                      <div className="text-center py-16 sm:py-20 bg-gray-50 rounded-[2rem] sm:rounded-[3rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm px-4">No stories yet. Be the first to share yours.</p>
                      </div>
                    )}
                  </div>

                  {user && canReview ? (
                    <form onSubmit={handleReview} className="bg-[#F8F9FA] p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-2 border-gray-100 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-gray-900 hidden sm:block"><FiStar size={100} /></div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Verified Feedback</h3>
                      <p className="text-gray-500 text-xs sm:text-sm mb-6 sm:mb-8 font-medium">How does it feel in your home?</p>
                      
                      <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} type="button" onClick={() => setReviewRating(s)} className="transition-transform hover:scale-125">
                            <FiStar size={24} className={s <= reviewRating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>
                      
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} required
                        rows={4} placeholder="Your thoughts..."
                        className="w-full bg-white border border-gray-200 rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-4 sm:py-5 text-sm text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-[#C9A84C]/20 outline-none transition-all mb-4 sm:mb-6 resize-none shadow-sm" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <label className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-dashed border-gray-200 rounded-[1.5rem] sm:rounded-[2rem] cursor-pointer hover:bg-white hover:border-[#C9A84C] transition-all group bg-gray-50">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#C9A84C] shadow-sm"><FiTruck size={20} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-gray-900 truncate uppercase tracking-widest">{reviewVideo ? reviewVideo.name : 'Add Video'}</p>
                            <p className="text-[8px] text-gray-400 font-medium">MP4 under 20MB</p>
                          </div>
                          <input type="file" accept="video/*" className="hidden" onChange={e => setReviewVideo(e.target.files[0])} />
                        </label>
                        
                        <label className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-dashed border-gray-200 rounded-[1.5rem] sm:rounded-[2rem] cursor-pointer hover:bg-white hover:border-[#C9A84C] transition-all group bg-gray-50">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#C9A84C] shadow-sm"><FiHeart size={20} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-gray-900 truncate uppercase tracking-widest">{reviewImages.length > 0 ? `${reviewImages.length} Photos` : 'Add Photos'}</p>
                            <p className="text-[8px] text-gray-400 font-medium">JPG/PNG up to 5</p>
                          </div>
                          <input type="file" accept="image/*" multiple className="hidden" 
                            onChange={e => setReviewImages(Array.from(e.target.files).slice(0, 5))} />
                        </label>
                      </div>

                      <button type="submit" disabled={reviewLoading} 
                        className="w-full bg-[#222] text-white py-3.5 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] font-bold tracking-[0.1em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 text-sm sm:text-base">
                        {reviewLoading ? 'Publishing...' : 'POST REVIEW'}
                      </button>
                    </form>
                  ) : user ? (
                    <div className="bg-gray-50 p-10 sm:p-16 text-center rounded-[2rem] sm:rounded-[3rem] border border-gray-100">
                      <FiShield size={32} className="text-gray-200 mx-auto mb-4 sm:mb-6" />
                      <p className="text-gray-900 font-bold text-lg sm:text-xl mb-2 sm:mb-3 tracking-tight">Purchase Required</p>
                      <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto font-medium">To maintain authenticity, only verified customers who have received this product can leave a review.</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-10 sm:p-16 text-center rounded-[2rem] sm:rounded-[3rem] border border-gray-100">
                      <p className="text-gray-900 font-bold text-lg sm:text-xl mb-6 tracking-tight">Share Your Experience</p>
                      <Link to="/login" className="px-8 sm:px-10 py-3 sm:py-3.5 bg-[#222] text-white rounded-full font-bold text-xs sm:text-sm tracking-widest hover:bg-black transition-all shadow-xl uppercase">Login to review</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20 sm:mt-32 pt-12 sm:pt-20 border-t border-gray-100">
              <div className="text-center mb-10 sm:mb-16">
                <p className="text-[#C9A84C] text-[10px] font-bold tracking-[0.4em] uppercase mb-2 sm:mb-3">Curated Selection</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">You May Also Like</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                {related.slice(0,4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
