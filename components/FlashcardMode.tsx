
import React, { useState } from 'react';
import { Flashcard } from '../types';

const FlashcardMode: React.FC = () => {
  const [cards] = useState<Flashcard[]>([
    { id: '1', front: 'Mitochondria', back: 'The powerhouse of the cell, where ATP is generated.' },
    { id: '2', front: 'Photosynthesis', back: 'Process used by plants to convert light energy into chemical energy.' },
    { id: '3', front: 'Active Transport', back: 'Movement of molecules across a cell membrane from a region of lower concentration to higher concentration.' },
    { id: '4', front: 'Ribosomes', back: 'Molecular machines that serve as the site of biological protein synthesis.' },
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIdx((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="max-w-xl mx-auto space-y-12 md:pl-20 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">Flashcard Mastery</h2>
        <p className="text-slate-500 italic">"Active recall is the key to long-term memory."</p>
      </div>

      <div className="relative perspective-1000 group cursor-pointer h-80" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-[2rem] shadow-xl border border-slate-100 flex items-center justify-center p-8 backface-hidden">
             <div className="text-center">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 block">Term</span>
                <h3 className="text-4xl font-bold text-slate-800 leading-tight">{cards[currentIdx].front}</h3>
                <p className="mt-8 text-slate-300 text-sm">Click to flip</p>
             </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 w-full h-full bg-indigo-600 text-white rounded-[2rem] shadow-xl flex items-center justify-center p-8 backface-hidden rotate-y-180">
            <div className="text-center">
                <span className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-4 block">Definition</span>
                <p className="text-xl md:text-2xl font-medium leading-relaxed">{cards[currentIdx].back}</p>
                <div className="mt-8 flex justify-center gap-4">
                  <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-sm">Got it</button>
                  <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg text-sm">Needs review</button>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4">
        <button onClick={prevCard} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-xl hover:scale-110 transition-transform">👈</button>
        <span className="font-bold text-slate-400">{currentIdx + 1} / {cards.length}</span>
        <button onClick={nextCard} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-xl hover:scale-110 transition-transform">👉</button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}} />
    </div>
  );
};

export default FlashcardMode;
