export enum NavigationTab {
  Diet = 'Diet',
  Activity = 'Activity',
  Wellness = 'Wellness',
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Activity {
  id: string;
  type: 'Run' | 'Ride';
  userName: string;
  userAvatar: string;
  date: string;
  distance: number;
  duration: string;
  pace: string;
  mapImage: string;
  kudos: number;
  comments: number;
  route?: LatLng[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  distance: number;
}

export interface WellnessMetric {
  name: 'Sleep' | 'Heart Rate' | 'Hydration' | 'Steps' | 'Sleep Quality';
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  data: { name: string; value: number }[];
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
}