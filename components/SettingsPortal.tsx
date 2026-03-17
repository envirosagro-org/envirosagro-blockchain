import React, { useState } from 'react';
import { 
  Settings, Monitor, MapPin, ShieldCheck, Zap, Activity, Info, 
  RefreshCw, Globe, Lock, ShieldAlert, Cpu, Radio, Gauge, 
  Smartphone, Volume2, Palette, Type, Sun, Moon, 
  CheckCircle2, AlertTriangle, Languages, Sliders, Battery, 
  Satellite, Wifi, Landmark, Cloud, Download, Compass, 
  Layout, Eye, Leaf, Binary, Heart, Search, 
  SmartphoneNfc, FileCode, BadgeCheck, Terminal, Bot, 
  ArrowRight, Key, Layers, Target, Scale, ZapOff, 
  Contrast, Maximize2, Sprout, Loader2, Link2, ShieldPlus, Fingerprint, Network
} from 'lucide-react';
import { User, ViewState } from '../types';

interface SettingsPortalProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigate: (view: ViewState) => void;
}

const SettingsPortal: React.FC<SettingsPortalProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [activeShard, setActiveShard] = useState<'display' | 'accessibility' | 'ecosystem' | 'privacy'>('display');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lumiScale, setLumiScale] = useState(false);

  const updateSettings = (newSettings: Partial<User['settings']>) => {
    onUpdateUser({
      ...user,
      settings: {
        ...(user.settings || {
          notificationsEnabled: true,
          privacyMode: 'Public',
          autoSync: true,
          biometricLogin: false,
          theme: 'Dark'
        }),
        ...newSettings
      } as User['settings']
    });
  };

  const handleRegistrySync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  const currentSettings = user.settings || {
    notificationsEnabled: true,
    privacyMode: 'Public',
    autoSync: true,
    biometricLogin: false,
    theme: 'Dark',
    fontSize: 14,
    units: 'Metric',
    locationAccuracy: 'High',
    connectivityMode: 'Cellular',
    anonymizedSharing: true,
    geofenceSecurity: false,
    dataRefreshRate: '5m'
  };

  const toggleLumiScale = () => {
    setLumiScale(!lumiScale);
    if (!lumiScale) {
      updateSettings({ theme: 'High_Resonance', fontSize: 18 });
    } else {
      updateSettings({ theme: 'Dark', fontSize: 14 });
    }
  };

  return (
    <div className={`space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1400px] mx-auto px-4 ${lumiScale ? 'font-black' : ''}`}>
      <div className="glass-card p-10 md:p-14 rounded-[56px] border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
            <Settings size={400} className="text-white" />
         </div>
         <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-3xl shrink-0 border-4 border-white/10 relative overflow-hidden group-hover:scale-105 transition-all">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <Settings size={56} className="text-white relative z-10 animate-spin-slow" />
         </div>
         <div className="space-y-4 flex-1 text-center md:text-left relative z-10">
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 shadow-inner italic tracking-widest">TERMINAL_CONFIG_v6.5</span>
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-inner italic tracking-widest">STAGING_MODE_ACTIVE</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">System <span className="text-indigo-400">Configuration.</span></h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl">
               "Calibrating the operational environment. Synchronize your local node preferences with the organizational network map."
            </p>
         </div>
      </div>

      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[36px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'display', label: 'Display & UI', icon: Monitor },
          { id: 'accessibility', label: 'Accessibility', icon: Volume2 },
          { id: 'ecosystem', label: 'Ecosystem Ops', icon: Sprout },
          { id: 'privacy', label: 'Privacy & Registry', icon: Lock },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveShard(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeShard === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <div className="lg:col-span-8">
           <div className="glass-card rounded-[64px] border-2 border-white/5 bg-black/40 shadow-3xl overflow-hidden min-h-[700px] flex flex-col">
              <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 px-14">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl">
                       <Sliders size={28} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">{activeShard.replace('_', ' ')} <span className="text-indigo-400">Shard</span></h3>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={handleRegistrySync}
                      disabled={isSyncing}
                      className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all text-[10px] font-black uppercase flex items-center gap-3"
                    >
                       {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                       {isSyncing ? 'SYNCING_LEDGER...' : 'RE-SYNC WITH CLOUD'}
                    </button>
                 </div>
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar space-y-12">
                 {activeShard === 'display' && (
                    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6 p-8 bg-black/60 rounded-[48px] border border-white/5 shadow-inner">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-4 px-2">
                                <Palette size={20} className="text-indigo-400" />
                                <h5 className="text-[11px] font-black text-white uppercase tracking-widest">Interface Theme</h5>
                             </div>
                             <div className="grid grid-cols-1 gap-3">
                                {[
                                   { id: 'Dark', label: 'Industrial Dark', desc: 'Standard EOS environment.' },
                                   { id: 'OLED_Black', label: 'OLED Black', desc: 'Maximize battery on mobile hardware.' },
                                   { id: 'High_Resonance', label: 'High Resonance', desc: 'Enhanced visibility for field audits.' },
                                ].map(t => (
                                   <button 
                                      key={t.id}
                                      onClick={() => updateSettings({ theme: t.id as any })}
                                      className={`p-6 rounded-[32px] border-2 transition-all text-left flex justify-between items-center group ${currentSettings.theme === t.id ? 'bg-indigo-600/10 border-indigo-500 shadow-xl' : 'bg-white/5 border-transparent text-slate-600 hover:border-white/10'}`}
                                   >
                                      <div>
                                         <p className={`text-sm font-black uppercase italic ${currentSettings.theme === t.id ? 'text-white' : ''}`}>{t.label}</p>
                                         <p className="text-[9px] font-medium opacity-60 mt-1">{t.desc}</p>
                                      </div>
                                      {currentSettings.theme === t.id && <CheckCircle2 size={20} className="text-indigo-400" />}
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-8 p-8 bg-black/60 rounded-[48px] border border-white/5 shadow-inner flex flex-col justify-between">
                             <div className="space-y-6">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4 px-2">
                                   <Type size={20} className="text-indigo-400" />
                                   <h5 className="text-[11px] font-black text-white uppercase tracking-widest">Typography Ingest</h5>
                                </div>
                                <div className="space-y-6 px-4">
                                   <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-black text-slate-600 uppercase">Master Scaling</span>
                                      <span className="text-2xl font-mono font-black text-white">{currentSettings.fontSize}pt</span>
                                   </div>
                                   <input 
                                      type="range" min="8" max="24" step="1" 
                                      value={currentSettings.fontSize} 
                                      onChange={e => updateSettings({ fontSize: parseInt(e.target.value) })}
                                      className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500 shadow-inner" 
                                   />
                                   <div className="flex justify-between text-[8px] font-black text-slate-800 uppercase tracking-widest">
                                      <span>NANO_8PT</span>
                                      <span>TITAN_24PT</span>
                                   </div>
                                </div>
                             </div>

                             <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/20 space-y-4">
                                <div className="flex items-center gap-3">
                                   <Sun size={18} className="text-indigo-400" />
                                   <h6 className="text-[10px] font-black text-white uppercase tracking-widest">Lumi-Scale (Field Mode)</h6>
                                </div>
                                <p className="text-[9px] text-slate-400 italic">"Automatic contrast boosting for direct sunlight field audits."</p>
                                <button 
                                  onClick={toggleLumiScale}
                                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${lumiScale ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                                >
                                   {lumiScale ? 'PROTOCOL_ACTIVE' : 'ACTIVATE LUMI_SCALE'}
                                </button>
                             </div>
                          </div>
                       </div>

                       <div className="p-8 bg-black/80 rounded-[48px] border border-white/5 space-y-6">
                          <div className="flex items-center justify-between px-4">
                             <div className="flex items-center gap-4">
                                <Activity size={20} className="text-emerald-400" />
                                <h5 className="text-[11px] font-black text-white uppercase tracking-widest italic">Data Refresh Frequency</h5>
                             </div>
                             <div className="flex gap-2">
                                {['Real-time', '5m', '1h'].map(rate => (
                                   <button 
                                      key={rate}
                                      onClick={() => updateSettings({ dataRefreshRate: rate as any })}
                                      className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${currentSettings.dataRefreshRate === rate ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 text-slate-700 hover:text-white'}`}
                                   >
                                      {rate}
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeShard === 'accessibility' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-8 bg-black/60 rounded-[48px] border border-white/5 space-y-8 shadow-inner">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-4 px-2">
                                <Scale size={20} className="text-blue-400" />
                                <h5 className="text-[11px] font-black text-white uppercase tracking-widest italic">Unit Ingest Defaults</h5>
                             </div>
                             <div className="flex gap-4">
                                <button 
                                   onClick={() => updateSettings({ units: 'Metric' })}
                                   className={`flex-1 py-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 group ${currentSettings.units === 'Metric' ? 'bg-blue-600/10 border-blue-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-700'}`}
                                >
                                   <p className="text-xl font-black italic">Metric</p>
                                   <p className="text-[8px] font-mono opacity-50 uppercase">°C, kg, Ha</p>
                                </button>
                                <button 
                                   onClick={() => updateSettings({ units: 'Imperial' })}
                                   className={`flex-1 py-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 group ${currentSettings.units === 'Imperial' ? 'bg-blue-600/10 border-blue-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-700'}`}
                                >
                                   <p className="text-xl font-black italic">Imperial</p>
                                   <p className="text-[8px] font-mono opacity-50 uppercase">°F, lbs, Acre</p>
                                </button>
                             </div>
                          </div>

                          <div className="p-8 bg-black/60 rounded-[48px] border border-white/5 space-y-8 shadow-inner">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-4 px-2">
                                <MapPin size={20} className="text-emerald-400" />
                                <h5 className="text-[11px] font-black text-white uppercase tracking-widest italic">Location Precision Shard</h5>
                             </div>
                             <div className="space-y-4">
                                {[
                                   { id: 'High', label: 'High Accuracy', desc: 'Ideal for soil sampling & drone sync.' },
                                   { id: 'Battery', label: 'Battery Optimized', desc: 'Conserves node power for static monitoring.' },
                                ].map(p => (
                                   <button 
                                      key={p.id}
                                      onClick={() => updateSettings({ locationAccuracy: p.id as any })}
                                      className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${currentSettings.locationAccuracy === p.id ? 'bg-emerald-600/10 border-emerald-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-700'}`}
                                   >
                                      <div>
                                         <p className="text-sm font-black uppercase italic">{p.label}</p>
                                         <p className="text-[9px] opacity-60 font-medium mt-1 uppercase tracking-tighter">{p.desc}</p>
                                      </div>
                                      <div className={`w-4 h-4 rounded-full border-2 border-white/10 flex items-center justify-center transition-all ${currentSettings.locationAccuracy === p.id ? 'bg-emerald-500 border-emerald-400' : ''}`}>
                                         {currentSettings.locationAccuracy === p.id && <CheckCircle2 size={12} className="text-white" />}
                                      </div>
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-white/[0.02] flex items-center justify-between shadow-xl">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl"><Volume2 size={24} className="text-white" /></div>
                             <div>
                                <h5 className="text-xl font-black text-white uppercase italic tracking-widest m-0">EnvirosVoice Handshake</h5>
                                <p className="text-slate-500 text-xs italic font-medium mt-1">"Enable hands-free signal logging via biometric voice shards."</p>
                             </div>
                          </div>
                          <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 border-2 border-white/10">AUTHORIZE VOICE</button>
                       </div>
                    </div>
                 )}

                 {activeShard === 'ecosystem' && (
                    <div className="space-y-10 animate-in zoom-in duration-500">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-8 bg-black/60 rounded-[48px] border border-white/5 space-y-8 shadow-inner">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-4 px-2">
                                <Link2 size={20} className="text-amber-500" />
                                <h5 className="text-[11px] font-black text-white uppercase tracking-widest italic">Default Connectivity</h5>
                             </div>
                             <div className="grid grid-cols-1 gap-3">
                                {[
                                   { id: 'Satellite', icon: Satellite, label: 'Orbital (Starlink/Direct)' },
                                   { id: 'LoRaWAN', icon: Radio, label: 'LoRa Mesh (Edge Protocol)' },
                                   { id: 'Cellular', icon: Wifi, label: 'Carrier 5G/LTE Network' },
                                ].map(c => (
                                   <button 
                                      key={c.id}
                                      onClick={() => updateSettings({ connectivityMode: c.id as any })}
                                      className={`p-6 rounded-[32px] border-2 transition-all flex items-center gap-6 group ${currentSettings.connectivityMode === c.id ? 'bg-amber-600/10 border-amber-500 text-white shadow-xl scale-105' : 'bg-black border-white/5 text-slate-700'}`}
                                   >
                                      <c.icon size={20} className={currentSettings.connectivityMode === c.id ? 'text-amber-400' : 'text-slate-800'} />
                                      <span className="text-xs font-black uppercase italic tracking-widest">{c.label}</span>
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="p-8 bg-black/60 rounded-[48px] border border-white/5 space-y-10 shadow-inner flex flex-col justify-between">
                             <div className="space-y-6">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4 px-2">
                                   <Gauge size={20} className="text-amber-500" />
                                   <h5 className="text-[11px] font-black text-white uppercase tracking-widest italic">Alert Thresholds</h5>
                                </div>
                                <div className="space-y-6 px-4">
                                   {[
                                      { l: 'Moisture Crit', v: 20, u: '%', c: 'text-blue-400' },
                                      { l: 'Drift Warning', v: 0.05, u: 'α', c: 'text-indigo-400' },
                                   ].map(a => (
                                      <div key={a.l} className="space-y-3">
                                         <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{a.l}</span>
                                            <span className={`text-xl font-mono font-black ${a.c}`}>{a.v}{a.u}</span>
                                         </div>
                                         <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full bg-amber-500`} style={{ width: `${a.v * (a.u === '%' ? 1 : 100)}%` }}></div>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                             <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-600 hover:text-white transition-all">MANAGE ALL SENSORS</button>
                          </div>
                       </div>

                       <div className="p-10 glass-card rounded-[64px] border border-blue-500/20 bg-blue-500/[0.03] flex items-center justify-between shadow-xl">
                          <div className="flex items-center gap-8">
                             <div className="p-5 rounded-3xl bg-blue-600 shadow-2xl text-white group-hover:rotate-6 transition-all"><Download size={28} /></div>
                             <div>
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Offline Registry Maps</h4>
                                <p className="text-slate-500 text-sm font-medium mt-1">Download regional geofence tiles for low-sync field operation.</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] text-slate-700 font-mono font-black uppercase mb-3">Stored Mass: 142 MB</p>
                             <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95">Update Shards</button>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeShard === 'privacy' && (
                    <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-10 glass-card rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 space-y-10 shadow-inner group">
                             <div className="flex items-center gap-4 border-b border-emerald-500/10 pb-6">
                                <Globe size={24} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                                <h5 className="text-xl font-black text-white uppercase italic">Anonymized Sharing</h5>
                             </div>
                             <p className="text-slate-400 text-base italic leading-relaxed">
                                "Broadcast anonymous soil health trends to the Githaka quorum to enhance predictive m-constant modeling for the entire network."
                             </p>
                             <button 
                                onClick={() => updateSettings({ anonymizedSharing: !currentSettings.anonymizedSharing })}
                                className={`w-full py-8 rounded-[40px] border-2 transition-all flex items-center justify-center gap-6 font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 ${currentSettings.anonymizedSharing ? 'bg-emerald-600 border-white text-white' : 'bg-black/60 border-white/5 text-slate-700'}`}
                             >
                                {currentSettings.anonymizedSharing ? <CheckCircle2 size={24} /> : <ZapOff size={24} />}
                                {currentSettings.anonymizedSharing ? 'CONSENSUS_ACTIVE' : 'OPT_IN_SHARD'}
                             </button>
                          </div>

                          <div className="p-10 glass-card rounded-[56px] border border-rose-500/20 bg-rose-500/5 space-y-10 shadow-inner group">
                             <div className="flex items-center gap-4 border-b border-rose-500/10 pb-6">
                                <ShieldPlus size={24} className="text-rose-500 group-hover:rotate-12 transition-transform" />
                                <h5 className="text-xl font-black text-white uppercase italic">Geofence Security</h5>
                             </div>
                             <p className="text-slate-400 text-base italic leading-relaxed">
                                "Initialize an immediate signal dispatch if terminal hardware or linked sensors drift outside of the registered geofence perimeter."
                             </p>
                             <button 
                                onClick={() => updateSettings({ geofenceSecurity: !currentSettings.geofenceSecurity })}
                                className={`w-full py-8 rounded-[40px] border-2 transition-all flex items-center justify-center gap-6 font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 ${currentSettings.geofenceSecurity ? 'bg-rose-600 border-white text-white animate-pulse' : 'bg-black/60 border-white/5 text-slate-700'}`}
                             >
                                {currentSettings.geofenceSecurity ? <ShieldCheck size={24} /> : <ZapOff size={24} />}
                                {currentSettings.geofenceSecurity ? 'SECURE_LOCK_ACTIVE' : 'INITIALIZE LOCK'}
                             </button>
                          </div>
                       </div>

                       <div className="p-12 glass-card rounded-[64px] border border-white/5 bg-black/60 flex flex-col items-center justify-center text-center space-y-8 shadow-3xl">
                          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-700 border border-white/10 shadow-inner"><Fingerprint size={40} /></div>
                          <div className="space-y-2">
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Biometric Handshake Finality</h4>
                             <p className="text-slate-500 text-lg font-medium italic px-10">Use your local biometric shard for instantaneous ESIN signature authorization during sharding events.</p>
                          </div>
                          <button 
                             onClick={() => updateSettings({ biometricLogin: !currentSettings.biometricLogin })}
                             className={`px-16 py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] transition-all border-2 shadow-2xl active:scale-95 ${currentSettings.biometricLogin ? 'bg-indigo-600 border-white text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                          >
                             {currentSettings.biometricLogin ? 'BIOMETRICS_VERIFIED' : 'AUTHENTICATE BIOMETRICS'}
                          </button>
                       </div>
                    </div>
                 )}

              </div>

              <div className="p-10 border-t border-white/5 bg-black/80 flex items-center justify-between shrink-0 relative z-20">
                 <div className="flex items-center gap-4 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] italic">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20 animate-pulse"></div>
                    Registry Configuration Live
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-slate-800 uppercase tracking-widest italic">v6.5.2 // QUORUM_CONFIG_SYNC</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-950/10 flex flex-col items-center text-center space-y-10 shadow-3xl relative overflow-hidden group/map">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/map:scale-110 transition-transform duration-[12s]"><Network size={400} className="text-indigo-400" /></div>
              <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 group-hover:rotate-12 transition-transform duration-700 relative z-10 animate-float">
                 <Bot size={48} className="text-white animate-pulse" />
              </div>
              <div className="space-y-6 relative z-10">
                 <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">System <span className="text-indigo-400">Sync Map</span></h4>
                 <p className="text-slate-400 text-lg leading-relaxed italic px-6 font-medium">
                    "Analyzing node topography. Registry synchronization ensures zero latency across the five thrusts."
                 </p>
              </div>
              <div className="p-8 bg-black/60 rounded-[40px] border border-indigo-500/20 w-full relative z-10 shadow-inner group-hover/map:border-indigo-400 transition-colors">
                 <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">Mesh Affinity Index</p>
                 <p className="text-5xl font-mono font-black text-indigo-400 tracking-tighter leading-none">1.42<span className="text-2xl italic font-sans text-indigo-700 ml-1">μ</span></p>
              </div>
              <button 
                onClick={() => onNavigate('sitemap')}
                className="relative z-10 w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 hover:border-indigo-400 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                 <Globe size={16} /> VIEW REGISTRY MATRIX
              </button>
           </div>

           <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-8 shadow-xl group">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                 <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                 <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Sovereign Proof</h4>
              </div>
              <div className="space-y-6">
                 <p className="text-slate-500 text-sm italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    "Terminal settings are locally sharded. System updates require a ZK-Signature from the authorized steward node."
                 </p>
                 <div className="p-6 bg-white/5 border border-white/5 rounded-2xl font-mono text-[9px] text-slate-700 break-all select-all italic uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                    SHA256_CONFIG: 0x882A_TERMINAL_HANDSHAKE_OK
                 </div>
              </div>
           </div>

           <div className="p-8 glass-card rounded-[40px] border border-rose-500/20 bg-rose-500/5 space-y-6 animate-pulse group hover:animate-none transition-all cursor-help">
              <div className="flex items-center gap-3">
                 <AlertTriangle size={18} className="text-rose-500" />
                 <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Anomaly Detection</h5>
              </div>
              <p className="text-[11px] text-slate-400 italic">"Registry detected sub-optimal contrast levels for your current GPS coordinates. Suggest activating Lumi-Scale."</p>
           </div>
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.9); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar-editor::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-editor::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.4); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SettingsPortal;
