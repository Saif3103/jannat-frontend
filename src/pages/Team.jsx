import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiTruck, FiShield, FiRotateCcw, FiHeadphones } from 'react-icons/fi';
import { GiQueenCrown } from 'react-icons/gi';
import { useSettingsStore } from '../store';
import { BASE_URL } from '../api/axios';

export default function Team() {
  const { settings } = useSettingsStore();
  const [openFaq, setOpenFaq] = useState(0);

  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80";
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${BASE_URL}/${url}`;
  };

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
      <Helmet><title>Our Founder | Jannat Rugs Co.</title></Helmet>
      <div className="bg-[#050505] min-h-screen pt-32 pb-20 px-4 font-sans text-white">
        
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto mb-12 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-gray-500">
          <span className="hover:text-white cursor-pointer transition-colors">Home</span>
          <span className="text-gray-700">/</span>
          <span className="hover:text-white cursor-pointer transition-colors">About Us</span>
          <span className="text-gray-700">/</span>
          <span className="text-amber-400">Our Founders</span>
        </div>

        {/* Founder Section */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-32 mb-40">
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[45%] aspect-[4/5] rounded-[2rem] overflow-hidden border border-gray-800 shadow-2xl relative group"
          >
            <img 
              src={getImageUrl(settings?.founderImage) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"} 
              alt="Founder Azeem Ansari" 
              className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          </motion.div>

          {/* Right: Content */}
          <div className="w-full lg:w-[55%]">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.4em] mb-6">Get To Know Us</p>
              <h1 className="font-serif text-5xl md:text-7xl text-white mb-10 leading-[1.1] font-light">
                The Visionary Behind <br />
                <span className="text-[#C9A84C] font-normal italic">Jannat Rugs</span>
              </h1>
              
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed mb-12 font-light">
                <p>
                  Founded by <span className="text-white font-medium">Azeem Ansari</span>, Jannat Rugs Co. was born from a passion for preserving India's rich weaving heritage and transforming it into timeless pieces of art.
                </p>
                <p>
                  With a vision to blend tradition with modern aesthetics, Azeem Ansari leads a team of skilled artisans who pour their heart into every creation.
                </p>
                <p>
                  Each rug we craft is more than a product — it's a story of culture, craftsmanship, and care.
                </p>
              </div>

              {/* Name Card */}
              <div className="bg-[#0A0A0A] border border-gray-800/50 p-6 rounded-3xl flex items-center gap-6 max-w-md shadow-xl">
                <div className="w-14 h-14 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center text-[#C9A84C] border border-[#C9A84C]/20">
                  <GiQueenCrown size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Azeem Ansari</h3>
                  <p className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-[0.2em] mt-1">Founder & Creative Director</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-7xl mx-auto mb-40 text-center">
          <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Common Questions</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-16">Everything You Need To Know</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-left">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-800 bg-[#0A0A0A] rounded-2xl overflow-hidden transition-all hover:border-gray-700">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full p-6 flex items-center justify-between group"
                >
                  <span className="text-gray-200 font-bold text-sm text-left">{faq.q}</span>
                  <div className="text-[#C9A84C] transition-transform duration-300">
                    {openFaq === i ? <FiMinus size={20} /> : <FiPlus size={20} className="group-hover:rotate-90" />}
                  </div>
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-gray-800/50 pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0A0A0A] border border-gray-800 p-10 md:p-16 rounded-[3rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative overflow-hidden">
            {[
              { icon: FiTruck, title: "Free Shipping", sub: "On all orders" },
              { icon: FiShield, title: "Secure Payment", sub: "100% secure checkout" },
              { icon: FiRotateCcw, title: "7-day Returns", sub: "Easy return policy" },
              { icon: FiHeadphones, title: "Dedicated Support", sub: "We're here to help" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-[#C9A84C] border border-gray-800 transition-all group-hover:scale-110 group-hover:bg-[#C9A84C] group-hover:text-black">
                  <b.icon size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{b.title}</h4>
                  <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">{b.sub}</p>
                </div>
                {i < 3 && <div className="hidden lg:block absolute h-12 w-px bg-gray-800 right-[25%] left-auto" style={{ left: `${(i+1)*25}%`, right: 'auto' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
