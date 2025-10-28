import React, { useState, useEffect, useCallback } from 'react';
import { getPersonalizedTip } from '../services/geminiService';

interface AIAssistantProps {
    calories: number;
    goal: number;
    lastActivity: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ calories, goal, lastActivity }) => {
    const [tip, setTip] = useState<string>('Analyzing your progress...');
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchTip = useCallback(async () => {
        setIsLoading(true);
        const newTip = await getPersonalizedTip({ calories, goal, lastActivity });
        setTip(newTip);
        setIsLoading(false);
    }, [calories, goal, lastActivity]);

    useEffect(() => {
        fetchTip();
    }, [fetchTip]);

    return (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4 my-4">
            <h3 className="text-lg font-bold text-brand-secondary mb-2">AI Coach's Tip</h3>
            {isLoading ? (
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-3 py-1">
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            ) : (
                <p className="text-dark-text dark:text-light-text">{tip}</p>
            )}
            <button onClick={fetchTip} disabled={isLoading} className="text-sm text-brand-primary mt-3 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed">
                Get a new tip
            </button>
        </div>
    );
};