import React, { useState, useMemo } from 'react';
import { 
  Compass, Mountain, Layers, Zap, ShieldCheck, Bot, Leaf, Search, 
  PlusCircle, ArrowRight, Loader2, Activity, Target, Heart, Scale, 
  Trees, Sun, CloudRain, Binary, FileText, BadgeCheck, History, 
  Trash2, RefreshCw, Droplets, Microscope, BoxSelect, User as UserIcon, 
  Sprout, Wheat, Globe, TrendingUp, ChevronRight, Circle, Download, 
  Users, Handshake, X, Stamp, Terminal, Map as MapIcon, Atom, Wind, 
  Coins, Info, Flower2, Crown, Layout, Star, Wand2, ShieldAlert, 
  ArrowUpRight, Flame, CircleDot, Fingerprint, ClipboardCheck, 
  CheckCircle2, BatteryCharging, UtensilsCrossed, Recycle, Home, 
  Waves, Lightbulb, MapPin, ArrowDownCircle, Gauge, Link2, Cookie, 
  Link, Droplet, Dna, Workflow, Box, Monitor, LayoutGrid, Database, Network
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, ViewState, MediaShard, SignalShard } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';

interface PermacultureProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  onEmitSignal?: (signal: Partial<SignalShard>) => Promise<void>;
  notify?: any;
  initialSection?: string | null;
}

const ZONE_SHARDS = [
  { id: 0, name: 'Zone 0: Core Node', desc: 'The steward center. Focus on internal efficiency, waste-to-energy cycles, and personal m-constant calibration.', icon: UserIcon, tasks: ['Energy Audit', 'SID Self-Remediation', 'Bio-Inflow Monitor'], color: 'text-indigo-400', theme: 'indigo' },
  { id: 1, name: 'Zone 1: Daily Ingest', desc: 'Intensive care shards. Small-scale kitchen garden modules and high-frequency herb nodes.', icon: Sprout, tasks: ['Compost Ingest', 'Seed Starting', 'Daily Moisture Check'], color: 'text-emerald-400', theme: 'emerald' },
  { id: 2, name: 'Zone 2: Semi-Intensive', desc: 'Perennial orchards and poultry nodes. Seasonal maintenance cycle with medium sharding frequency.', icon: Trees, tasks: ['Orchard Pruning', 'Water Catchment', 'Poultry Sync'], color: 'text-teal-400', theme: 'teal' },
  { id: 3, name: 'Zone 3: Main Crop', desc: 'The industrial core. Large-scale cash crops and pasture sharding for network trade and liquidity.', icon: Wheat, tasks: ['Harvest Ingest', 'Soil Tilling', 'Pest Swarm Scan'], color: 'text-amber-400', theme: 'amber' },
  { id: 4, name: 'Zone 4: Semi-Wild', desc: 'Managed forests and foraged shards. Minimal interference nodes for timber and long-term EAT growth.', icon: Mountain, tasks: ['Timber Audit', 'Wild Ingest', 'Boundary Repair'], color: 'text-blue-400', theme: 'blue' },
  { id: 5, name: 'Zone 5: Wilderness', desc: 'The primary oracle. Observation-only nodes to calibrate local biometrics against planetary resonance.', icon: Globe, tasks: ['Resonance Mapping', 'Wildlife Count', 'Erosion Audit'], color: 'text-slate-400', theme: 'slate' },
];

const generateZoneTelemetry = (zoneId: number) => {
  const data = [];
  let baseYield = 50 + (zoneId * 10);
  let baseEnergy = 80 - (zoneId * 5);
  for (let i = 0; i < 12; i++) {
    baseYield += (Math.random() - 0.5) * 15;
    baseEnergy += (Math.random() - 0.5) * 10;
    data.push({
      month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
      yield: Math.max(0, Math.min(100, baseYield)),
      energy: Math.max(0, Math.min(100, baseEnergy)),
    });
  }
  return data;
};

