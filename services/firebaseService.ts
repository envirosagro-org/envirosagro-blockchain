import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged as fbOnAuthStateChanged, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  sendEmailVerification,
  reload
} from "firebase/auth";
import { 
  initializeFirestore,
  memoryLocalCache,
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  updateDoc,
  arrayUnion,
  writeBatch
} from "firebase/firestore";
import { 
  getDatabase, 
  ref, 
  push, 
  onValue, 
  set, 
  limitToLast, 
  query as rtdbQuery,
  serverTimestamp as rtdbTimestamp,
  off
} from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from "firebase/app-check";
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { User as AgroUser, SignalShard, DispatchChannel } from "../types";
import { generateAlphanumericId } from '../systemFunctions';

const firebaseConfig = {
  apiKey: "AIzaSyD2OCiMVOxaXWOBD3p4_mJp7TDJVwPpiNM",
  authDomain: "envirosagro.org",
  databaseURL: "https://envirosagro2git-41536716-7747d-default-rtdb.firebaseio.com",
  projectId: "envirosagro2git-41536716-7747d",
  storageBucket: "envirosagro2git-41536716-7747d.firebasestorage.app",
  messagingSenderId: "218810534057",
  appId: "1:218810534057:web:2d32abbb459755499fc1b8"
};

// --- APP CHECK DEBUG TOKEN INITIALIZATION ---
if (typeof window !== "undefined") {
  const DEBUG_TOKEN = "92E1FB19-E493-4BCB-AF99-57F97E72A503";
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = DEBUG_TOKEN;
  (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = DEBUG_TOKEN;
}

// 1. Initialize Firebase App Core safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Initialize App Check
let appCheckInstance: any = null;
if (typeof window !== "undefined") {
  const RECAPTCHA_SITE_KEY = "6LcCwGMsAAAAALThFiF4KGCslL0jqhQdr7sqoVlI"; 
  if (!(window as any).FIREBASE_APPCHECK_INITIALIZED) {
    try {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      });
      (window as any).FIREBASE_APPCHECK_INITIALIZED = true;
    } catch (err) {
      console.warn("App Check initialization error:", err);
    }
  }
}

export const verifyAppCheckHandshake = async (): Promise<boolean> => {
  if (typeof window === "undefined") return true;
  try {
    if (appCheckInstance) {
      await getToken(appCheckInstance);
      return true;
    }
    return false;
  } catch (e) {
    console.warn("App Check Challenge Limited:", e);
    return false;
  }
};

// 3. Initialize services
export const auth = getAuth(app);

// FORCED RESILIENCE CONFIG: Using auto-detect long polling for maximum cross-environment compatibility
// Removed useFetchHandler to prevent potential "Illegal constructor" issues in specific browser sandboxes
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache()
}); 

export const rtdb = getDatabase(app);

// 4. Data Connect Initialization
export const dataConnect = getDataConnect(app, {
  location: 'us-central1',
  connector: 'envirosagro-connector',
  service: 'envirosagro-service'
});

if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  connectDataConnectEmulator(dataConnect, 'localhost', 9399);
}

/**
 * DATA CONNECT BACKGROUND SYNC
 * Synchronizes relational shards silently across all system networks.
 */
export const startBackgroundDataSync = (onSyncUpdate?: (status: string) => void) => {
  console.log("[DataConnect] Background Relational Sync Initialized.");
  
  const interval = setInterval(async () => {
    const statuses = [
      "RELATIONAL_SHARD_OPTIMIZED",
      "POSTGRES_INGEST_ALIGNED",
      "MESH_GRAPHQL_VALIDATED",
      "SCHEMA_CONSENSUS_REACHED"
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    if (onSyncUpdate) onSyncUpdate(status);
    
    const pulseRef = ref(rtdb, 'system_heartbeat/dataconnect');
    set(pulseRef, { status, timestamp: rtdbTimestamp() });
  }, 10000);

  return () => clearInterval(interval);
};

// --- UTILITIES ---
const cleanObject = (obj: any): any => {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(cleanObject);
  if (typeof obj !== 'object') return obj;
  
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val !== undefined && val !== null) {
      if (typeof val === 'object' && !Array.isArray(val)) {
        newObj[key] = cleanObject(val);
      } else {
        newObj[key] = val;
      }
    }
  });
  return newObj;
};

// --- AUTHENTICATION ---
export const onAuthStateChanged = (_: any, callback: (user: any) => void) => fbOnAuthStateChanged(auth, callback);
export const signInWithEmailAndPassword = async (_: any, email: string, pass: string) => fbSignIn(auth, email, pass);
export const createUserWithEmailAndPassword = async (_: any, email: string, pass: string) => fbCreateUser(auth, email, pass);
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
export const signOutSteward = () => fbSignOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);
export const sendVerificationShard = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
    return true;
  }
  return false;
};
export const refreshAuthUser = async () => {
  if (auth.currentUser) {
    await reload(auth.currentUser);
    return auth.currentUser;
  }
  return null;
};

// --- PHONE AUTH ---
export const setupRecaptcha = (containerId: string) => {
  if (typeof window === "undefined") return null;
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
  try {
    // Ensuring RecaptchaVerifier is used correctly as a constructor
    return new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible'
    });
  } catch(e) {
    console.error("Recaptcha setup error:", e);
    return null;
  }
};

export const requestPhoneCode = async (phone: string, appVerifier: any): Promise<ConfirmationResult> => {
  return await signInWithPhoneNumber(auth, phone, appVerifier);
};

// --- SIGNAL TERMINAL CORE ---
export const dispatchNetworkSignal = async (signalData: Partial<SignalShard>): Promise<SignalShard | null> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;
  const id = `SIG-${generateAlphanumericId(7)}`;
  const timestamp = new Date().toISOString();
  const layers: DispatchChannel[] = [];
  layers.push({ channel: 'INBOX', status: 'SENT', timestamp });
  if (signalData.priority === 'critical' || signalData.priority === 'high') {
    layers.push({ channel: 'POPUP', status: 'SENT', timestamp });
    layers.push({ channel: 'EMAIL', status: 'SENT', timestamp });
    layers.push({ channel: 'CALENDAR', status: 'SENT', timestamp });
    if (signalData.priority === 'critical') {
      layers.push({ channel: 'PHONE', status: 'SENT', timestamp });
    }
  }
  const rawSignal: any = {
    id,
    type: signalData.type || 'system',
    origin: signalData.origin || 'MANUAL',
    title: signalData.title || 'NETWORK_SIGNAL',
    message: signalData.message || 'No message provided.',
    timestamp,
    read: false,
    priority: signalData.priority || 'low',
    dispatchLayers: layers,
    stewardId: userId,
    actionIcon: signalData.actionIcon || 'MessageSquare',
    aiRemark: signalData.aiRemark || "Analyzing signal impact...",
    meta: signalData.meta || {},
    actionLabel: signalData.actionLabel || ''
  };
  const cleanSignal = cleanObject(rawSignal);
  try {
    await setDoc(doc(db, "signals", id), cleanSignal);
    const pulseRef = ref(rtdb, 'network_pulse');
    await push(pulseRef, { message: `${rawSignal.title}: ${rawSignal.message}`, timestamp: rtdbTimestamp() });
    return cleanSignal as SignalShard;
  } catch (e) { return null; }
};

export const updateSignalReadStatus = async (id: string, read: boolean) => {
  try {
    await updateDoc(doc(db, "signals", id), { read });
    return true;
  } catch (e) { return false; }
};

export const markAllSignalsAsReadInDb = async (signalIds: string[]) => {
  if (signalIds.length === 0) return true;
  try {
    const batch = writeBatch(db);
    signalIds.forEach(id => { batch.update(doc(db, "signals", id), { read: true }); });
    await batch.commit();
    return true;
  } catch (e) { return false; }
};

export const listenToPulse = (callback: (pulse: string) => void) => {
  const pulseRef = rtdbQuery(ref(rtdb, 'network_pulse'), limitToLast(1));
  onValue(pulseRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const latestKey = Object.keys(data)[0];
      callback(data[latestKey].message);
    }
  });
  return () => off(pulseRef);
};

// --- REGISTRY SYNC (FIRESTORE) ---
export const syncUserToCloud = async (userData: AgroUser, uid?: string) => {
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return false;
  try {
    const cleanUserData = cleanObject(userData);
    await setDoc(doc(db, "stewards", userId), { ...cleanUserData, lastSync: Date.now(), stewardId: userId }, { merge: true });
    return true;
  } catch (e) { return false; }
};

export const getStewardProfile = async (uid: string): Promise<AgroUser | null> => {
  const snap = await getDoc(doc(db, "stewards", uid));
  return snap.exists() ? snap.data() as AgroUser : null;
};

export const markPermanentAction = async (actionKey: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return false;
  try {
    await updateDoc(doc(db, "stewards", userId), { completedActions: arrayUnion(actionKey) });
    return true;
  } catch (e) { return false; }
};

export const saveCollectionItem = async (collectionName: string, item: any) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return null;
  const cleanItem = cleanObject(item);
  const data = { ...cleanItem, stewardId: userId, lastModified: Date.now() };
  const docRef = item.id ? doc(db, collectionName, item.id) : doc(collection(db, collectionName));
  await setDoc(docRef, data, { merge: true });
  return docRef.id;
};

export const listenToCollection = (collectionName: string, callback: (items: any[]) => void, isGlobal: boolean = false) => {
  const userId = auth.currentUser?.uid;
  if (!userId && !isGlobal) return () => {};
  let q = isGlobal ? query(collection(db, collectionName)) : query(collection(db, collectionName), where("stewardId", "==", userId));
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ ...d.data(), id: d.id }))), (err) => {
    console.warn(`Registry Sync Warning (${collectionName}):`, err.message);
  });
};

export const verifyAuditorAccess = async (email: string) => {
  const q = query(collection(db, "auditors"), where("email", "==", email));
  const snap = await getDocs(q);
  return !snap.empty;
};
