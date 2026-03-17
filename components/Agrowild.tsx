
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  PawPrint, 
  TreePine, 
  Binoculars, 
  Globe, 
  PlusCircle, 
  ChevronRight, 
  X, 
  Search, 
  Database,
  BadgeCheck,
  ShieldCheck,
  Activity,
  Zap,
  ArrowUpRight,
  Star,
  MapPin,
  Camera,
  Sprout,
  ShieldPlus,
  Compass,
  History,
  TrendingUp,
  Waves,
  LayoutGrid,
  FileSearch,
  Download,
  Box,
  Fingerprint,
  Target,
  Binary,
  Bot,
  Leaf,
  Loader2,
  Stamp,
  Network,
  Atom,
  Wind,
  ShieldAlert,
  SearchCode,
  ScanLine,
  Minimize2,
  Maximize2,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { User, ViewState, Order, VendorProduct, MediaShard } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import { SycamoreLogo } from '../App';

interface AgrowildProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  onPlaceOrder: (order: Partial<Order>) => void;
  vendorProducts: VendorProduct[];
  notify: any;
}

const AGROWILD_TABS = [
  { id: 'conservancy', label: 'CONSERVANCY', icon: ShieldCheck },
  { id: 'tourism', label: 'ECO-TOURISM', icon: Binoculars },
  { id: 'discovery', label: 'DISCOVERY', icon: Sprout },
  { id: 'archive', label: 'BIO-LEDGER', icon: Database },
];

