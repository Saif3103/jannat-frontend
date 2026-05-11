import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiStar, FiShield, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';
import { GiQueenCrown } from 'react-icons/gi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import api, { BASE_URL } from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80';
  if (typeof url !== 'string') return url;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

const HERO_BGS = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2400&q=100",
  "https://images.unsplash.com/photo-1600166898405-da9535204843?w=2400&q=100",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=2400&q=100",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=2400&q=100",
  "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=2400&q=100"
];

const TRUST_BADGES = [
  { icon: FiShield, label: "100% Authentic", desc: "Genuine handmade products" },
  { icon: FiTruck, label: "Free Shipping", desc: "On orders above ₹5,000" },
  { icon: FiRefreshCw, label: "Easy Returns", desc: "7-day return policy" },
  { icon: FiAward, label: "Award Winning", desc: "Premium quality guaranteed" },
];

const CATEGORIES_DEFAULT = [
  { name: "Persian Handmade", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { name: "Handwoven Wool", img: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80" },
  { name: "Turkish Kilims", img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80" },
  { name: "Kashmiri Silk", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { name: "Vintage Craft", img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", location: "Mumbai", rating: 5, comment: "Absolutely stunning carpet! The quality is exceptional and it's transformed my living room completely. Will definitely order again." },
  { name: "Rahul Gupta", location: "Delhi", rating: 5, comment: "Jannat Rugs Co. delivers true luxury. My Persian rug arrived beautifully packaged and exceeded all expectations." },
  { name: "Ayesha Khan", location: "Hyderabad", rating: 5, comment: "The craftsmanship is unparalleled. Every thread tells a story. Customer service was also impeccable." },
  { name: "Vikram Mehta", location: "Bangalore", rating: 5, comment: "Ordered a custom silk carpet. The artisans are true masters. My home feels like a palace now!" },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [offers, setOffers] = useState([]);
  const [videoReviews, setVideoReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [featured, best, newArr, cats, setts, offs, vReviews] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?bestSeller=true&limit=4'),
          api.get('/products?newArrival=true&limit=4'),
          api.get('/categories'),
          api.get('/settings'),
          api.get('/offers'),
          api.get('/video-reviews'),
        ]);
        setFeaturedProducts(featured.data.products);
        setBestSellers(best.data.products);
        setNewArrivals(newArr.data.products);
        setCategories(cats.data.categories.slice(0, 6));
        setSettings(setts.data.settings);
        setOffers(offs.data.offers);
        setVideoReviews(vReviews.data.reviews.slice(0, 2));
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>Jannat Rugs Co. – Premium Handmade Carpets & Luxury Rugs</title>
        <meta name="description" content="Discover our exquisite collection of handmade Persian carpets, luxury rugs, and premium floor coverings. Crafted by master artisans with generations of expertise." />
      </Helmet>

      <div style={{ background: '#0D0D0D' }}>
        {/* HERO SECTION */}
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            key={settings?.heroVideo}
            className="w-full h-full object-cover"
          >
            <source src={settings?.heroVideo ? getImageUrl(settings.heroVideo) : "https://cdn.shopify.com/videos/c/o/v/e4f8cd624bcb4347b9970e005d0bb736.mp4"} type="video/mp4" />
          </video>
          {/* Theme Overlay (Keeps the exact same luxury dark aesthetic) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.7) 0%, rgba(13,13,13,0.4) 50%, rgba(13,13,13,0.85) 100%)' }} />
        </div>
        
        <div className="relative z-10 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center w-full mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex flex-col items-center justify-center w-full"
          >
            {/* Massive Logo */}
            <img src="/logo.png" alt="Jannat Rugs Logo" className="w-64 md:w-80 lg:w-96 aspect-square rounded-full object-cover mb-8 filter drop-shadow-2xl border-2 border-amber-500/20 shadow-[0_0_50px_rgba(201,168,76,0.15)]" />
            
            {/* Massive Firm Name */}
            <h1 className="font-luxury text-6xl md:text-8xl lg:text-[10rem] text-gold-gradient font-bold tracking-widest leading-none mb-4 text-center" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}>
              JANNAT
            </h1>
            <h2 className="font-luxury text-4xl md:text-6xl lg:text-7xl text-gold-gradient font-bold tracking-[0.3em] leading-none mb-10 text-center" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              RUGS CO.
            </h2>
            
            <Link to="/shop" className="btn-gold flex items-center justify-center gap-2 px-12 py-5 text-lg mt-8 shadow-2xl">
              Explore The Collection <FiArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-20 bg-gradient-to-b from-amber-400 to-transparent mx-auto" />
        </div>
      </section>

      {/* OFFERS SLIDER SECTION */}
      {offers.length > 0 && (
        <section className="py-20 px-4 bg-black relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <p className="text-amber-400 text-[10px] tracking-[0.5em] uppercase mb-4">Limited Time Offers</p>
              <h2 className="font-luxury text-4xl md:text-5xl text-white mb-6">Exclusive Promotions</h2>
              <div className="divider-gold w-24" />
            </div>

            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="rounded-[40px] overflow-hidden border border-amber-900/20 shadow-[0_0_80px_rgba(201,168,76,0.1)]"
            >
              {offers.map((offer, i) => (
                <SwiperSlide key={offer._id}>
                  <div className="relative h-[400px] md:h-[550px] lg:h-[650px] w-full group">
                    <img 
                      src={getImageUrl(offer.image)} 
                      alt={offer.title} 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-8 md:p-20">
                      <div className="max-w-2xl">
                        <motion.p 
                          initial={{ opacity: 0, x: -30 }} 
                          whileInView={{ opacity: 1, x: 0 }}
                          className="text-amber-400 font-bold tracking-[0.3em] uppercase text-xs mb-6"
                        >
                          {offer.subtitle || 'Flash Sale'}
                        </motion.p>
                        <motion.h3 
                          initial={{ opacity: 0, x: -30 }} 
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="font-luxury text-4xl md:text-6xl lg:text-7xl text-white mb-8 leading-tight"
                        >
                          {offer.title}
                        </motion.h3>
                        <motion.div 
                          initial={{ opacity: 0, x: -30 }} 
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
                        >
                          {offer.link && (
                            <Link to={offer.link} className="btn-gold px-12 py-5 text-sm uppercase tracking-widest">
                              Claim Offer
                            </Link>
                          )}
                          {offer.code && (
                            <div className="px-6 py-4 border border-amber-500/30 rounded-xl bg-amber-500/5 backdrop-blur-md">
                              <p className="text-[10px] text-amber-100/40 uppercase mb-1">Use Code</p>
                              <p className="text-amber-400 font-bold tracking-widest text-lg">{offer.code}</p>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* BRAND HERITAGE BANNER (Minimalist) */}
      <section className="py-24 border-y border-amber-900/10" style={{ background: '#050505' }}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="md:w-1/2">
            <h2 className="font-luxury text-3xl md:text-4xl text-white leading-snug">
              A Heritage of <br/><span className="text-amber-400">Hand-Knotted Perfection.</span>
            </h2>
          </div>
          <div className="md:w-1/2 flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-8">
            {[
              { label: 'Craftsmanship', desc: '100% Authentic' },
              { label: 'Worldwide', desc: 'Global Shipping' },
              { label: 'Est. 1999', desc: 'Legacy of Trust' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center md:items-start">
                <span className="text-amber-100 text-lg font-medium tracking-wide uppercase">{item.label}</span>
                <span className="text-amber-100/40 text-xs tracking-widest uppercase mt-1">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Curated For You</p>
          <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">Featured Collection</h2>
          <div className="divider-gold mb-4" />
          <p className="text-amber-100/50 max-w-lg mx-auto text-sm leading-relaxed">
            Each carpet is a work of art, handcrafted by master artisans using centuries-old techniques.
          </p>
        </div>
        {loading ? <Loader /> : (
          <>
            <div className="flex flex-wrap justify-center gap-6">
              {featuredProducts.length > 0 ? featuredProducts.map((p, i) => (
                <div key={p._id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.2rem)] max-w-[320px]">
                  <ProductCard product={p} index={i} />
                </div>
              )) : (
                <div className="w-full text-center py-16">
                  <p className="text-amber-100/30 font-luxury text-2xl mb-4">Collection Coming Soon</p>
                  <p className="text-amber-100/20 text-sm">Our artisans are crafting exclusive pieces for you.</p>
                </div>
              )}
            </div>
            {featuredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Link to="/shop" className="btn-outline-gold inline-flex items-center gap-2">
                  View All Products <FiArrowRight size={16} />
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* BRAND AD VIDEO SECTION */}
      {settings?.adVideo && (
        <section className="py-24 px-4 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center mb-12">
              <p className="text-amber-400 text-[10px] tracking-[0.4em] uppercase mb-3">Our Story</p>
              <h2 className="font-luxury text-3xl md:text-4xl text-white mb-6">Experience Jannat Rugs</h2>
              <div className="divider-gold w-20" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video w-full rounded-3xl overflow-hidden border border-amber-900/30 shadow-[0_0_50px_rgba(201,168,76,0.05)] group"
            >
              <video 
                controls 
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={getImageUrl(settings.adVideo)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        </section>
      )}

      {/* COLLECTIONS / CATEGORIES (Carpet Couture Style Split Layout) */}
      <section className="py-0">
        {(categories.length > 0 ? categories.slice(0, 3) : CATEGORIES_DEFAULT.slice(0, 3)).map((cat, i) => (
          <div key={cat.name} className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[500px] lg:min-h-[600px] group border-b border-amber-900/10`}>
            <div className="w-full lg:w-1/2 relative h-[400px] lg:h-auto overflow-hidden">
              <img src={getImageUrl(cat.image || cat.img)} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent" />
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 bg-[#050505] text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-md">
                <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-4">Collection</p>
                <h3 className="font-luxury text-4xl md:text-5xl text-white mb-6">{cat.name}</h3>
                <div className="divider-gold mx-auto mb-6" />
                <p className="text-amber-100/50 text-sm leading-relaxed mb-10">
                  Experience the pinnacle of craftsmanship with our authentic {cat.name.toLowerCase()} collection. Carefully hand-knotted by expert artisans using the finest materials.
                </p>
                <Link to={`/shop?search=${cat.name.split(' ')[0]}`} className="btn-outline-gold inline-flex items-center justify-center gap-2 px-10 py-4 text-xs tracking-widest uppercase">
                  Explore Collection <FiArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      {/* BESPOKE SERVICE (Custom Rugs Video Split Layout) */}
      <section className="py-0 px-0 relative overflow-hidden flex flex-col lg:flex-row min-h-[600px] border-b border-amber-900/20" style={{ background: '#0a0a0a' }}>
        <div className="w-full lg:w-1/2 relative h-[450px] lg:h-auto overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-105"
          >
            {/* Another elegant carpet making video */}
            <source src="https://cdn.shopify.com/videos/c/o/v/6300a3211db748b88ff208c7e3eec239.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 bg-[#0a0a0a]">
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-xl text-center lg:text-left">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-4">The Bespoke Experience</p>
            <h2 className="font-luxury text-4xl md:text-6xl text-white mb-6 leading-tight">
              Custom Rugs <br /><span className="text-gold-gradient">Made For You</span>
            </h2>
            <div className="w-12 h-px bg-amber-400/50 mb-6 mx-auto lg:mx-0" />
            <p className="text-amber-100/50 text-base leading-relaxed mb-10">
              Create a masterpiece that reflects your unique style. From selecting the finest hand-spun wool and pure silk to choosing custom colors and dimensions, our master weavers bring your vision to life perfectly.
            </p>
            <a href="https://wa.me/919235508422?text=I%20want%20to%20inquire%20about%20a%20custom%20rug" target="_blank" rel="noreferrer" className="btn-gold inline-flex items-center justify-center gap-2 px-10 py-4 uppercase tracking-widest text-xs">
              Inquire Now <FiArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* BEST SELLERS */}
      {(bestSellers.length > 0 || loading) && (
        <section className="py-32 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Customer Favorites</p>
            <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">Best Sellers</h2>
            <div className="divider-gold" />
          </div>
          {loading ? <Loader /> : (
            <div className="flex flex-wrap justify-center gap-6">
              {bestSellers.map((p, i) => (
                <div key={p._id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.2rem)] max-w-[320px]">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* NEW ARRIVALS */}
      {(newArrivals.length > 0 || loading) && (
        <section className="py-32 px-4" style={{ background: 'rgba(201,168,76,0.02)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-24">
              <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Fresh From The Loom</p>
              <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">New Arrivals</h2>
              <div className="divider-gold" />
            </div>
            {loading ? <Loader /> : (
              <div className="flex flex-wrap justify-center gap-6">
                {newArrivals.map((p, i) => (
                  <div key={p._id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.2rem)] max-w-[320px]">
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}



      {/* VIDEO CUSTOMER REVIEWS */}
      <section className="py-32 px-4 relative" style={{ background: '#080808' }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Real Stories</p>
            <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">Customer Video Reviews</h2>
            <div className="divider-gold mb-6" />
            <p className="text-amber-100/50 max-w-xl mx-auto text-sm leading-relaxed">
              Hear directly from our beloved clients about their experience with Jannat Rugs Co. and how our authentic hand-knotted carpets transformed their homes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {videoReviews.length > 0 ? videoReviews.map((rev, idx) => (
              <motion.div 
                key={rev._id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="w-full glass-card-dark p-2 md:p-4 rounded-[30px] border border-amber-900/30 shadow-[0_0_50px_rgba(201,168,76,0.05)] bg-black/40"
              >
                <div className="relative aspect-[4/5] sm:aspect-video rounded-[24px] overflow-hidden bg-black group border border-amber-900/20">
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                  >
                    <source src={getImageUrl(rev.video)} />
                    Your browser does not support the video tag.
                  </video>
                  
                  <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => <FiStar key={i} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 mb-4 text-center px-4">
                  <p className="text-amber-100/80 italic font-luxury text-lg md:text-xl mb-4 leading-relaxed line-clamp-2">
                    "{rev.comment}"
                  </p>
                  <p className="text-amber-400 text-xs tracking-[0.2em] uppercase font-medium">— {rev.name}, Verified Buyer</p>
                  {rev.productName && (
                    <Link to={`/product/${rev.productId}`} className="text-[10px] text-amber-100/30 hover:text-amber-500 transition-colors mt-2 block uppercase tracking-widest">
                      Product: {rev.productName}
                    </Link>
                  )}
                </div>
              </motion.div>
            )) : (
              <div className="col-span-2 text-center py-20 border border-dashed border-amber-900/20 rounded-3xl">
                <p className="text-amber-100/30 font-luxury text-2xl">Sharing the Joy Soon</p>
                <p className="text-amber-100/20 text-xs mt-2 uppercase tracking-widest">Our customers are preparing their video stories</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-40 px-4" style={{ background: '#050505', borderTop: '1px solid rgba(201,168,76,0.05)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <p className="text-amber-400 text-[10px] tracking-[0.5em] uppercase mb-4">Common Questions</p>
            <h2 className="font-luxury text-4xl md:text-5xl text-white mb-6">Everything You Need To Know</h2>
            <div className="divider-gold w-24" />
          </div>
          <div className="space-y-6">
            {[
              { q: "Are your carpets genuinely handmade?", a: "Yes! Every carpet in our collection is handmade by skilled artisans using traditional techniques passed down through generations. We never sell machine-made products under the handmade label." },
              { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy. If you're not completely satisfied with your purchase, simply contact us and we'll arrange a return or exchange." },
              { q: "Do you offer custom carpet sizes?", a: "Absolutely! We specialize in custom-size carpets. Contact us with your dimensions and our artisans will create the perfect piece for your space." },
              { q: "How do I care for my carpet?", a: "Regular vacuuming, rotating every 6 months, and professional cleaning every 1-2 years will keep your carpet in pristine condition. We provide detailed care instructions with every purchase." },
              { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), Razorpay, UPI, Credit/Debit Cards, and digital wallets. All online payments are secured with industry-standard encryption." },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* GET TO KNOW US / TEAM (Split Layout like Carpet Couture) */}
      <section className="py-40 px-4" style={{ background: '#080808' }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20 lg:gap-32">
          {/* Image Side */}
          <div className="w-full lg:w-1/2">
            <div className="relative group max-w-lg mx-auto">
              <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-amber-900/20 relative shadow-2xl">
                <img 
                  src={getImageUrl(settings?.founderImage) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"} 
                  alt="Founder Azeem Ansari" 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-[#C9A84C] rounded-lg flex items-center justify-center text-black">
                      <GiQueenCrown size={18} />
                    </div>
                    <p className="text-amber-400 text-xs uppercase tracking-[0.3em] font-bold">The Visionary</p>
                  </div>
                  <p className="text-white text-2xl font-serif">Azeem Ansari</p>
                </div>
              </div>
              {/* Decorative Accent */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-2 border-r-2 border-[#C9A84C]/30 rounded-br-[3rem] pointer-events-none" />
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-amber-400 text-sm tracking-[0.5em] uppercase mb-6 font-medium">Get To Know Us</p>
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-8 leading-tight">
                The <span className="text-[#C9A84C] italic">Visionary</span> <br className="hidden md:block" /> Behind Jannat
              </h2>
              <div className="w-20 h-px bg-[#C9A84C]/30 mb-10 mx-auto lg:mx-0" />
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8 font-light italic">
                "We don't just sell carpets; we preserve stories of human craftsmanship that have been whispered through centuries."
              </p>
              <p className="text-gray-500 text-base leading-relaxed mb-12">
                Azeem Ansari founded Jannat Rugs with a singular mission: to bring the authentic, soulful art of Indian weaving to the world's most discerning homes. Every knot is a testament to our heritage.
              </p>
              <Link to="/team" className="btn-gold inline-flex items-center justify-center gap-3 px-12 py-5 uppercase tracking-widest text-sm shadow-xl hover:shadow-amber-500/20">
                Meet Our Team <FiArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA BANNER (Cinematic Full Width) */}
      <section className="relative py-40 px-4 flex items-center justify-center overflow-hidden border-t border-amber-900/20">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80" alt="Luxury Interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-amber-400 text-xs tracking-[0.5em] uppercase mb-6">Begin Your Journey</p>
            <h2 className="font-luxury text-5xl md:text-7xl text-white mb-8 leading-tight">
              Ready to Transform <br />Your Space?
            </h2>
            <div className="w-16 h-px bg-amber-400/50 mb-8 mx-auto" />
            <p className="text-amber-100/70 mb-12 text-lg max-w-xl mx-auto leading-relaxed">
              Explore our exclusive collection of handmade luxury carpets and find the perfect masterpiece for your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/shop" className="btn-gold inline-flex items-center gap-3 px-12 py-5 text-sm tracking-widest uppercase">
                Shop Collection <FiArrowRight size={16} />
              </Link>
              <Link to="/contact" className="text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest text-xs border-b border-amber-400/30 hover:border-amber-400 pb-1">
                Request a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`glass-card-dark rounded-2xl transition-all duration-300 ${open ? 'border-amber-500/30' : 'border-amber-900/10 hover:border-amber-500/20'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left gap-4 px-6 py-5 group">
        <span className={`text-sm md:text-base font-medium transition-colors ${open ? 'text-amber-400' : 'text-amber-100/80 group-hover:text-amber-200'}`}>{question}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className={`text-2xl flex-shrink-0 ${open ? 'text-amber-400' : 'text-amber-100/30'}`}>+</motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-2">
          <p className="text-amber-100/50 text-sm leading-relaxed border-t border-amber-900/10 pt-4">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}
