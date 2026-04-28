import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useUIStore } from '../store';

const BOT_AVATAR = '🤖';
const USER_AVATAR = '👤';

const initialMessage = {
  from: 'bot',
  text: "Welcome to Jannat Rugs Co.! 👑\n\nI'm your personal carpet assistant. Ask me about:\n• Carpet sizes & prices\n• Materials & craftsmanship\n• Delivery & returns\n• Order tracking\n• Product recommendations",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function ChatBot() {
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { isChatOpen, setChatOpen } = useUIStore();

  const quickReplies = ['Show me rugs', 'Carpet prices', 'Delivery info', 'Return policy', 'Contact us'];

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
      await new Promise(r => setTimeout(r, 800)); // simulate thinking
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
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I\'m having trouble connecting. Please try again!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        id="chatbot-toggle"
        onClick={() => setChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #C9A84C, #9B7B2E)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
      >
        <AnimatePresence mode="wait">
          {isChatOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FiX size={22} color="#0D0D0D" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FiMessageCircle size={22} color="#0D0D0D" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 md:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              height: '520px',
              background: 'rgba(13, 13, 13, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
            }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #C9A84C20, #9B7B2E20)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}
              className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #C9A84C, #9B7B2E)' }}>
                🧿
              </div>
              <div>
                <p className="font-medium text-amber-100 text-sm">Jannat Carpet Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-amber-100/50">Online • Always here for you</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className="text-lg flex-shrink-0 mt-1">{msg.from === 'user' ? USER_AVATAR : BOT_AVATAR}</div>
                  <div className={`max-w-[75%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-3 py-2.5 text-sm leading-relaxed whitespace-pre-line ${msg.from === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot text-amber-100/90'}`}>
                      {msg.text}
                    </div>
                    {msg.products?.length > 0 && (
                      <div className="space-y-1 w-full">
                        {msg.products.map(p => (
                          <Link key={p._id} to={`/product/${p._id}`} onClick={() => setChatOpen(false)}
                            className="flex items-center gap-2 p-2 rounded-lg border border-amber-900/30 hover:border-amber-500/30 transition-colors block">
                            <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded object-cover" />
                            <div>
                              <p className="text-xs text-amber-100">{p.name}</p>
                              <p className="text-xs text-amber-400">₹{(p.discountPrice || p.price)?.toLocaleString()}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    <span className="text-xs text-amber-100/30">{msg.time}</span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <span className="text-lg">🧿</span>
                  <div className="chat-bubble-bot px-3 py-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 rounded-full bg-amber-400"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-3 py-2 flex gap-2 overflow-x-auto" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
              {quickReplies.map(reply => (
                <button key={reply} onClick={() => sendMessage(reply)}
                  className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-amber-700/40 text-amber-400 hover:bg-amber-500/10 transition-colors flex-shrink-0">
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="input-luxury text-sm py-2"
                  id="chat-input"
                />
                <button type="submit"
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: 'linear-gradient(135deg, #C9A84C, #9B7B2E)' }}>
                  <FiSend size={16} color="#0D0D0D" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
