import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FiSearch,
  FiSend,
  FiImage,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiUser,
  FiMail,
  FiPhone,
  FiClock,
  FiSmile,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuthStore } from '../../store';
import {
  connectSupportSocket,
  joinConversation,
  leaveConversation,
} from '../../utils/supportSocket';

const STATUS_BADGE = {
  open: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  resolved: 'bg-blue-50 text-blue-700',
  closed: 'bg-gray-100 text-gray-500',
};

const EMOJIS = ['😊', '🙏', '✨', '👍', '❤️', '✅', '📦', '🚚'];

function formatTime(date) {
  try {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export default function AdminSupport() {
  const { user, token } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [input, setInput] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [customerTyping, setCustomerTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);

  const endRef = useRef(null);
  const fileRef = useRef(null);
  const typingTimeout = useRef(null);
  const socketRef = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, customerTyping]);

  const loadList = useCallback(async () => {
    try {
      const { data } = await api.get('/support/admin/conversations', {
        params: { q: search || undefined, status: statusFilter },
      });
      setConversations(data.conversations || []);
      setUnreadTotal(data.unreadTotal || 0);
    } catch {
      toast.error('Failed to load chats');
    } finally {
      setLoadingList(false);
    }
  }, [search, statusFilter]);

  const openConversation = useCallback(async (id) => {
    if (!id) return;
    setSelectedId(id);
    setLoadingChat(true);
    setCustomerTyping(false);
    try {
      const { data } = await api.get(`/support/admin/conversations/${id}`);
      setConversation(data.conversation);
      setMessages(data.messages || []);
      joinConversation(id);
      setConversations((list) =>
        list.map((c) => (c._id === id ? { ...c, unreadAdmin: 0 } : c))
      );
    } catch {
      toast.error('Could not open conversation');
    } finally {
      setLoadingChat(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(loadList, 250);
    return () => clearTimeout(t);
  }, [loadList]);

  useEffect(() => {
    const socket = connectSupportSocket({ token, isAdmin: true });
    socketRef.current = socket;
    socket.emit('join:admin');

    const onMessage = ({ conversationId, message, conversation: conv }) => {
      setConversations((list) => {
        const idx = list.findIndex((c) => String(c._id) === String(conversationId));
        let next = [...list];
        if (idx > -1) {
          const updated = {
            ...next[idx],
            ...(conv || {}),
            lastMessage: message?.text || next[idx].lastMessage,
            lastMessageAt: message?.createdAt || new Date().toISOString(),
            unreadAdmin:
              String(selectedRef.current) === String(conversationId)
                ? 0
                : message?.sender === 'customer'
                  ? (next[idx].unreadAdmin || 0) + 1
                  : next[idx].unreadAdmin,
          };
          next.splice(idx, 1);
          next.unshift(updated);
        } else if (conv) {
          next.unshift(conv);
        }
        return next;
      });

      if (String(selectedRef.current) === String(conversationId) && message) {
        setMessages((prev) =>
          prev.some((m) => m._id === message._id) ? prev : [...prev, message]
        );
        setConversation((c) => (c ? { ...c, ...(conv || {}) } : c));
      }

      if (message?.sender === 'customer' && String(selectedRef.current) !== String(conversationId)) {
        toast(`New message from ${message.senderName || 'customer'}`, { icon: '💬' });
        setUnreadTotal((n) => n + 1);
      }
    };

    const onNewConv = ({ conversation: conv }) => {
      if (!conv) return;
      setConversations((list) => {
        if (list.some((c) => c._id === conv._id)) return list;
        return [conv, ...list];
      });
      toast('New support conversation', { icon: '✨' });
    };

    const onTypingStart = ({ conversationId, sender }) => {
      if (sender === 'customer' && String(selectedRef.current) === String(conversationId)) {
        setCustomerTyping(true);
      }
    };
    const onTypingStop = ({ conversationId, sender }) => {
      if (sender === 'customer' && String(selectedRef.current) === String(conversationId)) {
        setCustomerTyping(false);
      }
    };
    const onUpdated = ({ conversation: conv }) => {
      if (!conv) return;
      setConversations((list) =>
        list.map((c) => (String(c._id) === String(conv._id) ? { ...c, ...conv } : c))
      );
      if (String(selectedRef.current) === String(conv._id)) {
        setConversation((c) => (c ? { ...c, ...conv } : c));
      }
    };
    const onNotify = (payload) => {
      if (payload?.type === 'message' || payload?.type === 'offline') {
        if (String(selectedRef.current) !== String(payload.conversationId)) {
          toast(payload.body || payload.title, { icon: '🔔' });
        }
      }
    };

    socket.on('message:new', onMessage);
    socket.on('conversation:new', onNewConv);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);
    socket.on('conversation:updated', onUpdated);
    socket.on('notification:new', onNotify);

    return () => {
      socket.off('message:new', onMessage);
      socket.off('conversation:new', onNewConv);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      socket.off('conversation:updated', onUpdated);
      socket.off('notification:new', onNotify);
      if (selectedRef.current) leaveConversation(selectedRef.current);
    };
  }, [token]);

  const emitTyping = (active) => {
    const socket = socketRef.current;
    if (!socket || !selectedId) return;
    socket.emit(active ? 'typing:start' : 'typing:stop', {
      conversationId: selectedId,
      sender: 'agent',
    });
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    emitTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false), 1200);
  };

  const sendMessage = async (override) => {
    const text = (override ?? input).trim();
    if (!text || !selectedId) return;
    setInput('');
    setShowEmoji(false);
    emitTyping(false);
    try {
      const { data } = await api.post(`/support/admin/conversations/${selectedId}/messages`, {
        text,
      });
      setMessages((prev) =>
        prev.some((m) => m._id === data.message._id) ? prev : [...prev, data.message]
      );
      setConversation(data.conversation);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Send failed');
      setInput(text);
    }
  };

  const uploadImage = async (file) => {
    if (!file || !selectedId) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post(`/support/admin/conversations/${selectedId}/images`, fd);
      setMessages((prev) =>
        prev.some((m) => m._id === data.message._id) ? prev : [...prev, data.message]
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateStatus = async (status) => {
    if (!selectedId) return;
    try {
      const { data } = await api.patch(`/support/admin/conversations/${selectedId}`, { status });
      setConversation(data.conversation);
      if (data.messages) setMessages(data.messages);
      setConversations((list) =>
        list.map((c) => (c._id === selectedId ? { ...c, ...data.conversation } : c))
      );
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error('Update failed');
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Support | Jannat Rugs Co.</title>
      </Helmet>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-180px)] min-h-[520px] flex flex-col lg:flex-row">
        {/* Inbox list */}
        <aside className="w-full lg:w-[340px] border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col shrink-0 max-h-[40vh] lg:max-h-none">
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#1A1A1A]">Support Inbox</h2>
                <p className="text-[11px] text-gray-400">
                  {unreadTotal > 0 ? `${unreadTotal} unread` : 'All caught up'}
                </p>
              </div>
              <span className="w-9 h-9 rounded-xl bg-[#FFF8E8] text-[#B69640] flex items-center justify-center">
                <FiMessageSquare size={16} />
              </span>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats…"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {['all', 'open', 'pending', 'resolved', 'closed'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize shrink-0 cursor-pointer ${
                    statusFilter === s
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingList ? (
              <p className="text-center text-gray-400 text-sm py-10">Loading…</p>
            ) : conversations.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">No conversations yet</p>
            ) : (
              conversations.map((c) => {
                const active = String(selectedId) === String(c._id);
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => openConversation(c._id)}
                    className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-colors cursor-pointer ${
                      active ? 'bg-[#FAF7F2]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                          {c.customer?.name || 'Guest'}
                        </p>
                        <p className="text-[12px] text-gray-500 truncate mt-0.5">
                          {c.lastMessage || 'No messages'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-gray-400">
                          {formatTime(c.lastMessageAt).split(',').pop()?.trim()}
                        </span>
                        {c.unreadAdmin > 0 && (
                          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#C9A84C] text-[#1A1A1A] text-[10px] font-bold flex items-center justify-center">
                            {c.unreadAdmin}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                          STATUS_BADGE[c.status] || STATUS_BADGE.open
                        }`}
                      >
                        {c.status}
                      </span>
                      {c.isOfflineRequest && (
                        <span className="text-[10px] text-amber-600 font-medium">Offline</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat pane */}
        <section className="flex-1 flex flex-col min-w-0 min-h-0">
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 p-8">
              <FiMessageSquare size={36} className="text-[#C9A84C]/50" />
              <p className="text-sm font-medium text-gray-500">Select a conversation</p>
              <p className="text-xs text-center max-w-xs">
                Reply to customers in real time. New messages appear instantly.
              </p>
            </div>
          ) : loadingChat ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Loading conversation…
            </div>
          ) : (
            <>
              <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div className="min-w-0 text-left">
                  <h3 className="font-bold text-[#1A1A1A] truncate">
                    {conversation?.customer?.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 truncate">
                    {conversation?.customer?.email}
                    {conversation?.customer?.phone ? ` · ${conversation.customer.phone}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => updateStatus('resolved')}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-emerald-200 text-emerald-700 text-xs font-medium hover:bg-emerald-50 cursor-pointer"
                  >
                    <FiCheckCircle size={14} />
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus('closed')}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 cursor-pointer"
                  >
                    <FiXCircle size={14} />
                    Close
                  </button>
                  {conversation?.status === 'closed' || conversation?.status === 'resolved' ? (
                    <button
                      type="button"
                      onClick={() => updateStatus('open')}
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1A1A1A] text-white text-xs font-medium cursor-pointer"
                    >
                      Reopen
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 flex min-h-0">
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAFAFA]">
                    {messages.map((m) => {
                      if (m.sender === 'system') {
                        return (
                          <div key={m._id} className="flex justify-center">
                            <span className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
                              {m.text}
                            </span>
                          </div>
                        );
                      }
                      const mine = m.sender === 'agent';
                      return (
                        <div
                          key={m._id}
                          className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-left shadow-sm ${
                              mine
                                ? 'bg-[#1A1A1A] text-white rounded-br-md'
                                : 'bg-white border border-gray-100 text-[#1A1A1A] rounded-bl-md'
                            }`}
                          >
                            {!mine && (
                              <p className="text-[10px] font-semibold text-[#B69640] mb-1">
                                {m.senderName || 'Customer'}
                              </p>
                            )}
                            {m.image && (
                              <a href={m.image} target="_blank" rel="noreferrer" className="block mb-1.5">
                                <img
                                  src={m.image}
                                  alt=""
                                  className="rounded-xl max-h-48 object-cover"
                                />
                              </a>
                            )}
                            {m.text && (
                              <p className="text-[13px] whitespace-pre-wrap break-words">{m.text}</p>
                            )}
                            <p
                              className={`text-[9px] mt-1 ${
                                mine ? 'text-white/40 text-right' : 'text-gray-400'
                              }`}
                            >
                              {formatTime(m.createdAt)}
                              {mine ? (m.seenByCustomer ? ' · Seen' : ' · Sent') : ''}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {customerTyping && (
                      <p className="text-[11px] text-gray-400 italic">Customer is typing…</p>
                    )}
                    <div ref={endRef} />
                  </div>

                  <div className="p-3 border-t border-gray-100 bg-white relative shrink-0">
                    {showEmoji && (
                      <div className="absolute bottom-full left-3 mb-2 p-2 rounded-xl bg-white border border-gray-200 shadow-lg grid grid-cols-8 gap-1">
                        {EMOJIS.map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => {
                              setInput((v) => v + em);
                              setShowEmoji(false);
                            }}
                            className="text-lg hover:bg-gray-50 rounded p-1 cursor-pointer"
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
                        className="w-10 h-10 rounded-xl border border-gray-200 text-gray-400 hover:text-[#C9A84C] flex items-center justify-center cursor-pointer"
                      >
                        <FiSmile size={18} />
                      </button>
                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => fileRef.current?.click()}
                        className="w-10 h-10 rounded-xl border border-gray-200 text-gray-400 hover:text-[#C9A84C] flex items-center justify-center cursor-pointer disabled:opacity-40"
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
                        onChange={handleInput}
                        onKeyDown={onKeyDown}
                        placeholder={`Reply as ${user?.name?.split(' ')[0] || 'Support'}…`}
                        className="flex-1 min-h-[40px] max-h-28 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#C9A84C] resize-none"
                      />
                      <button
                        type="button"
                        onClick={() => sendMessage()}
                        disabled={!input.trim()}
                        className="w-10 h-10 rounded-xl bg-[#C9A84C] text-[#1A1A1A] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                      >
                        <FiSend size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer details */}
                <aside className="hidden xl:flex w-[240px] border-l border-gray-100 flex-col p-4 gap-4 bg-white shrink-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Customer details
                  </p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2.5">
                      <FiUser className="text-[#C9A84C] mt-0.5 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-gray-400">Name</p>
                        <p className="font-medium text-[#1A1A1A]">
                          {conversation?.customer?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <FiMail className="text-[#C9A84C] mt-0.5 shrink-0" size={15} />
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400">Email</p>
                        <p className="font-medium text-[#1A1A1A] break-all">
                          {conversation?.customer?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <FiPhone className="text-[#C9A84C] mt-0.5 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-gray-400">Phone</p>
                        <p className="font-medium text-[#1A1A1A]">
                          {conversation?.customer?.phone || '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <FiClock className="text-[#C9A84C] mt-0.5 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-gray-400">Started</p>
                        <p className="font-medium text-[#1A1A1A]">
                          {formatTime(conversation?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {conversation?.quickTopic && (
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#C9A84C]/20">
                      <p className="text-[10px] text-gray-400 mb-1">Topic</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {conversation.quickTopic}
                      </p>
                    </div>
                  )}
                </aside>
              </div>
            </>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
