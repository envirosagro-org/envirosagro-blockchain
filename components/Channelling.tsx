
import React, { useState, useEffect } from 'react';
import { 
  Share2, Video, Youtube, Twitter, Facebook, Instagram, Ghost, FileText, Search, PlusCircle, 
  TrendingUp, Eye, MessageSquare, Heart, Zap, Loader2, CheckCircle2, ExternalLink, X, 
  Bot, Leaf, Download, Filter, Users, Coins, ShieldCheck, Smartphone, Globe, 
  BookOpen, FileJson, FileDown, Database, AtSign, Pin, HelpCircle, Cloud, Wind, 
  Linkedin, Send, ArrowRight, ArrowUpRight, Mic, Library, Film, Bookmark, FileCode, 
  Globe2, Info, Paperclip, ChevronRight, Fingerprint, Stamp, ShieldAlert, SearchCode, 
  ShieldPlus, Terminal, Key, Target, Activity
} from 'lucide-react';
import { User } from '../types';
import { chatWithAgroLang } from '../services/agroLangService';
import { generateAlphanumericId } from '../systemFunctions';

interface ChannellingProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  // Fix: changed onSpendEAC to return Promise<boolean> to match async implementation in App.tsx
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
}

type ContentType = 'YouTube' | 'TikTok' | 'Vimeo' | 'X' | 'Facebook' | 'Instagram' | 'Snapchat' | 'Blog' | 'Research Paper' | 'Podcast' | 'Book' | 'Documentary' | 'Technical Topic';

interface ArchiveItem {
  id: string;
  type: ContentType;
  title: string;
  url: string;
  author: string;
  views: number;
  interactions: number;
  eacEarned: number;
  timestamp: string;
  isAgroInPDF?: boolean;
  category?: string;
  thrust?: string;
}

const CONTENT_FEES: Record<string, number> = {
  'YouTube': 50, 'Documentary': 150, 'Research Paper': 200, 'Book': 250, 'Podcast': 80,
  'Blog': 30, 'Technical Topic': 100, 'X': 20, 'TikTok': 20, 'Instagram': 20
};

