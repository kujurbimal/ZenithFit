import React, { useState } from 'react';
import { Activity, LatLng } from '../types';

interface LogActivityModalProps {
  onClose: () => void;
  onAddActivity: (activityData: Omit<Activity, 'id' | 'userName' | 'userAvatar' | 'date' | 'kudos' | 'comments' | 'pace'>) => void;
  initialData?: {
    type: 'Run' | 'Ride';
    distance: number;
    duration: string;
    route?: LatLng[];
  } | null;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({ onClose, onAddActivity, initialData }) => {
  const [type, setType] = useState<'Run' | 'Ride'>(initialData?.type || 'Run');
  const [distance, setDistance] = useState(initialData?.distance.toString() || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [mapImage, setMapImage] = useState('');
  const [route, setRoute] = useState<LatLng[] | undefined>(initialData?.route);
  const [error, setError] = useState<string | null>(null);

  const isTrackedActivity = !!initialData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!distance || !duration) {
      setError('Please fill in both distance and duration.');
      return;
    }
    if (isNaN(Number(distance)) || Number(distance) <= 0) {
        setError('Please enter a valid positive number for distance.');
        return;
    }

    // Regular expression to validate HH:MM:SS or MM:SS format
    const durationRegex = /^(\d{1,2}:)?\d{1,2}:\d{2}$/;
    if (!durationRegex.test(duration.trim())) {
      setError('Please use a valid duration format (e.g., MM:SS or HH:MM:SS).');
      return;
    }

    const trimmedMapImage = mapImage.trim();
    onAddActivity({
      type,
      distance: Number(distance),
      duration: duration.trim(),
      mapImage: trimmedMapImage.length > 0 ? trimmedMapImage : `https://picsum.photos/seed/${Math.random()}/600/300`,
      route,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-light-card dark:bg-dark-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-light-border dark:border-dark-border transform transition-all duration-300 scale-95 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-dark-text dark:text-light-text">{isTrackedActivity ? 'Save Your Workout' : 'Log New Workout'}</h2>
          <button onClick={onClose} className="text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text text-3xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-medium-text-light dark:text-medium-text mb-2">Workout Type</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setType('Run')}
                disabled={isTrackedActivity}
                className={`w-full py-3 rounded-lg font-bold transition-colors ${type === 'Run' ? 'bg-brand-primary text-white' : 'bg-light-bg dark:bg-dark-bg text-dark-text dark:text-light-text'} disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                🏃‍♂️ Run
              </button>
              <button
                type="button"
                onClick={() => setType('Ride')}
                disabled={isTrackedActivity}
                className={`w-full py-3 rounded-lg font-bold transition-colors ${type === 'Ride' ? 'bg-brand-primary text-white' : 'bg-light-bg dark:bg-dark-bg text-dark-text dark:text-light-text'} disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                🚴‍♀️ Ride
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="distance" className="block text-medium-text-light dark:text-medium-text mb-2">Distance (km)</label>
            <input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              disabled={isTrackedActivity}
              placeholder="e.g., 10.5"
              className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg p-3 text-dark-text dark:text-light-text focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-70 disabled:bg-gray-200 dark:disabled:bg-gray-700"
              step="0.1"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-medium-text-light dark:text-medium-text mb-2">Duration</label>
            <input
              id="duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={isTrackedActivity}
              placeholder="e.g., 55:12 or 1:45:30"
              className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg p-3 text-dark-text dark:text-light-text focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-70 disabled:bg-gray-200 dark:disabled:bg-gray-700"
            />
          </div>
          
          {isTrackedActivity && (
             <p className="text-sm text-center text-green-500">Your route has been saved with this activity.</p>
          )}

          <div>
            <label htmlFor="mapImage" className="block text-medium-text-light dark:text-medium-text mb-2">Map Image URL (Optional)</label>
            <input
              id="mapImage"
              type="text"
              value={mapImage}
              onChange={(e) => setMapImage(e.target.value)}
              placeholder="https://example.com/map.png"
              className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg p-3 text-dark-text dark:text-light-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full bg-brand-secondary text-dark-bg font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors mt-4">
            Save Workout
          </button>
        </form>
      </div>
       <style>{`.animate-scale-in { animation: scaleIn 0.2s ease-out forwards; } @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
};