import React, { useState } from 'react';
import { FoodItem } from '../types';
import { getFoodNutrition } from '../services/geminiService';

interface LogMealModalProps {
  onClose: () => void;
  onAddFood: (food: FoodItem) => void;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
}

interface FetchedFood {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export const LogMealModal: React.FC<LogMealModalProps> = ({ onClose, onAddFood, mealType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedFood, setFetchedFood] = useState<FetchedFood | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setFetchedFood(null);

    try {
      const nutritionData = await getFoodNutrition(searchQuery);
      setFetchedFood(nutritionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddFood = () => {
    if (fetchedFood) {
      onAddFood({
        ...fetchedFood,
        id: new Date().toISOString(),
        meal: mealType,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-light-card dark:bg-dark-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-light-border dark:border-dark-border transform transition-all duration-300 scale-95 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text dark:text-light-text">Log {mealType}</h2>
          <button onClick={onClose} className="text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text text-3xl">&times;</button>
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., '1 cup of oatmeal'"
            className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg p-3 mb-4 text-dark-text dark:text-light-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button type="submit" disabled={isLoading} className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isLoading ? 'Searching...' : 'Search Food'}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        
        {fetchedFood && (
          <div className="mt-6 p-4 bg-light-bg dark:bg-dark-bg rounded-lg border border-light-border dark:border-dark-border">
            <h3 className="text-xl font-semibold text-dark-text dark:text-light-text capitalize mb-2">{fetchedFood.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-medium-text-light dark:text-medium-text">
                <p><span className="font-bold text-dark-text dark:text-light-text">{fetchedFood.calories}</span> Calories</p>
                <p><span className="font-bold text-dark-text dark:text-light-text">{fetchedFood.protein}g</span> Protein</p>
                <p><span className="font-bold text-dark-text dark:text-light-text">{fetchedFood.carbs}g</span> Carbs</p>
                <p><span className="font-bold text-dark-text dark:text-light-text">{fetchedFood.fat}g</span> Fat</p>
            </div>
            <button onClick={handleAddFood} className="w-full bg-brand-secondary text-dark-bg font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors mt-4">
              Add to {mealType}
            </button>
          </div>
        )}
      </div>
      <style>{`.animate-scale-in { animation: scaleIn 0.2s ease-out forwards; } @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
};