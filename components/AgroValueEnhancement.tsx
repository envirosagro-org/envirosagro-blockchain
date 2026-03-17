
import React, { useState, useMemo, useEffect } from 'react';
import { 
  FlaskConical, Binary, TrendingUp, Zap, Loader2, ChevronRight, Info, Database, 
  CheckCircle2, Bot, Activity, Workflow, Cpu, Stamp, Fingerprint, ShieldCheck, 
  Dna, Target, Terminal, Download, FileCode, BadgeCheck, ZapOff,
  BoxSelect, Wind, Droplets, Leaf, Scale, SmartphoneNfc, Factory, ArrowRight,
  ShieldPlus, Key, Boxes, ChevronDown, CheckCircle, AlertTriangle, ShieldAlert,
  // Added missing ClipboardList icon
  ClipboardList
} from 'lucide-react';
import { User, ValueBlueprint, AgroResource, AssetGuarantee, ValueProcessStep } from '../types';
import { generateValueBlueprint, activateLiveSequence } from '../services/agroLangService';

interface AgroValueEnhancementProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: any) => void;
  initialSection?: string | null;
  blueprints?: ValueBlueprint[];
  onSaveBlueprint?: (blueprint: ValueBlueprint) => void;
}

const AgroValueEnhancement: React.FC<AgroValueEnhancementProps> = ({ 
  user, onSpendEAC, onEarnEAC, onNavigate, initialSection, blueprints = [], onSaveBlueprint 
}) => {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'optimization'>('synthesis');
  
  // Synthesis Input States
  const [material, setMaterial] = useState('');
  const [volume, setVolume] = useState('5');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  // State Machine: Blueprint Persistence
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(null);

  // Activation Workflow States
  const [isStaking, setIsStaking] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [esinSign, setEsinSign] = useState('');
  const [activationStatus, setActivationStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

  const selectedBlueprint = useMemo(() => 
    blueprints.find(b => b.blueprint_id === selectedBlueprintId),
    [blueprints, selectedBlueprintId]
  );

  const availableResources = useMemo(() => 
    (user.resources || []).filter(r => r.status === 'VERIFIED'),
    [user.resources]
  );

  const handleGenerate = async () => {
    if (!material || !volume) return;
    const COST = 30;
    if (!await onSpendEAC(COST, `BLUEPRINT_SYNTHESIS_${material.toUpperCase()}`)) return;

    setIsSynthesizing(true);
    try {
      const res = await generateValueBlueprint(material, Number(volume));
      if (res.json) {
        const newBlueprint: ValueBlueprint = {
          ...res.json,
          status: 'READY_FOR_ASSETS',
          value_process_steps: res.json.value_process_steps.map((s: any) => ({ ...s, status: 'PENDING' }))
        };
        if (onSaveBlueprint) onSaveBlueprint(newBlueprint);
        setSelectedBlueprintId(newBlueprint.blueprint_id);
        onEarnEAC(10, 'ARCHITECTURAL_DATA_MINT');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const toggleAsset = (id: string) => {
    const next = new Set(selectedAssets);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAssets(next);
  };

  const handleGoLive = async () => {
    if (!selectedBlueprint || selectedAssets.size === 0) return;
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    setActivationStatus('PROCESSING');
    try {
      // Fixed: Explicitly typed id in map to string to fix 'unknown' type error on line 92
      const guarantees: AssetGuarantee[] = Array.from(selectedAssets).map((id: string) => {
        const res = user.resources?.find(r => r.id === id);
        return {
          asset_id: id,
          asset_type: (res?.category === 'LAND' ? 'LAND_DEED' : 'MACHINERY_IOT') as AssetGuarantee['asset_type'],
          verification_status: true
        };
      });

      const res = await activateLiveSequence(selectedBlueprint.blueprint_id, guarantees);
      
      // Simulate physical anchor delay
      await new Promise(r => setTimeout(r, 3000));
      
      if (onSaveBlueprint) {
        onSaveBlueprint({ 
          ...selectedBlueprint, 
          status: 'LIVE', 
          guarantees, 
          value_process_steps: selectedBlueprint.value_process_steps.map((s, i) => ({ ...s, status: i === 0 ? 'ACTIVE' : 'PENDING' })) 
        });
      }
      
      setActivationStatus('SUCCESS');
      onEarnEAC(50, 'LIVE_SEQUENCE_INGESTED');
    } catch (e) {
      setActivationStatus('IDLE');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. STATE-DRIVEN HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-2 transition-all duration-700 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl ${
          selectedBlueprint?.status === 'LIVE' ? 'border-emerald-500/40 bg-emerald-500/[0.03]' : 
          selectedBlueprint?.status === 'READY_FOR_ASSETS' ? 'border-blue-500/40 bg-blue-500/[0.03]' : 
          'border-white/10 bg-black/40'
        }`}>
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <FlaskConical size={600} className="text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className={`w-40 h-40 rounded-[48px] shadow-3xl flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-700 ${
                selectedBlueprint?.status === 'LIVE' ? 'bg-emerald-600' : 
                selectedBlueprint?.status === 'READY_FOR_ASSETS' ? 'bg-blue-600' : 
                'bg-slate-700'
              }`}>
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 {selectedBlueprint?.status === 'LIVE' ? <Zap size={80} className="text-white animate-pulse" /> : <FlaskConical size={80} className="text-white animate-float" />}
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                    <span className="px-4 py-1.5 bg-black/40 text-slate-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-white/10 shadow-inner italic">VALUE_FORGE_v6.5</span>
                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border shadow-inner italic ${
                      selectedBlueprint?.status === 'LIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      selectedBlueprint?.status === 'READY_FOR_ASSETS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      'bg-white/5 text-slate-500 border-white/5'
                    }`}>
                      STATUS: {selectedBlueprint?.status || 'IDLE'}
                    </span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">
                   Value <span className={selectedBlueprint?.status === 'LIVE' ? 'text-emerald-400' : 'text-blue-400'}>Enhancement.</span>
                 </h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Transitioning biological blueprints into live industrial sequences. Pledging verified assets to lock value sharding finality."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">VALUE_DELTA</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">
                {selectedBlueprint ? `+${selectedBlueprint.projected_value_delta}` : '0'}
                <span className="text-3xl text-emerald-500 font-sans italic ml-1">%</span>
              </h4>
              <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div> TARGET_YIELD_LOCK
              </div>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Process Finality</span>
                 <span className="text-blue-400 font-mono">
                   {selectedBlueprint?.status === 'LIVE' ? 'ACTIVE' : 'DRAFT'}
                 </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className={`h-full rounded-full transition-all duration-[2s] ${selectedBlueprint?.status === 'LIVE' ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: selectedBlueprint?.status === 'LIVE' ? '100%' : '15%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[850px] relative z-10">
        
        {/* SIDEBAR: INPUT & BLUEPRINTS */}
        <div className="lg:col-span-4 space-y-8">
           {/* Ingest Form */}
           <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-3xl">
              <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                 <div className="p-4 bg-indigo-600 rounded-3xl border border-indigo-500/20 shadow-xl">
                    <Database size={28} className="text-white" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Asset <span className="text-indigo-400">Synthesis</span></h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">MODE: ARCHITECT</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <button 
                   onClick={() => onNavigate('multimedia_generator')}
                   className="w-full py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl"
                 >
                    <Leaf size={16} /> MULTIMEDIA_FORGE
                 </button>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Raw Material</label>
                    <input 
                      type="text" value={material} onChange={e => setMaterial(e.target.value)}
                      placeholder="e.g. 5 tons of Maize"
                      className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-xl font-bold text-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-stone-900 shadow-inner" 
                    />
                 </div>
                 <button 
                  onClick={handleGenerate}
                  disabled={isSynthesizing || !material}
                  className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30 border-4 border-white/10 ring-[16px] ring-white/5"
                 >
                    {isSynthesizing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Binary size={32} />}
                    {isSynthesizing ? 'Designing...' : 'FORGE BLUEPRINT'}
                 </button>
              </div>
           </div>

           {/* Blueprint List */}
           <div className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/20 space-y-6 shadow-xl">
              {/* Fixed: Now correctly uses ClipboardList which is imported from lucide-react */}
              <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-4 flex items-center gap-4">
                 <ClipboardList size={14} className="text-blue-400" /> Shard Archive
              </h4>
              <div className="space-y-3">
                 {blueprints.length === 0 ? (
                    <div className="py-20 text-center opacity-10 italic text-xs uppercase tracking-widest">Shard Buffer Clear</div>
                 ) : blueprints.map(b => (
                    <button 
                      key={b.blueprint_id}
                      onClick={() => setSelectedBlueprintId(b.blueprint_id)}
                      className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${selectedBlueprintId === b.blueprint_id ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-xl scale-105' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}
                    >
                       <div className="space-y-1">
                          <p className="text-sm font-black uppercase tracking-tight italic">{b.input_material.name}</p>
                          <p className="text-[9px] font-mono opacity-50 uppercase">{b.blueprint_id} // {b.status}</p>
                       </div>
                       <ChevronRight className={`w-5 h-5 transition-transform duration-500 ${selectedBlueprintId === b.blueprint_id ? 'rotate-90 text-indigo-400' : 'text-slate-800'}`} />
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* MAIN DISPLAY: WORKFLOW SHARD */}
        <div className="lg:col-span-8 space-y-10">
           {!selectedBlueprint ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-10 group/idle">
                 <div className="relative">
                    <Boxes size={180} className="text-slate-500 group-hover:text-indigo-400 transition-colors duration-1000" />
                    <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-6xl font-black uppercase tracking-[0.5em] text-white italic">SHARD_STANDBY</p>
                    <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Initialize a blueprint to begin value sharding</p>
                 </div>
              </div>
           ) : (
              <div className="space-y-10 animate-in slide-in-from-right-10 duration-700">
                 
                 {/* BLUEPRINT HUD */}
                 <div className={`p-12 glass-card rounded-[72px] border-2 bg-black/60 relative overflow-hidden shadow-3xl ${selectedBlueprint.status === 'LIVE' ? 'border-emerald-500/20' : 'border-blue-500/20'}`}>
                    <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none overflow-hidden">
                       <div className="w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent absolute top-0 animate-scan"></div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative z-10 px-4 gap-10">
                       <div className="flex items-center gap-10">
                          <div className={`p-6 rounded-[32px] shadow-2xl group-hover:rotate-6 transition-all border-2 border-white/10 ${selectedBlueprint.status === 'LIVE' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                             <Bot size={44} className="text-white animate-pulse" />
                          </div>
                          <div>
                             <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                                Blueprint <span className={selectedBlueprint.status === 'LIVE' ? 'text-emerald-400' : 'text-blue-400'}>#SHARD-{selectedBlueprint.blueprint_id.slice(0,4)}</span>
                             </h3>
                             <p className="text-slate-500 text-[10px] font-mono tracking-[0.6em] uppercase mt-4 italic">EOS_ARCHITECT_HANDSHAKE_v6</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest shadow-inner ${
                             selectedBlueprint.status === 'LIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {selectedBlueprint.status}
                          </span>
                       </div>
                    </div>

                    {/* PROCESS STEPS TIMELINE */}
                    <div className="space-y-10 relative z-10">
                       <div className="flex justify-between items-center px-10 relative">
                          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-white/5 -translate-y-1/2"></div>
                          {selectedBlueprint.value_process_steps.map((step, i) => (
                             <div key={i} className="relative z-10 flex flex-col items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${
                                  step.status === 'ACTIVE' ? 'bg-emerald-600 border-white text-white shadow-2xl scale-125' : 
                                  step.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 
                                  'bg-black border-white/5 text-slate-700'
                                }`}>
                                   <p className="text-xl font-mono font-black">{step.step_order}</p>
                                </div>
                                <div className="text-center w-24">
                                   <p className={`text-[9px] font-black uppercase tracking-tight ${step.status === 'ACTIVE' ? 'text-white' : 'text-slate-600'}`}>{step.operation}</p>
                                   <p className="text-[7px] font-mono text-slate-800 mt-1">{step.duration_hours}H EST</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* ASSET REQUIREMENTS & STAKING */}
                    {selectedBlueprint.status === 'READY_FOR_ASSETS' && (
                       <div className="mt-20 space-y-12 animate-in zoom-in duration-700 relative z-10 pt-16 border-t border-white/5">
                          <div className="flex flex-col md:flex-row gap-12">
                             {/* Requirement List */}
                             <div className="flex-1 space-y-6">
                                <h5 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                                   <ShieldAlert size={18} className="text-blue-400" /> Physical Requirements
                                </h5>
                                <div className="grid gap-3">
                                   {selectedBlueprint.asset_requirements.map((req, i) => (
                                      <div key={i} className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all">
                                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:animate-ping"></div>
                                         <span className="text-xs font-medium text-slate-400 italic">"{req}"</span>
                                      </div>
                                   ))}
                                </div>
                             </div>

                             {/* Staking/Pledging Area */}
                             <div className="flex-1 space-y-6">
                                <h5 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                                   <Key size={18} className="text-emerald-400" /> Registry Pledging
                                </h5>
                                <div className="p-8 bg-black/80 rounded-[48px] border-2 border-indigo-500/20 space-y-8 shadow-inner">
                                   <div className="space-y-4">
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest px-4">Registered Shards for Handshake</p>
                                      <div className="grid grid-cols-2 gap-3">
                                         {availableResources.length === 0 ? (
                                           <div className="col-span-2 py-10 text-center opacity-30 text-[9px] uppercase italic">No verified nodes found.</div>
                                         ) : availableResources.map(res => (
                                            <button 
                                              key={res.id}
                                              onClick={() => toggleAsset(res.id)}
                                              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group/asset ${
                                                selectedAssets.has(res.id) ? 'bg-emerald-600/10 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-slate-600 hover:border-white/10'
                                              }`}
                                            >
                                               <SmartphoneNfc size={20} className={selectedAssets.has(res.id) ? 'text-emerald-400' : 'text-slate-800'} />
                                               <span className="text-[8px] font-black uppercase truncate w-full">{res.name}</span>
                                            </button>
                                         ))}
                                      </div>
                                   </div>

                                   {selectedAssets.size > 0 && (
                                     <div className="space-y-6 pt-4 border-t border-white/5 animate-in slide-in-from-bottom-4">
                                        <div className="space-y-3">
                                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center italic">NODE_SIGNATURE (ESIN)</label>
                                           <input 
                                              type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                                              placeholder="EA-XXXX-XXXX"
                                              className="w-full bg-black border border-white/10 rounded-full py-5 text-center text-4xl font-mono text-white outline-none focus:ring-8 focus:ring-emerald-500/5 uppercase placeholder:text-stone-900 transition-all shadow-inner" 
                                           />
                                        </div>
                                        <button 
                                          onClick={handleGoLive}
                                          disabled={activationStatus === 'PROCESSING' || !esinSign}
                                          className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_120px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-20"
                                        >
                                           {activationStatus === 'PROCESSING' ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                                           {activationStatus === 'PROCESSING' ? 'ANCHORING SHARDS...' : 'COMMENCE LIVE INGEST'}
                                        </button>
                                     </div>
                                   )}
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {/* LIVE VIEW HUD */}
                    {selectedBlueprint.status === 'LIVE' && (
                       <div className="mt-20 space-y-12 animate-in slide-in-from-bottom-10 duration-1000 relative z-10 pt-16 border-t border-white/5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <div className="p-10 bg-black/90 rounded-[56px] border border-emerald-500/20 shadow-3xl text-center space-y-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/[0.01] animate-pulse pointer-events-none"></div>
                                <Activity size={32} className="text-emerald-400 mx-auto animate-pulse" />
                                <div className="space-y-1">
                                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">m-Constant Active</p>
                                   <p className="text-5xl font-mono font-black text-white">{selectedBlueprint.guarantees?.[0] ? '1.84' : '1.42'}<span className="text-xl text-emerald-500 ml-1">μ</span></p>
                                </div>
                             </div>
                             <div className="md:col-span-2 p-10 bg-black/90 rounded-[56px] border border-blue-500/20 shadow-3xl flex items-center justify-between px-16 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none"></div>
                                <div className="text-left space-y-3 relative z-10">
                                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Sequence Phase</p>
                                   <h5 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                                      {selectedBlueprint.value_process_steps.find(s => s.status === 'ACTIVE')?.operation || 'SYNCING...'}
                                   </h5>
                                   <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                      Live Telemetry Handshake Established
                                   </div>
                                </div>
                                <div className="w-32 h-32 rounded-3xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-float relative z-10">
                                   <Factory size={48} />
                                </div>
                             </div>
                          </div>
                          <div className="flex justify-center pt-8">
                             <button className="px-16 py-7 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-[11px] uppercase tracking-[0.4em] hover:text-white transition-all shadow-xl active:scale-95">
                                DOWNLOAD AUDIT ARCHIVE (PDF)
                             </button>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AgroValueEnhancement;