const BASE_TOURISM_OFFERS = [
  { id: 'TOU-01', title: 'SPECTRAL BIRDING SAFARI', duration: '4h', cost: 150, rating: 4.9, thumb: 'https://images.unsplash.com/photo-1549336573-19965159074d?q=80&w=400', desc: 'Guided multi-spectral binocular tour focusing on rare migratory shards.', supplierEsin: 'EA-TOUR-HUB', node: 'NODE_NAIROBI_04' },
  { id: 'TOU-02', title: 'BANTU NATURE WALK', duration: '2h', cost: 50, rating: 4.8, thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400', desc: 'Ancestral botanical walk through lineage forests and moisture hubs.', supplierEsin: 'EA-TOUR-HUB', node: 'NODE_PARIS_82' },
  { id: 'TOU-03', title: 'NIGHT PREDATOR TRACKING', duration: '6h', cost: 300, rating: 5.0, thumb: 'https://images.unsplash.com/photo-1557406230-ceddd547a61d?q=80&w=400', desc: 'Thermal ingest mission to monitor nocturnal carnivore health and load.', supplierEsin: 'EA-TOUR-HUB', node: 'NODE_TOKYO_01' },
];

const Agrowild: React.FC<AgrowildProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, onPlaceOrder, vendorProducts, notify }) => {
  const [activeTab, setActiveTab] = useState<string>('conservancy');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Discovery Oracle States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [discoveryVerdict, setDiscoveryVerdict] = useState<string | null>(null);
  const [speciesQuery, setSpeciesQuery] = useState('');
  
  // Resonance States
  const [globalResonance, setGlobalResonance] = useState(94.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalResonance(prev => Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(2)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tourismOffers = useMemo(() => {
    const dynamicTours = vendorProducts
      .filter(p => p.category === 'Tour' || p.category === 'Consultation' || (p.category === 'Service' && (p.name.toLowerCase().includes('tour') || p.name.toLowerCase().includes('safari'))))
      .map(p => ({
        id: p.id,
        title: p.name.toUpperCase(),
        duration: 'Varies',
        cost: p.price,
        rating: 4.5 + Math.random() * 0.5,
        thumb: p.image || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400',
        desc: p.description,
        supplierEsin: p.supplierEsin,
        node: 'Partner Node'
      }));
    return [...BASE_TOURISM_OFFERS, ...dynamicTours];
  }, [vendorProducts]);

  const scrollToSection = (tabId: string) => {
    if (!scrollContainerRef.current) return;
    const index = AGROWILD_TABS.findIndex(t => t.id === tabId);
    const container = scrollContainerRef.current;
    container.scrollTo({
      left: container.clientWidth * index,
      behavior: 'smooth'
    });
    setActiveTab(tabId);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    if (AGROWILD_TABS[index] && activeTab !== AGROWILD_TABS[index].id) {
      setActiveTab(AGROWILD_TABS[index].id);
    }
  };

  const handleOrderExperience = async (offer: any) => {
    if (confirm(`INITIALIZE PROCUREMENT: Anchor ${offer.title} into the ledger for ${offer.cost} EAC?`)) {
      if (await onSpendEAC(offer.cost, `AGROWILD_EXPERIENCE_${offer.id}`)) {
        onPlaceOrder({
          itemId: offer.id,
          itemName: offer.title,
          itemType: 'Tourism Service',
          itemImage: offer.thumb,
          cost: offer.cost,
          supplierEsin: offer.supplierEsin,
          sourceTab: 'agrowild'
        });
        notify({ 
          title: 'PROCUREMENT_SUCCESS', 
          message: "Experience shard registered. Finality monitored in TQM.",
          type: 'ledger_anchor',
          priority: 'medium',
          actionIcon: 'ShoppingCart'
        });
      }
    }
  };

  const handleRunDiscovery = async () => {
    if (!speciesQuery.trim()) return;
    const fee = 15;
    if (!await onSpendEAC(fee, 'BOTANICAL_ORACLE_DIAGNOSTIC')) return;

    setIsAnalyzing(true);
    setDiscoveryVerdict(null);

    try {
      const prompt = `Act as a Botanical Oracle for the EnvirosAgro network. Analyze the following species discovery: "${speciesQuery}". 
      Requirements:
      1. Identify the biological shard and its ecosystem function.
      2. Calculate the "Resonance Delta" (+/- % impact on m-constant).
      3. Recommend a conservation protocol or sharding path.
      4. Provide a unique SKU identifier for the discovery.
      Format as a technical industrial report.`;

      const res = await chatWithAgroLang(prompt, []);
      setDiscoveryVerdict(res.text);
      onEarnEAC(5, 'DISCOVERY_STRATEGY_CONTRIBUTION');
    } catch (e) {
      setDiscoveryVerdict("ORACLE_HANDSHAKE_TIMEOUT: Mesh drift in the biological buffer.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-[1700px] mx-auto px-4 relative overflow-hidden flex flex-col min-h-screen">
      
      {/* 1. Biological Finality HUD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 shrink-0 mt-4">
        <div className="glass-card p-6 md:p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col justify-between h-[220px] group transition-all shadow-3xl overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform"><Globe2 size={100} /></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.5em]">Mesh Resonance</p>
              <h4 className="text-4xl md:text-5xl font-mono font-black text-white tracking-tighter leading-none">{globalResonance}<span className="text-xl text-emerald-500 ml-1 italic">%</span></h4>
           </div>
           <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[9px] font-black text-slate-500 uppercase">Quorum v6.5</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-widest text-nowrap">Resonant</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-[40px] border-blue-500/20 bg-blue-500/[0.03] flex flex-col justify-between h-[220px] group transition-all shadow-3xl overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform"><Database size={100} /></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em]">Biological Shards</p>
              <h4 className="text-4xl md:text-5xl font-mono font-black text-white tracking-tighter leading-none">1,424</h4>
           </div>
           <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[9px] font-black text-slate-500 uppercase">Registry Height</span>
              <span className="text-[8px] font-mono text-blue-400 font-bold uppercase tracking-widest text-nowrap">Synced</span>
           </div>
        </div>

        <div className="lg:col-span-2 glass-card p-8 md:p-10 rounded-[40px] border border-white/10 bg-black/40 flex items-center justify-between shadow-3xl min-h-[220px]">
           <div className="space-y-4 flex-1 px-2">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight">Agrowild <span className="text-emerald-400">Finality</span> Console</h3>
              <p className="text-slate-500 text-sm italic font-medium leading-relaxed max-sm:text-sm max-w-sm hidden sm:block">"Monitoring and sharding biological assets across the planetary grid for SEHTI compliance."</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => scrollToSection('discovery')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-[9px] uppercase tracking-[0.3em] shadow-xl transition-all flex items-center gap-2"
                >
                  <Bot size={16} /> Botanical Oracle
                </button>
              </div>
           </div>
           <div className="w-24 h-24 hidden md:flex items-center justify-center relative shrink-0">
              <div className="absolute inset-0 border-4 border-dashed border-emerald-500/10 rounded-full animate-spin-slow"></div>
              <PawPrint size={32} className="text-emerald-500/30" />
           </div>
        </div>
      </div>

      {/* 2. Unified Navigation */}
      <div className="px-4 shrink-0 flex justify-center">
        <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-[32px] w-full sm:w-fit border border-white/5 bg-black/40 shadow-xl px-6 md:px-10 relative z-20 overflow-x-auto scrollbar-hide snap-x w-full md:w-auto">
          {AGROWILD_TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-6 md:px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-2xl scale-105 border-b-4 border-emerald-400 ring-4 ring-emerald-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Operational Viewport - Slider */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-[600px] overflow-x-auto flex snap-x snap-mandatory scrollbar-hide bg-black/10 mx-1 md:mx-4 rounded-[40px] md:rounded-[80px] border-2 border-white/5"
      >
        
        {/* --- VIEW: CONSERVANCY --- */}
        <section id="conservancy" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12 lg:p-20 space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 px-4 gap-6">
              <div className="space-y-2">
                 <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Regional <span className="text-emerald-400">Node Clusters</span></h3>
                 <p className="text-slate-600 text-lg font-medium italic opacity-70 max-w-2xl">"Verified biological clusters sharded for m-constant stability and genetic heritage."</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="px-4 py-2 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-full text-emerald-400 font-mono text-[9px] font-black uppercase tracking-widest shadow-inner hidden sm:block">GRID_PROTECTED_OK</div>
                 <button className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-700 hover:text-white transition-all shadow-xl active:scale-90"><History size={24}/></button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 'CON-01', name: 'Mugumo Ancient Shard', status: 'UNTOUCHABLE', resonance: 1.618, col: 'text-emerald-400', desc: 'The root antenna node for the entire Githaka cluster. Zero stress (S) baseline.' },
                { id: 'CON-02', name: 'Nairobi Inflow Forest', status: 'AUDITING', resonance: 1.42, col: 'text-blue-400', desc: 'A secondary carbon sequestration shard undergoing high-frequency telemetry sync.' },
                { id: 'CON-03', name: 'Valencia Marine Node', status: 'ACTIVE', resonance: 1.55, col: 'text-indigo-400', desc: 'Aquatic bio-data bridge monitoring micro-nutrient drift in regional waters.' },
              ].map((node, i) => (
                <div key={i} className="glass-card p-8 md:p-10 rounded-[48px] md:rounded-[64px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between min-h-[450px] relative overflow-hidden bg-black/40 shadow-3xl active:scale-[0.99]">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><TreePine size={300} /></div>
                   <div className="flex justify-between items-start relative z-10">
                      <div className={`p-4 md:p-6 rounded-3xl bg-white/5 border border-white/10 ${node.col} shadow-inner group-hover:rotate-6 transition-all`}>
                         <ShieldPlus size={32} />
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${node.status === 'UNTOUCHABLE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                          {node.status}
                        </span>
                        <p className="text-[9px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{node.id}</p>
                      </div>
                   </div>
                   <div className="space-y-4 relative z-10 mt-6">
                      <h4 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors drop-shadow-2xl">{node.name}</h4>
                      <p className="text-slate-400 text-base italic leading-relaxed font-medium">"{node.desc}"</p>
                   </div>
                   <div className="pt-8 border-t border-white/5 relative z-10 flex justify-between items-end mt-6">
                      <div className="space-y-1">
                         <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest">Shard Resonance (m)</p>
                         <p className="text-4xl md:text-5xl font-mono font-black text-white tracking-tighter">{node.resonance}<span className="text-xl text-emerald-500 italic ml-1">μ</span></p>
                      </div>
                      <button className="p-6 md:p-7 bg-emerald-600/10 hover:bg-emerald-600 rounded-[28px] text-emerald-400 hover:text-white transition-all shadow-3xl active:scale-90 border-2 border-emerald-500/20">
                        <Activity size={24} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* --- VIEW: ECO-TOURISM --- */}
        <section id="tourism" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12 lg:p-20 space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8">
              <div className="space-y-2 text-center md:text-left flex-1">
                 <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Tourism <span className="text-blue-400">Shards</span></h3>
                 <p className="text-slate-600 text-lg font-medium italic opacity-70">"Authorized ingest missions within verified biological clusters."</p>
              </div>
              <div className="relative group w-full md:w-[400px]">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-blue-400" />
                 <input type="text" placeholder="Query active experiences..." className="w-full bg-black/80 border border-white/10 rounded-full py-4 pl-14 pr-8 text-sm text-white focus:ring-4 focus:ring-blue-500/10 transition-all font-mono italic shadow-inner outline-none" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tourismOffers.map(offer => (
                 <div key={offer.id} className="glass-card rounded-[48px] md:rounded-[64px] border-2 border-white/5 hover:border-blue-500/40 transition-all flex flex-col group active:scale-[0.99] duration-500 shadow-3xl bg-black/40 relative overflow-hidden min-h-[550px]">
                    <div className="h-64 relative overflow-hidden shrink-0">
                       <img src={offer.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[10s] grayscale-[0.3] group-hover:grayscale-0" alt={offer.title} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                       <div className="absolute top-6 right-6 p-4 bg-blue-600 rounded-[24px] shadow-2xl text-white group-hover:rotate-12 transition-transform border-2 border-white/10">
                          <Binoculars size={28} />
                       </div>
                       <div className="absolute bottom-6 left-6">
                          <span className="px-4 py-1.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                            {offer.duration} INGEST MISSION
                          </span>
                       </div>
                    </div>
                    <div className="p-8 md:p-10 flex-1 flex flex-col justify-between">
                       <div className="space-y-4">
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <h4 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-blue-400 transition-colors drop-shadow-2xl">{offer.title}</h4>
                                <p className="text-[9px] text-slate-700 font-mono font-black uppercase tracking-[0.2em] italic leading-none mt-1">ID: {offer.id}</p>
                             </div>
                             <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 shadow-xl">
                                <Star size={14} fill="currentColor" />
                                <span className="text-xs font-black font-mono leading-none">{offer.rating.toFixed(1)}</span>
                             </div>
                          </div>
                          <p className="text-sm text-slate-400 italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3 font-medium">"{offer.desc}"</p>
                       </div>
                       <div className="pt-6 border-t border-white/5 flex items-end justify-between mt-6 relative z-10">
                          <div className="space-y-1">
                             <p className="text-[9px] text-slate-800 font-black uppercase tracking-[0.2em] leading-none italic">Entry Commitment</p>
                             <div className="flex items-baseline gap-1">
                                <p className="text-4xl font-mono font-black text-white tracking-tighter drop-shadow-2xl">{offer.cost}</p>
                                <span className="text-xs text-blue-400 italic font-black font-sans">EAC</span>
                             </div>
                          </div>
                          <button 
                            onClick={() => handleOrderExperience(offer)}
                            className="p-6 md:p-8 rounded-[32px] bg-blue-600 hover:bg-blue-500 text-white shadow-3xl active:scale-90 transition-all border-2 border-white/10 ring-4 ring-blue-500/5 group/btn"
                          >
                             <ChevronRight size={32} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* --- VIEW: BOTANICAL DISCOVERY --- */}
        <section id="discovery" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12 lg:p-20 flex flex-col items-center justify-center">
           <div className="max-w-4xl w-full space-y-12 py-12 text-center">
              <div className="glass-card p-10 md:p-16 rounded-[64px] border-2 border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden shadow-[0_40px_150px_rgba(0,0,0,0.8)] group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><SycamoreLogo size={400} className="text-emerald-400" /></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-24 h-24 rounded-[32px] bg-emerald-600 flex items-center justify-center shadow-3xl border-2 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 animate-float">
                       <Bot size={48} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">BOTANICAL <span className="text-emerald-400">DISCOVERY.</span></h2>
                       <p className="text-slate-400 text-lg md:text-xl font-medium italic max-w-2xl mx-auto leading-relaxed opacity-80">
                          "Identifying biodiversity shards to recalibrate regional resonance."
                       </p>
                    </div>

                    {!discoveryVerdict && !isAnalyzing ? (
                       <div className="max-w-xl mx-auto space-y-8">
                          <div className="relative group">
                             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-emerald-400 transition-colors w-6 h-6" />
                             <input 
                                type="text" 
                                value={speciesQuery}
                                onChange={e => setSpeciesQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleRunDiscovery()}
                                placeholder="Describe biological discovery..."
                                className="w-full bg-black/80 border-2 border-white/10 rounded-full py-6 pl-16 pr-8 text-xl text-white font-medium italic focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none shadow-inner placeholder:text-stone-900"
                             />
                          </div>
                          <button 
                             onClick={handleRunDiscovery}
                             disabled={isAnalyzing || !speciesQuery.trim()}
                             className="w-full py-6 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ring-emerald-500/5 disabled:opacity-20"
                          >
                             {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Binary size={24} />}
                             {isAnalyzing ? 'DECODING...' : 'INITIALIZE AUDIT'}
                          </button>
                       </div>
                    ) : isAnalyzing ? (
                       <div className="flex flex-col items-center justify-center space-y-10 py-10 text-center animate-in zoom-in duration-500">
                          <div className="relative">
                             <Loader2 size={100} className="text-emerald-500 animate-spin mx-auto" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Atom size={40} className="text-emerald-400 animate-pulse" />
                             </div>
                          </div>
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic m-0">SEQUENCING...</p>
                       </div>
                    ) : (
                       <div className="animate-in slide-in-from-bottom-6 duration-1000 space-y-10 text-left max-w-3xl mx-auto">
                          <div className="p-8 md:p-12 bg-black/90 rounded-[48px] border border-emerald-500/20 shadow-3xl border-l-[12px] border-l-emerald-600 relative overflow-hidden group/advice">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform duration-[15s]"><SycamoreLogo size={400} className="text-emerald-400" /></div>
                             <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/5 pb-6">
                                <div className="flex items-center gap-6">
                                   <Stamp size={32} className="text-emerald-400" />
                                   <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">Discovery Verdict</h4>
                                </div>
                                <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest italic">BIO_SHARD_OK</span>
                             </div>
                             <div className="prose prose-invert max-w-none text-slate-300 text-lg md:text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-6 border-l-2 border-white/5">
                                {discoveryVerdict}
                             </div>
                             <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
                                <div className="flex items-center gap-4">
                                   <Fingerprint size={36} className="text-emerald-400" />
                                   <div className="text-left">
                                      <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Finality Hash</p>
                                      <p className="text-xs font-mono text-white tracking-widest">0xBIO_SHARD_#{(Math.random()*1000).toFixed(0)}</p>
                                   </div>
                                </div>
                                <button onClick={() => setDiscoveryVerdict(null)} className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all ring-4 ring-white/5 border border-white/10">ANCHOR TO BIO-LEDGER</button>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </section>

        {/* --- VIEW: BIO-LEDGER --- */}
        <section id="archive" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12 lg:p-20 space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 px-4 gap-8">
              <div className="space-y-2">
                 <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">BIOLOGICAL <span className="text-indigo-400">LEDGER</span></h3>
                 <p className="text-slate-600 text-lg font-medium italic opacity-80">"Immutable record of biological data shards anchored to the global mesh."</p>
              </div>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl flex items-center gap-2">
                 <Download size={16} /> Export Index
              </button>
           </div>

           <div className="glass-card rounded-[40px] md:rounded-[64px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl relative">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-[20s]"><Database size={400} /></div>
              <div className="grid grid-cols-5 p-8 border-b border-white/10 bg-white/[0.01] text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] italic px-10 relative z-10">
                 <span className="col-span-2">Archive Shard Designation</span>
                 <span>Pillar Anchor</span>
                 <span>Finality Date</span>
                 <span className="text-right">Ledger Auth</span>
              </div>
              <div className="divide-y divide-white/5 bg-[#050706] relative z-10 min-h-[500px]">
                 {[
                   { id: 'SHD-BIO-001', name: 'Zone 4 Moisture Alpha', type: 'Environmental', date: '2d ago', hash: '0x882_SYNC', col: 'text-emerald-400' },
                   { id: 'SHD-BIO-042', name: 'Nairobi Inflow Shard', type: 'Industrial', date: '5h ago', hash: '0x104_SYNC', col: 'text-blue-400' },
                   { id: 'SHD-BIO-091', name: 'Lineage Seed DNA', type: 'Heritage', date: '1w ago', hash: '0x042_SYNC', col: 'text-fuchsia-400' },
                 ].map((shard, i) => (
                    <div key={i} className="grid grid-cols-5 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                       <div className="col-span-2 flex items-center gap-8">
                          <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-all shadow-inner">
                             <Database size={28} className={shard.col} />
                          </div>
                          <div>
                             <p className="text-xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors">{shard.name}</p>
                             <p className="text-[9px] text-slate-700 font-mono font-black mt-2 uppercase tracking-widest italic">{shard.id} // {shard.hash}</p>
                          </div>
                       </div>
                       <div>
                          <span className={`px-4 py-1.5 bg-indigo-600/10 text-indigo-400 text-[8px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest`}>{shard.type}</span>
                       </div>
                       <div className="text-[10px] text-slate-500 font-mono italic opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-widest">{shard.date}</div>
                       <div className="flex justify-end pr-8">
                          <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl text-emerald-400 shadow-xl group-hover:shadow-emerald-500/40 group-hover:scale-110 transition-all scale-90 group-hover:scale-100">
                             <ShieldCheck size={24} />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

      </div>

      {/* 4. Biological Totalitarianism Footer */}
      <div className="p-12 md:p-16 lg:p-20 glass-card rounded-[40px] md:rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col xl:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl mx-1 md:mx-4 mt-8 z-10 backdrop-blur-3xl shrink-0">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[20s]">
            <CheckCircle2 className="w-[800px] h-[800px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-24 h-24 md:w-32 bg-emerald-600 rounded-[32px] md:rounded-[40px] flex items-center justify-center shadow-3xl animate-pulse ring-[15px] ring-white/5 shrink-0 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Stamp size={48} className="text-white relative z-20 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-4">
               <h4 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">TOTAL <span className="text-emerald-400">TRUTH</span></h4>
               <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl opacity-80">
                 "Eliminating unverified biological drift. Every forest, soil, and species shard in the Agrowild network is anchored in absolute m-constant finality."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-12 hidden xl:block">
            <p className="text-[12px] text-slate-600 font-black uppercase mb-4 tracking-[0.6em]">REGISTRY_RESONANCE</p>
            <p className="text-8xl font-mono font-black text-white tracking-tighter leading-none">{globalResonance.toFixed(0)}<span className="text-4xl text-emerald-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.9); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Agrowild;
