// Firebase configuration
// You'll need to replace these with your actual Firebase project credentials
// Go to https://console.firebase.google.com/ to create a project and get these values

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyByZPKCqwFQueTYjrihYCNEl7EvZPUQFFU",
  authDomain: "signease-44bf9.firebaseapp.com",
  projectId: "signease-44bf9",
  storageBucket: "signease-44bf9.firebasestorage.app",
  messagingSenderId: "849778856143",
  appId: "1:849778856143:web:8a4836e7d2db5cd8f2e7ba",
  measurementId: "G-VMD71NZS7W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Auth
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
