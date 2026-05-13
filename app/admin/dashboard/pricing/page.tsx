import { getPricing } from '@/lib/storage';
import PricingEditor from './PricingEditor';

export const dynamic = 'force-dynamic';

export default async function PricingAdminPage() {
  const items = await getPricing();
  return <PricingEditor initial={items} />;
}
