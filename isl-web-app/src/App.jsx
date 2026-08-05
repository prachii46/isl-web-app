import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import { ISL_QUIZZES } from './data/quizData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [activeLesson, setActiveLesson] = useState(null);

  // Clean, responsive app state metrics
  const [userStats, setUserStats] = useState({
    displayName: "Rohan Kumar",
    xp: 0,
    currentStreak: 5,
    completedLessons: []
  });

  const launchLessonFlow = (lessonId) => {
    // If the clicked node has data in quizData.js, use it. Otherwise, default to greetings-1.
    const verifiedId = ISL_QUIZZES[lessonId] ? lessonId : "greetings-1";
    setActiveLesson(verifiedId);
    setCurrentScreen('quiz'); // Head straight to the workspace game!
  };

  const handleLessonComplete = (lessonId, xpReward) => {
    setUserStats((prevStats) => {
      const alreadyCompleted = prevStats.completedLessons.includes(lessonId);
      const updatedLessons = alreadyCompleted ? prevStats.completedLessons : [...prevStats.completedLessons, lessonId];
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
        <Dashboard userStats={userStats} onLessonNodeClick={launchLessonFlow} />
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