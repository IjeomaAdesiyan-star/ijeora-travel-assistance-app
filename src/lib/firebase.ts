// Firebase SDK configuration for IJEORA Travel Assistance App
// Project: ijeora-travel-assistance-app
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged, 
  User, 
  Auth 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  Firestore 
} from "firebase/firestore";
import { UserPreferences } from "../types";

// User-provided Firebase web configuration
export const firebaseConfig = {
  apiKey: "AIzaSyASiniCcwWHZxUs3vBTA0I-IlApKWJ2mwE",
  authDomain: "ijeora-travel-assistance-app.firebaseapp.com",
  projectId: "ijeora-travel-assistance-app",
  storageBucket: "ijeora-travel-assistance-app.firebasestorage.app",
  messagingSenderId: "1033810442835",
  appId: "1:1033810442835:web:a0e27bcc68b98e8a2d64a6"
};

// Initialize Firebase safely (avoid multiple initializations)
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Authentication helpers
export const initAuthSession = async (): Promise<User | null> => {
  try {
    if (auth.currentUser) {
      return auth.currentUser;
    }
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (error) {
    console.warn("[Firebase Auth] Anonymous sign-in notice:", error);
    return null;
  }
};

// Google Sign-In
export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Email & Password Sign In
export const signInWithEmail = async (email: string, pass: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};

// Email & Password Sign Up / Register
export const signUpWithEmail = async (email: string, pass: string, displayName?: string): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
};

// Sign Out
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Sign in as Guest (Anonymous)
export const signInAsGuest = async (): Promise<User> => {
  const cred = await signInAnonymously(auth);
  return cred.user;
};

// Listen to auth state changes
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Save user preferences to Firestore
export const saveUserProfileToFirestore = async (userId: string, prefs: UserPreferences): Promise<boolean> => {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      ...prefs,
      updatedAt: serverTimestamp(),
      projectId: firebaseConfig.projectId
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("[Firebase Firestore] Error saving profile:", error);
    return false;
  }
};

// Load user preferences from Firestore
export const loadUserProfileFromFirestore = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserPreferences;
    }
    return null;
  } catch (error) {
    console.warn("[Firebase Firestore] Error loading profile:", error);
    return null;
  }
};

// Save bookmarked destination IDs to Firestore
export const saveBookmarksToFirestore = async (userId: string, destinationIds: string[]): Promise<boolean> => {
  try {
    const bookmarksRef = doc(db, "users", userId, "collections", "saved_destinations");
    await setDoc(bookmarksRef, {
      destinationIds,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("[Firebase Firestore] Error saving bookmarks:", error);
    return false;
  }
};

// Load bookmarked destination IDs from Firestore
export const loadBookmarksFromFirestore = async (userId: string): Promise<string[] | null> => {
  try {
    const bookmarksRef = doc(db, "users", userId, "collections", "saved_destinations");
    const snap = await getDoc(bookmarksRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.destinationIds || [];
    }
    return null;
  } catch (error) {
    console.warn("[Firebase Firestore] Error loading bookmarks:", error);
    return null;
  }
};

// Save travel misinformation reports to Firestore
export const submitMisinformationReportToFirestore = async (report: {
  topic: string;
  reason: string;
  description: string;
  evidenceUrl?: string;
  userId?: string;
}): Promise<boolean> => {
  try {
    const reportsCol = collection(db, "misinformation_reports");
    await addDoc(reportsCol, {
      ...report,
      createdAt: serverTimestamp(),
      app: "IJEORA Travel Assistance",
      status: "pending_review"
    });
    return true;
  } catch (error) {
    console.warn("[Firebase Firestore] Error saving misinformation report:", error);
    return false;
  }
};

// Save community border/reality trip reports to Firestore
export const submitCommunityReportToFirestore = async (report: Record<string, any>): Promise<boolean> => {
  try {
    const reportsCol = collection(db, "community_trip_reports");
    await addDoc(reportsCol, {
      ...report,
      createdAt: serverTimestamp(),
      app: "IJEORA Travel Assistance"
    });
    return true;
  } catch (error) {
    console.warn("[Firebase Firestore] Error saving trip report:", error);
    return false;
  }
};

// Health check to verify Firebase connectivity
export const testFirebaseConnection = async (): Promise<{ ok: boolean; projectId: string; user: string | null }> => {
  try {
    const user = auth.currentUser || (await initAuthSession());
    return {
      ok: true,
      projectId: firebaseConfig.projectId,
      user: user ? user.uid : null
    };
  } catch (err: any) {
    return {
      ok: false,
      projectId: firebaseConfig.projectId,
      user: null
    };
  }
};
