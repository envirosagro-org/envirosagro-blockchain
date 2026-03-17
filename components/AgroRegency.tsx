import React, { useState, useMemo, useEffect } from 'react';
import { 
  History, 
  Infinity, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Bot, 
  Loader2, 
  Binary, 
  Layers, 
  Compass, 
  Clock, 
  ArrowUpRight, 
  ArrowRight,
  Search, 
  Trash2, 
  Database, 
  Fingerprint, 
  RotateCcw, 
  Target, 
  LineChart, 
  FlaskConical, 
  Scale, 
  X,
  FileSearch,
  CheckCircle2,
  FileCheck,
  Binoculars,
  Info,
  ShieldAlert,
  Coins,
  Terminal,
  SearchCode,
  Download,
  ChevronRight,
  Stamp,
  Gavel,
  ShieldPlus,
  TrendingUp,
  Circle,
  FileDown,
  Globe,
  PlaneTakeoff,
  Map,
  Timer,
  Navigation,
  Globe2,
  Cpu,
  Workflow,
  MapPin,
  Atom,
  Dna,
  Landmark,
  Cloud,
  ChevronDown,
  Wind,
  Skull,
  Ghost,
  Boxes,
  Microscope,
  Sprout,
  Heart,
  Lightbulb,
  Radio,
  Eye,
  Tent,
  Building2,
  Rocket,
  Factory,
  Leaf,
  LayoutGrid
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Bar, Cell 
} from 'recharts';
import { User, MediaShard } from '../types';
import { chatWithAgroLang, AgroLangResponse } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import { SycamoreLogo } from '../App';
import { generateQuickHash } from '../systemFunctions';

interface AgroRegencyProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
}

const HISTORICAL_SHARDS = [
  { id: 'REG-G-001', date: '2024.11.12', ca: 0.85, m: 6.2, type: 'Initial Ingest', status: 'ARCHIVED' },
  { id: 'REG-G-442', date: '2024.12.20', ca: 1.02, m: 7.4, type: 'Cycle 1 Sync', status: 'ARCHIVED' },
  { id: 'REG-G-882', date: '2025.01.15', ca: 1.20, m: 8.5, type: 'Cycle 2 Expansion', status: 'ACTIVE' },
];

const TRAVEL_DIMENSIONS = [
  { id: 'geography', label: 'Geography', icon: Globe2, desc: 'Location-based sharding.' },
  { id: 'civilization', label: 'Civilization', icon: Landmark, desc: 'Social growth states.' },
  { id: 'biological', label: 'Biological', icon: Dna, desc: 'Genetic evolution.' },
  { id: 'temporal', label: 'Temporal', icon: Clock, desc: 'Time-space shifts.' },
  { id: 'philosophy', label: 'Taste/Philosophy', icon: Heart, desc: 'Agricultural taste profiles.' },
];