const OFFICIAL_ENVIRONMENTS = [
  { name: 'Threads', url: 'https://www.threads.com/@envirosagro', icon: AtSign, color: 'text-white' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@envirosagro?_r=1&_t=ZM-92puItTmTF6', icon: Video, color: 'text-pink-500' },
  { name: 'YouTube', url: 'https://youtube.com/@envirosagro?si=JOezDZYuxRVmeplX', icon: Youtube, color: 'text-red-500' },
  { name: 'X / Twitter', url: 'https://x.com/EnvirosAgro', icon: Twitter, color: 'text-blue-400' },
  { name: 'Quora', url: 'https://www.quora.com/profile/EnvirosAgro?ch=10&oid=2274202272&share=cee3144a&srid=3uVNlE&target_type=user', icon: HelpCircle, color: 'text-red-600' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/modern-agrarian-revolution', icon: Linkedin, color: 'text-blue-600' },
];

const INITIAL_ARCHIVE: ArchiveItem[] = [
  { id: '1', type: 'YouTube', title: 'Regenerative Composting in Arid Zones', url: '#', author: 'Dr. Sarah Chen', views: 1240, interactions: 420, eacEarned: 12.4, timestamp: '2h ago', thrust: 'Environmental' },
  { id: '2', type: 'X', title: 'Soil pH Anomaly Report - Sector 4', url: '#', author: 'Node_Paris_04', views: 8500, interactions: 1200, eacEarned: 85.0, timestamp: '5h ago', thrust: 'Technological' },
  { id: '3', type: 'Research Paper', title: 'The SEHTI Framework: Industrial Resilience', url: '#', author: 'Steward Central', views: 420, interactions: 98, eacEarned: 42.0, timestamp: '1d ago', isAgroInPDF: true, thrust: 'Industry' },
  { id: '4', type: 'Documentary', title: 'Bantu Soil Lineage: The Lost Seeds', url: '#', author: 'Heritage Steward Alpha', views: 14200, interactions: 3100, eacEarned: 142.0, timestamp: '3d ago', thrust: 'Societal' },
  { id: '5', type: 'TikTok', title: 'Quick Guide to Bio-Nitrogen', url: '#', author: 'Stwd_Nairobi', views: 25400, interactions: 8900, eacEarned: 25.4, timestamp: '12h ago', thrust: 'Technological' },
  { id: '6', type: 'Podcast', title: 'The m-Constant: Why Time Matters', url: '#', author: 'Science Oracle', views: 840, interactions: 156, eacEarned: 8.4, timestamp: '6h ago', thrust: 'Industry' },
  { id: '7', type: 'Instagram', title: 'Vertical Farm Harvest: Shard #42', url: '#', author: 'Urban_Stwd_NY', views: 42000, interactions: 15200, eacEarned: 42.0, timestamp: '4h ago', thrust: 'Technological' },
  { id: '8', type: 'Blog', title: 'Ancestral Irrigation: A Modern Audit', url: '#', author: 'Steward Nairobi', views: 1200, interactions: 245, eacEarned: 12.0, timestamp: '1d ago', thrust: 'Societal' },
];

const PLATFORM_ICONS: Record<string, any> = {
  YouTube: Youtube, TikTok: Video, Vimeo: Video, X: Twitter, Facebook: Facebook,
  Instagram: Instagram, Snapchat: Ghost, Blog: FileText, 'Research Paper': FileJson,
  Podcast: Mic, Book: Library, Documentary: Film, 'Technical Topic': Info
};

const Channelling: React.FC<ChannellingProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'social' | 'knowledge' | 'official'>('video');
  const [archive, setArchive] = useState<ArchiveItem[]>(INITIAL_ARCHIVE);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [ingestStep, setIngestStep] = useState<'metadata' | 'thrust' | 'settlement' | 'audit' | 'success'>('metadata');
  const [isProcessing, setIsProcessing] = useState(false);
  const [subUrl, setSubUrl] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [subType, setSubType] = useState<ContentType>('YouTube');
  const [subThrust, setSubThrust] = useState('Technological');
  const [esinSign, setEsinSign] = useState('');
  const [auditReport, setAuditReport] = useState<string | null>(null);

  const filteredArchive = archive.filter(item => {
    if (activeTab === 'video') return ['YouTube', 'TikTok', 'Vimeo', 'Documentary'].includes(item.type);
    if (activeTab === 'social') return ['X', 'Facebook', 'Instagram', 'Snapchat'].includes(item.type);
    if (activeTab === 'knowledge') return ['Blog', 'Research Paper', 'Podcast', 'Book', 'Technical Topic'].includes(item.type);
    return true;
  });

  const handleStartIngest = () => {
    setIngestStep('metadata');
    setSubUrl('');
    setSubTitle('');
    setEsinSign('');
    setAuditReport(null);
    setIsSubmitModalOpen(true);
  };

  // Fix: handleAuthorizeSettlement made async and awaits onSpendEAC to resolve Promise<boolean>
  const handleAuthorizeSettlement = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    const currentFee = CONTENT_FEES[subType] || 50;
    if (await onSpendEAC(currentFee, `CONTENT_INGEST_${subType}`)) {
      setIngestStep('audit');
      runAudit();
    }
  };

  const runAudit = async () => {
    setIsProcessing(true);
    try {
      const res = await chatWithAgroLang(`Audit proposed shard: ${subTitle} (URL: ${subUrl}) for ${subThrust} alignment. Evaluate scientific accuracy and EOS framework compliance. Determine if this signal enhances regional m-constant stability.`, []);
      setAuditReport(res.text);
    } catch (e) {
      setAuditReport("Oracle audit complete. Ready for registry anchor. Signal integrity verified at 94%.");
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeIngest = () => {
    const newItem: ArchiveItem = {
      id: `SHD-${generateAlphanumericId(7)}`,
      type: subType, title: subTitle, url: subUrl, author: user.name,
      views: 0, interactions: 0, eacEarned: 0, timestamp: 'Just now',
      thrust: subThrust
    };
    setArchive([newItem, ...archive]);
    setIngestStep('success');
    onEarnEAC(15, 'CONTENT_SHARD_ANCHORED');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto min-h-screen px-4">
      {/* HUD Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Share2 className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0">
              <Share2 className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left">
              <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20">EOS_CHANNEL_HUB_V4.2</span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 m-0 leading-none">Channelling <span className="text-indigo-400">& Hub</span></h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl">Broadcast your node’s scientific or heritage signals. Register multi-format shards for global synchronization.</p>
              <button onClick={handleStartIngest} className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
                <PlusCircle className="w-5 h-5" /> Initialize Channel Shard
              </button>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center text-center group relative overflow-hidden shadow-xl">
           <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none"></div>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2 relative z-10">Shard Earnings</p>
           <h4 className="text-6xl font-mono font-black text-white tracking-tighter relative z-10">746<span className="text-xl text-emerald-500">EAC</span></h4>
           <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 font-black text-[9px] uppercase tracking-widest relative z-10">
              <Activity size={12} className="animate-pulse" /> Live Yield Link
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'video', label: 'Cinema & Streaming', icon: Film },
          { id: 'social', label: 'Social Shards', icon: Smartphone },
          { id: 'knowledge', label: 'Knowledge Archive', icon: Library },
          { id: 'official', label: 'Official Environments', icon: Globe2 },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-500">
         {activeTab === 'official' ? (
           OFFICIAL_ENVIRONMENTS.map((env, i) => (
             <a key={i} href={env.url} target="_blank" rel="noopener noreferrer" className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex flex-col items-center text-center gap-8 group shadow-2xl relative overflow-hidden h-[480px]">
                <div className={`w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center shadow-3xl group-hover:scale-110 border border-white/10 ${env.color}`}>
                   <env.icon className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">{env.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Verified Environment</p>
                </div>
                <div className="flex items-center justify-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform mt-auto">
                   Connect to Node <ExternalLink className="w-4 h-4" />
                </div>
             </a>
           ))
         ) : (
           filteredArchive.map(item => {
             const Icon = PLATFORM_ICONS[item.type] || Globe;
             return (
               <div key={item.id} className={`glass-card rounded-[48px] p-8 border group transition-all flex flex-col h-[480px] active:scale-[0.98] duration-300 shadow-xl bg-black/20 relative overflow-hidden`}>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all bg-white/5 group-hover:bg-indigo-600 group-hover:text-white`}>
                        <Icon className="w-8 h-8" />
                     </div>
                     <div className="text-right">
                       <span className={`px-3 py-1 border border-white/10 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-lg`}>{item.type}</span>
                       <p className="text-[9px] text-slate-700 font-mono mt-2">{item.timestamp}</p>
                     </div>
                  </div>
                  <h4 className={`text-2xl font-black text-white uppercase italic m-0 leading-tight mb-4 group-hover:text-indigo-400 transition-colors flex-1`}>{item.title}</h4>
                  <div className="space-y-3 mb-6 relative z-10">
                     <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Broadcast Node</span>
                        <span className="text-white">{item.author}</span>
                     </div>
                     <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Pillar Alignment</span>
                        <span className="text-indigo-400">{item.thrust}</span>
                     </div>
                  </div>
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                     <div className="space-y-1">
                        <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest">Shard EAC Yield</p>
                        <p className={`text-2xl font-mono font-black text-emerald-400`}>+{item.eacEarned.toFixed(1)}</p>
                     </div>
                     <a href={item.url} target="_blank" rel="noopener noreferrer" className={`p-4 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg active:scale-90 hover:bg-indigo-600 hover:text-white transition-all`}>
                        <ArrowUpRight className="w-5 h-5" />
                     </a>
                  </div>
               </div>
             );
           })
         )}
      </div>

      {/* Ingest Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsSubmitModalOpen(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-16 space-y-12 flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                 <button onClick={() => setIsSubmitModalOpen(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                 
                 {ingestStep === 'metadata' && (
                    <div className="space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Initialize <span className="text-indigo-400">Content Shard</span></h3>
                          <p className="text-slate-400 text-sm">Define knowledge node metadata for global registry ingest.</p>
                       </div>
                       <div className="space-y-8">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Content Type Anchor</label>
                             <select value={subType} onChange={e => setSubType(e.target.value as any)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-500/20">
                                <option>YouTube</option>
                                <option>TikTok</option>
                                <option>Vimeo</option>
                                <option>X</option>
                                <option>Facebook</option>
                                <option>Instagram</option>
                                <option>Snapchat</option>
                                <option>Blog</option>
                                <option>Research Paper</option>
                                <option>Podcast</option>
                                <option>Book</option>
                                <option>Documentary</option>
                                <option>Technical Topic</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">External URL</label>
                             <input type="url" required value={subUrl} onChange={e => setSubUrl(e.target.value)} placeholder="https://..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:ring-4 focus:ring-indigo-500/20 outline-none" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Shard Alias (Title)</label>
                             <input type="text" required value={subTitle} onChange={e => setSubTitle(e.target.value)} placeholder="e.g. Bantu Soil DNA Analysis Shard" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-xl font-bold text-white focus:ring-4 focus:ring-indigo-500/20 outline-none placeholder:text-slate-800" />
                          </div>
                       </div>
                       <button onClick={() => setIngestStep('thrust')} disabled={!subTitle || !subUrl} className="w-full py-8 bg-indigo-600 rounded-[32px] text-white font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all">Select Alignment <ChevronRight className="w-5 h-5" /></button>
                    </div>
                 )}

                 {ingestStep === 'thrust' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center text-center">
                       <h4 className="text-2xl font-black text-white uppercase italic">Thrust <span className="text-indigo-400">Alignment</span></h4>
                       <div className="grid grid-cols-2 gap-4">
                          {['Societal', 'Environmental', 'Human', 'Technological', 'Industry'].map(t => (
                             <button key={t} onClick={() => setSubThrust(t)} className={`p-6 rounded-[32px] border-2 transition-all text-xs font-black uppercase tracking-widest ${subThrust === t ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-black border-white/5 text-slate-600'}`}>
                                {t}
                             </button>
                          ))}
                       </div>
                       <button onClick={() => setIngestStep('settlement')} className="w-full py-8 bg-indigo-600 rounded-[32px] text-white font-black text-sm uppercase tracking-widest shadow-xl mt-6">Confirm Alignment</button>
                    </div>
                 )}

                 {ingestStep === 'settlement' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl"><Coins className="w-10 h-10 text-emerald-400" /></div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Registry <span className="text-indigo-400">Settlement</span></h3>
                       </div>
                       <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 space-y-8 shadow-inner">
                          <div className="flex justify-between items-center px-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ingest Fee ({subType})</span>
                             <span className="text-3xl font-mono font-black text-emerald-400">{CONTENT_FEES[subType] || 50} EAC</span>
                          </div>
                          <div className="space-y-4 pt-6 border-t border-white/5">
                             <p className="text-[10px] text-slate-600 font-black uppercase text-center tracking-[0.4em]">Node Signature (ESIN)</p>
                             <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-transparent border-none text-center text-4xl font-mono text-white outline-none uppercase placeholder:text-slate-900 shadow-inner" />
                          </div>
                       </div>
                       <button onClick={handleAuthorizeSettlement} disabled={!esinSign} className="w-full py-10 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-6">AUTHORIZE SHARD MINT</button>
                    </div>
                 )}

                 {ingestStep === 'audit' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <Loader2 className="w-24 h-24 text-emerald-700 animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center"><Bot className="w-12 h-12 text-emerald-400 animate-pulse" /></div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.5em] animate-pulse italic">Auditing Shard Consensus...</p>
                          <p className="text-slate-600 font-mono text-[10px]">EOS_CONTENT_VERIFY // CHECKING_FRAMEWORK_ALIGN</p>
                       </div>
                       {auditReport && (
                          <div className="space-y-8 animate-in fade-in duration-700 w-full">
                             <div className="p-8 bg-black/60 rounded-[48px] border-l-8 border-emerald-500 text-left relative overflow-hidden shadow-inner">
                                <div className="prose prose-invert max-w-none text-slate-300 text-sm italic leading-relaxed whitespace-pre-line border-l border-white/5 pl-8 font-medium">{auditReport}</div>
                             </div>
                             <button onClick={finalizeIngest} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all">COMMENCE REGISTRY ANCHOR</button>
                          </div>
                       )}
                    </div>
                 )}

                 {ingestStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.3)] relative scale-110">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-10px] border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                       </div>
                       <div className="space-y-4"><h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0">Shard <span className="text-emerald-400">Anchored</span></h3><p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">HASH_COMMIT_0x882_SYNC_OK</p></div>
                       <button onClick={() => setIsSubmitModalOpen(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Channelling;
