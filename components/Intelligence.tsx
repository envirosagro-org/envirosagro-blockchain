import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Monitor, Cpu, Activity, Zap, ShieldCheck, Binary, Layers, Microscope, FlaskConical, Scan, 
  AlertCircle, TrendingUp, Droplets, Wind, Sprout, Bot, Database, Upload, 
  MapPin, X, Loader2, Leaf, Gauge, Fingerprint, SearchCode, History, 
  ChevronRight, LineChart, HeartPulse, Radar, 
  CheckCircle2, Info, ArrowUpRight, BrainCircuit, 
  Terminal, Atom, ImageIcon, FileSearch, 
  Coins, ShieldAlert, CloudUpload, 
  ClipboardCheck, Dna, Workflow, Target, Waves, 
  RefreshCw, Radiation, BoxSelect, Maximize2, Smartphone, Send,
  Brain, Network, FileDigit, Settings, Download, Globe, Camera,
  Box, Database as Disk, Globe2, ExternalLink,
  ScanLine, BadgeCheck, LayoutGrid, ClipboardList,
  HardDrive, Stamp, FileText,
  // Added missing icons to fix component crash
  Wifi, Play, Mountain
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { chatWithAgroLang, analyzeSustainability, AgroLangResponse, searchAgroTrends, runSimulationAnalysis, analyzeMedia } from '../services/agroLangService';
import { User, AgroResource, ViewState, MediaShard } from '../types';
// Fixed: Removed non-existent exports backupTelemetryShard and fetchTelemetryBackup
import { saveCollectionItem } from '../services/firebaseService';
import { SycamoreLogo } from '../App';
import { generateQuickHash } from '../systemFunctions';

interface IntelligenceProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onOpenEvidence?: () => void;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

type TabState = 'hub' | 'twin' | 'simulator' | 'trends' | 'telemetry' | 'eos_agro_lang' | 'sid' | 'evidence';
type OracleMode = 'BIO_DIAGNOSTIC' | 'SPECTRAL_AUDIT' | 'GENOMIC_INQUIRY' | 'SOIL_REMEDIATION';

const ORACLE_QUERY_COST = 25;
const SID_SCAN_COST = 40;
const BATCH_AUDIT_COST = 100;

const NEURAL_STEPS = [
  "Inflow Detected. Buffering Shard...",
  "Analyzing Spectral Pigments...",
  "Querying Biological Knowledge Shards...",
  "Sequencing Multi-Thrust Neurals...",
  "Identifying Anomaly Vectors...",
  "Synthesizing Diagnostic Verdict..."
];

const SID_STEPS = [
  "Initializing Particle Filter...",
  "Calibrating Bio-Aura Shards...",
  "Detecting Dissonant Frequencies...",
  "Mapping Viral Footprint...",
  "Calculating SID Saturation..."
];

