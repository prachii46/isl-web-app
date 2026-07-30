import React, { useState } from 'react';
import { ISL_LESSONS } from '../data/lessonsData';

export default function Dashboard() {
  // Hackathon State Simulation (In Phase 4, these will pull live data from Firestore)
  const [userStats, setUserStats] = useState({
    displayName: "Rohan Kumar",
    xp: 40,
    currentStreak: 5,
    completedLessons: ["alphabets-1"] // Has completed the first lesson
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-teal-500">
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <nav className="sticky top-0 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🤟</span>
          <h1 className="text-xl font-black tracking-wider text-teal-400 uppercase">ISL Learn</h1>
        </div>
        
        {/* GAMIFIED TRACKING CORE */}
        <div className="flex items-center space-x-6">
          {/* STREAK WIDGET */}
          <div className="flex items-center space-x-2 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 shadow-sm animate-pulse">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-bold text-amber-400">{userStats.currentStreak} Day Streak</span>
          </div>
          
          {/* XP WIDGET */}
          <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
            <span className="text-lg">✨</span>
            <span className="text-sm font-bold text-emerald-400">{userStats.xp} XP</span>
          </div>

          {/* USER AVATAR PROFILE */}
          <div className="flex items-center space-x-2 border-l border-slate-700 pl-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center font-bold text-slate-900 text-sm">
              {userStats.displayName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-slate-300 hidden sm:inline">{userStats.displayName}</span>
          </div>
        </div>
      </nav>

      {/* 2. THE PROGRESS MAP TREE */}
      <main className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Your Learning Pathway</h2>
          <p className="text-slate-400 mt-2 text-sm">Complete active modules to unlock advanced Indian Sign Language signs.</p>
        </div>

        {/* LOOP THROUGH LESSON NODES */}
        <div className="space-y-12 relative w-full flex flex-col items-center">
          
          {/* Background Connecting Spine Line */}
          <div className="absolute top-4 bottom-4 w-1 bg-slate-700 left-1/2 transform -translate-x-1/2 z-0" />

          {ISL_LESSONS.map((lesson, index) => {
            // Business Logic: First lesson is always open. Subsequent lessons unlock if the previous one is completed.
            const isCompleted = userStats.completedLessons.includes(lesson.id);
            const isUnlocked = index === 0 || userStats.completedLessons.includes(ISL_LESSONS[index - 1].id);

            // Zig-zag styling layout shift to mimic interactive node maps
            const lateralShift = index % 2 === 0 ? "translate-x-4" : "-translate-x-4";

            return (
              <div key={lesson.id} className={`relative z-10 flex flex-col items-center transform ${lateralShift}`}>
                
                {/* INTERACTIVE ROUNDED NODE BUTTON */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => alert(`Launching Module: ${lesson.title}`)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center font-bold border-4 shadow-xl transition-all duration-300 cursor-pointer
                    ${isCompleted 
                      ? "bg-emerald-500 border-emerald-300 text-white hover:scale-105 active:scale-95" 
                      : isUnlocked 
                        ? "bg-teal-500 border-teal-300 text-white hover:scale-110 active:scale-95 shadow-teal-500/20" 
                        : "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                >
                  {isCompleted ? (
                    <span className="text-2xl">✓</span>
                  ) : !isUnlocked ? (
                    <span className="text-lg">🔒</span>
                  ) : (
                    <span className="text-2xl">🤟</span>
                  )}
                </button>

                {/* LESSON LABEL BUBBLE */}
                <div className="mt-3 text-center bg-slate-800 px-4 py-1.5 rounded-xl border border-slate-700 shadow-md max-w-xs">
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

      {/* FOOTER ATTRIBUTION BAR (Maintains absolute copyright/ethics clean integrity) */}
      <footer className="mt-20 py-6 border-t border-slate-800 bg-slate-950/40 text-center text-xs text-slate-500 px-4">
        Educational content verified and map-referenced from the <a href="https://islrtc.nic.in" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-teal-400 underline decoration-dotted">Indian Sign Language Research and Training Centre (ISLRTC)</a>.
      </footer>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { signInWithGoogle, logoutUser, auth } from '../firebase';
import { syncUserProfile } from '../services/userService';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard({ onLessonNodeClick }) {
  const [user, setUser] = useState(null);
  const [dbProfile, setDbProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up an active observer pipeline monitoring the authentication lifecycle
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const profile = await syncUserProfile(currentUser);
        setDbProfile(profile);
      } else {
        setUser(null);
        setDbProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-900 text-teal-400 flex items-center justify-center font-mono">Streaming Database Pipeline...</div>;

  if (!user || !dbProfile) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-6 text-white text-center">
        <span className="text-6xl mb-4 animate-bounce">🤟</span>
        <h1 className="text-3xl font-black text-teal-400 mb-2">ISL ACCESS PORTAL</h1>
        <p className="text-slate-400 max-w-sm mb-6 text-sm">Sign in to track your learning journey with authentic, verified Indian Sign Language clips.</p>
        <button onClick={signInWithGoogle} className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg transform active:scale-95 cursor-pointer">
          Sign In Instantly with Google
        </button>
      </div>
    );
  }

  // Bind your database properties into your pre-existing Phase 2 UI elements
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <nav className="sticky top-0 bg-slate-800/80 border-b border-slate-700 px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🤟</span>
          <h1 className="text-md font-bold tracking-wider text-teal-400 uppercase">ISL Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-amber-400 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            🔥 {dbProfile.currentStreak} Day Streak
          </div>
          <div className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            ✨ {dbProfile.xp} XP
          </div>
          <button onClick={logoutUser} className="text-xs text-slate-400 hover:text-rose-400 font-medium transition-colors">
            Exit Account
          </button>
        </div>
      </nav>
      {/* Rest of your existing interactive curriculum node iteration mapping loop goes here... */}
    </div>
  );
}
