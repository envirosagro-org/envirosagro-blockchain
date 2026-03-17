
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Microscope, 
  FlaskConical, 
  Zap, 
  Bot, 
  Leaf, 
  Loader2, 
  Search, 
  PlusCircle, 
  Download, 
  Database, 
  ChevronRight, 
  Award, 
  History, 
  ArrowUpRight, 
  FileText, 
  Cpu, 
  Wifi, 
  Activity, 
  ShieldCheck, 
  X, 
  Upload, 
  Coins, 
  Star, 
  TrendingUp, 
  MessageSquare,
  Binary,
  Lightbulb,
  CheckCircle2, 
  Trash2, 
  Bookmark, 
  FileJson, 
  Eye, 
  FileDown, 
  Paperclip, 
  FileUp, 
  CloudUpload, 
  Link2, 
  RefreshCw, 
  Library, 
  ScrollText, 
  Dna, 
  Atom, 
  Wind, 
  Info, 
  Stamp, 
  Terminal, 
  BookOpen, 
  LayoutGrid, 
  Target, 
  ArrowRight, 
  GripVertical, 
  BookMarked, 
  Layers, 
  ArrowDownCircle, 
  FileSignature, 
  FileDigit, 
  Waves, 
  Heart, 
  User as UserIcon, 
  ChevronDown, 
  ShoppingBag, 
  // Added PencilRuler to fix "Cannot find name 'PencilRuler'" error on line 720
  PencilRuler
} from 'lucide-react';
import { User, ResearchPaper, AgroBook, ChapterShard, VendorProduct } from '../types';
import { generateAgroResearch, analyzeMedia, chatWithAgroLang } from '../services/agroLangService';
import { saveCollectionItem, listenToCollection } from '../services/firebaseService';
import { generateAlphanumericId } from '../systemFunctions';

interface ResearchInnovationProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: any, section?: string) => void;
  pendingAction?: string | null;
  clearAction?: () => void;
}

const INITIAL_PATENTS: ResearchPaper[] = [
  { 
    id: 'PAT-8821', 
    title: 'Plant Wave Bio-Electric Modulation v1.2', 
    author: 'Dr. Sarah Chen', 
    authorEsin: 'EA-2024-X821', 
    abstract: 'Standardizing 432Hz ultrasonic sharding for soil molecular repair. Identifies specific voltage signatures required for root-level nutrient intake acceleration.', 
    content: 'Full content archived in Ledger. Analysis shows 14% boost in biomass in controlled environments.', 
    thrust: 'Technological', 
    status: 'Invention', 
    impactScore: 94, 
    rating: 4.8, 
    eacRewards: 1250, 
    timestamp: '2d ago',
    iotDataUsed: true
  },
  { 
    id: 'PAT-9104', 
    title: 'Bantu Soil Biome Heritage Mapping', 
    author: 'Steward Nairobi', 
    authorEsin: 'EA-2023-P991', 
    abstract: 'Cross-analyzing ancestral lineages with spectral IoT data shards. Mapping the resilience of drought-resistant seeds across Zone 4.', 
    content: 'Full experimental content archived in Ledger...', 
    thrust: 'Societal', 
    status: 'Registered', 
    impactScore: 88, 
    rating: 4.5, 
    eacRewards: 450, 
    timestamp: '5d ago',
    iotDataUsed: true
  },
];

