import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildKnowledgePanelSameAs,
  buildSeoGeoCertificatePackage,
  buildVCardString,
  buildWhatsAppUrl,
  calculateTiltAngles,
  createUploadedCredential,
  filterCredentialsByCategory,
  getCarouselCardTransform,
  getCircularOffset,
  mergeCredentials,
  optimizeCloudinaryUrl,
  RST_BOT_WHATSAPP_DIGITS,
  slugifySeoToken,
} from './portfolioLogic';

test('buildVCardString generates valid RFC vCard 3.0 payload with RST Central business concierge number', () => {
  const vcf = buildVCardString();
  assert.ok(vcf.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n'));
  assert.ok(vcf.endsWith('\r\nEND:VCARD'));
  assert.ok(vcf.includes('N:Medhat;Adham;Ahmed;;'));
  assert.ok(vcf.includes('FN:Adham Medhat (أدهم مدحت)'));
  assert.ok(vcf.includes('TEL;TYPE=WORK,VOICE:+12029780356'));
  assert.ok(vcf.includes('ORG:RST Central'));
  assert.ok(vcf.includes('URL:https://adham.rstcentral.com'));
  assert.ok(vcf.includes('X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/adhamrst'));
});

test('getCircularOffset wraps smoothly across boundaries', () => {
  assert.equal(getCircularOffset(0, 0, 8), 0);
  assert.equal(getCircularOffset(1, 0, 8), 1);
  assert.equal(getCircularOffset(7, 0, 8), -1);
  assert.equal(getCircularOffset(0, 7, 8), 1);
});

test('getCarouselCardTransform produces front, adjacent, and hidden transforms with RTL support', () => {
  const active = getCarouselCardTransform(0, 0, 6, false);
  assert.equal(active.isActive, true);
  assert.equal(active.translateXPercent, 0);
  assert.equal(active.scale, 1);

  const rightLtr = getCarouselCardTransform(1, 0, 6, false);
  assert.equal(rightLtr.isVisible, true);
  assert.ok(rightLtr.translateXPercent > 0);

  const rightRtl = getCarouselCardTransform(1, 0, 6, true);
  assert.equal(rightRtl.translateXPercent, -rightLtr.translateXPercent);
  assert.equal(rightRtl.rotateYDeg, -rightLtr.rotateYDeg);
});

test('calculateTiltAngles clamps extreme pointer positions and handles zero bounds safely', () => {
  const center = calculateTiltAngles(100, 100, 200, 200, 8);
  assert.equal(center.rotateX, 0);
  assert.equal(center.rotateY, 0);

  const topRight = calculateTiltAngles(999, -50, 200, 200, 8);
  assert.equal(topRight.rotateX, 8);
  assert.equal(topRight.rotateY, 8);

  const zeroRect = calculateTiltAngles(10, 10, 0, 0, 8);
  assert.equal(zeroRect.rotateX, 0);
  assert.equal(zeroRect.rotateY, 0);
});

test('buildWhatsAppUrl routes inquiries to RST Central US bot number and rejects empty text', () => {
  const empty = buildWhatsAppUrl('RST Central', '   ');
  assert.equal(empty.valid, false);
  assert.equal(empty.url, '');

  const valid = buildWhatsAppUrl('RST Central & Fabrication', 'Need a custom batch quote.');
  assert.equal(valid.valid, true);
  assert.ok(valid.url.startsWith(`https://wa.me/${RST_BOT_WHATSAPP_DIGITS}?text=`));
  assert.ok(valid.previewText.includes('Need a custom batch quote.'));
});

test('filterCredentialsByCategory filters cleanly and returns all for "all"', () => {
  const sample = [
    { id: '1', categoryId: 'business' },
    { id: '2', categoryId: 'medical' },
    { id: '3', categoryId: 'business' },
  ];
  assert.equal(filterCredentialsByCategory(sample, 'all').length, 3);
  assert.equal(filterCredentialsByCategory(sample, 'business').length, 2);
  assert.equal(filterCredentialsByCategory(sample, 'design').length, 0);
});

test('createUploadedCredential validates required fields and builds a structured credential', () => {
  const missingTitle = createUploadedCredential({
    title: '  ',
    issuer: 'Coursera',
    categoryId: 'business',
    imageDataUrl: 'data:image/png;base64,abc',
  });
  assert.equal(missingTitle.valid, false);
  assert.equal(missingTitle.errorField, 'title');

  const missingIssuer = createUploadedCredential({
    title: 'Clinical Leadership',
    issuer: '',
    categoryId: 'medical',
    imageDataUrl: 'data:image/png;base64,abc',
  });
  assert.equal(missingIssuer.valid, false);
  assert.equal(missingIssuer.errorField, 'issuer');

  const valid = createUploadedCredential({
    title: 'AI in Healthcare Strategy',
    issuer: 'Stanford Online',
    year: '2026',
    categoryId: 'medical',
    imageDataUrl: 'data:image/png;base64,xyz',
    linkedinUrl: 'https://linkedin.com/in/adhamrst/details/certifications/',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.credential?.title.en, 'AI in Healthcare Strategy');
  assert.equal(valid.credential?.issuer.en, 'Stanford Online');
  assert.equal(valid.credential?.issuedTo, 'Issued to: Adham Ahmed (Adham Medhat)');
  assert.equal(valid.credential?.isUserUploaded, true);
});

test('mergeCredentials prepends uploaded certificates and deduplicates by id', () => {
  const defaults = [{ id: 'a' }, { id: 'b' }];
  const uploaded = [{ id: 'custom-1' }, { id: 'a' }];
  const merged = mergeCredentials(defaults, uploaded);
  assert.deepEqual(
    merged.map((item) => item.id),
    ['custom-1', 'a', 'b'],
  );
});

test('slugifySeoToken and buildSeoGeoCertificatePackage generate SEO & GEO optimized names and JSON-LD', () => {
  assert.equal(slugifySeoToken('Micro MBA & Strategy!'), 'micro-mba-strategy');
  assert.ok(slugifySeoToken('جامعة حورس').length > 4);

  const pkg = buildSeoGeoCertificatePackage({
    title: 'Executive Micro MBA',
    issuer: 'Horus University',
    year: '2026',
    categoryId: 'business',
    region: 'Egypt',
  });
  assert.equal(pkg.seoFilename, 'adham-medhat-horus-university-executive-micro-mba-egypt-2026.webp');
  assert.equal(
    pkg.cloudinaryPublicId,
    'adham-medhat-credentials/adham-medhat-horus-university-executive-micro-mba-egypt-2026',
  );
  assert.ok(pkg.altEn.includes('Adham Medhat'));
  assert.ok(pkg.altEn.includes('Horus University'));
  assert.ok(pkg.schemaJsonLd.includes('EducationalOccupationalCredential'));
});

test('optimizeCloudinaryUrl injects f_auto,q_auto,w_1400 cleanly once', () => {
  const raw = 'https://res.cloudinary.com/demo/image/upload/v1700/cert.jpg';
  const opt = optimizeCloudinaryUrl(raw);
  assert.equal(opt, 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1400/v1700/cert.jpg');
  assert.equal(optimizeCloudinaryUrl(opt), opt);
});

test('buildKnowledgePanelSameAs merges valid Crunchbase and Wikidata links safely', () => {
  const res = buildKnowledgePanelSameAs({
    crunchbasePerson: 'https://www.crunchbase.com/person/adham-medhat',
    crunchbaseOrg: 'https://www.crunchbase.com/organization/rst-central',
    wikidataPerson: 'https://www.wikidata.org/wiki/Q123456',
  });
  assert.ok(res.personSameAs.includes('https://www.crunchbase.com/person/adham-medhat'));
  assert.ok(res.personSameAs.includes('https://www.wikidata.org/wiki/Q123456'));
  assert.ok(res.organizationSameAs.includes('https://www.crunchbase.com/organization/rst-central'));
});
