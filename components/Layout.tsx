
import React from 'react';
import { AppMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, mode, setMode }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'learn', label: 'Study', icon: '📚' },
    { id: 'quiz', label: 'Quiz', icon: '⚡' },
    { id: 'visualize', label: 'Visuals', icon: '🎨' },
    { id: 'buddy', label: 'Buddy', icon: '🤖' },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${mode === AppMode.CHALLENGE ? 'bg-indigo-50' : 'bg-rose-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">B</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text text-transparent">BrainBoost AI</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-slate-200/50 p-1 rounded-full text-xs font-semibold">
            <button 
              onClick={() => setMode(AppMode.LEARNING)}
              className={`px-4 py-1.5 rounded-full transition-all ${mode === AppMode.LEARNING ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              Study Mode
            </button>
            <button 
              onClick={() => setMode(AppMode.CHALLENGE)}
              className={`px-4 py-1.5 rounded-full transition-all ${mode === AppMode.CHALLENGE ? 'bg-indigo-600 shadow-sm text-white' : 'text-slate-500'}`}
            >
              Sprint Mode
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-100">
            <span className="text-orange-500">🔥</span>
            <span className="font-bold text-slate-700">7 Day Streak</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-4 py-2 flex justify-between items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === item.id ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Sidebar (Optional, here integrated as Top Nav + Side) */}
      <div className="hidden md:block fixed left-4 top-24 bottom-6 w-16 glass rounded-2xl flex flex-col items-center py-6 gap-8 shadow-sm">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <div className="absolute left-14 glass px-3 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
              {item.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Layout;
