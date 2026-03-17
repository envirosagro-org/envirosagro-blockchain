import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  SmartphoneNfc, Cpu, MapPin, Search, X, Loader2, CheckCircle2, 
  ShieldCheck, ArrowRight, Upload, History, Binary, Bot, Leaf, 
  Satellite, Fingerprint, Lock, ShieldAlert, Zap, Globe, Compass, 
  Stamp, Workflow, Terminal, Code2, Download, AlertTriangle, Info,
  BadgeCheck, Monitor, History as HistoryIcon, Send, RefreshCw, Layers,
  FileText
} from 'lucide-react';
import { User, AgroResource, ViewState, SignalShard, HandshakeStep } from '../types';
import { generateHandshakeAgroLang } from '../services/agroLangService';

interface RegistryHandshakeProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState, section?: string) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
  onExecuteToShell?: (code: string) => void;
}

import { useAppStore } from '../store';
import { generateAlphanumericId } from '../systemFunctions';

const HARDWARE_PROTOCOL_STEPS: Partial<HandshakeStep>[] = [
  { id: 'NET_PAIR', label: 'Network Pairing' },
  { id: 'PROOF_INGEST', label: 'Ownership Proof' },
  { id: 'PHYSICAL_VERIFY', label: 'HQ Physical Audit' },
  { id: 'SYSTEM_AUDIT', label: 'System Finality' },
  { id: 'OS_SYNC', label: 'Network Sync' }
];

const LAND_PROTOCOL_STEPS: Partial<HandshakeStep>[] = [
  { id: 'GEO_LOCK', label: 'GPS / Geo-Lock' },
  { id: 'DOC_GEN', label: 'Document Generation' },
  { id: 'SOCIAL_AUTH', label: 'Social Authority' },
  { id: 'PHYSICAL_VERIFY', label: 'HQ Physical Audit' },
  { id: 'SYSTEM_AUDIT', label: 'System Finality' }
];

