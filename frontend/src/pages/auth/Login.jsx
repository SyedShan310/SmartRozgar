import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/icons/Login.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError('Please enter your email and password');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      login(response.data.user.role);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 w-full h-[100dvh] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 font-['Inter'] overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#0D9488 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
      </div>

      {/* Main Login Card */}
      <div className="max-w-5xl w-full bg-white border border-slate-200 rounded-[2rem] shadow-xl overflow-hidden relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Side: Branding */}
          <div className="hidden lg:flex bg-[#0D9488] p-16 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
               <div className="flex items-center gap-2 text-teal-100 mb-8 font-bold tracking-widest text-[11px] uppercase">
                  <ShieldCheck size={18} /> Verified Professional Network
               </div>
               <h3 className="text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                 Empowering <br />
                 Local Talent.
               </h3>
               <p className="text-teal-50/80 text-sm leading-relaxed max-w-xs font-medium">
                 Log in to access your professional dashboard and connect with opportunities across Pakistan.
               </p>
            </div>

            <div className="w-full max-w-[280px] mx-auto py-8 relative z-10">
              {animationData && (
                <Lottie animationData={animationData} loop={true} className="w-full h-auto" />
              )}
            </div>

            <div className="text-[10px] text-teal-100/60 font-bold uppercase tracking-[0.2em] relative z-10">
               © 2026 SmartRozgar Inc.
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-8 sm:p-12 lg:p-20 flex flex-col justify-center bg-white">
            <div className="max-w-sm mx-auto w-full">
              
              {/* TEXT LOGO REPLACEMENT */}
              <div className="text-center lg:text-left mb-10">
                <div className="text-2xl font-black tracking-tighter mb-8 flex items-center justify-center lg:justify-start">
                  <span className="text-slate-900">Smart</span>
                  <span className="text-[#0D9488]">Rozgar</span>
                </div>
                
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Login to Account</h2>
                <p className="text-slate-500 text-xs mt-2 font-semibold">Welcome back! Please enter your details.</p>
              </div>

              <div className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-bold text-center">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. hassan@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm text-slate-900 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0D9488] transition-colors" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <button type="button" className="text-[11px] font-bold text-[#0D9488] hover:text-teal-700 transition-colors">Forgot Password?</button>
                  </div>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4 text-sm text-slate-900 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all placeholder:text-slate-400 font-medium"
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

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#0D9488] hover:bg-[#0b7a70] disabled:bg-slate-300 text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-teal-600/10 active:scale-[0.98] mt-4 uppercase text-xs tracking-widest"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      <span>Login</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>

                <div className="text-center mt-8">
                  <p className="text-slate-500 text-[12px] font-bold uppercase tracking-tight">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#0D9488] hover:text-teal-700 transition-all ml-1">Sign up for free</Link>
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