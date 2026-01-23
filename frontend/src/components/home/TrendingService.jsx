import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ArrowRight, TrendingUp } from 'lucide-react';

const trendingServiceData = [
  { id: 1, image: '/images/plumber-service.jpg', title: 'Door Lock Repair', rating: 4.8, originalPrice: '3500', discountedPrice: '3000' },
  { id: 2, image: '/images/plumber-service.jpg', title: 'AC Installation', rating: 4.4, originalPrice: '3000', discountedPrice: '2500' },
  { id: 3, image: '/images/gardener-service.jpg', title: 'UPS Installation', rating: 4.6, originalPrice: '1500', discountedPrice: '1300' },
  { id: 4, image: '/images/electrician-service.jpg', title: 'Wall Painting', rating: 4.7, originalPrice: '6000', discountedPrice: '5500' },
  { id: 5, image: '/images/cleaning-service.jpg', title: 'Pest Control', rating: 4.5, originalPrice: '2000', discountedPrice: '1800' },
];

const TrendingServicesSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const sliderRef = useRef(null);
  const totalCards = trendingServiceData.length;

  const getCardStep = useCallback(() => {
    if (sliderRef.current && sliderRef.current.firstChild) {
        const firstCard = sliderRef.current.firstChild;
        const width = firstCard.offsetWidth;
        const marginRight = 24; 
        return width + marginRight;
    }
    return 344;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const step = getCardStep();
        const nextIndex = (currentIndex + 1) % totalCards;
        sliderRef.current.scrollTo({ left: nextIndex * step, behavior: 'smooth' });
        setCurrentIndex(nextIndex);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, totalCards, getCardStep]);

  const handleScroll = () => {
    if (sliderRef.current) {
      const step = getCardStep();
      const newIndex = Math.round(sliderRef.current.scrollLeft / step);
      setCurrentIndex(Math.max(0, Math.min(newIndex, totalCards - 1)));
    }
  };

  return (
    <section className="w-full bg-[#F8FAFB] font-['Inter'] py-24 px-6 lg:px-20 overflow-hidden">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12 items-center">
        
        {/* Left Content Area */}
        <div className="space-y-6 text-center lg:text-left" data-aos="fade-right">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-[#008080] font-bold tracking-widest uppercase text-xs">
            <TrendingUp className="w-4 h-4" />
            Trending This Week
          </div>
          <h2 className="text-4xl sm:text-5xl font-[1000] text-gray-900 leading-[1.1] tracking-tight">
            Our Most Popular <br />
            <span className="text-[#008080]">Services</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
            Join thousands of satisfied customers who trust our top-rated 
            technicians for their daily needs.
          </p>
          <button className="hidden lg:flex items-center gap-2 text-[#008080] font-black uppercase text-xs tracking-widest group hover:text-gray-900 transition-colors">
            View all deals <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Right Slider Area */}
        <div className="relative" data-aos="fade-left">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10 px-2" 
            onScroll={handleScroll}
          >
            {trendingServiceData.map((service) => (
              <div key={service.id} className="flex-shrink-0 w-[85%] sm:w-80 snap-start mr-6 group">
                <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-[#008080]/20 hover:shadow-[0_25px_50px_-12px_rgba(0,128,128,0.15)]">
                  
                  {/* Service Image with Badge */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <div className="absolute top-4 left-4 z-20 bg-[#008080] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      Top Rated
                    </div>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Service Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#008080] transition-colors leading-tight">
                        {service.title}
                      </h3>
                      <div className="flex items-center bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-[11px] font-black text-gray-700">{service.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter line-through">Rs {service.originalPrice}</span>
                        <span className="text-[#008080] text-2xl font-[1000] tracking-tighter">Rs {service.discountedPrice}</span>
                      </div>
                      <button className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl group-hover:bg-[#008080] group-hover:text-white transition-all text-gray-400 shadow-sm">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center lg:justify-start space-x-3 mt-4 ml-2">
            {trendingServiceData.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  index === currentIndex ? 'w-10 bg-[#008080]' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingServicesSlider;