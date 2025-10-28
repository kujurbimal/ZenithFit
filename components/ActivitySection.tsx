import React, { useState } from 'react';
import { MOCK_ACTIVITIES, MOCK_LEADERBOARD } from '../constants';
import { Activity, LeaderboardUser } from '../types';
import { LogActivityModal } from './LogActivityModal';
import { MapModal } from './MapModal';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CheckIcon } from './icons/CheckIcon';

const ThumbsUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const LeaderboardItem: React.FC<{ user: LeaderboardUser }> = ({ user }) => (
    <li className={`flex items-center p-3 rounded-lg ${user.name === 'You' ? 'bg-brand-primary/20' : ''}`}>
        <span className="text-lg font-bold text-medium-text-light dark:text-medium-text w-8">{user.rank}</span>
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mx-4" />
        <span className="font-semibold text-dark-text dark:text-light-text flex-grow">{user.name}</span>
        <span className="font-bold text-brand-secondary">{user.distance.toFixed(1)} km</span>
    </li>
);

export const ActivitySection: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);


    const calculatePace = (type: 'Run' | 'Ride', distance: number, duration: string): string => {
        const parts = duration.split(':').map(Number).filter(n => !isNaN(n));
        if (parts.length < 2 || parts.length > 3) return 'N/A';

        let seconds = 0;
        if (parts.length === 3) { // HH:MM:SS
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) { // MM:SS
            seconds = parts[0] * 60 + parts[1];
        }

        if (distance <= 0 || seconds <= 0) return 'N/A';

        if (type === 'Run') {
            const paceInSecondsPerKm = seconds / distance;
            const minutes = Math.floor(paceInSecondsPerKm / 60);
            const remainingSeconds = Math.round(paceInSecondsPerKm % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}/km`;
        } else { // Ride
            const speedKph = distance / (seconds / 3600);
            return `${speedKph.toFixed(1)} km/h`;
        }
    };
    
    const handleAddActivity = (activityData: Omit<Activity, 'id' | 'userName' | 'userAvatar' | 'date' | 'kudos' | 'comments' | 'pace'>) => {
        const newActivity: Activity = {
            ...activityData,
            id: new Date().toISOString(),
            userName: 'You',
            userAvatar: 'https://picsum.photos/id/1/100',
            date: 'Just now',
            kudos: 0,
            comments: 0,
            pace: calculatePace(activityData.type, activityData.distance, activityData.duration),
        };
        setActivities(prev => [newActivity, ...prev]);
        setIsModalOpen(false);
    };

    const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const [justCopied, setJustCopied] = useState(false);
        const icon = activity.type === 'Run' ? '🏃‍♂️' : '🚴‍♀️';

        const handleShare = async () => {
          const summaryText = `Check out my ${activity.distance}km ${activity.type} on ZenithFit! It took me ${activity.duration}.`;
          
          if (navigator.share) {
            try {
              await navigator.share({
                title: `My ${activity.type} on ZenithFit`,
                text: summaryText,
                url: window.location.href,
              });
            } catch (error) {
              console.error('Error sharing:', error);
            }
          } else {
            // Fallback to copy to clipboard
            try {
              await navigator.clipboard.writeText(summaryText);
              setJustCopied(true);
              setTimeout(() => setJustCopied(false), 2000); // Reset after 2 seconds
            } catch (error) {
              console.error('Failed to copy:', error);
              alert('Failed to copy workout summary.');
            }
          }
        };

        return (
            <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
                {/* Clickable Summary */}
                <div
                    className="p-4 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); } }}
                    aria-expanded={isExpanded}
                    aria-controls={`activity-details-${activity.id}`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-center mb-3">
                            <img src={activity.userAvatar} alt={activity.userName} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-bold text-dark-text dark:text-light-text">{activity.userName}</p>
                                <p className="text-sm text-medium-text-light dark:text-medium-text">{activity.date}</p>
                            </div>
                        </div>
                         <ChevronDownIcon className={`w-6 h-6 text-medium-text-light dark:text-medium-text transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
    
                    <h3 className="text-xl font-semibold text-dark-text dark:text-light-text mb-2">{icon} {activity.type}</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-medium-text-light dark:text-medium-text">Distance</p>
                            <p className="text-xl font-bold text-brand-primary">{activity.distance} km</p>
                        </div>
                        <div>
                            <p className="text-sm text-medium-text-light dark:text-medium-text">Time</p>
                            <p className="text-xl font-bold text-brand-primary">{activity.duration}</p>
                        </div>
                        <div>
                            <p className="text-sm text-medium-text-light dark:text-medium-text">Pace</p>
                            <p className="text-xl font-bold text-brand-primary">{activity.pace}</p>
                        </div>
                    </div>
                </div>
                
                {/* Expandable Details */}
                <div
                    id={`activity-details-${activity.id}`}
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}
                >
                    {activity.mapImage && (
                        <button
                            onClick={() => setSelectedActivity(activity)}
                            className="w-full h-40 block cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-light-card dark:focus:ring-offset-dark-card"
                            aria-label="View larger map"
                            tabIndex={isExpanded ? 0 : -1}
                        >
                            <img src={activity.mapImage} alt="Route map" className="w-full h-full object-cover" />
                        </button>
                    )}
                    <div className="p-4 flex items-center justify-between text-medium-text-light dark:text-medium-text">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <ThumbsUpIcon />
                                <span>{activity.kudos}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <ChatIcon />
                                <span>{activity.comments}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleShare}
                            className="flex items-center space-x-2 bg-light-bg dark:bg-dark-bg px-3 py-2 rounded-lg hover:bg-light-border dark:hover:bg-dark-border transition-colors text-sm font-semibold disabled:opacity-70"
                            aria-label="Share this activity"
                            disabled={justCopied}
                            tabIndex={isExpanded ? 0 : -1}
                        >
                            {justCopied ? (
                                <>
                                    <CheckIcon className="w-4 h-4 text-green-500" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <ShareIcon className="w-4 h-4" />
                                    <span>Share</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Activity Feed</h2>
                     <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-brand-primary text-white rounded-full p-3 shadow-lg hover:bg-opacity-90 transition-transform duration-200 hover:scale-110"
                        aria-label="Log new workout"
                    >
                        <PlusIcon />
                    </button>
                </div>
                
                <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
                    <h2 className="text-2xl font-bold text-dark-text dark:text-light-text mb-4 text-center">Weekly Leaderboard</h2>
                    <ul className="space-y-2">
                        {MOCK_LEADERBOARD.map(user => <LeaderboardItem key={user.rank} user={user} />)}
                    </ul>
                </div>
                
                <div className="space-y-6">
                    {activities.map(activity => <ActivityCard key={activity.id} activity={activity} />)}
                </div>
            </div>
            {isModalOpen && <LogActivityModal onClose={() => setIsModalOpen(false)} onAddActivity={handleAddActivity} />}
            {selectedActivity && <MapModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
        </>
    );
};