const RegistryHandshake: React.FC<RegistryHandshakeProps> = ({ 
  user, onUpdateUser, onSpendEAC, onNavigate, onEmitSignal, onExecuteToShell 
}) => {
  const { handshakeRegistrationState, setHandshakeRegistrationState } = useAppStore();
  const [showResumePrompt, setShowResumePrompt] = useState(!!handshakeRegistrationState);
  const [mode, setMode] = useState<'HARDWARE' | 'LAND' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  // Data collection
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Moisture Array');
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');
  const [agroLangShard, setAgroLangShard] = useState<any>(null);

  const isSuccessRef = useRef(false);
  const stateRef = useRef({ mode, currentStep, assetName, assetType, evidenceFile, esinSign, agroLangShard });

  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = { mode, currentStep, assetName, assetType, evidenceFile, esinSign, agroLangShard };
  }, [mode, currentStep, assetName, assetType, evidenceFile, esinSign, agroLangShard]);

  // Sync local state with handshakeRegistrationState
  useEffect(() => {
    if (handshakeRegistrationState && !showResumePrompt) {
      if (handshakeRegistrationState.mode) setMode(handshakeRegistrationState.mode);
      if (handshakeRegistrationState.currentStep) setCurrentStep(handshakeRegistrationState.currentStep);
      if (handshakeRegistrationState.assetName) setAssetName(handshakeRegistrationState.assetName);
      if (handshakeRegistrationState.assetType) setAssetType(handshakeRegistrationState.assetType);
      if (handshakeRegistrationState.evidenceFile) setEvidenceFile(handshakeRegistrationState.evidenceFile);
      if (handshakeRegistrationState.esinSign) setEsinSign(handshakeRegistrationState.esinSign);
      if (handshakeRegistrationState.agroLangShard) setAgroLangShard(handshakeRegistrationState.agroLangShard);
    }
  }, [handshakeRegistrationState, showResumePrompt]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (stateRef.current.mode && !isSuccessRef.current) {
        setHandshakeRegistrationState(stateRef.current);
      }
    };
  }, [setHandshakeRegistrationState]);

  const steps = mode === 'HARDWARE' ? HARDWARE_PROTOCOL_STEPS : LAND_PROTOCOL_STEPS;
  const isLastStep = currentStep === steps.length - 1;

  const handleModeSelect = (m: 'HARDWARE' | 'LAND') => {
    isSuccessRef.current = false;
    setMode(m);
    setCurrentStep(0);
    setEvidenceFile(null);
    setAgroLangShard(null);
    setAssetName('');
  };

  const handleNextStep = async () => {
    setIsProcessing(true);
    const stepId = steps[currentStep].id;

    try {
      if (mode === 'HARDWARE') {
        switch (stepId) {
          case 'NET_PAIR':
            setStatusMsg('ESTABLISHING SECURE TUNNEL...');
            await new Promise(r => setTimeout(r, 2000));
            break;
          case 'PROOF_INGEST':
            setStatusMsg('VERIFYING BIO-METRIC PROOF...');
            await new Promise(r => setTimeout(r, 1500));
            break;
          case 'PHYSICAL_VERIFY':
            setStatusMsg('WAITING FOR HQ AUDITOR QUORUM...');
            await new Promise(r => setTimeout(r, 2500));
            break;
          case 'SYSTEM_AUDIT':
            setStatusMsg('EXECUTING REGISTRY CROSS-CHECK...');
            await new Promise(r => setTimeout(r, 1500));
            break;
          case 'OS_SYNC':
            setStatusMsg('FORGING AGROLANG SYNC SHARD...');
            const res = await generateHandshakeAgroLang('HARDWARE', { name: assetName, type: assetType });
            setAgroLangShard(res.json);
            break;
        }
      } else {
        switch (stepId) {
          case 'GEO_LOCK':
            setStatusMsg('CALIBRATING GPS SHARDS...');
            await new Promise(r => setTimeout(r, 2000));
            break;
          case 'DOC_GEN':
            setStatusMsg('FORGING DOCUMENT SHARD...');
            const landRes = await generateHandshakeAgroLang('LAND', { name: assetName, loc: user.location });
            setAgroLangShard(landRes.json);
            break;
          case 'SOCIAL_AUTH':
            setStatusMsg('VERIFYING SOCIAL HANDSHAKE...');
            await new Promise(r => setTimeout(r, 1500));
            break;
          case 'PHYSICAL_VERIFY':
            setStatusMsg('NOTIFYING HQ AUDITORS...');
            await new Promise(r => setTimeout(r, 2000));
            break;
          case 'SYSTEM_AUDIT':
            setStatusMsg('FINALIZING LEDGER ANCHOR...');
            await new Promise(r => setTimeout(r, 1500));
            break;
        }
      }

      if (!isLastStep) {
        setCurrentStep(prev => prev + 1);
      } else if (agroLangShard || stepId === 'SYSTEM_AUDIT') {
        setCurrentStep(steps.length);
      }
    } catch (err) {
      alert("HANDSHAKE ERROR: Protocol sync failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalize = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    const fee = 100;
    if (!await onSpendEAC(fee, `REGISTRY_HANDSHAKE_${mode}`)) return;

    setIsProcessing(true);
    setStatusMsg('COMMITTING TO PERMANENT REGISTRY...');
    
    const newResource: AgroResource = {
      id: `SHD-${generateAlphanumericId(4)}`,
      category: mode!,
      name: assetName,
      type: assetType,
      status: 'VERIFIED',
      capabilities: ['Registry Sync', 'm-Resonance Ingest'],
      verificationMeta: {
        method: mode === 'HARDWARE' ? 'IOT_HANDSHAKE' : 'GEO_LOCK',
        verifiedAt: new Date().toISOString(),
        confidenceScore: 0.98,
        coordinates: user.coords || { lat: 0, lng: 0 }
      }
    };

    setTimeout(async () => {
      const currentResources = user.resources || [];
      onUpdateUser({ ...user, resources: [newResource, ...currentResources] });
      
      await onEmitSignal({
        type: 'ledger_anchor',
        origin: 'ORACLE',
        title: `${mode}_HANDSHAKE_FINALIZED`,
        message: `Node ${user.esin} anchored a new ${mode} shard: ${assetName}.`,
        priority: 'high',
        actionIcon: 'ShieldCheck'
      });

      isSuccessRef.current = true;
      setHandshakeRegistrationState(null);
      setIsProcessing(false);
      setCurrentStep(steps.length + 1); // Success state
    }, 2500);
  };

  const handleExecuteToShell = () => {
    if (agroLangShard?.code && onExecuteToShell) {
      onExecuteToShell(agroLangShard.code);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4 relative overflow-hidden">
      
      {/* HUD Header */}
      <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
            <SmartphoneNfc size={500} className="text-white" />
         </div>
         <div className="w-36 h-36 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] shrink-0 border-4 border-white/10 group-hover:scale-105 transition-all">
            <SmartphoneNfc size={64} className="text-white animate-float" />
         </div>
         <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
            <div className="space-y-1">
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Registry <span className="text-emerald-400">Handshake.</span></h2>
               <p className="text-emerald-500/60 text-[10px] font-mono tracking-[0.5em] uppercase mt-2">ZK_PAIRING_PROTOCOL_v6.5</p>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl">
               "Linking physical assets to the industrial grid. Complete protocol cycles for hardware pairing or physical land verification."
            </p>
         </div>
      </div>

      <div className="min-h-[750px] relative z-10">
        {!mode ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in zoom-in duration-500 max-w-4xl mx-auto">
              <div 
                 onClick={() => handleModeSelect('HARDWARE')}
                 className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-blue-500/40 transition-all group flex flex-col items-center text-center space-y-10 shadow-3xl cursor-pointer active:scale-95"
              >
                 <div className="p-10 rounded-[44px] bg-blue-600/10 border-2 border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                    <Cpu size={64} />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Hardware <span className="text-blue-400">Pairing</span></h4>
                    <p className="text-slate-500 text-lg font-medium italic">IOT nodes, drones, and processing machinery.</p>
                 </div>
              </div>
              <div 
                 onClick={() => handleModeSelect('LAND')}
                 className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group flex flex-col items-center text-center space-y-10 shadow-3xl cursor-pointer active:scale-95"
              >
                 <div className="p-10 rounded-[44px] bg-emerald-600/10 border-2 border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                    <MapPin size={64} />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Land <span className="text-emerald-400">Verification</span></h4>
                    <p className="text-slate-500 text-lg font-medium italic">Githaka plots and geofenced production nodes.</p>
                 </div>
              </div>
           </div>
        ) : currentStep < steps.length ? (
           <div className="max-w-4xl mx-auto space-y-12">
              <div className="flex gap-4 px-10 relative z-20">
                 {steps.map((s, i) => (
                    <div key={s.id} className="flex-1 flex flex-col gap-3">
                       <div className={`h-2 rounded-full transition-all duration-700 ${i <= currentStep ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`}></div>
                       <span className={`text-[8px] font-black uppercase text-center tracking-widest ${i === currentStep ? 'text-indigo-400' : 'text-slate-700'}`}>{s.label}</span>
                    </div>
                 ))}
              </div>

              <div className="glass-card p-16 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 shadow-4xl relative overflow-hidden flex flex-col items-center text-center space-y-10">
                 {isProcessing ? (
                    <div className="py-20 flex flex-col items-center gap-12 animate-in zoom-in">
                       <div className="relative">
                          <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Binary size={40} className="text-indigo-400 animate-pulse" />
                          </div>
                       </div>
                       <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">{statusMsg}</p>
                    </div>
                 ) : (
                    <div className="w-full space-y-12 animate-in slide-in-from-right-4 duration-500">
                       <div className="space-y-4">
                          <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">{steps[currentStep].label}</h3>
                          <p className="text-slate-400 text-xl font-medium italic opacity-70">
                             {mode === 'HARDWARE' 
                               ? 'Pairing hardware via robust network handshake to secure the M2M bridge.' 
                               : 'Triggering GPS geo-lock to verify biological cluster coordinates.'}
                          </p>
                       </div>

                       {currentStep === 0 && (
                          <div className="max-w-xl mx-auto space-y-8">
                             <div className="space-y-3 px-4 text-left">
                                <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-4">Asset Alias</label>
                                <input 
                                   type="text" value={assetName} onChange={e => setAssetName(e.target.value)}
                                   placeholder="e.g. Zone 4 Soil Array"
                                   className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-stone-900 shadow-inner italic" 
                                />
                             </div>
                             <button onClick={handleNextStep} disabled={!assetName} className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ring-white/5 active:scale-95 disabled:opacity-30">
                                INITIALIZE HANDSHAKE <ArrowRight size={20} />
                             </button>
                          </div>
                       )}

                       {mode === 'HARDWARE' && currentStep === 1 && (
                          <div className="space-y-10">
                             <div 
                                onClick={() => setEvidenceFile('MOCK_FILE')}
                                className={`max-w-xl mx-auto p-20 border-4 border-dashed rounded-[56px] flex flex-col items-center justify-center text-center space-y-8 group/upload cursor-pointer transition-all ${evidenceFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-indigo-500/40 bg-black/40'}`}
                             >
                                {!evidenceFile ? (
                                   <>
                                      <Upload size={48} className="text-slate-700 group-hover:text-indigo-400 transition-all" />
                                      <p className="text-xl font-black text-white uppercase italic">Upload Proof of Ownership</p>
                                   </>
                                ) : (
                                   <>
                                      <CheckCircle2 size={48} className="text-emerald-500" />
                                      <p className="text-xl font-black text-white uppercase italic">Evidence Buffered</p>
                                   </>
                                )}
                             </div>
                             <button onClick={handleNextStep} disabled={!evidenceFile} className="w-full max-w-xl py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-xl mx-auto">CONTINUE TO AUDIT</button>
                          </div>
                       )}

                       {mode === 'LAND' && currentStep === 1 && (
                          <div className="space-y-10">
                             <div className="p-12 glass-card rounded-[64px] border border-white/10 bg-black/60 max-w-xl mx-auto space-y-8 shadow-inner">
                                <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 w-fit mx-auto shadow-2xl">
                                   <FileText size={40} />
                                </div>
                                <h4 className="text-xl font-black text-white uppercase italic">Generated Deed Shard</h4>
                                <p className="text-slate-400 text-sm italic">"Download this document and verify it via social authority signatures before sharding back to HQ."</p>
                                <button className="w-full py-5 bg-white/5 border border-white/10 hover:bg-white text-slate-300 hover:text-black rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                                   <Download size={20} /> DOWNLOAD_DEED_SHARD
                                </button>
                             </div>
                             <button onClick={handleNextStep} className="w-full max-w-xl py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-xl mx-auto">I HAVE VERIFIED DOCUMENT</button>
                          </div>
                       )}

                       {currentStep >= 2 && !isProcessing && (
                          <div className="space-y-12 animate-in slide-in-from-bottom-6">
                             {agroLangShard && (
                                <div className="p-10 bg-black/90 rounded-[48px] border border-indigo-500/20 shadow-3xl text-left relative overflow-hidden group/shard">
                                   <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/shard:scale-110 transition-transform"><Code2 size={400} /></div>
                                   <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
                                      <Code2 size={28} className="text-indigo-400" />
                                      <h4 className="text-2xl font-black text-white uppercase italic">AgroLang Logic Shard</h4>
                                   </div>
                                   <pre className="text-emerald-400 font-mono text-lg leading-loose italic whitespace-pre-wrap select-all">
                                      {agroLangShard.code}
                                   </pre>
                                   <div className="mt-10 flex gap-4">
                                      <button onClick={handleExecuteToShell} className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all">EXECUTE IN SHELL</button>
                                   </div>
                                </div>
                             )}

                             <div className="p-8 bg-black/60 rounded-[48px] border-2 border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group">
                                <div className="text-left space-y-2">
                                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Process Verification</h4>
                                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">AWAITING_STEP_{currentStep + 1}</p>
                                </div>
                                <button 
                                   onClick={handleNextStep}
                                   className="px-16 py-6 bg-white hover:bg-slate-200 text-black rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
                                >
                                   PROCEED_TO_FINALITY
                                </button>
                             </div>
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        ) : currentStep === steps.length ? (
           <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-1000 flex flex-col items-center">
              <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center text-white shadow-[0_0_120px_rgba(16,185,129,0.5)] scale-110 relative group">
                 <CheckCircle2 size={100} className="group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-[-15px] border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                 <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-6 text-center">
                 <h3 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">SHARD <span className="text-emerald-400">READY.</span></h3>
                 <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[1em] font-mono leading-none">AWAITING_SIGNATURE_AUTH</p>
              </div>

              <div className="w-full max-w-2xl space-y-8">
                 <div className="space-y-4">
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] block text-center italic">NODE_SIGNATURE_AUTH (ESIN)</label>
                    <input 
                       type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                       placeholder="EA-XXXX-XXXX-XXXX" 
                       className="w-full bg-black border-2 border-white/10 rounded-[56px] py-12 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-emerald-500/10 transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                    />
                 </div>
                 <button 
                    onClick={handleFinalize}
                    disabled={isProcessing || !esinSign}
                    className="w-full py-12 md:py-16 agro-gradient rounded-[64px] text-white font-black text-lg uppercase tracking-[0.5em] shadow-[0_0_150px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-10 border-4 border-white/10 ring-[24px] ring-white/5"
                 >
                    {isProcessing ? <Loader2 className="w-12 h-12 animate-spin" /> : <Stamp size={40} className="fill-current" />}
                    {isProcessing ? 'SYNCHRONIZING...' : 'COMMIT TO LEDGER'}
                 </button>
              </div>
           </div>
        ) : (
           <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-1000 flex flex-col items-center">
              <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center text-white shadow-[0_0_120px_rgba(16,185,129,0.5)] scale-110 relative group">
                 <CheckCircle2 size={100} className="group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-[-15px] border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                 <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-6 text-center">
                 <h3 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">SHARD <span className="text-emerald-400">ANCHORED.</span></h3>
                 <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[1em] font-mono leading-none">HASH_COMMIT_0xHS_FINAL_OK</p>
              </div>
              <button onClick={() => setMode(null)} className="px-10 py-4 text-[10px] font-black text-slate-700 hover:text-white transition-colors uppercase tracking-widest">Register Another Shard</button>
           </div>
        )}
      </div>

      {showResumePrompt && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-black border border-emerald-500/30 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Confirm Form Resubmission</h3>
            <p className="text-slate-400 mb-8 text-sm">You have an incomplete registration process. Would you like to resume where you left off or start a new registration?</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => { isSuccessRef.current = false; setShowResumePrompt(false); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Resume Registration
              </button>
              <button onClick={() => { isSuccessRef.current = false; setHandshakeRegistrationState(null); setShowResumePrompt(false); setMode(null); }} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .shadow-4xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.98); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default RegistryHandshake;