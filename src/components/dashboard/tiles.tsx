// app/dashboard/page.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Separator } from '../ui/separator';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { ChartContainer } from '../ui/chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Users',
        data: [4000, 7000, 4000, 16000, 7000, 8000],
        borderColor: '#60A5FA', // Tailwind blue-400
        backgroundColor: '#60A5FA33',
        tension: 0
      },
      {
        label: 'Visits',
        data: [11000, 14000, 11000, 6000, 12000, 15000],
        borderColor: '#A78BFA', // Tailwind purple-400
        backgroundColor: '#A78BFA33',
        tension: 0
      },
      {
        label: 'Registers',
        data: [7000, 4000, 7000, 1000, 4000, 3000],
        borderColor: '#F87171', // Tailwind red-400
        backgroundColor: '#F8717133',
        tension: 0
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
          usePointStyle: false,
          boxWidth: 13,
          boxHeight: 13,
          padding: 16,
          font: { size: 12 },
          generateLabels: (chart) => {
            return chart.data.datasets.map((dataset, i) => ({
              text: dataset.label || `Dataset ${i + 1}`, // fallback string
              fillStyle: dataset.borderColor as string,
              strokeStyle: dataset.borderColor as string,
              lineWidth: 1,
              hidden: !chart.isDatasetVisible(i),
              datasetIndex: i
            }));
          }
        }
      }
    },
    scales: {
      x: { grid: { drawOnChartArea: false } },
      y: { beginAtZero: true }
    }
  };
  return (
    <div className='mt-3 grid grid-cols-1 gap-6 md:grid-cols-3'>
      {/* MRR Card */}
      <div className=''>
        <Card className='flex flex-col gap-5'>
          <div className='px-4 text-sm font-bold text-[#525252]'>
            Monthly Recurring Revenue
          </div>
          <Separator className='p-0' />
          <div className='flex items-center'>
            <div className='px-4 text-3xl font-bold'>$ 136K</div>
            <div className='flex flex-col px-4 text-left'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='h-4 w-4 text-green-500' />
                <span className='text-sm text-green-500'>+3.4%</span>
              </div>
              <span className='text-sm text-gray-400'>Lorem ipsum dummy</span>
            </div>
          </div>
        </Card>

        {/* Plan Distribution Card */}
        <Card className='mt-4 flex flex-col gap-4'>
          <div className='flex items-center justify-between px-4'>
            <div className='text-sm font-bold text-[#525252]'>
              Plan Distribution
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Free</DropdownMenuItem>
                <DropdownMenuItem>Standard</DropdownMenuItem>
                <DropdownMenuItem>Pro</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator className='p-0' />
          <div className='relative mx-auto flex h-58 w-58 items-center justify-center'>
            {/* Outer ring */}
            <div className='absolute h-50 w-50 rounded-full border-8 border-gray-200' />
            <div className='absolute h-50 w-50 rotate-[45deg] rounded-full border-8 border-t-transparent border-r-transparent border-b-red-400 border-l-red-400' />

            {/* Middle ring */}
            <div className='absolute h-40 w-40 rounded-full border-8 border-gray-200' />
            <div className='absolute h-40 w-40 rotate-[60deg] rounded-full border-8 border-t-transparent border-r-transparent border-b-orange-400 border-l-orange-400' />

            {/* Inner ring */}
            <div className='absolute h-30 w-30 rounded-full border-8 border-gray-200' />
            <div className='absolute h-30 w-30 rotate-[90deg] rounded-full border-8 border-t-transparent border-r-transparent border-b-gray-700 border-l-gray-700' />
          </div>
          <div className='flex justify-evenly px-4 text-sm'>
            <span className='flex items-center gap-1'>
              <span className='h-3 w-3 bg-gray-700'></span> Free
            </span>
            <span className='flex items-center gap-1'>
              <span className='h-3 w-3 bg-orange-400'></span> Standard
            </span>
            <span className='flex items-center gap-1'>
              <span className='h-3 w-3 bg-red-400'></span> Pro
            </span>
          </div>
        </Card>
      </div>

      {/* User Growth Rate */}
      <Card className='col-span-1 md:col-span-2'>
        <div className='flex items-center justify-between px-4'>
          <div className='text-sm font-bold text-[#525252]'>
            User Growth Rate
          </div>
          <div className='flex gap-3'>
            <Button size='sm' variant='outline'>
              Export
            </Button>
            <Button size='sm' variant='outline'>
              Monthly
            </Button>
          </div>
        </div>
        <Separator className='p-0' />
        {/* Stats */}
        <div className='dark:bg-border mx-4 mb-2 grid grid-cols-2 gap-4 rounded-md bg-[#F6F6F6] p-4 md:grid-cols-4'>
          <div className='flex flex-col gap-2'>
            <div className='text-xs text-gray-500'>Users</div>
            <div className='text-3xl font-semibold'>7.6K</div>
            <span className='flex gap-3 text-sm text-green-500'>
              <TrendingUp />
              +12.8%
            </span>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-xs text-gray-500'>Visits</div>
            <div className='text-3xl font-semibold'>14.2K</div>
            <span className='flex gap-3 text-sm text-green-500'>
              <TrendingUp />
              +24.2%
            </span>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='text-xs text-gray-500'>Registers</div>
            <div className='text-3xl font-semibold'>1.3K</div>
            <span className='flex gap-3 text-sm text-red-500'>
              <TrendingDown />
              -3.8%
            </span>
          </div>
          <div className='dark:bg-border rounded-md bg-[#FFFFFF] p-5'>
            <div className='text-xs text-gray-500'>Trial Conversion Rate</div>
            <div className='text-3xl font-semibold'>2.1%</div>
          </div>
        </div>

        {/* Line Chart */}
        <div className='px-4'>
          <Line
            data={lineData}
            options={chartOptions}
            height={250}
            width={100}
          />
        </div>
      </Card>
    </div>
  );
}
