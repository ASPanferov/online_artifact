/**
 * Firebase Configuration for Angel Connect (Production)
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration (Production)
const firebaseConfig = {
  apiKey: "AIzaSyAXvnNcobiiJAjjV5a-ikF5rNWD0Cl3AS8",
  authDomain: "angelconnect-49d81.firebaseapp.com",
  projectId: "angelconnect-49d81",
  storageBucket: "angelconnect-49d81.firebasestorage.app",
  messagingSenderId: "403643009679",
  appId: "1:403643009679:web:df5db521f8f88afede3efa",
  measurementId: "G-K6JGBLK0DK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Production - no emulators)
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

console.log('Firebase initialized for production');

export default app;