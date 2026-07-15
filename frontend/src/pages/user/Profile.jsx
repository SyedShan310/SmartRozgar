import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Layout, Calendar, Settings, Wallet,
  LogOut, ShieldCheck, Menu, Sparkles, ChevronRight
} from 'lucide-react';
import NotificationBell from '../../components/common/NotificationBell';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs]   = useState([]);
  const [userData, setUserData] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  const location  = useLocation();
  const navigate  = useNavigate();

  // Fetch this hirer's jobs — passed down to child routes via Outlet context
  const fetchJobs = async () => {
    if (!user?.id) return;
    try {
      const res = await axiosInstance.get('/jobs/my');
      if (res.data.success) setJobs(res.data.jobs);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await axiosInstance.get('/user/me/profile');
      if (res.data.success) setUserData(res.data.user);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => { fetchJobs(); fetchProfile(); }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] font-sans text-slate-900 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0 relative z-20">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-100">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Smart<span className="text-teal-600">Rozgar</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-8">
          <NavItem to="/profile"          icon={<Layout size={18} />}   label="Overview" end />
          <NavItem to="/profile/tasks"    icon={<Calendar size={18} />} label="My Jobs" />
          <NavItem to="/profile/wallet"   icon={<Wallet size={18} />}   label="My Wallet" />
          <NavItem to="/profile/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="p-6">
          <div className="bg-teal-600 p-5 rounded-2xl mb-4 relative overflow-hidden">
            <Sparkles className="absolute top-2 right-2 text-teal-300 opacity-50" size={24} />
            <p className="font-bold text-xs text-white uppercase tracking-wider mb-1">Go Premium</p>
            <p className="text-teal-50 text-[11px] mb-4 opacity-90 leading-snug">
              Get verified badges and faster job matches.
            </p>
            <button className="w-full py-2 bg-white text-teal-700 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-teal-50">
              Upgrade
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-xl transition-all text-xs font-bold uppercase tracking-widest border border-gray-100"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">

        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Menu className="text-gray-400 cursor-pointer hover:text-teal-600" size={20} />
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>Account</span>
              <ChevronRight size={14} className="mx-1" />
              <span className="text-teal-600">
                {location.pathname === '/profile'
                  ? 'Overview'
                  : location.pathname.split('/').pop()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <NotificationBell />

            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-bold text-slate-900 leading-none uppercase tracking-tight">
                  {user?.fullName?.split(' ')[0]}
                </p>
                <p className="text-[9px] text-teal-600 font-bold uppercase mt-1 opacity-80">
                  {user?.role || 'Member'}
                </p>
              </div>
              <img
                src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=0d9488&color=fff`}
                className="w-9 h-9 rounded-xl object-cover border border-gray-100 shadow-sm"
                alt="Profile"
              />
            </div>
          </div>
        </header>

        {/* Scrollable Body — passes user + jobs to all child routes */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet context={{ user, userData, jobs, jobsLoading, refetchJobs: fetchJobs, refetchProfile: fetchProfile }} />
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 py-3 px-5 rounded-xl transition-all text-xs font-bold uppercase tracking-wider
      ${isActive
        ? 'bg-teal-600 text-white shadow-md shadow-teal-100'
        : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50/50'}`
    }
  >
    {icon} {label}
  </NavLink>
);

export default Profile;