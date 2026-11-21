export interface VCardProfile {
  firstName: string;
  middleName?: string;
  lastName: string;
  formattedName: string;
  nickname: string;
  organization: string;
  title: string;
  businessConciergePhone?: string;
  website: string;
  workWebsite?: string;
  photoUrl?: string;
  note: string;
  socials: Array<{ type: string; url: string }>;
}

export interface CarouselCardTransform {
  offset: number;
  translateXPercent: number;
  translateZPx: number;
  rotateYDeg: number;
  scale: number;
  opacity: number;
  zIndex: number;
  isActive: boolean;
  isVisible: boolean;
}

export interface TiltResult {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
}

export const RST_BOT_WHATSAPP_DIGITS = '12029780356';
export const RST_BOT_WHATSAPP_DISPLAY = '+1 (202) 978-0356';

export const ADHAM_VCARD_PROFILE: VCardProfile = {
  firstName: 'Adham',
  middleName: 'Ahmed',
  lastName: 'Medhat',
  formattedName: 'Adham Medhat (أدهم مدحت)',
  nickname: 'adhamrst',
  organization: 'RST Central',
  title: 'Medical Student (Horus University) & Founder',
  businessConciergePhone: '+12029780356',
  website: 'https://adham.rstcentral.com',
  workWebsite: 'https://rstcentral.com',
  photoUrl: 'https://adham.rstcentral.com/images/adham-medhat-portrait.jpg',
  note: 'Adham Ahmed Medhat (@adhamrst) — Medical Student at Horus University, Micro MBA, Founder of RST Central, and Visual Identity Designer. RST Central Business Concierge: +1 202 978 0356.',
  socials: [
    { type: 'linkedin', url: 'https://linkedin.com/in/adhamrst' },
    { type: 'instagram', url: 'https://instagram.com/adhamrst' },
    { type: 'telegram', url: 'https://t.me/adhamrst' },
    { type: 'youtube', url: 'https://youtube.com/@adhamrst' },
    { type: 'facebook', url: 'https://facebook.com/adhamrstt' },
  ],
};

/**
 * Generates an RFC 6350 compatible vCard 3.0 payload with CRLF endings.
 */
export function buildVCardString(profile: VCardProfile = ADHAM_VCARD_PROFILE): string {
  const sanitize = (value: string) => value.replace(/\r?\n/g, ' ').trim();
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${sanitize(profile.lastName)};${sanitize(profile.firstName)};${sanitize(profile.middleName ?? '')};;`,
    `FN:${sanitize(profile.formattedName)}`,
    `NICKNAME:${sanitize(profile.nickname)}`,
    `ORG:${sanitize(profile.organization)}`,
    `TITLE:${sanitize(profile.title)}`,
  ];

  if (profile.photoUrl) {
    lines.push(`PHOTO;VALUE=URI:${sanitize(profile.photoUrl)}`);
  }

  if (profile.businessConciergePhone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${sanitize(profile.businessConciergePhone)}`);
  }

  lines.push(`URL:${sanitize(profile.website)}`);

  if (profile.workWebsite) {
    lines.push(`URL;TYPE=WORK:${sanitize(profile.workWebsite)}`);
  }

  for (const social of profile.socials) {
    lines.push(`X-SOCIALPROFILE;TYPE=${sanitize(social.type)}:${sanitize(social.url)}`);
  }

  lines.push(`NOTE:${sanitize(profile.note)}`);
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Computes the shortest signed circular offset between itemIndex and activeIndex.
 */
export function getCircularOffset(itemIndex: number, activeIndex: number, total: number): number {
  if (total <= 0) return 0;
  const normalizedActive = ((activeIndex % total) + total) % total;
  const normalizedItem = ((itemIndex % total) + total) % total;
  let diff = normalizedItem - normalizedActive;
  const half = total / 2;
  if (diff > half) {
    diff -= total;
  } else if (diff < -half) {
    diff += total;
  }
  return diff;
}

