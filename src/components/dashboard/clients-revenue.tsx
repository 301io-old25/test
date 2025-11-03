// components/dashboard/clients-revenue.tsx
'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';

export const ClientsRevenue = () => {
  const { state } = useSidebar();
  console.log(state);

  return (
    <div className='h-full rounded-2xl p-[1px]'>
      <div className='space-y-3 rounded-2xl bg-[linear-gradient(117.27deg,#074556_12.45%,#22CE6C_78.47%)] p-4'>
        {/* Total Clients */}
        <Card className='rounded-xl border border-gray-100 shadow-sm'>
          <CardContent className='flex items-center justify-start gap-3 p-0 px-3'>
            {/* Icon */}
            <div className='rounded-full bg-green-100 p-2 text-green-600'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M16 7a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
            </div>

            {/* Text */}
            <div className='flex items-end gap-2'>
              <span className='text-3xl font-semibold text-gray-900'>
                2,000
              </span>
              <span className='mb-[4px] text-sm text-gray-500'>
                Total Clients
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className='rounded-xl border border-gray-100 shadow-sm'>
          <CardContent className='p-0 px-4'>
            <div className='flex items-baseline justify-between'>
              <h3 className='mb-2 text-base font-medium text-gray-600'>
                Revenue
              </h3>
              <span className='rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white'>
                +2.8%
              </span>
            </div>

            <div className=''>
              <span
                className={`${
                  state === 'collapsed' ? 'text-[36px]' : 'text-3xl'
                } font-semibold text-[#00303f]`}
              >
                $987,289.27
              </span>
            </div>

            <div
              className={`mt-2 flex items-center justify-between text-gray-500 ${
                state === 'collapsed' ? 'text-sm' : 'text-[12px]'
              }`}
            >
              <span>vs prev. $501,641.73</span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='flex items-center gap-1'>
                    Jun 1 - Aug 31, 2025
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-2'>
                  <div className='text-sm text-gray-700'>
                    May 1 - Jul 31, 2025
                  </div>
                  <div className='text-sm text-gray-700'>
                    Mar 1 - May 31, 2025
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
