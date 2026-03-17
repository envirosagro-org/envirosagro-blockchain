import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, Sun, Moon, CloudRain, Snowflake, Wheat, 
  Sprout, Music, Radio, Zap, Heart, ShieldCheck, Landmark, 
  History, Info, ChevronRight, Binary, Target, Activity, 
  Bot, Leaf, CheckCircle2, Waves, Flame, Timer, 
  Play, Pause, RotateCcw, Droplets,
  Loader2,
  X,
  FileText,
  ArrowRight,
  Database,
  TrendingUp,
  Sunrise,
  Sunset,
  Ear,
  Wind,
  BadgeCheck,
  ExternalLink,
  MapPin,
  Cloud,
  ThermometerSun,
  RefreshCw,
  ShieldAlert,
  Gavel,
  ShieldPlus,
  Atom,
  Fingerprint,
  Stamp,
  AudioWaveform,
  Volume2,
  Trash2,
  CalendarDays,
  ListTodo,
  CalendarCheck,
  Link2,
  BellRing,
  Factory
} from 'lucide-react';
import { User, SignalShard, ViewState } from '../types';
import { getWeatherForecast, chatWithAgroLang, AgroLangResponse } from '../services/agroLangService';

interface AgroCalendarProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
  onNavigate: (view: ViewState) => void;
  signals?: SignalShard[];
}

const SEASONS = [
  {
    id: 'awakening',
    index: '01',
    name: 'Season of Awakening',
    kikuyu: 'Mbura ya Njahi (Long Rains)',
    months: 'MAR – MAY',
    biblical: 'PASSOVER & FIRST FRUITS',
    formula: 'DN (DENSITY) MAX',
    icon: CloudRain,
    color: 'text-emerald-400',
    accent: 'emerald',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    music: 'Genesis Hum (432 Hz)',
    state: 'Stomata opening, photosynthesis peak.',
    ritual: 'Seed Blessing with Medicag stims.',
    freq: '432',
    isSabbath: false
  },
  {
    id: 'resilience',
    index: '02',
    name: 'Season of Resilience',
    kikuyu: 'Gathano (Cold Season)',
    months: 'JUN – AUG',
    biblical: 'SHAVUOT (PENTECOST)',
    formula: 'S (STRESS) MIN',
    icon: Snowflake,
    color: 'text-blue-400',
    accent: 'blue',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    music: 'Resilience Rhythm (Binaural)',
    state: 'Steady sap flow, structural building.',
    ritual: 'Agroboto Automated Pruning.',
    freq: '528',
    isSabbath: true
  },
  {
    id: 'ingathering',
    index: '03',
    name: 'The Great Ingathering',
    kikuyu: 'Theu (Plentiful Harvest)',
    months: 'SEP – OCT',
    biblical: 'SUKKOT (TABERNACLES)',
    formula: 'IN (INTENSITY) MAX',
    icon: Wheat,
    color: 'text-amber-400',
    accent: 'amber',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    music: 'Harmonic Orchestral',
    state: 'Peak bio-mass, energy complexity.',
    ritual: 'Tokenization of glory weight.',
    freq: '639',
    isSabbath: false
  },
  {
    id: 'promise',
    index: '04',
    name: 'The Second Rain',
    kikuyu: 'Mbura ya Mwere (Short Rains)',
    months: 'OCT – DEC',
    biblical: 'ADVENT / HANUKKAH',
    formula: 'CA (CUMULATIVE) MAX',
    icon: Sprout,
    color: 'text-indigo-400',
    accent: 'indigo',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    music: 'Deep Bass / Ambient',
    state: 'Root focus, soil nutrient lock.',
    ritual: 'Soil Sabbath & Cover Sowing.',
    freq: '396',
    isSabbath: true
  }
];

