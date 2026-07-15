import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sliderImages = [
  "/images/cleaning-service2.jpg", 
  "/images/electrician-service.jpg",
  "/images/gardener-service.jpg",
  "/images/plumber-service.jpg",
  "/images/plumber-service.jpg",
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const totalImages = sliderImages.length;
  const slidePercentage = 100 / totalImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 3500); // Slightly slower for a more professional feel
    return () => clearInterval(interval);
  }, [totalImages]);

  const handleBookNow = () => {
    navigate('/services');
  };

  const handleCreateJob = () => {
    navigate('/create-job');
  };

  return (
    <section className="relative w-full bg-white overflow-hidden pt-6 pb-10 font-['Inter']">
      <div className="w-full px-4 lg:px-0 grid lg:grid-cols-[42%_58%] items-center">
        
        {/* Left Column – Content */}
        <div className="flex flex-col justify-center space-y-6 p-6 lg:pl-20 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-[1000] leading-[1.05] tracking-tighter">
              <span className="text-gray-900">Home</span> <br/>
              <span className="text-[#008080]">Maintenance</span> <br/>
              <span className="text-gray-900">Made</span> <span className="text-[#008080]">Simple</span>
            </h1>
          </div>

          <p className="text-base text-gray-500 max-w-sm leading-relaxed font-medium">
            Connect with verified technicians for quick, safe, and professional home services in your local area.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleBookNow}
              className="flex-1 sm:flex-none px-8 py-4 bg-[#008080] text-white text-[13px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-teal-900/10 hover:bg-[#006666] transition-all flex items-center justify-center gap-2 group"
            >
              Book Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleCreateJob}
              className="flex-1 sm:flex-none px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create Job
            </button>
          </div>

          {/* Refined Search Bar */}
          <div className="relative mt-6 max-w-md">
            <div className="relative group">
              <input
                type="text"
                placeholder="Find a service (e.g. Plumber, AC Repair)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4.5 border-2 border-gray-100 rounded-2xl focus:border-[#008080] focus:bg-white bg-gray-50 transition-all outline-none text-sm font-semibold text-gray-700"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#008080] transition-colors" />
            </div>
          </div>
        </div>

        {/* Right Column – Image Slider */}
        <div className="relative w-full h-[450px] lg:h-[85vh] overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="absolute inset-0 lg:rounded-l-[400px] overflow-hidden bg-gray-100 border-l border-gray-200">
            <div
              className="flex h-full transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
              style={{
                width: `${totalImages * 100}%`,
                transform: `translateX(-${currentImageIndex * slidePercentage}%)`,
              }}
            >
              {sliderImages.map((src, index) => (
                <div key={index} className="h-full relative" style={{ width: `${slidePercentage}%` }}>
                  <img
                    src={src}
                    alt={`Service slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle vignette for a more professional photo look */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;