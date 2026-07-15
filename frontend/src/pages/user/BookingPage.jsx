import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ShieldCheck, MapPin, CheckCircle2, Upload, Clock,
  Copy, Check, Landmark, Wallet, Smartphone, ChevronRight, Loader2, ArrowLeft
} from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { formatTasker } from '../../lib/services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { state } = useLocation();
  const { taskerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tasker, setTasker] = useState(state?.tasker || null);
  const [loadingTasker, setLoadingTasker] = useState(!state?.tasker);
  const [submitting, setSubmitting] = useState(false);
  const selectedPlanKey = state?.plan || 'standard';
  const service = state?.service || tasker?.skills?.[0] || 'General Service';
  const planInfo = tasker?.pricing?.[selectedPlanKey];

  const [currentStep, setCurrentStep] = useState(1);
  const [requirements, setRequirements] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [date, setDate] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [receiptBase64, setReceiptBase64] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeMethod, setActiveMethod] = useState('bank');
  const [addons, setAddons] = useState({ material: false, express: false });
  const [totalPrice, setTotalPrice] = useState(0);
  const serviceFee = 250;

  const paymentDetails = {
    bank:      { name: 'Meezan Bank',  account: 'PK70 MEZN 1234 5678 9012', icon: <Landmark size={18} /> },
    easypaisa: { name: 'EasyPaisa',    account: '0300 1234567',             icon: <Wallet size={18} /> },
    jazzcash:  { name: 'JazzCash',     account: '0321 7654321',             icon: <Smartphone size={18} /> },
  };

  useEffect(() => {
    if (!tasker && taskerId) {
      axiosInstance.get(`/taskers/${taskerId}`)
        .then((res) => { if (res.data.success) setTasker(formatTasker(res.data.tasker)); })
        .catch(() => toast.error('Failed to load tasker'))
        .finally(() => setLoadingTasker(false));
    }
  }, [taskerId, tasker]);

  useEffect(() => {
    if (planInfo) {
      let total = parseInt(planInfo.price) + serviceFee;
      if (addons.material) total += 500;
      if (addons.express) total += 300;
      setTotalPrice(total);
    }
  }, [addons, planInfo]);

  const handleReceipt = (file) => {
    if (!file) return;
    setReceipt(file);
    const reader = new FileReader();
    reader.onload = () => setReceiptBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const hours = selectedPlanKey === 'basic' ? 1 : selectedPlanKey === 'standard' ? 2 : 4;
      const payload = {
        jobType: 'direct',
        title: `${service} - ${planInfo.title}`,
        service,
        description: requirements,
        tasker: tasker.id,
        address: { street: address, city: city || 'Lahore', pincode: pincode || '54000' },
        date,
        hours,
        price: totalPrice,
        paymentScreenshot: receiptBase64,
      };
      const res = await axiosInstance.post('/jobs/create', payload);
      if (res.data.success) {
        toast.success('Booking confirmed! Tasker will be notified.');
        navigate('/booking-success', { state: { job: res.data.job, tasker } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTasker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  if (!tasker || !planInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 font-bold">Tasker not found</p>
        <button onClick={() => navigate('/services')} className="text-teal-600 font-black text-sm uppercase">Browse Services</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20 font-['Inter']">
      <div className="pt-20 pb-8 px-6 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-teal-600 text-xs font-black uppercase mb-4">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 ${currentStep >= step ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                  {currentStep > step ? <CheckCircle2 size={18} /> : step}
                </div>
                {step < 3 && <div className={`h-[2px] w-12 ${currentStep > step ? 'bg-teal-600' : 'bg-slate-100'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {currentStep === 1 && (
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-xl font-bold">Project <span className="text-teal-600">Details</span></h2>
              <textarea rows={5} placeholder="Describe what you need..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm outline-none focus:border-teal-600" value={requirements} onChange={(e) => setRequirements(e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Address" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input type="text" placeholder="City" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm" value={city} onChange={(e) => setCity(e.target.value)} />
                <input type="text" placeholder="Pincode" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                <input type="date" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-4 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <button onClick={() => setCurrentStep(2)} disabled={!requirements || !address || !date} className="w-full py-5 bg-teal-600 text-white font-bold rounded-xl disabled:opacity-30 flex items-center justify-center gap-2">
                Next Step <ChevronRight size={18} />
              </button>
            </section>
          )}

          {currentStep === 2 && (
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-xl font-bold">Optional <span className="text-teal-600">Extras</span></h3>
              {[
                { key: 'material', label: 'Source Materials', price: 500 },
                { key: 'express',  label: 'Priority Arrival', price: 300 },
              ].map(({ key, label, price }) => (
                <button key={key} onClick={() => setAddons((p) => ({ ...p, [key]: !p[key] }))} className={`w-full p-6 rounded-2xl border-2 flex justify-between items-center ${addons[key] ? 'bg-teal-50 border-teal-600' : 'bg-slate-50 border-slate-100'}`}>
                  <span className="text-sm font-bold">{label}</span>
                  <span className="font-bold text-teal-600">+Rs.{price}</span>
                </button>
              ))}
              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(1)} className="flex-1 py-5 bg-slate-100 font-bold rounded-xl">Previous</button>
                <button onClick={() => setCurrentStep(3)} className="flex-[2] py-5 bg-teal-600 text-white font-bold rounded-xl">Continue to Payment</button>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white"><ShieldCheck size={24} /></div>
                <div><h3 className="text-lg font-bold">Secure Escrow Payment</h3><p className="text-xs text-slate-400">Upload receipt after transfer</p></div>
              </div>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                {['bank', 'easypaisa', 'jazzcash'].map((m) => (
                  <button key={m} onClick={() => setActiveMethod(m)} className={`flex-1 py-3 rounded-lg text-[11px] font-bold uppercase flex items-center justify-center gap-2 ${activeMethod === m ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400'}`}>
                    {paymentDetails[m].icon} {m}
                  </button>
                ))}
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                <div className="p-5 bg-white rounded-xl border relative">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Account</p>
                  <p className="text-sm font-mono font-bold">{paymentDetails[activeMethod].account}</p>
                  <button onClick={() => { navigator.clipboard.writeText(paymentDetails[activeMethod].account); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="absolute top-5 right-5 text-slate-300 hover:text-teal-600">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleReceipt(e.target.files[0])} />
                  <Upload size={24} className="text-teal-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500">{receipt ? receipt.name : 'Upload Payment Receipt'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(2)} className="flex-1 py-5 bg-slate-100 font-bold rounded-xl">Back</button>
                <button onClick={handleSubmit} disabled={!receipt || submitting} className="flex-[2] py-5 bg-teal-600 text-white font-bold rounded-xl disabled:opacity-30 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Confirm & Book'}
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 bg-white border border-slate-100 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-4 pb-6 border-b">
              <img src={tasker.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
              <div>
                <h4 className="font-bold">{tasker.fullName}</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Verified Professional</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Package</span><span className="font-bold">Rs. {planInfo.price}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Service Fee</span><span className="font-bold">Rs. {serviceFee}</span></div>
              {addons.material && <div className="flex justify-between text-teal-600 font-bold"><span>Materials</span><span>Rs. 500</span></div>}
              {addons.express  && <div className="flex justify-between text-teal-600 font-bold"><span>Express</span><span>Rs. 300</span></div>}
              <div className="h-px bg-slate-100 my-2" />
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
                <span className="text-3xl font-black">Rs. {totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
