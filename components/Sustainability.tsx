import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, ViewState, MediaShard 
} from '../types';
import { 
  Leaf, Activity, Zap, Info, ShieldCheck, Binary, 
  Sprout, TrendingUp, Loader2, Waves, 
  TreePine, Radio, Target, Heart, Atom, RefreshCw, AlertTriangle,
  Gauge, CheckCircle2, Dna, Fingerprint, Microscope, ArrowRight,
  ShieldAlert, Lock, Key, ShieldPlus, Database, History, 
  CloudRain, Wind, Scale, Landmark, Boxes, Workflow, 
  Eye, Monitor, AlertCircle, Terminal, Cpu,
  BadgeCheck, Sun, Download, X, Gavel, KeyRound, Stamp,
  LineChart, Bot,
  FileDigit, ChevronRight, Menu, Search, UserPlus, ChevronUp
} from 'lucide-react';
import { analyzeSustainability, AgroLangResponse } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import { calculateMConstant, generateQuickHash } from '../systemFunctions';

interface SustainabilityProps {
  user: User;
  onAction?: () => void;
  onMintEAT?: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
}

const SYSTEM_MANIFEST = [
  { component: 'GENESIS BLOCK', logic: 'SYSTEM BOOT IDENTITY', icon: Landmark, col: 'text-indigo-400' },
  { component: 'ENTROPY SOURCE', logic: 'BIO-DATA (AGRO MUSIKA)', icon: Waves, col: 'text-emerald-400' },
  { component: 'ACCESS CONTROL', logic: 'ROLE-BASED PERMISSIONS', icon: ShieldCheck, col: 'text-blue-400' },
  { component: 'VALIDATION', logic: 'PROOF OF SUSTAINABILITY (POS)', icon: BadgeCheck, col: 'text-amber-400' },
];

