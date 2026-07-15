import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, ShieldCheck,
  Wallet, CheckCircle2, MapPin, FileText, Briefcase
} from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SERVICE_OPTIONS = [
  'Maid/Cleaning', 'Cooking', 'Babysitting', 'Elder Care',
  'Driver', 'Gardening', 'Laundry', 'Plumbing', 'Electrician',
  'General Maintenance & Repair'
];

const STEPS = ['Job Details', 'Location', 'Schedule', 'Review & Post'];

const CreateJob = () => {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const [step, setStep]                   = useState(1);
  const [loading, setLoading]             = useState(false);
  const [paymentOption, setPaymentOption] = useState('later');

  const [formData, setFormData] = useState({
    jobType:     'public',   // 'public' | 'direct'
    title:       '',
    service:     SERVICE_OPTIONS[0],
    description: '',
    houseNo:     '',
    city:        '',
    pincode:     '',
    date:        '',
    hours:       1,
    price:       0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ── Per-step validation ────────────────────────────────────────────────
  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!formData.title.trim())       e.title       = 'Job title is required';
      if (!formData.service)            e.service     = 'Please select a service';
      if (!formData.description.trim()) e.description = 'Please describe the job';
    }
    if (step === 2) {
      if (!formData.city.trim())    e.city    = 'City is required';
      if (!formData.pincode.trim()) e.pincode = 'Pincode is required';
    }
    if (step === 3) {
      if (!formData.date)         e.date  = 'Please select a date';
      if (formData.hours < 1)     e.hours = 'At least 1 hour required';
      if (formData.price < 1)     e.price = 'Please enter a price';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);

    try {
      const payload = {
        jobType:     formData.jobType,
        title:       formData.title,
        service:     formData.service,
        description: formData.description,
        address: {
          houseNo: formData.houseNo,
          city:    formData.city,
          pincode: formData.pincode,
        },
        date:  formData.date,
        hours: parseInt(formData.hours),
        price: parseInt(formData.price),
      };
      console.log(payload)
      const res = await axiosInstance.post('/jobs/create', payload);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/profile/tasks');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-gray-50 border ${errors[field] ? 'border-red-400' : 'border-gray-200'} p-3 rounded-lg font-semibold outline-none focus:border-teal-500 text-sm transition-all`;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Step Progress */}
        <div className="relative mb-12">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full" />
          <div
            className="absolute top-5 left-0 h-1 bg-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {STEPS.map((title, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all z-10
                  ${step >= index + 1 ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {step > index + 1 ? <CheckCircle2 size={18} /> : <span className="text-sm font-bold">{index + 1}</span>}
                </div>
                <span className={`mt-2 text-xs font-bold ${step >= index + 1 ? 'text-teal-700' : 'text-gray-400'}`}>
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              {step === 1 && 'What do you need help with?'}
              {step === 2 && 'Where is the work located?'}
              {step === 3 && 'When should we come?'}
              {step === 4 && 'Review & Post Job'}
            </h2>

            <div className="min-h-[260px]">

              {/* STEP 1 — Job Details */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* Job Type Toggle */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Job Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setFormData(p => ({ ...p, jobType: 'public' }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.jobType === 'public' ? 'border-teal-600 bg-teal-50' : 'border-gray-100'}`}
                      >
                        <p className="font-bold text-sm">Public Post</p>
                        <p className="text-xs text-gray-500 mt-1">Taskers apply, you choose the best</p>
                      </button>
                      <button
                        onClick={() => setFormData(p => ({ ...p, jobType: 'direct' }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.jobType === 'direct' ? 'border-teal-600 bg-teal-50' : 'border-gray-100'}`}
                      >
                        <p className="font-bold text-sm">Direct Hire</p>
                        <p className="text-xs text-gray-500 mt-1">Book a specific tasker directly</p>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Job Title *</label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Need a cook for dinner party"
                        className={inputClass('title')}
                      />
                      {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Service Type *</label>
                      <select name="service" value={formData.service} onChange={handleChange} className={inputClass('service')}>
                        {SERVICE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description *</label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your requirements in detail..."
                      className={inputClass('description')}
                    />
                    {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                  </div>
                </div>
              )}

              {/* STEP 2 — Location */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">House / Street</label>
                    <input
                      name="houseNo"
                      value={formData.houseNo}
                      onChange={handleChange}
                      placeholder="House #, Street, Area"
                      className={inputClass('houseNo')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">City *</label>
                      <input name="city" value={formData.city} onChange={handleChange} placeholder="Lahore" className={inputClass('city')} />
                      {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Pincode *</label>
                      <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="54000" className={inputClass('pincode')} />
                      {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Schedule & Price */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Date *</label>
                      <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3">
                        <Calendar className="text-teal-600 shrink-0" size={18} />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="bg-transparent font-bold outline-none w-full py-3 text-sm"
                        />
                      </div>
                      {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Hours Needed *</label>
                      <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3">
                        <Clock className="text-teal-600 shrink-0" size={18} />
                        <input
                          type="number"
                          name="hours"
                          value={formData.hours}
                          onChange={handleChange}
                          min={1} max={12}
                          className="bg-transparent font-bold outline-none w-full py-3 text-sm"
                        />
                      </div>
                      {errors.hours && <p className="text-red-500 text-xs">{errors.hours}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Your Budget (PKR) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="e.g. 1500"
                        className={inputClass('price')}
                      />
                      {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 — Review */}
              {step === 4 && (
                <div className="space-y-4">
                  {/* Summary Card */}
                  <div className="bg-gray-50 rounded-xl border p-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold uppercase text-xs">Job Type</span>
                      <span className="font-black capitalize">{formData.jobType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold uppercase text-xs">Title</span>
                      <span className="font-bold">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold uppercase text-xs">Service</span>
                      <span className="font-bold">{formData.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold uppercase text-xs">Location</span>
                      <span className="font-bold">{formData.city}, {formData.pincode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold uppercase text-xs">Date</span>
                      <span className="font-bold">{new Date(formData.date).toDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold uppercase text-xs">Hours</span>
                      <span className="font-bold">{formData.hours} hr(s)</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="text-gray-500 font-bold uppercase text-xs">Budget</span>
                      <span className="font-black text-teal-600 text-lg">Rs. {formData.price}</span>
                    </div>
                  </div>

                  {/* Payment Option */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setPaymentOption('later')}
                      className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${paymentOption === 'later' ? 'border-teal-600 bg-teal-50' : 'border-gray-100'}`}
                    >
                      <Wallet className="text-teal-600 shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-sm">Pay After Job</p>
                        <p className="text-xs text-gray-500">Pay directly to the worker</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setPaymentOption('now')}
                      className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${paymentOption === 'now' ? 'border-teal-600 bg-teal-50' : 'border-gray-100'}`}
                    >
                      <ShieldCheck className="text-teal-600 shrink-0" size={20} />
                      <div>
                        <p className="font-bold text-sm">Secure Online</p>
                        <p className="text-xs text-gray-500">We hold your money safely</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-t">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className={`text-sm font-bold text-gray-400 hover:text-black transition-all ${step === 1 ? 'invisible' : ''}`}
            >
              ← Back
            </button>

            <button
              onClick={step === 4 ? handleSubmit : nextStep}
              disabled={loading}
              className="px-10 py-3 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 shadow-md transition-all disabled:bg-gray-300"
            >
              {loading ? 'Posting...' : step === 4 ? 'Post Job' : 'Next Step →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;