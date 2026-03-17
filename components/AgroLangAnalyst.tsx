import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User as UserIcon, Loader2, BarChart2, ShieldCheck, Info, TrendingUp, 
  Globe, ExternalLink, Trash2, Terminal, Cable, Activity, Database, Zap, 
  ShieldPlus, Workflow, SmartphoneNfc, Radio, CheckCircle2, ChevronRight,
  Code2, Share2, Network, Binary, ArrowRight, ArrowUpRight, Cpu,
  Settings, Play, Copy, Maximize2, Target, History,
  LayoutGrid, ClipboardCheck, Briefcase, Landmark, Sprout,
  // Added missing icons for blueprint evaluation
  Coins, Microscope, Scan, Users, PawPrint, Leaf, Brain, ShoppingBag, Lightbulb, Trees, Layers, Stamp,
  FileSearch, ClipboardList, ShieldAlert
} from 'lucide-react';
import { chatWithAgroLang, analyzeSustainability, AgroLangResponse } from '../services/agroLangService';
import { User as AgroUser, ViewState, SignalShard } from '../types';
import { SycamoreLogo } from '../App';

interface AgroLangAnalystProps {
  user: AgroUser;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
  onNavigate: (view: ViewState, section?: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
  suggestedShards?: ViewState[];
}

const TUNNELLING_AGROLANG = `// Initiate Registry Handshake for Asset Verification
HANDSHAKE(asset_id: "VIN_9920", type: "Tractor_Unit_01")

// Establish direct link through the Tunnelling Hub
TUNNEL link(source: AgroLang_Terminal, destination: Field_Controller_A) {
    SET protocol: "Encrypted_Direct"
    ANCHOR task: "Variable_Rate_Fertilization"
}

// Logic for Automated Sourcing and Bidding
IF analysis.trend == "Soil_Nitrogen_Low" {
    TRIGGER sourcing.bid(item: "Organic_NPK", hub: "Regional_Supply_Tunnel")
    EXECUTE smart_contract(provider: "AgroSupply_Co", auto_sign: TRUE)
}

// Real-time Evidence Ingest
INGEST livestream.terminal() -> destination.audit_vault(tag: "Live_Verification")`;

const SHARD_DIRECTORY: { id: ViewState; label: string; icon: any; keywords: string[] }[] = [
  { id: 'wallet', label: 'Treasury Node', icon: Coins, keywords: ['money', 'eac', 'balance', 'swap', 'deposit', 'withdraw', 'earn', 'wallet', 'token'] },
  { id: 'economy', label: 'Market Cloud', icon: Globe, keywords: ['buy', 'sell', 'seeds', 'marketplace', 'vendor', 'products', 'procurement', 'price', 'commerce'] },
  { id: 'intelligence', label: 'Science Oracle', icon: Microscope, keywords: ['science', 'research', 'data', 'telemetry', 'iot', 'sensors', 'analysis', 'results', 'diagnose'] },
  { id: 'impact', label: 'Network Impact', icon: TrendingUp, keywords: ['carbon', 'sustainability', 'footprint', 'mitigation', 'impact', 'credits', 'm-constant', 'sdg'] },
  { id: 'digital_mrv', label: 'Digital MRV', icon: Scan, keywords: ['verify', 'proof', 'evidence', 'satellite', 'verification', 'audit', 'land', 'mrv'] },
  { id: 'community', label: 'Steward Hub', icon: Users, keywords: ['people', 'chat', 'social', 'group', 'guild', 'community', 'learning', 'lms', 'forum'] },
  { id: 'farm_os', label: 'Farm OS', icon: Binary, keywords: ['code', 'kernel', 'os', 'system', 'terminal', 'logic', 'automate', 'wrangler', 'npx'] },
  { id: 'agrowild', label: 'Agrowild', icon: PawPrint, keywords: ['wild', 'animals', 'tourism', 'safari', 'nature', 'conservancy', 'biodiversity'] },
  { id: 'sustainability', label: 'Sustainability Shard', icon: Leaf, keywords: ['carbon', 'footprint', 'equilibrium', 'omega'] },
];

const BLUEPRINT_AUDIT_GROUPS = [
  { label: 'CORE AGRO', sync: 100, shards: 6, points: ['Farm Management', 'Crop Tracking', 'Supply Verification', 'Marketplace', 'Treasury', 'Sustainable Practices'], icon: Sprout, col: 'text-emerald-400' },
  { label: 'INTELLIGENCE', sync: 100, shards: 4, points: ['Crop Analysis', 'Market Trends', 'Analytics Platform', 'Digital MRV'], icon: SycamoreLogo, col: 'text-blue-400' },
  { label: 'BLOCKCHAIN', sync: 98, shards: 4, points: ['Smart Contracts', 'Genetic NFTs', 'Handshake Protocol', 'Ledger Explorer'], icon: Database, col: 'text-indigo-400' },
  { label: 'COMMUNITY', sync: 100, shards: 4, points: ['Farmer Forums', 'Network Ingest', 'Nexus CRM', 'Live Updates'], icon: Users, col: 'text-rose-400' },
  { label: 'COMMERCE', sync: 94, shards: 4, points: ['Contract Farming', 'Vendor Portal', 'EnvirosAgro Store', 'Marketplace Sync'], icon: ShoppingBag, col: 'text-amber-500' },
  { label: 'BUSINESS BI', sync: 100, shards: 3, points: ['Income Tracking', 'Investment Portal', 'Value Enhancement'], icon: Briefcase, col: 'text-teal-400' },
  { label: 'INNOVATION', sync: 100, shards: 3, points: ['Biotech Integration', 'Innovation Hub', 'Genetic Decoder'], icon: Lightbulb, col: 'text-fuchsia-400' },
  { label: 'SPECIALTY', sync: 100, shards: 4, points: ['Permaculture Design', 'CEA Greenhouse', 'Online Garden', 'Agrowild Cons.'], icon: Trees, col: 'text-emerald-600' },
  { label: 'DATA', sync: 100, shards: 4, points: ['Media Hub', 'Media Ledger', 'Evidence Vault', 'Info Portal'], icon: Layers, col: 'text-sky-400' },
  { label: 'SYSTEM MGMT', sync: 100, shards: 5, points: ['Dash Hub', 'Settings', 'Identity Card', 'UserProfile', 'Intranet'], icon: Settings, col: 'text-slate-400' },
  { label: 'EMERGENCY', sync: 100, shards: 3, points: ['Emergency SOS', 'Floating Consultant', 'Voice Bridge'], icon: Radio, col: 'text-rose-600' },
  { label: 'QUALITY', sync: 100, shards: 4, points: ['TQM Grid', 'Chroma System', 'Circular Grid', 'Code of Laws'], icon: ClipboardCheck, col: 'text-indigo-600' },
];

const AgroLangAnalyst: React.FC<AgroLangAnalystProps> = ({ user, onEmitSignal, onNavigate }) => {
  const [activeMode, setActiveMode] = useState<'neural' | 'tunnelling' | 'status'>('neural');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Greetings Steward ${user.name}. I am the primary Agro Lang Analyst for Node ${user.esin}. My systems are currently synchronized with the 60-shard architecture. How can I facilitate your agricultural finality today?` }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  
  // Tunnelling Hub States
  const [tunnelProgress, setTunnelProgress] = useState(0);
  const [tunnelStatus, setTunnelStatus] = useState('IDLE');
  const [tunnelLogs, setTunnelLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [confidenceAnalysis, setConfidenceAnalysis] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, tunnelLogs]);

  const handleSend = async () => {
    if (!input.trim() || isAnalyzing) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAnalyzing(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    try {
      const response = await chatWithAgroLang(userMessage, history, useSearch);
      
      const textToScan = (userMessage + " " + response.text).toLowerCase();
      const suggested = SHARD_DIRECTORY.filter(shard => 
        shard.keywords.some(k => textToScan.includes(k))
      ).map(s => s.id);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text,
        sources: response.sources,
        suggestedShards: suggested.length > 0 ? suggested : undefined
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I am having trouble handshaking with the global registry. Please check your node connectivity." 
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateTunnelProcess = async () => {
    setIsSimulating(true);
    setTunnelProgress(0);
    setTunnelStatus('INGESTING');
    setConfidenceAnalysis(null);
    setTunnelLogs([`[INIT] Tunnelling Protocol v1.42 engaged for Node ${user.esin}.`, "[INGEST] Loading soil maps and NDVI imagery shards..."]);

    const steps = [
      { p: 25, s: 'VERIFYING', l: "[VERIFY] Optimizing code for local node. Calculating outcome confidence..." },
      { p: 50, s: 'TUNNELLING', l: "[TUNNEL] Anchoring task: Variable_Rate_Fertilization. Creating encrypted direct link..." },
      { p: 75, s: 'DEPLOYING', l: "[DEPLOY] Broadcasting command to Regional_Supply_Tunnel smart contract." },
      { p: 100, s: 'FINALIZED', l: `[SUCCESS] Finality reached. Shard anchored to node ${user.esin} registry.` }
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 1500));
      setTunnelProgress(step.p);
      setTunnelStatus(step.s);
      setTunnelLogs(prev => [...prev, step.l]);
    }

    setConfidenceAnalysis(98.4);
    setIsSimulating(false);
    
    onEmitSignal({
      type: 'ledger_anchor',
      origin: 'ORACLE',
      title: 'TUNNEL_FINALITY_REACHED',
      message: `Agro Lang Analyst successfully sharded a tunnelling protocol for node ${user.esin}. Confidence: 98.4%.`,
      priority: 'high',
      actionIcon: 'Zap'
    });
  };

  const handleQuickAnalysis = () => {
    onNavigate('sustainability');
  };

  const handleSoilCheck = () => {
    onNavigate('intelligence', 'telemetry');
  };

  const clearHistory = () => {
    if (confirm("ARCHIVE_COMMAND: Permanent deletion of current session shards. Proceed?")) {
      setMessages([{ role: 'assistant', content: 'Session sharded and cleared. Initializing new ingest cycle...' }]);
      setTunnelLogs([]);
      setTunnelProgress(0);
      setTunnelStatus('IDLE');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)] animate-in fade-in duration-700">
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 space-y-4 h-full flex flex-col">
        <div className="glass-card p-6 rounded-[32px] border-white/5 bg-black/40 flex-1 space-y-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-900/40"><SycamoreLogo size={24} className="text-white" /></div>
            <h3 className="font-black text-white uppercase italic tracking-widest">Agro Lang</h3>
          </div>
          
          <div className="space-y-2 flex-1">
            <button 
              onClick={() => setActiveMode('neural')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'neural' ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
            >
              <SycamoreLogo size={16} />
              Agro Lang
            </button>
            <button 
              onClick={() => setActiveMode('tunnelling')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'tunnelling' ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
            >
              <Cable className="w-4 h-4" />
              Tunnelling Hub
            </button>
            <button 
              onClick={() => setActiveMode('status')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'status' ? 'bg-amber-600 text-white shadow-xl' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
            >
              <ClipboardCheck className="w-4 h-4" />
              System Sync Audit
            </button>
            
            <div className="h-px bg-white/5 my-4"></div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between mb-2 hover:border-indigo-500/40 transition-all group">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Search</span>
              </div>
              <button 
                onClick={() => setUseSearch(!useSearch)}
                className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${useSearch ? 'bg-emerald-600' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-xl ${useSearch ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <button 
              onClick={handleQuickAnalysis}
              className="w-full flex items-center gap-4 p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95"
            >
              <BarChart2 className="w-4 h-4" />
              Sustainability Audit
            </button>
            <button 
              onClick={handleSoilCheck}
              className="w-full flex items-center gap-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Soil Health
            </button>
          </div>

          <div className="pt-8 border-t border-white/5 space-y-4">
            <h4 className="text-[9px] font-black text-slate-700 uppercase mb-4 tracking-[0.4em]">Active Node Context</h4>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-black text-[10px] uppercase italic">Node {user.esin}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              </div>
              <p className="text-[9px] text-slate-600 font-mono uppercase">{user.role} - {user.location.split(',')[0]}</p>
            </div>
            <button onClick={clearHistory} className="w-full flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-rose-600/10 hover:text-rose-500 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">
              <Trash2 className="w-4 h-4" />
              Clear Shards
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3 glass-card rounded-[48px] flex flex-col h-full overflow-hidden relative border-2 border-white/5 bg-[#050706] shadow-3xl">
        
        {activeMode === 'neural' ? (
          <>
            <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 agro-gradient rounded-3xl flex items-center justify-center shadow-xl group">
                  <SycamoreLogo size={32} className="text-white group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-widest m-0 leading-none">EA Neural Analyst</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="px-3 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">EOS_CORE_STABLE</div>
                    <span className="text-[8px] text-slate-600 uppercase tracking-widest font-mono italic">
                      {useSearch ? 'GROUNDED_MODE' : 'KERNEL_ONLY'}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => onNavigate('settings')} className="p-4 bg-white/5 rounded-2xl text-slate-700 hover:text-white transition-all"><Settings size={20} /></button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scroll-smooth custom-scrollbar"
            >
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`flex flex-col gap-4 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border shadow-xl ${m.role === 'user' ? 'bg-indigo-600 border-indigo-400' : 'bg-black border-white/10'}`}>
                        {m.role === 'user' ? <UserIcon className="w-5 h-5 text-white" /> : <SycamoreLogo size={24} className="text-emerald-400" />}
                      </div>
                      <div className={`p-8 rounded-[40px] text-lg leading-relaxed shadow-2xl relative overflow-hidden ${
                        m.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none border-t-4 border-indigo-400' 
                          : 'bg-black/60 text-slate-200 border border-white/5 rounded-tl-none prose prose-invert border-l-4 border-l-emerald-500 italic font-medium'
                      }`}>
                        {m.role === 'assistant' && <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none"><SycamoreLogo size={100} /></div>}
                        {m.content.split('\n').map((line, i) => (
                          <p key={i} className={i > 0 ? 'mt-4' : ''}>{line}</p>
                        ))}
                      </div>
                    </div>
                    
                    {m.suggestedShards && m.suggestedShards.length > 0 && (
                      <div className="flex flex-wrap gap-3 ml-16 mt-4 animate-in fade-in slide-in-from-left-2 duration-500">
                         {m.suggestedShards.map(shardId => {
                            const shard = SHARD_DIRECTORY.find(s => s.id === shardId);
                            if (!shard) return null;
                            return (
                               <button 
                                  key={shardId}
                                  onClick={() => onNavigate(shardId)}
                                  className="px-5 py-2.5 bg-indigo-900/20 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-xl"
                               >
                                  <shard.icon size={14} /> {shard.label} <ArrowUpRight size={12} />
                               </button>
                            );
                         })}
                      </div>
                    )}

                    {m.sources && m.sources.length > 0 && (
                      <div className="flex flex-wrap gap-3 ml-16 mt-2">
                        {m.sources.map((source, sIdx) => (
                          <a 
                            key={sIdx} 
                            href={source.web?.uri || source.maps?.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-2 bg-indigo-900/20 border border-indigo-500/20 rounded-xl text-[9px] font-black text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {source.web?.title?.substring(0, 20) || "Registry Shard"}...
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex justify-start animate-in fade-in">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 shrink-0 rounded-2xl bg-black border border-white/5 flex items-center justify-center animate-pulse">
                      <SycamoreLogo size={24} className="text-emerald-400" />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl rounded-tl-none flex items-center gap-4">
                      <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse italic">Sequencing EA Response...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-black/95">
              <div className="relative group max-w-5xl mx-auto">
                <input 
                  type="text"
                  placeholder="Query the mesh for industrial patterns..."
                  className="w-full bg-white/[0.01] border-2 border-white/5 rounded-[32px] py-8 pl-10 pr-24 text-xl text-white focus:outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all font-medium italic placeholder:text-stone-900 shadow-inner"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={isAnalyzing || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-6 bg-indigo-600 rounded-[24px] text-white shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:bg-indigo-500 transition-all disabled:opacity-20 active:scale-90"
                >
                  <Send className="w-8 h-8" />
                </button>
              </div>
            </div>
          </>
        ) : activeMode === 'tunnelling' ? (
          <div className="flex flex-col h-full animate-in zoom-in-95 duration-500">
            {/* Tunnelling Hub Header */}
            <div className="p-8 border-b border-indigo-500/20 bg-indigo-950/10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl group relative overflow-hidden">
                  <Cable size={32} className="text-white relative z-10 animate-float" />
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-widest m-0 leading-none">Tunnelling Hub</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="px-3 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest">SECURE_BRIDGE_ACTIVE</div>
                    <span className="text-[8px] text-slate-600 uppercase tracking-widest font-mono italic">ZK_DIRECT_PROTOCOL</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end mr-4">
                   <p className="text-[8px] text-slate-700 font-black uppercase">Tunnel Affinity</p>
                   <p className="text-sm font-mono font-black text-indigo-400">{(tunnelProgress > 0 ? 0.98 : 0.00).toFixed(2)}α</p>
                 </div>
                 <button onClick={() => onNavigate('settings')} className="p-4 bg-white/5 rounded-2xl text-slate-700 hover:text-white transition-all"><Settings size={20} /></button>
              </div>
            </div>

            {/* Main Operational Panel */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Tunnelling Pipeline Visual */}
              <div className="w-full md:w-80 border-r border-white/5 bg-black/40 p-8 flex flex-col justify-between">
                 <div className="space-y-8">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest px-2">Operational Pipeline</p>
                    <div className="space-y-12 relative px-2">
                       <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-indigo-500/10"></div>
                       {[
                         { id: 'INGEST', label: '1. Ingest', icon: Database, p: 25 },
                         { id: 'VERIFY', label: '2. Verify', icon: ShieldCheck, p: 50 },
                         { id: 'TUNNEL', label: '3. Tunnel', icon: Cable, p: 75 },
                         { id: 'DEPLOY', label: '4. Deploy', icon: Zap, p: 100 },
                       ].map((step, i) => (
                         <div key={step.id} className={`flex items-center gap-6 relative z-10 transition-all duration-700 ${tunnelProgress >= step.p ? 'opacity-100 translate-x-1' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xl border ${tunnelProgress >= step.p ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black border-white/10 text-slate-700'}`}>
                               <step.icon size={14} />
                            </div>
                            <span className="text-10px font-black uppercase tracking-widest">{step.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-indigo-900/10 rounded-[32px] border border-indigo-500/20 space-y-4 shadow-xl">
                       <div className="flex items-center gap-3">
                          <Activity size={14} className="text-indigo-400 animate-pulse" />
                          <h4 className="text-[9px] font-black text-white uppercase tracking-widest">Tunnel Health</h4>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-indigo-500 shadow-[0_0_100px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${tunnelProgress}%` }}></div>
                       </div>
                       <p className="text-[8px] text-slate-600 font-mono uppercase text-center tracking-widest">{tunnelStatus}_MODE</p>
                    </div>
                    <button 
                      onClick={simulateTunnelProcess}
                      disabled={isSimulating}
                      className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 border border-white/10"
                    >
                       {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                       <span className="ml-2">Initialize Shard</span>
                    </button>
                 </div>
              </div>

              {/* Sharding Environment */}
              <div className="flex-1 p-8 flex flex-col gap-8 bg-black/20 overflow-y-auto custom-scrollbar">
                 {/* Agrolang Editor Area */}
                 <div className="glass-card rounded-[40px] border border-white/5 bg-[#050706] flex flex-col shadow-2xl relative overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-10">
                       <div className="flex items-center gap-4">
                          <Code2 className="w-4 h-4 text-indigo-400" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agrolang Shard: Tunnelling_Protocol.al</span>
                       </div>
                       <div className="flex gap-4">
                          <button className="p-2 text-slate-700 hover:text-white transition-colors"><Copy size={14}/></button>
                          <button className="p-2 text-slate-700 hover:text-white transition-colors"><Maximize2 size={14}/></button>
                       </div>
                    </div>
                    <div className="p-10 font-mono text-sm leading-loose italic bg-black/40 overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.01] group-hover:scale-110 transition-transform duration-[20s]"><Binary size={400} /></div>
                       <pre className="text-indigo-400/90 whitespace-pre-wrap select-all selection:bg-indigo-500/20">{TUNNELLING_AGROLANG}</pre>
                    </div>
                    <div className="p-6 border-t border-white/5 bg-black/80 flex items-center justify-between px-10">
                       <span className="text-[8px] font-mono text-slate-800 uppercase italic tracking-widest">SHA256: 0x882A_TUNNEL_LOGIC</span>
                       <button onClick={simulateTunnelProcess} className="text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all">
                          <Terminal size={14} /> Execute Shard
                       </button>
                    </div>
                 </div>

                 {/* Console / Feedback Loop Area */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40 flex flex-col h-[400px] shadow-xl overflow-hidden relative group">
                       <div className="absolute inset-0 bg-indigo-500/[0.01] animate-scan pointer-events-none"></div>
                       <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4 relative z-10 px-2">
                          <History className="w-4 h-4 text-slate-500" />
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Feedback_Loop_Ingest</h4>
                       </div>
                       <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-4 pr-2 relative z-10 scroll-smooth">
                          {tunnelLogs.length === 0 ? (
                             <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
                                <Terminal size={40} />
                                <p className="text-[8px] uppercase font-black">Awaiting Ingest...</p>
                             </div>
                          ) : (
                             tunnelLogs.map((log, i) => (
                                <div key={i} className="flex gap-4 p-3 rounded-2xl hover:bg-white/[0.02] transition-all group/log animate-in slide-in-from-left-2">
                                   <span className="text-slate-800 shrink-0 select-none">{">>>"}</span>
                                   <span className={log.includes('SUCCESS') || log.includes('FINALIZED') ? 'text-emerald-400 font-bold' : 'text-slate-400 italic'}>{log}</span>
                                </div>
                             ))
                          )}
                          {isSimulating && (
                             <div className="flex items-center gap-3 p-3 text-indigo-400 animate-pulse">
                                <Loader2 size={12} className="animate-spin" />
                                <span className="text-[10px] font-black uppercase">Tunnelling_Direct_Link...</span>
                             </div>
                          )}
                       </div>
                    </div>

                    <div className="flex flex-col gap-6">
                       <div className="glass-card p-10 rounded-[48px] border border-indigo-500/20 bg-indigo-950/10 flex-1 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group shadow-2xl">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><SycamoreLogo size={250} className="text-indigo-400" /></div>
                          <div className="relative">
                             <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white shadow-3xl animate-float border-2 border-white/10">
                                {confidenceAnalysis ? <CheckCircle2 size={40} /> : <SycamoreLogo size={40} className="animate-pulse" />}
                             </div>
                             <div className="absolute inset-[-10px] border-2 border-dashed border-indigo-400/20 rounded-[36px] animate-spin-slow"></div>
                          </div>
                          <div className="space-y-3 relative z-10">
                             <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Confidence <span className="text-indigo-400">Analysis</span></h5>
                             <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest italic opacity-80">"Predictive Trend Mapping"</p>
                          </div>
                          {confidenceAnalysis ? (
                            <div className="animate-in zoom-in duration-500 space-y-2">
                               <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">{confidenceAnalysis}%</p>
                               <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em] shadow-inner">REGISTRY_CONSENSUS_REACHED</div>
                            </div>
                          ) : (
                             <p className="text-slate-600 text-xs italic font-medium max-w-xs leading-relaxed">
                               "Waiting for tunnel sharding to calculate the delta between predicted trend and live inflow data."
                             </p>
                          )}
                       </div>
                       
                       <div className="p-8 glass-card rounded-[40px] border border-white/5 bg-black/60 flex items-center justify-between shadow-xl group hover:border-white/10 transition-all">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:rotate-12 transition-transform shadow-inner"><Target size={24} className="text-indigo-400" /></div>
                             <div className="text-left">
                                <h6 className="text-sm font-black text-white uppercase italic leading-none">Optimization Engine</h6>
                                <p className="text-[9px] text-slate-500 font-medium italic mt-2 opacity-80 group-hover:opacity-100">"All supply chain routes nominal. 0 bottlenecks detected."</p>
                             </div>
                          </div>
                          <button onClick={() => onNavigate('economy')} className="p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-90"><ArrowUpRight size={20}/></button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in zoom-in-95 duration-500 p-8 md:p-12 overflow-y-auto custom-scrollbar">
             <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                <div className="space-y-4">
                   <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">System <span className="text-emerald-400">Sync Status</span></h2>
                   <p className="text-slate-500 text-xl font-medium italic">Evaluating the 60-shard industrial architecture synchronization.</p>
                </div>
                <div className="flex gap-4">
                   <div className="p-8 glass-card rounded-[40px] border border-emerald-500/20 bg-emerald-500/5 text-center shadow-xl">
                      <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2">SHARD_COVERAGE</p>
                      <p className="text-6xl font-mono font-black text-white">60<span className="text-xl text-emerald-800 ml-1">/60</span></p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {BLUEPRINT_AUDIT_GROUPS.map((shardGroup, i) => (
                  <div key={i} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 hover:border-emerald-500/20 transition-all group flex flex-col justify-between h-[380px]">
                     <div className="flex justify-between items-start">
                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:rotate-6 transition-transform ${shardGroup.col}`}>
                           <shardGroup.icon size={24} />
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-slate-700 font-black uppercase">Shard Count</p>
                           <p className="text-xl font-mono font-black text-white">{shardGroup.shards}</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-xl font-black text-white uppercase italic tracking-widest">{shardGroup.label}</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                           {shardGroup.points.map(pt => (
                             <span key={pt} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[7px] font-black uppercase text-slate-500">{pt}</span>
                           ))}
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-[8px] font-black uppercase text-slate-600">
                              <span>Sync Fidelity</span>
                              <span className={shardGroup.col}>{shardGroup.sync}%</span>
                           </div>
                           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${shardGroup.col.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${shardGroup.sync}%` }}></div>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-16 p-12 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl">
                <div className="flex items-center gap-10">
                   <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white shadow-3xl animate-pulse">
                      <Stamp size={40} />
                   </div>
                   <div className="space-y-4 text-left">
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Evaluation Verified</h4>
                      <p className="text-slate-400 text-lg italic leading-relaxed max-w-2xl font-medium">
                        "The current system state is fully synchronized with the 60-shard blueprint. All core agricultural, intelligence, and blockchain protocols are live."
                      </p>
                   </div>
                </div>
                <button onClick={() => onNavigate('sitemap')} className="px-12 py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-2 border-white/10">
                   EXPLORE MATRIX <Maximize2 size={20} />
                </button>
             </div>
          </div>
        )}

        <div className="p-8 border-t border-white/5 bg-black/95">
           <div className="flex justify-between items-center px-10">
              <div className="flex items-center gap-4">
                 <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_100px_currentColor]`}></div>
                 <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">
                   {activeMode === 'neural' ? 'NEURAL_LINK_STABLE' : activeMode === 'tunnelling' ? 'TUNNEL_CONDUIT_STABLE' : 'SYSTEM_EVALUATION_ACTIVE'}
                 </span>
              </div>
              <p className="text-[9px] text-slate-800 font-mono italic">EOS_ANALYST_v6.5 // HANDSHAKE_#{(Math.random()*100).toFixed(0)}</p>
           </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .custom-scrollbar-editor::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-editor::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default AgroLangAnalyst;