
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Loader2, 
  RefreshCw, 
  Send, 
  ShieldAlert, 
  Fingerprint, 
  Lock, 
  CheckCircle2, 
  Globe, 
  Zap,
  ArrowRight,
  Monitor,
  Activity,
  Network,
  Database,
  SearchCode,
  SmartphoneNfc,
  BadgeCheck,
  Binary,
  Workflow,
  /* Added Globe2 import to fix error on line 205 */
  Globe2
} from 'lucide-react';
import { refreshAuthUser, sendVerificationShard, signOutSteward } from '../services/firebaseService';
import { SycamoreLogo } from '../App';

interface VerificationHUDProps {
  userEmail: string;
  onVerified: () => void;
  onLogout: () => void;
}

const VerificationHUD: React.FC<VerificationHUDProps> = ({ userEmail, onVerified, onLogout }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [calibrationPhase, setCalibrationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCalibrationPhase(p => (p + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    setIsRefreshing(true);
    setStatusMessage("PROBING_NODE_SIGNATURE...");
    try {
      const user = await refreshAuthUser();
      if (user?.emailVerified) {
        onVerified();
      } else {
        setStatusMessage("REGISTRY_PENDING: Email shard not detected on-chain.");
      }
    } catch (e) {
      setStatusMessage("SYNC_ERROR: Quorum timeout.");
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setTimeout(() => setStatusMessage(null), 4000);
      }, 1500);
    }
  };

  const resendShard = async () => {
    setIsResending(true);
    setStatusMessage("DISPATCHING_NEW_SHARD...");
    try {
      await sendVerificationShard();
      setStatusMessage("SHARD_TRANSMITTED: New handshake dispatched.");
    } catch (e) {
      setStatusMessage("TRANSMISSION_FAILED: Rate limit hit.");
    } finally {
      setTimeout(() => {
        setIsResending(false);
        setTimeout(() => setStatusMessage(null), 4000);
      }, 1500);
    }
  };

  const CALIBRATION_STEPS = [
    { label: 'QUORUM_HEARTBEAT', status: 'ACTIVE', col: 'text-indigo-400', icon: Activity },
    { label: 'ZK_IDENTITY_RESONANCE', status: 'PENDING', col: 'text-blue-400', icon: Fingerprint },
    { label: 'INGEST_PARITY_CHECK', status: 'WAITING', col: 'text-emerald-400', icon: Database },
    { label: 'FINALITY_ANCHOR', status: 'LOCKED', col: 'text-amber-500', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-1000 bg-[#020403]">
      {/* Immersive Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15)_0%,_transparent_70%)]"></div>
         <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <Network size={1200} className="text-white opacity-[0.02] animate-spin-slow" />
         </div>
      </div>

      <div className="glass-card p-10 md:p-20 rounded-[80px] border-indigo-500/20 bg-black/60 shadow-[0_60px_180px_rgba(0,0,0,0.95)] w-full max-w-4xl text-center space-y-14 relative overflow-hidden group z-10 border-2">
         
         {/* Vertical Scanline */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0">
            <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/40 to-transparent absolute top-0 animate-scan"></div>
         </div>

         <div className="flex flex-col items-center gap-10 relative z-10">
            <div className="relative group">
               <div className="w-32 h-32 md:w-44 md:h-44 bg-indigo-600/10 border-4 border-indigo-500/30 rounded-[56px] flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.2)] animate-pulse relative overflow-hidden">
                  <Fingerprint className="w-16 h-16 md:w-24 md:h-24 text-indigo-400" />
                  <div className="absolute inset-0 bg-white/5 animate-scan"></div>
               </div>
               <div className="absolute inset-[-20px] border-2 border-dashed border-indigo-500/20 rounded-[72px] animate-spin-slow"></div>
            </div>
            <div className="space-y-4">
               <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">REGISTRY <span className="text-indigo-400">CALIBRATION.</span></h1>
               <p className="text-slate-500 text-[10px] md:text-[12px] font-black uppercase tracking-[1em] font-mono opacity-60">NODE_AUTH_SEQUENCE_v6.5</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            {/* User Context Area */}
            <div className="space-y-8 text-left">
               <div className="p-10 bg-black/80 rounded-[56px] border-2 border-white/5 space-y-8 shadow-inner relative overflow-hidden group/box">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/box:scale-110 transition-transform"><Mail size={200} /></div>
                  <div className="flex items-center gap-5 border-b border-white/5 pb-6">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 shadow-xl border border-white/10">
                        <Monitor size={24} />
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Steward Node</span>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest">INGEST_IDENTIFIER</p>
                        <p className="text-2xl font-mono font-black text-white italic truncate tracking-tight">{userEmail}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="px-4 py-1.5 bg-rose-600/10 border border-rose-500/30 rounded-lg text-rose-500 text-[8px] font-black uppercase tracking-widest animate-pulse">
                           UNVERIFIED_SIGNATURE
                        </div>
                     </div>
                  </div>
               </div>
               
               <p className="text-slate-500 text-lg italic leading-relaxed px-6 font-medium">
                  "Registry sharding is prohibited until your biometric email signature is detected by the root node quorum."
               </p>
            </div>

            {/* Calibration Status Area */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] text-center border-b border-white/5 pb-4 italic">HANDSHAKE_METRICS</h4>
               <div className="grid grid-cols-1 gap-3">
                  {CALIBRATION_STEPS.map((step, idx) => (
                    <div key={idx} className={`p-6 rounded-[32px] border-2 transition-all duration-700 flex items-center justify-between shadow-xl ${idx <= calibrationPhase ? 'bg-black/60 border-indigo-500/40 opacity-100' : 'bg-white/5 border-transparent opacity-20'}`}>
                       <div className="flex items-center gap-4">
                          <step.icon size={20} className={idx <= calibrationPhase ? step.col : 'text-slate-800'} />
                          <span className={`text-[9px] font-black uppercase tracking-widest ${idx <= calibrationPhase ? 'text-white' : 'text-slate-700'}`}>{step.label}</span>
                       </div>
                       <span className={`text-[8px] font-mono font-bold ${idx <= calibrationPhase ? 'text-indigo-400' : 'text-slate-900'}`}>{step.status}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {statusMessage && (
           <div className={`p-8 rounded-[40px] border text-xs font-black uppercase tracking-widest animate-in slide-in-from-top-2 flex items-center justify-center gap-5 shadow-3xl ${
             statusMessage.includes('FAILED') || statusMessage.includes('PENDING') ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
           }`}>
             {statusMessage.includes('FAILED') ? <ShieldAlert size={20} /> : <Zap size={20} fill="currentColor" />}
             <span className="leading-relaxed">{statusMessage}</span>
           </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-4">
            <button 
              onClick={checkStatus}
              disabled={isRefreshing}
              className="py-10 bg-emerald-600 hover:bg-emerald-500 rounded-[48px] text-white font-black text-xs md:text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(16,185,129,0.3)] flex items-center justify-center gap-6 transition-all active:scale-95 disabled:opacity-50 border-4 border-white/10 ring-[16px] ring-emerald-500/5 group/ref"
            >
               {isRefreshing ? <Loader2 size={28} className="animate-spin" /> : <RefreshCw size={28} className="group-hover/ref:rotate-180 transition-transform duration-700" />}
               REFRESH NODE
            </button>
            <button 
              onClick={resendShard}
              disabled={isResending}
              className="py-10 bg-black/60 hover:bg-white/5 border-2 border-white/10 rounded-[48px] text-slate-300 font-black text-xs md:text-sm uppercase tracking-[0.5em] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-6 shadow-xl"
            >
               {isResending ? <Loader2 size={28} className="animate-spin" /> : <Send size={28} />}
               RESEND SHARD
            </button>
         </div>

         <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-10 relative z-10">
            <button 
              onClick={onLogout}
              className="px-10 py-4 bg-rose-950/20 border border-rose-500/20 text-rose-500/60 hover:text-rose-500 hover:border-rose-500 rounded-full text-[10px] font-black uppercase tracking-[0.5em] transition-all flex items-center gap-4 active:scale-90"
            >
              <Lock size={16}/> SEVER HANDSHAKE
            </button>
            <div className="flex gap-16 opacity-10">
               <Globe2 size={40} className="text-white" />
               <SycamoreLogo size={40} className="text-white" />
               <BadgeCheck size={40} className="text-white" />
            </div>
         </div>
      </div>
      
      <style>{`
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .shadow-3xl { box-shadow: 0 80px 200px -40px rgba(0, 0, 0, 0.95); }
      `}</style>
    </div>
  );
};

export default VerificationHUD;
