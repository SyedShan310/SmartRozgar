import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Send, Paperclip, MoreVertical, Search, ArrowLeft, 
  CheckCheck, Smile, Phone, Video, ShieldCheck
} from 'lucide-react';

const ChatPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef();

  // 1. INITIAL MOCK DATA
  const [conversations, setConversations] = useState([
    {
      id: 1,
      fullName: "Ahmad Hassan",
      image: "https://i.pravatar.cc/150?u=ahmad",
      status: "Online",
      role: "Plumbing Expert",
      messages: [
        { id: 101, sender: 'tasker', text: "I can be there by 4:00 PM.", time: "10:00 AM" },
        { id: 102, sender: 'user', text: "That works for me, Ahmad! Please bring the pipe connectors.", time: "10:05 AM" },
      ]
    },
    {
      id: 4,
      fullName: "Kamran Siddiqui",
      image: "https://i.pravatar.cc/150?u=kamran",
      status: "Online",
      role: "Electrician",
      messages: [
        { id: 401, sender: 'tasker', text: "I've reviewed your request for the kitchen fitting.", time: "09:30 AM" }
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState(state?.tasker?.id || 1);

  useEffect(() => {
    if (state?.tasker) {
      const exists = conversations.find(c => c.id === state.tasker.id);
      if (!exists) {
        const newConversation = {
          id: state.tasker.id,
          fullName: state.tasker.fullName,
          image: state.tasker.image,
          status: "Online",
          role: "Service Provider",
          messages: [{ 
            id: Date.now(), 
            sender: 'tasker', 
            text: `Hi! I'm ${state.tasker.fullName}. How can I help you today?`, 
            time: "Just now" 
          }]
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveChatId(state.tasker.id);
      } else {
        setActiveChatId(state.tasker.id);
      }
    }
  }, [state]);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(chat => {
        if(chat.id === activeChatId) {
            return { ...chat, messages: [...chat.messages, newMessage] };
        }
        return chat;
    }));
    setMessage("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, conversations]);

  const filteredChats = conversations.filter(c => 
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 flex overflow-hidden fixed inset-0">
      
      {/* SIDEBAR */}
      <div className="hidden lg:flex w-[380px] border-r border-gray-200 flex-col bg-white">
        <div className="p-6 space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-teal-600 text-xs font-bold transition-all">
                <ArrowLeft size={16}/> Back to Dashboard
            </button>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h2>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-teal-500 outline-none transition-all" 
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
            {filteredChats.map((chat) => (
                <div 
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all mb-1
                        ${activeChatId === chat.id ? 'bg-teal-50' : 'bg-transparent hover:bg-slate-50'}`}
                >
                    <div className="relative">
                      <img src={chat.image} className="w-12 h-12 rounded-xl object-cover" alt="avatar" />
                      {chat.status === "Online" && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-0.5">
                          <h5 className={`text-sm font-bold truncate ${activeChatId === chat.id ? 'text-teal-700' : 'text-slate-900'}`}>{chat.fullName}</h5>
                          <span className="text-[10px] text-gray-400 font-medium">10:05 AM</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate font-medium">
                          {chat.messages[chat.messages.length - 1]?.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col h-full bg-white lg:bg-slate-50">
        
        {/* Header */}
        <div className="h-20 shrink-0 border-b border-gray-200 lg:border-none bg-white lg:bg-transparent flex items-center justify-between px-8 z-10">
            <div className="flex items-center gap-4">
                <img src={activeChat.image} className="w-11 h-11 rounded-xl object-cover shadow-sm" />
                <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{activeChat.fullName}</h4>
                      <ShieldCheck size={16} className="text-teal-500" />
                    </div>
                    <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">{activeChat.role}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
                <button className="p-2.5 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-all border border-transparent hover:border-teal-100">
                  <Phone size={20} />
                </button>
                <button className="p-2.5 hover:bg-teal-50 hover:text-teal-600 rounded-xl transition-all border border-transparent hover:border-teal-100">
                  <Video size={20} />
                </button>
                <button className="p-2.5 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all">
                  <MoreVertical size={20} />
                </button>
            </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 custom-scrollbar bg-white lg:m-4 lg:rounded-[2.5rem] lg:shadow-inner border border-gray-100">
            {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] lg:max-w-[60%] space-y-1`}>
                        <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm
                            ${msg.sender === 'user' 
                                ? 'bg-teal-600 text-white rounded-tr-none' 
                                : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                            {msg.text}
                        </div>
                        <div className={`flex items-center gap-1.5 px-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] font-bold text-slate-300 uppercase">{msg.time}</span>
                            {msg.sender === 'user' && <CheckCheck size={14} className="text-teal-500"/>}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <div className="p-6 shrink-0 bg-white lg:bg-transparent">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end gap-3 bg-white border border-gray-200 p-2 rounded-2xl shadow-sm focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-50 transition-all">
                <button type="button" className="p-3 text-slate-400 hover:text-teal-600 transition-colors"><Paperclip size={20}/></button>
                
                <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                    placeholder={`Write your message...`} 
                    rows={1}
                    className="flex-1 bg-transparent border-none py-3 px-1 text-sm font-medium outline-none placeholder:text-slate-300 resize-none max-h-32 custom-scrollbar overflow-y-auto"
                />

                <button 
                  type="submit" 
                  disabled={!message.trim()} 
                  className={`p-3.5 rounded-xl transition-all shrink-0 
                    ${message.trim() ? 'bg-teal-600 text-white shadow-lg shadow-teal-100 hover:bg-teal-700' : 'bg-slate-100 text-slate-300'}`}
                >
                    <Send size={18} />
                </button>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">Messages are end-to-end encrypted with SmartRozgar Security</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
};

export default ChatPage;