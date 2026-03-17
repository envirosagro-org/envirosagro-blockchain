
import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  PlayCircle, GraduationCap, Video, BookOpen, MessageSquare, Award, Clock, ChevronRight, FileText, Library, Coins,
  Users, Globe, Heart, PlusCircle, TrendingUp, ShieldCheck, Search, Users2, Briefcase, Lightbulb, CheckCircle2,
  X, Loader2, ArrowUpRight, Handshake, Zap, Upload, Leaf, BarChart4, ExternalLink, MapPin, Fingerprint,
  Activity, History, Info, BadgeCheck, Dna, Lock, SearchCode, Target, Bot, Brain, ShieldAlert, HeartPulse,
  BrainCircuit, AlertTriangle, Waves, Atom, RefreshCw, Scale, FileSignature, FileCheck, ClipboardCheck,
  FileDown, Timer, LayoutGrid, Trophy, PenTool, ArrowRight, AlertCircle, Download, Terminal, FileDigit,
  Shield, Stamp, Scan, User as UserIcon, Share2, MoreVertical, ThumbsUp, MessageSquareShare, Monitor,
  Radio, Cast, LogOut, CircleDot, FileUp, Workflow, Podcast, PencilRuler, Hash, Crown, Star, Eye,
  Settings, Binary, Bookmark, ArrowLeftCircle, ArrowLeft, Database, Map as MapIcon, SmartphoneNfc,
  CreditCard, Globe2, WalletCards, Factory, Sprout, Network, Send, Key, Quote, Mic, Camera, PhoneCall,
  UserPlus, MessageCircle, Video as VideoIcon, LogOut as LeaveIcon, Gavel,
  ChevronDown,
  Wand2,
  ListTodo,
  FileSearch,
  Box,
  LineChart as LineChartIcon,
  ImageIcon,
  Volume2,
  Paperclip,
  UserCheck,
  Layout as LayoutIcon,
  Shapes,
  Gamepad2,
  Crosshair,
  MessageSquare as MessageIcon,
  Play,
  Cpu,
  FileCode,
  CheckCircle
} from 'lucide-react';
import { User, ViewState, Collective, SocialPost, PostComment, StewardConnection } from '../types';
import { generateAgroExam, getGroundedAgroResources, chatWithAgroLang, AgroLangResponse } from '../services/agroLangService';
import { listenToCollection, saveCollectionItem, dispatchNetworkSignal } from '../services/firebaseService';
import { generateAlphanumericId } from '../systemFunctions';

interface CommunityProps {
  user: User;
  isGuest: boolean;
  onContribution: (type: 'post' | 'upload' | 'module' | 'quiz', category: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState, section?: string | null, pushToHistory?: boolean, params?: any) => void;
  onEmitSignal: (signal: any) => void;
  initialSection?: string | null;
  hoodConnections?: any[];
  onHookHood?: (targetEsin: string, type?: any) => void;
}

const LMS_MODULES = [
  { id: 'mod-1', title: "EOS Framework Fundamentals", category: "Theoretical", eac: 50, col: "text-emerald-400", special: false, progress: 100, desc: "A comprehensive introduction to the SEHTI pillars and registry architecture." },
  { id: 'mod-2', title: "m-Constant Resilience Logic", category: "Technical", eac: 150, col: "text-blue-400", special: true, progress: 45, desc: "Deep dive into the mathematical derivation of industrial stability and yield multipliers." },
  { id: 'mod-3', title: "Digital MRV Protocols", category: "Scientific", eac: 80, col: "text-indigo-400", special: false, progress: 0, desc: "Standardizing biomass evidence sharding for carbon credit finality." },
];

const INITIAL_COLLECTIVES: Collective[] = [
  { 
    id: 'SHD-882', name: 'BANTU SOIL GUARDIANS', adminEsin: 'EA-ADMIN-X1', adminName: 'Chief Steward', memberCount: 142, resonance: 94, 
    rules: 'PROTOCOL: REQUIRES VERIFIED TIER 2 STATUS.', type: 'HERITAGE_CLAN', 
    mission: 'Preserving drought-resistant lineage seeds through collective sharding.', trending: '+2.4%',
    status: 'QUALIFIED', members: [], treasuryBalance: 12400, activeMissions: ['MIS-882'],
    description: 'A collective dedicated to ancestral soil guardianship.'
  },
  { 
    id: 'SHD-104', name: 'NEO-HYDROPONIC GUILD', adminEsin: 'EA-TECH-G4', adminName: 'Dr. Hydro', memberCount: 85, resonance: 88, 
    rules: 'PROTOCOL: OPEN FOR ALL CEA-CERTIFIED STEWARDS.', type: 'TECHNICAL_GUILD', 
    mission: 'Optimizing nutrient delivery shards across urban vertical stacks.', trending: '+8.1%',
    status: 'VERIFIED', members: [], treasuryBalance: 4500, activeMissions: [],
    description: 'Technical specialists in high-efficiency hydroponic sharding.'
  },
];

