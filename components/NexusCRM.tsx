
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  HeartHandshake, 
  Loader2, 
  Search, 
  ShieldCheck, 
  X, 
  Zap, 
  Briefcase, 
  Database, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Star, 
  HardHat, 
  ShieldAlert, 
  MapPin, 
  ClipboardCheck, 
  Stamp, 
  ArrowRight,
  Activity,
  ArrowUpRight,
  Clock,
  MessagesSquare,
  Leaf,
  Bot,
  User as UserIcon,
  Globe,
  Settings,
  Shield,
  SearchCode,
  Send,
  Cookie,
  History,
  FileSearch,
  Maximize2,
  Terminal,
  AlertTriangle,
  Fingerprint,
  RotateCcw,
  BadgeCheck,
  LifeBuoy,
  Paperclip,
  Download,
  ShoppingBag,
  ShieldPlus,
  RefreshCw,
  Gavel
} from 'lucide-react';
import { User, VendorProduct, ViewState, Order } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';

interface NexusCRMProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  vendorProducts: VendorProduct[];
  onNavigate: (view: ViewState) => void;
  orders: Order[];
  initialSection?: string | null;
}

const BASE_SERVICES = [
  { id: 'SRVC-01', name: 'BIO-COMPOST DELIVERY', provider: 'GREEN SOIL NODES // INPUT SUPPLY', status: 'Verified', category: 'Input Supply', trust: 98, desc: 'Eco-friendly compost delivery with ZK-proven carbon offsets.', cost: 120 },
  { id: 'SRVC-02', name: 'SPECTRAL DRONE AUDITING', provider: 'SKYSCOUT INC // LOGISTICS', status: 'Pending Audit', category: 'Logistics', trust: 75, desc: 'High-altitude multi-spectral soil moisture analysis shards.', cost: 450 },
  { id: 'SRVC-03', name: 'ANCESTRAL SEED VOUCHING', provider: 'BANTU HERITAGE // CONSULTATION', status: 'Verified', category: 'Consultation', trust: 99, desc: 'Verification of lineage-based seed purity and drought resistance.', cost: 85 },
];

