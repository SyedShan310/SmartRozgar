import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2, Loader2, Send } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await axiosInstance.get('/support');
      if (res.data.success) {
        setTickets(res.data.tickets);
        if (res.data.tickets.length > 0 && !selected) setSelected(res.data.tickets[0]);
      }
    } catch { toast.error('Failed to load tickets'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, []);

  const updateTicket = async (id, updates) => {
    try {
      const res = await axiosInstance.patch(`/support/${id}`, updates);
      if (res.data.success) {
        toast.success('Ticket updated');
        fetchTickets();
        setSelected(res.data.ticket);
        setReply('');
      }
    } catch { toast.error('Update failed'); }
  };

  const filtered = tickets.filter((t) =>
    t.subject?.toLowerCase().includes(search.toLowerCase()) ||
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const priorityColor = { urgent: 'text-red-600 bg-red-50', high: 'text-orange-600 bg-orange-50', medium: 'text-blue-600 bg-blue-50', low: 'text-slate-500 bg-slate-50' };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Support Center</h1>
        <p className="text-sm text-slate-500 mt-1">{tickets.filter((t) => t.status === 'open').length} open tickets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-500" />
          </div>
          {filtered.map((t) => (
            <button key={t._id} onClick={() => setSelected(t)} className={`w-full text-left bg-white border rounded-2xl p-4 transition-all ${selected?._id === t._id ? 'border-teal-500 shadow-md' : 'border-slate-200 hover:border-teal-200'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-slate-400">{t.ticketId}</span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${priorityColor[t.priority] || priorityColor.medium}`}>{t.priority}</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{t.subject}</p>
              <p className="text-[10px] text-slate-400 mt-1">{t.name} · {new Date(t.createdAt).toLocaleDateString()}</p>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-center py-8 text-sm text-slate-400">No tickets</p>}
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {selected ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black text-slate-800">{selected.subject}</h2>
                  <p className="text-xs text-slate-400">{selected.name} · {selected.email} · {selected.userRole}</p>
                </div>
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-lg bg-slate-100 text-slate-600">{selected.status}</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">{selected.message}</div>
              {selected.adminReply && (
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-800">
                  <p className="text-[10px] font-black uppercase mb-1">Admin Reply</p>
                  {selected.adminReply}
                </div>
              )}
              <textarea rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply..." className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-500" />
              <div className="flex gap-2">
                <button onClick={() => updateTicket(selected._id, { adminReply: reply, status: 'in-progress' })} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-[10px] font-black uppercase rounded-xl">
                  <Send size={12} /> Reply
                </button>
                <button onClick={() => updateTicket(selected._id, { status: 'resolved' })} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase rounded-xl">
                  <CheckCircle2 size={12} /> Resolve
                </button>
                <button onClick={() => updateTicket(selected._id, { status: 'closed' })} className="px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-xl">Close</button>
              </div>
            </div>
          ) : (
            <p className="text-center py-16 text-slate-400 text-sm">Select a ticket</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupportTickets;
