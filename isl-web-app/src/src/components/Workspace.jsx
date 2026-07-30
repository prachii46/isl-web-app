import React, { useState } from 'react';
import { ISL_QUIZZES } from '../data/quizData';

export default function Workspace({ lessonId = "greetings-1", onBackToDashboard }) {
  const currentQuiz = ISL_QUIZZES[lessonId];

  // Component Core States
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleOptionSelect = (option) => {
    if (isSubmitted) return; // Prevent changing answers after submission
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    const checkAnswer = selectedOption === currentQuiz.correctAnswer;
    setIsCorrect(checkAnswer);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      
      {/* WORKSPACE HEADER BAR */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBackToDashboard}
            className="text-sm font-semibold text-slate-400 hover:text-teal-400 flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <span>←</span> <span>Exit to Map</span>
          </button>
          <div className="h-4 w-px bg-slate-700" />
          <h2 className="text-md font-bold text-slate-200">Module Practice: <span className="text-teal-400">{currentQuiz.title}</span></h2>
        </div>
        <div className="text-xs bg-slate-900 px-3 py-1 rounded-md text-slate-400 border border-slate-700 font-mono">
          Interactive Prototype Engine v1.0
        </div>
      </header>

      {/* DUAL SPLIT-SCREEN WORKSPACE CONTAINER */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT COMPONENT LAYER: THE VERIFIED VIDEO STREAMER */}
        <section className="w-full md:w-1/2 p-6 bg-slate-950 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-800">
          <div className="w-full max-w-xl aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 relative">
            <iframe
              className="w-full h-full object-cover"
              src={currentQuiz.videoUrl}
              title="Verified Indian Sign Language Instructional Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold text-teal-500 uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded-md">
              Source Verified
            </span>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Observation Note: Pay close attention to hand shapes, orientation, spatial location, and corresponding facial expressions shown by the certified ISLRTC interpreter.
            </p>
          </div>
        </section>

        {/* RIGHT COMPONENT LAYER: THE INTERACTIVE QUIZ ENGINE */}
        <section className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-slate-900 overflow-y-auto">
          <div className="max-w-xl mx-auto w-full my-auto space-y-6">
            
            {/* PROBLEM DESCRIPTION BOX */}
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Question Challenge</span>
              <h3 className="text-lg md:text-xl font-medium text-slate-100 leading-snug">
                {currentQuiz.question}
              </h3>
            </div>

            {/* SELECTION CHOICES LIST */}
            <div className="space-y-3">
              {currentQuiz.options.map((option, index) => {
                const isCurrentSelection = selectedOption === option;
                
                // Real-time styling calculation flags
                let choiceStyle = "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-600";
                
                if (isCurrentSelection && !isSubmitted) {
                  choiceStyle = "bg-teal-500/10 border-teal-400 text-teal-300 shadow-lg shadow-teal-500/5";
                } else if (isSubmitted) {
                  if (option === currentQuiz.correctAnswer) {
                    choiceStyle = "bg-emerald-500/20 border-emerald-400 text-emerald-300 pointer-events-none";
                  } else if (isCurrentSelection && !isCorrect) {
                    choiceStyle = "bg-rose-500/20 border-rose-500 text-rose-300 pointer-events-none";
                  } else {
                    choiceStyle = "bg-slate-800/40 border-slate-800 text-slate-500 pointer-events-none";
                  }
                }

                return (
                  <button
                    key={index}
                    disabled={isSubmitted}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full p-4 rounded-xl border text-left font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${choiceStyle}`}
                  >
                    <span>{option}</span>
                    {isSubmitted && option === currentQuiz.correctAnswer && (
                      <span className="text-emerald-400 font-bold">✓ Correct</span>
                    )}
                    {isSubmitted && isCurrentSelection && !isCorrect && (
                      <span className="text-rose-400 font-bold">✗ Incorrect</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ACTION SUBMIT CONTAINER */}
            <div className="pt-4">
              {!isSubmitted ? (
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmit}
                  className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-md cursor-pointer
                    ${selectedOption 
                      ? "bg-teal-500 hover:bg-teal-400 text-slate-900 hover:scale-[1.01] active:scale-95" 
                      : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                    }`}
                >
                  Verify Selection
                </button>
              ) : (
                /* POST-SUBMISSION DETAILED EXPLANATION PANEL */
                <div className={`p-5 rounded-xl border animate-fadeIn
                  ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                  <h4 className={`text-md font-bold flex items-center space-x-2 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span>{isCorrect ? '✨ Outstanding Achievement!' : '🔒 Learning Opportunity'}</span>
                  </h4>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {currentQuiz.explanation}
                  </p>
                  <button
                    onClick={onBackToDashboard}
                    className="mt-4 px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
                  >
                    Continue Journey
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

      </main>

      {/* FIXED LEGAL CREDIT ANCHOR */}
      <footer className="bg-slate-950 py-3 text-center text-[10px] tracking-wider text-slate-500 uppercase border-t border-slate-800">
        Strict Non-Commercial Content Pipeline Mapping • Cradled from official ISLRTC assets
      </footer>
    </div>
  );
}
// Inside your Phase 3 Workspace.jsx Component, update the handleSubmit function:
const handleSubmit = async () => {
  if (!selectedOption) return;
  
  const checkAnswer = selectedOption === currentQuiz.correctAnswer;
  setIsCorrect(checkAnswer);
  setIsSubmitted(true);

  // If the user answers correctly, write to the cloud database in real-time
  if (checkAnswer && auth.currentUser) {
    try {
      await rewardUserProgress(
        auth.currentUser.uid, 
        currentQuiz.lessonId, 
        20 // Dynamic XP score value mapped directly to the challenge
      );
    } catch (error) {
      console.error("Could not sync achievements to the cloud container:", error);
    }
  }
};

