import React, { useState, useEffect } from 'react';
import { 
  BoxSelect, 
  Droplets, 
  Sun, 
  Thermometer, 
  Zap, 
  Activity, 
  Database, 
  Maximize2, 
  ChevronRight, 
  Loader2, 
  ShieldCheck, 
  Binary, 
  FlaskConical, 
  Gauge, 
  Bot, 
  Leaf, 
  Cpu,
  Layers,
  SearchCode,
  Lock,
  Wind,
  RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';

interface CEAProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
}

const MOCK_RACK_DATA = [
  { id: 'RCK-01', name: 'Hydro-Stack Alpha', type: 'Hydroponics', crop: 'Iceberg Lettuce', moisture: 92, ec: 1.8, ph: 6.2, status: 'OPTIMAL', temp: 22 },
  { id: 'RCK-02', name: 'Aero-Forge Beta', type: 'Aeroponics', crop: 'Micro-Greens', moisture: 95, ec: 1.2, ph: 5.8, status: 'NOMINAL', temp: 24 },
  { id: 'RCK-03', name: 'Verti-Shard Gamma', type: 'Vertical Stack', crop: 'Strawberries', moisture: 88, ec: 2.1, ph: 6.5, status: 'SYNCING', temp: 21 },
];

const generateTelemetryData = () => {
  const data = [];
  let baseMoisture = 85;
  let baseTemp = 22;
  for (let i = 0; i < 24; i++) {
    baseMoisture += (Math.random() - 0.5) * 5;
    baseTemp += (Math.random() - 0.5) * 2;
    data.push({
      time: `${i}:00`,
      moisture: Math.max(0, Math.min(100, baseMoisture)),
      temp: Math.max(15, Math.min(30, baseTemp)),
    });
  }
  return data;
};

