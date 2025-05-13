import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

const DashboardCard = ({ title, value, change, icon }: DashboardCardProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-hot-pink transition">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-2xl font-bold text-neon-blue">{value}</p>
          <p className="text-sm text-gray-400">{change}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
};

export default DashboardCard;