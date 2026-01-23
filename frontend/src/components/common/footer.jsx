import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

// Use your actual logo path here
const LogoImage = '/images/teal-logo.png'; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-100 font-['Inter']">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* Brand Identity */}
          <div className="flex flex-col space-y-8">
            <div className="flex items-center">
              {/* If image is not ready, the text fallback will show */}
              <img 
                src={LogoImage} 
                alt="SmartRozgar Logo" 
                className="h-16 w-auto object-contain transition-transform duration-500 hover:scale-105"
                onError={(e) => { e.target.style.display='none'; }} 
              />
              <span className="text-2xl font-[1000] tracking-tighter text-[#008080]">
                Smart<span className="text-gray-900">Rozgar</span>
              </span>
            </div>

            <p className="text-gray-500 text-base leading-relaxed max-w-xs">
              Redefining the standard of home maintenance. Connecting you with elite professionals for a smarter, safer, and more comfortable lifestyle.
            </p>

            {/* Social Icons - Premium Rounded Style */}
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 bg-gray-50 border border-gray-100 text-gray-400 hover:bg-[#008080] hover:text-white hover:border-[#008080] rounded-xl flex items-center justify-center transition-all duration-300 group shadow-sm"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[11px] mb-8">Navigation</h3>
            <ul className="space-y-4">
              {['Home', 'About Platform', 'Our Services', 'Contact Support'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-[#008080] transition-all text-sm font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#008080] transition-all"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Categories */}
          <div>
            <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[11px] mb-8">Core Services</h3>
            <ul className="space-y-4">
              {['Electrical Solutions', 'Modern Plumbing', 'Interior Painting', 'Smart Cleaning'].map((service) => (
                <li key={service}>
                  <a href="#" className="text-gray-500 hover:text-[#008080] transition-all text-sm font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#008080] transition-all"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[11px] mb-8">Get In Touch</h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-[#008080]/5 rounded-xl flex items-center justify-center text-[#008080]">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Email</span>
                    <a href="mailto:info@smartrozgar.com" className="text-sm font-bold text-gray-700 hover:text-[#008080] transition-colors">
                      info@smartrozgar.com
                    </a>
                </div>
              </li>
              
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-[#008080]/5 rounded-xl flex items-center justify-center text-[#008080]">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Call</span>
                    <a href="tel:+923001234567" className="text-sm font-bold text-gray-700 hover:text-[#008080] transition-colors">
                      +92 300 1234567
                    </a>
                </div>
              </li>

              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-[#008080]/5 rounded-xl flex items-center justify-center text-[#008080]">
                  <MapPin size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Location</span>
                    <span className="text-sm font-bold text-gray-700">Lahore, Punjab, PK</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-[11px] font-medium tracking-wide">
              © {currentYear} <span className="text-gray-900 font-black uppercase">SmartRozgar</span>. Engineered for Excellence.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-gray-400 hover:text-[#008080] text-[11px] font-bold uppercase tracking-widest transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-[#008080] text-[11px] font-bold uppercase tracking-widest transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-[#008080] text-[11px] font-bold uppercase tracking-widest transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}