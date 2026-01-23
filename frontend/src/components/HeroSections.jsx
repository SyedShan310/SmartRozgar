import React, { useState, useEffect } from 'react';
import { Search, Phone } from 'lucide-react';

// Make sure these images exist in your public/images folder
const sliderImages = [
  "/images/cleaning-service2.jpg", 
  "/images/electrician-service.jpg",
  "/images/gardener-service.jpg",
  "/images/plumber-service.jpg",
  "/images/plumber-service.jpg",
];

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const totalImages = sliderImages.length;
  const slidePercentage = 100 / totalImages;

  // Auto-advance slider every 2.5 seconds for a smoother feel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 2500);
    return () => clearInterval(interval);
  }, [totalImages]);

  const handleBookNow = () => {
    console.log("Booking initiated!");
  };

  const goToSlide = (index) => setCurrentImageIndex(index);

  return (
    <section className="min-h-screen font-['Inter'] flex items-center bg-white overflow-hidden">
      <div className="w-full px-4 lg:px-0 grid lg:grid-cols-[50%_50%] gap-8 lg:gap-0 items-center">
        
        {/* Left Column – Content (Clean White Background) */}
        <div className="flex flex-col justify-center space-y-6 p-6 lg:p-16 xl:max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-[1000] leading-[1.1] tracking-tight">
              <span className="text-gray-900">Home</span> <br/>
              <span className="text-[#008080]">Maintenance</span> <br/>
              <span className="text-gray-900">Made</span> <span className="text-[#008080]">Easy!!</span>
            </h1>
          </div>

          <p className="text-lg text-gray-500 max-w-md leading-relaxed">
            Connecting customers and reliable technicians for quick, safe, and affordable bookings in your local area.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleBookNow}
              className="px-10 py-4 bg-[#008080] text-white font-bold rounded-2xl shadow-xl shadow-[#008080]/20 hover:bg-[#006666] transition transform hover:scale-105 active:scale-95"
            >
              Book Now
            </button>

            <button
              aria-label="Call for bookings"
              className="w-14 h-14 flex items-center justify-center bg-white border-2 border-[#008080] text-[#008080] rounded-full shadow-md hover:bg-[#008080] hover:text-white transition-all duration-300"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar - Modern Style */}
          <div className="relative mt-6 max-w-lg group">
            <div className="absolute inset-0 bg-[#008080] blur-lg opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for services (e.g., Plumber)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-5 border-2 border-gray-100 rounded-2xl focus:border-[#008080] transition-all shadow-sm outline-none text-gray-700"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Right Column – Image Slider (The Teal Curved Shape) */}
        <div className="relative w-full h-[500px] lg:h-[85vh] overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000">
          {/* The Teal Viewport with the Rounded Left Side */}
          <div className="absolute inset-0 bg-[#008080] lg:rounded-l-[400px] overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
            
            {/* Horizontal Moving Container */}
            <div
              className="flex h-full transition-transform duration-1000 ease-in-out"
              style={{
                width: `${totalImages * 100}%`,
                transform: `translateX(-${currentImageIndex * slidePercentage}%)`,
              }}
            >
              {sliderImages.map((src, index) => (
                <div key={index} className="h-full relative" style={{ width: `${slidePercentage}%` }}>
                   {/* Darker overlay on image for depth */}
                  <div className="absolute inset-0 bg-black/10 z-10"></div>
                  <img
                    src={src}
                    alt={`Service slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/900x900/008080/FFFFFF/png?text=SmartRozgar+Service";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots Overlayed on the slider */}
          <div className="absolute bottom-10 left-0 right-0 lg:left-20 flex justify-center lg:justify-start space-x-3 z-20">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentImageIndex 
                  ? 'w-10 bg-white shadow-lg' 
                  : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}*
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;