const NexusCRM: React.FC<NexusCRMProps> = ({ user, onSpendEAC, vendorProducts = [], onNavigate, orders = [], initialSection }) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'support' | 'after_sales' | 'ledger'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Support Chat State
  const [supportInput, setSupportInput] = useState('');
  const [supportChat, setSupportChat] = useState<{role: 'user' | 'bot', text: string, time: string}[]>([
    { role: 'bot', text: "Nexus Support Node active. Describe the industrial friction or service anomaly you are encountering.", time: 'Now' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSection && ['directory', 'support', 'after_sales', 'ledger'].includes(initialSection)) {
      setActiveTab(initialSection as any);
    }
  }, [initialSection]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [supportChat, isTyping]);

  // Dynamically derived services from Vendor Registry
  const registeredServices = useMemo(() => {
    const dynamicServices = vendorProducts
      .filter(p => p.category === 'Service' || p.category === 'Organization Service' || p.category === 'Consultation')
      .map(p => ({
        id: p.id,
        name: p.name.toUpperCase(),
        provider: `${p.supplierName.toUpperCase()} // ${p.supplierType.replace('_', ' ')}`,
        status: p.status === 'AUTHORIZED' ? 'Verified' : 'Pending Audit',
        category: 'Industrial Service',
        trust: p.status === 'AUTHORIZED' ? 95 : 40,
        desc: p.description,
        cost: p.price
      }));
    return [...BASE_SERVICES, ...dynamicServices];
  }, [vendorProducts]);

  const filteredServices = registeredServices.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // After-Sales: Actual orders that are services
  const activeServiceOrders = orders.filter(o => 
    o.customerEsin === user.esin && 
    (o.itemType.toLowerCase().includes('service') || o.itemType.toLowerCase().includes('audit') || o.itemType.toLowerCase().includes('consultation'))
  );

  const handleSupportSend = async () => {
    if (!supportInput.trim() || isTyping) return;
    const msg = supportInput.trim();
    setSupportInput('');
    setSupportChat(prev => [...prev, { role: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsTyping(true);

    try {
      const response = await chatWithAgroLang(msg, supportChat.map(c => ({ role: c.role === 'bot' ? 'model' : 'user', parts: [{ text: c.text }] })));
      setSupportChat(prev => [...prev, { role: 'bot', text: response.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (e) {
      setSupportChat(prev => [...prev, { role: 'bot', text: "Protocol sync error. Oracle handshake failed.", time: 'Error' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSyncLedger = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("CRM_LEDGER_SYNC: Industrial resolution shards synchronized with TQM Registry.");
    }, 2000);
  };

  const handleAcquireShard = (srv: any) => {
    onNavigate('economy'); // Proceed to procurement
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 max-w-[1400px] mx-auto px-4">
      
      {/* 1. Steward Support Rank Card */}
      <div className="flex justify-center">
        <div className="glass-card w-full max-w-2xl p-14 rounded-[80px] border-emerald-500/20 bg-black/40 flex flex-col items-center text-center space-y-6 shadow-3xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.05)_0%,_transparent_70%)] pointer-events-none"></div>
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[15s]"><HeartHandshake size={600} /></div>
           
           <div className="space-y-1 relative z-10">
              <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic">STEWARD SUPPORT RANK</p>
              <h4 className="text-[140px] font-mono font-black text-emerald-400 tracking-tighter leading-none m-0 p-0 drop-shadow-[0_0_40px_rgba(52,211,153,0.3)]">A+</h4>
           </div>
           <div className="flex gap-2 relative z-10 pb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={40} className="text-amber-500 fill-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />)}
           </div>
           <div className="flex items-center gap-4 text-[10px] font-black text-emerald-400 uppercase tracking-widest relative z-10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              Node Loyalty Verified
           </div>
        </div>
      </div>

      {/* 2. Navigation Shards */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex flex-wrap gap-2 md:gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10">
          {[
            { id: 'directory', label: 'Service Registry', icon: Globe },
            { id: 'after_sales', label: 'Active Engagements', icon: Clock },
            { id: 'support', label: 'Support Terminal', icon: ShoppingBag },
            { id: 'ledger', label: 'Resolution Ledger', icon: RotateCcw },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-10 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[850px] relative z-10">
        {/* TAB: SERVICE SHARDS (DIRECTORY) */}
        {activeTab === 'directory' && (
           <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-full">
                    <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                      REGISTRY <span className="text-indigo-400">SERVICES</span>
                    </h3>
                    <p className="text-slate-500 text-xl md:text-2xl font-medium mt-4 italic opacity-80 max-w-4xl mx-auto leading-relaxed">"Provisioning specialized industrial shards from vetted organizational nodes to ensure 100% SEHTI compliance."</p>
                </div>
                <div className="relative group w-full max-w-3xl pt-8">
                    <Search className="absolute left-8 top-[calc(50%+16px)] -translate-y-1/2 w-6 h-6 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Query service ID or provider signature..." 
                      className="w-full bg-black/60 border-2 border-white/10 rounded-full py-8 md:py-10 pl-20 pr-12 text-xl md:text-3xl text-white focus:outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all font-medium placeholder:text-stone-900 italic shadow-inner" 
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12 px-4 max-w-6xl mx-auto pt-10">
                  {filteredServices.map(srv => (
                    <div key={srv.id} className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-white/5 flex flex-col group hover:border-indigo-500/30 transition-all shadow-3xl bg-black/40 relative overflow-hidden active:scale-[0.99] duration-300">
                      <div className="absolute top-1/2 right-16 -translate-y-1/2 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                         <Database size={400} className="text-white" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-12 relative z-10">
                          <div className={`w-24 h-24 rounded-[40px] bg-black/40 border-2 flex items-center justify-center transition-all ${
                            srv.status === 'Verified' ? 'border-emerald-500/30 text-emerald-500 group-hover:border-emerald-500' : 'border-amber-500/30 text-amber-500 group-hover:border-amber-500 animate-pulse'
                          }`}>
                            {srv.status === 'Verified' ? <ShieldCheck size={48} /> : <Clock size={48} />}
                          </div>
                          <div className="text-right flex flex-col items-end gap-3">
                            <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase border tracking-widest shadow-xl transition-all ${
                                srv.status === 'Verified' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-600/10 text-amber-400 border-amber-500/20'
                            }`}>{srv.status.toUpperCase()}</span>
                            <p className="text-[12px] text-slate-700 font-mono mt-2 uppercase font-black tracking-widest">{srv.id} // 0x882A</p>
                          </div>
                      </div>

                      <div className="flex-1 space-y-8 relative z-10">
                          <h4 className="text-5xl md:text-8xl font-black text-white uppercase italic leading-none group-hover:text-indigo-400 transition-colors m-0 tracking-tighter drop-shadow-2xl">{srv.name}</h4>
                          <p className="text-[12px] md:text-[14px] text-slate-600 font-black uppercase tracking-[0.4em] italic leading-tight">{srv.provider}</p>
                          <p className="text-2xl md:text-3xl text-slate-400 leading-relaxed italic mt-12 opacity-80 group-hover:opacity-100 transition-opacity max-w-4xl font-medium">"{srv.desc}"</p>
                      </div>

                      <div className="mt-20 pt-16 border-t border-white/5 flex flex-col sm:flex-row items-center sm:items-end justify-between relative z-10 gap-12">
                          <div className="space-y-6 text-center sm:text-left">
                             <div className="flex items-center justify-center sm:justify-start gap-4">
                                <Star size={24} className="text-amber-500 fill-amber-500" />
                                <span className="text-[16px] md:text-lg font-mono font-black text-white tracking-widest">{srv.trust}% TRUST_SCORE</span>
                             </div>
                             <p className="text-7xl md:text-9xl font-mono font-black text-white tracking-tighter m-0 leading-none">{srv.cost} <span className="text-3xl md:text-4xl text-emerald-400 italic font-sans ml-2">EAC</span></p>
                          </div>
                          <div className="relative group/btn w-full sm:w-auto">
                            <button 
                              onClick={() => handleAcquireShard(srv)}
                              className="w-full sm:w-auto px-16 md:px-24 py-10 md:py-12 bg-emerald-600 hover:bg-emerald-500 rounded-[48px] text-[16px] md:text-lg font-black text-white uppercase tracking-[0.4em] flex items-center justify-center gap-6 shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-emerald-500/5"
                            >
                               ACQUIRE SHARD <ArrowUpRight size={36} />
                            </button>
                            <div className="absolute inset-[-12px] border-4 border-emerald-400/30 rounded-[60px] pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity animate-pulse"></div>
                          </div>
                      </div>
                    </div>
                  ))}
              </div>
           </div>
        )}

        {/* TAB: ACTIVE ENGAGEMENTS */}
        {activeTab === 'after_sales' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 px-4">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-4 gap-8">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Lifecycle <span className="text-emerald-400">Monitoring</span></h3>
                    <p className="text-slate-500 text-lg md:text-xl font-medium italic opacity-70">"Real-time tracking of provisioned industrial service shards."</p>
                 </div>
                 <div className="p-8 bg-emerald-600/5 border border-emerald-500/20 rounded-[40px] text-center shadow-2xl min-w-[200px]">
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mb-2">Sync Shards</p>
                    <p className="text-6xl font-mono font-black text-white">{activeServiceOrders.length}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                 {activeServiceOrders.length === 0 ? (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-10 opacity-20 border-2 border-dashed border-white/5 rounded-[80px] bg-black/20">
                       <History size={120} className="text-slate-600 animate-spin-slow" />
                       <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">No active engagements detected</p>
                       <button onClick={() => setActiveTab('directory')} className="px-16 py-8 bg-indigo-600 rounded-[40px] text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">Browse Registry</button>
                    </div>
                 ) : (
                    activeServiceOrders.map(order => (
                       <div key={order.id} className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 shadow-3xl group relative overflow-hidden flex flex-col hover:border-emerald-500/20 transition-all duration-500">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[15s]"><Clock size={400} /></div>
                          <div className="flex justify-between items-start mb-12 relative z-10">
                             <div className="flex items-center gap-8">
                                <div className="w-20 h-20 rounded-[32px] bg-indigo-600/10 flex items-center justify-center text-indigo-400 border-2 border-indigo-500/20 shadow-xl group-hover:rotate-12 transition-transform">
                                   <Clock size={36} className="animate-spin-slow" />
                                </div>
                                <div>
                                   <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 drop-shadow-xl">{order.itemName}</h4>
                                   <p className="text-[11px] text-slate-500 font-mono mt-3 uppercase tracking-[0.4em] font-black italic">SHARD_ID: {order.id}</p>
                                </div>
                             </div>
                             <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-inner ${
                                order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
                             }`}>{order.status.replace(/_/g, ' ')}</span>
                          </div>

                          <div className="space-y-8 flex-1 relative z-10">
                             <div className="p-10 bg-black/80 rounded-[56px] border border-white/10 space-y-6 shadow-inner border-l-4 border-l-indigo-600">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600">
                                   <span>Origin Node Signature</span>
                                   <span className="text-white font-mono">{order.supplierEsin}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600">
                                   <span>EAC Capital Commitment</span>
                                   <span className="text-emerald-400 font-mono text-xl">{order.cost} EAC</span>
                                </div>
                             </div>
                             <div className="space-y-4 pt-6 px-4">
                                <div className="flex justify-between text-[11px] font-black uppercase text-slate-500 tracking-widest">
                                   <span>Shard Stability (α)</span>
                                   <span className="text-indigo-400 font-mono font-black">0.992</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                                   <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1]" style={{ width: '99.2%' }}></div>
                                </div>
                             </div>
                          </div>

                          <div className="mt-14 pt-12 border-t border-white/5 flex gap-6 relative z-10">
                             <button className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[32px] text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Verify Shard</button>
                             <button onClick={() => setActiveTab('support')} className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-[32px] text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-4 active:scale-95 border-2 border-white/10">
                                <MessagesSquare size={20} /> Open Synapse
                             </button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        )}

        {/* TAB: SUPPORT TERMINAL */}
        {activeTab === 'support' && (
           <div className="max-w-5xl mx-auto flex flex-col h-[800px] glass-card rounded-[80px] border-2 border-white/10 bg-black/60 overflow-hidden shadow-3xl animate-in zoom-in duration-500 mt-10">
              <div className="p-12 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20">
                 <div className="flex items-center gap-10">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[40px] flex items-center justify-center text-white shadow-[0_0_80px_rgba(99,102,241,0.4)] group overflow-hidden relative border-4 border-white/10 ring-8 ring-indigo-500/5">
                       <Bot size={48} className="group-hover:scale-110 transition-transform relative z-10" />
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Nexus <span className="text-indigo-400">Command</span></h3>
                       <p className="text-indigo-400/60 text-[11px] font-mono tracking-[0.5em] uppercase mt-4 italic">ZK_SUPPORT_ORACLE_v6.5</p>
                    </div>
                 </div>
                 <div className="hidden md:flex flex-col items-end gap-3 px-10">
                    <div className="flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-inner">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest leading-none">CONSENSUS_STABLE</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-700 font-black uppercase tracking-tighter italic">REF_#0x{(Math.random()*100).toFixed(0)}</span>
                 </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 md:p-16 space-y-12 custom-scrollbar bg-black/40 relative z-10">
                 {supportChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                       <div className={`flex flex-col gap-4 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`flex items-center gap-4 mb-2 px-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all group ${msg.role === 'user' ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400'}`}>
                                {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                             </div>
                             <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">{msg.role === 'user' ? user.name : 'NEXUS_ORACLE'}</span>
                          </div>
                          <div className={`p-10 rounded-[56px] text-lg leading-relaxed shadow-3xl relative overflow-hidden ${
                             msg.role === 'user' 
                               ? 'bg-indigo-600 text-white rounded-tr-none border-t-8 border-indigo-500' 
                               : 'glass-card border border-white/10 rounded-tl-none italic bg-black/90 text-slate-200 border-l-8 border-l-emerald-500'
                          }`}>
                             {msg.role === 'bot' && <div className="absolute top-0 right-0 p-6 opacity-[0.02]"><Leaf size={140} /></div>}
                             <p className="relative z-10 whitespace-pre-line font-medium leading-loose">"{msg.text}"</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-700 px-10 font-bold italic tracking-widest">{msg.time}</span>
                       </div>
                    </div>
                 ))}
                 {isTyping && (
                    <div className="flex justify-start">
                       <div className="bg-white/5 border border-white/10 p-8 rounded-[48px] rounded-tl-none flex flex-col gap-4 shadow-inner">
                          <div className="flex gap-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Consulting Shards...</p>
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-12 border-t border-white/5 bg-black/95 relative z-20">
                 <div className="relative max-w-6xl mx-auto group">
                    <textarea 
                      value={supportInput}
                      onChange={e => setSupportInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSupportSend())}
                      placeholder="Input industrial support signal (e.g. 'Node m-constant drift detected in Sector 4')..."
                      className="w-full bg-white/[0.01] border-2 border-white/10 rounded-[56px] py-10 pl-12 pr-36 text-2xl text-white focus:outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all placeholder:text-stone-900 resize-none h-40 shadow-inner italic font-medium leading-snug" 
                    />
                    <button 
                      onClick={handleSupportSend}
                      disabled={isTyping || !supportInput.trim()}
                      className="absolute right-10 bottom-10 p-8 bg-indigo-600 rounded-[40px] text-white shadow-[0_0_100px_rgba(99,102,241,0.5)] hover:bg-indigo-500 transition-all disabled:opacity-30 active:scale-90 ring-8 ring-indigo-500/5 group-hover:scale-105"
                    >
                       <Send size={44} />
                    </button>
                 </div>
                 <div className="mt-10 flex justify-between items-center px-14">
                    <p className="text-[11px] text-slate-700 font-black uppercase tracking-[0.5em] italic">Official Governance Support v6.5 // Secured Ingest Node</p>
                    <div className="flex gap-8">
                       <button className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-3 transition-all border-b border-transparent hover:border-indigo-400 pb-1">
                          <Paperclip size={14} /> Attach Event Shard
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'ledger' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 px-4">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-12 px-4 gap-10">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Resolution <span className="text-emerald-400">Archive</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-70">"Immutable record of industrial friction resolutions sharded into the global quorum."</p>
                 </div>
                 <div className="flex gap-6">
                    <button 
                      onClick={handleSyncLedger}
                      disabled={isSyncing}
                      className="px-12 py-6 bg-white/5 border-2 border-white/10 rounded-[32px] text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-4"
                    >
                       {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                       {isSyncing ? 'SYNCING_LEGDGER...' : 'RE-SYNC WITH TQM'}
                    </button>
                    <button className="p-6 bg-indigo-600 rounded-[32px] text-white shadow-3xl hover:bg-indigo-500 transition-all border-2 border-white/10 active:scale-90"><Download size={28} /></button>
                 </div>
              </div>

              <div className="glass-card rounded-[80px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl relative">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><Gavel size={600} /></div>
                 <div className="grid grid-cols-5 p-12 border-b border-white/10 bg-white/[0.01] text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic px-16 relative z-10">
                    <span className="col-span-2">Resolution Shard Identifier</span>
                    <span>Pillar Anchor</span>
                    <span>Finality Shard Date</span>
                    <span className="text-right">Ledger Quorum</span>
                 </div>
                 <div className="divide-y divide-white/5 bg-[#050706] relative z-10 min-h-[500px]">
                    {[
                       { id: 'RES-882-01', title: 'SLA Discrepancy Finalized', type: 'Industrial', date: '2d ago', node: 'Node_Paris_04', result: 'COMPLETED', hash: '0x882A_RES_SYNC' },
                       { id: 'RES-104-42', title: 'Telemetry Drift Corrected', type: 'Technological', date: '1w ago', node: 'Stwd_Nairobi', result: 'SETTLED', hash: '0x104_DRIFT_OK' },
                       { id: 'RES-091-88', title: 'Identity Ingest Recovered', type: 'Societal', date: '2w ago', node: 'Global_Alpha', result: 'COMPLETED', hash: '0x091_AUTH_FINAL' },
                    ].map((res, i) => (
                       <div key={i} className="grid grid-cols-5 p-12 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                          <div className="col-span-2 flex items-center gap-10">
                             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border-2 border-white/10 group-hover:scale-110 group-hover:border-emerald-500 transition-all shadow-inner">
                                <BadgeCheck size={28} className="text-emerald-400" />
                             </div>
                             <div>
                                <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-indigo-400 transition-colors m-0">{res.title}</p>
                                <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black tracking-widest italic">{res.id} // {res.hash}</p>
                             </div>
                          </div>
                          <div>
                             <span className="px-5 py-2 bg-indigo-600/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest">{res.type} SHARD</span>
                          </div>
                          <div className="text-sm text-slate-500 font-mono italic opacity-70 group-hover:opacity-100 transition-opacity">
                             {res.date} // {res.node}
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
              
              <div className="p-20 glass-card rounded-[80px] border-2 border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mx-4 mt-20 backdrop-blur-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[20s]"><CheckCircle2 className="w-[1000px] h-[1000px]" /></div>
                 <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-32 h-32 md:w-44 md:h-44 bg-emerald-600 rounded-[44px] flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.4)] animate-pulse ring-[24px] ring-white/5 shrink-0 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <Stamp size={80} className="text-white relative z-20 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">TOTAL <span className="text-emerald-400">TRUTH</span></h4>
                       <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-3xl opacity-80">
                         "Resolutions anchored in biological logic. Every friction point in the Nexus ecosystem is rectified and recorded to strengthen node resonance."
                       </p>
                    </div>
                 </div>
                 <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-24 hidden xl:block">
                    <p className="text-[16px] text-slate-600 font-black uppercase mb-8 tracking-[0.8em] border-b border-white/10 pb-6">RESOLVED_SHARDS</p>
                    <p className="text-[140px] font-mono font-black text-white tracking-tighter leading-none m-0">1,426</p>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default NexusCRM;