const MOCK_STEWARDS = [
  { esin: 'EA-ALPH-8821', name: 'Steward Alpha', role: 'Soil Expert', location: 'Nairobi, Kenya', res: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', online: true, skills: ['Bantu Soil Sharding', 'Remediation'] },
  { esin: 'EA-GAIA-1104', name: 'Gaia Green', role: 'Genetics Analyst', location: 'Omaha, USA', res: 92, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', online: false, skills: ['DNA Sequencing', 'Aura Sync'] },
  { esin: 'EA-ROBO-9214', name: 'Dr. Orion Bot', role: 'Automation Engineer', location: 'Tokyo Hub', res: 95, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', online: true, skills: ['Swarm Control', 'Mesh Ingest'] },
];

const Community: React.FC<CommunityProps> = ({ 
  user, 
  isGuest, 
  onEarnEAC, 
  onSpendEAC, 
  onContribution, 
  onNavigate, 
  onEmitSignal,
  initialSection, 
  hoodConnections = [], 
  onHookHood 
}) => {
  const [activeTab, setActiveTab] = useState<'social' | 'shards' | 'lms' | 'network' | 'comic'>('social');
  const [lmsSubTab, setLmsSubTab] = useState<'modules' | 'exams' | 'forge'>('modules');
  
  const [collectives, setCollectives] = useState<Collective[]>(INITIAL_COLLECTIVES);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [connections, setConnections] = useState<StewardConnection[]>([]);
  
  const [showCreateCollective, setShowCreateCollective] = useState(false);
  const [showProfileView, setShowProfileView] = useState<string | null>(null); 
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postMedia, setPostMedia] = useState<{type: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'DOCUMENT', url: string} | null>(null);

  const [newCollName, setNewCollName] = useState('');
  const [newCollDesc, setNewCollDesc] = useState('');
  const [newCollType, setNewCollType] = useState<Collective['type']>('TECHNICAL_GUILD');
  const [esinSign, setEsinSign] = useState('');

  const [examStep, setExamStep] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);

  const [showChat, setShowChat] = useState<string | null>(null); 
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (initialSection) {
      if (['social', 'shards', 'lms', 'network'].includes(initialSection)) {
        setActiveTab(initialSection as any);
      }
    }
  }, [initialSection]);

  useEffect(() => {
    const unsubPosts = listenToCollection('social_posts', (data) => setPosts(data.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())));
    const unsubColl = listenToCollection('collectives', (data) => setCollectives([...INITIAL_COLLECTIVES, ...data]));
    const unsubConn = listenToCollection('connections', setConnections);
    return () => { unsubPosts(); unsubColl(); unsubConn(); };
  }, []);

  const isAgroWorker = user.role.toLowerCase().includes('worker') || user.role.toLowerCase().includes('expert') || user.role.toLowerCase().includes('engineer');

  const handleCreateCollective = async () => {
    if (!isAgroWorker) {
      alert("ROLE_RESTRICTION: Only verified Agro Workers can initialize Collective Nodes.");
      return;
    }
    const fee = 250;
    if (!await onSpendEAC(fee, 'COLLECTIVE_NODE_INITIALIZATION')) return;

    const newColl: Collective = {
      id: `SHD-${generateAlphanumericId(7)}`,
      name: newCollName,
      adminEsin: user.esin,
      adminName: user.name,
      description: newCollDesc,
      memberCount: 1,
      resonance: 100,
      type: newCollType,
      rules: 'Standard SEHTI Compliance',
      mission: 'Community-driven sustainability sharding.',
      trending: 'New',
      status: 'PROVISIONAL',
      members: [user.esin],
      treasuryBalance: 0,
      activeMissions: []
    };

    await saveCollectionItem('collectives', newColl);
    setShowCreateCollective(false);
    onEarnEAC(50, 'FOUNDER_SHARD_MINTED');
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;
    setIsPosting(true);
    const newPost: SocialPost = {
      id: `PST-${Date.now()}`,
      authorEsin: user.esin,
      authorName: user.name,
      authorAvatar: user.avatar,
      text: postContent,
      mediaType: postMedia?.type,
      mediaUrl: postMedia?.url,
      timestamp: new Date().toISOString(),
      likes: 0,
      vouchCount: 0,
      shares: 0,
      comments: []
    };
    await saveCollectionItem('social_posts', newPost);
    setIsPosting(false);
    setPostContent('');
    setPostMedia(null);
  };

  const handleStartExam = async (topic: string) => {
    setIsGeneratingExam(true);
    try {
      const questions = await generateAgroExam(topic);
      setExamQuestions(questions);
      setExamStep('active');
      setCurrentQuestion(0);
      setUserAnswers({});
    } catch (e) {
      alert("Oracle link interrupted.");
    } finally {
      setIsGeneratingExam(false);
    }
  };

  const submitExam = () => {
    let score = 0;
    examQuestions.forEach((q, i) => {
      if (userAnswers[i] === q.correct) score++;
    });
    setExamStep('results');
    if (score === examQuestions.length) {
      onEarnEAC(100, 'EXAM_PERFECTION_YIELD');
    } else if (score > examQuestions.length / 2) {
      onEarnEAC(30, 'EXAM_COMPLETION_YIELD');
    }
  };

  const handleHoodRequest = async (targetEsin: string) => {
    const existing = connections.find(c => (c.fromEsin === user.esin && c.toEsin === targetEsin) || (c.fromEsin === targetEsin && c.toEsin === user.esin));
    if (existing) return;
    const newConn: StewardConnection = {
      id: `CON-${Date.now()}`,
      fromEsin: user.esin,
      toEsin: targetEsin,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };
    await saveCollectionItem('connections', newConn);
    dispatchNetworkSignal({
      type: 'engagement',
      origin: 'MANUAL',
      title: 'HOOD_REQUEST_INBOUND',
      message: `${user.name} requests a social handshake with your node.`,
      priority: 'medium',
      meta: { target: 'profile', payload: { esin: user.esin } }
    });
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !showChat) return;
    const msg = chatInput.trim();
    setChatInput('');
    
    await dispatchNetworkSignal({
      type: 'engagement',
      origin: 'MANUAL',
      title: 'SIGNAL_SHARD_TRANSMITTED',
      message: `Encrypted signal sharded to node ${showChat}.`,
      priority: 'low',
      actionIcon: 'Send'
    });
  };

  const handleVouch = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const updatedPost = { ...post, vouchCount: (post.vouchCount || 0) + 1 };
    await saveCollectionItem('social_posts', updatedPost);
    onEarnEAC(5, 'SOCIAL_VOUCH_REWARD');
  };

  const handleAddComment = async (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const newComment: PostComment = {
      id: `COM-${Date.now()}`,
      authorEsin: user.esin,
      authorName: user.name,
      text: commentText,
      timestamp: new Date().toISOString()
    };
    const updatedPost = { ...post, comments: [...post.comments, newComment] };
    await saveCollectionItem('social_posts', updatedPost);
    onEarnEAC(10, 'SOCIAL_ECHO_REWARD');
  };

  const [forgeTopic, setForgeTopic] = useState('');
  const [isForging, setIsForging] = useState(false);

  const handleForgeKnowledge = async () => {
    if (!forgeTopic.trim()) return;
    setIsForging(true);
    try {
      const response = await chatWithAgroLang(`Forge a technical knowledge shard about: ${forgeTopic}. Format as a structured educational module.`, []);
      if (response && response.text) {
        onEarnEAC(150, 'KNOWLEDGE_FORGE_YIELD');
        onEmitSignal({
          type: 'ledger_anchor',
          origin: 'ORACLE',
          title: 'KNOWLEDGE_SHARD_FORGED',
          message: `New technical shard synthesized for topic: ${forgeTopic}.`,
          priority: 'medium'
        });
        setForgeTopic('');
        alert("Knowledge Shard successfully committed to the Learning Ledger.");
      }
    } catch (e) {
      alert("Forge synchronization failed.");
    } finally {
      setIsForging(false);
    }
  };

  const selectedStewardDossier = useMemo(() => {
    if (!showProfileView) return null;
    return MOCK_STEWARDS.find(s => s.esin === showProfileView);
  }, [showProfileView]);

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-500 pb-48 max-w-[1700px] mx-auto px-4 relative">
      
      {/* 1. Community HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <Users2 size={500} className="text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl shrink-0">
              <Users2 size={80} className="text-white animate-float" />
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">STEWARD_QUORUM_v6.5</span>
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Collective <span className="text-emerald-400">Mesh.</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating social resonance through verified steward hoods and collective innovation shards. Forge a guild or synchronize with existing nodes."
              </p>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">SOCIAL_RESONANCE</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">98<span className="text-3xl text-emerald-500 font-sans italic ml-1">.4</span></h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4">QUORUM_VERIFIED</p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <button 
                onClick={() => setShowCreateCollective(true)}
                disabled={!isAgroWorker}
                className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 disabled:grayscale"
              >
                 <PlusCircle size={18} /> FOUND_COLLECTIVE
              </button>
           </div>
        </div>
      </div>

      {/* 2. Unified Community Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'social', label: 'Steward Feed', icon: HeartPulse },
          { id: 'network', label: 'Steward Network', icon: Globe },
          { id: 'shards', label: 'Collective Shards', icon: Users2 },
          { id: 'lms', label: 'Knowledge Base', icon: Library },
          { id: 'comic', label: 'Make it Comic', icon: Gamepad2 },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: STEWARD FEED --- */}
        {activeTab === 'social' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-8 space-y-8">
                 {/* Post Creator */}
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                    <div className="flex gap-8 items-start">
                       <div className="w-16 h-16 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xl relative overflow-hidden group">
                          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                          <UserIcon size={32} />
                       </div>
                       <div className="flex-1 space-16">
                          <textarea 
                             value={postContent}
                             onChange={e => setPostContent(e.target.value)}
                             placeholder={`Steward ${user.name}, broadcast a signal to the mesh...`}
                             className="w-full bg-black/60 border border-white/10 rounded-[40px] p-8 text-white text-xl font-medium italic focus:ring-8 focus:ring-indigo-500/10 outline-none h-44 resize-none placeholder:text-stone-900 shadow-inner"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-6">
                             <div className="flex gap-4">
                                <button onClick={() => setPostMedia({type: 'PHOTO', url: ''})} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-emerald-400 transition-all shadow-xl"><ImageIcon size={20}/></button>
                                <button onClick={() => setPostMedia({type: 'VIDEO', url: ''})} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-blue-400 transition-all shadow-xl"><VideoIcon size={20}/></button>
                                <button onClick={() => setPostMedia({type: 'AUDIO', url: ''})} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-indigo-400 transition-all shadow-xl"><Mic size={20}/></button>
                                <button onClick={() => onNavigate('media', 'COMMUNITY')} className="p-4 bg-rose-600/10 border border-rose-500/20 rounded-2xl text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-xl flex items-center gap-3">
                                   <Radio size={16} className="animate-pulse" /> Live Stream
                                </button>
                             </div>
                             <button 
                               onClick={handlePost}
                               disabled={isPosting || !postContent.trim()}
                               className="px-12 py-6 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl flex items-center gap-4 transition-all active:scale-95 disabled:opacity-30 border-4 border-white/10 ring-[12px] ring-white/5"
                             >
                                {isPosting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                {isPosting ? 'BROADCASTING...' : 'BROADCAST SIGNAL'}
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Feed Stream */}
                 <div className="space-y-8">
                    {posts.length === 0 ? (
                       <div className="py-40 text-center opacity-10 space-y-6">
                          <Radio size={100} className="mx-auto" />
                          <p className="text-4xl font-black uppercase tracking-[0.4em]">Awaiting Signals...</p>
                       </div>
                    ) : posts.map(post => (
                       <div key={post.id} className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 space-y-8 shadow-3xl hover:border-emerald-500/20 transition-all group active:scale-[0.99] duration-500">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-6">
                                <div onClick={() => setShowProfileView(post.authorEsin)} className="w-16 h-16 rounded-[28px] border-2 border-white/10 overflow-hidden cursor-pointer shadow-xl group-hover:scale-105 transition-transform">
                                   <img src={post.authorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100'} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                   <h4 onClick={() => setShowProfileView(post.authorEsin)} className="text-2xl font-black text-white uppercase italic tracking-tight m-0 cursor-pointer group-hover:text-emerald-400 transition-colors">{post.authorName}</h4>
                                   <p className="text-[10px] text-slate-700 font-mono font-bold uppercase tracking-widest mt-1.5">{post.authorEsin}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-slate-800 uppercase tracking-widest">{new Date(post.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                <button className="p-3 text-slate-800 hover:text-white transition-colors"><MoreVertical size={20}/></button>
                             </div>
                          </div>

                          <div className="space-y-6 border-l-4 border-white/5 pl-10 ml-8">
                             <p className="text-2xl text-slate-300 italic leading-relaxed font-medium">"{post.text}"</p>
                             {post.mediaType && (
                                <div className="rounded-[40px] overflow-hidden border-2 border-white/10 shadow-3xl relative group/media min-h-[300px]">
                                   <img src="https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1200" className="w-full h-full object-cover group/media:scale-105 transition-transform duration-[10s]" alt="" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                   <div className="absolute bottom-6 left-8 flex items-center gap-4">
                                      <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-2xl"><ImageIcon size={20} /></div>
                                      <span className="text-[11px] font-black text-white uppercase tracking-widest">Visual Evidence Shard</span>
                                   </div>
                                </div>
                             )}
                          </div>

                          <div className="pt-10 border-t border-white/5 flex flex-wrap gap-10">
                             <button 
                                onClick={() => handleVouch(post.id)}
                                className="flex items-center gap-3 text-[11px] font-black text-slate-600 hover:text-emerald-400 transition-all uppercase tracking-widest"
                             >
                                <ThumbsUp size={18} /> {post.vouchCount || 0} Vouches
                             </button>
                             <button className="flex items-center gap-3 text-[11px] font-black text-slate-600 hover:text-blue-400 transition-all uppercase tracking-widest">
                                <MessageSquare size={18} /> {post.comments.length} Echoes
                             </button>
                             <button className="flex items-center gap-3 text-[11px] font-black text-slate-600 hover:text-indigo-400 transition-all uppercase tracking-widest">
                                <Share2 size={18} /> Shard Signal
                             </button>
                             <button onClick={() => onNavigate('digital_mrv')} className="ml-auto px-6 py-2 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Audit Evidence</button>
                          </div>

                          {/* Comment Input */}
                          <div className="pt-6 flex gap-4 items-center">
                             <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 shrink-0">
                                <UserIcon size={16} />
                             </div>
                             <div className="flex-1 relative">
                                <input 
                                   type="text"
                                   placeholder="Add an echo to this signal..."
                                   onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                         handleAddComment(post.id, (e.target as HTMLInputElement).value);
                                         (e.target as HTMLInputElement).value = '';
                                      }
                                   }}
                                   className="w-full bg-black/40 border border-white/10 rounded-full px-6 py-3 text-[11px] text-white italic outline-none focus:border-indigo-500/50 transition-all"
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300">
                                   <Send size={14} />
                                </button>
                             </div>
                          </div>

                          {/* Comments List */}
                          {post.comments.length > 0 && (
                             <div className="space-y-4 pt-6">
                                {post.comments.slice(0, 3).map(comment => (
                                   <div key={comment.id} className="flex gap-4 items-start pl-4 border-l-2 border-white/5">
                                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-600 shrink-0">
                                         <UserIcon size={12} />
                                      </div>
                                      <div className="flex-1">
                                         <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-white uppercase italic">{comment.authorName}</span>
                                            <span className="text-[8px] font-mono text-slate-700">{new Date(comment.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                         </div>
                                         <p className="text-[11px] text-slate-400 italic mt-1">"{comment.text}"</p>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </div>

              {/* Sidebar: Social Discovery */}
              <div className="lg:col-span-4 space-y-10">
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-3xl">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Discover <span className="text-indigo-400">Stewards</span></h3>
                       <button className="p-2 bg-white/5 rounded-xl text-slate-700 hover:text-white transition-all"><RefreshCw size={16} /></button>
                    </div>
                    <div className="space-y-6">
                       {MOCK_STEWARDS.map(steward => (
                          <div key={steward.esin} className="p-6 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-indigo-500/30 transition-all group flex items-center justify-between relative overflow-hidden active:scale-[0.98] duration-300">
                             <div className="flex items-center gap-6 relative z-10">
                                <div className="relative shrink-0">
                                   <div onClick={() => setShowProfileView(steward.esin)} className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:scale-105 transition-all shadow-xl cursor-pointer">
                                      <img src={steward.avatar} alt="" className="w-full h-full object-cover" />
                                   </div>
                                   <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${steward.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
                                </div>
                                <div className="text-left">
                                   <p onClick={() => setShowProfileView(steward.esin)} className="text-base font-black text-white uppercase italic leading-none cursor-pointer group-hover:text-indigo-400 transition-colors">{steward.name}</p>
                                   <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase">{steward.role}</p>
                                </div>
                             </div>
                             <button 
                                onClick={() => handleHoodRequest(steward.esin)}
                                className="p-4 bg-white/5 hover:bg-indigo-600 rounded-2xl text-slate-700 hover:text-white transition-all shadow-xl relative z-10"
                             >
                                <UserPlus size={24} />
                             </button>
                          </div>
                       ))}
                    </div>
                    <button onClick={() => setActiveTab('network')} className="w-full py-5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all">VIEW_STEWARD_REGISTRY</button>
                 </div>

                 {/* Collective Participation Shard */}
                 <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-3xl group">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl group-hover:rotate-12 transition-transform"><Target size={28} className="text-white" /></div>
                       <h4 className="text-2xl font-black text-white uppercase italic m-0">Group <span className="text-emerald-400">Impact</span></h4>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 shadow-inner space-y-4">
                       <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 px-2">
                          <span>Collective Yield</span>
                          <span className="text-emerald-400 font-mono">+12.4% Δ</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                          <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" style={{ width: '84%' }}></div>
                       </div>
                       <p className="text-[10px] text-slate-500 italic text-center pt-2">"Participating in collective missions boosts your node's m-constant by sharding resource stress."</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: STEWARD NETWORK --- */}
        {activeTab === 'network' && (
           <div className="space-y-12 animate-in zoom-in duration-700 max-w-[1400px] mx-auto">
              <div className="flex flex-col items-center text-center space-y-6 mb-16">
                 <h2 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">STEWARD <span className="text-indigo-400">HOODS.</span></h2>
                 <p className="text-slate-500 text-2xl font-medium italic max-w-4xl mx-auto leading-relaxed">"Robust sharding of social connections. Trigger mutual hoods to establish high-fidelity agile networks."</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[...MOCK_STEWARDS, ...MOCK_STEWARDS, ...MOCK_STEWARDS].map((steward, i) => (
                    <div key={i} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col items-center text-center space-y-8 shadow-3xl relative overflow-hidden active:scale-[0.99]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Globe size={200} /></div>
                       <div className="relative group">
                          <div onClick={() => setShowProfileView(steward.esin)} className="w-32 h-32 rounded-[44px] overflow-hidden border-4 border-white/10 shadow-3xl cursor-pointer group-hover:scale-105 transition-transform">
                             <img src={steward.avatar} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-[#050706] shadow-2xl">
                             <BadgeCheck size={20} />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <h4 onClick={() => setShowProfileView(steward.esin)} className="text-3xl font-black text-white uppercase italic tracking-tight m-0 cursor-pointer group-hover:text-indigo-400 transition-colors leading-none">{steward.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-widest">{steward.esin}</p>
                       </div>
                       <div className="w-full pt-8 border-t border-white/5 space-y-6">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 px-4">
                             <span>Resonance</span>
                             <span className="text-emerald-400 font-mono">{steward.res}%</span>
                          </div>
                          <div className="flex gap-3">
                             <button onClick={() => setShowChat(steward.esin)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">Signal</button>
                             <button onClick={() => handleHoodRequest(steward.esin)} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest shadow-xl active:scale-90 transition-all border border-white/10">Hook Hood</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: COLLECTIVE SHARDS --- */}
        {activeTab === 'shards' && (
           <div className="space-y-16 animate-in slide-in-from-right-10 duration-700 max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                 {collectives.map(shard => (
                    <div key={shard.id} className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300 flex flex-col min-h-[700px] justify-between">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s] pointer-events-none"><Users2 size={500} /></div>
                       <div className="space-y-10 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="w-24 h-24 rounded-[40px] bg-emerald-600 shadow-3xl border-4 border-white/10 flex items-center justify-center text-white group-hover:rotate-6 transition-transform"><Users2 size={48} /></div>
                             <div className="text-right flex flex-col items-end gap-3">
                                <span className={`px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-xl tracking-widest`}>{shard.type.replace('_', ' ')}</span>
                                <p className="text-[11px] text-slate-700 font-mono font-black italic tracking-widest uppercase">{shard.id} // ADMIN: {shard.adminName}</p>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter m-0 leading-none drop-shadow-2xl">{shard.name}</h4>
                             <p className="text-2xl text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{shard.mission}"</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
                             <div className="text-center group/met">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Node Treasury</p>
                                <p className="text-5xl font-mono font-black text-white group-hover/met:text-emerald-400 transition-colors">{shard.treasuryBalance.toLocaleString()}<span className="text-sm ml-1 text-emerald-500">EAC</span></p>
                             </div>
                             <div className="text-center group/met">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Steward Quorum</p>
                                <p className="text-5xl font-mono font-black text-white group-hover/met:text-blue-400 transition-colors">{shard.memberCount}</p>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6 relative z-10 mt-10">
                          {shard.adminEsin === user.esin && (
                             <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[44px] flex items-center justify-between shadow-inner">
                                <div>
                                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Administrative Privileges</p>
                                   <p className="text-sm font-bold text-white uppercase italic">Disburse Yield Shards</p>
                                </div>
                                <button className="p-5 bg-indigo-600 rounded-3xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"><Gavel size={24}/></button>
                             </div>
                          )}
                          <div className="flex gap-4">
                             <button className="flex-1 py-8 bg-white/5 border-2 border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4">
                                <FileText size={20} /> VIEW_MANIFEST
                             </button>
                             <button 
                               className={`flex-1 py-8 rounded-full font-black text-sm uppercase tracking-[0.5em] shadow-3xl transition-all flex items-center justify-center gap-5 border-4 border-white/10 ring-[12px] ring-white/5 active:scale-95 ${shard.members.includes(user.esin) ? 'bg-rose-950/40 text-rose-500 border-rose-500/30' : 'bg-emerald-600 text-white'}`}
                             >
                                {shard.members.includes(user.esin) ? 'EXIT_SHARD' : 'JOIN_GUILD'}
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: KNOWLEDGE BASE (LMS) --- */}
        {activeTab === 'lms' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700 max-w-[1600px] mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8 px-6">
                 <div className="space-y-2">
                    <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Learning <span className="text-indigo-400">Ledger.</span></h3>
                    <p className="text-slate-500 text-lg font-medium italic opacity-70">"Master the EOS framework and earn EAC through verified knowledge sharding."</p>
                 </div>
                 <div className="flex p-1.5 glass-card bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                    {[
                      { id: 'modules', label: 'Modules', icon: Library },
                      { id: 'exams', label: 'Certifications', icon: GraduationCap },
                      { id: 'forge', label: 'Forge Knowledge', icon: BrainCircuit }
                    ].map(st => (
                       <button 
                         key={st.id} 
                         onClick={() => setLmsSubTab(st.id as any)}
                         className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${lmsSubTab === st.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                       >
                          <st.icon size={14} /> {st.label}
                       </button>
                    ))}
                 </div>
              </div>
              
              {lmsSubTab === 'modules' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {LMS_MODULES.map(mod => (
                       <div key={mod.id} className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-indigo-500/40 transition-all group flex flex-col justify-between min-h-[400px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99]">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Library size={300} /></div>
                          <div className="space-y-8 relative z-10">
                             <div className="flex justify-between items-start">
                                <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${mod.col} shadow-2xl group-hover:rotate-6 transition-all`}>
                                   <BookOpen size={36} />
                                </div>
                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest ${mod.special ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                   {mod.category}
                                </span>
                             </div>
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{mod.title}</h4>
                             <p className="text-slate-400 text-base leading-relaxed italic opacity-80 group-hover:opacity-100 line-clamp-3">"{mod.desc}"</p>
                          </div>
                          <div className="pt-10 border-t border-white/5 relative z-10 flex items-end justify-between">
                             <div className="space-y-1">
                                <p className="text-[9px] text-slate-800 font-black uppercase tracking-widest italic">Success Yield</p>
                                <p className="text-3xl font-mono font-black text-white">+{mod.eac}<span className="text-sm ml-1 text-indigo-500 italic">EAC</span></p>
                             </div>
                             <button className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all border-2 border-white/10 ring-4 ring-indigo-500/5">
                                <PlayCircle size={24} /> {mod.progress === 100 ? 'REVIEW SHARD' : 'RESUME SYNC'}
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}

              {lmsSubTab === 'exams' && (
                 <div className="max-w-4xl mx-auto space-y-12">
                    {examStep === 'intro' && (
                       <div className="p-16 glass-card rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 text-center space-y-12 shadow-3xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform"><GraduationCap size={600} className="text-indigo-400" /></div>
                          <div className="relative z-10 space-y-8">
                             <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12">
                                <Award size={64} className="text-white animate-pulse" />
                             </div>
                             <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">EOS <span className="text-indigo-400">Master Exams</span></h3>
                             <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto leading-relaxed">"Verify your master of the agricultural code. Performed under the watchful eye of the Science Oracle."</p>
                             <div className="flex justify-center gap-8 py-10 border-y border-white/5 max-w-lg mx-auto">
                                <div className="text-center">
                                   <p className="text-[10px] text-slate-500 font-black uppercase">Standard Bounty</p>
                                   <p className="text-4xl font-mono font-black text-emerald-400">100 EAC</p>
                                </div>
                                <div className="text-center border-l border-white/5 pl-8">
                                   <p className="text-[10px] text-slate-500 font-black uppercase">Node Trust Boost</p>
                                   <p className="text-4xl font-mono font-black text-blue-400">+5% α</p>
                                </div>
                             </div>
                             <div className="flex flex-col md:flex-row justify-center gap-6">
                               <button 
                                  onClick={() => handleStartExam("EnvirosAgro Ecosystem Architecture")}
                                  disabled={isGeneratingExam}
                                  className="flex-1 max-w-xs py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-indigo-500/5 disabled:opacity-20"
                               >
                                  {isGeneratingExam ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : <Play size={32} className="mx-auto" />}
                                  <p className="mt-4">{isGeneratingExam ? 'SYNTHESIZING EXAM SHARDS...' : 'COMMENCE CERTIFICATION'}</p>
                               </button>
                               <button 
                                  onClick={() => onNavigate('multimedia_generator', null, true, {
                                    prompt: "Generate a new master exam for the EnvirosAgro ecosystem. Include questions about m-Constant, SEHTI pillars, and Digital MRV protocols.",
                                    type: 'document'
                                  })}
                                  className="flex-1 max-w-xs py-10 bg-white/5 border-4 border-white/10 rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-xl hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                               >
                                  <Bot size={32} className="mx-auto" />
                                  <p className="mt-4">AUTO-GENERATE NEW EXAM</p>
                               </button>
                             </div>
                          </div>
                       </div>
                    )}

                    {examStep === 'active' && examQuestions.length > 0 && (
                       <div className="space-y-12 animate-in zoom-in duration-500">
                          <div className="flex justify-between items-center px-10">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Clock size={24} className="animate-spin-slow" /></div>
                                <span className="text-xl font-mono font-black text-white uppercase tracking-widest">T-{(1200 - (currentQuestion * 120))}s REMAINING</span>
                             </div>
                             <span className="text-sm font-black text-slate-500 uppercase tracking-widest">Question {currentQuestion + 1} of {examQuestions.length}</span>
                          </div>

                          <div className="p-16 glass-card rounded-[80px] border-2 border-white/10 bg-black/60 shadow-3xl space-y-12">
                             <h4 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-xl border-l-8 border-indigo-600 pl-10">
                                "{examQuestions[currentQuestion].question}"
                             </h4>
                             <div className="grid gap-4">
                                {examQuestions[currentQuestion].options.map((opt: string, idx: number) => (
                                   <button 
                                      key={idx}
                                      onClick={() => setUserAnswers({...userAnswers, [currentQuestion]: idx})}
                                      className={`p-10 rounded-[48px] border-2 transition-all text-left flex justify-between items-center group/opt ${userAnswers[currentQuestion] === idx ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-xl scale-102' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}
                                   >
                                      <span className="text-xl font-medium italic">{opt}</span>
                                      <div className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${userAnswers[currentQuestion] === idx ? 'bg-indigo-600 border-white' : 'border-slate-800'}`}>
                                         {userAnswers[currentQuestion] === idx && <CheckCircle size={18} />}
                                      </div>
                                   </button>
                                ))}
                             </div>
                             <div className="flex justify-between pt-10">
                                <button 
                                   disabled={currentQuestion === 0}
                                   onClick={() => setCurrentQuestion(prev => prev - 1)}
                                   className="px-12 py-6 bg-white/5 rounded-full text-[11px] font-black uppercase text-slate-500 hover:text-white disabled:opacity-10"
                                >
                                   Previous Shard
                                </button>
                                {currentQuestion === examQuestions.length - 1 ? (
                                   <button onClick={submitExam} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl active:scale-95 border-2 border-white/10 ring-8 ring-indigo-500/5">COMMIT ANSWERS</button>
                                ) : (
                                   <button 
                                      onClick={() => setCurrentQuestion(prev => prev + 1)}
                                      className="px-16 py-8 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all"
                                   >
                                      Next Question
                                   </button>
                                )}
                             </div>
                          </div>
                       </div>
                    )}

                    {examStep === 'results' && (
                       <div className="p-20 glass-card rounded-[80px] border-2 border-emerald-500/30 bg-[#020503] shadow-3xl text-center space-y-16 animate-in zoom-in duration-700">
                          <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center mx-auto shadow-[0_0_200px_rgba(16,185,129,0.3)] relative group scale-110">
                             <Trophy size={100} className="text-white group-hover:scale-110 transition-transform" />
                             <div className="absolute inset-[-15px] border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                          </div>
                          <div className="space-y-6">
                             <h3 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">CERTIFIED.</h3>
                             <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[1em] font-mono leading-none">HASH_COMMIT_0x{(Math.random()*100).toFixed(0)}_FINAL</p>
                          </div>
                          <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto py-10 border-y border-white/5">
                             <div>
                                <p className="text-[10px] text-slate-700 font-black uppercase mb-1">Knowledge Yield</p>
                                <p className="text-4xl font-mono font-black text-emerald-400">+100 EAC</p>
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-700 font-black uppercase mb-1">Steward Reputation</p>
                                <p className="text-4xl font-mono font-black text-blue-400">+5% α</p>
                             </div>
                          </div>
                          <button onClick={() => setExamStep('intro')} className="px-24 py-8 bg-white/5 border-2 border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Archive</button>
                       </div>
                    )}
                 </div>
              )}

              {lmsSubTab === 'forge' && (
                 <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-10 duration-700">
                    <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-indigo-500/20 bg-black/60 shadow-3xl text-center space-y-12 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Leaf size={800} className="text-indigo-400" /></div>
                       <div className="relative z-10 space-y-10">
                          <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 animate-float group-hover:rotate-12 transition-transform">
                             <Wand2 size={48} className="text-white animate-pulse" />
                          </div>
                          <div className="space-y-4">
                             <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">Knowledge <span className="text-indigo-400">Forge.</span></h3>
                             <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed">
                                "Synthesize technical shards into master modules. High-resonance contributions earn governance multipliers."
                             </p>
                          </div>
                          <div className="max-w-2xl mx-auto space-y-8">
                             <textarea 
                                value={forgeTopic}
                                onChange={e => setForgeTopic(e.target.value)}
                                placeholder="Describe a technical topic to synthesize (e.g. m-Constant derived moisture sharding)..."
                                className="w-full bg-black/80 border-2 border-white/10 rounded-[40px] p-10 text-white text-lg font-medium italic focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none h-48 resize-none shadow-inner placeholder:text-stone-900"
                             />
                             <button 
                                onClick={handleForgeKnowledge}
                                disabled={isForging || !forgeTopic.trim()}
                                className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-30"
                             >
                                {isForging ? <Loader2 className="animate-spin mx-auto" /> : 'FORGE KNOWLEDGE SHARD'}
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}

      {/* --- VIEW: MAKE IT COMIC --- */}
      {activeTab === 'comic' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8 px-6">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Make it <span className="text-indigo-400">Comic.</span></h3>
              <p className="text-slate-500 text-lg font-medium italic opacity-70">"Generate agro-related comedy and sports content using the AgroMusika Neural Forge."</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-indigo-500/40 transition-all group flex flex-col justify-between min-h-[400px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99] cursor-pointer" onClick={() => onNavigate('multimedia_generator', null, true, { prompt: 'Create a funny stand-up comedy routine about the struggles of a modern farmer dealing with unpredictable weather and stubborn tractors.', type: 'audio', autoGenerate: true })}>
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Mic size={300} /></div>
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-indigo-400 shadow-2xl group-hover:rotate-6 transition-all">
                    <Mic size={36} />
                  </div>
                  <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                    COMEDY ROUTINE
                  </span>
                </div>
                <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors drop-shadow-2xl">Agro Stand-up</h4>
                <p className="text-slate-400 text-lg italic leading-relaxed">"Generate a hilarious audio stand-up routine about farm life."</p>
              </div>
              <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white"><Bot size={14} /></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AgroMusika Audio</span>
                </div>
                <button className="p-4 bg-white/5 rounded-full text-white hover:bg-indigo-600 transition-all shadow-xl"><ArrowRight size={20} /></button>
              </div>
            </div>

            <div className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-emerald-500/40 transition-all group flex flex-col justify-between min-h-[400px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99] cursor-pointer" onClick={() => onNavigate('multimedia_generator', null, true, { prompt: 'Create an action-packed, fast-paced sports highlight reel of a competitive tractor pulling event, with dramatic angles and intense music.', type: 'video', autoGenerate: true })}>
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Trophy size={300} /></div>
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-emerald-400 shadow-2xl group-hover:rotate-6 transition-all">
                    <Trophy size={36} />
                  </div>
                  <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    SPORTS HIGHLIGHT
                  </span>
                </div>
                <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors drop-shadow-2xl">Tractor Pulling</h4>
                <p className="text-slate-400 text-lg italic leading-relaxed">"Generate an intense video highlight reel of agro-sports."</p>
              </div>
              <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white"><VideoIcon size={14} /></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Veo 3.1 Video</span>
                </div>
                <button className="p-4 bg-white/5 rounded-full text-white hover:bg-emerald-600 transition-all shadow-xl"><ArrowRight size={20} /></button>
              </div>
            </div>
            
            <div className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-amber-500/40 transition-all group flex flex-col justify-between min-h-[400px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99] cursor-pointer" onClick={() => onNavigate('multimedia_generator', null, true, { prompt: 'Write a funny comic strip script about a scarecrow who is afraid of birds and tries to make friends with them instead.', type: 'document', autoGenerate: true })}>
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><PenTool size={300} /></div>
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-amber-400 shadow-2xl group-hover:rotate-6 transition-all">
                    <PenTool size={36} />
                  </div>
                  <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest bg-amber-500/10 text-amber-400 border-amber-500/20">
                    COMIC SCRIPT
                  </span>
                </div>
                <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-amber-400 transition-colors drop-shadow-2xl">Scarecrow Tales</h4>
                <p className="text-slate-400 text-lg italic leading-relaxed">"Generate a script for a funny agro-themed comic strip."</p>
              </div>
              <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white"><FileText size={14} /></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agro Lang Document</span>
                </div>
                <button className="p-4 bg-white/5 rounded-full text-white hover:bg-amber-600 transition-all shadow-xl"><ArrowRight size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>

      {/* --- MODAL: CREATE COLLECTIVE NODE --- */}
      {showCreateCollective && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowCreateCollective(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] shadow-[0_0_200px_rgba(0,0,0,0.9)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh] overflow-hidden">
              <div className="p-12 md:p-16 border-b border-white/5 bg-indigo-500/[0.01] flex justify-between items-center shrink-0 relative z-10 px-20">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10 group overflow-hidden relative">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <PlusCircle size={40} className="relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Found <span className="text-indigo-400">Collective</span></h3>
                       <p className="text-indigo-400/60 font-mono text-[11px] tracking-[0.6em] uppercase mt-4 italic">GUILD_INITIALIZATION_v4.2</p>
                    </div>
                 </div>
                 <button onClick={() => setShowCreateCollective(false)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-3xl"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar flex flex-col gap-12 bg-black/40 relative z-10">
                 <div className="space-y-10 animate-in slide-in-from-right-10 duration-700 flex-1">
                    <div className="space-y-6">
                       <div className="space-y-3 px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Collective Alias (Name)</label>
                          <input 
                            type="text" value={newCollName} onChange={e => setNewCollName(e.target.value)} 
                            placeholder="e.g. Nairobi Ingest Guild..." 
                            className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-stone-900 italic shadow-inner" 
                          />
                       </div>
                       <div className="space-y-3 px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Node Description / Mission</label>
                          <textarea 
                            value={newCollDesc} onChange={e => setNewCollDesc(e.target.value)} 
                            placeholder="Define the sharding focus of this collective..." 
                            className="w-full bg-black border-2 border-white/10 rounded-[40px] py-8 px-10 text-lg italic text-white focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-stone-950 shadow-inner h-32 resize-none" 
                          />
                       </div>
                       <div className="space-y-3 px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Collective Type Shard</label>
                          <div className="grid grid-cols-2 gap-3">
                             {[
                                { id: 'TECHNICAL_GUILD', label: 'Technical Guild', icon: Cpu },
                                { id: 'COOPERATIVE', label: 'Cooperative', icon: Users },
                                { id: 'INNOVATION_NODE', label: 'Innovation Node', icon: Lightbulb },
                                { id: 'HERITAGE_CLAN', label: 'Heritage Clan', icon: History }
                             ].map(t => (
                                <button 
                                   key={t.id}
                                   onClick={() => setNewCollType(t.id as any)}
                                   className={`p-6 rounded-[32px] border-2 transition-all flex items-center gap-4 ${newCollType === t.id ? 'bg-indigo-600 border-white text-white shadow-xl' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}
                                >
                                   <t.icon size={18} className={newCollType === t.id ? 'text-white' : 'text-slate-700'} />
                                   <span className="text-[10px] font-black uppercase italic">{t.label}</span>
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="p-10 bg-indigo-600/5 border-2 border-indigo-500/20 rounded-[56px] space-y-10 shadow-inner">
                       <div className="flex justify-between items-center px-4">
                          <div className="flex items-center gap-5">
                             <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-3xl animate-float"><Coins size={28} /></div>
                             <div>
                                <p className="text-[11px] text-slate-500 font-black uppercase">Initialization Fee</p>
                                <p className="text-3xl font-mono font-black text-white">250 <span className="text-base italic text-indigo-400 ml-1">EAC</span></p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[11px] text-slate-700 font-black uppercase">Node Signature</p>
                             <input 
                               type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} 
                               placeholder="EA-XXXX-XXXX"
                               className="bg-transparent border-none text-right text-3xl font-mono font-black text-indigo-500 outline-none uppercase placeholder:text-stone-950 w-full" 
                             />
                          </div>
                       </div>
                       <button 
                         onClick={handleCreateCollective}
                         disabled={!newCollName || esinSign.toUpperCase() !== user.esin.toUpperCase()}
                         className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-white/5 disabled:opacity-20"
                       >
                          <Stamp size={40} className="fill-current" /> ANCHOR COLLECTIVE SHARD
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: STEWARD DOSSIER VIEW --- */}
      {selectedStewardDossier && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowProfileView(null)}></div>
           <div className="relative z-10 w-full max-w-3xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2 overflow-hidden flex flex-col max-h-[85vh]">
              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar space-y-12">
                 <button onClick={() => setShowProfileView(null)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20 hover:rotate-90 active:scale-90 shadow-2xl"><X size={32} /></button>
                 
                 <div className="flex flex-col items-center text-center space-y-8 pt-10">
                    <div className="relative">
                       <div className="w-48 h-48 rounded-full border-8 border-indigo-500/20 overflow-hidden shadow-3xl transition-transform hover:scale-105 duration-700">
                          <img src={selectedStewardDossier.avatar} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className={`absolute bottom-2 right-2 w-10 h-10 rounded-full border-8 border-[#050706] ${selectedStewardDossier.online ? 'bg-emerald-500 shadow-[0_0_200px_#10b981]' : 'bg-slate-700'}`}></div>
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">{selectedStewardDossier.name}</h2>
                       <p className="text-indigo-400 font-mono text-xl tracking-[0.5em] uppercase opacity-80">{selectedStewardDossier.esin}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                       {selectedStewardDossier.skills.map(s => (
                          <span key={s} className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-widest italic">{s}</span>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-8 py-12 border-y border-white/5">
                    <div className="text-center group/met">
                       <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest mb-2">Resonance α</p>
                       <p className="text-7xl font-mono font-black text-white group-hover/met:text-emerald-400 transition-colors drop-shadow-2xl">{selectedStewardDossier.res}%</p>
                    </div>
                    <div className="text-center border-l border-white/5 group/met">
                       <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest mb-2">Location Hub</p>
                       <p className="text-3xl font-black text-white uppercase italic mt-4 group-hover/met:text-indigo-400 transition-colors">{selectedStewardDossier.location}</p>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-6">
                    <button 
                       onClick={() => { handleHoodRequest(selectedStewardDossier.esin); setShowProfileView(null); }}
                       className="flex-1 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-white/5"
                    >
                       INITIATE HOOK HANDSHAKE
                    </button>
                    <button 
                       onClick={() => { setShowChat(selectedStewardDossier.esin); setShowProfileView(null); }}
                       className="p-8 bg-black border-2 border-white/10 rounded-[40px] text-indigo-400 hover:text-white hover:border-indigo-500 transition-all shadow-xl"
                    >
                       <MessageCircle size={32} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: SYMMETRIC SIGNAL RELAY (MESSENGER) --- */}
      {showChat && (
        <div className="fixed bottom-10 right-10 z-[1000] w-full max-w-md animate-in slide-in-from-bottom-10 duration-500">
           <div className="glass-card rounded-[48px] border-2 border-indigo-500/40 bg-[#050706] shadow-3xl overflow-hidden flex flex-col min-h-[500px] relative">
              <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none z-0">
                 <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent absolute top-0 animate-scan"></div>
              </div>

              <div className="p-8 border-b border-white/5 bg-indigo-600/10 flex items-center justify-between shrink-0 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl relative overflow-hidden group/ico">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <MessageIcon size={28} className="group-hover:scale-110 transition-transform relative z-10" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Symmetric <span className="text-indigo-400">Relay</span></h3>
                       <p className="text-indigo-400/60 text-[8px] font-mono tracking-widest uppercase mt-2 italic">PEER: {showChat}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowChat(null)} className="p-3 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all active:scale-90"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar relative z-10 flex flex-col bg-black/40">
                 <div className="h-full flex flex-col justify-center items-center text-center space-y-8 opacity-10">
                    <Fingerprint size={100} className="text-slate-600 animate-pulse" />
                    <p className="text-xl font-black uppercase tracking-[0.4em] text-white italic">E2E_ENCRYPTION_ACTIVE</p>
                    <p className="text-[10px] text-slate-700 italic max-w-xs leading-relaxed uppercase">Signal shards are encrypted at the edge and anchored to the local node buffer.</p>
                 </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-black/95 relative z-10">
                 <div className="relative group">
                    <input 
                       type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                       placeholder="Transmit signal shard..."
                       className="w-full bg-white/[0.02] border-2 border-white/10 rounded-full py-5 px-8 text-sm text-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-stone-900 italic font-medium" 
                    />
                    <button 
                       onClick={handleChatSend}
                       className="absolute right-1.5 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 rounded-full text-white shadow-3xl hover:bg-indigo-500 transition-all active:scale-90 ring-4 ring-indigo-500/5"
                    >
                       <Send size={18} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
      `}</style>
    </div>
  );
};

const IconComponent: React.FC<{name: string, size?: number, className?: string}> = ({name, size = 18, className = ""}) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.FileCode;
  return <Icon size={size} className={className} />;
};

export default Community;
