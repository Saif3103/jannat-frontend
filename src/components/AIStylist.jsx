import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiSend, FiCamera, FiUpload, FiMaximize2, 
  FiChevronRight, FiChevronLeft, FiHeart, FiShoppingCart, 
  FiMessageCircle, FiGrid, FiLayout, FiLayers, FiCheckCircle,
  FiInfo, FiStar, FiShare2, FiZap, FiTarget, FiHome, FiSettings,
  FiActivity, FiShield, FiTrendingUp, FiArrowRight
} from 'react-icons/fi';
import { LuPaintbrush, LuLayoutTemplate, LuArrowRightLeft, LuSparkles, LuBox, LuWaves } from 'react-icons/lu';
import { useCartStore, useWishlistStore, useAuthStore, useUIStore } from '../store';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- Styled Components & Constants ---

const LUXURY_GOLD = "#C8A96A";
const DARK_BG = "#080808";

const FeatureCard = ({ icon: Icon, title, description, onClick }) => (
  <motion.button
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative w-full flex items-center gap-6 p-7 rounded-[32px] bg-white/[0.03] border border-white/10 hover:border-[#C8A96A]/40 transition-all duration-500 group text-left overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#C8A96A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/5 flex items-center justify-center text-[#C8A96A] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(200,169,106,0.15)] transition-all duration-500">
      <Icon size={28} />
    </div>
    <div className="relative flex-1">
      <h4 className="text-white font-bold text-xl leading-tight tracking-tight group-hover:text-[#C8A96A] transition-colors duration-300">{title}</h4>
      <p className="text-white/30 text-xs mt-2 leading-relaxed font-light tracking-wide uppercase">{description}</p>
    </div>
    <div className="relative w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-[#C8A96A] group-hover:text-black transition-all duration-500">
      <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
    </div>
  </motion.button>
);

const RecommendedProduct = ({ product }) => {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/5 rounded-[36px] overflow-hidden group hover:border-[#C8A96A]/30 transition-all duration-700 shadow-2xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#121212]">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=300&h=300&auto=format&fit=crop'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 right-4">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id, !!user); }}
            className={`w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center transition-all ${isInWishlist(product._id) ? 'bg-red-500 text-white' : 'bg-black/40 text-white/70 hover:bg-[#C8A96A] hover:text-black'}`}
          >
            <FiHeart size={16} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <div className="bg-[#C8A96A] text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-2xl">
            95% Match
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h5 className="text-white text-sm font-bold line-clamp-1 mb-1 tracking-tight font-['Poppins']">{product.name}</h5>
          <p className="text-[#C8A96A] font-black text-lg tracking-tight">₹{product.price?.toLocaleString()}</p>
        </div>
        
        <div className="flex gap-2">
          <button 
             onClick={() => (window.location.href = `/product/${product._id}`)}
             className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest transition-all"
          >
            Details
          </button>
          <button 
            onClick={() => addToCart(product)}
            className="w-14 h-12 rounded-2xl bg-[#C8A96A] hover:bg-white text-black flex items-center justify-center transition-all shadow-lg shadow-[#C8A96A]/10 group/btn"
          >
            <FiShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ComparisonCard = ({ products }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative bg-[#111] border border-white/5 rounded-[40px] overflow-hidden shadow-3xl"
  >
    <div className="p-8 bg-gradient-to-r from-[#C8A96A]/20 to-transparent flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-4">
        <LuArrowRightLeft className="text-[#C8A96A]" size={24} />
        <span className="text-white font-black text-xs uppercase tracking-[0.3em]">AI Comparison Engine</span>
      </div>
      <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
        <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">v2.4 Active</span>
      </div>
    </div>
    <div className="grid grid-cols-2 divide-x divide-white/5">
      {products.map((p, idx) => (
        <div key={idx} className="p-8 space-y-8 relative group/comp">
          <div className="aspect-square rounded-3xl overflow-hidden mb-6 border border-white/5 bg-[#1a1a1a] relative">
             <img src={p.images?.[0]} className="w-full h-full object-cover grayscale-[0.3] group-hover/comp:grayscale-0 transition-all duration-700" alt="" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/comp:opacity-100 transition-opacity" />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Material Structure</p>
              <p className="text-white text-[15px] font-medium tracking-tight">{p.material || 'Premium Silk & Wool'}</p>
            </div>
            <div>
              <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Artisan Rating</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(s => <FiStar key={s} size={12} className={s <= 4 ? "text-[#C8A96A] fill-[#C8A96A]" : "text-white/10"} />)}
              </div>
            </div>
            <div>
              <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Room Synergy</p>
              <div className="inline-block px-3 py-1 rounded-lg bg-[#C8A96A]/10 text-[#C8A96A] text-[11px] font-bold">
                {idx === 0 ? 'High Intensity' : 'Ambient Soft'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="p-8 bg-gradient-to-b from-white/[0.02] to-transparent border-t border-white/5 text-center">
       <p className="text-[#C8A96A] text-sm font-medium italic tracking-tight">"Our analysis indicates {products[0].name} will provide the best balance of luxury and durability for your specific room layout."</p>
    </div>
  </motion.div>
);

// --- Main Assistant Component ---

export default function AIStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState('home'); // home, stylist, dream, compare, match
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [stylistStep, setStylistStep] = useState(0); 
  const [stylistData, setStylistData] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [comparisonItems, setComparisonItems] = useState([]);
  const messagesEndRef = useRef(null);
  
  const { isChatOpen, setChatOpen } = useUIStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isChatOpen) setChatOpen(false); 
  };

  const handleReset = () => {
    setActiveFeature('home');
    setMessages([]);
    setStylistStep(0);
    setStylistData({});
    setRecommendations([]);
    setComparisonItems([]);
  };

  const addBotMessage = (text, delay = 1200) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: text, timestamp: new Date() }]);
      setIsTyping(false);
    }, delay);
  };

  const handleFeatureSelect = (feature) => {
    setActiveFeature(feature);
    if (feature === 'stylist') {
      setMessages([{ role: 'bot', content: "Greetings. I am your specialized Rug Stylist. To begin our consultation, could you tell me which room we are transforming today?", timestamp: new Date() }]);
      setStylistStep(1);
    } else if (feature === 'dream') {
      setMessages([{ role: 'bot', content: "Welcome to the Dream Studio. Describe the atmosphere you wish to create, and I will manifest a complete luxury interior concept for you.", timestamp: new Date() }]);
    } else if (feature === 'compare') {
      setMessages([{ role: 'bot', content: "Our technical analysis is complete. Here is the side-by-side comparison of your top selections.", timestamp: new Date() }]);
      setComparisonItems([
        { _id: '1', name: 'Royal Persian Silk', price: 45000, images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=300'], material: '100% Hand-tufted Silk' },
        { _id: '2', name: 'Modern Minimal Ivory', price: 18500, images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=300'], material: 'Organic Bamboo Silk & Wool' },
      ]);
    } else if (feature === 'match') {
      setMessages([{ role: 'bot', content: "Please share a high-resolution photograph of your space. I will analyze the architecture, lighting vectors, and material palette to suggest the optimal rug.", timestamp: new Date() }]);
    }
  };

  const handleStylistChoice = (choice, value) => {
    const newData = { ...stylistData, [choice]: value };
    setStylistData(newData);
    setMessages(prev => [...prev, { role: 'user', content: value, timestamp: new Date() }]);

    if (stylistStep === 1) {
      setStylistStep(2);
      addBotMessage("An elegant choice. And what aesthetic style characterizes this environment?");
    } else if (stylistStep === 2) {
      setStylistStep(3);
      addBotMessage("Exquisite. What investment range shall we prioritize for this centerpiece?");
    } else if (stylistStep === 3) {
      setStylistStep(4);
      addBotMessage("Finally, which color palette should dominate the composition?");
    } else if (stylistStep === 4) {
      setStylistStep(5);
      setIsTyping(true);
      setTimeout(() => {
        setRecommendations([
          { _id: '1', name: 'Royal Persian Silk', price: 45000, images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=300'] },
          { _id: '2', name: 'Modern Minimal Ivory', price: 18500, images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=300'] },
          { _id: '3', name: 'Vintage Gold Medallion', price: 32000, images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=300'] },
        ]);
        addBotMessage(`Based on your refined ${newData.color || ''} ${newData.room || ''} preferences, I have curated these exceptional masterpieces.`);
        setIsTyping(false);
      }, 1800);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: msg, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (activeFeature === 'dream') {
        addBotMessage("✨ Manifesting your vision... I've synthesized a 'Warm Modern Luxury' aesthetic. This direction emphasizes organic textures and balanced lighting. Here are the core elements for your composition:");
        setRecommendations([
          { _id: '4', name: 'Neutral Wool Textures', price: 12000, images: ['https://images.unsplash.com/photo-1594020429108-59207558605c?q=80&w=300'] },
          { _id: '5', name: 'Abstract Charcoal Silk', price: 55000, images: ['https://images.unsplash.com/photo-1534889156217-d34a09b4543d?q=80&w=300'] },
        ]);
      } else {
        addBotMessage("Indeed. For an atmosphere of true distinction, I recommend exploring our artisanal silk collections. They offer a unique tactile depth that standard materials cannot match.");
      }
    }, 1500);
  };

  return (
    <div className="fixed bottom-[20px] right-[20px] sm:bottom-[30px] sm:right-[30px] z-[9999] font-['Inter',_sans-serif]">
      {/* Premium Floating Button */}
      {!isOpen && (
        <motion.button
          onClick={toggleOpen}
          initial={{ scale: 0, y: 50, rotate: -10 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.92 }}
          className="relative group p-[2px] rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#C8A96A]/20 via-transparent to-white/10 animate-pulse" />
          <div className="relative px-8 py-5 rounded-full bg-black/90 backdrop-blur-[30px] flex items-center gap-4 border border-white/5">
            <div className="relative w-10 h-10 rounded-full bg-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A] overflow-hidden">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-[#C8A96A]/30 rounded-full" />
               <LuSparkles size={18} />
            </div>
            <span className="text-white font-black text-sm tracking-[0.1em] uppercase group-hover:text-[#C8A96A] transition-colors">Style Assistant</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-ping" />
          </div>
        </motion.button>
      )}

      {/* Luxury Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={toggleOpen}
              className="fixed inset-0 bg-black/60 backdrop-blur-[12px] -z-10"
            />
            
            <motion.div
              initial={{ x: '100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.8 }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[580px] bg-[#050505] border-l border-white/5 shadow-[-30px_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
            >
              {/* Mesh Gradient Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#C8A96A]/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[150px] rounded-full" />
              </div>

              {/* Header */}
              <div className="p-10 border-b border-white/[0.03] bg-gradient-to-br from-white/[0.02] to-transparent relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C8A96A] to-[#8A6D25] p-[1px]">
                         <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-[#C8A96A]">
                            <LuSparkles size={24} />
                         </div>
                      </div>
                      <h2 className="text-white font-black text-3xl tracking-tight font-['Poppins']">Jannat <span className="text-[#C8A96A]">AI</span></h2>
                    </div>
                    <p className="text-white/30 text-[11px] font-black tracking-[0.3em] uppercase ml-1">The Art of Interior Intelligence</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {activeFeature !== 'home' && (
                      <button onClick={handleReset} className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 hover:text-[#C8A96A] hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center"><FiHome size={22} /></button>
                    )}
                    <button onClick={toggleOpen} className="w-12 h-12 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center"><FiX size={24} /></button>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide relative z-10">
                {activeFeature === 'home' ? (
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] px-2">Consultation Modules</h3>
                      <div className="grid grid-cols-1 gap-5">
                        <FeatureCard icon={LuPaintbrush} title="AI Rug Stylist" description="Curated recommendations for refined spaces." onClick={() => handleFeatureSelect('stylist')} />
                        <FeatureCard icon={LuLayoutTemplate} title="Dream Studio" description="Synthesis of luxury interior concepts." onClick={() => handleFeatureSelect('dream')} />
                        <FeatureCard icon={LuArrowRightLeft} title="Comparison Engine" description="Technical analysis of material and synergy." onClick={() => handleFeatureSelect('compare')} />
                        <FeatureCard icon={FiMaximize2} title="Spatial Analysis" description="Architectural mapping from room imagery." onClick={() => handleFeatureSelect('match')} />
                      </div>
                    </div>

                    <div className="relative p-10 rounded-[48px] bg-gradient-to-br from-[#121212] to-[#080808] border border-white/[0.05] overflow-hidden group shadow-3xl">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A96A]/10 blur-[80px] group-hover:bg-[#C8A96A]/20 transition-all duration-1000" />
                      <div className="flex items-center gap-4 mb-6 text-[#C8A96A]">
                        <div className="w-10 h-10 rounded-xl bg-[#C8A96A]/10 flex items-center justify-center border border-[#C8A96A]/20"><FiTrendingUp size={20} /></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">Style Insight</span>
                      </div>
                      <p className="text-white/80 text-[17px] leading-[1.6] mb-8 font-light tracking-tight">
                        "Your saved items reveal a preference for <span className="text-[#C8A96A] font-bold">hand-tufted ivory</span> silk. I have prepared a specialized collection that aligns with this aesthetic."
                      </p>
                      <button className="w-full py-5 rounded-[24px] bg-white/[0.03] hover:bg-[#C8A96A] text-white hover:text-black transition-all text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-white/10 group-hover:border-[#C8A96A]/30">
                        Review Collection <FiArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col min-h-full pb-10">
                    <div className="flex-1 space-y-10">
                      {messages.map((msg, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[88%] p-7 rounded-[40px] text-[16px] leading-[1.6] shadow-3xl ${
                            msg.role === 'user' 
                              ? 'bg-gradient-to-br from-[#C8A96A] to-[#B69640] text-black font-bold rounded-tr-none shadow-[#C8A96A]/20' 
                              : 'bg-white/[0.03] border border-white/5 text-white/90 rounded-tl-none font-light backdrop-blur-md'
                          }`}>
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}

                      {/* Feature: Stylist Steps */}
                      {activeFeature === 'stylist' && !isTyping && stylistStep < 5 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-4 pt-6">
                          {stylistStep === 1 && ['Living Room', 'Bedroom', 'Dining', 'Office'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('room', opt)} className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white/50 hover:bg-[#C8A96A] hover:text-black hover:border-transparent transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-xl">{opt}</button>
                          ))}
                          {stylistStep === 2 && ['Modern', 'Persian', 'Minimal', 'Royal Luxury', 'Contemporary'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('style', opt)} className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white/50 hover:bg-[#C8A96A] hover:text-black hover:border-transparent transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-xl">{opt}</button>
                          ))}
                          {stylistStep === 3 && ['Under ₹10k', '₹10k–₹25k', '₹25k–₹50k', '₹50k+'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('budget', opt)} className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white/50 hover:bg-[#C8A96A] hover:text-black hover:border-transparent transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-xl">{opt}</button>
                          ))}
                          {stylistStep === 4 && ['Beige', 'Ivory', 'Black Luxury', 'Neutral', 'Royal Gold'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('color', opt)} className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white/50 hover:bg-[#C8A96A] hover:text-black hover:border-transparent transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-xl">{opt}</button>
                          ))}
                        </motion.div>
                      )}

                      {/* Feature: Comparison */}
                      {activeFeature === 'compare' && comparisonItems.length > 0 && (
                        <ComparisonCard products={comparisonItems} />
                      )}

                      {isTyping && (
                        <div className="flex gap-3 p-6 bg-white/[0.03] border border-white/5 rounded-[30px] rounded-tl-none w-24 shadow-2xl backdrop-blur-md">
                          <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-2 h-2 bg-[#C8A96A] rounded-full" />
                          <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 bg-[#C8A96A] rounded-full" />
                          <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 bg-[#C8A96A] rounded-full" />
                        </div>
                      )}

                      {recommendations.length > 0 && (
                        <div className="grid grid-cols-2 gap-6 mt-6">
                          {recommendations.map(p => <RecommendedProduct key={p._id} product={p} />)}
                        </div>
                      )}

                      {activeFeature === 'match' && recommendations.length === 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-8 border-2 border-dashed border-white/10 rounded-[60px] p-24 flex flex-col items-center justify-center text-center space-y-8 hover:border-[#C8A96A]/50 hover:bg-[#C8A96A]/5 transition-all group cursor-pointer shadow-3xl relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-[#C8A96A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative w-28 h-28 rounded-full bg-white/5 flex items-center justify-center text-white/10 group-hover:text-[#C8A96A] group-hover:bg-[#C8A96A]/10 transition-all duration-700 transform group-hover:rotate-12 border border-white/5">
                            <FiCamera size={50} />
                          </div>
                          <div className="relative">
                            <p className="text-white font-black text-2xl tracking-tight mb-3">Spatial Mapping</p>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">Secure Architecture Upload</p>
                          </div>
                          <button className="relative px-12 py-5 rounded-[24px] bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all">Choose File</button>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              {activeFeature !== 'home' && (
                <div className="p-10 bg-gradient-to-t from-black to-transparent border-t border-white/[0.03] relative z-20">
                  <div className="flex items-center gap-6 bg-white/[0.03] rounded-[36px] p-3 pr-6 border border-white/5 focus-within:border-[#C8A96A]/50 transition-all shadow-4xl backdrop-blur-2xl">
                    <button className="w-14 h-14 rounded-full text-white/20 hover:text-[#C8A96A] transition-all flex items-center justify-center hover:bg-white/5"><FiCamera size={26} /></button>
                    <input 
                      type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
                      placeholder="Consult the AI Stylist..." 
                      className="flex-1 bg-transparent border-none outline-none text-white text-[17px] placeholder:text-white/10 h-14 font-light tracking-tight"
                    />
                    <button 
                      onClick={handleSend} disabled={!input.trim()}
                      className="w-14 h-14 rounded-full bg-[#C8A96A] text-black flex items-center justify-center disabled:opacity-10 disabled:grayscale transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-[#C8A96A]/30"
                    >
                      <FiSend size={24} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
                    <FiShield className="text-white" size={14} />
                    <span className="text-[9px] text-white font-black uppercase tracking-[0.4em]">Secured by Jannat Intelligence</span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
