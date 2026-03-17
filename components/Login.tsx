
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { 
  Leaf, 
  ShieldCheck, 
  Key, 
  Loader2, 
  Gift, 
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Mail,
  HelpCircle,
  Hash,
  Send, 
  Zap,
  Lock,
  RefreshCw,
  Signal,
  CheckCircle2,
  X,
  Smartphone,
  MessageSquareCode,
  Globe,
  Fingerprint,
  ArrowLeft,
  Phone,
  RotateCcw,
  UserPlus,
  UserCheck,
  Chrome,
  Binary,
  Database,
  BadgeCheck,
  ZapOff,
  /* Added Stamp import to fix error on line 436 */
  Stamp
} from 'lucide-react';
import { useAppStore } from '../store';
import { 
  syncUserToCloud,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  resetPassword,
  auth,
  getStewardProfile,
  signInWithGoogle,
  setupRecaptcha,
  requestPhoneCode,
  sendVerificationShard,
  refreshAuthUser
} from '../services/firebaseService';
import { generateAlphanumericId } from '../systemFunctions';

interface LoginProps {
  onLogin: (user: User) => void;
  isEmbed?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isEmbed = false }) => {
  const { 
    registrationState, 
    setRegistrationState, 
    updateRegistrationData, 
    nextRegistrationStep, 
    prevRegistrationStep 
  } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(!!registrationState);
  const [mode, setMode] = useState<'register' | 'login' | 'forgot' | 'verify_shard' | 'phone' | 'verify_phone' | 'waiting_verification'>(
    registrationState ? 'register' : 'login'
  );
  
  const [name, setEditName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [mainCrop, setMainCrop] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);

  const isSuccessRef = useRef(false);
  const dataRef = useRef({ name, email, password, farmName, farmSize, mainCrop, location });

  // Update ref whenever state changes
  useEffect(() => {
    dataRef.current = { name, email, password, farmName, farmSize, mainCrop, location };
  }, [name, email, password, farmName, farmSize, mainCrop, location]);

  const handleRegisterClick = () => {
    isSuccessRef.current = false;
    if (registrationState) {
      setShowResumePrompt(true);
    } else {
      setMode('register');
    }
  };

  // Sync local state with registrationState when mode becomes 'register'
  useEffect(() => {
    if (mode === 'register' && registrationState?.data) {
      if (registrationState.data.name) setEditName(registrationState.data.name);
      if (registrationState.data.email) setEmail(registrationState.data.email);
      if (registrationState.data.password) setPassword(registrationState.data.password);
      if (registrationState.data.farmName) setFarmName(registrationState.data.farmName);
      if (registrationState.data.farmSize) setFarmSize(registrationState.data.farmSize);
      if (registrationState.data.mainCrop) setMainCrop(registrationState.data.mainCrop);
      if (registrationState.data.location) setLocation(registrationState.data.location);
    } else if (mode === 'register' && !registrationState) {
      setRegistrationState({ step: 1, data: {} });
    }
  }, [mode]); // Only run when mode changes to avoid overwriting user input

  // Save progress on unmount if in register mode
  useEffect(() => {
    return () => {
      if (mode === 'register' && !isSuccessRef.current) {
        updateRegistrationData(dataRef.current);
      }
    };
  }, [mode, updateRegistrationData]);

  // Generate a random ESIN for registration visual feedback
  const [esin, setEsin] = useState('');
  const [isGeneratingEsin, setIsGeneratingEsin] = useState(false);

  useEffect(() => {
    if (mode === 'register') {
      generateEsin();
    }
  }, [mode]);

  const generateEsin = () => {
    setIsGeneratingEsin(true);
    setTimeout(() => {
      setEsin(`EA-${generateAlphanumericId(4)}-${generateAlphanumericId(4)}`);
      setIsGeneratingEsin(false);
    }, 1500);
  };

  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const recaptchaVerifierRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          console.warn("Recaptcha cleanup failed:", e);
        }
      }
    };
  }, []);

  const getOrInitRecaptcha = () => {
    if (recaptchaVerifierRef.current) return recaptchaVerifierRef.current;
    const verifier = setupRecaptcha('recaptcha-container');
    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const createStewardProfile = async (uid: string, userEmail: string, userName: string, phone?: string) => {
    const newUser: User = {
      name: userName || 'Anonymous Steward',
      email: userEmail.toLowerCase() || `${phone}@phone.auth`,
      esin: esin,
      mnemonic: "seed plant grow harvest sun rain soil root leaf flower fruit seed",
      regDate: new Date().toLocaleDateString(),
      role: 'REGENERATIVE FARMER',
      location: location || `Global Node`,
      wallet: { 
        balance: 100, eatBalance: 0, exchangeRate: 600, bonusBalance: 100, 
        tier: 'Seed', lifetimeEarned: 100, linkedProviders: [], miningStreak: 1,
        lastSyncDate: new Date().toISOString().split('T')[0], pendingSocialHarvest: 0, stakedEat: 0
      },
      metrics: { agriculturalCodeU: 1.2, timeConstantTau: 8.5, sustainabilityScore: 72, socialImmunity: 60, viralLoadSID: 35, baselineM: 8.5 },
      skills: { 'General': 10 },
      isReadyForHire: false,
      settings: { notificationsEnabled: true, privacyMode: 'Public', autoSync: true, biometricLogin: false, theme: 'Dark' }
    };

    const syncSuccess = await syncUserToCloud(newUser, uid);
    return { success: syncSuccess, profile: newUser };
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await signInWithGoogle();
      const profile = await getStewardProfile(result.user.uid);
      
      if (profile) {
        onLogin(profile);
      } else {
        const { profile: newProfile } = await createStewardProfile(
          result.user.uid, 
          result.user.email || '', 
          result.user.displayName || ''
        );
        onLogin(newProfile);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `GOOGLE_SYNC_ERROR: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setMessage(null);
    try {
      const appVerifier = getOrInitRecaptcha();
      if (!appVerifier) throw new Error("Security handshake failed to initialize.");
      
      const result = await requestPhoneCode(phoneNumber, appVerifier);
      setConfirmationResult(result);
      setMode('verify_phone');
      setMessage({ type: 'info', text: "SMS_TRANSMITTED: 6-digit access shard sent to your device." });
    } catch (error: any) {
      setMessage({ type: 'error', text: `PHONE_AUTH_ERROR: ${error.message}` });
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage(null);
    try {
      getOrInitRecaptcha();
      await resetPassword(email);
      setMessage({ type: 'success', text: "RECOVERY_SIGNAL: Reset shard dispatched. Check your email to recalibrate signature." });
    } catch (error: any) {
      setMessage({ type: 'error', text: `RECOVERY_ERROR: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email || (mode === 'login' && !password)) return;

    if (mode === 'register') {
      if (registrationState?.step === 1) {
        updateRegistrationData({ name, email, password });
        nextRegistrationStep();
        return;
      } else if (registrationState?.step === 2) {
        // Proceed to finalize registration
        setLoading(true);
        try {
          getOrInitRecaptcha();
          const userCredential = await createUserWithEmailAndPassword(null, email, password);
          await createStewardProfile(userCredential.user.uid, email, name);
          await sendVerificationShard();
          isSuccessRef.current = true;
          setRegistrationState(null); // Clear state upon successful registration
          setMode('waiting_verification');
        } catch (error: any) {
          setMessage({ type: 'error', text: `REGISTRY_ERROR: ${error.message}` });
        } finally {
          setLoading(false);
        }
        return;
      }
    }

    setLoading(true);
    try {
      getOrInitRecaptcha();
      if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(null, email, password);
        if (!userCredential.user.emailVerified) {
          setMode('waiting_verification');
          return;
        }
        const profile = await getStewardProfile(userCredential.user.uid);
        if (profile) onLogin(profile);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `REGISTRY_ERROR: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length !== 6 || !confirmationResult) return;
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(code);
      const profile = await getStewardProfile(result.user.uid);
      if (profile) {
        onLogin(profile);
      } else {
        const { profile: newProfile } = await createStewardProfile(
          result.user.uid, 
          '', 
          'Steward ' + phoneNumber.slice(-4), 
          phoneNumber
        );
        onLogin(newProfile);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `OTP_VERIFICATION_FAILED: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isEmbed ? 'w-full' : 'min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#020403]'}>
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.15)_0%,_transparent_70%)]"></div>
        <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className={`glass-card p-10 md:p-16 rounded-[64px] border-emerald-500/20 bg-black/60 shadow-[0_40px_150px_rgba(0,0,0,0.9)] w-full text-center space-y-10 relative z-10 ${isEmbed ? '' : 'max-w-2xl animate-in fade-in zoom-in duration-500'}`}>
         
         <div id="recaptcha-container" className="flex justify-center mb-4 min-h-[1px]"></div>

         <div className="flex flex-col items-center gap-6">
            <div className="relative group">
               <div className="w-20 h-20 md:w-28 md:h-28 agro-gradient rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  {mode === 'forgot' ? (
                    <Key className="w-10 h-10 md:w-14 md:h-14 text-white relative z-10 animate-float" />
                  ) : (
                    <Fingerprint className="w-10 h-10 md:w-14 md:h-14 text-white relative z-10 group-hover:scale-110 transition-transform" />
                  )}
               </div>
               <div className="absolute -inset-4 border-2 border-dashed border-emerald-500/20 rounded-[44px] animate-spin-slow pointer-events-none"></div>
            </div>
            <div className="space-y-2">
               <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">
                  {mode === 'register' ? 'Node Ingest' : mode === 'forgot' ? 'Protocol Recovery' : mode.includes('phone') ? 'Mobile Link' : 'Steward Connect'}
               </h1>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">HANDSHAKE_PROTOCOL_v6.5</p>
            </div>
         </div>

         {message && (
           <div className={`p-8 rounded-[40px] border text-xs font-black uppercase tracking-widest animate-in zoom-in flex items-center gap-4 text-left shadow-2xl ${
             message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
             message.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
             'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
           }`}>
             {message.type === 'error' ? <ShieldAlert className="shrink-0" /> : <Zap className="shrink-0 fill-current" />}
             <span className="leading-relaxed">{message.text}</span>
           </div>
         )}

         <div className="flex justify-center p-2 glass-card rounded-[32px] bg-black/80 border border-white/10 w-fit mx-auto overflow-hidden gap-2">
            <button onClick={() => setMode('login')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all ${mode === 'login' || mode === 'forgot' ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-600 hover:text-white'}`}>REGISTRY_AUTH</button>
            <button onClick={() => setMode('phone')} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all ${mode === 'phone' || mode === 'verify_phone' ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'text-slate-600 hover:text-white'}`}>2FACTOR_VERIFICATION</button>
            <button onClick={handleRegisterClick} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all ${mode === 'register' ? 'bg-emerald-600 text-white shadow-2xl scale-105' : 'text-slate-600 hover:text-white'}`}>MINT_NODE</button>
         </div>

         {mode !== 'forgot' && mode !== 'verify_phone' && mode !== 'waiting_verification' && (
           <div className="space-y-6">
              <button 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className="w-full py-6 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-[32px] flex items-center justify-center gap-4 shadow-3xl hover:bg-slate-100 transition-all active:scale-95 group/google"
              >
                 {loading ? <Loader2 className="animate-spin" /> : <Chrome size={20} className="group-hover/google:rotate-12 transition-transform" />}
                 {loading ? 'SEQUENCING...' : 'SYNC GLOBAL SHARD'}
              </button>
              <div className="flex items-center gap-6 py-2 opacity-30">
                 <div className="h-px bg-white/20 flex-1"></div>
                 <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">OR DIRECT_PROTOCOL</span>
                 <div className="h-px bg-white/20 flex-1"></div>
              </div>
           </div>
         )}

         {mode === 'login' && (
           <form onSubmit={handleAuth} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-3 text-left">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Node Identifier (Email)</label>
                <div className="relative">
                   <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800" />
                   <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="steward@envirosagro.org" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 pl-14 pr-8 text-lg text-white outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all italic" />
                </div>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center px-6">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Secret Signature (Pass)</label>
                  <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-black text-indigo-400 hover:text-white transition-colors uppercase tracking-widest">Recalibrate?</button>
                </div>
                <div className="relative">
                   <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-800" />
                   <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 pl-14 pr-8 text-lg text-white outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5 group/submit">
                 {loading ? <Loader2 className="animate-spin mx-auto w-8 h-8" /> : (
                    <div className="flex items-center justify-center gap-6">
                       <ShieldCheck size={32} className="group-hover/submit:scale-110 transition-transform" />
                       ESTABLISH HANDSHAKE
                    </div>
                 )}
              </button>
           </form>
         )}

         {mode === 'forgot' && (
            <form onSubmit={handleResetPassword} className="space-y-10 animate-in slide-in-from-right-4">
               <div className="text-left space-y-3">
                 <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Target Email Node</label>
                 <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="steward@envirosagro.org" className="w-full bg-black/80 border-2 border-white/5 rounded-[40px] py-8 px-10 text-xl text-white outline-none focus:border-indigo-500 transition-all font-medium italic" />
               </div>
               <button type="submit" disabled={loading} className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-3xl border-2 border-white/10 ring-8 ring-indigo-500/5 active:scale-95 transition-all">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'DISPATCH RECOVERY SHARD'}
               </button>
               <button type="button" onClick={() => setMode('login')} className="flex items-center justify-center gap-3 mx-auto text-[11px] font-black text-slate-700 hover:text-white transition-colors uppercase tracking-widest">
                  <ArrowLeft size={16} /> Back to Handshake
               </button>
            </form>
         )}

         {mode === 'phone' && (
            <form onSubmit={handlePhoneRequest} className="space-y-8 animate-in slide-in-from-right-4">
               <div className="text-left space-y-3">
                 <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Phone Relay Number (intl)</label>
                 <div className="relative">
                    <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-700" />
                    <input type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+2547XXXXXXXX" className="w-full bg-black/80 border-2 border-white/5 rounded-[40px] py-8 pl-16 pr-8 text-3xl font-mono font-black text-white outline-none tracking-widest" />
                 </div>
               </div>
               <button type="submit" disabled={loading} className="w-full py-10 bg-blue-600 rounded-[56px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-3xl border-4 border-white/10 ring-[16px] ring-blue-500/5 hover:bg-blue-500 active:scale-95 transition-all">
                  {loading ? <Loader2 className="animate-spin mx-auto w-10 h-10" /> : 'REQUEST ACCESS SHARD'}
               </button>
            </form>
         )}

         {mode === 'verify_phone' && (
            <form onSubmit={handleVerifyOtp} className="space-y-12 animate-in zoom-in">
               <div className="flex justify-center gap-3 md:gap-5">
                  {otpCode.map((digit, i) => (
                    <input 
                      key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit}
                      onChange={(e) => {
                        const newCode = [...otpCode];
                        newCode[i] = e.target.value;
                        setOtpCode(newCode);
                        if (e.target.value && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
                      }}
                      className="w-14 h-20 md:w-16 md:h-24 bg-white/5 border-2 border-white/10 rounded-2xl text-center text-4xl font-mono font-black text-white outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/10 transition-all shadow-inner"
                    />
                  ))}
               </div>
               <button type="submit" disabled={loading} className="w-full py-10 bg-emerald-600 rounded-[56px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-3xl border-4 border-white/10 ring-[20px] ring-emerald-500/5 active:scale-95 transition-all">
                  {loading ? <Loader2 className="animate-spin mx-auto w-10 h-10" /> : 'VALIDATE SIGNATURE'}
               </button>
               <button type="button" onClick={() => setMode('phone')} className="text-[11px] font-black text-slate-700 hover:text-white uppercase tracking-widest flex items-center justify-center gap-3 mx-auto">
                  <RotateCcw size={16} /> Re-Sync Relay
               </button>
            </form>
         )}

         {mode === 'register' && (
            <form onSubmit={handleAuth} className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
               {registrationState?.step === 1 && (
                 <>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="text-left space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Steward Alias</label>
                        <input type="text" required value={name} onChange={e => setEditName(e.target.value)} placeholder="Steward Alias" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-xl font-bold text-white outline-none focus:border-emerald-500 transition-all italic placeholder:text-stone-900 shadow-inner" />
                      </div>
                      <div className="text-left space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Node Email</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="steward@envirosagro.org" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-xl font-bold text-white outline-none focus:border-emerald-500 transition-all italic placeholder:text-stone-900 shadow-inner" />
                      </div>
                   </div>
                   <div className="text-left space-y-3">
                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Secret Signature</label>
                     <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-xl font-bold text-white outline-none focus:border-emerald-500 transition-all shadow-inner" />
                   </div>
                   <button type="submit" className="w-full py-10 bg-emerald-600 rounded-[56px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_120px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-white/5 flex items-center justify-center gap-6">
                      CONTINUE TO METADATA <ArrowRight size={24} />
                   </button>
                 </>
               )}

               {registrationState?.step === 2 && (
                 <>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="text-left space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Farm Name</label>
                        <input type="text" value={farmName} onChange={e => setFarmName(e.target.value)} placeholder="Farm Name" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-xl font-bold text-white outline-none focus:border-emerald-500 transition-all italic placeholder:text-stone-900 shadow-inner" />
                      </div>
                      <div className="text-left space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-6">Location</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Global Node" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-xl font-bold text-white outline-none focus:border-emerald-500 transition-all italic placeholder:text-stone-900 shadow-inner" />
                      </div>
                   </div>

                   <div className="p-10 bg-emerald-950/10 rounded-[48px] border border-emerald-500/20 space-y-6 shadow-inner relative overflow-hidden group/esin">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/esin:scale-110 transition-transform"><Binary size={200} className="text-emerald-400" /></div>
                      <div className="flex justify-between items-center px-4 relative z-10">
                         <p className="text-[11px] font-black text-emerald-500/60 uppercase tracking-[0.4em]">SYSTEM_GENERATED_ESIN</p>
                         <RefreshCw onClick={generateEsin} size={16} className={`text-emerald-500 cursor-pointer hover:rotate-180 transition-transform ${isGeneratingEsin ? 'animate-spin' : ''}`} />
                      </div>
                      {isGeneratingEsin ? (
                        <div className="h-16 flex items-center justify-center"><Loader2 size={32} className="text-emerald-500 animate-spin" /></div>
                      ) : (
                        <p className="text-4xl md:text-5xl font-mono font-black text-white tracking-[0.3em] uppercase drop-shadow-[0_0_20px_#10b981] animate-in zoom-in duration-500">{esin}</p>
                      )}
                      <p className="text-[9px] text-slate-700 italic font-medium uppercase tracking-widest relative z-10">"Immutable Social Identification Shard for Node Ingest"</p>
                   </div>

                   <div className="flex gap-4">
                     <button type="button" onClick={prevRegistrationStep} className="py-10 px-8 bg-white/5 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] hover:bg-white/10 active:scale-95 transition-all border border-white/10 flex items-center justify-center">
                        <ArrowLeft size={24} />
                     </button>
                     <button type="submit" disabled={loading || isGeneratingEsin} className="flex-1 py-10 agro-gradient rounded-[56px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_120px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-white/5 flex items-center justify-center gap-6">
                        {loading ? <Loader2 className="animate-spin w-10 h-10" /> : <Stamp size={40} className="fill-current" />}
                        {loading ? 'INITIALIZING SHARDS...' : 'ANCHOR NEW NODE'}
                     </button>
                   </div>
                 </>
               )}
            </form>
         )}

         {mode === 'waiting_verification' && (
            <div className="space-y-12 animate-in zoom-in duration-700 flex flex-col items-center">
               <div className="w-32 h-32 md:w-44 md:h-44 bg-indigo-600/10 border-4 border-indigo-500/20 rounded-[48px] flex items-center justify-center text-indigo-400 shadow-3xl animate-pulse relative overflow-hidden group">
                  <Mail size={56} className="relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-indigo-500/5 animate-scan"></div>
               </div>
               <div className="space-y-6 text-center">
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Handshake <span className="text-indigo-400">Pending.</span></h3>
                  <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-lg mx-auto">
                    "A secure identity verification shard has been dispatched to your inbox. Anchor your node to finalize ingest."
                  </p>
               </div>
               <button onClick={() => window.location.reload()} className="w-full max-w-sm py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-105 transition-all border-2 border-white/10 ring-8 ring-indigo-500/5">
                  <RefreshCw size={24} className="mx-auto mb-2" />
                  CHECK SYNC STATUS
               </button>
            </div>
         )}
      </div>

      {showResumePrompt && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-black border border-emerald-500/30 rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Confirm Form Resubmission</h3>
            <p className="text-slate-400 mb-8 text-sm">You have an incomplete registration process. Would you like to resume where you left off or start a new registration?</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => { isSuccessRef.current = false; setShowResumePrompt(false); setMode('register'); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Resume Registration
              </button>
              <button onClick={() => { isSuccessRef.current = false; setRegistrationState(null); setShowResumePrompt(false); setMode('register'); }} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Login;
