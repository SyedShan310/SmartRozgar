import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Search, ArrowLeft, CheckCheck, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activePartnerId, setActivePartnerId] = useState(state?.tasker?.id || null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();

  const fetchConversations = async () => {
    try {
      const res = await axiosInstance.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
        if (!activePartnerId && res.data.conversations.length > 0) {
          setActivePartnerId(res.data.conversations[0].partnerId);
        }
      }
    } catch {
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchThread = async (partnerId) => {
    if (!partnerId) return;
    try {
      const res = await axiosInstance.get(`/messages/thread/${partnerId}`);
      if (res.data.success) setMessages(res.data.messages);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => {
    if (state?.tasker?.id) setActivePartnerId(state.tasker.id);
  }, [state]);
  useEffect(() => { fetchThread(activePartnerId); }, [activePartnerId]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const activeConvo = conversations.find((c) => c.partnerId === activePartnerId);
  const partner = activeConvo?.partner || (state?.tasker ? {
    fullName: state.tasker.fullName,
    profilePicture: state.tasker.image,
  } : null);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!message.trim() || !activePartnerId) return;
    setSending(true);
    try {
      const res = await axiosInstance.post('/messages/send', {
        receiverId: activePartnerId,
        message: message.trim(),
      });
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setMessage('');
        fetchConversations();
      }
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filtered = conversations.filter((c) =>
    c.partner?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-teal-600" size={32} />
    </div>
  );

  return (
    <div className="h-[calc(100vh-5rem)] w-full bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-teal-600 text-xs font-black uppercase mb-3">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-teal-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">No conversations yet</p>
          ) : filtered.map((c) => (
            <button
              key={c.partnerId}
              onClick={() => setActivePartnerId(c.partnerId)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-all border-b border-slate-50 ${activePartnerId === c.partnerId ? 'bg-teal-50' : ''}`}
            >
              <img src={c.partner?.profilePicture || `https://ui-avatars.com/api/?name=${c.partner?.fullName}&background=0d9488&color=fff`} className="w-10 h-10 rounded-xl object-cover" alt="" />
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{c.partner?.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && <span className="w-5 h-5 bg-teal-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">{c.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activePartnerId && partner ? (
          <>
            <div className="px-6 py-4 bg-white border-b flex items-center gap-3">
              <img src={partner.profilePicture || `https://ui-avatars.com/api/?name=${partner.fullName}&background=0d9488&color=fff`} className="w-10 h-10 rounded-xl object-cover" alt="" />
              <div>
                <p className="font-bold text-slate-800">{partner.fullName}</p>
                <p className="text-[10px] text-teal-600 font-bold uppercase">Service Provider</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m) => {
                const isMine = m.senderId === user?.id || m.senderId?.toString() === user?.id;
                return (
                  <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${isMine ? 'bg-teal-600 text-white rounded-br-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'}`}>
                      {m.message}
                      <p className={`text-[9px] mt-1 ${isMine ? 'text-teal-100' : 'text-slate-400'}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMine && <CheckCheck size={10} className="inline ml-1" />}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500"
              />
              <button type="submit" disabled={sending || !message.trim()} className="px-5 py-3 bg-teal-600 text-white rounded-xl disabled:opacity-40">
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-bold">
            Select a conversation or message a tasker from their profile
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
