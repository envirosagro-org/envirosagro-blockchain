import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Cable, 
  DatabaseZap, 
  Activity, 
  ShieldCheck, 
  Wifi, 
  Cpu, 
  Server, 
  Layers, 
  Key, 
  ExternalLink, 
  Globe, 
  Search, 
  PlusCircle, 
  X, 
  Loader2, 
  Terminal, 
  Copy, 
  RefreshCcw,
  AlertTriangle,
  Code,
  Zap,
  Bot,
  Leaf,
  BookOpen,
  ArrowUpRight,
  Shield,
  FileCode,
  Network,
  Download,
  Trash2,
  Settings,
  MoreVertical,
  Fingerprint,
  Lock,
  Eye,
  Globe2,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  Clock,
  Box,
  Coins,
  Smartphone,
  SmartphoneNfc,
  Gamepad2,
  QrCode,
  Binary,
  Workflow,
  Target,
  ArrowRight,
  MapPin,
  TreePine,
  CloudUpload,
  FileUp,
  Stamp,
  Satellite,
  Bluetooth,
  FileDigit,
  Waves,
  History,
  Info,
  // Added ArrowLeftCircle and Database to fix "Cannot find name" errors
  ArrowLeftCircle,
  Database
} from 'lucide-react';
import { User, ViewState, AgroResource, MediaShard } from '../types';
import { chatWithAgroLang, analyzeMedia } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import { generateAlphanumericId } from '../systemFunctions';

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  event: string;
  status: 'SUCCESS' | 'SYNC' | 'ERROR';
  data: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  status: 'Live' | 'Revoked' | 'Expiring';
  env: 'Production' | 'Sandbox';
  scopes: string[];
  ipRestriction?: string;
  usage: number; // 0-100
  lastUsed: string;
  relay: string;
  trustLevel: number; // 0-100
}

interface NetworkIngestProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onSpendEAC?: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  onExecuteToShell?: (code: string) => void;
  initialSection?: string | null;
}

const INITIAL_KEYS: APIKey[] = [
  { 
    id: '1', 
    name: 'Primary Field Swarm (Zone 4)', 
    key: 'EA_LIVE_882_X_SYNC_A01', 
    status: 'Live', 
    env: 'Production',
    scopes: ['Technological', 'Environmental'],
    ipRestriction: '192.168.1.*',
    usage: 42, 
    lastUsed: '12m ago', 
    relay: 'GLOBAL_BETA_SYNC',
    trustLevel: 98
  },
  { 
    id: '2', 
    name: 'Research Sandbox Node', 
    key: 'EA_TEST_104_Y_DEV_B42', 
    status: 'Live', 
    env: 'Sandbox',
    scopes: ['Societal', 'Human'],
    usage: 12, 
    lastUsed: '1h ago', 
    relay: 'LOCAL_EDGE_P4',
    trustLevel: 100
  },
];

const PROVISIONING_FEE = 500;

