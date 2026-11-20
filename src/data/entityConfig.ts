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
  portraitWebp: '/images/adham-medhat-portrait.webp',
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

  /**
   * Verified High-Authority Certificates (Optimized WebP)
   */
  certificates: {
    generativeAiMicrosoft: '/images/certificates/adham-medhat-generative-ai-career-essentials-microsoft.webp',
    digitalMarketingGoogle: '/images/certificates/adham-medhat-digital-marketing-google-iab.webp',
    globalBankingHsbc: '/images/certificates/adham-medhat-global-banking-markets-hsbc.webp',
    sqlHackerrank: '/images/certificates/adham-medhat-sql-database-assessment-hackerrank.webp',
    englishEfset: '/images/certificates/adham-medhat-english-c1-advanced-efset.webp',
    freelancingKkux: '/images/certificates/adham-medhat-freelancing-kkux-hsoub.webp',
    centralBankEgypt: '/images/certificates/adham-medhat-banking-financial-central-bank-egypt.webp',
    sellingOnlineHp: '/images/certificates/adham-medhat-selling-online-hp-life.webp',
    socialMediaHp: '/images/certificates/adham-medhat-social-media-marketing-hp-life.webp',
    icdlEdraak: '/images/certificates/adham-medhat-icdl-base-specialization-edraak.webp',
    medicalOrganizerHorus: '/images/certificates/adham-medhat-medical-conference-organizer-horus-university.webp',
    medicalHonorHorus: '/images/certificates/adham-medhat-medical-conference-honor-horus-university.webp',
    medicalAttendanceHorus: '/images/certificates/adham-medhat-medical-conference-attendance-horus-university.webp',
    futureMedicineMansoura: '/images/certificates/adham-medhat-future-medicine-conference-mansoura-national-university.webp',
    researchWorkshopShokeir: '/images/certificates/adham-medhat-medical-research-ethics-workshop-prof-shokeir.webp',
    videoPremiereM3aarf: '/images/certificates/adham-medhat-adobe-premiere-video-editing-m3aarf.webp',
    imageGenGoogleCloud: '/images/certificates/adham-medhat-generative-ai-image-generation-google-cloud.webp',
    aiCareerAsean: '/images/certificates/adham-medhat-ai-career-readiness-asean-foundation.webp',
    intermediateGermanAlison: '/images/certificates/adham-medhat-intermediate-german-alison-cpd.webp',
    medicalConference2ndHorus: '/images/certificates/adham-medhat-medical-conference-2nd-annual-horus-university.webp',
  },
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
