'use client';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface WizardTabsProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const tabs = [
  { id: 1, title: 'Name Your Workflow' },
  { id: 2, title: 'Upload/Generate Document' },
  { id: 3, title: 'Compare & Assign Review' },
  { id: 4, title: 'Evaluation & Approval ' },
  { id: 5, title: 'Final Approval & Export' }
];

export function WizardTabs({ activeStep, setActiveStep }: WizardTabsProps) {
  return (
    <>
      <h1 className='text-2xl font-semibold'>Workflow Setup</h1>
      <div className='mt-3 mb-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveStep(tab.id)}
            className={cn(
              'relative flex h-32 cursor-pointer flex-col justify-center rounded-xl p-6 text-left shadow-md transition-all',
              activeStep === tab.id
                ? 'scale-105 bg-[#00A345] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <div className='absolute right-12 bottom-5 left-4 text-md leading-snug font-medium break-words'>
              {tab.title}
            </div>
            <div
              className={cn(
                'absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                activeStep === tab.id
                  ? 'bg-white text-blue-600'
                  : 'bg-white text-gray-600'
              )}
            >
              {tab.id}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}