// components/dashboard/stats-grid.tsx

import { StatCard } from "./stats";

export const StatsGrid = () => {
  const stats = [
    {
      title: 'Appointments',
      value: '10,000',
      change: '3.5%',
      trend: 'positive' as const
    },
    {
      title: 'Total Completed',
      value: '8,540',
      change: '2.5%',
      trend: 'neutral' as const
    },
    {
      title: 'Total Cancelled',
      value: '1,460',
      change: '2.5%',
      trend: 'negative' as const
    },
    {
      title: 'Total Refunded',
      value: '1,009',
      change: '1.5%',
      trend: 'positive' as const
    },
    {
      title: 'Active Contracts',
      value: '10,000',
      change: '3.5%',
      trend: 'positive' as const
    },
    {
      title: 'Expiring Contracts',
      value: '2,000',
      change: '7.2%',
      trend: 'negative' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          
        />
      ))}
    </div>
  );
};