const STATE_SHARDS: Record<string, any[]> = {
  geography: [
    { id: 'kenya', name: 'Kenya (East Africa)', intensity: 0.42, density: 0.35, col: 'text-emerald-400', icon: MapPin, desc: 'Community-centric, moderate tech resonance.' },
    { id: 'singapore', name: 'Singapore (Urban High)', intensity: 1.25, density: 1.62, col: 'text-blue-400', icon: Building2, desc: 'Vertical sharding, high-density industrial loops.' },
    { id: 'netherlands', name: 'Netherlands (Precision)', intensity: 0.95, density: 0.95, col: 'text-amber-500', icon: Target, desc: 'Global leader in precision efficiency.' },
  ],
  civilization: [
    { id: 'barbaric', name: 'Primitive / Barbaric', intensity: 0.12, density: 0.15, col: 'text-rose-500', icon: Skull, desc: 'Low sharding, high manual stress (S).' },
    { id: 'industrial', name: 'Modern Industrial', intensity: 0.85, density: 0.75, col: 'text-slate-400', icon: Factory, desc: 'Standard planetary baseline.' },
    { id: 'cybernetic', name: 'Cybernetic / Future', intensity: 1.85, density: 2.10, col: 'text-indigo-400', icon: Rocket, desc: 'Total EA Studio / Agro Shell integration, ZK-Finality.' },
  ],
  biological: [
    { id: 'native', name: 'Native / Heirloom', intensity: 0.35, density: 0.45, col: 'text-emerald-500', icon: Sprout, desc: 'Heritage DNA, low output but high resilience.' },
    { id: 'hybrid', name: 'F1 Hybrid Shard', intensity: 0.75, density: 0.80, col: 'text-blue-500', icon: Boxes, desc: 'Balanced commercial lineage.' },
    { id: 'gmo', name: 'GMO / Synthetic', intensity: 1.45, density: 1.15, col: 'text-fuchsia-500', icon: Atom, desc: 'Maximum yield extraction, engineered traits.' },
  ],
  temporal: [
    { id: 'past', name: 'Past (Retrograde)', intensity: 0.30, density: 0.30, col: 'text-amber-600', icon: History, desc: 'Agricultural states from Cycle T-100.' },
    { id: 'present', name: 'Present (Registry)', intensity: 0.65, density: 0.65, col: 'text-white', icon: Clock, desc: 'Current real-time network status.' },
    { id: 'future', name: 'Future (Advance)', intensity: 2.45, density: 2.80, col: 'text-indigo-500', icon: SycamoreLogo, desc: 'Hypothetical states from Cycle T+50.' },
  ],
  philosophy: [
    { id: 'permaculture', name: 'Taste: Permaculture', intensity: 0.50, density: 1.10, col: 'text-emerald-400', icon: Leaf, desc: 'Closed-loop, low stress (S), high C(a).' },
    { id: 'monoculture', name: 'Taste: Industrialist', intensity: 1.15, density: 0.45, col: 'text-rose-400', icon: LayoutGrid, desc: 'High intensity, monoculture sharding.' },
    { id: 'cyber_regen', name: 'Taste: Cyber-Regen', intensity: 1.65, density: 1.85, col: 'text-indigo-400', icon: Bot, desc: 'Merging robot swarms with biodynamic soil.' },
  ]
};

