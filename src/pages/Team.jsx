import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FiPlus, FiMinus, FiTruck, FiShield, FiRotateCcw,
  FiHeadphones, FiCode, FiTrendingUp, FiArrowRight
} from 'react-icons/fi';
import { GiQueenCrown } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { useSettingsStore } from '../store';
import { BASE_URL } from '../api/axios';

const PH_M = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80';
const PH_F = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80';

export default function Team() {
  const { settings } = useSettingsStore();
  const [openFaq, setOpenFaq] = useState(null);

  const img = (url, fallback = PH_M) => {
    if (!url) return fallback;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${BASE_URL}/${url}`;
  };

  const TEAM = [
    {
      name: 'Azeem Ansari',
      role: 'Founder & Creative Director',
      Icon: GiQueenCrown,
      accent: '#B69640',
      photo: img(settings?.founderImage),
      bio: 'Founded Jannat Rugs Co. from a lifelong passion for preserving India\'s rich weaving heritage. With decades of expertise, Azeem leads with vision — blending centuries-old tradition with modern aesthetics to create timeless masterpieces.',
      featured: true,
    },
    {
      name: 'Sahana Ansari',
      role: 'Co-Founder & Brand Strategist',
      Icon: FiTrendingUp,
      accent: '#C96B8A',
      photo: img(settings?.sahanaImage, PH_F),
      bio: 'The creative force behind Jannat Rugs\' identity. Sahana drives brand vision, aesthetic direction, and customer experience — ensuring every touchpoint reflects warmth, luxury and trust.',
      featured: false,
    },
    {
      name: 'Saif Ali',
      role: 'Developer & Digital Marketing',
      Icon: FiCode,
      accent: '#3B82F6',
      photo: img(settings?.saifImage),
      bio: 'Powers the digital soul of Jannat Rugs — from building this store to running campaigns that connect artisans with customers worldwide.',
      featured: false,
    },
  ];

  const faqs = [
    { q: 'Are your carpets genuinely handmade?', a: 'Yes, every rug is hand-knotted or hand-tufted by master artisans using traditional techniques passed down through generations.' },
    { q: 'How do I care for my carpet?', a: 'Regular vacuuming and professional cleaning every 1-2 years. Avoid direct sunlight and rotate every few months for even wear.' },
    { q: 'What is your return policy?', a: '7-day hassle-free returns if the item is in original condition. Contact our support for a return authorization.' },
    { q: 'What payment methods do you accept?', a: 'All major credit/debit cards, net banking, UPI, and bank transfers through our secure payment gateway.' },
    { q: 'Do you offer custom carpet sizes?', a: 'Absolutely. You can specify dimensions, patterns, and materials for a completely bespoke piece.' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide via premium logistics with full insurance coverage.' },
  ];

  return (
    <>
      <Helmet>
        <title>Our Team | Jannat Rugs Co.</title>
        <meta name="description" content="Meet the passionate team behind Jannat Rugs Co." />
      </Helmet>

      <div className="bg-[#FAF7F2] min-h-screen">

        {/* ── HERO ── */}
        <div className="relative pt-36 pb-20 px-4 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#B69640 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }}
          />
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B69640]/60 to-transparent" />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-[#B69640] text-[10px] font-black uppercase tracking-[0.7em] mb-5">
                The People Behind The Craft
              </p>
              <h1 className="font-luxury text-5xl sm:text-7xl text-[#1A1A1A] leading-tight mb-5">
                Meet Our <em className="not-italic text-[#B69640]">Team</em>
              </h1>
              <div className="w-14 h-[1.5px] bg-[#B69640] mx-auto mb-7" />
              <p className="text-[#1A1A1A]/50 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                A family of visionaries and innovators united by one passion — crafting the world's finest handmade rugs.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── FEATURED FOUNDER (AZEEM) – full-width editorial card ── */}
        {(() => {
          const m = TEAM[0];
          return (
            <div className="px-4 pb-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-[#E8DFC8] flex flex-col md:flex-row"
              >
                {/* Photo — left side */}
                <div className="md:w-[42%] w-full shrink-0">
                  <div className="h-72 md:h-full min-h-[340px] relative overflow-hidden">
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Overlay gradient for aesthetics */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 md:to-white/5" />
                    {/* Role pill */}
                    <div
                      className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 rounded-full text-black text-[10px] font-black uppercase tracking-widest shadow-lg"
                      style={{ backgroundColor: m.accent }}
                    >
                      <m.Icon size={12} /> Founder
                    </div>
                  </div>
                </div>

                {/* Text — right side */}
                <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-3" style={{ color: m.accent }}>
                    {m.role}
                  </p>
                  <h2 className="font-luxury text-4xl sm:text-5xl text-[#1A1A1A] mb-4 leading-tight">
                    {m.name}
                  </h2>
                  <div className="w-10 h-[1.5px] mb-6" style={{ backgroundColor: m.accent }} />
                  <p className="text-[#1A1A1A]/55 text-sm sm:text-[15px] leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })()}

        {/* ── CO-FOUNDER & DEVELOPER – 2-col grid ── */}
        <div className="px-4 pb-20 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TEAM.slice(1).map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-md border border-[#E8DFC8] flex flex-col"
            >
              {/* Photo */}
              <div className="relative h-64 sm:h-72 overflow-hidden shrink-0">
                <img
                  src={m.photo}
                  alt={m.name}
                  className="w-full h-full object-cover object-top"
                />
                {/* Role badge */}
                <div
                  className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-black text-[9px] font-black uppercase tracking-widest shadow-md"
                  style={{ backgroundColor: m.accent }}
                >
                  <m.Icon size={11} />
                  {i === 0 ? 'Co-Founder' : 'Developer'}
                </div>
              </div>

              {/* Text */}
              <div className="p-7 flex flex-col flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: m.accent }}>
                  {m.role}
                </p>
                <h3 className="font-luxury text-3xl text-[#1A1A1A] mb-3 leading-tight">{m.name}</h3>
                <div className="w-8 h-[1.5px] mb-5" style={{ backgroundColor: m.accent }} />
                <p className="text-[#1A1A1A]/50 text-sm leading-relaxed">{m.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TRUST BADGES ── */}
        <div className="bg-white border-y border-[#E8DFC8] py-12 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {[
              { Icon: FiTruck,      title: 'Free Shipping',    sub: 'On all orders' },
              { Icon: FiShield,     title: 'Secure Payment',   sub: '100% secure'   },
              { Icon: FiRotateCcw,  title: '7-day Returns',    sub: 'Easy returns'  },
              { Icon: FiHeadphones, title: '24/7 Support',     sub: 'Always here'   },
            ].map(({ Icon, title, sub }, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-11 h-11 bg-[#FAF7F2] rounded-xl flex items-center justify-center text-[#B69640] border border-[#E8DFC8] group-hover:bg-[#B69640] group-hover:text-white transition-all duration-300 shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[#1A1A1A] font-bold text-sm">{title}</p>
                  <p className="text-[#1A1A1A]/35 text-[10px] uppercase tracking-widest">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-3xl mx-auto px-4 py-20 sm:py-24">
          <div className="text-center mb-12">
            <p className="text-[#B69640] text-[10px] font-black uppercase tracking-[0.5em] mb-4">Common Questions</p>
            <h2 className="font-luxury text-4xl sm:text-5xl text-[#1A1A1A] mb-4">
              Everything You Need To Know
            </h2>
            <div className="w-12 h-[1px] bg-[#B69640] mx-auto" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={`border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  openFaq === i
                    ? 'border-[#B69640]/40 bg-white shadow-sm'
                    : 'border-[#E8DFC8] bg-white/70 hover:border-[#B69640]/25'
                }`}
              >
                <div className="flex items-center justify-between px-6 py-5 gap-4">
                  <span className={`text-sm font-semibold leading-snug ${openFaq === i ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/70'}`}>
                    {faq.q}
                  </span>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      openFaq === i ? 'bg-[#B69640] text-white' : 'bg-[#F0EAD8] text-[#B69640]'
                    }`}
                  >
                    {openFaq === i ? <FiMinus size={13} /> : <FiPlus size={13} />}
                  </div>
                </div>
                {openFaq === i && (
                  <div className="px-6 pb-6 pt-0 border-t border-[#E8DFC8]">
                    <p className="text-[#1A1A1A]/50 text-sm leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="bg-[#1A1A1A] py-20 px-4 text-center">
          <p className="text-[#B69640] text-[10px] font-black uppercase tracking-[0.5em] mb-5">Explore Our Work</p>
          <h2 className="font-luxury text-4xl sm:text-5xl text-white mb-5">Discover Our Collection</h2>
          <div className="w-12 h-[1px] bg-[#B69640] mx-auto mb-8" />
          <p className="text-white/40 text-sm max-w-md mx-auto mb-10 leading-relaxed">
            Every rug carries the touch of our team's passion. Explore our exclusive handcrafted luxury pieces.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#C9A84C] to-[#B69640] text-black font-black px-10 py-4 rounded-xl text-sm tracking-widest uppercase hover:opacity-90 transition-opacity shadow-xl"
          >
            Shop Now <FiArrowRight size={15} />
          </Link>
        </div>

      </div>
    </>
  );
}
