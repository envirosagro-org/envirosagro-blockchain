
import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Coins, 
  Gem, 
  ArrowRight, 
  Package, 
  Monitor, 
  Landmark, 
  Activity, 
  Search, 
  X, 
  CheckCircle2, 
  BadgeCheck, 
  Download, 
  History, 
  RefreshCw, 
  Truck, 
  CreditCard, 
  Lock, 
  Info,
  Layers,
  Leaf,
  Bot, 
  Binary, 
  Star, 
  Tag, 
  ArrowUpRight, 
  Heart, 
  Briefcase, 
  Microscope, 
  Loader2, 
  Building, 
  Scale, 
  ShieldPlus, 
  Terminal, 
  Database, 
  Fingerprint, 
  ChevronRight, 
  Stamp, 
  Link2, 
  ShieldAlert, 
  Wallet, 
  ArrowLeft
} from 'lucide-react';
import { User, Order } from '../types';

interface EnvirosAgroStoreProps {
  user: User;
  // Fix: changed onSpendEAC to return Promise<boolean> to match async implementation in App.tsx
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC?: (amount: number, reason: string) => void;
  onPlaceOrder: (order: Partial<Order>) => void;
}

const STORE_CATALOGUE = {
  products: [
    { 
      id: 'EOS-HW-001', 
      name: 'EOS Core Hardware Node', 
      price: 2500, 
      category: 'Proprietary Hardware', 
      thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400', 
      desc: 'The official EnvirosAgro industrial computing node. Pre-configured for ZK-telemetry sharding and m-constant calibration.', 
      verified: true,
      origin: 'EnvirosAgro Manufacturing',
      supplier: 'EA-ORG-CORE'
    },
    { 
      id: 'EOS-HW-002', 
      name: 'Spectral Ingest Unit v4', 
      price: 4500, 
      category: 'Proprietary Hardware', 
      thumb: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1200', 
      desc: 'Institutional-grade multi-spectral camera for botanical DNA sharding and regional registry sync.', 
      verified: true,
      origin: 'EnvirosAgro Tech Hub',
      supplier: 'EA-ORG-CORE'
    },
    { 
      id: 'EOS-HW-003', 
      name: 'Molecular Soil Scanner', 
      price: 1850, 
      category: 'Proprietary Hardware', 
      thumb: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400', 
      desc: 'Handheld diagnostic node for real-time soil purity auditing and C(a) index verification.', 
      verified: true,
      origin: 'EnvirosAgro Labs',
      supplier: 'EA-ORG-CORE'
    },
  ],
  services: [
    { 
      id: 'EOS-SRV-001', 
      name: 'SEHTI Tier Calibration', 
      price: 500, 
      category: 'Governance Service', 
      desc: 'Official node audit by EnvirosAgro HQ to authorize higher-tier EAC minting multipliers and registry vouching.', 
      duration: 'Annual',
      origin: 'EnvirosAgro Governance',
      supplier: 'EA-ORG-CORE'
    },
    { 
      id: 'EOS-SRV-002', 
      name: 'Industrial Registry Backup', 
      price: 150, 
      category: 'System Service', 
      desc: 'Redundant off-site sharding for your farm node telemetry, ensuring 100% data durability during network syncs.', 
      duration: 'Cycles',
      origin: 'EnvirosAgro Core',
      supplier: 'EA-ORG-CORE'
    },
    { 
      id: 'EOS-SRV-003', 
      name: 'Priority Support Synapse', 
      price: 100, 
      category: 'Support Service', 
      desc: 'Direct encrypted signal link to the EnvirosAgro HQ Technical Response Team for immediate node friction resolution.', 
      duration: 'Monthly',
      origin: 'EnvirosAgro CRM',
      supplier: 'EA-ORG-CORE'
    },
  ],
  finance: [
    { 
      id: 'EOS-FIN-001', 
      name: 'Treasury Node License', 
      price: 1000, 
      category: 'Institutional Finance', 
      desc: 'Authorization shard required to operate as a regional capital bridge for external KES/USD fiat ingest.', 
      risk: 'Low',
      origin: 'EnvirosAgro Treasury',
      supplier: 'EA-ORG-CORE'
    },
    { 
      id: 'EOS-FIN-002', 
      name: 'EAT Liquidity Provision', 
      price: 5000, 
      category: 'Institutional Finance', 
      desc: 'Direct EAT equity sharding from the Organizational Reserve. Backed by the global EnvirosAgro m-constant pool.', 
      risk: 'Systemic',
      origin: 'EnvirosAgro Capital',
      supplier: 'EA-ORG-CORE'
    },
  ]
};

