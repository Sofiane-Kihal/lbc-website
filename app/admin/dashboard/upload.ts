// Netlify Functions limite la taille du body à ~6 Mo en synchrone.
// On garde une marge pour l'overhead multipart (boundaries, headers).
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function uploadMedia(
  file: File
): Promise<{ url: string; key: string }> {
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    throw new Error(
      `Fichier trop volumineux (${mb} Mo). Max ${MAX_UPLOAD_BYTES / 1024 / 1024} Mo. Compressez l'image et réessayez.`
    );
  }

  const fd = new FormData();
  fd.append('file', file);

  let res: Response;
  try {
    res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
  } catch (e: any) {
    throw new Error(`Erreur réseau : ${e?.message || 'connexion interrompue'}`);
  }

  // L'API renvoie normalement du JSON, mais une erreur infra (Netlify, proxy,
  // 502 / timeout) peut renvoyer du texte ou du HTML. Lire en texte d'abord
  // puis tenter le JSON, pour afficher un message utile dans tous les cas.
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Réponse non-JSON (ex. Netlify renvoie "Internal Error" en text/plain
    // quand le body dépasse la limite ou que la function plante).
  }

  if (!res.ok) {
    const detail =
      data?.error ||
      (text && text.length < 200 ? text : '') ||
      res.statusText ||
      `HTTP ${res.status}`;
    throw new Error(`Erreur upload : ${detail}`);
  }
  if (!data?.url) {
    throw new Error('Erreur upload : réponse invalide du serveur.');
  }
  return data;
}
