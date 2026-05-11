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
        api.get('/orders/myorders').then(ordersRes => {
          const delivered = ordersRes.data.orders?.some(o => 
            o.orderStatus === 'Delivered' && 
            o.orderItems.some(item => (item.product?._id || item.product) === r.data.product._id)
          );
          setCanReview(delivered);
        });
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
      <div className="pt-24 pb-20 bg-white min-h-screen text-[#222]">
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
              <div className="relative rounded-3xl overflow-hidden bg-gray-50 mb-6 flex items-center justify-center p-12 border border-gray-100" style={{ aspectRatio: '4/3' }}>
                <AnimatePresence mode="wait">
                    <motion.img key={activeImg}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                      src={getImageUrl(images[activeImg])} alt={product.name} className="w-full h-full object-contain drop-shadow-xl" />
                </AnimatePresence>
                {discount > 0 && <span className="absolute top-6 left-6 bg-[#C9A84C] text-white px-4 py-1.5 rounded-full font-bold text-xs tracking-widest shadow-lg">-{discount}% OFF</span>}
                <button onClick={() => toggleWishlist(product._id, !!user)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-xl border border-gray-100 group">
                  <FiHeart size={20} className="group-active:scale-125 transition-transform" fill={isInWishlist(product._id) ? '#ef4444' : 'none'} stroke={isInWishlist(product._id) ? '#ef4444' : 'currentColor'} />
                </button>
              </div>
              <div className="flex items-center gap-4 px-4">
                 <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#C9A84C] hover:bg-gray-50 transition-all border border-gray-100 shadow-sm"><FiChevronLeft size={24}/></button>
                 <div className="flex gap-4 overflow-x-auto flex-1 justify-center no-scrollbar py-2">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImg(i)}
                        className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 bg-gray-50 transition-all p-2 ${activeImg === i ? 'border-[#C9A84C] shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={getImageUrl(img)} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                 </div>
                 <button onClick={() => setActiveImg(p => (p + 1) % images.length)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#C9A84C] hover:bg-gray-50 transition-all border border-gray-100 shadow-sm"><FiChevronRight size={24}/></button>
              </div>
              
              <div className="mt-16 bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                <h3 className="text-[#C9A84C] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">The Artisan Details</h3>
                <p className="text-gray-600 text-base leading-relaxed font-medium">{product.description}</p>
              </div>
            </div>

            {/* Details Right Column */}
            <div className="lg:col-span-5 pt-4">
              <div className="mb-8">
                {product.category && (
                  <Link to={`/shop?category=${product.category._id}`} className="inline-block mb-3">
                    <span className="bg-[#FFF9E6] text-[#C9A84C] text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border border-[#C9A84C]/20">{product.category.name} Collection</span>
                  </Link>
                )}
                <h1 className="text-4xl md:text-[42px] font-bold leading-[1.1] text-gray-900 mb-5 tracking-tight">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                   <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={16} className={i < Math.round(product.rating || 4.8) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-200'} />
                      ))}
                   </div>
                   <span className="text-sm text-gray-400 font-bold">{product.rating || '4.8'} <span className="font-medium text-gray-300">|</span> {product.numReviews || '124'} verified reviews</span>
                </div>
                
                <div className="flex items-baseline gap-4 mb-2">
                   <span className="text-[40px] text-gray-900 font-bold tracking-tighter">₹{price?.toLocaleString()}</span>
                   {discount > 0 && <span className="text-xl text-gray-300 line-through font-medium">₹{product.price?.toLocaleString()}</span>}
                </div>
                {discount > 0 && <p className="text-[#C9A84C] text-sm font-bold mb-8">Exclusive Online Offer: Save ₹{(product.price - price).toLocaleString()} Today</p>}
              </div>

              {/* Selection Sections */}
              <div className="space-y-10 mb-10">
                {/* Color */}
                <div>
                   <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Select Color: <span className="text-gray-900">{selectedColor || 'Sand'}</span></p>
                   <div className="flex flex-wrap gap-3">
                      {(product.colors?.length > 0 ? product.colors : ['Sand', 'Stone']).map(c => (
                         <button key={c} onClick={() => setSelectedColor(c)} 
                           className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${selectedColor === c ? 'border-[#C9A84C] text-[#C9A84C] bg-[#FFF9E6]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>{c}</button>
                      ))}
                   </div>
                </div>

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Select Size (Feet): <span className="text-gray-900">{selectedSize?.label}</span></p>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map(s => (
                        <button key={s.label} onClick={() => setSelectedSize(s)}
                          className={`px-6 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${selectedSize?.label === s.label ? 'border-[#C9A84C] text-[#C9A84C] bg-[#FFF9E6]' : 'border-gray-100 text-gray-500 hover:border-gray-300'}`}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Qty & Action */}
                <div className="space-y-5">
                   <div className="flex items-end gap-5">
                      <div className="w-32">
                         <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Quantity</p>
                         <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl h-[56px] px-2 shadow-inner">
                            <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors font-bold text-xl">−</button>
                            <span className="flex-1 text-center text-gray-900 font-bold">{qty}</span>
                            <button onClick={() => setQty(q => Math.min(product.stock || 99, q+1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors font-bold text-xl">+</button>
                         </div>
                      </div>
                      <button onClick={handleBuyNow} className="flex-1 h-[56px] bg-[#222] text-white font-bold tracking-[0.1em] rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
                         <FiShoppingBag size={20}/> BUY IT NOW
                      </button>
                   </div>
                   <button onClick={handleAddToCart} className="w-full h-[56px] border-2 border-gray-900 text-gray-900 font-bold tracking-[0.1em] rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95">
                      <FiShoppingCart size={20}/> ADD TO CART
                   </button>
                </div>
              </div>
              
              {/* Delivery & Returns Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-10 border-t border-gray-100">
                 <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-[#FFF9E6] rounded-full flex items-center justify-center text-[#C9A84C] mb-3 shadow-sm border border-[#C9A84C]/10"><FiTruck size={22}/></div>
                    <p className="text-gray-900 font-bold text-xs">Standard Delivery</p>
                    <p className="text-gray-400 text-[10px] mt-1">Ready in {product.processingTime || '1-2 weeks'}</p>
                 </div>
                 <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center text-blue-600 mb-3 shadow-sm border border-blue-100"><FiShield size={22}/></div>
                    <p className="text-gray-900 font-bold text-xs">Returns Policy</p>
                    <p className="text-gray-400 text-[10px] mt-1">{product.returnPolicy || '7-Day Guarantee'}</p>
                 </div>
                 <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-[#ECFDF5] rounded-full flex items-center justify-center text-green-600 mb-3 shadow-sm border border-green-100"><FiRefreshCw size={22}/></div>
                    <p className="text-gray-900 font-bold text-xs">Origin</p>
                    <p className="text-gray-400 text-[10px] mt-1">Mirzapur, India ({product.originPostcode || '281001'})</p>
                 </div>
              </div>

              {/* Product Specs List */}
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-4">
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2">Specifications</h3>
                 <div className="flex justify-between items-center text-sm border-b border-gray-200/50 pb-3">
                    <span className="text-gray-400 font-medium">Material</span>
                    <span className="text-gray-900 font-bold">{product.material || 'Premium Wool'}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-gray-200/50 pb-3">
                    <span className="text-gray-400 font-medium">Craft Type</span>
                    <span className="text-gray-900 font-bold">{product.type || 'Handmade'}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm border-b border-gray-200/50 pb-3">
                    <span className="text-gray-400 font-medium">Availability</span>
                    <span className="text-gray-900 font-bold">{product.stock > 0 ? 'In Stock' : 'Made to Order'}</span>
                 </div>
                 {product.manufacturerInfo && (
                   <div className="pt-2">
                      <span className="text-gray-400 text-xs font-medium block mb-1">Manufacturer Information</span>
                      <span className="text-gray-500 text-xs leading-relaxed">{product.manufacturerInfo}</span>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* Product Tabs Section */}
          <div className="mt-24" id="reviews-tabs">
            <div className="flex gap-10 border-b border-gray-100 mb-12 justify-center">
              {['description', 'reviews'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}>
                  {tab} {tab === 'reviews' && `(${product.numReviews})`}
                  {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />}
                </button>
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              {activeTab === 'description' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p className="text-gray-600 leading-relaxed text-lg font-medium text-center italic">"Crafting more than just a rug, but a legacy for your home."</p>
                  <p className="text-gray-500 leading-relaxed text-base">{product.description}</p>
                  {product.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center pt-6">
                      {product.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-gray-400 font-bold uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-8">
                    {product.reviews?.map((r, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#C9A84C] font-bold text-lg border border-gray-100 shadow-inner">{r.name?.[0]}</div>
                            <div>
                              <p className="text-gray-900 font-bold">{r.name}</p>
                              <div className="flex gap-0.5 mt-1">
                                {[...Array(5)].map((_, j) => <FiStar key={j} size={14} className={j < r.rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-100'} />)}
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-300 text-xs font-medium">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 text-base font-medium leading-relaxed italic">"{r.comment}"</p>
                        
                        {(r.video || r.images?.length > 0) && (
                          <div className="flex flex-wrap gap-3 mt-6">
                            {r.video && (
                              <div className="w-48 aspect-video rounded-2xl overflow-hidden bg-black border border-gray-100">
                                <video src={getImageUrl(r.video)} className="w-full h-full object-cover" controls />
                              </div>
                            )}
                            {r.images?.map((img, idx) => (
                              <div key={idx} className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover cursor-zoom-in hover:scale-110 transition-transform duration-500" 
                                  onClick={() => window.open(getImageUrl(img), '_blank')} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {product.reviews?.length === 0 && (
                      <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No stories yet. Be the first to share yours.</p>
                      </div>
                    )}
                  </div>

                  {user && canReview ? (
                    <form onSubmit={handleReview} className="bg-[#F8F9FA] p-10 rounded-[3rem] border-2 border-gray-100 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-gray-900"><FiStar size={100} /></div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified Customer Feedback</h3>
                      <p className="text-gray-500 text-sm mb-8 font-medium">How does it feel in your home? Your experience matters.</p>
                      
                      <div className="flex gap-4 mb-8">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} type="button" onClick={() => setReviewRating(s)} className="transition-transform hover:scale-125">
                            <FiStar size={32} className={s <= reviewRating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>
                      
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} required
                        rows={5} placeholder="The texture is so soft, and the colors are even more vibrant than the pictures..."
                        className="w-full bg-white border border-gray-200 rounded-3xl px-6 py-5 text-gray-700 placeholder:text-gray-300 focus:ring-2 focus:ring-[#C9A84C]/20 outline-none transition-all mb-6 resize-none shadow-sm" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <label className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-white hover:border-[#C9A84C] transition-all group bg-gray-50">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#C9A84C] shadow-sm"><FiTruck size={24} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-widest">{reviewVideo ? reviewVideo.name : 'Add Video'}</p>
                            <p className="text-[10px] text-gray-400 font-medium">MP4/MOV under 20MB</p>
                          </div>
                          <input type="file" accept="video/*" className="hidden" onChange={e => setReviewVideo(e.target.files[0])} />
                        </label>
                        
                        <label className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-white hover:border-[#C9A84C] transition-all group bg-gray-50">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-[#C9A84C] shadow-sm"><FiHeart size={24} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate uppercase tracking-widest">{reviewImages.length > 0 ? `${reviewImages.length} Photos` : 'Add Photos'}</p>
                            <p className="text-[10px] text-gray-400 font-medium">JPG/PNG up to 5 files</p>
                          </div>
                          <input type="file" accept="image/*" multiple className="hidden" 
                            onChange={e => setReviewImages(Array.from(e.target.files).slice(0, 5))} />
                        </label>
                      </div>

                      <button type="submit" disabled={reviewLoading} 
                        className="w-full bg-[#222] text-white py-4 rounded-[2rem] font-bold tracking-[0.1em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
                        {reviewLoading ? 'Publishing Your Story...' : 'POST VERIFIED REVIEW'}
                      </button>
                    </form>
                  ) : user ? (
                    <div className="bg-gray-50 p-16 text-center rounded-[3rem] border border-gray-100">
                      <FiShield size={40} className="text-gray-200 mx-auto mb-6" />
                      <p className="text-gray-900 font-bold text-xl mb-3 tracking-tight">Purchase Verification Required</p>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">To maintain authenticity, only verified customers who have received this product can leave a review.</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-16 text-center rounded-[3rem] border border-gray-100">
                      <p className="text-gray-900 font-bold text-xl mb-6 tracking-tight">Share Your Experience</p>
                      <Link to="/login" className="px-10 py-3.5 bg-[#222] text-white rounded-full font-bold text-sm tracking-widest hover:bg-black transition-all shadow-xl">LOGIN TO REVIEW</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-32 pt-20 border-t border-gray-100">
              <div className="text-center mb-16">
                <p className="text-[#C9A84C] text-[10px] font-bold tracking-[0.4em] uppercase mb-3">Curated Selection</p>
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">You May Also Like</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {related.slice(0,4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
