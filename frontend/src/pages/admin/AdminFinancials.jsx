import React, { useEffect, useState } from 'react';
import { DollarSign, Clock, CheckCircle, Loader2, Eye, X, RefreshCw } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  unpaid:     'bg-amber-50 text-amber-700 border-amber-100',
  unverified: 'bg-blue-50 text-blue-700 border-blue-100',
  paid:       'bg-emerald-50 text-emerald-700 border-emerald-100',
  refunded:   'bg-slate-50 text-slate-600 border-slate-100',
};

const AdminFinancials = () => {
  const [data, setData] = useState({ walletTopUps: [], jobDeposits: [], allWalletTx: [], paidJobs: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/financials');
      if (res.data.success) setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load financials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const verifyTopUp = async (txId) => {
    setActionId(txId);
    try {
      await axiosInstance.patch(`/wallet/verify/${txId}`);
      toast.success('Top-up verified!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setActionId(null);
    }
  };

  const verifyJobPayment = async (jobId) => {
    setActionId(jobId);
    try {
      await axiosInstance.patch(`/wallet/verify-job/${jobId}`);
      toast.success('Job payment verified!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setActionId(null);
    }
  };

  const summary = data.summary || {};
  const pendingJobs = data.jobDeposits || [];
  const needsAction = pendingJobs.filter((j) => j.paymentStatus === 'unverified' || j.paymentScreenshots?.length > 0);

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Financial Management</h1>
          <p className="text-sm text-slate-500 mt-1">Verify payment receipts and monitor all transactions.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-black uppercase text-slate-600 hover:bg-slate-200">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue (Paid)', value: `Rs. ${(summary.totalRevenue || 0).toLocaleString()}`, color: '#0D9488' },
          { label: 'Pending Amount', value: `Rs. ${(summary.pendingAmount || 0).toLocaleString()}`, color: '#f59e0b' },
          { label: 'Awaiting Verification', value: needsAction.length, color: '#3b82f6' },
          { label: 'Pending Top-ups', value: data.walletTopUps?.length || 0, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm border-t-4" style={{ borderTopColor: s.color }}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'pending', label: `Pending Payments (${pendingJobs.length})` },
          { key: 'topups', label: `Wallet Top-ups (${data.walletTopUps?.length || 0})` },
          { key: 'paid', label: `Verified (${data.paidJobs?.length || 0})` },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.key ? 'bg-teal-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pending Job Payments */}
      {activeTab === 'pending' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b font-black text-xs uppercase tracking-widest text-slate-600 flex items-center gap-2">
            <DollarSign size={14} className="text-blue-500" /> Job Payments
          </div>
          {pendingJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400 font-bold">No pending job payments</p>
              <p className="text-xs text-slate-300 mt-1">Payments appear here when hirers book with a receipt upload</p>
            </div>
          ) : pendingJobs.map((job) => (
            <div key={job._id} className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-slate-50 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-slate-800">{job.title}</p>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${STATUS_COLORS[job.paymentStatus] || STATUS_COLORS.unpaid}`}>
                    {job.paymentStatus}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {job.hirer?.fullName} · {job.tasker?.fullName ? `Tasker: ${job.tasker.fullName} · ` : ''}
                  Rs. {job.price?.toLocaleString()} · {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5 uppercase">Job status: {job.status}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {job.paymentScreenshots?.[0] && (
                  <button onClick={() => setPreviewImg(job.paymentScreenshots[0])} className="flex items-center gap-1 px-3 py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-xl hover:bg-slate-200">
                    <Eye size={12} /> Receipt
                  </button>
                )}
                {job.paymentStatus !== 'paid' && (
                  <button onClick={() => verifyJobPayment(job._id)} disabled={actionId === job._id} className="px-4 py-2 bg-teal-600 text-white text-[10px] font-black uppercase rounded-xl disabled:opacity-50 flex items-center gap-1">
                    {actionId === job._id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                    Verify Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wallet Top-ups */}
      {activeTab === 'topups' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b font-black text-xs uppercase tracking-widest text-slate-600 flex items-center gap-2">
            <Clock size={14} className="text-amber-500" /> Wallet Top-ups
          </div>
          {(data.walletTopUps?.length === 0 && data.allWalletTx?.length === 0) ? (
            <p className="text-center py-12 text-sm text-slate-400">No wallet transactions yet</p>
          ) : (
            <>
              {data.walletTopUps?.map((tx) => (
                <div key={tx._id} className="flex justify-between items-center px-5 py-4 border-b border-slate-50">
                  <div>
                    <p className="text-sm font-bold">{tx.hirer?.fullName || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400">Rs. {tx.amount?.toLocaleString()} · {tx.status} · {new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {tx.receipt && (
                      <button onClick={() => setPreviewImg(tx.receipt)} className="px-3 py-2 bg-slate-100 text-[10px] font-black uppercase rounded-xl flex items-center gap-1">
                        <Eye size={12} /> Receipt
                      </button>
                    )}
                    {tx.status === 'pending' && (
                      <button onClick={() => verifyTopUp(tx._id)} disabled={actionId === tx._id} className="px-4 py-2 bg-teal-600 text-white text-[10px] font-black uppercase rounded-xl disabled:opacity-50">
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {data.allWalletTx?.filter((t) => t.status === 'completed').map((tx) => (
                <div key={tx._id} className="flex justify-between items-center px-5 py-3 border-b border-slate-50 opacity-60">
                  <div>
                    <p className="text-sm font-bold text-slate-600">{tx.hirer?.fullName} — {tx.title}</p>
                    <p className="text-[10px] text-slate-400">Rs. {tx.amount?.toLocaleString()} · verified</p>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 uppercase">Done</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Paid / Verified */}
      {activeTab === 'paid' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b font-black text-xs uppercase tracking-widest text-slate-600">Verified Job Payments</div>
          {(data.paidJobs?.length === 0) ? (
            <p className="text-center py-12 text-sm text-slate-400">No verified payments yet</p>
          ) : data.paidJobs.map((job) => (
            <div key={job._id} className="flex justify-between items-center px-5 py-4 border-b border-slate-50">
              <div>
                <p className="text-sm font-bold text-slate-800">{job.title}</p>
                <p className="text-[10px] text-slate-400">{job.hirer?.fullName} · Rs. {job.price?.toLocaleString()} · {job.status}</p>
              </div>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg uppercase">Paid</span>
            </div>
          ))}
        </div>
      )}

      {/* Receipt preview modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6" onClick={() => setPreviewImg(null)}>
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewImg(null)} className="absolute top-3 right-3 p-2 bg-slate-100 rounded-full"><X size={16} /></button>
            <p className="text-xs font-black uppercase text-slate-500 mb-3">Payment Receipt</p>
            <img src={previewImg} alt="Receipt" className="w-full rounded-xl max-h-96 object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinancials;
