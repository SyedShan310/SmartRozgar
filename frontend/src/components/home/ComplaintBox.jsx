import React, { useState, useEffect } from 'react';
import { Send, User, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import Lottie from 'lottie-react';

export default function ComplaintBox() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/icons/Contact2.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Thank you for your feedback! Our priority support team will review your message shortly.');
    setFormData({ name: '', phone: '', message: '' });
  };

  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden font-['Inter']">
      
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#008080]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#008080]/10 border border-[#008080]/20 rounded-full text-[#008080] text-[10px] font-[900] uppercase tracking-[0.2em] mb-6">
             <ShieldCheck size={14} /> Priority Support
          </div>
          <h2 className="text-4xl md:text-6xl font-[1000] text-gray-900 mb-6 tracking-tight">
            Resolving your <span className="text-[#008080]">concerns</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            At <span className="text-gray-900 font-bold">SmartRozgar</span>, your satisfaction is our priority. 
            If something wasn't perfect, let us make it right.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Lottie Animation with Professional Framing */}
          <div className="flex items-center justify-center order-2 lg:order-1" data-aos="fade-right">
            <div className="w-full max-w-md relative">
              <div className="absolute inset-0 bg-[#008080]/5 rounded-[3.5rem] -rotate-3"></div>
              <div className="relative bg-white border border-gray-100 rounded-[3.5rem] p-8 shadow-xl shadow-gray-200/50">
                {animationData ? (
                  <Lottie 
                    animationData={animationData} 
                    loop={true}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="aspect-square flex items-center justify-center">
                    <p className="text-[#008080]/40 font-bold text-xs animate-pulse tracking-widest">ESTABLISHING SECURE CONNECTION...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Clean High-Trust Form */}
          <div className="bg-white rounded-[3rem] border border-gray-100 p-8 sm:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.05)] order-1 lg:order-2" data-aos="fade-left">
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#008080] transition-colors w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#008080] focus:ring-4 focus:ring-[#008080]/5 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#008080] transition-colors w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#008080] focus:ring-4 focus:ring-[#008080]/5 transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                  />
                </div>
              </div>

              <div className="relative group">
                <MessageSquare className="absolute left-5 top-6 text-gray-300 group-focus-within:text-[#008080] transition-colors w-5 h-5" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you today?"
                  rows="5"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#008080] focus:ring-4 focus:ring-[#008080]/5 transition-all resize-none text-gray-900 placeholder:text-gray-400 font-medium"
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full group bg-[#008080] hover:bg-[#006666] text-white font-[1000] py-5 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-lg shadow-[#008080]/20 active:scale-[0.98] uppercase tracking-tighter text-lg"
              >
                Submit Feedback
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 pt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#008080] animate-pulse"></div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">
                  Guaranteed Response within 24 Hours
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}