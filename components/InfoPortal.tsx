
import React, { useState, useEffect } from 'react';
import { 
  Info, ShieldCheck, ChevronRight, Scale, BookOpen, Globe, Zap, Users, Lock, FileText,
  AlertTriangle, HeartHandshake, X, Loader2, Send, Bot, User as UserIcon, MessageSquare,
  Fingerprint, MapPin, Phone, Mail, ExternalLink, ArrowRight, Share2, Youtube, Twitter,
  Linkedin, AtSign, Pin, HelpCircle, Cloud, Wind, Facebook, MessageCircleQuestion, Eye,
  Target, Copyright, Shield, Award, CheckCircle2, BadgeCheck, Terminal,
  MessagesSquare, Copy, Check, ShieldPlus, Leaf, HelpCircle as FaqIcon,
  ChevronDown, Code, Database, Gavel, Stamp, Signature, FileSignature, ScrollText,
  Cpu, Download, Target as TargetIcon, Activity, Binary, History, Scale as ScaleIcon,
  ArrowUpRight, Building, Layers, Terminal as TerminalIcon,
  // Added missing icons to fix component crash
  Gauge, Heart, Siren
} from 'lucide-react';
import { User, ViewState } from '../types';
import { SycamoreLogo } from '../App';

interface InfoPortalProps {
  user: User;
  onNavigate: (view: ViewState, section?: string | null, pushToHistory?: boolean, params?: any) => void;
  onAcceptAll?: () => void;
  onPermanentAction: (key: string, reward: number, reason: string) => Promise<boolean>;
}

