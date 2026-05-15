import { getBanners } from '@/lib/storage';
import BannersEditor from './BannersEditor';

export const dynamic = 'force-dynamic';

export default async function BannersAdminPage() {
  const data = await getBanners();
  return <BannersEditor initial={data} />;
}
