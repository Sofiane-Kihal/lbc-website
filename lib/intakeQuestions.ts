// Single source of truth for the 15-question brief modal.
// Used by the IntakeModal (UI) and by the email forwarder in lib/email.ts
// to resolve raw answer values back to human labels when notifying the agency.

export type ChoiceQuestion = {
  type: 'single' | 'multi';
  id: string;
  title: string;
  hint?: string;
  insight?: string;
  options: {
    value: string;
    label: string;
    description?: string;
    allowComment?: boolean;
  }[];
};

export type ContactQuestion = {
  type: 'contact';
  id: string;
  title: string;
  hint?: string;
};

export type Question = ChoiceQuestion | ContactQuestion;

export const intakeQuestions: Question[] = [
  {
    type: 'single',
    id: 'objective',
    title: 'Quel est votre objectif principal ?',
    hint: "Cap n°1. C'est lui qui dicte tout le reste.",
    insight:
      "Avant de penser contenus, on définit l'objectif. Visibilité, engagement et conversion ne se traitent pas du tout de la même manière, ni avec les mêmes formats, ni avec les mêmes indicateurs de performance.",
    options: [
      { value: 'visibilite', label: 'Visibilité / notoriété', description: 'Faire connaître la marque à de nouvelles audiences' },
      { value: 'engagement', label: 'Engagement / communauté', description: 'Activer et fidéliser une audience existante' },
      { value: 'conversion', label: 'Conversion / ventes', description: 'Générer des leads, des clients, du chiffre' },
      { value: 'recrutement', label: 'Marque employeur / recrutement', description: 'Attirer des talents' },
      { value: 'fidelisation', label: 'Fidélisation client', description: 'Faire revenir vos clients existants' },
      { value: 'mixte', label: 'Plusieurs à la fois', description: 'On en discutera ensemble pour prioriser' },
    ],
  },
  {
    type: 'single',
    id: 'success',
    title: "Pour vous, qu'est-ce qui définit le succès ?",
    insight:
      "La viralité n'est pas synonyme de réussite. Une vidéo à 1M de vues qui ne convertit pas, ce n'est pas un succès si l'objectif était la conversion. Les bons indicateurs (KPIs) dépendent toujours de l'objectif visé.",
    options: [
      { value: 'vues', label: 'Le nombre de vues' },
      { value: 'engagement', label: "Le taux d'engagement (likes, partages)" },
      { value: 'leads', label: 'Les leads générés / les ventes' },
      { value: 'multi', label: "Tous les indicateurs alignés sur l'objectif", description: 'La bonne réponse 😉' },
    ],
  },
  {
    type: 'single',
    id: 'strategy',
    title: 'Avez-vous une stratégie social media définie ?',
    insight:
      "Sans stratégie, même un super contenu n'aura pas d'impact durable. Pas grave si la réponse est non, c'est exactement ce qu'on construit avec vous.",
    options: [
      { value: 'oui-claire', label: 'Oui, claire et documentée' },
      { value: 'oui-vague', label: 'Oui, mais à revoir / formaliser' },
      { value: 'non', label: 'Non, on improvise' },
      { value: 'sais-pas', label: 'Je ne sais pas trop ce que ça implique' },
    ],
  },
  {
    type: 'single',
    id: 'audience',
    title: 'Connaissez-vous précisément votre cible ?',
    insight:
      "« Tout le monde » n'est jamais une cible. Plus c'est précis (persona, pain points, plateformes utilisées), plus le message touche juste, et moins on dépense pour rien.",
    options: [
      { value: 'persona', label: 'Oui, persona détaillé' },
      { value: 'grandes-lignes', label: 'Oui, grandes lignes' },
      { value: 'large', label: 'On vise large' },
      { value: 'non', label: 'Pas vraiment, on découvre' },
    ],
  },
  {
    type: 'multi',
    id: 'channels',
    title: 'Quels canaux utilisez-vous actuellement ?',
    hint: 'Plusieurs choix possibles.',
    options: [
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'site', label: 'Site web' },
      { value: 'aucun', label: "Aucun pour l'instant" },
    ],
  },
  {
    type: 'single',
    id: 'frequency',
    title: 'À quelle fréquence publiez-vous ?',
    insight:
      "La régularité prime sur la quantité. 3 contenus / semaine bien produits valent mieux que 10 mal pensés. L'algorithme préfère, votre cerveau aussi.",
    options: [
      { value: 'plusieurs-sem', label: 'Plusieurs fois par semaine' },
      { value: '1-2-sem', label: '1 à 2 fois par semaine' },
      { value: '1-2-mois', label: '1 à 2 fois par mois' },
      { value: 'rarement', label: 'Rarement / jamais' },
    ],
  },
  {
    type: 'single',
    id: 'measure',
    title: 'Mesurez-vous les performances de vos contenus ?',
    insight:
      "Ce qui ne se mesure pas ne s'améliore pas. On installe toujours un tableau de bord clair, et on l'utilise.",
    options: [
      { value: 'oui-regulier', label: 'Oui, régulièrement' },
      { value: 'parfois', label: 'Parfois, en survol' },
      { value: 'jamais', label: 'Jamais' },
      { value: 'sais-pas', label: 'Je ne saurais pas comment faire' },
    ],
  },
  {
    type: 'multi',
    id: 'needs',
    title: 'De quoi avez-vous besoin ?',
    hint: 'Plusieurs choix possibles. Pas de panique, on affine ensemble.',
    insight:
      'Conseil maison : commencer par audit + stratégie avant la production évite de payer 2 fois pour rien.',
    options: [
      { value: 'audit', label: 'Un audit', description: 'État des lieux + recommandations' },
      { value: 'strategie', label: 'Une stratégie', description: "Plan d'action 3-6 mois" },
      { value: 'production', label: 'De la production vidéo / photo' },
      { value: 'cm', label: 'Du community management' },
      { value: 'site', label: 'Un site web' },
      { value: 'identite', label: 'Une identité graphique' },
      { value: '360', label: 'Un accompagnement 360°' },
    ],
  },
  {
    type: 'single',
    id: 'existing-content',
    title: 'Avez-vous des contenus existants à exploiter ?',
    insight:
      'Photos, témoignages, archives : souvent on capitalise dessus avant de produire du neuf. Économie de temps, économie de budget.',
    options: [
      { value: 'beaucoup', label: 'Oui, beaucoup' },
      { value: 'quelques', label: 'Quelques-uns' },
      { value: 'peu', label: 'Très peu' },
      { value: 'aucun', label: 'Aucun, on part de zéro' },
    ],
  },
  {
    type: 'single',
    id: 'sector',
    title: "Quel est votre secteur d'activité ?",
    options: [
      { value: 'b2b-services', label: 'B2B services' },
      { value: 'b2c-retail', label: 'B2C retail / e-commerce' },
      { value: 'food', label: 'Food / hôtellerie / restauration' },
      { value: 'beaute', label: 'Beauté / lifestyle' },
      { value: 'immo', label: 'Immobilier' },
      { value: 'sante', label: 'Santé / bien-être' },
      { value: 'tech', label: 'Tech / SaaS / start-up' },
      { value: 'culture', label: 'Culture / événementiel' },
      { value: 'autre', label: 'Autre' },
    ],
  },
  {
    type: 'single',
    id: 'size',
    title: 'Quelle est la taille de votre structure ?',
    options: [
      { value: 'solo', label: 'Solo / freelance' },
      { value: 'tpe', label: 'TPE (2 à 10 personnes)' },
      { value: 'pme', label: 'PME (10 à 50)' },
      { value: 'eti', label: 'ETI (50 à 250)' },
      { value: 'grande', label: 'Grande entreprise (250+)' },
    ],
  },
  {
    type: 'single',
    id: 'budget',
    title: 'Budget mensuel envisagé pour votre communication ?',
    hint: 'Pas de jugement, on adapte.',
    insight:
      "On préfère savoir tôt pour vous proposer ce qui aura un vrai impact. Mieux vaut un seul axe bien fait qu'un éparpillement coûteux.",
    options: [
      { value: '<500', label: 'Moins de 500€' },
      { value: '500-1500', label: '500 à 1 500€' },
      { value: '1500-3000', label: '1 500 à 3 000€' },
      { value: '3000-5000', label: '3 000 à 5 000€' },
      { value: '5000+', label: 'Plus de 5 000€' },
      { value: 'sais-pas', label: 'Je ne sais pas encore' },
    ],
  },
  {
    type: 'single',
    id: 'timeline',
    title: 'Sous quel délai souhaitez-vous démarrer ?',
    options: [
      { value: 'now', label: 'Maintenant' },
      { value: '1m', label: 'Sous 1 mois' },
      { value: '3m', label: 'Sous 3 mois' },
      { value: 'pas-date', label: 'Pas de date précise' },
    ],
  },
  {
    type: 'single',
    id: 'source',
    title: 'Comment nous avez-vous connus ?',
    options: [
      { value: 'reco', label: 'Recommandation' },
      { value: 'reseaux', label: 'Réseaux sociaux' },
      { value: 'google', label: 'Recherche Google' },
      { value: 'evenement', label: 'Évènement' },
      { value: 'autre', label: 'Autre', allowComment: true },
    ],
  },
  {
    type: 'contact',
    id: 'contact',
    title: 'Comment vous contacter ?',
    hint: 'Promis, on revient sous 48h ouvrées.',
  },
];

// Resolve a raw answer value (string for single, string[] for multi) back to
// human-readable labels. Returns null when the question is the contact step
// or when no match is found.
export function resolveAnswer(
  questionId: string,
  value: unknown
): { question: string; answer: string } | null {
  const q = intakeQuestions.find((x) => x.id === questionId);
  if (!q || q.type === 'contact') return null;

  const optionLabel = (v: string) =>
    q.options.find((o) => o.value === v)?.label ?? v;

  if (q.type === 'multi') {
    if (!Array.isArray(value) || value.length === 0) return null;
    return {
      question: q.title,
      answer: value.map((v) => optionLabel(String(v))).join(', '),
    };
  }

  if (typeof value !== 'string' || !value) return null;
  return { question: q.title, answer: optionLabel(value) };
}
