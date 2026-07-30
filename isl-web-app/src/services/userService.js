import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

/**
 * 1. INITIALIZE OR FETCH USER ACCORDING TO AUTH CREDENTIALS
 */
export const syncUserProfile = async (firebaseUser) => {
  if (!firebaseUser) return null;

  const userDocRef = doc(db, "users", firebaseUser.uid);
  const userSnapshot = await getDoc(userDocRef);
  const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  if (!userSnapshot.exists()) {
    // New User profile initialization mapping
    const initialProfile = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || "Anonymous Learner",
      email: firebaseUser.email,
      currentStreak: 1,
      lastActiveDate: todayStr,
      xp: 0,
      completedLessons: []
    };
    await setDoc(userDocRef, initialProfile);
    return initialProfile;
  } else {
    // Existing User data processing
    const currentData = userSnapshot.data();
    const updatedData = calculateStreak(currentData, todayStr);
    
    // Push calculation update back to the database
    await updateDoc(userDocRef, updatedData);
    return { ...currentData, ...updatedData };
  }
};

/**
 * 2. STREAK RECOGNITION ALGORITHM
 */
const calculateStreak = (userData, todayStr) => {
  const lastDate = userData.lastActiveDate;
  
  if (lastDate === todayStr) {
    return {}; // Already updated today; leave data unmodified
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastDate === yesterdayStr) {
    // Continuous engagement track verified
    return {
      currentStreak: userData.currentStreak + 1,
      lastActiveDate: todayStr
    };
  } else {
    // Engagement broken; reset baseline tracker
    return {
      currentStreak: 1,
      lastActiveDate: todayStr
    };
  }
};

/**
 * 3. AWARD XP AND PROGRESS RECORDS PERMANENTLY
 */
export const rewardUserProgress = async (uid, lessonId, xpReward) => {
  const userDocRef = doc(db, "users", uid);
  
  try {
    await updateDoc(userDocRef, {
      // Safely appends unique elements to the database array
      completedLessons: arrayUnion(lessonId),
      // Increments the remote atomic integer counter natively
      xp: window.firebaseIncrement ? window.firebaseIncrement(xpReward) : (await getDoc(userDocRef)).data().xp + xpReward
    });
    
    // Fetch refreshed snapshot profile configuration 
    const updatedSnap = await getDoc(userDocRef);
    return updatedSnap.data();
  } catch (err) {
    console.error("Progress save failed:", err);
    throw err;
  }
};
