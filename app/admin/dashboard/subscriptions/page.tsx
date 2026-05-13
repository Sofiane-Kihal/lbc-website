import { getSubscriptions } from '@/lib/storage';
import SubscriptionsEditor from './SubscriptionsEditor';

export const dynamic = 'force-dynamic';

export default async function SubsAdminPage() {
  const items = await getSubscriptions();
  return <SubscriptionsEditor initial={items} />;
}
