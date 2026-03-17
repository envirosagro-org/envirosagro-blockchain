
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, ShieldCheck, Activity, BadgeCheck, Globe, 
  Loader2, X, Plus, ShoppingCart, Trash2, Lock, Gem, TrendingUp, Building, 
  Bot, Landmark, Briefcase, Users, HardHat, Boxes, Cpu, ShieldPlus, Coins, 
  ArrowRightCircle, LayoutGrid, ChevronRight, CheckCircle2, BarChart3, 
  Network, ExternalLink, Zap, ArrowUpRight, Target, Share2, Package, 
  Truck, Box, ArrowLeft, ThumbsUp, LineChart as LineChartIcon, Signal, 
  History, Terminal, FileDigit, Waves, Stamp, ClipboardCheck, MoreVertical, 
  Monitor, Workflow, Radio, MapPin, ArrowRight, Wallet, Leaf, Binary, 
  Scale, Signature, FileSignature, Clock, BookOpen, Eye, Star, Download, 
  CreditCard, ChevronDown, Warehouse, Factory, PackageSearch, Receipt, 
  Music, Palette, Map as MapIcon,
  Database, Calculator, FlaskConical
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, 
  Area, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { User, ViewState, Order, VendorProduct, RegisteredUnit, AgroBook, LiveAgroProduct } from '../types';
import { predictMarketSentiment, AgroLangResponse, chatWithAgroLang } from '../services/agroLangService';
import { listenToCollection } from '../services/firebaseService';
import { generateQuickHash } from '../systemFunctions';

interface EconomyProps {
  user: User;
  isGuest: boolean;
  onEarnEAC?: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState, action?: string | null) => void;
  vendorProducts: VendorProduct[];
  liveProducts: LiveAgroProduct[];
  onPlaceOrder: (order: Partial<Order>) => void;
  projects: any[];
  contracts: any[];
  blueprints: any[];
  industrialUnits: RegisteredUnit[];
  onUpdateUser: (user: User) => void;
  notify: any;
  initialSection?: string | null;
}

const FORECAST_DATA = [
  { cycle: 'C8', actual: 420, predicted: 400, resonance: 0.84 },
  { cycle: 'C9', actual: 580, predicted: 550, resonance: 0.92 },
  { cycle: 'C10', actual: 740, predicted: 700, resonance: 0.88 },
  { cycle: 'C11', actual: 920, predicted: 900, resonance: 1.15 },
  { cycle: 'C12', actual: 1100, predicted: 1050, resonance: 1.05 },
  { cycle: 'C13', actual: 1284, predicted: 1250, resonance: 1.42 },
];

const CATEGORY_FORECAST = [
  { name: 'Hardware', growth: 12, demand: 85 },
  { name: 'Knowledge', growth: 45, demand: 98 },
  { name: 'Logistics', growth: 22, demand: 75 },
  { name: 'Soil-Inputs', growth: 18, demand: 62 },
];

