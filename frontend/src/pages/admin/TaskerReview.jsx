import React, { useEffect, useState } from 'react';
import {
  MapPin, AlertCircle, UserCheck, ShieldAlert, Loader2, Briefcase
} from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

const AdminTaskerReview = () => {
  const [taskers, setTaskers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchPending = async () => {
    try {
      const res = await axiosInstance.get('/admin/taskers/pending');
      if (res.data.success) setTaskers(res.data.taskers);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      const res = await axiosInstance.patch(`/admin/taskers/${id}/approve`);
      if (res.data.success) {
        toast.success('Tasker approved!');
        fetchPending();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this application?')) return;
    setActionId(id);
    try {
      const res = await axiosInstance.delete(`/admin/taskers/${id}/reject`);
      if (res.data.success) {
        toast.success('Application rejected');
        fetchPending();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActionId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Tasker Applications</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Approve new service providers so they can log in and accept jobs.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-600" />
          <span className="text-xs font-black text-amber-600 uppercase">{taskers.length} Pending</span>
        </div>
      </div>

      {taskers.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
          <UserCheck size={40} className="text-teal-300 mx-auto mb-4" />
          <p className="font-black text-slate-600">All caught up — no pending applications</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {taskers.map((t) => (
            <div key={t._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all shadow-sm">
              <div className="flex flex-col lg:flex-row">
                <div className="p-6 lg:w-2/5 border-b lg:border-b-0 lg:border-r border-slate-100">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={t.profilePicture} className="w-14 h-14 rounded-2xl object-cover border border-slate-100" alt="" />
                    <div>
                      <h3 className="text-lg font-black text-slate-800">{t.fullName}</h3>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <MapPin size={12} /> {t.address?.[0]?.city || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-[10px] uppercase tracking-widest">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">Phone</span>
                      <span className="text-slate-700 font-black">{t.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">Rate</span>
                      <span className="text-teal-600 font-black">Rs. {t.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-bold">Applied</span>
                      <span className="text-slate-700 font-black">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 lg:w-2/5 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/30">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <Briefcase size={12} /> Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {t.skills?.map((s) => (
                      <span key={s} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="p-6 lg:w-1/5 flex flex-col justify-center gap-3">
                  <button
                    onClick={() => handleApprove(t._id)}
                    disabled={actionId === t._id}
                    className="flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-teal-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                  >
                    {actionId === t._id ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={16} />} Approve
                  </button>
                  <button
                    onClick={() => handleReject(t._id)}
                    disabled={actionId === t._id}
                    className="flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    <ShieldAlert size={16} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTaskerReview;
