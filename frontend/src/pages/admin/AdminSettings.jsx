import React from 'react';
import { 
  Save, Globe, Lock, Bell, Percent, 
  ShieldCheck, Database, CreditCard, Mail
} from 'lucide-react';

const AdminSettings = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">System Settings</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Configure global platform variables, security protocols, and fee structures.</p>
                </div>
                <button className="bg-[#0D9488] hover:bg-teal-700 text-white px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-teal-900/10 uppercase tracking-[0.15em] active:scale-95">
                    <Save size={18} /> Save All Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Navigation Tabs */}
                <div className="md:col-span-1 space-y-2">
                    {[
                        { name: 'General Configuration', icon: Globe, active: true },
                        { name: 'Financials & Fees', icon: Percent, active: false },
                        { name: 'Security & Access', icon: Lock, active: false },
                        { name: 'Email & Notifications', icon: Mail, active: false },
                        { name: 'Database Maintenance', icon: Database, active: false },
                    ].map((tab, i) => (
                        <button key={i} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                            tab.active 
                            ? 'bg-white text-[#0D9488] shadow-md border border-slate-100' 
                            : 'text-slate-400 hover:bg-white hover:text-slate-600'
                        }`}>
                            <tab.icon size={18} className={tab.active ? 'text-[#0D9488]' : 'text-slate-300'} />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Right Settings Form */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* Platform Fee Section */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-teal-50 rounded-xl text-[#0D9488] border border-teal-100">
                                <CreditCard size={20}/>
                            </div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Fee Structure</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tasker Commission (%)</label>
                                <div className="relative">
                                    <input type="number" defaultValue="15" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-[#0D9488] transition-all" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium italic italic">Percentage taken from tasker earnings.</p>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Service Fee ($)</label>
                                <div className="relative">
                                    <input type="number" defaultValue="2.50" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-[#0D9488] transition-all" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">$</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium italic italic">Fixed fee added to every booking.</p>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                                <ShieldCheck size={20}/>
                            </div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Security & Verification</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:border-teal-200 hover:shadow-sm">
                                <div>
                                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight">Manual ID Verification</h4>
                                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">Require admin approval for all new Taskers.</p>
                                </div>
                                <div className="w-12 h-6 bg-[#0D9488] rounded-full relative cursor-pointer shadow-inner transition-all">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:border-teal-200 hover:shadow-sm">
                                <div>
                                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight">Two-Factor Authentication</h4>
                                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">Enforce 2FA for all Admin accounts.</p>
                                </div>
                                <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer shadow-inner transition-all">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Section */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                                <Bell size={20}/>
                            </div>
                            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">System Notifications</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Admin Alert Email</label>
                                <input type="email" defaultValue="admin@platform.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-slate-800 font-bold focus:outline-none focus:border-[#0D9488] transition-all" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminSettings;