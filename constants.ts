import { FoodItem, Activity, LeaderboardUser, WellnessMetric } from './types';

export const MOCK_MEALS: FoodItem[] = [
  { id: '1', name: 'Oatmeal with Berries', calories: 350, protein: 10, carbs: 60, fat: 8, meal: 'Breakfast' },
  { id: '2', name: 'Grilled Chicken Salad', calories: 450, protein: 40, carbs: 15, fat: 25, meal: 'Lunch' },
  { id: '3', name: 'Salmon with Quinoa', calories: 550, protein: 45, carbs: 40, fat: 20, meal: 'Dinner' },
  { id: '4', name: 'Protein Shake', calories: 250, protein: 30, carbs: 10, fat: 5, meal: 'Snacks' },
];

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 'a1', type: 'Run', userName: 'Jane Doe', userAvatar: 'https://picsum.photos/id/237/100', date: 'Today', distance: 10.2, duration: '55:12', pace: '5:24/km', mapImage: 'https://picsum.photos/seed/map1/600/300', kudos: 128, comments: 12 },
    { id: 'a2', type: 'Ride', userName: 'John Smith', userAvatar: 'https://picsum.photos/id/238/100', date: 'Yesterday', distance: 45.5, duration: '1:45:30', pace: '25.8 km/h', mapImage: 'https://picsum.photos/seed/map2/600/300', kudos: 256, comments: 23 },
    { id: 'a3', type: 'Run', userName: 'Alex Ray', userAvatar: 'https://picsum.photos/id/239/100', date: '2 days ago', distance: 5.0, duration: '28:45', pace: '5:45/km', mapImage: 'https://picsum.photos/seed/map3/600/300', kudos: 98, comments: 8 },
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { rank: 1, name: 'John S.', avatar: 'https://picsum.photos/id/238/100', distance: 210.4 },
    { rank: 2, name: 'Jane D.', avatar: 'https://picsum.photos/id/237/100', distance: 198.2 },
    { rank: 3, name: 'Chris P.', avatar: 'https://picsum.photos/id/240/100', distance: 180.9 },
    { rank: 4, name: 'You', avatar: 'https://picsum.photos/id/1/100', distance: 175.6 },
    { rank: 5, name: 'Alex R.', avatar: 'https://picsum.photos/id/239/100', distance: 160.1 },
];

export const MOCK_WELLNESS_DATA: WellnessMetric[] = [
    { name: 'Sleep', value: '7h 45m', unit: 'avg', trend: 'up', data: [{name: 'Mon', value: 7}, {name: 'Tue', value: 8}, {name: 'Wed', value: 6.5}, {name: 'Thu', value: 7.5}, {name: 'Fri', value: 8.5}, {name: 'Sat', value: 9}, {name: 'Sun', value: 7.5}] },
    { name: 'Sleep Quality', value: '88%', unit: 'score', trend: 'up', data: [{name: 'Mon', value: 82}, {name: 'Tue', value: 85}, {name: 'Wed', value: 80}, {name: 'Thu', value: 86}, {name: 'Fri', value: 90}, {name: 'Sat', value: 92}, {name: 'Sun', value: 88}] },
    { name: 'Heart Rate', value: '62', unit: 'bpm', trend: 'stable', data: [{name: 'Mon', value: 65}, {name: 'Tue', value: 63}, {name: 'Wed', value: 64}, {name: 'Thu', value: 62}, {name: 'Fri', value: 61}, {name: 'Sat', value: 62}, {name: 'Sun', value: 62}] },
    { name: 'Hydration', value: '2.5', unit: 'L', trend: 'down', data: [{name: 'Mon', value: 2.8}, {name: 'Tue', value: 3.0}, {name: 'Wed', value: 2.7}, {name: 'Thu', value: 2.5}, {name: 'Fri', value: 2.6}, {name: 'Sat', value: 2.4}, {name: 'Sun', value: 2.5}] },
    { name: 'Steps', value: '10,482', unit: 'daily avg', trend: 'up', data: [{name: 'Mon', value: 8000}, {name: 'Tue', value: 12000}, {name: 'Wed', value: 9500}, {name: 'Thu', value: 11000}, {name: 'Fri', value: 13000}, {name: 'Sat', value: 15000}, {name: 'Sun', value: 10482}] },
];

export const DAILY_GOAL = 2200;