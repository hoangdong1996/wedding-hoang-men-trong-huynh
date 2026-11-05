/** Public UI validation, not authorization. Hosting/Forms own write permissions. */
export function httpsUrl(value: string): string {
  if (!value || value !== value.trim() || /[\u0000-\u0020\u007f]/.test(value)) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}

export function googleFormUrl(value: string): string {
  const safe = httpsUrl(value);
  if (!safe) return '';
  const url = new URL(safe);
  if (url.port) return '';
  const isShort = url.hostname === 'forms.gle' && /^\/[A-Za-z0-9_-]+\/?$/.test(url.pathname);
  const isForm = url.hostname === 'docs.google.com' && /^\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]+\/viewform\/?$/.test(url.pathname);
  if (!isShort && !isForm) return '';
  // Do not publish edit tokens, prefilled personal answers or response-edit links.
  url.search = ''; url.hash = '';
  return url.href;
}

export function localAsset(value: string, fallback = ''): string {
  return /^(?:images|music)\/[a-zA-Z0-9_/-]+\.(?:webp|png|jpe?g|svg|avif|mp3|ogg|m4a)$/i.test(value)
    && !value.includes('//') ? value : fallback;
}

export function publicShareUrl(configured: string, current: string): string {
  const safe = httpsUrl(configured);
  const url = new URL(safe || current);
  // Invitation QR never includes tracking queries, guest identifiers or fragments.
  url.search = ''; url.hash = '';
  return url.href;
}
