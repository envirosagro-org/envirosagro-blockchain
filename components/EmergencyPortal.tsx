import React, { useState, useMemo } from 'react';
import { 
  Siren, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Bot, 
  Leaf, 
  Radio, 
  Activity, 
  Flame, 
  Waves, 
  Wind, 
  Bug, 
  Skull, 
  PlusCircle, 
  History, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  X, 
  Database, 
  Fingerprint, 
  ShieldCheck, 
  Lock, 
  Clock, 
  HardHat, 
  BookOpen, 
  Target, 
  Binary,
  CloudRain,
  Thermometer,
  ShieldPlus,
  Send,
  Download,
  Terminal,
  RotateCcw,
  SearchCode,
  Info,
  Search,
  FileText,
  Stamp,
  ArrowRight,
  // Added BadgeCheck to fix the "Cannot find name 'BadgeCheck'" error on line 396
  BadgeCheck
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { User, SignalShard } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';

interface EmergencyProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
}

const REGIONAL_HAZARDS = [
  { id: 'H-01', title: 'Locust Swarm Inflow', type: 'Pest', risk: 'Critical', node: 'Node_Paris_04', time: '12m ago', col: 'text-rose-500' },
  { id: 'H-02', title: 'Sudden Thermal Drift', type: 'Weather', risk: 'High', node: 'Stwd_Nairobi', time: '1h ago', col: 'text-amber-500' },
  { id: 'H-03', title: 'Water Purity Anomaly', type: 'Biological', risk: 'Medium', node: 'Global_Alpha', time: '4h ago', col: 'text-blue-500' },
];

const SAFETY_SHARDS = [
  { title: 'Bio-Hazard Handling', cat: 'Protocol', icon: Skull, col: 'text-rose-400' },
  { title: 'Drone Crash Recovery', cat: 'Technical', icon: Zap, col: 'text-blue-400' },
  { title: 'Toxin Remediation', cat: 'Scientific', icon: ShieldAlert, col: 'text-amber-500' },
  { title: 'Emergency Soil Purge', cat: 'Environmental', icon: RotateCcw, col: 'text-emerald-400' },
];

