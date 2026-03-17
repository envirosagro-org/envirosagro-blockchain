import { RegistryGroup } from '../types';
import { 
  LayoutDashboard, Network, Leaf, Brain, Settings, User as UserIcon, 
  Database, Binary, TrendingUp, Microscope, Map as MapIcon, Info, 
  Handshake, Briefcase, Binoculars, Users, Factory, FlaskConical, 
  Wallet, Globe, Warehouse, Layers, Store, Flower, Scan, Cable, 
  Monitor, ClipboardCheck, HeartHandshake, Recycle, Wrench, Bot, 
  PawPrint, TreePine, Droplets, Mountain, Wind, ShieldPlus, Siren, 
  History, Scale, CalendarDays, Palette, Zap, Dna, Compass, BoxSelect, 
  FileStack, Tv, Share2, SmartphoneNfc, BookOpen, ShieldCheck 
} from 'lucide-react';

export const REGISTRY_NODES: RegistryGroup[] = [
  { 
    category: 'Command & Strategy', 
    items: [
      { id: 'dashboard', name: 'Command Center', icon: LayoutDashboard, sections: [{id: 'metrics', label: 'Node Metrics'}, {id: 'oracle', label: 'Oracle Hub'}, {id: 'path', label: 'Strategic Path'}] },
      { id: 'mesh_protocol', name: 'Mesh Protocol', icon: Network, sections: [{id: 'topology', label: 'Network Topology'}, {id: 'commits', label: 'Block Shards'}, {id: 'mempool', label: 'Inbound Mempool'}] },
      { id: 'sustainability', name: 'Sustainability Shard', icon: Leaf },
      { id: 'agro_lang_analyst', name: 'Neural Analyst', icon: Brain },
      { id: 'settings', name: 'System Settings', icon: Settings, sections: [{id: 'display', label: 'UI Display'}, {id: 'privacy', label: 'Security Shards'}] },
      { id: 'profile', name: 'Steward Profile', icon: UserIcon, sections: [{id: 'dossier', label: 'Personal Registry'}, {id: 'card', label: 'Identity Shard'}, {id: 'celestial', label: 'Birth Resonance'}] },
      { id: 'explorer', name: 'Monitoring Hub', icon: Database, sections: [{id: 'terminal', label: 'Signal Terminal'}, {id: 'blocks', label: 'Blocks'}, {id: 'ledger', label: 'Tx Ledger'}, {id: 'consensus', label: 'Quorum'}, {id: 'settlement', label: 'Finality'}] },
      { id: 'farm_os', name: 'Farm OS', icon: Binary, sections: [{id: 'kernel', label: 'Kernel Stack'}, {id: 'ide', label: 'AgroLang IDE'}, {id: 'shell', label: 'System Shell'}] },
      { id: 'impact', name: 'Network Impact', icon: TrendingUp, sections: [{id: 'whole', label: 'Vitality'}, {id: 'carbon', label: 'Carbon Ledger'}, {id: 'thrusts', label: 'Resonance'}] },
      { id: 'intelligence', name: 'Science Oracle', icon: Microscope, sections: [{id: 'twin', label: 'Digital Twin'}, {id: 'simulator', label: 'EOS Physics'}, {id: 'eos_ai', label: 'Expert Oracle'}] },
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
      { id: 'internal_control', name: 'Internal Control', icon: ShieldCheck },
      { id: 'cea_portal', name: 'CEA Portal', icon: BoxSelect },
      { id: 'media_ledger', name: 'Media Ledger', icon: FileStack },
      { id: 'media', name: 'Media Hub', icon: Tv },
      { id: 'channelling', name: 'Channelling Hub', icon: Share2 },
      { id: 'registry_handshake', name: 'Registry Handshake', icon: SmartphoneNfc },
      { id: 'educational_resources', name: 'Educational Resources', icon: BookOpen }
    ]
  }
];
