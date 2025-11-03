import { DonutChartCard } from './donot';

export default function ContractDashboard() {
  const chartData1 = [
    { name: 'Custom', value: 4000, color: '#8FD7B3' },
    { name: 'FFS', value: 1000, color: '#F9C87A' },
    { name: 'Government', value: 3000, color: '#3AD8FF' },
    { name: 'Retainer', value: 2000, color: '#8FA2FF' }
  ];

  const chartData2 = [
    { name: 'Leadership', value: 7000, color: '#4CC9F0' },
    { name: 'Meditation', value: 3000, color: '#A3A0FB' },
    { name: 'Psychometric Testing', value: 3000, color: '#E57373' },
    { name: 'Team Assessment', value: 3000, color: '#3AD8FF' }
  ];

  const chartData3 = [
    { name: 'Asia Pacific', value: 7000, color: '#4CC9F0' },
    { name: 'Americas', value: 3000, color: '#A3A0FB' },
    { name: 'EU', value: 3000, color: '#E57373' },
    { name: 'AU / NZ', value: 3000, color: '#3AD8FF' }
  ];

  const chartData4 = [
    { name: 'Monthly', value: 8000, color: '#7CE577' },
    { name: 'Yearly', value: 2000, color: '#FFD166' }
  ];

  return (
    <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
      <DonutChartCard title='Contract Type' total='10,000' data={chartData1} />
      <DonutChartCard title='Service Stream' total='10,000' data={chartData2} />
      <DonutChartCard
        title='Contract Region'
        total='10,000'
        data={chartData3}
      />
    </div>
  );
}
