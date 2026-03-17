import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Flower2, Music, Heart, Bot, Cookie, Baby, X, Activity, Leaf, Cpu, ArrowRight, ArrowRightLeft, Landmark, Binary, Package, Palette, PencilRuler, Moon, Waves, Radio, ChefHat, BookOpen, Video, FileText, Download, Microscope, User as UserIcon, HeartPulse, Factory, BadgeCheck, ShieldAlert, Zap, Layers, Smartphone, Star, Target, BrainCircuit, Scan, ShieldCheck as ShieldCheckIcon, HandHelping, Users, Search, ClipboardCheck, Globe, Sprout, Monitor, Radar, Gem, Stethoscope, GraduationCap, FileCode, Waves as WavesIcon, Speaker, Ticket, Shield, SearchCode, Flame, Wind, Loader2, TrendingUp, Gauge, Terminal, Satellite, RadioReceiver, Microscope as MicroscopeIcon, Droplets, Play, Battery, Signal, Cog, ZapOff, PlayCircle, BarChart4, Network, AlertCircle, PlusCircle, Coins, Pause, ChevronRight, CheckCircle2, History, RefreshCw, Handshake,
  Stethoscope as DoctorIcon,
  ShieldPlus,
  Thermometer,
  Microscope as LabIcon,
  HeartPulse as PulseIcon,
  Bed,
  Soup,
  Wind as AirIcon,
  Crosshair,
  Gamepad2,
  Trophy,
  Shapes,
  School,
  Sun,
  ThermometerSun,
  Blocks,
  Rocket,
  Scale,
  CloudRain,
  Eye,
  FileDigit,
  Music2,
  Volume2,
  Film,
  Boxes,
  Compass,
  Layout,
  Crown,
  Coffee,
  FlameKindling,
  Timer,
  AudioWaveform,
  Podcast,
  MessageSquare,
  ArrowUpRight,
  Stamp,
  Fingerprint,
  Building,
  Key,
  ShieldX,
  LayoutGrid,
  Database,
  Box,
  Maximize2
} from 'lucide-react';
import { User, ViewState, MediaShard } from '../types';
import { runSpecialistDiagnostic, AgroLangResponse } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import { generateQuickHash, generateAlphanumericId } from '../systemFunctions';

