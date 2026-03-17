
export interface LinkedProvider {
  id: string;
  type: 'Mobile' | 'Bank' | 'Web3' | 'Card' | 'PayPal' | 'Visa' | 'Mastercard';
  name: string;
  accountFragment: string;
  status: 'Active' | 'Pending' | 'Verification_Required';
  lastSync: string;
}

export interface HandshakeStep {
  id: string;
  label: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  timestamp?: string;
  hash?: string;
}

export interface VerificationMeta {
  method: 'QR_SCAN' | 'NFC_TAP' | 'GEO_LOCK' | 'DOC_INGEST' | 'IOT_HANDSHAKE';
  verifiedAt: string;
  deviceSecretHash?: string;
  geoPolygon?: [number, number][];
  coordinates?: { lat: number; lng: number };
  proofDocumentUrl?: string;
  confidenceScore?: number;
  steps?: HandshakeStep[];
}

export interface AgroResource {
  id: string;
  category: 'HARDWARE' | 'LAND' | 'INFRASTRUCTURE';
  type: string;
  name: string;
  status: 'PROVISIONAL' | 'VERIFIED' | 'REVOKED' | 'AUDITING' | 'LINKED';
  capabilities: string[];
  verificationMeta: VerificationMeta;
}

export interface RegistryItem {
  id: ViewState;
  name: string;
  icon: any;
  sections?: { id: string; label: string }[];
}

export interface RegistryGroup {
  category: string;
  items: RegistryItem[];
}

export interface User {
  name: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Non-Binary' | 'Not Specified';
  esin: string;
  mnemonic: string;
  regDate: string;
  avatar?: string;
  bio?: string;
  role: string;
  location: string;
  coords?: { lat: number; lng: number };
  wallet: EACWallet;
  metrics: SustainabilityMetrics;
  skills: Record<string, number>;
  isReadyForHire: boolean;
  completedActions?: string[]; 
  settings?: {
    notificationsEnabled: boolean;
    privacyMode: 'Public' | 'Private' | 'Consensus_Only';
    autoSync: boolean;
    biometricLogin: boolean;
    theme: 'Dark' | 'High_Resonance' | 'OLED_Black';
    fontSize?: number;
    units?: 'Metric' | 'Imperial';
    locationAccuracy?: 'High' | 'Battery';
    connectivityMode?: 'Satellite' | 'LoRaWAN' | 'Cellular';
    anonymizedSharing?: boolean;
    geofenceSecurity?: boolean;
    dataRefreshRate?: 'Real-time' | '5m' | '1h';
  };
  resources?: AgroResource[];
  zodiacFlower?: {
    month: string;
    flower: string;
    color: string;
    hex: string;
    pointsAdded: boolean;
  };
}

export interface EACWallet {
  balance: number;
  eatBalance: number;
  stakedEat?: number;
  exchangeRate: number;
  bonusBalance: number;
  tier: 'Seed' | 'Sprout' | 'Harvest';
  lifetimeEarned: number;
  linkedProviders: LinkedProvider[];
  lastSyncDate?: string;
  miningStreak?: number;
  pendingSocialHarvest?: number;
}

export interface SustainabilityMetrics {
  agriculturalCodeU: number;
  timeConstantTau: number;
  sustainabilityScore: number;
  socialImmunity: number;
  viralLoadSID: number;
  baselineM: number;
}

export type SupplierType = 
  | 'REVERSE_RETURN' 
  | 'RAW_MATERIALS' 
  | 'FINISHED_PRODUCTS' 
  | 'SERVICE_PROVIDER' 
  | 'AUTHOR' 
  | 'INPUT' 
  | 'MANUFACTURING' 
  | 'CONSULTATION' 
  | 'LOGISTICS' 
  | 'WAREHOUSING' 
  | 'DISTRIBUTION' 
  | 'VETERINARY' 
  | 'TOUR_GUIDE';

