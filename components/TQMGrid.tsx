
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ClipboardCheck, 
  History, 
  Search, 
  ShieldCheck, 
  Activity, 
  FlaskConical, 
  Factory, 
  Loader2, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Bot, 
  Leaf, 
  MapPin, 
  Package, 
  Truck, 
  Download,
  Binary,
  Microscope,
  Award,
  ChevronLeft,
  ArrowRight,
  Monitor,
  Shield,
  SearchCode,
  Link2,
  Coins,
  Fingerprint,
  Terminal,
  BadgeCheck,
  FileSearch,
  Maximize2,
  Database,
  Stamp,
  FileSignature,
  Wallet,
  Scale,
  Signature,
  Workflow,
  Cpu,
  SmartphoneNfc,
  Wrench,
  Layers,
  LayoutGrid,
  ShoppingBag,
  Radio,
  Target,
  FileText,
  Eye,
  Settings,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Hash,
  Share2,
  RefreshCw,
  Box,
  Binary as BinaryIcon,
  ChevronDown,
  Warehouse,
  PackageSearch,
  Receipt,
  ScanLine,
  Atom,
  Wind,
  Globe,
  GanttChartSquare,
  ShieldAlert,
  ShoppingBag as CRMIcon
} from 'lucide-react';
import { User, Order, LiveAgroProduct, ViewState, SignalShard } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';
import { generateQuickHash } from '../systemFunctions';

interface TQMGridProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], meta?: any) => void;
  liveProducts?: LiveAgroProduct[];
  onNavigate: (view: ViewState) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
  initialSection?: string | null;
}

interface TraceEvent {
  stage: 'Procurement' | 'Industrial_Kanban' | 'Live_Processing' | 'Market_Cloud_Validation' | 'Auditor_Verification' | 'Inventory_CRM';
  timestamp: string;
  source_portal: string;
  payload: any;
  prev_hash: string;
  unique_hash: string;
  verification_signature: string | null;
}

const SOURCING_MAP = [
  { portal: 'Vendor Portal', role: 'Procurement Initialization', metric: 'Raw Material Origin (Batch #)', icon: Warehouse },
  { portal: 'Industrial Portal', role: 'Kanban/Efficiency', metric: 'Lead Time & Cycle Time', icon: Factory },
  { portal: 'Live Processing', role: 'Quality Assurance', metric: 'Sensor Telemetry & Real-time Logs', icon: Activity },
  { portal: 'Market Cloud/CRM', role: 'Consumer Feedback', metric: 'Return Rates & Satisfaction', icon: CRMIcon },
];

