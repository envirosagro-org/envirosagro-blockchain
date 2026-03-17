import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldPlus, 
  Building, 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight, 
  ClipboardCheck, 
  HardHat, 
  Scale, 
  GanttChartSquare, 
  Database, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Bot, 
  Leaf, 
  Fingerprint, 
  Activity, 
  Search, 
  Clock, 
  Download,
  Users,
  Briefcase,
  History,
  FileCheck,
  Eye,
  Send,
  Stamp,
  Link2,
  Info,
  MapPin,
  User as UserIcon,
  PlusCircle,
  ChevronRight,
  ArrowLeftCircle,
  AlertCircle
} from 'lucide-react';
import { User, ViewState } from '../types';
import { verifyAuditorAccess } from '../services/firebaseService';

interface IntranetPortalProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
}

interface AuditTask {
  id: string;
  source: 'Facility Registry' | 'Industrial Inflow' | 'Contract Farming' | 'Circular Return';
  customerEsin: string;
  customerName: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'PENDING' | 'INSPECTION' | 'VERIFIED' | 'REJECTED';
  meta?: any;
}

const MOCK_AUDIT_QUEUE: AuditTask[] = [
  { id: 'ADT-8821', source: 'Facility Registry', customerName: 'Omaha Bio-Refinery', customerEsin: 'EA-OMA-001', title: 'Facility Ingest Verification', priority: 'high', timestamp: '2h ago', status: 'PENDING' },
  { id: 'ADT-9104', source: 'Contract Farming', customerName: 'Bantu Soil Guardians', customerEsin: 'EA-BANTU-01', title: 'Land Resource Audit', priority: 'medium', timestamp: '5h ago', status: 'INSPECTION' },
  { id: 'ADT-4420', source: 'Circular Return', customerName: 'Global Shard Fund', customerEsin: 'EA-INV-02', title: 'Machinery Refurbish Audit', priority: 'low', timestamp: '1d ago', status: 'PENDING' },
  { id: 'ADT-1122', source: 'Industrial Inflow', customerName: 'Neo Harvest', customerEsin: 'EA-2025-W12', title: 'Product Purity Sharding', priority: 'high', timestamp: '3h ago', status: 'PENDING' },
];

