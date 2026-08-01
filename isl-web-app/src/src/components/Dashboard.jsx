import React, { useState } from 'react';
import { ISL_LESSONS } from '../data/lessonsData';

export default function Dashboard() {
  const [userStats] = useState({
    displayName: "Rohan Kumar",
    xp: 40,
    currentStreak: 5,
    completedLessons: ["alphabets-1"]
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans antialiased">
      <nav className="sticky top-0 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🤟</span>
          <h1 className="text-xl font-black tracking-wider text-teal-400 uppercase">ISL Learn</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-bold text-amber-400">{userStats.currentStreak} Day Streak</span>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="text-lg">✨</span>
            <span className="text-sm font-bold text-emerald-400">{userStats.xp} XP</span>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Your Learning Pathway</h2>
          <p className="text-slate-400 mt-2 text-sm">Complete active modules to unlock advanced Indian Sign Language signs.</p>
        </div>

        <div className="space-y-12 relative w-full flex flex-col items-center">
          <div className="absolute top-4 bottom-4 w-1 bg-slate-700 left-1/2 transform -translate-x-1/2 z-0" />

          {ISL_LESSONS.map((lesson, index) => {
            const isCompleted = userStats.completedLessons.includes(lesson.id);
            const isUnlocked = index === 0 || userStats.completedLessons.includes(ISL_LESSONS[index - 1].id);
            const lateralShift = index % 2 === 0 ? "translate-x-4" : "-translate-x-4";

            return (
              <div key={lesson.id} className={`relative z-10 flex flex-col items-center transform ${lateralShift}`}>
                <button
                  disabled={!isUnlocked}
                  onClick={() => alert(`Launching Module: ${lesson.title}`)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center font-bold border-4 shadow-xl transition-all duration-300 cursor-pointer
                    ${isCompleted 
                      ? "bg-emerald-500 border-emerald-300 text-white hover:scale-105" 
                      : isUnlocked 
                        ? "bg-teal-500 border-teal-300 text-white hover:scale-110" 
                        : "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                >
                  {isCompleted ? "✓" : !isUnlocked ? "🔒" : "🤟"}
                </button>
                <div className="mt-3 text-center bg-slate-800 px-4 py-1.5 rounded-xl border border-slate-700 max-w-xs">
                  <p className={`text-xs font-bold uppercase tracking-wider ${isUnlocked ? 'text-teal-400' : 'text-slate-500'}`}>
                    {lesson.category}
                  </p>
                  <h3 className={`text-sm font-semibold mt-0.5 ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                    {lesson.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}