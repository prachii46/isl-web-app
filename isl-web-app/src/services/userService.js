import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";

export const syncUserProfile = async (firebaseUser) => {
  if (!firebaseUser) return null;
  try {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userSnapshot = await getDoc(userDocRef);
    const todayStr = new Date().toISOString().split("T")[0];

    if (!userSnapshot.exists()) {
      const initialProfile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || "Learner",
        email: firebaseUser.email,
        currentStreak: 1,
        lastActiveDate: todayStr,
        xp: 0,
        completedLessons: []
      };
      await setDoc(userDocRef, initialProfile);
      return initialProfile;
    }
    return userSnapshot.data();
  } catch (error) {
    console.warn("Database offline. Falling back to local session state:", error.message);
    return {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || "Local Learner",
      currentStreak: 1,
      xp: 0,
      completedLessons: []
    };
  }
};

export const rewardUserProgress = async (uid, lessonId, xpReward) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      completedLessons: arrayUnion(lessonId),
      xp: increment(xpReward)
    });
    const updatedSnap = await getDoc(userDocRef);
    return updatedSnap.data();
  } catch (err) {
    console.error("Progress payload sync failed:", err);
    return null;
  }
};