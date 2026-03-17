
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Recycle, 
  RotateCcw, 
  PackageSearch, 
  Wrench, 
  ShieldCheck, 
  Search, 
  Archive, 
  ShoppingCart, 
  ChevronRight, 
  Activity, 
  Binary, 
  BadgeCheck,
  Bot,
  Leaf,
  Loader2,
  Zap,
  CheckCircle2,
  Trash2,
  History,
  Stamp,
  Database,
  Fingerprint,
  ArrowUpRight,
  Monitor,
  Workflow,
  Globe,
  Gauge,
  Layers,
  Box,
  Binary as BinaryIcon,
  ChevronDown,
  Warehouse,
  Receipt,
  ScanLine,
  Atom,
  Wind,
  GanttChartSquare,
  ShieldAlert,
  ArrowDownToLine,
  RefreshCw,
  FileText,
  Download,
  Info,
  Maximize2
} from 'lucide-react';
import { User, Order, VendorProduct, ViewState, SignalShard } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';

interface CircularGridProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onPlaceOrder: (order: Partial<Order>) => void;
  onNavigate: (view: ViewState) => void;
  vendorProducts: VendorProduct[];
  notify: any;
  initialSection?: string | null;
}

const CIRCULAR_LEDGER_DATA = [
  { id: 'CIR-882A', name: 'Refurbished Spectral Drone', type: 'HARDWARE', state: 'RE-MINTED', integrity: 94, date: '2d ago', hash: '0x882_CIRC_01' },
  { id: 'CIR-104B', name: 'Second-Life Soil Array', type: 'IOT', state: 'AUDITING', integrity: 82, date: '5h ago', hash: '0x104_CIRC_42' },
  { id: 'CIR-042C', name: 'Reclaimed Bio-Composter', type: 'INDUSTRIAL', state: 'VERIFIED', integrity: 98, date: '1w ago', hash: '0x042_CIRC_91' },
];

