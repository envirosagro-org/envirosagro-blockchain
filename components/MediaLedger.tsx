
import React, { useState, useMemo } from 'react';
import { 
  FileStack, 
  Search, 
  Download, 
  FileText, 
  Clapperboard, 
  Music, 
  Mic2, 
  Bot, 
  Database, 
  History, 
  Binary, 
  ShieldCheck, 
  Activity, 
  ExternalLink, 
  Filter, 
  ChevronRight, 
  Monitor, 
  Stamp, 
  Fingerprint, 
  Terminal, 
  BadgeCheck, 
  Zap, 
  Globe, 
  PlusCircle, 
  X, 
  Eye, 
  Maximize2, 
  MessageSquare,
  CirclePlay
} from 'lucide-react';
import { User, MediaShard, ViewState } from '../types';
import MultimediaPlayer from './MultimediaPlayer';

interface MediaLedgerProps {
  user: User;
  shards: MediaShard[];
  onNavigate: (view: ViewState, section?: string | null, pushToHistory?: boolean, params?: any) => void;
}

const TYPE_ICONS: Record<string, any> = {
  VIDEO: Clapperboard,
  AUDIO: Music,
  PAPER: FileText,
  ORACLE: Bot,
  POST: MessageSquare,
  INGEST: Database
};

const TYPE_COLORS: Record<string, string> = {
  VIDEO: 'text-rose-500',
  AUDIO: 'text-emerald-500',
  PAPER: 'text-blue-500',
  ORACLE: 'text-indigo-500',
  POST: 'text-amber-500',
  INGEST: 'text-slate-400'
};

