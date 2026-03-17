
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Lock, Eye, EyeOff, 
  Activity, Scale, Zap, Database, Globe, 
  AlertTriangle, CheckCircle2, Bot, Fingerprint,
  LayoutGrid, ListChecks, TrendingUp, Landmark
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import { InternalControlState, UserRole } from '../types';
import { dispatchInternalControls } from '../services/internalControlService';

interface InternalControlDashboardProps {
  userRole: UserRole;
  currentPath: string;
}

const InternalControlDashboard: React.FC<InternalControlDashboardProps> = ({ userRole, currentPath }) => {
  const [controlState, setControlState] = useState<InternalControlState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'protocols' | 'dispatcher'>('overview');

  const fetchControls = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(`[InternalControl] Fetching controls for role: ${userRole}, path: ${currentPath}`);
      const state = await dispatchInternalControls(userRole, currentPath);
      if (!state) throw new Error("Failed to fetch control state");
      setControlState(state);
    } catch (err) {
      console.error("[InternalControl] Fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchControls();
    const interval = setInterval(fetchControls, 60000); // Sync every minute
    return () => clearInterval(interval);
  }, [userRole, currentPath]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Bot className="w-12 h-12 text-indigo-500 animate-pulse" />
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em]">Synchronizing Internal Control Protocols...</p>
      </div>
    );
  }

  if (error || !controlState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <div className="text-center space-y-2">
          <p className="text-white font-black uppercase tracking-widest">Protocol Synchronization Failed</p>
          <p className="text-slate-500 text-[10px] font-mono uppercase">{error || "Incomplete data state"}</p>
        </div>
        <button 
          onClick={fetchControls}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
        >
          Retry Handshake
        </button>
      </div>
    );
  }

  const powerData = [
    { name: 'Stewardship', value: controlState.balanceOfPowers?.stewardship || 0, color: '#10b981' },
    { name: 'Governance', value: controlState.balanceOfPowers?.governance || 0, color: '#6366f1' },
    { name: 'Treasury', value: controlState.balanceOfPowers?.treasury || 0, color: '#f59e0b' },
    { name: 'Intelligence', value: controlState.balanceOfPowers?.intelligence || 0, color: '#ec4899' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-32">
      {/* Sub-Navigation */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-3xl shadow-2xl">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutGrid },
            { id: 'protocols', label: 'Protocols', icon: ShieldCheck },
            { id: 'dispatcher', label: 'Dispatcher', icon: Bot }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all group ${
                activeSubTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] border border-white/20' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={14} className={activeSubTab === tab.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <>
          {/* Header: Global Network Status */}
          <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-black/40 relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
              <Globe size={400} />
            </div>
            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
              <div className="space-y-4 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl">
                    <ShieldCheck size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">EA Internal <span className="text-indigo-400">Control</span></h2>
                    <p className="text-indigo-400/60 text-[10px] font-mono tracking-[0.5em] uppercase mt-2">EA Protocol Dispatcher v9.4</p>
                  </div>
                </div>
                <p className="text-slate-400 text-lg italic max-w-2xl">
                  "Ensuring the balance of powers and immutable operation sequences across the EAB. Monitoring critical paths and optimizing global network feeds."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 min-w-[300px]">
                <div className="p-6 glass-card rounded-3xl border-emerald-500/20 bg-emerald-500/5 text-center space-y-1">
                  <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Network Health</p>
                  <p className="text-3xl font-mono font-black text-white">{controlState.globalAnalysis?.networkHealth || 0}%</p>
                </div>
                <div className="p-6 glass-card rounded-3xl border-indigo-500/20 bg-indigo-500/5 text-center space-y-1">
                  <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Active Protocols</p>
                  <p className="text-3xl font-mono font-black text-white">{controlState.activeRules?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Balance of Powers & Global Analysis */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Balance of Powers Chart */}
                <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 space-y-8 shadow-xl">
                  <div className="flex items-center gap-4">
                    <Scale size={20} className="text-indigo-400" />
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Balance of <span className="text-indigo-400">Powers</span></h3>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={powerData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '16px' }}
                          itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                          {powerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {powerData.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[9px] font-black text-slate-500 uppercase">{p.name}</span>
                        <span className="text-xs font-mono font-black text-white">{p.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Global Treasury Segregation */}
                <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 space-y-8 shadow-xl">
                  <div className="flex items-center gap-4">
                    <Landmark size={20} className="text-emerald-400" />
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Treasury <span className="text-emerald-400">Segregation</span></h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: 'Global Treasury', val: controlState.globalAnalysis?.totalTreasury || 0, col: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                      { label: 'System Liquidity', val: controlState.globalAnalysis?.systemLiquidity || 0, col: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                      { label: 'User Liquidity', val: controlState.globalAnalysis?.userLiquidity || 0, col: 'text-amber-400', bg: 'bg-amber-500/10' },
                    ].map((t, i) => (
                      <div key={i} className={`p-6 rounded-3xl border border-white/5 ${t.bg} space-y-2`}>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.label}</p>
                        <p className={`text-3xl font-mono font-black ${t.col}`}>${t.val.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Path Optimization */}
            <div className="lg:col-span-4">
              <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-black/40 space-y-8 shadow-3xl h-full">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-600 rounded-xl shadow-lg">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Path <span className="text-emerald-400">Optimization</span></h3>
                </div>
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Zap size={16} className="text-amber-400" />
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Critical Path Analysis</p>
                    </div>
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                      "Current path: <span className="text-indigo-400 font-mono">{currentPath}</span>. System is optimizing data feeds for your role to ensure maximum throughput and protocol compliance."
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                      <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Access Level</p>
                      <p className="text-xl font-mono font-black text-white">L4_SECURE</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                      <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Audit Status</p>
                      <p className="text-xl font-mono font-black text-emerald-500">CLEARED</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'protocols' && (
        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 space-y-8 shadow-xl duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Lock size={20} className="text-rose-500" />
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Immutable <span className="text-rose-500">Rules</span></h3>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 py-1 bg-white/5 rounded-full border border-white/5">Blockchain Operations Sequence</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(controlState.activeRules || []).map((rule) => (
              <div key={rule.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4 group hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{rule.name}</h4>
                    <p className="text-[9px] font-mono text-indigo-400 uppercase">{rule.protocol}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase ${
                    rule.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 
                    rule.severity === 'HIGH' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {rule.severity}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 italic leading-relaxed">{rule.description}</p>
                <div className="flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase">
                  <CheckCircle2 size={10} /> Active & Immutable
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'dispatcher' && (
        <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-black/40 space-y-10 shadow-3xl relative overflow-hidden duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Fingerprint size={160} />
          </div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
                <ListChecks size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">EA Responsibility <span className="text-indigo-400">Dispatcher</span></h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(controlState.responsibilities || []).map((resp) => (
                <div key={resp.id} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3 hover:bg-white/[0.08] transition-all cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{resp.role}</span>
                    <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${resp.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                      {resp.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white italic leading-tight">{resp.task}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${resp.priority * 10}%` }}></div>
                    </div>
                    <span className="text-[8px] font-black text-slate-600 uppercase">P{resp.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalControlDashboard;
