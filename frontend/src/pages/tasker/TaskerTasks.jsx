import React, { useState, useEffect } from 'react';
import {
  Clock, MapPin, User, CheckCircle2, Briefcase,
  Calendar, Filter, Loader2, XCircle, Play
} from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import JobTracker from '../../components/common/JobTracker';
import JobComments from '../../components/common/JobComments';

const STATUS_MAP = {
  Active:    ['accepted', 'in-progress'],
  Pending:   ['pending'],
  Completed: ['completed'],
};

const STATUS_COLORS = {
  pending:     '#f59e0b',
  accepted:    '#0D9488',
  'in-progress':'#3b82f6',
  completed:   '#10b981',
  cancelled:   '#ef4444',
};

const TaskerTasks = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Pending');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get('/jobs/tasker');
      if (res.data.success) setJobs(res.data.jobs);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleAction = async (jobId, action) => {
    setActionId(jobId);
    try {
      let res;
      if (action === 'accept')  res = await axiosInstance.patch(`/jobs/${jobId}/accept`);
      if (action === 'reject')  res = await axiosInstance.patch(`/jobs/${jobId}/reject`);
      if (action === 'start')   res = await axiosInstance.patch(`/jobs/${jobId}/status`, { status: 'in-progress' });
      if (action === 'complete') res = await axiosInstance.patch(`/jobs/${jobId}/status`, { status: 'completed' });
      if (res?.data?.success) {
        toast.success(res.data.message);
        fetchJobs();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const filtered = jobs.filter((j) => {
    if (activeTab === 'All') return true;
    return STATUS_MAP[activeTab]?.includes(j.status);
  });

  if (loading) return (
    <div className="flex justify-center py-32"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-[#0D9488]" />
            <span className="text-[10px] font-black text-[#0D9488] uppercase tracking-[0.2em]">My Jobs</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800">Task Management</h1>
          <p className="text-slate-400 text-sm mt-1 font-bold">Direct bookings and assigned jobs</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {['Pending', 'Active', 'Completed'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#0D9488] text-white shadow-lg' : 'text-slate-500'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.length > 0 ? filtered.map((job) => {
          const color = STATUS_COLORS[job.status] || '#0D9488';
          const client = job.hirer?.fullName || 'Client';
          const location = [job.address?.city, job.address?.pincode].filter(Boolean).join(', ');
          return (
            <div key={job._id} className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl transition-all border-t-4" style={{ borderTopColor: color }}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center border border-slate-100">
                    <Calendar className="w-7 h-7 text-[#0D9488]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-slate-800">{job.title}</h3>
                      <span className="px-3 py-1 text-[9px] font-black uppercase rounded-full border" style={{ color, borderColor: `${color}30`, backgroundColor: `${color}08` }}>
                        {job.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400 font-black uppercase">
                      <div className="flex items-center gap-2 text-slate-600"><User size={14} className="text-[#0D9488]" /> {client}</div>
                      <div className="flex items-center gap-2"><MapPin size={14} className="text-[#0D9488]" /> {location}</div>
                      <div className="flex items-center gap-2"><Clock size={14} className="text-[#0D9488]" /> {new Date(job.date).toLocaleDateString()}</div>
                    </div>
                    {job.description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{job.description}</p>}
                    <div className="pt-2 max-w-md"><JobTracker job={job} compact /></div>
                    {job.tasker && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <JobComments
                          jobId={job._id}
                          jobStatus={job.status}
                          hasTasker={!!job.tasker}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-800">PKR {job.price?.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black">Payout</div>
                  </div>
                  <div className="flex gap-2">
                    {job.status === 'pending' && job.jobType === 'direct' && (job.tasker?._id || job.tasker)?.toString() === user?.id && (
                      <>
                        <button onClick={() => handleAction(job._id, 'accept')} disabled={actionId === job._id} className="flex items-center gap-2 px-4 py-3 bg-teal-600 text-white font-black text-[10px] uppercase rounded-xl disabled:opacity-50">
                          {actionId === job._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Accept
                        </button>
                        <button onClick={() => handleAction(job._id, 'reject')} disabled={actionId === job._id} className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-black text-[10px] uppercase rounded-xl border border-red-100">
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}
                    {job.status === 'accepted' && (
                      <button onClick={() => handleAction(job._id, 'start')} disabled={actionId === job._id} className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white font-black text-[10px] uppercase rounded-xl">
                        <Play size={14} /> Start Job
                      </button>
                    )}
                    {job.status === 'in-progress' && (
                      <button onClick={() => handleAction(job._id, 'complete')} disabled={actionId === job._id} className="flex items-center gap-2 px-6 py-3 bg-[#0D9488] text-white font-black text-[10px] uppercase rounded-xl">
                        <CheckCircle2 size={16} /> Mark Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
            <Filter className="w-6 h-6 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800">No {activeTab} Tasks</h3>
            <p className="text-sm text-slate-400 mt-1">Check Job Requests for public jobs to apply to.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskerTasks;