/**
 * Computes 3D transform values for a coverflow / depth-stacked credential carousel card.
 */
export function getCarouselCardTransform(
  itemIndex: number,
  activeIndex: number,
  total: number,
  isRtl = false,
): CarouselCardTransform {
  const offset = getCircularOffset(itemIndex, activeIndex, total);
  const absOffset = Math.abs(offset);
  const directionMultiplier = isRtl ? -1 : 1;

  if (absOffset === 0) {
    return {
      offset: 0,
      translateXPercent: 0,
      translateZPx: 0,
      rotateYDeg: 0,
      scale: 1,
      opacity: 1,
      zIndex: 30,
      isActive: true,
      isVisible: true,
    };
  }

  if (absOffset === 1) {
    return {
      offset,
      translateXPercent: offset * 62 * directionMultiplier,
      translateZPx: -90,
      rotateYDeg: -offset * 7 * directionMultiplier,
      scale: 0.88,
      opacity: 0.65,
      zIndex: 20,
      isActive: false,
      isVisible: true,
    };
  }

  return {
    offset,
    translateXPercent: Math.sign(offset) * 96 * directionMultiplier,
    translateZPx: -220,
    rotateYDeg: -Math.sign(offset) * 14 * directionMultiplier,
    scale: 0.78,
    opacity: 0,
    zIndex: 10,
    isActive: false,
    isVisible: false,
  };
}

/**
 * Computes clamped subtle 3D tilt angles from normalized pointer coordinates inside a card.
 */
export function calculateTiltAngles(
  pointerX: number,
  pointerY: number,
  rectWidth: number,
  rectHeight: number,
  maxTiltDeg = 8,
): TiltResult {
  if (rectWidth <= 0 || rectHeight <= 0) {
    return { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };
  }

  const clampedX = Math.max(0, Math.min(rectWidth, pointerX));
  const clampedY = Math.max(0, Math.min(rectHeight, pointerY));

  const ratioX = clampedX / rectWidth;
  const ratioY = clampedY / rectHeight;

  const rotateY = Number(((ratioX - 0.5) * 2 * maxTiltDeg).toFixed(2));
  const rotateX = Number(((0.5 - ratioY) * 2 * maxTiltDeg).toFixed(2));

  return {
    rotateX,
    rotateY,
    glareX: Math.round(ratioX * 100),
    glareY: Math.round(ratioY * 100),
  };
}

/**
 * Validates and builds a cleanly encoded WhatsApp intent URL routed to the official RST Central bot (+12029780356).
 */
export function buildWhatsAppUrl(
  topicLabel: string,
  message: string,
  phoneDigits: string = RST_BOT_WHATSAPP_DIGITS,
): {
  valid: boolean;
  url: string;
  previewText: string;
} {
  const cleanedMessage = message.trim();
  const cleanedTopic = topicLabel.trim();
  const digits = phoneDigits.replace(/\D/g, '');

  if (!cleanedMessage) {
    return { valid: false, url: '', previewText: '' };
  }

  const previewText = cleanedTopic
    ? `Hello RST Central / Adham Medhat (${cleanedTopic}): ${cleanedMessage}`
    : `Hello RST Central / Adham Medhat: ${cleanedMessage}`;

  return {
    valid: true,
    url: `https://wa.me/${digits}?text=${encodeURIComponent(previewText)}`,
    previewText,
  };
}

/**
 * Filters a credential collection by category id ('all' returns every item).
 */
export function filterCredentialsByCategory<T extends { categoryId: string }>(
  items: T[],
  categoryId: string,
): T[] {
  if (categoryId === 'all') {
    return items;
  }
  return items.filter((item) => item.categoryId === categoryId);
}

/**
 * Filters credentials using a case-insensitive substring query across bilingual fields.
 */
export function searchCredentials<
  T extends {
    id: string;
    title: { en: string; ar: string };
    issuer: { en: string; ar: string };
    category: { en: string; ar: string };
    description: { en: string; ar: string };
    year: string;
  },
