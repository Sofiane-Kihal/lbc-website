# CLAUDE.md

Guide de référence pour Claude (ou tout assistant) qui travaille sur ce repo.
Ce fichier est lu automatiquement à chaque session : maintiens-le à jour quand
des conventions changent, mais reste **factuel et actionnable** — pas
d'historique narratif. Pour le tutoriel utilisateur, voir `README.md`.

---

## 1. Le projet en 30 secondes

Site web de **La Bande Créative**, agence de communication 360° basée à
**Mantes-la-Jolie**. C'est à la fois une vitrine et un outil de qualification
des prospects. Le tunnel de conversion principal va du Hero (CTA orange
"Parlez-nous de votre projet") jusqu'à la modale brief (15 questions
pédagogiques) ou jusqu'au formulaire rapide pour ceux qui ont déjà choisi un
abonnement.

**Promesse éditoriale** : "On allie création artistique et performance" —
c'est le fil rouge. Tout le contenu doit refléter cette double casquette.

---

## 2. Stack

| Élément          | Version    | Pourquoi                                          |
| ---------------- | ---------- | ------------------------------------------------- |
| Next.js          | 15.x (App) | RSC + middleware + Netlify Blobs natif            |
| React            | 19         | Imposé par Next 15                                |
| TypeScript       | 5.6        | Strict, paths `@/*`                               |
| Tailwind CSS     | 3.4        | Tokens custom dans `tailwind.config.ts`           |
| Framer Motion    | 12.x       | Animations + spring (cf. `SOFT_SPRING`)           |
| @netlify/blobs   | 8.x        | Stockage clé/valeur des contenus dynamiques      |
| jose             | 5.x        | JWT pour les sessions admin                       |
| lucide-react     | latest     | Icônes (cohérence : `size={14|16|18}` partout)   |

**Ne pas** retomber sur Next 14.x : plusieurs CVE high non backportées.
**Ne pas** ajouter d'autre lib d'animation — tout passe par framer-motion.

### Breaking changes Next 15 à garder en tête

- `cookies()` → **toujours `await cookies()`**, voir `lib/auth.ts`
- `params` / `searchParams` dans les pages dynamiques → **type `Promise<…>`** et
  `await params` avant utilisation. Voir `app/projets/[slug]/page.tsx` et
  `app/admin/page.tsx`

---

## 3. Identité graphique

### Palette (tokens Tailwind)

| Token       | Hex                  | Usage                                           |
| ----------- | -------------------- | ----------------------------------------------- |
| `sage`      | `#5D6EF4`            | Couleur principale (indigo). Texte, structures  |
| `sage-700`  | `#4854C8`            | Hovers, état foncé                              |
| `cream`     | `#FAF1E6`            | Fond des sections claires, texte sur indigo/noir |
| `stone`     | `#C7C0AE`            | Surfaces, fond de section neutre                |
| `moss`      | `#010101`            | **C'est le NOIR** (le nom est historique)       |
| `accent`    | `#FF6B35`            | Couleur d'attention (orange complémentaire)     |
| `accent-600`| `#E85420`            | Hover des CTA orange                            |

> **Important** : `moss` n'est plus vert — c'est noir. Le nom du token est
> resté pour éviter le grand find/replace mais ne pas créer de confusion :
> `bg-moss` = fond noir.

### Typographie

- **Playfair Display** (var `--font-playfair`) — titres, classe `font-display`,
  poids 700/800, italique pour les mots accentués
- **Montserrat** (var `--font-montserrat`) — corps, classe `font-body`,
  poids 300-700

### Rythme des sections

L'alternance cream / indigo / noir est **délibérée** (cf. neuro-marketing) :

```
Hero            cream + animations
LogoMarquee     indigo (réduit, sans label)
Projects        cream + dots pattern
Services        cream + drifting blobs
Marquee         noir (slogans)
Pricing         indigo (la grosse section)
Subscriptions   cream
Contact         noir (le grand final)
Footer          noir
```

Ne pas casser ce rythme sans raison : c'est lui qui empêche la sensation
"trop beige" du cream.

