import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnread(res.data.unreadCount);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    await axiosInstance.patch('/notifications/read-all');
    fetchNotifications();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 hover:bg-slate-50 rounded-lg transition-colors"
      >
        <Bell size={18} className="text-slate-400 hover:text-teal-600" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-bold text-teal-600 flex items-center gap-1">
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-teal-600" size={20} /></div>
            ) : notifications.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400 font-bold">No notifications yet</p>
            ) : notifications.map((n) => (
              <div key={n._id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 ${!n.isRead ? 'bg-teal-50/30' : ''}`}>
                <p className="text-xs font-black text-slate-800">{n.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-[9px] text-slate-400 font-bold mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
