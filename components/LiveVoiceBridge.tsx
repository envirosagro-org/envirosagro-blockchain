import React, { useState, useRef } from 'react';
import { Mic, MicOff, Bot, X, Loader2, ShieldCheck, Activity } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';
import { encode, decode } from '../services/agroLangService';

interface LiveVoiceBridgeProps {
  isOpen: boolean;
  isGuest: boolean;
  onClose: () => void;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createAudioBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const LiveVoiceBridge: React.FC<LiveVoiceBridgeProps> = ({ isOpen, isGuest, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const stopAllAudio = () => {
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      
      // Safeguard against non-constructor or missing AudioContext
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (typeof AudioContextClass !== 'function') {
        console.error("AudioContext is not a valid constructor in this environment.");
        setIsConnecting(false);
        return;
      }
      
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            if (!inputAudioContextRef.current) return;
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createAudioBlob(inputData);
              sessionPromise.then((session) => { 
                session.sendRealtimeInput({ media: pcmBlob }); 
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
            setIsActive(true);
            setIsConnecting(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.addEventListener('ended', () => { sourcesRef.current.delete(source); });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) stopAllAudio();
          },
          onerror: () => { cleanup(); },
          onclose: () => { cleanup(); },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are the EnvirosAgro industrial voice oracle. Help stewards with real-time field telemetry and registry syncs via voice. Be technical.',
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Voice Bridge Sync Failed:", err);
      setIsConnecting(false);
      cleanup();
    }
  };

  const cleanup = () => {
    setIsActive(false);
    setIsConnecting(false);
    sessionRef.current?.close();
    sessionRef.current = null;
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
    }
    stopAllAudio();
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-10 z-[300] w-80 animate-in slide-in-from-bottom-10 duration-500">
      <div className="glass-card rounded-[32px] border-emerald-500/40 bg-[#050706] shadow-2xl overflow-hidden flex flex-col border-2">
        <div className="p-6 bg-emerald-600/10 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg"><Bot className="w-6 h-6" /></div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Voice Bridge</h4>
              <p className="text-[10px] text-emerald-400 font-bold uppercase">{isActive ? 'Live Link' : 'Standby'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8 min-h-[250px]">
          {isConnecting ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                 <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              </div>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Syncing Shards...</p>
            </div>
          ) : isActive ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-end gap-1.5 h-12">
                 {[...Array(12)].map((_, i) => (
                   <div key={i} className="w-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ height: `${20+Math.random()*80}%`, animationDelay: `${i*0.08}s` }}></div>
                 ))}
              </div>
              <p className="text-white text-xs font-bold italic text-center">"Speak observations to the registry."</p>
              <button onClick={cleanup} className="p-6 bg-rose-600 rounded-full text-white shadow-xl shadow-rose-900/40 hover:scale-110 active:scale-95 transition-all">
                <MicOff className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center mx-auto">
                 <Mic className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-slate-500 text-xs font-medium">Initialize a low-latency voice link to the oracle.</p>
              <button onClick={startSession} className="w-full py-4 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95">
                 Initialize Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveVoiceBridge;
