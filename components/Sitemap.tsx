import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Map as MapIcon, 
  ChevronRight, 
  ArrowRight,
  Database,
  Activity,
  Layers,
  Box,
  Fingerprint,
  Cpu,
  Workflow,
  SearchCode,
  Target,
  BoxSelect,
  BadgeCheck,
  Binary,
  Globe,
  Monitor,
  Zap,
  Info,
  ShieldPlus,
  Compass,
  LayoutGrid,
  ClipboardCheck,
  Terminal,
  SmartphoneNfc,
  Search,
  Command,
  ArrowUpRight,
  Bot,
  Leaf,
  History,
  ShieldCheck,
  Atom,
  Wind,
  Droplets,
  Sprout,
  Waves,
  Scale,
  Maximize2,
  X,
  Code,
  Stamp
} from 'lucide-react';
import { ViewState } from '../types';
import { RegistryGroup } from '../App';

interface SitemapProps {
  nodes: RegistryGroup[];
  onNavigate: (view: ViewState, section?: string) => void;
}

const Sitemap: React.FC<SitemapProps> = ({ nodes, onNavigate }) => {
  const [resolverInput, setResolverInput] = useState('');
  const [activeDimension, setActiveDimension] = useState<number | null>(null);

  // Flat manifest for the "Section-First" resolver logic
  const globalManifest = useMemo(() => {
    const flat: { id: string; name: string; dimension: ViewState; sectionId?: string; address: string; category: string; icon: any }[] = [];
    nodes.forEach((group, dIdx) => {
      group.items.forEach((item, eIdx) => {
        // Base Node Shard
        flat.push({
          id: item.id,
          name: item.name,
          dimension: item.id as ViewState,
          address: `[${dIdx + 1}.${eIdx + 1}]`,
          category: group.category,
          icon: item.icon
        });
        // Sub-Section Shards (Vectors)
        item.sections?.forEach((section, sIdx) => {
          flat.push({
            id: section.id,
            name: section.label,
            dimension: item.id as ViewState,
            sectionId: section.id,
            address: `[${dIdx + 1}.${eIdx + 1}.${sIdx + 1}]`,
            category: group.category,
            icon: item.icon
          });
        });
      });
    });
    return flat;
  }, [nodes]);

  const filteredManifest = useMemo(() => {
    if (!resolverInput.trim()) return [];
    const term = resolverInput.toLowerCase();
    return globalManifest.filter(m => 
      m.name.toLowerCase().includes(term) || 
      m.id.toLowerCase().includes(term) || 
      m.address.includes(term)
    ).slice(0, 10);
  }, [globalManifest, resolverInput]);

  const handleResolve = (m: any) => {
    onNavigate(m.dimension, m.sectionId);
    setResolverInput('');
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Matrix Header HUD */}
      <div className="glass-card p-12 md:p-16 rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl z-10 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[20s] group-hover:rotate-45">
            <Network size={800} className="text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row flex-1">
            <div className="w-32 h-32 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.3)] border-4 border-white/10 shrink-0 animate-float">
               <MapIcon size={56} className="text-white" />
            </div>
            <div className="space-y-4">
               <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic m-0 drop-shadow-2xl tracking-tighter leading-none">REGISTRY <span className="text-emerald-400">MATRIX.</span></h2>
               <p className="text-slate-400 text-2xl font-medium italic max-w-2xl opacity-80">
                  "Section-First industrial routing. Every protocol, geofence, and financial shard addressable via Vector Address Resolution."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-12 hidden lg:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">ADDRESSABLE_SHARDS</p>
            <p className="text-[120px] font-mono font-black text-white tracking-tighter leading-none m-0">{globalManifest.length}</p>
         </div>
      </div>

      {/* 2. Global Resolver Terminal */}
      <div className="max-w-4xl mx-auto space-y-6 relative z-30 -mt-10">
         <div className="glass-card p-4 rounded-[40px] border-2 border-emerald-500/30 bg-black/80 shadow-[0_40px_100px_rgba(0,0,0,0.9)] flex items-center relative group">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xl mr-6 shrink-0 border-2 border-white/10 group-hover:rotate-12 transition-transform">
               <Command size={20} />
            </div>
            <input 
               type="text" 
               value={resolverInput}
               onChange={e => setResolverInput(e.target.value)}
               placeholder="Input Vector Address (e.g. [1.1.2]) or Shard ID..."
               className="flex-1 bg-transparent border-none text-2xl font-mono text-emerald-400 placeholder:text-emerald-950 font-black tracking-widest focus:ring-0 outline-none italic"
            />
            {resolverInput && (
               <button onClick={() => setResolverInput('')} className="p-3 text-slate-700 hover:text-white transition-all"><X size={24} /></button>
            )}
         </div>

         {/* Resolver Results Dropdown */}
         {filteredManifest.length > 0 && (
            <div className="absolute top-28 left-0 right-0 glass-card rounded-[48px] border-2 border-emerald-500/20 bg-[#050706] shadow-3xl overflow-hidden z-40 animate-in slide-in-from-top-4 duration-500">
               <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between px-10">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] italic">Resolver_Matches</span>
                  <span className="text-[10px] font-mono text-slate-700">{filteredManifest.length} Result Shards</span>
               </div>
               <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {filteredManifest.map((m, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleResolve(m)}
                      className="p-6 hover:bg-emerald-600/10 cursor-pointer transition-all flex items-center justify-between group px-10"
                    >
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <m.icon size={24} className="text-slate-500 group-hover:text-emerald-400" />
                          </div>
                          <div>
                             <h4 className="text-xl font-black text-white uppercase italic group-hover:text-emerald-400 transition-colors">{m.name}</h4>
                             <p className="text-[10px] text-slate-700 font-mono mt-1 uppercase font-bold">{m.category} // {m.id}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-xl font-mono font-black text-emerald-500/40 group-hover:text-emerald-400 transition-colors">{m.address}</span>
                          <div className="p-3 bg-white/5 rounded-full text-slate-700 group-hover:text-white group-hover:bg-emerald-600 transition-all shadow-xl">
                             <ArrowUpRight size={20} />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         )}
      </div>

      {/* 3. The 6-Dimensional Registry Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 pt-10">
        {nodes.map((group, dIdx) => (
          <div 
            key={dIdx} 
            className={`glass-card p-12 rounded-[80px] border-2 transition-all duration-700 flex flex-col group/dim bg-black/40 shadow-3xl relative overflow-hidden h-fit ${
              activeDimension === dIdx ? 'border-emerald-500/40' : 'border-white/5 hover:border-emerald-500/20'
            }`}
            onClick={() => setActiveDimension(activeDimension === dIdx ? null : dIdx)}
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/dim:scale-125 transition-transform duration-[15s] pointer-events-none">
              <Network size={400} className="text-emerald-400" />
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-10 mb-10 relative z-10">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-emerald-400 uppercase tracking-[0.4em] leading-none m-0 drop-shadow-xl">{group.category}</h3>
                  <p className="text-[10px] text-slate-600 font-mono font-black uppercase tracking-widest italic">DIMENSION_0{dIdx + 1}</p>
               </div>
               <div className="w-16 h-16 rounded-[24px] bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-black text-xl shadow-inner">
                 D{dIdx + 1}
               </div>
            </div>

            <div className="space-y-12 relative z-10">
               {group.items.map((item, eIdx) => (
                  <div key={item.id} className="space-y-8 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${eIdx * 100}ms` }}>
                    {/* Element Node */}
                    <div className="flex items-start gap-8 group/node">
                       <div className="w-20 h-20 rounded-[32px] bg-black border-2 border-white/10 flex items-center justify-center text-slate-600 group-hover/node:bg-indigo-600/10 group-hover/node:text-indigo-400 group-hover/node:border-indigo-500/40 transition-all shadow-xl shrink-0">
                          <item.icon size={36} />
                       </div>
                       <div className="flex-1 space-y-4">
                          <div 
                            onClick={(e) => { e.stopPropagation(); onNavigate(item.id as ViewState); }}
                            className="flex items-center gap-3 cursor-pointer group/link w-fit"
                          >
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover/link:text-emerald-400 transition-colors drop-shadow-lg">{item.name}</h4>
                             <span className="text-[11px] font-mono text-emerald-500/20 bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10 shadow-inner">[{dIdx+1}.{eIdx+1}]</span>
                          </div>
                          
                          {/* Vector Shards (Sections) */}
                          <div className="flex flex-wrap gap-3 pt-2">
                             {item.sections?.map((section, sIdx) => (
                                <button 
                                  key={section.id}
                                  onClick={(e) => { e.stopPropagation(); onNavigate(item.id as ViewState, section.id); }}
                                  className="px-6 py-3 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-400 rounded-full text-[11px] font-black uppercase text-slate-500 hover:text-white transition-all flex items-center gap-3 group/shard shadow-lg active:scale-95"
                                >
                                   <span className="text-[9px] font-mono text-indigo-500/40 group-hover/shard:text-white/50">[{dIdx+1}.{eIdx+1}.{sIdx+1}]</span>
                                   <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover/shard:bg-white transition-colors"></div>
                                   {section.label}
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                    {eIdx < group.items.length - 1 && <div className="h-px w-full bg-white/5 ml-28"></div>}
                  </div>
               ))}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Matrix Legend / Bottom Branding */}
      <div className="p-16 md:p-24 glass-card rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col xl:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mx-4 mt-20 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[20s] group-hover:rotate-45">
            <ShieldCheck size={1000} className="text-emerald-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.4)] animate-pulse ring-[24px] ring-white/5 shrink-0 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Stamp size={80} className="text-white relative z-20 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">REGISTRY <span className="text-emerald-400">SYNC.</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-3xl opacity-80">
                 "Every dimension, element, and shard within the EnvirosAgro ecosystem is uniquely addressable via the Vector Resolution Protocol."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-24 hidden xl:block">
            <p className="text-[16px] text-slate-600 font-black uppercase mb-8 tracking-[0.8em] border-b border-white/10 pb-6">NETWORK_DEPTH</p>
            <p className="text-[140px] font-mono font-black text-white tracking-tighter leading-none m-0">60</p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
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

export default Sitemap;