const AgroRegency: React.FC<AgroRegencyProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'calculus' | 'retrieval' | 'oracle' | 'compliance' | 'travel'>('calculus');
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [queryId, setQueryId] = useState('');
  const [restoredShard, setRestoredShard] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [oracleReport, setOracleReport] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');

  // Sabbath / Fallowing Law State
  const [productionCycles, setProductionCycles] = useState(4);
  const [isSabbathActive, setIsSabbathActive] = useState(false);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  // Agro Travel States
  const [activeDimension, setActiveDimension] = useState('geography');
  const [selectedState, setSelectedState] = useState(STATE_SHARDS.geography[1]);
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelForecast, setTravelForecast] = useState<string | null>(null);

  // Archiving States
  const [isArchiving, setIsArchiving] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const derivativeData = useMemo(() => {
    const multiplier = isSabbathActive ? 1.5 : 1.0;
    return [
      { t: 'T1', velocity: 2.1 * multiplier, accel: 0.4 },
      { t: 'T2', velocity: 2.4 * multiplier, accel: 0.6 },
      { t: 'T3', velocity: 3.2 * multiplier, accel: 1.2 },
      { t: 'T4', velocity: 4.5 * multiplier, accel: 1.8 },
      { t: 'T5', velocity: 5.8 * multiplier, accel: 2.4 },
      { t: 'T6', velocity: 8.2 * multiplier, accel: 3.5 },
    ];
  }, [isSabbathActive]);

  const travelComparisonData = useMemo(() => {
    const userCa = user.metrics.agriculturalCodeU || 1.2;
    const localIntensity = 0.42; 
    const localDensity = 0.35;
    const localS = 0.12;

    const localM = Math.sqrt((localDensity * localIntensity * userCa) / localS);
    const targetM = Math.sqrt((selectedState.density * selectedState.intensity * userCa) / localS);

    return [
      { name: 'LOCAL_NODE', m: Number(localM.toFixed(2)), color: '#10b981' },
      { name: 'TARGET_SHARD', m: Number(targetM.toFixed(2)), color: '#6366f1' }
    ];
  }, [user.metrics.agriculturalCodeU, selectedState]);

  const handleRunTravelOracle = async () => {
    const fee = 40;
    if (!await onSpendEAC(fee, `AGRO_TRAVEL_DIMENSION_${activeDimension.toUpperCase()}`)) return;

    setIsTraveling(true);
    setTravelForecast(null);
    try {
      const prompt = `Act as the EnvirosAgro Travel Oracle. A steward is performing a "Temporal/Spatial State Shift".
      DIMENSION: ${activeDimension}
      TARGET STATE: ${selectedState.name}
      USER METRICS: Ca = ${user.metrics.agriculturalCodeU}, current m-constant = ${user.metrics.timeConstantTau}.
      TARGET ENVIRONMENT: Intensity = ${selectedState.intensity}, Density = ${selectedState.density}.
      
      Requirements:
      1. Forecast the "Resilience Deviation" if Sustainability (Ca) remains constant but they adopt the target's development state.
      2. If moving from "Barbaric to Modern" or "Native to GMO", analyze the cultural and industrial friction shards.
      3. Describe "Futuring Anomalies" the node might encounter in this new state.
      4. Provide a technical path for "Registry Synchronization" between their current local node and this target state.
      Format as a technical industrial report. Use markdown.`;

      const res = await chatWithAgroLang(prompt, []);
      setTravelForecast(res.text);
      onEarnEAC(20, 'TEMPORAL_SHARD_FORGED');
    } catch (e) {
      setTravelForecast("Temporal link unstable. Shard lost in transition.");
    } finally {
      setIsTraveling(false);
    }
  };

  const handleRetrievePast = () => {
    if (!queryId.trim()) return;
    setIsRetrieving(true);
    setTimeout(() => {
      const match = HISTORICAL_SHARDS.find(s => s.id === queryId);
      setRestoredShard(match || { id: queryId, status: 'NOT_FOUND' });
      setIsRetrieving(false);
      if (match) onEarnEAC(10, 'HISTORICAL_SHARD_RETRIEVAL_AUTH');
    }, 2000);
  };

  const handleOracleCalc = async () => {
    const fee = 15;
    if (!await onSpendEAC(fee, 'REGENCY_ORACLE_DERIVATIVE_AUDIT')) return;

    setIsAnalyzing(true);
    setOracleReport(null);
    setIsArchived(false);
    try {
      const prompt = `Act as an EnvirosAgro Regency Oracle. Execute the dy/dx derivative for this node:
      Current C(a): ${user.metrics.agriculturalCodeU}
      Current m-constant: ${user.metrics.timeConstantTau}
      Historical baseline: ${user.metrics.baselineM}
      Production Cycles: ${productionCycles}/6
      Sabbath Status: ${isSabbathActive ? 'ACTIVE' : 'IDLE'}
      
      Calculate the "Regenerative Velocity" (dy/dx). Analyze the impact of the 1/6th fallowing law (Sabbath-Yajna) on this node.`;
      const res = await chatWithAgroLang(prompt, []);
      setOracleReport(res.text);
    } catch (e) {
      setOracleReport("Derivative node timeout. Handshake interrupted.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnchorToLedger = async () => {
    if (!oracleReport && !travelForecast) return;
    if (isArchiving || isArchived) return;
    
    setIsArchiving(true);
    try {
      const content = travelForecast || oracleReport || "";
      const typeLabel = travelForecast ? 'TRAVEL_FORECAST' : 'REGENCY_DERIVATIVE';
      const shardHash = `0x${generateQuickHash()}`;
      
      const newShard: Partial<MediaShard> = {
        title: `${typeLabel}: ${user.esin}`,
        type: 'ORACLE',
        source: 'Regency Oracle',
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: shardHash,
        mImpact: (user.metrics.timeConstantTau).toFixed(2),
        size: '2.4 KB',
        content: content
      };
      
      await saveCollectionItem('media_ledger', newShard);
      setIsArchived(true);
      onEarnEAC(20, 'REGENCY_SHARD_ANCHOR_SUCCESS');
    } catch (e) {
      alert("LEDGER_FAILURE: Finality check failed.");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleAuthorizeFallow = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    
    setIsRecalibrating(true);
    setTimeout(() => {
      setIsSabbathActive(true);
      setProductionCycles(0);
      setIsRecalibrating(false);
      onEarnEAC(100, 'SABBATH_REGENERATION_INITIATED');
      alert("SABBATH_YAJNA_PROTOCOL_ACTIVE: Industrial production halted. Node m-constant recalibrating to high-resonance state.");
    }, 3000);
  };

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

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      
      {/* Immersive Header */}
      <div className="glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl text-white">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <Infinity className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.3)] ring-4 ring-white/5 shrink-0">
            <History className="w-20 h-20 text-white animate-spin-slow" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20 shadow-inner italic">REGISTRY_REGENCY_v5.0</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Agro <span className="text-indigo-400">Regency</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl">
               "Retrieving the past to calculate the derivative of the future. Executing dy/dx sustainability framework shards for absolute node calibration."
            </p>
         </div>
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'calculus', label: 'dy/dx Calculus', icon: Infinity },
          { id: 'compliance', label: 'Sabbath-Yajna Monitor', icon: Gavel },
          { id: 'travel', label: 'Agro Travel Hub', icon: PlaneTakeoff },
          { id: 'retrieval', label: 'Shard Retrieval', icon: FileSearch },
          { id: 'oracle', label: 'Regency Oracle', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id as any); setRestoredShard(null); setOracleReport(null); setTravelForecast(null); }}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-slate-200'}`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px]">
        
        {/* --- VIEW: AGRO TRAVEL HUB --- */}
        {activeTab === 'travel' && (
          <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left: Dimension & Destination Selection */}
                <div className="lg:col-span-5 space-y-8">
                   <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-black/40 space-y-10 shadow-3xl relative overflow-hidden group/term">
                      <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none group-hover/term:bg-indigo-500/[0.05] transition-colors"></div>
                      <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8">
                         <div className="p-4 bg-indigo-600 rounded-3xl shadow-3xl border-2 border-white/10 group-hover/term:rotate-12 transition-transform">
                            <PlaneTakeoff size={32} className="text-white" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Travel <span className="text-indigo-400">Terminal</span></h3>
                            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-3">FUTURING_STATE_ENGINE_v6.5</p>
                         </div>
                      </div>

                      <div className="space-y-10 relative z-10">
                         {/* Dimension Selector */}
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic px-4">Choose Travel Dimension</label>
                            <div className="grid grid-cols-5 gap-2 px-2">
                               {TRAVEL_DIMENSIONS.map(dim => (
                                 <button 
                                   key={dim.id}
                                   onClick={() => { setActiveDimension(dim.id); setSelectedState(STATE_SHARDS[dim.id][0]); }}
                                   className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group/dim ${activeDimension === dim.id ? 'bg-indigo-600 border-white text-white shadow-xl' : 'bg-black border-white/5 text-slate-700 hover:border-white/10'}`}
                                   title={dim.desc}
                                 >
                                    <dim.icon size={18} className={activeDimension === dim.id ? 'text-white' : 'text-slate-600'} />
                                    <span className="text-[7px] font-black uppercase tracking-tight">{dim.label}</span>
                                 </button>
                               ))}
                            </div>
                         </div>

                         {/* Destination Selector */}
                         <div className="space-y-4 px-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic px-4">Target Destination State</label>
                            <div className="grid grid-cols-1 gap-3">
                               {STATE_SHARDS[activeDimension].map(dest => (
                                 <button 
                                   key={dest.id}
                                   onClick={() => setSelectedState(dest)}
                                   className={`p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group/btn ${selectedState.id === dest.id ? 'bg-indigo-600/10 border-indigo-500 shadow-xl' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}
                                 >
                                    <div className="flex items-center gap-4">
                                       <div className={`p-3 rounded-xl bg-white/5 ${selectedState.id === dest.id ? dest.col : 'text-slate-800'}`}>
                                          <dest.icon size={20} />
                                       </div>
                                       <div>
                                          <span className={`text-[11px] font-black uppercase tracking-widest block ${selectedState.id === dest.id ? 'text-white' : ''}`}>{dest.name}</span>
                                          <p className="text-[8px] text-slate-500 font-bold mt-1 uppercase line-clamp-1 italic">"{dest.desc}"</p>
                                       </div>
                                    </div>
                                    <ChevronRight size={18} className={selectedState.id === dest.id ? 'text-indigo-400' : 'text-slate-900'} />
                                 </button>
                               ))}
                            </div>
                         </div>

                         <div className="p-8 bg-black rounded-[44px] border border-white/5 shadow-inner">
                            <div className="flex justify-between items-center px-4">
                               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-3">
                                  <Binary size={14} className="text-emerald-400" /> Constant Anchor
                               </p>
                               <span className="text-sm font-mono font-black text-emerald-500">C(a): {user.metrics.agriculturalCodeU}</span>
                            </div>
                         </div>

                         <button 
                           onClick={handleRunTravelOracle}
                           disabled={isTraveling}
                           className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30 border-2 border-white/10 ring-8 ring-indigo-500/5"
                         >
                            {isTraveling ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} className="fill-current" />}
                            {isTraveling ? 'SYNCHRONIZING TEMPORAL...' : 'INITIATE STATE SHIFT'}
                         </button>
                      </div>
                   </div>

                   <div className="p-10 glass-card rounded-[56px] border border-blue-500/20 bg-blue-950/10 space-y-6 group shadow-xl">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 group-hover:rotate-12 transition-transform"><Bot size={24} className="text-blue-500" /></div>
                         <h4 className="text-xl font-black text-white uppercase italic">Travel <span className="text-blue-400">Logic</span></h4>
                      </div>
                      <p className="text-sm text-slate-400 italic leading-relaxed">
                         "Selecting states based on your desired Taste/Philosophy or developmental trajectory allows the registry to forecast Resilience (m) deviations while maintaining your individual Sustainability Constant ($C_a$)."
                      </p>
                   </div>
                </div>

                {/* Right: Analytics & Narrative Forecast */}
                <div className="lg:col-span-7 space-y-8">
                   {/* Resilience Deviation Chart */}
                   <div className="glass-card p-10 rounded-[64px] border border-white/5 bg-[#050706] shadow-3xl h-[400px] flex flex-col relative overflow-hidden group/chart">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/chart:scale-110 transition-transform duration-[10s]"><Activity size={200} className="text-emerald-500" /></div>
                      <div className="flex justify-between items-center mb-10 px-6 relative z-10">
                         <div className="flex items-center gap-4">
                            <Target size={18} className="text-emerald-400" />
                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Resonance Shift Comparison (m)</h4>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                               <span className="text-[9px] text-slate-700 font-black uppercase">Local Node</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_100px_#6366f1]"></div>
                               <span className="text-[9px] text-slate-700 font-black uppercase">Target State</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex-1 w-full relative z-10 px-6">
                         <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={travelComparisonData} layout="vertical">
                               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                               <XAxis type="number" hide />
                               <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.3)" fontSize={11} fontStyle="italic" width={120} axisLine={false} tickLine={false} />
                               <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                               <Bar dataKey="m" radius={[0, 20, 20, 0]} barSize={50}>
                                  {travelComparisonData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                               </Bar>
                            </ComposedChart>
                         </ResponsiveContainer>
                      </div>
                      
                      <div className="pt-6 border-t border-white/5 mt-4 flex items-center justify-between text-[10px] font-black text-slate-700 relative z-10 px-6">
                         <span className="uppercase tracking-widest">CONSTANT_ANCHOR_C(a): {user.metrics.agriculturalCodeU}</span>
                         <span className="italic uppercase tracking-widest text-indigo-400">CALCULATED_DELTA: {(((travelComparisonData[1].m - travelComparisonData[0].m)/travelComparisonData[0].m) * 100).toFixed(1)}%</span>
                      </div>
                   </div>

                   {/* Futuring Narrative Forecast */}
                   <div className="glass-card rounded-[64px] border-2 border-white/5 bg-black/60 min-h-[500px] flex flex-col relative overflow-hidden shadow-3xl">
                      <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 px-14">
                         <div className="flex items-center gap-6">
                            <Bot className="text-indigo-400 w-10 h-10 animate-pulse" />
                            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0">Futuring <span className="text-indigo-400">Oracle Payload</span></h4>
                         </div>
                         {travelForecast && (
                            <button onClick={() => setTravelForecast(null)} className="p-3 bg-white/5 border border-white/10 rounded-full text-slate-700 hover:text-white transition-all active:scale-90"><Trash2 size={20}/></button>
                         )}
                      </div>

                      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative bg-[#050706]">
                         {isTraveling ? (
                           <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                              <div className="relative">
                                 <div className="w-48 h-48 rounded-full border-8 border-indigo-500/10 flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.2)]">
                                    <Loader2 size={100} className="text-indigo-500 animate-spin mx-auto" />
                                 </div>
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <SycamoreLogo className="w-12 h-12 text-indigo-400 animate-pulse" />
                                 </div>
                              </div>
                              <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">FORGING_STATE_SHARD...</p>
                           </div>
                         ) : travelForecast ? (
                           <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12">
                              <div className="p-12 md:p-20 bg-black/80 rounded-[80px] border-2 border-indigo-500/20 prose prose-invert prose-emerald max-w-none shadow-[0_40px_150px_rgba(0,0,0,0.9)] border-l-[20px] border-l-indigo-600 relative overflow-hidden group/shard">
                                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/shard:scale-110 transition-transform duration-[12s] pointer-events-none"><Atom size={600} className="text-indigo-400" /></div>
                                 <div className="text-slate-300 text-2xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-8 border-l-2 border-white/10">
                                    {travelForecast}
                                 </div>
                                 <div className="mt-20 pt-10 border-t border-white/10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                    <div className="flex items-center gap-6">
                                       <Fingerprint size={48} className="text-indigo-400" />
                                       <div className="text-left">
                                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">TEMPORAL_HASH</p>
                                          <p className="text-xl font-mono text-white">0x{generateQuickHash()}_FUTURING_OK</p>
                                       </div>
                                    </div>
                                    <div className="flex gap-6">
                                       <button onClick={() => downloadReport(travelForecast || "", selectedState.name, 'Futuring')} className="px-12 py-5 bg-white/5 border-2 border-white/10 rounded-full text-slate-400 hover:text-white transition-all flex items-center gap-4 text-[11px] font-black uppercase tracking-widest shadow-xl">
                                          <Download size={20} /> Download Shard
                                       </button>
                                       <button 
                                          onClick={handleAnchorToLedger}
                                          disabled={isArchiving || isArchived}
                                          className={`px-16 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ${isArchived ? 'bg-emerald-600/50 border-emerald-500/50 ring-emerald-500/10' : 'agro-gradient ring-white/5'}`}
                                       >
                                          {isArchiving ? <Loader2 size={18} className="animate-spin" /> : isArchived ? <CheckCircle2 size={18} /> : <Stamp size={18} />}
                                          {isArchived ? 'ANCHORED' : 'ANCHOR TO LEDGER'}
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                         ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-10 group">
                              <div className="relative">
                                 <PlaneTakeoff size={180} className="text-slate-500 group-hover:text-indigo-400 transition-colors duration-1000" />
                                 <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                              </div>
                              <div className="space-y-4">
                                 <p className="text-6xl font-black uppercase tracking-[0.6em] text-white italic leading-none">FUTURING_STANDBY</p>
                                 <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Select a dimension and state to begin state transition</p>
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'calculus' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-500">
             <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border border-white/5 bg-black/60 relative overflow-hidden flex flex-col shadow-3xl group text-white">
                <div className="flex justify-between items-center mb-12 relative z-10 px-4 gap-8">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 shadow-xl group-hover:scale-110 transition-transform">
                         <Activity className="w-10 h-10 text-indigo-400" />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Regenerative <span className="text-indigo-400">Velocity</span></h3>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] mt-3">EOS_CALCULUS_SYNC // dy/dx_ACTIVE</p>
                      </div>
                   </div>
                   <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-[32px] text-center min-w-[180px] shadow-2xl">
                      <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">Instantaneous Rate</p>
                      <p className="text-4xl font-mono font-black text-white">+{isSabbathActive ? '4.82' : '1.84'}<span className="text-sm ml-1 text-emerald-400">Δ</span></p>
                   </div>
                </div>
                <div className="flex-1 h-[400px] w-full min-h-0 relative z-10">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={derivativeData}>
                         <defs>
                            <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                         <XAxis dataKey="t" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                         <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                         <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                         <Area type="monotone" name="Velocity (dy/dx)" dataKey="velocity" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorVelocity)" />
                         <Area type="stepAfter" name="Acceleration" dataKey="accel" stroke="#10b981" strokeWidth={2} fill="transparent" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <div className="lg:col-span-4 space-y-8 text-white">
                <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-950/10 space-y-8 shadow-xl relative overflow-hidden group">
                   <h4 className="text-xl font-black text-white uppercase italic flex items-center gap-3 relative z-10">
                      <Binary className="w-6 h-6 text-emerald-400" /> Shard Formula
                   </h4>
                   <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-4 shadow-inner relative z-10">
                      <p className="text-sm font-mono text-emerald-500 font-black leading-loose text-center">
                         dy/dx = lim[Δx→0] <br/> (f(x+Δx) - f(x)) / Δx
                      </p>
                   </div>
                   <button className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 relative z-10">
                      <Zap size={16} fill="currentColor" /> Refresh Calculus Node
                   </button>
                </div>
                
                <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-950/5 space-y-6 shadow-xl group">
                   <div className="flex items-center gap-4">
                      <TrendingUp size={20} className="text-indigo-400" />
                      <h4 className="text-lg font-black uppercase italic tracking-widest">Growth Vector</h4>
                   </div>
                   <p className="text-sm text-slate-400 italic">"Node productivity is trending upwards. m-constant delta is +0.02 per cycle."</p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'compliance' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-7 glass-card p-16 md:p-24 rounded-[80px] border-2 border-emerald-500/20 bg-[#020503] shadow-3xl text-center space-y-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Gavel size={800} className="text-emerald-400" /></div>
                    
                    <div className="relative z-10 space-y-10">
                       <div className="w-32 h-32 rounded-[44px] bg-emerald-600 flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 animate-float">
                          <Gavel size={56} className="text-white" />
                       </div>
                       <div className="space-y-6">
                          <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">SABBATH <span className="text-emerald-400">PROTOCOL</span></h3>
                          <p className="text-slate-400 text-xl font-medium italic max-w-2xl mx-auto">"For every 6 cycles of production, the land requires 1 cycle of regenerative fallow. Compliance ensures long-term m-constant survival."</p>
                       </div>

                       <div className="flex flex-col items-center gap-8 py-10 border-y border-white/5 max-w-xl mx-auto">
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em]">PRODUCTION_CYCLE_ACCUMULATION</p>
                          <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className={`w-12 h-16 rounded-xl border-2 transition-all duration-700 flex flex-col items-center justify-center ${i <= productionCycles ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-800'}`}>
                                   <p className="text-xs font-mono font-black">{i}</p>
                                   <Circle size={8} className={`mt-2 ${i <= productionCycles ? 'fill-indigo-400' : 'fill-transparent'}`} />
                                </div>
                             ))}
                          </div>
                          <p className={`text-sm font-black uppercase tracking-widest ${productionCycles >= 6 ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`}>
                             {productionCycles >= 6 ? 'THRESHOLD_REACHED: FALLOW_REQUIRED' : `${6 - productionCycles} CYCLES UNTIL FALLOW`}
                          </p>
                       </div>

                       <div className="max-w-md mx-auto space-y-8">
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">ADMIN SIGNATURE (ESIN)</label>
                             <input 
                                type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                                placeholder="EA-XXXX-XXXX"
                                className="w-full bg-black border-2 border-white/10 rounded-[32px] py-8 text-center text-4xl font-mono text-white outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                             />
                          </div>
                          <button 
                             onClick={handleAuthorizeFallow}
                             disabled={isRecalibrating || !esinSign || productionCycles < 6}
                             className={`w-full py-10 rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl transition-all border-4 border-white/10 ring-[16px] ring-white/5 ${isRecalibrating ? 'bg-indigo-900' : productionCycles < 6 ? 'bg-white/5 text-slate-700 cursor-not-allowed grayscale' : 'agro-gradient hover:scale-105 active:scale-95'}`}
                          >
                             {isRecalibrating ? <Loader2 className="animate-spin mx-auto" /> : <Stamp className="w-8 h-8 mx-auto" />}
                             <p className="mt-2">{isRecalibrating ? 'CALIBRATING FALLOW...' : 'AUTHORIZE FALLOW SHARD'}</p>
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-5 space-y-8 flex flex-col">
                    <div className="glass-card p-12 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-950/10 flex flex-col text-center space-y-12 shadow-3xl relative overflow-hidden flex-1 group">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[12s]"><SycamoreLogo size={300} className="text-indigo-400" /></div>
                       <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 relative z-10 animate-float">
                          <Bot size={56} className="text-white animate-pulse" />
                       </div>
                       <div className="space-y-4 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Regenerative <span className="text-indigo-400">Impact</span></h4>
                          <p className="text-slate-400 text-lg leading-relaxed italic px-10">
                             "The fallowing law ensures that the variable 'm' does not decay to zero through over-extraction. One sixth of production time is the mathematical minimum for planetary balance."
                          </p>
                       </div>
                       <div className="p-10 bg-black/60 rounded-[48px] border-2 border-indigo-500/20 w-full relative z-10 shadow-inner">
                          <p className="text-[11px] text-slate-700 uppercase font-black mb-4">Registry Compliance Score</p>
                          <p className="text-7xl font-mono font-black text-indigo-400 tracking-tighter italic">0.98<span className="text-xl">μ</span></p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
        
        {activeTab === 'retrieval' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500 text-white">
              <div className="glass-card p-16 rounded-[64px] border border-white/10 bg-black/40 shadow-3xl text-center space-y-12 relative overflow-hidden group">
                 <div className="text-center space-y-6 relative z-10">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl animate-float">
                       <History size={48} />
                    </div>
                    <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Retrieve <span className="text-indigo-400">Past Shards</span></h3>
                 </div>
                 <div className="space-y-8 max-w-xl mx-auto relative z-10">
                    <input 
                      type="text" value={queryId} onChange={e => setQueryId(e.target.value)}
                      placeholder="Enter Shard Identifier..." 
                      className="w-full bg-black/60 border border-white/10 rounded-[40px] py-10 text-center text-3xl font-mono text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-stone-900 shadow-inner tracking-widest" 
                    />
                    <button 
                      onClick={handleRetrievePast}
                      disabled={isRetrieving || !queryId}
                      className="w-full py-10 bg-indigo-600 hover:bg-indigo-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30"
                    >
                       {isRetrieving ? <Loader2 size={80} className="w-8 h-8 animate-spin" /> : <History className="w-8 h-8" />}
                       {isRetrieving ? 'QUERYING LEDGER...' : 'INITIALIZE RETRIEVAL'}
                    </button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'oracle' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700 text-center text-white">
              <div className="p-10 md:p-20 glass-card rounded-[80px] border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center gap-12 shadow-3xl group">
                 <div className="relative z-10 space-y-8 w-full">
                    <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                       <Bot size={64} className="text-white animate-pulse" />
                    </div>
                    <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Regency <span className="text-indigo-400">Oracle</span></h3>
                 </div>
                 <button 
                  onClick={handleOracleCalc}
                  disabled={isAnalyzing}
                  className="w-full max-w-md py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30"
                 >
                    {isAnalyzing ? <Loader2 size={80} className="w-8 h-8 animate-spin" /> : <Zap size={20} fill="current" />}
                    {isAnalyzing ? "EXECUTING CALCULUS..." : "EXECUTE dy/dx AUDIT"}
                 </button>
                 {oracleReport && (
                    <div className="mt-10 p-10 bg-black/60 rounded-[48px] border border-indigo-500/20 text-left animate-in fade-in space-y-10">
                       <p className="text-slate-300 text-xl leading-loose italic">{oracleReport}</p>
                       <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
                          {/* Calling downloadReport here correctly now */}
                          <button onClick={() => downloadReport(oracleReport || "", "Regency", "Audit")} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl">
                             <Download size={18} /> Download Shard
                          </button>
                          <button 
                            onClick={handleAnchorToLedger}
                            disabled={isArchiving || isArchived}
                            className={`px-12 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ${isArchived ? 'bg-emerald-600/50 border-emerald-500/50 ring-emerald-500/10' : 'agro-gradient ring-white/5'}`}
                          >
                             {isArchiving ? <Loader2 size={18} className="animate-spin" /> : isArchived ? <CheckCircle2 size={18} /> : <Stamp size={18} />}
                             {isArchived ? 'ANCHORED' : 'ANCHOR TO LEDGER'}
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
      `}</style>
    </div>
  );
};

export default AgroRegency;