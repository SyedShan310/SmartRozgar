import React, { useEffect, useState } from 'react';
import {
  X, Calendar, Clock, MapPin, User, Phone,
  Star, Briefcase, DollarSign, CheckCircle,
  Loader2, Users, ShieldCheck, AlertCircle,
  ChevronRight, XCircle
} from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import JobTracker from '../common/JobTracker';
import JobComments from '../common/JobComments';

const STATUS_COLORS = {
  pending:     { text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200'  },
  accepted:    { text: 'text-teal-600',    bg: 'bg-teal-50',    border: 'border-teal-200'   },
  'in-progress':{ text: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-200'   },
  completed:   { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200'},
  cancelled:   { text: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200'    },
};

const PAYMENT_COLORS = {
  unpaid:     'text-amber-600',
  unverified: 'text-blue-600',
  paid:       'text-emerald-600',
  refunded:   'text-slate-500',
};

const JobDetailModal = ({ jobId, onClose, onJobUpdate }) => {
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Fetch full job details
  useEffect(() => {
    if (!jobId) return;
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${jobId}`);
        if (res.data.success) setJob(res.data.job);
      } catch {
        toast.error('Failed to load job details');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [jobId]);

  // Accept an applicant (for public jobs)
  const handleAcceptApplicant = async (taskerId) => {
    setAccepting(taskerId);
    try {
      const res = await axiosInstance.post(`/jobs/${jobId}/accept-applicant`, { taskerId });
      if (res.data.success) {
        toast.success('Tasker accepted! Job is now in progress.');
        setJob(res.data.job);
        onJobUpdate?.(); // refresh parent list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept applicant');
    } finally {
      setAccepting(null);
    }
  };

  const handleStatusUpdate = async (status) => {
    setActionLoading(true);
    try {
      const res = await axiosInstance.patch(`/jobs/${jobId}/status`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
        setJob(res.data.job);
        onJobUpdate?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    setActionLoading(true);
    try {
      const res = await axiosInstance.post('/reviews', { jobId, rating, comment });
      if (res.data.success) {
        toast.success('Thank you for your review!');
        setShowReview(false);
        const jobRes = await axiosInstance.get(`/jobs/${jobId}`);
        if (jobRes.data.success) setJob(jobRes.data.job);
        onJobUpdate?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const statusStyle  = STATUS_COLORS[job?.status]  || STATUS_COLORS.pending;
  const paymentColor = PAYMENT_COLORS[job?.paymentStatus] || 'text-amber-600';

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 rounded-xl">
              <Briefcase size={18} className="text-teal-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Details</p>
              <p className="text-sm font-black text-slate-800 leading-tight truncate max-w-xs">
                {loading ? '...' : job?.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-teal-600" size={32} />
            </div>
          ) : !job ? null : (
            <>
              {/* 1. Status + Type row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}>
                  <span className="w-2 h-2 rounded-full bg-current" />
                  {job.status}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500">
                  {job.jobType} Job
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500">
                  {job.service}
                </span>
              </div>

              {/* 2. Job Info */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Information</h3>
                <h2 className="text-xl font-black text-slate-800">{job.title}</h2>
                {job.description && (
                  <p className="text-sm text-slate-500 leading-relaxed">{job.description}</p>
                )}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <InfoRow icon={<Calendar size={14} />} label="Date"     value={new Date(job.date).toDateString()} />
                  <InfoRow icon={<Clock size={14} />}    label="Duration" value={`${job.hours} hour(s)`} />
                  <InfoRow
                    icon={<MapPin size={14} />}
                    label="Location"
                    value={[job.address?.houseNo, job.address?.city, job.address?.pincode].filter(Boolean).join(', ')}
                  />
                  <InfoRow icon={<DollarSign size={14} />} label="Budget" value={`Rs. ${job.price?.toLocaleString()}`} />
                </div>
              </div>

              {/* 3. Job Tracking Timeline */}
              <JobTracker job={job} />

              {/* 3b. Job Comments */}
              <div className="bg-slate-50 rounded-2xl p-5">
                <JobComments
                  jobId={job._id}
                  jobStatus={job.status}
                  hasTasker={!!job.tasker}
                />
              </div>

              {/* 4. Payment Status */}
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-5">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Status</p>
                  <p className={`text-sm font-black uppercase ${paymentColor}`}>{job.paymentStatus}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-black text-slate-800">Rs. {job.price?.toLocaleString()}</p>
                </div>
              </div>

              {/* 4a. DIRECT JOB — Assigned Tasker */}
              {job.jobType === 'direct' && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Tasker</h3>
                  {job.tasker ? (
                    <TaskerCard tasker={job.tasker} badge={
                      <span className="flex items-center gap-1 text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-1 rounded-lg border border-teal-100 uppercase">
                        <ShieldCheck size={10} /> Assigned
                      </span>
                    } />
                  ) : (
                    <EmptyBox text="No tasker assigned yet" />
                  )}
                </div>
              )}

              {/* 4b. PUBLIC JOB — Applicants List */}
              {job.jobType === 'public' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Applicants
                    </h3>
                    <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                      {job.applications?.length || 0} applied
                    </span>
                  </div>

                  {job.applications?.length > 0 ? (
                    <div className="space-y-3">
                      {job.applications.map((app) => (
                        <div
                          key={app._id}
                          className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100"
                        >
                          <TaskerCard tasker={app.tasker} badge={
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border
                              ${app.status === 'accepted'
                                ? 'text-teal-600 bg-teal-50 border-teal-100'
                                : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                              {app.status}
                            </span>
                          } />

                          {/* Only show Accept if job is still pending */}
                          {job.status === 'pending' && app.status === 'pending' && (
                            <button
                              onClick={() => handleAcceptApplicant(app.tasker._id)}
                              disabled={!!accepting}
                              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 shrink-0 ml-4"
                            >
                              {accepting === app.tasker._id
                                ? <Loader2 size={12} className="animate-spin" />
                                : <><CheckCircle size={12} /> Accept</>
                              }
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyBox text="No applicants yet — taskers will appear here once they apply" />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="px-8 py-4 border-t border-slate-100 flex justify-between items-center shrink-0 gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {!loading && job?.status === 'in-progress' && (
              <button onClick={() => handleStatusUpdate('completed')} disabled={actionLoading} className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl disabled:opacity-50 flex items-center gap-2">
                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Mark Complete
              </button>
            )}
            {!loading && job?.status === 'completed' && !job?.ratingGiven && (
              <button onClick={() => setShowReview(true)} className="px-5 py-2.5 bg-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                <Star size={14} /> Leave Review
              </button>
            )}
            {!loading && ['pending', 'accepted'].includes(job?.status) && (
              <button onClick={() => handleStatusUpdate('cancelled')} disabled={actionLoading} className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 text-xs font-black uppercase tracking-widest rounded-xl">
                Cancel Job
              </button>
            )}
          </div>
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest rounded-xl">
            Close
          </button>
        </div>

        {showReview && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6 z-10 rounded-[2rem]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
              <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Rate Your Tasker</h3>
              <div className="flex gap-2">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} className={`w-10 h-10 rounded-xl font-black ${rating >= n ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-400'}`}>★</button>
                ))}
              </div>
              <textarea rows={3} placeholder="Optional comment..." className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-500" value={comment} onChange={(e) => setComment(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={() => setShowReview(false)} className="flex-1 py-3 bg-slate-100 rounded-xl text-xs font-black uppercase">Cancel</button>
                <button onClick={handleSubmitReview} disabled={actionLoading} className="flex-1 py-3 bg-teal-600 text-white rounded-xl text-xs font-black uppercase disabled:opacity-50">
                  {actionLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Small helpers ─────────────────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    <div className="text-teal-600 mt-0.5 shrink-0">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-700 leading-snug">{value || '—'}</p>
    </div>
  </div>
);

const TaskerCard = ({ tasker, badge }) => (
  <div className="flex items-center gap-3">
    <img
      src={tasker?.profilePicture || `https://ui-avatars.com/api/?name=${tasker?.fullName}&background=0d9488&color=fff`}
      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
      alt={tasker?.fullName}
    />
    <div className="min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-black text-slate-800 truncate">{tasker?.fullName}</p>
        {badge}
      </div>
      <div className="flex items-center gap-3 mt-0.5">
        {tasker?.rating?.average > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
            <Star size={10} fill="currentColor" /> {tasker.rating.average.toFixed(1)}
          </span>
        )}
        {tasker?.hourlyRate && (
          <span className="text-[10px] font-bold text-slate-400">
            Rs. {tasker.hourlyRate}/hr
          </span>
        )}
        {tasker?.phoneNumber && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <Phone size={10} /> {tasker.phoneNumber}
          </span>
        )}
      </div>
    </div>
  </div>
);

const EmptyBox = ({ text }) => (
  <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
    <AlertCircle size={24} className="text-slate-300 mx-auto mb-2" />
    <p className="text-xs text-slate-400 font-medium">{text}</p>
  </div>
);

export default JobDetailModal;