
import React, { useState, useEffect, useRef } from 'react';
import { 
  Binary, Cpu, Zap, Activity, Bot, Database, Terminal, 
  Settings, Loader2, ShieldCheck, Target, 
  RefreshCw, Power, Radio, Gauge, Workflow, Layers,
  ChevronRight, ArrowUpRight, ClipboardList, Scan,
  Wifi, Satellite, Smartphone, Network, History,
  AlertTriangle, ShieldAlert,
  LayoutGrid, SmartphoneNfc, Info, PlusCircle, SearchCode, BadgeCheck, Fingerprint,
  Stamp, Box, Wind, Droplets, Thermometer, Eye, X, Send, BarChart4, CheckCircle2,
  Compass, CloudRain, Heart, TreePine, Waves as WavesIcon, Atom,
  Mountain, RotateCcw, Sprout, Router, Trello, Server, Cog, 
  Orbit, Boxes as BoxesIcon, ShieldPlus, Radar, Signal,
  FolderTree, HardDrive, Cpu as CpuIcon, Shield, ChevronDown, Play, Square,
  Menu, List, FileCode, AlertCircle, Trash2, Download,
  Globe, Coins, Cookie, Users, Leaf, HeartPulse, ArrowRight,
  Code2, Link2, Share2, Gem, Landmark, ShieldX, ScanLine,
  MapPin, Dna,
  Fan,
  Cloud,
  Globe2,
  Link,
  Factory,
  Code,
  Library,
  Languages,
  Braces
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

// Define AgroLang grammar
Prism.languages.agrolang = {
  'comment': /\/\/.*/,
  'string': /(["'])(?:(?=(\\?))\2.)*?\1/,
  'keyword': /\b(IMPORT|AS|AUTHENTICATE|SEQUENCE|CONSTRAIN|COMMIT_SHARD|target|gain|units|mode|registry|finality|source|weight|zone)\b/,
  'function': /\b[a-z_]\w*(?=\s*\()/i,
  'number': /\b\d+(?:\.\d+)?(?:Hz|v)?\b/i,
  'operator': /[=<>!]+/,
  'punctuation': /[{}[\];(),.:]/
};

import { User, SignalShard } from '../types';
import { auditAgroLangCode, chatWithAgroLang } from '../services/agroLangService';

interface FarmOSProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: any) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
  initialCode?: string | null;
  clearInitialCode?: () => void;
  initialSection?: string | null;
}

const KERNEL_LAYERS = [
  { level: 'USER SPACE', agro: 'EnvirosAgro UI', status: 'ACTIVE', desc: 'Brand Design & Logic Studio', col: 'text-blue-400' },
  { level: 'SYSTEM CALLS', agro: 'agro_irrigate()', status: 'NOMINAL', desc: 'Software-to-Field Bridge', col: 'text-indigo-400' },
  { level: 'AGRO KERNEL', agro: 'THE AGRO CODE', status: 'PROTECTED', desc: 'Energy & Carbon Arbiter', col: 'text-emerald-400' },
  { level: 'BLOCKCHAIN', agro: 'L3 Industrial Ledger', status: 'SYNCED', desc: 'Consensus & Finality Layer', col: 'text-amber-400' },
  { level: 'HARDWARE', agro: 'Physical Assets', status: 'READY', desc: 'Soil, Water, Bots, Life', col: 'text-rose-400' },
];

const SNIPPETS = [
  { 
    id: 'NET-1', 
    title: 'NET_BRIDGE_CORE', 
    desc: 'Establish lean external network sync.', 
    icon: Globe,
    code: `IMPORT EOS.Network AS Net;\nNet.bridge_external(id: "EA-EXT-01", protocol: "ZK_HANDSHAKE");`
  },
  { 
    id: 'NET-2', 
    title: 'TELEMETRY_CALIBRATE', 
    desc: 'Recalibrate spectral ingest loads.', 
    icon: Activity,
    code: `IMPORT EOS.Kernel AS Kernel;\nKernel.calibrate_ingest(source: "SATELLITE", weight: 0.85);`
  },
  { 
    id: 'S1', 
    title: 'MOISTURE_SYNC', 
    desc: 'Auto-calibrate soil humidity shards.', 
    icon: WavesIcon,
    code: `Bio.sync_moisture(zone: "SECTOR_4", target: "OPTIMAL");`
  },
  { 
    id: 'S2', 
    title: 'SWARM_DEFEND', 
    desc: 'Deploy robotic pest containment shards.', 
    icon: Bot,
    code: `Bot.swarm_deploy(units: 12, mode: "MIN_STRESS");`
  },
  {
    id: 'MUSIKA-1',
    title: 'AGROMUSIKA_GENERATE',
    desc: 'Trigger neural multimedia synthesis.',
    icon: Leaf,
    code: `IMPORT EOS.Media AS Musika;\nMusika.generate_shard(type: "VIDEO", prompt: "Regenerative Bantu garden time-lapse");`
  },
  { 
    id: 'S3', 
    title: 'LEDGER_SETTLE', 
    desc: 'Anchor commercial finality to L3.', 
    icon: Database,
    code: `COMMIT_SHARD(registry: "GLOBAL_L3", finality: ZK_PROVEN);`
  },
];

const FarmOS: React.FC<FarmOSProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, onEmitSignal, initialCode, clearInitialCode, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'kernel' | 'ide' | 'hardware' | 'scheduler' | 'shell'>('kernel');
  const [bootStatus, setBootStatus] = useState<'OFF' | 'POST' | 'ON'>('ON');
  const [bootProgress, setBootProgress] = useState(100);
  const [shellInput, setShellInput] = useState('');
  const [logs, setLogs] = useState<string[]>([
    "AGROBOTO_OS_v6.5 kernel loaded.",
    "Registry connection established (0x882A).",
    "Consensus Quorum: 99.98% Synchronized.",
    "Initializing SEHTI Scheduler..."
  ]);

  const [resourceLoad, setResourceLoad] = useState({
    S: 42, E: 65, H: 28, T: 84, I: 55
  });

  const [hardwareHealth, setHardwareHealth] = useState({
    cpu: 45, disk: 12, net: 88, fan: 2100
  });

  const [isExecutingLogic, setIsExecutingLogic] = useState(false);

  // IDE Local States
  const [activeShard, setActiveShard] = useState('Production_Init.al');
  const [codeMap, setCodeMap] = useState<Record<string, string>>({
    'Production_Init.al': `// AGROLANG_ENVIRONMENT: EnvirosAgro OS v6.5
// NODE_DESIGNATION: ${user.esin}
IMPORT AgroLaw.Kenya.NairobiCounty AS Law;
IMPORT EOS.Automation AS Bot;
IMPORT MedicAg.Aura AS Bio;

AUTHENTICATE node_signature(id: "${user.esin}");

SEQUENCE Optimize_Cycle_882 {
    // 1. Constrain process within Legal Thresholds
    CONSTRAIN moisture_delta < Law.WATER_ACT.quota_shard;
    
    // 2. Adjust m-Resilience via Sonic Remediation
    Bio.apply_freq(target: 432Hz, gain: 0.82v);
    
    // 3. Deploy Swarm for precision sharding
    Bot.swarm_deploy(units: 12, mode: "MIN_STRESS");
    
    // 4. Anchor value to ledger
    COMMIT_SHARD(registry: "GLOBAL_L3", finality: ZK_PROVEN);
}`
  });
  const [isCompiling, setIsCompiling] = useState(false);
  const [complianceStatus, setComplianceStatus] = useState<'IDLE' | 'COMPLIANT' | 'VIOLATION'>('IDLE');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [lintErrors, setLintErrors] = useState<{line: number, msg: string}[]>([]);

  useEffect(() => {
    const code = codeMap[activeShard] || '';
    const lines = code.split('\n');
    const errors: {line: number, msg: string}[] = [];
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}')) {
        errors.push({ line: i + 1, msg: 'Missing semicolon at end of statement.' });
      }
      if (trimmed.includes('IMPORT') && !trimmed.includes('AS')) {
        errors.push({ line: i + 1, msg: 'IMPORT statement missing AS clause.' });
      }
    });
    setLintErrors(errors);
  }, [codeMap, activeShard]);

  useEffect(() => {
    if (initialSection === 'ide' || initialCode) {
      setActiveTab('ide');
      if (initialCode) {
        setCodeMap(prev => ({ ...prev, 'External_Inflow.al': initialCode }));
        setActiveShard('External_Inflow.al');
      }
    } else if (initialSection === 'shell') {
      setActiveTab('shell');
    }
  }, [initialSection, initialCode]);

  useEffect(() => {
    if (bootStatus === 'ON') {
      const metricInterval = setInterval(() => {
        setHardwareHealth(prev => ({
          cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() * 10 - 5))),
          disk: Math.min(100, prev.disk + 0.01),
          net: Math.min(100, Math.max(10, prev.net + (Math.random() * 4 - 2))),
          fan: Math.floor(2100 + Math.random() * 200)
        }));
      }, 3000);
      return () => clearInterval(metricInterval);
    }
  }, [bootStatus]);

  const handleBoot = () => {
    setBootStatus('POST');
    setBootProgress(0);
    setLogs(["INITIALIZING AGRO-INIT SEQUENCE..."]);
    onEmitSignal({
      type: 'system',
      origin: 'ORACLE',
      title: 'KERNEL_BOOT_INITIALIZED',
      message: `Node ${user.esin} initializing Sycamore OS v6.5 boot sequence.`,
      priority: 'medium',
      actionIcon: 'Power'
    });

    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBootStatus('ON');
          return 100;
        }
        if (prev === 20) setLogs(l => [...l, "Checking Soil Integrity... [OK]"]);
        if (prev === 50) setLogs(l => [...l, "Syncing Blockchain Shards... [OK]"]);
        if (prev === 80) setLogs(l => [...l, "Mounting Virtual Asset Registry... [OK]"]);
        return prev + 1;
      });
    }, 40);
  };

  const handleCompile = async () => {
    const fee = 25;
    if (!await onSpendEAC(fee, 'AGROLANG_INDUSTRIAL_AUDIT')) return;
    setIsCompiling(true);
    setComplianceStatus('IDLE');
    addLog("MOUNTING AGROLANG LOGIC SHARD...", 'info');
    
    onEmitSignal({
      type: 'task',
      origin: 'ORACLE',
      title: 'AGROLANG_AUDIT_STARTED',
      message: `Auditing code shard ${activeShard} for EOS Framework compliance.`,
      priority: 'low',
      actionIcon: 'SearchCode'
    });

    try {
      const res = await auditAgroLangCode(codeMap[activeShard]);
      await new Promise(r => setTimeout(r, 1000));
      addLog("Mapping Pillar Weights...", 'info');
      await new Promise(r => setTimeout(r, 600));
      addLog(`Handshake with Node ${user.esin} verified.`, 'success');
      
      if (res.is_compliant) {
        setComplianceStatus('COMPLIANT');
        addLog(`Shard integrity index 0.98a.`, 'success');
        onEmitSignal({
          type: 'ledger_anchor',
          origin: 'ORACLE',
          title: 'AUDIT_COMPLIANT',
          message: `Code shard ${activeShard} verified as compliant with SEHTI standards.`,
          priority: 'medium',
          actionIcon: 'ShieldCheck',
          meta: { target: 'farm_os', ledgerContext: 'INVENTION' }
        });
      } else {
        setComplianceStatus('VIOLATION');
        addLog("Resource constraint overflow detected at line 14.", 'error');
        onEmitSignal({
          type: 'system',
          origin: 'ORACLE',
          title: 'AUDIT_VIOLATION',
          message: `Code shard ${activeShard} failed compliance check. m-constant drift risk detected.`,
          priority: 'high',
          actionIcon: 'ShieldAlert'
        });
      }
    } catch (e) {
      addLog("ERROR: Oracle connection timeout.", 'error');
    } finally {
      setIsCompiling(false);
    }
  };

  const executeToShell = () => {
    setActiveTab('shell');
    addLog(`INITIALIZING DEPLOYMENT: ${activeShard}`, 'info');
    executeOptimization(codeMap[activeShard]);
  };

  const executeOptimization = async (code: string) => {
    setIsExecutingLogic(true);
    addLog("EXECUTING KERNEL BINDINGS...", 'info');
    
    const lines = code.split('\n').filter(l => l.trim() && !l.startsWith('//'));
    
    for (const line of lines) {
      await new Promise(r => setTimeout(r, 600));
      addLog(`Kernel syscall: ${line.trim().substring(0, 40)}...`, 'info');
      
      if (line.includes('CONSTRAIN')) {
        addLog("Resource boundary enforced.", 'success');
        setResourceLoad(prev => ({ ...prev, S: Math.max(10, prev.S - 5) }));
      }
      if (line.includes('Bio.apply_freq')) {
        addLog("Hardware resonance recalibrated.", 'success');
        setResourceLoad(prev => ({ ...prev, E: Math.min(100, prev.E + 8) }));
      }
      if (line.includes('Bot.swarm_deploy')) {
        addLog("Robot swarm signal transmitted.", 'success');
        setResourceLoad(prev => ({ ...prev, T: Math.min(100, prev.T + 12) }));
      }
      if (line.includes('COMMIT_SHARD')) {
        addLog("Finality reached. Shard anchored.", 'success');
      }
    }

    await new Promise(r => setTimeout(r, 800));
    addLog("OS OPTIMIZATION FINALIZED.", 'success');
    setIsExecutingLogic(false);
    onEarnEAC(100, 'OS_LOGIC_EXECUTION_REWARD');
  };

  const handleShellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellInput.trim() || isExecutingLogic) return;
    const cmd = shellInput.toLowerCase().trim();
    setLogs(prev => [`admin@EnvirosAgro:~$ ${shellInput}`, ...prev]);
    
    if (cmd === 'agro-apply-logic' && activeShard) {
      executeOptimization(codeMap[activeShard]);
    } else if (cmd === 'npx wrangler deploy') {
      setIsExecutingLogic(true);
      addLog("Initializing Project Deployment Shard...", 'info');
      await new Promise(r => setTimeout(r, 1000));
      addLog("Deployment Finalized at 0x882A.", 'success');
      setIsExecutingLogic(false);
    } else if (cmd === 'help') {
      addLog("Syscalls: npx wrangler deploy, net-sync, mesh-finality, ingest-status, agro-apply-logic, clear, help", 'info');
    } else if (cmd === 'clear') {
      setLogs([]);
    } else {
      addLog(`Unknown syscall: ${cmd}`, 'error');
    }
    setShellInput('');
  };

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [`[${type.toUpperCase()}] ${msg}`, ...prev]);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* HUD Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-indigo-500/20 bg-indigo-900/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Network size={600} className="text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-40 h-40 rounded-[48px] bg-indigo-600 shadow-[0_0_100px_rgba(79,70,229,0.4)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Binary size={80} className="text-white relative z-10 animate-pulse" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                    <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-white/10 shadow-inner italic">EOS_ENGINE_v6.5</span>
                    <span className="px-4 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">MESH_STABLE</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Unified <span className="text-indigo-400">Agro OS</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating the industrial mesh. A complete environment for kernel sharding, biological logic forging, and real-time execution."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic">KERNEL_STATUS</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">ONLINE</h4>
              <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div> SYNCED
              </div>
           </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'kernel', label: 'Kernel Hub', icon: Layers },
          { id: 'ide', label: 'Logic Forge', icon: Code2 },
          { id: 'shell', label: 'System Shell', icon: Terminal },
          { id: 'hardware', label: 'Asset Monitor', icon: CpuIcon },
          { id: 'scheduler', label: 'Thrust Load', icon: Gauge },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[850px] relative z-10">
        
        {/* VIEW: KERNEL HUB */}
        {activeTab === 'kernel' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700">
             <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-6 px-10 mb-6">
                   <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 shadow-xl">
                      <Layers className="w-8 h-8 text-indigo-400" />
                   </div>
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Kernel <span className="text-indigo-400">Stack</span></h3>
                </div>
                <div className="space-y-4">
                   {KERNEL_LAYERS.map((layer, i) => (
                      <div key={i} className="glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all group relative overflow-hidden flex items-center justify-between shadow-3xl border-l-[12px] border-l-indigo-600">
                         <div className="flex items-center gap-8 relative z-10">
                            <span className="text-6xl font-black text-slate-800 font-mono italic group-hover:text-indigo-950 transition-colors">0{5-i}</span>
                            <div>
                               <h4 className={`text-3xl font-black uppercase italic m-0 tracking-tighter ${layer.col}`}>{layer.level}</h4>
                               <p className="text-slate-500 font-bold uppercase text-[10px] mt-2 tracking-widest leading-none italic">{layer.agro}</p>
                            </div>
                         </div>
                         <div className="text-center max-w-xs hidden xl:block">
                            <p className="text-slate-500 text-base italic font-medium leading-relaxed">"{layer.desc}"</p>
                         </div>
                         <div className="flex items-center gap-4 relative z-10">
                            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{layer.status}</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* VIEW: LOGIC FORGE (IDE) */}
        {activeTab === 'ide' && (
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch animate-in zoom-in duration-700">
              <div className="xl:col-span-3 space-y-6">
                 <div className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 space-y-10 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                       <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Snippet <span className="text-indigo-400">Ledger</span></h4>
                    </div>
                    <div className="space-y-4">
                       {SNIPPETS.map(s => (
                          <div 
                             key={s.id} 
                             onClick={() => setCodeMap({ ...codeMap, [activeShard]: codeMap[activeShard] + "\n" + s.code })}
                             className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all cursor-pointer group"
                          >
                             <div className="flex items-center gap-4 mb-2">
                                <s.icon size={16} className="text-indigo-400" />
                                <span className="text-[10px] font-black text-white uppercase">{s.title}</span>
                             </div>
                             <p className="text-[8px] text-slate-500 font-medium italic">"{s.desc}"</p>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="xl:col-span-9 space-y-8 flex flex-col">
                 <div className="glass-card rounded-[64px] border-2 border-white/5 bg-[#050706] overflow-hidden shadow-3xl flex flex-col h-[700px] relative">
                    <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 px-12">
                       <div className="flex items-center gap-6">
                          <Code size={24} className="text-indigo-400" />
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 italic">AgroLang Shard Editor</span>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={handleCompile} disabled={isCompiling} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all">
                             {isCompiling ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="white" />}
                             AUDIT_CODE
                          </button>
                          {complianceStatus === 'COMPLIANT' && (
                             <button onClick={executeToShell} className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl border-2 border-white/20 animate-pulse">
                                DEPLOY_TO_KERNEL
                             </button>
                          )}
                       </div>
                    </div>
                    <div className="flex-1 flex gap-10 p-12 bg-black relative overflow-y-auto custom-scrollbar-editor">
                       <div className="w-12 text-right font-mono text-[20px] text-slate-800 pt-[8px] border-r border-white/5 pr-8 select-none leading-[50px]">
                          {codeMap[activeShard].split('\n').map((_, i) => (
                            <div key={i} className="relative">
                              {(i + 1).toString().padStart(2, '0')}
                              {lintErrors.find(e => e.line === i + 1) && (
                                <div className="absolute top-1/2 -translate-y-1/2 -right-6 text-rose-500 cursor-help" title={lintErrors.find(e => e.line === i + 1)?.msg}>
                                  <AlertCircle size={14} />
                                </div>
                              )}
                            </div>
                          ))}
                       </div>
                       <div className="flex-1">
                          <Editor
                             value={codeMap[activeShard]}
                             onValueChange={(code) => setCodeMap({ ...codeMap, [activeShard]: code })}
                             highlight={code => Prism.highlight(code, Prism.languages.agrolang, 'agrolang')}
                             padding={8}
                             style={{
                               fontFamily: 'monospace',
                               fontSize: 20,
                               lineHeight: '50px',
                               backgroundColor: 'transparent',
                               color: 'rgba(52, 211, 153, 0.9)',
                               fontStyle: 'italic',
                               minHeight: '100%',
                               outline: 'none',
                               border: 'none'
                             }}
                             className="outline-none"
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: SYSTEM SHELL */}
        {activeTab === 'shell' && (
           <div className="glass-card rounded-[64px] border-2 border-white/5 bg-[#050706] overflow-hidden shadow-3xl flex flex-col h-[700px] relative animate-in slide-in-from-right-10 duration-700">
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 px-12">
                 <div className="flex items-center gap-4">
                    <Terminal className="w-6 h-6 text-indigo-400" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 italic">Root Kernel Shell</span>
                 </div>
              </div>
              <div className="flex-1 p-10 overflow-y-auto font-mono text-[14px] space-y-4 custom-scrollbar-terminal text-slate-400 italic bg-black/20">
                 {logs.map((log, i) => (
                    <div key={i} className="flex gap-6 animate-in slide-in-from-left-1">
                       <span className="text-slate-800 shrink-0 select-none">{"$"}</span>
                       <span className={log.includes('SUCCESS') || log.includes('COMPLIANT') ? 'text-emerald-400 font-bold' : log.includes('ERROR') || log.includes('VIOLATION') ? 'text-rose-500 font-bold' : 'text-slate-500'}>{log}</span>
                    </div>
                 ))}
                 {isExecutingLogic && (
                    <div className="flex items-center gap-4 text-indigo-400 animate-pulse">
                       <Loader2 className="w-4 h-4 animate-spin" />
                       <span>KERNEL_EXECUTION_ACTIVE...</span>
                    </div>
                 )}
              </div>
              <form onSubmit={handleShellSubmit} className="p-8 border-t border-white/5 bg-black/90">
                 <div className="flex items-center gap-6">
                    <span className="text-indigo-500 font-mono font-bold select-none">admin@EnvirosAgro:~$</span>
                    <input 
                       type="text" 
                       value={shellInput}
                       onChange={e => setShellInput(e.target.value)}
                       disabled={isExecutingLogic}
                       placeholder="Enter syscall..."
                       className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-stone-900"
                       autoFocus
                    />
                 </div>
              </form>
           </div>
        )}

        {/* VIEW: HARDWARE MONITOR */}
        {activeTab === 'hardware' && (
           <div className="space-y-12 animate-in zoom-in duration-1000">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                    { l: 'CPU_RESONANCE', v: hardwareHealth.cpu, i: CpuIcon, c: 'text-blue-400', u: '%' },
                    { l: 'SHARD_STORAGE', v: hardwareHealth.disk, i: HardDrive, c: 'text-emerald-400', u: '%' },
                    { l: 'MESH_NETWORK', v: hardwareHealth.net, i: Radio, c: 'text-indigo-400', u: 'Mb/s' },
                    { l: 'FAN_VELOCITY', v: hardwareHealth.fan, i: Fan, c: 'text-rose-400', u: 'RPM' },
                 ].map((stat, i) => (
                    <div key={i} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-6 shadow-xl group hover:border-white/20 transition-all overflow-hidden relative h-[300px] flex flex-col justify-between">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[12s]"><stat.i size={120} /></div>
                       <div className="flex justify-between items-center relative z-10 px-2">
                          <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${stat.c}`}>{stat.l}</p>
                          <stat.i size={20} className={stat.c} />
                       </div>
                       <div className="relative z-10">
                          <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none italic">{stat.v.toFixed(0)}<span className="text-xl opacity-30 ml-1 uppercase">{stat.u}</span></h4>
                          <div className="mt-8 h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                             <div className={`h-full rounded-full transition-all duration-[3s] ${stat.c.replace('text', 'bg')} shadow-[0_0_15px_currentColor]`} style={{ width: `${Math.min(100, stat.v % 100)}%` }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* VIEW: THRUST LOAD (SCHEDULER) */}
        {activeTab === 'scheduler' && (
           <div className="space-y-16 animate-in slide-in-from-right-10 duration-1000">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 px-6">
                 {[
                    { id: 'S', name: 'Societal', color: '#f43f5e', val: resourceLoad.S, i: Users },
                    { id: 'E', name: 'Enviro', color: '#10b981', val: resourceLoad.E, i: Leaf },
                    { id: 'H', name: 'Human', color: '#14b8a6', val: resourceLoad.H, i: HeartPulse },
                    { id: 'T', name: 'Tech', color: '#3b82f6', val: resourceLoad.T, i: CpuIcon },
                    { id: 'I', name: 'Info', color: '#818cf8', val: resourceLoad.I, i: Radio },
                 ].map(m => (
                    <div key={m.id} className="glass-card p-12 rounded-[56px] border-2 border-white/5 flex flex-col items-center text-center space-y-10 shadow-3xl hover:scale-105 transition-all group overflow-hidden bg-black/40 h-[480px] justify-between">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><m.i size={200} style={{ color: m.color }} /></div>
                       <div className="w-24 h-24 rounded-[40px] flex items-center justify-center shadow-3xl relative overflow-hidden group-hover:rotate-6 transition-all border-4 border-white/10" style={{ backgroundColor: `${m.color}10` }}>
                          <m.i size={40} style={{ color: m.color }} />
                          <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                       </div>
                       <h5 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-xl">{m.name}</h5>
                       <div className="w-full space-y-6">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active load</p>
                          <p className="text-5xl font-mono font-black text-white tracking-tighter">{m.val}%</p>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                             <div className="h-full rounded-full transition-all duration-[2s]" style={{ width: `${m.val}%`, backgroundColor: m.color }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .custom-scrollbar-editor::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-editor::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.4); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .token.comment { color: #6b7280; font-style: italic; }
        .token.string { color: #f59e0b; }
        .token.keyword { color: #c084fc; font-weight: bold; }
        .token.function { color: #60a5fa; }
        .token.number { color: #34d399; }
        .token.operator { color: #f472b6; }
        .token.punctuation { color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default FarmOS;
