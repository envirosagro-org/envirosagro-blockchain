import { create } from 'zustand';
import { User, ViewState, AgroTransaction, AgroProject, ShardCostCalibration, SignalShard, VectorAddress, RegistryGroup, RegistryItem } from '../types';
import { REGISTRY_NODES } from '../constants/registry';

const findMatrixIndex = (v: ViewState, section: string | null): string | undefined => {
  let index: string | undefined;
  REGISTRY_NODES.forEach((group: RegistryGroup, dIdx: number) => {
    group.items.forEach((item: RegistryItem, eIdx: number) => {
      if (item.id === v) {
        if (!section) {
          index = `[${dIdx + 1}.${eIdx + 1}]`;
        } else {
          const sIdx = item.sections?.findIndex((s: {id: string}) => s.id === section);
          if (sIdx !== undefined && sIdx !== -1) {
            index = `[${dIdx + 1}.${eIdx + 1}.${sIdx + 1}]`;
          }
        }
      }
    });
  });
  return index;
};

export interface RegistrationState {
  step: number;
  data: {
    name?: string;
    email?: string;
    password?: string;
    farmName?: string;
    farmSize?: string;
    mainCrop?: string;
    location?: string;
  };
}

interface AppState {
  registrationState: RegistrationState | null;
  setRegistrationState: (state: RegistrationState | null) => void;
  updateRegistrationData: (data: Partial<RegistrationState['data']>) => void;
  nextRegistrationStep: () => void;
  prevRegistrationStep: () => void;

  vendorRegistrationState: any | null;
  setVendorRegistrationState: (state: any | null) => void;

  handshakeRegistrationState: any | null;
  setHandshakeRegistrationState: (state: any | null) => void;

  missionRegistrationState: any | null;
  setMissionRegistrationState: (state: any | null) => void;

  liveFarmingRegistrationState: any | null;
  setLiveFarmingRegistrationState: (state: any | null) => void;

  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedUser: User) => void;
  
  view: ViewState;
  setView: (view: ViewState) => void;
  
  viewSection: string | null;
  setViewSection: (section: string | null) => void;
  
  history: VectorAddress[];
  forwardHistory: VectorAddress[];
  
  navigate: (v: ViewState, section?: string, pushToHistory?: boolean) => void;
  goBack: () => void;
  goForward: () => void;
  
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (isOpen: boolean) => void;
  
  isInboxOpen: boolean;
  setIsInboxOpen: (isOpen: boolean) => void;
  
  signals: SignalShard[];
  setSignals: (signals: SignalShard[]) => void;
  markSignalAsRead: (id: string) => void;
  emitSignal: (sig: Omit<SignalShard, 'id' | 'timestamp' | 'read'>) => void;
  
  transactions: AgroTransaction[];
  setTransactions: (transactions: AgroTransaction[]) => void;
  
  projects: AgroProject[];
  setProjects: (projects: AgroProject[]) => void;
  
  costAudit: ShardCostCalibration | null;
  setCostAudit: (audit: ShardCostCalibration | null) => void;

  // Ecosystem Synchronization State
  ecosystemState: {
    p1: number;
    p2: number;
    p3: number;
    isAnchored: boolean;
  };
  updateEcosystemState: (state: Partial<AppState['ecosystemState']>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  registrationState: null,
  setRegistrationState: (state) => set({ registrationState: state }),
  updateRegistrationData: (data) => set((state) => ({
    registrationState: state.registrationState ? {
      ...state.registrationState,
      data: { ...state.registrationState.data, ...data }
    } : { step: 1, data }
  })),
  nextRegistrationStep: () => set((state) => ({
    registrationState: state.registrationState ? {
      ...state.registrationState,
      step: state.registrationState.step + 1
    } : null
  })),
  prevRegistrationStep: () => set((state) => ({
    registrationState: state.registrationState ? {
      ...state.registrationState,
      step: Math.max(1, state.registrationState.step - 1)
    } : null
  })),

  vendorRegistrationState: null,
  setVendorRegistrationState: (state) => set({ vendorRegistrationState: state }),

  handshakeRegistrationState: null,
  setHandshakeRegistrationState: (state) => set({ handshakeRegistrationState: state }),

  missionRegistrationState: null,
  setMissionRegistrationState: (state) => set({ missionRegistrationState: state }),

  liveFarmingRegistrationState: null,
  setLiveFarmingRegistrationState: (state) => set({ liveFarmingRegistrationState: state }),

  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updatedUser) => set({ user: updatedUser }),
  
  view: 'dashboard',
  setView: (view) => set({ view }),
  
  viewSection: null,
  setViewSection: (section) => set({ viewSection: section }),
  
  history: [],
  forwardHistory: [],
  
  navigate: (v, section, pushToHistory = true) => {
    const state = get();
    const index = findMatrixIndex(v, section || null);
    
    if (pushToHistory) {
      const currentAddress: VectorAddress = {
        dimension: state.view,
        element: state.viewSection,
        matrixIndex: findMatrixIndex(state.view, state.viewSection)
      };
      set({
        history: [...state.history, currentAddress],
        forwardHistory: []
      });
    }
    
    set({
      view: v,
      viewSection: section || null,
      isMobileMenuOpen: false,
      isInboxOpen: false
    });
    
    state.emitSignal({
      title: 'VECTOR_SHIFT',
      message: `Resolved route to ${index || v.toUpperCase()}.`,
      priority: 'low',
      type: 'system',
      origin: 'ORACLE',
      actionIcon: 'ChevronRight',
      dispatchLayers: [{ channel: 'POPUP', status: 'PENDING' }]
    });
  },
  
  goBack: () => {
    const state = get();
    if (state.history.length > 0) {
      const currentAddress: VectorAddress = {
        dimension: state.view,
        element: state.viewSection,
        matrixIndex: findMatrixIndex(state.view, state.viewSection)
      };
      const lastVector = state.history[state.history.length - 1];
      
      set({
        forwardHistory: [...state.forwardHistory, currentAddress],
        history: state.history.slice(0, -1)
      });
      
      state.navigate(lastVector.dimension, lastVector.element || undefined, false);
    } else if (state.view !== 'dashboard') {
      state.navigate('dashboard', undefined, true);
    }
  },
  
  goForward: () => {
    const state = get();
    if (state.forwardHistory.length > 0) {
      const currentAddress: VectorAddress = {
        dimension: state.view,
        element: state.viewSection,
        matrixIndex: findMatrixIndex(state.view, state.viewSection)
      };
      const nextVector = state.forwardHistory[state.forwardHistory.length - 1];
      
      set({
        history: [...state.history, currentAddress],
        forwardHistory: state.forwardHistory.slice(0, -1)
      });
      
      state.navigate(nextVector.dimension, nextVector.element || undefined, false);
    }
  },
  
  isSidebarOpen: true,
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  
  isGlobalSearchOpen: false,
  setIsGlobalSearchOpen: (isOpen) => set({ isGlobalSearchOpen: isOpen }),
  
  isInboxOpen: false,
  setIsInboxOpen: (isOpen) => set({ isInboxOpen: isOpen }),
  
  signals: [],
  setSignals: (signals) => set({ signals }),
  markSignalAsRead: (id) => set((state) => ({
    signals: state.signals.map(s => s.id === id ? { ...s, read: true } : s)
  })),
  emitSignal: (sig) => {
    const newSig: SignalShard = {
      ...sig,
      id: `SIG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    set((state) => ({
      signals: [newSig, ...state.signals].slice(0, 50)
    }));
  },
  
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  
  projects: [],
  setProjects: (projects) => set({ projects }),
  
  costAudit: null,
  setCostAudit: (audit) => set({ costAudit: audit }),

  ecosystemState: {
    p1: 1.2,
    p2: 8.5,
    p3: 0.5,
    isAnchored: false,
  },
  updateEcosystemState: (newState) => set((state) => ({
    ecosystemState: { ...state.ecosystemState, ...newState }
  })),
}));