const DAILY_OFFICES = [
  { id: 'awakening', time: '06:00', name: 'Awakening', liturgical: 'Matins', state: 'Stomata opening.', icon: Sunrise, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', desc: 'Syncing biological intent with first light.' },
  { id: 'sext', time: '12:00', name: 'Sext', liturgical: 'High Sun', state: 'Peak transpiration.', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', desc: 'Peak energy conversion. Monitor m-Constant drift.' },
  { id: 'vesper', time: '18:00', name: 'Vesper', liturgical: 'Evening', state: 'Stomata closing.', icon: Sunset, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', desc: 'Registry anchor. Transmitting daily harvest shards.' },
  { id: 'watch', time: '00:00', name: 'The Watch', liturgical: 'Vigils', state: 'Molecular repair.', icon: Moon, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20', desc: 'Cellular soil repair. Oracle resonance peak.' },
];

const AgroCalendar: React.FC<AgroCalendarProps> = ({ user, onEarnEAC, onSpendEAC, onEmitSignal, onNavigate, signals = [] }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'seasonal' | 'jit'>('daily');
  const [activeSeason, setActiveSeason] = useState<typeof SEASONS[0] | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<AgroLangResponse | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [liturgicalShard, setLiturgicalShard] = useState<string | null>(null);
  const [isForgingShard, setIsForgingShard] = useState(false);

  // JIT Integration States
  const calendarSignals = useMemo(() => {
    return signals.filter(s => s.dispatchLayers.some(l => l.channel === 'CALENDAR'));
  }, [signals]);
  const [isLinking, setIsLinking] = useState(false);
  const [isCalendarLinked, setIsCalendarLinked] = useState(false);
  const [externalEvents, setExternalEvents] = useState([
    { id: 'ext-1', title: 'Nairobi Ingest Audit', time: '14:30', pillar: 'Industry', icon: Factory },
    { id: 'ext-2', title: 'Zone 4 Moisture Check', time: '16:00', pillar: 'Environmental', icon: Droplets }
  ]);

  const pulseSchedule = useMemo(() => [
    { id: 'P1', label: 'EAC MINT QUORUM', time: 'T+4m', status: 'WAITING', type: 'CORE' },
    { id: 'P2', label: 'SABBATH RECALIBRATION', time: 'T+12m', status: 'PLANNED', type: 'LAW' },
    { id: 'P3', label: 'ZONE 4 SPECTRAL SYNC', time: 'T+24m', status: 'PLANNED', type: 'IOT' },
    { id: 'P4', label: 'MARKET ALPHA RE-SYNC', time: 'T+42m', status: 'PLANNED', type: 'ECO' },
  ], []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchWeather();
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const data = await getWeatherForecast(user.location);
      setWeatherData(data);
    } catch (e) {
      console.error("Weather ingest failed");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const currentOffice = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return DAILY_OFFICES[0];
    if (hour >= 12 && hour < 18) return DAILY_OFFICES[1];
    if (hour >= 18 && hour < 24) return DAILY_OFFICES[2];
    return DAILY_OFFICES[3];
  }, [currentTime]);

  const handleSyncLiturgy = async () => {
    const fee = 10;
    if (!await onSpendEAC(fee, `DAILY_OFFICE_SYNC_${currentOffice.liturgical.toUpperCase()}`)) return;

    setIsSyncing(true);
    setIsForgingShard(true);
    setLiturgicalShard(null);

    try {
      const prompt = `Act as the EnvirosAgro Liturgical Oracle. Provide a daily office shard for a steward.
      Current Office: ${currentOffice.liturgical} (${currentOffice.name})
      Status: ${currentOffice.state}
      Location: ${user.location}
      Season: ${SEASONS.find(s => s.months.includes(currentTime.toLocaleString('en-US', { month: 'short' }).toUpperCase()))?.name}
      
      Generate a 3-paragraph "Liturgical Shard" that combines spiritual stewardship with technical agricultural guidance.`;
      
      const res = await chatWithAgroLang(prompt, []);
      setLiturgicalShard(res.text);
      
      await onEmitSignal({
        type: 'liturgical',
        origin: 'CALENDAR',
        title: `JIT_OFFICE: ${currentOffice.name.toUpperCase()}`,
        message: `Oracle consensus reached for the ${currentOffice.liturgical} cycle. Execute biometrics adjustment immediately.`,
        priority: 'high',
        actionLabel: 'View Shard',
        meta: { target: 'agro_calendar' }
      });

      onEarnEAC(15, 'LITURGICAL_ORACLE_CONSENSUS');
    } catch (e) {
      setLiturgicalShard("Oracle sync interrupted. Maintain current biometrics until next cycle.");
    } finally {
      setIsSyncing(false);
      setIsForgingShard(false);
    }
  };

  const handleLinkCalendar = () => {
    setIsLinking(true);
    setTimeout(() => {
      setIsCalendarLinked(true);
      setIsLinking(false);
      onEmitSignal({
        type: 'system',
        origin: 'EXTERNAL',
        title: 'GOOGLE_CALENDAR_INGEST',
        message: 'External schedule shards adsorbed into liturgical terminal. JIT triggers active.',
        priority: 'medium'
      });
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-32 max-w-[1400px] mx-auto relative px-4">
      
      {/* 1. Portal Header HUD */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl z-10 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <Clock className="w-96 h-96 text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-28 h-28 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-pulse ring-[15px] ring-white/5 shrink-0">
               <Calendar className="w-14 h-14 text-white" />
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Liturgical <span className="text-emerald-400">Registry</span></h2>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
                 Synchronizing ancestral agricultural wisdom with the **Agro Musika** daily office and seasonal Equation focuses.
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0">
            <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">REGISTRY_CLOCK_v6.5</p>
            <p className="text-7xl font-mono font-black text-white tracking-tighter leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
         </div>
      </div>

      {/* 2. Mode Navigation */}
      <div className="flex justify-center">
         <div className="flex p-2 glass-card rounded-[32px] bg-black/40 border border-white/5 shadow-2xl">
            {[
              { id: 'daily', label: 'DAILY OFFICE' },
              { id: 'seasonal', label: 'SEASONAL SYNC' },
              { id: 'jit', label: 'JIT TERMINAL' }
            ].map((mode) => (
              <button 
                key={mode.id} 
                onClick={() => setActiveTab(mode.id as any)}
                className={`px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-[0.4em] transition-all ${activeTab === mode.id ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
              >
                {mode.label}
              </button>
            ))}
         </div>
      </div>

      <div className="min-h-[700px]">
        {/* TAB: DAILY OFFICE SYNC */}
        {activeTab === 'daily' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
             
             {/* Main Dashboard Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left: Active Office Control & Weather HUD */}
                <div className="lg:col-span-4 space-y-8">
                   <div className={`glass-card p-10 rounded-[56px] border-2 transition-all duration-1000 bg-black/40 shadow-3xl relative overflow-hidden flex flex-col items-center text-center ${currentOffice.border}`}>
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] animate-spin-slow"><currentOffice.icon size={300} /></div>
                      
                      <div className="space-y-4 relative z-10">
                         <div className={`w-24 h-24 rounded-3xl ${currentOffice.bg} border ${currentOffice.border} flex items-center justify-center mx-auto shadow-2xl`}>
                            <currentOffice.icon size={48} className={currentOffice.color} />
                         </div>
                         <div className="space-y-1">
                            <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${currentOffice.color}`}>{currentOffice.liturgical}</span>
                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{currentOffice.name}</h3>
                         </div>
                         <p className="text-slate-400 italic text-sm px-4">"{currentOffice.desc}"</p>
                      </div>

                      <div className="w-full mt-10 pt-10 border-t border-white/5 space-y-6 relative z-10">
                         <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-2 shadow-inner">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Biological Status</p>
                            <p className="text-lg font-bold text-white uppercase italic">{currentOffice.state}</p>
                         </div>
                         <button 
                           onClick={handleSyncLiturgy}
                           disabled={isSyncing}
                           className="w-full py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 border-2 border-white/10 ring-8 ring-white/5"
                         >
                            {isSyncing ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
                            {isSyncing ? 'SYNCHRONIZING...' : 'SYNC DAILY OFFICE'}
                         </button>
                      </div>
                   </div>

                   {/* NEW WEATHER HUD SHARD */}
                   <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Cloud size={200} className="text-emerald-400" /></div>
                      <div className="flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-600/10 rounded-2xl border border-emerald-500/20"><Wind size={24} className="text-emerald-400" /></div>
                            <h4 className="text-xl font-black text-white uppercase italic">Weather <span className="text-emerald-400">Shard</span></h4>
                         </div>
                         <button onClick={fetchWeather} disabled={isLoadingWeather} className="p-2 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                            {isLoadingWeather ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                         </button>
                      </div>
                      
                      <div className="space-y-6 relative z-10">
                         {weatherData ? (
                            <div className="animate-in fade-in zoom-in duration-700">
                               <div className="flex items-baseline gap-4 mb-6">
                                  <p className="text-6xl font-mono font-black text-white tracking-tighter">24<span className="text-2xl text-emerald-600 italic ml-1">°C</span></p>
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Optimal Ingest</span>
                                     <span className="text-[8px] text-slate-500 font-mono mt-1">LAT: {user.location.split(',')[0]}</span>
                                  </div>
                               </div>
                               <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-4 shadow-inner">
                                  <div className="flex justify-between items-center px-2">
                                     <div className="flex items-center gap-3">
                                        <Droplets size={14} className="text-blue-400" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase">Humidity Shard</span>
                                     </div>
                                     <span className="text-xs font-mono font-black text-white">62%</span>
                                  </div>
                                  <div className="flex justify-between items-center px-2">
                                     <div className="flex items-center gap-3">
                                        <Wind size={14} className="text-indigo-400" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase">Wind Velocity</span>
                                     </div>
                                     <span className="text-xs font-mono font-black text-white">12 km/h</span>
                                  </div>
                               </div>
                               {weatherData.sources && (
                                  <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                                     {weatherData.sources.slice(0, 2).map((s: any, idx: number) => (
                                        <a key={idx} href={s.web?.uri || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[7px] text-slate-500 hover:text-white transition-all">
                                           <ExternalLink size={8} /> {s.web?.title?.substring(0, 15)}...
                                        </a>
                                     ))}
                                  </div>
                               )}
                            </div>
                         ) : (
                            <div className="py-10 text-center opacity-30 flex flex-col items-center gap-4">
                               <ThermometerSun size={48} className="text-slate-600 animate-pulse" />
                               <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Weather Shard...</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>

                {/* Right: Liturgy Terminal & Timeline */}
                <div className="lg:col-span-8 space-y-10">
                   {/* 24-Hour Timeline */}
                   <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 shadow-3xl space-y-8">
                      <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] px-4 italic">24_HOUR_AGRICULTURAL_OFFICE</h4>
                      <div className="flex justify-between items-center px-4 relative">
                         <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 rounded-full"></div>
                         <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full shadow-[0_0_15px_#10b981] transition-all duration-[10s]" style={{ width: `${(currentTime.getHours() / 24) * 100}%` }}></div>
                         
                         {DAILY_OFFICES.map(off => {
                            const isActive = currentOffice.id === off.id;
                            return (
                              <div key={off.id} className="relative z-10 flex flex-col items-center gap-4">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-1000 ${isActive ? `bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.4)] scale-110` : `bg-[#050706] border-white/10 text-slate-700`}`}>
                                    <off.icon size={24} />
                                 </div>
                                 <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-slate-700'}`}>{off.liturgical}</span>
                                 <span className="text-[8px] font-mono text-slate-800">{off.time}</span>
                              </div>
                            );
                         })}
                      </div>
                   </div>

                   {/* Oracle Liturgical Shard */}
                   <div className="glass-card rounded-[64px] border-2 border-white/5 bg-[#050706] min-h-[500px] flex flex-col relative overflow-hidden shadow-3xl">
                      <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none z-0">
                         <div className="w-full h-[2px] bg-emerald-500/10 absolute top-0 animate-scan"></div>
                      </div>

                      <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-10">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-emerald-600 rounded-[28px] shadow-3xl border border-white/10 group-hover:rotate-12 transition-transform">
                               <Bot size={32} className="text-white animate-pulse" />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Liturgical <span className="text-emerald-400">Shard</span></h3>
                               <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-3">ZK_OFFICE_VERDICT // RE_GEN_5.0</p>
                            </div>
                         </div>
                         {liturgicalShard && <button onClick={() => setLiturgicalShard(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-700 hover:text-white"><Trash2 size={20}/></button>}
                      </div>

                      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-10">
                         {isForgingShard ? (
                           <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                              <div className="relative">
                                 <Loader2 size={120} className="text-emerald-500 animate-spin mx-auto" />
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <Leaf className="w-12 h-12 text-emerald-400 animate-pulse" />
                                 </div>
                              </div>
                              <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">FORGING_LITURGICAL_SHARD...</p>
                           </div>
                         ) : liturgicalShard ? (
                           <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12">
                              <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-2 border-emerald-500/20 prose prose-invert prose-emerald max-w-none shadow-3xl border-l-[16px] border-l-emerald-600 relative overflow-hidden group/shard">
                                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/shard:scale-110 transition-transform duration-[12s]"><Atom size={600} className="text-emerald-400" /></div>
                                 <div className="text-slate-300 text-2xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-4">
                                    {liturgicalShard}
                                 </div>
                              </div>
                              <div className="flex justify-center gap-8">
                                 <button onClick={() => setLiturgicalShard(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                                 <button className="px-20 py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5 border-2 border-white/10">
                                    <Stamp size={24} /> ANCHOR TO LEDGER
                                 </button>
                              </div>
                           </div>
                         ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center space-y-12 py-20 opacity-20 group">
                              <div className="relative">
                                 <History size={140} className="text-slate-600 group-hover:text-emerald-400 transition-colors duration-1000" />
                                 <div className="absolute inset-[-40px] border-4 border-dashed border-white/10 rounded-full scale-125 animate-spin-slow"></div>
                              </div>
                              <div className="space-y-4">
                                 <p className="text-5xl font-black uppercase tracking-[0.6em] text-white italic">SHARD_STANDBY</p>
                                 <p className="text-xl font-bold italic text-slate-700 uppercase tracking-widest">Invoke the Liturgical Oracle to sync this hour's biometrics</p>
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB: SEASONAL OFFICE */}
        {activeTab === 'seasonal' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-700">
              {SEASONS.map((season) => (
                <div key={season.id} className="p-12 glass-card rounded-[64px] border border-white/5 bg-black/60 shadow-3xl relative overflow-hidden group hover:border-white/20 transition-all">
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className={`p-5 rounded-3xl ${season.bg} border ${season.border} group-hover:rotate-6 transition-all shadow-2xl`}>
                      <season.icon className={`w-10 h-10 ${season.color}`} />
                    </div>
                    <div className="flex gap-2">
                       {season.isSabbath && <span className="px-3 py-1 bg-rose-600 text-white text-[8px] font-black uppercase rounded-lg shadow-xl">FALLOW_CYCLE</span>}
                       <span className={`px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest ${season.color}`}>{season.months}</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{season.name}</h3>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4 flex items-center gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                     {season.kikuyu}
                  </p>
                  <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
                     <button onClick={() => setActiveSeason(season)} className={`text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 transition-all ${season.color} hover:text-white`}>
                        View Full Protocol <ChevronRight size={16} />
                     </button>
                  </div>
                </div>
              ))}
           </div>
        )}

        {/* TAB: JIT TERMINAL (INTEGRATED) */}
        {activeTab === 'jit' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-top-6 duration-700">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-3xl">
                    <div className="flex items-center gap-6">
                       <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl"><Link2 className="w-8 h-8 text-white" /></div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Schedule <span className="text-indigo-400">Ingest</span></h3>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2">EXTERNAL_CALENDAR_BRIDGE</p>
                       </div>
                    </div>
                    
                    {!isCalendarLinked ? (
                       <div className="space-y-6">
                          <div className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center space-y-4">
                             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                                <img src="https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png" alt="Google Cal" className="w-8 h-8" />
                             </div>
                             <p className="text-xs text-slate-400 italic">"Adsorb external task shards and memos into your liturgical office flow."</p>
                          </div>
                          <button 
                            onClick={handleLinkCalendar}
                            disabled={isLinking}
                            className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all flex items-center justify-center gap-4"
                          >
                             {isLinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
                             {isLinking ? 'ESTABLISHING BRIDGE...' : 'CONNECT GOOGLE CALENDAR'}
                          </button>
                       </div>
                    ) : (
                       <div className="space-y-6 animate-in zoom-in duration-500">
                          <div className="p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-3xl flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <CheckCircle2 className="text-emerald-400" />
                                <span className="text-xs font-black text-white">CALENDAR_SYNC_LIVE</span>
                             </div>
                             <button onClick={() => setIsCalendarLinked(false)} className="text-slate-600 hover:text-rose-500"><X size={14}/></button>
                          </div>
                          <div className="space-y-4">
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Ingested Shards</p>
                             {externalEvents.map(ev => (
                                <div key={ev.id} className="p-6 bg-black/40 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                                   <div className="flex items-center gap-4">
                                      <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400"><ev.icon size={16} /></div>
                                      <div>
                                         <p className="text-sm font-black text-white uppercase italic leading-none">{ev.title}</p>
                                         <p className="text-[9px] text-slate-600 font-mono mt-1.5 uppercase">{ev.pillar} // {ev.time}</p>
                                      </div>
                                   </div>
                                   <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
              </div>

              <div className="lg:col-span-8 space-y-10">
                 <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-[#050706] shadow-3xl relative overflow-hidden min-h-[600px] flex flex-col">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <BellRing className="text-indigo-400" />
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">JIT <span className="text-indigo-400">Trigger Terminal</span></h3>
                       </div>
                       <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">SCHEDULE_SYNC_NOMINAL</span>
                    </div>

                    <div className="flex-1 p-12 space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                             <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-4 italic">Upcoming_Resonance_shifts</h4>
                             <div className="space-y-4">
                                {pulseSchedule.map(s => (
                                   <div key={s.id} className="p-8 bg-white/[0.02] border border-white/10 rounded-[44px] flex items-center justify-between group hover:bg-indigo-600/5 transition-all">
                                      <div className="flex items-center gap-6">
                                         <div className="p-4 bg-indigo-600/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform"><Clock size={20}/></div>
                                         <div>
                                            <p className="text-lg font-black text-white uppercase italic leading-none">{s.label}</p>
                                            <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase">TYPE: {s.type} // {s.id}</p>
                                         </div>
                                      </div>
                                      <div className="text-right">
                                         <p className="text-2xl font-mono font-black text-white">{s.time}</p>
                                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{s.status}</span>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-6">
                             <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-4 italic">Temporal_Signal_Quorum</h4>
                             <div className="space-y-4">
                                {calendarSignals.length > 0 ? calendarSignals.map(signal => (
                                   <div key={signal.id} className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[44px] flex items-center justify-between group hover:bg-indigo-600/10 transition-all">
                                      <div className="flex items-center gap-6">
                                         <div className={`p-4 rounded-2xl ${signal.priority === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                            <BellRing size={20}/>
                                         </div>
                                         <div>
                                            <p className="text-lg font-black text-white uppercase italic leading-none">{signal.title}</p>
                                            <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase">{signal.message.substring(0, 40)}...</p>
                                         </div>
                                      </div>
                                      <div className="text-right">
                                         <p className="text-sm font-mono font-black text-white">{new Date(signal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                         <span className={`text-[8px] font-black uppercase tracking-widest ${signal.priority === 'critical' ? 'text-red-400' : 'text-indigo-400'}`}>{signal.priority}</span>
                                      </div>
                                   </div>
                                )) : (
                                   <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[44px]">
                                      <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">No_Temporal_Signals</p>
                                   </div>
                                )}
                             </div>
                          </div>

                          <div className="space-y-6">
                             <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-4 italic">Active_Liturgical_Memos</h4>
                             <div className="p-10 bg-indigo-950/20 border-2 border-indigo-500/20 rounded-[56px] space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><History size={200} className="text-indigo-400" /></div>
                                <div className="flex items-center gap-4 relative z-10">
                                   <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl border border-white/10"><Bot size={24} className="text-white" /></div>
                                   <h5 className="text-xl font-black text-white uppercase italic">Calendar Oracle Memo</h5>
                                </div>
                                <p className="text-slate-400 text-lg leading-relaxed italic border-l-4 border-indigo-500/40 pl-8 relative z-10">
                                   "The current Matins cycle suggests high Soil Purity Ingest. Ensure all moisture sensor shards are synchronized before the Sext shift at 12:00."
                                </p>
                                <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
                                   <button onClick={() => onNavigate('network_signals')} className="text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-2">View Full Terminal <ArrowRight size={12}/></button>
                                   <span className="text-[8px] font-mono text-slate-700 font-bold">SHA256: 0x882...MEMO</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Seasonal Detail Modal */}
      {activeSeason && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setActiveSeason(null)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-12 md:p-16 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-10">
                    <div className={`w-20 h-20 rounded-3xl ${activeSeason.bg} border ${activeSeason.border} flex items-center justify-center shadow-3xl shrink-0`}>
                       <activeSeason.icon className={`w-10 h-10 ${activeSeason.color}`} />
                    </div>
                    <div>
                       <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">{activeSeason.name}</h3>
                       <p className={`text-[10px] font-mono tracking-[0.5em] uppercase mt-4 italic leading-none ${activeSeason.color}`}>{activeSeason.kikuyu}</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveSeason(null)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={32} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar space-y-12 bg-black/40">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-10">
                       <div className="p-10 bg-black/60 rounded-[64px] border border-white/5 space-y-6 shadow-inner">
                          <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] border-b border-white/5 pb-4 italic px-2">BIO_STATE_MAPPING</h4>
                          <div className="space-y-4 px-2">
                             <p className="text-slate-300 text-lg italic leading-relaxed">"{activeSeason.state}"</p>
                             <p className="text-slate-300 text-lg italic leading-relaxed">"Ritual Sequence: {activeSeason.ritual}"</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-10">
                       <div className="p-10 bg-black/60 rounded-[64px] border border-white/5 space-y-8 shadow-inner">
                          <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] border-b border-white/5 pb-4 px-2 italic">EQUATION_OPTIMIZATION</h4>
                          <div className="text-center py-4">
                             <p className="text-5xl font-mono font-black text-white italic">{activeSeason.formula}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase mt-6 tracking-widest">Primary Seasonal Anchor</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-12 border-t border-white/5 bg-white/[0.01] flex justify-center">
                 <button onClick={() => setActiveSeason(null)} className="px-20 py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl">Handshake Acknowledged</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.7); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        @keyframes scan { 0% { top: -100%; } 100% { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-spin-slow { animation: rotate 20s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AgroCalendar;