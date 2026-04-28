import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiStar, FiShield, FiTruck, FiRefreshCw, FiAward } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import api from '../api/axios';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';

const HERO_SLIDES = [
  {
    title: "Luxury Handmade",
    subtitle: "Carpets & Rugs",
    desc: "Crafted by master artisans, each piece tells a story of heritage and elegance.",
    bg: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80",
    cta: "Explore Collection",
  },
  {
    title: "Royal Persian",
    subtitle: "Heritage Collection",
    desc: "Where tradition meets luxury — rugs that transform your space into a palace.",
    bg: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
    cta: "Shop Now",
  },
  {
    title: "Premium Wool &",
    subtitle: "Silk Masterpieces",
    desc: "Hand-knotted perfection. Experience the finest carpets from master weavers.",
    bg: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1600&q=80",
    cta: "View Collection",
  },
];

const TRUST_BADGES = [
  { icon: FiShield, label: "100% Authentic", desc: "Genuine handmade products" },
  { icon: FiTruck, label: "Free Shipping", desc: "On orders above ₹5,000" },
  { icon: FiRefreshCw, label: "Easy Returns", desc: "7-day return policy" },
  { icon: FiAward, label: "Award Winning", desc: "Premium quality guaranteed" },
];

const CATEGORIES_DEFAULT = [
  { name: "Persian Rugs", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Turkish Kilims", img: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80" },
  { name: "Handwoven Wool", img: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&q=80" },
  { name: "Silk Carpets", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
  { name: "Modern Rugs", img: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&q=80" },
  { name: "Luxury Collections", img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80" },
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

  useEffect(() => {
    const load = async () => {
      try {
        const [featured, best, newArr, cats] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?bestSeller=true&limit=4'),
          api.get('/products?newArrival=true&limit=4'),
          api.get('/categories'),
        ]);
        setFeaturedProducts(featured.data.products);
        setBestSellers(best.data.products);
        setNewArrivals(newArr.data.products);
        setCategories(cats.data.categories.slice(0, 6));
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

      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-full"
        >
          {HERO_SLIDES.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-full flex items-center justify-center text-center">
                <div className="absolute inset-0">
                  <img src={slide.bg} alt={slide.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.5) 0%, rgba(13,13,13,0.7) 100%)' }} />
                </div>
                <div className="relative z-10 px-4 max-w-4xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <p className="text-amber-400 text-sm tracking-[0.4em] uppercase mb-4 font-medium">Jannat Rugs Co.</p>
                    <h1 className="font-luxury text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-3">
                      {slide.title}
                    </h1>
                    <h2 className="font-luxury text-4xl md:text-6xl lg:text-7xl text-gold-gradient leading-tight mb-6">
                      {slide.subtitle}
                    </h2>
                    <p className="text-amber-100/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                      {slide.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/shop" className="btn-gold text-sm flex items-center justify-center gap-2 px-8 py-4">
                        {slide.cta} <FiArrowRight size={16} />
                      </Link>
                      <Link to="/about" className="btn-outline-gold text-sm px-8 py-4">
                        Our Story
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-12 bg-gradient-to-b from-amber-400 to-transparent mx-auto" />
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-8 border-y border-amber-900/20" style={{ background: 'rgba(201,168,76,0.03)' }}>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map(({ icon: Icon, label, desc }) => (
            <motion.div key={label} whileHover={{ y: -3 }}
              className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full border border-amber-700/40 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-amber-100 font-medium text-sm">{label}</p>
                <p className="text-amber-100/40 text-xs">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Curated For You</p>
          <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">Featured Collection</h2>
          <div className="divider-gold mb-4" />
          <p className="text-amber-100/50 max-w-lg mx-auto text-sm leading-relaxed">
            Each carpet is a work of art, handcrafted by master artisans using centuries-old techniques.
          </p>
        </div>
        {loading ? <Loader /> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? featuredProducts.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              )) : (
                <div className="col-span-full text-center py-16">
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

      {/* CATEGORIES */}
      <section className="py-20 px-4" style={{ background: 'rgba(201,168,76,0.02)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Browse By Style</p>
            <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">Shop Categories</h2>
            <div className="divider-gold" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(categories.length > 0 ? categories.map(c => ({ name: c.name, img: c.image || CATEGORIES_DEFAULT[0].img, id: c._id })) : CATEGORIES_DEFAULT.map(c => ({ ...c, id: c.name }))).map((cat, i) => (
              <motion.div key={cat.id || i}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="category-card rounded-2xl overflow-hidden cursor-pointer"
                style={{ height: i === 0 ? '360px' : '220px' }}
              >
                <Link to={`/shop?category=${cat.id}`} className="block h-full relative">
                  <img src={cat.img || CATEGORIES_DEFAULT[i % CATEGORIES_DEFAULT.length].img}
                    alt={cat.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="font-luxury text-white text-xl md:text-2xl">{cat.name}</h3>
                    <p className="text-amber-400 text-xs mt-1 flex items-center gap-1">
                      Explore <FiArrowRight size={12} />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LUXURY BANNER */}
      <section className="py-24 px-4 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1a0f00 0%, #0D0D0D 50%, #1a0f00 100%)',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        borderBottom: '1px solid rgba(201,168,76,0.15)'
      }}>
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C9A84C 0%, transparent 60%), radial-gradient(circle at 70% 50%, #9B7B2E 0%, transparent 60%)' }} />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-4">The Art of Living</p>
            <h2 className="font-luxury text-4xl md:text-6xl text-white mb-6 leading-tight">
              Every Rug Has A <span className="text-gold-gradient">Story To Tell</span>
            </h2>
            <p className="text-amber-100/50 text-base leading-relaxed mb-10 max-w-2xl mx-auto">
              From the mountains of Persia to the looms of Kashmir, our artisans weave centuries of tradition into each carpet. Discover the magic of handmade luxury.
            </p>
            <Link to="/about" className="btn-gold inline-flex items-center gap-2 px-10 py-4">
              Discover Our Story <FiArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* BEST SELLERS */}
      {(bestSellers.length > 0 || loading) && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Customer Favorites</p>
            <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">Best Sellers</h2>
            <div className="divider-gold" />
          </div>
          {loading ? <Loader /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </section>
      )}

      {/* NEW ARRIVALS */}
      {(newArrivals.length > 0 || loading) && (
        <section className="py-20 px-4" style={{ background: 'rgba(201,168,76,0.02)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Fresh From The Loom</p>
              <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">New Arrivals</h2>
              <div className="divider-gold" />
            </div>
            {loading ? <Loader /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-20 px-4" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">What Our Clients Say</p>
            <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">Customer Reviews</h2>
            <div className="divider-gold" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <FiStar key={j} size={14} className="text-amber-400 fill-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-amber-100/70 text-sm leading-relaxed mb-5 italic">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-900/40 flex items-center justify-center text-amber-400 font-bold text-lg font-luxury">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-amber-100 text-sm font-medium">{t.name}</p>
                    <p className="text-amber-100/40 text-xs">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4" style={{ background: 'rgba(201,168,76,0.02)', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Common Questions</p>
            <h2 className="font-luxury text-4xl text-white mb-4">FAQ</h2>
            <div className="divider-gold" />
          </div>
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
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-4 text-center" style={{
        background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(155,123,46,0.1))',
        borderTop: '1px solid rgba(201,168,76,0.2)'
      }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h2 className="font-luxury text-4xl md:text-5xl text-white mb-4">Ready to Transform Your Space?</h2>
          <p className="text-amber-100/50 mb-8 max-w-xl mx-auto">Explore our complete collection of handmade luxury carpets and find the perfect centerpiece for your home.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2 px-10 py-4">
              Shop Now <FiArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-outline-gold inline-flex items-center gap-2 px-10 py-4">
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-amber-900/20 py-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left gap-4 group">
        <span className="text-amber-100/80 group-hover:text-amber-400 transition-colors font-medium text-sm">{question}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-amber-400 text-xl flex-shrink-0">+</motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="text-amber-100/50 text-sm leading-relaxed pt-3">{answer}</p>
      </motion.div>
    </div>
  );
}
