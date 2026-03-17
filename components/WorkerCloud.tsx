
import React from 'react';
import { Search, UserCheck, MapPin, Star, ShieldCheck, Mail } from 'lucide-react';

const WorkerCloud: React.FC = () => {
  const workers = [
    { id: '1', name: 'Dr. Sarah Chen', role: 'Soil Scientist', score: 98, hours: 2400, location: 'California, USA', status: 'Available' },
    { id: '2', name: 'Marcus T.', role: 'Hydroponics Op', score: 85, hours: 820, location: 'Nairobi, Kenya', status: 'In Mission' },
    { id: '3', name: 'Elena Rodriguez', role: 'Permaculture Designer', score: 92, hours: 1560, location: 'Valencia, Spain', status: 'Available' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Talent Ecosystem</h3>
          <p className="text-sm text-slate-500">Verified skilled laborers and agro-experts based on blockchain history</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <UserCheck className="w-3 h-3" />
          {workers.length * 42}+ Verified Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <div key={worker.id} className="glass-card rounded-3xl p-6 hover:translate-y-[-4px] transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center relative">
                  <span className="text-lg font-bold text-slate-400">{worker.name.split(' ').map(n => n[0]).join('')}</span>
                  {worker.status === 'Available' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050706]"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white">{worker.name}</h4>
                  <p className="text-xs text-emerald-400 font-medium">{worker.role}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold">{worker.score}%</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">U-Score</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{worker.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{worker.hours} Verified Hours</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold text-slate-300 transition-all">
                View Dossier
              </button>
              <button className="flex-1 py-3 agro-gradient rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
                <Mail className="w-4 h-4" /> Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerCloud;
