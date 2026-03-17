import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Landmark, Briefcase, ShieldCheck, ChevronRight, Loader2, CheckCircle2, X, 
  Coins, Zap, PlusCircle, Search, Globe, Clock, Activity, MapPin, Users2, 
  Database, Lock, AlertTriangle, HardHat, Handshake, FileSignature, Key, 
  FileSearch, FileCheck, ShieldAlert, ArrowRight, TrendingUp, History, 
  CheckCircle, AlertCircle, FileDigit, Fingerprint, ArrowLeftCircle, 
  Target, BarChart4, LayoutGrid, Bot, Leaf, ClipboardCheck, Building2, 
  Users, TreePine, ShieldPlus, Info, Stamp, Network, Plus, Heart, 
  Factory, Target as TargetIcon, Truck, Monitor, Radio, Gavel, Scale, 
  Waves, Layout, Star, ChevronDown, Sprout, ArrowUpRight, MessageSquare, 
  Send, Cpu, SmartphoneNfc, Edit2, BrainCircuit, FlaskConical, Upload, 
  Cable, Settings, LineChart, Video, BadgeCheck, Smartphone, Wifi, Link2, Boxes,
  ClipboardList, ArrowDownCircle, CheckCircle as CheckCircleIcon,
  TableProperties, SearchCode, Workflow, Layers, Wrench
} from 'lucide-react';
import { User, FarmingContract, ContractApplication, ViewState, AgroResource, MissionCategory, MissionMilestone, ValueBlueprint, Task, RegisteredUnit, LiveAgroProduct } from '../types';
import { analyzeBidHandshake, AgroLangResponse } from '../services/agroLangService';
import AssetAssociationTool from './AssetAssociationTool';

interface ContractFarmingProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState, action?: string | null) => void;
  contracts: FarmingContract[];
  setContracts: React.Dispatch<React.SetStateAction<FarmingContract[]>>;
  onSaveContract: (contract: FarmingContract) => void;
  blueprints: ValueBlueprint[];
  onSaveTask: (task: Partial<Task>) => void;
  industrialUnits: RegisteredUnit[];
  liveProducts?: LiveAgroProduct[];
  onSaveProduct?: (product: LiveAgroProduct) => void;
}

import { useAppStore } from '../store';

