import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Settings, 
  X,
  Activity,
  Zap,
  ShieldCheck,
  Database,
  Info,
  Clock,
  Gauge,
  Monitor,
  Music,
  Video as VideoIcon,
  CirclePlay,
  FileText,
  Download
} from 'lucide-react';

interface MultimediaPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  title: string;
  author?: string;
  shardId?: string;
  thumbnail?: string;
  content?: string; // For documents
}

const MultimediaPlayer: React.FC<MultimediaPlayerProps> = ({ 
  isOpen, 
  onClose, 
  mediaUrl, 
  mediaType, 
  title, 
  author, 
  shardId,
  thumbnail,
  content
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mediaRef = mediaType === 'VIDEO' ? videoRef : audioRef;

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [isOpen, mediaUrl]);

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (mediaRef.current) {
      mediaRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (mediaType === 'VIDEO' && videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose}></div>
      
      <div 
        className="relative z-10 w-full max-w-6xl glass-card rounded-[40px] border-2 border-indigo-500/30 bg-black overflow-hidden shadow-[0_0_150px_rgba(99,102,241,0.2)] animate-in zoom-in duration-300 flex flex-col aspect-video md:aspect-auto md:h-[80vh]"
        onMouseMove={handleMouseMove}
      >
        {/* Header Section */}
        <div className={`absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-start transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl border border-white/10">
              {mediaType === 'VIDEO' ? <VideoIcon size={32} /> : <Music size={32} />}
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{title}</h3>
              <p className="text-indigo-400/60 text-[10px] font-mono tracking-[0.4em] uppercase mt-2 italic">
                {shardId ? `SHARD_ID: ${shardId}` : 'UNREGISTERED_MEDIA_STREAM'} // {author ? `AUTHOR: ${author.toUpperCase()}` : 'ANONYMOUS_STEWARD'}
              </p>
              <div className="flex items-center gap-2 mt-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                 <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest italic">Powered by AgroMusika Neural Core</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90">
            <X size={24} />
          </button>
        </div>

        {/* Media Content Area */}
        <div className="flex-1 relative flex items-center justify-center bg-[#050706]">
          {mediaType === 'VIDEO' ? (
            <video
              ref={videoRef}
              src={mediaUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              poster={thumbnail}
            />
          ) : mediaType === 'AUDIO' ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 space-y-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Activity size={800} className="text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-indigo-600/20 border-4 border-indigo-500/30 flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.3)] animate-pulse">
                  <Music size={120} className="text-indigo-400" />
                </div>
                {isPlaying && (
                  <div className="absolute -inset-4 border-2 border-dashed border-indigo-500/20 rounded-full animate-spin-slow"></div>
                )}
              </div>

              <div className="text-center space-y-4 relative z-10">
                <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Acoustic Resonance</h4>
                <div className="flex items-center justify-center gap-4 text-emerald-400 font-mono text-xs uppercase tracking-widest">
                  <Activity size={16} className="animate-pulse" />
                  <span>M-Constant: 1.42x // Frequency: 432Hz // Powered by AgroMusika</span>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={mediaUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
            </div>
          ) : (
            <div className="w-full h-full p-20 overflow-y-auto custom-scrollbar bg-[#050706] font-mono text-sm text-slate-400 leading-loose italic">
               <div className="max-w-4xl mx-auto space-y-10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-8">
                     <div className="flex items-center gap-6">
                        <FileText size={40} className="text-indigo-400" />
                        <div>
                           <h4 className="text-2xl font-black text-white uppercase italic">Document_Shard_Ingest</h4>
                           <p className="text-[10px] text-slate-600 uppercase tracking-widest">Registry_Object_v6.5</p>
                        </div>
                     </div>
                     <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                        <ShieldCheck size={24} className="text-indigo-400" />
                     </div>
                  </div>
                  <div className="p-10 bg-white/[0.02] border border-white/10 rounded-[40px] shadow-inner text-slate-300">
                     {content || 'NO_CONTENT_SHARD_DETECTED'}
                  </div>
                  <div className="flex justify-center pt-10">
                     <button className="px-12 py-5 bg-indigo-600 rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl flex items-center gap-4">
                        <Download size={18} /> DOWNLOAD_DOCUMENT_SHARD
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* Large Play Overlay */}
          {!isPlaying && (
            <button 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 group transition-all"
            >
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_50px_rgba(99,102,241,0.5)] group-hover:scale-110 transition-transform border-4 border-white/10">
                <Play size={48} fill="white" />
              </div>
            </button>
          )}
        </div>

        {/* Controls Section */}
        <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 space-y-6 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="relative group h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_15px_#6366f1] transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
              <div className="absolute top-0 left-0 h-full w-full bg-white/5"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button onClick={() => { if(mediaRef.current) mediaRef.current.currentTime -= 10; }} className="text-slate-400 hover:text-white transition-all">
                <SkipBack size={24} />
              </button>
              <button 
                onClick={togglePlay}
                className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
              </button>
              <button onClick={() => { if(mediaRef.current) mediaRef.current.currentTime += 10; }} className="text-slate-400 hover:text-white transition-all">
                <SkipForward size={24} />
              </button>

              <div className="flex items-center gap-4 ml-4 group">
                <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-all">
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="w-24 h-1 bg-white/10 rounded-full relative overflow-hidden">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="absolute top-0 left-0 h-full bg-white transition-all"
                    style={{ width: `${volume * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <Gauge size={14} className="text-emerald-400" />
                <span className="text-[10px] font-mono text-slate-400 uppercase">Buffer: 92% // Stable</span>
              </div>
              <button className="text-slate-400 hover:text-white transition-all">
                <Settings size={20} />
              </button>
              {mediaType === 'VIDEO' && (
                <button onClick={toggleFullscreen} className="text-slate-400 hover:text-white transition-all">
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MultimediaPlayer;