interface EcosystemProps {
  user: User;
  onDeposit: (amount: number, reason: string) => void;
  onUpdateUser: (user: User) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

type ThrustType = 'societal' | 'environmental' | 'human' | 'technological' | 'industry';

interface Brand {
  id: string;
  name: string;
  icon: any;
  color: string;
  accent: string;
  bg: string;
  desc: string;
  action: string;
  thrust: ThrustType;
  volume: string;
  isLight?: boolean;
}

const THRUST_METADATA: Record<ThrustType, { label: string; icon: any; color: string }> = {
  societal: { label: 'Societal', icon: Heart, color: 'text-rose-700' },
  environmental: { label: 'Environmental', icon: Leaf, color: 'text-emerald-700' },
  human: { label: 'Human', icon: UserIcon, color: 'text-teal-700' },
  technological: { label: 'Technological', icon: Cpu, color: 'text-slate-600' },
  industry: { label: 'Industry', icon: Landmark, color: 'text-indigo-800' },
};

const BRANDS: Brand[] = [
  { id: 'agroboto', name: 'Agroboto', icon: Bot, color: 'text-slate-500', accent: 'text-slate-400', bg: 'bg-slate-500/10', desc: 'Autonomous intelligence. Swarm-based precision farming and robotic terra-mapping.', action: 'Fleet Ingest', thrust: 'technological', volume: '1.8K BOTS' },
  { id: 'medicag', name: 'MedicAg', icon: HeartPulse, color: 'text-teal-600', accent: 'text-teal-500', bg: 'bg-teal-600/10', desc: 'Earth-wellness triage. Clinical audits for soil, steward, and animal health shards.', action: 'Health Audit', thrust: 'human', volume: '8.2K CLINICS', isLight: true },
  { id: 'junior', name: 'AgroJunior', icon: Baby, color: 'text-amber-700', accent: 'text-amber-600', bg: 'bg-amber-700/10', desc: 'STEM-driven growth. Virtual garden twins and agricultural play for the next generation.', action: 'Adventure Start', thrust: 'human', volume: '12.4K JUNIORS', isLight: true },
  { id: 'love4agro', name: 'Love4Agro', icon: Heart, color: 'text-rose-800', accent: 'text-rose-700', bg: 'bg-rose-800/10', desc: 'Empathy in agriculture. Bio-electric community resonance and steward vouching.', action: 'Willingness Audit', thrust: 'societal', volume: '24.2K WILLING', isLight: true },
  { id: 'tokenz', name: 'Tokenz', icon: Landmark, color: 'text-indigo-900', accent: 'text-indigo-700', bg: 'bg-indigo-900/10', desc: 'Institutional DeFi. RWA sharding and liquidity bridges for sustainable assets.', action: 'Institutional Sync', thrust: 'industry', volume: '$ENVZ: 1.42' },
  { id: 'lilies', name: 'Lilies Around', icon: Flower2, color: 'text-fuchsia-900', accent: 'text-fuchsia-700', bg: 'bg-fuchsia-900/10', desc: 'Aesthetic Floriculture. Merging botanical architecture with celestial planting.', action: 'Aesthetic Audit', thrust: 'environmental', volume: '1.2M EAC', isLight: true },
  { id: 'agromusika', name: 'AgroMusika', icon: Music, color: 'text-emerald-800', accent: 'text-emerald-600', bg: 'bg-emerald-800/10', desc: 'Bio-Electric Frequencies. Sonic remediation and soil molecular repair through sound.', action: 'Frequency Audit', thrust: 'technological', volume: '4.8M EAC' },
  { id: 'agroinpdf', name: 'AgroInPDF', icon: BookOpen, color: 'text-cyan-900', accent: 'text-cyan-700', bg: 'bg-cyan-900/10', desc: 'Immutable Knowledge. Scientific whitepapers and documented industrial archives.', action: 'Knowledge Sync', thrust: 'industry', volume: '12.4K SHARDS' },
  { id: 'juizzycookiez', name: 'Juiezy Cookiez', icon: Cookie, color: 'text-orange-900', accent: 'text-orange-700', bg: 'bg-orange-900/10', desc: 'Artis artisanal Traceability. Solar-dried baked nodes from audited regenerative cycles.', action: 'Recipe Audit', thrust: 'industry', volume: '840K EAC', isLight: true },
];

const PORTAL_TABS = [
  { id: 'home', label: 'OPERATIONAL HUB', icon: LayoutGrid },
  { id: 'telemetry', label: 'INFLOW STREAM', icon: Activity },
  { id: 'audit', label: 'ORACLE AUDIT', icon: Bot },
  { id: 'shards', label: 'REGISTRY ASSETS', icon: Database },
];

const Ecosystem: React.FC<EcosystemProps> = ({ user, onDeposit, onUpdateUser, onNavigate }) => {
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [filter, setFilter] = useState<'all' | ThrustType>('all');
  const [portalTab, setPortalTab] = useState<string>('home');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AgroLangResponse | null>(null);
  const [telemetryStream, setTelemetryStream] = useState<any[]>([]);

  // Archiving states
  const [isArchiving, setIsArchiving] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredBrands = filter === 'all' ? BRANDS : BRANDS.filter(b => b.thrust === filter);

  useEffect(() => {
    if (activeBrand) {
      const interval = setInterval(() => {
        setTelemetryStream(prev => [
          { id: generateAlphanumericId(4), time: new Date().toLocaleTimeString(), val: (Math.random() * 100).toFixed(2) },
          ...prev
        ].slice(0, 10));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeBrand]);

  const handlePortalLaunch = (brand: Brand) => {
    setIsSyncing(true);
    setTimeout(() => {
      setActiveBrand(brand);
      setPortalTab('home');
      setIsSyncing(false);
      setAuditResult(null);
      setIsArchived(false);
    }, 1000);
  };

  const scrollToSection = (tabId: string) => {
    if (!scrollContainerRef.current) return;
    const index = PORTAL_TABS.findIndex(t => t.id === tabId);
    const container = scrollContainerRef.current;
    container.scrollTo({
      left: container.clientWidth * index,
      behavior: 'smooth'
    });
    setPortalTab(tabId);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    if (PORTAL_TABS[index] && portalTab !== PORTAL_TABS[index].id) {
      setPortalTab(PORTAL_TABS[index].id);
    }
  };

  const handleRunAudit = async (category: string, desc: string) => {
    setIsAuditing(true);
    setAuditResult(null);
    setIsArchived(false);
    try {
      const res = await runSpecialistDiagnostic(category, desc);
      setAuditResult(res);
    } catch (e) {
      setAuditResult({ text: "Oracle Handshake Interrupted. Registry sync recommended." });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleAnchorToLedger = async () => {
    if (!auditResult || isArchiving || isArchived || !activeBrand) return;
    
    setIsArchiving(true);
    try {
      const shardHash = `0x${generateQuickHash()}`;
      const newShard: Partial<MediaShard> = {
        title: `BRAND_AUDIT: ${activeBrand.name}`,
        type: 'ORACLE',
        source: `${activeBrand.name} Portal`,
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: shardHash,
        mImpact: (1.42 + Math.random() * 0.05).toFixed(2),
        size: '1.1 KB',
        content: auditResult.text
      };
      
      await saveCollectionItem('media_ledger', newShard);
      setIsArchived(true);
      onDeposit(10, 'BRAND_MISSION_LEDGER_ANCHOR');
    } catch (e) {
      alert("LEDGER_FAILURE: Finality check failed.");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDownloadReport = () => {
    if (!auditResult || !activeBrand) return;
    const shardId = `0x${generateQuickHash()}`;
    const report = `
ENVIROSAGRO™ BRAND MISSION SHARD
=================================
REGISTRY_ID: ${shardId}
BRAND_NODE: ${activeBrand.name}
STEWARD_AUTH: ${user.esin}
THRUST: ${activeBrand.thrust.toUpperCase()}
TIMESTAMP: ${new Date().toISOString()}

VETTING VERDICT:
-------------------
${auditResult.text}

-------------------
(c) 2025 EA_ROOT_NODE. Secure Shard Finality.
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BRAND_AUDIT_${activeBrand.name}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderBrandPortal = () => {
    if (!activeBrand) return null;
    const accentColor = activeBrand.color.replace('text-', '');
    const activeIndex = PORTAL_TABS.findIndex(t => t.id === portalTab);

    return (
      <div className="fixed inset-0 z-[500] bg-black/98 backdrop-blur-3xl animate-in zoom-in duration-300 flex flex-col overflow-hidden">
        {/* Portal Header HUD */}
        <div className={`p-4 md:p-6 border-b border-${accentColor}-500/20 bg-black/60 flex items-center justify-between shrink-0 relative overflow-hidden`}>
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className={`w-full h-[1px] bg-${accentColor}-500 absolute top-0 animate-scan`}></div>
           </div>
           
           {/* Section Progress Rail */}
           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 overflow-hidden">
              <div 
                className={`h-full bg-${accentColor}-500 transition-all duration-700 ease-out shadow-[0_0_10px_currentColor]`} 
                style={{ width: `${((activeIndex + 1) / PORTAL_TABS.length) * 100}%` }}
              ></div>
           </div>

           <div className="flex items-center gap-6 relative z-10">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-${accentColor}-600 flex items-center justify-center text-white shadow-2xl border-2 border-white/10`}>
                 <activeBrand.icon size={28} />
              </div>
              <div>
                 <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{activeBrand.name}</h2>
                    <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase border border-${accentColor}-500/30 bg-${accentColor}-500/10 ${activeBrand.color} tracking-widest`}>
                       {activeBrand.thrust}
                    </span>
                 </div>
                 <p className="text-slate-600 font-mono text-[8px] uppercase tracking-[0.4em] mt-1">NODE_{user.esin} // SHARD_{portalTab.toUpperCase()}</p>
              </div>
           </div>
           <button 
             onClick={() => setActiveBrand(null)}
             className={`p-3 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all active:scale-90 shadow-2xl`}
           >
              <X size={20} />
           </button>
        </div>

        {/* Portal Body - Horizontal Slide Layout */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
           
           {/* Navigation Sidebar */}
           <div className={`w-full md:w-60 border-r border-${accentColor}-500/10 bg-black/40 p-4 md:p-6 space-y-6 shrink-0`}>
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest px-4">Portal Ingests</p>
                 {PORTAL_TABS.map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => scrollToSection(tab.id)}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${portalTab === tab.id ? `bg-${accentColor}-600 text-white shadow-xl` : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
                    >
                       <tab.icon size={16} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                    </button>
                 ))}
              </div>

              <div className={`p-5 rounded-[28px] border border-${accentColor}-500/20 bg-${accentColor}-500/5 space-y-4 shadow-xl hidden md:block`}>
                 <div className="flex items-center gap-3">
                    <Activity size={14} className={activeBrand.color} />
                    <h4 className="text-[9px] font-black text-white uppercase tracking-widest">Shard Status</h4>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-600">
                       <span>Registry Load</span>
                       <span className={activeBrand.color}>NOMINAL</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full bg-${accentColor}-500 animate-pulse`} style={{ width: '84%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Content Area - Horizontal Flex Scroll */}
           <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-x-auto flex snap-x snap-mandatory scrollbar-hide bg-black/20"
           >
              
              {/* HUB VIEW */}
              <section id="portal-home" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div className="space-y-10 animate-in fade-in duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className={`glass-card p-8 rounded-[48px] border border-white/5 bg-white/[0.01] space-y-8 shadow-2xl relative overflow-hidden group`}>
                         <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Leaf size={200} /></div>
                         <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter m-0">Mission <span className={activeBrand.color}>Abstract</span></h3>
                         <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                            "{activeBrand.desc}"
                         </p>
                         <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3">
                            <span className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[8px] font-black uppercase text-slate-600 tracking-widest">{activeBrand.volume}</span>
                            <span className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[8px] font-black uppercase text-slate-600 tracking-widest">ZK_PROVEN</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                         {[
                           { l: 'Network APY', v: '+18.4%', i: TrendingUp, c: 'text-emerald-400' },
                           { l: 'Consensus', v: '99.9%', i: ShieldCheckIcon, c: 'text-blue-400' },
                           { l: 'Drift Index', v: '0.002', i: Gauge, c: 'text-indigo-400' },
                           { l: 'Peer Entropy', v: '1.42x', i: Binary, c: 'text-amber-500' },
                         ].map((s, i) => (
                           <div key={i} className="p-6 glass-card rounded-[32px] border border-white/5 bg-black/40 flex flex-col justify-between group hover:border-white/10 transition-all shadow-lg">
                              <div className="p-2.5 bg-white/5 rounded-xl w-fit group-hover:rotate-6 transition-all">
                                 <s.i size={16} className={s.c} />
                              </div>
                              <div className="mt-4">
                                 <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest mb-1">{s.l}</p>
                                 <p className="text-2xl font-mono font-black text-white">{s.v}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className={`p-10 rounded-[56px] border border-${accentColor}-500/20 bg-${accentColor}-500/[0.03] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl group/action`}>
                      <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
                         <div className={`w-16 h-16 rounded-3xl bg-${accentColor}-600 flex items-center justify-center shadow-xl animate-pulse ring-8 ring-white/5`}>
                            <Zap size={28} className="text-white fill-current" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-xl md:text-2xl font-black text-white uppercase italic m-0">Initialize <span className={activeBrand.color}>{activeBrand.action}</span></h4>
                            <p className="text-slate-500 text-sm font-medium italic">Commence industrial synchronization for this pillar.</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => scrollToSection('audit')}
                        className={`px-12 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/10 ring-8 ring-${accentColor}-500/10`}
                      >
                         EXECUTE MISSION
                      </button>
                   </div>
                </div>
              </section>

              {/* TELEMETRY VIEW */}
              <section id="portal-telemetry" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div className="space-y-8 animate-in fade-in duration-500">
                   <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                      <div className="space-y-2">
                         <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">TELEMETRY <span className={activeBrand.color}>INFLOW</span></h3>
                         <p className="text-slate-600 text-lg font-medium italic">"M2M synchronization of localized industrial shards."</p>
                      </div>
                      <div className={`px-4 py-1 bg-${accentColor}-500/10 border border-${accentColor}-500/20 rounded-full text-${accentColor}-400 font-mono text-[8px] font-black uppercase animate-pulse`}>
                         STREAM_LIVE_0x882A
                      </div>
                   </div>

                   <div className="glass-card rounded-[48px] border border-white/5 bg-black/60 shadow-2xl overflow-hidden flex flex-col min-h-[400px]">
                      <div className="p-6 border-b border-white/10 bg-white/5 grid grid-cols-4 text-[8px] font-black text-slate-600 uppercase tracking-widest italic px-10">
                         <span>Packet Identifier</span>
                         <span>Time Shard</span>
                         <span>Resonance Value</span>
                         <span className="text-right">Auth Status</span>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050706] p-2">
                         {telemetryStream.map((log, i) => (
                            <div key={i} className="grid grid-cols-4 p-6 hover:bg-white/[0.02] transition-all items-center group animate-in slide-in-from-right-2" style={{ animationDelay: `${i * 50}ms` }}>
                               <div className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${activeBrand.color} group-hover:scale-110 transition-all`}>
                                     <Binary size={14} />
                                  </div>
                                  <span className="text-xs font-mono font-bold text-white tracking-widest">{log.id}</span>
                               </div>
                               <span className="text-[10px] text-slate-700 font-mono italic">{log.time}</span>
                               <div className="flex items-center gap-2">
                                  <Activity size={12} className={activeBrand.color} />
                                  <span className="text-lg font-mono font-black text-white">{log.val}</span>
                               </div>
                               <div className="flex justify-end pr-4">
                                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[7px] font-black uppercase tracking-widest">COMMITTED</div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              </section>

              {/* ORACLE AUDIT VIEW */}
              <section id="portal-audit" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 text-center">
                   <div className={`p-10 md:p-16 glass-card rounded-[64px] border border-${accentColor}-500/20 bg-${accentColor}-950/[0.03] relative overflow-hidden flex flex-col items-center gap-10 shadow-3xl group`}>
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none">
                         <Bot size={500} />
                      </div>
                      
                      <div className="relative z-10 space-y-8 w-full">
                         <div className={`w-20 h-20 rounded-[32px] bg-${accentColor}-600 flex items-center justify-center shadow-2xl mx-auto border-2 border-white/10 group-hover:rotate-12 transition-transform duration-700 animate-float`}>
                            <Bot size={40} className="text-white animate-pulse" />
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Institutional <span className={activeBrand.color}>Oracle</span></h3>
                            <p className="text-slate-500 text-lg font-medium italic max-w-xl mx-auto">"Initializing high-frequency diagnostic for {activeBrand.name} mission shards."</p>
                         </div>

                         {!auditResult && !isAuditing ? (
                            <button 
                               onClick={() => handleRunAudit(activeBrand.name, `Perform a full institutional audit on node ${user.esin} within the ${activeBrand.name} brand context.`)}
                               className={`w-full max-w-xs py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/10 ring-8 ring-${accentColor}-500/5`}
                            >
                               <Zap size={18} className="fill-current" />
                               <span className="ml-3">INITIALIZE AUDIT</span>
                            </button>
                         ) : isAuditing ? (
                            <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in zoom-in">
                               <div className="relative">
                                  <Loader2 size={80} className={`text-${accentColor}-500 animate-spin mx-auto`} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                     <Leaf size={24} className={`text-${accentColor}-400 animate-pulse`} />
                                  </div>
                               </div>
                               <p className={`text-${accentColor}-400 font-black text-lg uppercase tracking-[0.4em] animate-pulse italic m-0`}>SEQUENCING SHARDS...</p>
                            </div>
                         ) : (
                            <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-8">
                               <div className={`p-8 md:p-10 bg-black/90 rounded-[48px] border border-${accentColor}-500/20 shadow-2xl border-l-[12px] border-l-${accentColor}-600 relative overflow-hidden group/audit text-left`}>
                                  <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                                     <BadgeCheck size={24} className={`text-${accentColor}-400`} />
                                     <h4 className="text-xl font-black text-white uppercase italic m-0 tracking-tighter">Vetting Verdict</h4>
                                  </div>
                                  <div className="text-slate-400 text-lg leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-6 border-l border-white/5">
                                     {auditResult?.text}
                                  </div>
                               </div>
                               <div className="flex justify-center gap-6">
                                  <button onClick={() => setAuditResult(null)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-all shadow-xl">Discard Shard</button>
                                  <div className="flex gap-4">
                                     <button onClick={handleDownloadReport} className="px-10 py-5 bg-white/5 border-2 border-white/10 rounded-full text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                                        <Download size={20} /> Download
                                     </button>
                                     <button 
                                       onClick={handleAnchorToLedger}
                                       disabled={isArchiving || isArchived}
                                       className={`px-16 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ${isArchived ? 'bg-emerald-600/50 border-emerald-500/50 ring-emerald-500/10' : 'agro-gradient ring-white/5'}`}
                                     >
                                        {isArchiving ? <Loader2 size={24} className="animate-spin" /> : isArchived ? <CheckCircle2 size={24} /> : <Stamp size={24} />}
                                        {isArchived ? 'ANCHORED' : 'ANCHOR TO LEDGER'}
                                     </button>
                                  </div>
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                </div>
              </section>

              {/* ASSET SHARDS VIEW */}
              <section id="portal-shards" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12">
                <div className="space-y-8 animate-in fade-in duration-500">
                   <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">REGISTRY <span className={activeBrand.color}>ASSETS</span></h3>
                         <p className="text-slate-600 text-lg font-medium italic">"Audit of provisioned resources sharded through this node."</p>
                      </div>
                      <button className={`px-8 py-4 bg-${accentColor}-600 rounded-full text-white font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-${accentColor}-500 transition-all flex items-center gap-2`}>
                         <Download size={14} /> Export Registry
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                         <div key={i} className="p-8 glass-card rounded-[40px] border border-white/5 hover:border-white/20 bg-black/40 flex flex-col justify-between min-h-[300px] relative overflow-hidden group shadow-xl transition-all">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.01] group-hover:scale-110 transition-transform"><Database size={150} /></div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                               <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${activeBrand.color} shadow-inner`}>
                                  <Box size={20} />
                               </div>
                               <span className="text-[9px] font-mono text-slate-800 font-black uppercase">SH_0x{generateQuickHash(4)}</span>
                            </div>
                            <div className="space-y-2 relative z-10">
                               <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors">Resource Unit #0{i}</h4>
                               <p className="text-[10px] text-slate-600 font-medium italic leading-relaxed">"Verified biological asset provisioned for the ${activeBrand.name} cycle."</p>
                            </div>
                            <div className="pt-6 border-t border-white/5 mt-auto relative z-10 flex justify-between items-center">
                               <div className="flex items-center gap-2">
                                  <Activity size={12} className="text-emerald-500" />
                                  <span className="text-[9px] font-mono font-black text-emerald-500">SYNC_OK</span>
                               </div>
                               <button className={`p-3 bg-white/5 rounded-xl text-slate-700 hover:${activeBrand.color} transition-colors`}><Maximize2 size={16} /></button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              </section>

           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 overflow-x-hidden relative">
      
      <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none overflow-hidden z-0">
         <div className="w-full h-[1px] bg-emerald-500/10 absolute top-0 animate-scan"></div>
      </div>

      {/* Multiverse Header HUD */}
      <div className="px-4">
        <div className="glass-card p-8 md:p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-3xl z-10 backdrop-blur-3xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s] pointer-events-none">
              <Globe className="w-[600px] h-[600px] text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] md:rounded-[56px] bg-emerald-600 shadow-[0_0_80px_rgba(16,185,129,0.3)] flex items-center justify-center ring-4 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Layers size={64} className="text-white animate-float" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[40px] md:rounded-[56px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-4 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner italic">MULTIVERSE_CORE_v6.5</span>
                    <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20 shadow-inner italic">QUORUM_VERIFIED</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-[0.85] drop-shadow-2xl">BRAND <br/> <span className="text-emerald-400">MULTIVERSE.</span></h2>
              </div>
              <p className="text-slate-500 text-lg md:text-xl font-medium italic leading-relaxed max-w-3xl opacity-90 group-hover:opacity-100 transition-opacity">
                 "The EnvirosAgro network operates as a synchronized multiverse of specialized pillars. Each brand node provides unique industrial finality to the global agrarian quorum."
              </p>
           </div>
        </div>
      </div>

      {/* Multiverse Navigation Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 relative z-20">
         <div className="flex flex-nowrap gap-3 p-1 glass-card rounded-[32px] border border-white/5 bg-black/40 shadow-2xl overflow-x-auto scrollbar-hide snap-x w-full md:w-auto px-6">
           <button 
             onClick={() => setFilter('all')} 
             className={`px-8 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === 'all' ? 'bg-emerald-600 text-white shadow-xl scale-105 border-b-2 border-emerald-400 ring-4 ring-emerald-500/5' : 'text-slate-600 hover:text-white'}`}
           >
              MULTIVERSE CENTER
           </button>
           {Object.entries(THRUST_METADATA).map(([key, meta]: [any, any]) => (
             <button 
               key={key} 
               onClick={() => setFilter(key)} 
               className={`flex items-center gap-3 px-6 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === key ? 'bg-emerald-600 text-white shadow-xl scale-105 border-b-2 border-emerald-400 ring-4 ring-emerald-500/5' : 'text-slate-600 hover:text-white'}`}
             >
                <meta.icon size={16} /> {meta.label}
             </button>
           ))}
         </div>
      </div>

      {/* Grid of Brand Nodes */}
      <div className="flex md:grid md:grid-cols-2 xl:grid-cols-3 gap-8 px-4 overflow-x-auto md:overflow-visible scrollbar-hide snap-x scroll-across pb-16 relative z-10">
        {filteredBrands.map((brand) => (
          <div 
            key={brand.id} 
            onClick={() => handlePortalLaunch(brand)} 
            className="min-w-[300px] md:min-w-0 snap-center glass-card p-10 rounded-[64px] group hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col min-h-[400px] overflow-hidden bg-black/40 shadow-3xl relative active:scale-[0.98] duration-300"
          >
            <div className={`absolute -bottom-10 -right-10 p-12 opacity-[0.01] group-hover:opacity-[0.03] group-hover:scale-125 transition-all duration-[10s] pointer-events-none ${brand.color}`}>
              <brand.icon size={300} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className={`w-20 h-20 rounded-[28px] ${brand.bg} flex items-center justify-center mb-8 group-hover:rotate-6 transition-all duration-700 border border-white/5 shadow-2xl relative overflow-hidden`}>
              <brand.icon className={`w-10 h-10 ${brand.color} relative z-10 drop-shadow-2xl`} />
            </div>
            
            <div className="flex-1 space-y-4 relative z-10">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-white uppercase italic leading-none tracking-tighter group-hover:text-emerald-400 transition-colors m-0 drop-shadow-2xl">{brand.name}</h3>
                    <p className="text-[9px] text-slate-700 font-mono font-black uppercase tracking-widest italic mt-2">ID: {brand.id.toUpperCase()}</p>
                  </div>
                  <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-700 uppercase tracking-widest group-hover:${brand.color} transition-colors`}>{brand.thrust}</span>
               </div>
               <p className="text-slate-500 text-lg font-medium mt-6 line-clamp-4 italic leading-relaxed opacity-80 group-hover:opacity-100 transition-all">
                  "{brand.desc}"
               </p>
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between text-slate-800 group-hover:text-emerald-400 transition-all relative z-10">
               <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl">
                    <ArrowRight size={20} /> 
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">SYNC</span>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black text-slate-900 uppercase mb-1">AGGREGATE</p>
                  <span className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-700 group-hover:text-white transition-colors">{brand.volume}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Syncing Overlay */}
      {isSyncing && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-300">
           <div className="relative">
              <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Leaf className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
           </div>
           <div className="space-y-2 text-center">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter animate-pulse">ESTABLISHING <span className="text-emerald-400">HANDSHAKE...</span></h3>
              <p className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.8em]">ZK_ENCRYPTED_TUNNEL</p>
           </div>
        </div>
      )}

      {/* Brand Portal Renderer */}
      {activeBrand && renderBrandPortal()}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Ecosystem;