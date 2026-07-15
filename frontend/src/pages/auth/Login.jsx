import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Loader2, ChevronRight, Phone } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [loginMode, setLoginMode]         = useState('user'); // 'user' | 'admin'
  const [formData, setFormData]           = useState({ phone: '', password: '', email: '' });
  const [showPassword, setShowPassword]   = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState('');

  useEffect(() => {
    fetch('/icons/Login.json')
      .then(res  => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Error loading animation:', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleSubmit = async () => {
    if (loginMode === 'admin') {
      if (!formData.email || !formData.password) {
        setError('Please enter admin email and password');
        return;
      }
    } else if (!formData.phone || !formData.password) {
      setError('Please enter your phone number and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = loginMode === 'admin'
        ? { email: formData.email, password: formData.password, role: 'admin' }
        : { phone: formData.phone, password: formData.password };
      const response = await axiosInstance.post('/auth/login', payload);

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 py-12 font-['Inter'] overflow-hidden">

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#0D9488 1px, transparent 1px)`, backgroundSize: '30px 30px' }}
      />

      <div className="max-w-6xl w-full bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT: Branding */}
          <div className="hidden lg:flex bg-[#0D9488] p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-teal-100 mb-6 font-bold tracking-widest text-[10px] uppercase">
                <ShieldCheck size={16} /> Verified Professional Network
              </div>
              <h3 className="text-4xl font-[1000] text-white mb-4 leading-tight tracking-tight">
                Empowering <br />Local Talent.
              </h3>
              <p className="text-teal-50/80 text-sm leading-relaxed max-w-xs font-medium">
                Join the most trusted platform for domestic services in Pakistan.
              </p>
            </div>
            <div className="w-full max-w-[240px] mx-auto py-4 relative z-10">
              {animationData && <Lottie animationData={animationData} loop={true} className="w-full h-auto" />}
            </div>
            <div className="text-[10px] text-teal-100/60 font-bold uppercase tracking-[0.2em] relative z-10">
              © 2026 SmartRozgar Inc.
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">

              <div className="text-center lg:text-left mb-8">
                <div className="text-2xl font-black tracking-tighter mb-6 flex items-center justify-center lg:justify-start">
                  <span className="text-slate-900">Smart</span>
                  <span className="text-[#0D9488]">Rozgar</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Login to Account</h2>
                <p className="text-slate-500 text-xs mt-1 font-semibold">Welcome back! Please enter your details.</p>
              </div>

              <div className="space-y-5">

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-[11px] font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="flex gap-2 mb-2">
                  {['user', 'admin'].map((mode) => (
                    <button key={mode} type="button" onClick={() => setLoginMode(mode)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMode === mode ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {mode === 'user' ? 'User / Tasker' : 'Admin'}
                    </button>
                  ))}
                </div>

                {loginMode === 'admin' ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="admin@smartrorozgar.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#0D9488] font-medium" />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative group">
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="0300 1234567" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#0D9488] font-medium" />
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0D9488]" />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                    <button type="button" className="text-[10px] font-black text-[#0D9488] hover:text-teal-700 transition-colors uppercase tracking-tight">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-slate-900 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all placeholder:text-slate-300 font-medium"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0D9488] transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0D9488]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#0D9488] hover:bg-[#0b7a70] disabled:bg-slate-300 text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-teal-600/20 active:scale-[0.98] mt-2 uppercase text-[11px] tracking-[0.2em]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>

                <div className="text-center mt-6">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    New here?{' '}
                    <Link to="/signup" className="text-[#0D9488] hover:underline underline-offset-4 ml-1">
                      Create Account
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}