>(items: T[], query: string): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return items;
  }

  return items.filter((item) => {
    const haystack = [
      item.id,
      item.year,
      item.title.en,
      item.title.ar,
      item.issuer.en,
      item.issuer.ar,
      item.category.en,
      item.category.ar,
      item.description.en,
      item.description.ar,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

const VALID_UPLOAD_CATEGORIES = new Set<UploadCredentialCategory>([
  'business',
  'medical',
  'design',
  'entrepreneurship',
  'technology',
]);

function isLocalizedPair(value: unknown): value is { en: string; ar: string } {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.en === 'string' && typeof record.ar === 'string';
}

function isSafeImageSource(src: string): boolean {
  const trimmed = src.trim();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/images/') ||
    trimmed.startsWith('data:image/')
  );
}

function sanitizeExternalHttpUrl(url: unknown, fallback: string): string {
  if (typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (/^https?:\/\/[^\s]+$/i.test(trimmed)) {
    return trimmed;
  }
  return fallback;
}

/**
 * Validates and sanitizes custom credentials parsed from localStorage to block XSS/malformed payloads.
 */
export function sanitizeStoredCredentials(
  raw: unknown,
  fallbackLinkedinUrl = 'https://linkedin.com/in/adhamrst/details/certifications/',
): UploadedCredentialPayload[] {
  if (!Array.isArray(raw)) return [];

  const sanitized: UploadedCredentialPayload[] = [];

  for (const entry of raw.slice(0, 50)) {
    if (!entry || typeof entry !== 'object') continue;
    const item = entry as Record<string, unknown>;

    if (
      typeof item.id !== 'string' ||
      !item.id.trim() ||
      typeof item.categoryId !== 'string' ||
      !VALID_UPLOAD_CATEGORIES.has(item.categoryId as UploadCredentialCategory) ||
      typeof item.year !== 'string' ||
      !item.year.trim() ||
      typeof item.issuedTo !== 'string' ||
      !item.issuedTo.trim() ||
      typeof item.image !== 'string' ||
      !isSafeImageSource(item.image) ||
      !isLocalizedPair(item.title) ||
      !item.title.en.trim() ||
      !item.title.ar.trim() ||
      !isLocalizedPair(item.category) ||
      !isLocalizedPair(item.issuer) ||
      !item.issuer.en.trim() ||
      !item.issuer.ar.trim() ||
      !isLocalizedPair(item.imageAlt) ||
      !isLocalizedPair(item.description)
    ) {
      continue;
    }

    const highlightsObj = item.highlights as Record<string, unknown> | undefined;
    const highlightsEn = Array.isArray(highlightsObj?.en)
      ? highlightsObj.en.filter((h): h is string => typeof h === 'string')
      : [];
    const highlightsAr = Array.isArray(highlightsObj?.ar)
      ? highlightsObj.ar.filter((h): h is string => typeof h === 'string')
      : [];

    sanitized.push({
      id: item.id.trim(),
      categoryId: item.categoryId as UploadCredentialCategory,
      title: { en: item.title.en.trim(), ar: item.title.ar.trim() },
      category: { en: item.category.en.trim(), ar: item.category.ar.trim() },
      issuer: { en: item.issuer.en.trim(), ar: item.issuer.ar.trim() },
      year: item.year.trim(),
      issuedTo: item.issuedTo.trim(),
      image: item.image.trim(),
      imageAlt: { en: item.imageAlt.en.trim(), ar: item.imageAlt.ar.trim() },
      description: { en: item.description.en.trim(), ar: item.description.ar.trim() },
      highlights: { en: highlightsEn, ar: highlightsAr },
      linkedinUrl: sanitizeExternalHttpUrl(item.linkedinUrl, fallbackLinkedinUrl),
      isUserUploaded: true,
    });
  }

  return sanitized;
}

export type UploadCredentialCategory = 'business' | 'medical' | 'design' | 'entrepreneurship' | 'technology';

export interface UploadCredentialInput {
  title: string;
  issuer: string;
  year?: string;
  categoryId: UploadCredentialCategory;
  imageDataUrl: string;
  linkedinUrl?: string;
  description?: string;
}

export interface UploadedCredentialPayload {
  id: string;
  categoryId: UploadCredentialCategory;
  title: { en: string; ar: string };
  category: { en: string; ar: string };
  issuer: { en: string; ar: string };
  year: string;
  issuedTo: string;
  image: string;
  imageAlt: { en: string; ar: string };
  description: { en: string; ar: string };
  highlights: { en: string[]; ar: string[] };
  linkedinUrl: string;
  isUserUploaded: true;
}

const CATEGORY_LABELS: Record<UploadCredentialCategory, { en: string; ar: string }> = {
  business: { en: 'Business & Executive Credential', ar: 'شهادة في إدارة الأعمال' },
  technology: { en: 'AI & Engineering Credential', ar: 'شهادة في الذكاء الاصطناعي والتقنية' },
  medical: { en: 'Medical & Academic Credential', ar: 'شهادة طبية وأكاديمية' },
  design: { en: 'Design & Creative Credential', ar: 'شهادة تصميم وإبداع بصري' },
  entrepreneurship: { en: 'Entrepreneurship Credential', ar: 'شهادة ريادة أعمال ومشاريع' },
};

/**
 * Validates and constructs a user-uploaded credential record for local showcase persistence.
 */
export function createUploadedCredential(
  input: UploadCredentialInput,
  fallbackLinkedinUrl = 'https://linkedin.com/in/adhamrst/details/certifications/',
): {
  valid: boolean;
  errorField?: 'title' | 'issuer' | 'image';
  credential?: UploadedCredentialPayload;
} {
  const title = input.title.trim();
  const issuer = input.issuer.trim();
  const image = input.imageDataUrl.trim();

  if (!title) {
    return { valid: false, errorField: 'title' };
  }
  if (!issuer) {
    return { valid: false, errorField: 'issuer' };
  }
  if (!image) {
    return { valid: false, errorField: 'image' };
  }

  const rawUrl = (input.linkedinUrl ?? '').trim();
  const safeUrl =
    rawUrl && /^https?:\/\//i.test(rawUrl) ? rawUrl : fallbackLinkedinUrl;
  const year = (input.year ?? '').trim() || String(new Date().getFullYear());
  const desc = (input.description ?? '').trim();
  const categoryLabel = CATEGORY_LABELS[input.categoryId] ?? CATEGORY_LABELS.business;

  return {
    valid: true,
    credential: {
      id: `custom-cert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      categoryId: input.categoryId,
      title: { en: title, ar: title },
      category: categoryLabel,
      issuer: { en: issuer, ar: issuer },
      year,
      issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
      image,
      imageAlt: {
        en: `${title} issued by ${issuer} to Adham Ahmed (Adham Medhat)`,
        ar: `${title} صادرة من ${issuer} باسم أدهم أحمد (أدهم مدحت)`,
      },
      description: {
        en:
          desc ||
          `Verified certificate in ${title} awarded by ${issuer}, archived in Adham Medhat's official credentials portfolio.`,
        ar:
          desc ||
          `شهادة موثقة في ${title} صادرة عن ${issuer} ومضافة إلى معرض شهادات أدهم مدحت الرسمي.`,
      },
      highlights: {
        en: [
          `Issued by ${issuer}`,
          `Credential Year: ${year}`,
          'Synced with Adham Medhat Official Portfolio',
        ],
        ar: [
          `الجهة المانحة: ${issuer}`,
          `سنة الاعتماد: ${year}`,
          'مضافة إلى معرض شهادات أدهم مدحت الرسمي',
        ],
      },
      linkedinUrl: safeUrl,
      isUserUploaded: true,
    },
  };
}

/**
 * Prepends user-uploaded credentials ahead of default items while preventing duplicate IDs.
 */
export function mergeCredentials<T extends { id: string }>(
  defaultItems: T[],
  uploadedItems: T[],
): T[] {
  const seen = new Set<string>();
  const merged: T[] = [];
  for (const item of [...uploadedItems, ...defaultItems]) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      merged.push(item);
    }
  }
  return merged;
}