const Permaculture: React.FC<PermacultureProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate, onEmitSignal, notify, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'zonation' | 'ethics' | 'lilies' | 'companion' | 'home_agro'>(
    (initialSection as any) || 'zonation'
  );
  const [selectedZone, setSelectedZone] = useState(ZONE_SHARDS[1]);
  const [isSyncingGeofence, setIsSyncingGeofence] = useState(false);

  const zoneTelemetryData = useMemo(() => generateZoneTelemetry(selectedZone.id), [selectedZone.id]);

  const handleSyncGeofence = async () => {
    setIsSyncingGeofence(true);
    if (onEmitSignal) {
      await onEmitSignal({
        type: 'system',
        origin: 'MANUAL',
        title: 'GEOFENCE_SYNC_INITIATED',
        message: `Synchronizing geofence shards for node ${user.esin} in ${selectedZone.name}.`,
        priority: 'medium',
        actionIcon: 'MapPin'
      });
    }

    // Simulate high-fidelity registry handshake
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSyncingGeofence(false);
    onEarnEAC(10, 'GEOFENCE_QUORUM_SYNC_SUCCESS');
    if (notify) {
      notify({ 
        title: 'GEOFENCE_SYNCED', 
        message: 'Registry geofence shards aligned with satellite telemetry.', 
        type: 'system',
        priority: 'medium',
        origin: 'MANUAL'
      });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1500px] mx-auto px-4">
      {/* 1. View Toggles */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[36px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-xl px-6 mx-auto lg:mx-0 relative z-20">
        {[
          { id: 'zonation', label: 'Zonation Shards', icon: Layers },
          { id: 'home_agro', label: 'Home Agro Hub', icon: Home },
          { id: 'lilies', label: 'Lilies Around', icon: Flower2 },
          { id: 'ethics', label: 'Ethical Forge', icon: Scale },
          { id: 'companion', label: 'Companion Oracle', icon: Microscope },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px] relative z-10">
        {activeTab === 'zonation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-700">
             <div className="lg:col-span-5 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-2xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                         <Layers size={24} />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Zonation <span className="text-emerald-400">Registry</span></h3>
                   </div>
                   <div className="space-y-4">
                      {ZONE_SHARDS.map(zone => (
                        <button 
                          key={zone.id}
                          onClick={() => setSelectedZone(zone)}
                          className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${selectedZone.id === zone.id ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-xl scale-105' : 'bg-black/40 border-white/5 text-slate-500 hover:border-emerald-500/20'}`}
                        >
                           <div className="flex items-center gap-6">
                              <div className={`p-4 rounded-2xl transition-all ${selectedZone.id === zone.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 group-hover:rotate-6'} ${zone.color}`}><zone.icon size={24} /></div>
                              <span className="text-lg font-black uppercase text-white tracking-tight italic">{zone.name}</span>
                           </div>
                           <ChevronRight className={`w-6 h-6 transition-transform ${selectedZone.id === zone.id ? 'rotate-90 text-emerald-400' : 'text-slate-800'}`} />
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="lg:col-span-7">
                <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/20 h-full flex flex-col relative overflow-hidden shadow-3xl group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.04] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none">
                      <selectedZone.icon size={600} className={selectedZone.color} />
                   </div>
                   
                   <div className="relative z-10 space-y-16">
                      <div className="space-y-6">
                         <span className={`px-5 py-2 bg-white/5 ${selectedZone.color} text-[11px] font-black uppercase rounded-full border border-white/10 tracking-widest shadow-inner`}>ZONE_DETAIL_SHARD_0{selectedZone.id}</span>
                         <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">{selectedZone.name}</h3>
                         <p className="text-slate-400 text-2xl font-medium italic max-w-2xl leading-relaxed border-l-4 border-white/10 pl-10">"{selectedZone.desc}"</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="p-10 bg-black/60 rounded-[56px] border border-white/5 space-y-8 shadow-inner group/tasks hover:border-emerald-500/20 transition-all">
                            <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-4 px-2">
                               <Target size={16} className="text-emerald-400" /> Maintenance Shards
                            </h5>
                            <div className="space-y-4">
                               {selectedZone.tasks.map((task, i) => (
                                  <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 group/tasks:bg-emerald-600/5 transition-all cursor-pointer">
                                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                                     <span className="text-sm font-black text-slate-300 uppercase italic tracking-tight">{task}</span>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div className="p-10 bg-black/60 rounded-[56px] border border-white/5 space-y-10 shadow-inner text-white flex flex-col">
                            <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-4 px-2">
                               <History size={16} className="text-indigo-400" /> Zone Telemetry
                            </h5>
                            <div className="flex-1 min-h-[150px] w-full relative">
                               <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={zoneTelemetryData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                     <defs>
                                        <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                     </defs>
                                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                     <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                                     <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                                     <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                                        itemStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                                        labelStyle={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}
                                     />
                                     <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                                     <Area type="monotone" dataKey="energy" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" />
                                  </AreaChart>
                               </ResponsiveContainer>
                            </div>
                            <div className="space-y-8 mt-4">
                               {[
                                  { l: 'Visit Frequency', v: selectedZone.id === 0 ? 'CONSTANT' : selectedZone.id === 1 ? 'DAILY' : selectedZone.id === 3 ? 'WEEKLY' : 'SEASONAL', p: 100 - (selectedZone.id * 15) },
                                  { l: 'Industrial Yield', v: selectedZone.id === 3 ? 'PEAK' : 'STABLE', p: 60 + Math.random() * 30 },
                               ].map(m => (
                                  <div key={m.l} className="space-y-3">
                                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-600">{m.l}</span>
                                        <span className="text-white font-mono">{m.v}</span>
                                     </div>
                                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" style={{ width: `${m.p}%` }}></div>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-6">
                         <button 
                           onClick={handleSyncGeofence}
                           disabled={isSyncingGeofence}
                           className="flex-1 py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10 ring-8 ring-emerald-500/5"
                         >
                            {isSyncingGeofence ? <Loader2 className="w-6 h-6 animate-spin" /> : <MapIcon size={20} />} 
                            {isSyncingGeofence ? 'SYNCING_SHARDS...' : 'SYNC GEOFENCE'}
                         </button>
                         <button className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 hover:text-white transition-all shadow-xl group/down">
                            <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'home_agro' && (
          <div className="animate-in slide-in-from-right-4 duration-700 space-y-10">
            <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/40 relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Home size={600} className="text-emerald-500" />
              </div>
              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest shadow-inner">MICRO_NODE_TELEMETRY</span>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">Home Agro <span className="text-emerald-400">Hub</span></h3>
                  <p className="text-slate-400 text-xl font-medium italic max-w-2xl leading-relaxed border-l-4 border-emerald-500/30 pl-8">"Urban and domestic production shards. High-frequency harvesting and closed-loop kitchen waste cycles."</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'Balcony Shard', icon: Sun, desc: 'Vertical light-optimized nodes.', status: 'ACTIVE', color: 'text-amber-400' },
                    { title: 'Kitchen Compost', icon: Recycle, desc: 'Biomass breakdown cycle.', status: 'PROCESSING', color: 'text-emerald-400' },
                    { title: 'Window Herbs', icon: Sprout, desc: 'High-frequency culinary ingest.', status: 'READY', color: 'text-teal-400' }
                  ].map((item, i) => (
                    <div key={i} className="p-8 bg-black/60 rounded-[40px] border border-white/5 hover:border-emerald-500/30 transition-all group">
                      <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 ${item.color} group-hover:scale-110 transition-transform`}><item.icon size={28} /></div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">{item.title}</h4>
                      <p className="text-sm text-slate-500 font-medium mb-6">{item.desc}</p>
                      <div className="flex justify-between items-center pt-6 border-t border-white/5">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">STATUS</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lilies' && (
          <div className="animate-in slide-in-from-right-4 duration-700 space-y-10">
            <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/40 relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Waves size={600} className="text-blue-500" />
              </div>
              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <span className="px-5 py-2 bg-blue-500/10 text-blue-400 text-[11px] font-black uppercase rounded-full border border-blue-500/20 tracking-widest shadow-inner">AQUATIC_BIOMASS_SHARDS</span>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">Lilies <span className="text-blue-400">Around</span></h3>
                  <p className="text-slate-400 text-xl font-medium italic max-w-2xl leading-relaxed border-l-4 border-blue-500/30 pl-8">"Hydration networks and aquatic ecosystems. Managing water flow, retention, and biological filtration."</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 space-y-8">
                    <div className="flex items-center gap-4">
                      <Droplets className="text-blue-400" size={24} />
                      <h4 className="text-lg font-black text-white uppercase tracking-widest">Water Catchment</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                        <span>Current Volume</span>
                        <span className="text-blue-400">8,450 L</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[65%] shadow-[0_0_10px_#3b82f6]"></div>
                      </div>
                      <p className="text-sm text-slate-500 italic">"Swale network operating at 65% capacity. Optimal hydration for Zone 2 orchards."</p>
                    </div>
                  </div>
                  
                  <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 space-y-8">
                    <div className="flex items-center gap-4">
                      <Flower2 className="text-fuchsia-400" size={24} />
                      <h4 className="text-lg font-black text-white uppercase tracking-widest">Aquatic Flora</h4>
                    </div>
                    <div className="space-y-4">
                      {['Water Hyacinth (Filtration)', 'Duckweed (Biomass)', 'Lotus (Yield)'].map((flora, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></div>
                          <span className="text-sm font-black text-slate-300 uppercase tracking-tight">{flora}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ethics' && (
          <div className="animate-in slide-in-from-right-4 duration-700 space-y-10">
            <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/40 relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Scale size={600} className="text-amber-500" />
              </div>
              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <span className="px-5 py-2 bg-amber-500/10 text-amber-400 text-[11px] font-black uppercase rounded-full border border-amber-500/20 tracking-widest shadow-inner">CORE_DIRECTIVES</span>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">Ethical <span className="text-amber-400">Forge</span></h3>
                  <p className="text-slate-400 text-xl font-medium italic max-w-2xl leading-relaxed border-l-4 border-amber-500/30 pl-8">"The foundational algorithms of permaculture. Earth Care, People Care, and Fair Share protocols."</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'Earth Care', icon: Globe, desc: 'Rebuilding natural capital and soil health.', metric: '+12% Soil C', color: 'text-emerald-400' },
                    { title: 'People Care', icon: Heart, desc: 'Community resilience and knowledge sharing.', metric: '4 Active Nodes', color: 'text-rose-400' },
                    { title: 'Fair Share', icon: Handshake, desc: 'Distributing surplus and limiting consumption.', metric: '150kg Donated', color: 'text-amber-400' }
                  ].map((ethic, i) => (
                    <div key={i} className="p-10 bg-black/60 rounded-[48px] border border-white/5 hover:border-amber-500/30 transition-all text-center group">
                      <div className={`mx-auto p-6 rounded-3xl bg-white/5 w-fit mb-8 ${ethic.color} group-hover:scale-110 transition-transform`}><ethic.icon size={40} /></div>
                      <h4 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">{ethic.title}</h4>
                      <p className="text-sm text-slate-500 font-medium mb-8">{ethic.desc}</p>
                      <div className={`inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest ${ethic.color}`}>
                        {ethic.metric}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'companion' && (
          <div className="animate-in slide-in-from-right-4 duration-700 space-y-10">
            <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/40 relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Microscope size={600} className="text-fuchsia-500" />
              </div>
              <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <span className="px-5 py-2 bg-fuchsia-500/10 text-fuchsia-400 text-[11px] font-black uppercase rounded-full border border-fuchsia-500/20 tracking-widest shadow-inner">SYNERGY_MATRIX</span>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">Companion <span className="text-fuchsia-400">Oracle</span></h3>
                  <p className="text-slate-400 text-xl font-medium italic max-w-2xl leading-relaxed border-l-4 border-fuchsia-500/30 pl-8">"Algorithmic plant guild design. Maximizing symbiotic relationships and pest deterrence."</p>
                </div>
                
                <div className="p-10 bg-black/60 rounded-[48px] border border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-4"><Network className="text-fuchsia-400" /> Active Guilds</h4>
                    <button className="px-6 py-3 bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-fuchsia-600 hover:text-white transition-all">
                      Analyze New Guild
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Three Sisters', components: ['Corn', 'Beans', 'Squash'], synergy: 98 },
                      { name: 'Tomato Matrix', components: ['Tomato', 'Basil', 'Marigold'], synergy: 92 },
                      { name: 'Apple Tree Guild', components: ['Apple', 'Comfrey', 'Daffodil', 'Clover'], synergy: 85 }
                    ].map((guild, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-fuchsia-500/30 transition-all">
                        <div>
                          <h5 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">{guild.name}</h5>
                          <div className="flex flex-wrap gap-2">
                            {guild.components.map((comp, j) => (
                              <span key={j} className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">{comp}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-fuchsia-400 italic">{guild.synergy}%</div>
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Synergy Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Permaculture;
