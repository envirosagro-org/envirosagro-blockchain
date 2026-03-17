import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  TrendingUp, 
  Coins, 
  History, 
  ChevronRight, 
  X, 
  Loader2, 
  CheckCircle2, 
  Landmark, 
  PlusCircle, 
  ShieldAlert, 
  Globe2, 
  Fingerprint, 
  SmartphoneNfc, 
  Link2, 
  DollarSign, 
  Bot, 
  Repeat, 
  Info, 
  BarChart4, 
  Stamp, 
  Trash2, 
  Gem,
  Activity,
  Leaf,
  Search,
  Download, 
  Building2,
  User as UserIcon,
  CreditCard,
  Binary,
  ExternalLink,
  Shield,
  Lock as LockIcon,
  ArrowRightLeft,
  ArrowRight,
  Key,
  Database,
  Layers,
  Target,
  Waves,
  Cpu,
  Workflow,
  ArrowRightCircle,
  Package,
  Sprout,
  Factory,
  Trophy,
  BadgeCheck,
  Smartphone,
  ShieldPlus,
  Send,
  MessageSquareCode,
  FileText,
  BadgeAlert,
  ArrowDownToLine,
  Gavel,
  Receipt,
  Smartphone as PhoneIcon,
  Mail,
  ChevronDown,
  Scale,
  Calculator,
  Award,
  PieChart as PieIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { User, AgroTransaction, ViewState, LinkedProvider, AgroProject, ShardCostCalibration } from '../types';
import { analyzeInstitutionalRisk, consultFinancialOracle, AgroLangResponse, chatWithAgroLang } from '../services/agroLangService';
import { initiatePayPalPayout } from '../services/paymentService';
import { toast } from 'sonner';

import { TriggerButton } from './TriggerButton';
import CostAccountingDashboard from './CostAccountingDashboard';

interface AgroWalletProps {
  user: User;
  isGuest: boolean;
  onNavigate: (view: ViewState) => void;
  onUpdateUser: (updatedUser: User) => void;
  onSwap: (eatAmount: number) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onClaimSocialHarvest?: () => void;
  projects?: AgroProject[];
  transactions?: AgroTransaction[];
  notify: any;
  initialSection?: string | null;
  costAudit: ShardCostCalibration | null;
}

const FOREX_RATES = {
  EAC_USD: 0.0124, 
  EAT_USD: 1.4288, 
  USD_KES: 132.50, 
  EAC_KES: 1.64,   
};

