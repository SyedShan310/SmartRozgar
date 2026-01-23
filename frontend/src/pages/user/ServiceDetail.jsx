import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, ShieldCheck, X, MessageSquare, 
  MapPin, ChevronRight, Zap, Target, Award,
  CheckCircle2, Info
} from 'lucide-react';

const MOCK_TASKERS = [
  { 
    id: 1, 
    fullName: "Ahmad Hassan", 
    category: "plumber", 
    rating: "4.9", 
    jobs: "142", 
    location: "Johar Town, Lahore",
    experience: "5+ Years",
    bio: "Certified master plumber specializing in high-pressure systems and residential leak detection.",
    skills: ["Pipe Fitting", "Geyser Repair", "Drain Cleaning"],
    image: "https://images.unsplash.com/photo-1540560712812-320703c31677?q=80&w=200&h=200&auto=format&fit=crop",
    pricing: {
        basic: { title: "Quick Fix", price: "800", desc: "Taps, washers, and minor leak repairs." },
        standard: { title: "Deep Repair", price: "2500", desc: "Geyser installation or internal pipe fixing." },
        premium: { title: "Full Fitting", price: "8000", desc: "Complete bathroom sanitary installation." }
    }
  },
  { 
    id: 4, 
    fullName: "Kamran Siddiqui", 
    category: "plumber", 
    rating: "4.6", 
    jobs: "56", 
    location: "DHA Phase 5, Lahore",
    experience: "3 Years",
    bio: "Professional plumber focused on bathroom renovations and kitchen fittings.",
    skills: ["Taps & Showers", "Kitchen Plumbing", "Water Tank"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop",
    pricing: {
        basic: { title: "Inspection", price: "500", desc: "Visit and diagnosis of the issue." },
        standard: { title: "Installation", price: "1800", desc: "Fitting of new kitchen/bath fixtures." },
        premium: { title: "Full Service", price: "5000", desc: "Complete house water-system maintenance." }
    }
  },
];

const ServiceDetail = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const [filteredTaskers, setFilteredTaskers] = useState([]);
  const [selectedTasker, setSelectedTasker] = useState(null);

  useEffect(() => {
    const results = MOCK_TASKERS.filter(t => t.category.toLowerCase() === serviceName?.toLowerCase());
    setFilteredTaskers(results);
    window.scrollTo(0, 0);
  }, [serviceName]);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-['Inter']">
      
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-gray-200 pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#008080] font-black uppercase text-[11px] tracking-widest mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={16} /> Back to Categories
          </button>
          <h1 className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tight leading-none mb-4">
            Elite <span className="text-[#008080]">{serviceName}</span> Pros
          </h1>
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />)}
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
               {filteredTaskers.length} Verified Experts available in Lahore
             </p>
          </div>
        </div>
      </div>

      {/* TASKERS GRID */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTaskers.map((tasker) => (
            <div 
              key={tasker.id} 
              onClick={() => setSelectedTasker(tasker)} 
              className="group bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:border-[#008080]/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-[#008080]/5 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-8 relative z-10">
                <div className="relative shrink-0">
                  <img src={tasker.image} className="w-32 h-32 rounded-3xl object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" alt={tasker.fullName} />
                  <div className="absolute -bottom-2 -right-2 bg-[#008080] text-white p-1.5 rounded-xl shadow-lg border-4 border-white">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#008080] transition-colors">{tasker.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs font-black text-amber-700">{tasker.rating}</span>
                        </div>
                        <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{tasker.jobs} Completed</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-[#008080] uppercase tracking-widest">Base Rate</p>
                      <p className="text-2xl font-[1000] text-slate-900">Rs.{tasker.pricing.basic.price}</p>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">
                    {tasker.bio}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <MapPin size={14} className="text-[#008080]"/> {tasker.location.split(',')[0]}
                    </div>
                    <span className="flex items-center gap-1 text-slate-900 text-[11px] font-[1000] uppercase tracking-widest group-hover:text-[#008080] transition-all">
                      View Options <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TIERED PRICING MODAL */}
      {selectedTasker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-slate-900/40 overflow-hidden animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedTasker(null)}></div>

          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-y-auto relative z-10 shadow-2xl border border-white">
            
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-gray-100 z-20">
               <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Provider Selection</span>
               <button onClick={() => setSelectedTasker(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-slate-900" />
               </button>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-12">
                
                {/* Side Profile */}
                <div className="lg:w-1/3 space-y-6">
                  <img src={selectedTasker.image} className="w-full aspect-square rounded-[2rem] object-cover shadow-2xl shadow-slate-200" alt="" />
                  <div>
                    <h2 className="text-4xl font-[1000] text-slate-900 tracking-tight">{selectedTasker.fullName}</h2>
                    <p className="text-[#008080] text-xs font-black uppercase tracking-widest mt-1">Verified Professional</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">"{selectedTasker.bio}"</p>
                  </div>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 hover:bg-[#008080] transition-colors">
                    <MessageSquare size={18}/> Contact Agent
                  </button>
                </div>

                {/* Pricing Plans */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-8">
                    <Zap size={18} className="text-[#008080]" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Select your Service Level</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <PlanCard 
                      plan={selectedTasker.pricing.basic} 
                      type="Basic" 
                      onClick={() => navigate(`/book/${selectedTasker.id}`, { state: { plan: 'basic' } })}
                    />
                    <PlanCard 
                      plan={selectedTasker.pricing.standard} 
                      type="Standard" 
                      recommended
                      onClick={() => navigate(`/book/${selectedTasker.id}`, { state: { plan: 'standard' } })}
                    />
                    <PlanCard 
                      plan={selectedTasker.pricing.premium} 
                      type="Premium" 
                      onClick={() => navigate(`/book/${selectedTasker.id}`, { state: { plan: 'premium' } })}
                    />
                  </div>

                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Recent Work Gallery</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-white">
                          <img src={`https://picsum.photos/seed/${selectedTasker.id + i}/300`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all cursor-zoom-in" alt="Portfolio" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// HELPER COMPONENT FOR PRICING
const PlanCard = ({ plan, type, recommended, onClick }) => (
  <div className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col justify-between ${recommended ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-400' : 'bg-white border-gray-100 text-slate-900 hover:border-[#008080]'}`}>
    <div>
      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${recommended ? 'bg-[#008080] text-white' : 'bg-slate-50 text-slate-400'}`}>
        {type}
      </span>
      <h4 className="text-xl font-black mt-4 mb-2 tracking-tight">{plan.title}</h4>
      <p className={`text-[10px] font-bold leading-relaxed mb-6 ${recommended ? 'text-slate-400' : 'text-slate-500'}`}>
        {plan.desc}
      </p>
    </div>
    <div>
      <div className="mb-6">
        <span className="text-2xl font-[1000]">Rs.{plan.price}</span>
      </div>
      <button onClick={onClick} className={`w-full py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${recommended ? 'bg-[#008080] text-white' : 'bg-slate-900 text-white'}`}>
        Select
      </button>
    </div>
  </div>
);

export default ServiceDetail;