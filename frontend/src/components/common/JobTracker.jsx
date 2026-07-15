import React from 'react';
import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';

const STEPS = [
  { key: 'pending',     label: 'Posted',    desc: 'Job created' },
  { key: 'accepted',    label: 'Accepted',  desc: 'Tasker confirmed' },
  { key: 'in-progress', label: 'In Progress', desc: 'Work started' },
  { key: 'completed',   label: 'Completed', desc: 'Job finished' },
];

const STATUS_ORDER = ['pending', 'accepted', 'in-progress', 'completed'];

const JobTracker = ({ job, compact = false }) => {
  if (!job) return null;
  if (job.status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl">
        <XCircle size={18} className="text-red-500" />
        <span className="text-sm font-bold text-red-600 uppercase">Job Cancelled</span>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(job.status);

  if (compact) {
    return (
      <div className="flex items-center gap-1 w-full">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.key}>
            <div className={`h-2 flex-1 rounded-full transition-all ${i <= currentIdx ? 'bg-teal-500' : 'bg-slate-100'}`} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Clock size={12} className="text-teal-600" /> Job Tracking
      </h3>

      {/* Progress bar */}
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                i < currentIdx ? 'bg-teal-600 border-teal-600 text-white' :
                i === currentIdx ? 'bg-white border-teal-600 text-teal-600 shadow-lg shadow-teal-100' :
                'bg-white border-slate-200 text-slate-300'
              }`}>
                {i < currentIdx ? <CheckCircle2 size={16} /> : <Circle size={12} fill={i === currentIdx ? 'currentColor' : 'none'} />}
              </div>
              <p className={`text-[9px] font-black uppercase mt-2 text-center ${i <= currentIdx ? 'text-teal-600' : 'text-slate-400'}`}>
                {step.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 -mt-5 ${i < currentIdx ? 'bg-teal-500' : 'bg-slate-100'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Timeline history */}
      {job.statusHistory?.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-4 space-y-3 max-h-48 overflow-y-auto">
          {[...job.statusHistory].reverse().map((entry, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-700 capitalize">{entry.status.replace('-', ' ')}</p>
                <p className="text-[10px] text-slate-500">{entry.note}</p>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                  {new Date(entry.at).toLocaleString()} · {entry.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobTracker;
