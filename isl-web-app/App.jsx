import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard' or 'quiz'
  const [activeLesson, setActiveLesson] = useState(null);

  const launchLesson = (lessonId) => {
    setActiveLesson(lessonId);
    setCurrentScreen('quiz');
  };

  return (
    <>
      {currentScreen === 'dashboard' ? (
        /* Adjust your Phase 2 Dashboard component to receive this function */
        <Dashboard onLessonNodeClick={launchLesson} />
      ) : (
        <Workspace 
          lessonId={activeLesson} 
          onBackToDashboard={() => setCurrentScreen('dashboard')} 
        />
      )}
    </>
  );
}
