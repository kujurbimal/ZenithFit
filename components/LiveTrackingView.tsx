import React, { useState, useEffect, useRef } from 'react';
import { LatLng } from '../types';
import { haversineDistance } from '../utils/geolocation';

interface LiveTrackingViewProps {
  activityType: 'Run' | 'Ride';
  onFinish: (data: { type: 'Run' | 'Ride'; distance: number; duration: string; route: LatLng[] }) => void;
  onCancel: () => void;
}

// Helper to format seconds into HH:MM:SS
const formatDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({ activityType, onFinish, onCancel }) => {
    const [status, setStatus] = useState<'requesting' | 'tracking' | 'paused' | 'error'>('requesting');
    const [error, setError] = useState<string | null>(null);

    const [duration, setDuration] = useState(0);
    const [distance, setDistance] = useState(0); // in km
    const [pace, setPace] = useState('0:00');
    
    const routeRef = useRef<LatLng[]>([]);
    const watchIdRef = useRef<number | null>(null);
    // FIX: Changed NodeJS.Timeout to number, which is the correct type for setInterval/clearInterval in a browser environment.
    const timerIdRef = useRef<number | null>(null);

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        if (timerIdRef.current !== null) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
        }
    };

    const handleFinish = () => {
        stopTracking();
        onFinish({
            type: activityType,
            distance: parseFloat(distance.toFixed(2)),
            duration: formatDuration(duration),
            route: routeRef.current,
        });
    };

    useEffect(() => {
        const startTracking = () => {
            if (!navigator.geolocation) {
                setError("Geolocation is not supported by your browser.");
                setStatus('error');
                return;
            }
            
            // Start timer
            timerIdRef.current = setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);

            // Start watching position
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    if(status === 'requesting') setStatus('tracking');

                    const newPoint: LatLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    
                    const lastPoint = routeRef.current.length > 0 ? routeRef.current[routeRef.current.length - 1] : null;

                    if (lastPoint) {
                        const newDistance = haversineDistance(lastPoint, newPoint);
                        setDistance(d => d + newDistance);
                    }
                    routeRef.current.push(newPoint);
                },
                (err) => {
                    if (err.code === err.PERMISSION_DENIED) {
                       setError("Location access was denied. Please enable it in your browser settings to track activities.");
                    } else {
                       setError("Could not get location. Please ensure GPS is enabled.");
                    }
                    setStatus('error');
                    stopTracking();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        };
        
        startTracking();

        return () => stopTracking(); // Cleanup on unmount
    }, []);

    // Effect to calculate pace whenever distance or duration changes
    useEffect(() => {
        if (distance > 0 && duration > 0) {
            if (activityType === 'Run') {
                const paceInSecondsPerKm = duration / distance;
                const minutes = Math.floor(paceInSecondsPerKm / 60);
                const remainingSeconds = Math.round(paceInSecondsPerKm % 60);
                setPace(`${minutes}:${remainingSeconds.toString().padStart(2, '0')} /km`);
            } else { // Ride
                const speedKph = distance / (duration / 3600);
                setPace(`${speedKph.toFixed(1)} km/h`);
            }
        } else {
            setPace(activityType === 'Run' ? '0:00 /km' : '0.0 km/h');
        }
    }, [distance, duration, activityType]);


    return (
        <div className="fixed inset-0 bg-dark-bg z-[100] flex flex-col p-4 text-light-text">
            <header className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">{activityType === 'Run' ? '🏃‍♂️' : '🚴‍♀️'} Live {activityType}</h2>
                <button onClick={onCancel} className="text-2xl">&times;</button>
            </header>

            {status === 'error' && (
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold text-red-500 mb-4">Tracking Error</h3>
                    <p>{error}</p>
                    <button onClick={onCancel} className="mt-8 bg-brand-primary text-white font-bold py-3 px-6 rounded-lg">
                        Go Back
                    </button>
                </div>
            )}
            
            {(status === 'tracking' || status === 'requesting') && (
                <div className="flex-grow flex flex-col justify-around items-center text-center">
                    <div>
                        <p className="text-lg text-medium-text">Duration</p>
                        <p className="text-7xl font-bold tracking-tighter">{formatDuration(duration)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 w-full">
                        <div>
                            <p className="text-lg text-medium-text">Distance</p>
                            <p className="text-5xl font-bold">{distance.toFixed(2)} <span className="text-3xl text-medium-text">km</span></p>
                        </div>
                        <div>
                            <p className="text-lg text-medium-text">Pace</p>
                            <p className="text-5xl font-bold">{pace.split(' ')[0]}</p>
                            <p className="text-xl text-medium-text">{pace.split(' ')[1]}</p>
                        </div>
                    </div>
                    {status === 'requesting' && <p className="text-brand-secondary">Waiting for GPS signal...</p>}
                    <button onClick={handleFinish} className="w-full max-w-sm bg-brand-secondary text-dark-bg font-bold py-4 rounded-lg text-xl hover:bg-opacity-90 transition-colors">
                        Finish
                    </button>
                </div>
            )}
        </div>
    );
};