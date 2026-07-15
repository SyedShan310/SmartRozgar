import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, User as UserIcon, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';

const TaskerSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async (date) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/taskers/schedule/me?date=${date.toISOString()}`);
      if (res.data.success) setJobs(res.data.jobs);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSchedule(selectedDate); }, [selectedDate]);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - d.getDay() + i);
    return d;
  });

  const changeWeek = (dir) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir * 7);
    setSelectedDate(d);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2">
            <CalendarIcon size={14} /> {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <h1 className="text-2xl font-black text-slate-800 mt-1">Mission Schedule</h1>
        </div>
        <div className="flex bg-slate-50 rounded-xl border p-1">
          <button onClick={() => changeWeek(-1)} className="p-2 text-slate-400 hover:text-teal-600"><ChevronLeft size={18} /></button>
          <button onClick={() => setSelectedDate(new Date())} className="px-4 py-2 text-[10px] font-black uppercase">Today</button>
          <button onClick={() => changeWeek(1)} className="p-2 text-slate-400 hover:text-teal-600"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((d, i) => {
          const isActive = d.toDateString() === selectedDate.toDateString();
          return (
            <button key={i} onClick={() => setSelectedDate(d)} className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${isActive ? 'bg-teal-600 border-teal-600 text-white shadow-lg' : 'bg-white border-slate-100 hover:border-teal-200'}`}>
              <span className={`text-[10px] font-black uppercase ${isActive ? 'text-teal-100' : 'text-slate-400'}`}>{d.toLocaleString('default', { weekday: 'short' })}</span>
              <span className="text-xl font-black mt-1">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Clock size={16} className="text-teal-600" /> Daily Timeline
          </h2>
          <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase">{jobs.length} Jobs</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-teal-600" size={28} /></div>
        ) : jobs.length === 0 ? (
          <p className="text-center py-16 text-sm text-slate-400 font-bold">No jobs scheduled for this day</p>
        ) : (
          <div className="p-8 space-y-6">
            {jobs.map((job) => (
              <div key={job._id} className="flex gap-6 items-start border-l-4 border-teal-600 pl-6 py-2">
                <div className="text-[11px] font-black text-slate-600 w-20">
                  {new Date(job.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-black text-slate-800 text-sm">{job.title}</h4>
                  <div className="flex gap-4 mt-2 text-[10px] text-slate-400 font-bold uppercase">
                    <span className="flex items-center gap-1"><UserIcon size={12} className="text-teal-600" /> {job.hirer?.fullName}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-teal-600" /> {job.address?.city}</span>
                  </div>
                  <span className="inline-block mt-2 text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-teal-50 text-teal-600 border border-teal-100">{job.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskerSchedule;
