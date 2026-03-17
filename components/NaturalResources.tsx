import React, { Suspense, lazy } from 'react';
import { Loader2, Globe, Layers, ShieldCheck } from 'lucide-react';
import { User, ViewState } from '../types';
import { useAppStore } from '../store';

// Lazy load each dimension
const AnimalWorld = lazy(() => import('./natural_resources/AnimalWorld'));
const PlantsWorld = lazy(() => import('./natural_resources/PlantsWorld'));
const AquaPortal = lazy(() => import('./natural_resources/AquaPortal'));
const SoilPortal = lazy(() => import('./natural_resources/SoilPortal'));
const AirPortal = lazy(() => import('./natural_resources/AirPortal'));

interface NaturalResourcesProps {
  user: User;
  type: ViewState;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

const NaturalResources: React.FC<NaturalResourcesProps> = (props) => {
  const { ecosystemState } = useAppStore();

  const renderDimension = () => {
    switch (props.type) {
      case 'animal_world': return <AnimalWorld {...props} />;
      case 'plants_world': return <PlantsWorld {...props} />;
      case 'aqua_portal': return <AquaPortal {...props} />;
      case 'soil_portal': return <SoilPortal {...props} />;
      case 'air_portal': return <AirPortal {...props} />;
      default: return (
        <div className="p-20 text-center opacity-30 italic font-black uppercase tracking-widest">
          Unknown Dimension Node
        </div>
      );
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Global Sync Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Global Ecosystem Sync</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
          <div className="flex items-center gap-2">
            <Layers size={12} className="text-slate-500" />
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Active Dimensions: 5/5</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Stability Index:</span>
            <span className="text-[10px] font-mono font-black text-emerald-400">1.42x</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className={ecosystemState.isAnchored ? "text-emerald-500" : "text-amber-500"} />
            <span className={`text-[7px] font-black uppercase tracking-widest ${ecosystemState.isAnchored ? "text-emerald-500" : "text-amber-500"}`}>
              {ecosystemState.isAnchored ? "ANCHORED" : "DRIFT_DETECTED"}
            </span>
          </div>
        </div>
      </div>

      <Suspense fallback={
        <div className="min-h-[600px] flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <Loader2 size={64} className="text-emerald-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe size={24} className="text-emerald-400 animate-pulse" />
            </div>
          </div>
          <p className="text-emerald-500 font-black text-xs uppercase tracking-[0.4em] animate-pulse italic">
            Resolving Dimension Shards...
          </p>
        </div>
      }>
        {renderDimension()}
      </Suspense>
    </div>
  );
};

export default NaturalResources;
