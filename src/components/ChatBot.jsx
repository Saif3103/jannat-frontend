import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMic, FiMicOff, FiRefreshCw, FiUser, FiMapPin, FiMessageCircle, FiGrid, FiChevronDown, FiShield, FiHome, FiCamera, FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { GiRugbyConversion as LuRug } from 'react-icons/gi';
import { TbRobot } from 'react-icons/tb';
import { LuPaintbrush, LuLayoutTemplate, LuArrowRightLeft, LuSparkles } from 'react-icons/lu';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useUIStore, useCartStore, useWishlistStore, useAuthStore } from '../store';

const initialMessage = {
  from: 'bot',
  text: "Welcome to Jannat Rugs Co. Luxury Experience. ✨\n\nI am your Personal Concierge. How may I assist you in finding the perfect masterpiece for your home today?",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function ChatBot() {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [activeMode, setActiveMode] = useState('chat'); // chat, stylist, dream, compare, match
  const messagesEndRef = useRef(null);
  const { isChatOpen, setChatOpen } = useUIStore();
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  const quickReplies = [
    { text: 'How are your rugs made?', icon: LuRug },
    { text: 'Exclusive offers & discounts', icon: FiGrid },
    { text: 'Help me choose a rug', icon: FiGrid },
    { text: 'Track my luxury order', icon: FiMapPin }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMessage = { from: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await api.post('/chatbot', { message: msg });
      setIsTyping(false);
      const botMessage = {
        from: 'bot',
        text: data.reply,
        products: data.suggestedProducts,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: "I'm having a moment. Please try again later.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  const resetChat = () => {
    setMessages([initialMessage]);
    setActiveMode('chat');
    toast.success('Conversation reset');
  };

  return (
    <>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-8 z-[100] w-[92vw] sm:w-[420px] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] flex flex-col border border-white/10 bg-[#0D0D0D]/95 backdrop-blur-3xl font-sans"
            style={{ height: 'calc(100vh - 140px)', maxHeight: '720px' }}
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full object-cover border border-amber-500/30" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0D0D0D]" />
                </div>
                <div>
                  <h3 className="font-luxury text-xl text-white/90 tracking-wide">Jannat AI Stylist</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-medium text-white/40 tracking-wider">Premium Assistant Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={resetChat} className="p-2.5 rounded-full bg-white/5 text-white/40 hover:text-white transition-all border border-white/5">
                  <FiRefreshCw size={16} />
                </button>
                <button onClick={() => setChatOpen(false)} className="p-2.5 rounded-full bg-white/5 text-white/40 hover:text-white transition-all border border-white/5">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* AI Stylist Modes Selector */}
            <div className="px-6 py-3 border-b border-white/5 bg-white/5 flex gap-2 overflow-x-auto scrollbar-hide">
               <button onClick={() => setActiveMode('chat')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeMode === 'chat' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/40'}`}>Chat</button>
               <button onClick={() => setActiveMode('stylist')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeMode === 'stylist' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/40'}`}>Stylist</button>
               <button onClick={() => setActiveMode('dream')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeMode === 'dream' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/40'}`}>Dream Room</button>
               <button onClick={() => setActiveMode('compare')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeMode === 'compare' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white/40'}`}>Compare</button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {activeMode === 'chat' ? (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.from === 'bot' && (
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 text-white/50">
                          <TbRobot size={22} />
                        </div>
                      )}
                      <div className={`flex flex-col gap-2 max-w-[80%] ${msg.from === 'user' ? 'items-end' : ''}`}>
                        <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed ${
                          msg.from === 'user' 
                            ? 'bg-amber-500 text-black font-bold' 
                            : 'bg-[#1A1A1A] text-amber-50/90 border border-white/5'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest px-2">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="space-y-6 text-center py-10">
                   <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500">
                      {activeMode === 'stylist' && <LuPaintbrush size={40} />}
                      {activeMode === 'dream' && <LuLayoutTemplate size={40} />}
                      {activeMode === 'compare' && <LuArrowRightLeft size={40} />}
                   </div>
                   <h4 className="text-white font-luxury text-2xl uppercase tracking-widest">{activeMode} AI Mode</h4>
                   <p className="text-white/40 text-sm">This premium AI feature is being integrated into our unified concierge. Use the chat for now or explore our shop for recommendations.</p>
                   <button onClick={() => setActiveMode('chat')} className="btn-gold px-8 py-3 text-[10px]">Back to Chat</button>
                </div>
              )}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <TbRobot size={20} className="text-white/50 animate-pulse" />
                  </div>
                  <div className="bg-[#1A1A1A] px-5 py-4 rounded-3xl border border-white/5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map(d => (
                        <motion.div key={d} className="w-1.5 h-1.5 bg-amber-500/50 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {activeMode === 'chat' && (
              <div className="border-t border-white/5 bg-[#121212]/50 px-6 py-4">
                <button 
                  onClick={() => setShowQuickQuestions(!showQuickQuestions)}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 group"
                >
                  <span className="flex items-center gap-2">Quick Assistance ✨</span>
                  <FiChevronDown className={`transition-transform duration-300 ${showQuickQuestions ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showQuickQuestions && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                    >
                      {quickReplies.map((qr, i) => (
                        <button 
                          key={i} 
                          onClick={() => sendMessage(qr.text)}
                          className="flex items-center gap-3 bg-white/5 border border-white/5 hover:border-amber-500/30 px-5 py-3.5 rounded-2xl transition-all shrink-0 hover:bg-amber-500/5 group text-left max-w-[160px]"
                        >
                          <qr.icon size={18} className="text-white/40 group-hover:text-amber-500 transition-colors shrink-0" />
                          <span className="text-[11px] text-white/60 font-medium group-hover:text-white leading-tight">{qr.text}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Input */}
            <div className="p-6 bg-[#0D0D0D] space-y-4">
              <div className="flex items-center gap-4">
                <button 
                  className="w-14 h-14 rounded-2xl bg-[#C9A84C] text-black flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
                >
                  <FiMic size={24} />
                </button>
                <div className="flex-1 relative flex items-center bg-[#1A1A1A] rounded-2xl border border-white/5 focus-within:border-amber-500/30 transition-colors">
                  <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                    className="w-full bg-transparent px-6 py-4 text-sm text-white placeholder:text-white/20 outline-none h-14"
                  />
                  <button 
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    className={`absolute right-4 p-2 transition-all ${input.trim() ? 'text-amber-500' : 'text-white/10'}`}
                  >
                    <FiSend size={24} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] text-white/20 font-medium uppercase tracking-widest">
                <FiShield size={12} />
                <span>Your privacy is important to us. All conversations are secure.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setChatOpen(!isChatOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-[0_20px_50px_rgba(201,168,76,0.3)] group overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? <FiX key="x" size={28} /> : <FiMessageCircle key="m" size={28} />}
        </AnimatePresence>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </motion.button>
    </>
  );
}
