
import React, { useState } from 'react';
import { 
  Scale, ShieldCheck, Landmark, BookOpen, ScrollText, 
  Binary, Target, Zap, Heart, Leaf, Users, Bot, 
  Database, Info, ChevronRight, Lock, Stamp, 
  Gavel, HelpCircle, History, 
  Fingerprint,
  X,
  FileText,
  BadgeCheck,
  Search,
  ArrowRight,
  Loader2,
  Quote,
  Eye,
  Microscope,
  FileDigit,
  Waves,
  Scale as ScaleIcon,
  Sprout
} from 'lucide-react';
import { User } from '../types';

interface CodeOfLawsProps {
  user: User;
}

interface Law {
  id: number;
  thrustId: string;
  thrust: 'SOCIETAL' | 'ENVIRONMENTAL' | 'HUMAN' | 'TECHNOLOGICAL' | 'INFORMATIONAL';
  title: string;
  anchor: string;
  precedents: string[];
  statute: string;
  principle: string;
  icon: any;
  color: string;
  bg: string;
}

const LAWS: Law[] = [
  {
    id: 1,
    thrustId: 'I',
    thrust: 'SOCIETAL',
    title: 'THE GITHAKA-COMMONS MANDATE',
    anchor: '0X1A8',
    principle: 'Land ownership is not absolute dominion but a trusteeship for the community and future generations.',
    precedents: ['KENYA CONSTITUTION ART. 60', 'MAGNA CARTA', 'KIKUYU MBARI SYSTEM'],
    statute: "Every distinct land unit within the EnvirosAgro ecosystem shall be designated a 'Modern Githaka'. While title may be private, the usufruct (right to use) must serve the community. 'Fencing off' resources needed for survival (water, medicinal herbs) is prohibited.",
    icon: Users,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10'
  },
  {
    id: 2,
    thrustId: 'I',
    thrust: 'SOCIETAL',
    title: 'THE WIDOW & ORPHAN CLAUSE',
    anchor: '0X2A8',
    principle: 'Vulnerable groups hold inalienable rights to harvest.',
    precedents: ['LEVITICUS 19:9', 'QURAN', 'KIKUYU MIGUNDA RIGHTS'],
    statute: "10% of all juizzyCookiez production inputs must be sourced from small-holder women farmers or community cooperatives, ensuring the 'Gleaning Right' is modernized into a 'Supply Chain Right'.",
    icon: Heart,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10'
  },
  {
    id: 3,
    thrustId: 'II',
    thrust: 'ENVIRONMENTAL',
    title: 'THE SABBATH-YAJNA PROTOCOL',
    anchor: '0X3A8',
    principle: 'The soil is a living entity that requires rest and ritual respect.',
    precedents: ['BIBLE (SHEMITAH)', 'VEDAS (KRISHI SUKTA)', 'KHALIFA STEWARDSHIP'],
    statute: "For every 6 cycles of intensive production (high In), there must be 1 cycle of 'Regenerative Fallow' where In = 0 but Ca is maintained. During this cycle, only Agro Musika sensors may 'harvest' bio-data.",
    icon: Leaf,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    id: 4,
    thrustId: 'II',
    thrust: 'ENVIRONMENTAL',
    title: 'THE MUGUMO CONSERVATION ORDER',
    anchor: '0X4A8',
    principle: 'Certain biological nodes are sacred and untouchable to maintain ecosystem stability.',
    precedents: ['KIKUYU MUGUMO TABOO', 'QURAN 7:56 (STEWARDSHIP)'],
    statute: "In every acre of EnvirosAgro land, a 'Sacred Node' must be designated. This node is exempt from all machinery and chemicals. It serves as the baseline for the equation's S (Stress) variable—if the Node degrades, the metric is void.",
    icon: Sprout,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    id: 5,
    thrustId: 'III',
    thrust: 'HUMAN',
    title: 'THE BIO-SIGNAL HARMONY ACT',
    anchor: '0X5A8',
    principle: 'Plant health and human health are resonant frequencies.',
    precedents: ['VEDIC AYURVEDA', 'CHANDOGYA UPANISHAD', 'MEDICAG PRINCIPLES'],
    statute: "All produce branding under juizzyCookiez must pass the 'Vibrational Test' via Agro Musika. Plants grown under high stress (S) generate 'dissonant' bio-signals and cannot be sold as premium grade. The food must 'sing' in harmony.",
    icon: Microscope,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10'
  },
  {
    id: 6,
    thrustId: 'IV',
    thrust: 'TECHNOLOGICAL',
    title: 'THE PLOUGHSHARE MANDATE',
    anchor: '0X6A8',
    principle: 'Technology must serve life, not war or destruction.',
    precedents: ['ISAIAH 2:4', 'AGROBOTO SERVANT LOGIC'],
    statute: "The Agroboto division is prohibited from developing dual-use technologies that can be weaponized. Robotics must be 'servants of the Githaka', designed to reduce physical burden (S) on the human worker, not replace the connection to the land.",
    icon: Bot,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 7,
    thrustId: 'V',
    thrust: 'INFORMATIONAL',
    title: 'THE OPEN LEDGER COVENANT',
    anchor: '0X7A8',
    principle: 'Agricultural data must be transparent, accurate, and accessible.',
    precedents: ['QURAN 17:35 (WEIGHTS)', 'KENYA CONSTITUTION ART. 35'],
    statute: "All data flowing through the Tokenz ecosystem must be immutable. The 'Equation of State' (m) for every harvest must be published via AgroInPDF. Concealing high Stress (S) to inflate value is a violation of the SEHTI Truth Protocol.",
    icon: Database,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  }
];

