import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { LocationIcon } from './icons/LocationIcon';

export const WeatherWidget: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // In a real app, you would use position.coords.latitude and position.coords.longitude
                // to call a weather API. Here, we'll simulate the API call.
                setTimeout(() => {
                    const mockWeather: WeatherData = {
                        location: 'Current Location',
                        temperature: 24,
                        condition: 'Partly Cloudy',
                        icon: '⛅️',
                    };
                    setWeather(mockWeather);
                    setIsLoading(false);
                }, 1000); 
            },
            () => {
                setError("Unable to retrieve your location. Please enable location permissions.");
                setIsLoading(false);
            }
        );
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="animate-pulse flex items-center justify-between">
                    <div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2"></div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                    </div>
                    <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                </div>
            );
        }

        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }

        if (weather) {
            return (
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center text-medium-text-light dark:text-medium-text mb-1">
                            <LocationIcon className="w-4 h-4 mr-1" />
                            <h3 className="font-semibold">{weather.location}</h3>
                        </div>
                        <p className="text-sm text-dark-text dark:text-light-text">{weather.condition}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-5xl font-bold text-dark-text dark:text-light-text">{weather.temperature}°</p>
                        <p className="text-3xl -mt-2">{weather.icon}</p>
                    </div>
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
           {renderContent()}
        </div>
    );
};