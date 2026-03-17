
import React, { useState, useEffect } from 'react';
import { Info, Calculator, Zap, Save, RefreshCw } from 'lucide-react';

const Simulator: React.FC = () => {
  const [rainfall, setRainfall] = useState(800);
  const [soilHealth, setSoilHealth] = useState(70);
  const [practiceLevel, setPracticeLevel] = useState(5);
  const [results, setResults] = useState({ u: 0, tau: 0, score: 0 });

  const calculateEOSMetrics = () => {
    // Mock Scientific Formula: U = (Rainfall * SoilHealth) / (1000)
    // tau = (PracticeLevel * SoilHealth) / 10
    const u = (rainfall * soilHealth) / 1000;
    const tau = (practiceLevel * soilHealth) / 10;
    const score = (u * tau) / 5;
    setResults({ u, tau, score: Math.min(score, 100) });
  };

  useEffect(() => {
    calculateEOSMetrics();
  }, [rainfall, soilHealth, practiceLevel]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-card p-8 rounded-3xl space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <Calculator className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Sustainability Inputs</h3>
            <p className="text-sm text-slate-500">Tune parameters to simulate farm sustainability</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Annual Rainfall (mm)</label>
              <span className="text-sm font-mono text-emerald-400">{rainfall}mm</span>
            </div>
            <input 
              type="range" min="0" max="2500" value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Baseline Soil Health (%)</label>
              <span className="text-sm font-mono text-blue-400">{soilHealth}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={soilHealth}
              onChange={(e) => setSoilHealth(Number(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-400">Regenerative Practice Level (1-10)</label>
              <span className="text-sm font-mono text-amber-400">Lvl {practiceLevel}</span>
            </div>
            <input 
              type="range" min="1" max="10" value={practiceLevel}
              onChange={(e) => setPracticeLevel(Number(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-200/70 leading-relaxed">
            Agricultural Code (U) and Sustainable Time Constant (τ) are core EOS metrics used to verify carbon credit eligibility.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-8 rounded-3xl bg-emerald-500/[0.02]">
          <h3 className="text-lg font-bold text-white mb-6">Derived EOS Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 glass-card rounded-2xl border-emerald-500/20">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Agricultural Code (U)</p>
              <h4 className="text-4xl font-mono font-bold text-emerald-400">{results.u.toFixed(2)}</h4>
            </div>
            <div className="p-6 glass-card rounded-2xl border-blue-500/20">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Time Constant (τ)</p>
              <h4 className="text-4xl font-mono font-bold text-blue-400">{results.tau.toFixed(1)}</h4>
            </div>
          </div>

          <div className="mt-6 p-8 glass-card rounded-3xl text-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm text-slate-400 mb-2">Total Sustainability Score</p>
              <h2 className="text-6xl font-black text-white">{results.score.toFixed(1)}%</h2>
              <div className="mt-4 flex justify-center">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${results.score > 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {results.score > 70 ? 'OPTIMAL PERFORMANCE' : 'SUB-OPTIMAL: ADJUST PRACTICES'}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-4 glass-card rounded-2xl text-slate-300 hover:bg-white/5 font-bold transition-all">
            <RefreshCw className="w-4 h-4" /> Reset Model
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-4 agro-gradient rounded-2xl text-white font-bold shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all">
            <Save className="w-4 h-4" /> Submit to Ledger
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
