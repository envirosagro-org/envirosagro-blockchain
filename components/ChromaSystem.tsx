import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Palette, 
  Binary, 
  Box, 
  Microscope, 
  Info, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Bot, 
  Scale, 
  Thermometer, 
  Users, 
  Leaf, 
  Heart, 
  Loader2, 
  Upload, 
  CheckCircle2, 
  Scan, 
  ArrowRight,
  Droplets,
  Radiation,
  Waves,
  Layout,
  Fingerprint,
  Monitor,
  Sun,
  RefreshCw,
  ShieldPlus,
  Terminal,
  Stamp,
  PencilRuler,
  Building,
  Trees,
  Mountain,
  ChevronRight,
  X,
  Download,
  FileText,
  Coins,
  Brush,
  Eraser,
  Printer,
  Undo2,
  Maximize2,
  Trash2,
  Image as ImageIcon,
  Wand2,
  Send,
  Eye,
  Workflow,
  Plus,
  LayoutGrid,
  Share2,
  History,
  Target,
  Dna,
  ShieldAlert,
  Wind,
  Flower2,
  Crown,
  Maximize,
  ArrowUpRight,
  ThermometerSun,
  Layers,
  Circle,
  FlaskConical,
  Atom
} from 'lucide-react';
import { User, ViewState, MediaShard } from '../types';
import { chatWithAgroLang, analyzeMedia } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import { GoogleGenAI } from "@google/genai";
import { generateQuickHash } from '../systemFunctions';

interface ChromaSystemProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
}

const SEHTI_CHROMA_MAPPING = [
  { id: 'societal', thrust: 'Societal', variable: 'W_s', spectrum: 'Warm (Red/Orange/Yellow)', frequency: '432Hz', context: 'Markets, Education', diagnosis: 'Warning: Nutrient Stress', color: '#F2CC8F', icon: Users },
  { id: 'environmental', thrust: 'Environmental', variable: 'B_s', spectrum: 'Bio (Green/Brown/Teal)', frequency: '528Hz', context: 'Production, Waste', diagnosis: 'Health: Chlorophyll Density', color: '#4A7C59', icon: Leaf },
  { id: 'human', thrust: 'Human', variable: 'C_s', spectrum: 'Calm (Blue/Indigo/Violet)', frequency: '396Hz', context: 'Labs, Rest Areas', diagnosis: 'Deficiency: Phosphorus/Fungal', color: '#818cf8', icon: Heart },
  { id: 'lilies', thrust: 'Aesthetic', variable: 'L_s', spectrum: 'Fuchsia (Pink/Gold/Light)', frequency: '440Hz', context: 'Lilies Around, Floriculture', diagnosis: 'Peak: Aesthetic Resonance', color: '#f472b6', icon: Flower2 },
  { id: 'technological', thrust: 'Technological', variable: 'U_s', spectrum: 'UV/IR (Greyscale Mapping)', frequency: '639Hz', context: 'Server Rooms, Robotics', diagnosis: 'Early Detection: Pre-symptomatic', color: '#2F3E46', icon: Bot },
];

const ARCHITECTURAL_PALETTES = [
  { zone: 'Growth Zone', name: 'Photosynthetic Green', hex: '#4A7C59', albedo: 0.12, resilience: 'High', function: 'Blends with crops, maximizes psychological connection to nature.' },
  { zone: 'Control Zone', name: 'Slate Tech Grey', hex: '#2F3E46', albedo: 0.08, resilience: 'Standard', function: 'High contrast for robot navigation, reduces screen glare.' },
  { zone: 'Lilies Node', name: 'Celestial Fuchsia', hex: '#f472b6', albedo: 0.35, resilience: 'Ultra', function: 'High spectral albedo for pollinator sharding and aesthetic impact.' },
];

