import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart4, 
  Activity, 
  Zap, 
  Target, 
  RefreshCw, 
  Settings, 
  Leaf, 
  Bot, 
  Loader2, 
  Search, 
  Scale, 
  Binary, 
  LineChart,
  ChevronRight,
  ClipboardList,
  Gauge,
  Layers,
  History,
  AlertCircle,
  TrendingUp,
  Trello,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  MoreHorizontal,
  Recycle,
  Database,
  SearchCode,
  X,
  Fingerprint,
  Key,
  ShieldCheck,
  ShieldAlert,
  Coins,
  FileText,
  Upload,
  Workflow,
  Network,
  ArrowRightCircle,
  ArrowDownCircle,
  ArrowLeftCircle,
  ArrowRight,
  Stamp,
  Boxes,
  LayoutGrid,
  SmartphoneNfc,
  Info,
  PlusCircle,
  SearchCode as SearchCodeIcon,
  BadgeCheck,
  Fingerprint as FingerprintIcon,
  Cpu,
  Wrench,
  Construction,
  Package,
  HardHat,
  Monitor,
  Radar,
  ArrowUpRight,
  ShieldPlus,
  Factory,
  Terminal,
  BrainCircuit,
  BarChart3,
  Waves,
  FlaskConical,
  Atom,
  ChevronDown,
  PieChart as PieChartIcon,
  Maximize2,
  Send,
  Download,
  Radio,
  Paperclip,
  Link2,
  /* Added missing icon import */
  Box
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { chatWithAgroLang } from '../services/agroLangService';
import { saveCollectionItem } from '../services/firebaseService';
import { MediaShard, Task } from '../types';

interface ToolsSectionProps {
  user: any; 
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC?: (amount: number, reason: string) => void;
  onOpenEvidence: (task: any) => void;
  tasks: Task[];
  onSaveTask: (task: any) => void;
  notify: any;
  initialSection?: string | null;
}

const TASK_INGEST_FEE = 10;

const CONTROL_CHART_DATA = [
  { batch: 'B1', val: 62, error: 2 }, { batch: 'B2', val: 65, error: 1 }, { batch: 'B3', val: 61, error: 3 },
  { batch: 'B4', val: 78, error: 8 }, { batch: 'B5', val: 63, error: 2 }, { batch: 'B6', val: 60, error: 1 },
  { batch: 'B7', val: 58, error: 4 }, { batch: 'B8', val: 85, error: 9 }, { batch: 'B9', val: 64, error: 2 },
  { batch: 'B10', val: 61, error: 1 }, { batch: 'B11', val: 62, error: 1 }, { batch: 'B12', v: 63, error: 1 },
];

const KPI_DISTRIBUTION = [
  { name: 'Sequestration', value: 45, color: '#10b981' },
  { name: 'Yield Efficiency', value: 30, color: '#3b82f6' },
  { name: 'Social Resonance', value: 15, color: '#818cf8' },
  { name: 'Tech Uptime', value: 10, color: '#f59e0b' },
];

interface KanbanStage {
  id: string;
  label: string;
  color: string;
  bg: string;
  border: string;
}

