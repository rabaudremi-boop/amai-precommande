import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Firebase web config is *public* — it's a client-side identifier, not a secret.
// Safe to commit. Security comes from Firestore security rules, not API key obscurity.
//
// To wire your project: replace the values below with the firebaseConfig object
// from console.firebase.google.com → Project settings → Your apps → SDK setup.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN ?? '',
  projectId: import.meta.env.VITE_FB_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FB_APP_ID ?? '',
};

/** True when at least the projectId is set — i.e. real backend mode. */
export const firebaseEnabled = Boolean(firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

if (firebaseEnabled) {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export { app };
