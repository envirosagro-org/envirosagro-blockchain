import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Warehouse, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  Truck, 
  CheckCircle2, 
  X, 
  Loader2, 
  Database,
  ArrowRight,
  ShieldCheck, 
  Zap, 
  Info,
  ChevronRight,
  Monitor,
  MapPin,
  ClipboardCheck, 
  HardHat, 
  Coins, 
  Terminal, 
  Fingerprint, 
  Download, 
  Bot, 
  Target,
  Stamp,
  ShieldAlert,
  Leaf,
  Scale,
  Clock,
  Building2,
  FileSignature, 
  Binary, 
  History, 
  FlaskConical, 
  Globe, 
  Activity, 
  Binoculars, 
  Receipt, 
  TrendingUp, 
  ArrowUpRight, 
  Wallet, 
  ArrowLeftCircle,
  BadgeCheck,
  Building,
  Music,
  LineChart as LineChartIcon,
  Factory,
  HeartPulse,
  SmartphoneNfc,
  Waves,
  LayoutGrid,
  Search,
  Box,
  CreditCard,
  Layers,
  Radio,
  AudioWaveform,
  Zap as ZapIcon,
  SearchCode,
  // Added missing Workflow icon import
  Workflow
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { User, Order, LogisticProvider, VendorProduct, ViewState, SignalShard, LiveAgroProduct } from '../types';
import { runSpecialistDiagnostic, analyzeDemandForecast } from '../services/agroLangService';
import AssetAssociationTool from './AssetAssociationTool';

interface VendorPortalProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], meta?: any) => void;
  vendorProducts: VendorProduct[];
  onRegisterProduct: (product: VendorProduct) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  initialSection?: string | null;
  onUpdateProduct?: (product: VendorProduct) => void;
  onEmitSignal?: (signal: Partial<SignalShard>) => Promise<void>;
  liveProducts?: LiveAgroProduct[];
  onSaveLiveProduct?: (product: LiveAgroProduct) => void;
}

const FORECAST_DATA = [
  { cycle: 'C10', demand: 45, supply: 40 },
  { cycle: 'C11', demand: 52, supply: 48 },
  { cycle: 'C12', demand: 68, supply: 50 },
  { cycle: 'C13', demand: 84, supply: 62 },
];

import { useAppStore } from '../store';
import { generateAlphanumericId } from '../systemFunctions';

const ASSET_CATEGORIES = [
  "Circular", "Raw", "Tours", "Services", "Products", "Information", "Logistics", "Facility", "Organization Service", "Input", "Manufacturing", "Warehousing", "Distribution", "Veterinary"
];

