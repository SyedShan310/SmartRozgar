import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, ListChecks, Shield, ChevronRight, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/admin/stats')
      .then((res) => { if (res.data.success) setStats(res.data.stats); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  const adminStats = [
    { label: 'Total Revenue', value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: '#0D9488' },
    { label: 'Hirers', value: stats?.hirers || 0, icon: Users, color: '#3b82f6' },
    { label: 'Jobs Completed', value: stats?.completedJobs || 0, icon: ListChecks, color: '#f59e0b' },
    { label: 'Pending Taskers', value: stats?.pendingTaskers || 0, icon: Shield, color: '#ef4444' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm" style={{ borderBottom: `4px solid ${stat.color}` }}>
            <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${stat.color}10` }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div className="text-2xl font-black text-slate-800 mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Platform Overview</h2>
          <div className="space-y-4">
            {[
              { label: 'Approved Taskers', value: stats?.taskers || 0 },
              { label: 'Total Jobs', value: stats?.totalJobs || 0 },
              { label: 'Completed Jobs', value: stats?.completedJobs || 0 },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-sm font-bold text-slate-500">{row.label}</span>
                <span className="text-lg font-black text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => navigate('/tasker-review')} className="w-full bg-[#0D9488] hover:bg-teal-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between px-4">
              Review Pending Taskers ({stats?.pendingTaskers || 0}) <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate('/user-management')} className="w-full bg-slate-50 text-slate-600 border border-slate-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between px-4 hover:bg-slate-100">
              Manage Users <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
