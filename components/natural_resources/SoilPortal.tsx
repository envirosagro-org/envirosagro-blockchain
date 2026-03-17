import React from 'react';
import { Mountain, Sprout, Layers, Thermometer } from 'lucide-react';
import ResourceDimensionBase, { ResourceMeta } from './ResourceDimensionBase';
import { User, ViewState } from '../../types';
import { useAppStore } from '../../store';

interface SoilPortalProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

const SoilPortal: React.FC<SoilPortalProps> = (props) => {
  const { ecosystemState, updateEcosystemState } = useAppStore();

  const meta: ResourceMeta = {
    title: 'SOIL PORTAL',
    icon: Mountain,
    color: 'text-orange-500',
    accent: '#f97316',
    bg: 'bg-orange-500/5',
    border: 'border-orange-500/20',
    formula: 'S_health = Ca * τ_regen',
    philosophy: '"Biometric Substrate Sharding. Soil DNA sequencing and nutrient depth audits."',
    metrics: [
      { label: 'ORGANIC SHARD', val: '6.2%', icon: Sprout },
      { label: 'MINERAL STABILITY', val: '94%', icon: Layers },
      { label: 'THERMAL DEPTH', val: '22°C', icon: Thermometer },
    ],
    forgeTitle: 'Substrate Health Shard',
    forgeDesc: 'Commit regional soil mineral density data to the ledger.',
    simControls: [
      { label: 'Ca: Agro Code', val: ecosystemState.p1, set: (v) => updateEcosystemState({ p1: v }), min: 1, max: 10, step: 0.1 },
      { label: 'τ: Regen Time', val: ecosystemState.p2, set: (v) => updateEcosystemState({ p2: v }), min: 1, max: 100, step: 1 },
    ],
    ledgerItems: [
      { id: 'SHD-SOL-882', name: 'Micro-Nutrient Density Shard', hash: '0x882A_SOL', status: 'VERIFIED' },
      { id: 'SHD-SOL-104', name: 'Regen-Tilling Verification', hash: '0x104B_SOL', status: 'VERIFIED' },
    ]
  };

  return <ResourceDimensionBase {...props} type="soil_portal" meta={meta} />;
};

export default SoilPortal;
