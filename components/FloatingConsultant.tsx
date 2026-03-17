import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bot, 
  X, 
  Minus, 
  Maximize2, 
  Minimize2,
  Send, 
  Loader2, 
  Leaf, 
  ShieldCheck, 
  Zap, 
  Info, 
  GripVertical,
  Maximize,
  ArrowRight,
  Target,
  ExternalLink,
  ChevronRight,
  Brain,
  Link2,
  Waves
} from 'lucide-react';
import { chatWithAgroLang } from '../services/agroLangService';
import { User, ViewState } from '../types';
import { SycamoreLogo } from '../App';

interface FloatingConsultantProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onNavigate: (view: ViewState) => void;
}

const WHAT_IS_AG_DEFINITION = 'Agriculture is an application of art or science from nature by human beings towards natural resources such as Animals, plants, water, soil and air for sustainability.';

const SHARD_DIRECTORY = [
  { id: 'wallet', label: 'Treasury Node', keywords: ['money', 'eac', 'balance', 'swap', 'deposit', 'withdraw', 'earn', 'wallet'] },
  { id: 'economy', label: 'Market Cloud', keywords: ['buy', 'sell', 'seeds', 'marketplace', 'vendor', 'products', 'procurement', 'price'] },
  { id: 'intelligence', label: 'Science Oracle', keywords: ['science', 'research', 'data', 'telemetry', 'iot', 'sensors', 'analysis', 'results'] },
  { id: 'impact', label: 'Network Impact', keywords: ['carbon', 'sustainability', 'footprint', 'mitigation', 'impact', 'credits', 'm-constant'] },
  { id: 'digital_mrv', label: 'Digital MRV', keywords: ['verify', 'proof', 'evidence', 'satellite', 'verification', 'audit', 'land'] },
  { id: 'community', label: 'Steward Hub', keywords: ['people', 'chat', 'social', 'group', 'guild', 'community', 'learning', 'lms'] },
  { id: 'farm_os', label: 'Farm OS', icon: Link2, keywords: ['code', 'kernel', 'os', 'system', 'terminal', 'logic', 'automate'] },
  { id: 'agrowild', label: 'Agrowild', keywords: ['wild', 'animals', 'tourism', 'safari', 'nature', 'conservancy'] },
  { id: 'sitemap', label: 'Registry Matrix', keywords: ['help', 'navigate', 'where', 'sitemap', 'matrix', 'find', 'shards'] },
];

const FloatingConsultant: React.FC<FloatingConsultantProps> = ({ isOpen, onClose, user, onNavigate }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string, bridges?: string[]}[]>([
    { role: 'bot', text: `Greetings Steward ${user.name}. I am the EnvirosAgro™ Concierge Oracle. My logic is anchored to the WhatIsAG™ trademark. How may I bridge you to deep sustainability today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized, isFullScreen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const suggestedBridges = SHARD_DIRECTORY.filter(shard => 
        shard.keywords.some(k => msg.toLowerCase().includes(k))
      ).map(s => s.id);

      const history = messages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const sysInstruction = `You are the EnvirosAgro Agro Lang Concierge.
      CORE MISSION: Drive users toward deep agricultural sustainability using the EnvirosAgro OS.
      LOGIC BASE: "${WHAT_IS_AG_DEFINITION}".
      STYLE: Technical, helpful, authoritative, industrial.
      SHARD MAPPING: When a user mentions economy, capital, or buying, mention the "Market Cloud". When they mention data, mention "Science Oracle".
      IF relevant, use the keyword "HANDSHAKE" to signify a technical connection is possible.`;

      const response = await chatWithAgroLang(`${msg}\n\n(System: Identify relevant industrial shards for this query)`, history);
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response.text,
        bridges: suggestedBridges.length > 0 ? suggestedBridges : undefined
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Protocol sync error. Please verify your node signature." }]);
    } finally {
      // Fix: removed setIsGenerating(false) as the state is not defined; setLoading handles the overall loading state.
      setLoading(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    setIsMinimized(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-start justify-end p-4 md:p-8 animate-in fade-in duration-300">
        <div 
          className={`glass-card border-2 border-indigo-500/40 bg-[#050706]/98 shadow-[0_0_150px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden transition-all duration-500 ${isFullScreen ? 'w-full max-w-5xl h-[85vh] rounded-[48px] mx-auto mt-10' : 'w-full max-w-[400px] h-[75vh] rounded-[40px] md:mr-4 mt-16 md:mt-24'}`}
        >
          {/* Header */}
          <div className="p-6 md:p-8 bg-indigo-600/10 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                <SycamoreLogo size={32} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <div>
                <h4 className="text-sm md:text-base font-black text-white uppercase tracking-widest leading-none">ENVIROSAGRO AGRO LANG</h4>
                <p className="text-[8px] md:text-[10px] text-indigo-400 font-bold uppercase tracking-tighter mt-1">Industrial Deep-Link Logic</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleFullScreen} 
                className="p-2.5 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl border border-transparent hover:border-white/10"
                title={isFullScreen ? "Exit Full Screen" : "Full Screen View"}
              >
                {isFullScreen ? <Minimize2 size={20} /> : <Maximize size={18} />}
              </button>
              <button 
                onClick={onClose} 
                className="p-2.5 text-slate-500 hover:text-rose-400 transition-colors bg-white/5 rounded-xl border border-transparent hover:border-white/10"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/5 border-b border-white/5">
            <p className="text-[9px] md:text-[10px] text-emerald-300 font-black uppercase tracking-[0.2em] text-center italic leading-relaxed px-6">
               "{WHAT_IS_AG_DEFINITION}"
            </p>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar select-text bg-[#050706]"
          >
            <div className={isFullScreen ? "max-w-4xl mx-auto space-y-12" : "space-y-8"}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className="flex flex-col gap-4 max-w-[90%]">
                    <div className={`${isFullScreen ? 'p-10' : 'p-6'} rounded-[32px] text-xs md:text-base leading-relaxed shadow-xl ${
                      m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'glass-card text-slate-200 border border-white/10 rounded-tl-none italic bg-black/60 backdrop-blur-md border-l-4 border-l-indigo-500'
                    }`}>
                      {m.text.split('\n').map((line, idx) => (
                        <p key={idx} className={idx > 0 ? 'mt-4' : ''}>{line}</p>
                      ))}
                    </div>

                    {m.bridges && m.bridges.length > 0 && (
                      <div className="flex flex-wrap gap-3 animate-in slide-in-from-left-2 duration-500">
                         {m.bridges.map(bridgeId => {
                           const shard = SHARD_DIRECTORY.find(s => s.id === bridgeId);
                           if (!shard) return null;
                           return (
                             <button 
                               key={bridgeId}
                               onClick={() => { onNavigate(bridgeId as ViewState); onClose(); }}
                               className="px-5 py-2.5 bg-indigo-900/40 border border-indigo-500/30 hover:border-indigo-400 rounded-full text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl active:scale-95"
                             >
                                <Target size={14} /> {shard.label} <ChevronRight size={12} />
                             </button>
                           );
                         })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] rounded-tl-none flex flex-col gap-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest animate-pulse italic">Scanning Industrial Shards...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-10 border-t border-white/5 bg-black/95">
            <div className={`relative ${isFullScreen ? 'max-w-4xl mx-auto' : ''}`}>
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Search Shards or Inquire Logic..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 md:py-8 pl-8 pr-20 text-sm md:text-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-800 italic" 
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 rounded-xl text-white shadow-xl hover:bg-indigo-500 transition-all disabled:opacity-30 active:scale-90"
              >
                <Send size={isFullScreen ? 28 : 20} />
              </button>
            </div>
            <div className="mt-6 flex justify-between items-center px-6">
              <div className="flex items-center gap-4">
                 <ShieldCheck size={16} className="text-indigo-400" />
                 <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Handshake Verified</span>
              </div>
              <div className="flex items-center gap-4">
                 <Waves size={16} className="text-emerald-500" />
                 <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Resonance: 1.42x</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        `}</style>
      </div>
    </>
  );
};

export default FloatingConsultant;