const DNAHelix: React.FC<{ isAggressive: boolean }> = ({ isAggressive }) => {
  return (
    <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 200 400" className="w-full h-full opacity-100">
        {[...Array(12)].map((_, i) => {
          const y = i * 35 + 20;
          const delay = i * 0.2;
          return (
            <g key={i}>
              <circle cx="50" cy={y} r="8" className="fill-emerald-400 drop-shadow-[0_0_12px_#10b981]">
                <animate attributeName="cx" values="50;150;50" dur={`${isAggressive ? 2 : 4}s`} begin={`${delay}s`} repeatCount="indefinite" />
              </circle>
              <circle cx="150" cy={y} r="8" className="fill-indigo-500 drop-shadow-[0_0_12px_#6366f1]">
                <animate attributeName="cx" values="150;50;150" dur={`${isAggressive ? 2 : 4}s`} begin={`${delay}s`} repeatCount="indefinite" />
              </circle>
              <line y1={y} y2={y} x1="50" x2="150" stroke="white" strokeWidth="2" className="opacity-40">
                <animate attributeName="x1" values="50;150;50" dur={`${isAggressive ? 2 : 4}s`} begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="x2" values="150;50;150" dur={`${isAggressive ? 2 : 4}s`} begin={`${delay}s`} repeatCount="indefinite" />
              </line>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Sustainability: React.FC<SustainabilityProps> = ({ user, onMintEAT, onNavigate }) => {
  const [atmStatic, setAtmStatic] = useState(0.88);
  const [soilResonance, setSoilResonance] = useState(0.45);
  const [isAuditing, setIsAuditing] = useState(false);
  const [oracleVerdict, setOracleVerdict] = useState<AgroLangResponse | null>(null);

  const [isArchiving, setIsArchiving] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  // Using system function for m-constant
  const currentM = useMemo(() => 
    calculateMConstant(0.92, 0.78, user.metrics.agriculturalCodeU, 0.12), 
    [user.metrics.agriculturalCodeU]
  );
  
  const currentOmega = useMemo(() => (atmStatic * 0.75) / (soilResonance * 1.2), [atmStatic, soilResonance]);
  const integrityStatus = currentM > 1.618 ? 'HIGH' : currentM > 1.4 ? 'NOMINAL' : 'FRACTURED';

  useEffect(() => {
    const timer = setInterval(() => {
      setAtmStatic(prev => Number((prev + (Math.random() * 0.04 - 0.02)).toFixed(3)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRunDiagnostic = async () => {
    setIsAuditing(true);
    setOracleVerdict(null);
    setIsArchived(false);
    try {
      const data = {
        node_id: user.esin,
        omega: currentOmega.toFixed(3),
        status: integrityStatus,
        atm_static: atmStatic,
        soil_resonance: soilResonance,
        m_constant: currentM
      };
      const res = await analyzeSustainability(data);
      setOracleVerdict(res);
    } catch (e) {
      setOracleVerdict({ text: "REGISTRY_TIMEOUT: Could not reach consensus quorum. Manual physical audit recommended." });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleAnchorToLedger = async () => {
    if (!oracleVerdict || isArchiving || isArchived) return;
    
    setIsArchiving(true);
    try {
      const shardHash = `0x${generateQuickHash()}`;
      const newShard: Partial<MediaShard> = {
        title: `SUSTAINABILITY_AUDIT: ${integrityStatus}`,
        type: 'ORACLE',
        source: 'Sustainability Oracle',
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: shardHash,
        mImpact: (currentM / 10).toFixed(2),
        size: '1.4 KB',
        content: oracleVerdict.text
      };
      
      await saveCollectionItem('media_ledger', newShard);
      setIsArchived(true);
      if (onMintEAT) onMintEAT(20, 'DIAGNOSTIC_LEDGER_ANCHOR_SUCCESS');
    } catch (e) {
      alert("LEDGER_FAILURE: Verification node timeout.");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDownloadReport = () => {
    if (!oracleVerdict) return;
    const shardId = `0x${generateQuickHash()}`;
    const report = `
ENVIROSAGRO™ SUSTAINABILITY AUDIT SHARD
=======================================
REGISTRY_ID: ${shardId}
NODE_AUTH: ${user.esin}
INTEGRITY_STATUS: ${integrityStatus}
M_CONSTANT_RESONANCE: ${currentM}
TIMESTAMP: ${new Date().toISOString()}

ORACLE VERDICT:
-------------------
${oracleVerdict.text}

-------------------
(c) 2025 EA_ROOT_NODE. Secure Shard Finality.
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SUSTAINABILITY_REPORT_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 relative max-w-2xl mx-auto px-4 md:px-0">
      
      {/* Omega Equilibrium Card */}
      <div className="glass-card p-10 md:p-14 rounded-[64px] border border-white/5 bg-black/40 text-center space-y-8 shadow-3xl">
        <div className="space-y-2">
          <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] italic">m _ R E S O N A N C E</p>
          <h4 className={`text-[100px] md:text-[140px] font-mono font-black tracking-tighter leading-none drop-shadow-[0_0_40px_rgba(244,63,94,0.3)] ${currentM < 1.42 ? 'text-[#f43f5e]' : 'text-emerald-400'}`}>
            {currentM.toFixed(3)}
          </h4>
        </div>
        <div className="space-y-4 pt-10 border-t border-white/5">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-600">Registry Alignment</span>
            <span className={currentM < 1.42 ? 'text-[#f43f5e] animate-pulse' : 'text-emerald-400'}>
              {integrityStatus}
            </span>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-[2s] shadow-[0_0_20px_currentColor] ${currentM < 1.42 ? 'bg-[#f43f5e]' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min(100, (currentM / 2) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Resonance Oracle & Waiting Ingest Section */}
      <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 shadow-3xl relative overflow-hidden group min-h-[600px] flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-3xl">
              <Bot size={36} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">RESONANCE <span className="text-indigo-400">ORACLE</span></h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">BIO_SPECTRAL_AUDITOR_V4.2</p>
            </div>
          </div>
          <button 
            onClick={handleRunDiagnostic}
            disabled={isAuditing}
            className="px-10 py-5 bg-[#10b981] hover:bg-[#0da270] rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all active:scale-90 flex items-center gap-3 border border-white/10"
          >
            {isAuditing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="white" />}
            INITIALIZE AUDIT
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center relative">
          {isAuditing ? (
            <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in">
              <Loader2 size={100} className="text-indigo-500 animate-spin mx-auto" />
              <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic">SEQUENCING...</p>
            </div>
          ) : oracleVerdict ? (
            <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-10">
              <div className="p-12 bg-black/80 rounded-[56px] border-2 border-indigo-500/20 shadow-3xl border-l-[16px] border-l-indigo-600 relative overflow-hidden">
                <div className="prose prose-invert max-w-none text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-6 border-l border-white/10">
                  {oracleVerdict.text}
                </div>
                <div className="mt-10 flex gap-4 relative z-10">
                  <button onClick={handleDownloadReport} className="p-3 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                    <Download size={20} />
                  </button>
                  <button 
                    onClick={handleAnchorToLedger}
                    disabled={isArchiving || isArchived}
                    className={`px-14 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ${isArchived ? 'bg-emerald-600/50 border-emerald-500/50' : 'agro-gradient'}`}
                  >
                    {isArchived ? 'ANCHORED' : 'ANCHOR'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-16 py-12 flex flex-col items-center">
              <div className="flex items-end gap-3 h-48 justify-center w-full max-w-xl opacity-60 group-hover:opacity-100 transition-opacity duration-1000">
                {[...Array(24)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 rounded-full bg-[#f43f5e] transition-all duration-[2s] shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                    style={{ 
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.08}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  ></div>
                ))}
              </div>
              <div className="text-center space-y-4">
                <p className="text-6xl md:text-7xl font-black uppercase tracking-[0.6em] text-white/20 italic m-0">WAITING_INGEST</p>
                <p className="text-xs md:text-sm font-black italic text-slate-700 uppercase tracking-widest leading-relaxed px-10">
                  Perform audit to synchronize planetary biome
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mugumo Root DID Section */}
      <div className="glass-card p-12 rounded-[64px] border border-white/10 bg-[#050706] shadow-3xl flex flex-col items-center gap-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)] pointer-events-none group-hover:scale-110 transition-transform duration-[10s] text-white"></div>
        
        <div className="text-center relative z-10 space-y-4">
           <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">MUGUMO <span className="text-emerald-400">ROOT DID</span></h3>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.6em] italic opacity-80">PROPRIETARY_ENCRYPTION_V6</p>
        </div>

        <div className="w-full max-w-sm aspect-square border-[4px] border-blue-500/20 rounded-[40px] bg-black/60 shadow-[inset_0_0_60px_rgba(59,130,246,0.1)] p-10 flex items-center justify-center relative group-hover:border-blue-400/40 transition-all duration-700">
           <DNAHelix isAggressive={integrityStatus === 'FRACTURED'} />
        </div>

        <div className="w-full relative z-10 px-4">
           <button className="w-full py-8 bg-white/[0.03] border-2 border-white/10 rounded-full text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-6 group/hsm">
              <Fingerprint size={28} className="text-indigo-400 group-hover:scale-110 transition-transform" /> 
              UNLOCK ROOT HSM
           </button>
        </div>
      </div>

      {/* System Manifest Card */}
      <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-[#050706] shadow-3xl group">
        <div className="flex items-center gap-6 mb-12 relative z-10 px-4">
           <div className="w-20 h-20 bg-emerald-600 rounded-[28px] shadow-3xl border-2 border-white/10 group-hover:rotate-6 transition-transform flex items-center justify-center">
              <Database size={32} className="text-white" />
           </div>
           <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">SYSTEM <span className="text-emerald-400">MANIFEST</span></h3>
        </div>
        
        <div className="grid grid-cols-1 gap-5 relative z-10">
           {SYSTEM_MANIFEST.map((item, i) => (
              <div key={i} className="p-8 bg-white/[0.02] border-2 border-white/5 rounded-[40px] group/item hover:border-emerald-500/30 hover:bg-white/5 transition-all flex items-center justify-between">
                 <div className="flex items-center gap-8">
                    <div className={`p-4 rounded-full bg-black/40 border border-white/10 ${item.col} group-hover/item:scale-110 group-hover/item:bg-emerald-950/20 transition-all shadow-xl`}>
                      <item.icon size={28} />
                    </div>
                    <div>
                       <h5 className="text-xl font-black text-white uppercase italic leading-none group-hover/item:text-emerald-400 transition-colors">{item.component}</h5>
                       <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-2 font-bold italic">{item.logic}</p>
                    </div>
                 </div>
                 <ChevronRight className="text-slate-800 group-hover/item:translate-x-2 group-hover/item:text-emerald-500 transition-all" size={24} />
              </div>
           ))}
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Sustainability;
