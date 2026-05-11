import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiMic, FiMicOff, FiRefreshCw, FiUser, FiMapPin, FiGrid } from 'react-icons/fi';
import { LuRug } from "react-icons/lu";
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
    { text: 'Show me collections', icon: FiGrid }
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
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[100] w-[400px] max-w-[95vw] rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col border border-white/5 bg-[#121212]/95 backdrop-blur-3xl"
            style={{ height: '700px' }}
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src="/logo.png" className="w-12 h-12 rounded-full border border-amber-500/20 p-0.5" alt="Bot Logo" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]" />
                </div>
                <div>
                  <h3 className="font-luxury text-xl text-amber-100/90 tracking-wide">Jannat AI Assistant</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</span>
                    <span className="text-[10px] text-white/20">•</span>
                    <span className="text-[10px] text-white/40 font-medium">Always here for you</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={resetChat} className="p-2.5 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                  <FiRefreshCw size={20} />
                </button>
                <button onClick={() => setChatOpen(false)} className="p-2.5 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.from === 'bot' && (
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <LuRug size={20} className="text-amber-500/70" />
                    </div>
                  )}
                  <div className={`flex flex-col gap-2 max-w-[80%] ${msg.from === 'user' ? 'items-end' : ''}`}>
                    <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed ${
                      msg.from === 'user' 
                        ? 'bg-amber-500 text-black font-bold' 
                        : 'bg-[#1A1A1A] text-amber-100/90 border border-white/5 shadow-xl font-medium'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <LuRug size={20} className="text-amber-500/70 animate-pulse" />
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

            {/* Quick Suggestions */}
            <div className="px-6 py-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  Quick Questions <span className="text-amber-500">✨</span>
                </span>
                <FiX size={12} className="text-white/20 cursor-pointer" />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {quickReplies.map((qr, i) => (
                  <button 
                    key={i} 
                    onClick={() => sendMessage(qr.text)}
                    className="flex items-center gap-3 bg-[#1A1A1A] border border-white/5 hover:border-amber-500/30 px-5 py-3.5 rounded-2xl transition-all shrink-0 hover:bg-amber-500/5 group"
                  >
                    <qr.icon size={16} className="text-amber-500/60 group-hover:text-amber-500" />
                    <span className="text-xs text-white/70 font-medium group-hover:text-white">{qr.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 pt-2">
              <div className="flex items-center gap-3">
                <button 
                  onClick={startListening}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {isListening ? <FiMicOff size={24} /> : <FiMic size={24} />}
                </button>
                <div className="flex-1 relative flex items-center">
                  <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl px-6 py-4.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/30 h-14"
                  />
                  <button 
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    className={`absolute right-4 p-2 transition-all ${input.trim() ? 'text-amber-500' : 'text-white/10 cursor-not-allowed'}`}
                  >
                    <FiSend size={24} />
                  </button>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-white/20">
                <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[8px] font-bold">✓</div>
                <p className="text-[10px] font-bold uppercase tracking-widest">Your privacy is important to us. All conversations are secure.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
