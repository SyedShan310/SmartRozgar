import React, { useEffect, useState } from 'react';
import { User, Lock, Save, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const TaskerSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ fullName: '', email: '', hourlyRate: '', skills: [] });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axiosInstance.get('/user/me/profile')
      .then((res) => {
        if (res.data.success) {
          const u = res.data.user;
          setProfile({ fullName: u.fullName || '', email: u.email || '', hourlyRate: u.hourlyRate || '', skills: u.skills || [] });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axiosInstance.put(`/taskers/${user.id}`, {
        fullName: profile.fullName,
        email: profile.email,
        hourlyRate: parseInt(profile.hourlyRate),
      });
      if (res.data.success) toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.patch('/auth/password', { currentPassword: passwords.current, newPassword: passwords.new });
      toast.success('Password changed!');
      setPasswords({ current: '', new: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-32"><Loader2 className="animate-spin text-teal-600" size={32} /></div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <h1 className="text-3xl font-black text-slate-800">Account Settings</h1>

      <form onSubmit={saveProfile} className="bg-white border border-slate-100 rounded-2xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <User size={20} className="text-teal-600" />
          <h3 className="font-bold text-lg">Profile</h3>
        </div>
        <input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} placeholder="Full Name" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-500" />
        <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-500" />
        <input type="number" value={profile.hourlyRate} onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })} placeholder="Hourly Rate (PKR)" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-500" />
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <span key={s} className="px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-black uppercase rounded-lg border border-teal-100">{s}</span>
          ))}
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-xs font-black uppercase disabled:opacity-50">
          <Save size={16} /> Save Profile
        </button>
      </form>

      <form onSubmit={changePassword} className="bg-white border border-slate-100 rounded-2xl p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Lock size={20} className="text-teal-600" />
          <h3 className="font-bold text-lg">Change Password</h3>
        </div>
        <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="Current Password" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-500" />
        <input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} placeholder="New Password" className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-teal-500" />
        <button type="submit" disabled={saving} className="px-6 py-3 bg-slate-800 text-white rounded-xl text-xs font-black uppercase disabled:opacity-50">Update Password</button>
      </form>
    </div>
  );
};

export default TaskerSettings;