const CodeOfLaws: React.FC<CodeOfLawsProps> = ({ user }) => {
  const [isInitializing, setIsInitializing] = useState<number | null>(null);

  const handleInitialize = (id: number) => {
    setIsInitializing(id);
    setTimeout(() => {
      setIsInitializing(null);
    }, 2500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 max-w-[1100px] mx-auto px-4 md:px-0">
      
      {/* 1. Supreme Equation HUD - Clean Sans Typography */}
      <div className="glass-card p-12 md:p-16 rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.03] relative overflow-hidden shadow-3xl mb-20 text-center flex flex-col items-center">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
            <ScaleIcon className="w-[800px] h-[800px] text-emerald-400" />
         </div>
         
         <div className="relative z-10 space-y-10 w-full">
            <div className="flex flex-col items-center gap-6">
               <div className="w-28 h-28 bg-emerald-600 rounded-[44px] flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5 shrink-0">
                  <Fingerprint className="w-14 h-14 text-white" />
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">THE SCROLL <span className="text-emerald-400">OF SEHTI</span></h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.8em]">Registry Statutes & Mandates</p>
               </div>
            </div>

            {/* Supreme Equation Visualizer - Unified Sans */}
            <div className="p-12 bg-black/60 rounded-[64px] border border-white/5 shadow-inner relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 opacity-50"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12">
                  <div className="text-right hidden md:block">
                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Resilience</p>
                     <p className="text-6xl font-sans italic font-black text-white">m =</p>
                  </div>
                  <div className="flex flex-col items-center">
                     <div className="flex items-center gap-6 text-4xl md:text-7xl font-sans italic text-emerald-400 font-black tracking-tighter">
                        <span className="text-white not-italic text-5xl">√</span>
                        <div className="flex flex-col items-center">
                           <div className="px-8 border-b-4 border-emerald-500/40 pb-2">
                              Dn <span className="text-white text-2xl mx-1">×</span> In <span className="text-white text-2xl mx-1">×</span> Ca
                           </div>
                           <div className="pt-2 text-rose-500">
                              S
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 px-10">
                  {[
                    { l: 'Density', v: 'Dn', desc: 'Land Efficiency' },
                    { l: 'Intensity', v: 'In', desc: 'Yield Science' },
                    { l: 'Cumulative', v: 'Ca', desc: 'Stewardship' },
                    { l: 'Stress', v: 'S', desc: 'Degradation', col: 'text-rose-500' },
                  ].map(v => (
                    <div key={v.v} className="text-center">
                       <p className={`text-xl font-mono font-black ${v.col || 'text-emerald-400'}`}>{v.v}</p>
                       <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{v.l}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* 2. Governing Laws List */}
      <div className="space-y-16">
         {LAWS.map(law => (
            <div key={law.id} className="p-12 md:p-16 glass-card rounded-[80px] border border-white/5 bg-black/60 relative overflow-hidden group shadow-3xl transition-all duration-500 hover:border-white/10">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none group-hover:scale-105 transition-transform duration-[15s]">
                  <law.icon size={600} className="text-white" />
               </div>

               <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 mb-12 gap-8">
                  <div className="flex items-center gap-8">
                    <div className={`w-28 h-28 rounded-[40px] ${law.bg} border border-white/10 shadow-3xl group-hover:rotate-3 transition-transform duration-700 flex items-center justify-center`}>
                       <law.icon className={`w-14 h-14 ${law.color}`} />
                    </div>
                    <div>
                      <span className={`px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${law.color}`}>
                        THRUST {law.thrustId}: {law.thrust}
                      </span>
                      <p className="text-[9px] font-mono text-slate-700 font-black uppercase tracking-[0.3em] italic mt-3">STATUTE_ANCHOR_{law.anchor}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right max-w-sm">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Fundamental Principle</p>
                     <p className="text-slate-400 text-sm italic font-medium">"{law.principle}"</p>
                  </div>
               </div>

               <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-[0.85] drop-shadow-2xl relative z-10 mb-12">
                  {law.title}
               </h2>

               <div className="p-12 md:p-20 bg-white/[0.01] backdrop-blur-3xl rounded-[64px] border border-white/5 shadow-inner relative z-10 group/statute text-center">
                  <div className="absolute top-10 left-10 opacity-20 text-emerald-500 group-hover/statute:scale-110 transition-transform">
                    <Quote size={60} />
                  </div>
                  <p className="text-slate-200 text-2xl md:text-4xl italic leading-relaxed font-medium border-l-[12px] border-emerald-500/40 pl-16 md:pl-20 font-sans">
                     {law.statute}
                  </p>
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 opacity-20 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="relative w-full h-full flex items-center justify-center">
                       <Stamp className="w-full h-full text-amber-500/40 animate-spin-slow" />
                       <ShieldCheck className="absolute w-12 h-12 text-amber-500" />
                    </div>
                  </div>
               </div>

               <div className="mt-20 pt-16 border-t border-white/5 relative z-10 space-y-12">
                  <div className="space-y-8">
                     <div className="flex items-center gap-4 px-4">
                        <History size={18} className="text-emerald-500" />
                        <span className="text-xs font-black text-slate-600 uppercase tracking-[0.6em] italic">CROSS-REGISTRY PRECEDENTS</span>
                     </div>
                     <div className="flex flex-wrap gap-4 px-2">
                        {law.precedents.map(p => (
                           <div key={p} className="flex items-center gap-4 px-8 py-4 bg-white/[0.02] border border-white/10 rounded-full group/prec hover:border-emerald-500/30 transition-all cursor-default shadow-lg">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/prec:text-white transition-colors">{p}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-center pt-4">
                     <div className="flex-1 w-full p-2.5 bg-white/[0.01] border border-white/10 rounded-[48px] shadow-3xl flex items-center relative overflow-hidden group/action">
                        <button 
                           onClick={() => handleInitialize(law.id)}
                           disabled={isInitializing !== null}
                           className={`w-full py-8 rounded-[40px] text-[13px] font-black uppercase tracking-[0.6em] transition-all duration-500 flex items-center justify-center gap-6 relative z-10 ${
                              isInitializing === law.id 
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40' 
                              : 'bg-black/40 text-slate-500 hover:text-white border border-transparent hover:border-white/20'
                           }`}
                        >
                           {isInitializing === law.id ? (
                             <>
                               <Loader2 size={24} className="animate-spin" />
                               INITIALIZING SHARD...
                             </>
                           ) : (
                             <>
                               <BookOpen size={24} />
                               VIEW CASE LAW SHARD
                             </>
                           )}
                        </button>
                        
                        {isInitializing === law.id && (
                           <>
                             <div className="absolute inset-0 bg-blue-500/5 animate-pulse rounded-[48px]"></div>
                             <div className="absolute inset-0 border-2 border-blue-400/30 rounded-[48px] animate-ping opacity-20 pointer-events-none"></div>
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent h-2 w-full animate-scan pointer-events-none"></div>
                           </>
                        )}
                     </div>
                     
                     <button className="p-10 bg-emerald-600 rounded-[48px] text-white shadow-3xl hover:bg-emerald-500 active:scale-90 transition-all border border-white/20 shrink-0 relative group/final overflow-hidden ring-8 ring-white/5">
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/final:translate-y-0 transition-transform duration-500"></div>
                        <Stamp size={40} className="relative z-10" />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CodeOfLaws;
