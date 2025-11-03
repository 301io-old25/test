// app/wizard/page.tsx or pages/wizard/page.tsx
'use client';

import { useState } from 'react';
import { WizardTabs } from '@/components/wizard/WizardTabs';
import StepOne from '@/components/wizard/StepOne';
import StepTwo from '@/components/wizard/StepTwo';
import StepThree from '@/components/wizard/StepThree';
import StepFour from '@/components/wizard/StepFour';
import { Separator } from '@/components/ui/separator';
import { Download, Filter, Upload } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import StepFive from '@/components/wizard/StepFive';

export default function WizardPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  const handleNext = (data?: any) => {
    if (data) setFormData((prev: any) => ({ ...prev, ...data }));
    if (activeStep < 5) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return <StepOne onNext={handleNext} />;
      case 2:
        return (
          <StepTwo onNext={handleNext} onPrev={handlePrev} {...formData} />
        );
      case 3:
        return (
          <StepThree onNext={handleNext} onPrev={handlePrev} {...formData} />
        );
      case 4:
        return (
          <StepFour onNext={handleNext} onPrev={handlePrev} {...formData} />
        );
      case 5:
        return <StepFive onPrev={handlePrev} {...formData} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer scrollable={false}>
      <div className=''>
        <WizardTabs activeStep={activeStep} setActiveStep={setActiveStep} />
        <Separator className='mb-3' />
        {renderStep()}
      </div>
    </PageContainer>
  );
}
