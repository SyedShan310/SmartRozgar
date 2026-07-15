import React, { useState, useEffect } from 'react';
import {
  Zap, Clock, MapPin, Star, Check, X,
  ShieldCheck, Info, Bell, Flame, Loader2,
  Users, Calendar, DollarSign, Inbox
} from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SERVICE_COLORS = {
  'Maid/Cleaning':   '#0D9488',
  'Cooking':         '#f59e0b',
  'Babysitting':     '#ec4899',
  'Elder Care':      '#8b5cf6',
  'Driver':          '#3b82f6',
  'Gardening':       '#22c55e',
  'Laundry':         '#0D9488',
  'Plumbing':        '#64748b',
  'Electrician':     '#ef4444',
  'General Maintenance & Repair': '#f97316',
};

const getColor = (service) => SERVICE_COLORS[service] || '#0D9488';

const TaskerRequests = () => {
  const { user }          = useAuth();
  const [jobs, setJobs]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [applying, setApplying] = useState(null); // jobId being processed

  // ── Fetch public jobs ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/public?taskerId=${user.id}`);
        if (res.data.success) setJobs(res.data.jobs);
      } catch (err) {
        toast.error('Failed to load job requests');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user?.id]);

  // ── Apply ──────────────────────────────────────────────────────────────
  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      const res = await axiosInstance.post(`/jobs/${jobId}/apply`, {
        taskerId: user.id
      });
      if (res.data.success) {
        toast.success('Application submitted!');
        // Mark as applied locally — no need to refetch
        setJobs(prev =>
          prev.map(j =>
            j._id === jobId
              ? { ...j, hasApplied: true, applications: [...(j.applications || []), { tasker: user.id }] }
              : j
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  // ── Withdraw ───────────────────────────────────────────────────────────
  const handleWithdraw = async (jobId) => {
    setApplying(jobId);
    try {
      const res = await axiosInstance.post(`/jobs/${jobId}/withdraw`, {
        taskerId: user.id
      });
      if (res.data.success) {
        toast.success('Application withdrawn');
        setJobs(prev =>
          prev.map(j =>
            j._id === jobId
              ? { ...j, hasApplied: false, applications: (j.applications || []).filter(a => a.tasker !== user.id) }
              : j
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw');
    } finally {
      setApplying(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <Loader2 className="animate-spin text-[#0D9488]" size={36} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Bell className="w-5 h-5 text-[#0D9488]" />
            </div>
            <span className="text-[10px] font-black text-[#0D9488] uppercase tracking-[0.2em]">
              Opportunity Feed
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Job Requests
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[11px] font-black text-white">
              {jobs.length}
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-bold italic">
            Public jobs posted by hirers — apply to get hired
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-teal-50/50 border border-teal-100 rounded-2xl">
          <ShieldCheck className="w-5 h-5 text-[#0D9488]" />
          <span className="text-[10px] font-black text-[#0D9488] uppercase tracking-widest leading-none">
            Verified Lead Protection Active
          </span>
        </div>
      </div>

      {/* JOB CARDS */}
      <div className="grid grid-cols-1 gap-6">
        {jobs.length > 0 ? jobs.map((job) => {
          const color       = getColor(job.service);
          const isApplying  = applying === job._id;
          const appliedCount = job.applications?.length || 0;
          const isNew       = (Date.now() - new Date(job.createdAt)) < 1000 * 60 * 60 * 24; // < 24hrs

          return (
            <div
              key={job._id}
              className="relative group bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 border-t-4"
              style={{ borderTopColor: color }}
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-10">

                  {/* LEFT: Job Info */}
                  <div className="flex-1 space-y-5">

                    {/* Title + badges */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-[#0D9488] transition-colors">
                        {job.title}
                      </h2>
                      {isNew && !job.hasApplied && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-rose-500 text-white text-[9px] font-black uppercase rounded-full tracking-tighter animate-pulse">
                          <Flame size={10} /> New
                        </span>
                      )}
                      {job.hasApplied && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 text-[9px] font-black uppercase rounded-full tracking-tighter">
                          <Check size={10} strokeWidth={3} /> Applied
                        </span>
                      )}
                      <span
                        className="px-3 py-1 text-[9px] font-black uppercase rounded-full border tracking-widest"
                        style={{ color, borderColor: `${color}30`, backgroundColor: `${color}08` }}
                      >
                        {job.service}
                      </span>
                    </div>

                    {/* Description */}
                    {job.description && (
                      <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    {/* Meta grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetaBox
                        icon={<MapPin size={14} className="text-[#0D9488]" />}
                        label="Location"
                        value={`${job.address?.city}, ${job.address?.pincode}`}
                      />
                      <MetaBox
                        icon={<Calendar size={14} className="text-[#0D9488]" />}
                        label="Date"
                        value={new Date(job.date).toDateString()}
                      />
                      <MetaBox
                        icon={<Clock size={14} className="text-[#0D9488]" />}
                        label="Duration"
                        value={`${job.hours} hr(s)`}
                      />
                      <MetaBox
                        icon={<Users size={14} className="text-[#0D9488]" />}
                        label="Applicants"
                        value={appliedCount}
                      />
                    </div>

                    {/* Hirer info */}
                    {job.hirer && (
                      <div className="flex items-center gap-3 pt-1">
                        <img
                          src={job.hirer.profilePicture || `https://ui-avatars.com/api/?name=${job.hirer.fullName}&background=0d9488&color=fff`}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-100"
                          alt={job.hirer.fullName}
                        />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Posted by</p>
                          <p className="text-sm font-black text-slate-700">{job.hirer.fullName}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Price + Actions */}
                  <div className="lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-10">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Budget</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-slate-400 font-black">PKR</span>
                        <span className="text-4xl font-black text-slate-800 tracking-tighter">
                          {job.price?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#0D9488] font-black mt-2 uppercase flex items-center gap-1.5 tracking-[0.1em]">
                        <Zap size={12} fill="currentColor" /> Instant Payout Verified
                      </p>
                    </div>

                    {/* Apply / Withdraw buttons */}
                    <div className="flex gap-3 mt-8">
                      {job.hasApplied ? (
                        <button
                          onClick={() => handleWithdraw(job._id)}
                          disabled={isApplying}
                          className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isApplying
                            ? <Loader2 size={16} className="animate-spin" />
                            : <><X size={16} strokeWidth={3} /> Withdraw</>
                          }
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(job._id)}
                          disabled={isApplying}
                          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#0D9488] hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-teal-900/10 active:scale-95 disabled:opacity-50"
                        >
                          {isApplying
                            ? <Loader2 size={16} className="animate-spin" />
                            : <><Check size={16} strokeWidth={3} /> Apply Now</>
                          }
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer bar */}
              <div className="bg-slate-50/50 px-8 py-3 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 flex items-center gap-2 italic uppercase tracking-widest">
                  <Info size={12} className="text-[#0D9488]" />
                  Posted {new Date(job.createdAt).toDateString()}
                </p>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {job.jobType} job
                </span>
              </div>
            </div>
          );
        }) : (
          <div className="py-28 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="mb-4 inline-flex p-5 bg-teal-50 rounded-3xl text-teal-600">
              <Inbox size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No public jobs available right now</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Check back soon — hirers post new jobs regularly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Small meta box helper
const MetaBox = ({ icon, label, value }) => (
  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-xs font-black text-slate-700">{value}</p>
  </div>
);

export default TaskerRequests;