import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  Leaf, 
  Wind, 
  Globe, 
  Zap, 
  History, 
  ShieldCheck, 
  Database, 
  Activity, 
  ArrowUpRight, 
  Cloud, 
  Sprout, 
  Waves, 
  Binary, 
  BadgeCheck,
  CheckCircle2,
  Search,
  Download,
  Target,
  BarChart4,
  Heart,
  ChevronRight,
  ArrowLeftCircle,
  Gauge,
  Bot,
  Layers,
  Cpu,
  Microscope,
  Fingerprint,
  Radio,
  FileDigit,
  Waves as WaveIcon,
  HardHat,
  Monitor,
  Workflow,
  Stamp,
  ShieldAlert,
  ArrowRightCircle,
  Globe2,
  Target as TargetIcon
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ComposedChart,
  Line,
  Bar
} from 'recharts';
import { User, ViewState } from '../types';

interface ImpactProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

const CARBON_LEDGER_DATA = [
  { id: 'CBL-842-1', type: 'Sequestration', amount: 14.2, unit: 'tCO2e', status: 'VERIFIED', node: 'Node_Paris_04', date: '2h ago', method: 'Regen-Tilling', hash: '0x882_SEQ_F42' },
  { id: 'CBL-842-2', type: 'Reduction', amount: 8.5, unit: 'tCO2e', status: 'AUDITING', node: 'Stwd_Nairobi', date: '5h ago', method: 'Solar-Ingest', hash: '0x104_RED_B91' },
  { id: 'CBL-842-3', type: 'Offset', amount: 124.0, unit: 'tCO2e', status: 'VERIFIED', node: 'Global_Alpha', date: '1d ago', method: 'Bantu-Compost', hash: '0x042_OFF_A88' },
  { id: 'CBL-842-4', type: 'Ingest', amount: 2.4, unit: 'tCO2e', status: 'SYNCING', node: 'Edge_P4', date: '12m ago', method: 'Spectral-Scan', hash: '0x991_ING_C12' },
];

const THRUST_IMPACT_DATA = [
  { thrust: 'Societal', val: 82, full: 100, delta: '+2.4%' },
  { thrust: 'Enviro', val: 94, full: 100, delta: '+8.1%' },
  { thrust: 'Human', val: 76, full: 100, delta: '-1.2%' },
  { thrust: 'Tech', val: 88, full: 100, delta: '+12.5%' },
  { thrust: 'Industry', val: 91, full: 100, delta: '+4.0%' },
];

const GROWTH_CHART_DATA = [
  { month: 'Jan', carbon: 420, water: 1200, predicted: 400 },
  { month: 'Feb', carbon: 580, water: 1500, predicted: 550 },
  { month: 'Mar', carbon: 740, water: 1300, predicted: 700 },
  { month: 'Apr', carbon: 920, water: 1800, predicted: 900 },
  { month: 'May', carbon: 1100, water: 2200, predicted: 1050 },
  { month: 'Jun', carbon: 1284, water: 2500, predicted: 1250 },
];

const SDG_ALIGNMENT = [
  { id: 2, name: 'Zero Hunger', progress: 84, color: '#f59e0b', shard: 'SDG_2_SYNC_OK' },
  { id: 13, name: 'Climate Action', progress: 92, color: '#10b981', shard: 'SDG_13_SYNC_OK' },
  { id: 15, name: 'Life on Land', progress: 78, color: '#059669', shard: 'SDG_15_SYNC_PEND' },
  { id: 9, name: 'Industry & Innovation', progress: 95, color: '#3b82f6', shard: 'SDG_9_SYNC_OK' },
];

const Impact: React.FC<ImpactProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'whole' | 'carbon' | 'thrusts'>('whole');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Real-time network telemetry simulation
  const [globalResonance, setGlobalResonance] = useState(94.2);
  const [consensusDepth, setConsensusDepth] = useState(124);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalResonance(prev => Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
      setConsensusDepth(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAuditRequest = async () => {
    const fee = 100;
    if (await onSpendEAC(fee, 'GLOBAL_IMPACT_VERIFICATION_AUDIT')) {
       alert("AUDIT_INITIALIZED: EnvirosAgro physical verification node dispatched to shard your impact metrics.");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Globe size={1000} className="text-emerald-500" />
      </div>

      {/* 1. Planetary Resonance HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-3xl h-[280px]">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Globe2 size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.5em]">Planetary Resonance</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">{globalResonance}%</h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Biosphere Sync v4</span>
              <div className="flex items-center gap-2 text-emerald-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Resonant</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-blue-500/20 bg-blue-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-3xl h-[280px]">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Database size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em]">Consensus Maturity</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">{consensusDepth}<span className="text-xl text-blue-500 ml-1 italic">Nodes</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Registry Height</span>
              <div className="flex items-center gap-2 text-blue-400">
                 <ShieldCheck size={14} />
                 <span className="text-[9px] font-mono font-bold">VERIFIED_QUORUM</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-amber-500/20 bg-amber-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-3xl h-[280px]">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Wind size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.5em]">Aggregate Mitigation</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">1.28<span className="text-xl text-amber-500 ml-1 italic">K t</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">CO2e Sequestration</span>
              <div className="flex items-center gap-2 text-amber-500">
                 <TrendingUp size={14} />
                 <span className="text-[9px] font-mono font-bold">+14.2% Δ</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-3xl h-[280px]">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Target size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em]">Network Multiplier</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">1.42<span className="text-xl text-indigo-500 ml-1 italic">x</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">m-Constant Base</span>
              <div className="flex items-center gap-2 text-indigo-400">
                 <Activity size={14} />
                 <span className="text-[9px] font-mono font-bold uppercase">Optimized</span>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Strategy Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl px-6">
           {[
             { id: 'whole', label: 'Network Vitality', icon: Globe },
             { id: 'carbon', label: 'Carbon Ledger', icon: Wind },
             { id: 'thrusts', label: 'Thrust Resonance', icon: TargetIcon },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-2xl scale-105 border-b-4 border-emerald-400 ring-8 ring-emerald-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={18} /> {tab.label}
             </button>
           ))}
         </div>
         
         <div className="flex items-center gap-6">
            <button 
              onClick={handleAuditRequest}
              className="px-10 py-5 bg-white/5 border border-white/10 rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-all shadow-xl active:scale-95"
            >
               Request Global Verification
            </button>
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl cursor-pointer hover:scale-110 transition-transform">
               <Download size={24} />
            </div>
         </div>
      </div>

      {/* 3. Main Viewport */}
      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: NETWORK VITALITY --- */}
        {activeTab === 'whole' && (
           <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
                    <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none overflow-hidden">
                       <div className="w-full h-[2px] bg-emerald-500/20 absolute top-0 animate-scan"></div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative z-10 px-4 gap-8">
                       <div className="flex items-center gap-8">
                          <div className="p-6 bg-emerald-600 rounded-[32px] shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                             <Activity className="w-10 h-10 text-white" />
                          </div>
                          <div>
                             <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Global <span className="text-emerald-400">Resonance Yield</span></h3>
                             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-3">EOS_VITALITY_ORACLE_V4</p>
                          </div>
                       </div>
                       <div className="text-right border-l-4 border-emerald-500/20 pl-8">
                          <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Index Momentum</p>
                          <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter leading-none">+22.4%</p>
                       </div>
                    </div>

                    <div className="flex-1 min-h-[450px] w-full relative z-10 p-6 bg-black/40 rounded-[56px] border border-white/5 shadow-inner">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={GROWTH_CHART_DATA}>
                             <defs>
                                <linearGradient id="colorVitality" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                             <XAxis dataKey="month" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }} />
                             <Area type="monotone" name="Actual Sequestration" dataKey="carbon" stroke="#10b981" strokeWidth={8} fillOpacity={1} fill="url(#colorVitality)" strokeLinecap="round" />
                             <Area type="monotone" name="Oracle Prediction" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} fill="transparent" strokeDasharray="10 10" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8 flex flex-col">
                    <div className="glass-card p-12 rounded-[64px] border border-emerald-500/10 bg-emerald-600/5 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden flex-1 group shadow-xl">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[12s]"><Sprout size={300} className="text-emerald-400" /></div>
                       <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 group-hover:rotate-12 transition-transform">
                          <Sprout size={40} className="text-white" />
                       </div>
                       <div className="space-y-4 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Bio-Signal <span className="text-emerald-400">Quorum</span></h4>
                          <p className="text-slate-400 text-lg leading-relaxed italic px-6">"Registry consensus achieved via 12.4K synchronized soil shards."</p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[40px] border border-emerald-500/20 w-full relative z-10 shadow-inner">
                          <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-2">Sync Confidence</p>
                          <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">99.98%</p>
                       </div>
                    </div>

                    <div className="p-10 glass-card rounded-[48px] border border-blue-500/20 bg-blue-500/5 space-y-6 shadow-xl relative overflow-hidden group/tip">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/tip:scale-125 transition-transform"><Bot size={150} /></div>
                       <div className="flex items-center gap-4 relative z-10">
                          <Bot className="w-8 h-8 text-blue-400" />
                          <h4 className="text-xl font-black text-white uppercase italic">Impact Recommendation</h4>
                       </div>
                       <p className="text-slate-400 text-sm leading-relaxed italic relative z-10 border-l-2 border-blue-500/20 pl-6">
                          "Carbon sharding performance in Zone 4 is peaking. Suggest migrating surplus node energy to aquatic restoration shards."
                       </p>
                    </div>
                 </div>
              </div>

              {/* SDG Alignment Shards */}
              <div className="space-y-10">
                 <div className="flex items-center gap-6 px-10">
                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-xl">
                       <BadgeCheck className="text-amber-500 w-7 h-7" />
                    </div>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">SDG <span className="text-amber-500">Alignment Shards</span></h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                    {SDG_ALIGNMENT.map(goal => (
                      <div key={goal.id} className="p-10 glass-card border-2 border-white/5 rounded-[56px] bg-black/60 shadow-xl space-y-8 group hover:border-white/20 transition-all active:scale-[0.98] duration-300 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><Globe size={160} /></div>
                         <div className="flex justify-between items-center">
                            <span className="text-[24px] font-black text-white italic opacity-40 group-hover:opacity-100 transition-opacity">SDG_{goal.id}</span>
                            <div className="p-3 bg-white/5 rounded-xl text-slate-500 group-hover:text-white group-hover:scale-110 transition-all shadow-inner">
                               <CheckCircle2 size={24} />
                            </div>
                         </div>
                         <div className="space-y-1">
                            <h5 className="text-2xl font-black text-white uppercase italic tracking-tight m-0">{goal.name}</h5>
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest font-mono italic">{goal.shard}</p>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-black uppercase text-slate-500">
                               <span>Fulfillment</span>
                               <span className="text-white">{goal.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                               <div className="h-full rounded-full transition-all duration-[2s] shadow-[0_0_15px_currentColor]" style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}></div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: CARBON LEDGER --- */}
        {activeTab === 'carbon' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 px-4">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 gap-8 px-4">
                <div className="space-y-4">
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Carbon <span className="text-amber-500">Ledger Shards</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic opacity-70">Immutable record of environmental sequestration and validation.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <div className="relative flex-1 md:w-[400px]">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                      <input type="text" placeholder="Filter Ledger Hashing..." className="w-full bg-black/60 border border-white/10 rounded-full py-5 pl-16 pr-8 text-white focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-mono" />
                   </div>
                   <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl"><Download size={24} /></button>
                </div>
             </div>

             <div className="glass-card rounded-[64px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl">
                <div className="grid grid-cols-6 p-10 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                   <span className="col-span-2">Registry Shard ID & Hash</span>
                   <span>Audit Method</span>
                   <span>Mitigation Value</span>
                   <span>Finality Node</span>
                   <span className="text-right">Consensus</span>
                </div>
                <div className="divide-y divide-white/5 h-[600px] overflow-y-auto custom-scrollbar bg-[#050706]">
                   {CARBON_LEDGER_DATA.map((entry, i) => (
                     <div key={entry.id} className="grid grid-cols-6 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in slide-in-from-bottom-2">
                        <div className="col-span-2 flex items-center gap-8">
                           <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
                              <Fingerprint size={24} />
                           </div>
                           <div>
                              <p className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-amber-500 transition-colors m-0 leading-none">{entry.id}</p>
                              <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black">{entry.hash}</p>
                           </div>
                        </div>
                        <div>
                           <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-[9px] font-black uppercase rounded-lg text-slate-500 group-hover:text-white transition-all">{entry.method}</span>
                        </div>
                        <div className="text-3xl font-mono font-black text-white group-hover:text-emerald-400 transition-colors">
                           {entry.amount} <span className="text-[10px] text-slate-700 font-sans uppercase">{entry.unit}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono italic">
                           {entry.node}
                        </div>
                        <div className="flex justify-end pr-4">
                           <div className={`p-4 rounded-2xl border transition-all shadow-xl group-hover:shadow-current transition-all scale-90 group-hover:scale-100 ${
                              entry.status === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse'
                           }`}>
                              <ShieldCheck size={20} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="p-10 border-t border-white/10 bg-black/80 flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
                   <span>Permanent record. No deletion shards permitted for environmental biometrics.</span>
                   <button className="text-amber-500 hover:text-white transition-colors">Verify Registry Root</button>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: THRUST RESONANCE --- */}
        {activeTab === 'thrusts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-500 px-4">
             <div className="lg:col-span-7 glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/40 flex flex-col items-center justify-center shadow-3xl relative overflow-hidden min-h-[700px] group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-[12s]"><TargetIcon size={600} className="text-indigo-400" /></div>
                
                <div className="relative z-10 w-full text-center space-y-16">
                   <div className="space-y-4">
                      <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner">MULTI_THRUST_SYNC_OK</span>
                      <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Pillar <span className="text-indigo-400">Resonance</span></h4>
                      <p className="text-slate-500 text-xl font-medium italic opacity-80">"Analyzing the structural integrity of node sharding across the EOS pillars."</p>
                   </div>
                   
                   <div className="h-[450px] w-full bg-black/40 rounded-[56px] p-8 border border-white/5 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={THRUST_IMPACT_DATA}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis dataKey="thrust" stroke="#64748b" fontSize={12} fontStyle="italic" />
                            <Radar name="Resonance Impact" dataKey="val" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px' }} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-5 space-y-8 flex flex-col">
                <div className="glass-card p-12 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-950/10 space-y-10 shadow-3xl relative overflow-hidden group/oracle flex-1">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/oracle:scale-110 transition-transform duration-[10s]"><Bot size={300} className="text-indigo-400" /></div>
                   <div className="flex items-center gap-6 relative z-10">
                      <div className="p-4 bg-indigo-600 rounded-[28px] shadow-3xl border-2 border-white/10 group-hover/oracle:rotate-12 transition-transform">
                         <Bot className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-widest m-0 leading-none">Impact <span className="text-indigo-400">Oracle</span></h4>
                        <p className="text-[10px] text-indigo-400/60 font-mono tracking-widest mt-2 uppercase">L2_REMEDIATION_LOG</p>
                      </div>
                   </div>
                   <div className="relative z-10 border-l-[8px] border-l-indigo-600/50 pl-10 py-6 bg-black/40 rounded-r-[48px] shadow-inner">
                      <p className="text-slate-300 text-2xl leading-relaxed italic font-medium">
                         "Strategic resonance sweep suggests an <span className="text-emerald-500 font-black">8% surplus</span> in Environmental sharding. Consensus advises re-allocating social energy to the Human (H) pillar to remediate m-constant drift."
                      </p>
                   </div>
                   <button className="relative z-10 w-full py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                      <Zap className="w-6 h-6 fill-current" /> RUN REDISTRIBUTION PROTOCOL
                   </button>
                </div>

                <div className="space-y-6">
                   <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] px-6 italic">PILLAR_PERFORMANCE_DELTA</h4>
                   <div className="grid grid-cols-2 gap-6">
                      {THRUST_IMPACT_DATA.slice(0, 4).map((t, i) => (
                         <div key={i} className="p-8 glass-card border border-white/5 rounded-[44px] bg-black/40 shadow-xl group hover:border-white/20 transition-all">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">{t.thrust}</p>
                            <div className="flex justify-between items-end">
                               <p className="text-4xl font-mono font-black text-white">{t.val}%</p>
                               <span className={`text-[10px] font-mono font-bold ${t.delta.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>{t.delta}</span>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* 4. Global Finality Footer */}
      <div className="p-16 md:p-24 glass-card rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mx-4 mt-12 z-10 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s]">
            <ShieldCheck className="w-[1000px] h-[1000px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.4)] animate-pulse ring-[24px] ring-white/5 shrink-0 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Stamp size={80} className="text-white relative z-20 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">IMPACT <span className="text-emerald-400">FINALITY</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl opacity-80">
                 "Every data shard anchored to the EnvirosAgro registry is a verified contribution to planetary restoration. Sovereignty achieved through biological transparency."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-20 hidden xl:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">CONSENSUS_QUORUM</p>
            <p className="text-9xl font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-emerald-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Impact;