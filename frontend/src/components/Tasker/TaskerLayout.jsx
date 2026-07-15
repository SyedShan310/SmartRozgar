import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, Home, DollarSign, MessageSquare, Briefcase, 
  Settings, Menu, X, ClipboardList, Zap, LogOut, Search
} from 'lucide-react';
import NotificationBell from '../common/NotificationBell';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
    const navItems = [
        { name: 'Dashboard', icon: Home, path: '/' },
        { name: 'My Tasks', icon: ClipboardList, path: '/tasks' },
        { name: 'Schedule', icon: Calendar, path: '/schedule' },
        { name: 'Job Requests', icon: Zap, path: '/requests' },
        { name: 'Messages', icon: MessageSquare, path: '/messages' },
        { name: 'Earnings', icon: DollarSign, path: '/earnings' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];
    
    return (
        <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out bg-white text-slate-600 flex flex-col border-r border-slate-200 h-full ${isOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0 w-64'}`}>
            
            {/* Sidebar Header: SmartRozgar Text Logo */}
            <div className="p-6 flex items-center justify-between border-b border-slate-50 flex-shrink-0">
                <div className="flex items-center gap-1">
                    <div className="text-xl font-black tracking-tighter flex items-center">
                      <span className="text-slate-900">Smart</span>
                      <span className="text-[#0D9488]">Rozgar</span>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 lg:hidden text-slate-400 hover:text-[#0D9488]">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-2">
                {navItems.map((item) => (
                    <NavLink 
                        key={item.name} 
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                            isActive 
                            ? 'bg-[#0D9488] text-white shadow-lg shadow-teal-700/20' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-[#0D9488]'
                        }`}
                    >
                        <item.icon className={`w-5 h-5 ${item.name === 'Dashboard' ? '' : ''}`} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Sidebar Footer: User Profile */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-4 p-2">
                    <div className="w-10 h-10 bg-[#0D9488] rounded-full flex items-center justify-center text-white font-black text-xs shadow-inner">
                        {user?.fullName?.charAt(0) || 'T'}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-sm font-black text-slate-800 truncate">{user?.fullName || 'Tasker'}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Tasker</div>
                    </div>
                </div>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

const TaskerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-['Inter']">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} onLogout={handleLogout} />
            
            <div className="transition-all duration-300 ease-in-out lg:pl-64">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setSidebarOpen(true)} 
                            className="lg:hidden p-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-sm font-black text-slate-800 uppercase tracking-widest hidden sm:block">
                            Portal Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                className="bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#0D9488]/20 focus:bg-white outline-none w-64 transition-all placeholder:text-slate-400" 
                                placeholder="Search tasks or files..." 
                            />
                        </div>
                        
                        {/* Notification Icon */}
                        <NotificationBell />
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-6 md:p-8 min-h-[calc(100dvh-73px)]">
                    <Outlet /> 
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default TaskerLayout;