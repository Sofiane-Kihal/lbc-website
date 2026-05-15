import {
  defaultProjects,
  defaultPricing,
  defaultSubscriptions,
  defaultBanners,
} from './defaults';
import type { Project, PricingGroup, Subscription, Banners } from './defaults';

// Lazy import so local dev (without Netlify) doesn't crash.
async function getStoreSafe() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore({ name: 'lbc-content', consistency: 'strong' });
  } catch {
    return null;
  }
}

async function getMediaStoreSafe() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore({ name: 'lbc-media' });
  } catch {
    return null;
  }
}

const KEYS = {
  projects: 'projects',
  pricing: 'pricing',
  subscriptions: 'subscriptions',
  banners: 'banners',
};

async function read<T>(key: string, fallback: T): Promise<T> {
  const store = await getStoreSafe();
  if (!store) return fallback;
  try {
    const data = await store.get(key, { type: 'json' });
    return (data as T) ?? fallback;
  } catch {
    return fallback;
  }
}

async function write<T>(key: string, value: T): Promise<boolean> {
  const store = await getStoreSafe();
  if (!store) return false;
  try {
    await store.setJSON(key, value);
    return true;
  } catch {
    return false;
  }
}

// Normalize legacy projects stored before `categories: string[]` existed
// (they had `category: string`). Keeps older blobs working without a manual
// data migration.
function normalizeProject(p: any): Project {
  if (Array.isArray(p.categories)) return p as Project;
  const legacy = typeof p.category === 'string' ? p.category : '';
  const { category, ...rest } = p ?? {};
  return {
    ...rest,
    categories: legacy ? [legacy] : [],
  } as Project;
}

// Public API
export const getProjects = async () => {
  const raw = await read<any[]>(KEYS.projects, defaultProjects);
  return Array.isArray(raw) ? raw.map(normalizeProject) : defaultProjects;
};
export const setProjects = (v: Project[]) => write(KEYS.projects, v);

export const getPricing = () => read<PricingGroup[]>(KEYS.pricing, defaultPricing);
export const setPricing = (v: PricingGroup[]) => write(KEYS.pricing, v);

export const getSubscriptions = () =>
  read<Subscription[]>(KEYS.subscriptions, defaultSubscriptions);
export const setSubscriptions = (v: Subscription[]) =>
  write(KEYS.subscriptions, v);

export const getBanners = async (): Promise<Banners> => {
  const data = await read<Partial<Banners>>(KEYS.banners, defaultBanners);
  return {
    logos: Array.isArray(data?.logos) ? data.logos : defaultBanners.logos,
    slogans: Array.isArray(data?.slogans) ? data.slogans : defaultBanners.slogans,
  };
};
export const setBanners = (v: Banners) => write(KEYS.banners, v);

// Media — stored separately from JSON content for cleaner lifecycle.
export type MediaUpload = {
  key: string;
  body: ArrayBuffer;
  contentType: string;
};

export async function setMedia({ key, body, contentType }: MediaUpload): Promise<boolean> {
  const store = await getMediaStoreSafe();
  if (!store) return false;
  try {
    await store.set(key, body, { metadata: { contentType } });
    return true;
  } catch {
    return false;
  }
}

export async function getMedia(
  key: string
): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  const store = await getMediaStoreSafe();
  if (!store) return null;
  try {
    const res = await store.getWithMetadata(key, { type: 'arrayBuffer' });
    if (!res) return null;
    const contentType =
      (res.metadata?.contentType as string | undefined) || 'application/octet-stream';
    return { body: res.data as ArrayBuffer, contentType };
  } catch {
    return null;
  }
}
