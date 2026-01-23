import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layout, Calendar, Settings, Wallet, Bell, 
  LogOut, ShieldCheck, Menu, Sparkles, ChevronRight
} from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userJson = localStorage.getItem('user');
        const userId = userJson ? JSON.parse(userJson).id : null;
        if (!userId) return;
        const response = await axiosInstance.get(`/user/${userId}`);
        setUserData(response.data);
      } catch (err) {
        console.error("Profile Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-teal-700 font-bold text-xs uppercase tracking-widest">Loading Account...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] font-sans text-slate-900 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0 relative z-20">
        {/* Brand Identity */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-100">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Smart<span className="text-teal-600">Rozgar</span></span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 mt-8">
          <NavItem to="/profile" icon={<Layout size={18}/>} label="Overview" end />
          <NavItem to="/profile/tasks" icon={<Calendar size={18}/>} label="My Bookings" />
          <NavItem to="/profile/wallet" icon={<Wallet size={18}/>} label="My Wallet" />
          <NavItem to="/profile/settings" icon={<Settings size={18}/>} label="Settings" />
        </nav>

        {/* Sidebar Footer / Upgrade Card */}
        <div className="p-6">
          <div className="bg-teal-600 p-5 rounded-2xl mb-4 relative overflow-hidden group">
            <Sparkles className="absolute top-2 right-2 text-teal-300 opacity-50" size={24} />
            <p className="font-bold text-xs text-white uppercase tracking-wider mb-1">Go Premium</p>
            <p className="text-teal-50 text-[11px] mb-4 opacity-90 leading-snug">Get verified badges and faster job matches.</p>
            <button className="w-full py-2 bg-white text-teal-700 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest shadow-sm hover:bg-teal-50">
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

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Menu className="text-gray-400 cursor-pointer hover:text-teal-600" size={20} />
            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Account</span>
                <ChevronRight size={14} className="mx-1" />
                <span className="text-teal-600">
                    {location.pathname === '/profile' ? 'Overview' : location.pathname.split('/').pop()}
                </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors group">
              <Bell size={18} className="text-gray-400 group-hover:text-teal-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white"></span>
            </div>

            {/* User Dropdown Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-bold text-slate-900 leading-none uppercase tracking-tight">{userData?.fullName?.split(' ')[0]}</p>
                <p className="text-[9px] text-teal-600 font-bold uppercase mt-1 opacity-80">{userData?.role || 'Member'}</p>
              </div>
              <img 
                src={userData?.profilePicture || `https://ui-avatars.com/api/?name=${userData?.fullName}&background=0d9488&color=fff`} 
                className="w-9 h-9 rounded-xl object-cover border border-gray-100 shadow-sm" 
                alt="Profile" 
              />
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           <div className="max-w-5xl mx-auto">
              <Outlet context={{ userData }} />
           </div>
        </div>
      </main>
    </div>
  );
};

// Simplified Navigation Item Component
const NavItem = ({ to, icon, label, end }) => (
  <NavLink to={to} end={end} className={({ isActive }) => 
    `flex items-center gap-3 py-3 px-5 rounded-xl transition-all text-xs font-bold uppercase tracking-wider
    ${isActive 
      ? 'bg-teal-600 text-white shadow-md shadow-teal-100' 
      : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50/50'}`
  }>
    {icon} {label}
  </NavLink>
);

export default Profile;