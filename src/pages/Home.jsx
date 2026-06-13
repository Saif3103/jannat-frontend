import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiStar, FiShield, FiTruck, FiRefreshCw, FiAward, FiUsers, FiTrendingUp, FiCode } from 'react-icons/fi';
import { FaHandshake, FaRocket } from 'react-icons/fa';
import { GiQueenCrown, GiRugbyConversion as LuRug } from 'react-icons/gi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import api, { BASE_URL } from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import RugQuiz from '../components/ui/RugQuiz';

import RugShowcaseStrip from '../components/ui/RugShowcaseStrip';
import SmartRecommendations from '../components/ui/SmartRecommendations';
import DynamicHero from '../components/ui/SmartHero.jsx';

const optimizeCloudinaryUrl = (url, width = 800) => {
  if (url && url.includes('cloudinary.com/dnxzzzy/image/upload/')) {
    if (url.includes('/upload/v')) {
      return url.replace('/upload/v', `/upload/q_auto,f_auto,w_${width}/v`);
    }
  }
  return url;
};

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80';
  if (typeof url !== 'string') return url;
  if (url.startsWith('http')) return optimizeCloudinaryUrl(url);
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

const PLACEHOLDER = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80';
const PLACEHOLDER_F = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [offers, setOffers] = useState([]);
  const [videoReviews, setVideoReviews] = useState([]);

  const getTeamImageUrl = (url, fallback = PLACEHOLDER) => {
    if (!url) return fallback;
    if (typeof url !== 'string') return url;
    if (url.startsWith('http') || url.startsWith('blob:')) return optimizeCloudinaryUrl(url, 400);
    return `${BASE_URL}/${url}`;
  };

  const TEAM = [
    {
      name: 'Azeem Ansari',
      role: 'FOUNDER',
      icon: GiQueenCrown,
      color: '#B69640',
      image: getTeamImageUrl(settings?.founderImage, PLACEHOLDER),
      bio: 'Founded Jannat Rugs Co. with a passion for preserving India\'s rich weaving heritage. Leads the company with vision, blending tradition with modern luxury.',
    },
    {
      name: 'Sahana Ansari',
      role: 'CO-FOUNDER',
      tagline1: 'Strategic Mind',
      tagline2: 'Building Together',
      icon: FaHandshake,
      color: '#B69640',
      image: getTeamImageUrl(settings?.sahanaImage, PLACEHOLDER_F),
      bio: 'The creative force behind Jannat Rugs\' brand identity. Drives the aesthetic direction and customer experience — ensuring every touchpoint reflects luxury.',
    },
    {
      name: 'Saif Ali',
      role: 'DEVELOPER & MARKETING',
      tagline1: 'Code. Connect. Convert.',
      tagline2: 'Building & Promoting Digital Success',
      icon: FaRocket,
      color: '#B69640',
      image: getTeamImageUrl(settings?.saifImage, PLACEHOLDER),
      bio: 'Powers the digital side — from building the online store to running marketing campaigns. His tech expertise brings Jannat Rugs to customers worldwide.',
    },
  ];

  useEffect(() => {
    const load = async () => {
      // 1. FAST LOAD: Check Cache
      const cached = localStorage.getItem('jannat_home_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.featured) setFeaturedProducts(parsed.featured);
          if (parsed.best) setBestSellers(parsed.best);
          if (parsed.newArr) setNewArrivals(parsed.newArr);
          if (parsed.cats) setCategories(parsed.cats);
          if (parsed.settings) setSettings(parsed.settings);
          if (parsed.offers) setOffers(parsed.offers);
          if (parsed.videoReviews) setVideoReviews(parsed.videoReviews);
        } catch (e) { console.error('Cache parsing failed', e); }
      }

      // 2. BACKGROUND FETCH: Get Fresh Data
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
        
        const freshData = {
          featured: featured?.data?.products || [],
          best: best?.data?.products || [],
          newArr: newArr?.data?.products || [],
          cats: cats?.data?.categories?.slice(0, 6) || [],
          settings: setts?.data?.settings || null,
          offers: offs?.data?.offers || [],
          videoReviews: vReviews?.data?.reviews?.slice(0, 2) || []
        };

        if (freshData.featured.length) setFeaturedProducts(freshData.featured);
        if (freshData.best.length) setBestSellers(freshData.best);
        if (freshData.newArr.length) setNewArrivals(freshData.newArr);
        if (freshData.cats.length) setCategories(freshData.cats);
        if (freshData.settings) setSettings(freshData.settings);
        if (freshData.offers.length) setOffers(freshData.offers);
        if (freshData.videoReviews.length) setVideoReviews(freshData.videoReviews);

        // Update Cache
        localStorage.setItem('jannat_home_cache', JSON.stringify(freshData));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const FounderIcon = TEAM[0].icon;
  const CoFounderIcon = TEAM[1].icon;
  const DeveloperIcon = TEAM[2].icon;

  return (
    <>
      <Helmet>
        <title>Jannat Rugs Co. – Premium Handmade Carpets & Luxury Rugs</title>
        <meta name="description" content="Discover our exquisite collection of handmade Persian carpets, luxury rugs, and premium floor coverings. Crafted by master artisans with generations of expertise." />
      </Helmet>

      <div className="bg-transparent">
        {/* VIDEO HERO WITH TIME-BASED GREETING */}
        <DynamicHero 
          videoUrl={settings?.heroVideo ? getImageUrl(settings.heroVideo) : null} 
          logo="/logo.png" 
        />

      {/* FESTIVE OFFER BANNER */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden bg-[#0A0A0A] border-y border-amber-900/20">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-20">
             <div className="max-w-3xl text-center lg:text-left">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                   <p className="text-amber-500 font-black tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-6 flex items-center justify-center lg:justify-start gap-3">
                      <span className="w-8 h-px bg-amber-500" /> Limited Time Exclusive
                   </p>
                   <h2 className="font-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-10 leading-[1.05]">
                      Festive Luxury <br />
                      <span className="text-[#C9A84C] italic">Collection 2026</span>
                   </h2>
                   <p className="text-white/60 text-base sm:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0">
                      Celebrate the season with handcrafted masterpieces. Get up to <span className="text-white font-black text-2xl sm:text-3xl mx-1 underline decoration-amber-500 underline-offset-8">50% OFF</span> on our most exclusive hand-knotted rugs.
                   </p>
                   
                   {/* Trust Badges Grid */}
                   <div className="flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12">
                      <div className="flex flex-col items-center">
                         <div className="text-[#C9A84C] mb-3"><FiShield size={28}/></div>
                         <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold text-center leading-tight">Premium<br/>Quality</p>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="text-[#C9A84C] mb-3"><FiAward size={28}/></div>
                         <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold text-center leading-tight">Timeless<br/>Designs</p>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="text-[#C9A84C] mb-3"><FiUsers size={28}/></div>
                         <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold text-center leading-tight">Trusted by<br/>Thousands</p>
                      </div>
                   </div>
                </motion.div>
             </div>

             {/* CTA Button */}
             <div className="text-center lg:text-right">
                <Link to="/shop" className="group flex items-center gap-4 bg-gradient-to-r from-[#C9A84C] to-[#E5C266] text-black px-12 py-5 rounded-xl font-black text-sm tracking-[0.2em] uppercase hover:scale-105 transition-all shadow-[0_15px_30px_rgba(201,168,76,0.3)]">
                   Shop Now <FiArrowRight className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                </Link>
                <p className="text-[11px] text-white/30 mt-6 uppercase tracking-[0.2em] font-medium">Exclusive Season Offers</p>
             </div>
          </div>
        </div>
      </section>

      {/* BRAND HERITAGE BANNER (Minimalist) */}
      <section className="py-12 sm:py-16 border-y border-amber-900/5 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 text-center md:text-left">
          <div className="md:w-1/2">
            <h2 className="font-luxury text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] leading-snug">
              A Heritage of <br/><span className="text-[#1A1A1A]">Hand-Knotted Perfection.</span>
            </h2>
          </div>
          <div className="md:w-1/2 flex flex-wrap justify-center md:justify-end gap-x-8 sm:gap-x-12 gap-y-6 sm:gap-y-8">
            {[
              { label: 'Craftsmanship', desc: '100% Authentic' },
              { label: 'Worldwide', desc: 'Global Shipping' },
              { label: 'Est. 1999', desc: 'Legacy of Trust' },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center md:items-start">
                <span className="text-[#1A1A1A] text-base sm:text-lg font-bold tracking-wide uppercase">{item.label}</span>
                <span className="text-black/30 text-[10px] sm:text-xs tracking-widest uppercase mt-1">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIZ ENTRY SECTION */}
      <section className="py-16 sm:py-24 px-4 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3rem] p-10 sm:p-20 shadow-[0_20px_80px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden group hover:shadow-[0_40px_100px_rgba(201,168,76,0.1)] transition-all duration-700"
          >
            {/* Decorative Patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C9A84C]/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#C9A84C]/5 to-transparent rounded-full -ml-20 -mb-20 blur-3xl" />
            
            <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-20 relative z-10">
               <div className="w-full lg:w-[45%] flex justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 bg-[#FAF7F2] rounded-[3rem] rotate-12 flex items-center justify-center border border-[#C9A84C]/10 group-hover:rotate-6 transition-transform duration-700">
                       <LuRug size={80} className="text-[#C9A84C] -rotate-12 group-hover:-rotate-6 transition-transform duration-700" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-bounce">
                       <span className="text-3xl">✨</span>
                    </div>
                  </div>
               </div>
               
               <div className="w-full lg:w-[55%] text-center lg:text-left">
                  <p className="text-[#C9A84C] text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Personalized Discovery</p>
                  <h2 className="font-heading text-4xl sm:text-6xl text-[#1A1A1A] mb-8 leading-tight">Find Your <span className="italic font-luxury">Perfect</span> Rug</h2>
                  <p className="text-[#64748B] text-base sm:text-xl leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0">
                    Not sure which rug fits your space? Answer 5 quick questions and our smart collection engine will curate a personalized selection just for you.
                  </p>
                  <button 
                    onClick={() => setIsQuizOpen(true)}
                    className="btn-gold inline-flex items-center justify-center gap-4 px-12 py-5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-2xl hover:shadow-[#C9A84C]/20"
                  >
                    Start The Quiz <FiArrowRight size={20} />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      <RugQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />


      {/* RUG SHOWCASE STRIP */}
      <RugShowcaseStrip />

      {/* FEATURED COLLECTION */}
      <section className="py-16 sm:py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-24">
          <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-3 font-bold">Curated For You</p>
          <h2 className="font-luxury text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mb-4">Featured Collection</h2>
          <div className="divider-gold mb-4" />
          <p className="text-black/40 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed font-medium">
            Each carpet is a work of art, handcrafted by master artisans using centuries-old techniques.
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {featuredProducts.length > 0 ? featuredProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              )) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-[#1A1A1A]/30 font-luxury text-xl sm:text-2xl mb-4">Collection Coming Soon</p>
                  <p className="text-[#1A1A1A]/20 text-[10px] sm:text-sm">Our artisans are crafting exclusive pieces for you.</p>
                </div>
              )}
            </div>
            {featuredProducts.length > 0 && (
              <div className="text-center mt-10 sm:mt-12">
                <Link to="/shop" className="btn-outline-gold inline-flex items-center gap-2 text-xs sm:text-sm">
                  View All Products <FiArrowRight size={16} />
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* BRAND AD VIDEO SECTION */}
      {settings?.adVideo && (
        <section className="py-12 sm:py-20 px-4 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
              <p className="text-[#1A1A1A] text-[10px] tracking-[0.4em] uppercase mb-3">Our Story</p>
              <h2 className="font-luxury text-3xl md:text-4xl text-white mb-4 sm:mb-6">Experience Jannat Rugs</h2>
              <div className="divider-gold w-16 sm:w-20" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-900/30 shadow-[0_0_50px_rgba(201,168,76,0.05)] group"
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

      {/* COLLECTIONS / CATEGORIES (Elegant Grid Layout) */}
      <section className="py-16 sm:py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
          <p className="text-[#1A1A1A] text-[10px] tracking-[0.4em] uppercase mb-4 font-bold">Curated Selection</p>
          <h2 className="font-luxury text-3xl sm:text-5xl text-[#1A1A1A] mb-6">Our Collections</h2>
          <div className="divider-gold w-20" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {(categories.length > 0 ? categories.slice(0, 3) : CATEGORIES_DEFAULT.slice(0, 3)).map((cat, i) => (
            <Link key={cat.name} to={`/shop?search=${cat.name.split(' ')[0]}`} className="group relative h-[450px] sm:h-[550px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/5">
              <img src={getImageUrl(cat.image || cat.img)} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                <p className="text-[#C9A84C] text-[9px] font-bold tracking-[0.3em] uppercase mb-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">Discover</p>
                <h3 className="font-luxury text-3xl text-white mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{cat.name}</h3>
                <div className="w-0 h-[2px] bg-[#C9A84C] group-hover:w-16 transition-all duration-700 delay-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESPOKE SERVICE (Custom Rugs Video Split Layout) */}
      <section className="relative overflow-hidden flex flex-col lg:flex-row min-h-[400px] lg:min-h-[550px] border-y border-amber-900/20" style={{ background: '#0a0a0a' }}>
        <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-auto overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-105"
          >
            <source src="https://cdn.shopify.com/videos/c/o/v/6300a3211db748b88ff208c7e3eec239.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 section-alt">
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-xl text-center lg:text-left">
            <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4 font-bold">The Bespoke Experience</p>
            <h2 className="font-luxury text-3xl md:text-6xl text-[#1A1A1A] mb-4 sm:mb-6 leading-tight">
              Custom Rugs <br /><span className="text-[#1A1A1A]">Made For You</span>
            </h2>
            <div className="w-10 sm:w-12 h-px bg-[#B69640]/50 mb-4 sm:mb-6 mx-auto lg:mx-0" />
            <p className="text-[#1A1A1A]/60 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 font-medium">
              Create a masterpiece that reflects your unique style. From selecting the finest hand-spun wool and pure silk to choosing custom colors and dimensions, our master weavers bring your vision to life perfectly.
            </p>
            <a href="https://wa.me/919235508422?text=I%20want%20to%20inquire%20about%20a%20custom%20rug" target="_blank" rel="noreferrer" className="btn-gold inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-4 uppercase tracking-widest text-[10px] sm:text-xs">
              Inquire Now <FiArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* BEST SELLERS */}
      {(bestSellers.length > 0 || loading) && (
        <section className="py-16 sm:py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12 sm:mb-24">
            <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-3 font-bold">Customer Favorites</p>
            <h2 className="font-luxury text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mb-4">Best Sellers</h2>
            <div className="divider-gold" />
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {bestSellers.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {(newArrivals.length > 0 || loading) && (
        <section className="py-16 sm:py-24 px-4" style={{ background: '#FAF7F2' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12 sm:mb-24">
              <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-3 font-bold">Fresh From The Loom</p>
              <h2 className="font-luxury text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mb-4">New Arrivals</h2>
              <div className="divider-gold" />
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {newArrivals.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* VIDEO CUSTOMER REVIEWS */}
      <section className="py-16 sm:py-24 px-4 relative bg-white border-y border-black/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')] opacity-5 mix-blend-multiply pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
            <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-3 font-bold">Real Stories</p>
            <h2 className="font-luxury text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mb-4">Customer Video Reviews</h2>
            <div className="divider-gold mb-6" />
            <p className="text-black/50 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed font-medium">
              Hear directly from our beloved clients about their experience with Jannat Rugs Co. and how our authentic hand-knotted carpets transformed their homes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
            {videoReviews.length > 0 ? videoReviews.map((rev, idx) => (
              <motion.div 
                key={rev._id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="w-full glass-card-dark p-2 md:p-4 rounded-[24px] sm:rounded-[30px] border border-amber-900/30 shadow-[0_0_50px_rgba(201,168,76,0.05)] bg-black/40"
              >
                <div className="relative aspect-[4/5] sm:aspect-video rounded-[20px] sm:rounded-[24px] overflow-hidden bg-black group border border-amber-900/20">
                  <video 
                    controls 
                    className="w-full h-full object-cover"
                  >
                    <source src={getImageUrl(rev.video)} />
                    Your browser does not support the video tag.
                  </video>
                  
                  <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none">
                    <div className="flex text-[#1A1A1A]">
                      {[...Array(Math.max(0, Math.floor(Number(rev.rating)) || 5))].map((_, i) => <FiStar key={i} size={10} sm:size={12} fill="currentColor" />)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 mb-4 text-center px-4">
                  <p className="text-[#1A1A1A]/80 italic font-luxury text-base sm:text-xl mb-4 leading-relaxed line-clamp-2">
                    "{rev.comment}"
                  </p>
                  <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium">— {rev.name}, Verified Buyer</p>
                  {rev.productName && (
                    <Link to={`/product/${rev.productId}`} className="text-[9px] sm:text-[10px] text-[#1A1A1A]/30 hover:text-[#1A1A1A] transition-colors mt-2 block uppercase tracking-widest">
                      Product: {rev.productName}
                    </Link>
                  )}
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-16 sm:py-20 border border-dashed border-amber-900/20 rounded-2xl sm:rounded-3xl">
                <p className="text-[#1A1A1A]/30 font-luxury text-xl sm:text-2xl">Sharing the Joy Soon</p>
                <p className="text-[#1A1A1A]/20 text-[10px] mt-2 uppercase tracking-widest">Our customers are preparing their video stories</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 px-4 bg-[#FAF7F2]" style={{ borderTop: '1px solid rgba(182, 150, 64, 0.1)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 sm:mb-24">
            <p className="text-[#1A1A1A] text-[10px] tracking-[0.5em] uppercase mb-4 font-bold">Common Questions</p>
            <h2 className="font-luxury text-3xl sm:text-5xl text-[#1A1A1A] mb-6">Everything You Need To Know</h2>
            <div className="divider-gold w-20 sm:w-24" />
          </div>
          <div className="space-y-4 sm:space-y-6">
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

      {/* MEET OUR TEAM SECTION */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden bg-white border-t border-black/5">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-12 sm:mb-20">
            <p className="text-[#B69640] text-[10px] tracking-[0.4em] uppercase mb-4 font-bold">The Artisans Behind The Brand</p>
            <h2 className="font-luxury text-4xl sm:text-6xl text-[#1A1A1A] mb-6">Meet Our Team</h2>
            <div className="w-20 h-[1px] bg-[#B69640]" />
          </div>

          <div className="space-y-16 sm:space-y-24">
            {TEAM.map((member, i) => {
              const Icon = member.icon;
              return (
                <div key={member.name} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20`}>
                  {/* Image */}
                  <motion.div 
                    initial={{ opacity: 0, x: i % 2 !== 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-5/12 flex justify-center"
                  >
                    <div className="relative w-64 h-80 sm:w-80 sm:h-[400px] rounded-t-[10rem] rounded-b-[2rem] overflow-hidden shadow-2xl border border-black/5 group bg-white">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                  </motion.div>

                  {/* Text */}
                  <motion.div 
                    initial={{ opacity: 0, x: i % 2 !== 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-7/12 text-center md:text-left"
                  >
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                      <Icon size={18} className="text-[#B69640]" />
                      <p className="text-[#B69640] text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase font-serif">
                        {member.role}
                      </p>
                    </div>
                    <h3 className="text-3xl sm:text-5xl font-luxury text-[#1A1A1A] mb-6">{member.name}</h3>
                    <p className="text-black/60 text-sm sm:text-base leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
                      {member.bio}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Link to="/team" className="btn-outline-gold inline-flex items-center gap-3 px-10 py-4 text-xs tracking-widest uppercase rounded-lg">
              View Full Team <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>


      {/* SMART RECOMMENDATIONS */}
      <SmartRecommendations title="Luxury Styles You May Love" />

      {/* CTA BANNER (Cinematic Full Width) */}
      <section className="relative py-20 sm:py-32 px-4 flex items-center justify-center overflow-hidden border-t border-amber-900/20">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80" alt="Luxury Interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.5em] uppercase mb-6">Begin Your Journey</p>
            <h2 className="font-luxury text-3xl sm:text-5xl md:text-7xl text-white mb-6 sm:mb-8 leading-tight">
              Ready to Transform <br />Your Space?
            </h2>
            <div className="w-12 sm:w-16 h-px bg-amber-400/50 mb-6 sm:mb-8 mx-auto" />
            <p className="text-[#1A1A1A]/70 mb-10 sm:mb-12 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
              Explore our exclusive collection of handmade luxury carpets and find the perfect masterpiece for your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link to="/shop" className="btn-gold inline-flex items-center gap-3 px-10 sm:px-12 py-4 sm:py-5 text-xs sm:text-sm tracking-widest uppercase">
                Shop Collection <FiArrowRight size={16} />
              </Link>
              <Link to="/contact" className="text-[#1A1A1A] hover:text-[#1A1A1A] transition-colors uppercase tracking-widest text-[10px] sm:text-xs border-b border-amber-400/30 hover:border-amber-400 pb-1">
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
        <span className={`text-sm md:text-base font-medium transition-colors ${open ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/80 group-hover:text-[#1A1A1A]'}`}>{question}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className={`text-2xl flex-shrink-0 ${open ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/30'}`}>+</motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-2">
          <p className="text-[#1A1A1A]/50 text-sm leading-relaxed border-t border-amber-900/10 pt-4">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}
