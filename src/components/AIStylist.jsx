import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiSend, FiCamera, FiUpload, FiMaximize2, 
  FiChevronRight, FiChevronLeft, FiHeart, FiShoppingCart, 
  FiMessageCircle, FiGrid, FiLayout, FiLayers, FiCheckCircle,
  FiInfo, FiStar, FiShare2, FiZap, FiTarget, FiHome, FiSettings,
  FiActivity, FiShield, FiTrendingUp, FiArrowRight, FiRotateCcw
} from 'react-icons/fi';
import { LuPaintbrush, LuLayoutTemplate, LuArrowRightLeft, LuSparkles, LuBox, LuWaves, LuChevronLeft } from 'react-icons/lu';
import { useCartStore, useWishlistStore, useAuthStore, useUIStore } from '../store';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- Styled Components & Constants ---

const LUXURY_GOLD = "#C8A96A";

const FeatureCard = ({ icon: Icon, title, description, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02, backgroundColor: "rgba(200, 169, 106, 0.05)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative w-full flex items-center gap-5 p-6 rounded-[28px] bg-white/[0.02] border border-white/5 hover:border-[#C8A96A]/30 transition-all duration-300 group text-left overflow-hidden shadow-sm"
  >
    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/5 flex items-center justify-center text-[#C8A96A] group-hover:bg-[#C8A96A] group-hover:text-black transition-all duration-300">
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h4 className="text-white font-bold text-lg leading-tight group-hover:text-[#C8A96A] transition-colors">{title}</h4>
      <p className="text-white/40 text-[11px] mt-1 font-medium tracking-tight line-clamp-1">{description}</p>
    </div>
    <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-[#C8A96A] group-hover:text-black transition-all">
      <FiChevronRight />
    </div>
  </motion.button>
);

const RecommendedProduct = ({ product }) => {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden group hover:border-[#C8A96A]/20 transition-all"
    >
      <div className="relative aspect-[1/1.2] overflow-hidden">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=300'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id, !!user); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-[#C8A96A] transition-colors"
        >
          <FiHeart size={14} fill={isInWishlist(product._id) ? LUXURY_GOLD : 'none'} className={isInWishlist(product._id) ? 'text-[#C8A96A]' : ''} />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <h5 className="text-white text-xs font-bold truncate tracking-tight">{product.name}</h5>
        <div className="flex items-center justify-between">
          <p className="text-[#C8A96A] font-black text-sm">₹{product.price?.toLocaleString()}</p>
          <button 
            onClick={() => addToCart(product)}
            className="w-8 h-8 rounded-lg bg-[#C8A96A] text-black flex items-center justify-center hover:scale-110 transition-all"
          >
            <FiShoppingCart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Assistant Component ---

export default function AIStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState('home'); 
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [stylistStep, setStylistStep] = useState(0); 
  const [stylistData, setStylistData] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
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
    setUploadedImage(null);
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
      setMessages([{ role: 'bot', content: "Welcome! I'm your Rug Stylist. Which room are we styling today?", timestamp: new Date() }]);
      setStylistStep(1);
    } else if (feature === 'dream') {
      setMessages([{ role: 'bot', content: "Let's build your dream room. Describe the look you're going for!", timestamp: new Date() }]);
    } else if (feature === 'match') {
      setMessages([{ role: 'bot', content: "Upload a photo of your room, and I'll find the perfect rug match for you.", timestamp: new Date() }]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setMessages(prev => [...prev, { role: 'user', content: "Uploaded a room photo.", type: 'image', image: event.target.result, timestamp: new Date() }]);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage("Great! I've analyzed your space. I suggest a neutral tone rug to complement your natural lighting.");
          setRecommendations([
            { _id: '1', name: 'Royal Persian Silk', price: 45000, images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400'] },
            { _id: '2', name: 'Modern Ivory', price: 18500, images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400'] },
          ]);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStylistChoice = (choice, value) => {
    const newData = { ...stylistData, [choice]: value };
    setStylistData(newData);
    setMessages(prev => [...prev, { role: 'user', content: value, timestamp: new Date() }]);

    if (stylistStep === 1) {
      setStylistStep(2);
      addBotMessage("Got it. And what style do you prefer?");
    } else if (stylistStep === 2) {
      setStylistStep(3);
      addBotMessage("Nice! What's your budget range?");
    } else if (stylistStep === 3) {
      setStylistStep(4);
      addBotMessage("And finally, any specific color preference?");
    } else if (stylistStep === 4) {
      setStylistStep(5);
      setIsTyping(true);
      setTimeout(() => {
        setRecommendations([
          { _id: '1', name: 'Royal Persian Silk', price: 45000, images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400'] },
          { _id: '2', name: 'Modern Minimal', price: 18500, images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400'] },
        ]);
        addBotMessage("Excellent choice. Based on your preferences, I've curated these perfect rugs for you.");
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
        addBotMessage("Beautiful vision. I recommend focusing on earthy tones and wool textures for that specific look.");
        setRecommendations([
          { _id: '4', name: 'Natural Wool Textures', price: 12000, images: ['https://images.unsplash.com/photo-1594020429108-59207558605c?w=400'] },
        ]);
      } else {
        addBotMessage("I understand. To create a luxurious feel, silk rugs are usually the best choice. Would you like to see some?");
      }
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-['Inter',_sans-serif]">
      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

      {/* Improved Floating Button (User Friendly & Elegant) */}
      {!isOpen && (
        <motion.button
          onClick={toggleOpen}
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 bg-[#111] border border-white/10 p-2 pr-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#B69640] flex items-center justify-center text-black shadow-lg">
             <LuSparkles size={24} className="group-hover:rotate-12 transition-transform" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A]">Jannat AI</p>
            <p className="text-white text-xs font-bold">Ask Stylist</p>
          </div>
        </motion.button>
      )}

      {/* Assistant Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={toggleOpen}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"
            />
            
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0A0A0A] border-l border-white/5 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-[#111] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {activeFeature !== 'home' && (
                    <button onClick={handleReset} className="text-white/40 hover:text-white p-2">
                      <LuChevronLeft size={24} />
                    </button>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                      Jannat <span className="text-[#C8A96A]">AI</span>
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Stylist</span>
                    </div>
                  </div>
                </div>
                <button onClick={toggleOpen} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <FiX size={20} />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {activeFeature === 'home' ? (
                  <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-br from-[#111] to-[#0A0A0A] p-6 rounded-3xl border border-white/5">
                      <h4 className="text-white font-bold text-2xl mb-2">Hello! How can I help?</h4>
                      <p className="text-white/40 text-sm">I'm your AI Interior Stylist, here to help you find the perfect rug for your home.</p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 gap-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 px-2">Choose a Service</p>
                      <FeatureCard icon={LuPaintbrush} title="AI Rug Stylist" description="Personalized rug recommendations." onClick={() => handleFeatureSelect('stylist')} />
                      <FeatureCard icon={LuLayoutTemplate} title="Dream Studio" description="Visualize your room concept." onClick={() => handleFeatureSelect('dream')} />
                      <FeatureCard icon={FiMaximize2} title="Spatial Match" description="Match rug to your room photo." onClick={() => handleFeatureSelect('match')} />
                    </div>

                    {/* Quick Insight */}
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                       <div className="flex items-center gap-3 mb-3 text-[#C8A96A]">
                          <FiTrendingUp size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Trending Insight</span>
                       </div>
                       <p className="text-white/60 text-xs leading-relaxed italic">"Neutral tones and silk textures are currently popular for modern living spaces."</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col min-h-full">
                    <div className="flex-1 space-y-6">
                      {messages.map((msg, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed ${
                            msg.role === 'user' 
                              ? 'bg-[#C8A96A] text-black font-bold rounded-tr-none' 
                              : 'bg-white/5 text-white/90 rounded-tl-none border border-white/5'
                          }`}>
                            {msg.type === 'image' ? (
                              <div className="space-y-3">
                                <img src={msg.image} className="rounded-xl w-full" alt="Uploaded" />
                                <p className="text-xs">{msg.content}</p>
                              </div>
                            ) : msg.content}
                          </div>
                        </motion.div>
                      ))}

                      {/* Options for Stylist */}
                      {activeFeature === 'stylist' && !isTyping && stylistStep < 5 && (
                        <div className="flex flex-wrap gap-2 pt-4">
                          {stylistStep === 1 && ['Living Room', 'Bedroom', 'Office'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('room', opt)} className="px-5 py-2.5 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5 text-[#C8A96A] text-[11px] font-bold hover:bg-[#C8A96A] hover:text-black transition-all uppercase tracking-widest">{opt}</button>
                          ))}
                          {stylistStep === 2 && ['Modern', 'Classic', 'Minimal'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('style', opt)} className="px-5 py-2.5 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5 text-[#C8A96A] text-[11px] font-bold hover:bg-[#C8A96A] hover:text-black transition-all uppercase tracking-widest">{opt}</button>
                          ))}
                          {stylistStep === 3 && ['₹10k-25k', '₹25k-50k', '₹50k+'].map(opt => (
                            <button key={opt} onClick={() => handleStylistChoice('budget', opt)} className="px-5 py-2.5 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5 text-[#C8A96A] text-[11px] font-bold hover:bg-[#C8A96A] hover:text-black transition-all uppercase tracking-widest">{opt}</button>
                          ))}
                        </div>
                      )}

                      {isTyping && (
                        <div className="flex gap-2 p-3 bg-white/5 rounded-2xl w-16">
                          <div className="w-1.5 h-1.5 bg-[#C8A96A] rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-[#C8A96A] rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-[#C8A96A] rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      )}

                      {recommendations.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          {recommendations.map(p => <RecommendedProduct key={p._id} product={p} />)}
                        </div>
                      )}

                      {activeFeature === 'match' && !uploadedImage && (
                        <div 
                          onClick={() => fileInputRef.current.click()}
                          className="mt-4 border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 hover:border-[#C8A96A]/40 hover:bg-white/[0.02] cursor-pointer transition-all"
                        >
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#C8A96A]">
                            <FiCamera size={32} />
                          </div>
                          <div>
                            <p className="text-white font-bold">Snap or Upload</p>
                            <p className="text-white/20 text-[10px] uppercase tracking-widest mt-1">Room Photo Analysis</p>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              {activeFeature !== 'home' && (
                <div className="p-6 bg-[#111] border-t border-white/5">
                  <div className="flex items-center gap-3 bg-white/[0.03] rounded-2xl p-2 border border-white/5 focus-within:border-[#C8A96A]/50 transition-all">
                    <button onClick={() => fileInputRef.current.click()} className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-[#C8A96A] transition-all">
                      <FiCamera size={20} />
                    </button>
                    <input 
                      type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..." 
                      className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/20 h-10"
                    />
                    <button 
                      onClick={handleSend} disabled={!input.trim()}
                      className="w-10 h-10 rounded-xl bg-[#C8A96A] text-black flex items-center justify-center disabled:opacity-20 transition-all shadow-lg active:scale-90"
                    >
                      <FiSend size={18} />
                    </button>
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
