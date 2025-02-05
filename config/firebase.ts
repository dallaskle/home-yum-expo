import { initializeApp } from 'firebase/app';
import { getStorage, ref, StorageError } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Verify storage configuration
console.log('Initializing Firebase Storage...');
console.log('Storage bucket:', firebaseConfig.storageBucket);

try {
  const rootRef = ref(storage);
  console.log('Firebase Storage initialized successfully!');
  console.log('Root reference:', rootRef.toString());
} catch (error) {
  console.error('Failed to initialize Firebase Storage:', error);
}

export { app }; 