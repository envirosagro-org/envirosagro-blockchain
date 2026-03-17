import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, Zap, ShieldCheck, Heart, Users, Target, 
  Brain, Scale, Microscope, Binary, Coins, 
  Bot, Loader2, Gauge, FlaskConical, Globe, 
  Layers, Lock, Database, Thermometer, Compass,
  CheckCircle2, AlertCircle, Info, ChevronRight, Fingerprint,
  Sprout, Waves, Cpu, Landmark, ShieldAlert, Dna, 
  Workflow, Factory, Network, History as HistoryIcon, FileSearch, 
  BookOpen, Leaf, X, FileText, SearchCode, Download, 
  Terminal, ArrowRight, Link2, Circle, Bird, Flame, 
  ArrowUpRight, HeartPulse, Radar, Bone, Eye, Settings, 
  Binoculars, MapPin, User as UserIcon, Wheat, 
  BadgeCheck,
  ThermometerSun, Timer, TrendingUp, Scan, ClipboardCheck, 
  Stamp, Radio, Signal, Wifi, Satellite, Ship, Fish, 
  CloudRain, Fan, Shield, PlusCircle, Atom,
  History,
  FileDown,
  CirclePlus,
  RefreshCw,
  Calculator,
  Gavel,
  ShieldPlus,
  ArrowDownToLine,
  Send,
  Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, ViewState } from '../../types';
import { chatWithAgroLang } from '../../services/agroLangService';
import { generateQuickHash } from '../../systemFunctions';
import { useAppStore } from '../../store';

export interface ResourceMeta {
  title: string;
  icon: any;
  color: string;
  accent: string;
  bg: string;
  border: string;
  formula: string;
  philosophy: string;
  metrics: Array<{ label: string; val: string; icon: any }>;
  forgeTitle: string;
  forgeDesc: string;
  simControls: Array<{ label: string; val: number; set: (v: number) => void; min: number; max: number; step: number }>;
  ledgerItems: Array<{ id: string; name: string; hash: string; status: string }>;
}

