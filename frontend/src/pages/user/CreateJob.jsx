import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Zap, ShieldCheck, 
  X, Wallet, CheckCircle2, 
  ChevronRight, ChevronLeft, FileText
} from 'lucide-react';

const EliteHirerStepper = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState('later'); 
  
  const [formData, setFormData] = useState({
    service: 'General Maintenance & Repair',
    description: '',
    houseNo: '', city: '', pincode: '',
    date: '', hours: 1, price: 2500 
  });

  const steps = ["Job Details", "Location", "Schedule", "Payment"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeploy = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/hirer-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      
    

      <main className="max-w-5xl mx-auto px-6 py-6">
        
        {/* 2. SIMPLE LINE STEPPER */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
          <div 
            className="absolute top-5 left-0 h-1 bg-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          <div className="relative flex justify-between">
            {steps.map((title, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all z-10 
                  ${step >= index + 1 ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}
                >
                  {step > index + 1 ? <CheckCircle2 size={18} /> : <span className="text-sm font-bold">{index + 1}</span>}
                </div>
                <span className={`mt-2 text-xs font-bold ${step >= index + 1 ? 'text-teal-700' : 'text-gray-400'}`}>
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. WIDE FORM BOX (Reduced Height) */}
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">
              {step === 1 && "What do you need help with?"}
              {step === 2 && "Where is the work located?"}
              {step === 3 && "When should we come?"}
              {step === 4 && "Choose payment method"}
            </h2>

            <div className="min-h-[220px]">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Service Type</label>
                    <select name="service" value={formData.service} onChange={handleChange} className="w-full bg-gray-50 border p-3 rounded-lg font-semibold outline-none focus:border-teal-500">
                      <option>General Maintenance & Repair</option>
                      <option>Cleaning Services</option>
                      <option>Electrician</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Short Description</label>
                    <textarea name="description" rows="3" onChange={handleChange} className="w-full bg-gray-50 border p-3 rounded-lg outline-none focus:border-teal-500" placeholder="Describe your problem..." />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                    <input name="houseNo" onChange={handleChange} placeholder="House #, Street, Area" className="w-full bg-gray-50 border p-3 rounded-lg outline-none focus:border-teal-500" />
                  </div>
                  <input name="city" onChange={handleChange} placeholder="City" className="bg-gray-50 border p-3 rounded-lg outline-none focus:border-teal-500" />
                  <input name="pincode" onChange={handleChange} placeholder="Pincode" className="bg-gray-50 border p-3 rounded-lg outline-none focus:border-teal-500" />
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl border flex items-center gap-4">
                    <Calendar className="text-teal-600" />
                    <input type="date" name="date" onChange={handleChange} className="bg-transparent font-bold outline-none w-full" />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border flex items-center gap-4">
                    <Clock className="text-teal-600" />
                    <input type="number" name="hours" onChange={handleChange} placeholder="How many hours?" className="bg-transparent font-bold outline-none w-full" />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => setPaymentOption('later')} className={`p-5 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${paymentOption === 'later' ? 'border-teal-600 bg-teal-50' : 'border-gray-100'}`}>
                    <Wallet className="text-teal-600" />
                    <div>
                      <p className="font-bold text-sm">Pay After Job</p>
                      <p className="text-xs text-gray-500">Pay directly to the worker</p>
                    </div>
                  </div>
                  <div onClick={() => setPaymentOption('now')} className={`p-5 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${paymentOption === 'now' ? 'border-teal-600 bg-teal-50' : 'border-gray-100'}`}>
                    <ShieldCheck className="text-teal-600" />
                    <div>
                      <p className="font-bold text-sm">Secure Online</p>
                      <p className="text-xs text-gray-500">We hold your money safely</p>
                    </div>
                  </div>
                  <div className="col-span-full mt-4 p-6 bg-slate-900 rounded-xl text-white flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-widest text-teal-500">Total Price</span>
                    <span className="text-3xl font-bold font-mono">Rs. {formData.price}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. NAVIGATION BUTTONS */}
          <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-t">
            <button 
              onClick={() => setStep(step - 1)} 
              disabled={step === 1}
              className={`text-sm font-bold text-gray-400 hover:text-black ${step === 1 && 'invisible'}`}
            >
              Back
            </button>
            
            <button 
              onClick={step === 4 ? handleDeploy : () => setStep(step + 1)}
              disabled={loading}
              className="px-10 py-3 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 shadow-md transition-all"
            >
              {loading ? 'Processing...' : step === 4 ? 'Finish & Post Job' : 'Next Step'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EliteHirerStepper;