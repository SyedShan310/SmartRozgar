import React from 'react';

const Working = () => {
  const steps = [
    {
      id: "01",
      title: "Tell us what you need",
      description: "Let us know what service you are looking for. We offer more than 25 different home services with instant booking.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      alt: "Customer calling for service",
      direction: "normal"
    },
    {
      id: "02",
      title: "We find the right pro",
      description: "We match you with licensed, vetted, and top-rated professionals in your area within minutes.",
      image: "https://media.istockphoto.com/id/1587604256/photo/portrait-lawyer-and-black-woman-with-tablet-smile-and-happy-in-office-workplace-african.jpg?s=612x612&w=0&k=20&c=n9yulMNKdIYIQC-Qns8agFj6GBDbiKyPRruaUTh4MKs=",
      alt: "Professional cleaners working",
      direction: "reverse"
    },
    {
      id: "03",
      title: "Sit back and relax",
      description: "Track your pro in real-time and enjoy a job well done. Payment is only released when you're happy.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0c7RvXnuxmgkmBduyZhPsGyY5ytyMn7nxLw&s",
      alt: "Customer relaxing on sofa",
      direction: "normal"
    }
  ];

  return (
    <section id="how-it-works" className="w-full py-24 px-6 bg-white font-['Inter'] relative overflow-hidden">
      
      {/* Background Subtle Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#008080]/5 border border-[#008080]/10 rounded-full text-[#008080] text-xs font-black uppercase tracking-widest mb-6">
             Step-by-Step Guide
          </div>
          <h2 className="text-4xl sm:text-6xl font-[1000] text-gray-900 mb-6 tracking-tight">
            Simple <span className="text-[#008080]">Process</span>
          </h2>
          <p className="max-w-xl text-lg text-gray-500 mx-auto leading-relaxed">
            Getting your home serviced has never been this seamless. Follow our 
            <span className="text-[#008080] font-bold"> 3-step guide</span> to excellence.
          </p>
        </div>

        <div className="relative">
          {/* Central Line - Professional Subtle Teal Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-gray-100 via-[#008080]/20 to-gray-100 z-0"></div>

          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 mb-32 last:mb-0" data-aos={step.direction === 'reverse' ? 'fade-left' : 'fade-right'}>
              
              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-between w-full group">
                
                {/* Side Content Box */}
                <div className={`w-[42%] ${step.direction === 'reverse' ? 'order-3 text-left' : 'order-1 text-right'}`}>
                   <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group-hover:shadow-[0_30px_60px_rgba(0,128,128,0.1)] group-hover:border-[#008080]/20 transition-all duration-500">
                     <span className="inline-block text-[#008080] font-black text-6xl opacity-10 mb-4 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500">{step.id}</span>
                     <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-[#008080] transition-colors">{step.title}</h3>
                     <p className="text-gray-500 text-lg leading-relaxed group-hover:text-gray-700">{step.description}</p>
                   </div>
                </div>

                {/* Center Number Hub (Teal Circle) */}
                <div className="w-[16%] order-2 flex justify-center relative">
                  <div className="bg-[#008080] w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg shadow-[#008080]/30 group-hover:rotate-[360deg] transition-all duration-1000 z-10 border-4 border-white"> 
                    <span className="text-xl font-black text-white">{step.id}</span>
                  </div>
                  {/* Pulse Effect */}
                  <div className="absolute w-16 h-16 bg-[#008080]/20 rounded-3xl animate-ping"></div>
                </div>

                {/* Image Box */}
                <div className={`w-[42%] ${step.direction === 'reverse' ? 'order-1' : 'order-3'}`}>
                    <div className="relative group overflow-hidden rounded-[3rem] h-80 border-8 border-gray-50 shadow-xl transition-all duration-500 group-hover:border-white">
                      <img 
                        src={step.image} 
                        alt={step.alt} 
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#008080]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden flex flex-col items-center text-center space-y-8 px-4">
                 <div className="bg-[#008080] w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl shadow-[#008080]/20">
                   <span className="text-xl font-black text-white">{step.id}</span>
                 </div>
                 
                 <div className="w-full h-64 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                   <img src={step.image} alt={step.alt} className="w-full h-full object-cover" />
                 </div>

                 <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg">
                   <h3 className="text-2xl font-black text-gray-900 mb-3">{step.title}</h3>
                   <p className="text-gray-500 text-base leading-relaxed">{step.description}</p>
                 </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center" data-aos="zoom-in">
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">Ready to start?</p>
           <button className="px-12 py-5 bg-[#008080] text-white font-[1000] rounded-2xl shadow-xl shadow-[#008080]/30 hover:bg-[#006666] transition-all transform hover:scale-105 active:scale-95 uppercase tracking-tighter text-lg">
             Book Your First Service
           </button>
        </div>

      </div>
    </section>
  );
};

export default Working;