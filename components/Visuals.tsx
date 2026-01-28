
import React, { useState } from 'react';
import { generateStudyVisual } from '../services/geminiService';
import { ImageSize } from '../types';

const Visuals: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Only Pro models (2K/4K) strictly require the manual key selection dialog
    if (size !== '1K') {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (!hasKey) {
        setNeedsKey(true);
        return;
      }
    }

    setIsGenerating(true);
    setImageUrl(null);
    setNeedsKey(false);
    
    try {
      const url = await generateStudyVisual(prompt, size);
      setImageUrl(url);
    } catch (e: any) {
      if (e.message?.includes("Requested entity was not found")) {
        setNeedsKey(true);
      } else {
        alert("Generation failed. Please try again or check your connection.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const openKeyDialog = async () => {
    await (window as any).aistudio?.openSelectKey();
    setNeedsKey(false);
    // Proceed with generation after triggering dialog
    handleGenerate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:pl-20">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">Visual Learning Canvas</h2>
        <p className="text-slate-500">Transform complex abstract concepts into beautiful high-resolution educational visuals.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Concept to Visualize</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., The structure of a human heart with labels, or The solar system's inner planets..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase flex items-center justify-between">
                <span>Quality</span>
                {size !== '1K' && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">PRO</span>}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSize(s);
                      if (s === '1K') setNeedsKey(false);
                    }}
                    className={`py-2 rounded-xl font-bold border-2 transition-all ${size === s ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {needsKey ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                <p className="text-xs text-amber-800 font-medium">High-quality {size} visuals require a billing-enabled API key.</p>
                <div className="flex items-center justify-between">
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[10px] text-amber-600 underline">Billing Docs</a>
                  <button onClick={() => setSize('1K')} className="text-[10px] text-slate-500 hover:underline">Switch to 1K (Standard)</button>
                </div>
                <button 
                  onClick={openKeyDialog}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-md"
                >
                  Select API Key
                </button>
              </div>
            ) : (
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-4 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 shadow-lg transition-all flex items-center justify-center gap-2 ${size === '1K' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-purple-100'}`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Visualizing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Visual</span>
                    <span className="text-xs font-normal opacity-80">{size === '1K' ? '(Flash)' : '(Pro 3)'}</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
             <h4 className="text-sm font-bold text-indigo-800 mb-1">💡 Study Tip</h4>
             <p className="text-xs text-indigo-600 leading-relaxed">Images help encode memory in the visual cortex, making it 40% more likely you'll recall the information during an exam.</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-200 rounded-3xl aspect-square overflow-hidden flex items-center justify-center border-4 border-white shadow-xl relative group">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Generated Study Aid" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                   <button className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform" title="Download Image">💾</button>
                   <button className="bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform" title="Share Image">🔗</button>
                </div>
              </>
            ) : (
              <div className="text-center px-8">
                <div className="text-6xl mb-4 grayscale opacity-20">🎨</div>
                <p className="text-slate-400 font-medium">Your AI-generated visual study aid will appear here.</p>
              </div>
            )}
            {isGenerating && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                 <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                 <p className="text-indigo-600 font-bold animate-pulse">Consulting the art database...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visuals;
