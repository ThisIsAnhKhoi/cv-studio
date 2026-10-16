import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBwr50G7urO-ZU_kFs16UH3kdqcv6ijGrs',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cv-project-7d38e.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cv-project-7d38e',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cv-project-7d38e.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '516814610748',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:516814610748:web:8b4325d5372c7cde43fe39',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-073GJB8PMK',
};

// Singleton pattern prevents re-initializing Firebase during Fast Refresh / HMR
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