const MediaLedger: React.FC<MediaLedgerProps> = ({ user, shards = [], onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio' | 'papers' | 'oracle'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShard, setSelectedShard] = useState<MediaShard | null>(null);

  // Multimedia Player State
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerConfig, setPlayerConfig] = useState<{
    url: string;
    type: 'VIDEO' | 'AUDIO';
    title: string;
    author?: string;
    shardId?: string;
    thumbnail?: string;
  }>({ url: '', type: 'VIDEO', title: '' });

  const openPlayer = (shard: MediaShard) => {
    if (shard.type !== 'VIDEO' && shard.type !== 'AUDIO') return;
    
    setPlayerConfig({
      url: shard.type === 'VIDEO' 
        ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' 
        : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      type: shard.type as 'VIDEO' | 'AUDIO',
      title: shard.title,
      author: shard.author,
      shardId: shard.id
    });
    setPlayerOpen(true);
  };

  const filteredShards = useMemo(() => {
    return shards.filter(shard => {
      const matchesSearch = (shard.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (shard.id || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'all' || 
                        (activeTab === 'video' && shard.type === 'VIDEO') ||
                        (activeTab === 'audio' && shard.type === 'AUDIO') ||
                        (activeTab === 'papers' && shard.type === 'PAPER') ||
                        (activeTab === 'oracle' && shard.type === 'ORACLE');
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab, shards]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <FileStack size={1000} className="text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 md:p-16 rounded-[64px] border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-16 group shadow-3xl">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden">
              <div className="w-full h-[2px] bg-indigo-500/10 absolute top-0 animate-scan"></div>
           </div>
           
           <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-[64px] bg-indigo-700 shadow-[0_0_120px_rgba(99,102,241,0.4)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-700">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <FileStack size={96} className="text-white animate-float" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[64px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner italic">AGRO_IN_PDF_POWERED</span>
                    <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">IMMUTABLE_MEDIA_ARCHIVE</span>
                 </div>
                 <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">MEDIA <span className="text-indigo-400">LEDGER.</span></h2>
              </div>
              <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "The global archive of sharded knowledge and agricultural heritage. Every signal, stream, and study—immutably anchored and accessible to the mesh."
              </p>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">ARCHIVE_CAPACITY</p>
              <h4 className="text-[100px] font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">12<span className="text-3xl text-indigo-500 font-sans ml-1">.4 PB</span></h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 italic">Registry Sharding Integrity: 100%</p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Ingest Rate</span>
                 <span className="text-indigo-400 font-mono">NOMINAL</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1]" style={{ width: '92%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Navigation & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 overflow-x-auto scrollbar-hide">
           {[
             { id: 'all', label: 'All Shards', icon: FileStack },
             { id: 'video', label: 'Cinema Shards', icon: Clapperboard },
             { id: 'audio', label: 'Acoustic Shards', icon: Music },
             { id: 'papers', label: 'Knowledge Shards', icon: FileText },
             { id: 'oracle', label: 'Oracle Verdicts', icon: Bot },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-4 px-10 py-5 rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={18} /> {tab.label}
             </button>
           ))}
         </div>
         
         <div className="relative group w-full lg:w-[500px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
            <input 
               type="text" 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               placeholder="Search by Shard ID, Title or Author..." 
               className="w-full bg-black/60 border border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono italic shadow-inner"
            />
         </div>
      </div>

      {/* 3. Main Ledger Content */}
      <div className="min-h-[850px] relative z-10">
         <div className="glass-card rounded-[72px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl">
            <div className="grid grid-cols-6 p-10 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
               <span className="col-span-2">Media Shard Designation</span>
               <span>Type & Source</span>
               <span>Author Node</span>
               <span>m-Resonance Impact</span>
               <span className="text-right">Ledger Actions</span>
            </div>
            <div className="divide-y divide-white/5 min-h-[600px] bg-[#050706]">
               {filteredShards.map((shard, i) => {
                  const Icon = TYPE_ICONS[shard.type] || FileStack;
                  const color = TYPE_COLORS[shard.type] || 'text-slate-400';
                  return (
                    <div key={shard.id} className="grid grid-cols-6 p-12 hover:bg-white/[0.02] transition-all items-center group animate-in fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="col-span-2 flex items-center gap-10">
                           <div className={`w-20 h-20 rounded-[28px] bg-black/60 border border-white/10 flex items-center justify-center shadow-3xl group-hover:rotate-6 group-hover:scale-110 transition-all ${color}`}>
                              <Icon size={40} />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors">{shard.title}</h4>
                              <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{shard.id} // BLCK_COMMIT_{shard.hash}</p>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <span className={`px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest ${color}`}>{shard.type}</span>
                           <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{shard.source}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-black text-slate-300 uppercase italic tracking-tight">{shard.author}</p>
                           <p className="text-[9px] text-slate-600 font-mono font-black uppercase tracking-widest">{shard.authorEsin}</p>
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <Activity size={16} className="text-emerald-500 animate-pulse" />
                              <span className="text-2xl font-mono font-black text-white">{shard.mImpact}</span>
                           </div>
                        </div>
                         <div className="flex justify-end gap-6 pr-8">
                            {(shard.type === 'VIDEO' || shard.type === 'AUDIO') && (
                              <button onClick={() => openPlayer(shard)} className="p-5 bg-emerald-600 rounded-2xl text-white shadow-3xl hover:bg-emerald-500 transition-all active:scale-90 border border-white/10" title="Play Shard">
                                 <CirclePlay size={24} />
                              </button>
                            )}
                            <button onClick={() => setSelectedShard(shard)} className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-indigo-400 transition-all shadow-xl active:scale-90" title="Inspect Shard">
                               <Eye size={24} />
                            </button>
                            <button 
                              onClick={() => (onNavigate as any)('multimedia_generator', null, true, { prompt: `Process and prepare download for shard: ${shard.title} (${shard.id}). Type: ${shard.type}`, type: shard.type === 'PAPER' ? 'document' : shard.type.toLowerCase() })}
                              className="p-5 bg-indigo-600 rounded-2xl text-white shadow-3xl hover:bg-indigo-500 transition-all active:scale-90 border border-white/10" 
                              title="Download to Buffer via Agro Multimedia"
                            >
                               <Download size={24} />
                            </button>
                         </div>
                    </div>
                  );
               })}
               {filteredShards.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-40 opacity-10">
                     <FileStack size={140} className="mb-8" />
                     <p className="text-4xl font-black uppercase tracking-[0.5em]">No matching shards found</p>
                  </div>
               )}
            </div>
            <div className="p-10 border-t border-white/10 bg-black/80 flex justify-between items-center text-[10px] font-black text-slate-700 uppercase tracking-widest">
               <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div> REGISTRY_STREAM_OK</span>
                  <span>ZK_PROOF_VERIFIED</span>
               </div>
               <span>ENVIROSAGRO_OS_v6.5 // AGRO_IN_PDF_NODE_#882A</span>
            </div>
         </div>
      </div>

      {/* SHARD INSPECTOR MODAL */}
      {selectedShard && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10 overflow-hidden">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedShard(null)}></div>
           <div className="relative z-10 w-full max-w-5xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-[0_0_200px_rgba(99,102,241,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh]">
              
              <div className="p-12 md:p-16 border-b border-white/5 bg-indigo-500/[0.01] flex justify-between items-center shrink-0 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10">
                       <FileStack size={48} className="text-white" />
                    </div>
                    <div>
                       <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Shard <span className="text-indigo-400">Inspector</span></h3>
                       <p className="text-indigo-400/60 text-[11px] font-mono tracking-[0.5em] uppercase mt-4 italic leading-none">REGISTRY_PATH: {selectedShard.source.toUpperCase()} // ID: {selectedShard.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedShard(null)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-3xl"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar flex flex-col gap-12 bg-black/40">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-10">
                       <div className="p-10 bg-black rounded-[64px] border border-white/5 space-y-6 shadow-inner relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Database size={200} /></div>
                          <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] border-b border-white/5 pb-4 px-2 italic">TECHNICAL_MANIFEST</h4>
                          <div className="space-y-4 px-2 relative z-10">
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-600 uppercase">Registry Hash</span>
                                <span className="text-xs font-mono font-black text-white">{selectedShard.hash}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-600 uppercase">Shard Size</span>
                                <span className="text-xs font-mono font-black text-emerald-400">{selectedShard.size}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-600 uppercase">Time Anchor</span>
                                <span className="text-xs font-mono font-black text-white">{selectedShard.timestamp}</span>
                             </div>
                             <div className="pt-4 border-t border-white/5 mt-4">
                                <p className="text-[10px] text-slate-600 font-black uppercase mb-3">m-Constant Bias</p>
                                <p className="text-3xl font-mono font-black text-indigo-400 tracking-tighter">{selectedShard.mImpact}</p>
                             </div>
                          </div>
                       </div>

                       <div className="p-10 glass-card rounded-[64px] border-2 border-indigo-500/20 bg-indigo-500/5 space-y-6 shadow-3xl">
                          <div className="flex items-center gap-4 border-b border-indigo-500/20 pb-4">
                             <Fingerprint className="text-indigo-400" />
                             <h4 className="text-xl font-black text-white uppercase italic">Author Shard</h4>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 font-mono font-black text-2xl">
                                {selectedShard.author ? selectedShard.author[0] : 'U'}
                             </div>
                             <div>
                                <p className="text-2xl font-black text-white uppercase italic leading-none">{selectedShard.author}</p>
                                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-2">{selectedShard.authorEsin}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-10">
                       <div className="p-10 bg-black rounded-[64px] border border-white/10 space-y-6 shadow-inner flex flex-col h-full overflow-hidden">
                          <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.6em] border-b border-white/5 pb-4 px-2 italic">SHARD_TERMINAL_OUTPUT</h4>
                          <div className="flex-1 font-mono text-xs text-slate-400 leading-loose overflow-y-auto custom-scrollbar-terminal pr-4 italic">
                             <p className="text-emerald-400/80 mb-6 font-black uppercase tracking-widest">Handshaking with Registry Node 0x882A...</p>
                             <p className="mb-4">AUTHENTICATING_USER_ESIN: {user.esin}</p>
                             <p className="mb-4">FETCHING_IMMUTABLE_MEDIA_SHARD: {selectedShard.id}</p>
                             <p className="mb-4 text-white">DECODING_AGRO_IN_PDF_MANIFEST...</p>
                             <p className="mb-4">VERIFYING_RESONANCE_QUORUM: SUCCESS</p>
                             <p className="mb-4">M_CONSTANT_BIAS_VALIDATED: {selectedShard.mImpact}</p>
                             <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] text-indigo-400 mt-6 border-l-4 border-l-indigo-600">
                                {selectedShard.title} // registry_object.v6
                             </div>
                             <p className="mt-8 text-emerald-400 font-black animate-pulse">TERMINAL_LINK_STABLE_#0x{(Math.random()*100).toFixed(0)}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-12 border-t border-white/5 bg-white/[0.01] flex justify-center gap-8 shrink-0">
                 <button onClick={() => setSelectedShard(null)} className="px-16 py-7 bg-white/5 border-2 border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-3xl active:scale-95">Abort_Inspection</button>
                  {(selectedShard.type === 'VIDEO' || selectedShard.type === 'AUDIO') && (
                    <button 
                      onClick={() => {
                        const shard = selectedShard;
                        setSelectedShard(null);
                        setTimeout(() => openPlayer(shard), 300);
                      }}
                      className="px-24 py-7 bg-emerald-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[12px] ring-white/5"
                    >
                       <CirclePlay size={28} /> PLAY_SHARD
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      const shard = selectedShard;
                      setSelectedShard(null);
                      (onNavigate as any)('multimedia_generator', null, true, { prompt: `Process and prepare download for shard: ${shard.title} (${shard.id}). Type: ${shard.type}`, type: shard.type === 'PAPER' ? 'document' : shard.type.toLowerCase() });
                    }}
                    className="px-24 py-7 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[12px] ring-white/5"
                  >
                    <Download size={28} /> DOWNLOAD_VIA_AGRO_MULTIMEDIA
                 </button>
              </div>
           </div>
        </div>
      )}

      <MultimediaPlayer
        isOpen={playerOpen}
        onClose={() => setPlayerOpen(false)}
        mediaUrl={playerConfig.url}
        mediaType={playerConfig.type}
        title={playerConfig.title}
        author={playerConfig.author}
        shardId={playerConfig.shardId}
        thumbnail={playerConfig.thumbnail}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default MediaLedger;
