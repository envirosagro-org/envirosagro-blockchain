import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, ShieldCheck, Zap, Loader2, Cpu, Camera, 
  FileText, Microscope, Binary, Coins, Bot,
  ArrowRight, Heart, Leaf, Dna, Database, CheckCircle2,
  AlertCircle, Cloud, MapPin, ClipboardCheck, Lock,
  Radio, Archive, Info, History, ArrowLeftCircle, Video,
  ChevronRight,
  Target,
  Trello
} from 'lucide-react';
import { User, ViewState } from '../types';
import { diagnoseCropIssue } from '../services/agroLangService';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onMinted: (value: number) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  taskToIngest?: any | null; // Optional task context passed from the system
}

type Step = 'ingest_type' | 'task_summary' | 'thrust' | 'upload' | 'audit' | 'settlement' | 'success';

const EvidenceModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, user, onMinted, onNavigate, taskToIngest }) => {
  const [step, setStep] = useState<Step>('ingest_type');
  const [thrust, setThrust] = useState<string>('Technological');
  const [evidenceType, setEvidenceType] = useState<string>('Soil Scan');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedValue, setMintedValue] = useState(45.00);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && taskToIngest) {
      setStep('task_summary');
      setThrust(taskToIngest.thrust);
      setEvidenceType(taskToIngest.title);
    }
  }, [isOpen, taskToIngest]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setStep('audit');
        runAudit(f, reader.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const runAudit = async (fileObj: File, base64: string) => {
    setIsAuditing(true);
    try {
      // Mock upload URL since storage is removed
      const url = "https://mock-storage.envirosagro.org/shards/" + fileObj.name;
      setDownloadUrl(url);

      const contextDesc = taskToIngest 
        ? `Task: ${taskToIngest.title} (ID: ${taskToIngest.id}) fulfillment evidence.`
        : `New ${evidenceType} evidence ingest.`;
      
      const res = await diagnoseCropIssue(`${contextDesc} Evaluate this proof for the ${thrust} thrust. Evidence URL: ${url}`);
      setAuditReport(res.text);
      setMintedValue(Math.floor(Math.random() * 50) + 40); 
      setStep('settlement');
    } catch (err) {
      alert("Registry Audit Failed. Check node connection.");
      setStep('upload');
    } finally {
      setIsAuditing(false);
    }
  };

  const executeMint = () => {
    setIsMinting(true);
    setTimeout(() => {
      onMinted(mintedValue);
      setStep('success');
      setIsMinting(false);
    }, 2500);
  };

  const handleLiveIngest = () => {
    onClose();
    onNavigate('media', 'EVIDENCE');
  };

  const reset = () => {
    setStep('ingest_type');
    setFile(null);
    setPreview(null);
    setAuditReport(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={reset}></div>
      
      <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-in zoom-in duration-300 border-2">
        <div className="p-12 space-y-10 min-h-[650px] flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Upload className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Evidence <span className="text-emerald-400">Ingest</span></h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Steward: {user.esin}</p>
              </div>
            </div>
            <button onClick={reset} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex gap-2">
            {(['ingest_type', 'thrust', 'upload', 'settlement', 'success'] as Step[]).map((s, i) => {
              const stages = ['ingest_type', 'thrust', 'upload', 'settlement', 'success'];
              const actualStep = step === 'task_summary' ? 'ingest_type' : (step === 'audit' ? 'upload' : step);
              const currentIndex = stages.indexOf(actualStep as any);
              return (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${i <= currentIndex ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-white/10'}`}></div>
              );
            })}
          </div>

          {step === 'ingest_type' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col justify-center">
              <div className="text-center space-y-4">
                <h4 className="text-2xl font-black text-white uppercase tracking-widest">Select Ingest Protocol</h4>
                <p className="text-slate-400 text-lg italic">Choose how you want to synchronize your field evidence.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={handleLiveIngest}
                  className="glass-card p-10 rounded-[48px] border-2 border-white/5 hover:border-blue-500/40 bg-blue-950/10 flex flex-col items-center text-center space-y-6 transition-all group"
                >
                  <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                    <Radio size={40} className="animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-xl font-black text-white uppercase italic">Live Stream Ingest</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest leading-relaxed">
                      Broadcast real-time field data shards. Origin of high-frequency public proof.
                    </p>
                  </div>
                </button>

                <button 
                  onClick={() => setStep('thrust')}
                  className="glass-card p-10 rounded-[48px] border-2 border-white/5 hover:border-emerald-500/40 bg-emerald-950/10 flex flex-col items-center text-center space-y-6 transition-all group"
                >
                  <div className="w-20 h-20 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                    <Archive size={40} />
                  </div>
                  <div>
                    <h5 className="text-xl font-black text-white uppercase italic">Cloud Storage Ingest</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest leading-relaxed">
                      Anchor existing multi-spectral shards to the permanent storage bucket.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'task_summary' && taskToIngest && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-indigo-600/20 border border-indigo-500/30 rounded-[36px] flex items-center justify-center text-indigo-400 mx-auto shadow-2xl animate-pulse">
                   <Target size={48} />
                </div>
                <div>
                   <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Task <span className="text-indigo-400">Fulfillment</span></h4>
                   <p className="text-slate-500 text-lg mt-4 italic">"Physical ingest for an internally committed mission shard."</p>
                </div>
              </div>

              <div className="p-10 bg-black/80 rounded-[48px] border border-white/10 shadow-inner space-y-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform"><Trello size={160} /></div>
                 <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Target Task</p>
                       <h5 className="text-2xl font-black text-white uppercase italic">{taskToIngest.title}</h5>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setStep('upload')}
                className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6"
              >
                <Upload size={20} /> COMMENCE PHYSICAL INGEST
              </button>
            </div>
          )}

          {step === 'thrust' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'Societal', icon: Heart, col: 'text-rose-400' },
                  { id: 'Environmental', icon: Leaf, col: 'text-emerald-400' },
                  { id: 'Human', icon: Dna, col: 'text-teal-400' },
                  { id: 'Technological', icon: Cpu, col: 'text-blue-400' },
                  { id: 'Industry', icon: Database, col: 'text-purple-400' },
                ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setThrust(t.id)}
                    className={`p-8 rounded-[40px] border flex flex-col items-center text-center gap-4 transition-all ${thrust === t.id ? 'bg-emerald-600 border-white text-white shadow-2xl scale-105' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                  >
                    <t.icon className={`w-10 h-10 ${thrust === t.id ? 'text-white' : t.col}`} />
                    <span className="text-xs font-black uppercase tracking-widest italic">{t.id}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('upload')} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Continue to Data Ingest</button>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
               <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-20 border-4 border-dashed border-white/5 rounded-[48px] bg-black/40 flex flex-col items-center justify-center text-center space-y-6 group hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition-all cursor-pointer shadow-inner"
                 >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
                    <Cloud className="w-12 h-12 text-emerald-400" />
                    <p className="text-xl font-black text-white uppercase tracking-tighter">Choose Shard File</p>
                 </div>
            </div>
          )}

          {step === 'audit' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in duration-500">
               <div className="relative">
                  <div className="w-48 h-48 rounded-full border-8 border-emerald-500/10 flex items-center justify-center shadow-2xl">
                     <Microscope className="w-20 h-20 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 border-t-8 border-emerald-500 rounded-full animate-spin"></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Registry <span className="text-emerald-400">Syncing</span></h3>
                  <p className="text-emerald-500/60 font-mono text-sm animate-pulse uppercase tracking-[0.4em]">Analyzing Shard Payload...</p>
               </div>
            </div>
          )}

          {step === 'settlement' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1">
               <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-4">
                  <div className="p-8 bg-black/60 rounded-[40px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-4 border-l-indigo-500/50">
                     <p className="text-slate-300 text-lg leading-loose italic whitespace-pre-line">
                        {auditReport}
                     </p>
                  </div>
               </div>

               <button 
                onClick={executeMint}
                disabled={isMinting}
                className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
               >
                  {isMinting ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-8 h-8" />}
                  {isMinting ? "MINTING EAC SHARDS..." : "AUTHORIZE MINT & SCHEDULE AUDIT"}
               </button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
               <div className="w-40 h-40 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                  <CheckCircle2 className="w-20 h-20 text-white group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping"></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">Minting <span className="text-emerald-400">Success</span></h3>
               </div>
               <button onClick={reset} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl">Return to Hub</button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default EvidenceModal;