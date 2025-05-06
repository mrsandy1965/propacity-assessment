import { ReviewInsightsDashboard } from '@/components/review-insights-dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <ReviewInsightsDashboard />
    </main>
  );
}
