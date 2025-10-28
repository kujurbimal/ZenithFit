import React, { useEffect } from 'react';
import { Activity } from '../types';

interface MapModalProps {
  activity: Activity;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ activity, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-modal-title"
      aria-describedby="map-modal-description"
    >
      <div 
        className="relative bg-light-card dark:bg-dark-card rounded-2xl p-2 w-full max-w-3xl shadow-2xl border border-light-border dark:border-dark-border transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image/card
      >
        <h2 id="map-modal-title" className="sr-only">Enlarged Map View</h2>
        <p id="map-modal-description" className="sr-only">An enlarged view of your activity route including summary data. Press the Escape key or click the close button to dismiss.</p>

        <button 
          onClick={onClose} 
          className="absolute -top-4 -right-4 bg-brand-primary text-white rounded-full h-10 w-10 flex items-center justify-center text-2xl font-bold z-10 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close map view"
        >
          &times;
        </button>
        <img src={activity.mapImage} alt="Enlarged route map" className="w-full h-auto object-contain rounded-lg max-h-[80vh]" />

        <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm p-3 rounded-lg text-white">
          <div className="flex justify-between items-center text-sm sm:text-base">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-300">{activity.date}</p>
              <p className="font-bold text-base sm:text-lg">{activity.userName}'s {activity.type}</p>
            </div>
            <div className="flex space-x-4 text-right">
              <div>
                <p className="text-xs sm:text-sm text-gray-300">Distance</p>
                <p className="font-bold text-base sm:text-lg">{activity.distance} km</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-300">Time</p>
                <p className="font-bold text-base sm:text-lg">{activity.duration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; } 
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};