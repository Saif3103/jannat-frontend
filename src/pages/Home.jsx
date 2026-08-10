import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiStar, FiShield, FiTruck, FiRefreshCw, FiAward, FiUsers, FiTrendingUp, FiCode, FiCheckCircle, FiHeart, FiPackage } from 'react-icons/fi';
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
import Container from '../components/layout/Container';

import RugShowcaseStrip from '../components/ui/RugShowcaseStrip';
import SmartRecommendations from '../components/ui/SmartRecommendations';
import DynamicHero from '../components/ui/SmartHero.jsx';

const optimizeCloudinaryUrl = (url, width = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.includes('/upload/q_auto')) return url; // already optimized
  return url.replace('/upload/', `/upload/q_auto:eco,f_auto,w_${width}/`);
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
    let isMounted = true;
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

      // 2. BACKGROUND FETCH: Phase 1 (Critical Data)
      try {
        const [featured, newArr, cats, setts] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?newArrival=true&limit=4'),
          api.get('/categories'),
          api.get('/settings'),
        ]);
        
        if (!isMounted) return;

        const criticalData = {
          featured: featured?.data?.products || [],
          newArr: newArr?.data?.products || [],
          cats: cats?.data?.categories?.slice(0, 6) || [],
          settings: setts?.data?.settings || null,
        };

        if (criticalData.featured.length) setFeaturedProducts(criticalData.featured);
        if (criticalData.newArr.length) setNewArrivals(criticalData.newArr);
        if (criticalData.cats.length) setCategories(criticalData.cats);
        if (criticalData.settings) setSettings(criticalData.settings);

        setLoading(false);

        // 3. BACKGROUND FETCH: Phase 2 (Non-Critical Data)
        // Defer execution to allow main thread to paint the UI
        setTimeout(async () => {
          try {
            const [best, offs, vReviews] = await Promise.all([
              api.get('/products?bestSeller=true&limit=4'),
              api.get('/offers'),
              api.get('/video-reviews'),
            ]);
            
            if (!isMounted) return;

            const nonCriticalData = {
              best: best?.data?.products || [],
              offers: offs?.data?.offers || [],
              videoReviews: vReviews?.data?.reviews?.slice(0, 2) || []
            };

            if (nonCriticalData.best.length) setBestSellers(nonCriticalData.best);
            if (nonCriticalData.offers.length) setOffers(nonCriticalData.offers);
            if (nonCriticalData.videoReviews.length) setVideoReviews(nonCriticalData.videoReviews);

            // Update Cache with full data
            localStorage.setItem('jannat_home_cache', JSON.stringify({ ...criticalData, ...nonCriticalData }));
          } catch (err) {
            console.error('Failed to load non-critical home data:', err);
          }
        }, 1000); // 1s delay

      } catch (err) {
        console.error('Failed to load critical home data:', err);
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
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
      <section className="section-pad relative overflow-hidden bg-[#0A0A0A] border-y border-amber-900/20">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <Container className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
             <div className="max-w-3xl text-center lg:text-left">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                   <p className="text-amber-500 font-black tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-5 flex items-center justify-center lg:justify-start gap-3">
                      <span className="w-8 h-px bg-amber-500" /> Limited Time Exclusive
                   </p>
                   <h2 className="heading-hero text-white mb-6">
                      Festive Luxury <br />
                      <span className="text-[#C9A84C] italic">Collection 2026</span>
                   </h2>
                   <p className="text-white/60 text-body font-medium mb-10 text-measure mx-auto lg:mx-0">
                      Celebrate the season with handcrafted masterpieces. Get up to <span className="text-white font-black text-xl sm:text-2xl mx-1 underline decoration-amber-500 underline-offset-8">50% OFF</span> on our most exclusive hand-knotted rugs.
                   </p>
                   
                   {/* Trust Badges Grid */}
                   <div className="flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-10">
                      <div className="flex flex-col items-center">
                         <div className="text-[#C9A84C] mb-3"><FiShield size={24}/></div>
                         <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold text-center leading-tight">Premium<br/>Quality</p>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="text-[#C9A84C] mb-3"><FiAward size={24}/></div>
                         <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold text-center leading-tight">Timeless<br/>Designs</p>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="text-[#C9A84C] mb-3"><FiUsers size={24}/></div>
                         <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold text-center leading-tight">Trusted by<br/>Thousands</p>
                      </div>
                   </div>
                </motion.div>
             </div>

             {/* CTA Button */}
             <div className="text-center lg:text-right shrink-0">
                <Link to="/shop" className="group inline-flex items-center gap-4 bg-gradient-to-r from-[#C9A84C] to-[#E5C266] text-black px-10 py-4 rounded-xl font-black text-sm tracking-[0.2em] uppercase hover:scale-[1.02] transition-all shadow-[0_15px_30px_rgba(201,168,76,0.3)]">
                   Shop Now <FiArrowRight className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                </Link>
                <p className="text-[11px] text-white/30 mt-5 uppercase tracking-[0.2em] font-medium">Exclusive Season Offers</p>
             </div>
          </div>
        </Container>
      </section>

      {/* WHY INDIA TRUSTS JANNAT RUGS */}
      <section className="section-pad bg-[#FAF7F2] relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#C9A84C]/5 rounded-full -ml-36 -mt-36 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#C9A84C]/5 rounded-full -mr-36 -mb-36 blur-[100px] pointer-events-none" />
        
        <Container className="relative z-10">
          {/* Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="section-header"
          >
            <p className="text-[#B69640] text-[10px] sm:text-xs tracking-[0.4em] uppercase font-bold">Trust & Heritage</p>
            <h2 className="heading-section text-[#1A1A1A]">
              Why India Trusts <br className="hidden sm:block" /><span className="italic">Jannat Rugs</span>
            </h2>
            <div className="divider-gold w-20 sm:w-24 mb-5" />
            <p className="text-black/50 text-body text-measure mx-auto font-medium">
              For over a decade, we have been handcrafting premium rugs with authentic artisanship, trusted by homeowners and interior designers across India.
            </p>
          </motion.div>

          {/* Trust Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-10 sm:mb-14 lg:mb-16 items-stretch">
            {[
              { icon: FiShield, title: 'Premium Quality', desc: '100% handcrafted with the finest materials — no compromises' },
              { icon: FiTruck, title: 'Secure Delivery', desc: 'Safe packaging & tracked delivery across India' },
              { icon: FiCheckCircle, title: 'Authentic Craft', desc: 'Every rug is made by skilled artisans using age-old techniques' },
              { icon: FiHeart, title: 'Customer Love', desc: 'Trusted by 500+ happy customers with 5-star reviews' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl border border-[#B69640]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_50px_rgba(182,150,64,0.12)] hover:border-[#B69640]/25 transition-all duration-500 group h-full flex flex-col text-left p-5 sm:p-6 lg:p-7 min-h-[180px] sm:min-h-[200px]"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#B69640]/15 flex items-center justify-center mb-4 shrink-0 group-hover:bg-[#B69640]/10 transition-colors duration-500">
                    <Icon size={20} className="text-[#B69640]" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[#1A1A1A] text-[13px] sm:text-[15px] font-bold mb-2.5 tracking-wide leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-black/40 text-[11px] sm:text-[13px] leading-relaxed font-medium pb-1">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="bg-white rounded-2xl sm:rounded-3xl border border-[#B69640]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-3 py-9 sm:px-4 sm:py-11 lg:px-2 mt-2"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {[
                { number: '500+', label: 'Happy Customers' },
                { number: '1000+', label: 'Rugs Delivered' },
                { number: '10+', label: 'Years Experience' },
                { number: '100%', label: 'Handcrafted Quality' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={[
                    'flex flex-col items-center justify-center text-center px-4 py-4 sm:py-5 min-h-[96px]',
                    i % 2 === 0 ? 'border-r border-[#B69640]/10 lg:border-r-0' : '',
                    i < 2 ? 'border-b border-[#B69640]/10 lg:border-b-0' : '',
                    i > 0 ? 'lg:border-l lg:border-[#B69640]/15' : '',
                  ].filter(Boolean).join(' ')}
                >
                  <p className="stat-number font-luxury text-[2rem] sm:text-[2.5rem] lg:text-[2.75rem] text-[#B69640] mb-2.5 leading-none tracking-tight">
                    {stat.number}
                  </p>
                  <p className="text-black/40 text-[9px] sm:text-[10px] font-bold tracking-[0.16em] uppercase leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* QUIZ ENTRY SECTION */}
      <section className="section-pad bg-white">
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden group hover:shadow-[0_40px_100px_rgba(201,168,76,0.1)] transition-all duration-700"
          >
            {/* Decorative Patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C9A84C]/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#C9A84C]/5 to-transparent rounded-full -ml-20 -mb-20 blur-3xl" />
            
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative z-10">
               <div className="w-full lg:w-[45%] flex justify-center">
                  <div className="relative">
                    <div className="w-40 h-40 sm:w-56 sm:h-56 bg-[#FAF7F2] rounded-[2.5rem] rotate-12 flex items-center justify-center border border-[#C9A84C]/10 group-hover:rotate-6 transition-transform duration-700">
                       <LuRug size={64} className="text-[#C9A84C] -rotate-12 group-hover:-rotate-6 transition-transform duration-700" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-bounce">
                       <span className="text-2xl">✨</span>
                    </div>
                  </div>
               </div>
               
               <div className="w-full lg:w-[55%] text-center lg:text-left">
                  <p className="text-[#C9A84C] text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Personalized Discovery</p>
                  <h2 className="heading-section text-[#1A1A1A] mb-6">Find Your <span className="italic font-luxury">Perfect</span> Rug</h2>
                  <p className="text-[#64748B] text-body mb-8 text-measure mx-auto lg:mx-0">
                    Not sure which rug fits your space? Answer 5 quick questions and our smart collection engine will curate a personalized selection just for you.
                  </p>
                  <button 
                    onClick={() => setIsQuizOpen(true)}
                    className="btn-gold inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-2xl hover:shadow-[#C9A84C]/20"
                  >
                    Start The Quiz <FiArrowRight size={18} />
                  </button>
               </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <RugQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />


      {/* RUG SHOWCASE STRIP */}
      <RugShowcaseStrip />

      {/* FEATURED COLLECTION */}
      <section className="section-pad">
        <Container>
        <div className="section-header">
          <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase font-bold">Curated For You</p>
          <h2 className="heading-section text-[#1A1A1A]">Featured Collection</h2>
          <div className="divider-gold mb-4" />
          <p className="text-black/40 text-body text-measure mx-auto font-medium">
            Each carpet is a work of art, handcrafted by master artisans using centuries-old techniques.
          </p>
        </div>
        {loading ? (
          <div className="grid-products">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <>
            <div className="grid-products">
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
        </Container>
      </section>

      {/* BRAND AD VIDEO SECTION */}
      {settings?.adVideo && (
        <LazySection minHeight="500px">
        <section className="section-pad bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-amber-500/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <Container narrow className="relative z-10">
            <div className="section-header">
              <p className="text-white/50 text-[10px] tracking-[0.4em] uppercase">Our Story</p>
              <h2 className="heading-section text-white">Experience Jannat Rugs</h2>
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
          </Container>
        </section>
        </LazySection>
      )}

      {/* COLLECTIONS / CATEGORIES (Elegant Grid Layout) */}
      <section className="section-pad bg-[#FAF7F2]">
        <Container>
        <div className="section-header">
          <p className="text-[#1A1A1A] text-[10px] tracking-[0.4em] uppercase font-bold">Curated Selection</p>
          <h2 className="heading-section text-[#1A1A1A]">Our Collections</h2>
          <div className="divider-gold w-20" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {(categories.length > 0 ? categories.slice(0, 3) : CATEGORIES_DEFAULT.slice(0, 3)).map((cat, i) => {
            const imgSrc = cat.image || cat.img || CATEGORIES_DEFAULT[i % CATEGORIES_DEFAULT.length]?.img;
            return (
            <Link key={cat.name || cat._id} to={`/shop?search=${(cat.name || '').split(' ')[0]}`} className="group relative h-[220px] sm:h-[360px] md:h-[420px] rounded-[1.25rem] sm:rounded-[1.75rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
              <img
                src={getImageUrl(imgSrc)}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => { e.target.src = CATEGORIES_DEFAULT[i % CATEGORIES_DEFAULT.length]?.img; }}
              />
              {/* Always visible gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              {/* Text always visible at bottom */}
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end text-left">
                <p className="text-[#C9A84C] text-[8px] sm:text-[10px] font-bold tracking-[0.3em] uppercase mb-1 sm:mb-2">Explore Collection</p>
                <h3 className="font-luxury text-base sm:text-2xl md:text-[1.75rem] text-white mb-2 sm:mb-3 leading-tight">{cat.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-6 sm:w-10 h-[2px] bg-[#C9A84C]" />
                  <span className="text-white/60 text-[9px] sm:text-[11px] uppercase tracking-widest font-bold group-hover:text-white transition-colors">Shop Now</span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
        </Container>
      </section>

      {/* BESPOKE SERVICE (Custom Rugs Video Split Layout) */}
      <LazySection>
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
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:px-16 lg:py-20 section-alt">
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="max-w-xl text-center lg:text-left">
            <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4 font-bold">The Bespoke Experience</p>
            <h2 className="heading-section text-[#1A1A1A] mb-5">
              Custom Rugs <br /><span className="text-[#1A1A1A]">Made For You</span>
            </h2>
            <div className="w-10 sm:w-12 h-px bg-[#B69640]/50 mb-5 mx-auto lg:mx-0" />
            <p className="text-[#1A1A1A]/60 text-body mb-8 text-measure mx-auto lg:mx-0 font-medium">
              Create a masterpiece that reflects your unique style. From selecting the finest hand-spun wool and pure silk to choosing custom colors and dimensions, our master weavers bring your vision to life perfectly.
            </p>
            <a href="https://wa.me/919235508422?text=I%20want%20to%20inquire%20about%20a%20custom%20rug" target="_blank" rel="noreferrer" className="btn-gold inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-4 uppercase tracking-widest text-[10px] sm:text-xs">
              Inquire Now <FiArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>
      </LazySection>

      {/* BEST SELLERS */}
      {(bestSellers.length > 0 || loading) && (
        <section className="section-pad bg-white">
          <Container>
          <div className="section-header">
            <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase font-bold">Customer Favorites</p>
            <h2 className="heading-section text-[#1A1A1A]">Best Sellers</h2>
            <div className="divider-gold" />
          </div>
          {loading ? (
            <div className="grid-products">
              {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid-products">
              {bestSellers.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
          </Container>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {(newArrivals.length > 0 || loading) && (
        <section className="section-pad" style={{ background: '#FAF7F2' }}>
          <Container>
            <div className="section-header">
              <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase font-bold">Fresh From The Loom</p>
              <h2 className="heading-section text-[#1A1A1A]">New Arrivals</h2>
              <div className="divider-gold" />
            </div>
            {loading ? (
              <div className="grid-products">
                {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid-products">
                {newArrivals.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* VIDEO CUSTOMER REVIEWS */}
      <LazySection>
      <section className="section-pad relative bg-white border-y border-black/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')] opacity-5 mix-blend-multiply pointer-events-none" />
        <Container className="relative z-10">
          <div className="section-header">
            <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase font-bold">Real Stories</p>
            <h2 className="heading-section text-[#1A1A1A]">Customer Video Reviews</h2>
            <div className="divider-gold mb-5" />
            <p className="text-black/50 text-body text-measure mx-auto font-medium">
              Hear directly from our beloved clients about their experience with Jannat Rugs Co. and how our authentic hand-knotted carpets transformed their homes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
                
                <div className="mt-5 mb-3 text-center px-4">
                  <p className="text-[#1A1A1A]/80 italic font-luxury text-base sm:text-lg mb-3 leading-relaxed line-clamp-2">
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
        </Container>
      </section>
      </LazySection>

      {/* FAQ */}
      <section className="section-pad bg-[#FAF7F2]" style={{ borderTop: '1px solid rgba(182, 150, 64, 0.1)' }}>
        <Container narrow>
          <div className="section-header">
            <p className="text-[#1A1A1A] text-[10px] tracking-[0.5em] uppercase font-bold">Common Questions</p>
            <h2 className="heading-section text-[#1A1A1A]">Everything You Need To Know</h2>
            <div className="divider-gold w-20 sm:w-24" />
          </div>
          <div className="space-y-4">
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
        </Container>
      </section>

      {/* MEET OUR TEAM SECTION */}
      <section className="section-pad relative overflow-hidden bg-white border-t border-black/5">
        <Container className="relative z-10">
          <div className="section-header">
            <p className="text-[#B69640] text-[10px] tracking-[0.4em] uppercase font-bold">The Artisans Behind The Brand</p>
            <h2 className="heading-section text-[#1A1A1A]">Meet Our Team</h2>
            <div className="w-20 h-[1px] bg-[#B69640]" />
          </div>

          <div className="space-y-14 sm:space-y-20">
            {TEAM.map((member, i) => {
              const Icon = member.icon;
              return (
                <div key={member.name} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-14`}>
                  {/* Image */}
                  <motion.div 
                    initial={{ opacity: 0, x: i % 2 !== 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-5/12 flex justify-center"
                  >
                    <div className="relative w-56 h-72 sm:w-72 sm:h-[360px] rounded-t-[10rem] rounded-b-[2rem] overflow-hidden shadow-2xl border border-black/5 group bg-white">
                      <img key={member.image} src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
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
                    <h3 className="text-2xl sm:text-4xl font-luxury text-[#1A1A1A] mb-5">{member.name}</h3>
                    <p className="text-black/60 text-body text-measure mx-auto md:mx-0 font-medium">
                      {member.bio}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 sm:mt-14">
            <Link to="/team" className="btn-outline-gold inline-flex items-center gap-3 px-10 py-4 text-xs tracking-widest uppercase rounded-lg">
              View Full Team <FiArrowRight size={16} />
            </Link>
          </div>
        </Container>
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

function LazySection({ children, minHeight = "400px" }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px 0px' });
  return (
    <div ref={ref} style={{ minHeight: inView ? 'auto' : minHeight }}>
      {inView ? children : null}
    </div>
  );
}
