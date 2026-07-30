import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export const seedHackathonMockData = async () => {
  try {
    // 1. Seed Sample Lesson Node Infrastructure into Cloud Collection
    const mockLessonRef = doc(db, "lessons", "greetings-1");
    await setDoc(mockLessonRef, {
      lessonId: "greetings-1",
      title: "Essential Greetings",
      category: "Conversational",
      videoUrl: "https://youtube.com",
      xpReward: 30
    });

    console.log("🚀 Firestore successfully seeded with hackathon operational payloads!");
  } catch (error) {
    console.error("❌ Database seeding aborted:", error);
  }
};