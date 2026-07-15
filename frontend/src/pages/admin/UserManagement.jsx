import React, { useEffect, useState } from 'react';
import { Search, ShieldCheck, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hirers, setHirers] = useState([]);
  const [taskers, setTaskers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/admin/users')
      .then((res) => {
        if (res.data.success) {
          setHirers(res.data.hirers || []);
          setTaskers(res.data.taskers || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const allUsers = [
    ...hirers.map((u) => ({ ...u, role: 'Hirer' })),
    ...taskers.map((u) => ({ ...u, role: 'Tasker' })),
  ].filter((u) =>
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phoneNumber?.includes(searchTerm)
  );

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Users Management</h1>
        <p className="text-sm text-slate-500 mt-1">{allUsers.length} total users on platform</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allUsers.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{u.fullName}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{u.phoneNumber}</td>
                <td className="px-6 py-4 text-xs font-black text-teal-600 uppercase">{u.role}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg w-fit ${u.role === 'Tasker' && !u.isApproved ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'}`}>
                    <ShieldCheck size={10} />
                    {u.role === 'Tasker' ? (u.isApproved ? 'Approved' : 'Pending') : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {allUsers.length === 0 && (
          <p className="text-center py-12 text-slate-400 font-bold text-sm">No users found</p>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