const ResearchInnovation: React.FC<ResearchInnovationProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate, pendingAction, clearAction }) => {
  const [activeTab, setActiveTab] = useState<'forge' | 'archive' | 'book_forge'>('archive');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isExtractingIot, setIsExtractingIot] = useState(false);
  
  const [researchTitle, setResearchTitle] = useState('');
  const [researchThrust, setResearchThrust] = useState('Technological');
  const [iotTelemetry, setIotTelemetry] = useState<any>(null);
  const [externalData, setExternalData] = useState('');
  const [researchOutput, setResearchOutput] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [archive, setArchive] = useState<ResearchPaper[]>(INITIAL_PATENTS);
  const [publishedBooks, setPublishedBooks] = useState<AgroBook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- BOOK FORGE (AgroInPDF) STATES ---
  const [bookTitle, setBookTitle] = useState('');
  const [chapterPile, setChapterPile] = useState<ChapterShard[]>([]);
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [topicPrompt, setTopicPrompt] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const unsubBooks = listenToCollection('books', setPublishedBooks);
    return () => unsubBooks();
  }, []);

  useEffect(() => {
    if (pendingAction === 'OPEN_ARCHIVE') {
      setActiveTab('archive');
      if (clearAction) clearAction();
    }
  }, [pendingAction, clearAction]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFilePreview(base64String);
        setFileBase64(base64String.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const extractIotData = () => {
    setIsExtractingIot(true);
    setTimeout(() => {
      const mockIot = {
        node: "EA-ZONE4-NE",
        sensors: [
          { type: 'Soil_Moisture', val: 64.2, status: 'Nominal' },
          { type: 'C(a)_Multiplier', val: 1.42, unit: 'x' }
        ],
        timestamp: new Date().toISOString()
      };
      setIotTelemetry(mockIot);
      setIsExtractingIot(false);
    }, 1500);
  };

  const runSynthesis = async () => {
    if (!researchTitle) return alert("Title required.");
    const fee = 50;
    if (!await onSpendEAC(fee, 'RESEARCH_SYNTHESIS_FEE')) return;
    setIsSynthesizing(true);
    setResearchOutput(null);
    try {
      let responseText = "";
      if (fileBase64) {
        const prompt = `Act as an EnvirosAgro Senior Research Scientist. Using the attached reference shard and the following inputs, forge a formal research paper:
        Title: ${researchTitle}
        Thrust: ${researchThrust}
        IoT Data: ${JSON.stringify(iotTelemetry)}
        Additional Context: ${externalData}
        Synthesize the visual/document data with the technical telemetry to predict C(a) index impact. Use markdown.`;
        responseText = await analyzeMedia(fileBase64, selectedFile?.type || 'image/jpeg', prompt);
      } else {
        const response = await generateAgroResearch(researchTitle, researchThrust, iotTelemetry, externalData || "Standard registry context.");
        responseText = response.text;
      }
      setResearchOutput(responseText);
    } catch (e) {
      setResearchOutput("Oracle synthesis failed. Please check network link.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const registerResearch = async () => {
    if (!researchOutput) return;
    const newPaper: ResearchPaper = {
      id: `PAT-${generateAlphanumericId(7)}`,
      title: researchTitle,
      author: user.name,
      authorEsin: user.esin,
      abstract: researchOutput.substring(0, 200) + "...",
      content: researchOutput,
      thrust: researchThrust,
      status: 'Registered',
      impactScore: 0,
      rating: 0,
      eacRewards: 100,
      timestamp: new Date().toISOString(),
      iotDataUsed: !!iotTelemetry
    };
    await saveCollectionItem('patents', newPaper);
    onEarnEAC(100, 'RESEARCH_REGISTRATION_BONUS');
    setResearchOutput(null);
    setResearchTitle('');
    setSelectedFile(null);
    setFileBase64(null);
    setActiveTab('archive');
  };

  // --- AGROINPDF BOOK FORGING LOGIC ---
  const handleGenerateTopic = async () => {
    if (!topicPrompt.trim()) return;
    const fee = 10;
    if (!await onSpendEAC(fee, 'AGRO_IN_PDF_TOPIC_INGEST')) return;

    setIsGeneratingTopic(true);
    try {
      const prompt = `Act as the AgroInPDF Oracle. Generate a deep, technical agricultural research topic shard for a book based on: "${topicPrompt}". 
      Format: TECHNICAL_SHARD.
      Content: 4 detailed paragraphs in Markdown. 
      Context: EnvirosAgro Sustainability Framework (m-constant, C(a)).`;
      const response = await chatWithAgroLang(prompt, []);
      
      const newChapter: ChapterShard = {
        id: `CH-${Date.now()}`,
        title: topicPrompt.toUpperCase(),
        content: response.text,
        sequence: chapterPile.length + 1,
        timestamp: new Date().toISOString()
      };
      
      setChapterPile(prev => [...prev, newChapter]);
      setTopicPrompt('');
    } catch (e) {
      alert("Oracle congestion. Topic lost.");
    } finally {
      setIsGeneratingTopic(false);
    }
  };

  const removeChapter = (id: string) => {
    setChapterPile(prev => prev.filter(ch => ch.id !== id).map((ch, i) => ({ ...ch, sequence: i + 1 })));
  };

  const handlePublishBook = async () => {
    if (!bookTitle || chapterPile.length === 0) return;
    const publishingFee = 150;
    if (!await onSpendEAC(publishingFee, `AGRO_IN_PDF_BOOK_PUBLICATION_${bookTitle}`)) return;

    setIsPublishing(true);
    try {
      const newBook: AgroBook = {
        id: `BOOK-${Date.now()}-${generateAlphanumericId(7)}`,
        title: bookTitle,
        authorEsin: user.esin,
        authorName: user.name,
        abstract: chapterPile[0].content.substring(0, 150) + "...",
        chapters: chapterPile,
        status: 'Published',
        price: 450, // Base price
        views: 0,
        vouches: 0,
        downloads: 0,
        thrust: 'Industry',
        timestamp: new Date().toISOString(),
        impactMatrix: {
          societal: 20, environmental: 40, human: 10, technological: 20, industry: 10
        }
      };

      await saveCollectionItem('books', newBook);
      
      // Auto-list to Market Cloud as a Vendor Product
      const marketProduct: VendorProduct = {
        id: newBook.id,
        name: `BOOK: ${newBook.title}`,
        description: newBook.abstract,
        price: newBook.price,
        stock: 9999, // Digital asset
        category: 'Book',
        supplierEsin: user.esin,
        supplierName: user.name,
        supplierType: 'AUTHOR',
        status: 'AUTHORIZED',
        timestamp: new Date().toISOString(),
        thrust: newBook.thrust
      };
      await saveCollectionItem('products', marketProduct);

      onEarnEAC(200, 'AGRO_IN_PDF_PUBLICATION_BONUS');
      setBookTitle('');
      setChapterPile([]);
      setActiveTab('archive');
    } catch (e) {
      alert("Publishing handshake failed.");
    } finally {
      setIsPublishing(false);
    }
  };

  const downloadBook = (book: AgroBook) => {
    const content = `
ENVIROSAGRO™ AGRO_IN_PDF_SHARD
TITLE: ${book.title}
AUTHOR: ${book.authorName} (${book.authorEsin})
ID: ${book.id}
TIMESTAMP: ${book.timestamp}
================================

${book.chapters.map(ch => `CHAPTER ${ch.sequence}: ${ch.title}\n\n${ch.content}\n\n----------------`).join('\n\n')}

(c) 2025 EnvirosAgro Organizational Registry. Immutable Shard.
    `;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/\s+/g, '_')}_AgroInPDF.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      
      {/* Header Section */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/10 bg-black/40 relative overflow-hidden flex flex-col items-center text-center space-y-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform">
           <Microscope className="w-96 h-96 text-white" />
        </div>
        
        <div className="w-36 h-36 rounded-[48px] bg-emerald-500/90 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)] shrink-0">
           <ScrollText className="w-16 h-16 text-white" />
        </div>

        <div className="space-y-4 max-w-3xl relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em]">Invention Ledger v4.2</span>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Research <span className="text-emerald-400">& Innovation</span></h2>
          </div>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
            Forge the future of agriculture. Access the global patent archive or synthesize raw IoT telemetry into immutable research papers and technical books.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4 relative z-10">
          <button 
            onClick={() => setActiveTab('archive')}
            className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'archive' ? 'bg-emerald-600 text-white shadow-xl border border-emerald-400/50' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            Invention Archive
          </button>
          <button 
            onClick={() => setActiveTab('forge')}
            className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'forge' ? 'bg-indigo-600 text-white shadow-xl border border-indigo-400/50' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            Research Forge
          </button>
          <button 
            onClick={() => setActiveTab('book_forge')}
            className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'book_forge' ? 'bg-fuchsia-600 text-white shadow-xl border border-fuchsia-400/50' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            Book Forge (AgroInPDF)
          </button>
          <button 
            onClick={() => onNavigate('multimedia_generator')}
            className="px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white shadow-xl flex items-center gap-3"
          >
            <Leaf size={14} /> Multimedia Forge
          </button>
        </div>
      </div>

      {activeTab === 'archive' && (
        <div className="space-y-16 animate-in slide-in-from-bottom-4 duration-500">
           <div className="relative group w-full max-w-4xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Query patent shards, authors or technical books..." 
                className="w-full bg-black/40 border border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium placeholder:text-slate-700 shadow-inner"
              />
           </div>

           <div className="space-y-8">
              <div className="flex items-center gap-4 px-6">
                 <BookMarked size={20} className="text-fuchsia-400" />
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest">AgroInPDF <span className="text-fuchsia-400">Library</span></h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {publishedBooks.length === 0 ? (
                    <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-[48px] text-center opacity-20">
                       <BookOpen size={64} className="mx-auto mb-4" />
                       <p className="text-lg font-black uppercase tracking-[0.4em]">Library Buffer Clear</p>
                    </div>
                 ) : (
                    publishedBooks.map(book => (
                       <div key={book.id} className="glass-card p-10 rounded-[56px] border-2 border-white/5 hover:border-fuchsia-500/30 transition-all group flex flex-col h-[550px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99]">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Database size={300} /></div>
                          <div className="flex justify-between items-start mb-8 relative z-10">
                             <div className="p-4 rounded-2xl bg-fuchsia-600/10 border border-fuchsia-500/20 text-fuchsia-400 shadow-2xl group-hover:rotate-6 transition-all">
                                <BookOpen size={32} />
                             </div>
                             <div className="text-right">
                                <span className="px-4 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 text-[9px] font-black uppercase rounded-full border border-fuchsia-500/20 tracking-widest">PUBLISHED</span>
                             </div>
                          </div>
                          <div className="flex-1 space-y-6 relative z-10">
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-fuchsia-400 transition-colors">{book.title}</h4>
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">AUTHOR: {book.authorName}</p>
                             <p className="text-sm text-slate-400 italic leading-relaxed opacity-80 group-hover:opacity-100 line-clamp-4">"{book.abstract}"</p>
                             
                             <div className="grid grid-cols-3 gap-2 pt-4">
                                <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                                   <p className="text-[8px] text-slate-600 font-black uppercase">Views</p>
                                   <p className="text-lg font-mono font-black text-white">{book.views + 42}</p>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                                   <p className="text-[8px] text-slate-600 font-black uppercase">Vouches</p>
                                   <p className="text-lg font-mono font-black text-emerald-400">{book.vouches + 12}</p>
                                </div>
                                <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                                   <p className="text-[8px] text-slate-600 font-black uppercase">Shard Value</p>
                                   <p className="text-lg font-mono font-black text-amber-500">{(book.price + (book.vouches * 2)).toFixed(0)}</p>
                                </div>
                             </div>
                          </div>
                          <div className="mt-10 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                             <button onClick={() => downloadBook(book)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2">
                                <Download size={14} /> MD_EXPORT
                             </button>
                             <button onClick={() => onNavigate('economy')} className="flex-1 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/10">
                                <ShoppingBag size={14} /> BUY_ACCESS
                             </button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

           <div className="space-y-8 pt-12">
              <div className="flex items-center gap-4 px-6">
                 <Stamp size={20} className="text-emerald-400" />
                 <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Technical <span className="text-emerald-400">Patents</span></h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {archive.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((paper) => (
                  <div key={paper.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-emerald-500/20 transition-all group flex flex-col h-full bg-black/20 shadow-xl relative overflow-hidden">
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                           <ScrollText className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <span className={`px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20 tracking-widest`}>{paper.status.toUpperCase()}</span>
                          <p className="text-[10px] text-slate-700 font-mono font-bold tracking-widest uppercase">{paper.id}</p>
                        </div>
                     </div>
                     <div className="flex-1 space-y-4 relative z-10">
                        <h4 className="text-3xl font-black text-white uppercase italic tracking-tight leading-tight group-hover:text-emerald-400 transition-colors m-0">{paper.title}</h4>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Published By: {paper.author}</p>
                        <p className="text-sm text-slate-400 leading-relaxed italic mt-6 opacity-80 font-medium">"{paper.abstract}"</p>
                     </div>
                     <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2 text-amber-500">
                          <Star size={16} fill="currentColor" />
                          <span className="text-xs font-mono font-black text-white">{paper.rating}</span>
                        </div>
                        <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all shadow-xl active:scale-90"><Download size={20} /></button>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}

      {/* --- TAB: RESEARCH SHARD FORGE --- */}
      {activeTab === 'forge' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-500">
           <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-8 rounded-[40px] border-indigo-500/20 bg-indigo-900/5 space-y-8 relative overflow-hidden shadow-xl">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl"><Zap className="w-5 h-5 text-white fill-current" /></div>
                   <h3 className="font-black text-white uppercase text-xs tracking-widest italic">Forge Ingest</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Research Designation</label>
                    <input type="text" value={researchTitle} onChange={e => setResearchTitle(e.target.value)} placeholder="e.g. Ultrasonic Soil Repair..." className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white focus:ring-4 focus:ring-indigo-500/10 font-bold placeholder:text-stone-900 shadow-inner" />
                  </div>
                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Pillar Focus</label>
                    <select value={researchThrust} onChange={e => setResearchThrust(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-500/10">
                      <option>Technological</option><option>Environmental</option><option>Societal</option><option>Industry</option><option>Human</option>
                    </select>
                  </div>
                  <div className="pt-4 px-2">
                    <button onClick={extractIotData} disabled={isExtractingIot} className="w-full py-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl text-blue-400 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg">{isExtractingIot ? <Loader2 size={12} className="animate-spin" /> : <Wifi size={12} />} Link Local IoT Shards</button>
                    {iotTelemetry && (
                      <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in zoom-in">
                         <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2"><CheckCircle2 size={10} /> Shards Sync'd</p>
                         <p className="text-[10px] text-slate-300 font-mono italic">Node: {iotTelemetry.node}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5 space-y-4">
                   <button onClick={runSynthesis} disabled={isSynthesizing || !researchTitle} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 border-4 border-white/10 ring-8 ring-white/5">
                      {isSynthesizing ? <Loader2 size={24} className="animate-spin" /> : <FlaskConical size={24} />} FORGE SHARD
                   </button>
                </div>
              </div>
           </div>

           <div className="lg:col-span-3 flex flex-col space-y-8">
              <div className="glass-card rounded-[56px] border-2 border-white/5 bg-black/20 flex flex-col flex-1 relative overflow-hidden shadow-3xl">
                 <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 px-14">
                    <div className="flex items-center gap-6 text-indigo-400">
                       <Terminal className="w-6 h-6" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Invention Oracle Terminal</span>
                    </div>
                    {researchOutput && (
                       <button onClick={registerResearch} className="px-8 py-3 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 border border-white/10">
                          <Stamp size={14} /> Anchor to Registry
                       </button>
                    )}
                 </div>
                 <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative bg-[#050706]">
                    {!researchOutput && !isSynthesizing ? (
                       <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-10">
                          <Bot size={140} className="text-slate-500" />
                          <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic leading-none">FORGE_STANDBY</p>
                       </div>
                    ) : isSynthesizing ? (
                       <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in">
                          <Loader2 size={120} className="text-indigo-500 animate-spin" />
                          <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">MAPPING ENERGY PATTERNS...</p>
                       </div>
                    ) : (
                       <div className="animate-in slide-in-from-bottom-10 duration-1000 pb-10">
                          <div className="p-12 bg-black/60 rounded-[64px] border border-indigo-500/20 shadow-inner border-l-8 border-l-indigo-600 relative overflow-hidden group/final">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/final:scale-110 transition-transform"><Database size={400} /></div>
                             <div className="flex items-center gap-4 mb-10 border-white/5 pb-6">
                                <FileText className="w-8 h-8 text-indigo-400" />
                                <h4 className="text-2xl font-black text-white uppercase italic m-0">Generated Research Shard</h4>
                             </div>
                             <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-xl leading-loose italic whitespace-pre-line font-medium relative z-10 pl-6 border-l border-white/5">
                                {researchOutput}
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- TAB: BOOK FORGE (AgroInPDF) --- */}
      {activeTab === 'book_forge' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in zoom-in duration-500">
           
           {/* Left Control Column */}
           <div className="xl:col-span-4 space-y-8">
              <div className="glass-card p-10 rounded-[56px] border-fuchsia-500/20 bg-fuchsia-950/5 space-y-10 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s]"><BookOpen size={400} className="text-fuchsia-500" /></div>
                 
                 <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8">
                    <div className="p-5 bg-fuchsia-600 rounded-3xl shadow-3xl border-2 border-white/10 group-hover:rotate-12 transition-transform">
                       <FileDigit className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">AgroInPDF <span className="text-fuchsia-400">Forge</span></h3>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.4em] mt-3 italic">BOOK_SYNTHESIS_v4</p>
                    </div>
                 </div>

                 <div className="space-y-8 relative z-10">
                    <div className="space-y-3 px-2">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block">Manuscript Title</label>
                       <input 
                         type="text" value={bookTitle} onChange={e => setBookTitle(e.target.value)}
                         placeholder="The Bantu Agricultural Oracle..."
                         className="w-full bg-black/60 border-2 border-white/5 rounded-[32px] py-6 px-8 text-2xl font-bold text-white focus:ring-8 focus:ring-fuchsia-500/5 outline-none transition-all placeholder:text-stone-900 italic shadow-inner" 
                       />
                    </div>

                    <div className="space-y-6 pt-6 border-t border-white/5">
                       <div className="flex items-center gap-4 px-4">
                          <Bot size={20} className="text-fuchsia-400" />
                          <h5 className="text-sm font-black text-white uppercase italic tracking-widest leading-none">Generate Topic Shard</h5>
                       </div>
                       <div className="space-y-4 px-2">
                          <textarea 
                             value={topicPrompt} onChange={e => setTopicPrompt(e.target.value)}
                             placeholder="Describe a technical topic (e.g. Sub-soil acoustic remediation)..."
                             className="w-full bg-black/80 border-2 border-white/5 rounded-[40px] p-8 text-white text-lg font-medium italic focus:ring-8 focus:ring-fuchsia-500/5 outline-none transition-all h-40 resize-none shadow-inner placeholder:text-stone-900"
                          />
                          <button 
                             onClick={handleGenerateTopic}
                             disabled={isGeneratingTopic || !topicPrompt.trim()}
                             className="w-full py-8 bg-fuchsia-800 hover:bg-fuchsia-700 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(217,70,239,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30 border-4 border-white/10 ring-[16px] ring-fuchsia-500/5"
                          >
                             {isGeneratingTopic ? <Loader2 size={80} className="w-8 h-8 animate-spin" /> : <Leaf size={18} className="w-8 h-8" />}
                             {isGeneratingTopic ? 'SHARDING...' : 'GENERATE CHAPTER'}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Matrix Metadata Card */}
              <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl group">
                 <h4 className="text-xl font-black text-white uppercase italic tracking-widest px-4 flex items-center gap-4">
                    <Target size={24} className="text-blue-400" /> Impact <span className="text-blue-400">Matrix</span>
                 </h4>
                 <div className="space-y-6">
                    {[
                       { id: 'S', label: 'Societal Impact', val: 84, col: 'bg-rose-500 shadow-rose-500/20' },
                       { id: 'E', label: 'Enviro Resonance', val: 92, col: 'bg-emerald-500 shadow-emerald-500/20' },
                       { id: 'T', label: 'Tech Innovation', val: 78, col: 'bg-blue-500 shadow-blue-500/20' },
                    ].map(m => (
                       <div key={m.id} className="space-y-3 px-2 group/met">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                             <span className="text-slate-600 group-hover/met:text-slate-200 transition-colors">{m.label}</span>
                             <span className="text-white font-mono">{m.val}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                             <div className={`h-full rounded-full transition-all duration-[3s] ${m.col}`} style={{ width: `${m.val}%` }}></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right Sequence Matrix Area */}
           <div className="xl:col-span-8 flex flex-col space-y-8">
              <div className="glass-card rounded-[80px] min-h-[850px] border-2 border-white/5 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                 <div className="p-12 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20 px-16">
                    <div className="flex items-center gap-8 text-fuchsia-400">
                       <Layers className="w-8 h-8" />
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Manuscript <span className="text-fuchsia-400">Sequence Matrix</span></h3>
                    </div>
                    {chapterPile.length > 0 && (
                       <div className="flex gap-4">
                          <button onClick={() => setChapterPile([])} className="p-5 bg-white/5 border border-white/10 rounded-full text-slate-700 hover:text-rose-500 transition-all shadow-xl active:scale-90"><Trash2 size={24} /></button>
                          <button 
                             onClick={handlePublishBook}
                             disabled={!bookTitle || isPublishing}
                             className="px-14 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.5em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 border-2 border-white/10 ring-[12px] ring-white/5 disabled:opacity-30"
                          >
                             {isPublishing ? <Loader2 size={20} className="animate-spin" /> : <Stamp size={20} />}
                             {isPublishing ? 'VETTING_SHARDS...' : 'PUBLISH & LIST'}
                          </button>
                       </div>
                    )}
                 </div>

                 <div className="flex-1 p-12 md:p-20 overflow-y-auto custom-scrollbar relative z-10 flex flex-col bg-black/20">
                    {chapterPile.length === 0 && !isGeneratingTopic ? (
                       <div className="flex-1 flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-10 group">
                          <div className="relative">
                             <Layers size={180} className="text-slate-500 group-hover:text-fuchsia-500 transition-colors duration-1000" />
                             <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                          </div>
                          <div className="space-y-4">
                             <p className="text-6xl font-black uppercase tracking-[0.6em] text-white italic leading-none">PILLAR_EMPTY</p>
                             <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Pile up research shards to build your book</p>
                          </div>
                       </div>
                    ) : (
                       <div className="space-y-10 pb-20">
                          {chapterPile.map((ch, i) => (
                             <div key={ch.id} className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/40 shadow-xl group/card relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                                <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover/card:bg-indigo-500/[0.03] transition-colors"></div>
                                <div className="flex justify-between items-start mb-10 relative z-10 border-b border-white/5 pb-8">
                                   <div className="flex items-center gap-8">
                                      <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white font-mono font-black text-2xl shadow-xl group-hover/card:scale-110 transition-transform">{ch.sequence}</div>
                                      <div>
                                         <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter group-hover/card:text-indigo-400 transition-colors">{ch.title}</h4>
                                         <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black tracking-widest italic">{ch.id} // SHARD_TIMESTAMP: {new Date(ch.timestamp).toLocaleTimeString()}</p>
                                      </div>
                                   </div>
                                   <button onClick={() => removeChapter(ch.id)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-800 hover:text-rose-500 transition-all opacity-0 group-hover/card:opacity-100"><X size={20}/></button>
                                </div>
                                <div className="prose prose-invert prose-indigo max-w-none text-slate-400 text-xl leading-[2.1] italic whitespace-pre-line font-medium relative z-10 pl-6 border-l-2 border-white/10">
                                   {ch.content}
                                </div>
                                <div className="mt-12 flex justify-end gap-6 relative z-10 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                   <button className="flex items-center gap-3 text-[11px] font-black text-slate-600 hover:text-white uppercase tracking-widest"><GripVertical size={16} /> RE_ORDER</button>
                                   <button className="flex items-center gap-3 text-[11px] font-black text-slate-600 hover:text-white uppercase tracking-widest"><PencilRuler size={16} /> MD_EDIT</button>
                                </div>
                             </div>
                          ))}
                          {isGeneratingTopic && (
                             <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-fuchsia-500/20 bg-fuchsia-950/10 flex flex-col items-center justify-center text-center space-y-10 animate-in slide-in-from-bottom-6 duration-700 shadow-3xl">
                                <div className="relative">
                                   <Loader2 size={120} className="text-fuchsia-500 animate-spin mx-auto" />
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <Leaf size={40} className="text-fuchsia-400 animate-pulse" />
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <p className="text-fuchsia-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">SYNTHESIZING_CHAPTER_LIFECYCLE...</p>
                                   <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">ORACLE_INGEST_v4.2 // AGRO_IN_PDF_SYNC</p>
                                </div>
                             </div>
                          )}
                       </div>
                    )}
                 </div>

                 <div className="p-10 border-t border-white/5 bg-black text-center shrink-0 z-20">
                    <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.8em] italic">Official AgroInPDF Manuscript Environment v6.5</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar-editor::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-editor::-webkit-scrollbar-thumb { background: rgba(232, 121, 249, 0.4); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ResearchInnovation;