const CircularGrid: React.FC<CircularGridProps> = ({ 
  user, onEarnEAC, onSpendEAC, onPlaceOrder, onNavigate, vendorProducts = [], notify, initialSection 
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'registry' | 'repair'>('market');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sync with initialSection
  useEffect(() => {
    if (initialSection && ['market', 'registry', 'repair'].includes(initialSection)) {
      setActiveTab(initialSection as any);
    }
  }, [initialSection]);

  // Sourcing circular items exclusively from vendorProducts where supplierType is REVERSE_RETURN
  const circularItems = useMemo(() => 
    vendorProducts.filter(p => p.supplierType === 'REVERSE_RETURN'),
    [vendorProducts]
  );

  const filteredItems = useMemo(() => 
    circularItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [circularItems, searchTerm]);

  // Repair Oracle States
  const [isAuditing, setIsAuditing] = useState(false);
  const [repairVerdict, setRepairVerdict] = useState<string | null>(null);
  const [targetAssetId, setTargetAssetId] = useState('');
  const [damageDesc, setDamageDesc] = useState('');

  // Synchronization State
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncLedger = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      notify({ 
        title: 'CIRCULAR_SYNC_OK', 
        message: "Second-life registry aligned with global m-constant drift.",
        type: 'success',
        priority: 'low',
        actionIcon: 'RefreshCw'
      });
    }, 2000);
  };

  const handleRunRepairAudit = async () => {
    if (!damageDesc.trim()) return;
    const fee = 15;
    if (!await onSpendEAC(fee, 'CIRCULAR_REPAIR_DIAGNOSTIC')) return;

    setIsAuditing(true);
    setRepairVerdict(null);

    try {
      const prompt = `Act as a Circular Economy Engineer for EnvirosAgro. Analyze the following damage report for Asset ${targetAssetId || 'UNKN'}:
      "${damageDesc}"
      
      Requirements:
      1. Provide a technical remediation shard for second-life restoration.
      2. Calculate the "Circularity Potential" (0.0 to 1.0).
      3. Identify if the asset can be re-minted into the Market Cloud.
      4. Format as a technical industrial report.`;

      const res = await chatWithAgroLang(prompt, []);
      setRepairVerdict(res.text);
      onEarnEAC(5, 'REPAIR_STRATEGY_CONTRIBUTION');
    } catch (e) {
      setRepairVerdict("ORACLE_SYNC_ERROR: Handshake interrupted. Potential shard fragmentation in the diagnostic buffer.");
    } finally {
      setIsAuditing(false);
    }
  };

  const buyRefurbished = (item: VendorProduct) => {
    if (confirm(`INITIALIZE PROCUREMENT: Anchor ${item.name} into the second-life ledger for ${item.price} EAC?`)) {
      onPlaceOrder({
        itemId: item.id,
        itemName: item.name,
        itemType: 'Refurbished ' + item.category,
        itemImage: item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400',
        cost: item.price,
        supplierEsin: item.supplierEsin,
        sourceTab: 'circular'
      });
      notify({ 
        title: 'PROCUREMENT_INJECTED', 
        message: `Shard ${item.id} registered via Circular Grid. Monitor finality in TQM.`,
        type: 'success',
        priority: 'medium',
        actionIcon: 'ShoppingCart'
      });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Circular Resilience HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col justify-between h-[280px] group transition-all shadow-3xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Recycle size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.5em]">Circularity Index</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">94.2<span className="text-xl text-emerald-500 ml-1 italic">%</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Registry v6.5</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Synced</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border-blue-500/20 bg-blue-500/[0.03] flex flex-col justify-between h-[280px] group transition-all shadow-3xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Database size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em]">Second-Life Shards</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">{circularItems.length}<span className="text-xl text-blue-500 ml-1 italic">SKUs</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">m-Constant Neutral</span>
              <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-widest">Active</span>
           </div>
        </div>

        <div className="lg:col-span-2 glass-card p-10 rounded-[56px] border border-white/10 bg-black/40 flex items-center justify-between shadow-3xl">
           <div className="space-y-6 flex-1 px-4">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Circular <span className="text-emerald-400">Grid</span> Terminal</h3>
              <p className="text-slate-500 text-base italic font-medium leading-relaxed max-w-sm">"Maximizing asset lifecycle finality. Promoting circular sharding to suppress environmental stress (S)."</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('repair')}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all flex items-center gap-3"
                >
                  <Wrench size={18} /> Repair Oracle
                </button>
              </div>
           </div>
           <div className="w-40 h-40 hidden md:flex items-center justify-center relative shrink-0">
              <div className="absolute inset-0 border-4 border-dashed border-emerald-500/10 rounded-full animate-spin-slow"></div>
              <Recycle size={64} className="text-emerald-500/30" />
           </div>
        </div>
      </div>

      {/* 2. Primary Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'market', label: 'Refurbished Hub', icon: PackageSearch },
          { id: 'registry', label: 'Circular Ledger', icon: History },
          { id: 'repair', label: 'Repair Diagnostics', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-2xl scale-105 border-b-4 border-emerald-400 ring-8 ring-emerald-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Main Operational Views */}
      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: REFURBISHED HUB --- */}
        {activeTab === 'market' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
             <div className="flex justify-between items-center gap-8 border-b border-white/5 pb-8 px-6">
                <div className="relative group flex-1 max-w-2xl">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                     type="text" 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Query second-life shards..." 
                     className="w-full bg-black/80 border-2 border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-8 focus:ring-emerald-500/10 transition-all font-mono italic shadow-inner" 
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full py-40 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[64px] flex flex-col items-center gap-6">
                    <PackageSearch size={80} />
                    <p className="text-3xl font-black uppercase tracking-[0.5em] italic">HUB_BUFFER_EMPTY</p>
                  </div>
                ) : (
                  filteredItems.map(item => (
                    <div key={item.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group flex flex-col justify-between h-[600px] shadow-3xl relative overflow-hidden active:scale-[0.99]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Database size={300} /></div>
                       
                       <div className="space-y-8 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-emerald-500 shadow-2xl group-hover:rotate-6 transition-all">
                                <Recycle size={32} />
                             </div>
                             <div className="text-right">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl bg-emerald-500/10 text-emerald-400 border-emerald-500/20`}>SECOND-LIFE</span>
                                <p className="text-[10px] text-slate-700 font-mono font-black uppercase mt-3 tracking-widest italic">{item.id}</p>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors drop-shadow-2xl line-clamp-2">{item.name}</h4>
                             <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">CAT: {item.category}</p>
                          </div>
                          <p className="text-sm text-slate-400 italic leading-relaxed line-clamp-3 font-medium">"{item.description}"</p>
                       </div>

                       <div className="mt-auto pt-10 border-t border-white/5 space-y-8 relative z-10">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-black/60 rounded-3xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Circular Yield</p>
                                <p className="text-2xl font-mono font-black text-white">{item.price}<span className="text-xs ml-1 opacity-40">EAC</span></p>
                             </div>
                             <div className="p-4 bg-black/60 rounded-3xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Integrity</p>
                                <div className="flex items-center justify-center gap-2 text-emerald-500">
                                   <BadgeCheck size={16} />
                                   <span className="text-[10px] font-mono font-black uppercase tracking-widest">98% α</span>
                                </div>
                             </div>
                          </div>
                          <button 
                            onClick={() => buyRefurbished(item)}
                            className="w-full py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/10"
                          >
                            <ShoppingCart size={18} /> INITIALIZE PROCUREMENT
                          </button>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {/* --- VIEW: CIRCULAR LEDGER --- */}
        {activeTab === 'registry' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-10 px-6 gap-8">
                <div className="space-y-2">
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Circular <span className="text-emerald-400">Ledger Shards</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic opacity-70">"Immutable record of industrial asset re-circulation and m-constant impact."</p>
                </div>
                <div className="flex gap-6">
                   <button 
                     onClick={handleSyncLedger}
                     disabled={isSyncing}
                     className="px-12 py-6 bg-white/5 border-2 border-white/10 rounded-[32px] text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-4"
                   >
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                      {isSyncing ? 'SYNCING_REGISTRY...' : 'RE-SYNC WITH QUORUM'}
                   </button>
                </div>
             </div>

             <div className="glass-card rounded-[80px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><History size={600} /></div>
                <div className="grid grid-cols-5 p-12 border-b border-white/10 bg-white/[0.01] text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic px-16 relative z-10">
                   <span className="col-span-2">Second-Life Identifier</span>
                   <span>Restoration State</span>
                   <span>Integrity Delta</span>
                   <span className="text-right">Ledger Finality</span>
                </div>
                <div className="divide-y divide-white/5 bg-[#050706] relative z-10 min-h-[500px]">
                   {CIRCULAR_LEDGER_DATA.map((res, i) => (
                      <div key={i} className="grid grid-cols-5 p-12 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                         <div className="col-span-2 flex items-center gap-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border-2 border-white/10 group-hover:scale-110 group-hover:border-emerald-500 transition-all shadow-inner">
                               <BadgeCheck size={28} className="text-emerald-400" />
                            </div>
                            <div>
                               <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-indigo-400 transition-colors m-0">{res.name}</p>
                               <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black tracking-widest italic">{res.id} // {res.hash}</p>
                            </div>
                         </div>
                         <div>
                            <span className={`px-5 py-2 bg-emerald-600/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest`}>{res.state}</span>
                         </div>
                         <div className="text-sm text-slate-500 font-mono italic opacity-70 group-hover:opacity-100 transition-opacity">
                            {res.integrity}% α // {res.date}
                         </div>
                         <div className="flex justify-end pr-8">
                            <div className="p-5 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.15)] group-hover:shadow-emerald-500/40 group-hover:scale-110 transition-all active:scale-95">
                               <ShieldCheck size={28} />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: REPAIR DIAGNOSTICS (Oracle Integration) --- */}
        {activeTab === 'repair' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden shadow-3xl text-center space-y-12 group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Leaf size={800} className="text-indigo-400" /></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 animate-float">
                       <Wrench size={64} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter m-0 leading-none italic">REPAIR <span className="text-indigo-400">ORACLE</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed">
                          "Analyzing damaged industrial assets to verify restoration paths and re-minting feasibility."
                       </p>
                    </div>

                    {!repairVerdict && !isAuditing ? (
                      <div className="space-y-10 py-10 max-w-xl mx-auto">
                         <div className="grid grid-cols-1 gap-6">
                            <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 shadow-inner">
                               <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block text-center italic mb-4">ASSET_IDENTIFIER</label>
                               <input 
                                 type="text" value={targetAssetId} onChange={e => setTargetAssetId(e.target.value)}
                                 placeholder="e.g. CIR-882A" 
                                 className="w-full bg-transparent border-none text-center text-4xl font-mono text-white outline-none focus:ring-0 uppercase placeholder:text-stone-900 transition-all shadow-inner tracking-widest font-black" 
                               />
                            </div>
                            <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 shadow-inner">
                               <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block text-center italic mb-4">DAMAGE_NARRATIVE</label>
                               <textarea 
                                 value={damageDesc} onChange={e => setDamageDesc(e.target.value)}
                                 placeholder="Describe defect shard..." 
                                 className="w-full bg-transparent border-none text-center text-xl italic font-medium text-white outline-none focus:ring-0 placeholder:text-stone-950 transition-all h-32 resize-none" 
                               />
                            </div>
                         </div>
                         <button 
                           onClick={handleRunRepairAudit}
                           disabled={!damageDesc.trim()}
                           className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[20px] ring-white/5 disabled:opacity-20"
                         >
                            <Zap size={32} className="fill-current mr-4" /> BEGIN DIAGNOSTIC
                         </button>
                      </div>
                    ) : isAuditing ? (
                      <div className="flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                         <div className="relative">
                            <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Fingerprint size={48} className="text-indigo-400 animate-pulse" />
                            </div>
                         </div>
                         <div className="space-y-4">
                            <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">AUDITING_Restoration_LOGIC...</p>
                            <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">INGESTING_CIRCULAR_PARAMETERS // ANALYZING_REUSE_FINALITY</p>
                         </div>
                      </div>
                    ) : (
                      <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12">
                         <div className="p-12 md:p-20 bg-black/80 rounded-[80px] border-2 border-indigo-500/20 shadow-3xl border-l-[24px] border-l-indigo-600 text-left relative overflow-hidden group/advice">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform duration-[15s]"><Leaf size={800} className="text-indigo-400" /></div>
                            <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                               <div className="flex items-center gap-8">
                                  <BadgeCheck size={48} className="text-indigo-400" />
                                  <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Restoration Verdict</h4>
                               </div>
                               <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                                  <span className="text-[11px] font-mono font-black text-indigo-400 uppercase tracking-widest italic">REPAIR_0x882A_OK</span>
                               </div>
                            </div>
                            <div className="prose prose-invert max-w-none text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium relative z-10 pl-10 border-l-2 border-white/10">
                               {repairVerdict}
                            </div>
                            <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                               <div className="flex items-center gap-8">
                                  <Fingerprint size={48} className="text-indigo-400" />
                                  <div className="text-left">
                                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Restoration Shard ID</p>
                                     <p className="text-xl font-mono text-white">0xHS_CIR_RESTORE_#{(Math.random()*1000).toFixed(0)}</p>
                                  </div>
                               </div>
                               <button onClick={() => setRepairVerdict(null)} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10">ANCHOR REPAIR SHARD</button>
                            </div>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -20px rgba(0, 0, 0, 0.9); }
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

export default CircularGrid;
