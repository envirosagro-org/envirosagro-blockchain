
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  SearchCode,
  Hash, 
  Clock, 
  Shield, 
  Box, 
  User as UserIcon, 
  ArrowUpRight, 
  CheckCircle2, 
  Activity, 
  Globe, 
  Zap, 
  Database, 
  Terminal, 
  Layers, 
  RefreshCcw, 
  X, 
  Binary, 
  Cpu, 
  ShieldCheck, 
  Download, 
  Fingerprint, 
  Lock, 
  ShieldAlert, 
  Maximize2, 
  Radio, 
  Send, 
  MessageSquare, 
  Loader2, 
  Target, 
  TrendingUp, 
  Leaf, 
  Scale, 
  Heart, 
  Info, 
  BadgeCheck, 
  FileCheck, 
  Stamp,
  FileDigit,
  Network,
  Waves,
  ArrowRightLeft,
  Key,
  ShieldPlus,
  ArrowDownCircle,
  Link2,
  BoxSelect,
  Monitor, 
  Workflow, 
  ChevronRight, 
  Bot, 
  Gavel,
  Bell,
  Mail,
  Smartphone,
  ChevronDown,
  LayoutGrid,
  ClipboardCheck,
  History,
  AlertTriangle,
  Zap as ZapIcon
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { AgroBlock, User, AgroTransaction, SignalShard, ViewState } from '../types';
import { settleRegistryBatch, AgroLangResponse, auditMeshStability, probeValidatorNode } from '../services/agroLangService';
import { SycamoreLogo } from '../App';

interface ExplorerProps {
  blockchain?: AgroBlock[];
  isMining?: boolean;
  globalEchoes?: any[];
  onPulse?: (msg: string) => void;
  user?: User;
  signals?: SignalShard[];
  setSignals?: (signals: SignalShard[]) => void;
  initialSection?: string | null;
  onNavigate: (view: ViewState) => void;
}

const VALIDATORS = [
  { node: 'Environmental_Validator_04', reputation: 98.4, stake: '1.2M EAC', thrust: 'Technological', status: 'ACTIVE', resonance: 92, esin: 'EA-VAL-04' },
  { node: 'Societal_Consensus_Node_82', reputation: 99.2, stake: '840K EAC', thrust: 'Societal', status: 'ACTIVE', resonance: 98, esin: 'EA-VAL-82' },
  { node: 'Technological_Auth_Shard_12', reputation: 94.8, stake: '2.5M EAC', thrust: 'Environmental', status: 'ACTIVE', resonance: 88, esin: 'EA-VAL-12' },
  { node: 'Industrial_Core_Finalizer', reputation: 99.9, stake: '4.8M EAC', thrust: 'Industry', status: 'SYNCING', resonance: 100, esin: 'EA-VAL-HQ' },
];

const DynamicIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 18, className = "" }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.MessageSquare;
  return <IconComponent size={size} className={className} />;
};

const CHART_DATA = [
  { time: 'T-10', blocks: 45, load: 30 },
  { time: 'T-8', blocks: 52, load: 45 },
  { time: 'T-6', blocks: 48, load: 40 },
  { time: 'T-4', blocks: 61, load: 55 },
  { time: 'T-2', blocks: 55, load: 50 },
  { time: 'T-1', blocks: 68, load: 60 },
  { time: 'NOW', blocks: 84, load: 72 },
];