const EmergencyPortal: React.FC<EmergencyProps> = ({ user, onEarnEAC, onSpendEAC, onEmitSignal }) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'sos' | 'safety' | 'remediation'>('alerts');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [sosStep, setSosStep] = useState<'form' | 'sign' | 'success'>('form');
  const [sosType, setSosType] = useState('Pest Outbreak');
  const [sosDesc, setSosDesc] = useState('');
  const [esinSign, setEsinSign] = useState('');
  const [broadcastedIds, setBroadcastedIds] = useState<Set<string>>(new Set());
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [remediationAdvice, setRemediationAdvice] = useState<string | null>(null);
  const [threatSubject, setThreatSubject] = useState('');

  const threatRadarData = [
    { subject: 'Biological', A: 85, fullMark: 100 },
    { subject: 'Climatic', A: 72, fullMark: 100 },
    { subject: 'Technical', A: 68, fullMark: 100 },
    { subject: 'Societal', A: 40, fullMark: 100 },
    { subject: 'Yield Risk', A: 94, fullMark: 100 },
  ];

  const handleBroadcastSOS = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setSosStep('success');
      onEarnEAC(20, 'EMERGENCY_SHARD_BROADCAST');
      
      onEmitSignal({
        type: 'emergency',
        origin: 'EMERGENCY_CMD',
        title: `CRITICAL_SOS: ${sosType.toUpperCase()}`,
        message: sosDesc,
        priority: 'critical',
        actionIcon: 'Siren',
        meta: { target: 'emergency_portal', ledgerContext: 'EMERGENCY' }
      });
    }, 2500);
  };

  const handleBroadcastAlert = async (hazard: any) => {
    if (broadcastedIds.has(hazard.id)) return;
    
    await onEmitSignal({
      type: 'emergency',
      origin: 'EMERGENCY_CMD',
      title: `REGIONAL_HAZARD: ${hazard.title.toUpperCase()}`,
      message: `Anomaly detected at ${hazard.node}. Verification pending. Level: ${hazard.risk}.`,
      priority: hazard.risk === 'Critical' ? 'critical' : 'high',
      actionIcon: 'AlertTriangle',
      meta: { target: 'emergency_portal', ledgerContext: 'EMERGENCY' }
    });
    
    setBroadcastedIds(prev => new Set(prev).add(hazard.id));
  };

  const runEmergencyDiagnostic = async () => {
    if (!threatSubject.trim()) return;
    setIsAnalyzing(true);
    setRemediationAdvice(null);

    const fee = 50;
    if (!await onSpendEAC(fee, `CRISIS_REMEDIATION_AUDIT_${threatSubject.toUpperCase()}`)) {
      setIsAnalyzing(false);
      return;
    }

    try {
      const prompt = `Act as an EnvirosAgro Crisis Response Specialist. Analyze this immediate threat: "${threatSubject}". 
      Assess the impact on regional m-constant stability and C(a) constant. 
      Provide a technical 4st-stage remediation shard including containment, neutralisation, and registry reporting.`;
      const response = await chatWithAgroLang(prompt, []);
      setRemediationAdvice(response.text);
    } catch (e) {
      setRemediationAdvice("Oracle Handshake Interrupted: Threat depth exceeded initial buffer.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      <div className="glass-card p-12 rounded-[56px] border-rose-500/20 bg-rose-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
            <Siren className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-rose-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0">
            <Siren className="w-20 h-20 text-white animate-pulse" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-rose-500/20 shadow-inner">EMERGENCY_NODE_v5.0</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 m-0 leading-none drop-shadow-2xl">Crisis <span className="text-rose-500">Command</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl italic leading-relaxed">
               "Securing the registry against catastrophic agricultural anomalies. Broadcast SOS signals and synthesize remediation shards in real-time."
            </p>
         </div>
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'alerts', label: 'Hazard Feed', icon: Radio },
          { id: 'sos', label: 'Signal Broadcast', icon: Siren },
          { id: 'remediation', label: 'Remediation Oracle', icon: Bot },
          { id: 'safety', label: 'Safety Vault', icon: ShieldCheck },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-rose-600 text-white shadow-xl shadow-rose-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {activeTab === 'alerts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-500">
             <div className="lg:col-span-8 space-y-10">
                <div className="flex items-center justify-between px-4 border-b border-white/5 pb-6">
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Live <span className="text-rose-500">Hazard Registry</span></h3>
                   <span className="px-4 py-1.5 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase rounded-full border border-rose-500/20">4 Active Signals</span>
                </div>
                <div className="grid gap-6">
                   {REGIONAL_HAZARDS.map(h => (
                     <div key={h.id} className="p-10 glass-card rounded-[48px] border-2 border-white/5 hover:border-rose-500/30 transition-all group flex flex-col md:flex-row items-center justify-between shadow-3xl bg-black/40 text-white">
                        <div className="flex items-center gap-8 flex-1">
                           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-all">
                              <AlertTriangle className={`w-8 h-8 ${h.col}`} />
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-2xl font-black text-white uppercase italic leading-none">{h.title}</h4>
                              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">ID: {h.id} // ORIGIN: {h.node}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-10 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10">
                           <div className="text-center md:text-right">
                              <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Impact Level</p>
                              <span className={`text-xl font-mono font-black ${h.col}`}>{h.risk.toUpperCase()}</span>
                           </div>
                           <button 
                             onClick={() => handleBroadcastAlert(h)}
                             disabled={broadcastedIds.has(h.id)}
                             className={`px-8 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${broadcastedIds.has(h.id) ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                           >
                             {broadcastedIds.has(h.id) ? 'BROADCASTED' : 'BROADCAST TO MESH'}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col items-center justify-center shadow-xl min-h-[500px] text-white">
                   <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-10">Regional Threat Density</h4>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={threatRadarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} fontStyle="italic" />
                            <Radar name="Threat" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="pt-10 border-t border-white/5 w-full mt-10">
                      <div className="flex items-center gap-4 text-rose-500 font-black text-[10px] uppercase justify-center italic">
                         <Activity size={14} className="animate-pulse" /> Live Monitoring Cluster active
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'sos' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="p-16 glass-card rounded-[64px] border-rose-500/20 bg-black/60 shadow-3xl text-center space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><AlertTriangle size={500} className="text-rose-500" /></div>
                {sosStep === 'form' && (
                  <div className="space-y-10 relative z-10 animate-in slide-in-from-right-4">
                     <div className="w-24 h-24 bg-rose-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl animate-float">
                        <Siren size={48} />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Initialize <span className="text-rose-500">SOS Shard</span></h3>
                        <p className="text-slate-400 text-xl font-medium italic max-w-xl mx-auto italic">Broadcast a critical threat signal to all nodes in your regional cluster.</p>
                     </div>
                     <div className="space-y-8 max-w-xl mx-auto">
                        <div className="space-y-2 text-left">
                           <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Threat Category</label>
                           <select value={sosType} onChange={e => setSosType(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-8 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-rose-500/10 transition-all uppercase text-sm">
                              <option>Pest Outbreak</option>
                              <option>Industrial Hardware Failure</option>
                              <option>Biological Pathogen (Soil/Water)</option>
                              <option>Extreme Weather Damage</option>
                              <option>SID Contamination Signal</option>
                           </select>
                        </div>
                        <div className="space-y-2 text-left">
                           <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Threat Description</label>
                           <textarea 
                             value={sosDesc}
                             onChange={e => setSosDesc(e.target.value)}
                             placeholder="Provide precise biological or technical details..."
                             className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-lg font-medium italic focus:ring-4 focus:ring-rose-500/10 outline-none transition-all h-40 resize-none placeholder:text-stone-900 shadow-inner"
                           />
                        </div>
                        <button 
                          onClick={() => setSosStep('sign')}
                          disabled={!sosDesc.trim()}
                          className="w-full py-8 bg-rose-600 hover:bg-rose-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl transition-all disabled:opacity-30"
                        >
                           PROCEED TO SIGNATURE <ArrowRight className="w-5 h-5 ml-4" />
                        </button>
                     </div>
                  </div>
                )}

                {sosStep === 'sign' && (
                  <div className="space-y-12 relative z-10 animate-in slide-in-from-right-10 flex flex-col justify-center flex-1">
                     <div className="text-center space-y-8">
                        <div className="w-32 h-32 bg-rose-600/10 border-2 border-rose-500/20 rounded-[44px] flex items-center justify-center mx-auto text-rose-500 shadow-3xl group relative overflow-hidden">
                           <div className="absolute inset-0 bg-rose-500/5 animate-pulse"></div>
                           <Fingerprint size={48} className="relative z-10 group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Node <span className="text-rose-500">Signature</span></h4>
                     </div>
                     <div className="space-y-4 max-w-xl mx-auto w-full">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] block text-center">Auth Signature (ESIN)</label>
                        <input 
                           type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                           placeholder="EA-XXXX-XXXX-XXXX" 
                           className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white outline-none focus:ring-8 focus:ring-rose-500/10 transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                        />
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => setSosStep('form')} className="flex-1 py-10 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Back</button>
                        <button 
                          onClick={handleBroadcastSOS}
                          disabled={isBroadcasting || !esinSign}
                          className="flex-[2] py-10 bg-rose-600 hover:bg-rose-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(225,29,72,0.3)] flex items-center justify-center gap-8 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                        >
                           {isBroadcasting ? <Loader2 className="w-10 h-10 animate-spin" /> : <Stamp size={28} className="fill-current" />}
                           {isBroadcasting ? "BROADCASTING..." : "AUTHORIZE SOS"}
                        </button>
                     </div>
                  </div>
                )}

                {sosStep === 'success' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 animate-in zoom-in duration-1000 text-center relative z-10">
                     <div className="w-64 h-64 bg-rose-600 rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_200px_rgba(225,29,72,0.5)] scale-110 relative group">
                        <CheckCircle2 size={120} className="group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-[-15px] rounded-full border-4 border-rose-500/20 animate-ping opacity-30"></div>
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                     </div>
                     <div className="space-y-6 text-center">
                        <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">SOS <span className="text-rose-500">Transmitted.</span></h3>
                        <p className="text-rose-500 text-sm font-black uppercase tracking-[1em] font-mono mt-6">EMERGENCY_HASH_0x{(Math.random()*1000).toFixed(0)}_FINAL</p>
                     </div>
                     <button onClick={() => { setSosStep('form'); setSosDesc(''); setEsinSign(''); }} className="px-24 py-8 bg-white/5 border border-white/10 rounded-full text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command</button>
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'remediation' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-700">
             <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden shadow-3xl text-center space-y-12 group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Leaf size={800} className="text-indigo-400" /></div>
                
                <div className="relative z-10 space-y-10">
                   <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 animate-float">
                      <Bot size={64} className="text-white animate-pulse" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter m-0 leading-none italic">REMEDIATION <span className="text-indigo-400">ORACLE</span></h3>
                      <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed">
                         "Synthesizing high-fidelity remediation shards for catastrophic node anomalies."
                      </p>
                   </div>

                   {!remediationAdvice && !isAnalyzing ? (
                     <div className="space-y-10 py-10 max-w-xl mx-auto">
                        <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 shadow-inner group/form">
                           <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block text-center italic mb-6">THREAT_NARRATIVE_INGEST</label>
                           <textarea 
                             value={threatSubject} onChange={e => setThreatSubject(e.target.value)}
                             placeholder="Input biological or technical threat data..." 
                             className="w-full bg-transparent border-none text-center text-xl italic font-medium text-white outline-none focus:ring-0 placeholder:text-stone-950 transition-all h-32 resize-none" 
                           />
                        </div>
                        <button 
                          onClick={runEmergencyDiagnostic}
                          disabled={!threatSubject.trim()}
                          className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[20px] ring-white/5 disabled:opacity-20"
                        >
                           <Zap size={32} className="fill-current mr-4" /> BEGIN DIAGNOSTIC
                        </button>
                     </div>
                   ) : isAnalyzing ? (
                     <div className="flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                        <div className="relative">
                           <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Fingerprint size={48} className="text-indigo-400 animate-pulse" />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">AUDITING_THREAT_VECTORS...</p>
                           <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">INGESTING_EMERGENCY_PARAMETERS // SEQUENCING_REMEDIATION</p>
                        </div>
                     </div>
                   ) : (
                     <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12">
                        <div className="p-12 md:p-20 bg-black/80 rounded-[80px] border-2 border-indigo-500/20 shadow-3xl border-l-[24px] border-l-indigo-600 text-left relative overflow-hidden group/advice">
                           <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform duration-[15s]"><Leaf size={800} className="text-indigo-400" /></div>
                           <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                              <div className="flex items-center gap-8">
                                 <BadgeCheck size={48} className="text-indigo-400" />
                                 <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Remediation Verdict</h4>
                              </div>
                              <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                                 <span className="text-[11px] font-mono font-black text-indigo-400 uppercase tracking-widest italic">EMERGENCY_0xSYNC_OK</span>
                              </div>
                           </div>
                           <div className="prose prose-invert max-w-none text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium relative z-10 pl-10 border-l-2 border-white/10">
                              {remediationAdvice}
                           </div>
                           <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                              <div className="flex items-center gap-8">
                                 <Fingerprint size={48} className="text-indigo-400" />
                                 <div className="text-left">
                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Remediation Shard ID</p>
                                    <p className="text-xl font-mono text-white">0xHS_EM_FIX_#{(Math.random()*1000).toFixed(0)}</p>
                                 </div>
                              </div>
                              <button onClick={() => setRemediationAdvice(null)} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10">ANCHOR TO LEDGER</button>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'safety' && (
           <div className="space-y-12 animate-in zoom-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {SAFETY_SHARDS.map((shard, i) => (
                    <div key={i} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col justify-between h-[450px] shadow-3xl relative overflow-hidden active:scale-[0.99]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Database size={300} /></div>
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${shard.col} shadow-2xl group-hover:rotate-6 transition-all`}>
                             <shard.icon size={40} />
                          </div>
                          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-widest italic">{shard.cat}</span>
                       </div>
                       <div className="space-y-4 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-emerald-400 transition-colors drop-shadow-2xl">{shard.title}</h4>
                          <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">VERSION_v6.5</p>
                       </div>
                       <div className="pt-10 border-t border-white/5 relative z-10 mt-auto">
                          <button className="w-full py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl">DOWNLOAD_PROTOCOL</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.9); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244, 63, 94, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

/* Fix: Adding default export for EmergencyPortal */
export default EmergencyPortal;