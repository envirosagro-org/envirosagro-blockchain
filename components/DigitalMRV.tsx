
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Scan, 
  Upload, 
  Bot, 
  Zap, 
  ShieldCheck, 
  Binary, 
  Database, 
  TrendingUp, 
  CheckCircle2, 
  X, 
  Loader2, 
  TreePine, 
  Activity, 
  MapPin, 
  Lock, 
  Key, 
  Layers, 
  Monitor, 
  SearchCode, 
  Coins, 
  Gauge, 
  Fingerprint, 
  Smartphone, 
  Leaf,
  ArrowRight,
  ChevronRight,
  Stamp,
  Target,
  Globe,
  RefreshCw,
  Terminal,
  AlertTriangle,
  Waves,
  ShieldAlert,
  Landmark,
  ArrowLeftCircle,
  Info,
  Network,
  Trash2,
  Wind
} from 'lucide-react';
import { User, AgroResource, ViewState, SignalShard } from '../types';
import { analyzeMRVEvidence } from '../services/agroLangService';

interface DigitalMRVProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onUpdateUser: (user: User) => void;
  onNavigate?: (view: ViewState) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
}

const DigitalMRV: React.FC<DigitalMRVProps> = ({ user, onEarnEAC, onSpendEAC, onUpdateUser, onNavigate, onEmitSignal }) => {
  const [isAccessVerifying, setIsAccessVerifying] = useState(true);
  
  const landResources = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'LAND'),
    [user.resources]
  );

  const hasLandRegistered = landResources.length > 0;

  const [pipelineStep, setPipelineStep] = useState<'land_select' | 'ingest' | 'verify' | 'mint' | 'success'>(
    'land_select'
  );
  
  const [selectedLand, setSelectedLand] = useState<AgroResource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null);
  const [evidenceBase64, setEvidenceBase64] = useState<string | null>(null);
  const [oracleResult, setOracleResult] = useState<any | null>(null);
  const [esinSign, setEsinSign] = useState('');
  const [mintedValue, setMintedValue] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAccessVerifying(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const MINTING_FACTOR = 100;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEvidenceFile(base64);
        setEvidenceBase64(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLand = (e: React.MouseEvent, landId: string) => {
    e.stopPropagation();
    if (confirm("ARCHIVE_COMMAND: Confirm permanent deletion of this geofence shard from the registry?")) {
      const updatedResources = (user.resources || []).filter(r => r.id !== landId);
      onUpdateUser({ ...user, resources: updatedResources });
    }
  };

  const runVerifyOracle = async () => {
    if (!evidenceFile || !selectedLand) return;
    setIsProcessing(true);
    setPipelineStep('verify');
    try {
      const result = await analyzeMRVEvidence(
        `Field evidence for carbon sequestration sharding on Land Shard ${selectedLand.id}. Verify DBH and biomass for local node.`,
        evidenceBase64 || undefined
      );
      setOracleResult(result);
      
      const carbon = result.metrics?.carbon_sequestration_potential || 0;
      const alpha = result.confidence_alpha || 0;
      setMintedValue(Math.floor(carbon * MINTING_FACTOR * alpha));
      
    } catch (e) {
      alert("Oracle handshake interrupted. Node synchronization failure.");
      setPipelineStep('ingest');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteMint = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onEarnEAC(mintedValue, `MRV_VERIFIED_CARBON_MINT_SHARD_${selectedLand?.id || 'GLOBAL'}`);
      
      // Emit Ledger Signal
      onEmitSignal({
        type: 'ledger_anchor',
        origin: 'CARBON',
        title: 'CARBON_SHARD_MINTED',
        message: `Node ${user.esin} minted ${mintedValue} EAC from ${oracleResult?.metrics?.carbon_sequestration_potential} tCO2e sequestration proof.`,
        priority: 'high',
        actionIcon: 'Wind',
        meta: { target: 'digital_mrv', ledgerContext: 'CARBON' }
      });

      setPipelineStep('success');
      setIsProcessing(false);
    }, 3000);
  };

  if (isAccessVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl">
            <Lock size={32} className="animate-pulse" />
          </div>
          <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-3xl animate-ping opacity-20"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-[0.4em] italic">Handshaking Node...</h3>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Registry_Access_Check // Secure_Ingest_v5</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 max-w-[1000px] mx-auto px-4">
      
      {/* 3-Layer Architecture HUD */}
      <div className="space-y-4">
         {[
           { l: 'LAYER 1: THE EDGE', v: 'INGEST', i: Smartphone, c: 'text-blue-400', d: 'Telemetry Inflow' },
           { l: 'LAYER 2: VALIDATOR HUB', v: 'VERIFY', i: Bot, c: 'text-indigo-400', d: 'Oracle Validation' },
           { l: 'LAYER 3: BLOCKCHAIN', v: 'MINT', i: Binary, c: 'text-emerald-400', d: 'Token Finality' },
         ].map((layer, idx) => (
           <div key={idx} className="glass-card p-6 rounded-[32px] border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:border-white/10 transition-all shadow-xl">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:rotate-6 transition-transform">
                    <layer.i size={24} className={layer.c} />
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{layer.l}</p>
                    <h4 className="text-xl font-black text-white italic tracking-tighter">{layer.d}</h4>
                 </div>
              </div>
              <div className={`px-4 py-1.5 rounded-lg text-[9px] font-mono font-black ${layer.c} bg-white/5 border border-white/10`}>
                 {layer.v}_READY
              </div>
           </div>
         ))}
      </div>

      <div className="min-h-[500px] py-6">
        {pipelineStep === 'land_select' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col justify-center">
             <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-600/20 border border-emerald-500/30 rounded-[28px] flex items-center justify-center text-emerald-400 mx-auto shadow-2xl animate-float">
                   <Landmark size={36} />
                </div>
                <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">LAND <span className="text-emerald-400">SELECTION</span></h3>
                <p className="text-slate-400 text-lg font-medium italic max-w-lg mx-auto">Select a registered land shard to associate your carbon mining evidence.</p>
             </div>

             {hasLandRegistered ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {landResources.map(land => (
                    <div 
                      key={land.id}
                      onClick={() => { setSelectedLand(land); setPipelineStep('ingest'); }}
                      className="glass-card p-10 rounded-[48px] border-2 border-white/5 hover:border-emerald-500/40 bg-black/40 flex flex-col items-center text-center space-y-6 transition-all group cursor-pointer active:scale-[0.98] shadow-2xl relative"
                    >
                        <button 
                          onClick={(e) => handleDeleteLand(e, land.id)}
                          className="absolute top-6 right-6 p-3 bg-rose-600/10 border border-rose-500/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-2xl transition-all opacity-0 group-hover:opacity-100 z-30 shadow-xl"
                          title="Delete Land Shard"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[32px] flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                          <TreePine size={32} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-white uppercase italic truncate m-0">{land.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2">{land.id}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest ${
                          land.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/20'
                        }`}>
                          {land.status}
                        </span>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="max-w-2xl mx-auto text-center p-12 glass-card rounded-[64px] border-rose-500/20 bg-rose-500/5 space-y-10 shadow-3xl">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="w-24 h-24 bg-rose-600/10 rounded-[32px] border-2 border-rose-500/20 flex items-center justify-center text-rose-500 shadow-2xl relative z-10">
                      <ShieldAlert size={48} />
                    </div>
                    <div className="absolute inset-[-10px] rounded-full border border-dashed border-rose-500/20 animate-spin-slow"></div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">REGISTRY <span className="text-rose-500">GATE</span></h2>
                    <p className="text-slate-400 text-base font-medium leading-relaxed italic">
                      "Digital MRV sharding requires an anchored physical location. No **LAND** resources detected on this node."
                    </p>
                  </div>
                  <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 text-left space-y-4 shadow-inner group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400"><Info size={16} /></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Reaction</p>
                    </div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      To initiate carbon mining, you must first pair your physical plot with the network. This establishes the geofence shards needed for satellite verification.
                    </p>
                  </div>
                  <button 
                    onClick={() => onNavigate?.('registry_handshake')}
                    className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-[32px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 ring-4 ring-emerald-500/5"
                  >
                    <Landmark size={20} /> INITIALIZE HANDSHAKE
                  </button>
               </div>
             )}
          </div>
        )}

        {pipelineStep === 'ingest' && (
           <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <button 
                onClick={() => setPipelineStep('land_select')}
                className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-all"
              >
                <ArrowLeftCircle size={16} /> Back to Land Select
              </button>

              <div className="text-center space-y-4">
                 <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white mx-auto shadow-2xl animate-float">
                    <Upload size={36} />
                 </div>
                 <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">EVIDENCE <span className="text-blue-400">INGEST</span></h3>
                 <p className="text-slate-400 text-lg font-medium italic max-w-lg mx-auto">
                    Uploading for Land Shard: <span className="text-emerald-400 font-black uppercase font-mono">{selectedLand?.id}</span>
                 </p>
              </div>

              <div className="flex justify-center">
                 <button 
                   onClick={() => onNavigate?.('multimedia_generator')}
                   className="px-8 py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3 shadow-xl"
                 >
                    <Leaf size={16} /> GENERATE_EVIDENCE_SHARD
                 </button>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`max-w-xl mx-auto p-16 border-4 border-dashed rounded-[64px] flex flex-col items-center justify-center text-center space-y-8 group/upload cursor-pointer transition-all ${evidenceFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-blue-500/40 bg-black/40'}`}
              >
                 <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                 {evidenceFile ? (
                   <div className="relative w-full aspect-square rounded-[40px] overflow-hidden shadow-3xl border-2 border-emerald-500/40 group-hover/upload:scale-105 transition-transform duration-500">
                      <img src={evidenceFile} className="w-full h-full object-cover" alt="Evidence" />
                   </div>
                 ) : (
                   <>
                      <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover/upload:scale-110 transition-transform">
                         <Scan size={32} className="text-blue-400" />
                      </div>
                      <div className="space-y-2">
                         <p className="text-2xl font-black text-white uppercase italic tracking-tighter">CHOOSE IMAGE SHARD</p>
                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">Visual Proof for DBH Verification</p>
                      </div>
                   </>
                 )}
              </div>

              <div className="max-w-xl mx-auto space-y-6">
                 <div className="flex items-center gap-3 px-4">
                    <Activity size={18} className="text-blue-400" />
                    <h4 className="text-base font-black text-white uppercase tracking-widest italic">DATA CONFIDENCE</h4>
                 </div>
                 <div className="space-y-3">
                    {[
                       { l: 'SELF-REPORTED', a: '0.50', active: !evidenceFile },
                       { l: 'AGRO LANG VERIFIED PHOTO', a: '0.85', active: !!evidenceFile },
                       { l: 'IOT / SPECTRAL LINK', a: '1.00', active: false },
                    ].map((tier, i) => (
                       <div key={i} className={`px-8 py-6 rounded-[24px] border transition-all flex justify-between items-center ${tier.active ? 'bg-blue-600/10 border-blue-500 shadow-inner ring-1 ring-blue-500/20' : 'bg-white/5 border-transparent opacity-40'}`}>
                          <span className="text-[11px] font-black uppercase text-slate-300 tracking-[0.2em]">{tier.l}</span>
                          <span className="text-xl font-mono font-black text-blue-400">α {tier.a}</span>
                       </div>
                    ))}
                 </div>
                 <p className="text-[10px] text-slate-600 italic leading-relaxed px-4">"The Confidence Score (α) directly weights the final EAC payout. Higher quality data yields more value."</p>
              </div>

              <button 
                onClick={runVerifyOracle}
                disabled={!evidenceFile || isProcessing}
                className="w-full py-8 bg-emerald-950/20 border border-emerald-500/20 rounded-[48px] text-emerald-500/80 font-black text-[13px] uppercase tracking-[0.4em] shadow-3xl hover:bg-emerald-600/10 hover:text-emerald-400 transition-all flex items-center justify-center gap-6 disabled:opacity-20 active:scale-[0.98]"
              >
                 {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : "INITIALIZE ORACLE VALIDATION"}
                 <Zap size={20} className="fill-current" />
              </button>
           </div>
        )}

        {pipelineStep === 'verify' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500">
              <div className="glass-card rounded-[64px] min-h-[500px] border border-white/5 bg-black/40 flex flex-col relative overflow-hidden shadow-3xl">
                 <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4 text-indigo-400">
                       <Terminal className="w-6 h-6" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Oracle Validation Stream</span>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                          <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest">SYNCING_L2_MODEL</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                    {isProcessing ? (
                       <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                          <div className="relative">
                             <Loader2 className="w-24 h-24 text-indigo-500 animate-spin mx-auto" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <SearchCode className="w-10 h-10 text-indigo-400 animate-pulse" />
                             </div>
                          </div>
                          <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic">SEQUENCING BIOMASS SHARD...</p>
                       </div>
                    ) : oracleResult ? (
                       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-10 duration-700">
                          <div className="lg:col-span-4 space-y-8">
                             <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 space-y-6 shadow-inner text-center group">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">Confidence Shard (α)</p>
                                <h5 className="text-8xl font-mono font-black text-indigo-400 tracking-tighter group-hover:scale-110 transition-transform">{oracleResult.confidence_alpha}</h5>
                                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/5 py-2 rounded-xl">L2_VERIFICATION_STABLE</p>
                             </div>
                          </div>

                          <div className="lg:col-span-8 space-y-10">
                             <div className="p-10 md:p-14 bg-black/80 rounded-[64px] border border-indigo-500/20 shadow-3xl border-l-8 border-l-indigo-500 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><Layers size={400} /></div>
                                <div className="flex items-center gap-6 mb-10 relative z-10 border-b border-white/5 pb-6">
                                   <Bot className="w-10 h-10 text-indigo-400" />
                                   <div>
                                      <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">Verification Narrative</h4>
                                      <p className="text-indigo-400/60 text-[9px] font-black uppercase tracking-widest mt-1">EASF_AUDIT_LOG_SHARD</p>
                                   </div>
                                </div>
                                <div className="text-slate-300 text-xl leading-loose italic whitespace-pre-line font-medium relative z-10">
                                   {oracleResult.verification_narrative}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative z-10">
                                   {[
                                      { l: 'Est. DBH', v: `${oracleResult.metrics.estimated_dbh_cm}cm`, i: Target, c: 'text-indigo-400' },
                                      { l: 'Biomass Mass', v: `${oracleResult.metrics.biomass_tonnes}t`, i: Activity, c: 'text-emerald-400' },
                                      { l: 'C-Sequestration', v: `${oracleResult.metrics.carbon_sequestration_potential}tCO2e`, i: Waves, c: 'text-blue-400' },
                                   ].map((m, i) => (
                                      <div key={i} className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center group/metric hover:border-white/20 transition-all">
                                         <m.i className={`w-5 h-5 ${m.c} mx-auto mb-3 opacity-30 group-hover/metric:opacity-100 transition-opacity`} />
                                         <p className="text-[9px] text-slate-500 uppercase font-black mb-1">{m.l}</p>
                                         <p className={`text-xl font-mono font-black ${m.c}`}>{m.v}</p>
                                      </div>
                                   ))}
                                </div>
                             </div>

                             <div className="flex justify-center pt-8">
                                <button 
                                  onClick={() => setPipelineStep('mint')}
                                  className="px-20 py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5"
                                >
                                   PROCEED TO BLOCKCHAIN MINT <Binary size={24} />
                                </button>
                             </div>
                          </div>
                       </div>
                    ) : null}
                 </div>
              </div>
           </div>
        )}

        {pipelineStep === 'mint' && (
           <div className="max-w-3xl mx-auto space-y-12 animate-in zoom-in duration-500">
              <div className="glass-card p-16 rounded-[64px] border-emerald-500/20 bg-[#050706] shadow-3xl text-center space-y-12 border-2 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[40px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl animate-float">
                       <Binary size={48} className="text-emerald-400" />
                    </div>
                    <div>
                       <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Blockchain <span className="text-emerald-400">Mint</span></h3>
                       <p className="text-slate-400 text-xl font-medium mt-4">Authorized sharding of carbon value into deflationary EAC credits.</p>
                    </div>
                 </div>

                 <div className="p-12 bg-black/80 rounded-[56px] border border-white/10 space-y-10 shadow-inner relative z-10">
                    <div className="flex justify-between items-center px-6">
                       <div className="text-left space-y-1">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Weighted Carbon</p>
                          <p className="text-3xl font-mono font-black text-white">
                             {(oracleResult.metrics.carbon_sequestration_potential * oracleResult.confidence_alpha).toFixed(2)} <span className="text-xs text-slate-700">tCO2e</span>
                          </p>
                       </div>
                       <div className="h-14 w-px bg-white/5"></div>
                       <div className="text-right space-y-1">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Token Multiplier (M)</p>
                          <p className="text-3xl font-mono font-black text-indigo-400">{MINTING_FACTOR}x</p>
                       </div>
                    </div>
                    
                    <div className="h-px w-full bg-white/5"></div>
                    
                    <div className="space-y-4">
                       <p className="text-[11px] text-emerald-400 font-black uppercase tracking-[0.4em]">EXPECTED_MINT_YIELD</p>
                       <h5 className="text-9xl font-mono font-black text-white tracking-tighter drop-shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                          {mintedValue}<span className="text-3xl ml-2 font-black text-emerald-500">EAC</span>
                       </h5>
                    </div>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center">Node Signature Auth (ESIN)</label>
                       <input 
                         type="text" 
                         value={esinSign}
                         onChange={e => setEsinSign(e.target.value)}
                         placeholder="EA-XXXX-XXXX-XXXX" 
                         className="w-full bg-black border border-white/10 rounded-[32px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                       />
                    </div>
                    
                    <button 
                      onClick={handleExecuteMint}
                      disabled={isProcessing || !esinSign}
                      className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all ring-8 ring-emerald-500/5"
                    >
                       {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp size={32} className="fill-current" />}
                       {isProcessing ? "ANCHORING ON-CHAIN..." : "EXECUTE BLOCKCHAIN MINT"}
                    </button>
                    <button onClick={() => setPipelineStep('verify')} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white">Audit Transaction Log</button>
                 </div>
              </div>
           </div>
        )}

        {pipelineStep === 'success' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 animate-in zoom-in duration-700 text-center">
              <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.5)] scale-110 relative group">
                 <CheckCircle2 className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                 <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4 text-center">
                 <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0">SHARD <span className="text-emerald-400">MINTED.</span></h3>
                 <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">HASH_COMMIT_0x{(Math.random()*1000).toFixed(0)}_FINAL</p>
              </div>
              <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-emerald-500/5 space-y-8 max-w-lg w-full shadow-2xl">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-black uppercase tracking-widest italic">Registry Deposit</span>
                    <span className="text-white font-mono font-black text-2xl text-emerald-400">+{mintedValue} EAC</span>
                 </div>
                 <div className="h-px w-full bg-white/10"></div>
                 <div className="flex items-center gap-6 text-left">
                    <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                       <ShieldCheck size={28} />
                    </div>
                    <div>
                       <p className="text-xs font-black text-white uppercase">Sovereign Proof Locked</p>
                       <p className="text-[10px] text-slate-500 italic">"This asset is immutably anchored to the Layer-3 industrial ledger."</p>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => setPipelineStep('land_select')}
                className="px-16 py-7 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95"
              >
                 Return to Hub
              </button>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
      `}</style>
    </div>
  );
};

export default DigitalMRV;
