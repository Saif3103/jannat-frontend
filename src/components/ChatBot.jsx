import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMic, FiMicOff, FiRefreshCw, FiUser, FiMapPin, FiMessageCircle, FiGrid as LuRug } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useUIStore } from '../store';

const initialMessage = {
  from: 'bot',
  text: "Welcome to Jannat Rugs Co. Luxury Experience. ✨\n\nI am your Personal Concierge. How may I assist you in finding the perfect masterpiece for your home today?",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function ChatBot() {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { isChatOpen, setChatOpen } = useUIStore();

  const quickReplies = [
    { text: 'How are carpets made?', icon: LuRug },
    { text: 'Who is the owner?', icon: FiUser },
    { text: 'Your address?', icon: FiMapPin },
    { text: 'Show me collections', icon: LuRug }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice Recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      if (e.results[0].isFinal) sendMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

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
      speak(data.reply);
    } catch {
      setIsTyping(false);
      const errorReply = "I'm having a moment. Please try again later.";
      setMessages(prev => [...prev, { from: 'bot', text: errorReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  const resetChat = () => {
    setMessages([initialMessage]);
    toast.success('Conversation reset');
  };

  return (
    <>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-4 sm:right-8 z-[100] w-[92vw] sm:w-[400px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_80px_-15px_rgba(0,0,0,0.8)] flex flex-col border border-white/10 bg-[#0D0D0D]/95 backdrop-blur-2xl"
            style={{ height: 'calc(100vh - 120px)', maxHeight: '700px' }}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-amber-900/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
                    <LuRug size={28} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#0D0D0D]" />
                </div>
                <div>
                  <h3 className="font-luxury text-lg sm:text-xl text-white tracking-wide">Jannat Concierge</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button onClick={resetChat} className="p-2.5 rounded-xl hover:bg-white/5 text-white/30 hover:text-amber-400 transition-all" title="Reset Chat">
                  <FiRefreshCw size={18} />
                </button>
                <button onClick={() => setChatOpen(false)} className="p-2.5 rounded-xl hover:bg-white/5 text-white/30 hover:text-white transition-all">
                  <FiX size={22} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 sm:gap-4 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.from === 'bot' && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <LuRug size={18} className="text-amber-500/80" />
                    </div>
                  )}
                  <div className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[80%] ${msg.from === 'user' ? 'items-end' : ''}`}>
                    <div className={`px-4 sm:px-5 py-3 sm:py-4 rounded-2xl sm:rounded-[1.5rem] text-sm leading-relaxed ${
                      msg.from === 'user' 
                        ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/10' 
                        : 'bg-[#161616] text-amber-50/90 border border-white/5 shadow-xl font-medium'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <LuRug size={20} className="text-amber-500/70 animate-pulse" />
                  </div>
                  <div className="bg-[#161616] px-5 py-4 rounded-2xl border border-white/5">
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

            {/* Quick Suggestions */}
            <div className="px-5 py-4 border-t border-white/5 bg-[#121212]">
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Common Inquiries</p>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                {quickReplies.map((qr, i) => (
                  <button 
                    key={i} 
                    onClick={() => sendMessage(qr.text)}
                    className="flex items-center gap-2.5 bg-[#1A1A1A] border border-white/5 hover:border-amber-500/40 px-4 py-3 rounded-xl transition-all shrink-0 hover:bg-amber-500/10 group"
                  >
                    <qr.icon size={14} className="text-amber-500/60 group-hover:text-amber-500" />
                    <span className="text-[11px] text-white/70 font-bold group-hover:text-white uppercase tracking-wider">{qr.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-6 bg-[#0D0D0D]">
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={startListening}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-amber-500 border border-amber-500/20 hover:bg-white/10'
                  }`}
                >
                  {isListening ? <FiMicOff size={22} /> : <FiMic size={22} />}
                </button>
                <div className="flex-1 relative flex items-center">
                  <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Message assistant..."
                    className="w-full bg-[#161616] border border-white/5 rounded-2xl px-5 sm:px-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/30 h-12 sm:h-14"
                  />
                  <button 
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    className={`absolute right-3 sm:right-4 p-2 transition-all ${input.trim() ? 'text-amber-500' : 'text-white/10 cursor-not-allowed'}`}
                  >
                    <FiSend size={22} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setChatOpen(!isChatOpen)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(201,168,76,0.5)] transition-all group"
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <FiX size={28} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="relative">
              <FiMessageCircle size={28} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tooltip */}
        {!isChatOpen && (
          <div className="absolute right-full mr-4 bg-black/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-[0.2em] border border-white/10 pointer-events-none uppercase">
            Concierge Support
          </div>
        )}
      </motion.button>
    </>
  );
}
