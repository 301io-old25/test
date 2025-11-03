'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', value: 180 },
  { month: 'Feb', value: 220 },
  { month: 'Mar', value: 190 },
  { month: 'Apr', value: 210 },
  { month: 'May', value: 240 },
  { month: 'Jun', value: 200 },
  { month: 'Jul', value: 230 },
  { month: 'Aug', value: 250 },
  { month: 'Sep', value: 220 },
  { month: 'Oct', value: 240 }
];



export function ContractChart() {
  return (
    <div className='w-full space-y-6'>
      <Card>
        <CardHeader className='flex flex-col items-center justify-start'>
          <CardTitle className='text-left text-lg font-semibold'>
            Monthly Booked Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
                <XAxis
                  dataKey='month'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={[0, 250]}
                  ticks={[0, 50, 100, 150, 200, 250]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey='value' fill='#3b82f6' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Y-axis labels */}
          <div className='mt-4 flex items-end justify-evenly px-4'>
            <div className='flex flex-col items-center space-y-1'>
              <span className='text-xs text-gray-500 font-bold'>2025</span>
              <div className='h-px w-full bg-gray-200'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
