import React, { useState, useEffect } from 'react';
import {
  // fixed: removed 8 unused imports (Mail, Lock, Eye, EyeOff, User, Phone, MapPin, AlertCircle)
  Home, Briefcase, ChevronRight, Check, Loader2, ShieldCheck
} from 'lucide-react';
import Lottie from 'lottie-react';
import { axiosInstance } from '../../lib/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep]                 = useState(1);
  const [role, setRole]                 = useState('');
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState('');
  const [messageType, setMessageType]   = useState('');

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    gender: '', age: '',                         // age input added back (was in state but had no field)
    city: '', state: '', pincode: '',
    skills: [], hourlyRate: ''
  });

  const skillsOptions = [
    'Maid/Cleaning', 'Cooking', 'Babysitting', 'Elder Care',
    'Driver', 'Gardening', 'Laundry', 'Plumbing', 'Electrician'
  ];

  const pakistanProvinces = [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
    'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Kashmir'
  ];

  useEffect(() => {
    fetch('/icons/Lady.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(() => console.log('Animation failed to load'));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (message) setMessage('');
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  // fixed: Step 1 role cards already call nextStep so bottom button only shows on step 2
  // fixed: Added Step 2 validation before proceeding
  const nextStep = () => {
    if (step === 2) {
      if (!formData.fullName || !formData.phone || !formData.password || !formData.city || !formData.pincode) {
        setMessage('Please fill all required fields (name, phone, password, city, pincode)');
        setMessageType('error');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match');
        setMessageType('error');
        return;
      }
      if (role === 'tasker' && (!formData.gender || !formData.age)) {
        setMessage('Gender and age are required for tasker accounts');
        setMessageType('error');
        return;
      }
    }
    setMessage('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setMessage('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        role,
        fullName: formData.fullName,
        email:    formData.email,
        phone:    formData.phone,
        password: formData.password,
        gender:   formData.gender,
        age:      parseInt(formData.age),
        address: {
          city:    formData.city,
          state:   formData.state,
          pincode: formData.pincode
        },
        ...(role === 'tasker' && {
          skills:     formData.skills,
          hourlyRate: parseInt(formData.hourlyRate)
        })
      };

      const response = await axiosInstance.post('/auth/signup/', payload);

      if (response.data.success) {
        setMessageType('success');
        if (role === 'hirer' && response.data.token) {
          login(response.data.user, response.data.token);
          setMessage('Account created! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setMessage('Account created! Please login after admin approval.');
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed. Please check your details.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:border-[#0D9488] focus:bg-white outline-none transition-all';
  const labelClass = 'text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1';

  return (
    <div className="bg-[#F8FAFC] fixed inset-0 h-[100dvh] w-full flex items-center justify-center p-4 font-['Inter'] overflow-hidden">

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#0D9488 1px, transparent 1px)`, backgroundSize: '30px 30px' }}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#0D9488] animate-spin mx-auto mb-4" />
            <p className="text-[#0D9488] font-black uppercase text-xs tracking-widest">Processing Registration...</p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="max-w-6xl w-full bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 flex flex-col lg:flex-row h-full max-h-[90dvh] lg:h-[750px]">

        {/* LEFT PANEL */}
        <div className="hidden lg:flex lg:w-2/5 bg-[#0D9488] p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-teal-100 mb-6 font-bold text-[10px] uppercase tracking-widest">
              <ShieldCheck size={16} /> Secure Registration
            </div>
            <h3 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
              Start your <br />
              <span className="text-teal-200">Professional</span> <br />
              Journey.
            </h3>
            <p className="text-teal-50/80 text-sm mt-4 leading-relaxed font-medium">
              Join thousands of professionals and homeowners across Pakistan today.
            </p>
          </div>

          <div className="py-4 relative z-10">
            {animationData && (
              <Lottie animationData={animationData} loop={true} className="w-full max-w-[280px] mx-auto" />
            )}
          </div>

          <div className="text-[10px] text-teal-100/60 font-bold uppercase tracking-[0.2em] relative z-10">
            Reliable • Efficient • Local
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-6 lg:p-12 flex flex-col bg-white overflow-hidden">
          <div className="max-w-xl mx-auto w-full h-full flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-center mb-8 shrink-0">
              <div className="flex flex-col">
                <div className="text-xl font-black tracking-tighter flex items-center">
                  <span className="text-slate-900">Smart</span>
                  <span className="text-[#0D9488]">Rozgar</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Step {step} of 3</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${step >= i ? 'bg-[#0D9488]' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

              {/* STEP 1: SELECT ROLE */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Choose account type</h2>
                    <p className="text-slate-500 text-sm mt-1">Select how you want to use the platform.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* fixed: role cards call nextStep directly — no bottom Next button needed on step 1 */}
                    <button
                      onClick={() => { setRole('hirer'); setStep(2); }}
                      className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem] hover:border-[#0D9488] hover:bg-teal-50/30 transition-all text-left"
                    >
                      <Home size={32} className="text-[#0D9488] mb-4" />
                      <h3 className="text-slate-800 font-bold text-lg leading-none">I want to Hire</h3>
                      <p className="text-slate-500 text-xs mt-2">Find skilled professionals for your home tasks.</p>
                    </button>

                    <button
                      onClick={() => { setRole('tasker'); setStep(2); }}
                      className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem] hover:border-[#0D9488] hover:bg-teal-50/30 transition-all text-left"
                    >
                      <Briefcase size={32} className="text-[#0D9488] mb-4" />
                      <h3 className="text-slate-800 font-bold text-lg leading-none">I want to Work</h3>
                      <p className="text-slate-500 text-xs mt-2">Offer your skills and grow your business.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL INFO */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-4">
                  <h2 className="text-xl font-bold text-slate-800">Profile Details</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Full Name *</label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ahmed Khan" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Gender {role === 'tasker' ? '*' : ''}</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                        <option value="">Select Gender</option>
                        {/* fixed: values now lowercase to match model enum */}
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Phone Number *</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="0300 1234567" className={inputClass} />
                    </div>
                    {/* fixed: age field was in state/payload but had no input in the form */}
                    <div className="space-y-1.5">
                      <label className={labelClass}>Age {role === 'tasker' ? '*' : ''}</label>
                      <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="25" min="18" max="70" className={inputClass} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>Email (Optional)</label>
                    <input name="email" value={formData.email} onChange={handleChange} placeholder="mail@example.com" className={inputClass} />
                  </div>

                  {/* Service Location */}
                  <div className="p-5 bg-teal-50/30 rounded-2xl border border-teal-100 space-y-3">
                    <label className="text-[11px] font-black text-[#0D9488] uppercase tracking-widest">Service Location</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className={labelClass}>City *</label>
                        <input name="city" value={formData.city} onChange={handleChange} placeholder="Lahore" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm outline-none focus:border-[#0D9488]" />
                      </div>
                      <div className="space-y-1.5">
                        <label className={labelClass}>Pincode *</label>
                        <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="54000" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm outline-none focus:border-[#0D9488]" />
                      </div>
                    </div>
                    {/* fixed: state/province field was sent in payload but had no input */}
                    <div className="space-y-1.5">
                      <label className={labelClass}>Province</label>
                      <select name="state" value={formData.state} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 text-sm outline-none focus:border-[#0D9488]">
                        <option value="">Select Province</option>
                        {pakistanProvinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Password *</label>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Confirm *</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={inputClass} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: WORK DETAILS / CONFIRMATION */}
              {step === 3 && (
                <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-4">
                  <h2 className="text-xl font-bold text-slate-800">Final Confirmation</h2>

                  {role === 'tasker' ? (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className={labelClass}>Expertise * (Select multiple)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {skillsOptions.map(skill => (
                            <button
                              key={skill}
                              onClick={() => handleSkillToggle(skill)}
                              className={`py-3 rounded-xl border text-[11px] font-bold transition-all ${
                                formData.skills.includes(skill)
                                  ? 'bg-[#0D9488] border-[#0D9488] text-white shadow-md'
                                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-teal-200'
                              }`}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Expected Hourly Rate (PKR) *</label>
                        <input
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          placeholder="e.g. 800"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center bg-teal-50/30 rounded-[2.5rem] border border-teal-100">
                      <div className="w-16 h-16 bg-[#0D9488] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-200">
                        <Check size={32} className="text-white" />
                      </div>
                      <h4 className="text-slate-800 font-black text-lg">Account Ready!</h4>
                      <p className="text-slate-500 text-xs px-10 mt-2 font-medium">
                        Click create account to start finding the best professionals in your area.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-auto pt-6 border-t border-slate-100 shrink-0">
              <div className="flex gap-4">
                {step > 1 && (
                  <button onClick={prevStep} className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Back
                  </button>
                )}

                {/* fixed: Step 1 has no bottom Next button — role cards handle navigation */}
                {step === 2 && (
                  <button onClick={nextStep} className="flex-[2] py-4 bg-[#0D9488] hover:bg-[#0b7a70] text-white font-black rounded-2xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-teal-900/10">
                    Next Step <ChevronRight size={16} />
                  </button>
                )}

                {step === 3 && (
                  <button onClick={handleSubmit} className="flex-[2] py-4 bg-[#0D9488] hover:bg-[#0b7a70] text-white font-black rounded-2xl text-[11px] uppercase tracking-widest shadow-lg shadow-teal-900/10">
                    Create My Account
                  </button>
                )}
              </div>

              {message && (
                <div className={`mt-4 p-3 rounded-xl text-xs font-bold text-center border ${
                  messageType === 'success'
                    ? 'bg-teal-50 border-teal-200 text-teal-700'
                    : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {message}
                </div>
              )}

              <p className="text-center mt-6 text-slate-400 text-[11px] font-bold uppercase tracking-tight">
                Already part of the network?{' '}
                <Link to="/login" className="text-[#0D9488] hover:underline underline-offset-4 ml-1">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0D9488; }
      `}</style>
    </div>
  );
}