const Intelligence: React.FC<IntelligenceProps> = ({ user, onEarnEAC, onSpendEAC, onOpenEvidence, onNavigate, initialSection }) => {
  const [activeTab, setActiveTab] = useState<TabState>(initialSection as TabState || 'hub');
  const [archivedShards, setArchivedShards] = useState<Set<string>>(new Set());
  const [isArchiving, setIsArchiving] = useState<string | null>(null);

  // Vector Routing Logic
  useEffect(() => {
    if (initialSection && initialSection !== activeTab) {
      setActiveTab(initialSection as TabState);
    }
  }, [initialSection]);

  const anchorToLedger = async (content: string, type: string, mode: string) => {
    const shardKey = `${type}_${mode}_${content.substring(0, 20)}`;
    if (archivedShards.has(shardKey)) return;
    
    setIsArchiving(shardKey);
    try {
      const shardHash = `0x${generateQuickHash()}`;
      const newShard: Partial<MediaShard> = {
        title: `${type.toUpperCase()}: ${mode.replace('_', ' ')}`,
        type: 'ORACLE',
        source: 'Science Oracle',
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: shardHash,
        mImpact: (1.42 + Math.random() * 0.1).toFixed(2),
        size: `${(content.length / 1024).toFixed(1)} KB`,
        content: content
      };
      
      await saveCollectionItem('media_ledger', newShard);
      setArchivedShards(prev => {
        const next = new Set(prev);
        next.add(shardKey);
        return next;
      });
      onEarnEAC(20, `LEDGER_ANCHOR_${type.toUpperCase()}_SUCCESS`);
    } catch (e) {
      console.error("Ledger anchor failed", e);
    } finally {
      setIsArchiving(null);
    }
  };

  const downloadReport = (content: string, title: string, category: string) => {
    const report = `ENVIROSAGRO™ ${category.toUpperCase()} REPORT\nTITLE: ${title}\nNODE: ${user.esin}\nDATE: ${new Date().toISOString()}\n\n${content}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- BATCH AUDIT STANDS ---
  const [isBatchAuditing, setIsBatchAuditing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<Record<string, number>>({
    twin: 0, physics: 0, trends: 0, telemetry: 0, sid: 0
  });
  const [masterVerdict, setMasterVerdict] = useState<string | null>(null);

  const handleStartBatchAudit = async () => {
    if (!await onSpendEAC(BATCH_AUDIT_COST, 'MASTER_INTELLIGENCE_QUORUM_SYNC')) return;
    
    setIsBatchAuditing(true);
    setMasterVerdict(null);
    setBatchProgress({ twin: 0, physics: 0, trends: 0, telemetry: 0, sid: 0 });

    const shardKeys = ['twin', 'physics', 'trends', 'telemetry', 'sid'];
    shardKeys.forEach((key, i) => {
      const interval = setInterval(() => {
        setBatchProgress(prev => {
          const newVal = Math.min(100, prev[key] + Math.random() * 15);
          if (newVal === 100) clearInterval(interval);
          return { ...prev, [key]: newVal };
        });
      }, 300 + Math.random() * 500);
    });

    await new Promise(resolve => setTimeout(resolve, 6000));

    try {
      const prompt = `Perform a master synthesis of all intelligence shards for Node ${user.esin}. Provide a high-level strategic industrial directive.`;
      const response = await chatWithAgroLang(prompt, []);
      setMasterVerdict(response.text);
      onEarnEAC(100, 'MASTER_INTELLIGENCE_QUORUM_SYNC_YIELD');
    } catch (e) {
      setMasterVerdict("MASTER_SYNC_ERROR: Quorum not reached.");
    } finally {
      setIsBatchAuditing(false);
    }
  };

  // --- IOT TELEMETRY STATES ---
  const hardwareNodes = useMemo(() => (user.resources || []).filter(r => r.category === 'HARDWARE'), [user.resources]);
  const [selectedIotNode, setSelectedIotNode] = useState<AgroResource | null>(hardwareNodes[0] || null);
  const [telemetryLogs, setTelemetryLogs] = useState<{timestamp: string, metric: string, value: string}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (['telemetry', 'hub', 'twin'].includes(activeTab)) {
        const metrics = ['Temperature', 'Soil Purity', 'm-Constant Drift', 'Photosynthetic Flux'];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const value = (Math.random() * 100).toFixed(2);
        const newLog = { timestamp: new Date().toLocaleTimeString(), metric, value };
        setTelemetryLogs(prev => [newLog, ...prev].slice(0, 8));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // --- SIMULATOR ---
  const [r_resonance, setRResonance] = useState(1.12);
  const [in_intensity, setInIntensity] = useState(0.78);
  const [s_stress, setSStress] = useState(0.12);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [simulationReport, setSimulationReport] = useState<string | null>(null);

  const simProjectionData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 12; i++) {
      const ca = 1.2 * i + 1; // dummy ca
      const m = Math.sqrt((0.92 * in_intensity * ca) / Math.max(s_stress, 0.01));
      data.push({ cycle: i, m: Number(m.toFixed(2)), score: Math.min(100, (m * 10)) });
    }
    return data;
  }, [in_intensity, s_stress]);

  const handleRunFullSimulation = async () => {
    if (!await onSpendEAC(50, 'FULL_SUSTAINABILITY_SIMULATION_INGEST')) return;
    setIsRunningSimulation(true);
    setSimulationReport(null);
    try {
      const res = await runSimulationAnalysis({ m: simProjectionData[12].m, stress: s_stress });
      setSimulationReport(res.text);
    } catch (e: any) {
      setSimulationReport("SIMULATION_ERROR: Handshake interrupted.");
    } finally {
      setIsRunningSimulation(false);
    }
  };

  // --- SID SCANNER ---
  const [isSidScanning, setIsSidScanning] = useState(false);
  const [sidResult, setSidResult] = useState<AgroLangResponse | null>(null);
  const [sidStepIndex, setSidStepIndex] = useState(0);

  const handleRunSidScan = async () => {
    if (!await onSpendEAC(SID_SCAN_COST, 'SID_VIRAL_LOAD_SCAN')) return;
    setIsSidScanning(true);
    setSidResult(null);
    setSidStepIndex(0);
    const stepInterval = setInterval(() => setSidStepIndex(p => (p < SID_STEPS.length - 1 ? p + 1 : p)), 1000);
    try {
      const res = await chatWithAgroLang(`Perform a SID Scan for Node ${user.esin}.`, []);
      setSidResult(res);
      onEarnEAC(20, 'SID_DIAGNOSTIC_INGEST_OK');
    } finally {
      clearInterval(stepInterval);
      setIsSidScanning(false);
    }
  };

  // --- SCIENCE ORACLE (EOS AI) ---
  const [aiQuery, setAiQuery] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<AgroLangResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const oracleFileInputRef = useRef<HTMLInputElement>(null);

  const handleDeepAIQuery = async () => {
    if (!aiQuery.trim() || !uploadedFile) return;
    if (!await onSpendEAC(ORACLE_QUERY_COST, "ORACLE_DIAGNOSTIC_INQUIRY")) return;
    setAiThinking(true);
    setAiResult(null);
    try {
      const resText = await analyzeMedia(fileBase64!, 'image/jpeg', aiQuery);
      setAiResult({ text: resText });
      onEarnEAC(10, "ORACLE_DIAGNOSTIC_FINALIZED");
    } finally {
      setAiThinking(false);
    }
  };

  // --- TREND INGEST ---
  const [isIngestingTrends, setIsIngestingTrends] = useState(false);
  const [trendsResult, setTrendsResult] = useState<AgroLangResponse | null>(null);
  const handleIngestTrends = async () => {
    setIsIngestingTrends(true);
    try {
      const res = await searchAgroTrends("latest agricultural trends 2025");
      setTrendsResult(res);
      onEarnEAC(10, "GLOBAL_TREND_INGEST_OK");
    } finally { setIsIngestingTrends(false); }
  };

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-500 pb-48 max-w-[1600px] mx-auto px-4 relative">
      {/* HUD Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <Microscope className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0">
              <Cpu className="w-20 h-20 text-white animate-pulse" />
           </div>
           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">EOS_SCIENCE_ORACLE_V6</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Science <span className="text-emerald-400">& Intelligence</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Executing technical sharding and biological simulation protocols for node {user.esin}."
              </p>
           </div>
        </div>
        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2 relative z-10">Node Ingest Status</p>
           <h4 className="text-6xl font-mono font-black text-white tracking-tighter relative z-10 leading-none">99<span className="text-xl text-emerald-500 italic">.9</span></h4>
           <div className="flex items-center justify-center gap-3 text-emerald-400 text-[10px] font-black uppercase relative z-10 tracking-widest border border-emerald-500/20 bg-emerald-500/5 py-2 px-4 rounded-full shadow-inner">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div> ACTIVE_SYNC
           </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-2xl w-fit border border-white/5 bg-black/40 shadow-xl mx-auto lg:mx-0">
        {[
          { id: 'hub', name: 'Master Hub', icon: LayoutGrid },
          { id: 'twin', name: 'Digital Twin', icon: Box },
          { id: 'simulator', name: 'EOS Simulator', icon: Cpu },
          { id: 'trends', name: 'Trend Ingest', icon: TrendingUp },
          { id: 'telemetry', name: 'IoT Telemetry', icon: Wifi },
          { id: 'eos_agro_lang', name: 'Science Oracle', icon: Bot },
          { id: 'sid', name: 'SID Scanner', icon: Radiation },
          { id: 'evidence', name: 'Evidence Vault', icon: CloudUpload },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <t.icon className="w-4 h-4" /> {t.name}
          </button>
        ))}
      </div>

      {/* Viewport */}
      <div className="min-h-[70vh] md:min-h-[80vh] space-y-16 md:space-y-24">
        {/* HUB */}
        {activeTab === 'hub' && (
          <div className="space-y-12 animate-in fade-in duration-700">
             <div className="p-10 md:p-14 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-950/5 flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[20s]"><Leaf size={600} className="text-indigo-400" /></div>
                <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                   <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-float border-4 border-white/10 shrink-0">
                      <Zap className="w-10 h-10 text-white fill-current" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Intelligence <span className="text-indigo-400">Quorum Sync.</span></h4>
                      <p className="text-slate-400 text-lg font-medium italic max-w-2xl leading-relaxed">"Initialize a high-fidelity batch audit across all intelligence shards. Synchronize Twin, Simulator, and Oracle metrics."</p>
                   </div>
                </div>
                <button onClick={handleStartBatchAudit} disabled={isBatchAuditing} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5 relative z-10 disabled:opacity-50">
                   {isBatchAuditing ? <Loader2 className="animate-spin w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                   <span className="ml-4">{isBatchAuditing ? 'PROCESSING_BATCH...' : 'RUN ALL SHARDS'}</span>
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Mini Shards */}
                <div onClick={() => setActiveTab('twin')} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 hover:border-blue-500/30 transition-all group flex flex-col justify-between shadow-xl cursor-pointer">
                   <div className="flex justify-between items-start"><div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform"><Box size={24} /></div><span className="text-[9px] font-black text-slate-700 uppercase">DIGITAL_TWIN</span></div>
                   <h4 className="text-xl font-black text-white uppercase italic">Twin Calibration</h4>
                   <p className="text-[10px] text-slate-500 italic">"94.2% stability index reached."</p>
                </div>
                <div onClick={() => setActiveTab('simulator')} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col justify-between shadow-xl cursor-pointer">
                   <div className="flex justify-between items-start"><div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform"><Cpu size={24} /></div><span className="text-[9px] font-black text-slate-700 uppercase">PHYSICS_ENGINE</span></div>
                   <h4 className="text-xl font-black text-white uppercase italic">EOS Simulator</h4>
                   <p className="text-[10px] text-slate-500 italic">"12 Cycles Projected (m=1.61)."</p>
                </div>
                <div onClick={() => setActiveTab('sid')} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 hover:border-rose-500/30 transition-all group flex flex-col justify-between shadow-xl cursor-pointer">
                   <div className="flex justify-between items-start"><div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform"><Radiation size={24} /></div><span className="text-[9px] font-black text-slate-700 uppercase">BIO_SECURITY</span></div>
                   <h4 className="text-xl font-black text-white uppercase italic">SID Scanner</h4>
                   <p className="text-[10px] text-slate-500 italic">"Social immunity: 98% nominal."</p>
                </div>
                <div onClick={() => setActiveTab('eos_agro_lang')} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-xl cursor-pointer">
                   <div className="flex justify-between items-start"><div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform"><Bot size={24} /></div><span className="text-[9px] font-black text-slate-700 uppercase">NEURAL_HUB</span></div>
                   <h4 className="text-xl font-black text-white uppercase italic">Science Oracle</h4>
                   <p className="text-[10px] text-slate-500 italic">"Expert audit ready for ingest."</p>
                </div>
             </div>

             {masterVerdict && (
               <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-l-[20px] border-l-emerald-600 border-2 border-emerald-500/20 shadow-3xl animate-in slide-in-from-bottom-10 duration-1000">
                  <div className="prose prose-invert max-w-none text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium pl-10 border-l-2 border-white/5">
                     {masterVerdict}
                  </div>
                  <div className="mt-12 pt-10 border-t border-white/10 flex justify-end gap-6">
                    <button onClick={() => downloadReport(masterVerdict, "Master_Quorum", "Intelligence")} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl"><Download size={20} /> Export</button>
                    <button onClick={() => anchorToLedger(masterVerdict, "Master_Quorum", "Intelligence")} className="px-16 py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 transition-all border-2 border-white/10 ring-8 ring-white/5"><Stamp size={24} /> Anchor to Ledger</button>
                  </div>
               </div>
             )}
          </div>
        )}

        {/* TWIN */}
        {activeTab === 'twin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
             <div className="lg:col-span-8 glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black overflow-hidden relative min-h-[550px] shadow-3xl flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)]"></div>
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center space-y-12">
                   <div className="relative w-full max-w-2xl aspect-video perspective-1000 group-hover:scale-105 transition-all duration-[3s]">
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-[64px] bg-emerald-500/[0.02] shadow-[0_0_80px_rgba(16,185,129,0.1)] transform rotateX(60deg)">
                         <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">{[...Array(144)].map((_, i) => <div key={i} className="border-[0.5px] border-emerald-500/10 hover:bg-emerald-500/20"></div>)}</div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600/40 rounded-full animate-pulse border-2 border-indigo-400"></div>
                      </div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-3xl animate-float">
                        <div className="flex items-center gap-4"><Activity className="text-emerald-400 animate-pulse" /><span className="text-xs font-mono font-black text-white uppercase">Twin_Stability: 94.2%</span></div>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
                      {[ { id: 'soil', l: 'Substrate', i: Mountain, c: 'text-orange-500' }, { id: 'crop', l: 'Phyto-Resonance', i: Sprout, c: 'text-emerald-400' }, { id: 'energy', l: 'Thermodynamics', i: Zap, c: 'text-blue-400' }].map(m => (
                        <button key={m.id} className="p-6 rounded-[40px] border-2 border-white/5 bg-black hover:border-indigo-500 transition-all flex flex-col items-center gap-4 group/btn shadow-xl"><div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${m.c} group-hover/btn:rotate-12 transition-transform shadow-inner`}><m.i size={24} /></div><span className="text-[10px] font-black uppercase tracking-widest text-white">{m.l}</span></button>
                      ))}
                   </div>
                </div>
             </div>
             <div className="lg:col-span-4 glass-card p-10 rounded-[56px] border border-blue-500/20 bg-black/40 space-y-8 shadow-2xl relative">
                <h3 className="text-lg font-black text-white uppercase tracking-widest border-b border-white/5 pb-6">Model Resonance</h3>
                <div className="space-y-8">{[{ l: 'Fidelity', v: '0.998α', p: 98, c: 'bg-emerald-500' }, { l: 'Latency', v: '14ms', p: 88, c: 'bg-blue-500' }, { l: 'Compute Load', v: 'Low', p: 12, c: 'bg-indigo-500' }].map(s => (
                   <div key={s.l} className="space-y-3"><div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500"><span>{s.l}</span><span className="text-white font-mono">{s.v}</span></div><div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${s.c} shadow-[0_0_100px_currentColor]`} style={{ width: `${s.p}%` }}></div></div></div>
                ))}</div>
                <button className="w-full py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">RECALIBRATE TWIN</button>
             </div>
          </div>
        )}

        {/* SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-10 md:p-14 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                   <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 shadow-xl"><Cpu size={24} /></div>
                   <h3 className="font-black text-white uppercase text-sm tracking-widest italic">EOS Physics Core</h3>
                </div>
                <div className="space-y-8">
                  <div className="group"><div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Intensity (In)</label><span className="text-xs font-mono text-blue-400 font-black">{in_intensity}</span></div><input type="range" min="0" max="1" step="0.01" value={in_intensity} onChange={e => setInIntensity(parseFloat(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500" /></div>
                  <div className="group"><div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Stress (S)</label><span className="text-xs font-mono text-rose-500 font-black">{s_stress}</span></div><input type="range" min="0.01" max="0.5" step="0.01" value={s_stress} onChange={e => setSStress(parseFloat(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-500" /></div>
                </div>
                <button onClick={handleRunFullSimulation} disabled={isRunningSimulation} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-8 ring-white/5">
                  {isRunningSimulation ? <Loader2 className="animate-spin" /> : <Zap size={20} className="fill-current" />} RUN ENGINE
                </button>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 min-h-[400px] shadow-3xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simProjectionData}><Area type="monotone" name="Sustainability Index" dataKey="score" stroke="#10b981" strokeWidth={5} fill="#10b98110" /><Area type="monotone" name="Resilience Factor (m)" dataKey="m" stroke="#3b82f6" strokeWidth={3} fill="#3b82f605" strokeDasharray="5 5" /></AreaChart>
                </ResponsiveContainer>
              </div>
              {simulationReport && <div className="p-10 glass-card border-l-8 border-emerald-500 bg-emerald-500/[0.02] shadow-xl"><p className="text-slate-300 text-lg italic leading-relaxed whitespace-pre-line font-medium">{simulationReport}</p></div>}
            </div>
          </div>
        )}

        {/* TRENDS */}
        {activeTab === 'trends' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-500">
             {!trendsResult && !isIngestingTrends ? (
                <div className="text-center space-y-10 relative z-10 py-20">
                   <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto transition-transform group-hover:scale-110"><TrendingUp size={64} className="text-white" /></div>
                   <div className="space-y-4"><h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Trend <span className="text-indigo-400">Ingest</span></h3><p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed">"Synchronizing global mesh search grounding."</p></div>
                   <button onClick={handleIngestTrends} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10"><Globe2 size={24} /> INITIALIZE TREND SYNC</button>
                </div>
             ) : isIngestingTrends ? (
                <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center"><Loader2 size={120} className="text-indigo-500 animate-spin" /><p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic m-0">CRAWLING GLOBAL SHARDS...</p></div>
             ) : (
                <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-10 w-full px-6 py-10">
                   <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-2 border-indigo-500/20 prose prose-invert max-w-none shadow-3xl border-l-[12px] border-l-indigo-600 relative overflow-hidden group/shard">
                      <div className="text-slate-300 text-xl md:text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/5">{trendsResult?.text}</div>
                      {trendsResult?.sources && (
                        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {trendsResult.sources.map((s: any, i: number) => (
                              <a key={i} href={s.web?.uri || '#'} target="_blank" rel="noopener noreferrer" className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-between group/link hover:border-indigo-500/40 transition-all"><div className="flex items-center gap-4"><Globe size={18} className="text-indigo-400" /><span className="text-xs font-black text-slate-300 uppercase italic truncate">{s.web?.title || 'Registry Shard'}</span></div><ExternalLink size={14} className="text-slate-700 group-hover/link:text-indigo-400 transition-all" /></a>
                           ))}
                        </div>
                      )}
                   </div>
                </div>
             )}
           </div>
        )}

        {/* TELEMETRY */}
        {activeTab === 'telemetry' && (
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-500">
              <div className="lg:col-span-1 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-950/5 space-y-8 shadow-2xl">
                    <h3 className="text-xl font-black text-white uppercase italic px-4 flex items-center gap-4"><Disk size={20} className="text-blue-400" /> Active Nodes</h3>
                    <div className="space-y-4">
                       {hardwareNodes.length === 0 ? <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4"><Smartphone size={48} className="text-slate-600" /><p className="text-[10px] font-black uppercase tracking-widest">No Paired Hardware</p></div> : hardwareNodes.map(n => (
                         <button key={n.id} onClick={() => setSelectedIotNode(n)} className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${selectedIotNode?.id === n.id ? 'bg-blue-600 border-white text-white shadow-xl' : 'bg-black border-white/5 text-slate-700 hover:border-blue-500/20'}`}><div className="flex items-center gap-4"><div className={`p-3 rounded-xl ${selectedIotNode?.id === n.id ? 'bg-white/10' : 'bg-white/5'}`}><Smartphone size={20} /></div><div><p className="text-xs font-black uppercase tracking-widest">{n.name}</p><p className="text-[9px] font-mono opacity-60 mt-1">{n.id}</p></div></div></button>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-3 glass-card p-12 rounded-[64px] bg-[#050706] border-2 border-white/5 flex flex-col shadow-3xl min-h-[650px] relative overflow-hidden">
                 <div className="flex-1 space-y-4 font-mono text-[11px] overflow-y-auto custom-scrollbar relative z-10 bg-black/40 rounded-[48px] p-8 shadow-inner">
                    {telemetryLogs.map((log, i) => (
                      <div key={i} className="flex gap-10 p-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group arrow-in slide-in-from-right-2">
                        <span className="text-slate-700 w-24 shrink-0 font-bold">[{log.timestamp}]</span>
                        <span className="text-blue-400 w-40 shrink-0 font-bold uppercase italic tracking-widest">[{log.metric}]</span>
                        <div className="flex-1 text-slate-300">PACKET_VAL: <span className="text-emerald-400 font-black">{log.value}</span> // ZK_SESSION: SYNC_A882</div>
                        <CheckCircle2 size={16} className="text-emerald-500/40" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* ORACLE (EOS AI) */}
        {activeTab === 'eos_agro_lang' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-500">
              <div className="lg:col-span-8 flex flex-col">
                 <div className="glass-card rounded-[64px] min-h-[650px] border-2 border-white/5 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col">
                       {!uploadedFile && !aiThinking && (
                          <div onClick={() => oracleFileInputRef.current?.click()} className="flex-1 flex flex-col items-center justify-center text-center space-y-12 border-4 border-dashed border-white/10 rounded-[64px] bg-black/40 group cursor-pointer hover:border-indigo-500/30 transition-all duration-700">
                             <input type="file" ref={oracleFileInputRef} onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 const reader = new FileReader();
                                 reader.onloadend = () => {
                                   setUploadedFile(reader.result as string);
                                   setFileBase64((reader.result as string).split(',')[1]);
                                 };
                                 reader.readAsDataURL(file);
                               }
                             }} className="hidden" accept="image/*" />
                             <Camera size={48} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                             <p className="text-2xl font-black text-white uppercase italic">Ingest Diagnostic Shard</p>
                          </div>
                       )}
                       {uploadedFile && !aiResult && !aiThinking && (
                          <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in zoom-in">
                             <div className="relative w-full max-w-md aspect-square rounded-[48px] overflow-hidden border-2 border-indigo-500/20"><img src={uploadedFile} className="w-full h-full object-cover" alt="Upload" /><button onClick={() => setUploadedFile(null)} className="absolute top-6 right-6 p-4 bg-black/60 rounded-full text-white hover:bg-rose-600 transition-colors"><X size={24} /></button></div>
                             <div className="w-full max-w-md relative"><input type="text" value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDeepAIQuery()} placeholder="Input inquiry for the Oracle..." className="w-full bg-black border-2 border-white/10 rounded-full py-6 pl-8 pr-20 text-white focus:ring-8 focus:ring-indigo-500/10 transition-all" /><button onClick={handleDeepAIQuery} className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 rounded-full text-white shadow-xl hover:bg-indigo-500 transition-all"><Send size={20} /></button></div>
                          </div>
                       )}
                       {aiThinking && (
                          <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in"><div className="w-48 h-48 rounded-full border-t-4 border-indigo-500 animate-spin"></div><p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic m-0">ANALYZING SPECTRAL SHARD...</p></div>
                       )}
                       {aiResult && (
                          <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-12 pb-10 flex-1">
                             <div className="p-10 md:p-16 bg-black/80 rounded-[64px] border-l-[16px] border-l-indigo-600 border border-indigo-500/20 shadow-3xl"><div className="prose prose-invert max-w-none text-slate-300 text-xl md:text-2xl italic leading-relaxed whitespace-pre-line font-medium">{aiResult.text}</div></div>
                             <div className="flex justify-center gap-6"><button onClick={() => setAiResult(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white shadow-xl transition-all">New Inquiry</button><button onClick={() => anchorToLedger(aiResult.text, 'Oracle', 'AgroLang_Inquiry')} className="px-16 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all"><Stamp size={18} className="mr-2" /> Anchor to Ledger</button></div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* SID SCANNER */}
        {activeTab === 'sid' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-rose-500/20 bg-black/40 space-y-10 shadow-3xl">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-8 relative z-10"><div className="p-4 bg-rose-600 rounded-3xl shadow-xl animate-pulse"><Radiation size={32} className="text-white" /></div><h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">SID <span className="text-rose-500">Scanner</span></h3></div>
                    <button onClick={handleRunSidScan} disabled={isSidScanning} className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 transition-all border-2 border-white/10 ring-8 ring-rose-500/5 group/scan">
                      {isSidScanning ? (
                        <>
                          <Loader2 size={32} className="animate-spin mx-auto" />
                          <p className="mt-4">ANALYZING VIRAL LOAD...</p>
                        </>
                      ) : (
                        <>
                          <Scan size={32} className="mx-auto group-hover/scan:rotate-12 transition-transform" />
                          <p className="mt-4">INITIALIZE SID SCAN</p>
                        </>
                      )}
                    </button>
                 </div>
              </div>
              <div className="lg:col-span-8 glass-card rounded-[64px] min-h-[600px] border-2 border-white/10 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                 <div className="absolute inset-0 z-10 opacity-30 pointer-events-none"><div className="w-full h-[3px] bg-rose-500/40 absolute top-0 animate-scan"></div></div>
                 <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-20">
                    {!sidResult && !isSidScanning ? <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-20"><Radiation size={180} className="text-slate-500" /><p className="text-4xl font-black uppercase tracking-[0.6em] text-white italic">SCANNER_IDLE</p></div> : isSidScanning ? <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in"><Loader2 size={120} className="text-rose-500 animate-spin mx-auto" /><p className="text-rose-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">{SID_STEPS[sidStepIndex]}</p></div> : <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12"><div className="p-12 md:p-16 bg-black/80 rounded-[80px] border-2 border-rose-500/20 shadow-3xl border-l-[12px] border-l-rose-600 italic text-slate-300 text-2xl leading-relaxed whitespace-pre-line font-medium">{sidResult?.text}</div></div>}
                 </div>
              </div>
           </div>
        )}

        {/* EVIDENCE */}
        {activeTab === 'evidence' && (
           <div className="space-y-10 animate-in zoom-in duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                 <div className="lg:col-span-1 glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-2xl"><div className="flex items-center gap-4 border-b border-white/5 pb-8"><div className="p-4 bg-emerald-600 rounded-3xl shadow-xl text-white"><CloudUpload size={28} /></div><h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Vault <span className="text-emerald-400">Control</span></h3></div><button onClick={onOpenEvidence} className="w-full py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all">New Field Proof</button></div>
                 <div className="lg:col-span-3 glass-card rounded-[64px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl min-h-[600px] flex flex-col"><div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-6"><Database size={24} className="text-emerald-400" /><h4 className="text-xl font-black text-white uppercase italic tracking-widest m-0">Biological Evidence Ledger</h4></div><div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5 bg-[#050706] p-4 text-center opacity-40 py-20 flex flex-col items-center gap-6"><ImageIcon size={80} /><p className="text-2xl font-black uppercase tracking-[0.4em]">VAULT_PENDING_INGEST</p></div></div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default Intelligence;