const ARABIC_TO_LATIN_MAP: Record<string, string> = {
  أ: 'a',
  إ: 'e',
  آ: 'a',
  ا: 'a',
  ب: 'b',
  ت: 't',
  ث: 'th',
  ج: 'g',
  ح: 'h',
  خ: 'kh',
  د: 'd',
  ذ: 'dh',
  ر: 'r',
  ز: 'z',
  س: 's',
  ش: 'sh',
  ص: 's',
  ض: 'd',
  ط: 't',
  ظ: 'z',
  ع: 'a',
  غ: 'gh',
  ف: 'f',
  ق: 'q',
  ك: 'k',
  ل: 'l',
  م: 'm',
  ن: 'n',
  ه: 'h',
  ة: 'a',
  و: 'w',
  ي: 'y',
  ى: 'a',
  ئ: 'e',
  ؤ: 'o',
};

/**
 * Normalizes English or Arabic text into clean lowercase hyphenated SEO/GEO filename slugs.
 */
export function slugifySeoToken(input: string, maxLength = 64): string {
  const transliterated = input
    .trim()
    .split('')
    .map((ch) => ARABIC_TO_LATIN_MAP[ch] ?? ch)
    .join('');

  return transliterated
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');
}

/**
 * Injects Cloudinary automatic WebP/AVIF format & quality transforms (f_auto,q_auto,w_1400) cleanly.
 */
