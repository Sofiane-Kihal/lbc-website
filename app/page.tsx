import HomeShell from '@/components/HomeShell';
import {
  getProjects,
  getPricing,
  getSubscriptions,
  getBanners,
} from '@/lib/storage';

// Always fresh — admin updates show immediately.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [projects, pricing, subscriptions, banners] = await Promise.all([
    getProjects(),
    getPricing(),
    getSubscriptions(),
    getBanners(),
  ]);

  return (
    <HomeShell
      projects={projects}
      pricing={pricing}
      subscriptions={subscriptions}
      banners={banners}
    />
  );
}
