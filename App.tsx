import React, { useState } from 'react';
import { NavigationTab } from './types';
import { BottomNav } from './components/BottomNav';
import { DietSection } from './components/DietSection';
import { ActivitySection } from './components/ActivitySection';
import { WellnessSection } from './components/WellnessSection';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.Diet);

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.Diet:
        return <DietSection />;
      case NavigationTab.Activity:
        return <ActivitySection />;
      case NavigationTab.Wellness:
        return <WellnessSection />;
      default:
        return <DietSection />;
    }
  };

  return (
    <div className="text-dark-text dark:text-light-text min-h-screen font-sans">
       <header className="p-4 flex justify-between items-center sticky top-0 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm z-10 border-b border-light-border dark:border-dark-border">
          <h1 className="text-3xl font-bold">{activeTab}</h1>
          <ThemeToggle />
      </header>
      <main className="pb-24"> 
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;