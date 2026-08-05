import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import { ISL_QUIZZES } from './data/quizData';


export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [activeLesson, setActiveLesson] = useState(null);
  // Core App Progress Engine States
  const [userStats, setUserStats] = useState({
    displayName: "Rohan Kumar",
    xp: 0,
    currentStreak: 5,
    completedLessons: [] // Starts clean. Array fills up as you pass modules.
  });

  const launchLesson = (lessonId) => {
    const verifiedId = ISL_QUIZZES[lessonId] ? lessonId : "greetings-1";
    setActiveLesson(verifiedId);
    setCurrentScreen('quiz');
  };

  // Asynchronous logic handler tracking passed challenges
  const handleLessonComplete = (lessonId, xpReward) => {
    setUserStats((prevStats) => {
      // Prevent duplicate progress tracking if they clear the same quiz twice
      const alreadyCompleted = prevStats.completedLessons.includes(lessonId);
      const updatedLessons = alreadyCompleted 
        ? prevStats.completedLessons 
        : [...prevStats.completedLessons, lessonId];

      return {
        ...prevStats,
        xp: alreadyCompleted ? prevStats.xp : prevStats.xp + xpReward,
        completedLessons: updatedLessons
      };
    });
  };

  return (
    <>
      {currentScreen === 'dashboard' ? (
        <Dashboard 
          userStats={userStats} 
          onLessonNodeClick={launchLesson} 
        />
      ) : (
        <Workspace 
          lessonId={activeLesson} 
          onLessonPassed={handleLessonComplete}
          onBackToDashboard={() => setCurrentScreen('dashboard')} 
        />
      )}
    </>
  );
}