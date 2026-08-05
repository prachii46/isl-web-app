import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LectureView from './components/LectureView'; // ⬅️ NEW SCREEN IMPORT
import Workspace from './components/Workspace';
import { ISL_QUIZZES } from './data/quizData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard', 'lecture', or 'quiz'
  const [activeLesson, setActiveLesson] = useState(null);

  const [userStats, setUserStats] = useState({
    displayName: "Rohan Kumar",
    xp: 0,
    currentStreak: 5,
    completedLessons: []
  });

  const launchLessonFlow = (lessonId) => {
    const verifiedId = ISL_QUIZZES[lessonId] ? lessonId : "greetings-1";
    setActiveLesson(lessonId);
    setCurrentScreen('quiz');
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
      {currentScreen === 'dashboard' && (
        <Dashboard userStats={userStats} onLessonNodeClick={launchLessonFlow} />
      )}
      
      {currentScreen === 'lecture' && (
        <LectureView 
          lessonId={activeLesson}
          onStartQuiz={() => setCurrentScreen('quiz')} // 📍 ROUTE TO QUIZ NEXT!
          onBackToDashboard={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'quiz' && (
        <Workspace 
          lessonId={activeLesson} 
          onLessonPassed={handleLessonComplete}
          onBackToDashboard={() => setCurrentScreen('dashboard')} 
        />
      )}
    </>
  );
}