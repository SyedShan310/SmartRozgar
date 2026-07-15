import React from 'react';
import { 
  DollarSign, CheckCircle, Star, Heart, TrendingUp, Clock4, 
  MapPin, ChevronRight, Bell, Calendar, MessageSquare, 
  CreditCard, Zap, Award
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const CURRENT_EARNINGS = 2840;
const WEEKLY_GOAL = 3000;
const PROGRESS_PERCENT = Math.round((CURRENT_EARNINGS / WEEKLY_GOAL) * 100);

// Professional Light-Mode Tooltip
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl text-xs">
        <p className="font-black text-slate-800 mb-1 uppercase tracking-tighter">{label}</p>
        {payload.map((p, index) => (
          <p key={index} style={{ color: p.color }} className="text-sm font-bold">
            {`${p.dataKey === 'amount' ? 'Earning' : 'Hours'}: ${p.value}${unit || ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TaskerDashboard = () => {
  // Define stats with specific border/icon colors
  const stats = [
    { label: 'Total Earnings', value: `PKR ${CURRENT_EARNINGS}`, change: '+12.5%', trend: 'up', icon: DollarSign, color: '#0D9488' }, // Teal
    { label: 'Completed Tasks', value: '47', change: '+8 new', trend: 'up', icon: CheckCircle, color: '#3b82f6' }, // Blue
    { label: 'Average Rating', value: '4.92', change: '156 reviews', trend: 'stable', icon: Star, color: '#f59e0b' }, // Yellow/Orange
    { label: 'Client Satisfaction', value: '98%', change: 'High', trend: 'up', icon: Heart, color: '#ef4444' }, // Red/Rose
  ];

  const upcomingTasks = [
    { id: 1, title: 'Residential Deep Cleaning', client: 'Sarah Johnson', location: 'Gulberg III, Lahore', time: 'Today • 2:00 PM', payment: '4,500', status: 'High Priority', color: '#ef4444' },
    { id: 2, title: 'Garden Maintenance', client: 'Michael Peterson', location: 'DHA Phase 6, Lahore', time: 'Tomorrow • 9:00 AM', payment: '3,200', status: 'Medium', color: '#f59e0b' },
    { id: 3, title: 'Pet Care Service', client: 'Emily Davis', location: 'Model Town, Lahore', time: 'Dec 15 • 4:00 PM', payment: '1,500', status: 'Scheduled', color: '#0D9488' },
  ];

  const recentActivity = [
    { task: 'Cleaning Service Completed', amount: '+2,500', time: '2 hours ago', icon: CheckCircle, color: '#0D9488' },
    { task: 'New Task Request Received', amount: '1,800', time: '5 hours ago', icon: Bell, color: '#f59e0b' },
    { task: 'Payment Processed', amount: '+4,200', time: '1 day ago', icon: DollarSign, color: '#0D9488' },
  ];

  const weeklyData = [
    { day: 'Mon', amount: 420, hours: 6.5 }, { day: 'Tue', amount: 350, hours: 5.5 }, { day: 'Wed', amount: 580, hours: 8 },
    { day: 'Thu', amount: 290, hours: 4.5 }, { day: 'Fri', amount: 510, hours: 7 }, { day: 'Sat', amount: 390, hours: 5.5 }, { day: 'Sun', amount: 300, hours: 4 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. TOP STATS CARDS WITH COLOR OUTLINES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-6 border-x border-b border-slate-100 shadow-sm hover:shadow-md transition-all border-t-4"
            style={{ borderTopColor: stat.color }}
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="p-3 rounded-xl transition-colors"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div 
                className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider"
                style={{ color: stat.color, backgroundColor: `${stat.color}10` }}
              >
                {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />} {stat.change}
              </div>
            </div>
            <div className="text-2xl font-black text-slate-800 mb-1">{stat.value}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 2. WEEKLY GOAL */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Weekly Revenue Goal</h2>
                <p className="text-xs text-slate-400 font-medium mt-1">Goal: PKR {WEEKLY_GOAL}</p>
              </div>
              <span className="text-[#0D9488] font-black text-xl">{PROGRESS_PERCENT}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#0D9488] transition-all duration-1000 shadow-[0_0_12px_rgba(13,148,136,0.2)]" style={{ width: `${PROGRESS_PERCENT}%` }}></div>
            </div>
          </div>

          {/* 3. CHARTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 italic">Income Trends</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip unit='' />} />
                    <Bar dataKey="amount" fill="#0D9488" radius={[6, 6, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 italic">Hours Logged</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D9488" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} />
                    <Tooltip content={<CustomTooltip unit='h' />} />
                    <Area type="monotone" dataKey="hours" stroke="#0D9488" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 4. UPCOMING TASKS */}
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-6 px-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Active Operations</h2>
              <button className="text-[#0D9488] font-black text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline">
                Full Schedule <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-6 px-8 hover:bg-slate-50/80 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm group-hover:border-teal-200">
                        <Clock4 className="w-4 h-4 text-[#0D9488] mb-1" />
                        <span className='text-[10px] font-black text-slate-800'>{task.time.split('•')[1]}</span>
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 group-hover:text-[#0D9488] transition-colors">{task.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-bold italic"><MapPin className="w-3 h-3" /> {task.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-lg font-black text-slate-800">PKR {task.payment}</div>
                      <span 
                        className="text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border"
                        style={{ color: task.color, borderColor: `${task.color}30`, backgroundColor: `${task.color}05` }}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* 5. QUICK ACTIONS */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Control Panel</h3>
            <div className="grid grid-cols-2 gap-4">
              {[ 
                {icon: Calendar, label: 'Schedule', color: 'text-teal-600', bg: 'bg-teal-50'}, 
                {icon: MessageSquare, label: 'Chat', color: 'text-blue-600', bg: 'bg-blue-50'}, 
                {icon: CreditCard, label: 'Wallet', color: 'text-purple-600', bg: 'bg-purple-50'}, 
                {icon: Zap, label: 'Tasks', color: 'text-amber-600', bg: 'bg-amber-50'} 
              ].map((action, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5 transition-all group">
                  <div className={`p-3 ${action.bg} rounded-xl mb-2 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. LIVE FEED */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Activity Stream</h3>
            <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 relative z-10">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-sm">
                    <activity.icon className="w-3.5 h-3.5" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-800 leading-tight">{activity.task}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activity.time}</p>
                      <span className="text-[10px] font-black text-teal-600">{activity.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. PRO CARD */}
          <div className="bg-[#0D9488] rounded-[2rem] p-8 text-white shadow-xl shadow-teal-900/20 relative overflow-hidden group transition-all hover:scale-[1.02]">
            <Award className="w-12 h-12 text-teal-200 mb-4 opacity-80" />
            <h3 className="text-xl font-black mb-2 leading-tight">Elite Tasker Rewards</h3>
            <p className="text-xs text-teal-50 font-medium mb-6 leading-relaxed opacity-90">
              You've maintained a 4.9 rating for 3 months. Exclusive high-paying tasks are now unlocked.
            </p>
            <button className="w-full bg-white text-[#0D9488] font-black py-3 rounded-xl transition-all text-[10px] uppercase tracking-widest hover:bg-teal-50">
              View Benefits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskerDashboard;