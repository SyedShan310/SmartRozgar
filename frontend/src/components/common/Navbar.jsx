import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import LogoImage from '/images/logo3.png';

const navItems = [
  { name: 'Home',     href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact',  href: '/contact' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, userRole, logout } = useAuth(); // fixed: was reading localStorage.getItem('role') and JSON.parse('user') directly

  const [isOpen, setIsOpen]               = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // fixed: was using user?.name which doesn't exist — field is fullName
  const userName = user?.fullName || 'User';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();           // fixed: was doing localStorage.clear() + reload manually
    navigate('/login'); // context logout() handles clearing localStorage cleanly
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-gray-50 font-['Inter'] shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={LogoImage} alt="SmartRozgar" className="h-10 w-auto transition-transform group-hover:scale-105" />
              <span className="text-2xl font-[1000] tracking-tighter text-slate-900">
                Smart<span className="text-[#008080]">Rozgar</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `text-[13px] font-black uppercase tracking-[0.15em] transition-all duration-200 ${
                    isActive
                      ? 'text-[#008080] border-b-2 border-[#008080] pb-1'
                      : 'text-slate-900 hover:text-[#008080]'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* fixed: was checking userRole from localStorage — now from context */}
            {!userRole ? (
              <Link to="/login">
                <button className="px-8 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-[#008080] transition-all duration-300 shadow-xl shadow-slate-200">
                  Join Now
                </button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:border-[#008080] transition-all"
                >
                  <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {userName.split(' ')[0]}
                  </span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white border-2 border-slate-50 rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] py-4 z-50">
                    <div className="px-6 py-2 mb-2 border-b border-slate-50">
                      <p className="text-[10px] font-black text-[#008080] uppercase tracking-widest">
                        {userRole === 'tasker' ? 'Tasker Account' : 'Hirer Account'}
                      </p>
                      <p className="text-sm font-black text-slate-900 truncate">{userName}</p>
                      {/* show phone since email is optional */}
                      {user?.phone && (
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{user.phone}</p>
                      )}
                    </div>
                    <Link
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#008080]"
                    >
                      <User size={18} /> My Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-900">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t border-slate-50 transition-all duration-300 ${isOpen ? 'max-h-screen py-8' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-6 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-2xl font-black text-slate-900 hover:text-[#008080]"
            >
              {item.name}
            </Link>
          ))}

          {/* fixed: mobile menu was always showing Login button even when logged in */}
          {!userRole ? (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-4 bg-[#008080] text-white rounded-2xl font-black uppercase tracking-widest"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full text-center py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;