const TQMGrid: React.FC<TQMGridProps> = ({ user, onSpendEAC, orders = [], onUpdateOrderStatus, liveProducts = [], onNavigate, onEmitSignal, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'trace' | 'auditor' | 'sourcing'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [esinSign, setEsinSign] = useState('');
  const [activeTraceId, setActiveTraceId] = useState<string | null>(null);

  // Oracle States
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditVerdict, setAuditVerdict] = useState<string | null>(null);

  // Sync with initialSection
  useEffect(() => {
    if (initialSection) {
      if (['pipeline', 'trace', 'auditor', 'sourcing'].includes(initialSection)) {
        setActiveTab(initialSection as any);
      }
    }
  }, [initialSection]);

  const myOrders = useMemo(() => orders.filter(o => o.customerEsin === user.esin), [orders, user.esin]);
  
  const filteredOrders = useMemo(() => 
    myOrders.filter(o => o.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase())),
    [myOrders, searchTerm]
  );

  // Cryptographic Hash Simulator (Concept of Python Logic)
  const generateCryptographicShard = (sku: string, prev: string, stage: string, data: any) => {
    const dataStr = JSON.stringify(data);
    const content = `${sku}-${stage}-${prev}-${dataStr}-${Date.now()}`;
    // Simple mock hash for UI
    return `0x${generateQuickHash()}_${sku.slice(-4)}`;
  };

  const getTraceHistory = (order: Order): TraceEvent[] => {
    const sku = order.id;
    const h1 = "0x0000_GENESIS_VOID";
    const h2 = generateCryptographicShard(sku, h1, "Procurement", { batch: order.trackingHash });
    const h3 = generateCryptographicShard(sku, h2, "Industrial_Kanban", { bin_id: 'B-44', tool_id: 'K-88' });
    const h4 = generateCryptographicShard(sku, h3, "Live_Processing", { moisture: '12%', status: 'OPTIMAL' });
    const h5 = generateCryptographicShard(sku, h4, "Market_Cloud_Validation", { customer_tier: 'Gold', satisfaction: 9.5 });

    return [
      { stage: 'Procurement', source_portal: 'Vendor_Portal', timestamp: order.timestamp, payload: { origin: 'Verified Supplier', batch: order.trackingHash }, prev_hash: h1, unique_hash: h2, verification_signature: 'EA-ORACLE-V1' },
      { stage: 'Industrial_Kanban', source_portal: 'Industrial_Portal', timestamp: 'Finalized', payload: { bin_id: "B-44", status: "In-Progress", tool_id: "K-88" }, prev_hash: h2, unique_hash: h3, verification_signature: 'EA-SYSTEM-B42' },
      { stage: 'Live_Processing', source_portal: 'Live_Farming', timestamp: 'Active', payload: { passed_inspection: true, moisture_level: "12%" }, prev_hash: h3, unique_hash: h4, verification_signature: 'CERT_EA_STUDIO_01' },
      { stage: 'Market_Cloud_Validation', source_portal: 'Market_Cloud', timestamp: 'Ready', payload: { warehouse_loc: "Zone-A", customer_tier: "Gold" }, prev_hash: h4, unique_hash: h5, verification_signature: 'LOG_MGR' },
    ];
  };

  const currentTrace = useMemo(() => {
    if (!activeTraceId) return null;
    const order = myOrders.find(o => o.id === activeTraceId);
    if (!order) return null;
    return { order, history: getTraceHistory(order) };
  }, [activeTraceId, myOrders]);

  const handleRunAiAudit = async () => {
    if (!currentTrace) return;
    setIsAuditing(true);
    setAuditVerdict(null);

    try {
      const prompt = `Act as a TQM Auditor. Analyze the following Product Trace History for SKU: ${currentTrace.order.id}. 
      Verify that the unique hashes align sequentially and identify any anomalies in the 'Live Processing' stage that deviate from the 'Industrial Kanban' requirements. 
      Flag any SKU that lacks a 'Validator_ID' in the final transition to the Consumer.
      
      Trace History: ${JSON.stringify(currentTrace.history)}
      
      Requirements:
      1. Check hash sequentiality (prev_hash match).
      2. Detect deviations from Industrial Kanban protocols.
      3. Verify the existence of verification_signature at each stage.
      4. Provide a technical industrial finality report.`;

      const res = await chatWithAgroLang(prompt, []);
      setAuditVerdict(res.text);
    } catch (e) {
      setAuditVerdict("ORACLE_SYNC_ERROR: Ledger handshake interrupted. Shard sequentiality could not be verified.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. TQM Dashboard: Truth Engine Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col justify-between h-[280px] group transition-all shadow-3xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><ShieldCheck size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.5em]">Consensus Confidence</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">99.98<span className="text-xl text-emerald-500 ml-1 italic">%</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Registry Root v6.5</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Anchored</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-between h-[280px] group transition-all shadow-3xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Binary size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em]">Active Trace Shards</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">{myOrders.length}<span className="text-xl text-indigo-500 ml-1 italic">SKUs</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">m-Constant Base</span>
              <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest">x1.42</span>
           </div>
        </div>

        <div className="lg:col-span-2 glass-card p-10 rounded-[56px] border border-white/10 bg-black/40 flex items-center justify-between shadow-3xl">
           <div className="space-y-6 flex-1 px-4">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Total Quality <span className="text-emerald-400">Management</span> Hub</h3>
              <p className="text-slate-500 text-base italic font-medium leading-relaxed max-w-sm">"The central truth engine. Synchronizing siloed data shards into immutable agricultural life-threads."</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('auditor')}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all flex items-center gap-3"
                >
                  <Bot size={18} /> Intelligent Auditor
                </button>
              </div>
           </div>
           <div className="w-40 h-40 hidden md:flex items-center justify-center relative shrink-0">
              <div className="absolute inset-0 border-4 border-dashed border-emerald-500/10 rounded-full animate-spin-slow"></div>
              <Activity size={64} className="text-emerald-500/30" />
           </div>
        </div>
      </div>

      {/* 2. TQM Sub-Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-10 relative z-20">
        {[
          { id: 'pipeline', label: 'Inbound Pipeline', icon: Workflow },
          { id: 'trace', label: 'Trace & Track', icon: History },
          { id: 'auditor', label: 'Agro Lang Oracle Audit', icon: Bot },
          { id: 'sourcing', label: 'Sourcing Map', icon: Globe },
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

      {/* 3. Operational Shard Views */}
      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: INBOUND PIPELINE --- */}
        {activeTab === 'pipeline' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
             <div className="flex justify-between items-center gap-8 border-b border-white/5 pb-8 px-6">
                <div className="relative group flex-1 max-w-2xl">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                     type="text" 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Search SKU shards for initialization..." 
                     className="w-full bg-black/80 border-2 border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-8 focus:ring-emerald-500/10 transition-all font-mono italic shadow-inner" 
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredOrders.length === 0 ? (
                  <div className="col-span-full py-40 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[64px] flex flex-col items-center gap-6">
                    <PackageSearch size={80} />
                    <p className="text-3xl font-black uppercase tracking-[0.5em] italic">PIPELINE_EMPTY</p>
                  </div>
                ) : (
                  filteredOrders.map(order => (
                    <div key={order.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group flex flex-col justify-between h-[580px] shadow-3xl relative overflow-hidden active:scale-[0.99]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Database size={300} /></div>
                       
                       <div className="space-y-8 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-emerald-500 shadow-2xl group-hover:rotate-6 transition-all">
                                <Box size={32} />
                             </div>
                             <div className="text-right">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl bg-emerald-500/10 text-emerald-400 border-emerald-500/20`}>{order.status.replace('ORD_', '')}</span>
                                <p className="text-[10px] text-slate-700 font-mono font-black uppercase mt-3 tracking-widest italic">{order.id}</p>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-emerald-400 transition-colors drop-shadow-2xl line-clamp-2">{order.itemName}</h4>
                             <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Supplier Node: {order.supplierEsin}</p>
                          </div>
                          <p className="text-sm text-slate-400 italic leading-relaxed">"Initializing this SKU into the TQM thread anchors its genesis hash to the registry."</p>
                       </div>

                       <div className="mt-auto pt-10 border-t border-white/5 space-y-8 relative z-10">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-black/60 rounded-3xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Genesis Hash</p>
                                <p className="text-sm font-mono font-black text-white truncate">{order.trackingHash.slice(0, 12)}...</p>
                             </div>
                             <div className="p-4 bg-black/60 rounded-3xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Thread State</p>
                                <div className="flex items-center justify-center gap-2 text-emerald-500">
                                   <BadgeCheck size={16} />
                                   <span className="text-[10px] font-mono font-black uppercase tracking-widest">BUFFERED</span>
                                </div>
                             </div>
                          </div>
                          <button 
                            onClick={() => { setActiveTraceId(order.id); setActiveTab('trace'); }}
                            className="w-full py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/10"
                          >
                            <History size={18} /> INITIALIZE TRACE THREAD
                          </button>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {/* --- VIEW: TRACE & TRACK (Lifecycle Visualization) --- */}
        {activeTab === 'trace' && (
          <div className="space-y-12 animate-in zoom-in duration-700 max-w-6xl mx-auto">
             {!currentTrace ? (
               <div className="py-40 text-center opacity-20 flex flex-col items-center justify-center space-y-8">
                  <History size={120} className="text-slate-600 animate-spin-slow" />
                  <p className="text-4xl font-black uppercase tracking-[0.4em] text-white italic">AWAITING_SKU_INITIALIZATION</p>
                  <button onClick={() => setActiveTab('pipeline')} className="px-12 py-5 bg-indigo-600 rounded-full text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 shadow-2xl">Select Active SKU</button>
               </div>
             ) : (
               <div className="space-y-16">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-10 px-4">
                     <div className="flex items-center gap-10">
                        <div className="w-24 h-24 rounded-[32px] bg-emerald-600 flex items-center justify-center text-white shadow-3xl animate-float">
                           <Fingerprint size={48} />
                        </div>
                        <div>
                           <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Product <span className="text-emerald-400">Life-Thread.</span></h3>
                           <p className="text-slate-500 text-[11px] font-mono tracking-[0.6em] uppercase mt-4 italic">SKU: {currentTrace.order.id} // THREAD_SYNC_ACTIVE</p>
                        </div>
                     </div>
                     <button onClick={() => setActiveTraceId(null)} className="p-5 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={28} /></button>
                  </div>

                  <div className="grid grid-cols-1 gap-12 relative px-4">
                     {/* Connecting Visual Thread */}
                     <div className="absolute left-[39px] md:left-[49px] top-20 bottom-20 w-[2px] bg-gradient-to-b from-emerald-500 via-indigo-500 to-emerald-500 opacity-20 hidden md:block"></div>
                     
                     {currentTrace.history.map((event, i) => (
                        <div key={i} className="flex gap-12 group/event animate-in slide-in-from-left-4" style={{ animationDelay: `${i * 150}ms` }}>
                           <div className="w-20 h-20 rounded-[28px] bg-black border-4 border-white/10 flex items-center justify-center shrink-0 relative z-10 shadow-3xl transition-all group-hover/event:border-emerald-500 group-hover/event:scale-110">
                              <span className="text-xl font-mono font-black text-emerald-400">0{i+1}</span>
                           </div>
                           
                           <div className="flex-1-glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 shadow-3xl hover:border-emerald-500/20 transition-all relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000"><Atom size={200} /></div>
                              <div className="flex justify-between items-start mb-8 relative z-10 border-b border-white/5 pb-6">
                                 <div className="space-y-1">
                                    <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">{event.stage.replace(/_/g, ' ')}</h4>
                                    <p className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase italic">PORTAL_NODE: {event.source_portal.replace(/_/g, ' ')}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] text-slate-700 font-black uppercase mb-1 italic">Event Shard Time</p>
                                    <p className="text-xs font-mono font-bold text-white">{event.timestamp}</p>
                                 </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 relative z-10">
                                 <div className="p-6 bg-black/60 rounded-3xl border border-white/10 space-y-4 shadow-inner">
                                    <h5 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Metadata Payload</h5>
                                    <div className="space-y-2">
                                       {Object.entries(event.payload).map(([k, v]: [any, any]) => (
                                          <div key={k} className="flex justify-between items-center text-xs">
                                             <span className="text-slate-500 font-bold uppercase">{k.replace(/_/g, ' ')}</span>
                                             <span className="text-white font-medium italic">{String(v)}</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                                 <div className="p-6 bg-black/60 rounded-3xl border border-white/10 space-y-4 shadow-inner">
                                    <h5 className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Cryptographic Signature</h5>
                                    <div className="space-y-3">
                                       <div className="flex justify-between items-center">
                                          <span className="text-[9px] text-slate-700 font-black uppercase">Auditor Node</span>
                                          <span className="text-xs font-black text-emerald-400 italic">{event.verification_signature || 'AWAITING_AUDIT'}</span>
                                       </div>
                                       <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-[9px] text-slate-500 truncate italic">
                                          UNIQUE_HASH: {event.unique_hash}
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-4 text-[9px] font-mono text-slate-800 uppercase tracking-[0.4em] relative z-10">
                                 PREV_STATE_HASH: {event.prev_hash}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="flex justify-center pt-10">
                     <button 
                       onClick={() => setActiveTab('auditor')}
                       className="px-20 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-emerald-500/5"
                     >
                        INITIALIZE THREAD AUDIT <Bot className="w-8 h-8 ml-4 animate-pulse" />
                     </button>
                  </div>
               </div>
             )}
          </div>
        )}

        {/* --- VIEW: AGRO LANG ORACLE AUDIT (Intelligent Auditor) --- */}
        {activeTab === 'auditor' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden shadow-3xl text-center space-y-12 group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Leaf size={800} className="text-indigo-400" /></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 animate-float">
                       <Bot size={64} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter m-0 leading-none italic">INTELLIGENT <span className="text-indigo-400">AUDITOR</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed">
                          "Analyzing multi-silo life-threads to verify hash sequentiality and flag biological data corruption."
                       </p>
                    </div>

                    {!auditVerdict && !isAuditing ? (
                      <div className="space-y-10 py-10 max-w-xl mx-auto">
                         <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 shadow-inner group/form">
                            <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block text-center italic mb-6">TARGET_SKU_THREAD</label>
                            <input 
                              type="text" value={activeTraceId || ''} onChange={e => setActiveTraceId(e.target.value)}
                              placeholder="e.g. AGRO-99X" 
                              className="w-full bg-transparent border-none text-center text-5xl font-mono text-white outline-none focus:ring-0 uppercase placeholder:text-stone-900 transition-all shadow-inner tracking-widest font-black" 
                            />
                         </div>
                         <button 
                           onClick={handleRunAiAudit}
                           disabled={!activeTraceId}
                           className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[20px] ring-white/5 disabled:opacity-20"
                         >
                            <Zap size={32} className="fill-current mr-4" /> COMMENCE AUDIT SCAN
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
                            <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">VERIFYING_HASH_THREAD...</p>
                            <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">INGESTING_VENDOR_MAP // CHECKING_LIVE_TELEMETRY</p>
                         </div>
                      </div>
                    ) : (
                      <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12">
                         <div className="p-12 md:p-20 bg-black/80 rounded-[80px] border-2 border-indigo-500/20 shadow-3xl border-l-[24px] border-l-indigo-600 text-left relative overflow-hidden group/advice">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform duration-[15s]"><Leaf size={800} className="text-indigo-400" /></div>
                            <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                               <div className="flex items-center gap-8">
                                  <BadgeCheck size={48} className="text-indigo-400" />
                                  <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Thread Audit Verdict</h4>
                               </div>
                               <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                                  <span className="text-[11px] font-mono font-black text-indigo-400 uppercase tracking-widest italic">AUDIT_0xSYNC_OK</span>
                               </div>
                            </div>
                            <div className="prose prose-invert max-w-none text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium relative z-10 pl-10 border-l-2 border-white/10">
                               {auditVerdict}
                            </div>
                            <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                               <div className="flex items-center gap-8">
                                  <Fingerprint size={48} className="text-indigo-400" />
                                  <div className="text-left">
                                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Thread Finality Hash</p>
                                     <p className="text-xl font-mono text-white">0xHS_FINAL_#{(Math.random()*1000).toFixed(0)}</p>
                                  </div>
                               </div>
                               <button onClick={() => setAuditVerdict(null)} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10">ANCHOR AUDIT SHARD</button>
                            </div>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: SOURCING MAP (Standardized Architecture) --- */}
        {activeTab === 'sourcing' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex flex-col items-center text-center space-y-6 px-4">
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 drop-shadow-2xl">Sourcing <span className="text-emerald-400">Map.</span></h2>
                 <p className="text-slate-500 text-xl font-medium italic opacity-70 max-w-3xl leading-relaxed">"Standardization adapters for converting raw portal data into a uniform industrial life-report."</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                 {SOURCING_MAP.map((node, i) => (
                    <div key={i} className="glass-card p-12 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group shadow-3xl relative overflow-hidden flex flex-col h-[400px] justify-between">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><node.icon size={250} className="text-white" /></div>
                       <div className="flex justify-between items-start relative z-10">
                          <div className="w-20 h-20 rounded-[32px] bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-xl group-hover:rotate-6 transition-all">
                             <node.icon size={36} />
                          </div>
                          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-widest italic">TQM_NODE_0{i+1}</span>
                       </div>
                       <div className="space-y-4 relative z-10">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-emerald-400 transition-colors">{node.portal}</h4>
                          <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] italic">{node.role}</p>
                       </div>
                       <div className="pt-8 border-t border-white/5 relative z-10">
                          <p className="text-[9px] text-slate-700 font-black uppercase mb-2">Key Quality Metric</p>
                          <p className="text-lg font-bold text-white uppercase italic tracking-tight">{node.metric}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-16 glass-card rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl mx-4 mt-20 backdrop-blur-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s]">
                    <CheckCircle2 className="w-[1000px] h-[1000px] text-emerald-400" />
                 </div>
                 <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-40 h-40 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.4)] animate-pulse ring-[24px] ring-white/5 shrink-0 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <Stamp size={80} className="text-white relative z-20 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">TOTAL <span className="text-emerald-400">TRUTH</span></h4>
                       <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl opacity-80">
                         "Eliminating the burden of unverified data. Every industrial thread in the EnvirosAgro network is anchored in immutable biological logic."
                       </p>
                    </div>
                 </div>
                 <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-20 hidden xl:block">
                    <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">REGISTRY_FINALITY_OK</p>
                    <p className="text-9xl font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-emerald-400 ml-2">%</span></p>
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

export default TQMGrid;