### Où utiliser l'orange

L'orange est **rare et précieux** — c'est ça qui le rend efficace.
Endroits où il vit :

- CTA primaire du Hero (`btn-accent`)
- Italique "qui performe" (Hero), "plus loin, ensemble" (Subs), "projet" (Contact)
- Stat `+248%` du Hero, stats `5 min · 48h · 0` du Contact
- Pastille `Le plus choisi` sur l'abonnement featured
- Halo qui pulse sur l'ampoule de la modale brief
- Points de séparation du marquee noir
- Pulsing dot de la bulle Pricing
- Quelques particules flottantes du Hero

**Ne pas** faire des CTA orange partout — ça tue l'attention. Le bouton du
nav, les boutons "Choisir", les boutons à l'intérieur des cartes restent
indigo (`btn-primary`).

---

## 4. Principes éditoriaux

C'est l'angle qui différencie l'agence — toujours le respecter :

1. **Stratégie avant production**. Une vidéo magnifique sans cible ne convertit
   pas. Le site éduque le prospect là-dessus sans être moralisateur.
2. **Viralité ≠ succès**. Les indicateurs (KPIs) dépendent de l'objectif.
3. **Toujours écrire "indicateurs" ou "indicateurs de performance"** dans le
   contenu visible — `KPI` ne reste qu'entre parenthèses dans des contextes
   pédagogiques.
4. **3 chemins d'engagement** clairement positionnés :
   - **À la carte** (section Pricing) : prestations one-shot, sans engagement,
     sans stratégie incluse
   - **En accompagnement** (Subscriptions) : packs mensuels pour ceux qui ont
     déjà une stratégie cadrée
   - **Sur-mesure** (Contact) : co-construction d'un dispositif adapté
5. **Tarifs = ordre de grandeur**. Tout projet réel donne lieu à un devis
   sur-mesure. Le ton est : *"on n'aime pas vendre des packages figés"*.
6. **Pédagogie sans condescendance**. Les insights de la modale brief
   expliquent *pourquoi* on pose chaque question. C'est de la valeur avant
   même le devis.

---

## 5. Organisation du code

```
app/
  layout.tsx                  Polices Google + metadata
  page.tsx                    Server component, fetch data, mount HomeShell
  globals.css                 Tokens CSS, classes utilitaires (.btn-primary, .card-soft)
  not-found.tsx
  projets/[slug]/page.tsx     Page projet dynamique (params async !)
  admin/                      Login + dashboard
  api/
    intake/route.ts           POST brief / quick contact (stocke dans lbc-leads)
    admin/{login,logout}      Auth
    admin/{projects,pricing,subscriptions}  GET / PUT (force-dynamic)
components/
  HomeShell.tsx               Composition client + état des modales
  Navigation.tsx              Header sticky
  Hero.tsx                    Section 1 (cream + animations)
  ProjectsGrid.tsx            Section 2
  Services.tsx                Section 3 (5 cartes asymétriques 2-2-2 / 3-3)
  Pricing.tsx                 Section 4 (indigo, à la carte)
    └── PricingCard           Composant interne avec gestion tiers
  Subscriptions.tsx           Section 5 (cards principales + encart options)
  Contact.tsx                 Section 6 (noir)
  Footer.tsx
  IntakeModal.tsx             Brief 15 questions (POST /api/intake)
  QuickContactModal.tsx       Contact rapide pré-rempli (POST /api/intake avec preset)
  InfoModal.tsx               Pop-up "à quoi ça sert" — RENDU VIA PORTAL (cf. §10)
  Marquee.tsx, LogoMarquee.tsx Bandeaux scrollants
  BackgroundFx.tsx            DriftingBlobs, FloatingParticles, DotsPattern, FloatingShapes
  Reveal.tsx                  Wrapper scroll-reveal + export SOFT_SPRING
lib/
  defaults.ts                 Types (Project, PricingItem, PricingTier, Subscription) + données par défaut
  storage.ts                  Wrapper Netlify Blobs (lecture/écriture, fallback defaults)
  auth.ts                     JWT + whitelist email + cookies async
  utils.ts                    cn, slugify, formatPrice
middleware.ts                 Protège /admin/dashboard et /api/admin/*
```