const CATEGORY_META: Record<MissionCategory, { label: string, icon: any, color: string, bg: string }> = {
  FUND_ACQUISITION: { label: 'Fund Acquisition', icon: Landmark, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  INVESTMENT: { label: 'Investment', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  CHARITY: { label: 'Charity', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  LIVE_FARMING: { label: 'Live Farming', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  INDUSTRIAL_LOGISTICS: { label: 'Industrial/Logistics', icon: Factory, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
};

const ContractFarming: React.FC<ContractFarmingProps> = ({ user, onSpendEAC, onNavigate, contracts, setContracts, onSaveContract, blueprints, onSaveTask, industrialUnits, liveProducts = [], onSaveProduct }) => {
  const { missionRegistrationState, setMissionRegistrationState } = useAppStore();
  const [activeTab, setActiveTab] = useState<'manifest' | 'terminal' | 'archive'>('manifest');
  const [activeMission, setActiveMission] = useState<FarmingContract | null>(null);
  const [isLinkingResource, setIsLinkingResource] = useState<string | null>(null);
  const [isSourcing, setIsSourcing] = useState(false);

  // New Task Form
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'Standard', thrust: 'Industry' });

  const isSuccessRef = useRef(false);
  const taskRef = useRef(newTask);

  // Update ref whenever state changes
  useEffect(() => {
    taskRef.current = newTask;
  }, [newTask]);

  // Sync local state with missionRegistrationState
  useEffect(() => {
    if (showTaskModal && missionRegistrationState) {
      if (missionRegistrationState.title) setNewTask(prev => ({ ...prev, title: missionRegistrationState.title }));
      if (missionRegistrationState.priority) setNewTask(prev => ({ ...prev, priority: missionRegistrationState.priority }));
      if (missionRegistrationState.thrust) setNewTask(prev => ({ ...prev, thrust: missionRegistrationState.thrust }));
    }
  }, [showTaskModal]);

  // Save progress on unmount or modal close
  useEffect(() => {
    return () => {
      if (showTaskModal && !isSuccessRef.current) {
        setMissionRegistrationState(taskRef.current);
      }
    };
  }, [showTaskModal, setMissionRegistrationState]);

  const handleStartTaskRegistration = () => {
    isSuccessRef.current = false;
    if (missionRegistrationState) {
      setShowResumePrompt(true);
    } else {
      setShowTaskModal(true);
    }
  };

  // Shard Linker State
  const [showShardLinker, setShowShardLinker] = useState(false);
  const [linkerContext, setLinkerContext] = useState<{label: string, icon: any, target: string, sourceLedger: string} | null>(null);

  const myMissions = useMemo(() => contracts.filter(c => c.investorEsin === user.esin || c.status === 'In_Progress'), [contracts, user.esin]);

  const handleLinkResource = (resId: string, name: string, type?: string) => {
    if (!activeMission) return;
    
    if (type === 'PROGRAMS' || type === 'LIVE_FARMING') {
      const updated = {
        ...activeMission,
        associatedPrograms: [...(activeMission.associatedPrograms || []), resId]
      };
      onSaveContract(updated);

      if (type === 'LIVE_FARMING' && onSaveProduct) {
        const productToUpdate = liveProducts.find(p => p.id === resId);
        if (productToUpdate) {
          onSaveProduct({
            ...productToUpdate,
            associatedMissions: [...(productToUpdate.associatedMissions || []), activeMission.id],
            progress: Math.min(100, productToUpdate.progress + 15)
          });
        }
      }
    }
    
    notify({ 
      title: 'METADATA_ANCHORED', 
      message: `${name} linked to ${activeMission.id} registry shard for ${linkerContext?.label || 'mission'}.`, 
      type: 'success',
      actionIcon: 'Link2'
    });
    
    // Auto-Task registration on successful sharding
    onSaveTask({
      id: `TSK-MISSION-${Date.now()}`,
      title: `Confirm Mission Association: ${name}`,
      priority: 'High',
      thrust: 'Industry',
      status: 'Processing',
      timestamp: new Date().toISOString(),
      stewardEsin: user.esin,
      assetId: activeMission.id,
      description: type === 'PROGRAMS' || type === 'LIVE_FARMING'
        ? `Standardize asset under ${name} program protocols. Categorize inventory and evaluate under program guidelines.`
        : `Verify mission-critical handshake with sourced ledger item ${resId}.`
    });

    setShowShardLinker(false);
  };

  const handleTriggerTool = (tool: any) => {
    if (!activeMission) return;
    setLinkerContext(tool);
    setShowShardLinker(true);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !activeMission) return;
    
    const task: Partial<Task> = {
      id: `TSK-${Date.now()}`,
      title: newTask.title,
      priority: newTask.priority,
      thrust: newTask.thrust,
      status: 'Inception',
      timestamp: new Date().toISOString(),
      stewardEsin: user.esin,
      assetId: activeMission.id
    };

    onSaveTask(task);
    isSuccessRef.current = true;
    setMissionRegistrationState(null);
    setShowTaskModal(false);
    setNewTask({ title: '', priority: 'Standard', thrust: 'Industry' });
    notify({ title: 'TASK_REGISTERED', message: `Mission shard ${task.id} added to Kanban.`, type: 'success' });
  };

  const handleSourceBlueprint = async (bp: ValueBlueprint) => {
    if (!activeMission) return;
    setIsSourcing(true);
    
    for (const step of bp.value_process_steps) {
      const task: Partial<Task> = {
        id: `TSK-${Date.now()}-${step.step_order}`,
        title: step.operation,
        priority: 'High',
        thrust: 'Industry',
        status: 'Inception',
        timestamp: new Date().toISOString(),
        stewardEsin: user.esin,
        assetId: activeMission.id,
        blueprintId: bp.blueprint_id,
        description: `Source from Blueprint: ${bp.blueprint_id}. Est Duration: ${step.duration_hours}h`
      };
      onSaveTask(task);
      await new Promise(r => setTimeout(r, 200));
    }
    
    setIsSourcing(false);
    notify({ title: 'PROCESS_INGESTED', message: `${bp.value_process_steps.length} tasks sharded to Kanban.`, type: 'success' });
  };

  const notify = (data: any) => {
    console.log("NOTIFY:", data);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Mission HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <div className="lg:col-span-12 glass-card p-12 md:p-16 rounded-[80px] border-indigo-500/20 bg-indigo-950/10 relative overflow-hidden flex flex-col md:flex-row items-center w-full shadow-4xl group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:rotate-6 transition-transform duration-[20s] pointer-events-none">
              <Network size={800} className="text-white" />
           </div>
           
           <div className="relative mb-10 md:mb-0 md:mr-10">
              <div className="w-48 h-48 rounded-[56px] bg-white shadow-[0_0_120px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-all">
                 <div className="w-24 h-24 bg-indigo-600 rounded-[12px] flex flex-col gap-1 p-2">
                    <div className="flex gap-1 flex-1"><div className="flex-1 bg-white/20 rounded-[4px]"></div><div className="flex-1 bg-white/20 rounded-[4px]"></div></div>
                    <div className="flex gap-1 flex-1"><div className="flex-1 bg-white/20 rounded-[4px]"></div><div className="flex-1 bg-white/20 rounded-[4px]"></div></div>
                 </div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="px-6 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 shadow-inner italic tracking-widest">MISSION_REGISTRY_LIVE</span>
                 </div>
                 <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic m-0 leading-none drop-shadow-2xl">Contract <span className="text-indigo-400">Farming.</span></h2>
              </div>
              <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed max-w-4xl mx-auto opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating institutional missions. Synchronizing capital shards with biological production sequences to ensure 100% industrial finality."
              </p>
           </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'manifest', label: 'Mission Manifest', icon: LayoutGrid },
          { id: 'terminal', label: 'Management Terminal', icon: Monitor },
          { id: 'archive', label: 'Resolution Archive', icon: History },
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

      <div className="min-h-[850px] relative z-10">
        {activeTab === 'terminal' && (
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              <div className="xl:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Live <span className="text-indigo-400">Missions</span></h4>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                       {myMissions.map(m => (
                         <button 
                           key={m.id}
                           onClick={() => setActiveMission(m)}
                           className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${activeMission?.id === m.id ? 'bg-indigo-600 border-white text-white shadow-xl scale-105' : 'bg-white/[0.01] border-white/5 text-slate-600 hover:border-white/20'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${activeMission?.id === m.id ? 'text-white' : 'text-blue-400'}`}>
                                  <Activity size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-black uppercase italic leading-none">{m.productType}</p>
                                  <p className="text-[9px] font-mono opacity-50 mt-1 uppercase">{m.id} // {m.status}</p>
                               </div>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>

                 {activeMission && blueprints.length > 0 && (
                  <div className="glass-card p-10 rounded-[56px] border border-fuchsia-500/20 bg-fuchsia-950/5 space-y-8 shadow-xl animate-in fade-in">
                     <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                        <Zap className="text-fuchsia-400" />
                        <h4 className="text-lg font-black text-white uppercase italic tracking-widest">Process Sourcing</h4>
                     </div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">Import from Value Enhancement</p>
                     <div className="space-y-3">
                        {blueprints.map(bp => (
                          <button 
                            key={bp.blueprint_id}
                            onClick={() => handleSourceBlueprint(bp)}
                            disabled={isSourcing}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-fuchsia-600 hover:text-white transition-all text-slate-400"
                          >
                             <div className="text-left">
                                <p className="text-xs font-black uppercase">{bp.input_material.name}</p>
                                <p className="text-[8px] font-mono opacity-60">Delta: +{bp.projected_value_delta}%</p>
                             </div>
                             <ArrowDownCircle size={16} />
                          </button>
                        ))}
                     </div>
                  </div>
                 )}
              </div>

              <div className="xl:col-span-8">
                 {!activeMission ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-10 group">
                       <Monitor size={140} className="text-slate-500 group-hover:text-blue-400 transition-colors duration-1000" />
                       <p className="text-3xl font-black uppercase tracking-[0.5em] italic">STANDBY_NODE</p>
                    </div>
                 ) : (
                    <div className="space-y-10 animate-in slide-in-from-right-4">
                       <div className="glass-card p-12 md:p-14 rounded-[64px] border-2 border-white/10 bg-black/60 relative overflow-hidden shadow-3xl">
                          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-10">
                             <div className="flex items-center gap-8">
                                <div className="w-24 h-24 rounded-[32px] bg-indigo-600 shadow-2xl flex items-center justify-center text-white border-4 border-white/10 animate-float overflow-hidden relative">
                                   <Target size={40} className="relative z-10" />
                                   <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                                </div>
                                <div>
                                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{activeMission.productType}</h3>
                                   <p className="text-[10px] text-slate-500 font-mono tracking-[0.6em] mt-3 uppercase italic font-black">COMMAND_ID: {activeMission.id} // INVESTOR: {activeMission.investorName}</p>
                                   {activeMission.associatedPrograms && activeMission.associatedPrograms.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-4">
                                         {activeMission.associatedPrograms.map(prog => (
                                            <span key={prog} className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">
                                               {prog.replace('PROG-', '')}
                                            </span>
                                         ))}
                                      </div>
                                   )}
                                </div>
                             </div>
                             <div className="flex gap-4">
                                <button onClick={handleStartTaskRegistration} className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-emerald-500 active:scale-95 transition-all">
                                   <PlusCircle size={16} /> New Kanban Task
                                </button>
                                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95 border-2 border-white/10 ring-4 ring-indigo-500/5">
                                   <Edit2 size={16} /> Edit Mission Shard
                                </button>
                             </div>
                          </div>

                          <div className="space-y-8 relative z-10 pt-10 border-t border-white/5">
                             <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] px-4 italic mb-6">STRATEGIC_TOOLING_HUB</h4>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {[
                                   { label: 'Mission Optimization', icon: BrainCircuit, target: 'intelligence', col: 'text-indigo-400', sourceLedger: 'RESOURCE' },
                                   { label: 'Shift to Live Farming', icon: Sprout, target: 'live_farming', col: 'text-emerald-400', sourceLedger: 'LIVE_FARMING_SHIFT' },
                                   { label: 'Evidence Ingest', icon: Upload, target: 'digital_mrv', action: 'ingest', col: 'text-blue-400', sourceLedger: 'RESOURCE' },
                                   { label: 'Collective Registry', icon: Users, target: 'community', action: 'shards', col: 'text-indigo-400', sourceLedger: 'RESOURCE' },
                                   { label: 'Program Integration', icon: Layers, target: 'programs', action: 'integrate', col: 'text-purple-400', sourceLedger: 'PROGRAMS' },
                                ].map((tool, i) => (
                                   <button 
                                      key={i}
                                      onClick={() => handleTriggerTool(tool)}
                                      className="p-10 bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-[48px] flex flex-col items-center text-center gap-5 transition-all group active:scale-95 shadow-xl relative overflow-hidden"
                                   >
                                      <div className="absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                      <tool.icon size={36} className={`${tool.col} group-hover:scale-110 transition-transform relative z-10`} />
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white relative z-10">{tool.label}</span>
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="mt-16 space-y-10 relative z-10 pt-10 border-t border-white/10">
                             <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] px-4 italic mb-8">MILESTONE_SHARDING_CONTROL</h4>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {activeMission.milestones.map((ms, i) => (
                                   <div key={i} className={`p-10 rounded-[56px] border-2 flex flex-col items-center text-center space-y-8 shadow-3xl relative overflow-hidden group/ms transition-all duration-700 ${ms.status === 'COMPLETED' ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' : ms.status === 'ACTIVE' ? 'border-blue-500 bg-blue-600/10 text-blue-400 animate-pulse' : 'border-white/5 bg-black/80 text-slate-800'}`}>
                                      <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover/ms:scale-110 transition-transform duration-700">
                                         {ms.status === 'COMPLETED' ? <CheckCircle2 size={120} /> : <Lock size={120} />}
                                      </div>
                                      <div className="w-16 h-16 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover/ms:rotate-12 transition-transform duration-500">
                                         <Stamp size={32} />
                                      </div>
                                      <div className="space-y-2 relative z-10">
                                         <h5 className="text-lg font-black uppercase italic leading-none">{ms.label}</h5>
                                         <p className="text-[10px] font-mono mt-2 font-bold opacity-60">YIELD_RELEASE: {ms.stakeReleasePercent}%</p>
                                      </div>
                                      <div className="w-full pt-8 border-t border-white/5 relative z-10 flex flex-col items-center">
                                         <p className="text-[10px] font-black uppercase tracking-widest mb-4">{ms.status}</p>
                                         {ms.status === 'COMPLETED' && <BadgeCheck className="text-emerald-500" size={24} />}
                                         {ms.status === 'ACTIVE' && <Activity className="text-blue-400 animate-pulse" size={24} />}
                                         {ms.status === 'LOCKED' && <Lock className="text-slate-800" size={24} />}
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}
        {activeTab === 'manifest' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
             <div className="col-span-full py-32 text-center opacity-20 flex flex-col items-center gap-10">
                <Boxes size={120} className="text-slate-600" />
                <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">NO_RESOURCES_SHARDED</p>
             </div>
          </div>
        )}
      </div>

      {/* ASSET ASSOCIATION TOOL: INTEGRATED ACROSS ALL STRATEGIC TOOLS */}
      <AssetAssociationTool
        isOpen={showShardLinker}
        onClose={() => setShowShardLinker(false)}
        selectedAsset={activeMission}
        linkerContext={linkerContext}
        onNavigate={onNavigate}
        onLinkResource={handleLinkResource}
        industrialUnits={industrialUnits}
        blueprints={blueprints}
        user={user}
        liveProducts={liveProducts}
      />

      {/* NEW KANBAN TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowTaskModal(false)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in border-2">
              <div className="p-10 border-b border-white/5 bg-indigo-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl"><ClipboardList size={32} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Register <span className="text-indigo-400">Task</span></h3>
                    </div>
                 </div>
                 <button onClick={() => setShowTaskModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateTask} className="p-10 space-y-8 bg-black/40">
                 <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Task Title</label>
                    <input type="text" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Nutrient Shard Injection" className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/20" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Priority</label>
                       <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white font-bold appearance-none outline-none">
                          <option>Standard</option>
                          <option>High</option>
                          <option>Critical</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Pillar</label>
                       <select value={newTask.thrust} onChange={e => setNewTask({...newTask, thrust: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white font-bold appearance-none outline-none">
                          <option>Industry</option>
                          <option>Environmental</option>
                          <option>Technological</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl">
                    ANCHOR TASK SHARD
                 </button>
              </form>
           </div>
        </div>
      )}

      {showResumePrompt && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-black border border-emerald-500/30 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Confirm Form Resubmission</h3>
            <p className="text-slate-400 mb-8 text-sm">You have an incomplete registration process. Would you like to resume where you left off or start a new registration?</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => { isSuccessRef.current = false; setShowResumePrompt(false); setShowTaskModal(true); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Resume Registration
              </button>
              <button onClick={() => { isSuccessRef.current = false; setMissionRegistrationState(null); setShowResumePrompt(false); setNewTask({ title: '', priority: 'Standard', thrust: 'Industry' }); setShowTaskModal(true); }} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .shadow-4xl { box-shadow: 0 80px 180px -40px rgba(0, 0, 0, 0.98); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37, 99, 235, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ContractFarming;