const STAKING_TIERS = [
  { id: 'bronze', label: 'ECOLOGY_STAKE', min: 100, yield: 4.5, period: '30 Cycles', icon: Sprout, col: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', accent: 'emerald' },
  { id: 'silver', label: 'INDUSTRIAL_STAKE', min: 1000, yield: 12.2, period: '90 Cycles', icon: Factory, col: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', accent: 'indigo' },
  { id: 'gold', label: 'SOVEREIGN_STAKE', min: 5000, yield: 24.8, period: '360 Cycles', icon: Trophy, col: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', accent: 'amber' },
];

const COST_DISTRIBUTION = [
  { name: 'Environmental_Sync', value: 40, color: '#10b981' },
  { name: 'Registry_Handshake', value: 25, color: '#3b82f6' },
  { name: 'Oracle_Consult', value: 20, color: '#6366f1' },
  { name: 'Mesh_Propagate', value: 15, color: '#f59e0b' },
];

const AgroWallet: React.FC<AgroWalletProps> = ({ 
  user, 
  isGuest,
  onNavigate, 
  onUpdateUser, 
  onSwap, 
  onEarnEAC, 
  onClaimSocialHarvest, 
  transactions = [],
  notify,
  initialSection,
  costAudit
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'treasury' | 'staking' | 'swap' | 'gateway' | 'ledger' | 'accounting'>('treasury');
  const [showGatewayModal, setShowGatewayModal] = useState<'deposit' | 'withdrawal' | null>(null);
  const [showLinkProvider, setShowLinkProvider] = useState(false);
  const [gatewayStep, setGatewayStep] = useState<'config' | 'handoff' | 'external_sync' | 'sign' | 'success'>('config');
  
  // Handshake Data
  const [gatewayAmount, setGatewayAmount] = useState('50');
  const [gatewayCurrency, setGatewayCurrency] = useState<'USD' | 'KES'>('USD');
  const [selectedProvider, setSelectedProvider] = useState<LinkedProvider | null>(
    user.wallet.linkedProviders?.find(p => p.type === 'PayPal') || null
  );
  const [esinSign, setEsinSign] = useState('');
  const [isProcessingGateway, setIsProcessingGateway] = useState(false);

  // Oracle States
  const [oracleAdvice, setOracleAdvice] = useState<string | null>(null);

  // New Provider State
  const [newProvFragment, setNewProvFragment] = useState('');

  // Swap State
  const [swapAmount, setSwapAmount] = useState('100');
  const [isSwapping, setIsSwapping] = useState(false);

  // Staking State
  const [stakingAmount, setStakingAmount] = useState('100');
  const [selectedTier, setSelectedTier] = useState(STAKING_TIERS[0]);

  // Routing Sync
  useEffect(() => {
    if (initialSection && ['treasury', 'staking', 'swap', 'gateway', 'ledger', 'accounting'].includes(initialSection)) {
      setActiveSubTab(initialSection as any);
    }
  }, [initialSection]);

  const gatewayEacEquivalent = useMemo(() => {
    const val = Number(gatewayAmount) || 0;
    if (gatewayCurrency === 'USD') return val / FOREX_RATES.EAC_USD;
    return val / FOREX_RATES.EAC_KES;
  }, [gatewayAmount, gatewayCurrency]);

  const handleLinkProvider = () => {
    if (!newProvFragment) return;
    const newProv: LinkedProvider = {
      id: `PRV-${Date.now()}`,
      type: 'PayPal',
      name: 'PayPal',
      accountFragment: newProvFragment,
      status: 'Active',
      lastSync: new Date().toISOString()
    };
    
    onUpdateUser({
      ...user,
      wallet: {
        ...user.wallet,
        linkedProviders: [...(user.wallet.linkedProviders || []), newProv]
      }
    });
    setShowLinkProvider(false);
    setNewProvFragment('');
    setSelectedProvider(newProv);
    notify({ 
      title: 'PROVIDER_SYNCED', 
      message: `PayPal node anchored to wallet registry.`, 
      type: 'network', 
      priority: 'medium',
      actionIcon: 'Link2'
    });
  };

  const handleRunAudit = async () => {
    if (!costAudit) throw new Error("No cost audit available");
    setOracleAdvice(null);
    try {
      const prompt = `Act as the EnvirosAgro Cost Accounting Oracle. Analyze node ${user.esin} metrics:
      m-constant: ${costAudit.mConstant}
      Ca-AgroCode: ${user.metrics.agriculturalCodeU}
      Sustainability Score: ${user.metrics.sustainabilityScore}
      
      Calculate the "Economic Resistance Shard". Identify cost centers that are leaking energy. 
      Propose a 3-stage sharding strategy to reduce procurement overhead by 15%.`;
      
      const res = await chatWithAgroLang(prompt, []);
      setOracleAdvice(res.text);
      return res.text;
    } catch (e) {
      const errorMsg = "Handshake Interrupted. Registry drift detected in Cost Center Alpha.";
      setOracleAdvice(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const executeGatewayHandshake = async () => {
    if (!selectedProvider) return;
    
    if (showGatewayModal === 'withdrawal') {
      setGatewayStep('handoff');
      await new Promise(r => setTimeout(r, 1500));
      setGatewayStep('external_sync');
      
      try {
        const usdValue = gatewayCurrency === 'USD' ? gatewayAmount : (Number(gatewayAmount) / FOREX_RATES.USD_KES).toFixed(2);
        await initiatePayPalPayout(selectedProvider.accountFragment, usdValue);
        setGatewayStep('sign');
      } catch (err: any) {
        alert(`PAYPAL HANDSHAKE ERROR: ${err.message}`);
        setGatewayStep('config');
      }
    } else {
      setGatewayStep('handoff');
      await new Promise(r => setTimeout(r, 1500));
      setGatewayStep('external_sync');
      await new Promise(r => setTimeout(r, 2000));
      setGatewayStep('sign');
    }
  };

  const finalizeSettlement = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    setIsProcessingGateway(true);
    setTimeout(() => {
      const amt = gatewayEacEquivalent;
      if (showGatewayModal === 'deposit') {
        onEarnEAC(amt, `EXTERNAL_INGEST_PAYPAL`);
      } else {
        onEarnEAC(-amt, `EXTERNAL_WITHDRAWAL_PAYPAL`);
      }
      setIsProcessingGateway(false);
      setGatewayStep('success');
      notify({ 
        title: 'SETTLEMENT_FINALIZED', 
        message: "PayPal sharding protocol commitment successful.", 
        type: 'ledger_anchor', 
        priority: 'high',
        actionIcon: 'Stamp'
      });
    }, 3000);
  };

  const closeGateway = () => {
    setShowGatewayModal(null);
    setGatewayStep('config');
    setEsinSign('');
  };

  const handleExecuteSwap = async () => {
    const amount = Number(swapAmount);
    if (amount <= 0) return;
    setIsSwapping(true);
    const ok = await onSwap(amount);
    setIsSwapping(false);
    if (ok) notify({ 
      title: 'SHARD_CONVERTED', 
      message: `${amount} EAT converted to EAC utility.`, 
      type: 'commerce', 
      priority: 'medium',
      actionIcon: 'RefreshCw'
    });
  };

  const handleExecuteStake = async () => {
    const amount = Number(stakingAmount);
    if (amount < selectedTier.min) {
      alert(`Minimum stake for ${selectedTier.label} is ${selectedTier.min} EAT.`);
      return;
    }
    notify({ 
      title: 'STAKING_COMMITTED', 
      message: `${amount} EAT locked into ${selectedTier.label}.`, 
      type: 'ledger_anchor', 
      priority: 'medium',
      actionIcon: 'Layers'
    });
    setStakingAmount(selectedTier.min.toString());
  };

  const paypalProviders = useMemo(() => 
    (user.wallet.linkedProviders || []).filter(p => p.type === 'PayPal'),
    [user.wallet.linkedProviders]
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Wallet Status HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'LIQUID UTILITY (EAC)', val: user.wallet.balance.toLocaleString(), color: 'text-emerald-500', icon: Coins },
          { label: 'EQUITY ASSETS (EAT)', val: (user.wallet.eatBalance + (user.wallet.stakedEat || 0)).toFixed(4), color: 'text-amber-500', icon: Gem },
          { label: 'RESONANCE FACTOR (m)', val: `x${user.wallet.exchangeRate.toFixed(2)}`, color: 'text-indigo-400', icon: Activity },
          { label: 'CALIBRATED_PRICE', val: `${costAudit?.calibratedCost || 100} EAC`, color: 'text-rose-400', icon: Scale },
        ].map((m, i) => (
          <div key={i} className="p-8 glass-card rounded-[48px] bg-black/40 border border-white/5 space-y-6 group hover:border-white/10 transition-all shadow-3xl relative overflow-hidden h-[220px] flex flex-col justify-between">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><m.icon size={120} className={m.color} /></div>
             <div className="flex justify-between items-center relative z-10">
                <p className={`text-[10px] ${m.color} font-black uppercase tracking-[0.4em] text-nowrap`}>{m.label}</p>
                <div className={`p-2 rounded-xl bg-white/5 ${m.color}`}><m.icon size={16} /></div>
             </div>
             <div className="relative z-10">
                <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">{m.val}</h4>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Navigation Shards */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 mx-auto lg:mx-0 relative z-20">
        {[
          { id: 'treasury', label: 'Treasury Hub', icon: Wallet },
          { id: 'accounting', label: 'Cost Management', icon: Calculator },
          { id: 'gateway', label: 'PayPal Bridge', icon: Link2 },
          { id: 'staking', label: 'Staking', icon: Layers },
          { id: 'swap', label: 'Sharding', icon: ArrowRightLeft },
          { id: 'ledger', label: 'History', icon: History },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: COST ACCOUNTING & CALIBRATION --- */}
        {activeSubTab === 'accounting' && (
          <CostAccountingDashboard 
            costAudit={costAudit} 
            onRunAudit={handleRunAudit}
            oracleAdvice={oracleAdvice}
          />
        )}

        {/* --- VIEW: TREASURY HUB (Segregated) --- */}
        {activeSubTab === 'treasury' && (
          <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card p-12 md:p-16 rounded-[72px] border border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col justify-center min-h-[500px] shadow-3xl group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s]"><Wallet size={500} /></div>
                   <div className="relative z-10 space-y-12">
                      <div className="text-center md:text-left">
                         <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">USER_TREASURY_SHARD</span>
                         <div className="mt-10 flex flex-col md:flex-row items-baseline gap-6 justify-center md:justify-start">
                            <h2 className="text-9xl md:text-[140px] font-black text-white tracking-tighter uppercase italic m-0 leading-none drop-shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                               {user.wallet.balance.toLocaleString()}
                            </h2>
                            <span className="text-4xl font-bold text-emerald-500 italic uppercase">EAC</span>
                         </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-6 max-w-2xl">
                         <button 
                           onClick={() => { setShowGatewayModal('deposit'); setGatewayStep('config'); }}
                           className="flex-1 py-10 agro-gradient rounded-[36px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] flex items-center justify-center gap-6 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-emerald-500/5 group"
                         >
                            <ArrowDownLeft size={32} /> INGEST PAYPAL
                         </button>
                         <button 
                           onClick={() => { setShowGatewayModal('withdrawal'); setGatewayStep('config'); }}
                           className="flex-1 py-10 bg-black/80 border-2 border-white/10 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95"
                         >
                            <ArrowUpRight size={32} className="text-blue-500" /> WITHDRAW PAYPAL
                         </button>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                   {/* Global Treasury View */}
                   <div className="p-10 glass-card rounded-[56px] border border-indigo-500/20 bg-indigo-500/5 space-y-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Globe2 size={160} className="text-indigo-400" /></div>
                      <div className="relative z-10">
                         <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Global Network Treasury</p>
                         <h4 className="text-5xl font-mono font-black text-white tracking-tighter italic mt-4">12.4M <span className="text-lg">EAC</span></h4>
                         <p className="text-[10px] text-slate-500 font-medium italic mt-4 leading-relaxed">
                            "Aggregated liquidity across all 4,214 active nodes in the EnvirosAgro ecosystem."
                         </p>
                      </div>
                   </div>

                   {/* Internal System Treasury */}
                   <div className="p-10 glass-card rounded-[56px] border border-rose-500/20 bg-rose-500/5 space-y-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Database size={160} className="text-rose-400" /></div>
                      <div className="relative z-10">
                         <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest">Internal System Shard</p>
                         <h4 className="text-5xl font-mono font-black text-white tracking-tighter italic mt-4">2.8M <span className="text-lg">EAC</span></h4>
                         <p className="text-[10px] text-slate-500 font-medium italic mt-4 leading-relaxed">
                            "Reserved for system-wide m-constant stabilization and EnvirosAgro Agro Lang resource anchoring."
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: PAYPAL BRIDGES --- */}
        {activeSubTab === 'gateway' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700 px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10 px-4">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">PayPal <span className="text-indigo-400">Bridges</span></h3>
                    <p className="text-slate-500 text-lg md:text-xl font-medium italic opacity-70">"Synchronizing your steward identity with global financial shards."</p>
                 </div>
                 <button 
                  onClick={() => setShowLinkProvider(true)}
                  className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 border-2 border-white/10"
                 >
                    <PlusCircle size={20} /> LINK PAYPAL ACCOUNT
                 </button>
              </div>

              {showLinkProvider && (
                 <div className="glass-card p-10 rounded-[56px] border-2 border-indigo-500/40 bg-indigo-950/10 animate-in zoom-in duration-500 shadow-3xl space-y-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s]"><Mail size={400} /></div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-8 relative z-10">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl animate-float"><Mail size={32} /></div>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Authorize PayPal Bridge</h4>
                       </div>
                       <button onClick={() => setShowLinkProvider(false)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X size={24}/></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic">Provider Protocol</label>
                          <div className="p-8 rounded-[32px] border-2 border-indigo-500 bg-indigo-600/10 text-white flex flex-col items-center gap-4 shadow-xl">
                             <Mail size={32} className="text-indigo-400" />
                             <span className="text-xs font-black uppercase tracking-widest">PayPal Secure Ingest</span>
                          </div>
                       </div>
                       <div className="md:col-span-2 space-y-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 italic">PayPal Email Address</label>
                             <input 
                                type="email" value={newProvFragment} onChange={e => setNewProvFragment(e.target.value)}
                                placeholder="steward@email.com"
                                className="w-full bg-black border-2 border-white/10 rounded-[32px] py-8 px-10 text-3xl font-mono font-black text-white outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all placeholder:text-stone-900 shadow-inner" 
                             />
                          </div>
                          <button 
                            onClick={handleLinkProvider}
                            disabled={!newProvFragment}
                            className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-white/5 disabled:opacity-30"
                          >
                             <ShieldPlus size={24} /> ANCHOR PAYPAL SHARD
                          </button>
                       </div>
                    </div>
                 </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {paypalProviders.length === 0 ? (
                    <div className="col-span-full py-40 text-center opacity-10 border-4 border-dashed border-white/5 rounded-[80px] bg-black/40 flex flex-col items-center gap-10">
                       <Mail size={120} className="text-slate-600 animate-spin-slow" />
                       <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">NO_PAYPAL_BRIDGES</p>
                    </div>
                 ) : (
                    paypalProviders.map(p => (
                       <div key={p.id} className="p-10 glass-card rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all group flex flex-col justify-between h-[450px] shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-[12s]"><Globe2 size={300} /></div>
                          <div className="flex justify-between items-start relative z-10">
                             <div className="p-5 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-2xl group-hover:rotate-6 transition-all">
                                <Mail size={32} />
                             </div>
                             <div className="text-right flex flex-col items-end gap-2">
                                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest shadow-xl">NODE_ACTIVE</span>
                                <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{p.id}</p>
                             </div>
                          </div>
                          <div className="space-y-3 relative z-10">
                             <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">PayPal Account</h4>
                             <p className="text-lg font-mono font-black text-slate-400 tracking-widest">{p.accountFragment}</p>
                          </div>
                          <div className="mt-8 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                             <button onClick={() => { setSelectedProvider(p); setShowGatewayModal('deposit'); }} className="flex-1 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-md active:scale-95">Ingest Shard</button>
                             <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-700 hover:text-rose-500 transition-all"><Trash2 size={20}/></button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        )}

        {/* --- VIEW: STAKING --- */}
        {activeSubTab === 'staking' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 px-4">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-4 gap-8">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Equity <span className="text-indigo-400">Staking</span></h3>
                    <p className="text-slate-500 text-lg md:text-xl font-medium italic opacity-70">"Lock EAT equity shards to amplify node m-constant and earn compound utility."</p>
                 </div>
                 <div className="p-8 glass-card rounded-[40px] bg-indigo-600/5 border border-indigo-500/20 text-center shadow-xl">
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em] mb-3">Total Staked</p>
                    <p className="text-6xl font-mono font-black text-white">{(user.wallet.stakedEat || 0).toFixed(2)}<span className="text-sm italic font-sans text-blue-800 ml-1">EAT</span></p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {STAKING_TIERS.map(tier => (
                    <div key={tier.id} className={`p-10 glass-card rounded-[64px] border-2 transition-all flex flex-col justify-between h-[520px] bg-black/40 shadow-3xl relative overflow-hidden group ${selectedTier.id === tier.id ? `border-${tier.accent}-500/60 ring-4 ring-${tier.accent}-500/10` : 'border-white/5 hover:border-white/20'}`} onClick={() => setSelectedTier(tier)}>
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><tier.icon size={250} /></div>
                       <div className="space-y-8 relative z-10">
                          <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${tier.col} shadow-inner group-hover:rotate-6 transition-all`}>
                             <tier.icon size={32} />
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{tier.label}</h4>
                             <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">{tier.period} Lock</p>
                          </div>
                          <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 text-center space-y-1">
                             <p className="text-4xl font-mono font-black text-emerald-400">{tier.yield}%</p>
                             <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest">Projected APR</p>
                          </div>
                       </div>
                       <div className="mt-8 pt-8 border-t border-white/5 relative z-10 text-center">
                          <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">MIN: {tier.min} EAT</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="glass-card p-12 rounded-[72px] border-2 border-indigo-500/20 bg-indigo-950/5 flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl">
                 <div className="space-y-4 flex-1">
                    <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Stake <span className="text-indigo-400">Finality</span></h4>
                    <div className="flex gap-4 items-end max-w-md">
                       <div className="flex-1 space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Allocation (EAT)</label>
                          <input 
                            type="number" value={stakingAmount} onChange={e => setStakingAmount(e.target.value)}
                            className="w-full bg-black border-2 border-white/10 rounded-2xl py-4 px-6 text-2xl font-mono font-black text-white outline-none focus:ring-4 focus:ring-indigo-500/20" 
                          />
                       </div>
                       <button onClick={handleExecuteStake} className="py-5 px-10 agro-gradient rounded-2xl text-white font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">STAKE SHARD</button>
                    </div>
                 </div>
                 <div className="w-px h-24 bg-white/5 hidden lg:block"></div>
                 <div className="text-center md:text-right">
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-2">Available Balance</p>
                    <p className="text-4xl font-mono font-black text-white">{user.wallet.eatBalance.toFixed(2)} EAT</p>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: SHARDING (SWAP) --- */}
        {activeSubTab === 'swap' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-700 px-4">
              <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-indigo-500/20 bg-[#020503] shadow-3xl text-center space-y-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><ArrowRightLeft size={800} className="text-indigo-400" /></div>
                 
                 <div className="relative z-10 space-y-12">
                    <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.3)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12">
                       <Repeat size={64} className="text-white animate-spin-slow" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter m-0 leading-none drop-shadow-2xl">EQUITY <span className="text-indigo-400">SHARDING</span></h3>
                       <p className="text-slate-500 text-2xl font-medium italic">"Liquidating equity assets into immediate utility shards."</p>
                    </div>

                    <div className="flex flex-col items-center gap-10 py-16 border-y border-white/5 max-w-2xl mx-auto">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
                          <div className="space-y-4 p-8 bg-black rounded-[48px] border border-white/5 shadow-inner">
                             <p className="text-[10px] text-slate-500 uppercase font-black">FROM: EQUITY (EAT)</p>
                             <input 
                                type="number" value={swapAmount} onChange={e => setSwapAmount(e.target.value)}
                                className="w-full bg-transparent border-none text-center text-5xl font-mono text-white outline-none focus:ring-0 font-black" 
                             />
                             <p className="text-xs text-slate-700 font-mono">Available: {user.wallet.eatBalance.toFixed(4)}</p>
                          </div>
                          <div className="relative flex justify-center">
                             <div className="p-4 bg-indigo-600 rounded-2xl shadow-3xl relative z-10"><ArrowRight size={24} className="text-white" /></div>
                          </div>
                          <div className="space-y-4 p-8 bg-black rounded-[48px] border border-white/5 shadow-inner">
                             <p className="text-[10px] text-slate-500 uppercase font-black">TO: UTILITY (EAC)</p>
                             <p className="text-5xl font-mono font-black text-emerald-400">{(Number(swapAmount) * user.wallet.exchangeRate).toLocaleString()}</p>
                             <p className="text-xs text-slate-700 font-mono">Rate: 1:{user.wallet.exchangeRate}</p>
                          </div>
                       </div>
                    </div>

                    <button 
                       onClick={handleExecuteSwap}
                       disabled={isSwapping || Number(swapAmount) <= 0 || Number(swapAmount) > user.wallet.eatBalance}
                       className="w-full max-w-md py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-indigo-500/5 disabled:opacity-20"
                    >
                       {isSwapping ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : <RefreshCw size={24} className="mx-auto" />}
                       <p className="mt-2">{isSwapping ? 'CONVERTING SHARDS...' : 'INITIALIZE SHARD CONVERSION'}</p>
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: LEDGER HISTORY --- */}
        {activeSubTab === 'ledger' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 px-4">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-4 gap-10">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Financial <span className="text-emerald-400">Ledger Shards</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-70">"Immutable audit stream of all capital ingest and sharding commitments."</p>
                 </div>
                 <div className="flex gap-6 w-full md:w-auto justify-end">
                    <button className="px-10 py-5 bg-white/5 border-2 border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-4">
                       <RefreshCw size={18} /> RE-SYNC LEDGER
                    </button>
                 </div>
              </div>

              <div className="glass-card rounded-[80px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl relative">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-12"><Database size={600} /></div>
                 <div className="grid grid-cols-5 p-12 border-b border-white/10 bg-white/[0.01] text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic px-16 relative z-10">
                    <span className="col-span-2">Commitment Shard</span>
                    <span>Action Type</span>
                    <span>Time Shard</span>
                    <span className="text-right">Settlement</span>
                 </div>
                 <div className="divide-y divide-white/5 bg-[#050706] relative z-10 min-h-[500px]">
                    {transactions.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center py-40 opacity-10 space-y-8">
                          <History size={120} />
                          <p className="text-3xl font-black uppercase tracking-[0.5em]">No shards finalized</p>
                       </div>
                    ) : (
                       transactions.map((tx, i) => (
                          <div key={tx.id} className="grid grid-cols-5 p-12 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                             <div className="col-span-2 flex items-center gap-10">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border-2 border-white/10 group-hover:scale-110 group-hover:border-indigo-500 transition-all shadow-inner">
                                   <Database size={28} className="text-indigo-400" />
                                </div>
                                <div>
                                   <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-indigo-400 transition-colors m-0">{tx.details}</p>
                                   <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black tracking-widest italic">{tx.id}</p>
                                </div>
                             </div>
                             <div>
                                <span className={`px-5 py-2 bg-indigo-600/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest`}>{tx.type.toUpperCase()}</span>
                             </div>
                             <div className="text-sm text-slate-500 font-mono italic opacity-70 group-hover:opacity-100 transition-opacity">
                                SYNC_PAYPAL
                             </div>
                             <div className="flex justify-end pr-8 items-center gap-6">
                                <p className={`text-3xl font-mono font-black ${tx.value >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{tx.value > 0 ? '+' : ''}{tx.value}<span className="text-xs ml-1 font-sans opacity-40">EAC</span></p>
                                <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl text-emerald-400 shadow-xl group-hover:shadow-emerald-500/40 group-hover:scale-110 transition-all active:scale-95">
                                   <ShieldCheck size={20} />
                                </div>
                             </div>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        )}

      </div>

      {/* --- GATEWAY FLOW MODAL --- */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={closeGateway}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-[0_0_200px_rgba(0,0,0,0.9)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh]">
              
              <div className="p-12 md:p-16 border-b border-white/5 bg-indigo-500/[0.01] flex justify-between items-center shrink-0 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10 group overflow-hidden relative">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <Link2 size={40} className="relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">PayPal <span className="text-indigo-400">Bridge Hub</span></h3>
                       <p className="text-indigo-500/60 font-mono text-[11px] tracking-[0.6em] uppercase mt-4 italic">HANDSHAKE_v5.2 // {showGatewayModal.toUpperCase()}</p>
                    </div>
                 </div>
                 <button onClick={closeGateway} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-3xl"><X size={32} /></button>
              </div>

              {/* Step Ribbon */}
              <div className="flex gap-4 px-16 pt-10 relative z-10 shrink-0">
                 {['config', 'handoff', 'sign', 'success'].map((s, i) => {
                    const actualIdx = ['config', 'handoff', 'sign', 'success'].indexOf(gatewayStep === 'external_sync' ? 'handoff' : gatewayStep);
                    return (
                      <div key={s} className="flex-1 flex flex-col gap-3">
                         <div className={`h-2 rounded-full transition-all duration-700 ${i <= actualIdx ? 'bg-indigo-500 shadow-[0_0_20px_#6366f1]' : 'bg-white/10'}`}></div>
                         <span className={`text-[8px] font-black uppercase text-center tracking-widest ${i === actualIdx ? 'text-indigo-400' : 'text-slate-700'}`}>{s}</span>
                      </div>
                    );
                 })}
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar flex flex-col bg-black/40 relative z-10">
                 
                 {gatewayStep === 'config' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Bridge <span className="text-indigo-400">Parameters.</span></h4>
                          <p className="text-slate-400 text-xl italic font-medium max-w-2xl mx-auto leading-relaxed px-10">"Define the liquidity volume for this industrial sharding cycle via PayPal."</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-8">PayPal Node</label>
                             <div className="relative group">
                                <select 
                                  value={selectedProvider?.id || ''}
                                  onChange={e => setSelectedProvider(user.wallet.linkedProviders.find(p => p.id === e.target.value) || null)}
                                  className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer italic"
                                >
                                   {paypalProviders.length > 0 ? (
                                      paypalProviders.map(p => (
                                        <option key={p.id} value={p.id}>{p.accountFragment} (Steward Node)</option>
                                      ))
                                   ) : (
                                      <option value="">No PayPal Shards Found</option>
                                   )}
                                </select>
                                <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none group-hover:text-indigo-400 transition-colors" />
                             </div>
                             {paypalProviders.length === 0 && (
                                <button onClick={() => setShowLinkProvider(true)} className="text-[10px] text-indigo-400 underline font-black uppercase tracking-widest px-8">Anchor New PayPal Shard</button>
                             )}
                          </div>
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-8">Asset Volume ({gatewayCurrency})</label>
                             <div className="flex gap-4">
                                <input 
                                  type="number" value={gatewayAmount} onChange={e => setGatewayAmount(e.target.value)} 
                                  className="flex-1 bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-4xl font-mono font-black text-white outline-none focus:ring-8 focus:ring-indigo-500/5 shadow-inner" 
                                />
                                <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] text-indigo-400 font-black text-xs uppercase shadow-xl flex items-center justify-center">USD</div>
                             </div>
                          </div>
                       </div>

                       <div className="p-10 bg-indigo-500/5 border border-indigo-500/20 rounded-[56px] flex flex-col md:flex-row items-center justify-between gap-10 shadow-inner group">
                          <div className="flex items-center gap-8 text-center md:text-left">
                             <div className="p-6 rounded-[32px] bg-indigo-600 text-white shadow-[0_0_50px_rgba(99,102,241,0.4)] group-hover:rotate-6 transition-all shrink-0"><Coins size={32} /></div>
                             <div>
                                <p className="text-[11px] text-slate-600 font-black uppercase mb-1">Expected EAC Ingest</p>
                                <p className="text-4xl font-mono font-black text-white tracking-tighter">+{gatewayEacEquivalent.toFixed(1)} <span className="text-xl italic font-sans text-indigo-400 ml-1">EAC</span></p>
                             </div>
                          </div>
                          <button 
                            onClick={executeGatewayHandshake}
                            disabled={!selectedProvider || !gatewayAmount}
                            className="w-full md:w-auto px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-indigo-500/5"
                          >
                             INITIALIZE PAYPAL BRIDGE
                          </button>
                       </div>
                    </div>
                 )}

                 {gatewayStep === 'handoff' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-20 animate-in zoom-in duration-700 text-center relative py-10">
                       <div className="relative group">
                          <div className={`w-64 h-64 bg-black border-4 rounded-full transition-all duration-1000 flex flex-col items-center justify-center p-10 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] border-indigo-500`}>
                             <div className="space-y-10 animate-in fade-in duration-500">
                                <div className="p-6 bg-indigo-600/10 rounded-3xl border-2 border-indigo-500 animate-pulse"><Mail size={64} className="text-indigo-400" /></div>
                                <p className="text-indigo-400 font-black text-xs uppercase tracking-widest leading-relaxed">BRIDGING <br/> PAYPAL_INGEST</p>
                             </div>
                          </div>
                          <div className="absolute inset-[-40px] border-2 border-indigo-500/20 rounded-full animate-ping opacity-20"></div>
                          <div className="absolute inset-[-80px] border-2 border-indigo-500/10 rounded-full animate-ping opacity-10 delay-700"></div>
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Sovereign <span className="text-indigo-400">Handshake</span></h4>
                          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.8em] animate-pulse">AWAITING_EXTERNAL_CONFIRMATION</p>
                       </div>
                    </div>
                 )}

                 {gatewayStep === 'external_sync' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <Loader2 size={140} className="text-indigo-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Globe2 size={48} className="text-indigo-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-6">
                          <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">BRIDGING_EXTERNAL_LEDGER...</p>
                          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">SYNCING_WITH_PAYPAL // ZK_PROXY_ESTABLISHED</p>
                       </div>
                    </div>
                 )}

                 {gatewayStep === 'sign' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border-4 border-indigo-500/30 shadow-3xl group relative overflow-hidden">
                             <Fingerprint className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform relative z-10" />
                             <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                          </div>
                          <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Steward <span className="text-indigo-400">Signature.</span></h4>
                          <p className="text-slate-400 text-xl italic font-medium">"Authorize finality anchor for the {gatewayAmount} USD PayPal commitment."</p>
                       </div>

                       <div className="max-w-2xl mx-auto w-full space-y-8">
                          <div className="space-y-4">
                             <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] block text-center italic">NODE_SIGNATURE_AUTH (ESIN)</label>
                             <input 
                                type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                                placeholder="EA-XXXX-XXXX-XXXX" 
                                className="w-full bg-black border-2 border-white/10 rounded-[56px] py-12 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                             />
                          </div>
                          <button 
                             onClick={finalizeSettlement}
                             disabled={isProcessingGateway || !esinSign}
                             className="w-full py-12 md:py-14 agro-gradient rounded-[64px] text-white font-black text-lg md:text-xl uppercase tracking-[0.6em] shadow-[0_0_150px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-10 border-4 border-white/10 ring-[24px] ring-white/5"
                          >
                             {isProcessingGateway ? <Loader2 className="w-10 h-10 animate-spin" /> : <Stamp size={40} className="fill-current" />}
                             {isProcessingGateway ? "ANCHORING ON-CHAIN..." : "AUTHORIZE SETTLEMENT"}
                          </button>
                       </div>
                    </div>
                 )}

                 {gatewayStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-20 py-10 animate-in zoom-in duration-1000 text-center relative">
                       <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_200px_rgba(16,185,129,0.5)] scale-110 relative group">
                          <CheckCircle2 size={100} className="group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                       </div>
                       <div className="space-y-6 text-center">
                          <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Shard <span className="text-indigo-400">Settled.</span></h3>
                          <p className="text-indigo-400 text-sm font-black uppercase tracking-[1em] font-mono leading-none">COMMIT_HASH_0x{(Math.random()*1000).toFixed(0)}_OK</p>
                       </div>
                       <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-indigo-500/5 space-y-8 max-w-lg w-full shadow-2xl">
                          <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-500 font-black uppercase tracking-widest italic">Registry Inflow</span>
                             <span className="text-white font-mono font-black text-2xl text-indigo-400">+{gatewayEacEquivalent.toFixed(1)} EAC</span>
                          </div>
                          <div className="h-px w-full bg-white/10"></div>
                          <div className="flex items-center gap-6 text-left">
                             <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <ShieldCheck size={28} />
                             </div>
                             <div className="space-y-1">
                                <p className="text-xs font-black text-white uppercase">Sovereign Proof Locked</p>
                                <p className="text-[10px] text-slate-500 italic">"This commitment is immutably anchored to the Layer-3 industrial ledger via PayPal Bridge."</p>
                             </div>
                          </div>
                       </div>
                       <button onClick={closeGateway} className="px-24 py-8 bg-white/5 border border-white/10 rounded-full text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
                    </div>
                 )}
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
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AgroWallet;