const CEA: React.FC<CEAProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeRack, setActiveRack] = useState(MOCK_RACK_DATA[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lightSpectrum, setLightSpectrum] = useState(70); 
  const [humidity, setHumidity] = useState(65);
  const [oracleInsight, setOracleInsight] = useState<string | null>(null);
  const [isAskingOracle, setIsAskingOracle] = useState(false);
  const [telemetryData, setTelemetryData] = useState(generateTelemetryData());

  useEffect(() => {
    setTelemetryData(generateTelemetryData());
  }, [activeRack]);

  const handleTuneSpectrum = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onEarnEAC(5, 'CEA_LIGHT_SPECTRUM_OPTIMIZATION');
      alert("SPECTRUM SHARD ANCHORED: Photobiomodulation adjusted for current crop stage.");
    }, 1500);
  };

  const askCeaOracle = async () => {
    const fee = 10;
    if (!await onSpendEAC(fee, 'CEA_ORACLE_CONSULTATION')) return;

    setIsAskingOracle(true);
    try {
      const prompt = `Act as an EOS CEA Specialist. Analyze the current indoor status:
      Rack: ${activeRack.name}
      Moisture: ${activeRack.moisture}%
      pH: ${activeRack.ph}
      EC: ${activeRack.ec}
      Spectrum Level: ${lightSpectrum}%
      
      Provide a technical remediation shard for growth optimization.`;
      const res = await chatWithAgroLang(prompt, []);
      setOracleInsight(res.text);
    } catch (e) {
      setOracleInsight("Registry synchronization error. Handshake interrupted.");
    } finally {
      setIsAskingOracle(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
           <BoxSelect className="w-80 h-80 text-white" />
        </div>
        <div className="w-32 h-32 rounded-[40px] bg-emerald-600 flex items-center justify-center shadow-3xl shrink-0">
           <BoxSelect className="w-16 h-16 text-white" />
        </div>
        <div className="space-y-4 relative z-10 text-center md:text-left">
           <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">CEA_OPTIMIZATION_HUB</span>
           <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Controlled <span className="text-emerald-400">Environment</span></h2>
           <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl">
              Precision hydroponics and vertical sharding. Optimizing indoor growth biometrics via real-time industrial telemetry.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-8 rounded-[48px] border-white/5 bg-black/40 space-y-6 shadow-xl">
              <h3 className="text-xl font-black text-white uppercase italic px-4 flex items-center gap-3">
                 <Layers className="w-5 h-5 text-indigo-400" /> Active Racks
              </h3>
              <div className="space-y-3">
                 {MOCK_RACK_DATA.map(rack => (
                    <button 
                      key={rack.id}
                      onClick={() => setActiveRack(rack)}
                      className={`w-full p-6 rounded-[32px] border transition-all flex items-center justify-between group ${activeRack.id === rack.id ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                       <div className="text-left">
                          <p className="text-sm font-black uppercase">{rack.name}</p>
                          <p className="text-[10px] font-mono opacity-60">{rack.type}</p>
                       </div>
                       <ChevronRight className={`w-5 h-5 transition-transform ${activeRack.id === rack.id ? 'rotate-90 text-emerald-400' : 'text-slate-700'}`} />
                    </button>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-950/10 space-y-8 shadow-xl">
              <h4 className="text-lg font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                 <Sun className="w-6 h-6 text-indigo-400" /> Light Sharding
              </h4>
              <div className="space-y-6">
                 <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Spectrum Tuning</span>
                    <span className="text-2xl font-mono font-black text-indigo-400">{lightSpectrum}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="100" value={lightSpectrum}
                   onChange={e => setLightSpectrum(Number(e.target.value))}
                   className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500"
                 />
              </div>
              <button 
                onClick={handleTuneSpectrum}
                disabled={isSyncing}
                className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-3"
              >
                 {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                 {isSyncing ? 'Syncing Photons...' : 'Commit Spectrum Shard'}
              </button>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card p-12 rounded-[64px] border-white/5 bg-black/60 relative overflow-hidden flex flex-col min-h-[600px] shadow-3xl group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-12 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl animate-pulse">
                       <Activity className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">{activeRack.name} <span className="text-emerald-400">Dossier</span></h3>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 mb-12">
                 {[
                   { l: 'Moisture', v: `${activeRack.moisture}%`, i: Droplets, c: 'text-blue-400' },
                   { l: 'Nutrient (EC)', v: activeRack.ec, i: FlaskConical, c: 'text-emerald-400' },
                   { l: 'pH Balance', v: activeRack.ph, i: Gauge, c: 'text-amber-500' },
                   { l: 'Temp', v: `${activeRack.temp}°C`, i: Thermometer, c: 'text-rose-500' },
                 ].map((stat, i) => (
                    <div key={i} className="p-8 bg-black/40 rounded-[40px] border border-white/5 space-y-4 shadow-inner text-center">
                       <stat.i className={`w-8 h-8 ${stat.c} mx-auto opacity-40`} />
                       <div>
                          <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{stat.l}</p>
                          <p className={`text-2xl font-mono font-black text-white`}>{stat.v}</p>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Telemetry Chart */}
              <div className="relative z-10 mb-12 bg-black/40 rounded-[48px] border border-white/5 p-8 shadow-inner h-[300px]">
                 <div className="flex justify-between items-center mb-6 px-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Activity size={14} className="text-emerald-400" /> 24H Telemetry Stream
                    </h4>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest animate-pulse">LIVE</span>
                 </div>
                 <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={telemetryData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                             <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                             </linearGradient>
                             <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis yAxisId="left" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                             contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                             itemStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                             labelStyle={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}
                          />
                          <Area yAxisId="left" type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" />
                          <Area yAxisId="right" type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="flex-1 p-10 bg-indigo-600/5 border border-indigo-500/20 rounded-[48px] relative overflow-hidden group/oracle">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/oracle:scale-110 transition-transform"><Bot size={300} className="text-indigo-400" /></div>
                 <div className="flex items-center gap-6 relative z-10 mb-8">
                    <div className="p-3 bg-indigo-500 rounded-2xl shadow-xl"><Bot className="w-8 h-8 text-white" /></div>
                    <h4 className="text-xl font-black text-white uppercase tracking-widest italic m-0">CEA <span className="text-indigo-400">Oracle</span></h4>
                 </div>
                 {!oracleInsight ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-8">
                       <p className="text-slate-400 italic text-lg text-center max-w-sm font-medium">Awaiting industrial ingest for growth remediation shards.</p>
                       <button 
                        onClick={askCeaOracle}
                        disabled={isAskingOracle}
                        className="px-12 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                       >
                          {isAskingOracle ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                          {isAskingOracle ? 'SYNTHESIZING...' : 'INITIALIZE ORACLE SWEEP'}
                       </button>
                    </div>
                 ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                       <div className="prose prose-invert max-w-none text-slate-300 text-lg italic leading-loose whitespace-pre-line border-l-4 border-indigo-500/30 pl-10 font-medium">
                          {oracleInsight}
                       </div>
                       <button onClick={() => setOracleInsight(null)} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Discard Shard</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CEA;