const Explorer: React.FC<ExplorerProps> = ({ blockchain = [], isMining = false, user, signals = [], setSignals, initialSection, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'terminal' | 'blocks' | 'ledger' | 'consensus' | 'settlement'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [expandedShardId, setExpandedShardId] = useState<string | null>(null);

  const [isSettling, setIsSettling] = useState(false);
  const [settlementResult, setSettlementResult] = useState<AgroLangResponse | null>(null);
  const [isAnalyzingPulse, setIsAnalyzingPulse] = useState(false);
  const [pulseVerdict, setPulseVerdict] = useState<AgroLangResponse | null>(null);
  const [hashRate, setHashRate] = useState(12.4);
  const [probingNode, setProbingNode] = useState<string | null>(null);
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<AgroLangResponse | null>(null);

  useEffect(() => {
    if (initialSection && ['overview', 'terminal', 'blocks', 'ledger', 'consensus', 'settlement'].includes(initialSection)) {
      setActiveTab(initialSection as any);
    }
  }, [initialSection]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHashRate(prev => Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRunSettlementAudit = async () => {
    setIsSettling(true);
    setSettlementResult(null);
    try {
      const recentTxs = blockchain.slice(0, 5).flatMap(b => b.transactions);
      const res = await settleRegistryBatch(recentTxs);
      setSettlementResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSettling(false);
    }
  };

  const handleRunPulseAnalysis = async () => {
    setIsAnalyzingPulse(true);
    setPulseVerdict(null);
    try {
      const data = {
        chain_depth: blockchain.length + 428000,
        hashrate: hashRate,
        validators: VALIDATORS.length,
        is_mining: isMining
      };
      const res = await auditMeshStability(data);
      setPulseVerdict(res);
    } catch (e) {
      setPulseVerdict({ text: "Consensus link unstable. Try again after block propagation." });
    } finally {
      setIsAnalyzingPulse(false);
    }
  };

  const handleProbeNode = async (v: any) => {
    setProbingNode(v.node);
    setIsProbing(true);
    setProbeResult(null);
    try {
      const res = await probeValidatorNode(v);
      setProbeResult(res);
    } catch (e) {
      setProbeResult({ text: "Probe failed. Node encrypted." });
    } finally {
      setIsProbing(false);
    }
  };

  const filteredBlocks = blockchain.filter(b => 
    b.hash.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.validator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allTransactions = useMemo(() => {
    return blockchain.flatMap(b => b.transactions.map(t => ({ ...t, blockHash: b.hash, validator: b.validator, timestamp: b.timestamp })));
  }, [blockchain]);

  const filteredSignals = useMemo(() => {
    return (signals || []).filter(s => {
      const matchesFilter = filter === 'all' || s.type === filter;
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [signals, filter, searchTerm]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto px-4">
      
      {/* 1. Monitoring HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-500/[0.03] space-y-6 shadow-3xl group relative overflow-hidden h-[240px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[10s]"><Activity size={120} /></div>
            <div className="flex justify-between items-center relative z-10">
               <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em]">Hash Velocity</p>
               <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
            </div>
            <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none relative z-10">{hashRate} <span className="text-xl text-blue-500 italic">TH/s</span></h4>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner relative z-10">
               <div className="h-full bg-blue-600 animate-pulse shadow-[0_0_15px_#3b82f6]" style={{ width: `${(hashRate / 15) * 100}%` }}></div>
            </div>
         </div>
         
         <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/[0.03] space-y-6 shadow-3xl group relative overflow-hidden h-[240px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[10s]"><Layers size={120} /></div>
            <div className="flex justify-between items-center relative z-10">
               <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.5em]">Block Height</p>
               <Layers className="w-5 h-5 text-emerald-500" />
            </div>
            <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none relative z-10">#{blockchain.length + 428812}</h4>
            <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500/60 uppercase tracking-widest relative z-10">
               <div className={`w-2.5 h-2.5 rounded-full ${isMining ? 'bg-amber-500 animate-ping shadow-[0_0_15px_#f59e0b]' : 'bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]'}`}></div>
               {isMining ? 'FINALIZING...' : 'SYNC_OK'}
            </div>
         </div>

         <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-500/[0.03] space-y-6 shadow-3xl group relative overflow-hidden h-[240px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[10s]"><ShieldCheck size={120} /></div>
            <div className="flex justify-between items-center relative z-10">
               <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em]">Consensus Sync</p>
               <ShieldCheck className="w-5 h-5 text-indigo-500" />
            </div>
            <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none relative z-10">99.98%</h4>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner relative z-10">
               <div className="h-full bg-indigo-600 shadow-[0_0_15px_#6366f1]" style={{ width: '99.98%' }}></div>
            </div>
         </div>

         <div className="glass-card p-10 rounded-[56px] border border-amber-500/20 bg-amber-500/[0.03] space-y-6 shadow-3xl group relative overflow-hidden h-[240px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Bell size={120} /></div>
            <div className="flex justify-between items-center relative z-10">
               <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.5em]">Signal Queue</p>
               <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none relative z-10">{signals.filter(s=>!s.read).length} <span className="text-xl text-amber-500 italic ml-1">SHRD</span></h4>
            <button onClick={handleRunPulseAnalysis} className="text-[10px] font-black text-amber-500 hover:text-white transition-colors uppercase tracking-[0.4em] flex items-center gap-2 relative z-10 border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 rounded-full shadow-inner w-fit">
               <Zap size={12} fill="currentColor" /> Analyze Pulse
            </button>
         </div>
      </div>

      {/* 2. Primary Navigation Shards */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-4 p-2 glass-card rounded-[40px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20">
        {[
          { id: 'overview', label: 'Master Overview', icon: LayoutGrid },
          { id: 'terminal', label: 'Signal Terminal', icon: Terminal },
          { id: 'blocks', label: 'Block Shards', icon: Box },
          { id: 'ledger', label: 'Tx Shards', icon: Binary },
          { id: 'settlement', label: 'Institutional Finality', icon: Gavel },
          { id: 'consensus', label: 'Validator Quorum', icon: Network },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id as any); setPulseVerdict(null); setProbeResult(null); setProbingNode(null); }}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Main Viewport */}
      <div className="min-h-[750px]">
        
        {/* --- VIEW: MASTER OVERVIEW --- */}
        {activeTab === 'overview' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                 {/* Live Propagation Chart */}
                 <div className="lg:col-span-8 glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 shadow-4xl flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-10 px-4">
                       <div className="flex items-center gap-4">
                          <Workflow className="text-indigo-400" />
                          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Live <span className="text-indigo-400">Mesh Propagation</span></h3>
                       </div>
                       <div className="px-5 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">SYNC_NOMINAL</div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={CHART_DATA}>
                             <defs>
                                <linearGradient id="colorMesh" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                             <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }} />
                             <Area type="monotone" name="Block Density" dataKey="blocks" stroke="#6366f1" strokeWidth={8} fillOpacity={1} fill="url(#colorMesh)" strokeLinecap="round" />
                             <Area type="monotone" name="Network Load" dataKey="load" stroke="#10b981" strokeWidth={2} fill="transparent" strokeDasharray="10 5" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Status Column */}
                 <div className="lg:col-span-4 space-y-8 flex flex-col">
                    <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-950/5 flex flex-col items-center justify-center text-center space-y-8 flex-1 group shadow-3xl">
                       <div className="w-24 h-24 bg-indigo-600 rounded-[40px] flex items-center justify-center shadow-3xl animate-pulse border-4 border-white/10 shrink-0 relative overflow-hidden">
                          <Bot size={48} className="text-white" />
                          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       </div>
                       <div className="space-y-3">
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-widest">Network <span className="text-indigo-400">Oracle</span></h4>
                          <p className="text-slate-400 text-sm italic font-medium">"All planetary nodes handshaking at 1.42x resonance. No critical drift detected in Sector 4."</p>
                       </div>
                       <button onClick={handleRunPulseAnalysis} className="w-full py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Request Mesh Audit</button>
                    </div>
                 </div>
              </div>

              {/* High Intensity Grid Overlays */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {/* Mini Terminal Shard */}
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl group">
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                       <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                          <Terminal size={16} className="text-indigo-400" /> Signal Buffer
                       </h4>
                       <span className="text-[10px] font-mono text-slate-700">LATEST_3</span>
                    </div>
                    <div className="space-y-4">
                       {filteredSignals.slice(0, 3).map(sig => (
                          <div key={sig.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => setActiveTab('terminal')}>
                             <p className="text-[10px] font-black text-white uppercase italic line-clamp-1">{sig.title}</p>
                             <p className="text-[9px] text-slate-600 mt-1 font-mono">{sig.origin} // {sig.priority}</p>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Mini Block Shard */}
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl group">
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                       <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                          <Box size={16} className="text-emerald-400" /> Chain Shards
                       </h4>
                       <span className="text-[10px] font-mono text-slate-700">LATEST_3</span>
                    </div>
                    <div className="space-y-4">
                       {blockchain.slice(0, 3).map(block => (
                          <div key={block.hash} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => setActiveTab('blocks')}>
                             <p className="text-[10px] font-black text-white uppercase font-mono truncate">{block.hash}</p>
                             <p className="text-[9px] text-slate-600 mt-1 font-mono">{block.validator} // {new Date(block.timestamp).toLocaleTimeString()}</p>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Mini Quorum Shard */}
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl group">
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                       <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                          <ShieldCheck size={16} className="text-blue-400" /> Quorum Sync
                       </h4>
                       <span className="text-[10px] font-mono text-slate-700">{VALIDATORS.length} ACTIVE</span>
                    </div>
                    <div className="space-y-4">
                       {VALIDATORS.slice(0, 3).map(v => (
                          <div key={v.esin} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                             <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-white uppercase italic truncate max-w-[120px]">{v.node.split('_')[0]}</span>
                             </div>
                             <span className="text-[10px] font-mono font-black text-blue-400">{v.reputation}%</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: SIGNAL TERMINAL --- */}
        {activeTab === 'terminal' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 px-4">
                 <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 w-full lg:w-auto">
                    {['all', 'emergency', 'ledger_anchor', 'liturgical', 'task', 'system', 'commerce', 'pulse'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${filter === f ? 'bg-white text-black border-white' : 'bg-black/60 border-white/5 text-slate-600 hover:text-white'}`}
                      >
                         {f.toUpperCase()}
                      </button>
                    ))}
                 </div>
                 <div className="relative group w-full lg:w-[400px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Search signals or shard IDs..." 
                      className="w-full bg-black/60 border border-white/10 rounded-full py-4 pl-14 pr-8 text-xs text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono" 
                    />
                 </div>
              </div>

              <div className="glass-card rounded-[64px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl flex flex-col relative">
                <div className="grid grid-cols-12 p-8 border-b border-white/10 bg-white/[0.01] text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest italic px-10 relative z-10">
                   <div className="col-span-5">Signal Designation</div>
                   <div className="col-span-3 text-center">Origin Node</div>
                   <div className="col-span-2 text-center">Priority</div>
                   <div className="col-span-2 text-right">Details</div>
                </div>

                <div className="divide-y divide-white/5 bg-[#050706] relative z-10 overflow-y-auto custom-scrollbar h-[600px]">
                   {filteredSignals.length === 0 ? (
                      <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                         <Terminal size={100} className="text-slate-600" />
                         <p className="text-xl font-black uppercase tracking-[0.4em] text-white italic">BUFFER_CLEAR</p>
                      </div>
                   ) : (
                      filteredSignals.map((sig) => {
                        const isExpanded = expandedShardId === sig.id;
                        const isEmergency = sig.type === 'emergency';
                        return (
                          <div key={sig.id} className="animate-in slide-in-from-bottom-1 flex flex-col">
                             <div 
                                onClick={() => setExpandedShardId(isExpanded ? null : sig.id)}
                                className={`grid grid-cols-12 p-8 md:p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer border-l-[8px] ${
                                  sig.read ? 'border-transparent opacity-40' : 
                                  isEmergency ? 'border-rose-600 animate-pulse bg-rose-500/5' :
                                  sig.priority === 'critical' ? 'border-rose-600 animate-pulse' : 
                                  sig.priority === 'high' ? 'border-amber-500' : 'border-indigo-600'
                                }`}
                             >
                                <div className="col-span-5 flex items-center gap-5">
                                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-all shrink-0 ${isEmergency ? 'bg-rose-600/10 border-rose-500/30 text-rose-500' : 'bg-white/5 border-white/10 text-indigo-400'}`}>
                                      <DynamicIcon name={sig.actionIcon || 'MessageSquare'} size={24} />
                                   </div>
                                   <div className="truncate pr-4">
                                      <h4 className="text-sm md:text-lg font-black text-white uppercase italic tracking-tight m-0 leading-none group-hover:text-indigo-400 transition-colors truncate">
                                        {sig.title}
                                      </h4>
                                      <p className="text-[10px] text-slate-500 italic mt-2 line-clamp-1 opacity-80 group-hover:opacity-100 font-medium">"{sig.message}"</p>
                                   </div>
                                </div>
                                <div className="col-span-3 text-center">
                                   <span className="text-[9px] font-mono font-black text-slate-600 group-hover:text-white transition-colors">{sig.origin} // {new Date(sig.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div className="col-span-2 text-center">
                                   <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${
                                     sig.priority === 'critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                     sig.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                     'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                   }`}>{sig.priority}</span>
                                </div>
                                <div className="col-span-2 text-right pr-4 flex items-center justify-end gap-2">
                                   <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                                </div>
                             </div>
                             {isExpanded && (
                               <div className="p-8 md:p-14 bg-black/80 border-y border-white/5 animate-in slide-in-from-top-2 duration-500 relative overflow-hidden">
                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                                     <div className="lg:col-span-7 space-y-6">
                                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                           <Workflow className="text-indigo-400 w-4 h-4" />
                                           <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic">Routing_Diagnostic</h5>
                                        </div>
                                        <div className="space-y-4">
                                           {sig.dispatchLayers.map((layer, idx) => (
                                             <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                                <div className="flex items-center gap-4">
                                                   <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${layer.status === 'SENT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-700'}`}>
                                                      {layer.channel === 'EMAIL' ? <Mail size={16} /> : layer.channel === 'PHONE' ? <Smartphone size={16} /> : <Monitor size={16} />}
                                                   </div>
                                                   <div>
                                                      <p className="text-[10px] font-black text-white uppercase italic leading-none">{layer.channel}</p>
                                                      <p className="text-[8px] text-slate-600 font-mono mt-1 uppercase tracking-widest">{layer.status}</p>
                                                   </div>
                                                </div>
                                                {layer.status === 'SENT' ? <BadgeCheck size={16} className="text-emerald-500" /> : <Loader2 size={16} className="text-indigo-400 animate-spin" />}
                                             </div>
                                           ))}
                                        </div>
                                     </div>
                                     <div className="lg:col-span-5 space-y-6">
                                        <div className="p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 shadow-inner group relative overflow-hidden">
                                           <div className="flex items-center gap-3 mb-6 border-b border-indigo-500/20 pb-4 relative z-10">
                                              <Leaf className="w-4 h-4 text-indigo-400" />
                                              <h5 className="text-[9px] font-black text-white uppercase tracking-widest italic">Oracle Summary</h5>
                                           </div>
                                           <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic font-medium relative z-10">
                                              "{sig.aiRemark}"
                                           </p>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                             )}
                          </div>
                        );
                      })
                   )}
                </div>
              </div>
           </div>
        )}

        {/* --- VIEW: BLOCK SHARDS --- */}
        {activeTab === 'blocks' && (
           <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8 px-4">
                 <div className="w-full">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Block <span className="text-emerald-400">Registry</span></h3>
                    <p className="text-slate-500 text-base mt-2 font-medium italic">"Immutable data stacks finalized via Proof of Sustainability."</p>
                 </div>
                 <div className="relative group w-full md:w-[450px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Search Block Hash or Validator..." 
                      className="w-full bg-black/60 border border-white/10 rounded-full py-5 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono italic shadow-inner" 
                    />
                 </div>
              </div>

              <div className="grid gap-8">
                 {filteredBlocks.map((block, i) => (
                    <div 
                      key={block.hash} 
                      className="glass-card p-10 rounded-[56px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden bg-black/40 shadow-3xl active:scale-[0.99] duration-300 animate-in slide-in-from-top-4"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                       <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500/20 group-hover:bg-emerald-500/60 transition-all"></div>
                       <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                          <div className="flex items-center gap-10 w-full lg:w-auto">
                             <div className="w-24 h-24 rounded-[36px] bg-slate-800 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-all shadow-2xl relative">
                                <Box className="w-12 h-12 text-emerald-400 group-hover:animate-pulse" />
                             </div>
                             <div className="space-y-3">
                                <div className="flex items-center gap-6">
                                   <span className="text-white font-mono text-3xl font-black tracking-tighter">{block.hash.substring(0, 16)}...</span>
                                   <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">FINALIZED</span>
                                   </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-8 text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">
                                   <span className="flex items-center gap-3"><Clock className="w-4 h-4 text-emerald-500" /> {new Date(block.timestamp).toLocaleTimeString()}</span>
                                   <span className="flex items-center gap-3"><UserIcon className="w-4 h-4 text-blue-400" /> {block.validator}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-12 border-t lg:border-t-0 lg:border-l border-white/5 pt-10 lg:pt-0 lg:pl-12">
                             <div className="text-right">
                                <p className="text-[10px] text-slate-600 font-black uppercase">Shard Mass</p>
                                <p className="text-3xl font-mono font-black text-white">{block.transactions.length * 14.2} KB</p>
                             </div>
                             <button className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><Maximize2 size={24} /></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: TRANSACTION LEDGER --- */}
        {activeTab === 'ledger' && (
           <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <div className="glass-card rounded-[56px] overflow-hidden border border-white/5 bg-black/40 shadow-3xl">
                 <div className="grid grid-cols-6 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic px-10">
                    <span className="col-span-2">Tx Shard Identifier</span>
                    <span>Action Type</span>
                    <span>Origin Node</span>
                    <span>Value</span>
                    <span className="text-right">Finality</span>
                 </div>
                 <div className="divide-y divide-white/5 h-[600px] overflow-y-auto custom-scrollbar bg-[#050706]">
                    {allTransactions.map((tx, i) => (
                       <div key={i} className="grid grid-cols-6 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in">
                          <div className="col-span-2 flex items-center gap-8">
                             <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-inner">
                                <Database size={24} />
                             </div>
                             <div>
                                <p className="text-xl font-black text-white uppercase italic leading-none m-0">{tx.details}</p>
                                <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black">{tx.id}</p>
                             </div>
                          </div>
                          <div><span className={`px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-lg border border-blue-500/20`}>{tx.type}</span></div>
                          <div className="text-xs text-slate-500 font-mono italic">{tx.farmId}</div>
                          <div className="text-2xl font-mono font-black text-white tracking-tighter">{tx.value} <span className="text-[10px] text-slate-700 font-sans uppercase">{tx.unit}</span></div>
                          <div className="flex justify-end pr-4"><ShieldCheck size={20} className="text-emerald-400" /></div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: VALIDATOR QUORUM --- */}
        {activeTab === 'consensus' && (
            <div className="space-y-12 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {VALIDATORS.map((v, i) => (
                  <div key={i} className={`glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden h-[450px]`} onClick={() => handleProbeNode(v)}>
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-[12s]"><Network size={200} /></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-inner">
                         <Monitor size={32} />
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${v.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'}`}>{v.status}</span>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{v.node.replace(/_/g, ' ')}</h4>
                      <p className="text-[10px] text-slate-600 font-mono font-bold mt-4 uppercase tracking-[0.4em]">{v.thrust} Pillar Anchor</p>
                    </div>
                    <div className="mt-10 pt-8 border-t border-white/5 space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">
                        <span>Node Resonance</span>
                        <span className="text-emerald-400 font-mono">{v.resonance}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${v.resonance}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {probeResult && (
                <div className="animate-in slide-in-from-bottom-10 duration-700 max-w-4xl mx-auto w-full">
                  <div className="p-10 bg-black/80 rounded-[64px] border border-indigo-500/20 shadow-3xl border-l-[16px] border-l-indigo-600 relative overflow-hidden group/probe">
                    <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8 px-4">
                       <div className="flex items-center gap-8">
                          <div className="p-5 bg-indigo-600 rounded-[28px] shadow-3xl text-white animate-pulse"><SearchCode size={32} /></div>
                          <h4 className="text-3xl font-black text-white uppercase italic m-0">Node Probe Verdict</h4>
                       </div>
                       <button onClick={() => setProbeResult(null)} className="p-4 bg-white/5 rounded-full text-slate-700 hover:text-white transition-all"><X size={24}/></button>
                    </div>
                    <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium pl-10 border-l border-white/10 relative z-10">
                       {probeResult.text}
                    </div>
                  </div>
                </div>
              )}
            </div>
        )}

        {/* --- VIEW: INSTITUTIONAL FINALITY (SETTLEMENT) --- */}
        {activeTab === 'settlement' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-card p-12 rounded-[80px] border-emerald-500/20 bg-emerald-950/5 flex flex-col items-center justify-center text-center space-y-10 shadow-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Stamp size={800} className="text-emerald-400" /></div>
                   <div className="w-32 h-32 rounded-[44px] bg-emerald-600 flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.3)] border-4 border-white/10 shrink-0 relative z-10 animate-float"><Stamp className="w-16 h-16 text-white" /></div>
                   <div className="space-y-6 relative z-10">
                      <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">REGISTRY <span className="text-emerald-400">SETTLEMENT</span></h3>
                      <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-lg mx-auto">"Anchoring industrial batches into the global m-constant equilibrium."</p>
                   </div>
                   <button onClick={handleRunSettlementAudit} disabled={isSettling} className="w-full max-w-sm py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-emerald-500/5 relative z-10">
                      {isSettling ? <Loader2 className="animate-spin" /> : <Zap size={24} className="fill-current" />}
                      <span className="ml-4">{isSettling ? 'SEQUENCING...' : 'RUN SETTLEMENT AUDIT'}</span>
                   </button>
                </div>
                <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-12 relative overflow-hidden group">
                   {!settlementResult ? (
                     <div className="opacity-20 flex flex-col items-center gap-8">
                        <History size={140} className="text-slate-600" />
                        <p className="text-4xl font-black uppercase tracking-[0.6em] text-white italic">FINALITY_STANDBY</p>
                     </div>
                   ) : (
                     <div className="animate-in slide-in-from-bottom-6 duration-700 text-left w-full space-y-10">
                        <div className="p-10 bg-black/80 rounded-[56px] border border-emerald-500/20 shadow-3xl border-l-[16px] border-l-emerald-600">
                           <h4 className="text-2xl font-black text-white uppercase italic mb-8 border-b border-white/5 pb-4">Consensus Report</h4>
                           <p className="text-slate-300 text-xl italic font-medium leading-relaxed">{settlementResult.text}</p>
                        </div>
                        <div className="flex justify-center"><button onClick={() => setSettlementResult(null)} className="px-16 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all">ANCHOR BATCH FINALITY</button></div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .shadow-4xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.98); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Explorer;
