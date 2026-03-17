import React from 'react';
import { PawPrint, Users, Brain, Activity } from 'lucide-react';
import ResourceDimensionBase, { ResourceMeta } from './ResourceDimensionBase';
import { User, ViewState } from '../../types';
import { useAppStore } from '../../store';

interface AnimalWorldProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

const AnimalWorld: React.FC<AnimalWorldProps> = (props) => {
  const { ecosystemState, updateEcosystemState } = useAppStore();

  const meta: ResourceMeta = {
    title: 'ANIMAL WORLD',
    icon: PawPrint,
    color: 'text-amber-500',
    accent: '#f59e0b',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    formula: 'ASE = (P * S) / H_stress',
    philosophy: '"Animal-Social Equilibrium (ASE). Livestock as independent economic nodes."',
    metrics: [
      { label: 'HERD SOCIALISM', val: '92%', icon: Users },
      { label: 'NEURAL PSYCHOLOGY', val: '0.84', icon: Brain },
      { label: 'METABOLIC INGEST', val: '98%', icon: Activity },
    ],
    forgeTitle: 'Animal Identity Shard',
    forgeDesc: 'Mint a new biometric identity for an individual animal node.',
    simControls: [
      { label: 'P: Population', val: ecosystemState.p1, set: (v) => updateEcosystemState({ p1: v }), min: 1, max: 500, step: 1 },
      { label: 'S: Stewardship', val: ecosystemState.p2, set: (v) => updateEcosystemState({ p2: v }), min: 0.1, max: 2, step: 0.01 },
      { label: 'H: Stress', val: ecosystemState.p3, set: (v) => updateEcosystemState({ p3: v }), min: 0.01, max: 1, step: 0.01 },
    ],
    ledgerItems: [
      { id: 'SHD-ANI-882', name: 'Bovine Identity Shard', hash: '0x882A_ANI', status: 'VERIFIED' },
      { id: 'SHD-ANI-104', name: 'Avian Ingest Thread', hash: '0x104B_ANI', status: 'AUDITING' },
    ]
  };

  return <ResourceDimensionBase {...props} type="animal_world" meta={meta} />;
};

export default AnimalWorld;
