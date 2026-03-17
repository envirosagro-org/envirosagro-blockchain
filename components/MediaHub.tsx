import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Search, 
  Video, 
  Radio, 
  Headphones, 
  Download,
  Loader2,
  Tv,
  Eye,
  Zap,
  X,
  Activity,
  Film,
  Camera,
  Maximize,
  AlertCircle,
  Key,
  Bot,
  ImageIcon,
  Edit2,
  Trash2,
  Upload,
  Coins,
  ShieldAlert,
  Newspaper,
  BookOpen,
  Globe,
  Waves,
  Heart,
  FileText,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Sprout,
  CirclePlay,
  PlayCircle,
  Monitor,
  Users,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Lock,
  Signal,
  Wifi,
  Smartphone,
  Info,
  Calendar,
  Layers,
  Database,
  Terminal,
  VolumeX,
  Volume1,
  ChevronRight,
  TrendingUp,
  FileDigit,
  Fingerprint,
  ShieldCheck,
  RefreshCcw,
  BadgeCheck,
  ZapOff,
  Flame,
  CreditCard,
  MailCheck,
  PenTool,
  History,
  FileDown,
  Atom,
  Quote,
  Music,
  PlusCircle,
  AudioLines,
  Mic2,
  FileSearch,
  CheckCircle,
  QrCode,
  Mic,
  MicOff,
  Settings,
  SmartphoneNfc,
  Cast,
  Box,
  Link2,
  Globe2,
  CircleStop,
  Signature,
  RefreshCw,
  FlipHorizontal,
  FileUp,
  AudioWaveform,
  Podcast,
  PencilRuler,
  ThumbsUp,
  MessageSquare,
  CircleDot,
  Send,
  Leaf,
  Ear,
  Waves as WavesIcon,
  Factory,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { User, ViewState, MediaShard } from '../types';
import { searchAgroTrends, chatWithAgroLang, AgroLangResponse } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import MultimediaPlayer from './MultimediaPlayer';
import { generateQuickHash } from '../systemFunctions';

interface MediaHubProps {
  user: User;
  userBalance: number;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
  initialAction?: string | null;
}

