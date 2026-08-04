import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiSend, FiCamera, FiMaximize2, FiChevronRight,
  FiHeart, FiShoppingCart, FiHome, FiArrowLeft
} from 'react-icons/fi';
import { LuPaintbrush, LuLayoutTemplate, LuArrowRightLeft, LuSparkles } from 'react-icons/lu';
import { useCartStore, useWishlistStore, useAuthStore, useUIStore } from '../store';
import api from '../api/axios';
import toast from 'react-hot-toast';

function FeatureCard({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#C9A84C]/50 hover:shadow-md transition-all text-left group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#B69640] group-hover:bg-[#C9A84C] group-hover:text-[#1A1A1A] transition-all shrink-0">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[#1A1A1A] font-semibold text-[14px] leading-tight">{title}</h4>
        <p className="text-gray-500 text-[12px] mt-1 leading-snug">{description}</p>
      </div>
      <FiChevronRight className="text-gray-300 group-hover:text-[#C9A84C] shrink-0" size={16} />
    </button>
  );
}

function ChoiceChip({ label, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border ${
        active
          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
          : 'bg-white text-[#1A1A1A] border-gray-200 hover:border-[#C9A84C] hover:bg-[#FAF7F2]'
      }`}
    >
      {label}
    </button>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const price = product.discountPrice || product.price;
  const inWish = isInWishlist(product._id);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm text-left">
      <div className="relative aspect-[4/5] bg-gray-50">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id, !!user);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm cursor-pointer ${
            inWish ? 'bg-red-500 text-white' : 'bg-white text-gray-400'
          }`}
        >
          <FiHeart size={13} fill={inWish ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-3 space-y-2">
        <h5 className="text-[#1A1A1A] text-[12px] font-semibold line-clamp-2 leading-snug min-h-[32px]">
          {product.name}
        </h5>
        <p className="text-[#1A1A1A] font-bold text-sm">
          ₹{Number(price || 0).toLocaleString('en-IN')}
        </p>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => { window.location.href = `/product/${product._id}`; }}
            className="flex-1 h-9 rounded-xl bg-gray-50 text-[#1A1A1A] text-[11px] font-semibold hover:bg-gray-100 cursor-pointer"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => {
              addToCart(product);
              toast.success('Added to cart');
            }}
            className="w-9 h-9 rounded-xl bg-[#C9A84C] text-[#1A1A1A] flex items-center justify-center hover:bg-[#B69640] cursor-pointer"
          >
            <FiShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareView({ products }) {
  if (!products?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-[#FAF7F2] border-b border-gray-100 flex items-center gap-2">
        <LuArrowRightLeft className="text-[#B69640]" size={16} />
        <span className="text-[12px] font-semibold text-[#1A1A1A]">Quick compare</span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        {products.slice(0, 2).map((p, idx) => (
          <div key={p._id || idx} className="p-3 space-y-3 text-left">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-50">
              <img src={p.images?.[0]} className="w-full h-full object-cover" alt={p.name} />
            </div>
            <p className="text-[12px] font-semibold text-[#1A1A1A] line-clamp-2 min-h-[32px]">{p.name}</p>
            <p className="text-sm font-bold text-[#1A1A1A]">
              ₹{Number(p.discountPrice || p.price || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-gray-500">{p.material || 'Premium wool'}</p>
            <p className="text-[11px] text-[#B69640] font-medium">
              {idx === 0 ? 'Best for living rooms' : 'Best for bedrooms'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  { key: 'room', q: 'Which room are you styling?', options: ['Living Room', 'Bedroom', 'Dining', 'Office'] },
  { key: 'style', q: 'What style do you prefer?', options: ['Modern', 'Persian', 'Minimal', 'Luxury', 'Boho'] },
  { key: 'budget', q: 'What’s your budget?', options: ['Under ₹2k', '₹2k–₹8k', '₹8k–₹15k', '₹15k+'] },
  { key: 'color', q: 'Preferred colour palette?', options: ['Beige', 'Ivory', 'Grey', 'Multi', 'Gold'] },
];

export default function AIStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState('home');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [stylistStep, setStylistStep] = useState(0);
  const [stylistData, setStylistData] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [comparisonItems, setComparisonItems] = useState([]);
  const messagesEndRef = useRef(null);
  const fileRef = useRef(null);

  const { isChatOpen, setChatOpen } = useUIStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, recommendations]);

  const toggleOpen = () => {
    setIsOpen((v) => !v);
    if (isChatOpen) setChatOpen(false);
  };

  const handleReset = () => {
    setActiveFeature('home');
    setMessages([]);
    setStylistStep(0);
    setStylistData({});
    setRecommendations([]);
    setComparisonItems([]);
    setInput('');
  };

  const addBotMessage = (text, delay = 700) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', content: text }]);
      setIsTyping(false);
    }, delay);
  };

  const fetchProducts = async (limit = 4) => {
    try {
      const { data } = await api.get(`/products?limit=${limit}`);
      return data.products || [];
    } catch {
      return [];
    }
  };

  const handleFeatureSelect = async (feature) => {
    setActiveFeature(feature);
    setRecommendations([]);
    setComparisonItems([]);
    setStylistStep(0);
    setStylistData({});

    if (feature === 'stylist') {
      setMessages([{ role: 'bot', content: STEPS[0].q }]);
      setStylistStep(1);
    } else if (feature === 'dream') {
      setMessages([
        {
          role: 'bot',
          content: 'Describe your dream room in a few words — or just type what vibe you want. I’ll suggest matching rugs.',
        },
      ]);
    } else if (feature === 'compare') {
      setMessages([{ role: 'bot', content: 'Here’s a simple side-by-side of two popular picks for you.' }]);
      const products = await fetchProducts(2);
      setComparisonItems(
        products.length >= 2
          ? products.slice(0, 2)
          : [
              {
                _id: '1',
                name: 'Warm Beige Handwoven',
                price: 6999,
                images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=400'],
                material: 'Wool blend',
              },
              {
                _id: '2',
                name: 'Modern Grey Tufted',
                price: 8499,
                images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400'],
                material: 'Hand-tufted wool',
              },
            ]
      );
    } else if (feature === 'match') {
      setMessages([
        {
          role: 'bot',
          content: 'Upload a photo of your room and I’ll suggest rugs that match the space.',
        },
      ]);
    }
  };

  const handleStylistChoice = async (choice, value) => {
    const newData = { ...stylistData, [choice]: value };
    setStylistData(newData);
    setMessages((prev) => [...prev, { role: 'user', content: value }]);

    if (stylistStep < 4) {
      const next = stylistStep + 1;
      setStylistStep(next);
      addBotMessage(STEPS[next - 1].q);
    } else {
      setStylistStep(5);
      setIsTyping(true);
      const products = await fetchProducts(4);
      setTimeout(() => {
        setRecommendations(products.slice(0, 4));
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            content: `Perfect. For a ${newData.style || ''} ${newData.room || ''} in ${newData.color || ''} tones (${newData.budget || ''}), these rugs are a great fit.`,
          },
        ]);
        setIsTyping(false);
      }, 800);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      setIsTyping(false);
      const lower = msg.toLowerCase();

      if (lower.includes('support') || lower.includes('help') || lower.includes('human')) {
        addBotMessage('Connecting you to our support chat…');
        setTimeout(() => {
          setIsOpen(false);
          setChatOpen(true);
        }, 1200);
        return;
      }

      if (activeFeature === 'dream') {
        const products = await fetchProducts(4);
        setRecommendations(products.slice(0, 4));
        addBotMessage(
          'Got it! Based on your vibe, here are rugs that should work well. Tap View to open any product.'
        );
        return;
      }

      addBotMessage(
        'I can help you find a rug by room, style, budget, or photo. Tap Home and pick a quick option — or ask me anything about our rugs.'
      );
    }, 700);
  };

  const handleRoomPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessages((prev) => [...prev, { role: 'user', content: `📷 ${file.name}` }]);
    setIsTyping(true);
    const products = await fetchProducts(4);
    setTimeout(() => {
      setRecommendations(products.slice(0, 4));
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: 'Nice space! Here are rugs that should complement your room’s look.',
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const currentStep = stylistStep >= 1 && stylistStep <= 4 ? STEPS[stylistStep - 1] : null;

  return (
    <div className="fixed bottom-[88px] right-[16px] md:bottom-6 md:right-6 z-[9999] font-sans">
      {/* FAB — icon only */}
      {!isOpen && (
        <motion.button
          type="button"
          onClick={toggleOpen}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Jannat AI"
          title="Jannat AI"
          className="w-11 h-11 rounded-full bg-[#1A1A1A] text-[#C9A84C] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.28)] border border-[#C9A84C]/35 cursor-pointer"
        >
          <LuSparkles size={18} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleOpen}
              className="fixed inset-0 bg-black/35 backdrop-blur-[2px] z-0"
            />

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 z-10 w-full sm:w-[420px] h-[92dvh] sm:h-[min(720px,85vh)] bg-[#F7F5F2] sm:rounded-3xl rounded-t-3xl shadow-2xl border border-black/5 flex flex-col overflow-hidden text-left"
            >
              {/* Header */}
              <div className="px-4 py-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  {activeFeature !== 'home' && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                      aria-label="Back"
                    >
                      <FiArrowLeft size={16} />
                    </button>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <LuSparkles size={16} className="text-[#B69640]" />
                      <h2 className="text-[#1A1A1A] font-bold text-[15px]">Jannat AI</h2>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">Easy rug finder for your home</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeFeature !== 'home' && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] cursor-pointer"
                      aria-label="Home"
                    >
                      <FiHome size={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={toggleOpen}
                    className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#1A1A1A] cursor-pointer"
                    aria-label="Close"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>

              {/* Progress for stylist */}
              {activeFeature === 'stylist' && stylistStep >= 1 && stylistStep <= 4 && (
                <div className="px-4 py-2.5 bg-white border-b border-gray-50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium text-gray-500">Step {stylistStep} of 4</span>
                    <span className="text-[11px] text-[#B69640] font-semibold">{Math.round((stylistStep / 4) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C9A84C] transition-all duration-300"
                      style={{ width: `${(stylistStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {activeFeature === 'home' ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                      <p className="text-[13px] text-gray-600 leading-relaxed">
                        Hi! I’m your rug assistant. Pick what you need — I’ll keep it simple.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-0.5">
                        Quick options
                      </p>
                      <FeatureCard
                        icon={LuPaintbrush}
                        title="Find my rug"
                        description="4 quick questions → matching rugs"
                        onClick={() => handleFeatureSelect('stylist')}
                      />
                      <FeatureCard
                        icon={LuLayoutTemplate}
                        title="Describe my room"
                        description="Type a vibe, get suggestions"
                        onClick={() => handleFeatureSelect('dream')}
                      />
                      <FeatureCard
                        icon={LuArrowRightLeft}
                        title="Compare rugs"
                        description="See two options side by side"
                        onClick={() => handleFeatureSelect('compare')}
                      />
                      <FeatureCard
                        icon={FiMaximize2}
                        title="Match my photo"
                        description="Upload room photo for ideas"
                        onClick={() => handleFeatureSelect('match')}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pb-2">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-line ${
                            msg.role === 'user'
                              ? 'bg-[#1A1A1A] text-white rounded-br-md'
                              : 'bg-white border border-gray-100 text-[#1A1A1A] rounded-bl-md shadow-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}

                    {activeFeature === 'stylist' && !isTyping && currentStep && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {currentStep.options.map((opt) => (
                          <ChoiceChip
                            key={opt}
                            label={opt}
                            onClick={() => handleStylistChoice(currentStep.key, opt)}
                          />
                        ))}
                      </div>
                    )}

                    {activeFeature === 'compare' && comparisonItems.length > 0 && (
                      <CompareView products={comparisonItems} />
                    )}

                    {activeFeature === 'match' && recommendations.length === 0 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 bg-white hover:border-[#C9A84C]/50 hover:bg-[#FAF7F2] transition-all cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#B69640]">
                          <FiCamera size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-[#1A1A1A]">Upload room photo</p>
                          <p className="text-[11px] text-gray-400 mt-1">JPG or PNG from gallery</p>
                        </div>
                        <span className="h-9 px-4 rounded-xl bg-[#1A1A1A] text-white text-[12px] font-semibold flex items-center">
                          Choose photo
                        </span>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleRoomPhoto} />
                      </button>
                    )}

                    {isTyping && (
                      <div className="flex gap-1.5 px-3.5 py-3 bg-white border border-gray-100 rounded-2xl rounded-bl-md w-fit shadow-sm">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 0.9, delay: d * 0.15 }}
                            className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"
                          />
                        ))}
                      </div>
                    )}

                    {recommendations.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                          Suggested for you
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {recommendations.map((p) => (
                            <ProductCard key={p._id} product={p} />
                          ))}
                        </div>
                        {activeFeature === 'stylist' && stylistStep >= 5 && (
                          <button
                            type="button"
                            onClick={handleReset}
                            className="w-full mt-3 h-10 rounded-xl border border-gray-200 bg-white text-[12px] font-semibold text-[#1A1A1A] hover:bg-gray-50 cursor-pointer"
                          >
                            Start over
                          </button>
                        )}
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              {activeFeature !== 'home' && (
                <div className="px-3 py-3 bg-white border-t border-gray-100 shrink-0 pb-[max(12px,env(safe-area-inset-bottom))]">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 focus-within:border-[#C9A84C]/50 focus-within:bg-white transition-all">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-10 h-10 rounded-xl text-gray-400 hover:text-[#B69640] flex items-center justify-center cursor-pointer"
                      aria-label="Upload"
                    >
                      <FiCamera size={18} />
                    </button>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask anything..."
                      className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#1A1A1A] placeholder:text-gray-400 h-10"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="w-10 h-10 rounded-xl bg-[#C9A84C] text-[#1A1A1A] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                      aria-label="Send"
                    >
                      <FiSend size={16} />
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
