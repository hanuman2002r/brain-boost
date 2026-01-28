
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuizArena from './components/QuizArena';
import StudyBuddy from './components/StudyBuddy';
import Visuals from './components/Visuals';
import FlashcardMode from './components/FlashcardMode';
import { AppMode } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mode, setMode] = useState<AppMode>(AppMode.LEARNING);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'quiz':
        return <QuizArena />;
      case 'buddy':
        return <StudyBuddy />;
      case 'visualize':
        return <Visuals />;
      case 'learn':
        return <FlashcardMode />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      mode={mode} 
      setMode={setMode}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
