import React from 'react';
import { TreePine, Target, Heart, Binary } from 'lucide-react';
import ResourceDimensionBase, { ResourceMeta } from './ResourceDimensionBase';
import { User, ViewState } from '../../types';
import { useAppStore } from '../../store';

interface PlantsWorldProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

const PlantsWorld: React.FC<PlantsWorldProps> = (props) => {
  const { ecosystemState, updateEcosystemState } = useAppStore();

  const meta: ResourceMeta = {
    title: 'PLANTS WORLD',
    icon: TreePine,
    color: 'text-emerald-500',
    accent: '#10b981',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    formula: 'P_res = ∫(E_human * Ca) dt',
    philosophy: '"Phyto-Psychological Resonance (PPR). Mapping plant socialism and human engagement."',
    metrics: [
      { label: 'GROWTH RESILIENCE', val: '1.42x', icon: Target },
      { label: 'STEWARD SYNC', val: '99%', icon: Heart },
      { label: 'DNA SHARD INTEGRITY', val: '100%', icon: Binary },
    ],
    forgeTitle: 'Botanical Lineage Shard',
    forgeDesc: 'Document and anchor a specific seed lineage into the registry.',
    simControls: [
      { label: 'E: Engagement', val: ecosystemState.p1, set: (v) => updateEcosystemState({ p1: v }), min: 0.1, max: 5, step: 0.1 },
      { label: 'Ca: Agro Code', val: ecosystemState.p2, set: (v) => updateEcosystemState({ p2: v }), min: 1, max: 10, step: 0.1 },
    ],
    ledgerItems: [
      { id: 'SHD-PLA-882', name: 'Bantu Maize DNA Shard', hash: '0x882A_PLA', status: 'VERIFIED' },
      { id: 'SHD-PLA-104', name: 'Fungal Network Shard', hash: '0x104B_PLA', status: 'ARCHIVED' },
    ]
  };

  return <ResourceDimensionBase {...props} type="plants_world" meta={meta} />;
};

export default PlantsWorld;