const VIDEO_NODES = [
  { id: 'VID-01', title: 'SkyScout Spectral Stream', thumb: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1200', viewers: 1240, status: 'LIVE', thrust: 'ENVIRONMENTAL', desc: 'Real-time spectral telemetry ingest from autonomous satellite relays.' },
  { id: 'VID-02', title: 'Nebraska Ingest Node #82', thumb: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=800', viewers: 842, status: 'LIVE', thrust: 'INDUSTRIAL', desc: 'Active processing feed from the regional bio-refinery cluster.' },
];

const INITIAL_AUDIO_TRACKS = [
  { id: 'AUD-01', title: "PLANT WAVE SYNTHESIS V1.0", type: "BIO-ELECTRIC", duration: "32:00", cost: 50, icon: Sprout, free: false },
  { id: 'AUD-02', title: "M-CONSTANT RESONANCE V2.1", type: "SOIL STIMULATION", duration: "45:00", cost: 0, icon: Radio, free: true },
  { id: 'AUD-03', title: "432Hz GENESIS HUM", type: "CELLULAR REPAIR", duration: "60:00", cost: 0, icon: Waves, free: true },
];

const MediaHub: React.FC<MediaHubProps> = ({ user, userBalance, onSpendEAC, onEarnEAC, onNavigate, initialSection, initialAction }) => {
  const [tab, setTab] = useState<'all' | 'video' | 'news' | 'audio' | 'streaming'>('all');
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsResult, setNewsResult] = useState<AgroLangResponse | null>(null);

  // Streaming Portal States
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamMode, setStreamMode] = useState<'GENERAL' | 'VERIFICATION' | 'EVIDENCE' | 'TASK_SYNC' | 'COMMUNITY_LIVE'>('GENERAL');
  const [bitrate, setBitrate] = useState(4500);
  const [latency, setLatency] = useState(14);
  const [streamDuration, setStreamDuration] = useState(0);
  const [reactionPool, setReactionPool] = useState<{type: string, id: number}[]>([]);
  const [reactionStats, setReactionStats] = useState({ hearts: 0, zaps: 0, check: 0 });
  const [totalEacEarnedFromStream, setTotalEacEarnedFromStream] = useState(0);
  
  const [isMuted, setIsMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

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

  // Device References
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (initialAction) {
      setTab('streaming');
      if (initialAction === 'VERIFICATION') {
        setStreamTitle('IDENTITY_VERIFICATION_SHARD');
        setStreamMode('VERIFICATION');
        setIsRegistered(true);
      } else if (initialAction === 'EVIDENCE') {
        setStreamTitle('FIELD_EVIDENCE_INGEST');
        setStreamMode('EVIDENCE');
        setIsRegistered(true);
      } else if (initialAction === 'COMMUNITY') {
        setStreamTitle('COMMUNITY_SYNC_SIGNAL');
        setStreamMode('COMMUNITY_LIVE');
        setIsRegistered(true);
      } else if (initialAction === 'PROCESS_STREAM') {
        setStreamTitle('INDUSTRIAL_PROCESS_INGEST');
        setStreamMode('TASK_SYNC');
        setIsRegistered(true);
      }
    } else if (initialSection) {
      if (['all', 'video', 'news', 'audio', 'streaming'].includes(initialSection)) {
        setTab(initialSection as any);
      }
    }
  }, [initialSection, initialAction]);

  useEffect(() => {
    fetchLatestNews();
  }, []);

  useEffect(() => {
    let interval: any;
    let reactionInterval: any;
    
    if (isBroadcasting) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
        setBitrate(4500 + Math.floor(Math.random() * 500));
        setLatency(12 + Math.floor(Math.random() * 6));
      }, 1000);

      reactionInterval = setInterval(() => {
        const types = ['heart', 'zap', 'check'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newReaction = { type, id: Date.now() };
        
        setReactionPool(prev => [...prev, newReaction].slice(-10));
        setReactionStats(prev => ({
          ...prev,
          hearts: type === 'heart' ? prev.hearts + 1 : prev.hearts,
          zaps: type === 'zap' ? prev.zaps + 1 : prev.zaps,
          check: type === 'check' ? prev.check + 1 : prev.check,
        }));
        
        const reward = type === 'zap' ? 0.5 : type === 'check' ? 1.0 : 0.2;
        setTotalEacEarnedFromStream(prev => prev + reward);
        onEarnEAC(reward, `LIVE_REACTION_REWARD_${streamTitle}`);
      }, 4000);
    }
    return () => { 
      if (interval) clearInterval(interval); 
      if (reactionInterval) clearInterval(reactionInterval);
    };
  }, [isBroadcasting, onEarnEAC, streamTitle]);

  const fetchLatestNews = async () => {
    setLoadingNews(true);
    try {
      const query = "latest agricultural trends impacting regenerative farming practices and blockchain integration for carbon credit tracking 2025";
      const result = await searchAgroTrends(query);
      setNewsResult(result);
    } finally {
      setLoadingNews(false);
    }
  };

  const initMediaStream = async (mode: 'user' | 'environment', muted: boolean) => {
    setIsInitializing(true);
    stopStream();
    try {
      const constraints = {
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: !muted
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (err: any) {
      alert("SIGNAL_ERROR: Permission denied. Registry requires direct camera/audio access for ingest.");
      return false;
    } finally {
      setIsInitializing(false);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleStartStream = async () => {
    if (!isRegistered) {
      alert("REGISTRATION_REQUIRED: Initialize broadcast metadata before going live.");
      return;
    }
    const success = await initMediaStream(facingMode, isMuted);
    if (success) {
      setIsBroadcasting(true);
      setStreamDuration(0);
    }
  };

  const toggleCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isBroadcasting || streamRef.current) {
      await initMediaStream(nextMode, isMuted);
    }
  };

  const handleStopStream = async () => {
    if (confirm("STOP_BROADCAST: Confirm termination of live registry ingest. All session data will be sharded and archived.")) {
      setIsBroadcasting(false);
      setIsRegistered(false);
      stopStream();
      
      const shardId = `SHD-${Date.now()}`;
      const newShard: Partial<MediaShard> = {
        id: shardId,
        title: `ARCHIVED_STREAM: ${streamTitle}`,
        type: 'VIDEO',
        source: 'Broadcaster Node',
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: `0x${generateQuickHash()}`,
        mImpact: (reactionStats.check * 0.1 + 1.42).toFixed(2),
        size: `${(streamDuration * 0.42).toFixed(1)} MB`,
        content: `Mode: ${streamMode}. Engagement Proof: Zaps(${reactionStats.zaps}), Checks(${reactionStats.check}). Final Consensus: 100% Verified.`
      };
      
      await saveCollectionItem('media_ledger', newShard);
      alert(`STREAM FINALIZED: Sharded to Media Ledger. You earned ${totalEacEarnedFromStream.toFixed(2)} EAC from public proof reactions.`);
      onNavigate('media_ledger');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const publicProofWeight = useMemo(() => {
    const total = reactionStats.hearts + reactionStats.zaps + reactionStats.check;
    if (total === 0) return 0;
    return Math.min(100, (reactionStats.check * 2 + reactionStats.zaps * 1.5 + reactionStats.hearts) * 0.5);
  }, [reactionStats]);

  const handleUnlockAudio = async (track: any) => {
    if (track.cost > userBalance) {
      alert("Insufficient EAC liquidity for this acoustic shard.");
      return;
    }
    if (await onSpendEAC(track.cost, `AUDIO_SHARD_UNLOCK_${track.id}`)) {
      alert(`Track ${track.title} unlocked in your personal registry.`);
    }
  };

  const openPlayer = (config: typeof playerConfig) => {
    setPlayerConfig(config);
    setPlayerOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto px-1 md:px-4">
      
      {/* AgroMusika Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-2xl border border-white/10">
              <Leaf size={24} className="text-white" />
            </div>
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.6em] italic">AGROMUSIKA_MEDIA_CORE</h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
            Media <span className="text-indigo-400">Hub</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium italic max-w-2xl">
            "Powered by AgroMusika. High-fidelity industrial media ingest, synthesis, and archival for the EnvirosAgro ecosystem."
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
           <button 
             onClick={() => onNavigate('multimedia_generator' as any)}
             className="px-8 py-4 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all border border-white/10 ring-8 ring-indigo-500/5"
           >
              <Zap size={18} /> MULTIMEDIA_FORGE
           </button>
           <button 
             onClick={() => onNavigate('media_ledger')}
             className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3 shadow-xl"
           >
              <Database size={18} /> MEDIA_LEDGER
           </button>
        </div>
      </div>

      {/* Registry Pulse Ticker */}
      <div className="glass-card p-4 rounded-3xl border-emerald-500/20 flex items-center overflow-hidden bg-emerald-500/5 relative shadow-lg">
        <div className="flex items-center gap-3 shrink-0 px-6 border-r border-white/5 relative z-10">
          <Zap className="w-5 h-5 text-amber-500 fill-current animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">EOS_PULSE_V3</span>
        </div>
        <div className="flex-1 px-6 overflow-hidden relative z-10">
          {loadingNews ? (
            <div className="flex items-center gap-2"><Loader2 className="w-3 h-3 text-emerald-400 animate-spin" /><span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Syncing Global Shards...</span></div>
          ) : (
            <div className="whitespace-nowrap animate-marquee hover:pause-marquee text-xs text-emerald-400 font-mono font-bold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
              {newsResult?.text?.replace(/\n/g, ' • ') || 'Registry synchronized. No anomalies detected. Node m-Constant steady at 1.42x.'}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[24px] bg-black/40 border border-white/5 shadow-xl w-full lg:w-fit mx-auto lg:mx-0">
        {[
          { id: 'all', label: 'PRIMARY HUB' },
          { id: 'streaming', label: 'LIVE BROADCAST' },
          { id: 'video', label: 'VIDEO NODES' },
          { id: 'news', label: 'NEWSSTAND' },
          { id: 'audio', label: 'ACOUSTIC REGISTRY' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-fit">
        {/* TAB: PRIMARY HUB */}
        {tab === 'all' && (
          <div className="space-y-12 animate-in fade-in duration-500">
             {/* Featured Section */}
             <div className="glass-card rounded-[64px] border-2 border-white/10 overflow-hidden relative group min-h-[400px] shadow-3xl">
                <img src="https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1600" className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110" alt="Featured" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-12 left-12 space-y-4 max-w-2xl">
                   <span className="px-4 py-1.5 bg-emerald-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-2xl">FEATURED_SHARD</span>
                   <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">REGENERATIVE <span className="text-emerald-400">CITADELS</span></h3>
                   <p className="text-slate-200 text-xl font-medium italic drop-shadow-lg">"Exploring the high-fidelity integration of ancestral soil wisdom and cybernetic swarm logic."</p>
                   <button 
                     onClick={() => openPlayer({
                       url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                       type: 'VIDEO',
                       title: 'REGENERATIVE CITADELS',
                       author: 'SkyScout Network',
                       shardId: 'VID-FEAT-01',
                       thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1600'
                     })} 
                     className="px-10 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                   >
                      <PlayCircle size={20} /> Access Shard
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { t: 'Live Inflow', c: '3,142 Streaming', i: Radio, col: 'text-rose-500' },
                  { t: 'Knowledge base', c: '1,426 Papers', i: FileText, col: 'text-blue-400' },
                  { t: 'Acoustic Registry', c: '84 Tracks', i: Headphones, col: 'text-indigo-400' },
                  { t: 'Market Feed', c: '92 Finalized', i: ShoppingBag, col: 'text-emerald-400' },
                ].map((shard, idx) => (
                  <div key={idx} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-6 hover:border-white/20 transition-all group cursor-pointer shadow-xl">
                     <div className={`w-16 h-16 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110 ${shard.col}`}>
                        <shard.i size={32} />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{shard.t}</h4>
                        <p className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-widest">{shard.c}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB: NEWSSTAND */}
        {tab === 'news' && (
           <div className="space-y-10 animate-in slide-in-from-right-10 duration-700 max-w-5xl mx-auto">
              {loadingNews ? (
                <div className="py-40 flex flex-col items-center justify-center space-y-10">
                   <div className="relative">
                      <Loader2 size={120} className="text-emerald-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center"><Bot size={40} className="text-emerald-400 animate-pulse" /></div>
                   </div>
                   <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic">CRAWLING_GLOBAL_REGISTRY...</p>
                </div>
              ) : newsResult ? (
                <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-indigo-500/20 bg-black/80 prose prose-invert max-w-none shadow-[0_40px_150px_rgba(0,0,0,0.9)] border-l-[20px] border-l-indigo-600 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[12s]"><Globe2 size={800} /></div>
                   <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                      <div className="flex items-center gap-8">
                         <Newspaper size={48} className="text-indigo-400" />
                         <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter">Grounded Signal Synthesis</h4>
                      </div>
                      <span className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-400 font-mono text-[10px] font-black uppercase animate-pulse">GROUNDED_OK</span>
                   </div>
                   <div className="text-slate-300 text-2xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-6 border-l border-white/10">
                      {newsResult.text}
                   </div>
                   {newsResult.sources && (
                      <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                         {newsResult.sources.map((s: any, i: number) => (
                            <a key={i} href={s.web?.uri || '#'} target="_blank" rel="noopener noreferrer" className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all flex items-center justify-between group/link shadow-xl">
                               <div className="flex items-center gap-6">
                                  <div className="p-4 bg-indigo-600/10 rounded-2xl text-indigo-400 group-hover/link:scale-110 transition-transform"><Globe size={20}/></div>
                                  <div>
                                     <p className="text-sm font-black text-white uppercase italic truncate max-w-[200px]">{s.web?.title || 'Registry Shard'}</p>
                                     <p className="text-[8px] text-slate-700 font-mono mt-1 truncate max-w-[150px]">{s.web?.uri}</p>
                                  </div>
                               </div>
                               <ExternalLink size={16} className="text-slate-800 group-hover/link:text-indigo-400 transition-all" />
                            </a>
                         ))}
                      </div>
                   )}
                </div>
              ) : null}
           </div>
        )}

        {/* TAB: ACOUSTIC REGISTRY */}
        {tab === 'audio' && (
           <div className="space-y-12 animate-in slide-in-from-left-10 duration-700 max-w-5xl mx-auto">
              <div className="flex items-center justify-between px-10">
                 <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Acoustic <span className="text-emerald-400">Frequencies</span></h3>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-700">M-RESONANCE: 1.42x</span>
                    <button onClick={fetchLatestNews} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all active:scale-90"><History size={24}/></button>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 {INITIAL_AUDIO_TRACKS.map(track => (
                    <div key={track.id} className="p-10 glass-card rounded-[56px] border-2 border-white/5 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-10 group shadow-3xl bg-black/40 relative overflow-hidden active:scale-[0.99] duration-300">
                       <div className="flex items-center gap-10 relative z-10 w-full md:w-auto">
                          <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all text-emerald-400">
                             <track.icon size={44} />
                          </div>
                          <div className="space-y-2">
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-emerald-400 transition-colors">{track.title}</h4>
                             <div className="flex items-center gap-6">
                                <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{track.type}</span>
                                <span className="text-[10px] font-mono text-slate-700 flex items-center gap-2"><Clock size={12}/> {track.duration}</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10">
                          <div className="text-center md:text-right">
                             <p className="text-[10px] text-slate-800 font-black uppercase mb-1">Access Protocol</p>
                             <p className={`text-xl font-mono font-black ${track.free ? 'text-emerald-400' : 'text-amber-500'}`}>{track.free ? 'UNLOCKED' : `${track.cost} EAC`}</p>
                          </div>
                          {track.free ? (
                             <button 
                               onClick={() => openPlayer({
                                 url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                                 type: 'AUDIO',
                                 title: track.title,
                                 author: 'Bio-Electric Node',
                                 shardId: track.id
                               })}
                               className="p-8 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white shadow-3xl active:scale-90 transition-all border-2 border-white/10 ring-8 ring-emerald-500/5"
                             >
                                <Play size={32} fill="white" />
                             </button>
                          ) : (
                             <button onClick={() => handleUnlockAudio(track)} className="p-8 bg-amber-600 hover:bg-amber-500 rounded-full text-white shadow-3xl active:scale-90 transition-all border-2 border-white/10 ring-8 ring-amber-500/5">
                                <Lock size={32} />
                             </button>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {tab === 'streaming' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-6 duration-700">
             <div className="lg:col-span-4 space-y-8">
                {!isRegistered ? (
                   <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-black/40 space-y-8 shadow-2xl">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl flex items-center justify-center border border-white/10">
                            <Podcast size={32} className="w-8 h-8 text-white" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Event <span className="text-indigo-400">Planning</span></h3>
                            <p className="text-[10px] font-mono text-indigo-400/60 font-bold uppercase tracking-widest mt-2">PRE_INGEST_CONFIGURATION</p>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div className="space-y-2 px-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Broadcast Initials / Title</label>
                            <input 
                              type="text" 
                              value={streamTitle}
                              onChange={e => setStreamTitle(e.target.value)}
                              placeholder="e.g. ZONE_4_SOIL_AUDIT"
                              className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-slate-800"
                            />
                         </div>
                         <div className="space-y-3 px-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Broadcast Purpose</label>
                            <div className="grid grid-cols-2 gap-3">
                               {[
                                  { id: 'GENERAL', l: 'General', i: Globe },
                                  { id: 'VERIFICATION', l: 'Verification', i: Fingerprint },
                                  { id: 'EVIDENCE', l: 'Evidence Sync', i: ShieldCheck },
                                  { id: 'TASK_SYNC', l: 'Process Ingest', i: Factory },
                                  { id: 'COMMUNITY_LIVE', l: 'Community', i: Users },
                               ].map(m => (
                                  <button 
                                    key={m.id} 
                                    onClick={() => setStreamMode(m.id as any)}
                                    className={`p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-2 group/btn ${streamMode === m.id ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-xl' : 'bg-black border-white/10 text-slate-500 hover:border-white/30'}`}
                                  >
                                     <m.i size={18} className={streamMode === m.id ? 'text-indigo-400' : 'text-slate-700 group-hover/btn:text-slate-400'} />
                                     <span className="text-[9px] font-black uppercase tracking-tight">{m.l}</span>
                                   </button>
                               ))}
                            </div>
                         </div>
                         <button 
                           onClick={() => { if(streamTitle) setIsRegistered(true); }}
                           disabled={!streamTitle}
                           className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                         >
                            AUTHORIZE BROADCAST
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-8 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700"><Activity size={200} className="text-emerald-400" /></div>
                      <div className="flex items-center gap-6 relative z-10">
                         <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl border border-white/10">
                            <Cast size={32} className="w-8 h-8 text-white" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Broadcaster <span className="text-emerald-400">Node</span></h3>
                            <p className="text-[10px] font-mono text-emerald-500/60 font-bold uppercase tracking-widest mt-2">STREAM: {streamTitle}</p>
                         </div>
                      </div>
                      <div className="space-y-6 relative z-10">
                         <div className="p-6 bg-black/80 rounded-[32px] border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                               <span>Referendum Weight</span>
                               <span className="text-indigo-400 font-mono">{publicProofWeight.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <div className={`h-full bg-indigo-500 shadow-[0_0_20px_#6366f1]`} style={{ width: `${publicProofWeight}%` }}></div>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-3">
                            <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-3xl text-center">
                               <p className="text-[9px] text-emerald-500 font-black uppercase mb-1">Reaction Yield</p>
                               <p className="text-3xl font-mono font-black text-white">+{totalEacEarnedFromStream.toFixed(1)} <span className="text-xs">EAC</span></p>
                            </div>
                            <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-3xl text-center">
                               <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">Vouch Count</p>
                               <p className="text-3xl font-mono font-black text-white">{reactionStats.check + reactionStats.zaps + reactionStats.hearts}</p>
                            </div>
                         </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 relative z-10">
                         {isBroadcasting ? (
                           <button onClick={handleStopStream} className="w-full py-8 bg-rose-600 hover:bg-rose-500 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-xl transition-all flex items-center justify-center gap-4">
                              <CircleStop className="w-6 h-6 fill-current animate-pulse" /> TERMINATE INGEST
                           </button>
                         ) : (
                           <button onClick={handleStartStream} disabled={isInitializing} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                              {isInitializing ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} className="fill-current" />}
                              {isInitializing ? 'CALIBRATING...' : 'GO LIVE ON REGISTRY'}
                           </button>
                         )}
                      </div>
                   </div>
                )}
             </div>

             <div className="lg:col-span-8 flex flex-col space-y-8">
                <div className="glass-card rounded-[64px] border-2 border-white/5 bg-black overflow-hidden relative group min-h-[650px] shadow-3xl">
                   <video ref={videoRef} autoPlay playsInline muted={true} className={`w-full h-full object-cover transition-opacity duration-1000 ${isBroadcasting ? 'opacity-100' : 'opacity-0'}`} />
                   {!isBroadcasting && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12 py-40 opacity-20">
                        <Monitor size={140} className="text-slate-500" />
                        <div className="text-center space-y-2">
                           <p className="text-4xl font-black text-white uppercase tracking-[0.5em] italic">DIRECT_INGEST_OFFLINE</p>
                           <p className="text-lg font-bold text-slate-600 uppercase tracking-widest italic">Authorize Metadata and Camera to initialize Ingest Shard</p>
                        </div>
                     </div>
                   )}
                   {isBroadcasting && (
                     <>
                        <div className="absolute top-10 left-10 flex gap-4">
                           <div className="px-6 py-2 bg-rose-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-pulse">
                              <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></div> ON AIR
                           </div>
                           <div className="px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest font-mono">{formatTime(streamDuration)}</div>
                           <div className="px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest">#{streamMode}</div>
                        </div>

                        <div className="absolute top-10 right-10 flex flex-col gap-4">
                           <button 
                             onClick={toggleCamera}
                             className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-2xl hover:bg-emerald-600 transition-all active:scale-95"
                             title="Flip Camera Shard"
                           >
                              <RefreshCw size={24} className={isInitializing ? 'animate-spin' : ''} />
                           </button>
                        </div>

                        <div className="absolute bottom-32 right-10 flex flex-col gap-6 items-center pointer-events-none">
                           {reactionPool.map(r => (
                              <div key={r.id} className="animate-in fade-out slide-out-to-top duration-[4s] flex flex-col items-center">
                                 {r.type === 'heart' ? <Heart className="text-rose-500 fill-current w-8 h-8" /> : 
                                  r.type === 'zap' ? <Zap className="text-amber-400 fill-current w-8 h-8" /> : 
                                  <CheckCircle2 className="text-emerald-400 fill-current w-8 h-8" />}
                              </div>
                           ))}
                        </div>

                        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                           <div className="p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[40px] max-w-sm space-y-4 shadow-2xl">
                              <div className="flex items-center gap-3">
                                 <Users className="w-6 h-6 text-emerald-400" />
                                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Public Consensus Active</span>
                              </div>
                              <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
                                 {streamMode === 'VERIFICATION' ? '"Steward identity under public referendum. Community vouches verify node validity."' : 
                                  streamMode === 'EVIDENCE' ? '"Public verifying field biometrics in real-time. Inflow streamlining active."' : 
                                  streamMode === 'TASK_SYNC' ? '"Industrial process sharding live. Ingesting biological transformation proof."' :
                                  '"Community sharding active. Public proof weight increasing..."'}
                              </p>
                           </div>
                        </div>
                     </>
                   )}
                </div>
             </div>
          </div>
        )}

        {tab === 'video' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {VIDEO_NODES.map(node => (
                 <div key={node.id} className="glass-card rounded-[56px] overflow-hidden border border-white/5 bg-black/40 group hover:border-emerald-500/20 transition-all shadow-xl">
                    <div className="h-48 relative overflow-hidden">
                       <img src={node.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                       <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-rose-600 rounded-full text-white text-[8px] font-black uppercase">LIVE</span>
                       </div>
                    </div>
                    <div className="p-8 space-y-4">
                       <h4 className="text-xl font-black text-white uppercase italic">{node.title}</h4>
                       <p className="text-xs text-slate-500 line-clamp-2 italic">"{node.desc}"</p>
                       <button 
                         onClick={() => openPlayer({
                           url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                           type: 'VIDEO',
                           title: node.title,
                           author: 'Registry Node',
                           shardId: node.id,
                           thumbnail: node.thumb
                         })}
                         className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-emerald-600 transition-all uppercase"
                       >
                         Enter Ingest Node
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>

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
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MediaHub;