import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  LayoutDashboard, ShoppingCart, Wallet, Menu, X, Radio, ShieldAlert, Zap, ShieldCheck, Landmark, Store, Cable, Mic, Coins, Activity, Globe, Share2, Search, Bell, Wrench, Recycle, HeartHandshake, ClipboardCheck, ChevronLeft, Sprout, Briefcase, PawPrint, TrendingUp, Compass, Siren, History, Infinity, Scale, FileSignature, CalendarDays, Palette, Cpu, Microscope, Wheat, Database, BoxSelect, Dna, Boxes, LifeBuoy, Terminal, Handshake, Users, Info, Droplets, Mountain, Wind, LogOut, Warehouse, Factory, Monitor, FlaskConical, Scan, QrCode, Flower, ArrowLeftCircle, TreePine, Binary, Gauge, Loader2, ChevronDown, Leaf, AlertCircle, Copy, Check, ExternalLink, Network as NetworkIcon, User as UserIcon, UserPlus,
  Tv, Fingerprint, BadgeCheck, AlertTriangle, FileText, Clapperboard, FileStack, Code2, Signal as SignalIcon, Target,
  Truck, Layers, Map as MapIcon, Compass as CompassIcon, Server, Workflow, ShieldPlus, ChevronLeftCircle, ArrowLeft,
  ChevronRight, ArrowUp, UserCheck, BookOpen, Stamp, Binoculars, Command, Bot, Wand2, Brain, ArrowRight, Home,
  Building, ShieldX, ScanLine,
  MapPin,
  Download,
  FileDigit,
  Music,
  GraduationCap,
  ArrowUpRight,
  ShoppingBag,
  Sparkle,
  Mail,
  BellRing,
  Settings,
  CheckCircle2,
  Video,
  Clock,
  SearchCode,
  LayoutGrid,
  Calculator,
  Lock,
  Network,
  SmartphoneNfc,
  Cloud
} from 'lucide-react';
import { Toaster } from 'sonner';
import { useAppStore } from './store';
import { ViewState, User, UserRole, AgroProject, FarmingContract, Order, VendorProduct, RegisteredUnit, LiveAgroProduct, AgroBlock, AgroTransaction, NotificationShard, NotificationType, MediaShard, SignalShard, VectorAddress, ShardCostCalibration, Task, ValueBlueprint, DispatchChannel, HoodConnection } from './types';

import { RegistrationResumePopup } from './components/RegistrationResumePopup';

