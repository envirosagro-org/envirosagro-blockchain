
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Bot, 
  Shield, 
  Zap, 
  Network, 
  Loader2, 
  Cpu, 
  Activity, 
  Terminal, 
  Database, 
  Lock, 
  Search, 
  X, 
  CheckCircle2, 
  Radio, 
  Globe, 
  Target, 
  Bug, 
  SmartphoneNfc, 
  ShieldAlert, 
  Fingerprint, 
  Stamp, 
  ArrowRight, 
  Radar, 
  Waves, 
  Wifi, 
  ChevronRight,
  Maximize2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  PlusCircle,
  Eye,
  Settings,
  Trash2,
  Leaf,
  ArrowUpRight,
  FlaskConical,
  Code2,
  Handshake,
  Workflow,
  History,
  Wand2,
  BadgeCheck,
  Binary,
  Send
} from 'lucide-react';
import { User, ViewState, SignalShard } from '../types';
import { chatWithAgroLang, forgeSwarmMission } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import { SycamoreLogo } from '../App';
import { generateQuickHash } from '../systemFunctions';

interface RobotProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
}

interface Crawler {
  id: string;
  name: string;
  type: 'SoilProbe' | 'SpectralDrone' | 'HarvesterBot';
  status: 'ACTIVE' | 'MAINTENANCE' | 'SECURITY_LOCK';
  handshake: 'ZK_VERIFIED' | 'PENDING';
  load: number;
  battery: number;
  threatLevel: number;
  pos: { x: number; y: number };
}

const INITIAL_FLEET: Crawler[] = [
  { id: 'BOT-8821', name: 'Probe Alpha-1', type: 'SoilProbe', status: 'ACTIVE', handshake: 'ZK_VERIFIED', load: 42, battery: 88, threatLevel: 2, pos: { x: 30, y: 40 } },
  { id: 'BOT-1042', name: 'Scout Delta', type: 'SpectralDrone', status: 'ACTIVE', handshake: 'ZK_VERIFIED', load: 78, battery: 45, threatLevel: 5, pos: { x: 70, y: 25 } },
  { id: 'BOT-4420', name: 'Harvester Core', type: 'HarvesterBot', status: 'MAINTENANCE', handshake: 'PENDING', load: 0, battery: 12, threatLevel: 0, pos: { x: 50, y: 75 } },
];

