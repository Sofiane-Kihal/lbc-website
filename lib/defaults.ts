// Default content — seeds for first run, also fallback if Blobs is unavailable.

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  cover: string; // gradient label or image URL
  description: string;
  scope: string[];
};

export type PricingTier = {
  label: string; // e.g. "1 canal"
  price: string; // e.g. "390€"
};

export type PricingItem = {
  id: string;
  name: string;
  price: string;
  highlight?: string;
  bullets: string[];
  // When true, the item is rendered as a compact row in an "à la carte"
  // sub-section under the main cards (used for podcast add-ons).
  compact?: boolean;
  // When present, the card shows a tier selector and the displayed price
  // animates between tiers. The base `price` field becomes a fallback.
  tiers?: PricingTier[];
};

export type PricingGroup = {
  id: string;
  title: string;
  description?: string;
  items: PricingItem[];
};

export type Subscription = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  bullets: string[];
  featured?: boolean;
  // When true, the subscription is shown in a compact "options" block
  // (used for add-ons like community moderation).
  compact?: boolean;
};

export const defaultProjects: Project[] = [
  {
    id: 'p1',
    slug: 'maison-laurel',
    title: 'Maison Laurel',
    client: 'Laurel Paris',
    category: 'Stratégie 360 + Production',
    year: '2025',
    cover: 'gradient:sage→moss',
    description:
      "Refonte complète de la présence digitale d'une maison de parfumerie indépendante : audit, stratégie social media et production de 12 films de marque.",
    scope: ['Audit', 'Stratégie 360°', 'Film de marque', 'Community management'],
  },
  {
    id: 'p2',
    slug: 'orso-restaurant',
    title: 'Orso',
    client: 'Restaurant Orso',
    category: 'Production locale',
    year: '2025',
    cover: 'gradient:moss→stone',
    description:
      "Local Express : 3 reels viraux pour un restaurant de quartier qui n'avait jamais fait de vidéo professionnelle.",
    scope: ['Reels', 'TikTok', 'Run & Gun'],
  },
  {
    id: 'p3',
    slug: 'studio-volt',
    title: 'Studio Volt',
    client: 'Volt Innovation',
    category: 'Film de marque',
    year: '2024',
    cover: 'gradient:sage→stone',
    description:
      "Film signature de 3 minutes pour la levée de fonds, écriture, tournage et étalonnage cinéma.",
    scope: ['Storyboard', 'Tournage', 'Étalonnage', 'Sound design'],
  },
  {
    id: 'p4',
    slug: 'podcast-impact',
    title: 'Impact Podcast',
    client: 'Impact Media',
    category: 'Podcast & shreds',
    year: '2025',
    cover: 'gradient:stone→cream',
    description:
      "Production hebdomadaire d'un podcast vidéo — 3 caméras Sony FX3, livraison en moins de 48h, 5 shreds par épisode.",
    scope: ['Multi-cam', 'Audio pro', 'Shreds', 'Diffusion'],
  },
  {
    id: 'p5',
    slug: 'bloom-retail',
    title: 'Bloom Retail',
    client: 'Bloom Concept',
    category: 'Community management',
    year: '2025',
    cover: 'gradient:moss→sage',
    description:
      "Truman Plus : 5 publications par semaine, ligne éditoriale et journée de tournage mensuelle.",
    scope: ['Ligne édito', 'Tournage mensuel', 'Stories', 'Modération'],
  },
  {
    id: 'p6',
    slug: 'altea-immobilier',
    title: 'Altéa',
    client: 'Altéa Immobilier',
    category: 'Stratégie & site web',
    year: '2024',
    cover: 'gradient:sage→cream',
    description:
      "Stratégie 360° + site web + campagne mailing pour une agence immobilière haut de gamme.",
    scope: ['Stratégie', 'Site web', 'SEO', 'Mailing'],
  },
];

