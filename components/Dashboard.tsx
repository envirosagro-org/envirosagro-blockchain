import React, { useState, useEffect } from 'react';
import { SycamoreLogo } from '../App';
// Added missing icons for environmental thrust, human heart resonance, registry connectivity, system config and ledger layers
import { 
  ShieldCheck, Zap, Globe, Activity, Cpu, Binary, 
  Coins, Users, ArrowRight, BrainCircuit, Bot, 
  TrendingUp, Fingerprint, Lock, Sprout, Briefcase, Database, Wallet, Pickaxe, History, Package, Trello,
  LayoutGrid, ArrowUpRight, ShoppingBag, Radio, Signal, Eye, ChevronRight,
  Gem, Landmark, PlayCircle, BookOpen, Lightbulb, CheckCircle2,
  AlertCircle, Target, Waves, ShieldAlert, UserPlus, AlertTriangle,
  Loader2, Atom, Network, Gauge, Leaf, Heart, Wifi, Settings, Layers
} from 'lucide-react';
import { ViewState, User, Order, AgroBlock } from '../types';
import IdentityCard from './IdentityCard';

import { useAppNavigation } from '../hooks/useAppNavigation';

interface DashboardProps {
  user: User;
  isGuest: boolean;
  orders?: Order[];
  blockchain?: AgroBlock[];
  isMining?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, isGuest, orders = [], blockchain = [], isMining = false }) => {
  const { navigate } = useAppNavigation();
  const onNavigate = navigate;
  const [showIdentityCard, setShowIdentityCard] = useState(false);
  const [networkDrift, setNetworkDrift] = useState(0.02);
  const totalBalance = user.wallet.balance + (user.wallet.bonusBalance || 0);

  useEffect(() => {
    const driftInterval = setInterval(() => {
      setNetworkDrift(prev => Number((prev + (Math.random() * 0.01 - 0.005)).toFixed(3)));
    }, 4000);
    return () => clearInterval(driftInterval);
  }, []);

  const RECOMMENDATIONS = [
    { id: 'rec-1', title: 'OPTIMIZE M-CONSTANT', priority: 'High', icon: TrendingUp, target: 'intelligence', col: 'text-blue-400', desc: 'Regional stability below 1.42x. Initiate remediation shard.' },
    { id: 'rec-2', title: 'DIVERSIFY CROP DNA', priority: 'Medium', icon: Binary, target: 'biotech_hub', col: 'text-emerald-400', desc: 'Market demand for Bantu Rice surging. Forge new genetic shard.' },
    { id: 'rec-3', title: 'AUDIT FIELD PROOFS', priority: 'Critical', icon: ShieldAlert, target: 'tqm', col: 'text-rose-500', desc: '3 shipments awaiting digital GRN signature.' },
  ];

  const THRUSTS = [
    { id: 'S', label: 'Societal', val: 82, col: 'text-rose-400', icon: Users },
    { id: 'E', label: 'Environmental', val: 94, col: 'text-emerald-400', icon: Leaf },
    { id: 'H', label: 'Human', val: 76, col: 'text-teal-400', icon: Heart },
    { id: 'T', label: 'Technological', val: 88, col: 'text-blue-400', icon: Cpu },
    { id: 'I', label: 'Industry', val: 91, col: 'text-indigo-400', icon: Landmark },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 w-full overflow-x-hidden pb-32 px-2 max-w-[1700px] mx-auto">
      
      {/* Network Pulse Ticker */}
      <div className="glass-card p-2 rounded-2xl border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.2)] shrink-0 relative">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(16,185,129,0.1),transparent)] -translate-x-full animate-[scan_3s_ease-in-out_infinite]"></div>
        <div className="flex items-center gap-3 px-6 border-r border-white/10 shrink-0 relative z-10">
           <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 whitespace-nowrap">QUANTUM_QUORUM_SYNC</span>
        </div>
        <div className="flex-1 px-6 overflow-hidden relative z-10">
           <div className="whitespace-nowrap animate-marquee text-[10px] text-emerald-400/80 font-mono font-black uppercase tracking-[0.4em]">
             {isMining ? 'NEURAL_FINALITY_SEQUENCE_ACTIVE • MINING_BLOCK_HASH_COMMIT • ' : ''}
             LATEST_FINALITY: {blockchain[0]?.hash.substring(0, 16) || '0x882A_GENESIS'} • QUANTUM_RESONANCE: 1.42x • DRIFT: {networkDrift}μ • ALL PILLARS ENERGIZED • SYCAMORE_OS_v6.5 • CONSENSUS_REACHED_@_12:42_UTC • 
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Main Identity & Dynamic Metrics */}
        <div className="xl:col-span-8 space-y-8">
          <div className="glass-card p-10 md:p-14 rounded-[64px] relative overflow-hidden group h-full flex flex-col justify-between shadow-[0_0_80px_rgba(16,185,129,0.1)] bg-black/40 border border-white/5 border-l-[20px] border-l-emerald-600">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1)_0%,transparent_60%)] pointer-events-none"></div>
             <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none">
                <Network size={600} className="text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-10 items-center pb-12 border-b border-white/5 mb-12">
                <div className="flex items-center justify-center sm:justify-start gap-10 w-full flex-col sm:flex-row">
                  <div className="w-32 h-32 rounded-[40px] bg-white text-slate-900 flex items-center justify-center text-5xl font-black shadow-[0_0_50px_rgba(255,255,255,0.3)] relative ring-8 ring-white/5 shrink-0 transition-transform group-hover:rotate-3">
                    {user.name[0]}
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-[0_0_30px_rgba(16,185,129,0.8)]">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4 w-full overflow-hidden">
                    <div className="flex items-center justify-center sm:justify-start gap-5">
                       <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-white break-words drop-shadow-2xl">
                        {user.name.split(' ')[0]} <span className="text-emerald-400">{user.name.split(' ')[1] || 'STEWARD'}</span>
                      </h3>
                      <div className="px-5 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30 text-[10px] font-black text-emerald-400 animate-pulse tracking-widest">ANCHORED</div>
                    </div>
                    <p className="text-slate-500 text-sm font-black uppercase tracking-[0.4em] flex items-center gap-3 justify-center sm:justify-start">
                       <SycamoreLogo size={16} className="text-indigo-400" /> {user.role} // {user.esin}
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-4">
                       <span className="px-5 py-2 bg-white/5 text-slate-300 text-[9px] font-black rounded-xl border border-white/10 uppercase tracking-[0.3em] shadow-xl backdrop-blur-xl">TIER: {user.wallet.tier.toUpperCase()}</span>
                       <span className="px-5 py-2 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded-xl border border-blue-500/20 uppercase tracking-[0.3em] font-mono shadow-xl flex items-center gap-2">
                          <Wifi size={14} className="animate-pulse" /> REGISTRY_SYNC: 100%
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                   <button 
                     onClick={() => onNavigate('profile', 'card')} 
                     className="px-8 py-5 agro-gradient rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] text-white hover:scale-105 active:scale-95 transition-all shadow-3xl flex items-center justify-center gap-3 shrink-0 border-2 border-white/10"
                   >
                     <Fingerprint className="w-5 h-5" /> IDENTITY_SHARD
                   </button>
                   <button 
                     onClick={() => onNavigate('settings')} 
                     className="px-8 py-4 bg-white/5 border border-white/10 rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 shrink-0"
                   >
                     <Settings className="w-5 h-5" /> SYSTEM_CONFIG
                   </button>
                </div>
             </div>

             <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'TREASURY', val: totalBalance.toFixed(0), unit: 'SHRD', icon: Coins, col: 'text-emerald-400', progress: 85, desc: 'Liquid Utility' },
                  { label: 'RESONANCE', val: user.wallet.exchangeRate.toFixed(2), unit: 'μ', icon: Gauge, col: 'text-blue-400', progress: 78, desc: 'm-Constant Index' },
                  { label: 'QUORUM', val: blockchain.length + 4281, unit: 'BLCK', icon: Layers, col: 'text-indigo-400', progress: 100, desc: 'Ledger Depth' },
                  { label: 'VITALITY', val: user.metrics.sustainabilityScore, unit: '%', icon: Sprout, col: 'text-emerald-500', progress: user.metrics.sustainabilityScore, desc: 'C(a) Sustainability' },
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-black/80 rounded-[48px] border-2 border-white/5 space-y-4 group/stat hover:border-white/20 transition-all shadow-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform"><stat.icon size={80} className={stat.col} /></div>
                    <div className="flex items-center gap-3 mb-2 relative z-10">
                       <div className={`p-2 rounded-xl bg-white/5 ${stat.col}`}><stat.icon size={14} /></div>
                       <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] truncate">{stat.label}</p>
                    </div>
                    <div className="relative z-10">
                       <p className={`text-4xl font-mono font-black text-white tracking-tighter ${stat.col} leading-none truncate`}>
                         {stat.val}<span className="text-sm ml-1 opacity-20 font-sans font-medium uppercase italic">{stat.unit}</span>
                       </p>
                       <p className="text-[9px] text-slate-700 font-bold uppercase mt-4 tracking-widest opacity-60">"{stat.desc}"</p>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-6 relative z-10 shadow-inner">
                       <div className={`h-full ${stat.col.replace('text', 'bg')} transition-all duration-[3s] shadow-[0_0_15px_currentColor]`} style={{ width: `${stat.progress}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Oracle Hub Integration */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          <div className="glass-card p-10 md:p-14 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-950/5 flex-1 flex flex-col justify-between group overflow-hidden relative shadow-[0_0_80px_rgba(99,102,241,0.1)] min-h-[400px]">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(99,102,241,0.15)_0%,transparent_60%)] pointer-events-none"></div>
             <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
                <SycamoreLogo size={400} className="text-indigo-400" />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[28px] bg-indigo-600 shadow-[0_0_50px_rgba(99,102,241,0.6)] flex items-center justify-center border-4 border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                      {isMining ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <SycamoreLogo size={32} className="text-white animate-pulse" />}
                   </div>
                   <div>
                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none m-0">Oracle <span className="text-indigo-400">Sync.</span></h4>
                      <p className="text-[10px] font-mono text-indigo-400/60 font-bold uppercase mt-3 tracking-widest leading-none">QUANTUM_HANDSHAKE_v6.5</p>
                   </div>
                </div>
                <div className="p-10 bg-black/90 rounded-[48px] border border-indigo-500/20 shadow-inner border-l-8 border-l-indigo-600 relative overflow-hidden group/text">
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(99,102,241,0.05),transparent)] -translate-x-full group-hover/text:translate-x-full transition-transform duration-1000"></div>
                   <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover/text:scale-125 transition-transform"><Leaf size={200} className="text-indigo-400" /></div>
                   <p className="text-slate-300 text-xl leading-relaxed italic font-medium relative z-10">
                     {isMining ? '"Finalizing ledger commit. Quorum consensus verified at 99.98%."' : '"Quantum resonance stabilized. m-Constant optimized by 14.2%. Recommend new genetic ingest shard."'}
                   </p>
                </div>
             </div>
             <button 
               onClick={() => onNavigate('agro_lang_analyst')} 
               className="relative z-10 w-full py-8 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(99,102,241,0.4)] mt-8 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-white/10 ring-8 ring-white/5"
             >
                <SycamoreLogo size={20} className="fill-current animate-pulse" /> INITIALIZE INGEST
             </button>
          </div>
        </div>
      </div>

      {/* SEHTI Thrust Resonance Meters */}
      <div className="space-y-8 pt-8">
        <div className="flex items-center justify-between px-10">
          <h3 className="text-sm font-black uppercase tracking-[0.6em] italic flex items-center gap-4 text-slate-500 border-b border-white/5 pb-4 w-full">
             <Target className="w-5 h-5 text-emerald-400 animate-pulse" /> THE FIVE <span className="text-emerald-400">THRUSTS</span> (SEHTI)
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4">
           {THRUSTS.map((t) => (
             <div key={t.id} onClick={() => onNavigate('impact')} className="glass-card p-10 rounded-[64px] border border-white/5 bg-black/60 shadow-xl group hover:border-indigo-500/30 transition-all flex flex-col items-center text-center space-y-6 relative overflow-hidden active:scale-[0.98] duration-300 cursor-pointer">
                <div className="absolute -bottom-8 -right-8 p-4 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><t.icon size={180} className={t.col} /></div>
                <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 ${t.col} shadow-inner group-hover:rotate-12 transition-transform`}>
                   <t.icon size={32} />
                </div>
                <div>
                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{t.label}</h4>
                   <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest mt-3 italic">Pillar_{t.id}</p>
                </div>
                <div className="w-full space-y-4 pt-4 border-t border-white/5">
                   <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 px-2">
                      <span>Resonance</span>
                      <span className={`${t.col} font-mono`}>{t.val}%</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div className={`h-full rounded-full transition-all duration-[2.5s] ${t.col.replace('text', 'bg')} shadow-[0_0_15px_currentColor]`} style={{ width: `${t.val}%` }}></div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Strategic Path Execution */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center gap-6 px-10 mb-6">
           <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20"><AlertCircle className="text-amber-500" /></div>
           <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">STRATEGIC <span className="text-amber-500">QUORUM</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
           {RECOMMENDATIONS.map((rec) => (
             <div key={rec.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/60 shadow-3xl group hover:border-indigo-500/40 transition-all flex flex-col justify-between min-h-[320px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><rec.icon size={250} /></div>
                <div className="space-y-6 relative z-10">
                   <div className="flex justify-between items-start">
                      <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${rec.col} shadow-inner group-hover:rotate-6 transition-all`}>
                         <rec.icon size={32} />
                      </div>
                      <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl transition-all ${
                         rec.priority === 'High' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 
                         rec.priority === 'Critical' ? 'bg-rose-600/10 text-rose-500 border-rose-500/20 animate-pulse' : 
                         'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                         {rec.priority} PRIORITY
                      </span>
                   </div>
                   <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none m-0 drop-shadow-2xl">{rec.title}</h4>
                   <p className="text-base text-slate-500 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity font-medium">"{rec.desc}"</p>
                </div>
                <button 
                  onClick={() => onNavigate(rec.target as ViewState)}
                  className="w-full py-6 mt-10 bg-white/5 border-2 border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white hover:bg-emerald-600 hover:border-emerald-400 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-xl relative z-10"
                >
                   EXECUTE_STRATEGY <ArrowRight size={18} />
                </button>
             </div>
           ))}
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Dashboard;