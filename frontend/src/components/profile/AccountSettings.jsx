import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios';
import { 
  User, Lock, Bell, Shield, 
  Mail, Phone, MapPin, Save, 
  Trash2, Globe, Eye, EyeOff, 
  CheckCircle2, AlertTriangle, Languages, 
  Smartphone, Monitor, Mail as MailIcon, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const AccountSettings = () => {
  const { userData, refetchProfile } = useOutletContext();
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (userData) setForm({ fullName: userData.fullName || '', email: userData.email || '', phoneNumber: userData.phoneNumber || '' });
  }, [userData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axiosInstance.put(`/user/${userData._id}`, form);
      if (res.data.success) {
        refetchProfile?.();
        toast.success('Profile updated!');
      }
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.patch('/auth/password', { currentPassword: passwords.current, newPassword: passwords.new });
      toast.success('Password updated!');
      setPasswords({ current: '', new: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                  <User size={20}/>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Profile Details</h3>
              </div>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Full Name" name="fullName" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} icon={<User size={16}/>} />
                  <InputGroup label="Email Address" name="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} icon={<Mail size={16}/>} />
                  <InputGroup label="Phone Number" name="phoneNumber" value={form.phoneNumber} readOnly icon={<Phone size={16}/>} />
                </div>
                <div className="pt-6 border-t border-gray-50 flex justify-end">
                  <button type="submit" disabled={saving} className="px-8 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-teal-100 disabled:opacity-50">
                    <Save size={18}/> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </section>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <section className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                  <Shield size={20}/>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Security Settings</h3>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <InputGroup label="Current Password" type={showPassword ? 'text' : 'password'} value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} icon={<Lock size={16}/>} />
                <InputGroup label="New Password" type={showPassword ? 'text' : 'password'} value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} icon={<Lock size={16}/>} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-teal-600 font-bold">{showPassword ? 'Hide' : 'Show'} passwords</button>
                <button type="submit" disabled={saving} className="px-8 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold disabled:opacity-50">
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </section>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-slate-900 font-bold text-sm mb-4 ml-2">Notification Preferences</h3>
            <NotificationToggle icon={<MailIcon size={18}/>} title="Email Notifications" desc="Get order updates via email" active={true} />
            <NotificationToggle icon={<Smartphone size={18}/>} title="Push Notifications" desc="Get real-time app alerts" active={true} />
            <NotificationToggle icon={<Monitor size={18}/>} title="Browser Alerts" desc="Desktop job notifications" active={false} />
          </div>
        );

      case 'language':
        return (
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 shadow-sm">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                <Languages className="text-teal-600" />
                <h3 className="text-slate-900 font-bold text-lg">Language & Region</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['English (US)', 'Urdu (اردو)', 'Arabic', 'Punjabi'].map((lang) => (
                    <button 
                      key={lang} 
                      className={`p-5 rounded-2xl border text-left flex justify-between items-center transition-all ${lang === 'English (US)' ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-gray-100 text-gray-500 hover:border-teal-100'}`}
                    >
                        <span className="text-sm font-bold">{lang}</span>
                        {lang === 'English (US)' && <CheckCircle2 size={18} className="text-teal-600"/>}
                    </button>
                ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      
      <div className="flex flex-col sm:row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account preferences and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* LEFT: NAVIGATION */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          <SettingsTab icon={<User size={18}/>} label="Personal Info" active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} />
          <SettingsTab icon={<Lock size={18}/>} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
          <SettingsTab icon={<Bell size={18}/>} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <SettingsTab icon={<Globe size={18}/>} label="Language" active={activeTab === 'language'} onClick={() => setActiveTab('language')} />
          
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button className="w-full flex items-center justify-between py-3 px-5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all group">
                <div className="flex items-center gap-3">
                  <Trash2 size={18}/> Delete Account
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all"/>
            </button>
          </div>
        </div>

        {/* RIGHT: CONTENT */}
        <div className="col-span-12 lg:col-span-9">
           {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// --- HELPERS ---

const SettingsTab = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between py-3.5 px-5 rounded-xl transition-all text-sm font-bold
    ${active 
      ? 'bg-white border border-gray-100 text-teal-600 shadow-sm' 
      : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}
  >
    <div className="flex items-center gap-3">
      {icon} {label}
    </div>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-teal-600"></div>}
  </button>
);

const InputGroup = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors">
        {icon}
      </div>
      <input 
        {...props}
        className="w-full bg-slate-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 focus:bg-white focus:border-teal-500 outline-none transition-all placeholder:text-gray-300"
      />
    </div>
  </div>
);

const NotificationToggle = ({ icon, title, desc, active }) => (
  <div className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center justify-between group hover:shadow-sm transition-all">
    <div className="flex items-center gap-4">
        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors">
            {icon}
        </div>
        <div>
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="text-xs text-gray-400 font-medium">{desc}</p>
        </div>
    </div>
    <div className={`w-10 h-5 rounded-full relative cursor-pointer shadow-inner transition-colors ${active ? 'bg-teal-600' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${active ? 'right-1' : 'left-1'}`}></div>
    </div>
  </div>
);

export default AccountSettings;