const Robot: React.FC<RobotProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, onEmitSignal }) => {
  const [activeTab, setActiveTab] = useState<'registry' | 'forge' | 'terminal' | 'radar'>('registry');
  const [fleet, setFleet] = useState<Crawler[]>(INITIAL_FLEET);
  const [packetLogs, setPacketLogs] = useState<any[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');

  // Mission Forge States
  const [missionObjective, setMissionObjective] = useState('');
  const [isForging, setIsForging] = useState(false);
  const [forgeResult, setForgeResult] = useState<any | null>(null);

  // Packet Stream Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const sources = fleet.map(b => b.id).concat(['EXTERNAL_IP', 'ORACLE_RELAY']);
      const actions = ['GET_GEOMAP', 'PUSH_TELEMETRY', 'AUTH_HANDSHAKE', 'M2M_SYNC'];
      const newPacket = {
        id: `PKT-${generateQuickHash(4)}`,
        time: new Date().toLocaleTimeString(),
        src: sources[Math.floor(Math.random() * sources.length)],
        act: actions[Math.floor(Math.random() * actions.length)],
        risk: Math.random() > 0.95 ? 'CRITICAL' : Math.random() > 0.8 ? 'MEDIUM' : 'LOW'
      };
      setPacketLogs(prev => [newPacket, ...prev].slice(0, 50));
    }, 2000);
    return () => clearInterval(interval);
  }, [fleet]);

  const selectedBot = useMemo(() => fleet.find(b => b.id === selectedBotId), [fleet, selectedBotId]);

  const handleNeuralAudit = async () => {
    if (isAuditing) return;
    const fee = 20;
    if (!await onSpendEAC(fee, 'SWARM_SECURITY_NEURAL_AUDIT')) return;

    setIsAuditing(true);
    setAuditReport(null);

    try {
      const logSample = packetLogs.slice(0, 5).map(p => `[${p.time}] ${p.src}: ${p.act} (RISK: ${p.risk})`).join('\n');
      const prompt = `Act as the EnvirosAgro Cyber-Security Oracle. Analyze this crawler packet stream for Node ${user.esin}:\n\n${logSample}\n\nIdentify anomalies or potential SID injections.`;
      const res = await chatWithAgroLang(prompt, []);
      setAuditReport(res.text);
      onEarnEAC(10, 'SECURITY_THREAT_IDENTIFIED');
    } catch (e) {
      setAuditReport("ORACLE_SYNC_ERROR: Security buffer parity failed.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleForgeMission = async () => {
    if (!missionObjective.trim() || isForging) return;
    setIsForging(true);
    setForgeResult(null);
    try {
      const res = await forgeSwarmMission(missionObjective);
      setForgeResult(res.json);
    } catch (e) {
      alert("Forge handshake timeout.");
    } finally {
      setIsForging(false);
    }
  };

  const commitMission = async () => {
    if (!forgeResult || esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    const COST = 50;
    if (await onSpendEAC(COST, `COMMIT_MISSION_${forgeResult.mission_title}`)) {
      onEmitSignal({
        type: 'task',
        origin: 'ORACLE',
        title: `MISSION_ANCHORED: ${forgeResult.mission_title}`,
        message: `Swarm objective initialized with ${forgeResult.required_units} bots.`,
        priority: 'high',
        actionIcon: 'Workflow'
      });
      setForgeResult(null);
      setMissionObjective('');
      setEsinSign('');
      setActiveTab('terminal');
      onEarnEAC(20, 'MISSION_FORGE_CONTRIBUTION');
    }
  };

  const toggleBotLock = (id: string) => {
    setFleet(prev => prev.map(b => {
      if (b.id === id) {
        const newStatus = b.status === 'SECURITY_LOCK' ? 'ACTIVE' : 'SECURITY_LOCK';
        return { ...b, status: newStatus as any };
      }
      return b;
    }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Swarm HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Network size={600} className="text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.4)] shrink-0 border-4 border-white/10 relative overflow-hidden group-hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <Bot size={80} className="text-white relative z-10 animate-pulse" />
              <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase rounded-full border border-indigo-500/20 shadow-inner italic tracking-widest">SWARM_COMMAND_v6.5</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Robotic <span className="text-indigo-400">Swarm.</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Executing autonomous telemetry sweeps and precision sharding missions. Powered by the EnvirosAgro Swarm Oracle."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">FLEET_RESONANCE</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">94<span className="text-3xl text-indigo-500 font-sans italic ml-1">.2</span></h4>
              <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div> NODE_STABLE
              </div>
           </div>
        </div>
      </div>

      {/* 2. Primary Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'registry', label: 'Fleet Registry', icon: Database },
          { id: 'radar', label: 'Tactical Radar', icon: Radar },
          { id: 'forge', label: 'Mission Forge', icon: Wand2 },
          { id: 'terminal', label: 'Execution Shell', icon: Terminal },
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

      <div className="min-h-[750px] relative z-10">
        
        {/* VIEW: FLEET REGISTRY */}
        {activeTab === 'registry' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {fleet.map(bot => (
                  <div key={bot.id} className={`glass-card p-10 rounded-[64px] border-2 transition-all group flex flex-col justify-between h-[580px] shadow-3xl relative overflow-hidden active:scale-[0.99] ${bot.status === 'SECURITY_LOCK' ? 'bg-rose-950/10 border-rose-500/40' : 'bg-black/40 border-white/5 hover:border-indigo-500/40'}`}>
                     <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Bot size={300} /></div>
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 shadow-inner group-hover:rotate-6 transition-all ${bot.status === 'SECURITY_LOCK' ? 'text-rose-500' : 'text-indigo-400'}`}>
                           <Bot size={32} />
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl ${
                             bot.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                             bot.status === 'MAINTENANCE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                             'bg-rose-600/20 text-rose-500 border-rose-500/40 animate-pulse'
                           }`}>{bot.status}</span>
                        </div>
                     </div>
                     <div className="space-y-4 relative z-10">
                        <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{bot.name}</h4>
                        <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{bot.id} // {bot.type}</p>
                     </div>
                     <div className="space-y-6 pt-10 border-t border-white/5 relative z-10">
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                              <span>Computational Load</span>
                              <span className="text-indigo-400 font-mono">{bot.load}%</span>
                           </div>
                           <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                              <div className={`h-full bg-indigo-500 transition-all duration-1000`} style={{ width: `${bot.load}%` }}></div>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                        <button onClick={() => toggleBotLock(bot.id)} className={`flex-1 py-5 rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 border-2 ${bot.status === 'SECURITY_LOCK' ? 'bg-indigo-600 text-white border-white/20' : 'bg-rose-950/20 text-rose-500 border-rose-500/20 hover:bg-rose-600 hover:text-white'}`}>
                           {bot.status === 'SECURITY_LOCK' ? 'RELEASE_SHARD' : 'ISOLATE_NODE'}
                        </button>
                        <button onClick={() => { setSelectedBotId(bot.id); setActiveTab('radar'); }} className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all"><Target size={20}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* VIEW: TACTICAL RADAR */}
        {activeTab === 'radar' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-700 h-full">
              <div className="lg:col-span-8 glass-card rounded-[80px] border-2 border-white/5 bg-[#050706] relative overflow-hidden flex items-center justify-center min-h-[700px] shadow-3xl">
                 <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.2)_0%,_transparent_70%)]"></div>
                    <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                 </div>

                 {/* Tactical Radar SVG */}
                 <div className="relative w-[500px] h-[500px] z-10">
                    <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-[100px] border-2 border-indigo-500/10 rounded-full"></div>
                    <div className="absolute inset-[200px] border-2 border-indigo-500/5 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-indigo-500/40 to-transparent origin-left animate-spin-slow"></div>
                    
                    {fleet.map((bot, i) => (
                       <div 
                         key={bot.id} 
                         /* Corrected setSelectedNodeId to setSelectedBotId */
                         onClick={() => setSelectedBotId(bot.id)}
                         className={`absolute w-8 h-8 -ml-4 -mt-4 cursor-pointer transition-all duration-1000 ${selectedBotId === bot.id ? 'scale-150 z-50' : 'hover:scale-125 z-40'}`}
                         style={{ left: `${bot.pos.x}%`, top: `${bot.pos.y}%` }}
                       >
                          <div className={`w-full h-full rounded-full border-2 border-white shadow-2xl flex items-center justify-center transition-all ${bot.status === 'SECURITY_LOCK' ? 'bg-rose-600' : selectedBotId === bot.id ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                             <Bot size={14} className="text-white" />
                          </div>
                          {selectedBotId === bot.id && <div className="absolute inset-[-10px] rounded-full border-2 border-dashed border-indigo-400 animate-spin-slow"></div>}
                       </div>
                    ))}
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-6 h-6 bg-white rounded-full shadow-[0_0_40px_#fff] z-10 animate-pulse border-4 border-white/20"></div>
                       <p className="absolute mt-14 text-[8px] font-black text-white uppercase tracking-widest opacity-40">Steward_Node_#882A</p>
                    </div>
                 </div>

                 <div className="absolute top-12 left-12 p-6 glass-card rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl">
                    <div className="flex items-center gap-4 mb-4">
                       <Radio className="text-emerald-400 animate-pulse" size={16} />
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Radar Ingest</span>
                    </div>
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Coverage: 1.4km Radius</p>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 {selectedBot ? (
                    <div className="glass-card p-10 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-950/10 h-full flex flex-col justify-between shadow-3xl animate-in slide-in-from-right-4 duration-700">
                       <div className="space-y-10">
                          <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                             <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                                <Bot size={32} />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{selectedBot.name}</h4>
                                <p className="text-[10px] text-indigo-400/60 font-mono tracking-widest mt-2 uppercase">{selectedBot.id}</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 text-center">
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Resonance</p>
                                <p className="text-2xl font-mono font-black text-white">99.2%</p>
                             </div>
                             <div className={`p-6 bg-black/60 rounded-[32px] border border-white/5 text-center`}>
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Threat</p>
                                <p className={`text-2xl font-mono font-black ${selectedBot.threatLevel > 3 ? 'text-rose-500' : 'text-emerald-400'}`}>{selectedBot.threatLevel}%</p>
                             </div>
                          </div>

                          <div className="p-8 bg-black/80 rounded-[40px] border border-white/5 space-y-6 shadow-inner">
                             <div className="flex justify-between items-center px-2">
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Shard Context</h5>
                                <BadgeCheck size={14} className="text-emerald-400" />
                             </div>
                             <p className="text-xs text-slate-400 italic leading-relaxed">
                                "Executing Sector 4 moisture sharding. Registry handshake synchronized with Githaka mesh node."
                             </p>
                          </div>
                       </div>
                       
                       <div className="pt-8 border-t border-white/5 space-y-4">
                          <button onClick={() => toggleBotLock(selectedBot.id)} className="w-full py-6 bg-rose-600 hover:bg-rose-500 rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">
                             {selectedBot.status === 'SECURITY_LOCK' ? 'RELEASE_NODE' : 'EMERGENCY_ISOLATE'}
                          </button>
                          <button onClick={() => setSelectedBotId(null)} className="w-full py-4 text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white">Deselect Node</button>
                       </div>
                    </div>
                 ) : (
                    <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                       <Radar size={100} className="text-slate-600 group-hover:text-indigo-400 transition-colors duration-1000" />
                       <p className="text-2xl font-black uppercase tracking-[0.4em] text-white italic">RADAR_IDLE</p>
                       <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Select a node on the tactical map to view shard details</p>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* VIEW: MISSION FORGE */}
        {activeTab === 'forge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-700">
             <div className="lg:col-span-5 space-y-8">
                <div className="glass-card p-10 md:p-14 rounded-[72px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden shadow-3xl group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Leaf size={400} className="text-indigo-400" /></div>
                   
                   <div className="relative z-10 space-y-10">
                      <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                         <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-3xl group-hover:rotate-12 transition-transform duration-700">
                            <Wand2 size={40} className="animate-pulse" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic m-0">Mission <span className="text-indigo-400">Forge</span></h3>
                            <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ORACLE_SYNTHESIS_v4</p>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Mission Objective</label>
                            <textarea 
                               value={missionObjective}
                               onChange={e => setMissionObjective(e.target.value)}
                               placeholder="Input objective (e.g. Optimize Sector 7 swarm for moisture sharding)..."
                               className="w-full bg-black/80 border-2 border-white/10 rounded-[40px] p-10 text-white text-lg font-medium italic focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none h-48 resize-none shadow-inner placeholder:text-stone-900"
                            />
                         </div>
                         <button 
                           onClick={handleForgeMission}
                           disabled={isForging || !missionObjective.trim()}
                           className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-30"
                         >
                            {isForging ? <Loader2 size={32} className="animate-spin mx-auto" /> : <Binary size={32} className="mx-auto" />}
                            <p className="mt-4">{isForging ? 'SYNTHESIZING_MISSION...' : 'FORGE MISSION SHARD'}</p>
                         </button>
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-7">
                <div className="glass-card rounded-[80px] min-h-[750px] border-2 border-white/5 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                   <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 px-14 relative z-20">
                      <div className="flex items-center gap-6 text-indigo-400">
                         <Code2 size={28} />
                         <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Oracle_Logic_Output</span>
                      </div>
                   </div>

                   <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-10 bg-black/20">
                      {!forgeResult && !isForging ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-10 group">
                           <div className="relative">
                              <FlaskConical size={180} className="text-slate-500 group-hover:text-indigo-400 transition-colors duration-1000" />
                              <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-6xl font-black uppercase tracking-[0.6em] text-white italic leading-none">FORGE_IDLE</p>
                              <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Awaiting high-level objective ingest</p>
                           </div>
                        </div>
                      ) : isForging ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <Loader2 size={140} className="text-indigo-500 animate-spin mx-auto" />
                              <div className="absolute inset-0 flex items-center justify-center"><Binary size={48} className="text-indigo-400 animate-pulse" /></div>
                           </div>
                           <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">MAPPING_AGROLANG_VECTORS...</p>
                        </div>
                      ) : (
                        <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10">
                           <div className="p-12 md:p-16 bg-black/90 rounded-[80px] border-2 border-indigo-500/20 shadow-3xl border-l-[20px] border-l-indigo-600 relative overflow-hidden group/final">
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/final:scale-110 transition-transform duration-[15s] pointer-events-none"><Database size={800} className="text-indigo-400" /></div>
                              <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                                 <div className="flex items-center gap-8">
                                    <BadgeCheck size={48} className="text-indigo-400" />
                                    <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">{forgeResult.mission_title}</h4>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Required Bots</p>
                                    <p className="text-4xl font-mono font-black text-white italic">{forgeResult.required_units}</p>
                                 </div>
                              </div>
                              
                              <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 font-mono text-xl text-emerald-400/90 leading-[2.5] italic mb-12 relative z-10 shadow-inner group/code">
                                 <div className="absolute top-4 right-8 opacity-20 text-slate-800"><Code2 size={40} /></div>
                                 <pre className="whitespace-pre-wrap">{forgeResult.agrolang_code}</pre>
                              </div>

                              <div className="p-10 bg-white/[0.01] rounded-[48px] border border-white/10 italic text-slate-400 text-lg leading-relaxed relative z-10">
                                 "{forgeResult.impact_summary}"
                              </div>

                              <div className="mt-20 space-y-8 relative z-10 pt-16 border-t border-white/5">
                                 <div className="max-w-xl mx-auto w-full space-y-8">
                                    <div className="space-y-4">
                                       <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.8em] block text-center italic">NODE_SIGNATURE_AUTH (ESIN)</label>
                                       <input 
                                          type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                                          placeholder="EA-XXXX-XXXX-XXXX" 
                                          className="w-full bg-black border-2 border-white/10 rounded-[56px] py-12 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                                       />
                                    </div>
                                    <div className="flex gap-6">
                                       <button onClick={() => setForgeResult(null)} className="flex-1 py-8 bg-white/5 border-2 border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                                       <button 
                                          onClick={commitMission}
                                          disabled={!esinSign}
                                          className="flex-[2] py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-white/5"
                                       >
                                          COMMIT TO SWARM
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* VIEW: EXECUTION SHELL (TERMINAL) */}
        {activeTab === 'terminal' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
              <div className="glass-card rounded-[80px] min-h-[750px] border-2 border-white/5 bg-[#020403] flex flex-col relative overflow-hidden shadow-3xl">
                 <div className="p-12 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 px-16 relative z-20">
                    <div className="flex items-center gap-10">
                       <div className="w-20 h-20 rounded-[32px] bg-indigo-600 flex items-center justify-center text-white shadow-xl relative overflow-hidden group/ico">
                          <Terminal size={40} className="group-hover:scale-110 transition-transform relative z-10" />
                          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       </div>
                       <div>
                          <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Swarm <span className="text-indigo-400">Shell</span></h3>
                          <p className="text-indigo-400/60 text-[11px] font-mono tracking-[0.6em] uppercase mt-4 italic leading-none">M2M_ORCHESTRATION_SYNC_v4.2</p>
                       </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end gap-3 px-10">
                       <div className="flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-inner">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest leading-none">CRAWLERS_SYNC_100%</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-12 md:p-16 space-y-8 font-mono text-lg text-slate-500 italic bg-black/40 relative z-10 custom-scrollbar">
                    <div className="space-y-6">
                       <p className="text-emerald-400 font-black uppercase tracking-widest">{" >> Root Swarm Initialization Sequence [OK]"}</p>
                       <p className="text-indigo-400">{" >> Ingesting current AgroLang mission shards..."}</p>
                       <p className="text-slate-800">{" >> ZK-Handshake verified for all 42 local nodes."}</p>
                       <p className="text-white">{" >> Deploying pathfinding swarms to Sector 4 geofence."}</p>
                       {packetLogs.slice(0, 15).map((pkt, i) => (
                          <div key={i} className="flex gap-10 p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group animate-in slide-in-from-left-2">
                             <span className="text-slate-800 w-24 shrink-0 font-bold">[{pkt.time}]</span>
                             <span className="text-indigo-500 w-32 shrink-0 truncate">@{pkt.src}</span>
                             <span className={`flex-1 ${pkt.risk === 'CRITICAL' ? 'text-rose-500 font-bold' : ''}`}>{pkt.act} // STATUS: {pkt.risk}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-12 border-t border-white/5 bg-black/95 relative z-20">
                    <div className="relative group max-w-6xl mx-auto">
                       <input 
                         type="text" 
                         placeholder="admin@EnvirosAgro:~$ [Input Syscall Shard]"
                         className="w-full bg-white/[0.01] border-2 border-white/10 rounded-[56px] py-10 pl-12 pr-32 text-2xl text-white focus:outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all placeholder:text-stone-900 italic font-medium shadow-inner" 
                       />
                       <button 
                         className="absolute right-6 top-1/2 -translate-y-1/2 p-8 bg-indigo-600 rounded-[40px] text-white shadow-[0_0_100px_rgba(99,102,241,0.5)] hover:bg-indigo-500 transition-all active:scale-90"
                       >
                          <Send size={40} />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Robot;
