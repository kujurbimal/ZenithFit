import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FoodItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface MacroChartProps {
  data: FoodItem[];
}

const COLORS = {
  protein: '#00A8FF', // brand-primary
  carbs: '#00E0C7', // brand-secondary
  fat: '#FFC107',
};

export const MacroChart: React.FC<MacroChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const totalMacros = data.reduce(
    (acc, item) => {
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const chartData = [
    { name: 'Protein', value: totalMacros.protein },
    { name: 'Carbs', value: totalMacros.carbs },
    { name: 'Fat', value: totalMacros.fat },
  ].filter(d => d.value > 0);

  if (chartData.length === 0) {
    return <div className="h-48 flex items-center justify-center text-medium-text-light dark:text-medium-text">Log a meal to see macros.</div>
  }

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
            ))}
          </Pie>
           <Tooltip 
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF', 
                border: `1px solid ${theme === 'dark' ? '#2D2D2D' : '#E0E7FF'}` 
              }} 
              itemStyle={{ color: theme === 'dark' ? '#E0E0E0' : '#111827' }} 
              formatter={(value) => `${Number(value).toFixed(1)}g`} 
            />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};