---

## 6. Patterns de composants

### Reveal au scroll + animations cohérentes

Toujours utiliser `<Reveal>` pour faire apparaître les blocs en haut des
sections. Pour les listes (cartes, items), utiliser `whileInView` avec
`transition={{ ...SOFT_SPRING, delay: i * 0.05 }}`.

```tsx
import Reveal, { SOFT_SPRING } from '@/components/Reveal';

<Reveal>
  <div>...header...</div>
</Reveal>

{items.map((item, i) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ ...SOFT_SPRING, delay: i * 0.05 }}
  />
))}
```

`SOFT_SPRING` = `{ type: 'spring', stiffness: 110, damping: 16, mass: 0.55 }`.
C'est le seul ressort utilisé sur le site — ne pas en inventer d'autre, sauf
cas particulier (la modale utilise un ressort plus rigide pour l'ouverture).

### Background animé d'une section

Toute section "vide" doit avoir des éléments de fond pour ne pas paraître
fade. Patterns disponibles :

```tsx
import { DriftingBlobs, DotsPattern, FloatingParticles } from './BackgroundFx';

// Section cream classique
<section className="relative overflow-hidden">
  <DriftingBlobs variant="cream" />
  <DotsPattern variant="sage" className="opacity-[0.06]" />
  <div className="container-wide relative">…</div>
</section>
```

- `<MouseSpotlight />` existe encore mais **n'est plus utilisé** — l'utilisateur
  l'a explicitement rejeté. Ne pas le réintroduire.
- `<FloatingShapes />` (carrés / ronds / croix) existe mais **plus utilisé** :
  remplacé par `<FloatingParticles />` (plus aérien) sur le Hero.

### Modales

Trois modales différentes, toutes via portal pour éviter le piège du
`transform` parent :

| Composant            | Quand                                            |
| -------------------- | ------------------------------------------------ |
| `IntakeModal`        | CTA "Parlez-nous de votre projet" → 15 questions |
| `QuickContactModal`  | "Choisir cet abonnement" → form pré-rempli       |
| `InfoModal`          | "À quoi ça sert ?" sur cartes Services           |

**Toujours utiliser un portal** (`createPortal(..., document.body)`) pour les
modales — sinon les `transform` framer-motion des cartes piègent le `position:
fixed`. Le pattern : `useState(mounted)` + `useEffect(() => setMounted(true))`
puis `if (!mounted) return null` avant le `createPortal`.

Fermeture : Esc + clic backdrop + bouton X. Lock du scroll body pendant
l'ouverture.

---

## 7. Données dynamiques (Netlify Blobs)

### Modèle

Trois "stores" :
- `lbc-content` (clé : `projects` | `pricing` | `subscriptions`) — éditables
  depuis `/admin`
- `lbc-leads` (clé : `lead_<timestamp>_<rand>`) — append-only, contient les
  briefs et quick-contacts

### Lecture / écriture

Toujours via `lib/storage.ts`. Les fonctions `getProjects/Pricing/Subscriptions`
**lisent les Blobs avec fallback sur `defaults.ts`** — donc le site fonctionne
en local même sans Blobs configuré.

```tsx
import { getProjects, setProjects } from '@/lib/storage';
```

### Pages qui dépendent des Blobs

Toujours `export const dynamic = 'force-dynamic'` sur les pages qui lisent
les Blobs (sinon Next 15 fige les valeurs au build et l'admin n'a aucun
effet visible).

---

## 8. Pricing & Subscriptions — schémas étendus

### `PricingItem.tiers?: PricingTier[]`

Quand renseigné, la carte affiche un sélecteur de variantes (ex : `1 canal /
2 canaux / 3 canaux`) et le prix s'anime entre les valeurs via
`AnimatePresence`. Voir `PricingCard` dans `Pricing.tsx`. Côté admin :
textarea au format `Label | Prix`, une ligne par variante.

### `PricingItem.compact?: boolean`

Quand `true`, l'item n'apparaît pas dans la grille principale mais dans
l'encart "Options à la carte" en bas (liste compacte). Utilisé pour les
add-ons podcast.

### `Subscription.compact?: boolean`

Même principe pour les abonnements : le flag `compact` envoie l'item dans
l'encart "Options à la carte" sous les cards principales (utilisé pour
Modération et Gestion commentaires). La grille principale s'adapte : 2 → 2 cols,
3 → 3 cols, 4 → 4 cols, 5+ → 3 cols.