interface ResourceDimensionBaseProps {
  user: User;
  type: ViewState;
  meta: ResourceMeta;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

const ResourceDimensionBase: React.FC<ResourceDimensionBaseProps> = ({ 
  user, type, meta, onEarnEAC, onSpendEAC, onNavigate, initialSection 
}) => {
  const { ecosystemState, updateEcosystemState } = useAppStore();
  const [activeInternalTab, setActiveInternalTab] = useState<'overview' | 'ledger' | 'oracle' | 'forge' | 'sim'>(
    (initialSection as any) || 'overview'
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  const [forgeResult, setForgeResult] = useState<string | null>(null);
  const [forgeStep, setForgeStep] = useState<'input' | 'sign' | 'success'>('input');
  const [oracleQuery, setOracleQuery] = useState('');
  const [oracleReport, setOracleReport] = useState<string | null>(null);
  
  const [isSyncingSim, setIsSyncingSim] = useState(false);
  const [stream, setStream] = useState<any[]>([]);

  const downloadReport = (content: string, mode: string, typeName: string) => {
    const shardId = `0x${generateQuickHash()}`;
    const report = `
ENVIROSAGRO™ ${typeName.toUpperCase()} SHARD
=================================
REGISTRY_ID: ${shardId}
NODE_AUTH: ${user.esin}
MODE: ${mode}
TIMESTAMP: ${new Date().toISOString()}
ZK_CONSENSUS: VERIFIED (99.9%)

VERDICT:
-------------------
${content}

-------------------
(c) 2025 EA_ROOT_NODE. Secure Shard Finality.
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EA_${typeName}_${mode}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const entry = {
        id: generateQuickHash(4),
        time: new Date().toLocaleTimeString(),
        event: 'TELEMETRY_INGEST',
        val: (Math.random() * 100).toFixed(2),
        status: Math.random() > 0.1 ? 'OK' : 'DRIFT'
      };
      setStream(prev => [entry, ...prev].slice(0, 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const calculateSimResult = () => {
    const { p1, p2, p3 } = ecosystemState;
    switch (type) {
      case 'animal_world': return (p1 * p2) / p3;
      case 'plants_world': return (p1 * p2) * 10; 
      case 'aqua_portal': return p1 * Math.sqrt(p2 / p3);
      case 'soil_portal': return p1 * p2;
      case 'air_portal': return 1 - (p1 / p2);
      default: return 0;
    }
  };

  const simChartData = useMemo(() => {
    const base = calculateSimResult();
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        cycle: `T-${9-i}`,
        val: Number((base * (0.8 + Math.random() * 0.4)).toFixed(2))
      });
    }
    return data;
  }, [ecosystemState.p1, ecosystemState.p2, ecosystemState.p3, type]);

  const handleRunOracleAudit = async () => {
    if (!oracleQuery.trim()) return;
    const fee = 15;
    if (!await onSpendEAC(fee, `${type.toUpperCase()}_ORACLE_DIAGNOSTIC`)) return;

    setIsAuditing(true);
    setOracleReport(null);
    try {
      const prompt = `Act as the EnvirosAgro ${meta.title} Oracle. 
      Execute a diagnostic audit for node ${user.esin}.
      QUERY: "${oracleQuery}"
      CONTEXT: ${user.location}, m-constant=${user.metrics.timeConstantTau || '0.5'}.
      Provide a technical 4-stage remediation shard focused on stabilizing the ${meta.formula} equilibrium.`;
      
      const res = await chatWithAgroLang(prompt, []);
      setOracleReport(res.text);
    } catch (e) {
      setOracleReport("ORACLE_HANDSHAKE_FAILURE: Registry sync recommended.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleForgeShard = async () => {
    if (esinSign !== user.esin) {
      alert("ESIN_MISMATCH: Signature rejected by registry.");
      return;
    }
    setIsForging(true);
    setTimeout(() => {
      setIsForging(false);
      setForgeStep('success');
      setForgeResult(`0x${generateQuickHash(32)}`);
      onEarnEAC(25, `${type.toUpperCase()}_SHARD_FORGED`);
    }, 2000);
  };

  const handleSyncSim = () => {
    setIsSyncingSim(true);
    setTimeout(() => {
      setIsSyncingSim(false);
      updateEcosystemState({ isAnchored: true });
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero HUD */}
      <div className={`p-8 rounded-[48px] border ${meta.border} ${meta.bg} relative overflow-hidden group shadow-2xl`}>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s] pointer-events-none">
          <meta.icon size={300} />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] bg-black/40 flex items-center justify-center border ${meta.border} shadow-inner`}>
            <meta.icon size={64} className={meta.color} />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
              <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase border ${meta.border} bg-black/40 ${meta.color} tracking-widest`}>
                DIMENSION_NODE_{type.toUpperCase()}
              </span>
              <span className="px-3 py-0.5 rounded-full text-[8px] font-black uppercase border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 tracking-widest">
                ZK_SYNC_ACTIVE
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
              {meta.title}
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium italic max-w-2xl">
              {meta.philosophy}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {meta.metrics.map((m, i) => (
               <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-w-[100px]">
                  <m.icon size={14} className={meta.color} />
                  <span className="text-[7px] font-black text-slate-600 uppercase mt-1">{m.label}</span>
                  <span className="text-sm font-mono font-black text-white">{m.val}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Internal Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-black/40 rounded-3xl border border-white/5 sticky top-0 z-50 backdrop-blur-xl">
        {[
          { id: 'overview', label: 'Overview', icon: Globe },
          { id: 'ledger', label: 'Registry Ledger', icon: Database },
          { id: 'oracle', label: 'Oracle Diagnostic', icon: Bot },
          { id: 'forge', label: 'Shard Forge', icon: Zap },
          { id: 'sim', label: 'Ecosystem Sim', icon: Activity },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveInternalTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeInternalTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="min-h-[500px]">
        {activeInternalTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="lg:col-span-2 space-y-6">
               <div className="p-8 glass-card rounded-[40px] border border-white/5 bg-black/40 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                      <Activity size={20} className={meta.color} /> Real-time Telemetry
                    </h3>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                       <span className="text-[8px] font-black text-emerald-500 uppercase">Live Stream</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                     {stream.map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-black/40 rounded-lg text-slate-500 group-hover:text-emerald-400 transition-colors">
                                <Terminal size={12} />
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-white uppercase tracking-widest">{s.event}</p>
                                <p className="text-[7px] text-slate-600 font-mono">{s.time} // NODE_ID_{s.id}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="text-right">
                                <p className="text-[7px] font-black text-slate-700 uppercase">Value</p>
                                <p className="text-xs font-mono font-black text-white">{s.val}</p>
                             </div>
                             <div className={`px-3 py-1 rounded-lg text-[7px] font-black uppercase ${s.status === 'OK' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {s.status}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="p-8 glass-card rounded-[40px] border border-white/5 bg-black/40 space-y-6">
                  <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                    <Landmark size={20} className={meta.color} /> Governance Formula
                  </h3>
                  <div className="p-6 bg-black/60 rounded-3xl border border-white/5 flex items-center justify-center">
                     <code className="text-2xl font-mono font-black text-emerald-400 tracking-tighter">{meta.formula}</code>
                  </div>
                  <p className="text-slate-500 text-xs font-medium italic leading-relaxed">
                    This mathematical shard defines the equilibrium state for the {meta.title} dimension. All registry actions must resolve to this constant.
                  </p>
                  <button 
                    onClick={() => setActiveInternalTab('sim')}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                    Run Simulation <ArrowRight size={14} />
                  </button>
               </div>

               <div className="p-8 glass-card rounded-[40px] border border-white/5 bg-emerald-500/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-emerald-500" />
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Registry Integrity</h4>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                        <span>Sync Progress</span>
                        <span>99.9%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '99.9%' }}></div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeInternalTab === 'ledger' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between px-4">
               <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Registry <span className={meta.color}>Ledger</span></h3>
                  <p className="text-slate-500 text-xs font-medium italic">Immutable history of {meta.title} shards.</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <SearchCode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                     <input 
                       type="text" 
                       placeholder="Search Shard Hash..." 
                       className="bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-[10px] font-mono text-white focus:outline-none focus:border-emerald-500/50 w-64"
                     />
                  </div>
                  <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all"><Download size={18} /></button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {meta.ledgerItems.map((item, i) => (
                 <div key={i} className="p-8 glass-card rounded-[40px] border border-white/5 bg-black/40 group hover:border-white/10 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-110 transition-transform"><Database size={120} /></div>
                    <div className="flex justify-between items-start mb-6">
                       <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${meta.color}`}>
                          <Layers size={20} />
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${item.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {item.status}
                       </span>
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0">{item.name}</h4>
                       <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">{item.hash}</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                             <UserIcon size={12} className="text-slate-500" />
                          </div>
                          <span className="text-[8px] font-black text-slate-500 uppercase">Steward: {user.name.split(' ')[0]}</span>
                       </div>
                       <button className="text-[8px] font-black text-emerald-500 uppercase hover:text-emerald-400 flex items-center gap-2">View Shard <ChevronRight size={10} /></button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeInternalTab === 'oracle' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
               <div className={`w-20 h-20 rounded-[32px] bg-black/40 border ${meta.border} flex items-center justify-center mx-auto shadow-2xl`}>
                  <Bot size={40} className={meta.color} />
               </div>
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Dimension <span className={meta.color}>Oracle</span></h3>
               <p className="text-slate-500 text-lg font-medium italic max-w-xl mx-auto">
                 Query the specialized Agro Lang oracle for {meta.title} diagnostics and remediation shards.
               </p>
            </div>

            <div className="p-8 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-6">
               <div className="relative">
                  <textarea 
                    value={oracleQuery}
                    onChange={(e) => setOracleQuery(e.target.value)}
                    placeholder="Enter diagnostic query (e.g., 'Analyze metabolic drift in Sector 4 herd')..."
                    className="w-full h-40 bg-black/60 border border-white/10 rounded-[32px] p-8 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 resize-none font-medium italic"
                  />
                  <div className="absolute bottom-6 right-6 flex items-center gap-4">
                     <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Fee: 15 EAC</span>
                     <button 
                       onClick={handleRunOracleAudit}
                       disabled={isAuditing || !oracleQuery.trim()}
                       className="px-8 py-4 bg-emerald-600 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                     >
                        {isAuditing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="fill-current" />}
                        Run Diagnostic
                     </button>
                  </div>
               </div>
            </div>

            {oracleReport && (
              <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-6">
                <div className="p-10 bg-black/90 rounded-[48px] border border-white/10 shadow-3xl relative overflow-hidden group">
                   <div className={`absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform ${meta.color}`}><Bot size={200} /></div>
                   <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${meta.color}`}>
                            <FileSearch size={24} />
                         </div>
                         <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">Diagnostic Verdict</h4>
                      </div>
                      <button 
                        onClick={() => downloadReport(oracleReport, 'ORACLE_REPORT', type)}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all"
                      >
                        <Download size={20} />
                      </button>
                   </div>
                   <div className="text-slate-400 text-lg leading-relaxed italic whitespace-pre-line font-medium pl-8 border-l-2 border-emerald-500/30">
                      {oracleReport}
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeInternalTab === 'forge' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="p-12 glass-card rounded-[56px] border border-white/5 bg-black/40 text-center space-y-10 shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none"><Zap size={300} /></div>
               
