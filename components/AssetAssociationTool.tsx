import React, { useState, useEffect } from 'react';
import { 
  X, 
  Workflow, 
  PlusCircle, 
  Monitor, 
  Sprout, 
  FlaskConical, 
  Factory, 
  Leaf, 
  Wrench, 
  Video, 
  ShieldAlert, 
  Cpu, 
  MapPin, 
  ArrowRight, 
  Zap, 
  Database, 
  SmartphoneNfc, 
  SearchCode,
  Briefcase,
  Bot,
  Loader2,
  Package,
  Truck,
  Warehouse,
  Info
} from 'lucide-react';
import { ViewState, User } from '../types';
import { chatWithAgroLang, queryProgramAssets } from '../services/agroLangService';

interface LinkerContext {
  label: string;
  target?: string;
  action?: string;
  sourceLedger?: string;
}

interface AssetAssociationToolProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAsset: any;
  linkerContext: LinkerContext | null;
  onNavigate: (view: ViewState, action?: string) => void;
  onLinkResource: (resId: string, name: string, type?: string) => void;
  industrialUnits: any[];
  blueprints: any[];
  contracts?: any[];
  liveProducts?: any[];
  user: User;
}

const AssetAssociationTool: React.FC<AssetAssociationToolProps> = ({
  isOpen,
  onClose,
  selectedAsset,
  linkerContext,
  onNavigate,
  onLinkResource,
  industrialUnits,
  blueprints,
  contracts = [],
  liveProducts = [],
  user
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  // Program Querying State
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isQueryingProgram, setIsQueryingProgram] = useState(false);
  const [programAssets, setProgramAssets] = useState<any[] | null>(null);

  useEffect(() => {
    if (isOpen && selectedAsset && linkerContext) {
      scanForAssociations();
      setSelectedProgram(null);
      setProgramAssets(null);
    } else {
      setAiSuggestions([]);
      setSelectedProgram(null);
      setProgramAssets(null);
    }
  }, [isOpen, selectedAsset, linkerContext]);

  const handleProgramSelect = async (prog: any) => {
    setSelectedProgram(prog);
    setIsQueryingProgram(true);
    setProgramAssets(null);
    
    try {
      const assets = await queryProgramAssets(selectedAsset, prog.name, blueprints, industrialUnits);
      setProgramAssets(assets);
    } catch (error) {
      console.error("Failed to query program assets:", error);
      setProgramAssets([]);
    } finally {
      setIsQueryingProgram(false);
    }
  };

  const scanForAssociations = async () => {
    setIsScanning(true);
    try {
      const assetName = selectedAsset.productType || selectedAsset.cropType || selectedAsset.name || 'Unknown Asset';
      
      let suggestionTarget = 'industrial units, value blueprints, or ecosystem programs';
      if (linkerContext?.sourceLedger === 'CATEGORIES') {
        suggestionTarget = 'asset categories (e.g., Raw, Circular, Ready, Service, Input)';
      } else if (linkerContext?.sourceLedger === 'INDUSTRIAL') {
        suggestionTarget = 'industrial processing units';
      } else if (linkerContext?.sourceLedger === 'VALUE') {
        suggestionTarget = 'value blueprints';
      } else if (linkerContext?.sourceLedger === 'PROGRAMS') {
        suggestionTarget = 'ecosystem programs';
      } else if (linkerContext?.sourceLedger === 'MISSIONS') {
        suggestionTarget = 'farming contracts or missions';
      } else if (linkerContext?.sourceLedger === 'LIVE_FARMING_SHIFT') {
        suggestionTarget = 'live farming assets or programs';
      }

      const prompt = `Analyze the asset "${assetName}" (ID: ${selectedAsset.id}) within the context of "${linkerContext?.label}". 
      The Asset Association Tool integrates agro assets with various programs in the ecosystem for production planning and operations management.
      Suggest 2-3 specific, highly relevant ${suggestionTarget} that should be associated with this asset to maximize yield, efficiency, or ecological impact, ensuring the production system aligns with the right sequencing and routing processes.
      Format the response as a simple bulleted list. Keep it concise, technical, and actionable.`;
      
      const response = await chatWithAgroLang(prompt, []);
      const suggestions = response.text.split('\n').filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('*')).map((line: string) => line.replace(/^[-*]\s*/, '').trim());
      setAiSuggestions(suggestions.length > 0 ? suggestions : ["No specific high-priority associations detected at this time."]);
    } catch (error) {
      console.error("Failed to scan associations:", error);
      setAiSuggestions(["Neural scan failed. Please proceed with manual association."]);
    } finally {
      setIsScanning(false);
    }
  };

  if (!isOpen || !selectedAsset) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={onClose}></div>
       <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] shadow-[0_0_200px_rgba(99,102,241,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
          <div className="p-12 border-b border-white/5 bg-indigo-500/[0.01] flex justify-between items-center shrink-0">
             <div className="flex items-center gap-10">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl">
                   <Workflow size={40} />
                </div>
                <div>
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Asset <span className="text-indigo-400">Association</span> Tool</h3>
                   <p className="text-indigo-400/60 font-mono text-[11px] tracking-[0.5em] uppercase mt-4 italic">{linkerContext?.sourceLedger === 'CATEGORIES' ? 'ASSET_METADATA_LINKING' : 
                        linkerContext?.sourceLedger === 'PROGRAMS' ? 'ECOSYSTEM_PROGRAM_INTEGRATION' : 
                        'INVENTORY_LEDGER_SYNCHRONIZATION'}</p>
                </div>
             </div>
             <button onClick={onClose} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={32} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar bg-black/40 space-y-12">
             <div className="p-10 bg-indigo-600/5 rounded-[56px] border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-inner">
                <div className="text-left space-y-2">
                   <h4 className="text-2xl font-black text-white uppercase tracking-tighter m-0">In-Process: {selectedAsset.productType || selectedAsset.cropType || selectedAsset.name}</h4>
                   <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">{selectedAsset.id}</p>
                </div>
                <button 
                  onClick={() => onNavigate(linkerContext?.target as ViewState, linkerContext?.action)}
                  className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all flex items-center gap-3 border-2 border-white/10 ring-8 ring-white/5"
                >
                   <PlusCircle size={20} /> Register New {linkerContext?.sourceLedger === 'VALUE' ? 'Blueprint' : linkerContext?.sourceLedger === 'INDUSTRIAL' ? 'Unit' : 'Asset'}
                </button>
             </div>

             <div className="space-y-8">
                {/* AGRO LANG NEURAL ANALYST SUGGESTIONS */}
                <div className="p-8 bg-indigo-900/20 border border-indigo-500/30 rounded-[40px] relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><Bot size={100} /></div>
                   <div className="flex items-center gap-4 mb-6 relative z-10">
                      <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                         {isScanning ? <Loader2 size={24} className="animate-spin" /> : <Leaf size={24} />}
                      </div>
                      <div>
                         <h5 className="text-lg font-black text-white uppercase italic tracking-widest">Neural Analyst</h5>
                         <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-[0.2em]">Ensuring live farming standards & market quality</p>
                      </div>
                   </div>
                   <div className="relative z-10 space-y-3">
                      {isScanning ? (
                         <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                            Scanning ledger for optimal associations...
                         </div>
                      ) : (
                         <ul className="space-y-2">
                            {aiSuggestions.map((suggestion, idx) => (
                               <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                                  <ArrowRight size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                                  <span>{suggestion}</span>
                               </li>
                            ))}
                         </ul>
                      )}
                   </div>
                </div>

                <div className="flex items-center gap-4 px-6 border-b border-white/5 pb-4">
                   <Monitor size={20} className="text-blue-400" />
                   <h4 className="text-xl font-black text-white uppercase italic tracking-widest">
                      {linkerContext?.sourceLedger === 'INDUSTRIAL' ? 'Industrial Units' : 
                       linkerContext?.sourceLedger === 'VALUE' ? 'Value Blueprints' : 
                       linkerContext?.sourceLedger === 'PROGRAMS' ? 'Ecosystem Programs' :
                       linkerContext?.sourceLedger === 'CATEGORIES' ? 'Asset Categories' :
                       'Asset Inventory Ledger'}
                   </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Context-Aware Sourcing Logic */}
                   {linkerContext?.sourceLedger === 'CATEGORIES' ? (
                      [
                        { id: 'CAT-CIRC', name: 'Circular', icon: Sprout, col: 'text-emerald-400', desc: 'Regenerative and circular economy assets' },
                        { id: 'CAT-RAW', name: 'Raw', icon: Database, col: 'text-amber-400', desc: 'Unprocessed raw materials' },
                        { id: 'CAT-TOUR', name: 'Tours', icon: MapPin, col: 'text-blue-400', desc: 'Agro-tourism and educational visits' },
                         { id: 'CAT-INFO', name: 'Information', icon: Info, col: 'text-cyan-400', desc: 'Data shards, research, and technical documentation' },
                        { id: 'CAT-CONS', name: 'Consultation', icon: Monitor, col: 'text-purple-400', desc: 'Expert advice and planning' },
                        { id: 'CAT-READY', name: 'Products', icon: Package, col: 'text-green-400', desc: 'Ready-to-use consumer products' },
                        { id: 'CAT-SERV', name: 'Services', icon: Wrench, col: 'text-indigo-400', desc: 'General agricultural services' },
                        { id: 'CAT-LOG', name: 'Logistics', icon: Truck, col: 'text-orange-400', desc: 'Transportation and delivery' },
                        { id: 'CAT-FAC', name: 'Facility', icon: Factory, col: 'text-slate-400', desc: 'Processing or storage facilities' },
                        { id: 'CAT-ORG', name: 'Organization Service', icon: Workflow, col: 'text-fuchsia-400', desc: 'B2B organizational services' },
                        { id: 'CAT-INP', name: 'Input', icon: Zap, col: 'text-yellow-400', desc: 'Farming inputs (seeds, fertilizer)' },
                        { id: 'CAT-MFG', name: 'Manufacturing', icon: Cpu, col: 'text-red-400', desc: 'Industrial manufacturing processes' },
                        { id: 'CAT-WHSE', name: 'Warehousing', icon: Warehouse, col: 'text-teal-400', desc: 'Storage and inventory management' },
                        { id: 'CAT-DIST', name: 'Distribution', icon: ArrowRight, col: 'text-cyan-400', desc: 'Supply chain distribution networks' },
                        { id: 'CAT-VET', name: 'Veterinary', icon: ShieldAlert, col: 'text-rose-400', desc: 'Animal health and veterinary services' },
                      ].map(cat => (
                        <div 
                          key={cat.id} 
                          onClick={() => onLinkResource(cat.id, cat.name, 'CATEGORIES')}
                          className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-amber-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><cat.icon size={200} /></div>
                          <div className="flex justify-between items-start relative z-10">
                             <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${cat.col} group-hover/asset:scale-110 transition-all`}>
                                <cat.icon size={24} />
                             </div>
                             <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>CATEGORY</span>
                          </div>
                          <div className="relative z-10">
                             <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-amber-400 transition-colors">{cat.name}</h5>
                             <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{cat.id} // TYPE</p>
                             <p className="text-xs text-slate-400 mt-3 font-medium">{cat.desc}</p>
                          </div>
                          <div className="pt-6 border-t border-white/5 flex items-center justify-between text-amber-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                             SELECT_CATEGORY <ArrowRight size={14} />
                          </div>
                       </div>
                      ))
                   ) : linkerContext?.sourceLedger === 'PROGRAMS' ? (
                      selectedProgram ? (
                        <div className="col-span-full space-y-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-black text-white uppercase italic tracking-widest">{selectedProgram.name} Assets</h4>
                            <button onClick={() => setSelectedProgram(null)} className="text-xs text-slate-400 hover:text-white uppercase tracking-widest">Back to Programs</button>
                          </div>
                          
                          {isQueryingProgram ? (
                            <div className="py-20 flex flex-col items-center justify-center space-y-6">
                              <Loader2 size={48} className="text-indigo-400 animate-spin" />
                              <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Querying EnvirosAgro AI for optimal assets...</p>
                            </div>
                          ) : programAssets && programAssets.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                              {programAssets.map((asset: any, idx: number) => (
                                <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group hover:border-indigo-500/50 transition-all">
                                  <div className="space-y-2">
                                    <h5 className="text-lg font-black text-white uppercase italic tracking-tight">{asset.name}</h5>
                                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{asset.type} // {asset.id}</p>
                                    <p className="text-sm text-slate-300 mt-2">{asset.reason}</p>
                                  </div>
                                  <button 
                                    onClick={() => onLinkResource(asset.id, asset.name, asset.type === 'blueprint' ? 'VALUE' : 'INDUSTRIAL')}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                  >
                                    Associate
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-white/10 rounded-[48px] bg-black/40">
                              <SearchCode size={48} className="text-slate-500" />
                              <div className="space-y-2">
                                <h5 className="text-lg font-black text-white uppercase tracking-widest">No Assets Found</h5>
                                <p className="text-sm text-slate-400">EnvirosAgro AI did not find any optimal assets for this live farming asset in the {selectedProgram.name} program.</p>
                              </div>
                              <button 
                                onClick={() => {
                                  onClose();
                                  const target = selectedProgram.name.toLowerCase().includes('value') ? 'agro_value_enhancement' : 
                                                 selectedProgram.name.toLowerCase().includes('cea') ? 'industrial' : 'ecosystem';
                                  onNavigate(target as ViewState, 'create');
                                }}
                                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3"
                              >
                                <PlusCircle size={16} /> Create Asset in Program
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        [
                          { id: 'PROG-VALUE', name: 'Value Enhancement', icon: FlaskConical, col: 'text-blue-400', desc: 'Optimize production blueprints' },
                          { id: 'PROG-PERMA', name: 'Permaculture', icon: Sprout, col: 'text-emerald-400', desc: 'Categorize in available zones' },
                          { id: 'PROG-BIO', name: 'Biotech Hub', icon: FlaskConical, col: 'text-fuchsia-400', desc: 'Track and trace genome' },
                          { id: 'PROG-CEA', name: 'CEA Portal', icon: Factory, col: 'text-teal-400', desc: 'Further evaluate under CEA' },
                          { id: 'PROG-CHROMA', name: 'Chroma SEHTI', icon: Leaf, col: 'text-amber-400', desc: 'Standardize frequency' },
                          { id: 'PROG-INV', name: 'Invention Ledger', icon: Wrench, col: 'text-blue-400', desc: 'Patent and IP tracking' },
                          { id: 'PROG-MEDIA', name: 'Media Ledger', icon: Video, col: 'text-rose-400', desc: 'Broadcast standardization' },
                          { id: 'PROG-EMERG', name: 'Emergency Command', icon: ShieldAlert, col: 'text-red-500', desc: 'Risk mitigation protocol' },
                          { id: 'PROG-SWARM', name: 'Robotic Swarm', icon: Cpu, col: 'text-indigo-400', desc: 'Automate physical tasks' },
                          { id: 'PROG-NAT', name: 'Natural Resources', icon: MapPin, col: 'text-green-500', desc: 'Ecological auditing' },
                        ].map(prog => (
                          <div 
                            key={prog.id} 
                            onClick={() => handleProgramSelect(prog)}
                            className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-purple-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><prog.icon size={200} /></div>
                            <div className="flex justify-between items-start relative z-10">
                               <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${prog.col} group-hover/asset:scale-110 transition-all`}>
                                  <prog.icon size={24} />
                               </div>
                               <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>ACTIVE</span>
                            </div>
                            <div className="relative z-10">
                               <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-purple-400 transition-colors">{prog.name}</h5>
                               <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{prog.id} // CATEGORY</p>
                               <p className="text-xs text-slate-400 mt-3 font-medium">{prog.desc}</p>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-purple-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                               QUERY_AI_ASSETS <ArrowRight size={14} />
                            </div>
                         </div>
                        ))
                      )
                   ) : linkerContext?.sourceLedger === 'INDUSTRIAL' ? (
                      industrialUnits.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center gap-6">
                           <Factory size={64} className="text-slate-700 animate-pulse" />
                           <p className="text-xl font-black uppercase tracking-widest">No active units found</p>
                        </div>
                      ) : (
                        industrialUnits.map(unit => (
                          <div 
                            key={unit.id} 
                            onClick={() => onLinkResource(unit.id, unit.name)}
                            className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><Factory size={200} /></div>
                            <div className="flex justify-between items-start relative z-10">
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-blue-400 group-hover/asset:scale-110 transition-all">
                                  <Factory size={24} />
                               </div>
                               <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>{unit.status}</span>
                            </div>
                            <div className="relative z-10">
                               <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-indigo-400 transition-colors">{unit.name}</h5>
                               <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{unit.id} // {unit.type}</p>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-indigo-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                               ASSOCIATE_UNIT <ArrowRight size={14} />
                            </div>
                         </div>
                        ))
                      )
                   ) : linkerContext?.sourceLedger === 'VALUE' ? (
                      blueprints.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center gap-6">
                           <FlaskConical size={64} className="text-slate-700 animate-pulse" />
                           <p className="text-xl font-black uppercase tracking-widest">No active blueprints found</p>
                        </div>
                      ) : (
                        blueprints.map(bp => (
                          <div 
                            key={bp.blueprint_id} 
                            onClick={() => onLinkResource(bp.blueprint_id, bp.input_material.name)}
                            className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><FlaskConical size={200} /></div>
                            <div className="flex justify-between items-start relative z-10">
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-fuchsia-400 group-hover/asset:scale-110 transition-all">
                                  <Zap size={24} />
                               </div>
                               <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>{bp.status}</span>
                            </div>
                            <div className="relative z-10">
                               <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-indigo-400 transition-colors">{bp.input_material.name}</h5>
                               <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{bp.blueprint_id} // Δ +{bp.projected_value_delta}%</p>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-indigo-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                               ASSOCIATE_BLUEPRINT <ArrowRight size={14} />
                            </div>
                         </div>
                        ))
                      )
                   ) : linkerContext?.sourceLedger === 'MISSIONS' ? (
                      contracts.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center gap-6">
                           <Briefcase size={64} className="text-slate-700 animate-pulse" />
                           <p className="text-xl font-black uppercase tracking-widest">No active missions found</p>
                        </div>
                      ) : (
                        contracts.map(contract => (
                          <div 
                            key={contract.id} 
                            onClick={() => onLinkResource(contract.id, contract.productType, 'MISSIONS')}
                            className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-amber-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><Briefcase size={200} /></div>
                            <div className="flex justify-between items-start relative z-10">
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-amber-400 group-hover/asset:scale-110 transition-all">
                                  <Briefcase size={24} />
                               </div>
                               <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>{contract.status}</span>
                            </div>
                            <div className="relative z-10">
                               <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-amber-400 transition-colors">{contract.productType}</h5>
                               <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{contract.id} // {contract.category}</p>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-amber-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                               SYNC_MISSION <ArrowRight size={14} />
                            </div>
                         </div>
                        ))
                      )
                   ) : linkerContext?.sourceLedger === 'LIVE_FARMING_SHIFT' ? (
                      liveProducts.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center gap-6">
                           <Sprout size={64} className="text-emerald-700 animate-pulse" />
                           <p className="text-xl font-black uppercase tracking-widest">No live farming programs found</p>
                        </div>
                      ) : (
                        liveProducts.map(product => (
                          <div 
                            key={product.id} 
                            onClick={() => onLinkResource(product.id, product.name, 'LIVE_FARMING')}
                            className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-emerald-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><Sprout size={200} /></div>
                            <div className="flex justify-between items-start relative z-10">
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-emerald-400 group-hover/asset:scale-110 transition-all">
                                  <Sprout size={24} />
                               </div>
                               <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>{product.status}</span>
                            </div>
                            <div className="relative z-10">
                               <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-emerald-400 transition-colors">{product.name}</h5>
                               <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{product.id} // {product.cropType}</p>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-emerald-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                               SHIFT_TO_PROGRAM <ArrowRight size={14} />
                            </div>
                         </div>
                        ))
                      )
                   ) : (
                      /* Fallback to general resources */
                      user.resources && user.resources.length > 0 ? (
                         user.resources.map(res => (
                            <div 
                               key={res.id} 
                               onClick={() => onLinkResource(res.id, res.name)}
                               className="glass-card p-8 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group/asset cursor-pointer flex flex-col justify-between h-[300px] shadow-xl relative overflow-hidden"
                            >
                               <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover/asset:scale-110 transition-transform"><Database size={200} /></div>
                               <div className="flex justify-between items-start relative z-10">
                                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${res.category === 'LAND' ? 'text-emerald-400' : 'text-blue-400'} group-hover/asset:scale-110 transition-transform`}>
                                     {res.category === 'LAND' ? <MapPin size={24} /> : <SmartphoneNfc size={24} />}
                                  </div>
                                  <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase`}>{res.status}</span>
                               </div>
                               <div className="relative z-10">
                                  <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight group-hover/asset:text-indigo-400 transition-colors">{res.name}</h5>
                                  <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase tracking-widest">{res.id} // {res.category}</p>
                               </div>
                               <div className="pt-6 border-t border-white/5 flex items-center justify-between text-indigo-400 text-[9px] font-black uppercase tracking-widest relative z-10">
                                  ASSOCIATE_SHARD <ArrowRight size={14} />
                               </div>
                            </div>
                         ))
                      ) : (
                         <div className="col-span-full py-20 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center gap-6">
                            <SearchCode size={64} className="text-slate-700 animate-pulse" />
                            <p className="text-xl font-black uppercase tracking-widest">No local shards found</p>
                         </div>
                      )
                   )}
                </div>
             </div>
          </div>

          <div className="p-12 border-t border-white/5 bg-black/95 text-center shrink-0 z-20">
             <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.8em] italic">INDUSTRIAL_LINKING_PROTOCOL v6.5 // secured shard</p>
          </div>
       </div>
    </div>
  );
};

export default AssetAssociationTool;
