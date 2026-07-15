import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, Users, DollarSign, ListChecks, Activity, Shield, 
  Settings, MessageSquare, LogOut, Menu, X, Bell, FileText 
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', icon: BarChart3, path: '/', count: 0 },
        { name: 'Users Management', icon: Users, path: '/user-management', count: 0 },
        { name: 'Tasker Review', icon: ListChecks, path: '/tasker-review', count: 12 },
        { name: 'Financials', icon: DollarSign, path: '/financials', count: 0 },
        { name: 'Reports & Analytics', icon: FileText, path: '/reports', count: 0 },
        { name: 'System Logs', icon: Activity, path: '/system-logs', count: 0 },
        { name: 'Settings', icon: Settings, path: '/settings', count: 0 },
        { name: 'Support Tickets', icon: MessageSquare, path: '/support-tickets', count: 8 },
    ];

    // UPDATED COLORS: Teal accent
    const ACCENT_COLOR_CLASS = 'bg-[#0D9488]'; 

    return (
        // Changed bg-[#050505] to bg-slate-50 and text-white to text-slate-900
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Sidebar */}
            {/* Changed bg-[#0a0a0a] to bg-white and border-white/5 to border-slate-200 */}
            <aside className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 bg-white border-r border-slate-200 lg:translate-x-0 lg:w-64 ${sidebarOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full'}`}>
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${ACCENT_COLOR_CLASS} rounded-lg flex items-center justify-center`}>
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-slate-800">AdminPro</h1>
                    </div>
                    {/* Changed text-slate-400 to text-slate-500 */}
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800"><X /></button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.name} 
                            to={item.path}
                            end={item.path === '/admin'}
                            // Changed text-slate-400 to text-slate-500 and hover:bg-white/5 to hover:bg-slate-50
                            className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${isActive ? `${ACCENT_COLOR_CLASS} text-white shadow-md shadow-teal-900/10` : 'text-slate-500 hover:bg-slate-50 hover:text-[#0D9488]'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                            {/* Changed bg-white to bg-slate-100 for non-active and kept white for active */}
                            {item.count > 0 && <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">{item.count}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-rose-500 hover:bg-rose-50 rounded-lg text-sm font-medium transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-64 transition-all duration-300">
                {/* Changed bg-[#0a0a0a] to bg-white and border-white/5 to border-slate-200 */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"><Menu /></button>
                        <h1 className="text-lg font-semibold text-slate-800">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                        </button>
                        <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-slate-200">
                            <span className="text-sm font-semibold text-slate-700">System Admin</span>
                            {/* Changed bg-blue-600 to bg-[#0D9488] */}
                            <div className="w-10 h-10 bg-[#0D9488] text-white rounded-full flex items-center justify-center font-bold shadow-sm">SA</div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Backdrop */}
            {/* Changed bg-black/60 to bg-slate-900/40 */}
            {sidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    );
};

export default AdminLayout;