import React, { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'; 
import Lottie from 'lottie-react';

const testimonials = [
  { id: 1, name: 'Sarah K.', title: 'Homeowner, Gulberg', rating: 5, review: "I needed urgent plumbing repair, and SmartRozgar was at my door within 30 minutes. The technician was professional and fixed the leak quickly.", avatar: 'SK' },
  { id: 2, name: 'Ahmed R.', title: 'Business Owner, DHA', rating: 5, review: "The AC service was thorough and efficient. They also advised me on energy savings. Truly transparent pricing as promised.", avatar: 'AR' },
  { id: 3, name: 'Hina M.', title: 'Resident, Askari X', rating: 4, review: "Used them for electrical wiring. The work quality was excellent. Communication was clear, and the final result was flawless.", avatar: 'HM' },
  { id: 4, name: 'Usman Z.', title: 'Investor, Model Town', rating: 5, review: "Hired them for full house painting. The team was respectful, fast, and the finish is impeccable. Best experience so far.", avatar: 'UZ' },
  { id: 5, name: 'Fatima L.', title: 'New Mom, Johar Town', rating: 5, review: "Excellent deep cleaning service! They paid attention to every detail and used eco-friendly products. Made my home feel brand new.", avatar: 'FL' },
];

const ClientReviews = () => {
  const [current, setCurrent] = useState(0);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/icons/Review_Animation.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Lottie Error:", err));
  }, []);

  const nextReview = useCallback(() => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, []);

  const prevReview = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextReview, 6000); // 6 seconds for better readability
    return () => clearInterval(interval);
  }, [nextReview]);

  return (
    <section id="client-reviews" className="w-full bg-[#F8FAFB] font-['Inter'] py-24 relative overflow-hidden">
      
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#008080]/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#008080]/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#008080]/10 border border-[#008080]/20 rounded-full text-[#008080] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
             Customer Success
          </div>
          <h2 className="text-4xl sm:text-6xl font-[1000] text-gray-900 mb-6 tracking-tight">
            Voices of <span className="text-[#008080]">Satisfaction</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Join the thousands of happy homeowners who trust <span className="text-gray-900 font-bold">SmartRozgar</span> every day.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left: Animation Showcase */}
          <div className="lg:col-span-5 mb-12 lg:mb-0" data-aos="fade-right">
            <div className="relative aspect-square max-w-md mx-auto bg-white rounded-[3.5rem] border border-gray-100 p-10 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
              {animationData ? (
                <Lottie animationData={animationData} loop={true} className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#008080]/30 font-bold tracking-widest text-xs">LOADING EXPERIENCE...</div>
              )}
              {/* Decorative Teal Blob */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#008080]/10 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Right: Testimonial Card */}
          <div className="lg:col-span-7 relative" data-aos="fade-left">
            <div className="relative bg-white border border-gray-100 rounded-[3rem] p-10 sm:p-16 overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,128,128,0.08)]">
              
              {/* Background Quote Watermark */}
              <Quote className="absolute top-10 right-10 w-24 h-24 text-gray-50" strokeWidth={3} />

              <div className="relative z-10 min-h-[220px] flex flex-col justify-center">
                <div className="flex mb-8 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonials[current].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>

                <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-medium mb-12 italic">
                  "{testimonials[current].review}"
                </p>

                <div className="flex items-center gap-5">
                  {/* Styled Avatar with a slight rotation for character */}
                  <div className="w-16 h-16 rounded-2xl bg-[#008080] flex items-center justify-center text-white font-[1000] text-xl shadow-lg shadow-[#008080]/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-black text-xl leading-none mb-1">{testimonials[current].name}</h4>
                    <p className="text-[#008080] text-xs font-bold uppercase tracking-widest">{testimonials[current].title}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="absolute bottom-10 right-10 flex gap-3">
                <button onClick={prevReview} className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-[#008080] text-gray-400 hover:text-white rounded-xl transition-all shadow-sm active:scale-95">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextReview} className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-[#008080] text-gray-400 hover:text-white rounded-xl transition-all shadow-sm active:scale-95">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Progress Indicators (Pills) */}
            <div className="mt-10 flex justify-center lg:justify-start gap-3">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${i === current ? 'w-14 bg-[#008080]' : 'w-4 bg-gray-200 hover:bg-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientReviews;