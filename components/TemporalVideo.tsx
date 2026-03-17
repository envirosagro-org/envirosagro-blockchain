import React, { useState, useEffect } from 'react';
import { 
  Video, Play, Loader2, Leaf, AlertTriangle, 
  Download, Clock, Database, ShieldCheck, RefreshCw, 
  Key, Globe, Bot, Binary, TrendingUp, X
} from 'lucide-react';
import { generateTemporalVideo, getTemporalVideoOperation } from '../services/agroLangService';
import { User } from '../types';
import { SycamoreLogo } from '../App';
import MultimediaPlayer from './MultimediaPlayer';

interface TemporalVideoProps {
  user: User;
  onNavigate: (view: any) => void;
}

const TemporalVideo: React.FC<TemporalVideoProps> = ({ user, onNavigate }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [prompt, setPrompt] = useState('High-fidelity time-lapse of a regenerative Bantu maize garden growing from seedling to harvest under a glowing nebula sky, cinematic lighting, 8k.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const selected = await (window as any).aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setVideoUrl(null);
    setStatus('Initializing Temporal Shard Ingest...');

    try {
      let operation = await generateTemporalVideo(prompt);
      
      const statusMessages = [
        "Calibrating biological time signature...",
        "Simulating m-constant growth curves...",
        "Sequencing visual genome shards...",
        "Finalizing atmospheric rendering...",
        "Anchoring vision to institutional ledger..."
      ];
      let msgIdx = 0;

      while (!operation.done) {
        setStatus(statusMessages[msgIdx % statusMessages.length]);
        msgIdx++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await getTemporalVideoOperation(operation);
      }

      const downloadLink = (operation as any).response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(`${downloadLink}&key=${apiKey}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
      }
      alert("TEMPORAL_ERROR: Link interrupted.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10 text-center p-12">
        <div className="w-32 h-32 rounded-[48px] bg-amber-600/10 border-2 border-amber-500/20 flex items-center justify-center text-amber-500 shadow-3xl animate-pulse">
          <Key size={64} />
        </div>
        <div className="space-y-4 max-w-xl">
           <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Handshake <span className="text-amber-500">Required.</span></h2>
           <p className="text-slate-400 text-xl font-medium italic leading-relaxed">
             "Bio-temporal video sharding requires a direct paid API key handshake for institutional resource allocation."
           </p>
           <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-xs text-slate-500 text-left">
              Billing documentation and GCP project setup required. Visit <a href="https://ai.google.com/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">ai.google.dev/billing</a> for more info.
           </div>
        </div>
        <button 
          onClick={handleSelectKey}
          className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-amber-500/5"
        >
          SELECT API KEY
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
      <div className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center text-center space-y-10 shadow-3xl group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:rotate-12 transition-transform duration-[15s]"><Clock size={800} className="text-indigo-400" /></div>
         
         <div className="relative z-10 space-y-8 w-full">
            <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto animate-float">
               <Video size={40} className="text-white animate-pulse" />
            </div>
            <div className="space-y-4">
               <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">TEMPORAL <span className="text-indigo-400">SHARDING.</span></h3>
               <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed">
                  "Utilizing the Veo 3.1 fast-engine to simulate future growth trajectories for node {user.esin}."
               </p>
            </div>

            {!videoUrl && !isGenerating ? (
               <div className="max-w-2xl mx-auto space-y-10 py-10">
                  <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 shadow-inner group/form">
                     <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.6em] block text-center italic mb-6">PREDICTIVE_PROMPT_INGEST</label>
                     <textarea 
                       value={prompt}
                       onChange={e => setPrompt(e.target.value)}
                       className="w-full bg-transparent border-none text-center text-xl italic font-medium text-white outline-none focus:ring-0 placeholder:text-stone-950 transition-all h-32 resize-none" 
                     />
                  </div>
                  <button 
                    onClick={handleGenerate}
                    className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-indigo-500/5"
                  >
                     <Leaf size={32} className="fill-current mr-4" /> INITIALIZE TEMPORAL FORGE
                  </button>
               </div>
            ) : isGenerating ? (
              <div className="flex flex-col items-center justify-center space-y-16 py-32 text-center animate-in zoom-in duration-500">
                 <div className="relative">
                    <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center"><Bot size={48} className="text-indigo-400 animate-pulse" /></div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">{status}</p>
                    <p className="text-slate-700 font-mono text-xs uppercase tracking-widest italic">VEO_ENGINE_LINK_ACTIVE // RENDERING_SHARDS</p>
                 </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10">
                 <div className="rounded-[64px] overflow-hidden border-4 border-white/10 shadow-3xl bg-black relative aspect-video group/video cursor-pointer" onClick={() => setPlayerOpen(true)}>
                    <video src={videoUrl!} autoPlay loop muted className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                       <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-3xl border-4 border-white/10">
                          <Play size={48} fill="white" />
                       </div>
                    </div>
                    <div className="absolute top-8 right-8 flex gap-4 opacity-0 group-hover/video:opacity-100 transition-opacity">
                       <button className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-xl hover:bg-emerald-600 transition-all active:scale-90"><Download size={24}/></button>
                    </div>
                 </div>
                 <div className="flex justify-center gap-10">
                    <button onClick={() => setVideoUrl(null)} className="px-16 py-8 bg-white/5 border-2 border-white/10 rounded-full text-sm font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">NEW SIMULATION</button>
                    <button className="px-24 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-emerald-500/5">ANCHOR TO LEDGER</button>
                 </div>
              </div>
            )}
         </div>
      </div>

      <MultimediaPlayer
        isOpen={playerOpen}
        onClose={() => setPlayerOpen(false)}
        mediaUrl={videoUrl || ''}
        mediaType="VIDEO"
        title="TEMPORAL_SHARD_PREVIEW"
        author={user.name}
        shardId="VEO-SIM-01"
      />
    </div>
  );
};

export default TemporalVideo;