// Helper for Glocalization distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Economy: React.FC<EconomyProps> = ({ 
  user, isGuest, onSpendEAC, onNavigate, vendorProducts = [], liveProducts = [], onPlaceOrder, industrialUnits = [], contracts = [], blueprints = [], notify, initialSection 
}) => {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'infrastructure' | 'forecasting' | 'checkout'>('catalogue');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [cart, setCart] = useState<any[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  const [books, setBooks] = useState<AgroBook[]>([]);
  const [sortMethod, setSortMethod] = useState<'price' | 'distance'>('distance');

  // Real-time sync of Knowledge Shards
  useEffect(() => {
    const unsub = listenToCollection('books', setBooks, true);
    return () => unsub();
  }, []);

  // Vector Routing Logic
  useEffect(() => {
    if (initialSection) {
      if (['catalogue', 'infrastructure', 'forecasting', 'checkout'].includes(initialSection)) {
        setActiveTab(initialSection as any);
      }
    }
  }, [initialSection]);

  // Sentiment Oracle Logic
  const [isSyncingSentiment, setIsSyncingSentiment] = useState(false);
  const [sentimentAlpha, setSentimentAlpha] = useState(1.0);
  const [sentimentReport, setSentimentReport] = useState<string | null>(null);

  const handleSyncSentiment = async () => {
    setIsSyncingSentiment(true);
    try {
      const res = await predictMarketSentiment([]);
      setSentimentAlpha(res.sentiment_alpha || 1.0);
      setSentimentReport(res.text);
      notify({ title: 'MARKET_RESONANCE_SYNCED', message: 'Global pricing alpha recalibrated.', type: 'success' });
    } catch (e) {
      notify({ title: 'SYNC_FAILED', message: 'Oracle handshake interrupted.', type: 'error' });
    } finally {
      setIsSyncingSentiment(false);
    }
  };

  const combinedCatalogue = useMemo(() => {
    const userLat = user.coords?.lat || -1.29;
    const userLon = user.coords?.lng || 36.81;

    const list: any[] = [];
    
    // 1. EnvirosAgro Official Store & Vendor Portal Assets
    vendorProducts.forEach(p => {
      if (books.some(b => b.id === p.id)) return; // Prevent duplicate keys for AgroInPDF books
      
      const source = p.supplierEsin === 'EA-ORG-CORE' ? 'Official Store' : 'Vendor Portal';
      const dist = p.coords ? calculateDistance(userLat, userLon, p.coords.lat, p.coords.lng) : 0;
      
      list.push({
        ...p,
        finalPrice: Math.ceil(p.price * sentimentAlpha),
        vouchCount: Math.floor(Math.random() * 50) + 10,
        views: Math.floor(Math.random() * 500) + 100,
        sourceLabel: source,
        isOfficial: p.supplierEsin === 'EA-ORG-CORE',
        distance: dist
      });
    });

    // 2. Knowledge Shards (Books from AgroInPDF)
    books.forEach(b => {
      const dynamicPrice = Math.ceil(b.price * sentimentAlpha);
      list.push({
        id: b.id,
        name: b.title,
        description: b.abstract,
        finalPrice: dynamicPrice,
        category: 'Book',
        stock: 9999,
        supplierEsin: b.authorEsin,
        supplierName: b.authorName,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400',
        sourceLabel: 'AgroInPDF',
        isUserGenerated: true,
        icon: BookOpen,
        distance: 0 // Digital asset
      });
    });

    // 3. User-Generated Logic Shards (Acoustic/Design)
    list.push({
      id: 'MUS-882-SHD',
      name: 'Sonic Soil Repair (432Hz)',
      description: 'Bio-electric frequency shard for cellular repair.',
      finalPrice: Math.ceil(150 * sentimentAlpha),
      category: 'Acoustic',
      supplierName: 'AgroMusika',
      supplierEsin: 'EA-MUS-NODE',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400',
      sourceLabel: 'Agro Musika',
      isUserGenerated: true,
      icon: Music,
      distance: 0
    });

    // 4. Live Processing Threads (JIT Assets)
    liveProducts.forEach(p => {
      if (p.marketStatus === 'Ready' || p.marketStatus === 'Processing') {
        list.push({
          id: p.id,
          name: p.productType,
          description: `Live processing asset from ${p.stewardName}. Current stage: ${p.stage}.`,
          category: p.category,
          price: 1500,
          finalPrice: Math.ceil(1500 * sentimentAlpha),
          stock: 1,
          status: 'QUALIFIED',
          supplierName: p.stewardName,
          supplierEsin: p.stewardEsin,
          sourceLabel: 'Live Thread',
          isLiveProcessing: true,
          progress: p.progress,
          distance: 10, // Mock distance
          icon: Zap
        });
      }
    });

    // 5. Missions & Contracts (Registry Shards)
    contracts.forEach(c => {
      list.push({
        id: c.id,
        name: c.productType,
        description: `Contract for ${c.category}. Budget: ${c.budget} EAC.`,
        category: 'Mission',
        finalPrice: Math.ceil(2500 * sentimentAlpha),
        stock: 1,
        supplierName: c.investorName,
        supplierEsin: c.investorEsin,
        sourceLabel: 'Contract Ledger',
        isMission: true,
        icon: Target,
        distance: 5
      });
    });

    // 6. Asset Blueprints (Knowledge/Design Shards)
    blueprints.forEach(b => {
      list.push({
        id: b.blueprint_id,
        name: b.input_material.name,
        description: `Industrial blueprint for ${b.input_material.name}. Status: ${b.status}.`,
        category: 'Blueprint',
        finalPrice: Math.ceil(5000 * sentimentAlpha),
        stock: 999,
        supplierName: 'Value Forge',
        supplierEsin: 'EA-VF-NODE',
        sourceLabel: 'Value Enhancement',
        isBlueprint: true,
        icon: FlaskConical,
        distance: 0
      });
    });

    // Filtering & Sorting
    let filtered = list.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortMethod === 'distance') {
      filtered = filtered.sort((a, b) => a.distance - b.distance);
    } else {
      filtered = filtered.sort((a, b) => a.finalPrice - b.finalPrice);
    }

    return filtered;
  }, [vendorProducts, books, sentimentAlpha, user.coords, searchTerm, categoryFilter, sortMethod]);

  const categories = useMemo(() => {
    const cats = new Set<string>(vendorProducts.map(item => item.category));
    cats.add('Book');
    cats.add('Acoustic');
    cats.add('Mission');
    cats.add('Blueprint');
    return ['All', ...Array.from(cats)];
  }, [vendorProducts]);

  const handleAddToCart = (item: any) => {
    setCart(prev => [...prev, { ...item, cartId: Math.random() }]);
    notify({ title: 'SHARD_BUFFERED', message: `${item.name} queued for procurement.`, type: 'info' });
  };

  const removeFromCart = (cartId: number) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.finalPrice, 0);

  const executeCheckout = async () => {
    if (cart.length === 0) return;
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      notify({ title: 'SIGNATURE_ERROR', message: 'Node ESIN mismatch.', type: 'error' });
      return;
    }
    if (user.wallet.balance < cartTotal) {
      notify({ title: 'LIQUIDITY_ERROR', message: 'Insufficient EAC shards.', type: 'error' });
      return;
    }

    setIsCheckingOut(true);
    if (await onSpendEAC(cartTotal, `INDUSTRIAL_PROCUREMENT_BATCH_${cart.length}_SHARDS`)) {
      for (const item of cart) {
        onPlaceOrder({
          itemId: item.id,
          itemName: item.name,
          itemType: item.category,
          itemImage: item.image,
          cost: item.finalPrice,
          supplierEsin: item.supplierEsin,
          customerEsin: user.esin,
          timestamp: new Date().toISOString(),
          trackingHash: `0x${generateQuickHash()}`,
          sourceTab: item.isUserGenerated ? 'books' : 'market'
        });
      }
      setCart([]);
      setEsinSign('');
      setIsCheckingOut(false);
      setActiveTab('catalogue');
      notify({ title: 'SETTLEMENT_FINALIZED', message: 'Batch anchored to registry.', type: 'success' });
    } else {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1700px] mx-auto px-4 relative">
      
      {/* 1. Global Commerce HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <div className="lg:col-span-8 glass-card p-10 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[20s] pointer-events-none">
              <Globe className="w-[800px] h-[800px] text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-[48px] bg-emerald-600 shadow-2xl flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
                 <ShoppingBag size={64} className="text-white animate-float" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-emerald-500/20">GLOCAL_MARKET_v6.5</span>
                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-500/20 shadow-inner">NODE: {user.location.split(',')[0]}</span>
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Market <span className="text-emerald-400">Cloud.</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Glocalized industrial gateway for hardware, vendor provisions, and logic shards. Distance-weighted asset discovery ensures supply chain resonance."
              </p>
           </div>
        </div>

        <div className="lg:col-span-4 glass-card p-10 rounded-[56px] border-2 border-indigo-500/20 bg-indigo-950/5 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-xl group">
           <div className="space-y-4 relative z-10 w-full">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.6em] mb-2 italic">SENTIMENT_ALPHA</p>
              <h4 className="text-7xl font-mono font-black text-indigo-400 tracking-tighter italic m-0">{sentimentAlpha.toFixed(2)}<span className="text-2xl text-indigo-800 ml-1">α</span></h4>
              
              <div className="px-6 py-4 bg-black/40 rounded-3xl border border-white/5 shadow-inner mt-4">
                 <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                    {sentimentReport ? `"${sentimentReport.substring(0, 80)}..."` : "Registry pricing stable. Sync with Oracle for real-time drift adjustments."}
                 </p>
              </div>

              <button 
                onClick={handleSyncSentiment}
                disabled={isSyncingSentiment}
                className="w-full py-5 mt-4 bg-indigo-600 hover:bg-indigo-500 rounded-[32px] text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 border-2 border-white/10 ring-8 ring-indigo-500/5"
              >
                 {isSyncingSentiment ? <Loader2 size={18} className="animate-spin text-white" /> : <Bot size={18} className="text-white" />}
                 RECALIBRATE RESONANCE
              </button>
           </div>
        </div>
      </div>

      {/* 2. Navigation Shards & Glocal Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 px-4 sticky top-4 z-40">
         <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-[32px] border border-white/10 bg-black/80 backdrop-blur-3xl shadow-3xl px-10">
           {[
             { id: 'catalogue', label: 'Universal Catalogue', icon: LayoutGrid },
             { id: 'infrastructure', label: 'Industrial Nodes', icon: Building },
             { id: 'forecasting', label: 'Demand Matrix', icon: LineChartIcon },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-white'}`}
             >
               <tab.icon size={16} /> {tab.label}
             </button>
           ))}
         </div>

         <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative flex-1 md:w-[450px] group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-400 transition-colors" />
               <input 
                 type="text" 
                 value={searchTerm} 
                 onChange={e => setSearchTerm(e.target.value)} 
                 placeholder="Search registry shards..." 
                 className="w-full bg-black/80 border-2 border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-8 focus:ring-emerald-500/10 transition-all font-mono italic" 
               />
            </div>
            
            <button 
              onClick={() => setActiveTab('checkout')}
              className={`relative p-8 rounded-[36px] border-4 transition-all ${activeTab === 'checkout' ? 'bg-emerald-600 border-white text-white' : 'bg-black/60 border-white/10 text-slate-500 hover:border-emerald-500/40 hover:text-white'}`}
            >
               <ShoppingCart size={32} />
               {cart.length > 0 && (
                 <span className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500 text-white text-base font-black flex items-center justify-center rounded-full border-4 border-black animate-in zoom-in">
                    {cart.length}
                 </span>
               )}
            </button>
         </div>
      </div>

      <div className="min-h-[850px] relative z-10 px-4 md:px-0">
        
        {/* --- VIEW: UNIVERSAL CATALOGUE (With Glocalization) --- */}
        {activeTab === 'catalogue' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000 px-4">
             <div className="flex justify-between items-center gap-4 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-4">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${categoryFilter === cat ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-black/40 border-white/5 text-slate-600 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Sort By:</span>
                  <button onClick={() => setSortMethod('distance')} className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase transition-all ${sortMethod === 'distance' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-black border-white/10 text-slate-500'}`}>Locality</button>
                  <button onClick={() => setSortMethod('price')} className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase transition-all ${sortMethod === 'price' ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-black border-white/10 text-slate-500'}`}>Valuation</button>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {combinedCatalogue.map(item => (
                  <div key={item.id} className="glass-card rounded-[64px] overflow-hidden border-2 border-white/5 hover:border-emerald-500/30 transition-all flex flex-col group shadow-2xl bg-black/40 relative h-[680px]">
                     <div className="h-64 relative overflow-hidden bg-[#050706]">
                        {item.image ? (
                           <img src={item.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[10s]" alt={item.name} />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center opacity-10">
                              <Package size={120} />
                           </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                        
                        <div className="absolute top-6 right-8 flex flex-col gap-3 items-end">
                           <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase border-2 tracking-[0.3em] shadow-2xl backdrop-blur-xl ${item.isOfficial ? 'bg-emerald-600/40 text-emerald-400 border-emerald-500/40' : item.isUserGenerated ? 'bg-indigo-600/40 text-indigo-400 border-indigo-500/40' : 'bg-black/60 text-slate-400 border-white/10'}`}>
                              {item.category}
                           </span>
                           {item.isLiveProcessing && (
                             <div className="px-4 py-1.5 bg-indigo-600/60 backdrop-blur-md rounded-full border border-indigo-400 text-[9px] font-black text-white flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                               <Zap size={12} fill="white" /> JIT_IN_FLOW
                             </div>
                           )}
                           {item.distance > 0 && (
                             <div className="px-4 py-1.5 bg-black/80 rounded-full border border-emerald-500/30 text-[9px] font-mono font-black text-emerald-400 flex items-center gap-2">
                               <MapPin size={12} /> {item.distance.toFixed(1)} km
                             </div>
                           )}
                        </div>

                        <div className="absolute bottom-6 left-8 flex items-center gap-4">
                           <div className={`p-3 rounded-2xl shadow-xl text-white border border-white/10 ${item.isUserGenerated ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                              {item.icon ? <item.icon size={20} /> : <Database size={20} />}
                           </div>
                           <span className="text-[12px] font-black text-white uppercase italic tracking-[0.3em] drop-shadow-2xl">{item.sourceLabel}</span>
                        </div>
                     </div>

                     <div className="p-10 flex-1 flex flex-col justify-between space-y-8">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <h4 className="text-3xl font-black text-white uppercase italic leading-none group-hover:text-emerald-400 transition-colors m-0 tracking-tighter drop-shadow-xl line-clamp-2">
                                 {item.name}
                              </h4>
                              <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-[0.4em] italic truncate">ORIGIN: {item.supplierName.toUpperCase()}</p>
                           </div>
                           <p className="text-base text-slate-400 italic line-clamp-4 leading-loose opacity-80 group-hover:opacity-100 transition-opacity font-medium">"{item.description}"</p>
                           {item.isLiveProcessing && (
                              <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl">
                                 <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={12} /> Supplier Condition: IN-FLOW (Verified)
                                 </p>
                              </div>
                           )}
                        </div>

                        <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                           <div className="space-y-2">
                              <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] italic">REGISTRY_VALUATION</p>
                              <div className="flex items-baseline gap-2">
                                 <p className={`text-5xl font-mono font-black tracking-tighter leading-none ${item.isUserGenerated ? 'text-indigo-400' : 'text-emerald-400'} drop-shadow-2xl`}>
                                    {item.finalPrice}
                                 </p>
                                 <span className="text-sm italic font-sans font-black text-slate-600">EAC</span>
                              </div>
                           </div>
                           <button 
                             onClick={() => handleAddToCart(item)}
                             className={`p-8 rounded-[36px] transition-all shadow-3xl active:scale-90 border-2 border-white/10 group/buy relative overflow-hidden ${item.isUserGenerated ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white`}
                           >
                              <Plus size={32} className="relative z-10" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VIEW: INDUSTRIAL NODES (Logistics & Manufacturing) --- */}
        {activeTab === 'infrastructure' && (
           <div className="space-y-16 animate-in zoom-in duration-700 px-4 md:px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                 {industrialUnits.length > 0 ? industrialUnits.map(node => (
                    <div key={node.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden h-[480px]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[15s]"><Factory size={250} /></div>
                       <div className="flex justify-between items-start relative z-10">
                          <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 text-indigo-500 shadow-inner group-hover:rotate-6 transition-all`}>
                             <Factory size={32} />
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest">NODE_ACTIVE</span>
                            <span className="text-[9px] font-mono text-slate-700 font-black">Local Relative</span>
                          </div>
                       </div>
                       <div className="space-y-4 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors">{node.name}</h4>
                          <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{node.id} // {node.type.toUpperCase()}</p>
                       </div>
                       <div className="pt-10 border-t border-white/5 space-y-4 relative z-10">
                          <div className="flex justify-between text-[11px] font-black uppercase text-slate-500">
                             <span>Operational Capacity</span>
                             <span className="text-white font-mono">100%</span>
                          </div>
                          <div className="space-y-2">
                             <div className="flex justify-between text-[9px] font-black uppercase text-slate-700">
                                <span>Utilization Load</span>
                                <span className="text-indigo-500">45%</span>
                             </div>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full bg-indigo-500 transition-all duration-1000`} style={{ width: `45%` }}></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )) : (
                   [
                    { id: 'NODE-WH-01', name: 'Nairobi Central Warehouse', type: 'Warehousing', capacity: '120k Units', load: 62, icon: Warehouse, color: 'text-amber-500', dist: '14km' },
                    { id: 'NODE-LG-04', name: 'East African Logistics Relay', type: 'Logistics', capacity: '14.2 GB/s', load: 88, icon: Truck, color: 'text-blue-500', dist: '42km' },
                    { id: 'NODE-MF-82', name: 'Bio-Refinery Unit #82', type: 'Manufacturing', capacity: '500t/Cycle', load: 45, icon: Factory, color: 'text-indigo-500', dist: '85km' },
                    { id: 'NODE-DT-12', name: 'Mombasa Port Distribution', type: 'Distribution', capacity: '24k Parcels', load: 78, icon: Network, color: 'text-emerald-500', dist: '480km' },
                  ].map(node => (
                     <div key={node.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden h-[480px]">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[15s]"><node.icon size={250} /></div>
                        <div className="flex justify-between items-start relative z-10">
                           <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${node.color} shadow-inner group-hover:rotate-6 transition-all`}>
                              <node.icon size={32} />
                           </div>
                           <div className="flex flex-col items-end gap-2">
                             <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest">NODE_ACTIVE</span>
                             <span className="text-[9px] font-mono text-slate-700 font-black">{node.dist} Relative</span>
                           </div>
                        </div>
                        <div className="space-y-4 relative z-10">
                           <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors">{node.name}</h4>
                           <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{node.id} // {node.type.toUpperCase()}</p>
                        </div>
                        <div className="pt-10 border-t border-white/5 space-y-4 relative z-10">
                           <div className="flex justify-between text-[11px] font-black uppercase text-slate-500">
                              <span>Operational Capacity</span>
                              <span className="text-white font-mono">{node.capacity}</span>
                           </div>
                           <div className="space-y-2">
                              <div className="flex justify-between text-[9px] font-black uppercase text-slate-700">
                                 <span>Utilization Load</span>
                                 <span className={node.color}>{node.load}%</span>
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className={`h-full ${node.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${node.load}%` }}></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))
                 )}
              </div>

              <div className="glass-card p-12 md:p-20 rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.02] flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><HardHat size={800} className="text-emerald-500" /></div>
                 <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-pulse border-2 border-white/10 shrink-0">
                       <HardHat size={40} className="text-white" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Glocal Infrastructure</h4>
                       <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80">
                         "Leveraging regional manufacturing clusters to minimize logistics stress (S). Every physical node is a verifiable anchor in the EnvirosAgro supply registry."
                       </p>
                    </div>
                 </div>
                 <button onClick={() => onNavigate('industrial')} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 relative z-10">MANAGE FACILITIES</button>
              </div>
           </div>
        )}

        {/* --- VIEW: DEMAND MATRIX (Forecasting) --- */}
        {activeTab === 'forecasting' && (
           <div className="space-y-12 animate-in zoom-in duration-700 px-4 md:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card p-12 md:p-16 rounded-[80px] border-2 border-white/5 bg-black/40 shadow-3xl relative overflow-hidden flex flex-col">
                   <div className="flex flex-col md:flex-row justify-between items-center mb-20 relative z-10 px-6 gap-10">
                      <div className="flex items-center gap-10">
                         <div className="p-8 bg-blue-600 rounded-[36px] shadow-[0_0_80px_rgba(59,130,246,0.3)] border-2 border-white/10 animate-float">
                            <LineChartIcon className="w-12 h-12 text-white" />
                         </div>
                         <div>
                            <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Demand <span className="text-blue-400">Forecasting</span></h3>
                            <p className="text-slate-500 text-base font-bold uppercase tracking-widest mt-6 opacity-70 italic">"Global Consumption Matrix v4.2"</p>
                         </div>
                      </div>
                      <div className="text-right border-l-4 border-blue-600/20 pl-10">
                         <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.4em]">Node Momentum</p>
                         <p className="text-8xl font-mono font-black text-blue-400 tracking-tighter leading-none drop-shadow-2xl">1.42<span className="text-3xl italic font-sans text-blue-800 ml-2">μ</span></p>
                      </div>
                   </div>

                   <div className="flex-1 min-h-[500px] w-full relative z-10 p-10 bg-black/40 rounded-[64px] border-2 border-white/5 shadow-inner group/chart">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={FORECAST_DATA}>
                            <defs>
                               <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="cycle" stroke="rgba(255,255,255,0.2)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '30px' }} />
                            <Area type="monotone" name="Registry Consumption" dataKey="actual" stroke="#3b82f6" strokeWidth={12} fillOpacity={1} fill="url(#colorMarket)" strokeLinecap="round" />
                            <Area type="monotone" name="Oracle Forecast" dataKey="predicted" stroke="#10b981" strokeWidth={3} fill="transparent" strokeDasharray="15 10" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-10 flex flex-col">
                   <div className="glass-card p-12 rounded-[72px] border-2 border-white/10 bg-black/40 shadow-2xl flex flex-col items-center justify-center text-center space-y-12 relative overflow-hidden flex-1 group">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Leaf size={500} className="text-indigo-400" /></div>
                      <div className="w-32 h-32 bg-indigo-600 rounded-[44px] flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.3)] border-4 border-white/10 group-hover:rotate-12 transition-transform duration-700 relative z-10">
                         <Bot size={56} className="text-white animate-pulse" />
                      </div>
                      <div className="space-y-6 relative z-10">
                         <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Oracle <span className="text-indigo-400">Demand</span></h4>
                         <div className="space-y-4 pt-6">
                            {CATEGORY_FORECAST.map(cat => (
                              <div key={cat.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                 <span className="text-[10px] font-black text-slate-400 uppercase">{cat.name}</span>
                                 <div className="flex items-center gap-3">
                                   <span className="text-emerald-400 font-mono font-black text-xs">+{cat.growth}%</span>
                                   <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${cat.demand}%`}}></div></div>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        )}

        {/* --- VIEW: REGISTRY SETTLEMENT (Checkout) --- */}
        {activeTab === 'checkout' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-700 px-4">
              <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-emerald-500/20 bg-black/60 shadow-3xl space-y-16 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[20s]"><Landmark size={800} /></div>
                 
                 <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-16 mb-10 relative z-10 gap-12">
                    <div className="flex items-center gap-10">
                       <div className="w-28 h-28 bg-emerald-600 rounded-[44px] flex items-center justify-center text-white shadow-[0_0_100px_rgba(16,185,129,0.3)] border-4 border-white/10 shrink-0 group-hover:rotate-12 transition-transform duration-700">
                          <Receipt size={48} className="animate-float" />
                       </div>
                       <div className="text-left">
                          <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">REGISTRY <br/><span className="text-emerald-400">SETTLEMENT</span></h3>
                          <p className="text-slate-500 text-xl italic mt-4 opacity-80">"Executing sharding commitments for industrial procurement cycle."</p>
                       </div>
                    </div>
                 </div>

                 {cart.length === 0 ? (
                    <div className="py-32 text-center space-y-12 opacity-20 group/empty">
                       <div className="relative mx-auto w-32 h-32">
                          <ShoppingCart size={120} className="text-slate-600 group-hover/empty:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-[-40px] border-4 border-dotted border-white/10 rounded-full animate-spin-slow"></div>
                       </div>
                       <p className="text-3xl font-black uppercase tracking-[0.5em] italic">PROCUREMENT BUFFER CLEAR</p>
                       <button onClick={() => setActiveTab('catalogue')} className="px-16 py-6 bg-white/5 border-2 border-white/10 rounded-full text-[13px] font-black uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all active:scale-95 shadow-2xl">Return to Market</button>
                    </div>
                 ) : (
                    <div className="space-y-12 relative z-10">
                       <div className="space-y-6">
                          <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] px-10 italic">BATCH_ITEMS_PENDING_COMMIT</p>
                          <div className="divide-y divide-white/5 bg-white/[0.01] rounded-[64px] border border-white/5 overflow-hidden shadow-inner">
                             {cart.map(item => (
                                <div key={item.cartId} className="p-10 md:p-12 flex flex-col md:flex-row items-center justify-between group/line hover:bg-white/[0.02] transition-all gap-8">
                                   <div className="flex items-center gap-10 w-full md:w-auto">
                                      <div className="w-24 h-24 rounded-[32px] overflow-hidden border-2 border-white/10 shadow-2xl group-hover/line:scale-105 transition-transform shrink-0">
                                         <img src={item.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=200'} className="w-full h-full object-cover grayscale-[0.3] group-hover/line:grayscale-0" alt="" />
                                      </div>
                                      <div className="space-y-2">
                                         <h5 className="text-2xl md:text-3xl font-black text-white uppercase italic leading-none group-hover/line:text-emerald-400 transition-colors m-0 tracking-tighter">{item.name}</h5>
                                         <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase tracking-widest font-black italic">{item.id} // {(item.sourceLabel || '').toUpperCase()}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-8 md:pt-0">
                                      <div className="text-right">
                                         <p className="text-[10px] text-slate-800 font-black uppercase mb-1">Settlement Price</p>
                                         <p className="text-4xl font-mono font-black text-white tracking-tighter">{item.finalPrice}<span className="text-base ml-1 opacity-40 italic">EAC</span></p>
                                      </div>
                                      <button onClick={() => removeFromCart(item.cartId)} className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-700 hover:text-rose-500 transition-all active:scale-90 shadow-xl"><Trash2 size={24}/></button>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="pt-16 border-t-4 border-double border-white/10 mt-16 space-y-16">
                          <div className="flex flex-col md:flex-row justify-between items-end px-10 gap-10">
                             <div className="text-left space-y-4">
                                <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.6em] mb-4 italic">AGGREGATE_SETTLEMENT_YIELD</p>
                                <div className="flex items-baseline gap-4">
                                   <p className="text-8xl md:text-[140px] font-mono font-black text-white tracking-tighter leading-none m-0 p-0 drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">{cartTotal.toLocaleString()}</p>
                                   <span className="text-4xl md:text-6xl text-emerald-500 italic font-black font-sans m-0">EAC</span>
                                </div>
                             </div>
                             <div className="text-right glass-card p-8 rounded-[48px] border border-white/5 bg-black/60 shadow-2xl min-w-[280px]">
                                <p className="text-[11px] text-slate-700 font-black uppercase tracking-widest mb-3">Node Utility Buffer</p>
                                <p className="text-4xl font-mono font-black text-slate-400 tracking-tighter">{user.wallet.balance.toLocaleString()} <span className="text-lg">EAC</span></p>
                                <div className="mt-4 flex items-center justify-end gap-3">
                                   <div className={`w-2 h-2 rounded-full ${user.wallet.balance >= cartTotal ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                                   <span className={`text-[10px] font-black uppercase ${user.wallet.balance >= cartTotal ? 'text-emerald-600' : 'text-rose-700'}`}>
                                      {user.wallet.balance >= cartTotal ? 'LIQUIDITY_SUFFICIENT' : 'INSUFFICIENT_FUNDS'}
                                   </span>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-10 max-w-3xl mx-auto w-full">
                             <div className="space-y-6">
                                <label className="text-[13px] font-black text-slate-500 uppercase tracking-[0.8em] block text-center italic">NODE_SIGNATURE_AUTH (ESIN)</label>
                                <input 
                                   type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                                   placeholder="EA-XXXX-XXXX-XXXX" 
                                   className="w-full bg-black border-2 border-white/10 rounded-[56px] py-12 md:py-16 text-center text-5xl md:text-7xl font-mono text-white tracking-[0.3em] focus:ring-[24px] focus:ring-emerald-500/5 outline-none transition-all uppercase placeholder:text-stone-950 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" 
                                />
                             </div>
                             
                             <button 
                               onClick={executeCheckout}
                               disabled={isCheckingOut || !esinSign || cart.length === 0 || user.wallet.balance < cartTotal}
                               className="w-full py-12 md:py-16 agro-gradient rounded-[64px] text-white font-black text-lg md:text-xl uppercase tracking-[0.6em] shadow-[0_0_200px_rgba(16,185,129,0.3)] flex items-center justify-center gap-10 active:scale-95 disabled:opacity-20 transition-all border-4 border-white/10 ring-[32px] ring-white/5 group/commit"
                             >
                                {isCheckingOut ? <Loader2 className="w-12 h-12 animate-spin" /> : <Stamp className="w-12 h-12 fill-current group-hover/commit:scale-110 transition-transform" />}
                                {isCheckingOut ? "ANCHORING BATCH..." : "COMMIT SETTLEMENT"}
                             </button>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Economy;
