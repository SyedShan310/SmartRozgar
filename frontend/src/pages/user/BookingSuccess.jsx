import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, ArrowRight } from 'lucide-react';

const BookingSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const job = state?.job;
  const tasker = state?.tasker;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-['Inter']">
      <div className="max-w-lg w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-teal-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h1>
        <p className="text-slate-500 text-sm mb-8">
          Your job has been sent to <strong>{tasker?.fullName || 'the tasker'}</strong>. They will accept and start work soon.
        </p>

        {job && (
          <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3 mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Summary</p>
            <p className="font-black text-slate-800">{job.title}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar size={14} className="text-teal-600" />
              {new Date(job.date).toDateString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={14} className="text-teal-600" />
              {job.address?.city}
            </div>
            <p className="text-lg font-black text-teal-600">Rs. {job.price?.toLocaleString()}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/profile/tasks')} className="w-full py-4 bg-teal-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-all">
            View My Jobs <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/')} className="w-full py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