const NetworkIngest: React.FC<NetworkIngestProps> = ({ user, onUpdateUser, onSpendEAC, onNavigate, onExecuteToShell, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'handshake' | 'vault' | 'api' | 'analyzer'>('overview');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [keys, setKeys] = useState<APIKey[]>(INITIAL_KEYS);
  
  // Handshake Sub-Workflow States
  const [handshakeMode, setHandshakeMode] = useState<'hardware' | 'land' | null>(null);
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [esinSign, setEsinSign] = useState('');

  // Provisioning States
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'Production' | 'Sandbox'>('Sandbox');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['Technological']);
  const [newKeyIP, setNewKeyIP] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Evidence Vault States
  const [evidenceShards, setEvidenceShards] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Implement missing handleStartProvision handler
  const handleStartProvision = () => {
    setNewKeyName('');
    setGeneratedKey('');
    setShowKeyModal(true);
  };

  // Implement missing handleCopy handler
  const handleCopy = (id: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(key);
    }
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Implement missing handleRunAnalysis handler
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const prompt = `Perform a high-fidelity audit of the current network ingest stream for Node ${user.esin}. Identify packet resonance drifts and sharding integrity.`;
      const res = await chatWithAgroLang(prompt, []);
      setAnalysisResult(res.text);
    } catch (e) {
      setAnalysisResult("SYSTEM_ERROR: Oracle link interrupted. Shard integrity could not be verified.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (initialSection) {
      if (['handshake', 'vault', 'api', 'streams'].includes(initialSection)) {
        setActiveTab(initialSection === 'streams' ? 'overview' : initialSection as any);
      }
    }
  }, [initialSection]);

  const physicalNodes = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'HARDWARE'),
    [user.resources]
  );

  useEffect(() => {
    const sources = ['SAT-EOS-04', 'Drone-NE-82', 'Soil-Array-P4', 'ThirdParty-API-C1'];
    const events = ['Data Packet Received', 'ZK-Proof Validated', 'Registry Hash Committed', 'Telemetry Resync'];
    
    const interval = setInterval(() => {
      if (activeTab === 'overview') {
        const source = sources[Math.floor(Math.random() * sources.length)];
        const event = events[Math.floor(Math.random() * events.length)];
        const id = generateAlphanumericId(7);
        const val = (Math.random() * 100).toFixed(2);
        
        const newLog: LogEntry = {
          id,
          timestamp: new Date().toLocaleTimeString(),
          source,
          event,
          status: Math.random() > 0.1 ? (Math.random() > 0.5 ? 'SUCCESS' : 'SYNC') : 'ERROR',
          data: `{"id": "${id}", "telemetry": {"val": ${val}, "unit": "pH", "trust_score": 0.98}, "auth": "ZK-SNARK"}`
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleStartHardwareSync = () => {
    setIsScanning(true);
    setScanStatus('SEARCHING_FOR_BLE_SHARDS...');
    setTimeout(() => {
      setIsScanning(false);
      setHandshakeStep(1);
    }, 3000);
  };

  const handleStartGeoLock = () => {
    setIsScanning(true);
    setScanStatus('ESTABLISHING_GPS_QUORUM...');
    setTimeout(() => {
      setIsScanning(false);
      setHandshakeStep(1);
    }, 4000);
  };

  const generateNewKey = async () => {
    if (onSpendEAC) {
        const success = await onSpendEAC(PROVISIONING_FEE, `NETWORK_INGEST_PROVISIONING_${newKeyName}`);
        if (!success) return;
    }
    setIsGeneratingKey(true);
    setTimeout(() => {
      const prefix = newKeyEnv === 'Production' ? 'EA_LIVE' : 'EA_TEST';
      const kString = `${prefix}_${generateAlphanumericId(10)}`;
      setGeneratedKey(kString);
      setKeys([{ id: Date.now().toString(), name: newKeyName, key: kString, status: 'Live', env: newKeyEnv, scopes: newKeyScopes, usage: 0, lastUsed: 'Never', relay: 'BETA_SYNC', trustLevel: 100 }, ...keys]);
      setIsGeneratingKey(false);
      setShowKeyModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Master Inflow HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-8 glass-card p-10 md:p-14 rounded-[64px] border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[20s] pointer-events-none">
              <Network size={800} />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-[48px] bg-indigo-600 shadow-[0_0_80px_rgba(79,70,229,0.3)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Cable size={64} className="text-white animate-float" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase rounded-full border border-indigo-500/20 shadow-inner italic tracking-widest">INGEST_HUB_v6.5</span>
                    <span className="px-4 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-full border border-emerald-500/20 shadow-inner italic tracking-widest">HANDSHAKE_READY</span>
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Inflow <span className="text-indigo-400">Terminal.</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl">
                 "Unified gateway for node pairing, automated telemetry sharding, and biological evidence finality."
              </p>
           </div>
        </div>

        <div className="lg:col-span-4 glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-3xl group">
           <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2 italic">NETWORK_THROUGHPUT</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter italic">14.2<span className="text-2xl text-indigo-500 ml-1">GB/s</span></h4>
           </div>
           <div className="flex items-center gap-3 text-[10px] text-emerald-400 font-black uppercase tracking-widest bg-emerald-500/5 px-6 py-2 rounded-full border border-emerald-500/20 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              PIPELINE_OK
           </div>
        </div>
      </div>

      {/* 2. Secondary Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'overview', label: 'Data Streams', icon: Activity },
          { id: 'handshake', label: 'Node Handshake', icon: SmartphoneNfc },
          { id: 'vault', label: 'Evidence Vault', icon: CloudUpload },
          { id: 'api', label: 'Registry Keys', icon: Key },
          { id: 'analyzer', label: 'Stream Analyzer', icon: Leaf },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Operational Viewport */}
      <div className="min-h-[750px] relative z-10">
        
        {/* VIEW: DATA STREAMS (Real-time Logs) */}
        {activeTab === 'overview' && (
           <div className="glass-card rounded-[64px] border-2 border-white/5 bg-[#050706] flex flex-col h-[750px] overflow-hidden shadow-3xl animate-in slide-in-from-bottom-4">
              <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 px-14">
                 <div className="flex items-center gap-6">
                    <Terminal className="w-8 h-8 text-emerald-400" />
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Inbound <span className="text-emerald-400">Stream Ingest</span></h3>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="px-6 py-2 bg-black/60 border border-white/10 rounded-full">
                       <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">ACTIVE_SHARDS: 8</span>
                    </div>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-12 font-mono text-[13px] space-y-6 custom-scrollbar bg-black/40 shadow-inner">
                 {logs.map((log) => (
                    <div key={log.id} className="flex gap-10 p-6 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors rounded-3xl group/log animate-in slide-in-from-right-2">
                       <span className="text-slate-800 w-24 shrink-0 font-bold">[{log.timestamp}]</span>
                       <span className="text-indigo-400 w-40 shrink-0 truncate">@{log.source}</span>
                       <div className="flex-1 space-y-3">
                          <span className="text-slate-200 block font-bold uppercase tracking-tight">{log.event}</span>
                          <span className="text-slate-700 text-xs block bg-black/60 p-4 rounded-2xl border border-white/[0.05] italic leading-relaxed">"{log.data}"</span>
                       </div>
                       <div className={`px-5 py-1.5 rounded-full text-[10px] h-fit font-black tracking-widest shrink-0 border mt-1 shadow-lg ${
                          log.status === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' : 
                          log.status === 'SYNC' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' : 
                          'text-rose-500 bg-rose-500/10 border-rose-500/30 animate-pulse'
                       }`}>{log.status}</div>
                    </div>
                 ))}
                 {logs.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center opacity-10">
                      <Loader2 size={120} className="animate-spin mb-8" />
                      <p className="text-4xl font-black uppercase tracking-[0.5em]">AWAITING_INGEST_#0x882A</p>
                   </div>
                 )}
              </div>
           </div>
        )}

        {/* VIEW: NODE HANDSHAKE (Pairing) */}
        {activeTab === 'handshake' && (
           <div className="animate-in slide-in-from-right-4 duration-700 space-y-12">
              {!handshakeMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div 
                      onClick={() => { setHandshakeMode('hardware'); setHandshakeStep(0); }}
                      className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-blue-500/40 transition-all group flex flex-col items-center text-center space-y-10 shadow-3xl cursor-pointer"
                   >
                      <div className="p-10 rounded-[44px] bg-blue-600/10 border-2 border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                         <Cpu size={64} />
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Hardware <br/><span className="text-blue-400">Handshake</span></h4>
                         <p className="text-slate-500 text-xl font-medium italic opacity-70">"Pair lorries, drones, or edge monitoring nodes via biometric sharding."</p>
                      </div>
                      <ChevronRight size={48} className="text-slate-900 group-hover:text-blue-400 transition-colors" />
                   </div>
                   <div 
                      onClick={() => { setHandshakeMode('land'); setHandshakeStep(0); }}
                      className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group flex flex-col items-center text-center space-y-10 shadow-3xl cursor-pointer"
                   >
                      <div className="p-10 rounded-[44px] bg-emerald-600/10 border-2 border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_160px_rgba(16,185,129,0.2)]">
                         <MapPin size={64} />
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Land <br/><span className="text-emerald-400">Verification</span></h4>
                         <p className="text-slate-500 text-xl font-medium italic opacity-70">"Anchor geofence coordinates and ingest industrial deeds for m-calibration."</p>
                      </div>
                      <ChevronRight size={48} className="text-slate-900 group-hover:text-emerald-400 transition-colors" />
                   </div>
                </div>
              ) : (
                <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden shadow-3xl flex flex-col items-center text-center space-y-12">
                   <button onClick={() => setHandshakeMode(null)} className="absolute top-10 left-10 p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all"><ArrowLeftCircle size={28} /></button>
                   
                   {handshakeStep === 0 && (
                      <div className="space-y-16 animate-in zoom-in duration-700 flex flex-col items-center">
                         <div className="relative">
                            <div className={`w-64 h-64 rounded-full border-8 border-dashed flex items-center justify-center transition-all duration-[3s] ${isScanning ? 'border-indigo-400 rotate-180 scale-110' : 'border-white/5'}`}>
                               {handshakeMode === 'hardware' ? <Bluetooth size={100} className={isScanning ? 'text-indigo-400 animate-pulse' : 'text-slate-800'} /> : <Satellite size={100} className={isScanning ? 'text-indigo-400 animate-pulse' : 'text-slate-800'} />}
                            </div>
                            {isScanning && <div className="absolute inset-[-20px] rounded-full border-4 border-indigo-500/20 animate-ping"></div>}
                         </div>
                         <div className="space-y-6">
                            <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0">{isScanning ? 'SCANNING...' : 'START_PAIRING'}</h3>
                            <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto">{isScanning ? scanStatus : '"Establish a secure ZK-Link between the registry and your physical asset."'} </p>
                         </div>
                         <button 
                           onClick={handshakeMode === 'hardware' ? handleStartHardwareSync : handleStartGeoLock}
                           className="px-24 py-10 agro-gradient rounded-full text-white font-black text-lg uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-indigo-500/5"
                         >
                            INITIALIZE SHARD_PAIR
                         </button>
                      </div>
                   )}
                   {handshakeStep === 1 && (
                      <div className="animate-in slide-in-from-right-10 duration-700 flex flex-col items-center space-y-12">
                         <CheckCircle2 size={120} className="text-emerald-500 animate-bounce" />
                         <div className="space-y-4">
                            <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter">Handshake Successful</h4>
                            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.8em]">NODE_ANCHOR_VERIFIED</p>
                         </div>
                         <button onClick={() => setHandshakeMode(null)} className="px-16 py-6 bg-white/5 border border-white/10 rounded-full text-slate-300 font-black uppercase tracking-widest hover:bg-white/10 transition-all">Proceed to Registry Manager</button>
                      </div>
                   )}
                </div>
              )}
           </div>
        )}

        {/* VIEW: EVIDENCE VAULT */}
        {activeTab === 'vault' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10 px-6">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Evidence <span className="text-blue-400">Vault.</span></h3>
                    <p className="text-slate-500 text-xl italic font-medium">"Managing multi-format shards for industrial finality audits."</p>
                 </div>
                 <button className="px-12 py-6 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all flex items-center gap-4">
                    <CloudUpload size={20} /> INGEST NEW PROOF
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                   { id: 'SHD-882-01', title: 'Zone 4 Moisture Scan', type: 'IMAGE', time: '2h ago', size: '1.4MB', col: 'text-emerald-400' },
                   { id: 'SHD-104-42', title: 'Deed Verification Shard', type: 'DOC', time: '5h ago', size: '0.8MB', col: 'text-indigo-400' },
                   { id: 'SHD-091-88', title: 'Spectral DNA Buffer', type: 'DATA', time: '1d ago', size: '4.2MB', col: 'text-blue-400' },
                 ].map(shard => (
                   <div key={shard.id} className="p-10 glass-card rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all group flex flex-col justify-between h-[450px] shadow-2xl relative overflow-hidden active:scale-[0.99]">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Database size={200} /></div>
                      <div className="space-y-6 relative z-10">
                         <div className="flex justify-between items-start">
                            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 group-hover:rotate-6 transition-all shadow-inner">
                               <FileDigit size={32} className={shard.col} />
                            </div>
                            <span className="text-[10px] font-mono text-slate-800 font-black uppercase italic">{shard.id}</span>
                         </div>
                         <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors drop-shadow-xl">{shard.title}</h5>
                         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{shard.type} // {shard.size}</p>
                      </div>
                      <div className="pt-8 border-t border-white/5 flex justify-between items-center relative z-10 mt-auto">
                         <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{shard.time}</span>
                         <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-700 hover:text-white transition-all shadow-xl active:scale-90"><History size={20} /></button>
                      </div>
                   </div>
                 ))}
                 <div className="p-10 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center justify-center text-center space-y-6 opacity-20 hover:opacity-100 transition-all cursor-pointer group">
                    <PlusCircle size={64} className="group-hover:scale-110 transition-transform" />
                    <p className="text-[11px] font-black uppercase tracking-widest">Append Proof Shard</p>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: REGISTRY CREDENTIALS (API Keys) */}
        {activeTab === 'api' && (
           <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-center border-b border-white/5 pb-10 px-4">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Registry <span className="text-indigo-400">Credentials</span></h3>
                    <p className="text-slate-500 text-xl italic font-medium opacity-70">"Managing virtual integration nodes. Bridge to Farm OS for live optimization."</p>
                 </div>
                 <button onClick={handleStartProvision} className="px-12 py-5 bg-indigo-600 rounded-full text-white font-black text-xs uppercase tracking-widest shadow-xl border-2 border-white/10 active:scale-95 transition-all">Provision New Key</button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {keys.map(k => (
                   <div key={k.id} className="p-8 glass-card rounded-[56px] border border-white/5 bg-black/40 flex items-center justify-between group hover:border-indigo-500/20 transition-all shadow-xl">
                      <div className="flex items-center gap-10">
                         <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-all text-indigo-400">
                            <Key size={28} />
                         </div>
                         <div>
                            <h4 className="text-2xl font-black text-white uppercase italic leading-none">{k.name}</h4>
                            <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black">{k.id} // {k.env} MODE</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-12">
                         <div className="text-right">
                            <p className="text-[9px] text-slate-800 font-black uppercase mb-1">Last Shard Sync</p>
                            <p className="text-sm font-mono font-bold text-slate-500">{k.lastUsed}</p>
                         </div>
                         <button onClick={() => handleCopy(k.id, k.key)} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl active:scale-90">
                            {copiedKeyId === k.id ? <CheckCircle2 size={24} className="text-emerald-400" /> : <Copy size={24} />}
                         </button>
                      </div>
                   </div>
                ))}
              </div>
           </div>
        )}

        {/* VIEW: STREAM ANALYZER */}
        {activeTab === 'analyzer' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
              <div className="p-16 md:p-24 glass-card rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 text-center space-y-10 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Leaf size={800} className="text-indigo-400" /></div>
                 <div className="relative z-10 space-y-8">
                    <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.3)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12">
                       <Bot size={64} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">STREAM <span className="text-indigo-400">ANALYZER</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic max-w-xl mx-auto leading-relaxed opacity-80">"Analyzing packet resonance and sharding fidelity across the active pipeline."</p>
                    </div>
                    <button 
                      onClick={handleRunAnalysis}
                      disabled={isAnalyzing}
                      className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-indigo-500/5 disabled:opacity-20"
                    >
                       {isAnalyzing ? <Loader2 size={28} className="animate-spin mx-auto" /> : <Zap size={28} className="fill-current mx-auto" />}
                       <p className="mt-4">{isAnalyzing ? 'SYNCHRONIZING MODEL...' : 'INITIALIZE STREAM AUDIT'}</p>
                    </button>

                    {/* Result rendering added to match handleRunAnalysis functionality */}
                    {analysisResult && (
                      <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-8 pt-10">
                         <div className="p-10 bg-black/80 rounded-[64px] border-2 border-indigo-500/20 shadow-3xl border-l-[16px] border-l-indigo-600 text-left relative overflow-hidden">
                            <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
                               <Bot size={32} className="text-indigo-400 animate-pulse" />
                               <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">Analysis Verdict</h4>
                            </div>
                            <p className="text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10">
                               {analysisResult}
                            </p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        )}

      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default NetworkIngest;
