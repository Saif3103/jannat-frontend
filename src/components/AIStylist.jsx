import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiSend, FiCamera, FiUpload, FiMaximize2, 
  FiChevronRight, FiChevronLeft, FiHeart, FiShoppingCart, 
  FiMessageCircle, FiGrid, FiLayout, FiLayers, FiCheckCircle,
  FiInfo, FiStar, FiShare2, FiZap, FiTarget, FiHome, FiSettings,
  FiActivity, FiShield, FiTrendingUp
} from 'react-icons/fi';
import { LuPaintbrush, LuLayoutTemplate, LuArrowRightLeft, LuSparkles, LuBox } from 'react-icons/lu';
import { useCartStore, useWishlistStore, useAuthStore, useUIStore } from '../store';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- Sub-components ---

const FeatureCard = ({ icon: Icon, title, description, onClick }) => (
  <motion.button
    whileHover={{ y: -5, scale: 1.02, backgroundColor: 'rgba(200, 169, 106, 0.08)' }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center gap-5 p-6 rounded-[28px] bg-white/5 border border-white/10 hover:border-[#C8A96A]/50 transition-all group text-left"
  >
    <div className="w-14 h-14 rounded-2xl bg-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A] group-hover:bg-[#C8A96A] group-hover:text-black transition-all duration-500 shadow-lg shadow-[#C8A96A]/5">
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h4 className="text-white font-semibold text-lg leading-tight group-hover:text-[#C8A96A] transition-colors">{title}</h4>
      <p className="text-white/40 text-xs mt-1.5 leading-relaxed font-light">{description}</p>
    </div>
    <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-[#C8A96A]/30 group-hover:bg-[#C8A96A]/5 transition-all">
      <FiChevronRight className="text-white/20 group-hover:text-[#C8A96A]" size={14} />
    </div>
  </motion.button>
);

const RecommendedProduct = ({ product }) => {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#121212] border border-white/5 rounded-[24px] overflow-hidden group hover:border-[#C8A96A]/20 transition-all shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=300&h=300&auto=format&fit=crop'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id, !!user); }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${isInWishlist(product._id) ? 'bg-red-500 text-white' : 'bg-black/40 text-white/70 hover:bg-[#C8A96A] hover:text-black'}`}
          >
            <FiHeart size={14} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <div className="bg-[#C8A96A] text-black text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-[#C8A96A]/20">
            95% Match
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3 text-left">
        <div>
          <h5 className="text-white text-sm font-semibold line-clamp-1 mb-1 tracking-tight">{product.name}</h5>
          <p className="text-[#C8A96A] font-bold text-base">₹{product.price?.toLocaleString()}</p>
        </div>
        
        <p className="text-[10px] text-white/40 leading-relaxed font-light border-l border-[#C8A96A]/30 pl-3">
          "Matches your room's warm beige tones perfectly."
        </p>

        <div className="flex gap-2">
          <button 
             onClick={() => (window.location.href = `/product/${product._id}`)}
             className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            View
          </button>
          <button 
            onClick={() => addToCart(product)}
            className="w-12 h-10 rounded-xl bg-[#C8A96A] hover:bg-[#D4B97E] text-black flex items-center justify-center transition-all shadow-lg shadow-[#C8A96A]/10"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ComparisonCard = ({ products }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden"
  >
    <div className="p-6 bg-gradient-to-r from-[#C8A96A]/20 to-transparent flex items-center gap-3 border-b border-white/5">
      <LuArrowRightLeft className="text-[#C8A96A]" size={20} />
      <span className="text-white font-bold text-xs uppercase tracking-widest">Intelligent Comparison</span>
    </div>
    <div className="grid grid-cols-2 divide-x divide-white/5">
      {products.map((p, idx) => (
        <div key={idx} className="p-6 space-y-6">
          <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-white/5">
             <img src={p.images?.[0]} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Material</p>
              <p className="text-white text-sm font-medium">{p.material || 'Premium Silk & Wool'}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Luxury Feel</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => <FiStar key={s} size={10} className={s <= 4 ? "text-[#C8A96A] fill-[#C8A96A]" : "text-white/10"} />)}
              </div>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">Best For</p>
              <p className="text-[#C8A96A] text-xs font-semibold">{idx === 0 ? 'High-end Living Rooms' : 'Minimalist Bedrooms'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="p-6 bg-[#C8A96A]/5 border-t border-white/5 text-center">
       <p className="text-white/60 text-xs italic">"Winner: {products[0].name} is the best overall match for your room size and lighting."</p>
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
  const [stylistStep, setStylistStep] = useState(0); // For the wizard
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
    if (isChatOpen) setChatOpen(false); // Close old chat if opening new one
  };

  const handleReset = () => {
    setActiveFeature('home');
    setMessages([]);
    setStylistStep(0);
    setStylistData({});
    setRecommendations([]);
    setComparisonItems([]);
  };

  const addBotMessage = (text, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: text, timestamp: new Date() }]);
      setIsTyping(false);
    }, delay);
  };

  const handleFeatureSelect = (feature) => {
    setActiveFeature(feature);
    if (feature === 'stylist') {
      setMessages([{ role: 'bot', content: "Welcome to the Jannat Rug Stylist. Let's find your perfect masterpiece. Which room are we styling today?", timestamp: new Date() }]);
      setStylistStep(1);
    } else if (feature === 'dream') {
      setMessages([{ role: 'bot', content: "Describe your dream room or upload an inspiration image, and I'll curate the perfect luxury look for you.", timestamp: new Date() }]);
    } else if (feature === 'compare') {
      setMessages([{ role: 'bot', content: "Comparing our top selections for your aesthetic. Here is an intelligent breakdown of their characteristics.", timestamp: new Date() }]);
      // Mock comparison
      setComparisonItems([
        { _id: '1', name: 'Royal Persian Silk', price: 45000, images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=300'], material: '100% Hand-tufted Silk' },
        { _id: '2', name: 'Modern Minimal Ivory', price: 18500, images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=300'], material: 'Organic Bamboo Silk & Wool' },
      ]);
    } else if (feature === 'match') {
      setMessages([{ role: 'bot', content: "Upload a photo of your room, and my AI will analyze its architecture, lighting, and tones to suggest the ideal rug.", timestamp: new Date() }]);
    }
  };

  const handleStylistChoice = (choice, value) => {
    const newData = { ...stylistData, [choice]: value };
    setStylistData(newData);
    setMessages(prev => [...prev, { role: 'user', content: value, timestamp: new Date() }]);

    if (stylistStep === 1) {
      setStylistStep(2);
      addBotMessage("Exquisite choice. And what style aesthetic defines this space?");
    } else if (stylistStep === 2) {
      setStylistStep(3);
      addBotMessage("Understood. What is the investment range you have in mind for this masterpiece?");
    } else if (stylistStep === 3) {
      setStylistStep(4);
      addBotMessage("Finally, which color palette should we prioritize?");
    } else if (stylistStep === 4) {
      setStylistStep(5);
      setIsTyping(true);
      setTimeout(() => {
        setRecommendations([
          { _id: '1', name: 'Royal Persian Silk', price: 45000, images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=300'] },
          { _id: '2', name: 'Modern Minimal Ivory', price: 18500, images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=300'] },
          { _id: '3', name: 'Vintage Gold Medallion', price: 32000, images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=300'] },
        ]);
        addBotMessage(`Based on your luxury ${newData.color || ''} ${newData.room || ''} style, these rugs will create a warm and elegant atmosphere.`);
        setIsTyping(false);
      }, 1500);
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
        addBotMessage("✨ Analyzing your vision... That sounds like a 'Warm Modern Luxury' aesthetic. Here are some elements to recreate this look: \n\n✔ Neutral tones\n✔ Soft ambient lighting\n✔ Natural textures\n\nI recommend starting with these base pieces:");
        setRecommendations([
          { _id: '4', name: 'Neutral Wool Textures', price: 12000, images: ['https://images.unsplash.com/photo-1594020429108-59207558605c?q=80&w=300'] },
          { _id: '5', name: 'Abstract Charcoal Silk', price: 55000, images: ['https://images.unsplash.com/photo-1534889156217-d34a09b4543d?q=80&w=300'] },
        ]);
      } else if (msg.toLowerCase().includes('support') || msg.toLowerCase().includes('help')) {
        addBotMessage("I am connecting you with our human concierge for specialized support. One moment...");
        setTimeout(() => { setIsOpen(false); setChatOpen(true); }, 2000);
      } else {
        addBotMessage("As your luxury stylist, I suggest focusing on materials like hand-tufted silk for that premium feel. Would you like to see our latest royal collection?");
      }
    }, 1500);
  };

  return (
    <div className="fixed bottom-[18px] right-[18px] sm:bottom-[24px] sm:right-[24px] z-[9999] font-['Inter',_sans-serif]">
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          onClick={toggleOpen}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#111827] border border-[#C8A96A]/30 shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_1px_rgba(200,169,106,0.1)] group relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C8A96A]/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          {/* Gold icon */}
          <div className="w-7 h-7 rounded-full bg-[#C8A96A]/15 flex items-center justify-center border border-[#C8A96A]/30 flex-shrink-0">
            <LuSparkles size={14} className="text-[#C8A96A]" />
          </div>
          <span className="text-white font-semibold text-[13px] tracking-wide pr-1">Style My Room</span>
        </motion.button>
      )}

      {/* Side Panel Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={toggleOpen}
              className="fixed inset-0 bg-black/40 backdrop-blur-md -z-10"
            />
            
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[520px] bg-[#0A0A0A] border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 bg-gradient-to-br from-[#121212] to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A96A]/5 blur-[100px] -z-10" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="p-2 rounded-xl bg-[#C8A96A]/10 text-[#C8A96A]">
                        <LuSparkles size={22} />
                      </div>
                      <h2 className="text-white font-bold text-2xl tracking-tight font-['Poppins']">Jannat AI</h2>
                    </div>
                    <p className="text-white/40 text-[13px] font-light tracking-wide uppercase tracking-[0.1em]">Premium Interior Stylist</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {activeFeature !== 'home' && (
                      <button onClick={handleReset} className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-[#C8A96A] hover:bg-[#C8A96A]/10 transition-all border border-white/5"><FiHome size={20} /></button>
                    )}
                    <button onClick={toggleOpen} className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"><FiX size={20} /></button>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                {activeFeature === 'home' ? (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Select an Experience</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <FeatureCard icon={LuPaintbrush} title="AI Rug Stylist" description="Curated recommendations for your specific room." onClick={() => handleFeatureSelect('stylist')} />
                        <FeatureCard icon={LuLayoutTemplate} title="Build My Dream Room" description="Full interior concept creation from your vision." onClick={() => handleFeatureSelect('dream')} />
                        <FeatureCard icon={LuArrowRightLeft} title="Compare For Me" description="Intelligent technical breakdown of rug choices." onClick={() => handleFeatureSelect('compare')} />
                        <FeatureCard icon={FiMaximize2} title="Room Match AI" description="Analyze your space from a single photograph." onClick={() => handleFeatureSelect('match')} />
                      </div>
                    </div>

                    <div className="relative p-8 rounded-[32px] bg-gradient-to-br from-[#121212] to-black border border-white/5 overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/10 blur-[50px] group-hover:bg-[#C8A96A]/20 transition-all" />
                      <div className="flex items-center gap-3 mb-4 text-[#C8A96A]">
                        <div className="w-8 h-8 rounded-lg bg-[#C8A96A]/10 flex items-center justify-center"><FiTrendingUp size={16} /></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Smart Insights</span>
                      </div>
                      <p className="text-white/70 text-[15px] leading-relaxed mb-6 font-light">
                        "Your saved collection suggests a preference for <span className="text-[#C8A96A] font-medium">Beige Persian</span> aesthetics. Would you like to see how these look in your living room?"
                      </p>
                      <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-[#C8A96A] text-white hover:text-black transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        Try Room Preview <FiChevronRight />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col min-h-full pb-10">
                    <div className="flex-1 space-y-8">
                      {messages.map((msg, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[88%] p-5 rounded-[24px] text-[15px] leading-relaxed shadow-2xl ${
                            msg.role === 'user' 
                              ? 'bg-[#C8A96A] text-black font-semibold rounded-tr-none shadow-[#C8A96A]/10' 
                              : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none font-light'
                          }`}>
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}

                      {/* Feature: Stylist Steps */}
                      {activeFeature === 'stylist' && !isTyping && stylistStep < 5 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-3 pt-4">
                          {stylistStep === 1 && ['Living Room', 'Bedroom', 'Dining', 'Office'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('room', opt)} className="px-6 py-3 rounded-2xl border border-white/5 bg-white/5 text-white/60 hover:bg-[#C8A96A] hover:text-black hover:border-transparent transition-all text-xs font-bold uppercase tracking-widest">{opt}</button>
                          ))}
                          {stylistStep === 2 && ['Modern', 'Persian', 'Minimal', 'Royal Luxury', 'Contemporary'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('style', opt)} className="px-6 py-3 rounded-2xl border border-white/5 bg-white/5 text-white/60 hover:bg-[#C8A96A] hover:text-black hover:border-transparent transition-all text-xs font-bold uppercase tracking-widest">{opt}</button>
                          ))}
                          {stylistStep === 3 && ['Under ₹10k', '₹10k–₹25k', '₹25k–₹50k', '₹50k+'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('budget', opt)} className="px-6 py-3 rounded-2xl border border-white/5 bg-white/5 text-white/60 hover:bg-[#C8A96A] hover:text-black hover:border-transparent transition-all text-xs font-bold uppercase tracking-widest">{opt}</button>
                          ))}
                          {stylistStep === 4 && ['Beige', 'Ivory', 'Black Luxury', 'Neutral', 'Royal Gold'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('color', opt)} className="px-6 py-3 rounded-2xl border border-white/5 bg-white/5 text-white/60 hover:bg-[#C8A96A] hover:text-black hover:border-transparent transition-all text-xs font-bold uppercase tracking-widest">{opt}</button>
                          ))}
                        </motion.div>
                      )}

                      {/* Feature: Comparison */}
                      {activeFeature === 'compare' && comparisonItems.length > 0 && (
                        <ComparisonCard products={comparisonItems} />
                      )}

                      {isTyping && (
                        <div className="flex gap-2.5 p-5 bg-white/5 border border-white/10 rounded-[24px] rounded-tl-none w-20 shadow-xl">
                          <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-[#C8A96A] rounded-full" />
                          <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#C8A96A] rounded-full" />
                          <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#C8A96A] rounded-full" />
                        </div>
                      )}

                      {recommendations.length > 0 && (
                        <div className="grid grid-cols-2 gap-5 mt-4">
                          {recommendations.map(p => <RecommendedProduct key={p._id} product={p} />)}
                        </div>
                      )}

                      {activeFeature === 'match' && recommendations.length === 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-4 border-2 border-dashed border-white/10 rounded-[40px] p-16 flex flex-col items-center justify-center text-center space-y-6 hover:border-[#C8A96A]/40 hover:bg-[#C8A96A]/5 transition-all group cursor-pointer shadow-inner"
                        >
                          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#C8A96A] group-hover:bg-[#C8A96A]/10 transition-all duration-500 transform group-hover:rotate-12">
                            <FiCamera size={40} />
                          </div>
                          <div>
                            <p className="text-white font-bold text-lg tracking-tight">Visualize In Your Room</p>
                            <p className="text-white/30 text-xs mt-2 font-light tracking-wide uppercase">Camera • Gallery • Drag & Drop</p>
                          </div>
                          <button className="px-8 py-3.5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Select Image</button>
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              {activeFeature !== 'home' && (
                <div className="p-8 bg-[#0D0D0D] border-t border-white/5 relative">
                  <div className="flex items-center gap-4 bg-white/5 rounded-[28px] p-2.5 pr-5 border border-white/10 focus-within:border-[#C8A96A]/50 transition-all shadow-2xl">
                    <button className="p-4 rounded-full text-white/30 hover:text-[#C8A96A] transition-all"><FiCamera size={22} /></button>
                    <input 
                      type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
                      placeholder="Consult Jannat AI..." 
                      className="flex-1 bg-transparent border-none outline-none text-white text-[15px] placeholder:text-white/10 h-14 font-light"
                    />
                    <button 
                      onClick={handleSend} disabled={!input.trim()}
                      className="w-12 h-12 rounded-2xl bg-[#C8A96A] text-black flex items-center justify-center disabled:opacity-20 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#C8A96A]/20"
                    >
                      <FiSend size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <FiShield className="text-white/10" size={12} />
                    <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">Premium Data Privacy • AI Secured</span>
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
