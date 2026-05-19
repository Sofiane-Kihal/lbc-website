import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/storage';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600; // sitemap mis à jour au max toutes les heures

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const now = new Date();

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projets/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...projectEntries,
  ];
}
