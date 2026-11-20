# Adham Medhat — Official Personal Entity & Portfolio
## AAA-Class Master Handover & Mission Control Document

> **Live Production Domain:** [https://adham.rstcentral.com/](https://adham.rstcentral.com/)  
> **Repository:** `batata-source/Adham-Medhat` (Branch: `main`)  
> **Hosting & CI/CD:** 100% Free on GitHub Pages via GitHub Actions (`.github/workflows/deploy-pages.yml`)  
> **Zero Vercel Quota / Zero Costs Forever**

---

## 1. Core Identity & Entity Specifications
* **Primary Name:** Adham Medhat (أدهم مدحت)
* **Full Legal Name:** Adham Ahmed Medhat (أدهم أحمد مدحت)
* **Unified Social Handle:** `@adhamrst` (LinkedIn, Telegram, WhatsApp, Instagram, YouTube, Facebook)
* **Primary Academic Track:**
  * **Horus University — Faculty of Medicine** (دمياط الجديدة - جامعة حورس).
  * **Status:** Active Undergraduate Student / MBBS Candidate (قيد الدراسة الأكاديمية والسريرية — طالب مقيد).
  * **Placement Rule:** MUST always be placed at the **END** of the credentials list under `Academic Studies (Medicine)`, never at the top as a graduated doctor.
* **Executive Credentials:**
  * **Micro MBA in Strategic Management** — Horus University (Executive Track, 2025).
  * **Visual Identity & Graphic Design Professional Certification** (Verified on LinkedIn).
  * **Strategic Marketing & Commercial Growth** (Horus University Executive Track).
  * **Brand Architecture & Editorial Typography** (LinkedIn Archive).
* **Flagship Venture:**
  * **RST Central** (`https://rstcentral.com` & `https://socials.rstcentral.com`).
  * Operational Umbrella: **RST Prints** (B2B Luxury Print Manufacturing & Laser Engraving) + **RST Designs** (Vector Asset Marketplace & Brand Systems).
  * Official Business WhatsApp Bot: `+1 (202) 978-0356`.

---

## 2. Aesthetic Doctrine & AAA-Class Standards
* **Aesthetic Mood:** Dark Luxury Editorial, Swiss Typographic Precision, Quiet Wealth, Architectural Restraint.
* **Color Palette (Tokens):**
  * Deep Obsidian Background: `#070709`
  * Secondary Surfaces: `#0D0E13` / `#101115`
  * Hairline Borders: `#242731`
  * Warm Accent (Champagne Gold): `#D4A853` (Hover: `#E8C478`)
  * Text Primaries: `#F4F3EF` / Secondary: `#9D9FA8` / Muted: `#858894`
* **Typography:**
  * Display / Headings: `Cormorant Garamond` (Serif elegance, 2.5x body scale)
  * Body & UI: `Plus Jakarta Sans` (Geometric modernist clarity)
  * Arabic: `IBM Plex Sans Arabic`
* **Anti-Slop Hard Rules:**
  * **Zero emoji** anywhere in UI or copy. Use Lucide icons or pure typography.
  * **No monospace fonts** in display elements.
  * **All 8 Interactive States** on interactive components (Default, Hover, Focus-Visible, Active, Disabled, Loading, Error, Selected).
  * **Mobile-First Responsive Base** (fluid down to 320px).

---

## 3. Credentials & Certificates Architecture
* **Dual Display Mode:**
  1. **Full Grid Gallery (`LayoutGrid`)**: Responsive 3-column cards with quick Lightbox zoom, discipline tags, and direct LinkedIn credential link.
  2. **3D Executive Carousel (`GalleryHorizontal`)**: 3D tilt perspective with mouse-tracking glare, jump-rail thumbnails, and autoplay controls.
* **Interactive Lightbox Modal**: High-res inspection with 125% zoom toggle, keyboard arrow navigation, and ESC to dismiss.
* **Certificate Ingestion Workflow (When User Uploads New Certificates):**
  1. Save images to `/public/images/certificates/`.
  2. Optimize/compress to `.webp` format.
  3. Standardize file name: `adham-medhat-[certificate-name]-[issuer].webp`.
  4. Add to `CREDENTIALS` array in `src/data/profileData.ts` with English & Arabic titles, issuer, year, description, and highlights.
  5. Run `npm run build` and push to GitHub `main` via `push_files`.

---

## 4. Current File Structure
* `index.html` — Rich SEO, Knowledge Graph Schema.org JSON-LD, FAQ Schema for AI search engines, noscript crawlers fallback.
* `src/data/entityConfig.ts` — Drop-in image config & RST Central official branding.
* `src/data/profileData.ts` — Unified bilingual dataset (Credentials, Ventures, Pillars, Copy).
* `src/components/CredentialsCarousel.tsx` — Dual Grid / 3D Slider display engine with Lightbox.
* `src/components/HeroSection.tsx` — Editorial hero with magnetic CTAs and portrait effects.
* `src/components/Navbar.tsx` — 3-zone Top Bar Contract, audio controller, language switcher.
* `src/components/VenturesSection.tsx` — RST Central flagship interactive spotlight.
* `src/components/SocialHubSection.tsx` — Unified `@adhamrst` connection hub & US concierge WhatsApp bot composer.
* `public/CNAME` — `adham.rstcentral.com`.

---

## 5. Next Immediate Upgrades (AAA-Class Experience)
1. **Interactive Magnetic Hover & Smooth Cursor Spotlight**: Subtle cursor follower glow reflecting off golden borders.
2. **Kinetic Typography & Staggered Reveal**: Enhancing MotionPrimitives transitions for ultra-luxurious feel.
3. **Sound Design**: Polished ambient soundscapes with smooth volume fade.
4. **Certificate Batch Drop**: Ingesting user's real certificate files as soon as provided.