const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Sustainability = React.lazy(() => import('./components/Sustainability'));
const Economy = React.lazy(() => import('./components/Economy'));
const Industrial = React.lazy(() => import('./components/Industrial'));
const Intelligence = React.lazy(() => import('./components/Intelligence'));
const Community = React.lazy(() => import('./components/Community'));
const Explorer = React.lazy(() => import('./components/Explorer'));
const Ecosystem = React.lazy(() => import('./components/Ecosystem'));
const MediaHub = React.lazy(() => import('./components/MediaHub'));
const InfoPortal = React.lazy(() => import('./components/InfoPortal'));
const Login = React.lazy(() => import('./components/Login'));
const AgroWallet = React.lazy(() => import('./components/AgroWallet'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const InvestorPortal = React.lazy(() => import('./components/InvestorPortal'));
const VendorPortal = React.lazy(() => import('./components/VendorPortal'));
const NetworkIngest = React.lazy(() => import('./components/NetworkIngest'));
const ToolsSection = React.lazy(() => import('./components/ToolsSection'));
const LiveVoiceBridge = React.lazy(() => import('./components/LiveVoiceBridge'));
const Channelling = React.lazy(() => import('./components/Channelling'));
const EvidenceModal = React.lazy(() => import('./components/EvidenceModal'));
const CircularGrid = React.lazy(() => import('./components/CircularGrid'));
const NexusCRM = React.lazy(() => import('./components/NexusCRM'));
const TQMGrid = React.lazy(() => import('./components/TQMGrid'));
const ResearchInnovation = React.lazy(() => import('./components/ResearchInnovation'));
const LiveFarming = React.lazy(() => import('./components/LiveFarming'));
const ContractFarming = React.lazy(() => import('./components/ContractFarming'));
const Agrowild = React.lazy(() => import('./components/Agrowild'));
const FloatingConsultant = React.lazy(() => import('./components/FloatingConsultant'));
const Impact = React.lazy(() => import('./components/Impact'));
const NaturalResources = React.lazy(() => import('./components/NaturalResources'));
const IntranetPortal = React.lazy(() => import('./components/IntranetPortal'));
const EnvirosAgroStore = React.lazy(() => import('./components/EnvirosAgroStore'));
const CEA = React.lazy(() => import('./components/CEA'));
const Biotechnology = React.lazy(() => import('./components/Biotechnology'));
const Permaculture = React.lazy(() => import('./components/Permaculture'));
const EmergencyPortal = React.lazy(() => import('./components/EmergencyPortal'));
const AgroRegency = React.lazy(() => import('./components/AgroRegency'));
const CodeOfLaws = React.lazy(() => import('./components/CodeOfLaws'));
const AgroCalendar = React.lazy(() => import('./components/AgroCalendar'));
const ChromaSystem = React.lazy(() => import('./components/ChromaSystem'));
const AgroValueEnhancement = React.lazy(() => import('./components/AgroValueEnhancement'));
const DigitalMRV = React.lazy(() => import('./components/DigitalMRV'));
const OnlineGarden = React.lazy(() => import('./components/OnlineGarden'));
const FarmOS = React.lazy(() => import('./components/FarmOS'));
const MediaLedger = React.lazy(() => import('./components/MediaLedger'));
const AgroMultimediaGenerator = React.lazy(() => import('./components/AgroMultimediaGenerator'));
const Sitemap = React.lazy(() => import('./components/Sitemap'));
const AgroLangAnalyst = React.lazy(() => import('./components/AgroLangAnalyst'));
const VerificationHUD = React.lazy(() => import('./components/VerificationHUD'));
const SettingsPortal = React.lazy(() => import('./components/SettingsPortal'));
const TemporalVideo = React.lazy(() => import('./components/TemporalVideo'));
const Robot = React.lazy(() => import('./components/Robot'));
const MeshProtocol = React.lazy(() => import('./components/MeshProtocol'));
const RegistryHandshake = React.lazy(() => import('./components/RegistryHandshake'));
const EducationalResources = React.lazy(() => import('./components/EducationalResources'));
const CostAccountingDashboard = React.lazy(() => import('./components/CostAccountingDashboard'));
const InternalControlDashboard = React.lazy(() => import('./components/InternalControlDashboard'));

import { 
  syncUserToCloud, 
  auth, 
  getStewardProfile, 
  signOutSteward, 
  onAuthStateChanged,
  listenToCollection,
  saveCollectionItem,
  dispatchNetworkSignal,
  markPermanentAction,
  listenToPulse,
  refreshAuthUser,
  updateSignalReadStatus,
  markAllSignalsAsReadInDb,
  verifyAppCheckHandshake,
  startBackgroundDataSync
} from './services/firebaseService';
import { chatWithAgroLang } from './services/agroLangService';
import { getFullCostAudit } from './services/costAccountingService';
import { generateAlphanumericId } from './systemFunctions';

export const SycamoreLogo: React.FC<{ className?: string; size?: number }> = ({ className = "", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className}`}>
    <path d="M100 180C100 180 95 160 100 145" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <path d="M100 145C100 145 70 140 50 120C30 100 20 80 25 55C30 30 55 20 75 35C85 45 100 30 100 30C100 30 115 45 125 35C145 20 170 30 175 55C180 80 170 100 150 120C130 140 100 145 100 145Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

const BOOT_LOGS = [
  "INITIALIZING RECAPTCHA APP_CHECK...",
  "ESTABLISHING SECURITY HANDSHAKE...",
  "MAPPING_GEOFENCE_SHARDS [OK]",
  "CALIBRATING_M_CONSTANT_BASE [1.42]",
  "ENERGIZING_QUANTUM_CORE...",
  "SYNCING_L3_INDUSTRIAL_LEDGER...",
  "ZK_PROOF_ENGINE_BOOT [SUCCESS]",
  "ESTABLISHING_ORACLE_HANDSHAKE...",
  "SEHTI_THRUST_ALIGNED",
  "QUANTUM_STATE_LOCKED",
  "DATA_CONNECT_L3_SYNC_ACTIVE",
  "NODE_SYNC_FINALIZED"
];

const GLOBAL_STEWARD_REGISTRY = [
  { esin: 'EA-ALPH-8821', name: 'Steward Alpha', role: 'Soil Expert', location: 'Nairobi, Kenya', res: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', online: true, skills: ['Bantu Soil Sharding', 'Drought Mitigation'] },
  { esin: 'EA-GAIA-1104', name: 'Gaia Green', role: 'Genetics Analyst', location: 'Omaha, USA', res: 92, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', online: false, skills: ['DNA Sequencing', 'Aura Ingest'] },
  { esin: 'EA-ROBO-9214', name: 'Dr. Orion Bot', role: 'Automation Engineer', location: 'Tokyo Hub', res: 95, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', online: true, skills: ['Agroboto Control', 'Mesh Stability'] },
  { esin: 'EA-LILY-0042', name: 'Aesthetic Rose', role: 'Botanical Architect', location: 'Valencia Shard', res: 99, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', online: true, skills: ['Lilies Design', 'Chroma Calibration'] },
];

const SEARCHABLE_MEDIA_LEDGER = [
  { id: 'MED-COF-01', title: 'Coffee Soil Micronutrient Sharding', type: 'PAPER', source: 'AgroInPDF', desc: 'Technical PDF on high-altitude coffee soil remediation.', icon: FileDigit },
  { id: 'MED-COF-02', title: 'Bantu Coffee Lineage Heritage', type: 'VIDEO', source: 'Cinema Shard', desc: 'Ingest log of ancestral coffee preservation.', icon: Clapperboard },
  { id: 'MED-WAV-03', title: 'Sonic Soil Repair (432Hz)', type: 'AUDIO', source: 'Acoustic Registry', desc: 'Bio-electric frequency for cellular repair.', icon: Music },
  { id: 'MED-RES-04', title: 'Carbon Sequestration Metrics v6', type: 'PAPER', source: 'Research Hub', desc: 'Whitepaper on EOS carbon minting logic.', icon: FileText },
];

const GLOBAL_PROJECTS_MISSIONS = [
  { id: 'MIS-882', name: 'Nairobi Ingest Hub Expansion', budget: '1.2M EAC', thrust: 'Industry', desc: 'Expansion of regional logistics nodes.' },
  { id: 'MIS-104', name: 'Carbon Vault Audit mission', budget: '450K EAC', thrust: 'Environmental', desc: 'Verified physical audit of bio-char plots.' },
];

const ITEM_CATEGORY_EXPERIENCES = [
  { id: 'EXP-SAF-01', title: 'Spectral Birding Safari', cost: '150 EAC', node: 'Node_Nairobi_04', desc: 'Multi-spectral binocular tour of wetlands.' },
  { id: 'EXP-WAL-02', title: 'Bantu Botanical Walk', cost: '50 EAC', node: 'Node_Paris_82', desc: 'Lineage forest walk with heritage stewards.' },
];

const LOGISTICS_SHARDS = [
  { id: 'LOG-RAI-01', name: 'Eco-Rail Electric Shard', speed: '48h', cost: '120 EAC', status: 'Active' },
  { id: 'LOG-DRO-02', name: 'Solar Drone Relay', speed: '6h', cost: '450 EAC', status: 'Active' },
];

const LMS_EXAMS_MODULES = [
  { id: 'EXM-882', title: 'EOS Framework Master Exam', reward: '500 EAC', category: 'Vetting', icon: BadgeCheck },
  { id: 'MOD-104', title: 'm-Constant Resilience Theory', reward: '150 EAC', category: 'Technical', icon: GraduationCap },
];

const RECOMMENDED_SEARCHES = [
  { label: 'Market Cloud', icon: Globe, query: 'economy' },
  { label: 'Carbon Credits', icon: Wind, query: 'carbon' },
  { label: 'Steward Alpha', icon: UserIcon, query: 'Steward Alpha' },
  { label: 'Soil Analysis', icon: Microscope, query: 'soil' },
  { label: 'Agro OS Kernel', icon: Binary, query: 'farm_os' },
  { label: 'Bantu Seeds', icon: Sprout, query: 'bantu' },
  { label: 'Registry Map', icon: MapIcon, query: 'sitemap' },
];

const InitializationScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(0);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verifStatus, setVerifStatus] = useState('PENDING_HANDSHAKE');

  useEffect(() => {
    const runHandshake = async () => {
      await new Promise(r => setTimeout(r, 1000));
      const success = await verifyAppCheckHandshake();
      if (success) {
        setVerifStatus('SECURITY_VERIFIED');
      } else {
        setVerifStatus('OFFLINE_RECOVERY_MODE');
      }
      await new Promise(r => setTimeout(r, 1000));
      setIsVerifying(false);
    };
    runHandshake();
  }, []);

  useEffect(() => {
    if (isVerifying) return;
    const logInterval = setInterval(() => {
      setCurrentLog(prev => (prev < BOOT_LOGS.length - 1 ? prev + 1 : prev));
    }, 1200);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return prev + 1;
      });
    }, 55);
    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete, isVerifying]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center space-y-12 overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      <div className="relative group">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-[48px] bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-pulse relative z-20 overflow-hidden">
          <SycamoreLogo size={120} className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent animate-pulse"></div>
        </div>
        <div className="absolute inset-[-30px] border-2 border-dashed border-emerald-500/20 rounded-[64px] animate-spin-slow"></div>
        {isVerifying && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 animate-in fade-in duration-500">
             <div className="p-4 bg-black/80 rounded-2xl border border-white/10 backdrop-blur-xl flex flex-col items-center gap-2">
               <Loader2 size={32} className="text-emerald-500 animate-spin" />
               <span className="text-[8px] font-black text-white tracking-[0.2em]">{verifStatus}</span>
             </div>
           </div>
        )}
      </div>
      <div className="w-full max-w-md space-y-8 relative z-20">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden p-px shadow-inner">
          <div className="h-full bg-emerald-500 shadow-[0_0_20px_#10b981] transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex flex-col items-center gap-6">
           <p className="text-[11px] font-mono font-black text-emerald-400/80 uppercase tracking-[0.4em] animate-pulse h-4 text-center">
              {BOOT_LOGS[currentLog]}
           </p>
           <div className="flex items-center gap-6">
              <p className="text-[9px] font-mono text-slate-700 font-bold uppercase tracking-widest">
                SYSTEM_BOOT // REGISTRY_SYNC: {progress}%
              </p>
              {progress > 50 && <ShieldCheck size={14} className="text-emerald-500 animate-in zoom-in" />}
           </div>
        </div>
      </div>
      <div className="absolute bottom-12 flex flex-col items-center gap-3 opacity-40">
        <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Enviros<span className="text-emerald-400">Agro</span></h1>
        <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.5em] text-center">Decentralized Regenerative Grid</p>
      </div>
    </div>
  );
};

const GUEST_STWD: User = {
  name: 'GUEST STEWARD',
  email: 'guest@envirosagro.org',
  esin: 'EA-GUEST-VOID-NODE',
  mnemonic: 'none',
  regDate: new Date().toLocaleDateString(),
  role: 'OBSERVER',
  location: 'GLOBAL MESH NODE',
  wallet: {
    balance: 0,
    eatBalance: 0,
    exchangeRate: 1.0,
    bonusBalance: 0,
    tier: 'Seed',
    lifetimeEarned: 0,
    linkedProviders: [],
    miningStreak: 0,
    lastSyncDate: new Date().toISOString().split('T')[0],
    pendingSocialHarvest: 0,
    stakedEat: 0
  },
  metrics: {
    agriculturalCodeU: 0,
    timeConstantTau: 0,
    sustainabilityScore: 0,
    socialImmunity: 0,
    viralLoadSID: 0,
    baselineM: 0
  },
  skills: {},
  isReadyForHire: false,
  completedActions: [],
  settings: {
    notificationsEnabled: true,
    privacyMode: 'Public',
    autoSync: true,
    biometricLogin: false,
    theme: 'Dark'
  }
};

export interface RegistryItem {
  id: string;
  name: string;
  icon: any;
  sections?: { id: string; label: string; desc?: string }[];
}

export interface RegistryGroup {
  category: string;
  items: RegistryItem[];
}

const REGISTRY_NODES: RegistryGroup[] = [
  { 
    category: 'Command & Strategy', 
    items: [
      { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard, sections: [{id: 'metrics', label: 'Node Metrics'}, {id: 'oracle', label: 'Oracle Hub'}, {id: 'path', label: 'Strategic Path'}] },
      { id: 'mesh_protocol', name: 'Mesh Protocol', icon: Network, sections: [{id: 'topology', label: 'Network Topology'}, {id: 'commits', label: 'Block Shards'}, {id: 'mempool', label: 'Inbound Mempool'}] },
      { id: 'sustainability', name: 'Sustainability Shard', icon: Leaf },
      { id: 'agro_lang_analyst', name: 'EnvirosAgro Agro Lang', icon: SycamoreLogo },
      { id: 'internal_control', name: 'Internal Control', icon: ShieldCheck },
      { id: 'settings', name: 'System Settings', icon: Settings, sections: [{id: 'display', label: 'UI Display'}, {id: 'privacy', label: 'Security Shards'}] },
      { id: 'profile', name: 'Steward Profile', icon: UserIcon, sections: [{id: 'dossier', label: 'Personal Registry'}, {id: 'card', label: 'Identity Shard'}, {id: 'celestial', label: 'Birth Resonance'}] },
      { id: 'explorer', name: 'Monitoring Hub', icon: Database, sections: [{id: 'terminal', label: 'Signal Terminal'}, {id: 'blocks', label: 'Blocks'}, {id: 'ledger', label: 'Tx Ledger'}, {id: 'consensus', label: 'Quorum'}, {id: 'settlement', label: 'Finality'}] },
      { id: 'farm_os', name: 'Farm OS', icon: Binary, sections: [{id: 'kernel', label: 'Kernel Stack'}, {id: 'ide', label: 'AgroLang IDE'}, {id: 'shell', label: 'System Shell'}] },
      { id: 'impact', name: 'Network Impact', icon: TrendingUp, sections: [{id: 'whole', label: 'Vitality'}, {id: 'carbon', label: 'Carbon Ledger'}, {id: 'thrusts', label: 'Resonance'}] },
      { id: 'intelligence', name: 'Science Oracle', icon: Microscope, sections: [{id: 'twin', label: 'Digital Twin'}, {id: 'simulator', label: 'EOS Physics'}, {id: 'eos_agro_lang', label: 'Expert Oracle'}] },
      { id: 'sitemap', name: 'Registry Matrix', icon: MapIcon },
      { id: 'info', name: 'Hub Info', icon: Info, sections: [{id: 'about', label: 'About'}, {id: 'security', label: 'Security'}, {id: 'legal', label: 'Legal'}, {id: 'faq', label: 'FAQ'}] }
    ]
  },
  {
    category: 'Missions & Capital',
    items: [
      { id: 'contract_farming', name: 'Contract Farming', icon: Handshake, sections: [{id: 'browse', label: 'Missions'}, {id: 'deployments', label: 'Deployments'}] },
      { id: 'investor', name: 'Investor Portal', icon: Briefcase, sections: [{id: 'opportunities', label: 'Vetting'}, {id: 'portfolio', label: 'Portfolio'}, {id: 'analytics', label: 'Analytics'}] },
      { id: 'agrowild', name: 'Agrowild', icon: Binoculars, sections: [{id: 'conservancy', label: 'Protected Nodes'}, {id: 'tourism', label: 'Eco-Tourism'}] },
      { id: 'community', name: 'Steward Community', icon: Users, sections: [{id: 'social', label: 'Social Mesh'}, {id: 'shards', label: 'Social Shards'}, {id: 'lms', label: 'Knowledge Base'}] }
    ]
  },
  {
    category: 'Value & Production',
    items: [
      { id: 'industrial', name: 'Industrial Cloud', icon: Factory, sections: [{id: 'bridge', label: 'Registry Bridge'}, {id: 'sync', label: 'Process Sync'}, {id: 'path', label: 'Analyzer'}] },
      { id: 'agro_value_enhancement', name: 'Value Forge', icon: FlaskConical, sections: [{id: 'synthesis', label: 'Asset Synthesis'}, {id: 'optimization', label: 'Process Tuning'}] },
      { id: 'wallet', name: 'Agro Wallet Hub', icon: Wallet, sections: [{id: 'treasury', label: 'Utility'}, {id: 'accounting', label: 'Cost Management'}, {id: 'staking', label: 'Staking'}, {id: 'swap', label: 'Swap'}] },
      { id: 'economy', name: 'Market Center', icon: Globe, sections: [{id: 'catalogue', label: 'Registry Assets'}, {id: 'infrastructure', label: 'Industrial Nodes'}, {id: 'forecasting', label: 'Demand Matrix'}] },
      { id: 'vendor', name: 'Vendor Command', icon: Warehouse },
      { id: 'ecosystem', name: 'Brand Multiverse', icon: Layers },
      { id: 'envirosagro_store', name: 'Official Org Store', icon: Store }
    ]
  },
  {
    category: 'Operations & Trace',
    items: [
      { id: 'online_garden', name: 'Online Garden', icon: Flower, sections: [{id: 'bridge', label: 'Telemetry Bridge'}, {id: 'shards', label: 'Shard Manager'}, {id: 'mining', label: 'Extraction'}] },
      { id: 'digital_mrv', name: 'Digital MRV', icon: Scan, sections: [{id: 'land_select', label: 'Geofence'}, {id: 'ingest', label: 'Evidence Ingest'}] },
      { id: 'ingest', name: 'Data Inflow Hub', icon: Cable, sections: [{id: 'handshake', label: 'Node Pairing'}, {id: 'streams', label: 'Registry Keys'}, {id: 'vault', label: 'Evidence Vault'}] },
      { id: 'live_farming', name: 'Inflow Control', icon: Monitor, sections: [{id: 'lifecycle', label: 'Pipeline'}] },
      { id: 'tqm', name: 'TQM Trace Hub', icon: ClipboardCheck, sections: [{id: 'orders', label: 'Shipments'}, {id: 'trace', label: 'Traceability'}] },
      { id: 'crm', name: 'Nexus CRM', icon: HeartHandshake, sections: [{id: 'directory', label: 'Directory'}, {id: 'support', label: 'Support'}] },
      { id: 'circular', name: 'Circular Grid', icon: Recycle, sections: [{id: 'market', label: 'Refurbished Store'}] },
      { id: 'tools', name: 'Industrial Tools', icon: Wrench, sections: [{id: 'kanban', label: 'Kanban'}, {id: 'sigma', label: 'Six Sigma'}] },
      { id: 'robot', name: 'Swarm Command', icon: Bot, sections: [{id: 'registry', label: 'Fleet Registry'}, {id: 'security', label: 'Intranet Security'}] }
    ]
  },
  {
    category: 'Natural Resources',
    items: [
      { id: 'animal_world', name: 'Animal World', icon: PawPrint },
      { id: 'plants_world', name: 'Plants World', icon: TreePine },
      { id: 'aqua_portal', name: 'Aqua Portal', icon: Droplets },
      { id: 'soil_portal', name: 'Soil Portal', icon: Mountain },
      { id: 'air_portal', name: 'Air Portal', icon: Wind }
    ]
  },
  {
    category: 'Network Governance',
    items: [
      { id: 'intranet', name: 'Intranet Hub', icon: ShieldPlus },
      { id: 'emergency_portal', name: 'Emergency Command', icon: Siren },
      { id: 'agro_regency', name: 'Agro Regency', icon: History },
      { id: 'code_of_laws', name: 'Code of Laws', icon: Scale },
      { id: 'agro_calendar', name: 'Liturgical Calendar', icon: CalendarDays },
      { id: 'chroma_system', name: 'Chroma-SEHTI', icon: Palette },
      { id: 'research', name: 'Invention Ledger', icon: Zap },
      { id: 'biotech_hub', name: 'Biotech Hub', icon: Dna },
      { id: 'permaculture_hub', name: 'Permaculture Hub', icon: Compass },
      { id: 'cea_portal', name: 'CEA Portal', icon: BoxSelect },
      { id: 'multimedia_generator', name: 'Agro Multimedia Forge', icon: SycamoreLogo },
      { id: 'media_ledger', name: 'Media Ledger', icon: FileStack },
      { id: 'media', name: 'Media Hub', icon: Tv },
      { id: 'channelling', name: 'Channelling Hub', icon: Share2 },
      { id: 'registry_handshake', name: 'Registry Handshake', icon: SmartphoneNfc },
      { id: 'educational_resources', name: 'Educational Resources', icon: BookOpen }
    ]
  }
];

const GlobalSearch: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onNavigate: (v: ViewState, section?: string) => void; 
  vendorProducts: VendorProduct[];
  contracts: FarmingContract[];
  blueprints: any[];
  liveProducts: LiveAgroProduct[];
  industrialUnits: RegisteredUnit[];
}> = ({ isOpen, onClose, onNavigate, vendorProducts, contracts, blueprints, liveProducts, industrialUnits }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiDeepSuggestion, setAiDeepSuggestion] = useState<{ view: string; section?: string; explanation: string; stewardEsin?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchTerm('');
      setAiDeepSuggestion(null);
    }
  }, [isOpen]);

  const handleAiDeepQuery = async () => {
    if (!searchTerm.trim()) return;
    setIsAiSearching(true);
    setAiDeepSuggestion(null);
    try {
      const sitemapContext = REGISTRY_NODES.map(g => `Group: ${g.category}\n${g.items.map(i => `- ${i.name} (id: ${i.id}): ${i.sections?.map(s => s.label).join(', ')}`).join('\n')}`).join('\n\n');
      const socialContext = GLOBAL_STEWARD_REGISTRY.map(s => `- Steward: ${s.name} (ESIN: ${s.esin}), Role: ${s.role}, Skills: ${s.skills.join(', ')}`).join('\n');
      const ledgerContext = `- Media Shards: ${SEARCHABLE_MEDIA_LEDGER.map(m => m.title).join(', ')}\n- Missions: ${contracts.map(m => m.productType).join(', ')}\n- Blueprints: ${blueprints.map(b => b.input_material.name).join(', ')}\n- Live Products: ${liveProducts.map(p => p.productType).join(', ')}\n- Infrastructure: ${industrialUnits.map(u => u.name).join(', ')}\n- Market Products: ${vendorProducts.map(p => p.name).join(', ')}`;
      const prompt = `Act as the EnvirosAgro Navigation and Multi-Ledger Oracle. Based on the sitemap, steward registry, and ledger archives, recommend EXACTLY ONE shard, section, or ledger entry that best answers the user's query.\n\nRegistry Sitemap: ${sitemapContext}\nSocial Steward Registry: ${socialContext}\nIndustrial Ledgers Index: ${ledgerContext}\n\nUser Query: "${searchTerm}"\n\nReturn format:\nREASON: [Why relevant]\nVIEW: [shard id]\nSECTION: [section id or all]\nSTEWARD_ESIN: [optional esin]`;
      const res = await chatWithAgroLang(prompt, []);
      const reason = res.text.match(/REASON:\s*(.*)/i)?.[1] || "Deep semantic match found in registry.";
      const view = res.text.match(/VIEW:\s*([a-z_0-9]+)/i)?.[1] || "dashboard";
      const section = res.text.match(/SECTION:\s*([a-z_0-9]+)/i)?.[1];
      const stewardEsin = res.text.match(/STEWARD_ESIN:\s*(EA-[A-Z0-9-]+)/i)?.[1];
      setAiDeepSuggestion({ view, section: section === 'all' ? undefined : section, explanation: reason, stewardEsin });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiSearching(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return { shards: [], stewards: [], assets: [], knowledge: [], infrastructure: [] };
    const term = searchTerm.toLowerCase();
    const shards: any[] = [];
    REGISTRY_NODES.forEach(group => group.items.forEach(item => { if (item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term) || group.category.toLowerCase().includes(term)) shards.push({ ...item, category: group.category, matchedSections: item.sections?.filter(s => s.label.toLowerCase().includes(term)) }); }));
    const stewards = GLOBAL_STEWARD_REGISTRY.filter(s => s.name.toLowerCase().includes(term) || s.esin.toLowerCase().includes(term) || s.role.toLowerCase().includes(term) || s.skills.some(sk => sk.toLowerCase().includes(term)));
    const assets = [
      ...vendorProducts.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)), 
      ...ITEM_CATEGORY_EXPERIENCES.filter(e => e.title.toLowerCase().includes(term) || e.desc.toLowerCase().includes(term)),
      ...blueprints.filter(b => b.input_material.name.toLowerCase().includes(term) || b.status.toLowerCase().includes(term)),
      ...liveProducts.filter(p => p.productType.toLowerCase().includes(term) || p.category.toLowerCase().includes(term))
    ];
    const knowledge = [...SEARCHABLE_MEDIA_LEDGER.filter(m => m.title.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term) || m.source.toLowerCase().includes(term)), ...LMS_EXAMS_MODULES.filter(e => e.title.toLowerCase().includes(term) || e.category.toLowerCase().includes(term))];
    const infrastructure = [
      ...LOGISTICS_SHARDS.filter(l => l.name.toLowerCase().includes(term)), 
      ...contracts.filter(m => m.productType.toLowerCase().includes(term) || m.category.toLowerCase().includes(term)),
      ...industrialUnits.filter(u => u.name.toLowerCase().includes(term) || u.type.toLowerCase().includes(term))
    ];
    return { shards: shards.slice(0, 5), stewards: stewards.slice(0, 5), assets: assets.slice(0, 5), knowledge: knowledge.slice(0, 5), infrastructure: infrastructure.slice(0, 5) };
  }, [searchTerm, vendorProducts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-hidden" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-4xl glass-card rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.8)] flex flex-col h-[85vh] md:h-[80vh] animate-in zoom-in-95 duration-300">
        <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center gap-4 md:gap-8 flex-1">
             <Search className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 shrink-0" />
             <div className="flex-1 relative">
               <input ref={inputRef} type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiDeepQuery()} placeholder="Query ledgers, media, stewards..." className="w-full bg-transparent border-none outline-none text-xl md:text-3xl text-white placeholder:text-slate-700 font-bold italic" />
             </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button onClick={handleAiDeepQuery} disabled={isAiSearching || !searchTerm.trim()} className="p-3 md:p-4 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 rounded-2xl md:rounded-3xl transition-all shadow-xl group active:scale-95 disabled:opacity-30 flex items-center justify-center" title="Oracle deep query">
               {isAiSearching ? <Loader2 className="animate-spin text-white w-6 h-6" /> : <SycamoreLogo size={24} className="text-emerald-400 group-hover:text-white" />}
            </button>
            <button onClick={onClose} className="p-3 md:p-4 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-2xl active:scale-95"><X size={24} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-12 bg-[#050706]/40">
           {aiDeepSuggestion && (
             <div className="p-8 md:p-12 bg-indigo-900/10 border-2 border-indigo-500/30 rounded-[48px] animate-in slide-in-from-top-4 duration-500 space-y-8 relative overflow-hidden group/sugg">
                <div className="absolute top-0 right-0 p-8 opacity-[0.1] group-hover/sugg:rotate-12 transition-transform"><SycamoreLogo size={180} className="text-indigo-400" /></div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="p-3 bg-indigo-600 rounded-2xl shadow-2xl"><SycamoreLogo size={20} className="text-white" /></div>
                   <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest italic">Oracle Logic Match</h5>
                </div>
                <div className="space-y-8 border-l-4 border-indigo-600/40 pl-8 md:pl-12 relative z-10">
                   <p className="text-slate-300 italic text-xl md:text-2xl leading-relaxed max-w-3xl">{aiDeepSuggestion.explanation}</p>
                   <button onClick={() => { onNavigate(aiDeepSuggestion.view as ViewState, aiDeepSuggestion.section); onClose(); }} className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all ring-8 ring-indigo-500/5">Navigate Shard <ArrowRight size={18} /></button>
                </div>
             </div>
           )}
           {searchTerm.trim() === '' ? (
             <div className="h-full flex flex-col space-y-16 py-8">
                <div className="flex flex-col items-center justify-center text-center opacity-30 space-y-10">
                   <div className="relative">
                      <Command size={100} className="text-slate-600 animate-float" />
                      <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                   </div>
                   <div className="space-y-4">
                     <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic drop-shadow-2xl">SEARCH_MATRIX</p>
                     <p className="text-sm md:text-lg font-bold uppercase tracking-widest italic text-slate-500 max-w-md mx-auto leading-relaxed">Query organizational ledgers, media shards, or industrial stewards</p>
                   </div>
                </div>
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
                   <div className="flex items-center gap-4 px-4"><SycamoreLogo size={16} className="text-emerald-400" /><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Recommended_Queries</p></div>
                   <div className="flex flex-wrap gap-4 px-4">
                      {RECOMMENDED_SEARCHES.map((rec, i) => (
                         <button key={i} onClick={() => setSearchTerm(rec.query)} className="flex items-center gap-4 px-8 py-5 bg-white/5 hover:bg-emerald-600/10 border-2 border-white/5 hover:border-emerald-500/40 rounded-[32px] transition-all group/chip active:scale-95 shadow-xl">
                            <rec.icon size={18} className="text-slate-500 group-hover/chip:text-emerald-400 transition-colors" />
                            <span className="text-sm font-black text-slate-400 group-hover/chip:text-white uppercase tracking-widest italic">{rec.label}</span>
                         </button>
                      ))}
                   </div>
                </div>
                <div className="p-8 bg-indigo-900/10 border-2 border-indigo-500/20 rounded-[48px] flex items-center justify-between group/bot-hint shadow-2xl mx-4">
                   <div className="flex items-center gap-8">
                      <div className="p-5 bg-indigo-600 rounded-[28px] shadow-3xl border-2 border-white/10 group-hover/bot-hint:rotate-12 transition-transform"><SycamoreLogo size={32} className="text-white animate-pulse" /></div>
                      <div className="text-left">
                         <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0">Need more depth?</h4>
                         <p className="text-[10px] text-slate-500 mt-2 font-medium italic opacity-80 group-hover/bot-hint:opacity-100 transition-opacity">"Initialize an Oracle Deep Query to perform a high-fidelity scan across all unindexed sharded data."</p>
                      </div>
                   </div>
                   <div className="hidden md:flex gap-4"><div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full"><span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest italic">NEURAL_READY</span></div></div>
                </div>
             </div>
           ) : (
             <div className="space-y-20">
                {filteredResults.stewards.length > 0 && (
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 px-4"><Users size={16} className="text-indigo-400" /><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Social_Steward_Registry</p></div>
                      <div className="grid gap-4">
                         {filteredResults.stewards.map(steward => (
                            <div key={steward.esin} className="glass-card p-6 md:p-10 rounded-[40px] border-white/5 hover:border-indigo-500/40 bg-black/60 transition-all group flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden active:scale-[0.99] duration-300 group/card">
                               <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                                  <div className="relative shrink-0">
                                     <div className="w-16 h-16 md:w-24 md:h-24 rounded-[28px] md:rounded-[40px] overflow-hidden border-2 border-white/10 group-hover:card:border-indigo-500 transition-all shadow-xl cursor-pointer">
                                        <img src={steward.avatar} className="w-full h-full object-cover" alt="" />
                                     </div>
                                     <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${steward.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
                                  </div>
                                  <div className="space-y-2">
                                     <h4 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:card:text-indigo-400 transition-colors">{steward.name}</h4>
                                     <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase mt-2">{steward.role} // {steward.esin}</p>
                                  </div>
                               </div>
                               <div className="flex gap-4 relative z-10 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-10 justify-center md:justify-end">
                                  <button onClick={() => { onNavigate('profile'); onClose(); }} className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl"><UserIcon size={20} /></button>
                                  <button onClick={() => { onNavigate('contract_farming'); onClose(); }} className="px-8 py-4 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">Connect Shard</button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
                {filteredResults.knowledge.length > 0 && (
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 px-4"><FileStack size={16} className="text-blue-400" /><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Knowledge_&_Media_Archive</p></div>
                      <div className="grid gap-4">
                         {filteredResults.knowledge.map((item: any) => (
                            <div key={item.id} className="glass-card p-6 md:p-10 rounded-[40px] border-white/5 hover:border-blue-500/40 bg-black/60 transition-all group flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden active:scale-[0.99]">
                               <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                                  <div className="p-6 rounded-[28px] md:rounded-[36px] bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:rotate-6 transition-all shadow-inner">
                                     <item.icon size={40} />
                                  </div>
                                  <div className="space-y-2">
                                     <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-blue-400 transition-colors leading-tight">{item.title}</h4>
                                     <p className="text-[10px] text-slate-600 font-mono tracking-widest uppercase mt-1">{item.source || item.category} // {item.id}</p>
                                  </div>
                               </div>
                               <div className="flex gap-4 relative z-10 shrink-0">
                                  <button onClick={() => { onNavigate(item.reward ? 'community' : 'media_ledger'); onClose(); }} className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center gap-3 transition-all active:scale-95">{item.type === 'PAPER' ? <Download size={18} /> : <Zap size={18} />} Access Shard</button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
                {filteredResults.assets.length > 0 && (
                   <div className="space-y-8">
                      <div className="flex items-center gap-4 px-4"><ShoppingBag size={16} className="text-emerald-400" /><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Industrial_Asset_Quorum</p></div>
                      <div className="grid grid-cols-2 gap-6">
                         {filteredResults.assets.map((item: any) => (
                            <div key={item.id} className="glass-card p-6 md:p-8 rounded-[40px] border-white/5 hover:border-emerald-500/40 bg-black/60 transition-all group flex flex-col justify-between h-[380px] shadow-3xl relative overflow-hidden active:scale-[0.99] group/asset">
                               <div className="absolute top-0 right-0 p-8 opacity-[0.01] group-hover/asset:opacity-[0.05] group-hover/asset:scale-110 transition-all"><ShoppingCart size={200} /></div>
                               <div className="flex items-start justify-between mb-6 relative z-10">
                                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[28px] overflow-hidden border-2 border-white/10 group-hover/asset:border-emerald-500 transition-all shadow-xl"><img src={item.thumb || item.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=400'} className="w-full h-full object-cover" alt="" /></div>
                                  <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest shadow-inner">ASSET_MINTED</span>
                               </div>
                               <div className="space-y-2 relative z-10">
                                  <h4 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter group-hover/asset:text-emerald-400 transition-colors m-0 drop-shadow-2xl">{item.name || item.title}</h4>
                                  <p className="text-[9px] text-slate-700 font-mono font-black uppercase tracking-widest mt-2">{item.price || item.cost} EAC // {item.id}</p>
                               </div>
                               <div className="pt-6 border-t border-white/5 mt-auto flex justify-end relative z-10">
                                  <button onClick={() => { onNavigate(item.node ? 'agrowild' : 'economy'); onClose(); }} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"><ArrowUpRight size={14} /> Procure Shard</button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
             </div>
           )}
        </div>
        <div className="p-6 md:p-8 border-t border-white/5 border-emerald-500/10 bg-black/80 flex items-center justify-between shrink-0 relative z-10">
           <div className="flex items-center gap-4 text-[7px] font-black text-slate-700 uppercase tracking-widest italic"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 animate-pulse"></div>MULTI_LEDGER_INDEXING_ACTIVE</div>
           <div className="flex items-center gap-3"><span className="text-[7px] font-mono text-slate-800 uppercase tracking-widest">v6.5.2 // QUORUM_SYNC</span></div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const user = useAppStore(state => state.user);
  const setUser = useAppStore(state => state.setUser);
  const view = useAppStore(state => state.view);
  const setView = useAppStore(state => state.setView);
  const viewSection = useAppStore(state => state.viewSection);
  const setViewSection = useAppStore(state => state.setViewSection);
  const isSidebarOpen = useAppStore(state => state.isSidebarOpen);
  const setIsSidebarOpen = useAppStore(state => state.setIsSidebarOpen);
  const isMobileMenuOpen = useAppStore(state => state.isMobileMenuOpen);
  const setIsMobileMenuOpen = useAppStore(state => state.setIsMobileMenuOpen);
  const isGlobalSearchOpen = useAppStore(state => state.isGlobalSearchOpen);
  const setIsGlobalSearchOpen = useAppStore(state => state.setIsGlobalSearchOpen);
  const isInboxOpen = useAppStore(state => state.isInboxOpen);
  const setIsInboxOpen = useAppStore(state => state.setIsInboxOpen);
  const projects = useAppStore(state => state.projects);
  const setProjects = useAppStore(state => state.setProjects);
  const transactions = useAppStore(state => state.transactions);
  const setTransactions = useAppStore(state => state.setTransactions);
  const signals = useAppStore(state => state.signals);
  const setSignals = useAppStore(state => state.setSignals);
  const costAudit = useAppStore(state => state.costAudit);
  const setCostAudit = useAppStore(state => state.setCostAudit);
  const registrationState = useAppStore(state => state.registrationState);

  const [isBooting, setIsBooting] = useState(true);
  const [isUnverified, setIsUnverified] = useState(false);
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [history, setHistory] = useState<VectorAddress[]>([]);
  const [forwardHistory, setForwardHistory] = useState<VectorAddress[]>([]);
  const [contracts, setContracts] = useState<FarmingContract[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [industrialUnits, setIndustrialUnits] = useState<RegisteredUnit[]>([]);
  const [liveProducts, setLiveProducts] = useState<LiveAgroProduct[]>([]);
  const [hoodConnections, setHoodConnections] = useState<HoodConnection[]>([]);
  const [blockchain, setBlockchain] = useState<AgroBlock[]>([]);
  const [notifications, setNotifications] = useState<NotificationShard[]>([]);
  const [mediaShards, setMediaShards] = useState<MediaShard[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blueprints, setBlueprints] = useState<ValueBlueprint[]>([]);
  const [pulseMessage, setPulseMessage] = useState('Registry synchronized. No anomalies detected.');
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [activeTaskForEvidence, setActiveTaskForEvidence] = useState<any | null>(null);
  const [osInitialCode, setOsInitialCode] = useState<string | null>(null);
  const [multimediaParams, setMultimediaParams] = useState<{ prompt?: string; type?: string; autoGenerate?: boolean } | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showZenithButton, setShowZenithButton] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      // Only require API key selection in the development environment (AI Studio)
      // We check if we are in the development environment by looking for the aistudio object
      if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } else {
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  // Initialize Background Sync & Cost Calibration
  useEffect(() => {
    const unsubSync = startBackgroundDataSync();
    
    // Background Cost Calibration Loop
    const costInterval = setInterval(() => {
      if (user) {
        const auditResult = getFullCostAudit(100, user.metrics);
        setCostAudit(auditResult);
      }
    }, 15000); // Calibrate every 15s

    return () => {
      unsubSync();
      clearInterval(costInterval);
    };
  }, [user]);

  useEffect(() => { if (mainContentRef.current) mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' }); }, [view]);
  useEffect(() => { const handleKeyDown = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsGlobalSearchOpen(!isGlobalSearchOpen); } if (e.key === 'Escape') { setIsGlobalSearchOpen(false); setIsConsultantOpen(false); setIsInboxOpen(false); } }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);
  const handleScroll = (target: HTMLElement) => { setScrollProgress((target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100); setShowZenithButton(target.scrollTop > 400); };
  const scrollToTop = () => mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  useEffect(() => { const handleResize = () => { const isLg = window.innerWidth >= 1024; setIsSidebarOpen(isLg); if (isLg) setIsMobileMenuOpen(false); }; handleResize(); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []);
  useEffect(() => { return onAuthStateChanged(auth, async (fbUser) => { if (fbUser) { const isVerified = fbUser.emailVerified || fbUser.providerData?.some((p: any) => p.providerId === 'phone'); if (isVerified) { setIsUnverified(false); const profile = await getStewardProfile(fbUser.uid); if (profile) setUser(profile); } else { setIsUnverified(true); setUser(null); } } else { setIsUnverified(false); setUser(null); } }); }, []);
  useEffect(() => { const unsubProjects = listenToCollection('projects', setProjects, true); const unsubContracts = listenToCollection('contracts', setContracts, true); const unsubOrders = listenToCollection('orders', setOrders); const unsubProducts = listenToCollection('products', setVendorProducts, true); const unsubUnits = listenToCollection('industrial_units', setIndustrialUnits); const unsubLive = listenToCollection('live_products', setLiveProducts, true); const unsubTx = listenToCollection('transactions', setTransactions); const unsubSignals = listenToCollection('signals', setSignals); const unsubMedia = listenToCollection('media_ledger', setMediaShards, true); const unsubBlocks = listenToCollection('blocks', setBlockchain, true); const unsubTasks = listenToCollection('tasks', setTasks); const unsubBlueprints = listenToCollection('blueprints', setBlueprints); const unsubPulse = listenToPulse(setPulseMessage); return () => { unsubProjects(); unsubContracts(); unsubOrders(); unsubProducts(); unsubUnits(); unsubLive(); unsubTx(); unsubSignals(); unsubPulse(); unsubMedia(); unsubBlocks(); unsubTasks(); unsubBlueprints(); }; }, [user]);
  const hookHood = useCallback(async (targetEsin: string, type: HoodConnection['type'] = 'SOCIAL') => {
    if (!user || user.esin === targetEsin) return;
    const existing = hoodConnections.find(c => c.targetEsin === targetEsin && c.status === 'ACTIVE');
    if (existing) return;

    const newConn: HoodConnection = {
      id: `HOOD-${generateAlphanumericId(7)}`,
      stewardEsin: user.esin,
      targetEsin,
      type,
      status: 'ACTIVE',
      timestamp: new Date().toISOString()
    };

    setHoodConnections(prev => [newConn, ...prev]);
    await saveCollectionItem('hood_connections', newConn);
    
    emitSignal({
      title: 'HOOD_HOOKED',
      message: `Direct link established with node ${targetEsin}. Efficiency synchronized.`,
      priority: 'medium',
      type: 'engagement',
      origin: 'ORACLE',
      actionIcon: 'Link2'
    });
  }, [user, hoodConnections]);

  const emitSignal = useCallback(async (signalData: Partial<SignalShard>) => { 
    const signal = await dispatchNetworkSignal(signalData); 
    if (signal) { 
      // Multi-channel routing
      const popupLayer = signal.dispatchLayers.find(l => l.channel === 'POPUP'); 
      if (popupLayer) { 
        const id = generateAlphanumericId(7).toLowerCase(); 
        setNotifications(prev => [{ 
          id, 
          type: signal.type === 'ledger_anchor' ? 'success' : signal.priority === 'critical' ? 'error' : signal.priority === 'high' ? 'warning' : 'info', 
          title: signal.title, 
          message: signal.message, 
          duration: 6000, 
          actionLabel: signal.actionLabel, 
          actionIcon: signalData.actionIcon 
        }, ...prev]); 
      }

      // Auto-connection logic for Stewards
      const currentUser = useAppStore.getState().user;
      if (signal.meta?.payload?.senderEsin && currentUser && signal.meta.payload.senderEsin !== currentUser.esin) {
        const senderRole = signal.meta.payload.senderRole;
        if (senderRole === 'STEWARD' || senderRole === 'INVESTOR' || senderRole === 'AUDITOR') {
          hookHood(signal.meta.payload.senderEsin, signal.type === 'task' ? 'AUDIT' : 'DEAL');
        }
      }

      // Email Simulation (Log to console for now)
      if (signal.dispatchLayers.some(l => l.channel === 'EMAIL')) {
        console.log(`[EMAIL_ROUTING] To: ${currentUser?.email || 'Node'}, Subject: ${signal.title}, Body: ${signal.message}`);
      }
    } 
  }, [hookHood, setNotifications]);
  const handleSpendEAC = useCallback(async (amount: number, reason: string) => {
    const currentUser = useAppStore.getState().user;
    if (!currentUser) {
      setView('auth');
      return false;
    }
    if (currentUser.wallet.balance < amount) {
      emitSignal({
        title: 'INSUFFICIENT_FUNDS',
        message: `Need ${amount} EAC for ${reason}.`,
        priority: 'high',
        type: 'commerce',
        origin: 'MANUAL'
      });
      return false;
    }
    const updatedUser = {
      ...currentUser,
      wallet: {
        ...currentUser.wallet,
        balance: currentUser.wallet.balance - amount
      }
    };
    const syncOk = await syncUserToCloud(updatedUser);
    if (!syncOk) return false;
    setUser(updatedUser);
    const newTx: AgroTransaction = {
      id: `TX-${Date.now()}`,
      type: 'Transfer',
      farmId: currentUser.esin,
      details: reason,
      value: -amount,
      unit: 'EAC'
    };
    await saveCollectionItem('transactions', newTx);
    emitSignal({
      title: 'TREASURY_SETTLEMENT',
      message: `Node sharded ${amount} EAC for ${reason}.`,
      priority: 'medium',
      type: 'ledger_anchor',
      origin: 'TREASURY',
      actionIcon: 'Coins'
    });
    return true;
  }, [setUser, setView, emitSignal]);

  const handleEarnEAC = useCallback(async (amount: number, reason: string) => {
    const currentUser = useAppStore.getState().user;
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      wallet: {
        ...currentUser.wallet,
        balance: currentUser.wallet.balance + amount,
        lifetimeEarned: (currentUser.wallet.lifetimeEarned || 0) + amount
      }
    };
    const syncOk = await syncUserToCloud(updatedUser);
    if (!syncOk) return;
    setUser(updatedUser);
    const newTx: AgroTransaction = {
      id: `TX-${Date.now()}`,
      type: 'Reward',
      farmId: currentUser.esin,
      details: reason,
      value: amount,
      unit: 'EAC'
    };
    await saveCollectionItem('transactions', newTx);
  }, [setUser]);

  const handlePerformPermanentAction = useCallback(async (actionKey: string, reward?: number, reason?: string) => {
    const currentUser = useAppStore.getState().user;
    if (!currentUser || currentUser.completedActions?.includes(actionKey)) return false;
    const ok = await markPermanentAction(actionKey);
    if (ok && reward && reason) await handleEarnEAC(reward, reason);
    return ok;
  }, [handleEarnEAC]);
  const handleLogout = async () => { await signOutSteward(); setUser(null); setView('dashboard'); };
  const markSignalAsRead = async (id: string, e?: React.MouseEvent) => { if (e) e.stopPropagation(); setSignals(signals.map(s => s.id === id ? { ...s, read: true } : s)); await updateSignalReadStatus(id, true); };
  const markAllSignalsAsRead = async () => { const unreadIds = signals.filter(s => !s.read).map(s => s.id); if (unreadIds.length === 0) return; setSignals(signals.map(s => ({ ...s, read: true }))); await markAllSignalsAsReadInDb(unreadIds); emitSignal({ title: 'INBOX_SYNCHRONIZED', message: 'All unread network signals have been cleared and archived.', priority: 'low', type: 'system', origin: 'MANUAL', actionIcon: 'CheckCircle2' }); };
  const findMatrixIndex = (v: ViewState, section: string | null): string | undefined => { let index: string | undefined; REGISTRY_NODES.forEach((group, dIdx) => { group.items.forEach((item, eIdx) => { if (item.id === v) { if (!section) { index = `[${dIdx + 1}.${eIdx + 1}]`; } else { const sIdx = item.sections?.findIndex(s => s.id === section); if (sIdx !== undefined && sIdx !== -1) { index = `[${dIdx + 1}.${eIdx + 1}.${sIdx + 1}]`; } } } }); }); return index; };
  const navigate = useCallback((v: ViewState, section?: string | null, pushToHistory = true, params?: any) => { 
    const currentView = useAppStore.getState().view;
    const currentSection = useAppStore.getState().viewSection;
    const index = findMatrixIndex(v, section || null); 
    
    if (pushToHistory) { 
      const currentAddress: VectorAddress = { 
        dimension: currentView, 
        element: currentSection, 
        matrixIndex: findMatrixIndex(currentView, currentSection) 
      }; 
      setHistory(prev => [...prev, currentAddress]); 
      setForwardHistory([]); 
    } 
    
    setView(v); 
    setViewSection(section || null); 
    if (v === 'multimedia_generator') setMultimediaParams(params || null); 
    setIsMobileMenuOpen(false); 
    if (window.innerWidth < 1024) setIsSidebarOpen(false); 
    setIsConsultantOpen(false); 
    setIsInboxOpen(false); 
    
    emitSignal({ 
      title: 'VECTOR_SHIFT', 
      message: `Resolved route to ${index || v.toUpperCase()}.`, 
      priority: 'low', 
      type: 'system', 
      origin: 'ORACLE', 
      actionIcon: 'ChevronRight' 
    }); 
  }, [emitSignal, setView, setViewSection, setIsSidebarOpen, setIsMobileMenuOpen]);
  const goBack = useCallback(() => { if (history.length > 0) { const currentAddress: VectorAddress = { dimension: view, element: viewSection, matrixIndex: findMatrixIndex(view, viewSection) }; const lastVector = history[history.length - 1]; setForwardHistory(prev => [...prev, currentAddress]); setHistory(prev => prev.slice(0, -1)); navigate(lastVector.dimension, lastVector.element || undefined, false); } else if (view !== 'dashboard') { navigate('dashboard', undefined, true); } }, [history, view, viewSection, navigate]);
  const goForward = useCallback(() => { if (forwardHistory.length > 0) { const currentAddress: VectorAddress = { dimension: view, element: viewSection, matrixIndex: findMatrixIndex(view, viewSection) }; const nextVector = forwardHistory[forwardHistory.length - 1]; setHistory(prev => [...prev, currentAddress]); setForwardHistory(prev => prev.slice(0, -1)); navigate(nextVector.dimension, nextVector.element || undefined, false); } }, [forwardHistory, view, viewSection, navigate]);

  const renderView = () => {
    const currentUser = user || GUEST_STWD;
    const isGuest = !user;
    if (isUnverified) return <VerificationHUD userEmail={auth.currentUser?.email || 'Unauthorized Node'} onVerified={() => { setIsUnverified(false); setView('dashboard'); }} onLogout={handleLogout} />;
    switch (view) {
      case 'auth': return <Login onLogin={(u) => { setUser(u); setView('dashboard'); }} />;
      case 'dashboard': return <Dashboard user={currentUser} isGuest={isGuest} blockchain={blockchain} isMining={false} orders={orders} />;
      case 'mesh_protocol': return <MeshProtocol user={currentUser} blockchain={blockchain} />;
      case 'sustainability': return <Sustainability user={currentUser} onNavigate={navigate} onMintEAT={handleEarnEAC} />;
      case 'economy': return <Economy user={currentUser} isGuest={isGuest} onSpendEAC={handleSpendEAC} onNavigate={navigate} vendorProducts={vendorProducts} liveProducts={liveProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} projects={projects} notify={emitSignal} contracts={contracts} industrialUnits={industrialUnits} blueprints={blueprints} onUpdateUser={(u) => setUser(u)} initialSection={viewSection} />;
      case 'wallet': return <AgroWallet user={currentUser} isGuest={isGuest} onNavigate={navigate} onUpdateUser={(u) => setUser(u)} onSwap={async () => { handleEarnEAC(0, 'SWAP_EAT'); return true; }} onEarnEAC={handleEarnEAC} notify={emitSignal} transactions={transactions} initialSection={viewSection} costAudit={costAudit} />;
      case 'intelligence': return <Intelligence user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} onOpenEvidence={() => setIsEvidenceOpen(true)} initialSection={viewSection} />;
      case 'community': return <Community user={currentUser} isGuest={isGuest} onContribution={() => {}} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onEmitSignal={emitSignal} initialSection={viewSection} hoodConnections={hoodConnections} onHookHood={hookHood} />;
      case 'explorer': return <Explorer blockchain={blockchain} isMining={false} globalEchoes={[]} onPulse={() => {}} user={currentUser} signals={signals} setSignals={setSignals} initialSection={viewSection} onNavigate={navigate} />;
      case 'network_signals': return <Explorer blockchain={blockchain} isMining={false} globalEchoes={[]} onPulse={() => {}} user={currentUser} signals={signals} setSignals={setSignals} initialSection="terminal" onNavigate={navigate} />;
      case 'ecosystem': return <Ecosystem user={currentUser} onDeposit={handleEarnEAC} onUpdateUser={(u) => setUser(u)} onNavigate={navigate} />;
      case 'industrial': return <Industrial user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} industrialUnits={industrialUnits} vendorProducts={vendorProducts} orders={orders} notify={emitSignal} collectives={[]} setCollectives={() => {}} onSaveProject={(p) => saveCollectionItem('projects', p)} setIndustrialUnits={() => {}} initialSection={viewSection} />;
      case 'investor': return <InvestorPortal user={currentUser} onUpdate={(u) => setUser(u)} onSpendEAC={handleSpendEAC} projects={projects} onNavigate={navigate} />;
      case 'profile': return <UserProfile user={currentUser} isGuest={isGuest} onUpdate={(u) => setUser(u)} onNavigate={navigate} signals={signals} setSignals={setSignals} notify={emitSignal} onLogin={() => setView('auth')} onLogout={handleLogout} onPermanentAction={handlePerformPermanentAction} />;
      case 'channelling': return <Channelling user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'media': return <MediaHub user={currentUser} userBalance={currentUser.wallet.balance} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} initialAction={viewSection} />;
      case 'multimedia_generator': return <AgroMultimediaGenerator user={currentUser} onNavigate={navigate} onEarnEAC={handleEarnEAC} prefilledParams={multimediaParams} clearParams={() => setMultimediaParams(null)} />;
      case 'cost_accounting': return <CostAccountingDashboard />;
      case 'internal_control': 
        const role = (currentUser.role as string) === 'OBSERVER' ? 'GUEST' : (currentUser.role as UserRole);
        return <InternalControlDashboard userRole={role} currentPath={view} />;
      case 'crm': return <NexusCRM user={currentUser} onSpendEAC={handleSpendEAC} vendorProducts={vendorProducts} onNavigate={navigate} orders={orders} initialSection={viewSection} />;
      case 'circular': return <CircularGrid user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} vendorProducts={vendorProducts} onPlaceOrder={(o) => saveCollectionItem('orders', o)} onNavigate={navigate} notify={emitSignal} initialSection={viewSection} />;
      case 'tqm': return <TQMGrid user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={(id, status, m) => { setOrders(o => o.map(x => x.id === id ? {...x, status, ...m} : x)); saveCollectionItem('orders', {id, status, ...m}); }} liveProducts={liveProducts} onNavigate={navigate} onEmitSignal={emitSignal} initialSection={viewSection} />;
      case 'tools': return <ToolsSection user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onOpenEvidence={(t) => { setActiveTaskForEvidence(t); setIsEvidenceOpen(true); }} tasks={tasks} onSaveTask={(t) => saveCollectionItem('tasks', t)} notify={emitSignal} initialSection={viewSection} />;
      case 'research': return <ResearchInnovation user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'live_farming': return <LiveFarming user={currentUser} products={liveProducts} setProducts={setLiveProducts} onEarnEAC={handleEarnEAC} onSaveProduct={(p) => saveCollectionItem('live_products', p)} onNavigate={navigate} notify={emitSignal} initialSection={viewSection} onSaveTask={(t) => saveCollectionItem('tasks', t)} blueprints={blueprints} industrialUnits={industrialUnits} contracts={contracts} onSaveContract={(c) => saveCollectionItem('contracts', c)} />;
      case 'contract_farming': return <ContractFarming user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} contracts={contracts} setContracts={setContracts} onSaveContract={(c) => saveCollectionItem('contracts', c)} blueprints={blueprints} onSaveTask={(t) => saveCollectionItem('tasks', t)} industrialUnits={industrialUnits} liveProducts={liveProducts} onSaveProduct={(p) => saveCollectionItem('live_products', p)} />;
      case 'agrowild': return <Agrowild user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onPlaceOrder={(o) => saveCollectionItem('orders', o)} vendorProducts={vendorProducts} notify={emitSignal} />;
      case 'impact': return <Impact user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'animal_world': return <NaturalResources user={currentUser} type="animal_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'plants_world': return <NaturalResources user={currentUser} type="plants_world" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'aqua_portal': return <NaturalResources user={currentUser} type="aqua_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'soil_portal': return <NaturalResources user={currentUser} type="soil_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'air_portal': return <NaturalResources user={currentUser} type="air_portal" onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} initialSection={viewSection} />;
      case 'intranet': return <IntranetPortal user={currentUser} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'cea_portal': return <CEA user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'biotech_hub': return <Biotechnology user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} />;
      case 'permaculture_hub': return <Permaculture user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} onEmitSignal={emitSignal} notify={emitSignal} initialSection={viewSection} />;
      case 'emergency_portal': return <EmergencyPortal user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onEmitSignal={emitSignal} />;
      /* Corrected component name to resolve 'Agro' reference error */
      case 'agro_regency': return <AgroRegency user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} />;
      case 'code_of_laws': return <CodeOfLaws user={currentUser} />;
      case 'agro_calendar': return <AgroCalendar user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onEmitSignal={emitSignal} onNavigate={navigate} signals={signals} />;
      case 'chroma_system': return <ChromaSystem user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} />;
      case 'envirosagro_store': return <EnvirosAgroStore user={currentUser} onSpendEAC={handleSpendEAC} onPlaceOrder={(o) => saveCollectionItem('orders', o)} />;
      case 'agro_value_enhancement': return <AgroValueEnhancement user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} initialSection={viewSection} blueprints={blueprints} onSaveBlueprint={(b) => saveCollectionItem('blueprints', b)} />;
      case 'digital_mrv': return <DigitalMRV user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onUpdateUser={(u) => setUser(u)} onNavigate={navigate} onEmitSignal={emitSignal} />;
      case 'online_garden': return <OnlineGarden user={currentUser} onEarnEAC={handleEarnEAC} onSpendEAC={handleSpendEAC} onNavigate={navigate} notify={emitSignal} onExecuteToShell={(c) => { setOsInitialCode(c); navigate('farm_os'); }} initialSection={viewSection} />;
      case 'farm_os': return <FarmOS user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onEmitSignal={emitSignal} initialCode={osInitialCode} clearInitialCode={() => setOsInitialCode(null)} initialSection={viewSection} />;
      case 'media_ledger': return <MediaLedger user={currentUser} shards={mediaShards} onNavigate={navigate} />;
      case 'sitemap': return <Sitemap nodes={REGISTRY_NODES} onNavigate={navigate} />;
      case 'agro_lang_analyst': return <AgroLangAnalyst user={currentUser} onEmitSignal={emitSignal} onNavigate={navigate} />;
      case 'vendor': return <VendorPortal user={currentUser} onSpendEAC={handleSpendEAC} orders={orders} onUpdateOrderStatus={(id, status, m) => { setOrders(o => o.map(x => x.id === id ? {...x, status, ...m} : x)); saveCollectionItem('orders', {id, status, ...m}); }} vendorProducts={vendorProducts} onRegisterProduct={(p) => { setVendorProducts(prev => [p, ...prev]); saveCollectionItem('products', p); }} onNavigate={navigate} initialSection={viewSection} onUpdateProduct={(p) => { setVendorProducts(prev => prev.map(x => x.id === p.id ? p : x)); saveCollectionItem('products', p); }} onEmitSignal={emitSignal} liveProducts={liveProducts} onSaveLiveProduct={(p) => saveCollectionItem('live_products', p)} />;
      case 'ingest': return <NetworkIngest user={currentUser} onUpdateUser={(u) => setUser(u)} onSpendEAC={handleSpendEAC} onNavigate={navigate} onExecuteToShell={(c) => { setOsInitialCode(c); navigate('farm_os'); }} initialSection={viewSection} />;
      case 'info': return <InfoPortal user={currentUser} onNavigate={navigate} onAcceptAll={() => handlePerformPermanentAction('ACCEPT_ALL_AGREEMENTS', 50, 'AGREEMENT_QUORUM_SYNC')} onPermanentAction={handlePerformPermanentAction} />;
      case 'settings': return <SettingsPortal user={currentUser} onUpdateUser={(u) => setUser(u)} onNavigate={navigate} />;
      case 'temporal_video': return <TemporalVideo user={currentUser} onNavigate={navigate} />;
      case 'robot': return <Robot user={currentUser} onSpendEAC={handleSpendEAC} onEarnEAC={handleEarnEAC} onNavigate={navigate} onEmitSignal={emitSignal} />;
      case 'registry_handshake': return <RegistryHandshake user={currentUser} onUpdateUser={(u) => setUser(u)} onSpendEAC={handleSpendEAC} onNavigate={navigate} onEmitSignal={emitSignal} onExecuteToShell={(c) => { setOsInitialCode(c); navigate('farm_os'); }} />;
      case 'educational_resources': return <EducationalResources onNavigate={navigate} />;
      default: return <Dashboard user={currentUser} isGuest={isGuest} blockchain={blockchain} isMining={false} orders={orders} />;
    }
  };

  const unreadSignalsCount = useMemo(() => signals.filter(s => !s.read).length, [signals]);

  if (isBooting) return <InitializationScreen onComplete={() => setIsBooting(false)} />;

  if (hasApiKey === false) {
    return (
      <div className="min-h-screen bg-[#050706] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-white/10 text-center space-y-6 relative z-10">
          <SycamoreLogo size={64} className="mx-auto text-emerald-500" />
          <h1 className="text-2xl font-black uppercase tracking-widest text-white">API Key Required</h1>
          <p className="text-sm text-slate-400">
            This application uses advanced Gemini models that require a paid Google Cloud project. 
            Please select your API key to continue.
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 underline block"
          >
            Learn more about billing requirements
          </a>
          <button
            onClick={async () => {
              if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
                await (window as any).aistudio.openSelectKey();
                setHasApiKey(true);
              }
            }}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050706] text-slate-200 font-sans selection:bg-emerald-500/30 animate-in fade-in duration-1000 relative">
      {/* Quantum Energy Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Toaster theme="dark" position="top-center" toastOptions={{ className: 'bg-black border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest' }} />
      <div className="fixed top-0 left-0 right-0 z-[1000] h-8 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 h-full shrink-0">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-[7px] font-black uppercase text-emerald-400 tracking-widest">NETWORK_PULSE</span>
        </div>
        <div className="flex-1 px-4 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee text-[7px] text-emerald-500/80 font-mono font-black uppercase tracking-widest">
            {pulseMessage} • {new Date().toISOString()} • STABILITY: 1.42x • CONSENSUS: 100% • 
          </div>
        </div>
      </div>
      
      {(isMobileMenuOpen || isSidebarOpen) && (
        <div 
          className="fixed inset-0 z-[240] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => { setIsMobileMenuOpen(false); setIsSidebarOpen(false); }}
        />
      )}

      <div className={`fixed top-8 left-0 bottom-0 z-[250] bg-black/90 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 overflow-y-auto custom-scrollbar ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'} ${isMobileMenuOpen ? 'w-80 translate-x-0' : ''}`}>
        <div className="p-8 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-2xl">
                <SycamoreLogo size={32} className="text-black" />
             </div>
             {(isSidebarOpen || isMobileMenuOpen) && (
               <div className="animate-in fade-in slide-in-from-left-2">
                 <h1 className="text-lg font-black text-white italic tracking-tighter leading-none uppercase">Enviros<span className="text-emerald-400">Agro</span></h1>
                 <p className="text-[6px] text-slate-500 font-black uppercase tracking-0.4em mt-1 italic">Registry</p>
               </div>
             )}
           </div>
           {(isMobileMenuOpen || isSidebarOpen) && <button onClick={() => { setIsMobileMenuOpen(false); setIsSidebarOpen(false); }} className="lg:hidden p-2 text-slate-500 hover:text-white"><X size={20} /></button>}
        </div>

        <nav className="px-4 py-8 space-y-10">
           {REGISTRY_NODES.map((group) => (
             <div key={group.category} className="space-y-4">
                {(isSidebarOpen || isMobileMenuOpen) && <p className={`px-4 text-[7px] font-black uppercase tracking-0.3em text-slate-700 italic`}>{group.category}</p>}
                <div className="space-y-1">
                  {group.items.map(item => (
                    <button key={item.id} onClick={() => navigate(item.id as ViewState)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${view === item.id || (view === 'network_signals' && item.id === 'explorer') ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                      <item.icon size={16} className={view === item.id ? 'text-white' : 'text-slate-500'} />
                      {(isSidebarOpen || isMobileMenuOpen) && <span className="text-[8px] font-black uppercase tracking-[0.2em] text-left leading-none">{item.name}</span>}
                    </button>
                  ))}
                </div>
             </div>
           ))}
        </nav>
      </div>

      <main ref={mainContentRef} onScroll={(e) => handleScroll(e.currentTarget)} className={`transition-all duration-500 pt-14 pb-32 h-screen overflow-y-auto custom-scrollbar relative ${isSidebarOpen ? 'lg:pl-80 pr-4 lg:pr-10' : 'lg:pl-24 pr-4 lg:pr-10'} pl-4`}>
        <div className="fixed top-8 left-0 right-0 z-[200] h-0.5 pointer-events-none">
          <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-300 ease-out" style={{ width: `${scrollProgress}%`, marginLeft: isSidebarOpen ? '20rem' : '5rem' }}></div>
        </div>

        <header className="flex justify-between items-center mb-6 md:mb-8 sticky top-0 bg-[#050706]/90 backdrop-blur-xl py-3 md:py-4 z-[150] px-2 -mx-2 border-b border-emerald-500/10 shadow-lg">
           <div className="flex items-center gap-4 overflow-hidden">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all shrink-0">{isSidebarOpen ? <ChevronLeft size={18}/> : <Menu size={18}/>}</button>
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all shrink-0"><Menu size={18}/></button>
              <div className="space-y-0.5 truncate max-w-[120px] sm:max-w-none">
                 <h2 className="text-sm sm:text-lg font-black text-white uppercase italic tracking-widest truncate leading-tight">{(view || '').replace(/_/g, ' ')}</h2>
                 <p className="text-[6px] sm:text-[8px] text-slate-600 font-mono tracking-widest uppercase truncate font-bold">STATUS: {user ? 'ANCHORED' : 'OBSERVER_MODE'}</p>
              </div>
           </div>
           
           <div className="flex-1 max-w-md mx-6 hidden md:block">
              <div className="flex items-center gap-4">
                 <button onClick={() => setIsGlobalSearchOpen(true)} className="flex-1 h-10 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between text-slate-500 hover:border-emerald-500/40 hover:bg-white/10 transition-all group shadow-inner">
                    <div className="flex items-center gap-3">
                       <Search size={14} className="group-hover:text-emerald-400 transition-colors" />
                       <span className="text-[8px] font-black uppercase tracking-widest">Search Multi-Ledger Registry...</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-30">
                       <span className="px-1.5 py-0.5 bg-white/10 rounded text-[7px] font-mono">⌘</span>
                       <span className="px-1.5 py-0.5 bg-white/10 rounded text-[7px] font-mono">K</span>
                    </div>
                 </button>
                 <button 
                   onClick={() => navigate('internal_control')}
                   className="h-10 px-4 bg-rose-600/10 border border-rose-600/20 rounded-2xl flex items-center gap-3 hover:bg-rose-600/20 transition-all group shadow-inner shrink-0"
                 >
                   <ShieldAlert size={14} className="text-rose-500 animate-pulse" />
                   <span className="text-[7px] font-black uppercase tracking-widest text-rose-500">Control Active</span>
                 </button>
              </div>
           </div>

           <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                onClick={() => { setIsConsultantOpen(!isConsultantOpen); setIsGlobalSearchOpen(false); setIsInboxOpen(false); }}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center relative group ${isConsultantOpen ? 'bg-indigo-600 text-white border-white shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-white/5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}
                title="EnvirosAgro Agro Lang"
              >
                 <SycamoreLogo size={18} className={isConsultantOpen ? "text-white" : "text-emerald-400"} />
                 <div className={`absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-black ${isConsultantOpen ? 'animate-none' : 'animate-pulse'}`}></div>
              </button>

              {user && (
                <div className="relative">
                  <button 
                    onClick={() => { setIsInboxOpen(!isInboxOpen); setIsGlobalSearchOpen(false); setIsConsultantOpen(false); }}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-center relative ${isInboxOpen ? 'bg-indigo-600 text-white border-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                    title="User Inbox"
                  >
                    <BellRing size={18} className={unreadSignalsCount > 0 ? 'animate-pulse' : ''} />
                    {unreadSignalsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[7px] font-black flex items-center justify-center rounded-full border border-black animate-in zoom-in">
                        {unreadSignalsCount > 9 ? '9+' : unreadSignalsCount}
                      </span>
                    )}
                  </button>

                  {isInboxOpen && (
                    <div className="absolute top-14 right-0 w-80 md:w-96 glass-card rounded-3xl border border-white/10 bg-[#050706] shadow-3xl overflow-hidden animate-in slide-in-from-top-4 z-[500]">
                       <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                          <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                             <Mail size={12} /> INBOX_TERMINAL
                          </span>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={markAllSignalsAsRead} 
                              className="text-[7px] font-black text-emerald-400 hover:text-emerald-300 uppercase flex items-center gap-1.5 transition-colors"
                            >
                               <CheckCircle2 size={10} /> Mark All Read
                            </button>
                          </div>
                       </div>
                       <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
                          {signals.filter(s => !s.read).slice(0, 5).length === 0 ? (
                            <div className="p-10 text-center opacity-30 italic text-[10px] uppercase font-black">No active shards.</div>
                          ) : (
                            signals.filter(s => !s.read).slice(0, 5).map(sig => (
                              <div 
                                key={sig.id} 
                                onClick={() => { navigate('explorer', 'terminal'); setIsInboxOpen(false); }}
                                className={`p-4 md:p-5 hover:bg-white/5 cursor-pointer transition-all border-l-4 group/msg ${sig.priority === 'critical' ? 'border-rose-600' : sig.priority === 'high' ? 'border-amber-500' : 'border-indigo-500'}`}
                              >
                                 <div className="flex items-center justify-between gap-3 mb-1">
                                    <div className="flex items-center gap-2">
                                       <span className="text-7px font-mono text-slate-700">{new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                       <span className={`text-[6px] font-black uppercase px-1.5 py-0.5 rounded ${sig.priority === 'critical' ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-600'}`}>{sig.priority}</span>
                                    </div>
                                    <button 
                                      onClick={(e) => markSignalAsRead(sig.id, e)}
                                      className="opacity-0 group-hover/msg:opacity-100 p-1 hover:bg-emerald-500/10 rounded text-emerald-500 transition-all"
                                    >
                                       <CheckCircle2 size={10} />
                                    </button>
                                 </div>
                                 <h5 className="text-[10px] font-black text-white uppercase italic truncate">{sig.title}</h5>
                                 <p className="text-[9px] text-slate-500 mt-1 line-clamp-1 italic">"{sig.message}"</p>
                              </div>
                            ))
                          )}
                       </div>
                       <button onClick={() => navigate('explorer', 'terminal')} className="w-full py-3 bg-indigo-600/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Go to Signal Terminal</button>
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => setIsGlobalSearchOpen(true)} className="md:hidden p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><Search size={16} className="text-slate-400" /></button>
              {user && <button onClick={() => navigate('wallet')} className="px-3 py-2 glass-card rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2 hover:bg-emerald-500/10 transition-all group"><Coins size={12} className="text-emerald-400 group-hover:rotate-12 transition-transform" /><span className="text-[8px] sm:text-[10px] font-mono font-black text-white">{(user?.wallet.balance || 0).toFixed(0)}</span></button>}
              <button onClick={() => navigate('profile')} className={`flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-all shadow-xl overflow-hidden ${user ? 'border-white/10 bg-slate-800' : 'border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20'}`}>
                 {user ? (<><div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 border border-white/20 bg-black/40">{user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <UserIcon size={12} className="text-slate-500 m-auto mt-1.5" />}</div><span className="text-[8px] font-black text-white hidden sm:block truncate max-w-[60px] uppercase italic">{user.name.split(' ')[0]}</span></>) : (<><UserPlus size={14} className="text-emerald-400" /><span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">Sync</span></>)}
              </button>
           </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
          <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>
            {renderView()}
          </Suspense>
        </div>

        <footer className="mt-20 pt-8 border-t border-white/5 pb-12 flex flex-col items-center gap-10 opacity-60 hover:opacity-100 transition-opacity duration-500 px-4">
           <div className="flex w-full items-center justify-between gap-4">
              <button onClick={goBack} disabled={history.length === 0} className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all active:scale-95 group/back ${history.length > 0 ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white' : 'border-white/5 text-slate-800 opacity-20 cursor-not-allowed'}`} title="Vector Retrograde">
                 <ChevronLeft size={16} className="group-hover/back:-translate-x-1 transition-transform" />
                 <div className="flex flex-col items-start text-left hidden md:block"><span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none">Retrograde</span><span className="text-6px font-mono opacity-50 mt-1 uppercase">{history.length > 0 ? history[history.length - 1].matrixIndex : 'Prev_Vector'}</span></div>
              </button>
              <div className="flex p-1 glass-card rounded-[24px] bg-black/40 border border-white/5 shadow-3xl">
                 {[ { id: 'dashboard', label: 'Command', icon: LayoutGrid }, { id: 'mesh_protocol', label: 'Mesh', icon: NetworkIcon }, { id: 'economy', label: 'Market', icon: Globe }, { id: 'wallet', label: 'Treasury', icon: Coins }, { id: 'intelligence', label: 'Science', icon: Microscope }, { id: 'sitemap', label: 'Matrix', icon: MapIcon } ].map(shard => (
                   <button key={shard.id} onClick={() => navigate(shard.id as ViewState)} className={`p-3 rounded-xl transition-all group/shard relative ${view === shard.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-600 hover:text-white hover:bg-white/5'}`} title={shard.label}>
                      <shard.icon size={16} /><div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[7px] font-black uppercase tracking-widest rounded border border-white/10 opacity-0 group-hover/shard:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">{shard.label}</div>
                   </button>
                 ))}
              </div>
              <button onClick={goForward} disabled={forwardHistory.length === 0} className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all active:scale-95 group/fwd ${forwardHistory.length > 0 ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600 hover:text-white' : 'border-white/5 text-slate-800 opacity-20 cursor-not-allowed'}`} title="Vector Advance">
                 <div className="flex flex-col items-end text-right hidden md:block"><span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 transition-all">Advance</span><span className="text-6px font-mono opacity-50 mt-1 uppercase">{forwardHistory.length > 0 ? forwardHistory[forwardHistory.length - 1].matrixIndex : 'Next_Vector'}</span></div>
                 <ChevronRight size={16} className="group-hover/fwd:translate-x-1 transition-transform" />
              </button>
           </div>
           <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 border-t border-white/5 pt-8 px-4 opacity-40">
              <div className="flex items-center gap-4"><SycamoreLogo size={20} className="text-emerald-500" /><div className="text-left"><p className="text-9px font-black text-white uppercase italic tracking-widest leading-none">Enviros<span className="text-emerald-400">Agro</span></p><p className="text-[6px] text-slate-600 font-bold uppercase tracking-[0.4em] mt-1">Planetary_Regeneration_Grid</p></div></div>
              <div className="flex items-center gap-8"><div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-7px text-slate-700 font-mono uppercase font-black">MATRIX_SYNC_OK</span></div><p className="text-7px text-slate-700 font-mono uppercase tracking-widest">© 2025 EA_ROOT_NODE</p><button onClick={() => navigate('info')} className="text-7px font-black text-slate-600 hover:text-white uppercase tracking-[0.4em]">SAFETY_REGISTRY</button></div>
           </div>
        </footer>
        {showZenithButton && <button onClick={scrollToTop} className="fixed bottom-32 right-6 sm:right-10 p-3.5 sm:p-4 agro-gradient rounded-xl sm:rounded-2xl text-white shadow-3xl hover:scale-110 active:scale-95 transition-all z-[400] border border-white/20 animate-in fade-in zoom-in duration-300"><LucideIcons.ArrowUp size={20} /></button>}
      </main>

      <div className="fixed top-24 right-4 sm:right-10 z-[500] space-y-4 max-w-[280px] sm:max-w-sm w-full pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 sm:p-5 rounded-2xl border shadow-3xl flex items-start gap-3 pointer-events-auto animate-in slide-in-from-right duration-500 ${n.type === 'error' ? 'bg-rose-950/80 border-rose-500/30 text-rose-500' : n.type === 'warning' ? 'bg-amber-950/80 border-amber-500/30 text-amber-400' : 'bg-black/95 border-emerald-500/20 text-emerald-400'}`}>
            {n.type === 'error' ? <LucideIcons.ShieldAlert className="shrink-0 mt-0.5" size={16} /> : <LucideIcons.Info className="shrink-0 mt-0.5" size={16} />}
            <div className="flex-1 space-y-0.5"><h5 className="text-[9px] font-black uppercase tracking-widest">{n.title}</h5><p className="text-[9px] italic text-slate-300 leading-tight">{n.message}</p></div>
            <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="text-slate-700 hover:text-white"><X size={12}/></button>
          </div>
        ))}
      </div>
      <GlobalSearch 
        isOpen={isGlobalSearchOpen} 
        onClose={() => setIsGlobalSearchOpen(false)} 
        onNavigate={navigate} 
        vendorProducts={vendorProducts} 
        contracts={contracts}
        blueprints={blueprints}
        liveProducts={liveProducts}
        industrialUnits={industrialUnits}
      />
      <EvidenceModal isOpen={isEvidenceOpen} onClose={() => setIsEvidenceOpen(false)} user={user || GUEST_STWD} onMinted={(v) => handleEarnEAC(v, 'Evidence Minted')} onNavigate={navigate} taskToIngest={activeTaskForEvidence} />
      <LiveVoiceBridge isOpen={false} isGuest={!user} onClose={() => {}} />
      <FloatingConsultant isOpen={isConsultantOpen} onClose={() => setIsConsultantOpen(false)} user={user || GUEST_STWD} onNavigate={navigate} />
      <RegistrationResumePopup />
    </div>
  );
};

export default App;