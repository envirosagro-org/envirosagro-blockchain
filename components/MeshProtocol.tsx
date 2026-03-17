
/* Added React import to resolve namespace error */
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, Activity, ShieldCheck, Zap, Database, 
  Loader2, Radio, Binary, Link2, Globe, Cpu, 
  Workflow, Target, BadgeCheck, Terminal, 
  History, Fingerprint, Lock, Layers,
  ChevronRight, ArrowRight, ArrowUpRight,
  Database as PostgresIcon, Server, Search, RefreshCw,
  Bot, Monitor, Leaf, AlertCircle, LayoutGrid,
  Box,
  Atom,
  TrendingUp,
  Stamp
} from 'lucide-react';
import { User, MeshNode, AgroBlock } from '../types';
import { auditMeshStability, AgroLangResponse } from '../services/agroLangService';
import { SycamoreLogo } from '../App';
import { startBackgroundDataSync } from '../services/firebaseService';
import { generateQuickHash, generateAlphanumericId } from '../systemFunctions';

interface MeshProtocolProps {
  user: User;
  blockchain: AgroBlock[];
}

interface MempoolTx {
  hash: string;
  from: string;
  value: string;
  timestamp: string;
  thrust: string;
}

const INITIAL_MESH_NODES: MeshNode[] = [
  { id: 'NODE-ROOT', esin: 'EA-ROOT-001', label: 'Primary Validator', status: 'UP', lastBlock: '0x882A_FINAL', peers: ['AFRI-4', 'EURO-82'], latency: 12, load: 45 },
  { id: 'AFRI-4', esin: 'EA-AFR-004', label: 'Nairobi Ingest', status: 'UP', lastBlock: '0x882A_FINAL', peers: ['NODE-ROOT', 'ASIA-91'], latency: 18, load: 62 },
  { id: 'EURO-82', esin: 'EA-EUR-082', label: 'Valencia Shard', status: 'SYNCING', lastBlock: '0x882A_PEND', peers: ['NODE-ROOT', 'AMER-12'], latency: 45, load: 12 },
  { id: 'AMER-12', esin: 'EA-AMR-012', label: 'Omaha Hub', status: 'UP', lastBlock: '0x882A_FINAL', peers: ['EURO-82'], latency: 24, load: 38 },
  { id: 'ASIA-91', esin: 'EA-ASN-091', label: 'Tokyo Relay', status: 'UP', lastBlock: '0x882A_FINAL', peers: ['AFRI-4'], latency: 32, load: 55 },
];