const EnvirosAgroStore: React.FC<EnvirosAgroStoreProps> = ({ user, onSpendEAC, onEarnEAC, onPlaceOrder }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'finance'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Provisioning Workflow State
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [provisionStep, setProvisionStep] = useState<'config' | 'vetting' | 'escrow' | 'anchor' | 'success'>('config');
  const [isProcessing, setIsProcessing] = useState(false);
  const [esinSign, setEsinSign] = useState('');

  const filteredItems = (STORE_CATALOGUE[activeTab] as any[]).filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startProvisioning = (item: any) => {
    setSelectedAsset(item);
    setProvisionStep('config');
    setEsinSign('');
  };

  const handleStepVetting = () => {
    setIsProcessing(true);
    setProvisionStep('vetting');
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  const handleStepEscrow = () => {
    setProvisionStep('escrow');
  };

  // Fix: handleExecuteEscrow made async and awaits onSpendEAC to handle Promise<boolean> correctly.
  const handleExecuteEscrow = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    if (await onSpendEAC(selectedAsset.price, `OFFICIAL_STORE_PROVISION_${selectedAsset.id}`)) {
      setProvisionStep('anchor');
      setIsProcessing(true);
      setTimeout(() => {
        onPlaceOrder({
          itemId: selectedAsset.id,
          itemName: selectedAsset.name,
          itemType: selectedAsset.category,
          itemImage: selectedAsset.thumb,
          cost: selectedAsset.price,
          supplierEsin: selectedAsset.supplier,
          sourceTab: 'store'
        });
        setIsProcessing(false);
        setProvisionStep('success');
      }, 3000);
    }
  };

  const resetPortal = () => {
    setSelectedAsset(null);
    setProvisionStep('config');
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto px-4">
      {/* Institutional Branding Header */}
      <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
            <Building className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent animate-pulse"></div>
            <Landmark className="w-20 h-20 text-white relative z-10" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">ORGANIZATIONAL_CORE_ONLY</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4">Enviros<span className="text-emerald-400">Agro</span> Store</h2>
            </div>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic">
               "The Source of Truth. Acquire official hardware nodes, governance shards, and financial bridges manufactured and maintained exclusively by the EnvirosAgro Organization."
            </p>
         </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl overflow-x-auto scrollbar-hide snap-x">
          {[
            { id: 'products', label: 'Org Hardware', icon: Cpu },
            { id: 'services', label: 'Org Services', icon: ShieldPlus },
            { id: 'finance', label: 'Org Finance', icon: Landmark },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap snap-start ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
        
        <div className="relative group w-full lg:w-96 shrink-0">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Organizational Registry..." 
            className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all font-mono shadow-inner"
          />
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
         {filteredItems.map(item => (
            <div key={item.id} className="glass-card rounded-[56px] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col group active:scale-[0.98] duration-300 shadow-3xl bg-black/40 relative overflow-hidden">
               
               {item.thumb ? (
                 <div className="h-64 relative overflow-hidden">
                    <img src={item.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s] grayscale-[0.2] group-hover:grayscale-0" alt={item.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-6 left-6">
                       <span className="px-4 py-1.5 bg-emerald-600 text-white backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 border border-white/20">
                         <BadgeCheck size={12} /> PROPRIETARY
                       </span>
                    </div>
                 </div>
               ) : (
                 <div className="h-64 bg-emerald-600/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="w-24 h-24 rounded-[32px] bg-emerald-500/10 flex items-center justify-center shadow-xl border border-emerald-500/20 group-hover:rotate-12 transition-transform duration-700">
                       {item.category.includes('Finance') ? <Landmark size={48} className="text-emerald-400" /> : <ShieldPlus size={48} className="text-indigo-400" />}
                    </div>
                    <div className="absolute top-6 left-6">
                       <span className="px-4 py-1.5 bg-emerald-600 text-white backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 border border-white/20">
                         <BadgeCheck size={12} /> PROPRIETARY
                       </span>
                    </div>
                 </div>
               )}

               <div className="p-10 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                     <div className="flex justify-between items-start">
                        <h4 className="text-2xl font-black text-white uppercase italic leading-tight group-hover:text-emerald-400 transition-colors m-0 tracking-tighter">{item.name}</h4>
                     </div>
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em]">{item.category} // {item.id}</p>
                     <p className="text-sm text-slate-400 italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3">"{item.desc}"</p>
                     
                     <div className="pt-4 border-t border-white/5">
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2">
                           <Building size={12} /> Origin: {item.origin}
                        </p>
                     </div>
                  </div>

                  <div className="pt-10 border-t border-white/5 flex items-center justify-between mt-10">
                     <div className="space-y-1">
                        <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest">Entry Commitment</p>
                        <p className="text-3xl font-mono font-black text-white tracking-tighter">{item.price} <span className="text-xs text-emerald-500">EAC</span></p>
                     </div>
                     <button 
                        onClick={() => startProvisioning(item)}
                        className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-[28px] text-white font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-3xl active:scale-90 flex items-center gap-3"
                     >
                        <ArrowUpRight size={16} />
                        Provision
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* PROVISIONING WORKFLOW MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={resetPortal}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              
              <div className="p-10 md:p-14 border-b border-white/5 bg-emerald-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl animate-float">
                       <Zap size={32} className="text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Procurement <span className="text-emerald-400">Sync</span></h3>
                       <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-3">ASSET_ID: {selectedAsset.id}</p>
                    </div>
                 </div>
                 <button onClick={resetPortal} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={24} /></button>
              </div>

              <div className="flex gap-4 px-10 pt-8 shrink-0">
                 {['config', 'vetting', 'escrow', 'anchor', 'success'].map((s, i) => {
                    const stages = ['config', 'vetting', 'escrow', 'anchor', 'success'];
                    const currentIdx = stages.indexOf(provisionStep);
                    return (
                      <div key={s} className="flex-1 flex flex-col gap-2">
                        <div className={`h-1.5 rounded-full transition-all duration-700 ${i <= currentIdx ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-white/10'}`}></div>
                        <span className={`text-[7px] font-black uppercase text-center tracking-widest ${i === currentIdx ? 'text-emerald-400' : 'text-slate-700'}`}>{s}</span>
                      </div>
                    );
                 })}
              </div>

              <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar space-y-12">
                 
                 {provisionStep === 'config' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                       <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 space-y-6 shadow-inner relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Database size={160} /></div>
                          <div className="flex justify-between items-center px-4">
                             <h4 className="text-2xl font-black text-white uppercase italic">Summary Shard</h4>
                             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20 tracking-widest">OFFICIAL_CORE</span>
                          </div>
                          <div className="space-y-3 px-4">
                             <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-bold uppercase">Asset Name</span>
                                <span className="text-white font-medium">{selectedAsset.name}</span>
                             </div>
                             <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-bold uppercase">Manufacturing Node</span>
                                <span className="text-white font-medium">{selectedAsset.origin}</span>
                             </div>
                             <div className="h-px bg-white/5 w-full"></div>
                             <div className="flex justify-between items-center pt-2">
                                <span className="text-xs font-black text-slate-500 uppercase">Capital Commitment</span>
                                <span className="text-3xl font-mono font-black text-emerald-400">{selectedAsset.price} EAC</span>
                             </div>
                          </div>
                       </div>

                       <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[44px] flex items-center gap-8 shadow-inner">
                          <Info className="w-10 h-10 text-blue-500 shrink-0" />
                          <p className="text-[10px] text-blue-200/50 font-black uppercase tracking-tight leading-relaxed text-left italic">
                             "Initializing this provision will trigger an automated scientific vetting process to ensure compatibility with node {user.esin}."
                          </p>
                       </div>

                       <button 
                         onClick={handleStepVetting}
                         className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
                       >
                          COMMENCE VETTING SHARD <ChevronRight size={20} />
                       </button>
                    </div>
                 )}

                 {provisionStep === 'vetting' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10 text-center animate-in fade-in duration-500">
                       <div className="relative">
                          <div className="absolute inset-[-20px] border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                          <div className="w-48 h-48 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                             <Microscope className="w-20 h-20 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">
                             {isProcessing ? 'Auditing Compatibility...' : 'Vetting Complete'}
                          </p>
                          <p className="text-slate-600 font-mono text-[10px]">EOS_TECH_SYNC // CHECKING_REGISTRY_LOCK</p>
                       </div>
                       {!isProcessing && (
                          <div className="p-10 bg-black/60 rounded-[48px] border border-emerald-500/20 text-left space-y-4 shadow-inner animate-in slide-in-from-bottom-4">
                             <div className="flex items-center gap-3">
                                <BadgeCheck className="w-6 h-6 text-emerald-400" />
                                <h4 className="text-xl font-black text-white uppercase italic">Oracle Verification</h4>
                             </div>
                             <p className="text-slate-400 italic text-sm leading-relaxed">
                                "The {selectedAsset.name} has been verified for high-fidelity sync with Node {user.esin}. m-Constant stability predicted at 1.42x."
                             </p>
                             <button 
                               onClick={handleStepEscrow}
                               className="w-full py-6 mt-6 bg-emerald-600 hover:bg-emerald-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl"
                             >
                                PROCEED TO ESCROW
                             </button>
                          </div>
                       )}
                    </div>
                 )}

                 {provisionStep === 'escrow' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-3xl group">
                             <Fingerprint className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Capital <span className="text-emerald-400">Escrow</span></h4>
                          <p className="text-slate-400 text-lg italic">Sign the escrow shard to commit capital to the organizational node.</p>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] text-center block">Steward Signature (ESIN)</label>
                          <input 
                             type="text" 
                             value={esinSign}
                             onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black/60 border border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white outline-none focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>

                       <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[44px] flex items-center gap-6 shadow-inner">
                          <Wallet className="w-10 h-10 text-emerald-500 shrink-0" />
                          <div className="space-y-1">
                             <p className="text-[10px] text-emerald-200/50 font-black uppercase tracking-tight text-left">
                                INGEST_FEE: No additional transaction fees for official HQ shards.
                             </p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase text-left italic">
                                Total Settlement: {selectedAsset.price} EAC
                             </p>
                          </div>
                       </div>

                       <button 
                         onClick={handleExecuteEscrow}
                         disabled={!esinSign}
                         className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
                       >
                          <Stamp className="w-8 h-8 fill-current" /> AUTHORIZE PROVISIONING
                       </button>
                    </div>
                 )}

                 {provisionStep === 'anchor' && (
                    <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in fade-in duration-500">
                       <div className="relative">
                          <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Database className="w-10 h-10 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.5em] animate-pulse italic">Anchoring Registry Shard...</p>
                          <p className="text-slate-600 font-mono text-[10px]">COMMITTING_TO_LEDGER // ZK_SNARK_FINALITY</p>
                       </div>
                    </div>
                 )}

                 {provisionStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic leading-none m-0">Provision <span className="text-emerald-400">Finalized</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0xCORE_SYNC_OK</p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-4 w-full text-left relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform"><Activity className="w-32 h-32" /></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-2">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Shard Status</span>
                             <span className="text-white font-mono font-black text-xl text-emerald-400 uppercase italic">ACTIVE_INFLOW</span>
                          </div>
                          <div className="h-px w-full bg-white/10"></div>
                          <p className="text-[10px] text-slate-400 italic px-2">"This asset is now immutably linked to Node {user.esin}. Use the TQM Hub to monitor active lifecycle shards."</p>
                       </div>
                       <button onClick={resetPortal} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Store</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Institutional Footer */}
      <div className="p-16 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <Fingerprint className="w-96 h-96 text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
               <ShieldCheck className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-4">
               <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Organizational Integrity</h4>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-md:text-sm max-w-md">Every asset in this store is manufactured to institutional standards. Second-life assets must be acquired via the Circular Grid.</p>
            </div>
         </div>
         <div className="text-right relative z-10 shrink-0">
            <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-2 border-b border-white/10 pb-4">PROPRIETARY_RESERVE</p>
            <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter">100<span className="text-2xl font-bold">%</span></p>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-2">Certified First-Party</p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default EnvirosAgroStore;
