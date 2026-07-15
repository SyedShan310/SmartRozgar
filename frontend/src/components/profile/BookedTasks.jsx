import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Clock, Search,
  CheckCircle, Timer, MoreHorizontal,
  Inbox, Loader2, Plus
} from 'lucide-react';
import JobDetailModal from './JobDetailModal';
import JobTracker from '../common/JobTracker';

const STATUS_STYLES = {
  completed:     { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' },
  'in-progress': { text: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    dot: 'bg-blue-500'    },
  pending:       { text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   dot: 'bg-amber-500'   },
  accepted:      { text: 'text-teal-600',    bg: 'bg-teal-50',    border: 'border-teal-100',    dot: 'bg-teal-500'    },
  cancelled:     { text: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100',     dot: 'bg-red-500'     },
};

const MyBookedTasks = () => {
  const { jobs, jobsLoading, refetchJobs } = useOutletContext();
  const navigate = useNavigate();
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('all');
  const [selectedJobId, setSelectedJobId] = useState(null); // controls modal

  const getStyles = (status) =>
    STATUS_STYLES[status?.toLowerCase()] || STATUS_STYLES.pending;

  const filtered = (jobs || []).filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(search.toLowerCase()) ||
                          job.service?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || job.jobType === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    total:      jobs?.length || 0,
    pending:    jobs?.filter(j => j.status === 'pending').length     || 0,
    inProgress: jobs?.filter(j => j.status === 'in-progress').length || 0,
    completed:  jobs?.filter(j => j.status === 'completed').length   || 0,
  };

  if (jobsLoading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="animate-spin text-teal-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">

      {/* Modal */}
      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
          onJobUpdate={refetchJobs} // refresh list after accepting applicant
        />
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">All jobs you have posted.</p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or service..."
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:border-teal-500 outline-none transition-all shadow-sm"
            />
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl text-xs font-bold outline-none hover:border-teal-300 transition-all shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="public">Public</option>
            <option value="direct">Direct</option>
          </select>
          <button
            onClick={() => navigate('/create-job')}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-all shadow-sm whitespace-nowrap"
          >
            <Plus size={16} /> New Job
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat label="Total Jobs"  count={counts.total}      color="text-slate-900"   />
        <QuickStat label="Pending"     count={counts.pending}    color="text-amber-600"   />
        <QuickStat label="In Progress" count={counts.inProgress} color="text-blue-600"    />
        <QuickStat label="Completed"   count={counts.completed}  color="text-emerald-600" />
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((job) => {
            const styles = getStyles(job.status);
            return (
              <div
                key={job._id}
                className="group bg-white border border-gray-100 rounded-[2rem] p-6 transition-all hover:shadow-md hover:shadow-gray-200/50"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">

                  {/* Left */}
                  <div className="flex gap-5">
                    <div className={`h-16 w-16 ${styles.bg} rounded-2xl flex items-center justify-center ${styles.text} flex-shrink-0`}>
                      {job.status === 'completed' ? <CheckCircle size={28} /> : <Timer size={28} />}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${styles.bg} ${styles.border} ${styles.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                          {job.status}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500">
                          {job.jobType}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium line-clamp-1">{job.description}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                        <TaskMeta icon={<Calendar size={14} />} value={new Date(job.date).toDateString()} />
                        <TaskMeta icon={<Clock size={14} />}    value={`${job.hours} hr(s)`} />
                        <TaskMeta icon={<MapPin size={14} />}   value={`${job.address?.city}, ${job.address?.pincode}`} />
                      </div>
                      {job.jobType === 'direct' && job.tasker && (
                        <p className="text-[11px] font-bold text-teal-600 mt-1">
                          Tasker: {job.tasker.fullName}
                        </p>
                      )}
                      {job.jobType === 'public' && (
                        <p className="text-[11px] font-bold text-slate-500 mt-1">
                          {job.applications?.length || 0} applicant(s)
                        </p>
                      )}
                      <div className="pt-2 max-w-xs">
                        <JobTracker job={job} compact />
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end gap-4 border-t lg:border-t-0 border-gray-50 pt-4 lg:pt-0">
                    <div className="lg:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Budget</p>
                      <p className="text-xl font-black text-slate-900 tracking-tight">
                        Rs. {job.price?.toLocaleString()}
                      </p>
                      <p className={`text-[10px] font-bold mt-1 ${job.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {job.paymentStatus}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* Opens the modal */}
                      <button
                        onClick={() => setSelectedJobId(job._id)}
                        className="px-5 py-2.5 bg-gray-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-teal-50 hover:text-teal-700 transition-all border border-gray-100"
                      >
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
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {search ? 'No jobs match your search' : 'No jobs posted yet'}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              {search ? 'Try a different search term.' : 'Post your first job and find a professional today.'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/create-job')}
                className="mt-6 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100"
              >
                Post a Job
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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