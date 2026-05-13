import { getProjects } from '@/lib/storage';
import ProjectsEditor from './ProjectsEditor';

export const dynamic = 'force-dynamic';

export default async function ProjectsAdminPage() {
  const items = await getProjects();
  return <ProjectsEditor initial={items} />;
}