### Pas de CTA dans les cartes Pricing

Décision UX : les cartes Pricing **n'ont volontairement pas de bouton "Choisir"**.
Les Subscriptions oui (vers `QuickContactModal`). Le contact général se fait
toujours via le CTA Hero ou la section Contact.

---

## 9. Admin

- URL : `/admin` (login email whitelist + mot de passe)
- Auth via JWT 12h, whitelist via env `ADMIN_EMAILS`
- Trois éditeurs : projets, tarifs (groupés), abonnements
- Chaque éditeur a un bouton **Enregistrer** (PUT vers `/api/admin/<entity>`)
  qui réécrit le store entier — pas de patch partiel
- L'admin doit toujours rester **simple et sans dépendance lourde** : tout
  est en form HTML natif + `useState`. Pas de RHF, pas de Zod côté UI

---

## 10. Gotchas vécus (à éviter de répéter)

1. **Modale piégée dans une carte** : framer-motion applique `transform` →
   `position: fixed` se réfère à la carte, pas au viewport. Toujours portal.

2. **Click outside ne ferme pas la modale** : si le backdrop est un sibling
   de la card, mettre l'`onClick={onClose}` **sur le conteneur fixed**, et
   `onClick={(e) => e.stopPropagation()}` sur la card. Pas l'inverse.

3. **Tailwind `rgba()` codé en dur** : si la couleur change, les ombres en
   `shadow-[0_8px_30px_rgba(86,98,72,0.06)]` deviennent fausses. Toujours
   utiliser le RGB de la couleur courante (`93,110,244` pour sage indigo).

4. **API routes GET `force-dynamic`** : sans ça, les GET admin peuvent être
   figés au build et l'admin afficher des données obsolètes après save.

5. **Vulnérabilités npm** : `npm audit` doit rester à 0. Si une vuln tombe
   sur une dépendance transitive, utiliser `overrides` dans `package.json`
   (cf. postcss).

6. **Le mot "Paris"** ne doit pas réapparaître dans les eyebrows / contenus —
   l'agence est à **Mantes-la-Jolie**.

7. **Reduced motion** : tous les composants animés portent
   `motion-reduce:!animate-none` sur les éléments décoratifs. Garder cette
   règle quand on en ajoute.

---

## 11. Vérifications avant de pousser

Toujours ces deux commandes en local avant un push :

```bash
npx tsc --noEmit         # Doit passer sans erreur
npx next build           # Doit passer (vérifie aussi les server components)
npm audit                # Doit afficher "found 0 vulnerabilities"
```

Le déploiement Netlify échoue dur sur la moindre erreur de build — pas de
deploy preview pour les commits locaux non poussés.

---

## 12. Tone of voice (pour toute copy à écrire)

- **Tutoiement** dans les contenus internes / docs / commentaires de code.
- **Vouvoiement** dans tous les textes face au visiteur (Hero, sections, CTA,
  modales).
- Phrases courtes. Tirets cadratin (`—`) volontiers.
- Pas de superlatifs creux ("le meilleur", "le numéro 1"). Si on en met,
  c'est appuyé par un chiffre ou un fait.
- Italiques sur 2 ou 3 mots maximum, jamais sur une phrase entière.
- L'orange souligne, jamais ne hurle. Si une nouvelle "punchline" est
  ajoutée, vérifier qu'elle ne fait pas concurrence à un orange existant.
