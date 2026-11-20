/**
 * Central Production Entity & Drop-In Media Configuration
 *
 * DROP-IN REPLACEMENT GUIDE (Zero code changes needed for images):
 * Replace any image inside `/public/images/` using the exact filename below
 * and push to GitHub — GitHub Pages automatically updates the live site,
 * OpenGraph share cards, Google Image Sitemap, and vCard.
 *
 * OPTIONAL CUSTOM RST CENTRAL SVG LOGO:
 * Drop your official vector logo into `/public/images/rst-central-logo.svg`
 * and change `customRstLogoUrl` below from `null` to `'/images/rst-central-logo.svg'`.
 */

export const SITE_ORIGIN = 'https://adham.rstcentral.com';

export const PUBLIC_MEDIA_ASSETS = {
  portrait: '/images/adham-medhat-portrait.jpg',
  ogCover: '/images/adham-medhat-og-cover.jpg',
  certMicroMba: '/images/adham-medhat-micro-mba-horus-university.jpg',
  certGraphicDesign: '/images/adham-medhat-graphic-design-certification.jpg',
  certMedical: '/images/adham-medhat-medical-studies-horus-university.jpg',
  ventureRst: '/images/rst-central-fabrication-venture.jpg',
  ventureDesign: '/images/adham-medhat-visual-identity-studio.jpg',
  /**
   * Official RST Central Logo (downloaded from official portal)
   */
  customRstLogoUrl: '/images/rst-central-logo.png' as string | null,
} as const;

/**
 * Google Knowledge Panel Authority Hooks (Crunchbase + Wikidata)
 *
 * Paste your exact live Crunchbase and Wikidata URLs here (and in `index.html` sameAs)
 * to strengthen entity reconciliation across Google Knowledge Graph & AI search engines.
 */
export const ENTITY_AUTHORITY_PROFILES = {
  crunchbasePersonUrl: '' as string,
  crunchbaseOrgUrl: '' as string,
  wikidataPersonUrl: '' as string,
  wikidataOrgUrl: '' as string,
} as const;
