import React, { useState, useRef } from 'react';
import { 
  Video, 
  Music, 
  FileText, 
  Leaf, 
  Loader2, 
  Download, 
  Zap, 
  ShieldCheck, 
  Database, 
  Bot, 
  Binary, 
  ArrowRight,
  Play,
  RotateCcw,
  Save,
  Share2,
  Mic,
  Waves,
  Library,
  BookOpen,
  Stamp,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { 
  generateTemporalVideo, 
  getTemporalVideoOperation, 
  generateAgroAcoustic, 
  generateAgroDocument 
} from '../services/agroLangService';
import { User, MediaShard } from '../types';
import { SycamoreLogo } from '../App';
import MultimediaPlayer from './MultimediaPlayer';
import { saveCollectionItem } from '../services/firebaseService';
import { generateQuickHash, generateAlphanumericId } from '../systemFunctions';

interface AgroMultimediaGeneratorProps {
  user: User;
  onNavigate: (view: any) => void;
  onEarnEAC: (amount: number, reason: string) => void;
  prefilledParams?: { prompt?: string; type?: string } | null;
  clearParams?: () => void;
}

const AgroMultimediaGenerator: React.FC<AgroMultimediaGeneratorProps> = ({ 
  user, 
  onNavigate, 
  onEarnEAC,
  prefilledParams,
  clearParams
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'document'>('video');
  const [prompt, setPrompt] = useState('');
  const [docType, setDocType] = useState('Research Paper');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  const handleGenerate = async (overridePrompt?: string, overrideType?: string) => {
    const p = overridePrompt || prompt;
    const t = overrideType || activeTab;

    if (!p.trim() || isGenerating) return;
    setIsGenerating(true);
    setResultUrl(null);
    setResultText(null);
    setStatus('Initializing AgroMusika Neural Link...');

    try {
      if (t === 'video') {
        setStatus('Calibrating Veo 3.1 Fast Engine...');
        let operation = await generateTemporalVideo(p);
        
        const statusMessages = [
          "Sequencing biological time shards...",
          "Simulating m-constant growth curves...",
          "Rendering atmospheric resonance...",
          "Finalizing industrial video ingest..."
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
          setResultUrl(URL.createObjectURL(blob));
        }
      } else if (t === 'audio') {
        setStatus('Synthesizing Acoustic Resonance...');
        const base64Audio = await generateAgroAcoustic(p);
        if (base64Audio) {
          const audioUrl = `data:audio/wav;base64,${base64Audio}`;
          setResultUrl(audioUrl);
        }
      } else if (t === 'document') {
        setStatus(`Drafting ${docType} via EnvirosAgro Agro Lang...`);
        const res = await generateAgroDocument(docType, p);
        setResultText(res.text);
      }

      onEarnEAC(50, 'MULTIMEDIA_GENERATION_REWARD');
    } catch (err) {
      console.error(err);
      alert("GENERATION_ERROR: Neural link interrupted.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle prefilled params
  React.useEffect(() => {
    if (prefilledParams) {
      if (prefilledParams.prompt) setPrompt(prefilledParams.prompt);
      if (prefilledParams.type) {
        const type = prefilledParams.type.toLowerCase();
        if (type === 'video' || type === 'audio' || type === 'document') {
          setActiveTab(type as any);
        }
      }
      
      // Auto-generate if requested
      if ((prefilledParams as any).autoGenerate) {
        // We use setTimeout to ensure state updates have flushed, though we pass overrides directly
        setTimeout(() => {
          handleGenerate(prefilledParams.prompt, prefilledParams.type);
        }, 100);
      }

      // Clear params after consuming
      if (clearParams) clearParams();
    }
  }, [prefilledParams, clearParams]);

  React.useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  const handleAnchorToLedger = async () => {
    if (!resultUrl && !resultText) return;

    const shard: Partial<MediaShard> = {
      id: `SHARD-${generateAlphanumericId(7)}`,
      title: `${activeTab.toUpperCase()}_${prompt.substring(0, 20).toUpperCase()}`,
      type: activeTab === 'video' ? 'VIDEO' : activeTab === 'audio' ? 'AUDIO' : 'PAPER',
      author: user.name,
      authorEsin: user.esin,
      hash: generateQuickHash().toLowerCase(),
      mImpact: (1 + Math.random()).toFixed(2),
      source: 'AgroMusika Generator',
      timestamp: new Date().toISOString()
    };

    await saveCollectionItem('media_ledger', shard);
    alert("SHARD_ANCHORED: Media successfully committed to the industrial ledger.");
  };

  if (hasKey === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-10 text-center p-12">
        <div className="w-32 h-32 rounded-[48px] bg-amber-600/10 border-2 border-amber-500/20 flex items-center justify-center text-amber-500 shadow-3xl animate-pulse">
          <Cpu size={64} />
        </div>
        <div className="space-y-4 max-w-xl">
           <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Neural Handshake <span className="text-amber-500">Required.</span></h2>
           <p className="text-slate-400 text-xl font-medium italic leading-relaxed">
             "AgroMusika high-fidelity generation requires a direct paid API key handshake for neural resource allocation."
           </p>
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
    <div className="space-y-12 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-2xl border border-white/10">
              <Leaf size={24} className="text-white" />
            </div>
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.6em] italic">AGROMUSIKA_NEURAL_FORGE</h2>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
            Agro <span className="text-indigo-400">Multimedia</span> Generator
          </h1>
          <p className="text-slate-500 text-lg font-medium italic max-w-2xl">
            "Powered by AgroMusika. Integrated with EnvirosAgro Artificial Intelligence and FarmOS for high-fidelity industrial media synthesis."
          </p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => onNavigate('media_ledger')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3">
              <Library size={18} /> MEDIA_LEDGER
           </button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 space-y-10 shadow-3xl">
            {/* Tab Selection */}
            <div className="flex p-2 bg-black/60 rounded-[32px] border border-white/10">
              {(['video', 'audio', 'document'] as const).map(t => (
                <button
                  key={t}
                  id={`multimedia-tab-${t}`}
                  onClick={() => { setActiveTab(t); setResultUrl(null); setResultText(null); }}
                  className={`flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === t ? 'bg-indigo-600 text-white shadow-2xl' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {t === 'video' && <Video id="multimedia-tab-video-icon" size={16} className={`transition-all duration-500 ${activeTab === 'video' ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-110' : 'opacity-40 group-hover:opacity-100'}`} />}
                  {t === 'audio' && <Music id="multimedia-tab-audio-icon" size={16} className={`transition-all duration-500 ${activeTab === 'audio' ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-110' : 'opacity-40 group-hover:opacity-100'}`} />}
                  {t === 'document' && <FileText id="multimedia-tab-document-icon" size={16} className={`transition-all duration-500 ${activeTab === 'document' ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-110' : 'opacity-40 group-hover:opacity-100'}`} />}
                  {t}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="space-y-6">
              {activeTab === 'document' && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 italic">DOCUMENT_TYPE</label>
                  <select 
                    value={docType}
                    onChange={e => setDocType(e.target.value)}
                    className="w-full bg-black/60 border-2 border-white/5 rounded-3xl p-5 text-white font-black uppercase text-xs focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option>Research Paper</option>
                    <option>Value Blueprint</option>
                    <option>Institutional Book</option>
                    <option>Transaction Receipt</option>
                    <option>Architectural Design</option>
                    <option>Paint with Nature Guide</option>
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 italic">NEURAL_PROMPT_INGEST</label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={activeTab === 'video' ? "Describe the agro-cinematic sequence..." : activeTab === 'audio' ? "Describe the acoustic rhythm or beat..." : "Describe the document objectives..."}
                  className="w-full h-48 bg-black/60 border-2 border-white/5 rounded-[40px] p-8 text-white font-medium italic text-lg focus:border-indigo-500 transition-all outline-none resize-none shadow-inner"
                />
              </div>
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-6 border-4 border-white/10 ring-[16px] ring-indigo-500/5"
            >
              {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} className="fill-current" />}
              {isGenerating ? 'SYNTHESIZING...' : 'INITIALIZE_GENERATION'}
            </button>
          </div>

          {/* Status Panel */}
          {isGenerating && (
            <div className="p-8 bg-indigo-900/10 border-2 border-indigo-500/20 rounded-[40px] flex items-center gap-8 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl">
                <Bot size={24} />
              </div>
              <div>
                <p className="text-indigo-400 font-black text-lg uppercase tracking-widest italic leading-none">{status}</p>
                <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest mt-2">AgroMusika Neural Core // Active_Link</p>
              </div>
            </div>
          )}
        </div>

        {/* Result Area */}
        <div className="lg:col-span-7">
          <div className="glass-card h-full min-h-[600px] rounded-[72px] border-2 border-white/5 bg-black/40 overflow-hidden flex flex-col shadow-3xl relative">
            {!resultUrl && !resultText && !isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-10 opacity-20">
                <div className="relative">
                  <Waves size={160} className="text-slate-600 animate-pulse" />
                  <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-[0.4em]">OUTPUT_VOID</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest italic">Awaiting neural synthesis from AgroMusika core</p>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-12">
                 <div className="w-32 h-32 rounded-[48px] bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-3xl animate-spin">
                    <RotateCcw size={64} />
                 </div>
                 <div className="space-y-4">
                    <p className="text-2xl font-black text-indigo-400 uppercase tracking-[0.5em] italic animate-pulse">FORGING_SHARD...</p>
                    <div className="flex items-center justify-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                       <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100"></div>
                       <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200"></div>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col animate-in fade-in zoom-in duration-500">
                {/* Preview Header */}
                <div className="p-10 border-b border-white/10 bg-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-2xl border border-white/10">
                         <ShieldCheck size={28} />
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">SYNTHESIS_COMPLETE</h4>
                         <p className="text-[9px] text-emerald-500 font-mono tracking-widest uppercase mt-2">Integrity_Verified // 0x{(Math.random()*1000000).toFixed(0)}</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={() => setPlayerOpen(true)} className="px-8 py-4 bg-indigo-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 hover:bg-indigo-500 transition-all">
                         <Play size={18} fill="white" /> OPEN_IN_AGROMUSIKA
                      </button>
                   </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-[#050706]">
                   {activeTab === 'video' && resultUrl && (
                     <div className="rounded-[48px] overflow-hidden border-4 border-white/10 shadow-3xl bg-black aspect-video relative group">
                        <video src={resultUrl} autoPlay loop muted className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Play size={80} className="text-white fill-white" />
                        </div>
                     </div>
                   )}
                   {activeTab === 'audio' && resultUrl && (
                     <div className="h-full flex flex-col items-center justify-center space-y-12">
                        <div className="w-64 h-64 rounded-full bg-indigo-600/20 border-4 border-indigo-500/30 flex items-center justify-center shadow-3xl animate-pulse">
                           <Waves size={120} className="text-indigo-400" />
                        </div>
                        <div className="text-center space-y-4">
                           <h5 className="text-3xl font-black text-white uppercase italic tracking-tighter">Acoustic_Shard_Generated</h5>
                           <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Resonance Calibration: Stable</p>
                        </div>
                        <audio src={resultUrl} controls className="w-full max-w-md" />
                     </div>
                   )}
                   {activeTab === 'document' && resultText && (
                     <div className="prose prose-invert max-w-none font-medium italic text-slate-300 leading-relaxed">
                        <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[40px] shadow-inner">
                           <pre className="whitespace-pre-wrap font-mono text-sm text-indigo-300">
                              {resultText}
                           </pre>
                        </div>
                     </div>
                   )}
                </div>

                {/* Actions Footer */}
                <div className="p-10 border-t border-white/10 bg-white/5 flex justify-center gap-8">
                   <button onClick={handleAnchorToLedger} className="px-12 py-6 bg-emerald-600 rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-2 border-white/10">
                      <Save size={20} /> PUBLISH_VIA_AGRO_IN_PDF
                   </button>
                   <button className="px-12 py-6 bg-white/5 border-2 border-white/10 rounded-full text-slate-400 font-black text-xs uppercase tracking-[0.4em] hover:text-white transition-all flex items-center gap-4">
                      <Share2 size={20} /> DISPATCH_SIGNAL
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MultimediaPlayer
        isOpen={playerOpen}
        onClose={() => setPlayerOpen(false)}
        mediaUrl={resultUrl || ''}
        mediaType={activeTab === 'video' ? 'VIDEO' : 'AUDIO'}
        title={activeTab === 'document' ? docType : `AGROMUSIKA_${activeTab.toUpperCase()}_SHARD`}
        author={user.name}
        shardId="MUSIKA-GEN-01"
        thumbnail={activeTab === 'video' ? 'https://picsum.photos/seed/agro/1920/1080' : undefined}
      />

      <style>{`
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AgroMultimediaGenerator;
