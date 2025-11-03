import { DonutChartCard } from './donot';

export default function SecondContractDashboard() {
  const chartData4 = [
    { name: 'Coaching Session', value: 4000, color: '#8FD7B3' },
    { name: 'Meditation', value: 1000, color: '#F9C87A' },
    { name: 'Psychometric Testing', value: 3000, color: '#3AD8FF' },
    { name: 'Webinar', value: 2000, color: '#8FA2FF' },
    { name: 'Workshop', value: 3000, color: '#3AD8FF' },
    { name: 'Government', value: 3000, color: '#8FD7B3' }
  ];

  return (
    <div className=''>
      <DonutChartCard
        title='Contract Region'
        total='10,000'
        data={chartData4}
      />
    </div>
  );
}