const KANBAN_STAGES: KanbanStage[] = [
  { id: 'Inception', label: 'GENESIS INGEST', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
  { id: 'Processing', label: 'INDUSTRIAL FLOW', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'Quality_Audit', label: 'TQM VERIFICATION', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const SortableTaskCard = ({ task, onOpenEvidence }: { task: any, onOpenEvidence: (t: any) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/60 shadow-xl space-y-6 group hover:border-emerald-500/30 transition-all cursor-grab active:cursor-grabbing"
    >
       <div className="flex justify-between items-start">
          <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest">{task.thrust}</span>
          <div className={`p-2 rounded-lg bg-white/5 ${task.priority === 'High' ? 'text-rose-500' : 'text-emerald-400'}`}><AlertCircle size={14} /></div>
       </div>
       <h5 className="text-xl font-black text-white uppercase italic leading-tight">{task.title}</h5>
       
       {/* Enhanced Task Metadata */}
       <div className="flex flex-wrap gap-2 pt-2">
          {task.allocatedResources?.map((resId: string) => (
             <span key={resId} className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[7px] font-black uppercase rounded border border-indigo-500/20">
                <SmartphoneNfc size={8} /> {resId}
             </span>
          ))}
          {task.evidenceShards?.length > 0 && (
             <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[7px] font-black uppercase rounded border border-emerald-500/20">
                <Paperclip size={8} /> {task.evidenceShards.length} SHARDS
             </span>
          )}
          {task.assetId && (
             <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-blue-400 text-[7px] font-black uppercase rounded border border-blue-500/20">
                <Box size={8} /> {task.assetId}
             </span>
          )}
       </div>

       <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 overflow-hidden border border-white/10">
                <User size={12} />
             </div>
             <span className="text-[9px] text-slate-700 font-mono">NODE_{task.stewardEsin?.split('-')[1] || 'ROOT'}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenEvidence(task); }} 
            onPointerDown={(e) => e.stopPropagation()}
            className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg hover:bg-indigo-500 transition-all z-10 relative" 
            title="Attach Evidence Shard"
          >
            <Upload size={14}/>
          </button>
       </div>
    </div>
  );
};

const DroppableColumn = ({ stage, tasks, onOpenEvidence }: { stage: KanbanStage, tasks: any[], onOpenEvidence: (t: any) => void }) => {
  const { setNodeRef } = useSortable({
    id: stage.id,
    data: { type: 'Column', stage },
  });

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between px-6">
          <h4 className={`text-sm font-black uppercase tracking-widest ${stage.color}`}>{stage.label}</h4>
          <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-slate-500">{tasks.length}</span>
       </div>
       <div ref={setNodeRef} className="space-y-4 p-4 min-h-[500px] rounded-[48px] bg-black/20 border-2 border-dashed border-white/5">
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
             {tasks.map((task:any) => (
               <SortableTaskCard key={task.id} task={task} onOpenEvidence={onOpenEvidence} />
             ))}
          </SortableContext>
          {tasks.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 pointer-events-none">
                <PlusCircle size={48} className="text-slate-600 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Shard Buffer Clear</p>
             </div>
          )}
       </div>
    </div>
  );
};

