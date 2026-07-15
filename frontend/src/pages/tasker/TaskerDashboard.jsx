import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, CheckCircle, Star, Briefcase, MapPin, Clock, Loader2, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { axiosInstance } from '../../lib/axios';

const TaskerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/taskers/stats/me')
      .then((res) => { if (res.data.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-32"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  const stats = data?.stats || {};
  const statCards = [
    { label: 'Total Earnings', value: `PKR ${(stats.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, color: '#0D9488' },
    { label: 'Completed Jobs', value: stats.completedCount || 0, icon: CheckCircle, color: '#3b82f6' },
    { label: 'Active Jobs', value: stats.activeCount || 0, icon: Briefcase, color: '#f59e0b' },
    { label: 'Rating', value: stats.rating?.average?.toFixed(1) || '0.0', icon: Star, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm border-t-4" style={{ borderTopColor: s.color }}>
            <s.icon className="w-5 h-5 mb-3" style={{ color: s.color }} />
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Weekly Earnings</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.weeklyData || []}>
                <Area type="monotone" dataKey="amount" stroke="#0D9488" fill="#0D948820" strokeWidth={2} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Hours This Week</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.weeklyData || []}>
                <Bar dataKey="hours" fill="#0D9488" radius={[4, 4, 0, 0]} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Upcoming Jobs</h3>
          <button onClick={() => navigate('/tasks')} className="text-[10px] font-black text-teal-600 uppercase flex items-center gap-1">
            View All <ChevronRight size={14} />
          </button>
        </div>
        {(data?.upcoming || []).length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No upcoming jobs</p>
        ) : data.upcoming.map((job) => (
          <div key={job._id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
            <div>
              <p className="font-bold text-slate-800">{job.title}</p>
              <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase mt-1">
                <span className="flex items-center gap-1"><MapPin size={10} /> {job.address?.city}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {new Date(job.date).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="font-black text-teal-600">PKR {job.price?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskerDashboard;
