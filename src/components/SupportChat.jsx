import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiX,
  FiSend,
  FiMinus,
  FiImage,
  FiSmile,
  FiMessageCircle,
  FiChevronDown,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuthStore, useUIStore } from '../store';
import {
  connectSupportSocket,
  disconnectSupportSocket,
  getGuestId,
  joinConversation,
  leaveConversation,
} from '../utils/supportSocket';

const QUICK_REPLIES = [
  'Order Status',
  'Product Inquiry',
  'Delivery',
  'Returns',
  'Customization',
  'Bulk Orders',
];

const EMOJIS = ['😊', '🙏', '✨', '🛋️', '💛', '👍', '❤️', '🎉', '📷', '🧵', '🏠', '✅'];

function formatTime(date) {
  try {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/80 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function SupportChat() {
  const { user, token } = useAuthStore();
  const { isChatOpen, setChatOpen } = useUIStore();

  const [minimized, setMinimized] = useState(false);
  const [online, setOnline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [agentTyping, setAgentTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [needsIdentity, setNeedsIdentity] = useState(false);
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [identity, setIdentity] = useState({ name: '', email: '', phone: '' });
  const [offlineForm, setOfflineForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [offlineSent, setOfflineSent] = useState(false);

  const endRef = useRef(null);
  const fileRef = useRef(null);
  const typingTimeout = useRef(null);
  const socketRef = useRef(null);
  const openRef = useRef(isChatOpen);

  useEffect(() => {
    openRef.current = isChatOpen;
  }, [isChatOpen]);

  useEffect(() => {
    if (user) {
      setIdentity({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setOfflineForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
        phone: user.phone || f.phone,
      }));
    }
  }, [user]);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, agentTyping, scrollToBottom]);

  const markSeen = useCallback(async (conversationId) => {
    if (!conversationId) return;
    try {
      await api.post(`/support/conversations/${conversationId}/seen`);
      setUnread(0);
      setConversation((c) => (c ? { ...c, unreadCustomer: 0 } : c));
    } catch {
      /* ignore */
    }
  }, []);

  const bootstrap = useCallback(async () => {
    getGuestId();
    setLoading(true);
    try {
      const statusRes = await api.get('/support/status');
      const isOnline = !!statusRes.data.online;
      setOnline(isOnline);

      const { data } = await api.get('/support/conversations/me');
      setOnline(data.online ?? isOnline);

      if (data.conversation) {
        setConversation(data.conversation);
        setMessages(data.messages || []);
        setNeedsIdentity(false);
        setShowOfflineForm(false);
        setUnread(data.conversation.unreadCustomer || 0);
        if (openRef.current) markSeen(data.conversation._id);
      } else if (!user) {
        setNeedsIdentity(true);
      } else if (!isOnline) {
        setShowOfflineForm(true);
      }
    } catch {
      setOnline(false);
    } finally {
      setLoading(false);
    }
  }, [user, markSeen]);

  useEffect(() => {
    const guestId = getGuestId();
    const socket = connectSupportSocket({ token, guestId, isAdmin: false });
    socketRef.current = socket;

    const onStatus = (payload) => setOnline(!!payload?.online);
    const onMessage = ({ conversationId, message, conversation: conv }) => {
      setConversation((prev) => {
        if (prev && String(prev._id) !== String(conversationId)) return prev;
        return conv ? { ...prev, ...conv } : prev;
      });
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      if (message.sender === 'agent') {
        if (openRef.current && !minimized) {
          markSeen(conversationId);
        } else {
          setUnread((u) => u + 1);
          toast('Support replied', { icon: '💬' });
        }
      }
    };
    const onTypingStart = ({ sender }) => {
      if (sender === 'agent') setAgentTyping(true);
    };
    const onTypingStop = ({ sender }) => {
      if (sender === 'agent') setAgentTyping(false);
    };
    const onUpdated = ({ conversation: conv }) => {
      if (!conv) return;
      setConversation((prev) =>
        prev && String(prev._id) === String(conv._id) ? { ...prev, ...conv } : prev
      );
    };
    const onNotify = (payload) => {
      if (payload?.type === 'reply' && (!openRef.current || minimized)) {
        toast(payload.body || 'New support message', { icon: '💬' });
        setUnread((u) => u + 1);
      }
    };

    socket.on('support:status', onStatus);
    socket.on('message:new', onMessage);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);
    socket.on('conversation:updated', onUpdated);
    socket.on('notification:new', onNotify);

    bootstrap();

    return () => {
      socket.off('support:status', onStatus);
      socket.off('message:new', onMessage);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      socket.off('conversation:updated', onUpdated);
      socket.off('notification:new', onNotify);
    };
  }, [token, bootstrap, markSeen, minimized]);

  useEffect(() => {
    if (conversation?._id) {
      joinConversation(conversation._id);
      return () => leaveConversation(conversation._id);
    }
  }, [conversation?._id]);

  useEffect(() => {
    if (isChatOpen && conversation?._id) {
      markSeen(conversation._id);
      setMinimized(false);
    }
  }, [isChatOpen, conversation?._id, markSeen]);

  const startConversation = async (topic = '') => {
    setLoading(true);
    setShowOfflineForm(false);
    setOfflineSent(false);
    try {
      const payload = {
        name: identity.name || user?.name,
        email: identity.email || user?.email,
        phone: identity.phone || user?.phone || '',
        topic,
        guestId: getGuestId(),
      };
      const { data } = await api.post('/support/conversations', payload);
      setConversation(data.conversation);
      setMessages(data.messages || []);
      setOnline(!!data.online);
      setNeedsIdentity(false);
      if (!data.online && (data.messages || []).filter((m) => m.sender === 'customer').length === 0) {
        setShowOfflineForm(true);
      }
      if (data.conversation?._id) joinConversation(data.conversation._id);
    } catch (err) {
      if (err.response?.data?.needsIdentity) {
        setNeedsIdentity(true);
      } else {
        toast.error(err.response?.data?.message || 'Could not start chat');
      }
    } finally {
      setLoading(false);
    }
  };

  const emitTyping = (active) => {
    const socket = socketRef.current;
    if (!socket || !conversation?._id) return;
    socket.emit(active ? 'typing:start' : 'typing:stop', {
      conversationId: conversation._id,
      sender: 'customer',
    });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    emitTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false), 1200);
  };

  const sendText = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || !conversation?._id) return;
    if (conversation.status === 'closed') {
      toast.error('This conversation is closed');
      return;
    }

    setInput('');
    setShowEmoji(false);
    emitTyping(false);

    try {
      const { data } = await api.post(`/support/conversations/${conversation._id}/messages`, {
        text,
      });
      setMessages((prev) =>
        prev.some((m) => m._id === data.message._id) ? prev : [...prev, data.message]
      );
      setConversation(data.conversation);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send');
      setInput(text);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  const uploadImage = async (file) => {
    if (!file || !conversation?._id) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post(`/support/conversations/${conversation._id}/images`, fd);
      setMessages((prev) =>
        prev.some((m) => m._id === data.message._id) ? prev : [...prev, data.message]
      );
      setConversation(data.conversation);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitOffline = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/support/offline', {
        ...offlineForm,
        guestId: getGuestId(),
      });
      setConversation(data.conversation);
      setMessages((prev) => {
        const next = [...prev];
        if (data.message && !next.some((m) => m._id === data.message._id)) next.push(data.message);
        return next;
      });
      setOfflineSent(true);
      setShowOfflineForm(false);
      setNeedsIdentity(false);
      toast.success('Message received — we will reply soon');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit');
    }
  };

  const openChat = () => {
    setChatOpen(true);
    setMinimized(false);
    if (!conversation && user) {
      if (!online) setShowOfflineForm(true);
      else startConversation();
    } else if (!conversation && !user) {
      setNeedsIdentity(true);
    }
  };

  const closeChat = () => {
    setChatOpen(false);
    setMinimized(false);
    setShowEmoji(false);
  };

  const minimizeChat = () => {
    setMinimized(true);
    setChatOpen(false);
  };

  const closed = conversation?.status === 'closed';
  const canMessage = conversation && conversation.status !== 'closed' && !showOfflineForm;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {(!isChatOpen || minimized) && (
          <motion.button
            type="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={openChat}
            className="fixed bottom-[88px] right-[76px] md:bottom-6 md:right-[88px] z-[9998] w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8A6D25] text-[#1A1A1A] shadow-[0_12px_40px_rgba(201,168,76,0.45)] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
            aria-label="Open support chat"
          >
            <FiMessageCircle size={24} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0D0D0D]">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Minimized bar */}
      <AnimatePresence>
        {minimized && (
          <motion.button
            type="button"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            onClick={openChat}
            className="fixed bottom-[160px] right-4 md:bottom-24 md:right-6 z-[9998] flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-[#0D0D0D]/95 border border-white/10 backdrop-blur-xl text-white shadow-2xl cursor-pointer"
          >
            <img src="/logo.png" alt="" className="w-8 h-8 rounded-full object-cover border border-[#C9A84C]/40" />
            <div className="text-left">
              <p className="text-xs font-semibold">Support Agent</p>
              <p className="text-[10px] text-white/40">{online ? 'Online' : 'Offline'}</p>
            </div>
            {unread > 0 && (
              <span className="min-w-[18px] h-[18px] rounded-full bg-[#C9A84C] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
            <FiChevronDown className="rotate-180 text-white/40" size={14} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isChatOpen && !minimized && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-[88px] right-2 sm:right-6 z-[9999] w-[95%] sm:w-[380px] max-w-[380px] h-[min(640px,calc(100dvh-120px))] rounded-[1.75rem] overflow-hidden flex flex-col border border-white/10 bg-[#0D0D0D]/92 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.75)] font-sans"
          >
            {/* Header */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b border-white/8 bg-gradient-to-r from-[#C9A84C]/15 to-transparent shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src="/logo.png"
                    alt="Jannat Rugs"
                    className="w-11 h-11 rounded-full object-cover border border-[#C9A84C]/35"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0D0D0D] ${
                      online ? 'bg-emerald-500' : 'bg-gray-500'
                    }`}
                  />
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="font-luxury text-lg text-white/95 tracking-wide truncate">
                    Support Agent
                  </h3>
                  <p className="text-[11px] text-white/45 flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-gray-500'}`}
                    />
                    {online ? 'Online · typically replies instantly' : "We're currently offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={minimizeChat}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Minimize"
                >
                  <FiMinus size={16} />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 scroll-smooth">
              {loading && !messages.length && (
                <p className="text-center text-white/30 text-xs py-8">Connecting…</p>
              )}

              {/* Guest identity */}
              {needsIdentity && !conversation && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!identity.name.trim() || !identity.email.trim()) {
                      toast.error('Name and email required');
                      return;
                    }
                    if (!online) {
                      setNeedsIdentity(false);
                      setShowOfflineForm(true);
                      setOfflineForm((f) => ({
                        ...f,
                        name: identity.name,
                        email: identity.email,
                        phone: identity.phone,
                      }));
                      return;
                    }
                    startConversation();
                  }}
                  className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <p className="text-white/80 text-sm font-medium text-left">
                    Start a conversation with our concierge
                  </p>
                  <input
                    required
                    placeholder="Your name"
                    value={identity.name}
                    onChange={(e) => setIdentity({ ...identity, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-[#C9A84C]/60"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={identity.email}
                    onChange={(e) => setIdentity({ ...identity, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-[#C9A84C]/60"
                  />
                  <input
                    placeholder="Phone"
                    value={identity.phone}
                    onChange={(e) => setIdentity({ ...identity, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-[#C9A84C]/60"
                  />
                  <button
                    type="submit"
                    className="w-full h-10 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#E7C78A] transition-colors cursor-pointer"
                  >
                    Continue
                  </button>
                </form>
              )}

              {/* Offline form */}
              {showOfflineForm && !offlineSent && (
                <form
                  onSubmit={submitOffline}
                  className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="text-left">
                    <p className="text-white/90 text-sm font-semibold">We're currently offline.</p>
                    <p className="text-white/40 text-xs mt-1">
                      Leave your details and we'll get back to you.
                    </p>
                  </div>
                  <input
                    required
                    placeholder="Name"
                    value={offlineForm.name}
                    onChange={(e) => setOfflineForm({ ...offlineForm, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-[#C9A84C]/60"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={offlineForm.email}
                    onChange={(e) => setOfflineForm({ ...offlineForm, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-[#C9A84C]/60"
                  />
                  <input
                    placeholder="Phone"
                    value={offlineForm.phone}
                    onChange={(e) => setOfflineForm({ ...offlineForm, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-[#C9A84C]/60"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Your message"
                    value={offlineForm.message}
                    onChange={(e) => setOfflineForm({ ...offlineForm, message: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-[#C9A84C]/60 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full h-10 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold cursor-pointer"
                  >
                    Send message
                  </button>
                </form>
              )}

              {/* Quick replies */}
              {conversation && messages.length <= 2 && !closed && online && (
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendText(q)}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium border border-[#C9A84C]/35 text-[#E7C78A] hover:bg-[#C9A84C]/15 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) => {
                if (m.sender === 'system') {
                  return (
                    <div key={m._id} className="flex justify-center">
                      <p className="text-[10px] text-white/35 bg-white/5 px-3 py-1.5 rounded-full max-w-[90%] text-center">
                        {m.text}
                      </p>
                    </div>
                  );
                }
                const mine = m.sender === 'customer';
                return (
                  <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-left ${
                        mine
                          ? 'bg-[#C9A84C] text-[#1A1A1A] rounded-br-md'
                          : 'bg-white/8 text-white/90 border border-white/8 rounded-bl-md'
                      }`}
                    >
                      {!mine && (
                        <p className="text-[10px] font-semibold text-[#C9A84C] mb-1">
                          {m.senderName || 'Support'}
                        </p>
                      )}
                      {m.image && (
                        <a href={m.image} target="_blank" rel="noreferrer" className="block mb-1.5">
                          <img
                            src={m.image}
                            alt="Attachment"
                            className="rounded-xl max-h-44 object-cover border border-black/10"
                          />
                        </a>
                      )}
                      {m.text && (
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                          {m.text}
                        </p>
                      )}
                      <div
                        className={`flex items-center gap-1.5 mt-1 ${
                          mine ? 'justify-end text-[#1A1A1A]/55' : 'justify-start text-white/30'
                        }`}
                      >
                        <span className="text-[9px]">{formatTime(m.createdAt)}</span>
                        {mine && (
                          <span className="text-[9px]">
                            {m.seenByAgent ? 'Seen' : 'Sent'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {agentTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/8 border border-white/8 rounded-2xl rounded-bl-md">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            {canMessage && (
              <div className="border-t border-white/8 p-3 shrink-0 bg-black/20 relative">
                {conversation?.status === 'resolved' && (
                  <p className="text-[10px] text-[#C9A84C]/80 mb-2 text-center">
                    Resolved — send a message to reopen
                  </p>
                )}
                {showEmoji && (
                  <div className="absolute bottom-full left-3 right-3 mb-2 p-2 rounded-2xl bg-[#161616] border border-white/10 grid grid-cols-6 gap-1 shadow-xl">
                    {EMOJIS.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setInput((v) => v + em);
                          setShowEmoji(false);
                        }}
                        className="text-lg hover:bg-white/10 rounded-lg py-1 cursor-pointer"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmoji((v) => !v)}
                    className="w-9 h-9 rounded-xl bg-white/5 text-white/50 hover:text-[#C9A84C] flex items-center justify-center cursor-pointer shrink-0"
                    aria-label="Emoji"
                  >
                    <FiSmile size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                    className="w-9 h-9 rounded-xl bg-white/5 text-white/50 hover:text-[#C9A84C] flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-40"
                    aria-label="Upload image"
                    title="Upload rug photo"
                  >
                    <FiImage size={18} />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadImage(f);
                      e.target.value = '';
                    }}
                  />
                  <textarea
                    rows={1}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={onKeyDown}
                    placeholder="Write a message…"
                    className="flex-1 min-h-[36px] max-h-24 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#C9A84C]/50 resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => sendText()}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-xl bg-[#C9A84C] text-[#1A1A1A] flex items-center justify-center disabled:opacity-40 hover:bg-[#E7C78A] cursor-pointer shrink-0"
                    aria-label="Send"
                  >
                    <FiSend size={16} />
                  </button>
                </div>
                <p className="text-[9px] text-white/20 mt-1.5 text-center">
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            )}

            {closed && (
              <div className="p-3 border-t border-white/8 text-center">
                <p className="text-xs text-white/40 mb-2">Conversation closed</p>
                <button
                  type="button"
                  onClick={() => startConversation()}
                  className="text-xs font-semibold text-[#C9A84C] hover:underline cursor-pointer"
                >
                  Start a new conversation
                </button>
              </div>
            )}

            {!conversation && !needsIdentity && !showOfflineForm && user && online && (
              <div className="p-4 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => startConversation()}
                  className="w-full h-11 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold cursor-pointer"
                >
                  Chat with support
                </button>
                <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => startConversation(q)}
                      className="px-2.5 py-1 rounded-full text-[10px] border border-white/10 text-white/50 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Keep socket lifecycle clean when navigating away entirely (optional unmount cleanup via App)
export { disconnectSupportSocket };