const MeshProtocol: React.FC<MeshProtocolProps> = ({ user, blockchain }) => {
  const [activeTab, setActiveTab] = useState<'topology' | 'commits' | 'mempool'>('commits');
  const [nodes, setNodes] = useState<MeshNode[]>(INITIAL_MESH_NODES);
  const [mempool, setMempool] = useState<MempoolTx[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [oracleVerdict, setOracleVerdict] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [latency, setLatency] = useState(14);
  const [dcStatus, setDcStatus] = useState('RELATIONAL_SHARD_OPTIMIZED');
  const [shardsInFlight, setShardsInFlight] = useState<{ id: string; from: string; to: string; progress: number }[]>([]);

  // Background Data Sync
  useEffect(() => {
    return startBackgroundDataSync((newStatus) => {
      setDcStatus(newStatus === 'RELATIONAL_SHARD_OPTIMIZED' ? newStatus : 'RELATIONAL_SHARD_OPTIMIZED');
    });
  }, []);

  // Simulation: Node Load Drifts & Shard Propagation
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        load: Math.min(100, Math.max(10, node.load + (Math.random() * 10 - 5))),
        latency: Math.min(500, Math.max(5, node.latency + (Math.random() * 4 - 2)))
      })));
      setLatency(prev => Math.min(500, Math.max(5, prev + (Math.random() * 4 - 2))));

      // Shard Movement Logic
      if (nodes.length > 0 && Math.random() > 0.4) {
        const fromIdx = Math.floor(Math.random() * nodes.length);
        const toIdx = Math.floor(Math.random() * nodes.length);
        if (fromIdx !== toIdx) {
          const shardId = `SHD-${generateAlphanumericId(7)}`;
          setShardsInFlight(prev => [...prev, { id: shardId, from: nodes[fromIdx].id, to: nodes[toIdx].id, progress: 0 }]);
        }
      }

      // Mempool Ingest Logic
      if (Math.random() > 0.7) {
        const newTx: MempoolTx = {
          hash: `0x${generateQuickHash()}`,
          from: nodes[Math.floor(Math.random() * nodes.length)]?.id || 'EXT_NODE',
          value: (Math.random() * 500 + 10).toFixed(1) + ' EAC',
          timestamp: new Date().toLocaleTimeString(),
          thrust: ['Societal', 'Environmental', 'Human', 'Technological', 'Industry'][Math.floor(Math.random() * 5)]
        };
        setMempool(prev => [newTx, ...prev].slice(0, 10));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [nodes]);

  // Shard Animation Loop
  useEffect(() => {
    let frame: number;
    const loop = () => {
      setShardsInFlight(prev => prev.map(s => ({ ...s, progress: s.progress + 1.5 })).filter(s => s.progress < 100));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleRunMeshAudit = async () => {
    setIsAuditing(true);
    setOracleVerdict(null);
    try {
      const res = await auditMeshStability({
        total_nodes: nodes.length,
        avg_latency: latency,
        consensus: 99.98,
        mesh_resonance: nodes.reduce((acc, n) => acc + (1 / (n.latency + 1)), 0)
      });
      setOracleVerdict(res.text);
    } catch (e) {
      setOracleVerdict("ORACLE_SYNC_ERROR: Mesh handshake interrupted.");
    } finally {
      setIsAuditing(false);
    }
  };

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);

  const mapNodes = useMemo(() => [
    { id: 'NODE-ROOT', x: 50, y: 50 },
    { id: 'AFRI-4', x: 25, y: 30 },
    { id: 'EURO-82', x: 75, y: 25 },
    { id: 'AMER-12', x: 30, y: 75 },
    { id: 'ASIA-91', x: 70, y: 70 },
  ], []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 max-w-[1600px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Network Infrastructure HUD */}
      <div className="flex flex-col items-center gap-10">
        <div className="glass-card p-12 md:p-16 rounded-[80px] border-indigo-500/20 bg-indigo-950/10 relative overflow-hidden flex flex-col items-center w-full shadow-4xl group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:rotate-6 transition-transform duration-[20s] pointer-events-none">
              <Network size={800} className="text-white" />
           </div>
           
           <div className="relative mb-10">
              <div className="w-48 h-48 rounded-[56px] bg-white shadow-[0_0_120px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-all">
                 <div className="w-24 h-24 bg-indigo-600 rounded-[12px] flex flex-col gap-1 p-2">
                    <div className="flex gap-1 flex-1"><div className="flex-1 bg-white/20 rounded-[4px]"></div><div className="flex-1 bg-white/20 rounded-[4px]"></div></div>
                    <div className="flex gap-1 flex-1"><div className="flex-1 bg-white/20 rounded-[4px]"></div><div className="flex-1 bg-white/20 rounded-[4px]"></div></div>
                 </div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-4">
                 <span className="px-6 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 shadow-inner italic tracking-widest">MESH_TOPOLOGY_LIVE</span>
                 <span className="px-6 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-inner italic tracking-widest flex items-center gap-2">
                    <PostgresIcon size={12} /> {dcStatus}
                 </span>
              </div>
              <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Mesh <span className="text-indigo-400">Protocol.</span></h2>
              
              <div className="p-10 border-2 border-indigo-400/40 rounded-[32px] max-w-4xl bg-black/20">
                 <p className="text-slate-400 text-xl md:text-3xl font-medium italic leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                    "Direct industrial orchestration. High-frequency relational sharding is synchronized silently across the decentralized mesh architecture to ensure absolute biological finality."
                 </p>
              </div>
           </div>
        </div>

        {/* Consensus HUD Block */}
        <div className="glass-card p-12 rounded-[72px] border border-white/5 bg-black/40 flex flex-col items-center text-center relative overflow-hidden shadow-3xl group w-full max-w-4xl">
           <div className="space-y-6 relative z-10 w-full flex flex-col items-center">
              <p className="text-[14px] text-slate-500 font-black uppercase tracking-[0.8em] mb-4 italic opacity-60">C O N S E N S U S _ S Y N C</p>
              <h4 className="text-[120px] md:text-[140px] font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">99<span className="text-4xl text-indigo-500 font-sans italic ml-1">.98%</span></h4>
              <div className="text-[12px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_20px_#10b981]"></div> QUORUM_REACHED
              </div>
              <div className="w-full h-24 bg-white rounded-[32px] mt-10 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform cursor-pointer" onClick={handleRunMeshAudit}>
                 {isAuditing ? <Loader2 className="animate-spin text-indigo-600" size={32} /> : <div className="text-indigo-900 font-black uppercase text-xs tracking-widest">Perform Audit</div>}
              </div>
           </div>
        </div>
      </div>

      {/* 2. Primary Tabs */}
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap justify-center gap-4 p-2 glass-card rounded-full w-fit border border-white/5 bg-black/40 shadow-xl px-12 relative z-20">
          {[
            { id: 'topology', label: 'Network Topology', icon: Network },
            { id: 'commits', label: 'Block Commits', icon: Binary },
            { id: 'mempool', label: 'Inbound Mempool', icon: Terminal },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-12 py-6 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white'}`}
            >
              <tab.icon size={20} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[850px] relative z-10">
        
        {/* VIEW: TOPOLOGY MAP */}
        {activeTab === 'topology' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-700">
              <div className="lg:col-span-8 glass-card rounded-[80px] border-2 border-indigo-500/20 bg-[#050706] relative overflow-hidden flex items-center justify-center min-h-[750px] shadow-3xl">
                 <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_80%)]"></div>

                 <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                       <filter id="glow">
                          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                          <feMerge>
                             <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                          </feMerge>
                       </filter>
                    </defs>

                    {/* Shard Transitions */}
                    {shardsInFlight.map(shard => {
                      const fromNode = mapNodes.find(n => n.id === shard.from);
                      const toNode = mapNodes.find(n => n.id === shard.to);
                      if (!fromNode || !toNode) return null;
                      const currentX = fromNode.x + (toNode.x - fromNode.x) * (shard.progress / 100);
                      const currentY = fromNode.y + (toNode.y - fromNode.y) * (shard.progress / 100);
                      return (
                        <g key={shard.id}>
                           <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke="rgba(99,102,241,0.1)" strokeWidth="0.2" strokeDasharray="1,1" />
                           <circle cx={currentX} cy={currentY} r="0.6" fill="#6366f1" filter="url(#glow)">
                              <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                           </circle>
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {mapNodes.map(node => {
                      const liveNode = nodes.find(n => n.id === node.id);
                      return (
                        <g key={node.id} onClick={() => setSelectedNodeId(node.id)} className="cursor-pointer group/node">
                          <circle cx={node.x} cy={node.y} r="2.2" className={`transition-all duration-700 ${selectedNodeId === node.id ? 'fill-indigo-400' : 'fill-emerald-400'}`} />
                          <circle cx={node.x} cy={node.y} r="5" className="stroke-2 fill-transparent stroke-emerald-500/20 animate-pulse" />
                        </g>
                      );
                    })}
                 </svg>

                 <div className="absolute bottom-12 left-12 p-8 glass-card bg-black/80 rounded-[40px] border border-white/10 backdrop-blur-xl max-w-sm hidden md:block shadow-3xl">
                    <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                       <Activity className="text-indigo-400 animate-pulse" />
                       <span className="text-[11px] font-black text-white uppercase tracking-widest">Network Pulse</span>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[9px] font-black text-slate-500">
                          <span>AVG_LATENCY</span>
                          <span className="text-indigo-400 font-mono">{latency}ms</span>
                       </div>
                       <div className="flex justify-between items-center text-[9px] font-black text-slate-500">
                          <span>PEER_COUNT</span>
                          <span className="text-white font-mono">{nodes.length} RELAYS</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 {selectedNode ? (
                    <div className="glass-card p-10 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-950/10 h-full flex flex-col justify-between shadow-3xl animate-in slide-in-from-right-4">
                       <div className="space-y-10">
                          <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                             <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                                <Monitor size={32} />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{selectedNode.label}</h4>
                                <p className="text-[10px] text-indigo-400/60 font-mono tracking-widest uppercase mt-2">{selectedNode.esin}</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 text-center">
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Load Factor</p>
                                <p className="text-3xl font-mono font-black text-white">{selectedNode.load.toFixed(1)}%</p>
                             </div>
                             <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 text-center">
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Node Latency</p>
                                <p className="text-2xl font-mono font-black text-indigo-400">{selectedNode.latency}ms</p>
                             </div>
                          </div>
                       </div>
                       <div className="pt-8 border-t border-white/5 flex gap-4">
                          <button onClick={() => setSelectedNodeId(null)} className="flex-1 py-5 bg-white/5 border border-white/10 rounded-[28px] text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all shadow-md">Deselect Node</button>
                          <button className="p-5 bg-indigo-600 rounded-2xl text-white shadow-xl hover:bg-indigo-500 transition-all active:scale-90"><RefreshCw size={20}/></button>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-8 h-full flex flex-col">
                       <div className="glass-card p-12 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-950/10 flex flex-col text-center space-y-10 shadow-3xl relative overflow-hidden group/audit flex-1">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[12s]"><Leaf size={400} className="text-indigo-400" /></div>
                          <div className="relative z-10 space-y-12">
                             <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 animate-float">
                                <Bot size={48} className="text-white animate-pulse" />
                             </div>
                             <div className="space-y-4">
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Stability <span className="text-indigo-400">Oracle</span></h3>
                                <p className="text-slate-400 text-lg font-medium italic max-w-sm mx-auto opacity-80 leading-relaxed">
                                   "Analyzing node topography and relational sharding sequentially."
                                </p>
                             </div>
                          </div>
                          {oracleVerdict && (
                             <div className="p-8 bg-black/60 rounded-[48px] border border-indigo-500/20 shadow-inner text-left animate-in slide-in-from-bottom-2 relative z-10">
                                <p className="text-slate-300 text-sm leading-loose italic">{oracleVerdict}</p>
                             </div>
                          )}
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* VIEW: BLOCK COMMITS */}
        {activeTab === 'commits' && (
           <div className="space-y-16 animate-in slide-in-from-right-4 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/5 pb-14 px-4 gap-12">
                 <div className="space-y-4">
                    <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">BLOCK <span className="text-indigo-400">COMMITS</span></h3>
                    <p className="text-slate-500 text-2xl md:text-3xl font-medium italic opacity-70">"Real-time finality audit for industrial data shards."</p>
                 </div>
                 <div className="p-10 glass-card rounded-[48px] border border-indigo-500/20 bg-indigo-600/5 text-center shadow-2xl min-w-[320px]">
                    <p className="text-[12px] text-indigo-400 font-black uppercase tracking-[0.5em] mb-4">TOTAL SHARDS</p>
                    <p className="text-8xl font-mono font-black text-white tracking-tighter leading-none">{blockchain.length + 4280}</p>
                 </div>
              </div>

              <div className="glass-card rounded-[80px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl relative">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-12"><Database size={600} /></div>
                 <div className="grid grid-cols-4 p-14 border-b border-white/10 bg-white/[0.01] text-[14px] font-black text-slate-500 uppercase tracking-[0.6em] italic px-20 relative z-10">
                    <span>COMMIT IDENTIFIER</span>
                    <span className="text-center">VALIDATOR NODE</span>
                    <span className="text-center">TIME SHARD</span>
                    <span className="text-right">FINALITY HASH</span>
                 </div>
                 <div className="divide-y divide-white/5 bg-[#050706] relative z-10 min-h-[500px]">
                    {blockchain.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center py-40 opacity-10 space-y-8">
                          <History size={120} />
                          <p className="text-3xl font-black uppercase tracking-[0.5em]">No shards finalized</p>
                       </div>
                    ) : (
                       blockchain.slice(0, 10).map((block, i) => (
                          <div key={block.hash} className="grid grid-cols-4 p-14 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                             <div className="flex items-center gap-10">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center border-2 border-white/10 group-hover:scale-110 group-hover:border-indigo-500 transition-all shadow-inner">
                                   <Binary size={36} className="text-indigo-400" />
                                </div>
                                <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-indigo-400 transition-colors m-0">BLOCK_#{(blockchain.length - i + 4280).toLocaleString()}</h4>
                             </div>
                             <div className="text-center">
                                <span className={`px-6 py-2 bg-indigo-600/10 text-indigo-400 text-[11px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest`}>{block.validator}</span>
                             </div>
                             <div className="text-center text-lg text-slate-500 font-mono italic opacity-70 group-hover:opacity-100 transition-opacity">
                                {new Date(block.timestamp).toLocaleTimeString()}
                             </div>
                             <div className="flex justify-end pr-10 items-center gap-10">
                                <p className="text-lg font-mono font-black text-slate-600 group-hover:text-emerald-400 transition-all">{block.hash.substring(0, 16)}...</p>
                                <div className="p-5 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl text-emerald-400 shadow-xl group-hover:shadow-emerald-500/40 group-hover:scale-110 transition-all active:scale-95">
                                   <ShieldCheck size={28} />
                                </div>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: MEMPOOL */}
        {activeTab === 'mempool' && (
          <div className="animate-in slide-in-from-left-10 duration-700 space-y-12 max-w-6xl mx-auto pt-10">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-6 gap-8">
                <div className="space-y-2">
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Unconfirmed <span className="text-amber-500">Mempool</span></h3>
                   <p className="text-slate-500 text-lg md:text-xl font-medium italic opacity-70">"Live ingest of transaction shards awaiting consensus quorum finality."</p>
                </div>
                <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[40px] text-center shadow-2xl min-w-[200px]">
                   <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em] mb-2">TX_PENDING</p>
                   <p className="text-6xl font-mono font-black text-white">{mempool.length}</p>
                </div>
             </div>

             <div className="glass-card rounded-[80px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-12"><History size={600} /></div>
                <div className="grid grid-cols-12 p-10 border-b border-white/10 bg-white/[0.01] text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic px-16 relative z-10">
                   <div className="col-span-5">Tx Hash Shard</div>
                   <div className="col-span-3">Origin Node</div>
                   <div className="col-span-2 text-center">Value</div>
                   <div className="col-span-2 text-right">Status</div>
                </div>
                <div className="divide-y divide-white/5 bg-[#050706] relative z-10 min-h-[500px]">
                   {mempool.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center py-40 opacity-10 space-y-8">
                         <Loader2 size={120} className="animate-spin" />
                         <p className="text-3xl font-black uppercase tracking-[0.5em]">BUFFERING_STREAM...</p>
                      </div>
                   ) : (
                      mempool.map((tx, i) => (
                         <div key={tx.hash} className="grid grid-cols-12 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="col-span-5 flex items-center gap-8">
                               <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/20 text-amber-400 group-hover:scale-110 transition-all shadow-inner">
                                  <Binary size={24} />
                               </div>
                               <div>
                                  <p className="text-xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-amber-400 transition-colors m-0">{tx.hash}</p>
                                  <p className="text-[9px] text-slate-700 font-mono mt-2 uppercase font-black tracking-widest italic">{tx.thrust} Thrust</p>
                               </div>
                            </div>
                            <div className="col-span-3">
                               <span className="text-sm font-black text-slate-400 group-hover:text-white transition-colors">{tx.from}</span>
                            </div>
                            <div className="col-span-2 text-center">
                               <p className="text-2xl font-mono font-black text-white">{tx.value}</p>
                            </div>
                            <div className="col-span-2 flex justify-end pr-8 items-center gap-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div>
                                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">PENDING</span>
                               </div>
                               <button className="p-4 bg-white/5 rounded-2xl text-slate-800 hover:text-white transition-all"><ArrowUpRight size={18}/></button>
                            </div>
                         </div>
                      ))
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .shadow-4xl { box-shadow: 0 80px 250px -50px rgba(0, 0, 0, 0.98); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
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

export default MeshProtocol;
