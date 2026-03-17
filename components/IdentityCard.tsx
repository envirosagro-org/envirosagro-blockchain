
import React from 'react';
import { ShieldCheck, Leaf, Globe, Calendar, Fingerprint, Layers, QrCode, Wifi, Activity, Info, Lock, MapPin, BadgeCheck, Stamp } from 'lucide-react';
import { User } from '../types';

interface IdentityCardProps {
  user: User;
  isPrintMode?: boolean;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ user, isPrintMode = false }) => {
  // Generate a QR code containing core identity metadata for registry verification
  const qrData = JSON.stringify({
    esin: user.esin,
    name: user.name,
    role: user.role,
    loc: user.location,
    ver: "EOS-6.5",
    reg: user.regDate
  });
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&bgcolor=050706&color=10b981`;

  return (
    <div className={`flex flex-col gap-6 md:gap-8 w-full max-w-lg mx-auto ${isPrintMode ? 'print:gap-0' : ''} scale-90 sm:scale-100 origin-center`}>
      {/* FRONT OF CARD */}
      <div className={`relative w-full aspect-[1.586/1] group transition-all duration-700 perspective-1000 ${isPrintMode ? 'print-card shadow-none border-black' : 'shadow-3xl'}`}>
        <div className="absolute inset-0 rounded-[20px] md:rounded-[24px] border border-white/20 bg-[#050706] overflow-hidden shadow-2xl">
          
          {/* Security Background Pattern */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20"></div>
          </div>

          {/* Holographic Strip */}
          <div className="absolute top-0 right-12 bottom-0 w-16 bg-gradient-to-b from-transparent via-white/5 to-transparent skew-x-12 animate-hologram pointer-events-none"></div>

          {/* Header Section */}
          <div className="p-4 md:p-6 flex justify-between items-start relative z-10">
            <div className="flex items-center gap-3 md:gap-4">
               <div className="w-10 h-10 md:w-12 md:h-12 agro-gradient rounded-xl flex items-center justify-center shadow-lg border border-white/20 shrink-0">
                  <Leaf className="text-white w-5 h-5 md:w-7 md:h-7" />
               </div>
               <div>
                  <h3 className="text-base md:text-lg font-black text-white uppercase tracking-tighter leading-none italic">Enviros<span className="text-emerald-400">Agro™</span></h3>
                  <p className="text-[7px] md:text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Identity Shard</p>
               </div>
            </div>
            <div className="flex flex-col items-end gap-1">
               <div className="px-2 md:px-3 py-0.5 md:py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center gap-1.5 md:gap-2">
                  <ShieldCheck className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-400" />
                  <span className="text-[7px] md:text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none">Authenticated</span>
               </div>
               <p className="text-[5px] md:text-[6px] text-slate-700 font-mono font-black uppercase tracking-widest mt-1">REGISTRY: v6.5</p>
            </div>
          </div>

          {/* Main Info Area */}
          <div className="px-5 md:px-8 flex gap-4 md:gap-8 relative z-10 mt-1 md:mt-2">
            <div className="flex-1 space-y-4 md:space-y-6 overflow-hidden">
              <div className="space-y-0.5 md:space-y-1">
                 <p className="text-[6px] md:text-[7px] text-slate-600 font-black uppercase tracking-widest">Steward Designation</p>
                 <h4 className="text-xl md:text-2xl font-black text-white truncate drop-shadow-md tracking-tight uppercase italic">{user.name}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                 <div className="overflow-hidden">
                    <p className="text-[6px] md:text-[7px] text-slate-600 font-black uppercase tracking-widest">Pillar Thrust</p>
                    <p className="text-[9px] md:text-[11px] text-slate-200 font-bold uppercase truncate tracking-tight flex items-center gap-1 mt-0.5 md:mt-1">
                       <Activity className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-400 shrink-0" /> {user.role}
                    </p>
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-[6px] md:text-[7px] text-slate-600 font-black uppercase tracking-widest">Node</p>
                    <p className="text-[9px] md:text-[11px] text-slate-200 font-bold uppercase truncate tracking-tight flex items-center gap-1 mt-0.5 md:mt-1">
                       <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-500 shrink-0" /> {user.location.split(',')[0]}
                    </p>
                 </div>
              </div>

              <div className="pt-1 md:pt-2 flex items-center gap-4 md:gap-6">
                 <div className="space-y-0.5">
                    <p className="text-[5px] md:text-[6px] text-slate-700 font-black uppercase tracking-widest">Resilience</p>
                    <p className="text-[10px] md:text-xs font-mono font-black text-blue-400">x{user.wallet.exchangeRate.toFixed(2)}</p>
                 </div>
                 <div className="w-px h-5 md:h-6 bg-white/5"></div>
                 <div className="space-y-0.5">
                    <p className="text-[5px] md:text-[6px] text-slate-700 font-black uppercase tracking-widest">Growth</p>
                    <p className="text-[10px] md:text-xs font-mono font-black text-emerald-400">+{user.metrics.agriculturalCodeU.toFixed(2)}</p>
                 </div>
              </div>
            </div>

            {/* Photo & QR Section */}
            <div className="w-24 md:w-36 flex flex-col items-center gap-3 md:gap-4 shrink-0 mt-0">
               <div className="w-full aspect-square rounded-xl md:rounded-2xl bg-black border border-emerald-500/20 p-1 md:p-2 relative overflow-hidden group/qr shadow-2xl flex items-center justify-center">
                  <img src={qrUrl} alt="Identity QR" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 border border-emerald-500/10 pointer-events-none"></div>
               </div>
               <div className="w-full flex gap-1 md:gap-2">
                  <div className="flex-1 p-1 md:p-2 bg-black/60 rounded-lg md:rounded-xl border border-white/5 flex items-center justify-center shadow-inner">
                     <Fingerprint className="w-3 h-3 md:w-4 md:h-4 text-emerald-500/30 animate-pulse" />
                  </div>
                  <div className="flex-1 p-1 md:p-2 bg-black/60 rounded-lg md:rounded-xl border border-white/5 flex items-center justify-center shadow-inner">
                     <BadgeCheck className="w-3 h-3 md:w-4 md:h-4 text-blue-500/30" />
                  </div>
               </div>
            </div>
          </div>

          {/* Footer ID Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black to-transparent flex items-end justify-between z-10">
             <div className="space-y-0.5 md:space-y-1">
                <p className="text-[6px] md:text-[7px] text-slate-700 font-black uppercase tracking-[0.2em]">Social Identification (ESIN)</p>
                <p className="text-sm md:text-xl font-mono font-black text-white tracking-[0.1em] leading-none">{user.esin}</p>
             </div>
             <div className="text-right">
                <p className="text-[6px] md:text-[7px] text-slate-800 font-black uppercase tracking-widest mb-0.5 md:mb-1">Issue Shard</p>
                <p className="text-[8px] md:text-[10px] font-mono text-slate-500 font-bold leading-none">{user.regDate.replace(/\//g, '.')}</p>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hologram {
          0% { background-position: 0% 50%; opacity: 0; }
          50% { background-position: 100% 50%; opacity: 0.15; }
          100% { background-position: 0% 50%; opacity: 0; }
        }
        .animate-hologram { background-size: 200% 200%; animation: hologram 10s ease infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default IdentityCard;