export interface VendorProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  initialValue?: number;
  registrationFee?: number;
  stock: number;
  category: 'Seed' | 'Input' | 'Tool' | 'Technology' | 'Logistics' | 'Produce' | 'Service' | 'Book' | 'Manufacturing' | 'Consultation' | 'Warehousing' | 'Distribution' | 'VETERINARY' | 'Tour Guide' | 'Acoustic' | 'Circular' | 'Raw' | 'Tour' | 'Ready' | 'Facility' | 'Organization Service' | 'Mission' | 'Blueprint';
  supplierEsin: string;
  supplierName: string;
  supplierType: SupplierType;
  status: 'PROVISIONAL' | 'AWAITING_AUDIT' | 'AUTHORIZED' | 'REVOKED' | 'QUALIFIED';
  image?: string;
  timestamp: string;
  thrust?: string;
  coords?: { lat: number; lng: number };
  distance_km?: number;
  sku?: string;
  sonicSignature?: string;
  isQualified?: boolean;
  locationAddress?: string;
  gpsCoords?: { lat: number; lng: number };
  isOrganizationService?: boolean;
  liveFarmingStage?: string;
  inboundSignals?: any[];
  financialLedger?: any[];
  isLiveProcessing?: boolean;
  programId?: string;
  programName?: string;
}

export interface ChapterShard {
  id: string;
  title: string;
  content: string;
  sequence: number;
  timestamp: string;
}

export interface AgroBook {
  id: string;
  title: string;
  authorEsin: string;
  authorName: string;
  abstract: string;
  chapters: ChapterShard[];
  status: 'Draft' | 'Vetting' | 'Published' | 'Market_Listed';
  price: number;
  views: number;
  vouches: number;
  downloads: number;
  thrust: string;
  timestamp: string;
  impactMatrix: {
    societal: number;
    environmental: number;
    human: number;
    technological: number;
    industry: number;
  };
}

export type OrderStatus = 
  | 'ORD_PLACED' 
  | 'AVAILABILITY_VERIFIED'
  | 'ORD_VERIFIED' 
  | 'PAYMENT_HELD' 
  | 'LOGISTICS_PEND' 
  | 'DISPATCHED' 
  | 'DELIVERED' 
  | 'COMPLETED';

export interface Order {
  id: string;
  itemId: string;
  itemName: string;
  itemType: string;
  itemImage?: string;
  cost: number;
  status: OrderStatus;
  supplierEsin: string;
  customerEsin: string;
  timestamp: string;
  trackingHash: string;
  sourceTab: 'market' | 'circular' | 'store' | 'agrowild' | 'books';
  logisticsNode?: string;
  logisticProviderId?: string;
  logisticCost?: number;
  isReceiptIssued?: boolean;
  isPrnSigned?: boolean;
}

export interface AgroProject {
  id: string;
  name: string;
  adminEsin: string;
  description: string;
  thrust: string;
  status: string;
  totalCapital: number;
  fundedAmount: number;
  batchesClaimed: number;
  totalBatches: number;
  progress: number;
  roiEstimate: number;
  collateralLocked: number;
  profitsAccrued: number;
  investorShareRatio: number;
  performanceIndex: number;
  memberCount: number;
  isPreAudited: boolean;
  isPostAudited: boolean;
}

export interface AgroTransaction {
  id: string;
  type: string;
  farmId: string;
  details: string;
  value: number;
  unit: string;
}

export interface AgroBlock {
  hash: string;
  prevHash: string;
  timestamp: string;
  transactions: AgroTransaction[];
  validator: string;
  status: string;
}

export interface ValueProcessStep {
  step_order: number;
  operation: string;
  duration_hours: number;
  status?: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export interface AssetGuarantee {
  asset_id: string;
  asset_type: 'RAW_MATERIAL_STOCK' | 'MACHINERY_IOT' | 'LAND_DEED' | 'TOKENIZED_ASSET';
  verification_status: boolean;
}

export interface ValueBlueprint {
  blueprint_id: string;
  status: 'DRAFT' | 'READY_FOR_ASSETS' | 'LIVE';
  input_material: {
    name: string;
    volume: number;
  };
  value_process_steps: ValueProcessStep[];
  asset_requirements: string[];
  projected_value_delta: number;
  guarantees?: AssetGuarantee[];
}

export interface MissionMilestone {
  id: string;
  label: string;
  status: 'LOCKED' | 'ACTIVE' | 'COMPLETED';
  stakeReleasePercent: number;
}

export type MissionCategory = 'FUND_ACQUISITION' | 'INVESTMENT' | 'CHARITY' | 'LIVE_FARMING' | 'INDUSTRIAL_LOGISTICS';

export interface FarmingContract {
  id: string;
  investorEsin: string;
  investorName: string;
  category: MissionCategory;
  productType: string;
  requiredLand: string;
  requiredLabour: string;
  budget: number;
  status: 'Open' | 'Closed' | 'In_Progress';
  applications: ContractApplication[];
  capitalIngested: boolean;
  milestones: MissionMilestone[];
  streamingRequirement?: boolean;
  associatedPrograms?: string[];
}

export interface ContractApplication {
  id: string;
  farmerEsin: string;
  farmerName: string;
  landResources: string;
  labourCapacity: string;
  auditStatus: 'Pending' | 'Verified' | 'Rejected';
  paymentEscrowed: number;
  matchScore: number;
  ingestedAssets: string[];
}

export interface RegisteredUnit {
  id: string;
  name: string;
  type: string;
  location: string;
  coords?: { lat: number; lng: number };
  status: 'ACTIVE' | 'AUDITING' | 'INACTIVE';
  load: number;
  capacity: string;
}

export interface LiveAgroProduct {
  id: string;
  stewardEsin: string;
  stewardName: string;
  productType: string;
  category: 'Produce' | 'Manufactured' | 'Input';
  stage: 'Inception' | 'Processing' | 'Quality_Audit' | 'Finalization' | 'Market_Ready';
  progress: number;
  votes: number;
  location: string;
  timestamp: string;
  lastUpdate: string;
  isAuthentic: boolean;
  auditStatus: string;
  tasks?: string[];
  telemetryNodes?: string[];
  marketStatus?: 'Forecasting' | 'Processing' | 'Ready';
  vouchYieldMultiplier?: number;
  isPhysicallyVerified?: boolean;
  isSystemAudited?: boolean;
  evidenceCount?: number;
  isBroadcasting?: boolean;
  sourceAssetId?: string;
  sourceAssetType?: string;
  associatedPrograms?: string[];
  associatedMissions?: string[];
}

export interface NotificationShard {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actionLabel?: string;
  actionIcon?: any;
}

export interface WorkerProfile {
  id: string;
  name: string;
  esin: string;
  skills: string[];
  sustainabilityRating: number;
  verifiedHours: number;
  isOpenToWork: boolean;
  lifetimeEAC: number;
  efficiency: number;
  avatar: string;
  location: string;
}

export interface LogisticProvider {
  id: string;
  name: string;
  mResonance: number;
  sustainabilityScore: number;
  costEAC: number;
  speed: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ResearchPaper {
  id: string;
  title: string;
  author: string;
  authorEsin: string;
  abstract: string;
  content: string;
  thrust: string;
  status: string;
  impactScore: number;
  rating: number;
  eacRewards: number;
  timestamp: string;
  iotDataUsed: boolean;
}

export interface MediaShard {
  id: string;
  title: string;
  type: 'VIDEO' | 'AUDIO' | 'PAPER' | 'ORACLE' | 'POST' | 'INGEST' | 'CHAPTER';
  source: string;
  author: string;
  authorEsin: string;
  timestamp: string;
  hash: string;
  mImpact: string;
  size: string;
  thumb?: string;
  content?: string;
  downloadUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  thrust: string;
  priority: string;
  status: 'Inception' | 'Processing' | 'Quality_Audit' | 'Completed';
  timestamp: string;
  stewardEsin: string;
  assetId?: string; // Links to LiveAgroProduct or FarmingContract
  blueprintId?: string;
  evidenceShards?: string[]; // IDs of MediaShards/Evidence
  allocatedResources?: string[]; // IDs of AgroResources
  description?: string;
}

export type ViewState = 
  | 'dashboard' | 'wallet' | 'sustainability' | 'economy' | 'industrial' 
  | 'intelligence' | 'community' | 'explorer' | 'ecosystem' | 'media' 
  | 'info' | 'profile' | 'investor' | 'vendor' | 'ingest' | 'tools' 
  | 'channelling' | 'circular' | 'crm' | 'tqm' | 'research' 
  | 'live_farming' | 'contract_farming' | 'agrowild' | 'impact'
  | 'animal_world' | 'plants_world' | 'aqua_portal' | 'soil_portal' | 'air_portal'
  | 'intranet' | 'cea_portal' | 'biotech_hub' | 'permaculture_hub' | 'emergency_portal'
  | 'agro_regency' | 'code_of_laws' | 'agro_calendar' | 'chroma_system'
  | 'envirosagro_store' | 'agro_value_enhancement' | 'digital_mrv'
  | 'online_garden' | 'farm_os' | 'network_signals' | 'media_ledger'
  | 'sitemap' | 'auth' | 'agro_lang_analyst' | 'settings' | 'temporal_video' | 'robot'
  | 'multimedia_generator' | 'cost_accounting' | 'internal_control'
  | 'mesh_protocol' | 'registry_handshake' | 'educational_resources';

export interface VectorAddress {
  dimension: ViewState;
  element: string | null;
  matrixIndex?: string; // e.g. "[2.1]"
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface DispatchChannel {
  channel: 'EMAIL' | 'PHONE' | 'INBOX' | 'POPUP' | 'CALENDAR';
  status: 'PENDING' | 'SENT' | 'FAILED' | 'READ';
  timestamp?: string;
}

export interface HoodConnection {
  id: string;
  stewardEsin: string;
  targetEsin: string;
  type: 'DEAL' | 'CONTRACT' | 'SOCIAL' | 'AUDIT';
  status: 'ACTIVE' | 'TERMINATED';
  timestamp: string;
  metadata?: any;
}

export interface SignalShard {
  id: string;
  type: 'system' | 'engagement' | 'network' | 'commerce' | 'pulse' | 'task' | 'liturgical' | 'ledger_anchor' | 'emergency';
  origin: 'MANUAL' | 'CALENDAR' | 'ORACLE' | 'EXTERNAL' | 'TREASURY' | 'CARBON' | 'TRACE' | 'EMERGENCY_CMD';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionLabel?: string;
  actionIcon?: string; 
  aiRemark?: string;
  dispatchLayers: DispatchChannel[];
  meta?: {
    target?: ViewState;
    payload?: any;
    ledgerContext?: 'TREASURY' | 'CARBON' | 'REVENUE' | 'RESOLUTION' | 'INVENTION' | 'SOCIAL' | 'EMERGENCY';
  };
}

export interface Collective {
  id: string;
  name: string;
  adminEsin: string;
  adminName: string;
  description: string;
  memberCount: number;
  resonance: number;
  type: 'HERITAGE_CLAN' | 'TECHNICAL_GUILD' | 'COOPERATIVE' | 'INNOVATION_NODE';
  rules: string;
  mission: string;
  trending: string;
  status: 'PROVISIONAL' | 'VERIFIED' | 'QUALIFIED';
  members: string[]; // List of ESINs
  treasuryBalance: number;
  activeMissions: string[]; // Mission IDs
}

export interface SocialPost {
  id: string;
  authorEsin: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  mediaType?: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  mediaUrl?: string;
  timestamp: string;
  likes: number;
  vouchCount: number;
  shares: number;
  comments: PostComment[];
  collectiveId?: string; // If posted in a group
  isLive?: boolean;
}

export interface PostComment {
  id: string;
  authorEsin: string;
  authorName: string;
  text: string;
  timestamp: string;
}

export interface StewardConnection {
  id: string;
  fromEsin: string;
  toEsin: string;
  status: 'PENDING' | 'MUTUAL' | 'BLOCKED';
  timestamp: string;
}

export interface ShardCostCalibration {
  shardId: string;
  baseCost: number;
  calibratedCost: number;
  mConstant: number;
  caFactor: number;
  sehtiBonus: number;
  stressPenalty: number;
  finalYield: number;
}

export type UserRole = 'STEWARD' | 'ADMIN' | 'INVESTOR' | 'VENDOR' | 'GUEST' | 'ORACLE_CONTROLLER';

export interface ControlRule {
  id: string;
  name: string;
  description: string;
  protocol: string;
  isActive: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface UserResponsibility {
  id: string;
  role: UserRole;
  task: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  priority: number;
}

export interface InternalControlState {
  balanceOfPowers: {
    stewardship: number;
    governance: number;
    treasury: number;
    intelligence: number;
  };
  activeRules: ControlRule[];
  responsibilities: UserResponsibility[];
  globalAnalysis: {
    networkHealth: number;
    totalTreasury: number;
    systemLiquidity: number;
    userLiquidity: number;
  };
}

export interface MeshNode {
  id: string;
  esin: string;
  label: string;
  status: 'UP' | 'DOWN' | 'SYNCING';
  lastBlock: string;
  peers: string[];
  latency: number;
  load: number;
}
