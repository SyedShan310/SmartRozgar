import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ShieldCheck, ChevronRight, Star, Grid, Clock, ArrowUpRight } from 'lucide-react';

const allServices = [
  { id: 1, name: 'AC Maintenance', slug: 'ac', category: 'Maintenance', icon: '/icons/ac-service.png', rating: '4.9', reviews: '1.2k', availability: 'Available Now' },
  { id: 2, name: 'Professional Plumbing', slug: 'plumber', category: 'Maintenance', icon: '/icons/plumber_icon.png', rating: '4.8', reviews: '850', availability: 'Available Now' },
  { id: 3, name: 'Electrical Engineering', slug: 'electrician', category: 'Repair', icon: '/icons/electrician.png', rating: '5.0', reviews: '2k', availability: 'Available Now' },
  { id: 4, name: 'General Handyman', slug: 'handyman', category: 'Repair', icon: '/icons/technician.png', rating: '4.7', reviews: '3.4k', availability: 'Available Now' },
  { id: 5, name: 'Master Carpentry', slug: 'carpenter', category: 'Design', icon: '/icons/carpenter.png', rating: '4.9', reviews: '400', availability: 'By Appt.' },
  { id: 6, name: 'Interior Painting', slug: 'painter', category: 'Design', icon: '/icons/painter.png', rating: '4.6', reviews: '1.1k', availability: 'Available Now' },
  { id: 7, name: 'Home Cleaning', slug: 'cleaning', category: 'Cleaning', icon: '/icons/technician.png', rating: '4.8', reviews: '900', availability: 'Available Now' },
  { id: 8, name: 'Cooking Services', slug: 'cooking', category: 'Cleaning', icon: '/icons/technician.png', rating: '4.7', reviews: '600', availability: 'Available Now' },
];

const AllServices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Maintenance', 'Repair', 'Design', 'Cleaning'];

  const filteredServices = allServices.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter'] pb-20">
      {/* 1. TOP SECTION: Balanced Split Header */}
      <div className="max-w-[1440px] mx-auto px-6 pt-10">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 items-stretch">
          
          {/* Left Block: Professional Branding */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-10 relative overflow-hidden flex flex-col justify-center">
             <div className="absolute top-0 right-0 w-40 h-40 bg-[#008080]/5 rounded-bl-full pointer-events-none"></div>
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-[#008080]" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#008080]">Secure & Verified Services</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
               The <span className="text-[#008080]">Elite</span> Professional <br /> Catalog.
             </h1>
             <p className="text-slate-500 text-sm max-w-md font-medium leading-relaxed">
               Select from our rigorously vetted network of specialists for high-standard home and commercial maintenance.
             </p>
          </div>

          {/* Right Block: Functional Control Center */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-10 flex flex-col justify-center">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Search</h3>
                <Clock size={16} className="text-slate-300" />
             </div>
             <div className="relative mb-6 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#008080] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="What service are you looking for?"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-14 pr-6 text-[15px] font-bold outline-none focus:border-[#008080] focus:bg-white transition-all shadow-sm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setActiveCategory(cat)}
                     className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       activeCategory === cat 
                       ? 'bg-slate-900 text-white shadow-lg' 
                       : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-300'
                     }`}
                   >
                     {cat}
                   </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* 2. SERVICES GRID */}
      <div className="max-w-[1440px] mx-auto px-6 mt-16">
        <div className="flex items-center justify-between mb-10 px-4">
           <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-[#008080] rounded-full"></div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Expert Categories</h4>
           </div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-4 py-1.5 rounded-full shadow-sm">
             Verified Directory ({filteredServices.length})
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div 
              key={service.id}
              onClick={() => navigate(`/services/${service.slug}`)}
              className="group bg-white border border-slate-200 rounded-[2rem] p-8 cursor-pointer transition-all duration-300 hover:border-[#008080] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] relative overflow-hidden"
            >
              {/* Top Banner: Rating & Icon */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center transition-all group-hover:bg-teal-50 group-hover:border-[#008080]/30">
                  <img src={service.icon} alt={service.name} className="w-8 h-8 object-contain transition-all group-hover:scale-110" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-[12px] font-black text-slate-900">{service.rating}</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-2">{service.reviews} Reviews</span>
                </div>
              </div>

              {/* Service Title & Details */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                   <div className={`w-2 h-2 rounded-full ${service.availability.includes('Now') ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{service.availability}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight group-hover:text-[#008080] transition-colors">{service.name}</h3>
                <p className="text-slate-400 text-xs font-semibold uppercase mt-1 tracking-widest">{service.category} Specialist</p>
              </div>

              {/* Footer Section */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#008080] bg-teal-50/50 px-3 py-1.5 rounded-lg">
                    <ShieldCheck size={14} /> Certified
                 </div>
                 <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-[#008080] transition-all">
                    <ArrowUpRight size={20} strokeWidth={3} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllServices;