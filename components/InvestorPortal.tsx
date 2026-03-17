
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Landmark, TrendingUp, ShieldCheck, PieChart as PieChartIcon, Search, Activity, 
  CheckCircle2, X, Loader2, Gem, ChevronRight, LineChart as LineChartIcon, Bot, Leaf, 
  Binary, Stamp, Target as TargetIcon, Users, BadgeCheck, Sprout, RefreshCw, 
  ShieldAlert, Fingerprint, Key, BarChart4, ClipboardCheck, ArrowUpRight, Coins, Wallet,
  Layers, Database, Terminal, Microscope, Zap, Globe, Gauge, ShieldPlus, ArrowDownToLine,
  LayoutGrid, Network, Boxes, FileSearch, Monitor,
  Briefcase, MapPin, Smartphone, User as UserIcon,
  Workflow, ArrowRightCircle, History, Package,
  Scale, ShieldX, Radio, ShoppingBag, Lock, AlertTriangle,
  Play, Pause, Flame, Code2, PlayCircle, Signal, CheckCircle,
  TrendingDown, DollarSign
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { User, AgroProject, ViewState } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';

interface InvestorPortalProps {
  user: User;
  onUpdate: (user: User) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  projects: AgroProject[];
  onNavigate: (view: ViewState, action?: string | null) => void;
}

const DASHBOARD_CHART = [
  { time: 'T-12', tvl: 450, roi: 5.2 },
  { time: 'T-10', tvl: 520, roi: 6.8 },
  { time: 'T-08', tvl: 480, roi: 8.1 },
  { time: 'T-06', tvl: 640, roi: 7.4 },
  { time: 'T-04', tvl: 890, roi: 12.5 },
  { time: 'T-02', tvl: 920, roi: 14.1 },
  { time: 'NOW', tvl: 1284, roi: 15.8 },
];

const MOCK_MISSIONS = [
  { id: 'MZ-2026-04', name: 'Maize Contract (Trans-Nzoia)', crop: 'Yellow Maize', risk: 'Low', roi: 18, funding: 65, category: 'INVESTMENT', mResonance: 1.42 },
  { id: 'JS-2026-11', name: 'juizzyCookiez Orchard', crop: 'Fruit/Berry', risk: 'Medium', roi: 24, funding: 10, category: 'LIVE_FARMING', mResonance: 1.15 },
  { id: 'AG-2026-01', name: 'Agro Musika Bio-Data Lab', crop: 'Research', risk: 'High', roi: 12, funding: 90, category: 'INDUSTRIAL_LOGISTICS', mResonance: 1.68 },
  { id: 'CN-2026-09', name: 'Bantu Soil Sharding', crop: 'Bio-Fertilizer', risk: 'Low', roi: 15, funding: 42, category: 'FUND_ACQUISITION', mResonance: 1.84 },
];

const AGRO_CODE_CMDS = [
  "IF soil_moisture < 20% THEN trigger_irrigation_release(STAKE_B_01)",
  "ASSERT node.m_constant > 1.42 ELSE pause_disbursement(MISSION_882)",
  "SET flow_rate = orbital_index * 1.14 FOR SECTOR_4",
  "DECODE spectral_shard(IMG_A02) -> STATUS: OPTIMAL",
  "MINT carbon_credit(0.24t) -> DEST: TREASURY_NODE_P4",
  "EXECUTE fallow_cycle(LAND_ID_8821) -> STATUS: ACTIVE",
];

