# Adham Medhat (أدهم مدحت) — Official Personal Entity & Portfolio

Official production codebase for [adham.rstcentral.com](https://adham.rstcentral.com/).

## Overview

This static bilingual (English / Arabic, LTR / RTL) personal entity platform consolidates the academic, executive, entrepreneurial, and creative portfolio of **Adham Medhat** (**Adham Ahmed Medhat** · **أدهم أحمد مدحت**, unified handle `@adhamrst`):

- **Academic Medical Track**: Active undergraduate medical student (MBBS candidate) at Horus University Faculty of Medicine, New Damietta, Egypt.
- **Executive Education**: 90-hour Micro MBA in Strategic Management (Horus University ETC, accredited by the Supreme Council of Universities).
- **Venture Leadership**: Founder of **RST Central** (`rstcentral.com`) — B2B print manufacturing and laser engraving (`RST Prints`) alongside digital vector asset systems (`RST Designs`).
- **Visual Direction**: Certified Visual Identity & Graphic Designer.

## Architecture & Public Repository Security

- **100% Static Client-Side Architecture**: Built with React, TypeScript, Tailwind CSS, and Motion, deployed automatically to GitHub Pages via `.github/workflows/deploy-pages.yml`.
- **Zero Secrets in Repository**: No backend API keys, private tokens, or server credentials are stored or bundled. All optional owner studio settings (such as unsigned Cloudinary upload presets) reside strictly in the owner's local browser storage.
- **Security Policy**: Published at `/.well-known/security.txt` (`public/.well-known/security.txt`) with referrer and `X-Content-Type-Options` hardening in `index.html`.

## SEO, AEO & GEO Discovery Endpoints

- `index.html`: Unified Schema.org `@graph` (`ProfilePage`, `Person`, `Organization`, `EducationalOrganization`, `WebSite`, `FAQPage`, `ImageObject`), `rel="me"` IndieWeb links, `hreflang`, and zero-JS crawler fallback.
- `/robots.txt`: Explicit indexing directives for major search engines and AI answer engines.
- `/llms.txt` & `/llms-full.txt`: Structured entity summary and complete bilingual dossier for generative AI search and answer engines.
- `/sitemap.xml`: XML sitemap with Google Image Sitemap entries for the official portrait, social cover, and all WebP credentials.
- `/adham-medhat.vcf`: Direct RFC vCard 3.0 download.

## Local Development & Verification

Prerequisites: Node.js 20+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start local dev server:
   ```bash
   npm run dev
   ```
3. Run TypeScript check:
   ```bash
   npm run lint
   ```
4. Run unit tests:
   ```bash
   node ./node_modules/tsx/dist/cli.mjs --test src/utils/portfolioLogic.test.ts
   ```
5. Build production bundle:
   ```bash
   npm run build
   ```
