export type OsintProvider = 'linkedin' | 'github' | 'twitter' | 'x' | 'gitlab' | 'medium' | 'stackoverflow';

export interface ParsedIntents {
  language: 'es' | 'en';
  providers: OsintProvider[];
  discover: { emails?: boolean; phones?: boolean; profiles?: boolean; urls?: boolean };
  tagsToAdd: string[];
  note?: string;
  searchDorks?: boolean;
}

export function parseOsintNL(input: string, defaultLang: 'es' | 'en' = 'es'): ParsedIntents {
  const text = normalizeText(input);
  const intents: ParsedIntents = {
    language: defaultLang,
    providers: [],
    discover: {},
    tagsToAdd: [],
  };

  // Idioma (heurística simple)
  if (/(the|look|find|email|profile|profiles?)/.test(text)) intents.language = 'en';
  if (/(busca|encontrar|correos?|perfiles?)/.test(text)) intents.language = 'es';

  // Proveedores
  if (/\blinkedin\b/.test(text)) intents.providers.push('linkedin');
  if (/\bgithub\b/.test(text)) intents.providers.push('github');
  if (/\b(twitter|x)\b/.test(text)) intents.providers.push('twitter');
  if (/\bgitlab\b/.test(text)) intents.providers.push('gitlab');
  if (/\bmedium\b/.test(text)) intents.providers.push('medium');
  if (/(stack\s*overflow)/.test(text)) intents.providers.push('stackoverflow');

  // Acciones
  if (/(correo|correos|email|emails)/.test(text)) intents.discover.emails = true;
  if (/(telefono|tel[eé]fono|phone|phones?)/.test(text)) intents.discover.phones = true;
  if (/(perfil|perfiles|profiles?)/.test(text)) intents.discover.profiles = true;
  if (/urls?/.test(text)) intents.discover.urls = true;
  if (/(dorks?|google)/.test(text)) intents.searchDorks = true;

  // Tags: "agrega tag seguridad, fintech"
  const tagMatch = text.match(/\b(agrega\s+tag|add\s+tag)s?\s+([a-z0-9\-_,\s]+)/i);
  if (tagMatch?.[2]) {
    intents.tagsToAdd = tagMatch[2]
      .split(/[\s,]+/)
      .map((t: string) => t.trim())
      .filter(Boolean);
  }

  // Nota: "nota: foco en perfiles técnicos"
  const noteMatch = text.match(/\b(nota|note)\s*:\s*(.+)$/i);
  if (noteMatch?.[2]) intents.note = noteMatch[2].trim();

  // Si se mencionan proveedores y no se indicó otra cosa, asumimos perfiles
  if (intents.providers.length && intents.discover.profiles === undefined) {
    intents.discover.profiles = true;
  }

  return intents;
}

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

export function buildFromNL(name: string, targetType: 'person' | 'company', nl: string) {
  const intents = parseOsintNL(nl);

  const providers = intents.providers.length
    ? intents.providers
    : (['linkedin', 'github', 'twitter'] as OsintProvider[]);

  let discoveredUrls: string[] = [];
  let discoveredAliases: string[] = [];
  let discoveredEmails: string[] = [];

  if (intents.discover.profiles !== false) discoveredUrls.push(...discoverProfileUrlsByProviders(name, providers));
  if (intents.discover.urls) discoveredUrls.push(...discoverGenericUrls(name));
  if (intents.discover.emails || intents.discover.emails === undefined) discoveredEmails.push(...inferEmailsFromDomains(discoveredUrls));
  discoveredAliases.push(...discoverAliases(name));

  const urls = dedupe(normalizeUrls(discoveredUrls));
  const emails = dedupe(validateEmails(discoveredEmails));
  const aliases = dedupe(discoveredAliases);

  const notes = intents.note || '';
  const tags = dedupe([...(intents.tagsToAdd || [])]);
  const sources = buildSources(urls);
  const dorks = intents.searchDorks ? generateSearchDorks(name, providers) : [];

  return {
    payload: {
      targetType,
      name,
      aliases,
      emails,
      phones: [] as string[],
      urls,
      tags,
      notes,
      sources,
    },
    meta: { dorks, intents },
  };
}

function discoverProfileUrlsByProviders(name: string, providers: OsintProvider[]): string[] {
  const s = slug(name);
  const map: Record<OsintProvider, string> = {
    linkedin: `https://www.linkedin.com/in/${s}`,
    github: `https://github.com/${s}`,
    twitter: `https://twitter.com/${s}`,
    x: `https://x.com/${s}`,
    gitlab: `https://gitlab.com/${s}`,
    medium: `https://medium.com/@${s}`,
    stackoverflow: `https://stackoverflow.com/users/?tab=profiles&q=${encodeURIComponent(name)}`,
  };
  return providers.map((p) => map[p]).filter(Boolean);
}

function discoverGenericUrls(name: string): string[] {
  const q = encodeURIComponent(`"${name}"`);
  return [
    `https://www.google.com/search?q=${q}+site:about.me`,
    `https://www.google.com/search?q=${q}+site:angel.co`,
  ];
}

function inferEmailsFromDomains(urls: string[]): string[] {
  const domains = urls
    .map((u) => {
      try {
        const { hostname } = new URL(u);
        return hostname.replace(/^www\./, '');
      } catch {
        return null;
      }
    })
    .filter(Boolean) as string[];
  const uniq = Array.from(new Set(domains));
  return uniq.map((d) => `name@${d}`).slice(0, 5);
}

function discoverAliases(name: string): string[] {
  const parts = name.trim().split(/\s+/);
  const base = parts[0] || name;
  return dedupe([name, base]);
}

function normalizeUrls(urls: string[]): string[] {
  return urls.map(canonicalizeUrl);
}

function canonicalizeUrl(u: string): string {
  try {
    const url = new URL(u);
    url.hash = '';
    url.search = '';
    if (url.hostname.startsWith('www.')) url.hostname = url.hostname.slice(4);
    return url.toString();
  } catch {
    return u;
  }
}

function validateEmails(emails: string[]): string[] {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emails.filter((e) => re.test(e));
}

function buildSources(urls: string[]) {
  const now = new Date().toISOString();
  return urls.map((u) => ({ name: 'web-profile', url: u, type: 'profile', collectedAt: now }));
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 32);
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function generateSearchDorks(name: string, providers: OsintProvider[]): string[] {
  const exact = `"${name}"`;
  const sites = providers
    .map((p) =>
      p === 'linkedin' ? 'site:linkedin.com/in' :
      p === 'github' ? 'site:github.com' :
      p === 'twitter' ? '(site:twitter.com OR site:x.com)' :
      p === 'gitlab' ? 'site:gitlab.com' :
      p === 'medium' ? 'site:medium.com' :
      p === 'stackoverflow' ? 'site:stackoverflow.com' : ''
    )
    .filter(Boolean)
    .join(' OR ');
  const base = sites ? `${exact} (${sites})` : exact;
  return [
    base,
    `${exact} (email OR correo) -password -pass`,
    `${exact} (cv OR curriculum OR resume)`,
    `${exact} (contact OR contacto)`,
  ];
}
