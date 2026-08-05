import React, { useState } from 'react';
import { ISL_QUIZZES } from '../data/quizData';
import { ArrowLeft, Check, X, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';

export default function Workspace({ lessonId = "greetings-1", onLessonPassed, onBackToDashboard }) {
  const currentQuiz = ISL_QUIZZES[lessonId];

  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
        <ShieldAlert className="w-12 h-12 text-slate-600 mb-2" />
        <p className="text-slate-400 text-sm font-medium">Challenge data under construction.</p>
        <button onClick={onBackToDashboard} className="mt-4 text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors cursor-pointer">
          Return to Map
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!selectedOption) return;
    const checkAnswer = selectedOption === currentQuiz.correctAnswer;
    setIsCorrect(checkAnswer);
    setIsSubmitted(true);

    if (checkAnswer && onLessonPassed) {
      onLessonPassed(currentQuiz.lessonId, 30); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
      
      {/* HEADER BAR */}
      <header className="bg-slate-900/40 backdrop-blur-md border-b border-emerald-500/10 px-6 py-4 flex justify-between items-center z-10 shadow-lg">
        <button onClick={onBackToDashboard} className="text-sm font-semibold text-slate-400 hover:text-emerald-400 flex items-center space-x-2 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> <span>Exit to Map</span>
        </button>
        <h2 className="text-sm font-bold text-slate-200 tracking-tight max-w-xs truncate md:max-w-none">
          Practice Loop: <span className="text-emerald-400 font-mono">{currentQuiz.title}</span>
        </h2>
        <div className="text-[10px] font-mono bg-emerald-500/10 px-2.5 py-1 rounded-md text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
          GAME MODULE
        </div>
      </header>

      {/* CORE WORKSPACE GRID CONTAINER */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT WINDOW: THE SCREENRECORD PLAYER CONTAINER */}
        <section className="w-full md:w-1/2 p-6 bg-slate-950 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-900">
          <div className="w-full max-w-xl aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-emerald-500/5 ring-1 ring-slate-800">
            <video 
              key={currentQuiz.videoUrl}
              className="w-full h-full object-cover"
              src={currentQuiz.videoUrl} 
              controls
              autoPlay={false}
              muted
            />
          </div>
          <div className="mt-4 max-w-xl text-center md:text-left space-y-1">
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Observe hand gestures, shapes, postures, and spatial movements demonstrated natively by the certified interpreter.
            </p>
          </div>
        </section>

        {/* RIGHT WINDOW: QUIZ CARDS INTERFACES */}
        <section className="w-full md:w-1/2 p-6 flex flex-col justify-center bg-slate-900/20 backdrop-blur-sm">
          <div className="max-w-xl mx-auto w-full space-y-6">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase font-mono flex items-center space-x-1">
                <HelpCircle className="w-3 h-3" /> <span>Comprehension Verification</span>
              </span>
              <h3 className="text-lg md:text-xl font-bold text-slate-100 tracking-tight leading-snug">
                {currentQuiz.question}
              </h3>
            </div>

            {/* ANSWER BUTTON NODES */}
            <div className="space-y-3">
              {currentQuiz.options.map((option, index) => {
                const isSelected = selectedOption === option;
                let choiceStyle = "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900/80 hover:border-slate-700";
                
                if (isSelected && !isSubmitted) {
                  choiceStyle = "bg-emerald-500/5 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/5";
                } else if (isSubmitted) {
                  if (option === currentQuiz.correctAnswer) {
                    choiceStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 pointer-events-none font-bold";
                  } else if (isSelected && !isCorrect) {
                    choiceStyle = "bg-rose-500/10 border-rose-500 text-rose-400 pointer-events-none";
                  } else {
                    choiceStyle = "bg-slate-950/20 border-slate-900 text-slate-600 pointer-events-none";
                  }
                }

                return (
                  <button 
                    key={index} 
                    disabled={isSubmitted} 
                    onClick={() => setSelectedOption(option)} 
                    className={`w-full p-4 rounded-xl border text-left font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${choiceStyle}`}
                  >
                    <span className="text-sm tracking-wide">{option}</span>
                    {isSubmitted && option === currentQuiz.correctAnswer && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                    {isSubmitted && isSelected && !isCorrect && <X className="w-4 h-4 text-rose-400 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* ACTION GATEWAY BUTTON CONTAINER */}
            <div className="pt-2">
              {!isSubmitted ? (
                <button 
                  disabled={!selectedOption} 
                  onClick={handleSubmit} 
                  className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all shadow-md duration-300 text-sm
                    ${selectedOption 
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black scale-[1.01] cursor-pointer" 
                      : "bg-slate-900 text-slate-500 border border-slate-800/80 cursor-not-allowed"
                    }`}
                >
                  Verify Verification Selection
                </button>
              ) : (
                /* EXPLANATION PANEL CARD */
                <div className={`p-5 rounded-2xl border animate-fadeIn shadow-xl
                  ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-200' : 'bg-rose-500/5 border-rose-500/10 text-rose-200'}`}>
                  <h4 className={`text-sm font-bold flex items-center space-x-2 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <CheckCircle className="w-4 h-4" />
                    <span>{isCorrect ? 'Outstanding. Challenge Cleared!' : 'Learning Feedback Loop'}</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-medium">
                    {currentQuiz.explanation}
                  </p>
                  <button 
                    onClick={onBackToDashboard} 
                    className="mt-4 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-md"
                  >
                    Continue Journey
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}