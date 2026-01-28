
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, QuizDifficulty } from '../types';

const QuizArena: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const q = await generateQuiz(topic, difficulty);
      setQuestions(q);
      setCurrentIdx(0);
      setScore(0);
      setShowResult(false);
      setSelectedOption(null);
      setIsAnswered(false);
    } catch (e) {
      alert("Failed to generate quiz. Try a different topic.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 md:pl-20">
        <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Generating Your AI Quiz...</h2>
          <p className="text-slate-500">Brainy is researching "{topic}" at <span className="font-bold text-indigo-600 uppercase">{difficulty}</span> level.</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-xl mx-auto space-y-8 text-center md:pl-20 pt-10">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-slate-800">Quiz Completed!</h2>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-sm text-slate-400 uppercase tracking-widest mb-2 font-bold">Your Score ({difficulty})</div>
          <div className="text-6xl font-black text-indigo-600 mb-6">{score} / {questions.length}</div>
          <p className="text-slate-600 mb-8">
            {score === questions.length ? "Perfect score! You're a true scholar." : 
             score > questions.length / 2 ? "Great job! Keep practicing to master this topic." : 
             "Don't worry, every expert was once a beginner. Study more and try again!"}
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setQuestions([])}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Back to Start
            </button>
            <button 
              onClick={startQuiz}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const q = questions[currentIdx];
    return (
      <div className="max-w-2xl mx-auto space-y-6 md:pl-20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold w-fit">Question {currentIdx + 1}/{questions.length}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider ml-1">{difficulty} difficulty</span>
          </div>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-8 h-1 rounded-full transition-colors ${i <= currentIdx ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[400px] flex flex-col">
          <h3 className="text-2xl font-bold text-slate-800 mb-8">{q.question}</h3>
          
          <div className="space-y-3 flex-1">
            {q.options.map((option, idx) => {
              let style = "bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50";
              if (isAnswered) {
                if (idx === q.correctAnswer) style = "bg-emerald-100 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200";
                else if (idx === selectedOption) style = "bg-rose-100 border-rose-500 text-rose-800";
                else style = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
              }
              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all ${style}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isAnswered && idx === q.correctAnswer && <span>✅</span>}
                    {isAnswered && idx === selectedOption && idx !== q.correctAnswer && <span>❌</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-8 animate-fadeIn">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-800 text-sm mb-6">
                <p className="font-bold mb-1">Explanation:</p>
                <p>{q.explanation}</p>
              </div>
              <button
                onClick={nextQuestion}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
              >
                {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-12 md:pl-20 py-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-slate-800">Adaptive Quiz Arena</h2>
        <p className="text-slate-500 text-lg">Type any topic and let AI generate a customized quiz for your level.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Enter Study Topic</label>
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Photosynthesis, Civil War, Quantum Physics"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-tight">Select Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'easy', label: 'Easy', color: 'emerald', icon: '🌱' },
              { id: 'medium', label: 'Medium', color: 'indigo', icon: '🚀' },
              { id: 'hard', label: 'Hard', color: 'rose', icon: '🔥' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id as QuizDifficulty)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                  difficulty === d.id 
                    ? `bg-${d.color}-50 border-${d.color}-500 ring-2 ring-${d.color}-100` 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className="text-xl mb-1">{d.icon}</span>
                <span className={`text-xs font-bold ${difficulty === d.id ? `text-${d.color}-600` : ''}`}>{d.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="text-xl mb-1">⏱️</div>
            <div className="text-xs font-bold text-slate-500 uppercase">Mode</div>
            <div className="text-sm text-slate-600 font-medium italic">Standard (Adaptive)</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <div className="text-xl mb-1">💎</div>
            <div className="text-xs font-bold text-amber-800 uppercase">Reward</div>
            <div className="text-sm text-amber-600 font-medium">Up to {difficulty === 'hard' ? '+100' : difficulty === 'medium' ? '+50' : '+25'} XP</div>
          </div>
        </div>

        <button 
          onClick={startQuiz}
          disabled={!topic.trim()}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100 transition-all"
        >
          Generate {difficulty.toUpperCase()} Quiz
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 opacity-50">
        <button disabled className="p-4 border border-dashed border-slate-300 rounded-2xl text-slate-400 text-sm font-medium">Flashcard Mode (Soon)</button>
        <button disabled className="p-4 border border-dashed border-slate-300 rounded-2xl text-slate-400 text-sm font-medium">Battle Mode (Soon)</button>
      </div>
    </div>
  );
};

export default QuizArena;
