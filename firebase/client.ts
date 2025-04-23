// Import the functions you need from the SDKs you need
import { initializeApp , getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAONk79gEbF7KyEERHA6pv-y1ArlPF6yqY",
  authDomain: "prepwise-844af.firebaseapp.com",
  projectId: "prepwise-844af",
  storageBucket: "prepwise-844af.firebasestorage.app",
  messagingSenderId: " 193290711322 ",
  appId: "1:193290711322:web:e44088a90c92c754aa7ca3",
  measurementId: "G-WM710NRCJ0"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);