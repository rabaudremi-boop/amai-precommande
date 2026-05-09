import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Firebase web config is *public* by design — apiKey is a client identifier,
// not a secret. Security comes from Firestore rules, not API key obscurity.
// Project: amai-precommande (https://console.firebase.google.com/project/amai-precommande)
const firebaseConfig = {
  apiKey: 'AIzaSyC6x1BrKkQXN1Ozxx4NjedozooOT3X8cUY',
  authDomain: 'amai-precommande.firebaseapp.com',
  projectId: 'amai-precommande',
  storageBucket: 'amai-precommande.firebasestorage.app',
  messagingSenderId: '718373446086',
  appId: '1:718373446086:web:2cdc9fdadc19a3aab752c7',
};

/** True when projectId is set — i.e. real backend mode. */
export const firebaseEnabled = Boolean(firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

if (firebaseEnabled) {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export { app };
