import React, { useState, useMemo } from 'react';
import { FoodItem } from '../types';
import { MOCK_MEALS, DAILY_GOAL } from '../constants';
import { MacroChart } from './MacroChart';
import { LogMealModal } from './LogMealModal';
import { AIAssistant } from './AIAssistant';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const MealCard: React.FC<{ title: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'; items: FoodItem[]; onAdd: () => void; }> = ({ title, items, onAdd }) => {
    const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

    return (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="text-xl font-bold text-dark-text dark:text-light-text">{title}</h3>
                    <p className="text-brand-secondary font-semibold">{totalCalories} Cal</p>
                </div>
                <button onClick={onAdd} className="bg-brand-primary rounded-full p-2 text-white hover:bg-opacity-90 transition-transform duration-200 hover:scale-110">
                    <PlusIcon />
                </button>
            </div>
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between text-medium-text-light dark:text-medium-text">
                        <span>{item.name}</span>
                        <span>{item.calories}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DietSection: React.FC = () => {
    const [meals, setMeals] = useState<FoodItem[]>(MOCK_MEALS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMealType, setActiveMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Breakfast');

    const totalCalories = useMemo(() => meals.reduce((sum, item) => sum + item.calories, 0), [meals]);
    const caloriesRemaining = DAILY_GOAL - totalCalories;
    const progress = Math.min((totalCalories / DAILY_GOAL) * 100, 100);

    const openModal = (mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks') => {
        setActiveMealType(mealType);
        setIsModalOpen(true);
    };
    
    const addFoodItem = (food: FoodItem) => {
        setMeals(prev => [...prev, food]);
    };

    const mealsByType = useMemo(() => {
        return meals.reduce((acc, meal) => {
            acc[meal.meal] = acc[meal.meal] || [];
            acc[meal.meal].push(meal);
            return acc;
        }, {} as Record<string, FoodItem[]>);
    }, [meals]);

    return (
        <div className="p-4 space-y-6">
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4 text-center">
                <h2 className="text-lg font-bold text-dark-text dark:text-light-text mb-2">Calories</h2>
                <div className="flex items-baseline justify-center space-x-2 sm:space-x-4 mb-4">
                    <div>
                        <p className="text-3xl sm:text-4xl font-bold text-brand-secondary">{totalCalories}</p>
                        <p className="text-medium-text-light dark:text-medium-text">Consumed</p>
                    </div>
                    <p className="text-3xl sm:text-4xl text-medium-text-light dark:text-medium-text">-</p>
                    <div>
                        <p className="text-3xl sm:text-4xl font-bold text-dark-text dark:text-light-text">{DAILY_GOAL}</p>
                        <p className="text-medium-text-light dark:text-medium-text">Goal</p>
                    </div>
                    <p className="text-3xl sm:text-4xl text-medium-text-light dark:text-medium-text">=</p>
                     <div>
                        <p className={`text-3xl sm:text-4xl font-bold ${caloriesRemaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>{caloriesRemaining}</p>
                        <p className="text-medium-text-light dark:text-medium-text">Remaining</p>
                    </div>
                </div>
                <div className="w-full bg-light-bg dark:bg-dark-bg rounded-full h-2.5">
                    <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
                <h2 className="text-lg font-bold text-dark-text dark:text-light-text text-center mb-2">Macronutrients</h2>
                <MacroChart data={meals} />
            </div>
            
            <AIAssistant calories={totalCalories} goal={DAILY_GOAL} lastActivity="10k Run" />

            <MealCard title="Breakfast" items={mealsByType.Breakfast || []} onAdd={() => openModal('Breakfast')} />
            <MealCard title="Lunch" items={mealsByType.Lunch || []} onAdd={() => openModal('Lunch')} />
            <MealCard title="Dinner" items={mealsByType.Dinner || []} onAdd={() => openModal('Dinner')} />
            <MealCard title="Snacks" items={mealsByType.Snacks || []} onAdd={() => openModal('Snacks')} />

            {isModalOpen && <LogMealModal onClose={() => setIsModalOpen(false)} onAddFood={addFoodItem} mealType={activeMealType} />}
        </div>
    );
};