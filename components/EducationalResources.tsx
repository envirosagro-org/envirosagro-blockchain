import React, { useState } from 'react';
import { BookOpen, Video, FileText, ChevronRight, PlayCircle, ExternalLink, GraduationCap, Link as LinkIcon } from 'lucide-react';
import { ViewState } from '../types';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide';
  category: 'sustainable_ag' | 'blockchain' | 'platform_usage';
  url?: string;
  duration?: string;
  readTime?: string;
}

const RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Introduction to Regenerative Agriculture',
    description: 'Learn the core principles of regenerative agriculture and how it restores soil health.',
    type: 'article',
    category: 'sustainable_ag',
    readTime: '5 min read'
  },
  {
    id: 'res-2',
    title: 'Blockchain in Agriculture: A Primer',
    description: 'Understand how blockchain technology ensures transparency and traceability in the supply chain.',
    type: 'video',
    category: 'blockchain',
    duration: '12:30'
  },
  {
    id: 'res-3',
    title: 'Getting Started with EnvirosAgro',
    description: 'A comprehensive guide to navigating the platform, setting up your profile, and connecting your first node.',
    type: 'guide',
    category: 'platform_usage',
    readTime: '10 min read'
  },
  {
    id: 'res-4',
    title: 'Water Conservation Techniques',
    description: 'Advanced methods for optimizing water usage in arid environments.',
    type: 'article',
    category: 'sustainable_ag',
    readTime: '8 min read'
  },
  {
    id: 'res-5',
    title: 'Understanding Smart Contracts',
    description: 'How smart contracts automate agreements and payments on the EnvirosAgro network.',
    type: 'article',
    category: 'blockchain',
    readTime: '6 min read'
  },
  {
    id: 'res-6',
    title: 'Minting Your First Carbon Credit',
    description: 'Step-by-step video tutorial on the MRV process and minting carbon credits.',
    type: 'video',
    category: 'platform_usage',
    duration: '15:45'
  }
];

interface EducationalResourcesProps {
  onNavigate: (view: ViewState, section?: string | null, pushToHistory?: boolean, params?: any) => void;
}

const EducationalResources: React.FC<EducationalResourcesProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'sustainable_ag' | 'blockchain' | 'platform_usage'>('all');

  const filteredResources = activeCategory === 'all' 
    ? RESOURCES 
    : RESOURCES.filter(r => r.category === activeCategory);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'video': return <Video size={20} className="text-indigo-400" />;
      case 'guide': return <BookOpen size={20} className="text-emerald-400" />;
      default: return <FileText size={20} className="text-blue-400" />;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <GraduationCap size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Educational <span className="text-emerald-400">Resources</span></h2>
          </div>
          <p className="text-sm text-slate-400 font-medium max-w-2xl">
            Master the tools, technologies, and practices driving the regenerative agriculture revolution.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('multimedia_generator', null, true, {
            prompt: "Generate a new educational resource shard for the EnvirosAgro ecosystem. Focus on a novel sustainable farming technique or blockchain application.",
            type: 'document'
          })}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 flex items-center gap-3"
        >
          <PlayCircle size={18} /> AUTO-GENERATE NEW RESOURCE
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          { id: 'all', label: 'All Resources' },
          { id: 'sustainable_ag', label: 'Sustainable Agriculture' },
          { id: 'blockchain', label: 'Blockchain Tech' },
          { id: 'platform_usage', label: 'Platform Guides' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              activeCategory === cat.id 
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div key={resource.id} className="glass-card p-6 rounded-3xl border border-white/10 hover:border-emerald-500/30 transition-all group flex flex-col h-full bg-black/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
              {getIconForType(resource.type)}
            </div>
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                {getIconForType(resource.type)}
              </div>
              <span className="px-3 py-1 bg-white/5 text-slate-400 text-[9px] font-black uppercase rounded-full border border-white/10 tracking-widest">
                {resource.type}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 relative z-10">
              <h3 className="text-xl font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">
                {resource.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {resource.description}
              </p>
            </div>
            
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-xs font-mono text-slate-500">
                {resource.type === 'video' ? resource.duration : resource.readTime}
              </span>
              <button 
                onClick={() => onNavigate('multimedia_generator', null, true, { 
                  prompt: `Generate educational media for: ${resource.title}. Description: ${resource.description}`, 
                  type: resource.type === 'video' ? 'video' : 'document' 
                })} 
                className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
              >
                 {resource.type === 'video' ? 'Watch Now' : 'Read More'}
                 <ChevronRight size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationalResources;