export const defaultPricing: PricingGroup[] = [
  {
    id: 'accompagnement',
    title: 'Accompagnement stratégique',
    description: 'Audit, stratégie : on regarde avant de courir.',
    items: [
      {
        id: 'audit-sm',
        name: 'Audit Social Media',
        price: '390€',
        highlight: 'Tarif selon le nombre de canaux',
        bullets: [
          'État des lieux',
          'Indicateurs de performance',
          'Recommandations actionnables',
        ],
        tiers: [
          { label: '1 canal', price: '390€' },
          { label: '2 canaux', price: '590€' },
          { label: '3 canaux', price: '690€' },
        ],
      },
      {
        id: 'audit-360',
        name: 'Audit 360°',
        price: '990€',
        highlight: 'Site, plateforme, presse, social media',
        bullets: [
          "Vue d'ensemble de votre écosystème",
          'Concurrence',
          'Veille sectorielle',
          'Cible',
        ],
      },
      {
        id: 'strat-sm',
        name: 'Stratégie social media',
        price: '690€',
        highlight: 'Tarif selon le nombre de canaux',
        bullets: [
          'Persona',
          'Plan 3 à 6 mois',
          'Ligne éditoriale',
          'Calendrier',
        ],
        tiers: [
          { label: '1 canal', price: '690€' },
          { label: '2 canaux', price: '890€' },
          { label: '3 canaux', price: '1090€' },
        ],
      },
      {
        id: 'strat-360',
        name: 'Stratégie 360°',
        price: '1690€',
        highlight: '3 canaux + site + presse + SEO',
        bullets: [
          "Plan d'action global",
          'Budget',
          'Tableau social media',
          'Calendrier complet',
        ],
      },
    ],
  },
  {
    id: 'production',
    title: 'Production',
    description: 'On tourne, on monte, on livre.',
    items: [
      {
        id: 'p-local',
        name: 'Local Express',
        price: '450 — 550€',
        highlight: 'Idéal pour démarrer · Commerçants, artisans, restaurateurs',
        bullets: [
          '3 Reels / TikToks (30s à 1min30)',
          'Tournage 2h max — Run & Gun',
          'Montage dynamique optimisé algos',
          'Idéal pour tester le format',
        ],
      },
      {
        id: 'p-social',
        name: 'Social First',
        price: '1 500€',
        highlight: 'Meilleur rapport qualité / volume · Infopreneurs, marques D2C',
        bullets: [
          '5 à 10 Reels / TikToks',
          'Templates motion design personnalisés',
          'Étalonnage, sound design, sous-titres premium',
          '½ à 1 journée de tournage',
        ],
      },
      {
        id: 'p-immersion',
        name: 'Immersion',
        price: '1 500 — 2 500€',
        highlight: 'Multi-caméra · Conférences, interviews, événementiel',
        bullets: [
          '1 vidéo longue (3 à 5 min)',
          '5 shreds impactants',
          'Multi-cam FX3 + audio haute fidélité',
          'Étalonnage cinéma "Patte Artistique"',
        ],
      },
      {
        id: 'p-signature',
        name: 'Signature',
        price: '2 000 — 3 500€',
        highlight: 'Film de marque · PME, luxe, professions libérales',
        bullets: [
          'Storyboard à partir de votre brief',
          '1 film 1 à 5 min + 2 teasers courts',
          '1 journée de tournage (lumière, son, image)',
          'Image 4K, sound design pro',
        ],
      },
      {
        id: 'p-mesure',
        name: 'Sur mesure',
        price: 'Sur devis',
        highlight: 'TJM 650€ HT + frais techniques · Publicité, institutionnel',
        bullets: [
          'Écriture & brief créatif autonome',
          'Repérages & casting',
          'Direction artistique end-to-end',
          'Multi-formats',
        ],
      },
    ],
  },
  {
    id: 'podcast',
    title: 'Podcast',
    description: 'Studio équipé, captation à l\'heure, options pour aller plus loin.',
    items: [
      {
        id: 'pod-base',
        name: 'Tournage podcast',
        price: '95€ / h',
        highlight: '3 caméras Sony FX3 · 3 micros Shure SM7B',
        bullets: [
          'Table de mixage Rodecaster Pro II',
          'Enregistrement multi-caméras',
          'Audio professionnel',
          'Rushs livrés sous 48h',
        ],
      },
      {
        id: 'pod-pack',
        name: 'Pack Créateur Pro',
        price: '449€',
        highlight: 'Économisez 23% vs à la carte · 1h de tournage incluse',
        bullets: [
          'Montage version longue (intro / outro)',
          '5 contenus verticaux (Reels / Shorts)',
          '1 pack 10 photos pro',
          'Fond vert + prompteur inclus',
        ],
      },
      {
        id: 'pod-o1',
        name: 'Montage version longue',
        price: '225€ / h',
        highlight: 'avec intro / outro',
        bullets: [],
        compact: true,
      },
      {
        id: 'pod-o2',
        name: 'Pré-montage',
        price: '30€ / h',
        highlight: 'synchro A/V + changement caméra',
        bullets: [],
        compact: true,
      },
      {
        id: 'pod-o3',
        name: 'Livestream',
        price: '149€ / h',
        highlight: 'YouTube, Twitch...',
        bullets: [],
        compact: true,
      },
      {
        id: 'pod-o4',
        name: 'Format vertical',
        price: '30€ / unité',
        highlight: 'Reel / Short',
        bullets: [],
        compact: true,
      },
      {
        id: 'pod-o5',
        name: 'Fond vert',
        price: '25€ / session',
        bullets: [],
        compact: true,
      },
      {
        id: 'pod-o6',
        name: 'Prompteur',
        price: '25€ / session',
        bullets: [],
        compact: true,
      },
      {
        id: 'pod-o7',
        name: 'Miniature',
        price: '30€ / unité',
        bullets: [],
        compact: true,
      },
      {
        id: 'pod-o8',
        name: 'Pack 10 photos pro',
        price: '35€ / pack',
        bullets: [],
        compact: true,
      },
    ],
  },
];

export const defaultSubscriptions: Subscription[] = [
  {
    id: 's1',
    name: 'CM Smartphone',
    price: '790€',
    cadence: '/ mois',
    bullets: ['3 posts / semaine', 'Ligne éditoriale', 'Stories'],
  },
  {
    id: 's2',
    name: 'CM Truman',
    price: '1 090€',
    cadence: '/ mois',
    featured: true,
    bullets: ['3 posts / semaine', 'Ligne éditoriale', 'Stories', '½ journée de tournage'],
  },
  {
    id: 's3',
    name: 'CM Truman Plus',
    price: '1 690€',
    cadence: '/ mois',
    bullets: ['5 posts / semaine', 'Ligne éditoriale', 'Stories', '1 journée de tournage'],
  },
  {
    id: 's4',
    name: 'Modération',
    price: '100€',
    cadence: '/ mois',
    bullets: ['Modération des messages', 'Réponses DM'],
    compact: true,
  },
  {
    id: 's5',
    name: 'Gestion commentaires',
    price: '80€',
    cadence: '/ mois',
    bullets: ['Gestion des commentaires', 'Interactions'],
    compact: true,
  },
];
