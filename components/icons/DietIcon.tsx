
import React from 'react';

interface IconProps {
  className?: string;
}

export const DietIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a5 5 0 0 0-5 5v1.5a1.5 1.5 0 0 1-3 0V7a5 5 0 0 0-5 5 1.5 1.5 0 0 1 0 3 5 5 0 0 0 5 5v-1.5a1.5 1.5 0 0 1 3 0V17a5 5 0 0 0 5 5 1.5 1.5 0 0 1 0-3 5 5 0 0 0-5-5v1.5a1.5 1.5 0 0 1-3 0V12a5 5 0 0 0-5-5 1.5 1.5 0 0 1 0-3A5 5 0 0 0 7 7V5.5A1.5 1.5 0 0 1 10 5.5V7a5 5 0 0 0 5-5 1.5 1.5 0 0 1 3 0 5 5 0 0 0-5 5v-1.5a1.5 1.5 0 0 1-3 0z" />
    <path d="M17 17a5 5 0 0 0 5-5 1.5 1.5 0 0 1 0-3 5 5 0 0 0-5-5v1.5a1.5 1.5 0 0 1-3 0V7a5 5 0 0 0-5 5 1.5 1.5 0 0 1 0 3 5 5 0 0 0 5 5z" />
  </svg>
);
