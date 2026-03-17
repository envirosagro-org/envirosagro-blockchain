import React, { useState, useMemo, useEffect } from 'react';
import { 
  Satellite, Zap, ShieldCheck, Bot, 
  Layers, Binary, Target, Globe, Loader2, Stamp, 
  Fingerprint, Wind, CheckCircle2, Sprout, RefreshCw, Terminal, 
  Activity, MapPin, Smartphone, Star, ArrowLeftCircle, Wrench, 
  SmartphoneNfc, Plus, ArrowRight, Download, Monitor, History,
  Compass, BadgeCheck, Pickaxe, Database, Leaf, Boxes as BoxesIcon,
  LayoutGrid, Trash2, Cpu as CpuIcon, TreePine, Crown, TrendingUp,
  Hash, ShieldAlert, Workflow, ScanLine, Atom, Box, Link2, Search,
  Heart
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { User, ViewState, AgroResource } from '../types';
import { analyzeMiningYield } from '../services/agroLangService';
import { generateQuickHash } from '../systemFunctions';

interface OnlineGardenProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  onExecuteToShell?: (code: string) => void;
  notify: any;
  initialSection?: string | null;
}

// Common styles for consistency with the EOS design framework
const shardCardBaseStyle = "glass-card p-12 rounded-[72px] border-2 transition-all flex flex-col justify-between shadow-3xl bg-black/40 relative overflow-hidden h-[720px] group cursor-pointer active:scale-[0.98] duration-300";
const iconContainerStyle = (color: string) => `p-6 rounded-3xl bg-white/5 border border-white/10 ${color} shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all`;

/**
 * ResourceShard component for individual garden nodes
 * Implements TQM Traceability and Agrolang generation
 */
const ResourceShard: React.FC<{
  resource: AgroResource;
  isSelected: boolean;
  onSelect: () => void;
  onExecute: (code: string) => void;
}> = ({ resource, isSelected, onSelect, onExecute }) => {
  
  const genesisHash = useMemo(() => `0x${generateQuickHash()}_GENESIS`, []);
  const currentHash = useMemo(() => `0x${generateQuickHash()}_THREAD`, []);

  const getOptimizationCode = () => {
    const isLand = resource.category === 'LAND';
    const id = resource.id;
    
    if (isLand) {
      return `// OPTIMIZE_LAND_SHARD: ${id}
IMPORT AgroLaw.Stewardship AS Law;
IMPORT EOS.BioResonance AS Bio;
IMPORT TQM.Traceability AS Trace;

SEQUENCE Recalibrate_Plot {
    // 1. Audit m-constant baseline
    ASSERT node.stability > Law.MIN_RESONANCE;
    
    // 2. Generate Unique Product Hash
    SET event_hash = Trace.generate_hash(sku: "${id}", stage: "CALIBRATION");
    
    // 3. Adjust Substrate
    Bio.calibrate_substrate(depth: "L2", mineral_sync: true);
    
    // 4. Anchor impact
    COMMIT_SHARD(registry: "LAND_LEDGER", hash: event_hash, finality: ZK_PROVEN);
}`;
    } else {
      return `// OPTIMIZE_HARDWARE_NODE: ${id}
IMPORT EOS.Automation AS Bot;
IMPORT EOS.Network AS Net;
IMPORT TQM.Traceability AS Trace;

SEQUENCE Tune_Telemetry {
    // 1. Sync Buffer
    Net.sync_node(id: "${id}", priority: "HIGH");
    
    // 2. Generate Event Hash for Trace
    SET v_hash = Trace.generate_hash(sku: "${id}", validator: "AUTO_OS");
    
    // 3. Hardware Pulse
    Bot.execute_diagnostic(target: "${id}", depth: "FULL");
    
    // 4. Finalize Packet
    COMMIT_SHARD(registry: "TECH_MESH", hash: v_hash, finality: ZK_PROVEN);
}`;
    }
  };

  return (
    <div 
      className={`${shardCardBaseStyle} ${isSelected ? 'border-emerald-500 ring-8 ring-emerald-500/5' : 'border-white/5 hover:border-white/20'}`}
      onClick={onSelect}
    >
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]">
        {resource.category === 'LAND' ? <LayoutGrid size={300} /> : <CpuIcon size={300} />}
      </div>
      
      <div className="flex justify-between items-start mb-12 relative z-10">
         <div className={iconContainerStyle(resource.category === 'LAND' ? 'text-emerald-400' : 'text-blue-400')}>
            {resource.category === 'LAND' ? <TreePine size={40} /> : <Smartphone size={40} />}
         </div>
         <div className="text-right flex flex-col items-end gap-3">
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
              resource.category === 'LAND' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {resource.category}
            </span>
            <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">SKU: {resource.id}</p>
         </div>
      </div>

      <div className="flex-1 space-y-8 relative z-10">
         <div className="space-y-4">
            <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-emerald-400 transition-colors drop-shadow-2xl">
              {resource.name}
            </h4>
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
              {resource.category === 'LAND' ? (
                <>
                  <MapPin size={14} className="text-emerald-500" />
                  {resource.verificationMeta.coordinates?.lat}, {resource.verificationMeta.coordinates?.lng}
                </>
              ) : (
                <>
                  <CpuIcon size={14} className="text-blue-400" />
                  {resource.type}
                </>
              )}
            </div>
         </div>

         <div className="p-6 bg-black/80 rounded-[44px] border border-white/5 space-y-4 shadow-inner">
            <div className="flex justify-between items-center text-[9px] font-black text-slate-600">
               <span className="flex items-center gap-2"><Hash size={10} /> Genesis Hash</span>
               <span className="text-slate-400 font-mono truncate ml-4">{genesisHash}</span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-black text-slate-600">
               <span className="flex items-center gap-2"><Workflow size={10} /> Current Thread</span>
               <span className="text-emerald-500 font-mono truncate ml-4">{currentHash}</span>
            </div>
         </div>
         
         <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-2 shadow-inner hover:border-white/20 transition-all">
               <p className="text-[9px] text-slate-600 font-black uppercase flex items-center gap-2">
                 <ShieldCheck size={10} className="text-blue-400" /> Integrity
               </p>
               <p className="text-2xl font-mono font-black text-white">
                 {(resource.verificationMeta.confidenceScore || 0.95) * 100}%
               </p>
            </div>
            <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-2 shadow-inner hover:border-white/20 transition-all text-right">
               <p className="text-[9px] text-slate-600 font-black uppercase flex items-center justify-end gap-2">
                 Status <Activity size={10} className="text-emerald-400" />
               </p>
               <p className="text-2xl font-mono font-black text-emerald-400">{resource.status}</p>
            </div>
         </div>
      </div>

      <div className="mt-12 pt-10 border-t border-white/5 flex gap-4 relative z-10">
         <button className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[32px] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-md active:scale-95">Trace Thread</button>
         <button 
           onClick={(e) => {
             e.stopPropagation();
             onExecute(getOptimizationCode());
           }}
           className="flex-1 py-6 agro-gradient rounded-[32px] text-[10px] font-black uppercase tracking-widest text-white shadow-3xl active:scale-95 transition-all border border-white/10"
         >
            Commit to OS
         </button>
      </div>
    </div>
  );
};

