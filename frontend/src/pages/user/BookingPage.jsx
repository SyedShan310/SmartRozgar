import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, MapPin, CheckCircle2, 
  Upload, Info, AlertCircle, Clock, Zap, Shield, 
  Copy, Check, Landmark, Wallet, Smartphone, ChevronRight
} from 'lucide-react';

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const tasker = state?.tasker || {
    id: 1,
    fullName: "Ahmad Hassan",
    image: "https://i.pravatar.cc/150?u=ahmad",
    pricing: {
      basic: { price: "800" },
      standard: { price: "1500" },
      premium: { price: "3000" }
    }
  };

  const selectedPlanKey = state?.plan || 'standard';
  const planInfo = tasker.pricing[selectedPlanKey];

  // --- STEPPER STATE ---
  const [currentStep, setCurrentStep] = useState(1);

  // --- FORM STATES ---
  const [requirements, setRequirements] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeMethod, setActiveMethod] = useState('bank'); 
  const [addons, setAddons] = useState({ material: false, express: false });
  const [totalPrice, setTotalPrice] = useState(0);
  const serviceFee = 250;

  const paymentDetails = {
    bank: { name: "Meezan Bank", title: "SmartRozgar Escrow", account: "PK70 MEZN 1234 5678 9012", icon: <Landmark size={18}/> },
    easypaisa: { name: "EasyPaisa", title: "M. Ahmad (Admin)", account: "0300 1234567", icon: <Wallet size={18}/> },
    jazzcash: { name: "JazzCash", title: "M. Ahmad (Admin)", account: "0321 7654321", icon: <Smartphone size={18}/> }
  };

  useEffect(() => {
    if (planInfo) {
      let total = parseInt(planInfo.price) + serviceFee;
      if (addons.material) total += 500;
      if (addons.express) total += 300;
      setTotalPrice(total);
    }
  }, [addons, planInfo]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20 font-['Inter']">
      
      {/* PROFESSIONAL STEPPER HEADER */}
      <div className="pt-20 pb-8 px-6 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            
            <div className="flex items-center justify-center w-full max-w-xl">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 
                      ${currentStep >= step ? 'bg-teal-600 border-teal-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}>
                      {currentStep > step ? <CheckCircle2 size={18}/> : step}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider hidden md:block
                      ${currentStep >= step ? 'text-teal-600' : 'text-slate-400'}`}>
                      {step === 1 ? "Requirements" : step === 2 ? "Add-ons" : "Payment"}
                    </span>
                  </div>
                  {step < 3 && <div className={`h-[2px] w-12 mx-4 rounded-full transition-colors duration-500 ${currentStep > step ? 'bg-teal-600' : 'bg-slate-100'}`}></div>}
                </React.Fragment>
              ))}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: STEP CONTENT */}
        <div className="lg:col-span-8">
            
            {/* STEP 1: JOB SCOPE */}
            {currentStep === 1 && (
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Project <span className="text-teal-600">Details</span></h2>
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">Step 1 of 3</span>
                  </div>
                  <div className="space-y-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Tell the professional what happened</label>
                        <textarea rows={5} placeholder="e.g. The water heater is making a loud noise and not heating properly..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-medium focus:bg-white focus:border-teal-600 outline-none transition-all resize-none shadow-inner" onChange={(e) => setRequirements(e.target.value)} value={requirements}/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="relative group">
                              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={18}/>
                              <input type="text" placeholder="Full Address" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-14 pr-6 text-sm font-semibold outline-none focus:bg-white focus:border-teal-600" onChange={(e)=>setAddress(e.target.value)} value={address}/>
                          </div>
                          <div className="relative group">
                              <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-teal-600 transition-colors" size={18}/>
                              <input type="date" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 pl-14 pr-6 text-sm font-semibold outline-none focus:bg-white focus:border-teal-600" onChange={(e)=>setDate(e.target.value)} value={date}/>
                          </div>
                      </div>
                  </div>
                  <button onClick={nextStep} disabled={!requirements || !address || !date} className="w-full py-5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 disabled:opacity-30 flex items-center justify-center gap-2 transition-all">
                    Next Step <ChevronRight size={18}/>
                  </button>
              </section>
            )}

            {/* STEP 2: ADD-ONS */}
            {currentStep === 2 && (
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="text-xl font-bold flex items-center gap-3">Recommended <span className="text-teal-600">Extras</span></h3>
                  <div className="grid grid-cols-1 gap-4">
                      <button onClick={() => setAddons(p => ({...p, material: !p.material}))} className={`p-6 rounded-2xl border-2 transition-all flex justify-between items-center ${addons.material ? 'bg-teal-50 border-teal-600' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="text-left"><p className="text-sm font-bold">Source Materials</p><p className="text-[11px] text-slate-400">Professional will purchase parts for you</p></div>
                          <span className="font-bold text-teal-600">+Rs.500</span>
                      </button>
                      <button onClick={() => setAddons(p => ({...p, express: !p.express}))} className={`p-6 rounded-2xl border-2 transition-all flex justify-between items-center ${addons.express ? 'bg-teal-50 border-teal-600' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="text-left"><p className="text-sm font-bold">Priority Arrival</p><p className="text-[11px] text-slate-400">Response within 60 minutes</p></div>
                          <span className="font-bold text-teal-600">+Rs.300</span>
                      </button>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Previous</button>
                    <button onClick={nextStep} className="flex-[2] py-5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700">Continue to Payment</button>
                  </div>
              </section>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === 3 && (
              <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white"><ShieldCheck size={24}/></div>
                      <div><h3 className="text-lg font-bold text-slate-900 leading-none">Secure Escrow Payment</h3><p className="text-xs text-slate-400 font-medium mt-1">Manual Verification Required</p></div>
                  </div>

                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                    {['bank', 'easypaisa', 'jazzcash'].map((method) => (
                      <button key={method} onClick={() => setActiveMethod(method)} className={`flex-1 py-3 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeMethod === method ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400'}`}>
                        {paymentDetails[method].icon} {method}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 space-y-6">
                      <div className="p-5 bg-white rounded-xl border border-slate-100 relative">
                          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Account Number</p>
                          <p className="text-sm font-mono font-bold text-slate-800">{paymentDetails[activeMethod].account}</p>
                          <button onClick={()=>copyToClipboard(paymentDetails[activeMethod].account)} className="absolute top-5 right-5 text-slate-300 hover:text-teal-600">
                              {copied ? <Check size={16}/> : <Copy size={16}/>}
                          </button>
                      </div>
                      <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-teal-600 hover:bg-white transition-all text-center">
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e)=>setReceipt(e.target.files[0])}/>
                          <div className="p-3 bg-teal-50 w-fit mx-auto rounded-xl mb-2 text-teal-600"><Upload size={24}/></div>
                          <p className="text-xs font-bold text-slate-500">{receipt ? receipt.name : `Upload Payment Receipt`}</p>
                      </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-5 bg-slate-100 text-slate-600 font-bold rounded-xl">Back</button>
                    <button onClick={() => navigate('/success')} disabled={!receipt} className="flex-[2] py-5 bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-100 disabled:opacity-30">Confirm & Book</button>
                  </div>
              </section>
            )}
        </div>

        {/* RIGHT COLUMN: INVOICE */}
        <div className="lg:col-span-4">
            <div className="sticky top-32 bg-white border border-slate-100 rounded-[2rem] p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                    <img src={tasker.image} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                        <h4 className="font-bold text-slate-900 leading-none">{tasker.fullName}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block tracking-wider">Verified Professional</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium text-slate-500">
                      <span>Package Price</span>
                      <span className="text-slate-900 font-bold">Rs. {planInfo.price}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-slate-500">
                      <span>Service Fee</span>
                      <span className="text-slate-900 font-bold">Rs. {serviceFee}</span>
                    </div>
                    {addons.material && <div className="flex justify-between text-sm text-teal-600 font-bold"><span>+ Materials</span><span>Rs. 500</span></div>}
                    {addons.express && <div className="flex justify-between text-sm text-teal-600 font-bold"><span>+ Express</span><span>Rs. 300</span></div>}
                    <div className="h-[1px] bg-slate-100 my-4"></div>
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Payable</span>
                        <span className="text-3xl font-black text-slate-900 leading-none tracking-tight">Rs. {totalPrice}</span>
                    </div>
                </div>
                
                <div className="p-4 bg-teal-50/50 rounded-xl flex items-start gap-3 border border-teal-100">
                    <Shield size={18} className="text-teal-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-teal-800 leading-relaxed uppercase tracking-tight">Your money is held safely in escrow and only released when the job is done.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;