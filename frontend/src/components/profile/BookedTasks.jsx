import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Search, 
  Filter, ChevronRight, CheckCircle, 
  AlertCircle, Timer, MoreHorizontal, Inbox
} from 'lucide-react';

const MyBookedTasks = () => {
  const { userData } = useOutletContext();

  // Refined Color mapping for status
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' };
      case 'in progress':
        return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', dot: 'bg-blue-500' };
      case 'pending':
        return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500' };
      default:
        return { text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100', dot: 'bg-teal-500' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      
      {/* 1. Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your service history.</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by task name..." 
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-teal-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-teal-600 hover:border-teal-100 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* 2. Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat label="Total Bookings" count={userData?.bookedTasks?.length || 0} color="text-slate-900" />
        <QuickStat label="In Progress" count="2" color="text-blue-600" />
        <QuickStat label="Upcoming" count="1" color="text-teal-600" />
        <QuickStat label="Completed" count="12" color="text-emerald-600" />
      </div>

      {/* 3. Tasks List */}
      <div className="space-y-4">
        {userData?.bookedTasks?.length > 0 ? (
          userData.bookedTasks.map((task, i) => {
            const styles = getStatusStyles(task.status || 'scheduled');
            return (
              <div 
                key={i} 
                className="group bg-white border border-gray-100 rounded-[2rem] p-6 transition-all hover:shadow-md hover:shadow-gray-200/50 relative overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* Left: Task Core Info */}
                  <div className="flex gap-5">
                    <div className={`h-16 w-16 ${styles.bg} rounded-2xl flex items-center justify-center ${styles.text} flex-shrink-0`}>
                      {task.status === 'Completed' ? <CheckCircle size={28} /> : <Timer size={28} />}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${styles.bg} ${styles.border} ${styles.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
                          {task.status || 'Scheduled'}
                        </span>
                        <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                          <AlertCircle size={12} /> Priority: Medium
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {task.title || "General Maintenance"}
                      </h3>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                        <TaskMeta icon={<Calendar size={14}/>} value="Oct 24, 2026" />
                        <TaskMeta icon={<Clock size={14}/>} value="14:00 - 16:00" />
                        <TaskMeta icon={<MapPin size={14}/>} value="Main Blvd, Lahore" />
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing & Actions */}
                  <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end gap-4 border-t lg:border-t-0 border-gray-50 pt-4 lg:pt-0">
                    <div className="lg:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Paid</p>
                      <p className="text-xl font-black text-slate-900 tracking-tight">Rs. {task.price || '2,500'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-5 py-2.5 bg-gray-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-teal-50 hover:text-teal-700 transition-all border border-gray-100">
                        View Details
                      </button>
                      <button className="p-2.5 bg-white border border-gray-200 text-gray-400 rounded-xl hover:text-slate-900 transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="mb-4 inline-flex p-5 bg-teal-50 rounded-3xl text-teal-600">
              <Inbox size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No bookings yet</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">When you book a professional service, it will appear here for you to track.</p>
            <button className="mt-6 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100">
              Find a Professional
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const QuickStat = ({ label, count, color }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <span className={`text-2xl font-black ${color}`}>{count}</span>
  </div>
);

const TaskMeta = ({ icon, value }) => (
  <div className="flex items-center gap-2">
    <div className="text-teal-600 opacity-60">{icon}</div>
    <p className="text-xs font-medium text-gray-500">{value}</p>
  </div>
);

export default MyBookedTasks;