const ENVIRONMENTS = [
  { name: 'Threads', url: 'https://www.threads.com/@envirosagro', icon: AtSign, color: 'text-white', bg: 'bg-white/5', desc: 'Real-time sustainability dialogue and network pulses.' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@envirosagro?_r=1&_t=ZM-92puItTmTF6', icon: Share2, color: 'text-pink-500', bg: 'bg-pink-500/10', desc: 'Short-form regenerative field logs and robotic ingest demos.' },
  { name: 'YouTube', url: 'https://youtube.com/@envirosagro?si=JOezDZYuxRVmeplX', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Industrial documentary archive and framework deep-dives.' },
  { name: 'X / Twitter', url: 'https://x.com/EnvirosAgro', icon: Twitter, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Global network registry updates and governance signals.' },
  { name: 'Pinterest', url: 'https://pin.it/B3PuCr4Oo', icon: Pin, color: 'text-rose-600', bg: 'bg-rose-600/10', desc: 'Visual SEHTI framework guides and botanical architecture.' },
  { name: 'Quora', url: 'https://www.quora.com/profile/EnvirosAgro?ch=10&oid=2274202272&share=cee3144a&srid=3uVNlE&target_type=user', icon: HelpCircle, color: 'text-red-700', bg: 'bg-red-700/10', desc: 'Expert scientific inquiries and community logic Q&A.' },
  { name: 'Telegram', url: 'https://t.me/EnvirosAgro', icon: Send, color: 'text-sky-400', bg: 'bg-sky-400/10', desc: 'Encrypted signal hub for low-latency node alerts.' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/modern-agrarian-revolution', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-600/10', desc: 'Institutional partnerships and industrial capital bridges.' },
];

const SECURITY_SHARDS = [
  { 
    title: "SOVEREIGN NODE PROTOCOL", 
    logic: "allow write: if isOwner(stewardId);", 
    desc: "Ensures only authorized Stewards can modify their own local node biometrics. Personal data never leaves the edge." 
  },
  { 
    title: "IMMUTABLE LEDGER FINALITY", 
    logic: "allow update, delete: if false;", 
    desc: "Prevents historical revisionism. All commercial and biological shards are permanent entries in the registry." 
  },
  { 
    title: "AUDITOR QUORUM ACCESS", 
    logic: "allow write: if isAuditor();", 
    desc: "Restricts physical verification updates to verified HQ Auditor nodes for total data integrity." 
  }
];

const LEGAL_REGISTRY = [
  {
    id: 'privacy',
    title: 'Privacy & Data Sharding',
    icon: Shield,
    color: 'text-blue-400',
    content: 'EnvirosAgro utilizes Zero-Knowledge (ZK) proofs to maintain steward anonymity while proving compliance. Personal telemetry—including geofence data and bio-signatures—is encrypted at the edge. No raw data is stored outside your node; only cryptographic hashes are sharded to the global registry.'
  },
  {
    id: 'trademarks',
    title: 'Trademarks & IP',
    icon: Stamp,
    color: 'text-amber-500',
    content: 'The following are registered marks of the EnvirosAgro ecosystem: EnvirosAgro™, SEHTI™, C(a)™ (Agro Code), m™ (Time Signature), WhatIsAG™, MedicAg™, and Agroboto™. Unauthorized use of these designations within external agricultural frameworks is a violation of registry integrity.'
  },
  {
    id: 'copyright',
    title: 'Copyright Policy',
    icon: Copyright,
    color: 'text-indigo-400',
    content: 'All research papers, media shards, and botanical blueprints generated through the Forge are protected by the Open Ledger Covenant. While shared within the mesh, commercial redistribution without an EAC-based licensing handshake is prohibited. "AgroInPDF" archives are immutable copyrighted records.'
  },
  {
    id: 'consent',
    title: 'Consent Protocols',
    icon: FileSignature,
    color: 'text-emerald-400',
    content: 'Pairing a physical device or land plot constitutes explicit consent for telemetry ingest. Stewards retain the right to "Sever the Handshake," which ceases active syncing but leaves existing historical shards in the permanent archive for m-constant baseline integrity.'
  }
];

const AGREEMENT_SHARDS = [
  { 
    id: 'ZK_DATA_ETHICS', 
    title: 'Zero-Knowledge Data Ethics', 
    reward: 20, 
    icon: Binary, 
    color: 'text-blue-400', 
    desc: 'Agreement to only shard cryptographic hashes of sensitive field data, maintaining local node sovereignty.' 
  },
  { 
    id: 'M_CONSTANT_STABILITY', 
    title: 'Resilience Baseline Commitment', 
    reward: 25, 
    icon: Gauge, 
    color: 'text-indigo-400', 
    desc: 'Commitment to maintain a node m-constant above the 1.42x threshold for network stability.' 
  },
  { 
    id: 'GLEANING_RIGHTS_SYNC', 
    title: 'Industrial Gleaning Rights', 
    reward: 15, 
    icon: Heart, 
    color: 'text-rose-400', 
    desc: 'Agreement to source at least 10% of inputs from community-managed smallholder widows and orphans.' 
  },
  { 
    id: 'EMERGENCY_QUORUM_PARTICIPATION', 
    title: 'Emergency Signal Protocol', 
    reward: 10, 
    icon: Siren, 
    color: 'text-amber-500', 
    desc: 'Agreement to propagate critical regional hazard shards to neighboring nodes within the Githaka mesh.' 
  },
];

const FAQ_ITEMS = [
  { q: "What is the m-Constant?", a: "The sustainable time constant (m) measures a node's resilience against external stress. It is calculated as the square root of (Density * Intensity * Cumulative Stewardship) divided by Stress." },
  { q: "How are Carbon Credits minted?", a: "Credits are minted via Digital MRV (Monitoring, Reporting, and Verification). Visual or IoT evidence is sharded and audited by the Oracle before EAC finality." },
  { q: "What does SEHTI stand for?", a: "Societal, Environmental, Human, Technological, and Industry. These are the five thrusts that anchor the EnvirosAgro ecosystem and define its multi-ledger architecture." },
  { q: "What is a Registry Handshake?", a: "A Handshake is a ZK-verified protocol to link physical assets (land or hardware) to your digital steward node ID (ESIN), ensuring a secure 1:1 mapping." },
  { q: "Can I delete my data?", a: "While you can stop active syncing, established blockchain shards are immutable to preserve the network's historical resonance and total truth baseline." }
];

const InfoPortal: React.FC<InfoPortalProps> = ({ user, onNavigate, onAcceptAll, onPermanentAction }) => {
  const [activeSection, setActiveSection] = useState<string>('about');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSigningIndividual, setIsSigningIndividual] = useState<string | null>(null);

  const handleGenerateFAQ = () => {
    onNavigate('multimedia_generator', null, true, {
      prompt: "Generate a comprehensive FAQ for the EnvirosAgro ecosystem, covering m-Constant, SEHTI pillars, and Digital MRV protocols.",
      type: 'document'
    });
  };

  const shards = [
    { id: 'about', label: 'Institutional Bio', icon: Info, color: 'text-emerald-400' },
    { id: 'security', label: 'Security Protocols', icon: ShieldCheck, color: 'text-indigo-400' },
    { id: 'legal', label: 'Legal Statutes', icon: Gavel, color: 'text-amber-500' },
    { id: 'agreements', label: 'Node Covenant', icon: FileText, color: 'text-blue-400' },
    { id: 'environments', label: 'Mesh Nodes', icon: Share2, color: 'text-rose-400' },
    { id: 'faq', label: 'Registry FAQ', icon: FaqIcon, color: 'text-slate-400' },
    { id: 'contact', label: 'HQ Terminal', icon: Globe, color: 'text-emerald-400' },
  ];

  const handleSignAgreement = async (shard: typeof AGREEMENT_SHARDS[0]) => {
    setIsSigningIndividual(shard.id);
    const success = await onPermanentAction(shard.id, shard.reward, `AGREEMENT_SHARD_${shard.id}`);
    if (success) {
      // Local feedback via notify is handled by App.tsx through onPermanentAction
    }
    setIsSigningIndividual(null);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-3xl border-4 border-white/10 animate-float">
                <Info size={32} />
              </div>
              <div>
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">REGISTRY <span className="text-emerald-400">BIO.</span></h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.6em] mt-4 italic opacity-60">SHARD_01 // INSTITUTIONAL_ORIGIN</p>
              </div>
            </div>
            <div className="p-12 md:p-16 glass-card rounded-[80px] border-2 border-emerald-500/20 bg-emerald-600/[0.02] shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><SycamoreLogo size={600} className="text-emerald-400" /></div>
              <div className="space-y-12 relative z-10">
                <p className="text-slate-300 text-2xl md:text-4xl leading-[2.1] italic font-medium border-l-[16px] border-emerald-500 pl-12 md:pl-20 font-sans">
                  "EnvirosAgro™ is a decentralized agrarian ecosystem engineered to stabilize the global m-constant through high-fidelity biological sharding. We catalyze transformation by bridging ancestral land wisdom with cybernetic industrial logic."
                </p>
                <div className="prose prose-invert max-w-none text-slate-400 text-lg md:text-xl leading-relaxed italic pl-12 md:pl-20 opacity-80">
                  Founded on the principle of Total Truth, our mission is to eliminate informatic drift in the global supply chain. By sharding every aspect of production—from soil biometrics to market finality—we create a self-correcting grid of sustainable prosperity.
                </div>
              </div>
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 pt-20 border-t border-white/5">
                {[
                  { i: Target, t: 'Precision', c: 'Ca-Weighted', cl: 'text-blue-400', desc: 'Atomic-level stewardship' },
                  { i: Activity, t: 'Resonance', c: 'm-Constant Peak', cl: 'text-emerald-400', desc: 'Holistic system stability' },
                  { i: Binary, t: 'Integrity', c: 'ZK-Handshaked', cl: 'text-indigo-400', desc: 'Immutable data finality' },
                ].map((box, i) => (
                  <div key={i} className="p-10 bg-black/60 rounded-[48px] border border-white/10 group/box hover:border-emerald-500/40 transition-all shadow-inner text-center">
                    <div className="relative mb-8">
                       <box.i className={`w-16 h-16 ${box.cl} mx-auto group-hover/box:scale-110 transition-transform relative z-10`} />
                       <div className={`absolute inset-0 blur-3xl opacity-20 ${box.cl.replace('text', 'bg')}`}></div>
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase italic mb-2">{box.t}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">{box.c}</p>
                    <p className="text-[11px] text-slate-700 italic font-medium">"{box.desc}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'security':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shadow-3xl animate-pulse border-2 border-white/20">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">SECURITY <span className="text-indigo-400">SHARDS</span></h3>
            </div>
            <div className="grid gap-12">
              {SECURITY_SHARDS.map((shard, i) => (
                <div key={i} className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-white/5 bg-black/40 relative overflow-hidden group shadow-3xl">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform pointer-events-none">
                    <Lock size={400} className="text-indigo-500" />
                  </div>
                  <div className="flex flex-col space-y-10 relative z-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/40 text-indigo-400">
                            <Binary size={24} />
                         </div>
                         <h4 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{shard.title}</h4>
                      </div>
                      <p className="text-slate-400 text-2xl font-medium italic opacity-80 max-w-4xl leading-relaxed">"{shard.desc}"</p>
                    </div>
                    <div className="bg-black/90 rounded-[64px] p-10 md:p-16 border border-indigo-500/20 shadow-inner max-w-5xl relative overflow-hidden group/code">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/code:scale-125 transition-transform"><Database size={200} className="text-indigo-400" /></div>
                      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-5">
                           <TerminalIcon size={24} className="text-indigo-400" />
                           <span className="text-xs font-mono font-black text-indigo-400 uppercase tracking-[0.5em]">SYSTEM_CALL_v6.5 // SHARD_#{(Math.random()*100).toFixed(0)}</span>
                        </div>
                        <div className="flex gap-4">
                           <button className="p-3 bg-white/5 rounded-xl text-slate-700 hover:text-white transition-all"><Copy size={16}/></button>
                        </div>
                      </div>
                      <div className="bg-black/40 p-10 md:p-14 rounded-[48px] border border-white/5 shadow-2xl relative">
                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500/20 group-hover/code:bg-indigo-500/60 transition-all"></div>
                        <code className="text-emerald-400 font-mono text-2xl md:text-4xl block leading-relaxed selection:bg-indigo-500/30 italic">
                          {shard.logic}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'legal':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 rounded-[28px] bg-amber-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10">
                <Gavel size={32} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">LEGAL <span className="text-amber-500">REGISTRY</span></h3>
            </div>
            <div className="grid grid-cols-1 gap-12">
              {LEGAL_REGISTRY.map((law, i) => (
                <div key={i} className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-white/5 bg-black/40 shadow-3xl group hover:border-amber-500/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-[15s]"><law.icon size={400} className="text-amber-500" /></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 mb-12 gap-10 border-b border-white/5 pb-12">
                    <div className="flex items-center gap-10">
                      <div className={`w-28 h-28 rounded-[40px] bg-white/5 border border-white/10 ${law.color} shadow-inner group-hover:rotate-6 transition-all flex items-center justify-center`}>
                        <law.icon size={56} />
                      </div>
                      <div>
                        <h4 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{law.title}</h4>
                        <p className="text-[11px] text-slate-700 font-black uppercase tracking-[0.5em] mt-5 italic">STATUTE_ID: {law.id.toUpperCase()}_v6.5</p>
                      </div>
                    </div>
                    <div className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10">
                       <p className="text-[10px] text-amber-500/60 font-black uppercase tracking-widest">Shard Validity: IMMUTABLE</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <p className="text-slate-300 text-2xl md:text-4xl leading-[2.1] italic font-medium border-l-[16px] border-white/5 group-hover:border-amber-500/40 transition-all font-sans">
                      "{law.content}"
                    </p>
                  </div>
                  <div className="mt-16 pt-10 border-t border-white/5 flex justify-end relative z-10">
                     <button className="flex items-center gap-3 text-[11px] font-black text-slate-600 hover:text-amber-500 transition-all uppercase tracking-widest">
                        <Download size={18} /> Export Shard
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'agreements':
        return (
          <section className="space-y-16 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-10 px-4">
              <div className="w-16 h-16 rounded-[28px] bg-blue-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10">
                <FileText size={32} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">STEWARD <span className="text-blue-400">COVENANT</span></h3>
            </div>

            {/* Individual Agreement Shards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
               {AGREEMENT_SHARDS.map((shard) => {
                 const isSigned = user.completedActions?.includes(shard.id);
                 return (
                   <div key={shard.id} className={`p-10 glass-card rounded-[64px] border-2 transition-all group flex flex-col justify-between h-[420px] relative overflow-hidden ${isSigned ? 'border-emerald-500/30 bg-emerald-950/5' : 'border-white/5 bg-black/40 hover:border-blue-500/20'}`}>
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><shard.icon size={250} /></div>
                      <div className="space-y-6 relative z-10">
                         <div className="flex justify-between items-start">
                            <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${shard.color} shadow-inner`}>
                               <shard.icon size={32} />
                            </div>
                            {isSigned && (
                               <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shadow-xl">
                                  <BadgeCheck size={14} />
                                  <span className="text-[9px] font-black uppercase">ANCHORED</span>
                               </div>
                            )}
                         </div>
                         <h4 className="text-2xl font-black text-white uppercase italic tracking-tight m-0">{shard.title}</h4>
                         <p className="text-slate-400 text-base leading-relaxed italic opacity-80">"{shard.desc}"</p>
                      </div>
                      <div className="mt-8 pt-8 border-t border-white/5 relative z-10 flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-700 font-black uppercase">Consensus Yield</p>
                            <p className="text-2xl font-mono font-black text-white">+{shard.reward} <span className="text-xs text-blue-500">EAC</span></p>
                         </div>
                         <button 
                           onClick={() => handleSignAgreement(shard)}
                           disabled={isSigned || isSigningIndividual === shard.id}
                           className={`px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center gap-3 ${
                             isSigned ? 'bg-black text-slate-700 cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
                           }`}
                         >
                            {isSigningIndividual === shard.id ? <Loader2 size={16} className="animate-spin" /> : isSigned ? <CheckCircle2 size={16} /> : <Signature size={16} />}
                            {isSigned ? 'SHARD_SYNCED' : 'AUTHORIZE SHARD'}
                         </button>
                      </div>
                   </div>
                 );
               })}
            </div>

            <div className="p-16 md:p-24 glass-card rounded-[80px] border-4 border-double border-indigo-500/30 bg-black/60 shadow-[0_60px_150px_rgba(0,0,0,0.95)] relative overflow-hidden flex flex-col items-center text-center space-y-20 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)] pointer-events-none"></div>
              <div className="relative z-10 space-y-12">
                <div className="w-40 h-40 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_120px_rgba(99,102,241,0.5)] border-4 border-white/10 animate-float mx-auto group-hover:rotate-12 transition-transform">
                  <Fingerprint size={80} />
                </div>
                <div className="space-y-6">
                  <h4 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">MASTER <br/><span className="text-indigo-400">COVENANT.</span></h4>
                  <p className="text-slate-400 text-2xl md:text-3xl font-medium italic max-w-4xl mx-auto leading-relaxed px-10 opacity-80">
                    "Participation in the mesh constitutes acceptance of all active covenants. Informatic drift is monitored by the Quorum to ensure biological finality."
                  </p>
                </div>
              </div>
              <div className="w-full max-w-5xl p-16 md:p-20 bg-black/90 rounded-[80px] border-2 border-white/5 relative overflow-hidden shadow-inner group/text">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover/text:scale-110 transition-transform duration-[15s] pointer-events-none"><Database size={500} /></div>
                <div className="relative z-10 text-center space-y-12">
                   <p className="text-slate-200 text-2xl md:text-4xl italic leading-[2.1] font-medium font-sans">
                     "As a Node Operator, you are responsible for the uptime of your paired hardware. You agree to submit your node to 'Periodic Quorum Audits'. In exchange for maintaining mesh stability (m &gt; 1.42), you are authorized to mint EAC shards. Failure to maintain a verified m-constant below the threshold may result in temporary registry suspension."
                   </p>
                   <div className="flex items-center justify-center gap-10 pt-10 border-t border-white/5">
                      <div className="flex flex-col items-center">
                         <Stamp size={48} className="text-emerald-500 mb-2" />
                         <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Authority Lock</span>
                      </div>
                      <div className="flex flex-col items-center">
                         <Signature size={48} className="text-blue-500 mb-2" />
                         <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Biometric Shard</span>
                      </div>
                   </div>
                </div>
              </div>
              
              {!user.completedActions?.includes('ACCEPT_ALL_AGREEMENTS') ? (
                <button 
                  onClick={onAcceptAll}
                  className="w-full max-w-md py-14 bg-emerald-600 hover:bg-emerald-500 rounded-[56px] text-white font-black text-2xl uppercase tracking-[0.5em] shadow-[0_0_120px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-95 transition-all border-4 border-white/10 ring-[32px] ring-white/5 relative z-10 group/commit"
                >
                  <div className="flex items-center justify-center gap-6">
                    <CheckCircle2 size={40} className="group-hover/commit:scale-110 transition-transform" />
                    ACCEPT ALL SHARDS
                  </div>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-6 animate-in zoom-in">
                   <div className="p-8 bg-emerald-600 rounded-full shadow-[0_0_80px_rgba(16,185,129,0.5)] border-4 border-white">
                      <BadgeCheck size={64} className="text-white" />
                   </div>
                   <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em]">QUORUM_MASTER_FINALIZED</p>
                </div>
              )}
            </div>
          </section>
        );
      case 'environments':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="flex items-center gap-6 mb-10 px-4">
              <div className="w-16 h-16 rounded-[28px] bg-rose-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10">
                <Share2 size={32} />
              </div>
              <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">EXTERNAL <span className="text-rose-500">NODES</span></h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {ENVIRONMENTS.map((env, i) => (
                <a key={i} href={env.url} target="_blank" rel="noopener noreferrer" className="glass-card p-12 rounded-[64px] border border-white/5 hover:border-rose-500/40 transition-all flex flex-col group relative overflow-hidden bg-black/40 h-[480px] shadow-2xl active:scale-[0.98]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-6 mb-10 relative z-10">
                    <div className={`w-20 h-20 rounded-[32px] ${env.bg} flex items-center justify-center border border-white/10 shrink-0 group-hover:scale-110 transition-transform shadow-xl`}>
                      <env.icon size={36} className={`${env.color}`} />
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter truncate">{env.name}</h4>
                  </div>
                  <p className="text-slate-400 text-lg font-medium italic leading-relaxed flex-1 opacity-80 group-hover:opacity-100 transition-opacity">"{env.desc}"</p>
                  <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between text-[11px] font-black text-rose-400 uppercase tracking-widest relative z-10">
                    CONNECT SHARD <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      case 'faq':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700 max-w-5xl mx-auto">
            <div className="text-center space-y-6 mb-20">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
                <FaqIcon size={48} className="text-slate-500" />
              </div>
              <h3 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 drop-shadow-2xl leading-none">REGISTRY <span className="text-slate-400">FAQ.</span></h3>
              <p className="text-slate-600 text-2xl uppercase font-black tracking-[0.5em] italic opacity-60">System Protocols & Technical Guidelines</p>
              <div className="pt-8">
                <button 
                  onClick={handleGenerateFAQ}
                  className="px-10 py-5 bg-emerald-600/10 border border-emerald-500/20 rounded-full text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-600 hover:text-white transition-all shadow-xl flex items-center gap-3 mx-auto"
                >
                  <Bot size={16} /> AUTO-GENERATE UPDATED FAQ
                </button>
              </div>
            </div>
            <div className="space-y-6 px-4">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="glass-card rounded-[56px] border-2 border-white/5 overflow-hidden transition-all group hover:border-emerald-500/20 bg-black/20 shadow-2xl">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-12 md:p-14 flex items-center justify-between hover:bg-white/[0.02] transition-all text-left gap-8"
                  >
                    <span className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tight leading-tight">{item.q}</span>
                    <div className={`p-6 rounded-full bg-white/5 transition-all duration-500 flex items-center justify-center shrink-0 border border-white/5 ${openFaq === i ? 'rotate-180 bg-emerald-600 text-white shadow-xl' : 'text-slate-700 group-hover:text-white'}`}>
                      <ChevronDown size={32} />
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="p-12 md:p-14 pt-0 border-t border-white/5 animate-in slide-in-from-top-4 duration-500 bg-white/[0.01]">
                      <p className="text-2xl md:text-3xl text-slate-400 leading-[1.8] italic font-medium border-l-[12px] border-emerald-500/40 pl-12 font-sans max-w-4xl">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case 'contact':
        return (
          <section className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="text-center space-y-6 mb-20">
              <h2 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">HQ <span className="text-emerald-400">NODES.</span></h2>
              <p className="text-slate-500 text-3xl italic font-medium opacity-80">Physical and digital touchpoints for the global registry core.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
              {[
                { i: MapPin, t: 'Headquarters', c: '9X6C+P6, Kiriaini', sub: 'Global Zone Node', cl: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { i: Phone, t: 'Technical Signal', c: '0740 161 447', sub: 'Registry Direct', cl: 'text-blue-400', bg: 'bg-blue-500/10' },
                { i: Mail, t: 'Archive Ingest', c: 'envirosagro.com@gmail.com', sub: 'Official Shard Ingest', cl: 'text-indigo-400', bg: 'bg-indigo-500/10' },
              ].map((box, i) => (
                <div key={i} className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/60 space-y-10 hover:border-white/10 transition-all group shadow-3xl text-center relative overflow-hidden min-h-[480px] flex flex-col justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent"></div>
                  <div className={`w-28 h-28 rounded-[44px] ${box.bg} border-2 border-white/5 flex items-center justify-center mx-auto shadow-2xl group-hover:rotate-6 transition-all duration-700 relative z-10`}>
                    <box.i size={56} className={`${box.cl}`} />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <h4 className="text-[14px] font-black text-slate-500 uppercase tracking-0.6em italic leading-none">{box.t}</h4>
                    <p className="text-slate-100 text-2xl md:text-3xl font-mono font-black truncate leading-tight group-hover:text-emerald-400 transition-colors">{box.c}</p>
                    <div className="pt-6">
                       <span className="px-6 py-2 bg-white/5 rounded-full text-[11px] font-black uppercase text-slate-700 tracking-[0.3em] border border-white/5 shadow-inner">{box.sub}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-20 flex justify-center">
               <div className="p-12 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-950/5 flex flex-col items-center gap-8 shadow-3xl max-w-3xl w-full">
                  <div className="flex items-center gap-6">
                     <Bot className="text-indigo-400 w-12 h-12" />
                     <h5 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Inquiry Shard</h5>
                  </div>
                  <p className="text-slate-400 text-xl font-medium italic text-center leading-relaxed">
                     "Steward feedback strengthens node resonance. Synchronize your inquiries with our support oracle."
                  </p>
                  <button onClick={() => onNavigate('crm')} className="px-16 py-8 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-2 border-white/10 ring-8 ring-indigo-500/5">
                     INITIALIZE SUPPORT LINK <ArrowRight size={24} />
                  </button>
               </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in duration-700 max-w-[1700px] mx-auto pb-40 relative px-4">
      
      {/* Background Decor FX */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01]">
         <div className="w-full h-[1px] bg-emerald-500/20 absolute top-0 animate-scan"></div>
      </div>

      {/* 1. STICKY NAVIGATOR SHARD */}
      <aside className="lg:w-96 shrink-0 z-40">
        <div className="sticky top-28 space-y-10">
           <div className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 space-y-10 shadow-3xl">
              <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                 <div className="p-5 bg-emerald-600 rounded-3xl shadow-3xl border-2 border-white/20">
                    <SycamoreLogo size={32} className="text-white" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-widest italic leading-tight">Registry <br/> Matrix</h3>
                 </div>
              </div>
              <nav className="space-y-2">
                 {shards.map((shard) => (
                    <button
                       key={shard.id}
                       onClick={() => setActiveSection(shard.id)}
                       className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all group ${
                          activeSection === shard.id 
                             ? 'bg-white text-black shadow-3xl scale-105 border-2 border-emerald-500/20' 
                             : 'text-slate-600 hover:text-white hover:bg-white/5'
                       }`}
                    >
                       <div className="flex items-center gap-5">
                          <shard.icon size={20} className={activeSection === shard.id ? 'text-black' : shard.color} />
                          <span className="text-11px font-black uppercase tracking-[0.3em]">{shard.label}</span>
                       </div>
                       {activeSection === shard.id && <ChevronRight size={18} className="animate-pulse" />}
                    </button>
                 ))}
              </nav>
              <div className="pt-8 border-t border-white/5 space-y-6">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-700 tracking-widest">
                    <span>Registry Depth</span>
                    <span className="text-emerald-400 font-mono">100% α</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]" style={{ width: '100%' }}></div>
                 </div>
              </div>
           </div>

           <div className="p-10 glass-card rounded-[56px] border border-blue-500/20 bg-blue-500/5 space-y-6 shadow-xl group">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-400 group-hover:rotate-12 transition-transform shadow-inner"><Info size={24} /></div>
                 <h4 className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic">Truth Protocol</h4>
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed uppercase tracking-widest italic opacity-80 group-hover:opacity-100 transition-opacity">
                 "Every shard in this registry is verified by the root node consensus and anchored in the Layer-3 industrial ledger for absolute finality."
              </p>
           </div>
        </div>
      </aside>

      {/* 2. MASTER LEDGER CONTENT - RENDERED PAGE BY PAGE */}
      <main className="flex-1 min-h-[900px] pt-4 relative z-10">
        {renderSection()}
      </main>

      <style>{`
        .shadow-3xl { box-shadow: 0 60px 150px -40px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default InfoPortal;
