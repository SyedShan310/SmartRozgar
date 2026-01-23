import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  FileText, Camera, Printer, CheckCircle, 
  Wallet, Star, ShieldCheck, Calendar, MapPin, User, Mail
} from 'lucide-react';

const ProfileGeneral = () => {
  const { userData } = useOutletContext();
  
  const defaultAddress = userData?.address?.find(addr => addr.isDefault) || userData?.address?.[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-8">
      
      {/* 1. Header Area (Wide & Short) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profile Overview</h1>
          <p className="text-sm text-gray-500">Manage your personal details and track your activity.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Printer size={14}/> Print
          </button>
          <button className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-all shadow-md shadow-teal-100">
            Edit Profile
          </button>
        </div>
      </div>

      {/* 2. Main Layout Grid */}
      <div className="grid grid-cols-12 gap-6 items-start">
        
        {/* Left: Quick Identity Card */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm">
          <div className="relative mb-6">
            <img 
              src={userData?.profilePicture || `https://ui-avatars.com/api/?name=${userData?.fullName}&background=0d9488&color=fff`} 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-teal-50 shadow-inner" 
              alt="Profile" 
            />
            <button className="absolute -bottom-2 -right-2 bg-teal-600 p-2.5 rounded-xl shadow-lg text-white hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{userData?.fullName}</h2>
          <div className="mt-4 space-y-2 w-full">
            <div className="flex items-center gap-2 justify-center text-gray-500">
                <Mail size={14} className="text-teal-600" />
                <span className="text-xs font-medium">{userData?.email}</span>
            </div>
            <div className="flex items-center gap-2 justify-center text-gray-500">
                <ShieldCheck size={14} className="text-teal-600" />
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Verified User</span>
            </div>
          </div>
        </div>

        {/* Right: Info Sections */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Info Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Basic Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <InfoBox label="Age / Gender" value={`${userData?.age || '25'}, ${userData?.gender || 'Male'}`} />
                    <InfoBox label="Member Since" value="Jan 2024" />
                </div>
                <InfoBox 
                    label="Current Address" 
                    value={defaultAddress ? `${defaultAddress.houseNo}, ${defaultAddress.street}, ${defaultAddress.city}` : "No address added yet"} 
                />
              </div>
            </div>

            {/* Stats Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Account Stats</h3>
              <div className="space-y-3">
                <StatRow label="Bookings" value={userData?.bookedTasks?.length || 0} icon={<Calendar size={16} />} />
                <StatRow label="Wallet" value={`Rs. ${userData?.walletBalance || 0}`} icon={<Wallet size={16} />} />
                <StatRow label="Rating" value="4.9 / 5.0" icon={<Star size={16} />} />
              </div>
            </div>
          </div>

          {/* Task Status (No scrolling, wider view) */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Jobs</h3>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">Live Updates</span>
            </div>
            
            <div className="space-y-3">
              {userData?.bookedTasks?.length > 0 ? (
                userData.bookedTasks.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-teal-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm border border-gray-100">
                        <CheckCircle size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{task.title || "General Maintenance"}</p>
                        <p className="text-[10px] text-gray-400 font-medium">Booked on: 22 Jan, 2026</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100/50 px-3 py-1.5 rounded-lg uppercase tracking-wider">Scheduled</span>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-gray-400 text-xs font-medium">No active jobs found</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple UI Helpers
const InfoBox = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="font-semibold text-slate-800 text-sm leading-tight">{value || '---'}</p>
  </div>
);

const StatRow = ({ label, value, icon }) => (
  <div className="flex justify-between items-center bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
    <div className="flex items-center gap-3">
      <div className="text-teal-600">{icon}</div>
      <span className="text-xs font-bold text-slate-600">{label}</span>
    </div>
    <span className="font-bold text-slate-900 text-sm">{value}</span>
  </div>
);

export default ProfileGeneral;