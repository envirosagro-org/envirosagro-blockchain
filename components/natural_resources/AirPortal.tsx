import React from 'react';
import { Wind, Activity, Binary, Waves } from 'lucide-react';
import ResourceDimensionBase, { ResourceMeta } from './ResourceDimensionBase';
import { User, ViewState } from '../../types';
import { useAppStore } from '../../store';

interface AirPortalProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

const AirPortal: React.FC<AirPortalProps> = (props) => {
  const { ecosystemState, updateEcosystemState } = useAppStore();

  const meta: ResourceMeta = {
    title: 'AIR PORTAL',
    icon: Wind,
    color: 'text-sky-400',
    accent: '#38bdf8',
    bg: 'bg-sky-400/5',
    border: 'border-sky-400/20',
    formula: 'A_purity = 1 - (SID_load / O2)',
    philosophy: '"Atmospheric Carbon Sharding. Spectral auditing of gaseous transparency."',
    metrics: [
      { label: 'OXYGEN SATURATION', val: '21.4%', icon: Activity },
      { label: 'CARBON SHARD DENSITY', val: '412 ppm', icon: Binary },
      { label: 'ACOUSTIC CLARITY', val: '99%', icon: Waves },
    ],
    forgeTitle: 'Atmospheric Sync Shard',
    forgeDesc: 'Mint carbon sequestration potential based on air quality metrics.',
    simControls: [
      { label: 'SID: Viral Load', val: ecosystemState.p1, set: (v) => updateEcosystemState({ p1: v }), min: 0, max: 100, step: 1 },
      { label: 'O2: Oxygen', val: ecosystemState.p2, set: (v) => updateEcosystemState({ p2: v }), min: 50, max: 100, step: 1 },
    ],
    ledgerItems: [
      { id: 'SHD-AIR-882', name: 'Zone 4 Particulate Shard', hash: '0x882A_AIR', status: 'VERIFIED' },
      { id: 'SHD-AIR-104', name: 'Carbon Flux Shard', hash: '0x104B_AIR', status: 'ACTIVE' },
    ]
  };

  return <ResourceDimensionBase {...props} type="air_portal" meta={meta} />;
};

export default AirPortal;