const ToolsSection: React.FC<ToolsSectionProps> = ({ user, onSpendEAC, onEarnEAC, onOpenEvidence, tasks = [], onSaveTask, notify, initialSection }) => {
  const [activeTool, setActiveTool] = useState<'kanban' | 'resources' | 'sigma' | 'kpis'>('kanban');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [sigmaInput, setSigmaInput] = useState('');
  const [sigmaAdvice, setSigmaAdvice] = useState<string | null>(null);
  
  // Vector Routing Logic
  useEffect(() => {
    if (initialSection) {
      setActiveTool(initialSection as any);
    }
  }, [initialSection]);

  // Task Initialization States
  const [showInitTask, setShowInitTask] = useState(false);
  const [initStep, setInitStep] = useState<'form' | 'sign' | 'minting' | 'success'>('form');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskThrust, setTaskThrust] = useState('Environmental');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [esinSign, setEsinSign] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const [defects, setDefects] = useState(3);
  const [opportunities, setOpportunities] = useState(1000);

  const [activeDragTask, setActiveDragTask] = useState<any | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t: any) => t.id === active.id);
    if (task) setActiveDragTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      const activeTask = tasks.find((t: any) => t.id === activeId);
      const overTask = tasks.find((t: any) => t.id === overId);
      
      if (activeTask && overTask && activeTask.status !== overTask.status) {
        onSaveTask({ ...activeTask, status: overTask.status });
      }
    }

    if (isActiveTask && isOverColumn) {
      const activeTask = tasks.find((t: any) => t.id === activeId);
      if (activeTask && activeTask.status !== overId) {
        onSaveTask({ ...activeTask, status: overId as string });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (isActiveTask && isOverColumn) {
      const activeTask = tasks.find((t: any) => t.id === activeId);
      if (activeTask && activeTask.status !== overId) {
        onSaveTask({ ...activeTask, status: overId as string });
      }
    }
  };

  const sigmaLevel = useMemo(() => {
    const dpmo = (defects / opportunities) * 1000000;
    if (dpmo <= 3.4) return 6.0;
    if (dpmo <= 233) return 5.0;
    if (dpmo <= 6210) return 4.0;
    if (dpmo <= 66807) return 3.0;
    if (dpmo <= 308537) return 2.0;
    return 1.0;
  }, [defects, opportunities]);

  const handleRunSigmaOracle = async () => {
    if (!sigmaInput.trim()) return;
    const fee = 15;
    if (!await onSpendEAC(fee, 'SIGMA_OPTIMIZATION_AUDIT')) return;

    setIsOptimizing(true);
    setSigmaAdvice(null);
    try {
      const res = await chatWithAgroLang(`Sigma Six Optimization. Target: ${sigmaInput}. Current Sigma Level: ${sigmaLevel}. Defects: ${defects}, Ops: ${opportunities}. Provide industrial remediation shards.`, []);
      setSigmaAdvice(res.text);
    } catch (e) {
      setSigmaAdvice("Oracle link timeout.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleInitTask = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      notify('error', 'SIGNATURE_MISMATCH', "Node ESIN mismatch.");
      return;
    }

    if (await onSpendEAC(TASK_INGEST_FEE, `TASK_INITIALIZATION_${taskTitle}`)) {
      setIsMinting(true);
      setTimeout(() => {
        const newTask: Partial<Task> = {
          id: `TSK-${Math.floor(Math.random() * 9000 + 1000)}`,
          title: taskTitle,
          thrust: taskThrust,
          priority: taskPriority,
          status: 'Inception',
          timestamp: new Date().toISOString(),
          stewardEsin: user.esin
        };
        onSaveTask(newTask);
        setIsMinting(false);
        setInitStep('success');
        notify('success', 'TASK_ANCHORED', `Industrial task shard ${taskTitle} registered.`);
      }, 2000);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Wrench size={1000} className="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 md:p-16 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-16 group shadow-3xl">
           <div className="relative shrink-0">
              <div className="w-44 h-44 rounded-[56px] bg-emerald-600 shadow-[0_0_120px_rgba(16,185,129,0.4)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-700">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Wrench size={80} className="text-white animate-float" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[56px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic m-0 leading-none drop-shadow-2xl">Industrial <span className="text-emerald-400">Tools.</span></h2>
                 <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-4xl opacity-80 group-hover:opacity-100 transition-opacity">
                   "Leveraging Lean and Six Sigma methodologies to minimize defect entropy (S) and maximize stewardship output (Ca)."
                 </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-6">
                <button 
                  onClick={() => { setShowInitTask(true); setInitStep('form'); }}
                  className="px-14 py-7 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-2 border-white/10"
                >
                  <PlusCircle size={28} /> Initialize Process Shard
                </button>
              </div>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">SIGMA_LEVEL</p>
              <h4 className="text-8xl font-mono font-black text-white tracking-tighter drop-shadow-2xl italic">{sigmaLevel.toFixed(1)}</h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4">STABLE_FLOW_OK</p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Lean Efficiency</span>
                 <span className="text-emerald-400 font-mono">94.2%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]" style={{ width: '94%' }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'kanban', label: 'Kanban Matrix', icon: LayoutGrid },
          { id: 'resources', label: 'Asset Monitor', icon: Monitor },
          { id: 'sigma', label: 'Sigma Optimizer', icon: Target },
          { id: 'kpis', label: 'KPI Ledger', icon: BarChart4 },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTool(t.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTool === t.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px] relative z-10">
        {activeTool === 'kanban' && (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
               {KANBAN_STAGES.map(stage => (
                  <DroppableColumn 
                    key={stage.id} 
                    stage={stage} 
                    tasks={tasks.filter((t:any) => t.status === stage.id)} 
                    onOpenEvidence={onOpenEvidence} 
                  />
               ))}
            </div>
            <DragOverlay>
              {activeDragTask ? (
                <SortableTaskCard task={activeDragTask} onOpenEvidence={onOpenEvidence} />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* Other tools follow original logic... */}
        {activeTool === 'sigma' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-black/40 space-y-10 shadow-3xl">
                       <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                          <div className="p-4 bg-indigo-600 rounded-[28px] shadow-xl"><Target size={32} className="text-white" /></div>
                          <h3 className="text-2xl font-black text-white uppercase italic">Sigma <span className="text-indigo-400">Forge</span></h3>
                       </div>
                       <div className="space-y-6">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Optimization Target</label>
                             <textarea 
                                value={sigmaInput}
                                onChange={e => setSigmaInput(e.target.value)}
                                placeholder="Describe the industrial defect or bottleneck..."
                                className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-lg font-medium italic outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all h-40 resize-none shadow-inner placeholder:text-stone-900"
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Defects Count</label>
                                <input type="number" value={defects} onChange={e => setDefects(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-mono font-black" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Total Ops</label>
                                <input type="number" value={opportunities} onChange={e => setOpportunities(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-mono font-black" />
                             </div>
                          </div>
                          <button 
                            onClick={handleRunSigmaOracle}
                            disabled={isOptimizing || !sigmaInput.trim()}
                            className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                          >
                             {isOptimizing ? <Loader2 size={24} className="animate-spin" /> : <Bot size={24} />}
                             {isOptimizing ? 'SYNTHESIZING...' : 'INITIALIZE SIGMA AUDIT'}
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-8">
                    <div className="glass-card rounded-[64px] min-h-[500px] border border-white/10 bg-black/60 shadow-3xl overflow-hidden flex flex-col relative group">
                       <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none z-0 overflow-hidden">
                          <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent absolute top-0 animate-scan"></div>
                       </div>
                       <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-4">
                             <Terminal className="text-indigo-400 w-5 h-5" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sigma Optimization Terminal</span>
                          </div>
                       </div>
                       <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-10">
                          {!sigmaAdvice && !isOptimizing ? (
                             <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-10">
                                <Leaf size={140} className="text-slate-500" />
                                <p className="text-4xl font-black uppercase tracking-[0.6em] text-white italic">ORACLE_STANDBY</p>
                             </div>
                          ) : isOptimizing ? (
                             <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in">
                                <div className="relative">
                                   <div className="w-32 h-32 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
                                   <div className="absolute inset-0 flex items-center justify-center"><Leaf size={40} className="text-indigo-400 animate-pulse" /></div>
                                </div>
                                <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">SEQUENCING REMEDIATION...</p>
                             </div>
                          ) : (
                             <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-12">
                                <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-l-[16px] border-l-indigo-600 border-2 border-indigo-500/20 shadow-3xl">
                                   <div className="text-slate-300 text-2xl leading-[2.2] italic whitespace-pre-line font-medium border-l border-white/5 pl-10 relative z-10">
                                      {sigmaAdvice}
                                   </div>
                                </div>
                                <div className="flex justify-center gap-6">
                                   <button onClick={() => setSigmaAdvice(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                                   <button className="px-20 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-8 ring-white/5">
                                      <Stamp size={24} /> ANCHOR TO LEDGER
                                   </button>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
        
        {activeTool === 'resources' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-700">
              {[].map((asset: any) => (
                 <div key={asset.id} className="p-10 glass-card rounded-[64px] border-2 border-white/5 hover:border-white/20 transition-all flex flex-col justify-between h-[450px] shadow-3xl bg-black/40 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Database size={200} /></div>
                    <div className="flex justify-between items-start mb-10 relative z-10">
                       <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner group-hover:rotate-12 transition-all">
                          {asset.name.includes('Drone') ? <Bot className={asset.col} size={28} /> : asset.name.includes('Node') ? <Radio className={asset.col} size={28} /> : <Construction className={asset.col} size={28} />}
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest shadow-xl ${asset.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'}`}>{asset.status}</span>
                    </div>
                    <div className="space-y-3 relative z-10">
                       <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors">{asset.name}</h4>
                       <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest">{asset.type} // {asset.id}</p>
                    </div>
                    <div className="pt-10 border-t border-white/5 space-y-6 relative z-10 mt-auto">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-slate-600">Unit Health</span><span className="text-white font-mono">{asset.health}%</span></div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner"><div className={`h-full rounded-full transition-all duration-[2s] ${asset.health > 80 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'}`} style={{ width: `${asset.health}%` }}></div></div>
                       </div>
                       <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-md">Execute Diagnostic</button>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {activeTool === 'kpis' && (
           <div className="space-y-12 animate-in zoom-in duration-700 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-10 shadow-3xl group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Stamp size={800} className="text-emerald-400" /></div>
                    <div className="w-32 h-32 rounded-[44px] bg-emerald-600 flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.3)] border-4 border-white/10 mx-auto group-hover:rotate-12 transition-transform duration-700">
                       <Stamp size={64} className="text-white" />
                    </div>
                    <div className="space-y-6">
                       <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">KPI <span className="text-emerald-400">LEDGER</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic max-w-xl mx-auto leading-relaxed">"Quantifying the industrial resonance of node {user.esin} across the primary sustainability factors."</p>
                    </div>
                    <button className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[12px] ring-emerald-500/5 group/btn">
                       <LineChart className="w-8 h-8 group-hover/btn:scale-110 transition-transform" /> GENERATE AUDIT REPORT
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    {KPI_DISTRIBUTION.map((kpi, i) => (
                       <div key={i} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-white/20 transition-all flex flex-col justify-between group shadow-xl">
                          <div className="flex justify-between items-start mb-10">
                             <div className="p-5 rounded-3xl bg-white/5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform" style={{ color: kpi.color }}>
                                <BadgeCheck size={32} />
                             </div>
                             <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest">KPI_0x0{i+1}</p>
                          </div>
                          <div className="space-y-6">
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-emerald-400 transition-colors drop-shadow-2xl">{kpi.name}</h4>
                             <div className="space-y-4">
                                <div className="flex justify-between text-[11px] font-black uppercase text-slate-500 px-2"><span>Target Sync</span><span className="text-white font-mono">{kpi.value}%</span></div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner"><div className={`h-full rounded-full shadow-[0_0_10px_currentColor] transition-all duration-[2.5s]`} style={{ width: `${kpi.value}%`, backgroundColor: kpi.color }}></div></div>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* --- TASK INITIALIZATION MODAL --- */}
      {showInitTask && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowInitTask(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 border-b border-white/5 bg-emerald-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                       <PlusCircle size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Task <span className="text-emerald-400">Ingest</span></h3>
                       <p className="text-emerald-400/60 font-mono text-[10px] tracking-widest uppercase mt-3 italic">INDUSTRIAL_PROCESS_INIT</p>
                    </div>
                 </div>
                 <button onClick={() => setShowInitTask(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20 hover:rotate-90 active:scale-90"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 bg-black/40">
                 {initStep === 'form' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="space-y-6 text-center">
                          <h4 className="text-2xl font-black text-white uppercase italic">Shard Definition</h4>
                          <p className="text-slate-500 text-base font-medium leading-relaxed italic px-10">Configure the industrial metadata for this new process lifecycle.</p>
                       </div>
                       <div className="space-y-8">
                          <div className="space-y-3 px-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block text-left">Task Alias (Name)</label>
                             <input 
                                type="text" required value={taskTitle} onChange={e => setTaskTitle(e.target.value)}
                                placeholder="e.g. Substrate Repair Shard..." 
                                className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-stone-900 italic shadow-inner" 
                             />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                             <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Pillar Alignment</label>
                                <select value={taskThrust} onChange={e => setTaskThrust(e.target.value)} className="w-full bg-black border-2 border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/40">
                                   <option>Technological</option>
                                   <option>Environmental</option>
                                   <option>Societal</option>
                                   <option>Industry</option>
                                   <option>Human</option>
                                </select>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Node Priority</label>
                                <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)} className="w-full bg-black border-2 border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-rose-500/40">
                                   <option>Critical</option>
                                   <option>High</option>
                                   <option>Medium</option>
                                   <option>Standard</option>
                                </select>
                             </div>
                          </div>
                       </div>
                       <button onClick={() => setInitStep('sign')} disabled={!taskTitle.trim()} className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-white/10 ring-[12px] ring-indigo-500/5">PROCEED TO SIGNATURE <ArrowRight className="w-8 h-8" /></button>
                    </div>
                 )}

                 {initStep === 'sign' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex flex-col justify-center flex-1">
                       <div className="text-center space-y-8">
                          <div className="w-32 h-32 bg-emerald-600/10 border-2 border-emerald-500/20 rounded-[44px] flex items-center justify-center mx-auto text-emerald-400 shadow-3xl group relative overflow-hidden">
                             <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
                             <FingerprintIcon size={48} className="relative z-10 group-hover:scale-110 transition-transform" />
                       </div>
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter italic leading-none m-0">Node <span className="text-emerald-400">Signature</span></h4>
                       </div>

                       <div className="p-8 bg-black/60 border border-white/10 rounded-[44px] flex justify-between items-center shadow-inner group/fee hover:border-emerald-500/30 transition-all">
                          <div className="flex items-center gap-4">
                             <Coins size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                             <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Provisioning Fee</span>
                          </div>
                          <span className="text-2xl font-mono font-black text-white">{TASK_INGEST_FEE} <span className="text-sm text-emerald-500 italic">EAC</span></span>
                       </div>

                       <div className="space-y-4 max-w-xl mx-auto w-full">
                          <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center italic">Auth Signature (ESIN)</label>
                          <input 
                             type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                          />
                       </div>

                       <div className="flex gap-4">
                          <button onClick={() => setInitStep('form')} className="flex-1 py-10 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Back</button>
                          <button 
                            onClick={handleInitTask}
                            disabled={isMinting || !esinSign}
                            className="flex-[2] py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(16,185,129,0.3)] flex items-center justify-center gap-8 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                          >
                             {isMinting ? <Loader2 className="w-10 h-10 animate-spin" /> : <Stamp size={28} className="fill-current" />}
                             {isMinting ? "MINTING SHARD..." : "AUTHORIZE MINT"}
                          </button>
                       </div>
                    </div>
                 )}

                 {initStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 animate-in zoom-in duration-1000 text-center relative">
                       <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_200px_rgba(16,185,129,0.5)] scale-110 relative group">
                          <CheckCircle2 size={32} className="text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-6 text-center">
                          <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Task <span className="text-emerald-400">Anchored.</span></h3>
                          <p className="text-emerald-500 text-sm font-black uppercase tracking-[1em] font-mono">REGISTRY_HASH: 0x882_TASK_OK_SYNC</p>
                       </div>
                       <button onClick={() => setShowInitTask(false)} className="w-full max-w-md py-10 bg-white/5 border border-white/10 rounded-[56px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }

        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.9); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ToolsSection;