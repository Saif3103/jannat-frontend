import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiStar, FiShield, FiTruck, FiRefreshCw, FiAward, FiUsers } from 'react-icons/fi';
import { GiQueenCrown, GiRugbyConversion as LuRug } from 'react-icons/gi';
import api, { BASE_URL } from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import RugQuiz from '../components/ui/RugQuiz';
import OfferPill from '../components/ui/OfferPill';
import RugShowcaseStrip from '../components/ui/RugShowcaseStrip';
import SmartRecommendations from '../components/ui/SmartRecommendations';
import DynamicHero from '../components/ui/SmartHero.jsx';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80';
  if (typeof url !== 'string') return url;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [videoReviews, setVideoReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [featured, best, newArr, cats, setts, vReviews] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?bestSeller=true&limit=4'),
          api.get('/products?newArrival=true&limit=4'),
          api.get('/categories'),
          api.get('/settings'),
          api.get('/video-reviews'),
        ]);
        
        if (featured?.data?.products) setFeaturedProducts(featured.data.products);
        if (best?.data?.products) setBestSellers(best.data.products);
        if (newArr?.data?.products) setNewArrivals(newArr.data.products);
        if (cats?.data?.categories) setCategories(cats.data.categories.slice(0, 6));
        if (setts?.data?.settings) setSettings(setts.data.settings);
        if (vReviews?.data?.reviews) setVideoReviews(vReviews.data.reviews.slice(0, 2));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>Jannat Rugs Co. – Premium Handmade Carpets & Luxury Rugs</title>
        <meta name="description" content="Discover our exquisite collection of handmade Persian carpets, luxury rug collection. Crafted by master artisans." />
      </Helmet>

      <div className="bg-transparent">
        <DynamicHero 
          videoUrl={settings?.heroVideo ? getImageUrl(settings.heroVideo) : null} 
          logo="/logo.png" 
        />

      {/* FESTIVE OFFER BANNER */}
      <section className="py-20 sm:py-32 px-4 relative overflow-hidden bg-[#0A0A0A] border-y border-amber-900/20">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-20">
             <div className="max-w-3xl text-center lg:text-left">
                <div>
                   <p className="text-amber-500 font-black tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-6 flex items-center justify-center lg:justify-start gap-3">
                      <span className="w-8 h-px bg-amber-500" /> Limited Time Exclusive
                   </p>
                   <h2 className="font-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-10 leading-[1.05]">
                      Festive Luxury <br />
                      <span className="text-[#C9A84C] italic">Collection 2026</span>
                   </h2>
                   <p className="text-white/60 text-base sm:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0">
                      Celebrate the season with handcrafted masterpieces. Get up to <span className="text-white font-black text-2xl sm:text-3xl mx-1 underline decoration-amber-500 underline-offset-8">50% OFF</span> on our rugs.
                   </p>
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
                </div>
             </div>
             <div className="text-center lg:text-right">
                <Link to="/shop" className="group flex items-center gap-4 bg-gradient-to-r from-[#C9A84C] to-[#E5C266] text-black px-12 py-5 rounded-xl font-black text-sm tracking-[0.2em] uppercase shadow-[0_15px_30px_rgba(201,168,76,0.3)]">
                   Shop Now <FiArrowRight strokeWidth={3} />
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* BRAND HERITAGE BANNER */}
      <section className="py-16 sm:py-24 border-y border-amber-900/5" style={{ background: '#FFFFFF' }}>
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
      <section className="py-20 sm:py-32 px-4 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[3rem] p-10 sm:p-20 shadow-[0_20px_80px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C9A84C]/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#C9A84C]/5 to-transparent rounded-full -ml-20 -mb-20 blur-3xl" />
            <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-20 relative z-10">
               <div className="w-full lg:w-[45%] flex justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 sm:w-64 sm:h-64 bg-[#FAF7F2] rounded-[3rem] flex items-center justify-center border border-[#C9A84C]/10">
                       <LuRug size={80} className="text-[#C9A84C]" />
                    </div>
                  </div>
               </div>
               <div className="w-full lg:w-[55%] text-center lg:text-left">
                  <p className="text-[#C9A84C] text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Personalized Discovery</p>
                  <h2 className="font-heading text-4xl sm:text-6xl text-[#1A1A1A] mb-8 leading-tight">Find Your <span className="italic font-luxury">Perfect</span> Rug</h2>
                  <p className="text-[#64748B] text-base sm:text-xl leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0">
                    Not sure which rug fits your space? Answer 5 quick questions.
                  </p>
                  <button onClick={() => setIsQuizOpen(true)} className="btn-gold inline-flex items-center justify-center gap-4 px-12 py-5 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-2xl">
                    Start The Quiz <FiArrowRight size={20} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>

      <RugQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
      <OfferPill />
      <RugShowcaseStrip />

      {/* FEATURED COLLECTION */}
      <section className="py-16 sm:py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-24">
          <p className="text-[#1A1A1A] text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-3 font-bold">Curated For You</p>
          <h2 className="font-luxury text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] mb-4">Featured Collection</h2>
          <div className="divider-gold mb-4" />
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </section>

      {/* BRAND AD VIDEO */}
      {settings?.adVideo && (
        <section className="py-16 sm:py-24 px-4 bg-black relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-900/30">
              <video controls playsInline className="w-full h-full object-cover">
                <source src={getImageUrl(settings.adVideo)} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="py-0">
        {categories.slice(0, 3).map((cat, i) => (
          <div key={cat.name} className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[450px] lg:min-h-[600px] border-b border-amber-900/10`}>
            <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-auto overflow-hidden">
              <img src={getImageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white text-center">
              <div className="max-w-md">
                <h3 className="font-luxury text-3xl md:text-5xl text-[#1A1A1A] mb-4">{cat.name}</h3>
                <Link to={`/shop?search=${cat.name}`} className="btn-outline-gold inline-flex items-center justify-center gap-2 px-8 py-3 text-[10px] uppercase">
                  Explore <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* BESPOKE */}
      <section className="py-0 px-0 relative flex flex-col lg:flex-row min-h-[450px] lg:min-h-[600px] border-b border-amber-900/20" style={{ background: '#0a0a0a' }}>
        <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-auto overflow-hidden">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://cdn.shopify.com/videos/c/o/v/6300a3211db748b88ff208c7e3eec239.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 section-alt">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="font-luxury text-3xl md:text-6xl text-[#1A1A1A] mb-4 leading-tight">Custom Rugs</h2>
            <a href="https://wa.me/919235508422" className="btn-gold px-8 py-3 uppercase text-[10px]">Inquire Now</a>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-16 sm:py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-luxury text-3xl sm:text-4xl text-[#1A1A1A]">Best Sellers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 sm:py-32 px-4 relative section-alt">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoReviews.map((rev) => (
              <div key={rev._id} className="w-full glass-card-dark p-4 rounded-[24px] bg-black/40">
                <div className="relative aspect-video rounded-[24px] overflow-hidden bg-black">
                  <video controls className="w-full h-full object-cover">
                    <source src={getImageUrl(rev.video)} />
                  </video>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-[#1A1A1A]/80 italic font-luxury text-lg mb-4">"{rev.comment}"</p>
                  <p className="text-[#1A1A1A] text-[10px] uppercase">— {rev.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-40 px-4 section-alt">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="font-luxury text-3xl sm:text-5xl text-[#1A1A1A]">FAQ</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Handmade?", a: "Yes, 100%." },
              { q: "Returns?", a: "7-day policy." },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 sm:py-40 px-4" style={{ background: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <img src={getImageUrl(settings?.founderImage)} alt="Founder" className="w-full max-w-md mx-auto rounded-[2rem] shadow-2xl" />
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#C9A84C] mb-6">Azeem Ansari</h2>
              <p className="text-gray-500 mb-10">Founder of Jannat Rugs.</p>
              <Link to="/team" className="btn-gold px-10 py-4 uppercase text-xs">Meet Our Team</Link>
            </div>
          </div>
        </div>
      </section>

      <SmartRecommendations title="Luxury Styles You May Love" />

      {/* CTA */}
      <section className="relative py-24 sm:py-40 px-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative z-10 text-center">
          <div>
            <h2 className="font-luxury text-3xl sm:text-7xl text-white mb-6">Ready to Transform?</h2>
            <Link to="/shop" className="btn-gold px-12 py-5 text-sm uppercase">Shop Collection</Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card-dark rounded-2xl border border-amber-900/10 mb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left px-6 py-5">
        <span className="text-[#1A1A1A] font-medium">{question}</span>
        <span className="text-2xl text-[#1A1A1A]">{open ? '-' : '+'}</span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2">
          <p className="text-[#1A1A1A]/50 text-sm leading-relaxed border-t border-amber-900/10 pt-4">{answer}</p>
        </div>
      )}
    </div>
  );
}
