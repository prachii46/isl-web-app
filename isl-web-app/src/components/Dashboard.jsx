import React from 'react';
import { ISL_LESSONS } from '../data/lessonsData';
import { Flame, Sparkles, BookOpen, Lock, Check, GraduationCap } from 'lucide-react';

export default function Dashboard({ userStats, onLessonNodeClick }) {
  return (
    /* Aesthetic Emerald Glow Backdrop Grid */
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* FROSTED EMERALD GLASS NAVIGATION BAR */}
      <nav className="sticky top-0 bg-slate-900/50 backdrop-blur-xl border-b border-emerald-500/10 px-6 py-4 flex justify-between items-center z-50 shadow-xl shadow-slate-950/20">
        <div className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-2 rounded-xl border border-emerald-500/20 group-hover:border-emerald-400/40 transition-all duration-300">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent uppercase font-mono">
            ISL.CORE
          </h1>
        </div>
        
        {/* STAT CAPSULES */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-500/10 shadow-lg">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-amber-400/90 tracking-wide">{userStats.currentStreak} DAY STREAK</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/10 shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400/90 tracking-wide">{userStats.xp} XP</span>
          </div>
        </div>
      </nav>

      {/* TIMELINE PATHWAY MAIN VIEW */}
      <main className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-100 sm:text-4xl">
            Learning Pathway
          </h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto font-medium">
            Master verified conversational blocks step-by-step.
          </p>
        </div>

        {/* ROADMAP TREE ARCHITECTURE */}
        <div className="space-y-16 relative w-full flex flex-col items-center">
          {/* Central neon connecting line */}
          <div className="absolute top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald-500/30 via-teal-500/20 to-slate-800 left-1/2 transform -translate-x-1/2 z-0" />

          {ISL_LESSONS.map((lesson, index) => {
            const isCompleted = userStats.completedLessons.includes(lesson.id);
            const isUnlocked = index === 0 || userStats.completedLessons.includes(ISL_LESSONS[index - 1].id);
            const lateralShift = index % 2 === 0 ? "translate-x-6" : "-translate-x-6";

            return (
              <div key={lesson.id} className={`relative z-10 flex flex-col items-center transform transition-all duration-500 ${lateralShift}`}>
                
                {/* INTERACTIVE ROUNDED NODE BUTTON */}
                <button
                  disabled={!isUnlocked}
                  onClick={() => onLessonNodeClick(lesson.id)}
                  className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all duration-300 relative cursor-pointer group shadow-xl
                    ${isCompleted 
                      ? "bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-400 text-white shadow-emerald-500/20 hover:shadow-emerald-500/30" 
                      : isUnlocked 
                        ? "bg-slate-900 border-emerald-500/40 text-emerald-400 hover:border-emerald-300 hover:text-emerald-300 hover:scale-105 shadow-emerald-950/50" 
                        : "bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed shadow-inner"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white stroke-[3]" />
                  ) : !isUnlocked ? (
                    <Lock className="w-5 h-5 text-slate-600" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                  )}
                  
                  {/* Neon pulsing aura for active uncompleted stages */}
                  {isUnlocked && !isCompleted && (
                    <span className="absolute -inset-1 rounded-full border border-emerald-400/20 animate-ping opacity-75 pointer-events-none" />
                  )}
                </button>
                
                {/* GLASS CARD LABEL */}
                <div className={`mt-4 text-center bg-slate-950/40 backdrop-blur-md px-5 py-3 rounded-2xl border transition-all shadow-xl max-w-xs
                  ${isUnlocked ? 'border-emerald-500/10 shadow-emerald-950/20' : 'border-slate-800/40'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isUnlocked ? 'text-teal-400' : 'text-slate-600'}`}>
                    {lesson.category}
                  </p>
                  <h3 className={`text-sm font-bold mt-1 tracking-tight ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>
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