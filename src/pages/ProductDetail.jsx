import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative rounded-2xl overflow-hidden bg-amber-950/20 border border-amber-900/20 mb-4" style={{ aspectRatio: '1' }}>
                <AnimatePresence mode="wait">
                    <motion.img key={activeImg}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      src={getImageUrl(images[activeImg])} alt={product.name} className="w-full h-full object-cover" />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-amber-500/30 transition-colors">
                      <FiChevronLeft />
                    </button>
                    <button onClick={() => setActiveImg(p => (p + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-amber-500/30 transition-colors">
                      <FiChevronRight />
                    </button>
                  </>
                )}
                {discount > 0 && <span className="absolute top-4 left-4 badge-gold text-sm">-{discount}%</span>}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-amber-500' : 'border-amber-900/30 opacity-60 hover:opacity-100'}`}>
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              {product.category && (
                <Link to={`/shop?category=${product.category._id}`}
                  className="text-xs tracking-widest uppercase text-amber-400/70 hover:text-amber-400 transition-colors">
                  {product.category.name}
                </Link>
              )}
              <h1 className="font-luxury text-3xl md:text-4xl text-white mt-2 mb-3">{product.name}</h1>

              {/* Rating */}
              {product.numReviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} size={14} className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-amber-900'}
                        fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-sm text-amber-100/50">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-amber-900/20">
                <span className="font-luxury text-4xl text-amber-400">₹{price?.toLocaleString()}</span>
                {discount > 0 && <span className="text-amber-100/30 text-xl line-through">₹{product.price?.toLocaleString()}</span>}
                {product.offerLabel && <span className="badge-gold">{product.offerLabel}</span>}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                {[
                  { label: 'Material', value: product.material },
                  { label: 'Type', value: product.type },
                  { label: 'Stock', value: product.stock > 0 ? `${product.stock} available` : 'Out of stock' },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} className="glass-card p-3">
                    <p className="text-amber-100/40 text-xs mb-1">{d.label}</p>
                    <p className="text-amber-100 font-medium">{d.value}</p>
                  </div>
                ))}
              </div>

              {/* Size */}
              {product.sizes?.length > 0 && (
                <div className="mb-5">
                  <p className="text-amber-100/60 text-sm mb-2">Size: <span className="text-amber-400">{selectedSize}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button key={s.label} onClick={() => setSelectedSize(s.label)}
                        className={`px-4 py-2 rounded border text-sm transition-all ${selectedSize === s.label ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-amber-900/30 text-amber-100/50 hover:border-amber-700'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <p className="text-amber-100/60 text-sm mb-2">Color: <span className="text-amber-400">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(c => (
                      <button key={c} onClick={() => setSelectedColor(c)}
                        className={`px-4 py-2 rounded border text-sm transition-all ${selectedColor === c ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-amber-900/30 text-amber-100/50 hover:border-amber-700'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Buttons */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-amber-900/30 rounded overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-amber-400 hover:bg-amber-500/10 transition-colors">−</button>
                  <span className="px-4 py-2 text-amber-100 min-w-[40px] text-center">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))} className="px-4 py-2 text-amber-400 hover:bg-amber-500/10 transition-colors">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={product.stock === 0}
                  className="flex-1 btn-gold flex items-center justify-center gap-2 py-3" id="add-to-cart">
                  <FiShoppingCart size={18} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button onClick={() => toggleWishlist(product._id, !!user)}
                  className={`w-12 h-12 rounded border flex items-center justify-center transition-all ${isInWishlist(product._id) ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'border-amber-900/30 text-amber-100/50 hover:border-amber-500'}`}>
                  <FiHeart size={18} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-amber-100/50">
                {[{ icon: FiTruck, label: 'Free Shipping' }, { icon: FiShield, label: 'Secure Payment' }, { icon: FiRefreshCw, label: '7-day Returns' }].map(({ icon: Icon, label }) => (
                  <div key={label} className="p-3 border border-amber-900/20 rounded-lg flex flex-col items-center gap-1 hover:border-amber-800/40 transition-colors">
                    <Icon size={18} className="text-amber-400" />{label}
                  </div>
                ))}
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
