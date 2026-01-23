import React from 'react';
import { Award, DollarSign, Zap, Shield, Clock, Smile } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Certified Professionals',
    description: 'Our team comprises rigorously vetted and highly skilled experts to ensure top-quality service.',
  },
  {
    icon: DollarSign,
    title: 'Transparent Pricing',
    description: 'No hidden fees. You get a clear, upfront estimate before any work begins.',
  },
  {
    icon: Zap,
    title: 'Quick Response',
    description: 'We prioritize rapid response times to be at your doorstep quickly when you need us.',
  },
  {
    icon: Shield,
    title: 'Safety & Warranty',
    description: 'All services come with a warranty and our staff adhere to strict safety protocols.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'We respect your schedule. Our professionals arrive on time and complete the job promptly.',
  },
  {
    icon: Smile,
    title: '100% Satisfaction',
    description: 'Your happiness is our goal. If you are not satisfied, we will make it right.',
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="w-full font-['Inter'] py-24 bg-white overflow-hidden relative">
      
      {/* Soft Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-[#008080]/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#008080]/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#008080]/5 border border-[#008080]/10 rounded-full text-[#008080] text-xs font-black uppercase tracking-widest mb-6">
             The SmartRozgar Advantage
          </div>
          <h2 className="text-4xl sm:text-6xl font-[1000] mb-6 tracking-tight text-gray-900 leading-tight">
            Why Trust <span className="text-[#008080]">Us?</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We don't just fix things, we offer peace of mind. Experience the 
            <span className="text-[#008080] font-bold"> gold standard</span> of home maintenance.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group relative p-10 rounded-[2.5rem] bg-white border border-gray-100 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,128,128,0.15)] hover:border-[#008080]/20 hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#008080]/5 flex items-center justify-center mb-8 border border-[#008080]/10 group-hover:bg-[#008080] transition-all duration-500 shadow-sm">
                <reason.icon className="w-8 h-8 text-[#008080] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#008080] transition-colors">
                {reason.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors">
                {reason.description}
              </p>

              {/* Bottom Line Accent */}
              <div className="absolute bottom-8 left-10 w-8 h-1 bg-gray-100 group-hover:w-16 group-hover:bg-[#008080] transition-all duration-500 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-20 p-10 rounded-[2.5rem] bg-[#F8FAFB] border border-gray-100 text-center relative overflow-hidden" data-aos="zoom-in">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <p className="relative z-10 text-gray-400 text-xs sm:text-sm uppercase tracking-[0.4em] font-black">
                Trusted by over <span className="text-[#008080] text-lg sm:text-xl ml-2">50,000+</span> Households
            </p>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;