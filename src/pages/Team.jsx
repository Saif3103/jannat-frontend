import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiTruck, FiShield, FiRotateCcw, FiHeadphones, FiCode, FiTrendingUp } from 'react-icons/fi';
import { GiQueenCrown } from 'react-icons/gi';
import { useSettingsStore } from '../store';
import { BASE_URL } from '../api/axios';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80';
const PLACEHOLDER_F = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80';

export default function Team() {
  const { settings } = useSettingsStore();
  const [openFaq, setOpenFaq] = useState(0);

  const getImageUrl = (url, fallback = PLACEHOLDER) => {
    if (!url) return fallback;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${BASE_URL}/${url}`;
  };

  const TEAM = [
    {
      name: 'Azeem Ansari',
      role: 'Founder & Creative Director',
      icon: GiQueenCrown,
      color: '#C9A84C',
      image: getImageUrl(settings?.founderImage),
      bio: 'Founded Jannat Rugs Co. from a passion for preserving India\'s rich weaving heritage. With decades of expertise, Azeem leads with vision, blending tradition with modern aesthetics to create timeless masterpieces.',
    },
    {
      name: 'Sahana Ansari',
      role: 'Co-Founder & Brand Strategist',
      icon: FiTrendingUp,
      color: '#C96B8A',
      image: getImageUrl(settings?.sahanaImage, PLACEHOLDER_F),
      bio: 'Sahana is the creative force behind Jannat Rugs\' brand identity. As Co-Founder, she drives the brand vision, aesthetic direction, and customer experience — ensuring every touchpoint reflects luxury and trust.',
    },
    {
      name: 'Saif Ali',
      role: 'Developer & Marketing Team',
      icon: FiCode,
      color: '#3B82F6',
      image: getImageUrl(settings?.saifImage, PLACEHOLDER),
      bio: 'Saif powers the digital side of Jannat Rugs — from building the online store to running digital marketing campaigns. His tech expertise and creative marketing strategies are what bring Jannat Rugs to customers worldwide.',
    },
  ];

  const faqs = [
    { q: "Are your carpets genuinely handmade?", a: "Yes, every single rug in our collection is hand-knotted or hand-tufted by master artisans using traditional techniques passed down through generations." },
    { q: "How do I care for my carpet?", a: "We recommend regular vacuuming and professional cleaning every 1-2 years. Avoid direct sunlight and rotate your rug every few months for even wear." },
    { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy if the item is in its original condition. Please contact our support for a return authorization." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, net banking, UPI, and bank transfers through our secure payment gateway." },
    { q: "Do you offer custom carpet sizes?", a: "Absolutely. We specialize in bespoke orders. You can specify dimensions, patterns, and materials to create a unique piece for your home." },
    { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide via premium logistics partners like FedEx and DHL with full insurance." }
  ];

  return (
    <>
      <Helmet><title>Our Team | Jannat Rugs Co.</title></Helmet>

      <div className="bg-[#050505] min-h-screen pt-32 pb-20 font-sans text-white">

        {/* ── HERO HEADER ── */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.5em] mb-4">The People Behind the Craft</p>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight font-light">
              Meet Our <span className="text-[#C9A84C] italic">Team</span>
            </h1>
            <div className="w-12 h-0.5 bg-[#C9A84C] mx-auto mb-6" />
            <p className="text-white/40 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
              A team of visionaries, artisans, and innovators united by a single passion — crafting the world's finest handmade rugs.
            </p>
          </motion.div>
        </div>

        {/* ── TEAM GRID ── */}
        <div className="max-w-7xl mx-auto px-4 mb-32">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group bg-[#0A0A0A] border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-all duration-500 hover:shadow-2xl"
              >
                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/20 to-transparent" />
                  {/* Role badge */}
                  <div
                    className="absolute top-4 left-4 w-9 h-9 rounded-xl flex items-center justify-center text-black shadow-lg"
                    style={{ backgroundColor: member.color }}
                  >
                    <member.icon size={16} />
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg tracking-tight mb-1">{member.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: member.color }}>
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed font-light">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="max-w-5xl mx-auto px-4 mb-32 text-center">
          <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Common Questions</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-16">Everything You Need To Know</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-left">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-800 bg-[#0A0A0A] rounded-2xl overflow-hidden hover:border-gray-700 transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full p-5 flex items-center justify-between"
                >
                  <span className="text-gray-200 font-semibold text-sm text-left">{faq.q}</span>
                  <div className="text-[#C9A84C] ml-4 flex-shrink-0">
                    {openFaq === i ? <FiMinus size={16} /> : <FiPlus size={16} />}
                  </div>
                </button>
                <motion.div initial={false} animate={{ height: openFaq === i ? 'auto' : 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-800/50 pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TRUST BADGES ── */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#0A0A0A] border border-gray-800 p-10 md:p-14 rounded-[3rem] grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiTruck, title: "Free Shipping", sub: "On all orders" },
              { icon: FiShield, title: "Secure Payment", sub: "100% secure" },
              { icon: FiRotateCcw, title: "7-day Returns", sub: "Easy returns" },
              { icon: FiHeadphones, title: "Dedicated Support", sub: "Always here" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-[#C9A84C] border border-gray-800 transition-all group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-black flex-shrink-0">
                  <b.icon size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">{b.title}</h4>
                  <p className="text-gray-600 text-[10px] font-medium uppercase tracking-widest">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