               {forgeStep === 'input' && (
                 <div className="space-y-8 animate-in zoom-in">
                    <div className={`w-24 h-24 rounded-[32px] bg-black/40 border ${meta.border} flex items-center justify-center mx-auto shadow-2xl`}>
                       <Zap size={48} className={meta.color} />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">{meta.forgeTitle}</h3>
                       <p className="text-slate-500 text-lg font-medium italic">{meta.forgeDesc}</p>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-2 text-left">
                          <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-6">Registry Signature (ESIN)</label>
                          <input 
                            type="text" 
                            value={esinSign}
                            onChange={(e) => setEsinSign(e.target.value)}
                            placeholder="Enter your ESIN to authorize..."
                            className="w-full bg-black/60 border border-white/10 rounded-3xl px-8 py-5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500/50 text-center tracking-[0.2em]"
                          />
                       </div>
                       <button 
                         onClick={handleForgeShard}
                         disabled={isForging || !esinSign}
                         className="w-full py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                       >
                          {isForging ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} />}
                          Forge Identity Shard
                       </button>
                    </div>
                 </div>
               )}

               {forgeStep === 'success' && (
                 <div className="space-y-8 animate-in zoom-in">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                       <CheckCircle2 size={48} className="text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Shard <span className="text-emerald-400">Forged</span></h3>
                       <p className="text-slate-500 text-lg font-medium italic">Identity successfully anchored to the registry.</p>
                    </div>
                    <div className="p-6 bg-black/60 rounded-3xl border border-white/10 space-y-3">
                       <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Registry Finality Hash</p>
                       <p className="text-xs font-mono font-black text-emerald-400 break-all tracking-widest">{forgeResult}</p>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => setForgeStep('input')} className="flex-1 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Forge Another</button>
                       <button onClick={() => setActiveInternalTab('ledger')} className="flex-1 py-5 bg-emerald-600 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-500 transition-all">View Ledger</button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeInternalTab === 'sim' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  <div className="p-8 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                     <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-white uppercase italic flex items-center gap-4">
                           <Activity size={24} className={meta.color} /> Ecosystem Projection
                        </h3>
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                              <span className="text-[8px] font-black text-slate-600 uppercase">Equilibrium:</span>
                              <span className="text-xs font-mono font-black text-white">{calculateSimResult().toFixed(2)}</span>
                           </div>
                           <button 
                             onClick={handleSyncSim}
                             disabled={isSyncingSim}
                             className={`p-3 rounded-2xl border transition-all ${ecosystemState.isAnchored ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                           >
                              {isSyncingSim ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                           </button>
                        </div>
                     </div>
                     
                     <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={simChartData}>
                              <defs>
                                 <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={meta.accent} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={meta.accent} stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis 
                                dataKey="cycle" 
                                stroke="#475569" 
                                fontSize={8} 
                                tickLine={false} 
                                axisLine={false}
                                tick={{ fill: '#475569', fontWeight: 'bold' }}
                              />
                              <YAxis 
                                stroke="#475569" 
                                fontSize={8} 
                                tickLine={false} 
                                axisLine={false}
                                tick={{ fill: '#475569', fontWeight: 'bold' }}
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                itemStyle={{ color: meta.accent }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="val" 
                                stroke={meta.accent} 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorVal)" 
                                animationDuration={1500}
                              />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="p-8 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                     <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-3">
                        <Settings size={20} className={meta.color} /> Control Shards
                     </h3>
                     <div className="space-y-8">
                        {meta.simControls.map((control, i) => (
                          <div key={i} className="space-y-4">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{control.label}</span>
                                <span className="text-sm font-mono font-black text-white">{control.val.toFixed(2)}</span>
                             </div>
                             <input 
                               type="range"
                               min={control.min}
                               max={control.max}
                               step={control.step}
                               value={control.val}
                               onChange={(e) => control.set(parseFloat(e.target.value))}
                               className={`w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500`}
                             />
                          </div>
                        ))}
                     </div>
                     <div className="pt-6 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-amber-500">
                           <AlertCircle size={14} />
                           <span className="text-[8px] font-black uppercase tracking-widest italic">Simulation Drift Detected</span>
                        </div>
                        <p className="text-[10px] text-slate-600 font-medium italic leading-relaxed">
                          Adjusting these shards will recalibrate the global {meta.title} resonance. Ensure ESIN finality before anchoring.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .animate-scan { animation: scan 3s linear infinite; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.95); }
      `}</style>
    </div>
  );
};

export default ResourceDimensionBase;
