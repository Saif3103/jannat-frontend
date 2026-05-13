import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, FiSend, FiGrid, FiMaximize, FiRulers, FiImage, 
  FiChevronLeft, FiShoppingBag, FiHeart, FiCheck, FiArrowRight,
  FiUploadCloud, FiCamera, FiLayout, FiShield, FiStar
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useUIStore } from '../store';

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80';
  if (url.startsWith('http')) return url;
  return `https://jannat-backend.onrender.com${url}`;
};

export default function ChatBot() {
  const { isChatOpen, setChatOpen } = useUIStore();
  const [mode, setMode] = useState('home'); // home, expert, match, size
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [roomImage, setRoomImage] = useState(null);
  const [roomAnalysis, setRoomAnalysis] = useState(null);
  const [roomSize, setRoomSize] = useState({ length: '', width: '', type: 'living' });
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // AI RUG EXPERT LOGIC
  const handleExpertAsk = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await api.post('/chatbot', { message: msg });
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: data.reply || "I've curated these exceptional pieces that would complement your vision perfectly.",
        products: data.suggestedProducts || []
      }]);
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: "I'm experiencing a brief interruption in my connection. How else may I assist you?" }]);
    }
  };

  // AI ROOM MATCH LOGIC
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setRoomImage(e.target.result);
      reader.readAsDataURL(file);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setRoomAnalysis({
          palette: ['#F5F5DC', '#D2B48C', '#F5F5F5'],
          tone: 'Warm Neutral',
          style: 'Contemporary Minimalist',
          suggestion: 'Your space features beautiful warm neutral tones. I recommend a silk-touch rug with subtle geometric patterns to add texture without overwhelming the room.'
        });
      }, 2000);
    }
  };

  // MODE RENDERERS
  const renderHome = () => (
    <div className="space-y-8 p-8">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-3xl text-[#111827]">✨ Jannat AI Concierge</h2>
        <p className="text-sm text-gray-500 font-medium">Your personal luxury rug expert</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { id: 'expert', icon: FiStar, title: 'AI Rug Expert', desc: 'Personalized recommendations', color: 'from-[#111827] to-[#1F2937]' },
          { id: 'match', icon: FiMaximize, title: 'AI Room Match', desc: 'Match rugs to your room photo', color: 'from-[#C9A84C] to-[#B08D3E]' },
          { id: 'size', icon: FiRulers, title: 'AI Size Guide', desc: 'Find the perfect fit for your space', color: 'from-[#111827] to-[#1F2937]' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className="group relative bg-white border border-gray-100 p-6 rounded-[2rem] text-left hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-full transition-opacity`} />
            <div className="flex items-center gap-5 relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#111827] tracking-tight">{item.title}</h4>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{item.desc}</p>
              </div>
              <FiChevronLeft className="ml-auto rotate-180 text-gray-300 group-hover:text-[#111827] transition-colors" />
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#C9A84C]/10">
        <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-2 text-center">Popular Inquiries</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Beige Living Room', 'Modern Minimal', 'Royal Persian', 'Under ₹50,000'].map(q => (
            <button key={q} onClick={() => { setMode('expert'); handleExpertAsk(q); }} className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-gray-600 hover:text-black border border-gray-100 hover:border-gray-200 transition-all">
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExpert = () => (
    <div className="flex flex-col h-full bg-[#F8FAFC]/50">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-4">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto text-[#C9A84C]">
              <FiStar size={32} />
            </div>
            <p className="text-sm text-gray-500 max-w-[240px] mx-auto leading-relaxed">
              Tell me about your space, colors, or budget and I will find the perfect masterpiece.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] space-y-3`}>
              <div className={`px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed ${
                msg.from === 'user' 
                  ? 'bg-[#111827] text-white font-medium rounded-tr-none' 
                  : 'bg-white text-[#111827] shadow-sm border border-gray-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              
              {msg.products && msg.products.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                  {msg.products.map(p => (
                    <div key={p._id} className="min-w-[200px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                      <div className="relative aspect-[4/5]">
                        <img src={getImageUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-[#C9A84C]">
                          98% MATCH
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <h5 className="text-[13px] font-bold text-[#111827] truncate">{p.name}</h5>
                        <p className="text-xs font-black text-[#111827]">₹{p.price?.toLocaleString()}</p>
                        <Link to={`/product/${p._id}`} onClick={() => setChatOpen(false)} className="block w-full py-2 bg-gray-50 hover:bg-[#111827] hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest text-center transition-all">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="bg-white px-5 py-4 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex gap-1.5">
                {[1, 2, 3].map(d => (
                  <motion.div key={d} className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleExpertAsk()}
            placeholder="Describe your space..."
            className="w-full bg-[#F8FAFC] border border-gray-100 rounded-2xl pl-6 pr-14 py-4 text-sm outline-none focus:border-[#C9A84C]/30 transition-all"
          />
          <button 
            onClick={() => handleExpertAsk()}
            disabled={!input.trim()}
            className={`absolute right-4 p-2 rounded-xl transition-all ${input.trim() ? 'bg-[#111827] text-white' : 'text-gray-300'}`}
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMatch = () => (
    <div className="flex flex-col h-full bg-[#F8FAFC]/50 p-8 space-y-6 overflow-y-auto">
      <div className="text-center space-y-2">
        <h3 className="font-serif text-2xl text-[#111827]">Visualize In Your Space</h3>
        <p className="text-xs text-gray-500">Upload a photo and let AI analyze the perfect fit</p>
      </div>

      {!roomImage ? (
        <label className="relative group cursor-pointer">
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
          <div className="w-full aspect-square bg-white border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center gap-6 group-hover:border-[#C9A84C]/30 transition-all">
            <div className="w-20 h-20 bg-[#FAF7F2] rounded-3xl flex items-center justify-center text-[#C9A84C] group-hover:scale-110 transition-transform">
              <FiUploadCloud size={32} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#111827]">Upload Room Photo</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Gallery or Camera</p>
            </div>
          </div>
        </label>
      ) : (
        <div className="space-y-6">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img src={roomImage} alt="Room" className="w-full h-full object-cover" />
            <button onClick={() => { setRoomImage(null); setRoomAnalysis(null); }} className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg text-red-500">
              <FiX size={18} />
            </button>
          </div>

          {isTyping ? (
            <div className="bg-white p-8 rounded-[2rem] text-center space-y-4">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="inline-block">
                <FiRefreshCw className="text-[#C9A84C]" size={32} />
              </motion.div>
              <p className="text-sm font-bold text-gray-500 animate-pulse">Analyzing Space & Palette...</p>
            </div>
          ) : roomAnalysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {roomAnalysis.palette.map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#111827] uppercase tracking-widest">{roomAnalysis.tone} Tone</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{roomAnalysis.style}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic">"{roomAnalysis.suggestion}"</p>
              <button onClick={() => setMode('expert')} className="w-full py-4 bg-[#111827] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                View Recommendations <FiArrowRight />
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );

  const renderSize = () => (
    <div className="flex flex-col h-full bg-[#F8FAFC]/50 p-8 space-y-8 overflow-y-auto">
      <div className="text-center space-y-2">
        <h3 className="font-serif text-2xl text-[#111827]">Rug Size Concierge</h3>
        <p className="text-xs text-gray-500">Calculate the perfect dimensions for your space</p>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Length (ft)</label>
            <input type="number" value={roomSize.length} onChange={e => setRoomSize(p => ({...p, length: e.target.value}))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#C9A84C]/30 transition-all font-bold" placeholder="12" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Width (ft)</label>
            <input type="number" value={roomSize.width} onChange={e => setRoomSize(p => ({...p, width: e.target.value}))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#C9A84C]/30 transition-all font-bold" placeholder="14" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Type</label>
          <div className="grid grid-cols-3 gap-2">
            {['Living', 'Bedroom', 'Dining'].map(t => (
              <button 
                key={t}
                onClick={() => setRoomSize(p => ({...p, type: t.toLowerCase()}))}
                className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${roomSize.type === t.toLowerCase() ? 'bg-[#111827] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {roomSize.length && roomSize.width && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-6 border-t border-gray-50 space-y-6">
            <div className="bg-[#FAF7F2] p-6 rounded-2xl text-center space-y-2">
              <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.2em]">Recommended Size</p>
              <h4 className="text-3xl font-serif text-[#111827]">8' x 10'</h4>
              <p className="text-xs text-gray-500 leading-relaxed italic">"Creates balanced spacing while keeping furniture visually connected."</p>
            </div>
            <div className="relative aspect-video bg-[#F1F5F9] rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
               <div className="w-[60%] h-[60%] bg-[#111827]/10 border-2 border-dashed border-[#111827]/30 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] font-black text-[#111827]/40 uppercase tracking-widest">Rug Placement</span>
               </div>
               <div className="absolute inset-4 border border-[#111827]/5 rounded-xl pointer-events-none" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[1001] w-full sm:w-[460px] h-full sm:h-[calc(100vh-80px)] sm:max-h-[820px] bg-white sm:rounded-[2.5rem] shadow-[0_50px_120px_-20px_rgba(0,0,0,0.15)] flex flex-col border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50 bg-white relative z-10">
              <div className="flex items-center gap-4">
                {mode !== 'home' && (
                  <button onClick={() => setMode('home')} className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition-all">
                    <FiChevronLeft size={20} />
                  </button>
                )}
                <div className="relative">
                  <div className="w-12 h-12 bg-[#111827] rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] tracking-tight">Jannat Concierge</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Assistant</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-3 rounded-2xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                <FiX size={20} />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 relative overflow-hidden">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={mode}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="absolute inset-0"
                 >
                   {mode === 'home' && renderHome()}
                   {mode === 'expert' && renderExpert()}
                   {mode === 'match' && renderMatch()}
                   {mode === 'size' && renderSize()}
                 </motion.div>
               </AnimatePresence>
            </div>

            {/* Footer / Privacy */}
            <div className="px-8 py-4 bg-white border-t border-gray-50 flex items-center justify-center gap-2">
               <FiShield className="text-[#C9A84C]" size={12} />
               <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Secure AI Consulting</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setChatOpen(!isChatOpen)}
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[1000] group"
      >
        <div className="bg-white/88 backdrop-blur-[18px] border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.12)] px-6 py-4 rounded-full flex items-center gap-3 overflow-hidden transition-all group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#111827] to-[#1F2937] flex items-center justify-center text-white shadow-lg relative shrink-0">
             <AnimatePresence mode="wait">
               {isChatOpen ? <FiX key="x" /> : <span key="icon" className="text-sm">✨</span>}
             </AnimatePresence>
           </div>
           <span className="text-[13px] font-bold text-[#111827] tracking-tight whitespace-nowrap">
             {isChatOpen ? 'Close Concierge' : 'Ask Rug Expert'}
           </span>
        </div>
      </motion.button>
    </>
  );
}

