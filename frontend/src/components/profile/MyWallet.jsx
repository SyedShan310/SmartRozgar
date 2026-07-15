import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, Loader2, Upload } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

const MyWallet = () => {
  const { userData } = useOutletContext();
  const [balance, setBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await axiosInstance.get('/wallet');
      if (res.data.success) {
        setBalance(res.data.balance);
        setTotalSpent(res.data.totalSpent);
        setTransactions(res.data.transactions);
      }
    } catch {
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWallet(); }, []);

  const handleTopUp = async () => {
    const amt = parseInt(topUpAmount);
    if (!amt || amt < 100) { toast.error('Minimum Rs. 100'); return; }
    setSubmitting(true);
    try {
      let receiptBase64 = '';
      if (receipt) {
        const reader = new FileReader();
        receiptBase64 = await new Promise((res) => {
          reader.onload = () => res(reader.result);
          reader.readAsDataURL(receipt);
        });
      }
      const response = await axiosInstance.post('/wallet/topup', { amount: amt, receipt: receiptBase64 });
      if (response.data.success) {
        toast.success(response.data.message);
        setShowTopUp(false);
        setTopUpAmount('');
        setReceipt(null);
        fetchWallet();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Top-up failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Financial Hub</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your funds and transaction history.</p>
        </div>
        <button onClick={() => setShowTopUp(true)} className="px-6 py-3 bg-teal-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-teal-700 flex items-center gap-2">
          <Plus size={16} /> Add Funds
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <div className="relative h-56 bg-slate-900 rounded-[2.5rem] p-10 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full" />
            <p className="text-teal-300 text-[10px] font-black uppercase tracking-widest mb-2">Available Balance</p>
            <p className="text-5xl font-black text-white">Rs. {balance?.toLocaleString()}</p>
            <p className="text-slate-400 text-xs mt-4 font-bold">Total Spent: Rs. {totalSpent?.toLocaleString()}</p>
            <Wallet className="absolute bottom-8 right-8 text-white/10" size={80} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <StatRow label="Member" value={userData?.fullName || '—'} />
            <StatRow label="Phone" value={userData?.phoneNumber || '—'} />
            <StatRow label="Transactions" value={transactions.length} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b"><h3 className="font-bold text-slate-800">Transaction History</h3></div>
        {transactions.length === 0 ? (
          <p className="text-center py-12 text-sm text-slate-400">No transactions yet</p>
        ) : transactions.map((tx) => (
          <div key={tx._id} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-slate-50">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{tx.title}</p>
                <p className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString()} · {tx.status}</p>
              </div>
            </div>
            <p className={`font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
              {tx.type === 'credit' ? '+' : '-'}Rs. {tx.amount?.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {showTopUp && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-black text-slate-800 uppercase text-sm">Add Funds</h3>
            <input type="number" placeholder="Amount (min 100)" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-500" />
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setReceipt(e.target.files[0])} />
              <Upload size={20} className="text-teal-600 mx-auto mb-1" />
              <p className="text-xs text-slate-500">{receipt ? receipt.name : 'Upload payment receipt (optional)'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowTopUp(false)} className="flex-1 py-3 bg-slate-100 rounded-xl text-xs font-black uppercase">Cancel</button>
              <button onClick={handleTopUp} disabled={submitting} className="flex-1 py-3 bg-teal-600 text-white rounded-xl text-xs font-black uppercase disabled:opacity-50">
                {submitting ? 'Processing...' : 'Top Up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-xs text-slate-400 font-bold uppercase">{label}</span>
    <span className="text-sm font-black text-slate-800">{value}</span>
  </div>
);

export default MyWallet;
