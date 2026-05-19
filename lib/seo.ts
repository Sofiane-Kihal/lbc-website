// Single source of truth for SEO metadata + structured data.
// When updating the business profile (address, phone, social handles),
// edit BUSINESS below — every JSON-LD payload, the footer and the metadata
// derive from it.

import type { Project } from './defaults';

export const SITE_URL = 'https://labandecreative.fr';
export const SITE_NAME = 'La Bande Créative';
export const SITE_LOCALE = 'fr_FR';

// One-liner shown by Google under the title. Kept under 160 chars, anchored
// in the local market (Mantes-la-Jolie, Yvelines, 78, Île-de-France).
export const DEFAULT_DESCRIPTION =
  "Agence de communication 360° à Mantes-la-Jolie (Yvelines). Production vidéo, photo et stratégie digitale pour les marques qui veulent allier création artistique et performance.";

// Tagline used on the OG card and in the brand JSON-LD.
export const TAGLINE =
  "L'agence de communication qui allie création artistique et performance. Mantes-la-Jolie, Yvelines.";

export const BUSINESS = {
  legalName: 'La Bande Créative',
  email: 'contact@labandecreative.fr',
  // Format international (E.164) — utilisable tel quel dans `tel:` et le JSON-LD.
  phone: '+33767584222',
  // Forme lisible pour l'humain (affichée dans le footer / la page contact).
  phoneDisplay: '+33 7 67 58 42 22',
  street: '26 Rue Saint Roch',
  postalCode: '78200',
  city: 'Mantes-la-Jolie',
  region: 'Île-de-France',
  country: 'FR',
  // Coordonnées du centre de Mantes-la-Jolie — sert au geo schema même sans
  // adresse de rue, et alimente Google Maps en signal de localisation.
  geo: { latitude: 48.9909, longitude: 1.7188 },
  // Zones servies — visible dans Knowledge Graph + booste les recherches
  // "agence communication Yvelines / 78 / Mantes-la-Jolie".
  areaServed: [
    'Mantes-la-Jolie',
    'Mantes-la-Ville',
    'Magnanville',
    'Buchelay',
    'Limay',
    'Rosny-sur-Seine',
    'Yvelines',
    'Île-de-France',
  ],
  priceRange: '€€',
  foundingYear: 2024,
  // sameAs — laissé vide tant que les comptes officiels ne sont pas fournis ;
  // dès qu'ils existent, ils renforcent la fiche Knowledge Graph.
  sameAs: [] as string[],
};

// Service catalog — surfaced as offerCatalog on the LocalBusiness schema.
// Ces libellés sont ceux que tape un prospect sur Google : "production vidéo
// Mantes-la-Jolie", "stratégie social media Yvelines", etc.
export const SERVICE_CATALOG: Array<{ name: string; description: string }> = [
  {
    name: 'Production vidéo professionnelle',
    description:
      "Films de marque, reels, contenus social media et événementiel. Tournage multi-caméras Sony FX3, étalonnage et sound design pro.",
  },
  {
    name: 'Production photo professionnelle',
    description:
      "Shootings portraits, packshots et reportages. Visuels haute définition pensés pour vos réseaux et votre site.",
  },
  {
    name: 'Stratégie de communication 360°',
    description:
      "Audit, persona, ligne éditoriale et plan d'action multi-canal. La stratégie qui transforme avant la production.",
  },
  {
    name: 'Community management',
    description:
      "Gestion mensuelle de vos réseaux sociaux : édito, posts, stories, modération. À Mantes-la-Jolie et dans les Yvelines.",
  },
  {
    name: 'Podcast vidéo',
    description:
      "Studio équipé 3 caméras Sony FX3 et 3 micros Shure SM7B. Captation, montage et déclinaisons formats courts.",
  },
];

/* --------------------------- JSON-LD BUILDERS --------------------------- */

function postalAddressLd() {
  // Omitted entirely when no street is configured — incomplete addresses
  // hurt more than they help.
  if (!BUSINESS.street) return null;
  return {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.street,
    postalCode: BUSINESS.postalCode,
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    addressCountry: BUSINESS.country,
  };
}

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/og.png`,
    email: BUSINESS.email,
    ...(BUSINESS.phone ? { telephone: BUSINESS.phone } : {}),
    ...(BUSINESS.sameAs.length > 0 ? { sameAs: BUSINESS.sameAs } : {}),
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function localBusinessLd() {
  const address = postalAddressLd();
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/og.png`,
    email: BUSINESS.email,
    ...(BUSINESS.phone ? { telephone: BUSINESS.phone } : {}),
    ...(address ? { address } : {}),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),
    priceRange: BUSINESS.priceRange,
    foundingDate: String(BUSINESS.foundingYear),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Prestations',
      itemListElement: SERVICE_CATALOG.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.description,
          areaServed: BUSINESS.areaServed,
          provider: { '@id': `${SITE_URL}/#organization` },
        },
      })),
    },
    ...(BUSINESS.sameAs.length > 0 ? { sameAs: BUSINESS.sameAs } : {}),
  };
}

export function breadcrumbLd(
  trail: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}

export function creativeWorkLd(project: Project) {
  const url = `${SITE_URL}/projets/${project.slug}`;
  const image =
    project.cover.startsWith('http') || project.cover.startsWith('/api/media/')
      ? project.cover.startsWith('http')
        ? project.cover
        : `${SITE_URL}${project.cover}`
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.description,
    url,
    ...(image ? { image } : {}),
    inLanguage: 'fr-FR',
    dateCreated: project.year,
    keywords: [...project.categories, ...project.scope].join(', '),
    creator: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    about: project.client,
  };
}

/* ------------------------------ HELPERS -------------------------------- */

// Embed a JSON-LD blob as a Next-friendly <script> payload.
export function jsonLdScript(payload: object) {
  return {
    __html: JSON.stringify(payload),
  };
}