const IntranetPortal: React.FC<IntranetPortalProps> = ({ user, onSpendEAC, onNavigate }) => {
  const [authStep, setAuthStep] = useState<'login' | 'pending' | 'denied' | 'success'>('login');
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeInternalTab, setActiveInternalTab] = useState<'auditing' | 'inspection' | 'compliance' | 'control' | 'tasks'>('auditing');
  const [selectedTask, setSelectedTask] = useState<AuditTask | null>(null);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [evidenceStep, setEvidenceStep] = useState<'upload' | 'processing' | 'committed'>('upload');
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null);
  const [auditQueue, setAuditQueue] = useState(MOCK_AUDIT_QUEUE);

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    
    setAuthStep('pending');
    setAuthError(null);
    
    try {
      const isAuthorized = await verifyAuditorAccess(email);
      if (isAuthorized) {
        setAuthStep('success');
      } else {
        setAuthStep('denied');
        setAuthError('ACCESS_DENIED: This email is not registered in the Auditor Shard registry.');
      }
    } catch (err) {
      setAuthStep('login');
      setAuthError('REGISTRY_TIMEOUT: Could not reach HQ consensus.');
    }
  };

  const handleFinalizeVerification = () => {
    setIsUploadingEvidence(true);
    setEvidenceStep('processing');
    setTimeout(() => {
      setEvidenceStep('committed');
      if (selectedTask) {
        setAuditQueue(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'VERIFIED' } : t));
      }
    }, 2500);
  };

  if (authStep !== 'success') {
    return (
      <div className="min-h-[700px] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-10 md:p-14 rounded-[48px] border-emerald-500/20 bg-black/40 text-center space-y-8 shadow-3xl relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.03)_0%,_transparent_70%)] pointer-events-none"></div>
          
          <button 
            onClick={() => onNavigate('dashboard')}
            className="absolute top-6 left-6 p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all group z-20"
            title="Back to Dashboard"
          >
            <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="flex flex-col items-center gap-4 relative z-10">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
              <ShieldPlus className="w-10 h-10 text-emerald-500 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Intranet <span className="text-emerald-400">Hub</span></h2>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em] mt-1">Official Auditor Shard Registry</p>
            </div>
          </div>

          {authStep === 'login' && (
            <div className="space-y-8 animate-in fade-in duration-500 relative z-10">
               {authError && (
                 <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-500 text-[10px] font-black uppercase tracking-tight text-left">
                    <ShieldAlert size={16} className="shrink-0" />
                    <span>{authError}</span>
                 </div>
               )}
               
               <form onSubmit={handleRequestAccess} className="space-y-6">
                  <div className="space-y-3 text-left">
                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Authorized HQ Email</label>
                     <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                           type="email" 
                           required 
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           placeholder="steward@envirosagro.org"
                           className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-800" 
                        />
                     </div>
                  </div>
                  <button type="submit" className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all ring-8 ring-emerald-500/5">
                     Request Access Shard <ArrowRight className="w-4 h-4" />
                  </button>
               </form>
               
               <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-4">
                  <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-blue-200/50 font-black uppercase text-left leading-relaxed tracking-tight italic">
                     "Access is restricted to authorized HQ Stewards. Verification requires a multi-node consensus check against the auditor registry."
                  </p>
               </div>
            </div>
          )}

          {authStep === 'pending' && (
            <div className="space-y-12 py-10 animate-in zoom-in duration-500 relative z-10">
               <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-b-4 border-indigo-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                  <div className="w-full h-full flex items-center justify-center">
                     <Database className="w-10 h-10 text-emerald-400 animate-pulse" />
                  </div>
               </div>
               <div className="space-y-4">
                  <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.5em] animate-pulse italic">Querying Registry...</p>
                  <p className="text-slate-500 text-xs font-medium italic leading-relaxed max-w-xs mx-auto">
                     Node {user.esin} is handshaking with the organizational data shard for HQ authorization.
                  </p>
               </div>
            </div>
          )}

          {authStep === 'denied' && (
            <div className="space-y-10 py-10 animate-in zoom-in duration-500 relative z-10">
               <div className="w-24 h-24 bg-rose-600/10 rounded-[32px] flex items-center justify-center mx-auto border-2 border-rose-500/30 text-rose-500 shadow-2xl relative group">
                  <ShieldX className="w-12 h-12" />
                  <div className="absolute inset-[-10px] rounded-[40px] border border-rose-500/20 animate-ping"></div>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Authorization Failed</h3>
                    <p className="text-slate-500 text-sm italic leading-relaxed px-4">
                       "Your node credentials do not match the registered Auditor shards. Access to HQ protocols is prohibited."
                    </p>
                  </div>
                  <button 
                    onClick={() => setAuthStep('login')}
                    className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                  >
                    Retry Handshake
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      
      {/* Internal HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 md:px-0">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-600/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Building className="w-96 h-96 text-white" />
           </div>
           <div className="w-32 h-32 rounded-[40px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] shrink-0 border-4 border-white/10 relative z-10 overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <ShieldCheck className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
           </div>
           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-white/5 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20">INTERNAL_HQ_PORTAL_STABLE</span>
                 <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Audit <span className="text-emerald-400">Command</span> Center</h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl font-medium italic">
                 "Executing physical verification protocols, site biometric audits, and authorized commercial sharding for the EnvirosAgro network."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-1 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2 italic">Active Verifier</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter truncate max-w-full px-4">{email.split('@')[0]}</h4>
           </div>
           <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase relative z-10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Session Authenticated
           </div>
        </div>
      </div>

      {/* Internal Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4 md:ml-4">
        {[
          { id: 'auditing', label: 'Auditing Queue', icon: ClipboardCheck },
          { id: 'inspection', label: 'Physical Inspection', icon: HardHat },
          { id: 'compliance', label: 'Compliances', icon: Scale },
          { id: 'control', label: 'Internal Control', icon: ShieldAlert },
          { id: 'tasks', label: 'Org Tasks', icon: GanttChartSquare },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveInternalTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeInternalTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px] px-4 md:px-0">
        {activeInternalTab === 'auditing' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Registry <span className="text-emerald-400">Audit Shards</span></h3>
                   <p className="text-slate-500 text-sm mt-2 italic font-medium">Global incoming signals requiring industrial verification before ledger finality.</p>
                </div>
                <div className="relative group w-full md:w-96">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all font-mono"
                   />
                </div>
             </div>

             <div className="grid gap-6">
                {auditQueue.map(task => (
                   <div key={task.id} className={`glass-card p-10 rounded-[48px] border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden bg-black/40 shadow-2xl ${
                      task.status === 'VERIFIED' ? 'border-emerald-500/20 opacity-60' : task.priority === 'high' ? 'border-rose-500/20' : 'border-white/5'
                   }`}>
                      <div className="flex items-center gap-8 w-full md:w-auto">
                         <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center border transition-all ${
                            task.status === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 group-hover:rotate-6 shadow-inner'
                         }`}>
                            <Database className="w-10 h-10" />
                         </div>
                         <div className="space-y-2">
                            <div className="flex items-center gap-4">
                               <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic m-0 group-hover:text-emerald-400 transition-colors">{task.title}</h4>
                               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-[0.2em] border ${
                                  task.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                               }`}>{task.priority} Priority</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                               <span className="flex items-center gap-2"><Building className="w-3 h-3 text-indigo-400" /> {task.source}</span>
                               <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-emerald-500" /> {task.timestamp}</span>
                               <span className="flex items-center gap-2"><Fingerprint className="w-3 h-3 text-blue-400" /> {task.customerEsin}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10">
                         <div className="text-center md:text-right space-y-1">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">Customer Node</p>
                            <p className="text-xl font-bold text-white uppercase italic">{task.customerName}</p>
                         </div>
                         <button 
                           onClick={() => { setSelectedTask(task); setIsUploadingEvidence(true); setEvidenceStep('upload'); }}
                           disabled={task.status === 'VERIFIED'}
                           className={`px-10 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-90 ${
                              task.status === 'VERIFIED' ? 'bg-emerald-500 text-white cursor-default' : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-emerald-600 hover:text-white'
                           }`}
                         >
                            {task.status === 'VERIFIED' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                            {task.status === 'VERIFIED' ? 'VERIFIED' : 'Process Audit'}
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* Other Internal Tabs follow same industrial aesthetic... */}
        {activeInternalTab !== 'auditing' && (
           <div className="py-40 text-center opacity-20 italic uppercase tracking-[0.5em] font-black text-slate-500">
              Protocol Hub Shard Standby.
           </div>
        )}
      </div>

      {/* --- AUDIT EVIDENCE MODAL --- */}
      {isUploadingEvidence && selectedTask && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsUploadingEvidence(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] shadow-[0_0_100px_rgba(16,185,129,0.2)] animate-in zoom-in border-2 overflow-hidden flex flex-col">
              
              <div className="p-10 md:p-16 space-y-12 relative z-10">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-8">
                       <div className="w-16 md:w-20 h-16 md:h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                          <ClipboardCheck size={40} />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Evidence <span className="text-emerald-400">Ingest Terminal</span></h3>
                          <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-3">TARGET_TASK: {selectedTask.id}</p>
                       </div>
                    </div>
                    <button onClick={() => setIsUploadingEvidence(false)} className="p-4 bg-white/5 rounded-full text-slate-600 hover:text-white border border-white/5 transition-all active:scale-90 hover:rotate-90"><X size={24} /></button>
                 </div>

                 {evidenceStep === 'upload' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner relative overflow-hidden">
                          <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 relative z-10 px-2">
                             <span>Associated Node</span>
                             <span className="text-white font-mono">{selectedTask.customerEsin}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 relative z-10 px-2">
                             <span>Request Source</span>
                             <span className="text-white">{selectedTask.source}</span>
                          </div>
                       </div>

                       <div 
                         className="p-20 border-4 border-dashed border-white/10 rounded-[56px] flex flex-col items-center justify-center text-center space-y-8 group hover:border-emerald-500/40 hover:bg-emerald-500/[0.01] transition-all cursor-pointer bg-black/40 shadow-inner"
                         onClick={() => setEvidenceFile('MOCK_FILE_SYNCED')}
                       >
                          {!evidenceFile ? (
                             <>
                                <Upload className="w-14 h-14 text-slate-700 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500" />
                                <div className="space-y-2">
                                   <p className="text-2xl font-black text-white uppercase tracking-widest italic">Upload Field Evidence</p>
                                   <p className="text-slate-600 text-xs uppercase font-black tracking-widest">Spectral Photos, Soil Reports, Identity Proofs</p>
                                </div>
                             </>
                          ) : (
                             <>
                                <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                                <p className="text-xl font-black text-emerald-400 uppercase italic">Shard Buffer Synchronized</p>
                                <button onClick={(e) => { e.stopPropagation(); setEvidenceFile(null); }} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] hover:text-rose-500">Remove & Retry</button>
                             </>
                          )}
                       </div>

                       <button 
                         onClick={handleFinalizeVerification}
                         disabled={!evidenceFile}
                         className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10"
                       >
                          <Stamp className="w-8 h-8 fill-current" /> Finalize Verification Anchor
                       </button>
                    </div>
                 )}

                 {evidenceStep === 'processing' && (
                    <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Fingerprint className="w-10 h-10 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.5em] animate-pulse italic">Anchoring Shard Evidence...</p>
                          <p className="text-slate-600 font-mono text-[10px]">COMMITTING_TO_REGISTRY // ZK_SNARK_AUTH</p>
                       </div>
                    </div>
                 )}

                 {evidenceStep === 'committed' && (
                    <div className="space-y-16 py-10 animate-in zoom-in duration-700 text-center flex-1 flex flex-col justify-center items-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Shard <span className="text-emerald-400">Verified</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.6em] font-mono">Registry Commit Hash: 0x882_VERIFIED_OK</p>
                       </div>
                       <div className="w-full glass-card p-10 rounded-[56px] border-white/5 bg-emerald-500/5 space-y-4 text-left relative overflow-hidden shadow-inner">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Activity className="w-40 h-40 text-emerald-400" /></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-2">
                             <span className="text-slate-500 font-black uppercase tracking-widest italic">Process Authorized</span>
                             <span className="text-white font-mono font-black text-xl text-emerald-400 uppercase italic">SYNC_STABLE</span>
                          </div>
                          <div className="h-px w-full bg-white/10"></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-2">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Audit Shard ID</span>
                             <span className="text-blue-400 font-mono font-black text-lg">#{selectedTask.id}</span>
                          </div>
                       </div>
                       <button onClick={() => setIsUploadingEvidence(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command Center</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Internal Security Icons for denied state */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
      `}</style>
    </div>
  );
};

// Helper component for the Access Denied state
const ShieldX = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m14.5 9.5-5 5"/><path d="m9.5 9.5 5 5"/>
  </svg>
);

export default IntranetPortal;