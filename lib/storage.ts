import { defaultProjects, defaultPricing, defaultSubscriptions } from './defaults';
import type { Project, PricingGroup, Subscription } from './defaults';

// Lazy import so local dev (without Netlify) doesn't crash.
async function getStoreSafe() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore({ name: 'lbc-content', consistency: 'strong' });
  } catch {
    return null;
  }
}

const KEYS = {
  projects: 'projects',
  pricing: 'pricing',
  subscriptions: 'subscriptions',
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

// Public API
export const getProjects = () => read<Project[]>(KEYS.projects, defaultProjects);
export const setProjects = (v: Project[]) => write(KEYS.projects, v);

export const getPricing = () => read<PricingGroup[]>(KEYS.pricing, defaultPricing);
export const setPricing = (v: PricingGroup[]) => write(KEYS.pricing, v);

export const getSubscriptions = () =>
  read<Subscription[]>(KEYS.subscriptions, defaultSubscriptions);
export const setSubscriptions = (v: Subscription[]) =>
  write(KEYS.subscriptions, v);