const InvestorPortal: React.FC<InvestorPortalProps> = ({ user, onUpdate, onSpendEAC, projects, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'marketplace' | 'portfolio' | 'harvest'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMission, setSelectedMission] = useState<any | null>(null);
  const [isStaking, setIsStaking] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('500');
  const [isAiVetting, setIsAiVetting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [codeLogs, setCodeLogs] = useState<string[]>([]);
  // Fix: Added missing esinSign state to resolve "Cannot find name 'esinSign'" and "Cannot find name 'setEsinSign'" errors.
  const [esinSign, setEsinSign] = useState('');

  // Simulation for live code logs
  useEffect(() => {
    const interval = setInterval(() => {
      const cmd = AGRO_CODE_CMDS[Math.floor(Math.random() * AGRO_CODE_CMDS.length)];
      setCodeLogs(prev => [`[${new Date().toLocaleTimeString()}] > ${cmd}`, ...prev].slice(0, 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAiVetting = async (mission: any) => {
    setIsAiVetting(true);
    setAiAnalysis(null);
    try {
      const prompt = `Perform a deep Agro Lang Vetting for agricultural mission ${mission.id} (${mission.name}). 
      Crop: ${mission.crop}. Risk Rating: ${mission.risk}. Est ROI: ${mission.roi}%.
      Include soil health data simulation, historical weather pattern interpretation for that region, and market price forecasting. 
      Format as a technical industrial report.`;
      const res = await chatWithAgroLang(prompt, []);
      setAiAnalysis(res.text);
    } catch (e) {
      setAiAnalysis("Oracle handshake timeout. Risk levels remain at nominal baseline.");
    } finally {
      setIsAiVetting(true); // Keeping the state so we can see the "Report"
      setIsAiVetting(false);
    }
  };

  const handleSmartStake = async () => {
    if (!selectedMission || !stakeAmount) return;
    
    // Fix: Added node signature verification to ensure ESIN matches user.esin before proceeding with capital deployment.
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    const amount = Number(stakeAmount);
    if (amount <= 0) return;

    setIsStaking(true);
    const success = await onSpendEAC(amount, `SMART_STAKE_MISSION_${selectedMission.id}`);
    if (success) {
      setTimeout(() => {
        setIsStaking(false);
        setSelectedMission(null);
        setActiveTab('portfolio');
        // Logic to add to user portfolio would go here (local state or firebase)
      }, 2000);
    } else {
      setIsStaking(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Dashboard HUD: Capital Resonance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <div className="lg:col-span-8 glass-card p-10 md:p-14 rounded-[64px] border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-3xl">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden">
              <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent absolute top-0 animate-scan opacity-20"></div>
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.3)] shrink-0 border-4 border-white/10 group-hover:scale-105 transition-all">
              <Landmark size={80} className="text-white animate-float" />
           </div>
           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-1">
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Investor <span className="text-indigo-400">Portal.</span></h2>
                 <p className="text-indigo-400/60 text-[10px] font-mono tracking-[0.5em] uppercase mt-2">ZK_CAPITAL_BRIDGE_v6.5</p>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
                 "Orchestrating institutional liquidity across verified SEHTI missions. Deploy capital where nature resonates."
              </p>
           </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
           <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between group overflow-hidden relative shadow-xl">
              <div className="flex justify-between items-center relative z-10">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Value Locked</p>
                 <Coins className="text-emerald-400 w-5 h-5 animate-pulse" />
              </div>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none relative z-10 mt-4">12,842<span className="text-xl text-emerald-500 italic ml-1">EAC</span></h4>
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold mt-4 uppercase">
                 <TrendingUp size={14} /> +14.2% Growth Shard
              </div>
           </div>
        </div>
      </div>

      {/* 2. Navigation Shards */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'dashboard', label: 'Portfolio HUD', icon: LayoutGrid },
          { id: 'marketplace', label: 'Discovery Feed', icon: TargetIcon },
          { id: 'portfolio', label: 'Mission Manager', icon: Briefcase },
          { id: 'harvest', label: 'ROI Terminal', icon: Sprout },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[850px] relative z-10">
        
        {/* VIEW: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-card p-10 rounded-[64px] border border-white/5 bg-black/40 shadow-3xl flex flex-col h-[500px]">
                   <div className="flex justify-between items-center mb-10 px-4">
                      <div className="flex items-center gap-4">
                         <LineChartIcon className="text-indigo-400" />
                         <h3 className="text-xl font-black text-white uppercase italic">Yield <span className="text-indigo-400">Projection</span></h3>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-500 uppercase font-black">Average m-Resonance</p>
                         <p className="text-2xl font-mono font-black text-emerald-400">1.618α</p>
                      </div>
                   </div>
                   <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={DASHBOARD_CHART}>
                            <defs>
                               <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={11} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                            <Area type="monotone" dataKey="tvl" stroke="#6366f1" strokeWidth={8} fillOpacity={1} fill="url(#colorTvl)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-8 flex flex-col">
                   <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center text-center space-y-8 flex-1 group shadow-xl">
                      <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-4 ring-white/10 shrink-0 relative overflow-hidden">
                         <CheckCircle2 size={48} className="text-white" />
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-2xl font-black text-white uppercase italic tracking-widest">Sustainability <span className="text-emerald-400">Score</span></h4>
                         <p className="text-slate-500 text-sm italic font-medium">"Collective impact rating for all active stakes."</p>
                      </div>
                      <div className="p-8 bg-black/60 rounded-[44px] border border-emerald-500/20 w-full shadow-inner">
                         <p className="text-7xl font-mono font-black text-white tracking-tighter">98</p>
                         <p className="text-[10px] text-emerald-400 font-black uppercase mt-4 tracking-widest">RANK: APEX STEWARD</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* AGRO CODE LOG PANEL */}
             <div className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-[#050706] relative overflow-hidden shadow-3xl">
                <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-10">
                   <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform">
                      <Terminal size={32} />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">The <span className="text-indigo-400">Agro Code</span> Log</h3>
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2">LIVE_OS_TELEMETRY_INGEST</p>
                   </div>
                </div>
                <div className="space-y-4 font-mono text-[14px] overflow-hidden">
                   {codeLogs.map((log, i) => (
                      <div key={i} className="flex gap-10 p-4 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors group animate-in slide-in-from-right-2">
                         <span className="text-slate-800 w-24 shrink-0 font-bold">{log.split('>')[0]}</span>
                         <span className={`flex-1 italic tracking-tight ${log.includes('ASSERT') ? 'text-rose-500' : log.includes('MINT') ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {log.split('>')[1]}
                         </span>
                         <CheckCircle className="text-indigo-400/20 group-hover:text-indigo-400" size={16} />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* VIEW: MISSION MARKETPLACE */}
        {activeTab === 'marketplace' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10">
                 <div className="w-full md:w-2/3">
                    <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">The <span className="text-indigo-400">Discovery Feed.</span></h3>
                    <p className="text-slate-500 text-xl italic font-medium mt-4">"Vetted agricultural missions ready for resource sharding."</p>
                 </div>
                 <div className="relative group w-full md:w-[450px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                    <input type="text" placeholder="Search Missions..." className="w-full bg-black/80 border border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:ring-4 focus:ring-indigo-500/20 transition-all font-mono italic" />
                 </div>
              </div>

              <div className="glass-card rounded-[64px] border-2 border-white/5 bg-black/40 overflow-hidden shadow-3xl">
                 <div className="grid grid-cols-12 p-10 border-b border-white/10 bg-white/[0.02] text-[11px] font-black text-slate-500 uppercase tracking-widest italic px-14">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-4">Mission Shard</div>
                    <div className="col-span-2 text-center">Risk Index</div>
                    <div className="col-span-2 text-center">Est. ROI</div>
                    <div className="col-span-3 text-right">Liquidity Req</div>
                 </div>
                 <div className="divide-y divide-white/5">
                    {MOCK_MISSIONS.map(mission => (
                       <div key={mission.id} onClick={() => setSelectedMission(mission)} className="grid grid-cols-12 p-12 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in">
                          <div className="col-span-1 font-mono text-slate-700 font-bold">{mission.id}</div>
                          <div className="col-span-4 flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-all shadow-inner">
                                {mission.category === 'LIVE_FARMING' ? <Sprout size={28} className="text-emerald-400" /> : <Landmark size={28} className="text-indigo-400" />}
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-white uppercase italic group-hover:text-indigo-400 transition-colors leading-none m-0">{mission.name}</h4>
                                <p className="text-[10px] text-slate-600 font-mono uppercase mt-2">{mission.crop} // {mission.category}</p>
                             </div>
                          </div>
                          <div className="col-span-2 text-center">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${mission.risk === 'Low' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : mission.risk === 'Medium' ? 'bg-amber-600/10 text-amber-400 border-amber-500/20' : 'bg-rose-600/10 text-rose-500 border-rose-500/20'}`}>{mission.risk}</span>
                          </div>
                          <div className="col-span-2 text-center">
                             <p className="text-3xl font-mono font-black text-white italic">+{mission.roi}%</p>
                          </div>
                          <div className="col-span-3 text-right flex flex-col items-end gap-2 pr-10">
                             <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${mission.funding}%` }}></div>
                             </div>
                             <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{mission.funding}% COMMITTED</span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: MISSION MANAGER (PORTFOLIO) */}
        {activeTab === 'portfolio' && (
           <div className="space-y-12 animate-in zoom-in duration-700">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-6 gap-8">
                <div className="space-y-3">
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Management <span className="text-blue-400">Terminal.</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic">"Monitoring active commitments and technical milestone finality."</p>
                </div>
                <div className="p-8 glass-card rounded-[40px] border border-blue-500/20 bg-blue-600/5 text-center shadow-xl">
                   <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mb-3">ACTIVE_COMMITS</p>
                   <p className="text-6xl font-mono font-black text-white">04<span className="text-sm italic font-sans text-blue-800 ml-1">SHARDS</span></p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {MOCK_MISSIONS.slice(0, 2).map(m => (
                   <div key={m.id} className="glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-blue-500/40 transition-all group flex flex-col justify-between shadow-3xl relative overflow-hidden min-h-[600px]">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><Activity size={300} className="text-blue-400" /></div>
                      
                      <div className="flex justify-between items-start mb-10 relative z-10">
                         <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-[28px] bg-blue-600 shadow-2xl flex items-center justify-center text-white border-4 border-white/10 animate-pulse">
                               <Radio size={40} />
                            </div>
                            <div>
                               <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">{m.name}</h4>
                               <p className="text-[10px] text-slate-500 font-mono uppercase mt-2">NODE_RES: {m.mResonance}μ // {m.id}</p>
                            </div>
                         </div>
                         <button className="p-4 bg-rose-600/10 border border-rose-500/30 text-rose-500 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-xl" title="Emergency Pause">
                            <ShieldAlert size={28} />
                         </button>
                      </div>

                      <div className="space-y-10 flex-1 relative z-10 mt-10">
                         <div className="p-8 bg-black/80 rounded-[44px] border border-white/5 space-y-6 shadow-inner">
                            <div className="flex justify-between items-center px-4">
                               <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-3">
                                  <History size={16} /> Milestone Sharding
                               </p>
                               <span className="text-[9px] font-black text-emerald-400 uppercase">2/3 Finalized</span>
                            </div>
                            <div className="space-y-4">
                               {[
                                  { l: 'LAND PREP', s: 'COMPLETE' },
                                  { l: 'LIVE FARMING', s: 'IN_PROGRESS' },
                                  { l: 'PRE-HARVEST LOGISTICS', s: 'LOCKED' },
                               ].map((step, i) => (
                                  <div key={i} className={`flex items-center justify-between p-5 rounded-3xl border ${step.s === 'COMPLETE' ? 'bg-emerald-600/5 border-emerald-500/20 text-emerald-500' : step.s === 'IN_PROGRESS' ? 'bg-blue-600/10 border-blue-500 text-blue-400 animate-pulse' : 'bg-white/5 border-white/5 text-slate-700'}`}>
                                     <span className="text-xs font-black uppercase italic tracking-tight">{step.l}</span>
                                     {step.s === 'COMPLETE' ? <CheckCircle2 size={16} /> : step.s === 'IN_PROGRESS' ? <Activity size={16} /> : <Lock size={16} />}
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="mt-12 pt-10 border-t border-white/5 flex gap-6 relative z-10">
                         <button className="flex-1 py-8 bg-blue-600 hover:bg-blue-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-blue-500/5">
                            RELEASE TRANCHE
                         </button>
                         <button onClick={() => setActiveTab('dashboard')} className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 hover:text-white transition-all shadow-xl"><ArrowUpRight size={32} /></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* VIEW: HARVEST TERMINAL (ROI) */}
        {activeTab === 'harvest' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="glass-card p-16 md:p-24 rounded-[64px] border-2 border-emerald-500/20 bg-[#020503] shadow-3xl text-center space-y-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Coins size={800} className="text-emerald-400" /></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 rounded-[44px] bg-emerald-600 flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.3)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12">
                       <Sprout size={64} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter m-0 leading-none">HARVEST <span className="text-emerald-400">ROI</span></h3>
                       <p className="text-slate-500 text-2xl font-medium italic">"Liquidating agricultural capital shards to liquid utility."</p>
                    </div>

                    <div className="flex flex-col items-center gap-10 py-16 border-y border-white/5 max-w-2xl mx-auto">
                       <div className="space-y-2">
                          <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.8em] italic">AVAILABLE_FOR_LIQUIDATION</p>
                          <h5 className="text-9xl font-mono font-black text-white tracking-tighter drop-shadow-[0_0_60px_rgba(52,211,153,0.2)]">
                             1,420<span className="text-4xl ml-2 font-black text-emerald-500">EAC</span>
                          </h5>
                       </div>
                       <div className="flex flex-wrap justify-center gap-4">
                          <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase flex items-center gap-3">
                             <CheckCircle2 size={16} /> Verified Production Shards
                          </div>
                          <div className="px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase flex items-center gap-3">
                             <BadgeCheck size={16} /> Oracle Vetted Carbon Shards
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                       <div className="p-8 bg-black rounded-[48px] border-2 border-white/10 flex items-center justify-between group hover:border-emerald-500/30 transition-all shadow-inner">
                          <div className="text-left">
                             <p className="text-[11px] font-black text-slate-500 uppercase leading-none">Auto Re-Invest</p>
                             <p className="text-[9px] text-slate-700 mt-2 italic">Rollover ROI to new missions.</p>
                          </div>
                          <button className="w-16 h-8 bg-slate-800 rounded-full relative p-1 transition-all">
                             <div className="w-6 h-6 bg-white rounded-full transition-transform"></div>
                          </button>
                       </div>
                       <button className="py-8 bg-emerald-600 hover:bg-emerald-500 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[16px] ring-white/5 active:scale-95">
                          <ArrowDownToLine size={28} /> CLAIM FUNDS
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* --- MISSION VETTING MODAL --- */}
      {selectedMission && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 overflow-hidden">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedMission(null)}></div>
           <div className="relative z-10 w-full max-w-5xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(99,102,241,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              
              <div className="p-10 md:p-14 border-b border-white/5 bg-indigo-500/[0.01] flex justify-between items-center shrink-0 relative z-10 px-20">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10">
                       <Bot size={44} className="animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Agro Lang <span className="text-indigo-400">Evaluation.</span></h3>
                       <p className="text-indigo-400/60 text-[11px] font-mono tracking-[0.5em] uppercase mt-4 italic">ORACLE_INGEST_v6.5</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedMission(null)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all active:scale-90"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar flex flex-col gap-12 bg-black/40 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Mission Details Panel */}
                    <div className="space-y-10">
                       <div className="p-10 bg-black rounded-[64px] border border-white/5 space-y-6 shadow-inner relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><History size={200} /></div>
                          <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] border-b border-white/5 pb-4 px-2 italic">MISSION_DETAILS</h4>
                          <div className="space-y-4 px-2 relative z-10">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-600 uppercase">Designation</span>
                                <span className="text-xs font-black text-white uppercase italic">{selectedMission.name}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-600 uppercase">Crop DNA</span>
                                <span className="text-xs font-black text-white uppercase italic">{selectedMission.crop}</span>
                             </div>
                             <div className="h-px bg-white/5 w-full"></div>
                             <div className="flex justify-between items-center pt-2">
                                <span className="text-xs font-black text-slate-500 uppercase">Required Stake</span>
                                <span className="text-4xl font-mono font-black text-emerald-400">{selectedMission.roi}% ROI</span>
                             </div>
                          </div>
                       </div>

                       <div className="p-10 glass-card rounded-[64px] border-2 border-indigo-500/20 bg-indigo-500/5 space-y-8 shadow-3xl">
                          <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-4 px-2">
                             <Smartphone size={24} className="text-indigo-400" />
                             <h4 className="text-xl font-black text-white uppercase italic">Smart Staking</h4>
                          </div>
                          <div className="space-y-6 px-2">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Allocation (EAC)</label>
                                <input 
                                  type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)}
                                  className="w-full bg-black border-2 border-white/10 rounded-full py-8 text-center text-5xl font-mono text-white outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all shadow-inner" 
                                />
                             </div>
                             <div className="space-y-3 pt-4">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 italic text-center block">Signature Auth (ESIN)</label>
                                <input 
                                  type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                                  placeholder="EA-XXXX-XXXX"
                                  className="w-full bg-black border-2 border-white/10 rounded-full py-6 text-center text-2xl font-mono text-white outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all uppercase placeholder:text-stone-900" 
                                />
                             </div>
                             <button 
                               onClick={handleSmartStake}
                               disabled={isStaking || !esinSign}
                               className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30 border-4 border-white/10 ring-[20px] ring-white/5"
                             >
                                {isStaking ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap size={32} className="fill-current" />}
                                {isStaking ? 'ANCHORING CAPITAL...' : 'INITIATE SMART STAKE'}
                             </button>
                          </div>
                       </div>
                    </div>

                    {/* Agro Lang Risk Analysis Area */}
                    <div className="space-y-10">
                       <div className="p-10 bg-black rounded-[64px] border border-white/10 space-y-10 shadow-inner flex flex-col h-full overflow-hidden relative group/audit">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/audit:scale-110 transition-transform"><Database size={400} /></div>
                          <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] border-b border-indigo-500/10 pb-6 px-4 italic flex items-center gap-4">
                             <Leaf size={24} /> ORACLE_VETTING_SHARD
                          </h4>
                          
                          <div className="flex-1 overflow-y-auto custom-scrollbar-terminal pr-4 pb-10">
                             {!aiAnalysis ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-10">
                                   <Bot size={80} className="text-slate-800 animate-float opacity-30" />
                                   <p className="text-slate-600 text-lg font-bold italic max-w-xs uppercase tracking-widest px-10 leading-relaxed">"Invoke the Oracle to reveal historical soil patterns and risk forecasting."</p>
                                   <button 
                                     onClick={() => handleAiVetting(selectedMission)}
                                     disabled={isAiVetting}
                                     className="px-14 py-6 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-400 font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl flex items-center gap-4"
                                   >
                                      {isAiVetting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Microscope size={20} />}
                                      START AGRO LANG CHECK
                                   </button>
                                </div>
                             ) : (
                                <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-10">
                                   <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-lg md:text-xl leading-relaxed italic whitespace-pre-line font-medium border-l-4 border-indigo-500/30 pl-8">
                                      {aiAnalysis}
                                   </div>
                                   <div className="p-8 bg-indigo-600/10 rounded-[40px] border border-indigo-500/20 shadow-xl flex items-center gap-10">
                                      <div className="text-center">
                                         <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Risk Confidence</p>
                                         <p className="text-3xl font-mono font-black text-white">94%</p>
                                      </div>
                                      <div className="flex-1">
                                         <p className="text-[10px] text-slate-400 italic">"Registry data sync confirmed high soil purity baseline. Weather patterns trending towards optimal precipitation for Yellow Maize."</p>
                                      </div>
                                   </div>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-12 border-t border-white/5 bg-black/95 text-center shrink-0 z-20">
                 <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.8em] italic">Official Investment Handshake Protocol v6.5 // secured shard</p>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default InvestorPortal;