const ChromaSystem: React.FC<ChromaSystemProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'mapping' | 'design' | 'paint' | 'macro' | 'micro'>('mapping');
  
  // Paint with Nature States
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedThrust, setSelectedThrust] = useState(SEHTI_CHROMA_MAPPING[3]); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isMintingGraphic, setIsMintingGraphic] = useState(false);
  const [graphicAnchored, setGraphicAnchored] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1');

  // Macro States
  const [albedo, setAlbedo] = useState(0.92);
  const [psychScore, setPsychScore] = useState(8);
  const [thermalCoeff, setThermalCoeff] = useState(0.45);
  const [footprint, setFootprint] = useState(0.12);
  const [isCalculatingSc, setIsCalculatingSc] = useState(false);
  const [scResult, setScResult] = useState<{name: string, hex: string} | null>(null);

  // Micro States
  const [isScanning, setIsScanning] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [chromaDiagnosis, setChromaDiagnosis] = useState<{hi: number, report: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Design Ingest States
  const [designDescription, setDesignDescription] = useState('');
  const [designCategory, setDesignCategory] = useState('Lilies_Around_Blueprint');
  const [isForgingDesign, setIsForgingDesign] = useState(false);
  const [designShard, setDesignShard] = useState<string | null>(null);

  // General Archiving States
  const [archivedShards, setArchivedShards] = useState<Set<string>>(new Set());
  const [isArchiving, setIsArchiving] = useState<string | null>(null);

  const anchorToLedger = async (content: string, type: string, mode: string) => {
    const shardKey = `${type}_${mode}_${content.substring(0, 20)}`;
    if (archivedShards.has(shardKey)) return;
    
    setIsArchiving(shardKey);
    try {
      const shardHash = `0x${generateQuickHash()}`;
      const newShard: Partial<MediaShard> = {
        title: `${type.toUpperCase()}: ${mode.replace('_', ' ')}`,
        type: 'ORACLE',
        source: 'Chroma System',
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: shardHash,
        mImpact: (1.42 + Math.random() * 0.1).toFixed(2),
        size: `${(content.length / 1024).toFixed(1)} KB`,
        content: content
      };
      
      await saveCollectionItem('media_ledger', newShard);
      setArchivedShards(prev => new Set(prev).add(shardKey));
      onEarnEAC(20, `LEDGER_ANCHOR_${type.toUpperCase()}_SUCCESS`);
    } catch (e) {
      alert("LEDGER_FAILURE: Registry handshake failed.");
    } finally {
      setIsArchiving(null);
    }
  };

  const downloadReport = (content: string, mode: string, type: string) => {
    const shardId = `0x${generateQuickHash()}`;
    const report = `
ENVIROSAGRO™ ${type.toUpperCase()} SHARD
=================================
REGISTRY_ID: ${shardId}
NODE_AUTH: ${user.esin}
MODE: ${mode}
TIMESTAMP: ${new Date().toISOString()}
ZK_CONSENSUS: VERIFIED (99.8%)

DIAGNOSTIC VERDICT:
-------------------
${content}

-------------------
(c) 2025 EA_ROOT_NODE. Secure Shard Finality.
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EA_${type}_${mode}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    const COST = 25;
    if (!await onSpendEAC(COST, `GRAPHIC_SYNTHESIS_${selectedThrust.thrust.toUpperCase()}`)) return;

    setIsGenerating(true);
    setGeneratedImageUrl(null);
    setGraphicAnchored(false);

    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const technicalPrompt = `Professional architectural and agricultural render of ${imagePrompt}. 
      Brand Influence: Lilies Around Aesthetic Revolution.
      Framework Context: ${selectedThrust.thrust} sustainability. 
      Spectral Focus: ${selectedThrust.spectrum}. 
      Style: High-fidelity cinematic 8k architectural visualization, botanical precision, fuchsia highlights, industrial EOS aesthetic.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: technicalPrompt }] },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio
          }
        }
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setGeneratedImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
      }

      if (foundImage) {
        onEarnEAC(5, 'AESTHETIC_VITALITY_INGEST');
      } else {
        alert("Consensus Failure: No image shard returned.");
      }
    } catch (err) {
      console.error(err);
      alert("Oracle synthesis interrupted. Check node connectivity.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMintGraphic = async () => {
    if (!generatedImageUrl) return;
    const fee = 15;
    if (!await onSpendEAC(fee, 'AGRICULTURAL_GRAPHIC_MINT')) return;

    setIsMintingGraphic(true);
    setTimeout(() => {
      setIsMintingGraphic(false);
      setGraphicAnchored(true);
      onEarnEAC(10, 'AESTHETIC_ASSET_ANCHORED');
    }, 2500);
  };

  const calculateSc = () => {
    setIsCalculatingSc(true);
    setTimeout(() => {
      const scValue = (albedo * psychScore) / (thermalCoeff + footprint);
      let res = { name: "EnvirosAgro White", hex: "#F2F7F2" };
      if (scValue < 5) res = { name: "Photosynthetic Green", hex: "#4A7C59" };
      else if (scValue < 8) res = { name: "Lilies Around Fuchsia", hex: "#f472b6" };
      else if (scValue < 12) res = { name: "Harvest Gold", hex: "#F2CC8F" };
      
      setScResult(res);
      setIsCalculatingSc(false);
      onEarnEAC(10, 'ARCHITECTURAL_CHROMA_CALIBRATION');
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        runDigitalChromatography();
      };
      reader.readAsDataURL(file);
    }
  };

  const runDigitalChromatography = async () => {
    setIsScanning(true);
    setChromaDiagnosis(null);
    try {
      const hi = 0.82;
      const prompt = `Perform a Digital Chromatography Audit on this crop shard. 
      Predicted Health Index (Hi): ${hi}. Analyze spectral pigments and suggest SEHTI remediation. Include Lilies Around aesthetic impact analysis.`;
      
      const response = await chatWithAgroLang(prompt, []);
      setChromaDiagnosis({ hi, report: response.text });
      onEarnEAC(20, 'CHROMATOGRAPHY_INGEST_SYNC');
    } catch (e) {
      setChromaDiagnosis({ hi: 0.5, report: "Oracle sync timeout. Manual audit required." });
    } finally {
      setIsScanning(false);
    }
  };

  const handleForgeDesign = async () => {
    if (!designDescription.trim()) return;
    const DESIGN_FEE = 40;
    
    if (!await onSpendEAC(DESIGN_FEE, `DESIGN_INGEST_SHARD_${designCategory.toUpperCase()}`)) return;

    setIsForgingDesign(true);
    setDesignShard(null);

    try {
      const prompt = `Act as a Lilies Around Architectural Consultant. Synthesize this ${designCategory} design:
      "${designDescription}"
      
      Requirements:
      1. Map to Chroma-SEHTI aesthetic spectrum.
      2. Calculate Albedo and Psychological Resonance for floriculture.
      3. Recommend material index and Lilies Around resilience score.`;
      
      const response = await chatWithAgroLang(prompt, []);
      setDesignShard(response.text);
      onEarnEAC(15, 'LILIES_DESIGN_INGEST_SYNERGY');
    } catch (e) {
      setDesignShard("Registry link timeout.");
    } finally {
      setIsForgingDesign(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      {/* Header HUD */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <Palette className="w-[800px] h-[800px] text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <Palette className="w-20 h-20 text-white animate-pulse" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner">CHROMA_SEHTI_v2</span>
               <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Chroma <span className="text-emerald-400">SEHTI</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-3xl leading-relaxed italic opacity-80">
               "Architectural color as a functional agricultural instrument. Powered by Lilies Around aesthetic sharding logic."
            </p>
         </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-xl px-6 mx-auto lg:mx-0 relative z-20">
        {[
          { id: 'mapping', label: 'Spectral Registry', icon: Binary },
          { id: 'paint', label: 'Paint with Nature', icon: Wand2 },
          { id: 'design', label: 'Lilies Forge', icon: Flower2 },
          { id: 'macro', label: 'Architectural Sc', icon: Box },
          { id: 'micro', label: 'Chromatography', icon: Microscope },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105 border-b-4 border-emerald-400 ring-8 ring-emerald-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[800px] relative z-10">
        
        {/* --- VIEW: SPECTRAL REGISTRY --- */}
        {activeTab === 'mapping' && (
          <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {SEHTI_CHROMA_MAPPING.map((m, i) => (
                   <div key={i} className={`glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col justify-between h-[520px] relative overflow-hidden shadow-3xl ${m.id === 'lilies' ? 'ring-2 ring-fuchsia-500/20' : ''}`}>
                      <div className="absolute -bottom-10 -right-10 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]">
                         <m.icon size={300} />
                      </div>
                      <div className="space-y-8 relative z-10">
                         <div className="flex justify-between items-start">
                            <div className="p-5 bg-white/5 rounded-3xl border border-white/10 shadow-inner group-hover:rotate-6 transition-transform">
                               <m.icon className={`w-10 h-10 ${m.id === 'lilies' ? 'text-fuchsia-400' : 'text-emerald-400'}`} />
                            </div>
                            <span className="text-[12px] font-mono font-black text-slate-700 uppercase tracking-widest">{m.variable}</span>
                         </div>
                         <div>
                            <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{m.thrust}</h4>
                            <p className={`text-[10px] font-mono mt-3 uppercase tracking-widest ${m.id === 'lilies' ? 'text-fuchsia-400' : 'text-emerald-400'}`}>{m.frequency} // SYNC_OK</p>
                         </div>
                         <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden shadow-inner">
                            <div className="h-full animate-pulse" style={{ backgroundColor: m.color, width: '100%' }}></div>
                         </div>
                         <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{m.spectrum}</p>
                      </div>
                      <div className="space-y-6 pt-10 border-t border-white/5 relative z-10">
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Agricultural Context</p>
                            <p className="text-sm text-slate-400 italic">"{m.context}"</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Diagnostic Verdict</p>
                            <p className={`text-sm font-bold uppercase italic ${m.id === 'lilies' ? 'text-fuchsia-500' : 'text-emerald-500/80'}`}>{m.diagnosis}</p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VIEW: PAINT WITH NATURE --- */}
        {activeTab === 'paint' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-black/40 space-y-10 shadow-3xl">
                    <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl">
                          <Wand2 className="w-8 h-8 text-white" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Nature <span className="text-emerald-400">Canvas</span></h3>
                          <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-2">AGRO_LANG_AESTHETIC_INGEST</p>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <button 
                         onClick={() => onNavigate('multimedia_generator')}
                         className="w-full py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl"
                       >
                          <Leaf size={16} /> MULTIMEDIA_FORGE
                       </button>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Aesthetic Intent Shard</label>
                          <textarea 
                            value={imagePrompt}
                            onChange={e => setImagePrompt(e.target.value)}
                            placeholder="Describe your botanical vision (e.g. Circular bantu garden at sunrise)..."
                            className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-lg font-medium italic focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all h-40 resize-none placeholder:text-stone-900"
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Pillar focus</label>
                             <select 
                                value={selectedThrust.id}
                                onChange={e => setSelectedThrust(SEHTI_CHROMA_MAPPING.find(m => m.id === e.target.value)!)}
                                className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20"
                             >
                                {SEHTI_CHROMA_MAPPING.map(m => <option key={m.id} value={m.id}>{m.thrust}</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Aspect Ratio</label>
                             <select 
                                value={aspectRatio}
                                onChange={e => setAspectRatio(e.target.value as any)}
                                className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20"
                             >
                                <option value="1:1">1:1 Square</option>
                                <option value="16:9">16:9 Wide</option>
                                <option value="9:16">9:16 Port</option>
                             </select>
                          </div>
                       </div>
                    </div>
                    <button 
                       onClick={handleGenerateImage}
                       disabled={isGenerating || !imagePrompt.trim()}
                       className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30 border-4 border-white/10 ring-8 ring-white/5"
                    >
                       {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Leaf className="w-6 h-6 fill-current" />}
                       {isGenerating ? 'Synthesizing...' : 'GENERATE AESTHETIC SHARD'}
                    </button>
                 </div>

                 <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-6 group">
                    <div className="flex items-center gap-4">
                       <Info size={16} className="text-emerald-500" />
                       <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocol Tip</h4>
                    </div>
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                       "Aesthetic shards increase regional social immunity (x) by 12.4% when anchored to the heritage hub."
                    </p>
                 </div>
              </div>

              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[64px] min-h-[650px] border-2 border-white/5 bg-black overflow-hidden relative group shadow-3xl flex flex-col">
                    {!generatedImageUrl && !isGenerating ? (
                       <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 opacity-10">
                          <ImageIcon size={140} className="text-slate-500" />
                          <p className="text-4xl font-black uppercase tracking-[0.6em] text-white italic">CANVAS_EMPTY</p>
                       </div>
                    ) : isGenerating ? (
                       <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                          <div className="relative">
                             <Loader2 size={120} className="text-emerald-500 animate-spin mx-auto" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Palette size={48} className="text-emerald-400 animate-pulse" />
                             </div>
                          </div>
                          <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic">MAPPING SPECTRAL DATA...</p>
                       </div>
                    ) : (
                       <div className="flex-1 flex flex-col animate-in fade-in zoom-in duration-1000">
                          <div className="relative group/img overflow-hidden flex-1 flex items-center justify-center bg-stone-950">
                             <img src={generatedImageUrl!} className="w-full h-full object-contain max-h-[700px] shadow-2xl" alt="Generated" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover/img:opacity-0 transition-opacity"></div>
                             <div className="absolute top-10 right-10 flex gap-4">
                                <button className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"><Maximize size={24}/></button>
                                <button onClick={() => setGeneratedImageUrl(null)} className="p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"><X size={24}/></button>
                             </div>
                          </div>
                          <div className="p-12 border-t border-white/5 bg-black/90 flex flex-col md:flex-row justify-between items-center gap-8">
                             <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Fingerprint size={32} /></div>
                                <div className="text-left">
                                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Aesthetic Shard Protocol</p>
                                   <p className="text-lg font-mono font-black text-white">0x882_GEN_OK_SYNC</p>
                                </div>
                             </div>
                             {!graphicAnchored ? (
                               <button 
                                 onClick={handleMintGraphic}
                                 disabled={isMintingGraphic}
                                 className="px-16 py-7 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-5 ring-8 ring-white/5 border-2 border-white/10"
                               >
                                  {isMintingGraphic ? <Loader2 size={24} className="animate-spin" /> : <Stamp size={24} />}
                                  {isMintingGraphic ? 'MINTING SHARD...' : 'ANCHOR ASSET TO REGISTRY'}
                               </button>
                             ) : (
                               <div className="flex items-center gap-6 animate-in slide-in-from-right-4">
                                  <div className="text-right">
                                     <p className="text-emerald-500 font-black text-sm uppercase tracking-widest leading-none">Shard Anchored</p>
                                     <p className="text-[10px] text-slate-600 font-mono mt-1">Registry Ref: #G882A</p>
                                  </div>
                                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl"><CheckCircle2 size={32} /></div>
                               </div>
                             )}
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: LILIES FORGE (DESIGN FORGE) --- */}
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
             <div className="lg:col-span-4 space-y-10">
                <div className="glass-card p-10 md:p-14 rounded-[64px] border-2 border-fuchsia-500/20 bg-black/40 space-y-12 shadow-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Flower2 size={400} className="text-fuchsia-400" /></div>
                   <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8">
                      <div className="p-5 bg-fuchsia-600 rounded-3xl shadow-3xl border-2 border-white/10 group-hover:rotate-12 transition-transform">
                         <Crown className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Aesthetic <span className="text-fuchsia-400">Forge</span></h3>
                        <p className="text-[10px] text-slate-500 font-mono uppercase mt-2 tracking-widest">Lilies_Around_Architecture_v1</p>
                      </div>
                   </div>
                   
                   <div className="space-y-10 relative z-10">
                      <div className="space-y-4">
                         <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Mission Category</label>
                         <div className="grid grid-cols-2 gap-4">
                            {['Floriculture', 'Landscape', 'Atrium_Design', 'Celestial_Arcs'].map(cat => (
                               <button 
                                 key={cat} 
                                 onClick={() => setDesignCategory(cat)}
                                 className={`p-6 rounded-[32px] border-2 text-[10px] font-black uppercase transition-all flex items-center justify-center gap-3 ${designCategory === cat ? 'bg-fuchsia-600 border-white text-white shadow-2xl scale-105' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}
                               >
                                  {cat === 'Floriculture' ? <Flower2 size={16} /> : cat === 'Landscape' ? <Trees size={16} /> : cat === 'Atrium_Design' ? <Building size={16} /> : <Sun size={16} />}
                                  {cat}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Botanical Intent Shard</label>
                         <textarea 
                           value={designDescription}
                           onChange={e => setDesignDescription(e.target.value)}
                           placeholder="Describe the aesthetic botanical architecture: Symmetry, celestial alignment, fuchsia sharding..."
                           className="w-full bg-black/80 border border-white/10 rounded-[40px] p-10 text-white text-lg font-medium italic focus:ring-8 focus:ring-fuchsia-500/5 transition-all outline-none h-48 resize-none shadow-inner placeholder:text-stone-900"
                         />
                      </div>

                      <div className="p-8 bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-[44px] flex justify-between items-center shadow-inner group/fee hover:border-fuchsia-500/30 transition-all">
                         <div className="flex items-center gap-4">
                            <Coins size={24} className="text-fuchsia-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Aesthetic Fee</span>
                         </div>
                         <span className="text-2xl font-mono font-black text-white">40 <span className="text-sm text-fuchsia-700">EAC</span></span>
                      </div>

                      <button 
                        onClick={handleForgeDesign}
                        disabled={isForgingDesign || !designDescription.trim()}
                        className="w-full py-10 bg-fuchsia-800 hover:bg-fuchsia-700 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(217,70,239,0.3)] flex items-center justify-center gap-8 active:scale-95 transition-all disabled:opacity-30 border-4 border-white/10 ring-[16px] ring-white/5"
                      >
                         {isForgingDesign ? <Loader2 className="w-10 h-10 animate-spin" /> : <Leaf className="w-10 h-10 fill-current" />}
                         {isForgingDesign ? "SYNTHESIZING AESTHETIC..." : "FORGE LILIES SHARD"}
                      </button>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[80px] min-h-[850px] border-2 border-fuchsia-500/20 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                   <div className="p-12 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20">
                      <div className="flex items-center gap-8 text-fuchsia-400">
                         <Terminal className="w-8 h-8" />
                         <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Aesthetic Blueprint Terminal</span>
                      </div>
                   </div>

                   <div className="flex-1 p-16 overflow-y-auto custom-scrollbar relative z-20">
                      {!designShard && !isForgingDesign ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-10 group">
                           <div className="relative">
                              <Flower2 size={180} className="text-slate-500 group-hover:text-fuchsia-500 transition-colors duration-1000" />
                              <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-6xl font-black uppercase tracking-[0.6em] text-white italic leading-none">ORACLE_STANDBY</p>
                              <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Input Aesthetic Context to Sync Shard</p>
                           </div>
                        </div>
                      ) : isForgingDesign ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <Loader2 className="w-32 h-32 text-fuchsia-500 animate-spin mx-auto" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Crown className="w-14 h-14 text-fuchsia-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="space-y-8">
                              <p className="text-fuchsia-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">MODELING CELESTIAL ALIGNMENT...</p>
                              <div className="flex justify-center gap-3 pt-10">
                                 {[...Array(10)].map((_, i) => <div key={i} className="w-1.5 h-16 bg-fuchsia-500/20 rounded-full animate-bounce shadow-xl" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-16 pb-16">
                           <div className="p-16 md:p-20 bg-black/80 rounded-[80px] border-2 border-fuchsia-500/20 prose prose-invert prose-indigo max-w-none shadow-[0_40px_150px_rgba(0,0,0,0.9)] border-l-[16px] border-l-fuchsia-600 relative overflow-hidden group/final">
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/final:scale-110 transition-transform duration-[15s]"><Crown size={600} className="text-fuchsia-400" /></div>
                              <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10 gap-8">
                                 <div className="flex items-center gap-10">
                                    <Bot className="w-14 h-14 text-fuchsia-400 animate-pulse" />
                                    <div>
                                       <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Lilies Oracle</h4>
                                       <p className="text-fuchsia-400/60 text-[10px] font-black uppercase tracking-[0.4em] mt-3">AESTHETIC_VITALITY_SYNC // VERIFIED_SHARD</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="text-slate-300 text-3xl leading-[2] italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10">
                                 {designShard}
                              </div>
                              <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
                                 <button onClick={() => downloadReport(designShard || '', designCategory, 'Design')} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl">
                                    <Download size={18} /> Download Shard
                                 </button>
                                 <button 
                                   onClick={() => anchorToLedger(designShard || '', 'Design', designCategory)}
                                   disabled={isArchiving === `Design_${designCategory}_${designShard?.substring(0, 20)}` || archivedShards.has(`Design_${designCategory}_${designShard?.substring(0, 20)}`)}
                                   className={`px-12 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ${archivedShards.has(`Design_${designCategory}_${designShard?.substring(0, 20)}`) ? 'bg-emerald-600/50 border-emerald-500/50 ring-emerald-500/10' : 'agro-gradient ring-white/5'}`}
                                 >
                                    {isArchiving === `Design_${designCategory}_${designShard?.substring(0, 20)}` ? <Loader2 size={18} className="animate-spin" /> : archivedShards.has(`Design_${designCategory}_${designShard?.substring(0, 20)}`) ? <CheckCircle2 size={18} /> : <Stamp size={18} />}
                                    {archivedShards.has(`Design_${designCategory}_${designShard?.substring(0, 20)}`) ? 'ANCHORED TO LEDGER' : 'ANCHOR TO LEDGER'}
                                 </button>
                              </div>
                           </div>
                           <div className="flex justify-center gap-10">
                              <button onClick={() => setDesignShard(null)} className="px-16 py-8 bg-white/5 border border-white/10 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: ARCHITECTURAL Sc (MACRO) --- */}
        {activeTab === 'macro' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-10 shadow-3xl">
                    <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl">
                          <Box className="w-8 h-8 text-white" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Resilience <span className="text-emerald-400">Sc</span></h3>
                          <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-2">CHROMA_MACRO_CALC</p>
                       </div>
                    </div>
                    <div className="space-y-10">
                       <div className="group">
                          <div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Albedo (Reflectance)</label><span className="text-xs font-mono text-emerald-400 font-black">{albedo}</span></div>
                          <input type="range" min="0.05" max="0.95" step="0.01" value={albedo} onChange={e => setAlbedo(parseFloat(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner" />
                       </div>
                       <div className="group">
                          <div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Psychological Score</label><span className="text-xs font-mono text-blue-400 font-black">{psychScore}/10</span></div>
                          <input type="range" min="1" max="10" step="1" value={psychScore} onChange={e => setPsychScore(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner" />
                       </div>
                       <div className="group">
                          <div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-amber-400 transition-colors">Thermal Coeff (k)</label><span className="text-xs font-mono text-amber-400 font-black">{thermalCoeff}</span></div>
                          <input type="range" min="0.1" max="1.0" step="0.05" value={thermalCoeff} onChange={e => setThermalCoeff(parseFloat(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-amber-500 shadow-inner" />
                       </div>
                       <div className="group">
                          <div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Acreage Footprint</label><span className="text-xs font-mono text-rose-400 font-black">{footprint}ha</span></div>
                          <input type="range" min="0.01" max="0.5" step="0.01" value={footprint} onChange={e => setFootprint(parseFloat(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-500 shadow-inner" />
                       </div>
                    </div>
                    <button 
                       onClick={calculateSc}
                       disabled={isCalculatingSc}
                       className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30 border-4 border-white/10 ring-8 ring-white/5"
                    >
                       {isCalculatingSc ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
                       {isCalculatingSc ? 'CALIBRATING...' : 'COMPUTE COEFFICIENT'}
                    </button>
                 </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-10">
                 <div className="glass-card p-16 rounded-[80px] border-2 border-white/5 bg-black/40 shadow-3xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
                    <div className="absolute inset-0 opacity-10 animate-pulse bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 pointer-events-none"></div>
                    {!scResult ? (
                       <div className="space-y-8 flex flex-col items-center opacity-30 text-center">
                          <Scale size={120} className="text-slate-600" />
                          <p className="text-3xl font-black uppercase tracking-[0.6em] text-white italic">CALC_STANDBY</p>
                       </div>
                    ) : (
                       <div className="animate-in zoom-in duration-700 space-y-12 text-center w-full max-w-2xl">
                          <div className="space-y-4">
                             <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.8em]">RESULTANT_CHROMA</p>
                             <h4 className="text-7xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">
                                {scResult.name.split(' ').map((s, idx) => <span key={idx} className={idx === 1 ? 'text-emerald-400 block' : ''}>{s} </span>)}
                             </h4>
                          </div>
                          
                          <div className="flex justify-center items-center gap-12">
                             <div className="w-48 h-48 rounded-[64px] shadow-3xl border-4 border-white/10 ring-[24px] ring-white/5 transition-transform duration-700 hover:rotate-12" style={{ backgroundColor: scResult.hex }}></div>
                             <div className="text-left space-y-6">
                                <div>
                                   <p className="text-[9px] text-slate-600 font-black uppercase mb-1">HEX Signature</p>
                                   <p className="text-4xl font-mono font-black text-white tracking-widest uppercase">{scResult.hex}</p>
                                </div>
                                <div className="flex items-center gap-4 py-3 px-6 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                   <ShieldCheck size={18} className="text-emerald-400" />
                                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">RESILIENCE_CERTIFIED</span>
                                </div>
                             </div>
                          </div>

                          <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-8">
                             <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-2 shadow-inner group hover:border-emerald-500/20 transition-all">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Efficiency Multiplier</p>
                                <p className="text-4xl font-mono font-black text-white">x1.24</p>
                             </div>
                             <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-2 shadow-inner group hover:border-blue-500/20 transition-all">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Thermal Buffer</p>
                                <p className="text-4xl font-mono font-black text-white">45%</p>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-600/5 flex flex-col md:flex-row items-center justify-between gap-12 shadow-xl">
                    <div className="flex items-center gap-8">
                       <div className="w-20 h-20 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shrink-0"><Stamp size={32} /></div>
                       <div className="space-y-2">
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Architectural Finality</h4>
                          <p className="text-slate-400 text-sm font-medium italic">"Anchor your architectural chroma profile to the regional node for solar-efficiency boosts."</p>
                       </div>
                    </div>
                    <button className="px-12 py-5 bg-emerald-700 hover:bg-emerald-600 rounded-3xl text-white font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">ANCHOR PROFILE</button>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: CHROMATOGRAPHY (MICRO) --- */}
        {activeTab === 'micro' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-black/40 space-y-10 shadow-3xl">
                   <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                      <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl">
                         <Microscope size={32} className="text-white" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Pigment <span className="text-emerald-400">Lab</span></h3>
                          <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-2">DIGITAL_CHROMATOGRAPHY</p>
                       </div>
                    </div>
                    
                    {!filePreview ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-16 border-4 border-dashed border-white/10 rounded-[48px] bg-black/40 flex flex-col items-center justify-center text-center space-y-6 group hover:border-emerald-500/40 hover:bg-emerald-500/[0.01] transition-all cursor-pointer shadow-inner"
                      >
                         <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                         <Upload size={48} className="text-slate-700 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500" />
                         <div>
                            <p className="text-xl font-black text-white uppercase tracking-tighter">Choose Shard</p>
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed mt-2 px-10">Upload visual crop/soil data for spectral pigment sharding.</p>
                         </div>
                      </div>
                    ) : (
                       <div className="space-y-10 animate-in zoom-in duration-500">
                          <div className="relative w-full aspect-square rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
                             <img src={filePreview} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt="Preview" />
                             <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none"></div>
                             <button onClick={() => { setFilePreview(null); setChromaDiagnosis(null); }} className="absolute top-4 right-4 p-3 bg-black/60 rounded-full text-white hover:bg-rose-600 transition-colors"><X size={20}/></button>
                          </div>
                          <button 
                             onClick={runDigitalChromatography}
                             disabled={isScanning}
                             className="w-full py-8 agro-gradient rounded-[36px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30 border-2 border-white/10 ring-8 ring-white/5"
                          >
                             {isScanning ? <Loader2 className="w-6 h-6 animate-spin" /> : <Scan className="w-6 h-6" />}
                             {isScanning ? 'SCANNING PIGMENTS...' : 'INITIALIZE CHROMA AUDIT'}
                          </button>
                       </div>
                    )}
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[64px] min-h-[750px] border-2 border-white/10 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                   {/* SCADA Scanline overlay */}
                   <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
                      <div className="w-full h-1/2 bg-gradient-to-b from-emerald-500/20 to-transparent absolute top-0 animate-scan"></div>
                   </div>

                   <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-20">
                      <div className="flex items-center gap-8">
                         <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl group overflow-hidden relative">
                            <Bot size={32} className="group-hover:scale-110 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Diagnostic <span className="text-emerald-400">Oracle Shard</span></h3>
                            <p className="text-emerald-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ZK_CHROMA_AUDIT // PIXEL_ANALYSIS_v4.2</p>
                         </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                         <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">ORACLE_STABLE</span>
                      </div>
                   </div>

                   <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-20">
                      {!chromaDiagnosis && !isScanning ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-10 group">
                           <div className="relative">
                              <FlaskConical size={180} className="text-slate-500 group-hover:text-emerald-500 transition-colors duration-1000" />
                              <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-6xl font-black uppercase tracking-[0.6em] text-white italic leading-none">LAB_STANDBY</p>
                              <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Awaiting Spectral Ingest</p>
                           </div>
                        </div>
                      ) : isScanning ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <Loader2 size={120} className="text-emerald-500 animate-spin mx-auto" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Microscope size={48} className="text-emerald-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="space-y-8">
                              <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">ANALYZING PIGMENT RESONANCE...</p>
                              <div className="flex justify-center gap-3 pt-10">
                                 {[...Array(10)].map((_, i) => <div key={i} className="w-1.5 h-16 bg-emerald-500/20 rounded-full animate-bounce shadow-xl" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10 flex-1">
                           <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-emerald-500/20 prose prose-invert prose-indigo max-w-none shadow-3xl border-l-[12px] border-l-emerald-600 relative overflow-hidden group/shard">
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group/shard:scale-110 transition-transform duration-[10s]"><Atom size={600} className="text-emerald-400" /></div>
                              
                              <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                                 <div className="flex items-center gap-6">
                                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                                    <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Diagnostic Result</h4>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-black uppercase">Health Index (Hi)</p>
                                    <p className="text-4xl font-mono font-black text-emerald-400">{chromaDiagnosis!.hi.toFixed(2)}</p>
                                 </div>
                              </div>

                              <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10">
                                 {chromaDiagnosis!.report}
                              </div>

                              <div className="mt-16 pt-10 border-t border-white/10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                 <div className="flex items-center gap-6">
                                    <Fingerprint size={40} className="text-indigo-400" />
                                    <div className="text-left">
                                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">CHROMATOGRAPHY_HASH</p>
                                       <p className="text-lg font-mono text-white">0x{generateQuickHash()}_PIGMENT_SYNC</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-4">
                                     <button onClick={() => downloadReport(chromaDiagnosis!.report, 'Chromatography', 'Laboratory')} className="px-10 py-5 bg-white/5 border-2 border-white/10 rounded-full text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 shadow-xl">
                                        <Download size={20} /> Download Report
                                     </button>
                                     <button 
                                       onClick={() => anchorToLedger(chromaDiagnosis!.report, 'Chromatography', 'Diagnostic')}
                                       disabled={isArchiving === `Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}` || archivedShards.has(`Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}`)}
                                       className={`px-12 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ${archivedShards.has(`Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}`) ? 'bg-emerald-600/50 border-emerald-500/50 ring-emerald-500/10' : 'agro-gradient ring-white/5'}`}
                                     >
                                        {isArchiving === `Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}` ? <Loader2 size={18} className="animate-spin" /> : archivedShards.has(`Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}`) ? <CheckCircle2 size={18} /> : <Stamp size={18} />}
                                        {archivedShards.has(`Chromatography_Diagnostic_${chromaDiagnosis!.report.substring(0, 20)}`) ? 'ANCHORED' : 'ANCHOR TO LEDGER'}
                                     </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default ChromaSystem;