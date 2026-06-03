// Forwarder d'emails pour les soumissions du formulaire de brief.
// Utilise l'API HTTP Resend (https://resend.com) via fetch natif — pas de
// dépendance npm supplémentaire. Échoue silencieusement si la config est
// absente : le lead reste persisté dans Netlify Blobs, on n'altère jamais
// la réponse utilisateur.
//
// Variables d'environnement :
//   RESEND_API_KEY  Clé API Resend (obligatoire pour envoyer)
//   EMAIL_FROM      Adresse expéditrice vérifiée sur Resend
//                   (ex. "La Bande Créative <brief@labandecreative.fr>")
//   CONTACT_EMAIL   Destinataire (fallback : contact@labandecreative.fr)

import { resolveAnswer } from './intakeQuestions';

type Contact = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
};

type IntakePayload = {
  answers?: Record<string, any>;
  preset?: {
    kind?: string;
    name?: string;
    price?: string;
    addons?: Array<{ id?: string; name?: string; price?: string }>;
  } | null;
  source?: string;
  submittedAt?: string;
  ip?: string | null;
  userAgent?: string | null;
};

const FALLBACK_TO = 'contact@labandecreative.fr';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Europe/Paris',
    });
  } catch {
    return iso;
  }
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;color:#666;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;color:#111;vertical-align:top;">${value}</td>
    </tr>`;
}

function buildSubject(payload: IntakePayload): string {
  const c: Contact = payload.answers?.contact ?? {};
  const who = [c.firstName, c.lastName].filter(Boolean).join(' ').trim() || c.email || 'visiteur';
  if (payload.source === 'quick-contact' && payload.preset?.name) {
    return `Demande ${payload.preset.name} · ${who}`;
  }
  return `Nouveau brief · ${who}`;
}

function buildHtml(payload: IntakePayload): string {
  const c: Contact = payload.answers?.contact ?? {};
  const isQuick = payload.source === 'quick-contact';

  const contactRows: string[] = [];
  if (c.firstName || c.lastName) {
    contactRows.push(row('Nom', escapeHtml([c.firstName, c.lastName].filter(Boolean).join(' '))));
  }
  if (c.email) {
    contactRows.push(
      row('Email', `<a href="mailto:${escapeHtml(c.email)}" style="color:#4F60F1;">${escapeHtml(c.email)}</a>`)
    );
  }
  if (c.phone) {
    contactRows.push(
      row('Téléphone', `<a href="tel:${escapeHtml(c.phone)}" style="color:#4F60F1;">${escapeHtml(c.phone)}</a>`)
    );
  }
  if (c.company) contactRows.push(row('Entreprise', escapeHtml(c.company)));
  if (c.message) contactRows.push(row('Message', escapeHtml(c.message).replace(/\n/g, '<br>')));

  // Brief answers — resolve each question id to its label
  const briefRows: string[] = [];
  if (!isQuick && payload.answers) {
    for (const [key, val] of Object.entries(payload.answers)) {
      if (key === 'contact') continue;
      // Free-text comments attached to a question (e.g. "source_comment")
      if (key.endsWith('_comment')) {
        if (typeof val === 'string' && val.trim()) {
          briefRows.push(row('Commentaire', escapeHtml(val)));
        }
        continue;
      }
      const resolved = resolveAnswer(key, val);
      if (resolved) briefRows.push(row(resolved.question, escapeHtml(resolved.answer)));
    }
  }

  // Preset block for quick-contact
  let presetBlock = '';
  if (isQuick && payload.preset) {
    const presetRows = [
      row('Formule choisie', escapeHtml(payload.preset.name || '')),
      ...(payload.preset.price ? [row('Tarif', escapeHtml(payload.preset.price))] : []),
      ...(payload.preset.addons && payload.preset.addons.length > 0
        ? [
            row(
              'Options',
              payload.preset.addons
                .map((a) => `${escapeHtml(a.name || '')} (${escapeHtml(a.price || '')})`)
                .join('<br>')
            ),
          ]
        : []),
    ].join('');
    presetBlock = `
      <h2 style="font-family:Georgia,serif;font-size:18px;color:#4F60F1;margin:24px 0 8px;">Formule</h2>
      <table style="width:100%;border-collapse:collapse;">${presetRows}</table>`;
  }

  const meta: string[] = [];
  if (payload.submittedAt) meta.push(`Soumis le ${formatDate(payload.submittedAt)}`);
  if (payload.ip) meta.push(`IP ${payload.ip}`);

  return `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:24px;background:#FAF1E6;font-family:-apple-system,Segoe UI,sans-serif;color:#111;">
  <table style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
    <tr>
      <td style="padding:24px 28px;background:#4F60F1;color:#FAF1E6;">
        <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;opacity:0.7;">La Bande Créative</div>
        <h1 style="font-family:Georgia,serif;font-size:24px;margin:6px 0 0;font-weight:700;">
          ${isQuick ? 'Nouvelle demande d’abonnement' : 'Nouveau brief reçu'}
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 28px;">
        <h2 style="font-family:Georgia,serif;font-size:18px;color:#4F60F1;margin:0 0 8px;">Contact</h2>
        <table style="width:100%;border-collapse:collapse;">${contactRows.join('') || row('—', '<em style="color:#999;">Aucun champ renseigné</em>')}</table>

        ${presetBlock}

        ${briefRows.length > 0
          ? `<h2 style="font-family:Georgia,serif;font-size:18px;color:#4F60F1;margin:24px 0 8px;">Réponses au brief</h2>
             <table style="width:100%;border-collapse:collapse;">${briefRows.join('')}</table>`
          : ''}

        ${meta.length > 0
          ? `<p style="margin:24px 0 0;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:12px;">${meta.map(escapeHtml).join(' · ')}</p>`
          : ''}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(payload: IntakePayload): string {
  const c: Contact = payload.answers?.contact ?? {};
  const isQuick = payload.source === 'quick-contact';
  const lines: string[] = [];

  lines.push(isQuick ? 'NOUVELLE DEMANDE D’ABONNEMENT' : 'NOUVEAU BRIEF');
  lines.push('');
  lines.push('-- Contact --');
  if (c.firstName || c.lastName) lines.push(`Nom : ${[c.firstName, c.lastName].filter(Boolean).join(' ')}`);
  if (c.email) lines.push(`Email : ${c.email}`);
  if (c.phone) lines.push(`Téléphone : ${c.phone}`);
  if (c.company) lines.push(`Entreprise : ${c.company}`);
  if (c.message) lines.push(`Message : ${c.message}`);

  if (isQuick && payload.preset) {
    lines.push('');
    lines.push('-- Formule --');
    if (payload.preset.name) lines.push(`Formule : ${payload.preset.name}`);
    if (payload.preset.price) lines.push(`Tarif : ${payload.preset.price}`);
    if (payload.preset.addons?.length) {
      lines.push('Options :');
      for (const a of payload.preset.addons) {
        lines.push(`  - ${a.name} (${a.price})`);
      }
    }
  }

  if (!isQuick && payload.answers) {
    lines.push('');
    lines.push('-- Réponses au brief --');
    for (const [key, val] of Object.entries(payload.answers)) {
      if (key === 'contact') continue;
      if (key.endsWith('_comment')) {
        if (typeof val === 'string' && val.trim()) lines.push(`Commentaire : ${val}`);
        continue;
      }
      const resolved = resolveAnswer(key, val);
      if (resolved) lines.push(`${resolved.question} : ${resolved.answer}`);
    }
  }

  if (payload.submittedAt) {
    lines.push('');
    lines.push(`Soumis le ${formatDate(payload.submittedAt)}`);
  }

  return lines.join('\n');
}

export async function sendIntakeEmail(payload: IntakePayload): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.CONTACT_EMAIL || FALLBACK_TO;

  if (!apiKey) return { ok: false, reason: 'RESEND_API_KEY missing' };
  if (!from) return { ok: false, reason: 'EMAIL_FROM missing' };

  const replyTo = payload.answers?.contact?.email;

  const body = {
    from,
    to: [to],
    subject: buildSubject(payload),
    html: buildHtml(payload),
    text: buildText(payload),
    ...(replyTo ? { reply_to: replyTo } : {}),
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { ok: false, reason: `Resend ${res.status}: ${text.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, reason: e?.message || 'fetch failed' };
  }
}
