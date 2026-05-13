import HomeShell from '@/components/HomeShell';
import { getProjects, getPricing, getSubscriptions } from '@/lib/storage';

// Always fresh — admin updates show immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [projects, pricing, subscriptions] = await Promise.all([
    getProjects(),
    getPricing(),
    getSubscriptions(),
  ]);

  return (
    <HomeShell
      projects={projects}
      pricing={pricing}
      subscriptions={subscriptions}
    />
  );
}
