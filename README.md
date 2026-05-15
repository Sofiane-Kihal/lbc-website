# La Bande Créative — Site web

Bienvenue. Ce README t'accompagne **pas à pas**, en partant du principe que tu n'as
jamais déployé un site Next.js sur Netlify. Lis dans l'ordre, ne saute pas d'étape :
chaque section dépend de la précédente.

---

## Sommaire

1. [Ce qu'est ce projet (en 30 secondes)](#1-ce-quest-ce-projet)
2. [Pré-requis à installer une seule fois sur ta machine](#2-pré-requis)
3. [Lancer le site en local](#3-lancer-le-site-en-local)
4. [Comprendre les variables d'environnement](#4-variables-denvironnement)
5. [Mettre le code sur GitHub](#5-mettre-le-code-sur-github)
6. [Déployer sur Netlify (première fois)](#6-déployer-sur-netlify)
7. [Configurer les variables d'environnement sur Netlify](#7-variables-sur-netlify)
8. [Activer Netlify Blobs (stockage des contenus)](#8-netlify-blobs)
9. [Vérifier que tout fonctionne en prod](#9-vérification-en-production)
10. [Workflow quotidien : modifier puis redéployer](#10-workflow-quotidien)
11. [Utiliser l'espace admin](#11-espace-admin)
12. [Dépannage — les erreurs fréquentes](#12-dépannage)
13. [Architecture du projet (pour les curieux)](#13-architecture)

---

## 1. Ce qu'est ce projet

C'est un **site web de A à Z** pour ton agence, construit avec :

- **Next.js 15** (avec React 19) : le framework qui gère les pages, les composants et le rendu serveur.
- **Tailwind CSS** : les styles (couleurs, espacements, polices).
- **Framer Motion** : les animations.
- **Netlify** : l'hébergeur où le site est mis en ligne.
- **Netlify Blobs** : un petit stockage clé/valeur fourni par Netlify, où l'on
  garde les projets, les tarifs et les abonnements éditables depuis l'admin.

Le site **se met à jour tout seul** quand tu pousses du code sur la branche `main` de
GitHub. Les modifications faites depuis l'espace admin (`/admin`) sont enregistrées
directement dans Netlify Blobs et visibles immédiatement, **sans redéploiement**.

---

## 2. Pré-requis

À installer **une seule fois** sur ton ordinateur (MacOS) :

### 2.1 Node.js (version 20 ou plus)

Vérifie d'abord si tu l'as déjà :

```bash
node -v
```

Si tu vois `v20.x.x` ou plus, tu es bon. Sinon, installe-le :

- Soit depuis [nodejs.org](https://nodejs.org) (télécharge la version LTS).
- Soit via Homebrew : `brew install node`.

### 2.2 Git

```bash
git --version
```

Sur Mac, Git est en général déjà installé. Sinon : `brew install git`.

### 2.3 Un compte GitHub

Crée un compte gratuit sur [github.com](https://github.com) si tu n'en as pas.

### 2.4 Un compte Netlify

Crée un compte gratuit sur [netlify.com](https://app.netlify.com/signup). Connecte-toi
**avec GitHub**, ça simplifiera tout par la suite.

---

## 3. Lancer le site en local

« En local » = sur ton ordinateur, sans qu'il soit publié sur internet.

### 3.1 Va dans le dossier du projet

```bash
cd /Users/sofiane/Development/LBC/website
```

### 3.2 Installe les dépendances

Cette commande télécharge tous les paquets dont le projet a besoin (dans un dossier
`node_modules/`). C'est à faire **une fois**, puis à chaque fois que `package.json`
change.

```bash
npm install
```

### 3.3 Crée ton fichier d'environnement local

Le fichier `.env.example` est un **modèle**. Tu vas en faire une copie nommée
`.env.local` (ce dernier est ignoré par Git, donc tes secrets ne partiront jamais sur
GitHub) :

```bash
cp .env.example .env.local
```

Ouvre `.env.local` et remplis les valeurs. Le détail de chaque variable est
dans la [section 4](#4-variables-denvironnement).

### 3.4 Démarre le serveur de dev

```bash
npm run dev
```

Tu verras un message du style :

```
▲ Next.js 15.x
- Local:        http://localhost:3000
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur. Toute
modification du code se reflète **automatiquement** dans le navigateur (hot reload).

> 💡 En local, **Netlify Blobs n'est pas branché** — c'est normal. Le site affiche les
> contenus par défaut définis dans `lib/defaults.ts`. Pour tester l'admin avec une vraie
> persistance, déploie d'abord sur Netlify (étapes 5 à 8).

Pour arrêter le serveur : `Ctrl + C` dans le terminal.

---

## 4. Variables d'environnement

Une variable d'environnement, c'est une **valeur secrète** (mot de passe, clé) que
le code utilise sans qu'elle apparaisse dans les fichiers versionnés.

Le fichier `.env.example` te liste les variables nécessaires. Voici comment les
remplir :

| Variable          | À quoi ça sert                                                         | Comment la générer                                                                  |
| ----------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `ADMIN_EMAILS`    | Liste (séparée par des virgules) des emails autorisés à se connecter à `/admin` | Tes emails et ceux de ton équipe : `sofiane@labandecreative.com,marie@labandecreative.com` |
| `ADMIN_PASSWORD`  | Mot de passe **partagé** par toute l'équipe pour l'admin               | Choisis un mot de passe fort. Tu peux en générer un avec `openssl rand -base64 24`  |
| `SESSION_SECRET`  | Clé secrète qui signe les cookies de session (sécurité)                | **Doit faire au moins 32 caractères aléatoires**. Génère-la avec `openssl rand -base64 48` |
| `CONTACT_EMAIL`   | (Optionnel) email où tu veux recevoir les briefs prospects             | `contact@labandecreative.fr`                                                         |

**Génère un `SESSION_SECRET` maintenant** dans ton terminal :

```bash
openssl rand -base64 48
```

Copie le résultat dans ton `.env.local` :

```
SESSION_SECRET=ton-resultat-aleatoire-ici
```

> ⚠️ **Ne mets jamais** ce fichier `.env.local` sur GitHub. Le `.gitignore` t'en protège
> déjà — vérifie quand même avec `git status` que tu ne le vois pas avant de commit.

---

## 5. Mettre le code sur GitHub

Pour que Netlify puisse déployer le site, il doit être hébergé sur GitHub.

### 5.1 Crée un dépôt sur GitHub

1. Va sur [github.com/new](https://github.com/new).
2. Nom du dépôt : `lbc-website` (ou ce que tu veux).
3. Choisis **Private** (recommandé).
4. **Ne coche rien** (pas de README, pas de .gitignore, pas de licence — on en a déjà).
5. Clique **Create repository**.

GitHub t'affiche ensuite l'URL du dépôt, du genre
`https://github.com/ton-pseudo/lbc-website.git`.

### 5.2 Initialise Git localement et pousse le code

Dans ton terminal, depuis le dossier du projet :

```bash
cd /Users/sofiane/Development/LBC/website

git init
git add .
git commit -m "Initial commit — site La Bande Créative"
git branch -M main
git remote add origin https://github.com/ton-pseudo/lbc-website.git
git push -u origin main
```

> 💡 Si Git te demande de t'identifier, GitHub t'indiquera la marche à suivre
> (généralement : créer un **Personal Access Token** dans Settings → Developer settings,
> ou utiliser `gh auth login` si tu as la CLI GitHub).

Recharge la page GitHub : tu dois voir tous les fichiers.

---

## 6. Déployer sur Netlify

### 6.1 Importer le dépôt

1. Va sur [app.netlify.com](https://app.netlify.com).
2. Clique **Add new site** → **Import an existing project**.
3. Choisis **Deploy with GitHub** → autorise Netlify à accéder à ton compte.
4. Sélectionne le dépôt `lbc-website`.

### 6.2 Configurer le build

Netlify détecte automatiquement Next.js. Vérifie que tu as :

| Champ                 | Valeur            |
| --------------------- | ----------------- |
| Branch to deploy      | `main`            |
| Build command         | `npm run build`   |
| Publish directory     | `.next`           |

> ⚠️ **Ne lance pas encore le déploiement** — il faut d'abord ajouter les variables
> d'environnement (étape suivante), sinon le login admin ne marchera pas.

Clique **Add environment variables** (en bas du formulaire de déploiement).

---

## 7. Variables sur Netlify

Ajoute exactement les **mêmes variables** que dans ton `.env.local`, mais avec des
**valeurs de production** (mot de passe différent recommandé).

| Key               | Value (exemple)                                  |
| ----------------- | ------------------------------------------------ |
| `ADMIN_EMAILS`    | `sofiane@labandecreative.com`                    |
| `ADMIN_PASSWORD`  | un mot de passe fort, **différent du local**     |
| `SESSION_SECRET`  | une nouvelle valeur générée par `openssl rand -base64 48` |
| `CONTACT_EMAIL`   | `contact@labandecreative.fr`                      |

> 💡 Si tu as déjà déployé et que tu veux les ajouter après coup : Netlify dashboard
> → ton site → **Site configuration** → **Environment variables** → **Add a variable**.
> Après l'ajout, va dans **Deploys** et clique **Trigger deploy** → **Deploy site**
> pour relancer le build avec les nouvelles variables.

Maintenant tu peux cliquer **Deploy site**. Le build prend environ 2-3 minutes la
première fois.

À la fin, tu obtiens une URL du genre `https://random-name-12345.netlify.app`. Tu
peux la personnaliser dans **Site configuration** → **Site information** → **Change
site name**.

---

## 8. Netlify Blobs

**Bonne nouvelle : tu n'as rien à faire.**

Netlify Blobs est activé automatiquement pour tous les sites Next.js déployés sur
Netlify. Les contenus que tu modifies depuis l'admin (`/admin`) sont stockés dans
deux « bacs » :

- `lbc-content` — projets, tarifs, abonnements
- `lbc-leads` — briefs prospects soumis depuis le bouton « Parlez-nous de votre projet »

Pour les inspecter : Netlify dashboard → ton site → **Blobs** (dans la barre latérale).

> ⚠️ Tant que personne n'a modifié quoi que ce soit dans l'admin, les Blobs sont
> vides — c'est normal. Le site affiche alors les **contenus par défaut** de
> `lib/defaults.ts`. Dès la première sauvegarde, les Blobs prennent le relais.

---

## 9. Vérification en production

Ouvre l'URL de ton site Netlify. Vérifie dans l'ordre :

1. **L'accueil s'affiche** avec les 6 sections.
2. Le bouton **Parlez-nous de votre projet** ouvre la modale de 15 questions.
3. Soumets un brief de test → tu vois la confirmation. Va dans Netlify dashboard
   → **Blobs** → `lbc-leads` : tu dois voir un fichier qui commence par `lead_…`.
4. Va sur `https://ton-site.netlify.app/admin`.
5. Connecte-toi avec un email **listé** dans `ADMIN_EMAILS` + le mot de passe.
6. Modifie un projet (par exemple change un titre) → **Enregistrer**.
7. Reviens sur l'accueil → la modification est visible **immédiatement**.

Si tout ça fonctionne, tu es bon. 🎉

---

## 10. Workflow quotidien

Une fois le site en ligne, voici ton flux de travail.

### A. Modifier le **contenu** (projets, tarifs, abonnements)

➜ Va dans `/admin` sur le site en ligne. C'est instantané, **pas besoin de redéployer**.

### B. Modifier le **code** (design, nouvelle section, copy de la home, etc.)

```bash
cd /Users/sofiane/Development/LBC/website

# Lance le dev en local pour voir tes changements
npm run dev
```

Modifie les fichiers, vérifie sur [http://localhost:3000](http://localhost:3000),
puis quand tu es content :

```bash
git add .
git commit -m "Description courte de ce que tu as changé"
git push
```

Netlify détecte le push, lance un build automatique, et publie en 2-3 minutes.
Tu peux suivre le build en direct dans Netlify → **Deploys**.

### C. Vérifier qu'il n'y a pas d'erreurs avant de pousser

Optionnel mais recommandé :

```bash
npm run typecheck   # vérifie les types TypeScript
npm run build       # lance le build de prod localement
```

Si l'un des deux échoue, **ne pousse pas** — corrige d'abord. Sinon le build
échouera côté Netlify et le site ne se mettra pas à jour.

---

## 11. Espace admin

### Connexion

`https://ton-site.netlify.app/admin`

- **Email** : doit être dans la variable `ADMIN_EMAILS`.
- **Mot de passe** : la valeur de `ADMIN_PASSWORD`.

La session dure **12 heures**, puis il faut se reconnecter.

### Que peut-on faire ?

- **Projets** : ajouter, modifier, supprimer, ré-ordonner. Couverture = URL
  d'image (Unsplash, Cloudinary…) ou un dégradé prédéfini.
- **Tarifs** : organisés en groupes (Accompagnement, Production, Options…). Tu
  peux créer de nouveaux groupes, ajouter des lignes, modifier le prix (texte
  libre), les bullets, le surtitre.
- **Abonnements** : gérer les offres mensuelles. L'étoile permet de marquer
  l'offre « phare » (mise en avant visuellement sur le site).

### Ajouter / retirer un email autorisé

C'est une variable d'env Netlify. Mets à jour `ADMIN_EMAILS` (séparé par des
virgules) puis **redéploie** (Deploys → Trigger deploy).

### Changer le mot de passe

Idem : modifie `ADMIN_PASSWORD` sur Netlify, redéploie. Préviens l'équipe.

### Récupérer les briefs prospects

Pour l'instant, ils sont stockés dans Netlify Blobs (`lbc-leads`). Tu peux les
consulter directement dans le dashboard Netlify → **Blobs** → `lbc-leads`.

> 🔮 Évolution future possible : brancher l'envoi par email (SendGrid / Resend) ou
> vers ton CRM. C'est une 30aine de lignes à ajouter dans `app/api/intake/route.ts`.

---

## 12. Dépannage

### « Email ou mot de passe invalide » alors que je viens de tout configurer

- Vérifie que ton email est bien dans `ADMIN_EMAILS` (en minuscules, sans espace
  superflu).
- Vérifie que tu as bien **redéployé** après avoir ajouté/modifié les variables
  d'env (les variables ne sont prises en compte qu'au build).
- Vérifie qu'il n'y a pas de retour à la ligne / espace caché collé avec le mot
  de passe.

### Le build Netlify échoue

Va dans **Deploys** → clique sur le déploiement raté → lis les logs en bas. La
plupart du temps :

- Une variable d'env manquante (`SESSION_SECRET` notamment).
- Une erreur TypeScript (lance `npm run typecheck` en local pour la voir).
- `node` en mauvaise version : vérifie que `netlify.toml` indique bien
  `NODE_VERSION = "20"`.

### Mes modifications dans `/admin` ne s'affichent pas sur le site public

- Recharge la page **avec `Cmd + Shift + R`** (vide le cache).
- Vérifie dans **Blobs** → `lbc-content` que les fichiers `projects`, `pricing`
  ou `subscriptions` ont bien été créés/modifiés.

### En local, l'admin me dit « Storage indisponible »

C'est normal : Netlify Blobs ne fonctionne que sur Netlify. Pour tester l'admin
en vrai, déploie sur Netlify (même sur une URL temporaire `*.netlify.app`).

### J'ai poussé un commit qui casse le site

```bash
git revert HEAD     # crée un commit qui annule le dernier
git push
```

Netlify redéploie automatiquement la version corrigée. Tu peux aussi **rollback**
manuellement depuis Netlify : **Deploys** → choisis un déploiement vert antérieur
→ **Publish deploy**.

### Je veux un domaine personnalisé (ex : labandecreative.com)

Netlify dashboard → **Domain management** → **Add custom domain**. Suis les
instructions DNS (Netlify te dit exactement quels enregistrements créer chez ton
registrar OVH/Gandi/Google Domains).

---

## 13. Architecture

Pour quand tu voudras ajouter des choses, voici la carte du projet.

```
website/
├── app/
│   ├── layout.tsx                       Layout racine (polices, métadonnées)
│   ├── page.tsx                         Accueil
│   ├── globals.css                      Styles globaux + design tokens
│   ├── not-found.tsx                    Page 404
│   ├── projets/[slug]/page.tsx          Page projet dynamique
│   ├── admin/
│   │   ├── page.tsx                     Login
│   │   ├── LoginForm.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx               Layout protégé (NavTabs, header)
│   │       ├── page.tsx                 Vue d'ensemble
│   │       ├── projects/                Éditeur projets
│   │       ├── pricing/                 Éditeur tarifs
│   │       └── subscriptions/           Éditeur abonnements
│   └── api/
│       ├── intake/route.ts              POST brief prospect
│       └── admin/
│           ├── login/route.ts           POST login
│           ├── logout/route.ts
│           ├── projects/route.ts        GET / PUT projets
│           ├── pricing/route.ts         GET / PUT tarifs
│           └── subscriptions/route.ts   GET / PUT abonnements
├── components/                          UI réutilisable (Hero, Pricing, IntakeModal…)
├── lib/
│   ├── defaults.ts                      Données par défaut (seed)
│   ├── storage.ts                       Wrapper Netlify Blobs
│   ├── auth.ts                          JWT + whitelist email
│   └── utils.ts
├── middleware.ts                        Protège /admin/dashboard et /api/admin/*
├── netlify.toml                         Config Netlify (build, headers de sécurité)
├── next.config.js
├── tailwind.config.ts                   Couleurs, polices, animations
└── package.json
```

### Pour ajouter une nouvelle section sur l'accueil

1. Crée un nouveau composant dans `components/MaSection.tsx`.
2. Importe-le dans `components/HomeShell.tsx` et place-le où tu veux dans le `<main>`.
3. Ajoute une entrée dans `links` du fichier `components/Navigation.tsx` si tu veux
   un lien dans le menu.

### Pour ajouter un nouveau type de contenu éditable depuis l'admin

1. Définis le type dans `lib/defaults.ts` (avec une donnée par défaut).
2. Ajoute des fonctions `getMonContenu` / `setMonContenu` dans `lib/storage.ts`.
3. Crée une route API `app/api/admin/mon-contenu/route.ts` (copie un existant).
4. Crée la page d'édition `app/admin/dashboard/mon-contenu/page.tsx` + `Editor.tsx`.
5. Ajoute l'onglet dans `app/admin/dashboard/NavTabs.tsx`.

---

## En cas de pépin

- **Logs Netlify** : dashboard Netlify → ton site → **Functions** ou **Deploys**.
- **Logs en local** : tout s'affiche dans le terminal où tu as lancé `npm run dev`.
- **État des Blobs** : dashboard Netlify → ton site → **Blobs**.

Bon déploiement. ✨
