import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Boilerplate credentials block to allow compilation
const firebaseConfig = {
  apiKey: "AIzaSyFakeKey_ForHackathonCompilationOnly",
  authDomain: "://firebaseapp.com",
  projectId: "isl-learning-dashboard",
  storageBucket: "://appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Core Firebase Services
const app = initializeApp(firebaseConfig);

// 🚨 THESE EXPORTS MUST BE EXACT FOR USERSERVICE.JS TO READ THEM
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user; 
  } catch (error) {
    console.error("Google Authentication Interrupted:", error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign Out Error:", error.message);
  }
};