const VendorPortal: React.FC<VendorPortalProps> = ({ 
  user, onSpendEAC, orders = [], onUpdateOrderStatus, vendorProducts = [], onRegisterProduct, onNavigate, initialSection, onUpdateProduct, onEmitSignal, liveProducts = [], onSaveLiveProduct
}) => {
  const { vendorRegistrationState, setVendorRegistrationState } = useAppStore();
  const [activeTab, setActiveTab] = useState<'inventory' | 'shipments' | 'live_terminal' | 'ledger'>('inventory');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCategoryLinker, setShowCategoryLinker] = useState(false);
  const [showProgramLinker, setShowProgramLinker] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [regStep, setRegStep] = useState<'metadata' | 'location' | 'programs' | 'payment' | 'verification' | 'anchoring' | 'success'>('metadata');
  const [isProcessing, setIsProcessing] = useState(false);

  // Shard Linking State
  const [linkingProduct, setLinkingProduct] = useState<VendorProduct | null>(null);
  const [showLinkerModal, setShowLinkerModal] = useState(false);
  const [linkerTab, setLinkerTab] = useState<'metadata' | 'live_farming' | 'inbound_signals' | 'financial_ledger'>('live_farming');

  // Registration Form State
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState(ASSET_CATEGORIES[0]);
  const [selectedProgram, setSelectedProgram] = useState<{id: string, name: string} | null>(null);
  const [itemValue, setItemValue] = useState<string>('5000');
  const [itemDesc, setItemDesc] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [gpsCoords, setGpsCoords] = useState<{lat: number, lng: number} | null>(null);
  const [ingestMethod, setIngestMethod] = useState<'hardware' | 'network'>('network');
  const [esinSign, setEsinSign] = useState('');
  const [oracleVerdict, setOracleVerdict] = useState<string | null>(null);
  const [generatedSku, setGeneratedSku] = useState('');
  const [sonicSignature, setSonicSignature] = useState('');

  // Live Terminal States
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastReport, setForecastReport] = useState<string | null>(null);

  // JIT Logic States
  const [isActivatingJit, setIsActivatingJit] = useState<string | null>(null);

  const isSuccessRef = useRef(false);
  const stateRef = useRef({ itemName, itemCategory, selectedProgram, itemValue, itemDesc, locationAddress, gpsCoords, ingestMethod, regStep, oracleVerdict, generatedSku, sonicSignature });

  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = { itemName, itemCategory, selectedProgram, itemValue, itemDesc, locationAddress, gpsCoords, ingestMethod, regStep, oracleVerdict, generatedSku, sonicSignature };
  }, [itemName, itemCategory, selectedProgram, itemValue, itemDesc, locationAddress, gpsCoords, ingestMethod, regStep, oracleVerdict, generatedSku, sonicSignature]);

  // Sync local state with vendorRegistrationState
  useEffect(() => {
    if (showRegisterModal && vendorRegistrationState) {
      if (vendorRegistrationState.itemName) setItemName(vendorRegistrationState.itemName);
      if (vendorRegistrationState.itemCategory) setItemCategory(vendorRegistrationState.itemCategory);
      if (vendorRegistrationState.selectedProgram) setSelectedProgram(vendorRegistrationState.selectedProgram);
      if (vendorRegistrationState.itemValue) setItemValue(vendorRegistrationState.itemValue);
      if (vendorRegistrationState.itemDesc) setItemDesc(vendorRegistrationState.itemDesc);
      if (vendorRegistrationState.locationAddress) setLocationAddress(vendorRegistrationState.locationAddress);
      if (vendorRegistrationState.gpsCoords) setGpsCoords(vendorRegistrationState.gpsCoords);
      if (vendorRegistrationState.ingestMethod) setIngestMethod(vendorRegistrationState.ingestMethod);
      if (vendorRegistrationState.regStep) {
        setRegStep(vendorRegistrationState.regStep === 'identification' as any ? 'metadata' : vendorRegistrationState.regStep);
      }
      if (vendorRegistrationState.oracleVerdict) setOracleVerdict(vendorRegistrationState.oracleVerdict);
      if (vendorRegistrationState.generatedSku) setGeneratedSku(vendorRegistrationState.generatedSku);
      if (vendorRegistrationState.sonicSignature) setSonicSignature(vendorRegistrationState.sonicSignature);
    }
  }, [showRegisterModal]);

  // Save progress on unmount or modal close
  useEffect(() => {
    return () => {
      if (showRegisterModal && !isSuccessRef.current) {
        setVendorRegistrationState(stateRef.current);
      }
    };
  }, [showRegisterModal, setVendorRegistrationState]);

  // Routing synchronization
  useEffect(() => {
    if (initialSection && ['inventory', 'shipments', 'live_terminal', 'ledger'].includes(initialSection)) {
      setActiveTab(initialSection as any);
    }
  }, [initialSection]);

  // Calculation Logic: 1% Registration Fee
  const regFee = useMemo(() => (Number(itemValue) || 0) * 0.01, [itemValue]);

  const handleStartRegistration = () => {
    isSuccessRef.current = false;
    if (vendorRegistrationState) {
      setShowResumePrompt(true);
    } else {
      setRegStep('metadata');
      setShowRegisterModal(true);
    }
  };

  const resetPortal = () => {
    if (!isSuccessRef.current) {
      setVendorRegistrationState({
        itemName, itemCategory, selectedProgram, itemValue, itemDesc, locationAddress, gpsCoords, ingestMethod, regStep, oracleVerdict, generatedSku, sonicSignature
      });
    }
    setShowRegisterModal(false);
    setRegStep('metadata');
    setItemName('');
    setItemDesc('');
    setLocationAddress('');
    setGpsCoords(null);
    setOracleVerdict(null);
    setIsProcessing(false);
    setGeneratedSku('');
    setSonicSignature('');
    setSelectedProgram(null);
  };

  const handleRunAudit = async () => {
    setIsProcessing(true);
    try {
      const res = await runSpecialistDiagnostic(itemCategory, `Phase 2: Internal Standards Check for ${itemName}. Value: ${itemValue} EAC. Supplier Ethics Audit requested for node ${user.esin}.`);
      setOracleVerdict(res.text);
      setRegStep('verification');
    } catch (e) {
      alert("Audit protocol failure.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBranding = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const assetId = generateAlphanumericId(7);
      const sku = `AGRO-${itemCategory.substring(0, 3).toUpperCase()}-${assetId}`;
      setGeneratedSku(sku);
      setSonicSignature(`AM-SONIC-${assetId}`);
      setRegStep('anchoring');
      setIsProcessing(false);
    }, 2000);
  };

  const handleFinalizeRegistry = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newProduct: VendorProduct = {
        id: generatedSku,
        name: itemName,
        description: itemDesc,
        price: Number(itemValue) * 1.1, // Industrial markup
        initialValue: Number(itemValue),
        registrationFee: regFee,
        stock: 100,
        category: itemCategory as any,
        supplierEsin: user.esin,
        supplierName: user.name,
        supplierType: itemCategory.toUpperCase() as any,
        status: 'QUALIFIED',
        timestamp: new Date().toISOString(),
        sku: generatedSku,
        sonicSignature: sonicSignature,
        isQualified: true,
        isLiveProcessing: false,
        locationAddress: locationAddress,
        gpsCoords: gpsCoords || undefined,
        isOrganizationService: itemCategory === 'Organization Service',
        inboundSignals: [],
        financialLedger: [],
        programId: selectedProgram?.id,
        programName: selectedProgram?.name
      };
      onRegisterProduct(newProduct);
      isSuccessRef.current = true;
      setVendorRegistrationState(null);
      setIsProcessing(false);
      setRegStep('success');
    }, 2500);
  };

  const handleToggleJitFlow = async (product: VendorProduct) => {
    setIsActivatingJit(product.id);
    // Mimic JIT Sync Handshake
    await new Promise(r => setTimeout(r, 2000));
    
    const nextLiveStatus = !product.isLiveProcessing;
    const updated = { ...product, isLiveProcessing: nextLiveStatus };
    
    if (onUpdateProduct) onUpdateProduct(updated);
    
    if (onEmitSignal && nextLiveStatus) {
      onEmitSignal({
        type: 'pulse',
        origin: 'MANUAL',
        title: 'JIT_PROCESS_ACTIVE',
        message: `Node ${user.esin} triggered live processing for ${product.name}. Availability verified on-chain.`,
        priority: 'medium',
        actionIcon: 'Zap',
        meta: { target: 'economy' }
      });
    }

    setIsActivatingJit(null);
  };

  const handleFetchForecast = async () => {
    setIsForecasting(true);
    try {
      const res = await analyzeDemandForecast(vendorProducts, "C12");
      setForecastReport(res.text);
    } catch (e) {
      setForecastReport("Oracle terminal unreachable.");
    } finally {
      setIsForecasting(false);
    }
  };

  const handleManageShard = (product: VendorProduct) => {
    setLinkingProduct(product);
    setLinkerTab('live_farming');
    setShowLinkerModal(true);
  };

  const handleAssociateLiveProduct = (liveAssetId: string) => {
    setShowLinkerModal(false);
    onNavigate('live_farming', liveAssetId);
  };

  const handleCreateAndAssociateLive = () => {
    if (!linkingProduct || !onSaveLiveProduct) return;
    
    const newLiveAssetId = `LIVE-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newLiveAsset: LiveAgroProduct = {
      id: newLiveAssetId,
      stewardEsin: user.esin,
      stewardName: user.name,
      productType: linkingProduct.name,
      category: 'Produce',
      stage: 'Inception',
      progress: 0,
      votes: 0,
      location: user.location,
      timestamp: new Date().toISOString(),
      lastUpdate: 'Just now',
      isAuthentic: true,
      auditStatus: 'Linked to ' + linkingProduct.id,
      sourceAssetId: linkingProduct.id,
      sourceAssetType: 'VendorProduct',
      tasks: ['Biometric Handshake', 'Moisture Sync'],
      telemetryNodes: [],
      marketStatus: 'Forecasting',
      vouchYieldMultiplier: 1.0,
      evidenceCount: 0,
      isBroadcasting: false,
      isPhysicallyVerified: false,
      isSystemAudited: false
    };

    onSaveLiveProduct(newLiveAsset);
    setShowLinkerModal(false);
    onNavigate('live_farming', newLiveAssetId);
  };

  const myProducts = vendorProducts.filter(p => p.supplierEsin === user.esin);
  const myRevenue = orders.filter(o => o.supplierEsin === user.esin).reduce((acc, o) => acc + o.cost, 0);
  const myLiveAssets = liveProducts.filter(p => p.stewardEsin === user.esin);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* HUD: Supplier Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="glass-card p-10 rounded-[48px] border-amber-500/20 bg-amber-500/[0.03] flex flex-col justify-between h-[280px] group transition-all shadow-3xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Warehouse size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.5em]">Inventory Capacity</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">
                 {myProducts.length}
                 <span className="text-xl text-amber-500 ml-1 italic">UNITS</span>
              </h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Registry Status</span>
              <div className="flex items-center gap-2 text-emerald-400">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-mono font-bold">STABLE</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-between h-[280px] group transition-all shadow-3xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Activity size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em]">Network Resonance</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">x1.42</h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">m-Constant Base</span>
              <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest">+0.05Δ</span>
           </div>
        </div>

        <div className="lg:col-span-2 glass-card p-10 rounded-[48px] border border-white/10 bg-black/40 flex items-center justify-between shadow-3xl">
           <div className="space-y-6 flex-1">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Register <span className="text-amber-500">Agricultural Asset</span></h3>
              <p className="text-slate-500 text-sm italic font-medium max-sm:hidden">"Bridge your physical assets to the digital Market Cloud via SEHTI-vetted sharding."</p>
              <button 
                onClick={handleStartRegistration}
                className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-2 border-white/10"
              >
                <PlusCircle size={20} /> COMMENCE ASSET LIFECYCLE
              </button>
           </div>
           <div className="w-40 h-40 hidden md:flex items-center justify-center relative">
              <div className="absolute inset-0 border-4 border-dashed border-amber-500/10 rounded-full animate-spin-slow"></div>
              <Building size={64} className="text-amber-500/40" />
           </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'inventory', label: 'Local Registry', icon: Package },
          { id: 'live_terminal', label: 'Live Processing', icon: ZapIcon },
          { id: 'shipments', label: 'Inbound Signals', icon: ShoppingCart },
          { id: 'ledger', label: 'Financial Ledger', icon: History },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-600 text-white shadow-2xl scale-105 border-b-4 border-amber-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="min-h-[800px] relative z-10">
        
        {/* VIEW: LOCAL REGISTRY */}
        {activeTab === 'inventory' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">                {myProducts.length === 0 ? (
                  <div className="col-span-full py-40 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[64px] flex flex-col items-center gap-6">
                    <Package size={80} />
                    <p className="text-3xl font-black uppercase tracking-[0.5em] italic">REGISTRY_EMPTY</p>
                    <button onClick={handleStartRegistration} className="px-10 py-4 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20">Register First Asset</button>
                  </div>
                ) : (
                  Object.entries(
                    myProducts.reduce((acc, product) => {
                      const cat = product.category || 'Uncategorized';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(product);
                      return acc;
                    }, {} as Record<string, typeof myProducts>)
                  ).map(([category, products]) => (
                    <div key={category} className="col-span-full space-y-8 mb-12">
                      <div className="flex items-center gap-6 border-b border-white/10 pb-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
                          <Package size={24} />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-widest">{category}</h3>
                        <span className="px-4 py-1 bg-white/5 rounded-full text-xs font-mono text-slate-400">{products.length} ASSETS</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {products.map(product => (
                          <div key={product.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 hover:border-amber-500/40 transition-all group flex flex-col justify-between h-[620px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99]">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Database size={300} /></div>
                             
                             <div className="space-y-8 relative z-10">
                                <div className="flex justify-between items-start">
                                   <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 text-amber-500 shadow-2xl group-hover:rotate-6 transition-all`}>
                                      <Package size={32} />
                                   </div>
                                   <div className="text-right flex flex-col items-end gap-2">
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl ${
                                         product.status === 'QUALIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                                      }`}>{product.status}</span>
                                      {product.isLiveProcessing && (
                                         <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 rounded-lg text-[8px] font-black animate-pulse">JIT_ACTIVE</span>
                                      )}
                                   </div>
                                </div>
                                <div className="space-y-3">
                                   <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-amber-400 transition-colors drop-shadow-2xl">{product.name}</h4>
                                   <p className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest italic">{product.sku}</p>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3 font-medium">"{product.description}"</p>
                             </div>

                             <div className="mt-auto pt-10 border-t border-white/5 space-y-6 relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="p-4 bg-black/60 rounded-3xl border border-white/5 text-center">
                                      <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Stock Level</p>
                                      <p className="text-2xl font-mono font-black text-white">{product.stock}</p>
                                   </div>
                                   <div className="p-4 bg-black/60 rounded-3xl border border-white/5 text-center">
                                      <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Sonic Auth</p>
                                      <div className="flex items-center justify-center gap-2 text-fuchsia-500">
                                         <Music size={12} />
                                         <span className="text-[10px] font-mono font-black uppercase">SYNC</span>
                                      </div>
                                   </div>
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                   <button 
                                      onClick={() => handleToggleJitFlow(product)}
                                      disabled={isActivatingJit === product.id}
                                      className={`w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${
                                         product.isLiveProcessing 
                                         ? 'bg-rose-600/10 border border-rose-500/20 text-rose-500 hover:bg-rose-600 hover:text-white' 
                                         : 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                                      }`}
                                   >
                                      {isActivatingJit === product.id ? <Loader2 size={14} className="animate-spin" /> : <ZapIcon size={14} />}
                                      {product.isLiveProcessing ? 'DEACTIVATE JIT FLOW' : 'ACTIVATE JIT FLOW'}
                                   </button>
                                   <button 
                                      onClick={() => handleManageShard(product)}
                                      className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all shadow-md active:scale-95"
                                   >
                                      MANAGE SHARD
                                   </button>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {/* VIEW: LIVE PROCESSING TERMINAL (Demand Forecasting) */}
        {activeTab === 'live_terminal' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 shadow-3xl relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative z-10 px-4 gap-8">
                       <div className="flex items-center gap-8">
                          <div className="p-6 bg-indigo-600 rounded-[32px] shadow-3xl border-2 border-white/10 animate-float">
                             <LineChartIcon className="w-10 h-10 text-white" />
                          </div>
                          <div>
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Demand <span className="text-indigo-400">Forecasting</span></h3>
                             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-4 italic">EOS_SUPPLY_CHAIN_ORACLE_v6</p>
                          </div>
                       </div>
                       <button 
                         onClick={handleFetchForecast}
                         disabled={isForecasting}
                         className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-3"
                       >
                          {isForecasting ? <Loader2 size={14} className="animate-spin" /> : <Bot size={14} />}
                          REFRESH_ORACLE
                       </button>
                    </div>

                    <div className="flex-1 h-[400px] w-full min-h-0 relative z-10 p-6 bg-black/60 rounded-[56px] border border-white/5 shadow-inner">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={FORECAST_DATA}>
                             <defs>
                                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                             <XAxis dataKey="cycle" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }} />
                             <Area type="monotone" name="Global Demand" dataKey="demand" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorDemand)" />
                             <Area type="monotone" name="Local Inventory" dataKey="supply" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorSupply)" strokeDasharray="10 5" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8 flex flex-col">
                    <div className="glass-card p-10 rounded-[64px] border border-indigo-500/20 bg-indigo-950/10 space-y-8 shadow-xl relative overflow-hidden flex-1 group/advice">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/advice:scale-110 transition-transform duration-[12s]"><Leaf size={300} className="text-indigo-400" /></div>
                       <div className="flex items-center gap-4 relative z-10">
                          <Bot size={28} className="text-indigo-400 animate-pulse" />
                          <h4 className="text-xl font-black text-white uppercase tracking-widest">Streamlining Shard</h4>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[40px] border border-indigo-500/20 shadow-inner relative z-10 border-l-4 border-l-indigo-600">
                          <p className="text-slate-300 text-lg leading-relaxed italic font-medium">
                             {forecastReport || '"The Demand Oracle is calculating regional requirements. Register assets early to optimize the supply-chain before harvest."'}
                          </p>
                       </div>
                    </div>

                    <div className="p-10 glass-card rounded-[56px] border border-emerald-500/10 bg-emerald-600/5 space-y-6 shadow-xl relative overflow-hidden group">
                       <div className="flex items-center gap-4">
                          <Target className="text-emerald-400" />
                          <h4 className="text-xl font-black text-white uppercase italic">Market Involvement</h4>
                       </div>
                       <p className="text-slate-400 text-sm leading-relaxed italic border-l-2 border-emerald-500/40 pl-6">
                          "Early involvement signals increase node visibility in the Market Cloud by 14%."
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: FINANCIAL LEDGER */}
        {activeTab === 'ledger' && (
           <div className="space-y-12 animate-in slide-in-from-left-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="glass-card p-10 rounded-[64px] border border-emerald-500/20 bg-black/40 space-y-8 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><TrendingUp size={200} /></div>
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl"><Receipt size={24} className="text-white" /></div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Revenue <span className="text-emerald-400">Account</span></h3>
                    </div>
                    <div className="space-y-4 pt-10 border-t border-white/5 relative z-10">
                       <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Aggregate Sales</span>
                          <p className="text-5xl font-mono font-black text-white tracking-tighter">{myRevenue.toLocaleString()} <span className="text-xl text-emerald-500 italic">EAC</span></p>
                       </div>
                       <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <span>Verified Transactions</span>
                          <span className="text-white font-mono">{orders.filter(o => o.supplierEsin === user.esin).length} Shards</span>
                       </div>
                    </div>
                 </div>

                 <div className="glass-card p-10 rounded-[64px] border border-rose-500/20 bg-black/40 space-y-8 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Scale size={200} /></div>
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="p-4 bg-rose-600 rounded-2xl shadow-xl"><History size={24} className="text-white" /></div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Cost <span className="text-rose-500">Accounting</span></h3>
                    </div>
                    <div className="space-y-4 pt-10 border-t border-white/5 relative z-10">
                       <div className="flex justify-between items-baseline">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Total Fees Locked</span>
                          <p className="text-5xl font-mono font-black text-white tracking-tighter">
                            {myProducts.reduce((acc, p) => acc + (p.registrationFee || 0), 0).toLocaleString()} 
                            <span className="text-xl text-rose-500 italic ml-1">EAC</span>
                          </p>
                       </div>
                       <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <span>Maintenance Shards</span>
                          <span className="text-white font-mono">0 ACTIVE</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: INBOUND SIGNALS */}
        {activeTab === 'shipments' && (
           <div className="py-40 text-center opacity-20 flex flex-col items-center gap-10">
              <div className="relative">
                 <Radio size={120} className="text-slate-600 animate-pulse" />
                 <div className="absolute inset-[-40px] border-4 border-dashed border-white/5 rounded-full animate-spin-slow"></div>
              </div>
              <p className="text-3xl font-black uppercase tracking-[0.5em] text-white italic drop-shadow-2xl">AWAITING_INBOUND_SIGNALS</p>
           </div>
        )}

      </div>

      {/* SHARD LINKER MODAL: ASSOCIATE VENDOR ASSET WITH LIVE FARMING */}
      {showLinkerModal && linkingProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowLinkerModal(false)}></div>
           <div className="relative z-10 w-full max-w-5xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] shadow-[0_0_200px_rgba(99,102,241,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-12 md:p-16 border-b border-white/5 bg-indigo-500/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl">
                       <Workflow size={40} />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Asset <span className="text-indigo-400">Terminal</span></h3>
                       <p className="text-indigo-400/60 font-mono text-[11px] tracking-[0.5em] uppercase mt-4 italic">MANAGEMENT_AND_ROUTING</p>
                    </div>
                 </div>
                 <button onClick={() => setShowLinkerModal(false)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={32} /></button>
              </div>

              <div className="flex border-b border-white/5 px-12 pt-6 gap-6">
                {[
                  { id: 'metadata', label: 'Metadata' },
                  { id: 'live_farming', label: 'Live Routing' },
                  { id: 'inbound_signals', label: 'Inbound Signals' },
                  { id: 'financial_ledger', label: 'Financial Ledger' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setLinkerTab(tab.id as any)}
                    className={`pb-4 px-4 text-[10px] font-black uppercase tracking-widest transition-all ${linkerTab === tab.id ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-white'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar bg-black/40 space-y-12">
                 {linkerTab === 'live_farming' && (
                   <>
                     <div className="p-10 bg-indigo-600/5 rounded-[56px] border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-inner">
                        <div className="text-left space-y-2">
                           <h4 className="text-2xl font-black text-white uppercase tracking-tighter m-0">Target: {linkingProduct.name}</h4>
                           <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">{linkingProduct.sku}</p>
                        </div>
                        <button 
                          onClick={handleCreateAndAssociateLive}
                          className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 border-2 border-white/10 ring-8 ring-white/5"
                        >
                           <PlusCircle size={20} /> Register New Thread
                        </button>
                     </div>

                     <div className="space-y-8">
                        <div className="flex items-center gap-4 px-6 border-b border-white/5 pb-4">
                           <Monitor size={20} className="text-blue-400" />
                           <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Existing Live Threads</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {myLiveAssets.length === 0 ? (
                              <div className="col-span-full py-20 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center gap-6">
                                 <SearchCode size={64} className="text-slate-700 animate-pulse" />
                                 <p className="text-xl font-black uppercase tracking-widest">No active live threads found</p>
                              </div>
                           ) : (
                              myLiveAssets.map(liveAsset => (
                                 <div 
                                    key={liveAsset.id} 
                                    onClick={() => handleAssociateLiveProduct(liveAsset.id)}
                                    className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                                 >
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><Monitor size={200} /></div>
                                    <div className="flex justify-between items-start relative z-10">
                                       <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-blue-400 group-hover/asset:scale-110 transition-transform">
                                          <ZapIcon size={24} />
                                       </div>
                                       <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[8px] font-black uppercase">{liveAsset.stage}</span>
                                    </div>
                                    <div className="relative z-10">
                                       <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-indigo-400 transition-colors">{liveAsset.productType}</h5>
                                       <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{liveAsset.id} // {liveAsset.progress}% SYNC</p>
                                    </div>
                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between text-indigo-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                                       SOURCE_SHARD <ArrowRight size={14} />
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                   </>
                 )}
                 {linkerTab === 'metadata' && (
                   <div className="space-y-6">
                     <div className="p-8 bg-white/5 rounded-[32px] border border-white/10">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Asset Name</p>
                       <p className="text-xl text-white font-medium">{linkingProduct.name}</p>
                     </div>
                     <div className="p-8 bg-white/5 rounded-[32px] border border-white/10">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Description</p>
                       <p className="text-white font-medium">{linkingProduct.description}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                       <div className="p-8 bg-white/5 rounded-[32px] border border-white/10">
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Category</p>
                         <p className="text-white font-medium">{linkingProduct.category}</p>
                       </div>
                       <div className="p-8 bg-white/5 rounded-[32px] border border-white/10">
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Location</p>
                         <p className="text-white font-medium">{linkingProduct.locationAddress || 'N/A'}</p>
                       </div>
                     </div>
                   </div>
                 )}
                 {linkerTab === 'inbound_signals' && (
                   <div className="space-y-6">
                     {linkingProduct.inboundSignals && linkingProduct.inboundSignals.length > 0 ? (
                       linkingProduct.inboundSignals.map((sig, i) => (
                         <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                           <p className="text-white">{sig.message}</p>
                         </div>
                       ))
                     ) : (
                       <div className="py-20 text-center opacity-50">
                         <p className="text-xl font-black uppercase tracking-widest">No inbound signals</p>
                       </div>
                     )}
                   </div>
                 )}
                 {linkerTab === 'financial_ledger' && (
                   <div className="space-y-6">
                     {linkingProduct.financialLedger && linkingProduct.financialLedger.length > 0 ? (
                       linkingProduct.financialLedger.map((entry, i) => (
                         <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 flex justify-between">
                           <p className="text-white">{entry.description}</p>
                           <p className="text-amber-400 font-mono">{entry.amount} EAC</p>
                         </div>
                       ))
                     ) : (
                       <div className="py-20 text-center opacity-50">
                         <p className="text-xl font-black uppercase tracking-widest">No ledger entries</p>
                       </div>
                     )}
                   </div>
                 )}
              </div>

              <div className="p-12 border-t border-white/5 bg-black/95 text-center shrink-0 z-20">
                 <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.8em] italic">INDUSTRIAL_LINKING_PROTOCOL v6.5 // secured shard</p>
              </div>
           </div>
        </div>
      )}

      {/* REGISTRATION MODAL: ASSET LIFECYCLE */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={resetPortal}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-amber-500/30 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(217,119,6,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh]">
              
              <div className="p-12 md:p-16 border-b border-white/5 bg-amber-500/[0.01] flex justify-between items-center shrink-0 relative z-20 px-20">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-amber-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <Stamp size={40} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter m-0">Asset <span className="text-amber-500">Lifecycle</span></h3>
                       <p className="text-amber-400/60 text-[11px] font-mono tracking-[0.5em] uppercase mt-4 italic leading-none">HANDSHAKE_v5.2 // SECURED_INGEST</p>
                    </div>
                 </div>
                 <button onClick={resetPortal} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-xl"><X size={32} /></button>
              </div>

              {/* Progress Stepper */}
              <div className="flex gap-4 px-20 pt-10 shrink-0 relative z-20">
                 {['metadata', 'location', 'programs', 'payment', 'verification', 'anchoring', 'success'].map((s, i) => {
                    const stages = ['metadata', 'location', 'programs', 'payment', 'verification', 'anchoring', 'success'];
                    const currentIdx = stages.indexOf(regStep);
                    return (
                      <div key={s} className="flex-1 flex flex-col gap-3">
                        <div className={`h-2 rounded-full transition-all duration-700 ${i <= currentIdx ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-white/10'}`}></div>
                        <span className={`text-[8px] font-black uppercase text-center tracking-widest ${i === currentIdx ? 'text-amber-400' : 'text-slate-700'}`}>{s.replace('_', ' ')}</span>
                      </div>
                    );
                 })}
              </div>

              <div className="flex-1 p-12 md:p-20 overflow-y-auto custom-scrollbar flex flex-col bg-black/40 relative z-10">
                 
                 {/* STEP 1: METADATA */}
                 {regStep === 'metadata' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Primary <span className="text-amber-500">Data Shard</span></h4>
                          <p className="text-slate-400 text-xl italic font-medium max-w-2xl mx-auto leading-relaxed px-10">"Registry initiation requires core identification metadata and the calculated 1% standardization commitment."</p>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-3 px-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Asset Designation</label>
                             <input 
                               type="text" value={itemName} onChange={e => setItemName(e.target.value)} 
                               placeholder="e.g. High-Yield Maize" 
                               className="w-full bg-black border-2 border-white/10 rounded-[32px] py-8 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-amber-500/10 outline-none transition-all placeholder:text-stone-900 italic shadow-inner" 
                             />
                          </div>
                          <div className="space-y-3 px-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Initial Asset Value (EAC)</label>
                             <input 
                               type="number" value={itemValue} onChange={e => setItemValue(e.target.value)} 
                               className="w-full bg-black border-2 border-white/10 rounded-[32px] py-8 px-10 text-4xl font-mono font-black text-white focus:ring-8 focus:ring-amber-500/10 outline-none transition-all shadow-inner" 
                             />
                          </div>
                       </div>

                       <div className="px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3 block">Asset Category</label>
                          <button 
                             onClick={() => setShowCategoryLinker(true)}
                             className="w-full bg-black border-2 border-white/10 rounded-[32px] py-8 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-amber-500/10 outline-none transition-all shadow-inner flex justify-between items-center hover:border-amber-500/50 group"
                          >
                             <span className={itemCategory ? 'text-amber-400' : 'text-slate-500 italic'}>{itemCategory || 'Select Category'}</span>
                             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                <SearchCode size={24} className="text-amber-500" />
                             </div>
                          </button>
                       </div>

                       <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[44px] flex justify-between items-center shadow-inner group/fee hover:border-amber-400 transition-all">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-amber-600 rounded-2xl text-white shadow-2xl group-hover/fee:rotate-12 transition-transform"><Coins size={24} /></div>
                             <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Calculated Registry Fee (1%)</span>
                          </div>
                          <span className="text-3xl font-mono font-black text-white">{regFee.toFixed(2)} <span className="text-sm text-amber-500 italic">EAC</span></span>
                       </div>

                       <button 
                         onClick={() => setRegStep('location')}
                         disabled={!itemName.trim()}
                         className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-amber-500/5 disabled:opacity-30"
                       >
                          PROCEED TO LOCATION <ArrowRight className="w-8 h-8 ml-4" />
                       </button>
                    </div>
                 )}

                 {/* STEP 2: LOCATION */}
                 {regStep === 'location' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Asset <span className="text-blue-400">Location</span></h4>
                          <p className="text-slate-400 text-xl font-medium italic leading-relaxed px-10">Specify the physical location for verification by organization auditors.</p>
                       </div>

                       <div className="space-y-8 max-w-3xl mx-auto w-full">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-6">Postal Address</label>
                             <input 
                               type="text" 
                               value={locationAddress} 
                               onChange={(e) => setLocationAddress(e.target.value)} 
                               placeholder="e.g. 123 Agro Lane, Farmville, CA 90210"
                               className="w-full bg-black/50 border-2 border-white/10 rounded-[40px] px-10 py-8 text-white text-xl font-medium italic focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                             />
                          </div>
                          
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-6">GPS Coordinates (Auto-detected if possible)</label>
                             <div className="flex gap-4">
                               <input 
                                 type="number" 
                                 value={gpsCoords?.lat || ''} 
                                 onChange={(e) => setGpsCoords(prev => ({ lat: parseFloat(e.target.value), lng: prev?.lng || 0 }))} 
                                 placeholder="Latitude"
                                 className="w-full bg-black/50 border-2 border-white/10 rounded-[40px] px-10 py-8 text-white text-xl font-medium italic focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                               />
                               <input 
                                 type="number" 
                                 value={gpsCoords?.lng || ''} 
                                 onChange={(e) => setGpsCoords(prev => ({ lat: prev?.lat || 0, lng: parseFloat(e.target.value) }))} 
                                 placeholder="Longitude"
                                 className="w-full bg-black/50 border-2 border-white/10 rounded-[40px] px-10 py-8 text-white text-xl font-medium italic focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                               />
                               <button 
                                 onClick={() => {
                                   if (navigator.geolocation) {
                                     navigator.geolocation.getCurrentPosition(
                                       (pos) => setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                                       (err) => alert("Could not get location: " + err.message)
                                     );
                                   } else {
                                     alert("Geolocation is not supported by this browser.");
                                   }
                                 }}
                                 className="px-8 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-[40px] font-black text-xs uppercase tracking-widest hover:bg-blue-600/40 transition-all flex items-center justify-center"
                               >
                                 <MapPin size={24} />
                               </button>
                             </div>
                          </div>
                       </div>

                       <div className="pt-10 flex gap-6">
                          <button onClick={() => setRegStep('metadata')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all active:scale-95 shadow-xl">BACK_TO_DATA</button>
                          <button 
                            onClick={() => setRegStep('programs')}
                            disabled={!locationAddress.trim()}
                            className="flex-[2] py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-white/5 disabled:opacity-30"
                          >
                             PROCEED TO PROGRAMS
                          </button>
                       </div>
                    </div>
                 )}

                 {/* STEP 3: PROGRAMS */}
                 {regStep === 'programs' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Ecosystem <span className="text-emerald-400">Programs</span></h4>
                          <p className="text-slate-400 text-xl font-medium italic leading-relaxed px-10">Optionally associate this asset with a recognized ecosystem program.</p>
                       </div>

                       <div className="max-w-3xl mx-auto w-full">
                          <button 
                             onClick={() => setShowProgramLinker(true)}
                             className="w-full bg-black border-2 border-white/10 rounded-[32px] py-8 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all shadow-inner flex justify-between items-center hover:border-emerald-500/50 group"
                          >
                             <span className={selectedProgram ? 'text-emerald-400' : 'text-slate-500 italic'}>{selectedProgram ? selectedProgram.name : 'Select Program (Optional)'}</span>
                             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                <Layers size={24} className="text-emerald-500" />
                             </div>
                          </button>
                       </div>

                       <div className="pt-10 flex gap-6">
                          <button onClick={() => setRegStep('location')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all active:scale-95 shadow-xl">BACK_TO_LOCATION</button>
                          <button 
                            onClick={() => setRegStep('payment')}
                            className="flex-[2] py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-white/5"
                          >
                             PROCEED TO PAYMENT
                          </button>
                       </div>
                    </div>
                 )}

                 {/* STEP 4: PAYMENT */}
                 {regStep === 'payment' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Registration <span className="text-amber-500">Fee</span></h4>
                          <p className="text-slate-400 text-xl font-medium italic leading-relaxed px-10">Pay the required EAC fee to initiate verification.</p>
                       </div>

                       <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-amber-500/20 shadow-3xl flex flex-col items-center justify-center">
                          <div className="text-6xl font-black text-white mb-4">{regFee.toFixed(2)} <span className="text-amber-500 text-3xl">EAC</span></div>
                          <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Standard Registration Fee (1% of Value)</p>
                       </div>

                       <div className="pt-10 flex gap-6">
                          <button onClick={() => setRegStep('location')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all active:scale-95 shadow-xl">BACK_TO_LOCATION</button>
                          <button 
                            onClick={() => {
                              if (user.wallet.balance < regFee) {
                                alert("Insufficient EAC balance.");
                                return;
                              }
                              onSpendEAC(regFee, `REG_FEE_${itemName}`);
                              handleRunAudit();
                            }}
                            className="flex-[2] py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-white/5"
                          >
                             PAY & INITIALIZE AUDIT
                          </button>
                       </div>
                    </div>
                 )}

                 {/* STEP 4: VERIFICATION */}
                 {regStep === 'verification' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-amber-500/20 shadow-3xl border-l-[16px] border-l-amber-600 relative overflow-hidden group/audit">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/audit:scale-125 transition-transform duration-[15s] pointer-events-none"><Leaf size={600} className="text-amber-500" /></div>
                          <div className="flex items-center gap-8 mb-12 border-b border-white/5 pb-10 relative z-10">
                             <div className="w-20 h-20 bg-amber-600 rounded-3xl flex items-center justify-center text-white shadow-3xl animate-float">
                                <Bot size={44} className="text-white animate-pulse" />
                             </div>
                             <div>
                                <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Vetting Verdict</h4>
                                <p className="text-amber-400/60 text-[11px] font-black uppercase tracking-[0.5em] mt-3 italic leading-none">PHYSICAL_AND_SYSTEMATIC_AUDIT_OK</p>
                             </div>
                          </div>
                          <div className="text-slate-300 text-2xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-6 border-l border-white/10">
                             {oracleVerdict || '"Analyzing supplier involvement history, asset development ethics, and physical location data against the SEHTI framework..."'}
                          </div>
                          <div className="mt-12 pt-10 border-t border-white/5 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                             <div className="flex items-center gap-6">
                                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                                   <BadgeCheck size={32} />
                                </div>
                                <div className="text-left">
                                   <p className="text-[10px] text-slate-600 font-black uppercase">STANDARDS_INDEX</p>
                                   <p className="text-2xl font-mono font-black text-white">99.8% α</p>
                                </div>
                             </div>
                             <button 
                                onClick={handleBranding}
                                className="px-12 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-2 border-white/10 ring-8 ring-amber-500/10"
                             >
                                PROCEED TO ANCHORING
                             </button>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* STEP 5: ANCHORING */}
                 {regStep === 'anchoring' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <h4 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Agro Musika <span className="text-fuchsia-400">Alignment</span></h4>
                          <p className="text-slate-400 text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">"Generating industrial SKU and bio-electric sonic signature for digital twin publication."</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="p-12 bg-black/60 rounded-[64px] border-2 border-white/5 space-y-10 shadow-3xl relative overflow-hidden group/sku text-center">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/sku:scale-110 transition-transform"><Target size={250} /></div>
                             <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.8em] italic border-b border-white/5 pb-4">GENERATED_INDUSTRIAL_SKU</p>
                             <h5 className="text-4xl md:text-5xl font-mono font-black text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{generatedSku}</h5>
                          </div>

                          <div className="p-12 bg-fuchsia-950/10 rounded-[64px] border-2 border-fuchsia-500/20 space-y-10 shadow-3xl relative overflow-hidden group/sonic text-center flex flex-col items-center justify-center">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/sonic:scale-110 transition-transform duration-[15s] pointer-events-none"><Music size={400} className="text-fuchsia-500" /></div>
                             <div className="w-20 h-20 rounded-full bg-fuchsia-600 flex items-center justify-center shadow-3xl mb-4 animate-float border-4 border-white/10">
                                <Waves size={32} className="text-white" />
                             </div>
                             <div className="space-y-4 relative z-10">
                                <p className="text-[11px] text-fuchsia-400/60 font-black uppercase tracking-[0.5em] italic leading-none">SONIC_SIGNATURE_CODE</p>
                                <p className="text-2xl font-mono font-black text-white tracking-widest">{sonicSignature}</p>
                             </div>
                          </div>
                       </div>

                       <div className="max-w-xl mx-auto w-full space-y-8">
                          <div className="space-y-4">
                             <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center italic">Node Signature (ESIN)</label>
                             <input 
                                type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                                placeholder="EA-XXXX-XXXX-XXXX" 
                                className="w-full bg-black border-2 border-white/10 rounded-[48px] py-12 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                             />
                          </div>
                          
                          <button 
                             onClick={handleFinalizeRegistry}
                             disabled={isProcessing || !esinSign}
                             className="w-full py-12 md:py-14 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_150px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-8 border-4 border-white/10 ring-[24px] ring-white/5"
                          >
                             {isProcessing ? <Loader2 className="w-10 h-10 animate-spin" /> : <Stamp size={40} className="fill-current" />}
                             {isProcessing ? "ANCHORING ASSET..." : "FINALIZE & PUBLISH"}
                          </button>
                       </div>
                    </div>
                 )}

                 {/* STEP 6: SUCCESS & PUBLISHED */}
                 {regStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-20 py-20 animate-in zoom-in duration-1000 text-center relative">
                       <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_200px_rgba(16,185,129,0.5)] scale-110 relative group">
                          <CheckCircle2 size={100} className="group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                       </div>
                       <div className="space-y-6 text-center">
                          <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Asset <span className="text-emerald-400">Qualified.</span></h3>
                          <p className="text-emerald-500 text-sm font-black uppercase tracking-[1em] font-mono leading-none">HASH_COMMIT_0x{(Math.random() * 1000).toFixed(0)}_OK</p>
                       </div>
                       <button onClick={resetPortal} className="w-full max-w-md py-10 bg-white/5 border border-white/10 rounded-[56px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {showResumePrompt && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-black border border-emerald-500/30 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Confirm Form Resubmission</h3>
            <p className="text-slate-400 mb-8 text-sm">You have an incomplete registration process. Would you like to resume where you left off or start a new registration?</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => { isSuccessRef.current = false; setShowResumePrompt(false); setShowRegisterModal(true); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Resume Registration
              </button>
              <button onClick={() => { isSuccessRef.current = false; setVendorRegistrationState(null); setShowResumePrompt(false); setRegStep('metadata'); setShowRegisterModal(true); }} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSET CATEGORY MANAGEMENT TOOL */}
      <AssetAssociationTool
        isOpen={showCategoryLinker}
        onClose={() => setShowCategoryLinker(false)}
        selectedAsset={{ name: itemName || 'New Asset', id: 'PENDING_REGISTRATION' }}
        linkerContext={{
          label: 'Asset Category',
          sourceLedger: 'CATEGORIES'
        }}
        onNavigate={() => {}}
        onLinkResource={(resId, name) => {
          setItemCategory(name);
          setShowCategoryLinker(false);
        }}
        industrialUnits={[]}
        blueprints={[]}
        user={user}
      />

      {/* ECOSYSTEM PROGRAM INTEGRATION TOOL */}
      <AssetAssociationTool
        isOpen={showProgramLinker}
        onClose={() => setShowProgramLinker(false)}
        selectedAsset={{ name: itemName || 'New Asset', id: 'PENDING_REGISTRATION' }}
        linkerContext={{
          label: 'Ecosystem Program',
          sourceLedger: 'PROGRAMS'
        }}
        onNavigate={() => {}}
        onLinkResource={(resId, name) => {
          setSelectedProgram({ id: resId, name });
          setShowProgramLinker(false);
        }}
        industrialUnits={[]}
        blueprints={[]}
        user={user}
      />

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default VendorPortal;