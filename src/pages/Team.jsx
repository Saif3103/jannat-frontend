import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiTruck, FiShield, FiRotateCcw, FiHeadphones, FiCode, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { GiQueenCrown } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../store';
import { BASE_URL } from '../api/axios';

const PLACEHOLDER   = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80';
const PLACEHOLDER_F = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80';

export default function Team() {
  const { settings, fetchSettings } = useSettingsStore();
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getImageUrl = (url, fallback = PLACEHOLDER) => {
    if (!url) return fallback;
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('/')) return url;
    return `${BASE_URL}/${url}`;
  };

  // Rebuild when settings images change so Team page always shows latest uploads
  const founderSrc = getImageUrl(settings?.founderImage);
  const sahanaSrc = getImageUrl(settings?.sahanaImage, PLACEHOLDER_F);
  const saifSrc = getImageUrl(settings?.saifImage, '/saif-ali.jpg');

  const TEAM = [
    {
      name: 'Azeem Ansari',
      role: 'Founder & Creative Director',
      icon: GiQueenCrown,
      color: '#B69640',
      image: founderSrc,
      bio: 'Founded Jannat Rugs Co. from a deep passion for preserving India\'s rich weaving heritage. With decades of expertise, Azeem leads with vision — blending centuries-old tradition with modern aesthetics to create timeless masterpieces that grace homes around the world.',
      tag: 'The Visionary',
    },
    {
      name: 'Sahana Ansari',
      role: 'Co-Founder & Brand Strategist',
      icon: FiTrendingUp,
      color: '#C96B8A',
      image: sahanaSrc,
      bio: 'Sahana is the creative force behind Jannat Rugs\' brand identity. As Co-Founder, she drives the brand vision, aesthetic direction, and customer experience — ensuring every touchpoint reflects luxury, warmth, and trust.',
      tag: 'The Creative',
    },
    {
      name: 'Saif Ali',
      role: 'Developer & Digital Marketing',
      icon: FiCode,
      color: '#3B82F6',
      image: saifSrc,
      bio: 'Saif powers the digital soul of Jannat Rugs — from building this very store to running campaigns that connect our artisans with customers worldwide. His tech expertise and creative marketing strategies bring Jannat Rugs into the modern era.',
      tag: 'The Innovator',
    },
  ];

  const faqs = [
    { q: "Are your carpets genuinely handmade?", a: "Yes, every single rug in our collection is hand-knotted or hand-tufted by master artisans using traditional techniques passed down through generations." },
    { q: "How do I care for my carpet?", a: "We recommend regular vacuuming and professional cleaning every 1-2 years. Avoid direct sunlight and rotate your rug every few months for even wear." },
    { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy if the item is in its original condition. Please contact our support for a return authorization." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, net banking, UPI, and bank transfers through our secure payment gateway." },
    { q: "Do you offer custom carpet sizes?", a: "Absolutely. We specialize in bespoke orders. You can specify dimensions, patterns, and materials to create a unique piece for your home." },
    { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide via premium logistics partners with full insurance." },
  ];

  return (
    <>
      <Helmet>
        <title>Our Team | Jannat Rugs Co.</title>
        <meta name="description" content="Meet the passionate team behind Jannat Rugs Co. — artisans, visionaries and innovators crafting India's finest handmade rugs." />
      </Helmet>

      <div className="bg-[#FAF7F2] min-h-screen font-sans">

        {/* ── HERO HEADER ── */}
        <div className="relative overflow-hidden pt-32 pb-24 px-4">
          {/* Subtle pattern bg */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(#B69640 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B69640] to-transparent" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="text-[#B69640] text-[10px] font-bold uppercase tracking-[0.6em] mb-5">
                The People Behind the Craft
              </p>
              <h1 className="font-luxury text-5xl sm:text-7xl md:text-8xl text-[#1A1A1A] mb-6 leading-tight">
                Meet Our <span className="italic text-[#B69640]">Team</span>
              </h1>
              <div className="w-16 h-[1px] bg-[#B69640] mx-auto mb-8" />
              <p className="text-[#1A1A1A]/50 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                A family of visionaries, artisans, and innovators united by a single passion — crafting the world's finest handmade rugs.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── TEAM — ZIG-ZAG LAYOUT ── */}
        <div className="max-w-6xl mx-auto px-4 pb-24 space-y-20 sm:space-y-28">
          {TEAM.map((member, i) => {
            const Icon = member.icon;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16`}
              >
                {/* Image */}
                <div className="w-full lg:w-5/12 flex justify-center flex-shrink-0">
                  <div className="relative">
                    {/* Decorative gold square behind image */}
                    <div
                      className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 opacity-30"
                      style={{ borderColor: member.color }}
                    />
                    <div className="relative w-72 h-[360px] sm:w-80 sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        key={member.image}
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ${
                          member.imageClass || ''
                        }`}
                      />
                      {/* Tag badge */}
                      <div
                        className="absolute top-5 left-5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-lg"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.tag}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className={`w-full lg:w-7/12 text-center ${isEven ? 'lg:text-left' : 'lg:text-right'}`}>
                  <div className={`flex items-center gap-3 mb-3 ${isEven ? 'justify-center lg:justify-start' : 'justify-center lg:justify-end'}`}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: member.color + '20', color: member.color }}>
                      <Icon size={16} />
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: member.color }}>
                      {member.role}
                    </p>
                  </div>

                  <h2 className="font-luxury text-4xl sm:text-5xl text-[#1A1A1A] mb-2 leading-tight">
                    {member.name}
                  </h2>

                  <div className={`w-10 h-[1.5px] mb-6 ${isEven ? 'mx-auto lg:mx-0' : 'mx-auto lg:ml-auto'}`}
                    style={{ backgroundColor: member.color }} />

                  <p className="text-[#1A1A1A]/55 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-medium">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── TRUST BADGES ── */}
        <div className="bg-white border-y border-[#E8DFC8] py-14 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {[
              { icon: FiTruck,      title: "Free Shipping",     sub: "On all orders"  },
              { icon: FiShield,     title: "Secure Payment",    sub: "100% secure"    },
              { icon: FiRotateCcw,  title: "7-day Returns",     sub: "Easy returns"   },
              { icon: FiHeadphones, title: "Dedicated Support",  sub: "Always here"    },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-[#FAF7F2] rounded-2xl flex items-center justify-center text-[#B69640] border border-[#E8DFC8] transition-all group-hover:bg-[#B69640] group-hover:text-white flex-shrink-0 shadow-sm">
                  <b.icon size={20} />
                </div>
                <div>
                  <h4 className="text-[#1A1A1A] font-bold text-sm mb-0.5">{b.title}</h4>
                  <p className="text-black/40 text-[10px] font-medium uppercase tracking-widest">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-4xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-center mb-14">
            <p className="text-[#B69640] text-[10px] font-bold uppercase tracking-[0.5em] mb-4">Common Questions</p>
            <h2 className="font-luxury text-4xl sm:text-5xl text-[#1A1A1A] mb-4">Everything You Need To Know</h2>
            <div className="w-12 h-[1px] bg-[#B69640] mx-auto" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-[#B69640]/40 bg-white shadow-md' : 'border-[#E8DFC8] bg-white/60 hover:border-[#B69640]/30'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                >
                  <span className={`text-sm font-semibold transition-colors ${openFaq === i ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/70'}`}>
                    {faq.q}
                  </span>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${openFaq === i ? 'bg-[#B69640] text-white' : 'bg-[#FAF7F2] text-[#B69640]'}`}>
                    {openFaq === i ? <FiMinus size={14} /> : <FiPlus size={14} />}
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-1 text-[#1A1A1A]/50 text-sm leading-relaxed border-t border-[#E8DFC8] pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-[#1A1A1A] py-20 px-4 text-center">
          <p className="text-[#B69640] text-[10px] font-bold uppercase tracking-[0.5em] mb-5">Explore Our Work</p>
          <h2 className="font-luxury text-4xl sm:text-5xl text-white mb-6">Discover Our Collection</h2>
          <div className="w-12 h-[1px] bg-[#B69640] mx-auto mb-8" />
          <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Every rug we create carries the touch of our team's passion. Explore our exclusive collection of handcrafted luxury pieces.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#C9A84C] to-[#B69640] text-black font-black px-10 py-4 rounded-xl text-sm tracking-widest uppercase hover:opacity-90 transition-opacity shadow-xl"
          >
            Shop Now <FiArrowRight size={16} />
          </Link>
        </div>

      </div>
    </>
  );
}
