// components/dashboard/stats-section.tsx
import { StatsGrid } from './stats-grid';
import { ClientsRevenue } from './clients-revenue';
import ContractDashboard from './donot-stats';
import { ContractChart } from './graph-card';
import SecondContractDashboard from './second-donut';

export const StatsSection = () => {
  return (
    <>
      <div className='flex flex-col gap-3'>
        <div className='flex gap-3'>
          <div className='w-full max-w-[65%]'>
            <StatsGrid />
          </div>
          <div className='w-full max-w-[35%]'>
            <ClientsRevenue />
          </div>
        </div>
        <div>
          <ContractDashboard />
        </div>
        <div className='flex gap-3'>
          <ContractChart />
          <SecondContractDashboard />
        </div>
      </div>
    </>
  );
};
