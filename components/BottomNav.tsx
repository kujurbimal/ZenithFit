import React from 'react';
import { NavigationTab } from '../types';
import { DietIcon } from './icons/DietIcon';
import { ActivityIcon } from './icons/ActivityIcon';
import { WellnessIcon } from './icons/WellnessIcon';

interface BottomNavProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

const NavItem: React.FC<{
  tab: NavigationTab;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  Icon: React.ElementType;
}> = ({ tab, activeTab, setActiveTab, Icon }) => {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={() => setActiveTab(tab)}
      className="flex flex-col items-center justify-center w-full transition-colors duration-200"
    >
      <Icon
        className={`w-7 h-7 mb-1 ${
          isActive ? 'text-brand-primary' : 'text-medium-text-light dark:text-medium-text'
        }`}
      />
      <span
        className={`text-xs font-medium ${
          isActive ? 'text-brand-primary' : 'text-medium-text-light dark:text-medium-text'
        }`}
      >
        {tab}
      </span>
    </button>
  );
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border shadow-lg z-50">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        <NavItem tab={NavigationTab.Diet} activeTab={activeTab} setActiveTab={setActiveTab} Icon={DietIcon} />
        <NavItem tab={NavigationTab.Activity} activeTab={activeTab} setActiveTab={setActiveTab} Icon={ActivityIcon} />
        <NavItem tab={NavigationTab.Wellness} activeTab={activeTab} setActiveTab={setActiveTab} Icon={WellnessIcon} />
      </div>
    </div>
  );
};