export function optimizeCloudinaryUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed.includes('res.cloudinary.com') || !trimmed.includes('/upload/')) {
    return trimmed;
  }
  if (trimmed.includes('/upload/f_auto')) {
    return trimmed;
  }
  return trimmed.replace('/upload/', '/upload/f_auto,q_auto,w_1400/');
}

export interface SeoGeoCertificatePackage {
  seoFilename: string;
  cloudinaryPublicId: string;
  altEn: string;
  altAr: string;
  geoCaptionEn: string;
  geoCaptionAr: string;
  schemaJsonLd: string;
}

/**
 * Auto-generates SEO & GEO optimized filenames, Cloudinary public_ids, alt texts, and Schema.org JSON-LD.
 */
export function buildSeoGeoCertificatePackage(input: {
  title: string;
  issuer: string;
  year?: string;
  categoryId: UploadCredentialCategory;
  linkedinUrl?: string;
  region?: string;
}): SeoGeoCertificatePackage {
  const cleanTitle = input.title.trim() || 'Verified Credential';
  const cleanIssuer = input.issuer.trim() || 'Accredited Institution';
  const cleanYear = (input.year ?? '').trim() || String(new Date().getFullYear());
  const cleanRegion = (input.region ?? 'Egypt').trim() || 'Egypt';

  const issuerSlug = slugifySeoToken(cleanIssuer, 28);
  const titleSlug = slugifySeoToken(cleanTitle, 44);
  const regionSlug = slugifySeoToken(cleanRegion, 16);
  const yearSlug = slugifySeoToken(cleanYear, 8);

  const parts = ['adham-medhat', issuerSlug, titleSlug, regionSlug, yearSlug].filter(Boolean);
  const baseSlug = parts.join('-').replace(/-+/g, '-');

  const seoFilename = `${baseSlug}.webp`;
  const cloudinaryPublicId = `adham-medhat-credentials/${baseSlug}`;

  const altEn = `Official ${cleanTitle} certificate awarded by ${cleanIssuer} (${cleanYear}) to Adham Medhat (Adham Ahmed Medhat, @adhamrst) — Horus University Medical Student & Founder of RST Central, ${cleanRegion}`;
  const altAr = `شهادة ${cleanTitle} الرسمية الصادرة عن ${cleanIssuer} (${cleanYear}) باسم أدهم مدحت (أدهم أحمد مدحت · @adhamrst) — طالب طب بجامعة حورس ومؤسس RST Central`;

  const geoCaptionEn = `${cleanTitle} is an accredited credential awarded to Adham Medhat (Adham Ahmed Medhat) by ${cleanIssuer} in ${cleanYear}, verified under his official personal entity at adham.rstcentral.com.`;
  const geoCaptionAr = `شهادة ${cleanTitle} معتمدة وممنوحة لأدهم مدحت (أدهم أحمد مدحت) من ${cleanIssuer} عام ${cleanYear} وموثّقة ضمن هويته الرسمية على adham.rstcentral.com.`;

  const safeUrl =
    input.linkedinUrl && /^https?:\/\//i.test(input.linkedinUrl.trim())
      ? input.linkedinUrl.trim()
      : 'https://linkedin.com/in/adhamrst/details/certifications/';

  const schemaObj = {
    '@type': 'EducationalOccupationalCredential',
    name: cleanTitle,
    credentialCategory: input.categoryId === 'medical' ? 'academic-credential' : 'certificate',
    dateCreated: cleanYear,
    url: safeUrl,
    recognizedBy: {
      '@type': 'Organization',
      name: cleanIssuer,
    },
    about: {
      '@id': 'https://adham.rstcentral.com/#person',
    },
  };

  return {
    seoFilename,
    cloudinaryPublicId,
    altEn,
    altAr,
    geoCaptionEn,
    geoCaptionAr,
    schemaJsonLd: JSON.stringify(schemaObj, null, 2),
  };
}

