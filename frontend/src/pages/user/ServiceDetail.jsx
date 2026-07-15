import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, ShieldCheck, X, MessageSquare,
  MapPin, ChevronRight, Zap, Loader2, AlertCircle
} from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { SERVICE_SLUGS, formatTasker } from '../../lib/services';

const ServiceDetail = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const [taskers, setTaskers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTasker, setSelectedTasker] = useState(null);

  const serviceInfo = SERVICE_SLUGS[serviceName?.toLowerCase()] || { label: serviceName, skill: serviceName };

  useEffect(() => {
    const fetchTaskers = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/taskers?service=${serviceName}`);
        if (res.data.success) {
          setTaskers(res.data.taskers.map(formatTasker));
        }
      } catch (err) {
        console.error('Failed to load taskers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskers();
    window.scrollTo(0, 0);
  }, [serviceName]);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-['Inter']">

      <div className="bg-white border-b border-gray-200 pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-[#008080] font-black uppercase text-[11px] tracking-widest mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={16} /> Back to Categories
          </button>
          <h1 className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tight leading-none mb-4">
            Elite <span className="text-[#008080]">{serviceInfo.label}</span> Pros
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            {loading ? 'Loading...' : `${taskers.length} Verified Experts available`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-teal-600" size={40} />
          </div>
        ) : taskers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <AlertCircle size={40} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-800">No taskers found yet</h3>
            <p className="text-slate-500 text-sm mt-2">Try posting a public job instead — taskers will apply.</p>
            <button
              onClick={() => navigate('/create-job')}
              className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Post a Public Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {taskers.map((tasker) => (
              <div
                key={tasker.id}
                onClick={() => setSelectedTasker(tasker)}
                className="group bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:border-[#008080]/30 transition-all cursor-pointer shadow-sm hover:shadow-xl"
              >
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="relative shrink-0">
                    <img src={tasker.image} className="w-32 h-32 rounded-3xl object-cover" alt={tasker.fullName} />
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
                          <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{tasker.jobs} Jobs</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[#008080] uppercase tracking-widest">From</p>
                        <p className="text-2xl font-[1000] text-slate-900">Rs.{tasker.pricing.basic.price}</p>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">{tasker.bio}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <MapPin size={14} className="text-[#008080]" /> {tasker.location}
                      </div>
                      <span className="flex items-center gap-1 text-slate-900 text-[11px] font-[1000] uppercase tracking-widest group-hover:text-[#008080] transition-all">
                        Book Now <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTasker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-slate-900/40 overflow-hidden">
          <div className="absolute inset-0" onClick={() => setSelectedTasker(null)} />
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-y-auto relative z-10 shadow-2xl">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-gray-100 z-20">
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Select Service Level</span>
              <button onClick={() => setSelectedTasker(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-6">
                  <img src={selectedTasker.image} className="w-full aspect-square rounded-[2rem] object-cover shadow-xl" alt="" />
                  <h2 className="text-4xl font-[1000] text-slate-900">{selectedTasker.fullName}</h2>
                  <p className="text-slate-500 text-sm italic">"{selectedTasker.bio}"</p>
                  <button
                    onClick={() => navigate('/chat', { state: { tasker: selectedTasker } })}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 hover:bg-[#008080] transition-colors"
                  >
                    <MessageSquare size={18} /> Message
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-8">
                    <Zap size={18} className="text-[#008080]" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Choose Package</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['basic', 'standard', 'premium'].map((plan, i) => (
                      <PlanCard
                        key={plan}
                        plan={selectedTasker.pricing[plan]}
                        type={plan.charAt(0).toUpperCase() + plan.slice(1)}
                        recommended={plan === 'standard'}
                        onClick={() => navigate(`/book/${selectedTasker.id}`, {
                          state: { plan, tasker: selectedTasker, service: serviceInfo.skill },
                        })}
                      />
                    ))}
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

const PlanCard = ({ plan, type, recommended, onClick }) => (
  <div className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col justify-between ${recommended ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-gray-100 text-slate-900 hover:border-[#008080]'}`}>
    <div>
      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${recommended ? 'bg-[#008080] text-white' : 'bg-slate-50 text-slate-400'}`}>{type}</span>
      <h4 className="text-xl font-black mt-4 mb-2">{plan.title}</h4>
      <p className={`text-[10px] font-bold leading-relaxed mb-6 ${recommended ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
    </div>
    <div>
      <div className="mb-6"><span className="text-2xl font-[1000]">Rs.{plan.price}</span></div>
      <button onClick={onClick} className={`w-full py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest ${recommended ? 'bg-[#008080] text-white' : 'bg-slate-900 text-white'}`}>
        Book Now
      </button>
    </div>
  </div>
);

export default ServiceDetail;
