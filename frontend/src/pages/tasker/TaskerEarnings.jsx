import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Download, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';

const TaskerEarnings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/taskers/stats/me')
      .then((res) => { if (res.data.success) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-32"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  const stats = data?.stats || {};
  const transactions = (data?.recentActivity || []).map((a, i) => ({
    id: i,
    title: a.title,
    amount: a.amount,
    status: a.status,
    date: new Date(a.date).toLocaleDateString(),
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Earnings</h1>
          <p className="text-slate-400 text-sm mt-1">Track your income and payouts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Earnings', value: `PKR ${(stats.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, color: '#0D9488' },
          { label: 'This Week', value: `PKR ${(stats.weeklyEarnings || 0).toLocaleString()}`, icon: TrendingUp, color: '#3b82f6' },
          { label: 'Jobs Done', value: stats.completedCount || 0, icon: Download, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm border-t-4" style={{ borderTopColor: s.color }}>
            <s.icon size={20} style={{ color: s.color }} className="mb-3" />
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b"><h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Recent Activity</h3></div>
        {transactions.length === 0 ? (
          <p className="text-center py-12 text-slate-400 text-sm">No earnings yet — complete jobs to get paid!</p>
        ) : transactions.map((tx) => (
          <div key={tx.id} className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
            <div>
              <p className="text-sm font-bold text-slate-800">{tx.title}</p>
              <p className="text-[10px] text-slate-400">{tx.date} · {tx.status}</p>
            </div>
            <p className="font-black text-teal-600">+PKR {tx.amount?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskerEarnings;
