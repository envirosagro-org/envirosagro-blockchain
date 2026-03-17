import React from 'react';
import { Droplets, Gauge, FlaskConical, Database } from 'lucide-react';
import ResourceDimensionBase, { ResourceMeta } from './ResourceDimensionBase';
import { User, ViewState } from '../../types';
import { useAppStore } from '../../store';

interface AquaPortalProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

const AquaPortal: React.FC<AquaPortalProps> = (props) => {
  const { ecosystemState, updateEcosystemState } = useAppStore();

  const meta: ResourceMeta = {
    title: 'AQUA PORTAL',
    icon: Droplets,
    color: 'text-blue-500',
    accent: '#3b82f6',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    formula: 'W_eff = m * sqrt(V_storage / D_loss)',
    philosophy: '"Hydraulic Integrity Protocol. Precision moisture sharding and flow auditing."',
    metrics: [
      { label: 'FLOW VELOCITY', val: '12 L/s', icon: Gauge },
      { label: 'PURITY CONSTANT', val: '0.98', icon: FlaskConical },
      { label: 'STORAGE SHARD', val: '84%', icon: Database },
    ],
    forgeTitle: 'Water Purity Shard',
    forgeDesc: 'Verify and register an industrial water source purity report.',
    simControls: [
      { label: 'm: Resilience', val: ecosystemState.p1, set: (v) => updateEcosystemState({ p1: v }), min: 1, max: 2, step: 0.01 },
      { label: 'V: Storage', val: ecosystemState.p2, set: (v) => updateEcosystemState({ p2: v }), min: 100, max: 5000, step: 10 },
      { label: 'D: Loss', val: ecosystemState.p3, set: (v) => updateEcosystemState({ p3: v }), min: 1, max: 100, step: 1 },
    ],
    ledgerItems: [
      { id: 'SHD-H2O-882', name: 'Sector 4 Aquifer Shard', hash: '0x882A_H2O', status: 'VERIFIED' },
      { id: 'SHD-H2O-104', name: 'Desalination Logic Shard', hash: '0x104B_H2O', status: 'ACTIVE' },
    ]
  };

  return <ResourceDimensionBase {...props} type="aqua_portal" meta={meta} />;
};

export default AquaPortal;
