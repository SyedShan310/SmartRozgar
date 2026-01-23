import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { Target, Eye, Users, Award, ArrowRight, Zap, ShieldCheck, Globe, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const [animationData, setAnimationData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/icons/about.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Lottie load failed:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-teal-100">
      
      {/* 1. CLEAN TEAL NAV */}

      <main className="flex-grow">
        
        {/* 2. HERO SECTION (Wide & Simple) */}
        <section className="max-w-6xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-teal-50 text-teal-700 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Who we are
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Helping you find <br />
              <span className="text-teal-600 font-bold text-6xl">honest work.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-md">
              SmartRozgar is a simple app made for Pakistan. We help skilled workers find local jobs without any confusion or high fees.
            </p>
            <button onClick={() => navigate('/jobs')} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center gap-3 shadow-lg shadow-teal-100 active:scale-95">
              GET STARTED NOW
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="relative flex justify-center">
            {animationData ? (
              <Lottie animationData={animationData} className="w-full max-w-sm" />
            ) : (
              <div className="w-full aspect-square bg-teal-50 rounded-3xl flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </section>

        {/* 3. THREE CARDS (Teal Borders) */}
        <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "Our Goal", desc: "To help every skilled worker in Pakistan find a job quickly." },
            { icon: Eye, title: "Our Vision", desc: "Making job hunting as easy as sending a WhatsApp message." },
            { icon: Award, title: "Our Values", desc: "We focus on being honest, safe, and helpful for everyone." }
          ].map((card, i) => (
            <div key={i} className="border border-gray-100 bg-white p-8 rounded-2xl hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50 transition-all group">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                 <card.icon size={24} className="text-teal-600 group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </section>

        {/* 4. STATS (Wide Teal Box) */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="bg-teal-600 rounded-[2rem] p-10 lg:p-14 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl shadow-teal-200">
            <div className="lg:w-1/2 text-center lg:text-left">
               <h2 className="text-3xl font-bold mb-4">You are in safe hands</h2>
               <p className="text-teal-50 text-sm max-w-sm opacity-90">We check every profile and job post to make sure your experience is 100% safe.</p>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-8 w-full">
              {[
                { title: "10k+", label: "Workers" },
                { title: "5k+", label: "Clients" },
                { title: "98%", label: "Success" },
                { title: "24/7", label: "Help" }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <h4 className="text-3xl font-bold">{stat.title}</h4>
                  <p className="text-[10px] uppercase font-bold tracking-widest mt-1 opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="py-10 border-t border-gray-50 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">SmartRozgar Pakistan • 2026</p>
      </footer>
    </div>
  );
}