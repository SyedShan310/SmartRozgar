import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Wallet, Plus, ArrowUpRight, ArrowDownLeft, 
  CreditCard, PieChart, History, ExternalLink,
  DollarSign, TrendingUp, Landmark, ShieldCheck
} from 'lucide-react';

const MyWallet = () => {
  const { userData } = useOutletContext();

  const transactions = [
    { id: 1, type: 'credit', title: 'Wallet Top-up', date: 'Oct 20, 2026', amount: '+5,000', status: 'Completed' },
    { id: 2, type: 'debit', title: 'Service: AC Repair', date: 'Oct 18, 2026', amount: '-2,500', status: 'Completed' },
    { id: 3, type: 'debit', title: 'Service: Plumbing', date: 'Oct 15, 2026', amount: '-1,200', status: 'Pending' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Hub</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your funds and transaction history.</p>
        </div>
        <button className="px-6 py-3 bg-teal-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 flex items-center gap-2">
          <Plus size={16}/> Add Funds
        </button>
      </div>

      {/* 2. Top Section: Cards & Stats */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Modern Virtual Card */}
        <div className="col-span-12 lg:col-span-7">
          <div className="relative h-64 w-full bg-slate-900 rounded-[2.5rem] p-10 overflow-hidden shadow-xl shadow-slate-200">
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[80px] rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 blur-[50px] rounded-full"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1">Available Balance</p>
                  <h2 className="text-4xl font-black text-white tracking-tighter">
                    Rs. {userData?.walletBalance || '0.00'}
                  </h2>
                </div>
                <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <Landmark size={24} className="text-teal-400" />
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">{userData?.fullName || 'Smart User'}</p>
                  <p className="font-mono text-slate-400 tracking-[0.2em] text-xs">**** **** **** 4821</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                    <ShieldCheck size={14} className="text-teal-400" />
                    <span className="text-[10px] text-white font-bold uppercase">Escrow Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <WalletStat label="Monthly Spending" value="Rs. 8,400" icon={<TrendingUp size={20}/>} trend="+12%" isPositive={false} />
          <WalletStat label="Total Cashback" value="Rs. 1,200" icon={<PieChart size={20}/>} trend="Top 5%" isPositive={true} />
        </div>
      </div>

      {/* 3. Transaction History */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">Recent Transactions</h3>
          <button className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors">
            View All <ExternalLink size={14} />
          </button>
        </div>
        
        <div className="divide-y divide-gray-50">
          {transactions.map((trx) => (
            <div key={trx.id} className="p-6 hover:bg-gray-50/50 transition-all flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${trx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {trx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">{trx.title}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">{trx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${trx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {trx.amount} PKR
                </p>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${trx.status === 'Pending' ? 'text-amber-500' : 'text-gray-400'}`}>
                    {trx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Payment Methods Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white border-2 border-dashed border-gray-100 rounded-3xl flex items-center gap-4 group hover:border-teal-200 hover:bg-teal-50/20 transition-all cursor-pointer">
          <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-teal-600 group-hover:bg-white transition-all">
            <Plus size={20} />
          </div>
          <p className="text-xs font-bold text-gray-500 group-hover:text-teal-700">Add New Method</p>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-10 w-14 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                <CreditCard size={20} className="text-slate-400" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-900">Visa Default</p>
                <p className="text-[10px] text-gray-400 font-medium">**** 9012</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-teal-500"></div>
        </div>
      </div>
    </div>
  );
};

// Internal Component for Stats
const WalletStat = ({ label, value, icon, trend, isPositive }) => (
  <div className="bg-white border border-gray-100 rounded-[2rem] p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
      {trend}
    </span>
  </div>
);

export default MyWallet;