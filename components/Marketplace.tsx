
import React from 'react';
import { Tag, TrendingUp, Search, Filter, ShoppingBag, Zap, Award } from 'lucide-react';

const Marketplace: React.FC = () => {
  const products = [
    { id: 1, name: 'Premium Soil Report (US-NE)', price: 450, category: 'Data', rating: 4.8 },
    { id: 2, name: 'Hydroponics Master Course', price: 1200, category: 'Education', rating: 4.9 },
    { id: 3, name: 'Verified Carbon Credits (10t)', price: 850, category: 'Assets', rating: 5.0 },
    { id: 4, name: 'Profile Boost (7 Days)', price: 150, category: 'Service', rating: 4.5 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" placeholder="Search for data, courses, or boosts..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 glass-card rounded-2xl text-sm font-bold text-slate-300">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 glass-card rounded-2xl text-sm font-bold text-slate-300">
            <Tag className="w-4 h-4" /> My Listings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((item) => (
          <div key={item.id} className="glass-card rounded-3xl p-6 group hover:border-emerald-500/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
            </div>
            
            <div className="mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                {item.category}
              </span>
            </div>
            
            <h4 className="text-white font-bold mb-2 group-hover:text-emerald-400 transition-colors">{item.name}</h4>
            
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Award key={i} className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-amber-400' : 'text-slate-700'}`} />
              ))}
              <span className="text-[10px] text-slate-500 font-bold ml-1">{item.rating}</span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Price</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-mono font-bold text-white">{item.price}</span>
                  <span className="text-xs font-bold text-emerald-400">EAC</span>
                </div>
              </div>
              <button className="p-3 bg-white/5 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all text-slate-400">
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-8 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Boost Your Visibility</h3>
              <p className="text-slate-400 text-sm max-w-md">Get your farm profile pinned to the top of the Worker Cloud and increase your Sustainability Score by 5% temporarily.</p>
            </div>
          </div>
          <button className="w-full md:w-auto px-8 py-4 agro-gradient rounded-2xl text-white font-black shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all">
            ACTIVATE BOOST
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
