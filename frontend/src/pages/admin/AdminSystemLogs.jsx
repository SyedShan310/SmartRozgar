import React, { useEffect, useState } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';

const AdminSystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/admin/stats')
      .then(async () => {
        const [usersRes] = await Promise.all([axiosInstance.get('/admin/users')]);
        const entries = [];
        if (usersRes.data.success) {
          usersRes.data.hirers?.slice(0, 5).forEach((u) => entries.push({
            type: 'user', message: `New hirer registered: ${u.fullName}`, date: u.createdAt,
          }));
          usersRes.data.taskers?.slice(0, 5).forEach((u) => entries.push({
            type: 'tasker', message: `${u.fullName} joined as tasker (${u.isApproved ? 'approved' : 'pending'})`, date: u.createdAt,
          }));
        }
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(entries);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">System Activity</h1>
        <p className="text-sm text-slate-500 mt-1">Recent platform events and registrations</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {logs.length === 0 ? (
          <p className="text-center py-12 text-slate-400 text-sm">No activity yet</p>
        ) : logs.map((log, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50">
            <div className="p-2 bg-teal-50 rounded-lg"><Activity size={16} className="text-teal-600" /></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">{log.message}</p>
              <p className="text-[10px] text-slate-400">{new Date(log.date).toLocaleString()}</p>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-slate-100 text-slate-500">{log.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSystemLogs;
