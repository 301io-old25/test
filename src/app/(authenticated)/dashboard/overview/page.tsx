// app/dashboard/page.tsx
import PageContainer from '@/components/layout/page-container';
import { StatsSection } from '@/components/dashboard/stats-section';

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        </div>
        {/* Stats Section */}
        <StatsSection />
        {/* You can add more sections here */}
      </div>
    </PageContainer>
  );
}