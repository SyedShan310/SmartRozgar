import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  { id: 1, name: 'AC Services', slug: 'ac', icon: '/icons/ac-service.png' },
  { id: 2, name: 'Plumber', slug: 'plumber', icon: '/icons/plumber_icon.png' },
  { id: 3, name: 'Electrician', slug: 'electrician', icon: '/icons/electrician.png' },
  { id: 4, name: 'Handyman', slug: 'handyman', icon: '/icons/technician.png' },
  { id: 5, name: 'Carpenter', slug: 'carpenter', icon: '/icons/carpenter.png' },
  { id: 6, name: 'Painter', slug: 'painter', icon: '/icons/painter.png' },
  { id: 7, name: 'Cleaning', slug: 'cleaning', icon: '/icons/repair.png' },
  { id: 8, name: 'Geyser', slug: 'geyser', icon: '/icons/geyser.png' },
  { id: 9, name: 'Pest Control', slug: 'pest', icon: '/icons/pest-control.png' },
  { id: 10, name: 'Cooking', slug: 'cooking', icon: '/icons/makeupartist.png' },
];

const Services = () => {
  return (
    <section id="services" className="w-full bg-[#f6f7f8] font-['Inter'] py-24 px-4 lg:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl sm:text-5xl font-[1000] mb-6 tracking-tight text-gray-900">
            Professional <span className="text-[#008080]">Services</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Premium home maintenance solutions delivered by verified experts. 
            <span className="text-[#008080] font-semibold"> Efficiency meets excellence.</span>
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/services/${service.slug}`}
              data-aos="fade-up"
              className="group relative h-48 sm:h-56 block"
            >
              <div 
                className="relative bg-white border border-gray-100 rounded-[2.5rem] p-6 h-full flex flex-col justify-center items-center overflow-hidden transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-[#008080]/10 hover:border-[#008080]/30 hover:-translate-y-2"
              >
                {/* Icon Container */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-[#008080]/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#008080]/10">
                  <img 
                    src={service.icon} 
                    alt={service.name}
                    className="w-12 h-12 object-contain transition-all duration-500 opacity-80 group-hover:opacity-100"
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/48x48/F0F9F9/008080/png?text=🛠️";
                    }}
                  />
                </div>
                
                {/* Service Name */}
                <h3 className="relative z-10 text-center text-gray-700 font-bold text-sm sm:text-lg group-hover:text-[#008080] transition-colors tracking-tight">
                  {service.name}
                </h3>

                {/* Subtle Glow Circle on Hover */}
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#008080]/5 rounded-full blur-2xl group-hover:bg-[#008080]/10 transition-all duration-500"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16" data-aos="zoom-in">
        <Link to={"/services"}>
        <button className="group flex items-center mx-auto gap-3 px-10 py-4 bg-white border-2 border-[#008080] text-[#008080] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#008080] hover:text-white transition-all duration-300 shadow-lg shadow-[#008080]/10">
            View All Categories
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;