import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';

const allServices = [
  { id: 1, name: 'AC Services', icon: '/icons/ac-service.png', description: 'Expert repair, precision cleaning, and gas charging for all brands.' },
  { id: 2, name: 'Plumber', icon: '/icons/plumber_icon.png', description: 'Fixing leaks, pipe maintenance, and professional sanitary installations.' },
  { id: 3, name: 'Electrician', icon: '/icons/electrician.png', description: 'Wiring solutions, short circuit repairs, and electronics maintenance.' },
  { id: 4, name: 'Handyman', icon: '/icons/technician.png', description: 'Reliable general repairs and comprehensive home maintenance.' },
  { id: 5, name: 'Carpenter', icon: '/icons/carpenter.png', description: 'Bespoke furniture repair and master woodwork expertise.' },
  { id: 6, name: 'Painter', icon: '/icons/painter.png', description: 'Premium interior and exterior wall painting with quality finishes.' },
  { id: 7, name: 'Home Appliances', icon: '/icons/repair.png', description: 'Fridge, washing machine, and kitchen appliance restoration.' },
  { id: 8, name: 'Geyser', icon: '/icons/geyser.png', description: 'Specialized installation and repair of all water heating systems.' },
  { id: 9, name: 'Pest Control', icon: '/icons/pest-control.png', description: 'Safe, effective termite and general pest elimination protocols.' },
  { id: 10, name: 'Makeup Artist', icon: '/icons/makeupartist.png', description: 'Professional party and bridal makeup for your special occasions.' },
];

const AllServices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = allServices.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigate = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/services/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-['Inter'] pb-32">
      
      {/* 1. Refined Search Header */}
      <div className="relative pt-32 pb-24 px-6 lg:px-20 overflow-hidden bg-white border-b border-gray-100">
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#008080]/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-50 border border-slate-100 rounded-full mb-8">
            <Sparkles size={14} className="text-[#008080]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Official Service Directory</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-[1000] text-slate-900 tracking-tighter mb-10 leading-none">
            Our <span className="text-[#008080]">Professional</span> Catalog
          </h1>

          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#008080] transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="What are you looking for today?"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] py-7 pl-16 pr-8 text-lg font-bold outline-none focus:border-[#008080]/30 focus:bg-white transition-all shadow-xl shadow-slate-200/50 placeholder:text-slate-300"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 2. Service Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-24">
        <div className="flex items-center justify-between mb-16">
            <div>
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#008080] mb-2">Available Experts</h3>
                <div className="h-1.5 w-12 bg-slate-900 rounded-full"></div>
            </div>
            <p className="text-[11px] font-black text-slate-400 bg-white border border-slate-100 px-5 py-2.5 rounded-2xl uppercase tracking-[0.1em] shadow-sm">
                Showing {filteredServices.length} Categories
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              onClick={() => handleNavigate(service.name)}
              className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-10 cursor-pointer hover:border-[#008080]/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-[#008080]/10 hover:-translate-y-2 flex flex-col items-center text-center"
            >
              {/* Icon Container */}
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 mb-8 group-hover:bg-[#008080] group-hover:rotate-6 transition-all duration-500">
                <img 
                  src={service.icon} 
                  alt={service.name} 
                  className="w-10 h-10 object-contain brightness-0 group-hover:invert transition-all duration-500" 
                />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{service.name}</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8 line-clamp-2">
                {service.description}
              </p>

              <div className="mt-auto w-full flex items-center justify-center gap-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#008080]">
                    <Zap size={12} className="fill-[#008080]" /> Instant
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <Shield size={12} /> Verified
                </div>
              </div>

              {/* Float-in Action Button */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[#008080] text-white p-2 rounded-xl shadow-lg shadow-[#008080]/20">
                 <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>

        {/* 3. High-Contrast Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-40 bg-white border-2 border-dashed border-slate-100 rounded-[4rem]">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="text-slate-200" size={40} />
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">No matches found</h4>
            <p className="text-slate-400 font-bold text-sm mb-8">Try searching for broader terms like "Repair" or "Fix"</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#008080] transition-colors shadow-lg shadow-slate-200"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllServices;