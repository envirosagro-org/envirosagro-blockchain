import React from 'react';
import { useAppStore } from '../store';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { UserPlus, ArrowRight, X } from 'lucide-react';

export const RegistrationResumePopup: React.FC = () => {
  const { registrationState, setRegistrationState, view } = useAppStore();
  const { navigate } = useAppNavigation();

  if (!registrationState || view === 'auth') return null;

  return (
    <div className="fixed bottom-6 left-6 z-[600] animate-in slide-in-from-bottom-8 duration-500 max-w-sm w-full">
      <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-black/90 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <UserPlus size={100} />
        </div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
              <UserPlus size={20} />
            </div>
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-widest">Resume Registration</h4>
              <p className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest">Step {registrationState.step} in progress</p>
            </div>
          </div>
          <button 
            onClick={() => setRegistrationState(null)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-slate-400 mb-4">
            You have an incomplete registration process. Continue to unlock full network capabilities.
          </p>
          <button 
            onClick={() => navigate('auth')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            Continue Registration <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