const PROGRESSION_TIERS = [
  { level: 1, title: 'Seeder', req: 'Registry Handshake', access: '1 Virtual Shard', icon: Sprout, col: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { level: 2, title: 'Cultivator', req: 'Connect Physical Plot', access: 'Physical Shard + Bridge', icon: MapPin, col: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { level: 3, title: 'Miner', req: 'Pass Carbon Baseline', access: 'Carbon Mining Shard', icon: Pickaxe, col: 'text-amber-500', bg: 'bg-amber-500/10' },
  { level: 4, title: 'Steward', req: '3 Sustainability Protocols', access: 'Multi-Shard Mgmt', icon: ShieldCheck, col: 'text-blue-400', bg: 'bg-blue-500/10' },
  { level: 5, title: 'Super-Agro', req: 'Net-Negative Footprint', access: 'System Governance', icon: Crown, col: 'text-indigo-400', bg: 'bg-indigo-500/10' },
];

const SHARD_TYPES = [
  { id: 'physical', label: 'Verified Shard', desc: 'Real-world yield & Carbon Mining', badge: 'PHYSICAL', col: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'virtual', label: 'Sim Shard', desc: 'Strategy testing & Reaction Mining', badge: 'VIRTUAL', col: 'text-indigo-400', bg: 'bg-indigo-500/10' },
];

const OnlineGarden: React.FC<OnlineGardenProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate, onExecuteToShell, notify, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'bridge' | 'shards' | 'roadmap' | 'mining'>('bridge');
  const [activeShardType, setActiveShardType] = useState<'physical' | 'virtual'>(user.resources?.some(r => r.category === 'LAND') ? 'physical' : 'virtual');
  
  // Vector Routing Logic synchronization
  useEffect(() => {
    if (initialSection) {
      setActiveTab(initialSection as any);
    }
  }, [initialSection]);

  const [telemetrySource, setTelemetrySource] = useState<'ingest' | 'satellite'>('ingest');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(100);
  
  const [isMining, setIsMining] = useState(false);
  const [miningType, setMiningType] = useState<'carbon' | 'reaction'>('reaction');
  const [miningInference, setMiningInference] = useState<any | null>(null);

  const [selectedShardId, setSelectedShardId] = useState<string | null>(null);

  const landResources = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'LAND'),
    [user.resources]
  );
  
  const hardwareResources = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'HARDWARE'),
    [user.resources]
  );
  
  const hasPhysicalLand = landResources.length > 0;
  
  const currentTier = useMemo(() => {
    const score = user.metrics.sustainabilityScore;
    if (score > 90 && hasPhysicalLand) return PROGRESSION_TIERS[4];
    if (score > 75 && hasPhysicalLand) return PROGRESSION_TIERS[3];
    if (hasPhysicalLand && user.wallet.eatBalance > 5) return PROGRESSION_TIERS[2];
    if (hasPhysicalLand) return PROGRESSION_TIERS[1];
    return PROGRESSION_TIERS[0];
  }, [user.metrics.sustainabilityScore, hasPhysicalLand, user.wallet.eatBalance]);

  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          onEarnEAC(15, `TELEMETRY_BRIDGE_${telemetrySource.toUpperCase()}_SYNC`);
          notify('success', 'TELEMETRY_SYNCED', `Data from ${telemetrySource.toUpperCase()} layer anchored to twin.`);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleStartMining = async (type: 'carbon' | 'reaction') => {
    if (type === 'carbon' && !hasPhysicalLand) {
      notify('error', 'RESTRICTED_ACCESS', "Carbon Mining requires an anchored Physical Shard.");
      return;
    }
    
    setIsMining(true);
    setMiningType(type);
    setMiningInference(null);

    try {
      const res = await analyzeMiningYield({
        pressure: type === 'reaction' ? 85 : 12.4,
        type,
        node_id: user.esin,
        m_constant: user.metrics.timeConstantTau
      });
      const eventHash = `0x${generateQuickHash()}_MINED`;
      setMiningInference({ ...res, eventHash });
      onEarnEAC(type === 'carbon' ? 50 : 25, `${type.toUpperCase()}_MINING_CYCLE_COMPLETE`);
    } catch (e) {
      console.error("Mining Oracle Failure");
    } finally {
      setIsMining(false);
    }
  };

  const handleExecuteOS = (code: string) => {
    if (onExecuteToShell) {
      onExecuteToShell(code);
    } else {
      onNavigate('farm_os');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* Visual Scanline Effect */}
      <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden z-0">
        <div className="w-full h-[2px] bg-indigo-500/10 absolute top-0 animate-scan"></div>
      </div>

      {/* 1. Header Hero HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl`}>
           <div className="relative shrink-0">
              <div className={`w-44 h-44 rounded-[56px] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-1000 ${
                activeShardType === 'physical' ? 'bg-emerald-600 shadow-[0_0_100px_rgba(16,185,129,0.4)]' : 'bg-indigo-700 shadow-[0_0_100px_rgba(79,70,229,0.4)]'
              }`}>
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 {activeShardType === 'physical' ? <Sprout size={80} className="text-white animate-float" /> : <Monitor size={80} className="text-white animate-pulse" />}
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[56px] animate-spin-slow"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 glass-card rounded-[32px] border border-white/20 bg-black/80 flex flex-col items-center shadow-3xl">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tier</p>
                 <div className="flex items-center gap-2">
                    <currentTier.icon className={`w-4 h-4 ${currentTier.col}`} />
                    <p className={`text-xl font-black uppercase italic ${currentTier.col}`}>{currentTier.title}</p>
                 </div>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border shadow-inner italic ${
                      activeShardType === 'physical' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {activeShardType === 'physical' ? 'PHYSICAL_SHARD_ACTIVE' : 'VIRTUAL_SIM_MODE'}
                    </span>
                    <span className="px-4 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20 shadow-inner italic">OS_SYNC_v6.5</span>
                 </div>
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Online <span className="text-emerald-400">Garden.</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating agricultural shards. Every garden is a digital twin or virtual space anchored to the global industrial ledger via unique SKU threads."
              </p>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">SHARD_RESONANCE</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">94<span className="text-3xl text-emerald-500 font-sans italic ml-1">.2</span></h4>
              <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div> TELEMETRY_STABLE
              </div>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Bridge Fidelity</span>
                 <span className="text-emerald-400 font-mono">100%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className={`h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]`} style={{ width: '94%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Management Shards Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 overflow-x-auto scrollbar-hide snap-x mx-auto lg:mx-0 relative z-20">
          {[
            { id: 'bridge', label: 'Telemetry Bridge', icon: Monitor },
            { id: 'shards', label: 'Shard Manager', icon: BoxesIcon },
            { id: 'roadmap', label: 'Super-Agro Path', icon: Compass },
            { id: 'mining', label: 'Extraction Node', icon: Zap },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
      </div>

      <div className="min-h-[800px] relative z-10">
        
        {/* TAB: TELEMETRY BRIDGE */}
        {activeTab === 'bridge' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-8 space-y-8">
                 <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-10 shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[10s]"><Satellite size={400} className="text-blue-400" /></div>
                    <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8 relative z-10">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-blue-600 rounded-[24px] shadow-xl"><Satellite size={28} className="text-white" /></div>
                          <div>
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Truth <span className="text-blue-400">Engine Ingest</span></h3>
                             <p className="text-[10px] text-blue-500/60 font-mono tracking-widest uppercase mt-3">TARGET_NODE: GLOBAL_SCADA_MESH // EOS_SYNC</p>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                       <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Bridging Source</p>
                          <div className="grid grid-cols-2 gap-3">
                             <button onClick={() => setTelemetrySource('ingest')} className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${telemetrySource === 'ingest' ? 'bg-blue-600 border-white text-white' : 'bg-white/5 border-white/5 text-slate-500'}`}>
                                <Database size={24} />
                                <span className="text-[9px] font-black uppercase">Edge Shard</span>
                             </button>
                             <button onClick={() => setTelemetrySource('satellite')} className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${telemetrySource === 'satellite' ? 'bg-blue-600 border-white text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                                <Globe size={24} />
                                <span className="text-[9px] font-black uppercase">Sat Shard</span>
                             </button>
                          </div>
                       </div>
                       <div className="p-10 bg-blue-600/5 rounded-[44px] border border-blue-500/20 flex flex-col justify-center items-center text-center space-y-6 shadow-inner group-hover:border-blue-400 transition-all">
                          <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl animate-pulse"><Monitor size={40} /></div>
                          <p className="text-slate-400 text-sm italic font-medium">"Synchronizing silo data shards into the central truth engine."</p>
                          <button 
                            onClick={handleSyncTelemetry}
                            disabled={isSyncing}
                            className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                          >
                             {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                             {isSyncing ? 'SYNCING_TRUTH...' : 'START INGEST SEQUENCE'}
                          </button>
                       </div>
                    </div>
                    
                    {isSyncing && (
                      <div className="p-8 bg-black/90 rounded-[40px] border border-white/10 relative z-10 animate-in fade-in slide-in-from-top-2">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-mono text-blue-400 font-bold">COMMIT_SHARD_ACTIVE // {syncProgress}%</span>
                            <span className="text-[10px] text-slate-600 font-mono">0xSYNC_{generateQuickHash(6)}_OK</span>
                         </div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-300 shadow-[0_0_15px_#3b82f6]" style={{ width: `${syncProgress}%` }}></div>
                         </div>
                      </div>
                    )}
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-widest px-4 flex items-center gap-4">
                       <History size={24} className="text-blue-400" /> Ingest Archive
                    </h4>
                    <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                       {[...Array(5)].map((_, i) => (
                          <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-[24px] flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
                                   <History size={18} />
                                </div>
                                <div>
                                   <p className="text-xs font-black uppercase text-white">SYNC_SHARD_#{(4282+i)}</p>
                                   <p className="text-[8px] font-mono text-slate-700">12:0{i} PM // 0.98a</p>
                                </div>
                             </div>
                             <CheckCircle2 size={16} className="text-emerald-500/40" />
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* TAB: SHARD MANAGER */}
        {activeTab === 'shards' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...landResources, ...hardwareResources].map(res => (
                   <ResourceShard 
                    key={res.id} 
                    resource={res} 
                    isSelected={selectedShardId === res.id} 
                    onSelect={() => setSelectedShardId(res.id)} 
                    onExecute={handleExecuteOS} 
                   />
                ))}
                {(landResources.length + hardwareResources.length) === 0 && (
                   <div className="col-span-full py-40 text-center opacity-10 border-4 border-dashed border-white/5 rounded-[80px] flex flex-col items-center gap-10">
                      <BoxesIcon size={120} />
                      <p className="text-4xl font-black uppercase tracking-[0.5em]">No physical shards linked</p>
                      <button onClick={() => onNavigate('registry_handshake')} className="px-12 py-5 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-widest shadow-xl">Start Handshake</button>
                   </div>
                )}
              </div>
           </div>
        )}

        {/* TAB: SUPER-AGRO PATH */}
        {activeTab === 'roadmap' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-700">
              <div className="text-center space-y-4">
                 <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter">Super-Agro <span className="text-emerald-400">Path.</span></h3>
                 <p className="text-slate-500 text-xl italic font-medium">Calibrating your individual node progression across the organizational grid.</p>
              </div>
              <div className="relative space-y-6">
                 {PROGRESSION_TIERS.map((tier, i) => (
                    <div key={i} className={`p-10 glass-card rounded-[56px] border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden ${currentTier.level >= tier.level ? 'border-emerald-500/40 bg-emerald-500/[0.03] shadow-3xl' : 'border-white/5 bg-black/40 opacity-40'}`}>
                       <div className="flex items-center gap-10 relative z-10">
                          <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center border-2 ${tier.col} ${tier.bg} border-current shadow-2xl`}>
                             <tier.icon size={36} />
                          </div>
                          <div>
                             <h4 className="text-3xl font-black text-white uppercase italic leading-none">{tier.title}</h4>
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-3">REQUIREMENT: {tier.req}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Access Tier</p>
                          <p className="text-xl font-mono font-black text-white uppercase italic">{tier.access}</p>
                       </div>
                       {currentTier.level >= tier.level && (
                          <div className="absolute top-6 right-6">
                             <CheckCircle2 className="text-emerald-500" size={32} />
                          </div>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* TAB: EXTRACTION NODE (MINING) */}
        {activeTab === 'mining' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-amber-500/20 bg-amber-950/5 relative overflow-hidden shadow-3xl text-center space-y-12 group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s]"><Zap size={800} className="text-amber-400" /></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 rounded-[44px] bg-amber-600 flex items-center justify-center shadow-[0_0_120px_rgba(245,158,11,0.3)] border-4 border-white/10 mx-auto group-hover:rotate-12 transition-transform duration-700 animate-float">
                       <Pickaxe size={64} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter m-0 leading-none drop-shadow-2xl">RESOURCE <span className="text-amber-500">MINING.</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80">"Extracting surplus biological energy (Ca) into liquid utility (EAC) shards."</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
                       {SHARD_TYPES.map(s => (
                          <button 
                            key={s.id} 
                            onClick={() => handleStartMining(s.id as any)}
                            className={`p-8 rounded-[48px] border-2 transition-all flex-1 flex flex-col items-center gap-6 group/btn ${miningType === s.id && isMining ? 'bg-amber-600 border-white text-white' : 'bg-black/60 border-white/10 text-slate-500 hover:border-amber-400'}`}
                          >
                             <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 ${s.col} shadow-inner group-hover/btn:scale-110 transition-transform`}>
                                <Zap size={32} />
                             </div>
                             <div>
                                <h5 className="text-2xl font-black uppercase italic leading-none">{s.label}</h5>
                                <p className="text-[10px] font-bold mt-2 uppercase opacity-60">{s.desc}</p>
                             </div>
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              {isMining && (
                 <div className="flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
                    <div className="relative">
                       <Loader2 size={120} className="text-amber-500 animate-spin mx-auto" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Binary size={40} className="text-amber-400 animate-pulse" />
                       </div>
                    </div>
                    <p className="text-amber-500 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic">SEQUENCING_YIELD...</p>
                 </div>
              )}

              {miningInference && !isMining && (
                 <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-8">
                    <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-amber-500/20 shadow-3xl border-l-[16px] border-l-amber-600 relative overflow-hidden group/advice">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform"><Leaf size={600} className="text-amber-500" /></div>
                       <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                          <div className="flex items-center gap-6">
                             <Bot size={40} className="text-amber-400" />
                             <h4 className="text-3xl font-black text-white uppercase italic m-0">Mining Shard Yield</h4>
                          </div>
                          <div className="px-6 py-2 bg-amber-600/10 border border-amber-500/20 rounded-full">
                             <span className="text-[11px] font-mono font-black text-amber-400 uppercase tracking-widest italic">0xMINED_OK</span>
                          </div>
                       </div>
                       <div className="text-slate-300 text-2xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/5">
                          {miningInference.text}
                       </div>
                       <div className="mt-12 pt-10 border-t border-white/10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                          <div className="flex items-center gap-6">
                             <Fingerprint size={48} className="text-amber-400" />
                             <div className="text-left">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">EVENT_HASH</p>
                                <p className="text-xl font-mono text-white italic">{miningInference.eventHash}</p>
                             </div>
                          </div>
                          <button onClick={() => setMiningInference(null)} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10">SETTLE YIELD SHARD</button>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default OnlineGarden;