import React from 'react';
import { MOCK_WELLNESS_DATA } from '../constants';
import { WellnessMetric } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WeatherWidget } from './WeatherWidget';
import { useTheme } from '../contexts/ThemeContext';

const TrendArrow: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
    if (trend === 'up') return <span className="text-green-500">↑</span>;
    if (trend === 'down') return <span className="text-red-500">↓</span>;
    return <span className="text-medium-text-light dark:text-medium-text">-</span>;
};

const MetricCard: React.FC<{ metric: WellnessMetric }> = ({ metric }) => {
    const { theme } = useTheme();
    return (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-semibold text-dark-text dark:text-light-text">{metric.name}</h3>
                    <p className="text-sm text-medium-text-light dark:text-medium-text">{metric.unit}</p>
                </div>
                <p className="text-3xl font-bold text-brand-secondary flex items-center">
                    {metric.value}
                    <span className="ml-2 text-2xl"><TrendArrow trend={metric.trend} /></span>
                </p>
            </div>
            <div className="h-24 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metric.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <XAxis dataKey="name" stroke={theme === 'dark' ? '#A0A0A0' : '#6B7280'} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide={true} domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', 
                                border: `1px solid ${theme === 'dark' ? '#2D2D2D' : '#E0E7FF'}`,
                                borderRadius: '8px' 
                            }}
                            itemStyle={{ color: theme === 'dark' ? '#E0E0E0' : '#111827' }}
                            labelStyle={{ color: theme === 'dark' ? '#A0A0A0' : '#6B7280' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#00E0C7" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export const WellnessSection: React.FC = () => {
    return (
        <div className="p-4 space-y-6">
            <p className="text-medium-text-light dark:text-medium-text -mt-4">A holistic view of your health.</p>
            
            <WeatherWidget />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_WELLNESS_DATA.map(metric => <MetricCard key={metric.name} metric={metric} />)}
            </div>
        </div>
    );
};