export const BASE_ENTITY_SAME_AS = [
  'https://linkedin.com/in/adhamrst',
  'https://instagram.com/adhamrst',
  'https://t.me/adhamrst',
  'https://youtube.com/@adhamrst',
  'https://facebook.com/adhamrstt',
  'https://rstcentral.com',
  'https://www.wikidata.org/wiki/Q141600726',
  'https://www.crunchbase.com/person/adham-medhat',
  'https://www.signalhire.com/profiles/adham-ahmed/237556949',
  'https://gravatar.com/adhamrst',
  'https://theorg.com/org/rst-central/person/adham-medhat',
];

export const BASE_ORGANIZATION_SAME_AS = [
  'https://rstcentral.com',
  'https://socials.rstcentral.com',
  'https://theorg.com/org/rst-central',
  'https://www.wikidata.org/wiki/Q141600698',
  'https://www.crunchbase.com/organization/rst-central',
  'https://www.wikidata.org/wiki/Q141600763',
  'https://www.crunchbase.com/organization/rst-prints',
  'https://www.wikidata.org/wiki/Q141600774',
  'https://www.crunchbase.com/organization/rst-designs',
];

/**
 * Merges Crunchbase (person/org) and Wikidata URLs cleanly into Knowledge Panel sameAs arrays.
 */
export function buildKnowledgePanelSameAs(authorityLinks: {
  crunchbasePerson?: string;
  crunchbaseOrg?: string;
  wikidataPerson?: string;
}): {
  personSameAs: string[];
  organizationSameAs: string[];
} {
  const isValidHttps = (url?: string): url is string =>
    Boolean(url && /^https:\/\/[^\s]+$/i.test(url.trim()));

  const personSet = new Set<string>(BASE_ENTITY_SAME_AS);
  if (isValidHttps(authorityLinks.crunchbasePerson)) {
    personSet.add(authorityLinks.crunchbasePerson.trim());
  }
  if (isValidHttps(authorityLinks.wikidataPerson)) {
    personSet.add(authorityLinks.wikidataPerson.trim());
  }

  const orgSet = new Set<string>(BASE_ORGANIZATION_SAME_AS);
  if (isValidHttps(authorityLinks.crunchbaseOrg)) {
    orgSet.add(authorityLinks.crunchbaseOrg.trim());
  }

  return {
    personSameAs: Array.from(personSet),
    organizationSameAs: Array.from(orgSet),
  };
}
