import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Check,
  CloudUpload,
  Copy,
  FileCode2,
  Globe2,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ENTITY_AUTHORITY_PROFILES } from '../data/entityConfig';
import {
  CREDENTIAL_CATEGORIES,
  CredentialItem,
  Language,
  LINKEDIN_CERTIFICATIONS_URL,
  UI_COPY,
} from '../data/profileData';
import {
  buildKnowledgePanelSameAs,
  buildSeoGeoCertificatePackage,
  createUploadedCredential,
  optimizeCloudinaryUrl,
  UploadCredentialCategory,
} from '../utils/portfolioLogic';
import { EDITORIAL_EASE } from './MotionPrimitives';

interface OwnerStudioModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onPublishPreview: (credential: CredentialItem) => void;
  onLockOwnerMode?: () => void;
}

const CLOUDINARY_SETTINGS_KEY = 'adham_owner_cloudinary_cfg_v1';
const AUTHORITY_LINKS_KEY = 'adham_owner_authority_links_v1';

interface CloudinaryCfg {
  cloudName: string;
  uploadPreset: string;
}

interface AuthorityLinks {
  crunchbasePerson: string;
  crunchbaseOrg: string;
  wikidataPerson: string;
}

function loadJsonStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

export function OwnerStudioModal({
  isOpen,
  lang,
  onClose,
  onPublishPreview,
  onLockOwnerMode,
}: OwnerStudioModalProps) {
  const [activeTab, setActiveTab] = useState<'certificate' | 'knowledge'>('certificate');

  // Certificate fields
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [region, setRegion] = useState('Egypt');
  const [category, setCategory] = useState<UploadCredentialCategory>('business');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<'title' | 'issuer' | 'image' | null>(null);
  const [cloudinaryStatus, setCloudinaryStatus] = useState<string>('');
  const [isUploadingCloud, setIsUploadingCloud] = useState(false);

  // Cloudinary local owner config (never stored in git)
  const [cloudCfg, setCloudCfg] = useState<CloudinaryCfg>(() =>
    loadJsonStorage<CloudinaryCfg>(CLOUDINARY_SETTINGS_KEY, {
      cloudName: '',
      uploadPreset: '',
    }),
  );

  // Knowledge Panel authority URLs (Crunchbase personal, Crunchbase org, Wikidata)
  const [authority, setAuthority] = useState<AuthorityLinks>(() =>
    loadJsonStorage<AuthorityLinks>(AUTHORITY_LINKS_KEY, {
      crunchbasePerson: ENTITY_AUTHORITY_PROFILES.crunchbasePersonUrl,
      crunchbaseOrg: ENTITY_AUTHORITY_PROFILES.crunchbaseOrgUrl,
      wikidataPerson: ENTITY_AUTHORITY_PROFILES.wikidataPersonUrl,
    }),
  );

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(CLOUDINARY_SETTINGS_KEY, JSON.stringify(cloudCfg));
    } catch {
      // Ignore storage errors
    }
  }, [cloudCfg]);

  useEffect(() => {
    try {
      window.localStorage.setItem(AUTHORITY_LINKS_KEY, JSON.stringify(authority));
    } catch {
      // Ignore storage errors
    }
  }, [authority]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const seoGeoPkg = useMemo(
    () =>
      buildSeoGeoCertificatePackage({
        title,
        issuer,
        year,
        categoryId: category,
        linkedinUrl,
        region,
      }),
    [title, issuer, year, category, linkedinUrl, region],
  );

  const knowledgePanelData = useMemo(() => buildKnowledgePanelSameAs(authority), [authority]);

  const knowledgeSnippet = useMemo(
    () =>
      JSON.stringify(
        {
          person_sameAs: knowledgePanelData.personSameAs,
          organization_sameAs: knowledgePanelData.organizationSameAs,
        },
        null,
        2,
      ),
    [knowledgePanelData],
  );

  const llmsAuthoritySnippet = useMemo(() => {
    const lines: string[] = [];
    if (authority.crunchbasePerson.trim()) {
      lines.push(`- Crunchbase (Adham Medhat): ${authority.crunchbasePerson.trim()}`);
    }
    if (authority.crunchbaseOrg.trim()) {
      lines.push(`- Crunchbase (RST Central): ${authority.crunchbaseOrg.trim()}`);
    }
    if (authority.wikidataPerson.trim()) {
      lines.push(`- Wikidata (Adham Medhat): ${authority.wikidataPerson.trim()}`);
    }
    return lines.length > 0
      ? lines.join('\n')
      : '- Crunchbase (Adham Medhat): https://www.crunchbase.com/person/...\n- Crunchbase (RST Central): https://www.crunchbase.com/organization/...\n- Wikidata: https://www.wikidata.org/wiki/Q...';
  }, [authority]);

  const credentialExportSnippet = useMemo(() => {
    const cleanImg = imageUrl.startsWith('http')
      ? optimizeCloudinaryUrl(imageUrl)
      : `https://res.cloudinary.com/${cloudCfg.cloudName || 'YOUR_CLOUD_NAME'}/image/upload/f_auto,q_auto,w_1400/${seoGeoPkg.cloudinaryPublicId}.webp`;

    return JSON.stringify(
      {
        id: seoGeoPkg.seoFilename.replace(/\.webp$/, ''),
        categoryId: category,
        title: { en: title.trim() || 'Certificate Title', ar: title.trim() || 'اسم الشهادة' },
        category: { en: 'Verified LinkedIn Credential', ar: 'شهادة موثّقة عبر LinkedIn' },
        issuer: { en: issuer.trim() || 'Issuing Organization', ar: issuer.trim() || 'الجهة المانحة' },
        year: year.trim() || String(new Date().getFullYear()),
        issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
        image: cleanImg,
        imageAlt: { en: seoGeoPkg.altEn, ar: seoGeoPkg.altAr },
        description: { en: seoGeoPkg.geoCaptionEn, ar: seoGeoPkg.geoCaptionAr },
        highlights: {
          en: [`Issued by ${issuer.trim() || 'Accredited Body'}`, `SEO Slug: ${seoGeoPkg.seoFilename}`],
          ar: [`الجهة المانحة: ${issuer.trim() || 'الجهة المعتمدة'}`, `معرّف SEO: ${seoGeoPkg.seoFilename}`],
        },
        linkedinUrl: linkedinUrl.trim() || LINKEDIN_CERTIFICATIONS_URL,
      },
      null,
      2,
    );
  }, [category, cloudCfg.cloudName, imageUrl, issuer, linkedinUrl, seoGeoPkg, title, year]);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback gracefully
    }
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleLocalFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setCloudinaryStatus('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        if (formError === 'image') setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadToCloudinary = async () => {
    if (!selectedFile) {
      setFormError('image');
      return;
    }
    if (!cloudCfg.cloudName.trim() || !cloudCfg.uploadPreset.trim()) {
      setCloudinaryStatus(
        lang === 'ar'
          ? 'أدخل Cloud Name و Unsigned Upload Preset أولاً للرفع المباشر على Cloudinary.'
          : 'Enter your Cloudinary Cloud Name and Unsigned Upload Preset first.',
      );
      return;
    }

    setIsUploadingCloud(true);
    setCloudinaryStatus('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', cloudCfg.uploadPreset.trim());
      formData.append('public_id', seoGeoPkg.cloudinaryPublicId);
      formData.append('context', `alt=${seoGeoPkg.altEn}|caption=${seoGeoPkg.geoCaptionEn}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudCfg.cloudName.trim())}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('Cloudinary upload rejected');
      }

      const data = (await response.json()) as { secure_url?: string };
      if (data.secure_url) {
        const optimized = optimizeCloudinaryUrl(data.secure_url);
        setImageUrl(optimized);
        setCloudinaryStatus(
          lang === 'ar'
            ? `تم الرفع تلقائياً على Cloudinary باسم SEO/GEO مضبوط!`
            : `Uploaded to Cloudinary with SEO/GEO public_id & f_auto,q_auto!`,
        );
      }
    } catch {
      setCloudinaryStatus(
        lang === 'ar'
          ? 'تعذر الرفع على Cloudinary — تأكد من تفعيل Unsigned Preset والسماح بالـ public_id في إعدادات Preset.'
          : 'Cloudinary upload failed — verify your Unsigned Preset allows custom public_id.',
      );
    } finally {
      setIsUploadingCloud(false);
    }
  };

  const handlePublishPreview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const optimizedImage = imageUrl.startsWith('http') ? optimizeCloudinaryUrl(imageUrl) : imageUrl;
    const result = createUploadedCredential(
      {
        title,
        issuer,
        year,
        categoryId: category,
        imageDataUrl: optimizedImage,
        linkedinUrl,
        description: seoGeoPkg.geoCaptionEn,
      },
      LINKEDIN_CERTIFICATIONS_URL,
    );

    if (!result.valid || !result.credential) {
      setFormError(result.errorField ?? 'title');
      return;
    }

    // Apply generated SEO/GEO bilingual alt & caption
    const enriched: CredentialItem = {
      ...result.credential,
      imageAlt: { en: seoGeoPkg.altEn, ar: seoGeoPkg.altAr },
      description: { en: seoGeoPkg.geoCaptionEn, ar: seoGeoPkg.geoCaptionAr },
    };

    onPublishPreview(enriched);
    setFormError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="owner-studio-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#040406]/90 p-3 sm:p-6 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.34, ease: EDITORIAL_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#D4A853]/45 bg-[#101115] p-5 sm:p-7"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#242731] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#D4A853]">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {lang === 'ar'
                      ? 'وضع المالك الخاص · غير ظاهر للزوار'
                      : 'Private Owner Mode · Hidden from Public Visitors'}
                  </span>
                </div>
                <h3
                  id="owner-studio-title"
                  className="font-editorial mt-1 text-2xl sm:text-3xl font-semibold text-[#F4F3EF]"
                >
                  {UI_COPY.credentials.uploadModalTitle[lang]}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#9D9FA8]">
                  {UI_COPY.credentials.uploadModalNote[lang]}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onLockOwnerMode && (
                  <button
                    type="button"
                    onClick={onLockOwnerMode}
                    title={UI_COPY.credentials.lockOwnerMode[lang]}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#242731] bg-[#0B0C10] px-3 text-xs font-medium text-[#9D9FA8] transition-colors hover:border-[#E57373]/70 hover:text-[#E57373] cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">{UI_COPY.credentials.lockOwnerMode[lang]}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={UI_COPY.credentials.lightboxClose[lang]}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#242731] text-[#F4F3EF] transition-colors hover:border-[#D4A853] hover:text-[#D4A853] cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Studio Tabs */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-[#242731] bg-[#0B0C10] p-1">
              <button
                type="button"
                onClick={() => setActiveTab('certificate')}
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'certificate'
                    ? 'bg-[#D4A853] text-[#070709]'
                    : 'text-[#9D9FA8] hover:text-[#F4F3EF]'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {lang === 'ar'
                    ? 'الشهادات + SEO/GEO + Cloudinary'
                    : 'Certificate + SEO/GEO + Cloudinary'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('knowledge')}
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'knowledge'
                    ? 'bg-[#D4A853] text-[#070709]'
                    : 'text-[#9D9FA8] hover:text-[#F4F3EF]'
                }`}
              >
                <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {lang === 'ar'
                    ? 'توثيق Knowledge Panel (Crunchbase & Wikidata)'
                    : 'Knowledge Panel (Crunchbase & Wikidata)'}
                </span>
              </button>
            </div>

            {activeTab === 'certificate' ? (
              <form onSubmit={handlePublishPreview} noValidate className="mt-5 space-y-5">
                {/* Core Metadata Inputs */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="owner-cert-title" className="block text-xs font-medium text-[#9D9FA8]">
                      {UI_COPY.credentials.uploadTitleLabel[lang]}
                    </label>
                    <input
                      id="owner-cert-title"
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (formError === 'title') setFormError(null);
                      }}
                      placeholder={UI_COPY.credentials.uploadTitlePlaceholder[lang]}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#242731] bg-[#0B0C10] px-3.5 text-sm text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                    />
                    {formError === 'title' && (
                      <p role="alert" className="mt-1 text-xs text-[#E57373]">
                        {UI_COPY.credentials.uploadErrorTitle[lang]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="owner-cert-issuer" className="block text-xs font-medium text-[#9D9FA8]">
                      {UI_COPY.credentials.uploadIssuerLabel[lang]}
                    </label>
                    <input
                      id="owner-cert-issuer"
                      type="text"
                      value={issuer}
                      onChange={(e) => {
                        setIssuer(e.target.value);
                        if (formError === 'issuer') setFormError(null);
                      }}
                      placeholder={UI_COPY.credentials.uploadIssuerPlaceholder[lang]}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#242731] bg-[#0B0C10] px-3.5 text-sm text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                    />
                    {formError === 'issuer' && (
                      <p role="alert" className="mt-1 text-xs text-[#E57373]">
                        {UI_COPY.credentials.uploadErrorIssuer[lang]}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-medium text-[#9D9FA8]">
                    {UI_COPY.credentials.uploadCategoryLabel[lang]}
                  </span>
                  <div
                    role="group"
                    aria-label={UI_COPY.credentials.uploadCategoryLabel[lang]}
                    className="mt-2 flex flex-wrap gap-2"
                  >
                    {CREDENTIAL_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id as UploadCredentialCategory)}
                          aria-pressed={isSelected}
                          className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            isSelected
                              ? 'border-[#D4A853] bg-[#D4A853] text-[#070709] font-semibold'
                              : 'border-[#242731] bg-[#0B0C10] text-[#9D9FA8] hover:border-[#3A3E4C] hover:text-[#F4F3EF]'
                          }`}
                        >
                          {cat.label[lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="owner-cert-year" className="block text-xs font-medium text-[#9D9FA8]">
                      {UI_COPY.credentials.uploadYearLabel[lang]}
                    </label>
                    <input
                      id="owner-cert-year"
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#242731] bg-[#0B0C10] px-3.5 text-sm text-[#F4F3EF] tabular-nums focus:border-[#D4A853] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="owner-cert-region" className="block text-xs font-medium text-[#9D9FA8]">
                      {lang === 'ar' ? 'النطاق الجغرافي (GEO)' : 'GEO Region Signal'}
                    </label>
                    <input
                      id="owner-cert-region"
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#242731] bg-[#0B0C10] px-3.5 text-sm text-[#F4F3EF] focus:border-[#D4A853] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Live Auto-Generated SEO & GEO Filename Preview */}
                <div className="rounded-xl border border-[#D4A853]/35 bg-[#0B0C10] p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#D4A853]">
                      {lang === 'ar'
                        ? 'التسمية التلقائية المضبوطة لـ SEO و GEO'
                        : 'Auto-Generated SEO & GEO Naming'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('filename', seoGeoPkg.seoFilename)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#D4A853] hover:text-[#E8C478] cursor-pointer"
                    >
                      {copiedKey === 'filename' ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedKey === 'filename' ? 'Copied' : 'Copy Filename'}</span>
                    </button>
                  </div>
                  <p dir="ltr" className="break-all text-xs text-[#F4F3EF]">
                    {seoGeoPkg.seoFilename}
                  </p>
                  <p dir="ltr" className="break-all text-[11px] text-[#9D9FA8]">
                    Cloudinary public_id: {seoGeoPkg.cloudinaryPublicId}
                  </p>
                  <p className="text-[11px] leading-5 text-[#9D9FA8]">
                    <span className="text-[#D4A853]">ALT (GEO):</span> {seoGeoPkg.altEn}
                  </p>
                </div>

                {/* Image Picker + Optional Direct Cloudinary Unsigned Upload */}
                <div className="rounded-xl border border-[#242731] bg-[#0B0C10] p-4 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="owner-cloud-name" className="block text-[11px] font-medium text-[#9D9FA8]">
                        Cloudinary Cloud Name ({lang === 'ar' ? 'اختياري · يُحفظ في متصفحك فقط' : 'optional · local only'})
                      </label>
                      <input
                        id="owner-cloud-name"
                        type="text"
                        dir="ltr"
                        value={cloudCfg.cloudName}
                        onChange={(e) => setCloudCfg((c) => ({ ...c, cloudName: e.target.value }))}
                        placeholder="e.g., adhamrst-media"
                        className="mt-1 h-10 w-full rounded-lg border border-[#242731] bg-[#101115] px-3 text-xs text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="owner-cloud-preset" className="block text-[11px] font-medium text-[#9D9FA8]">
                        Unsigned Upload Preset
                      </label>
                      <input
                        id="owner-cloud-preset"
                        type="text"
                        dir="ltr"
                        value={cloudCfg.uploadPreset}
                        onChange={(e) => setCloudCfg((c) => ({ ...c, uploadPreset: e.target.value }))}
                        placeholder="e.g., certificates_unsigned"
                        className="mt-1 h-10 w-full rounded-lg border border-[#242731] bg-[#101115] px-3 text-xs text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label
                      htmlFor="owner-cert-file"
                      className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#34394A] bg-[#101115] px-4 text-xs font-medium text-[#F4F3EF] transition-colors hover:border-[#D4A853]"
                    >
                      <Upload className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
                      <span className="truncate">
                        {selectedFile ? selectedFile.name : UI_COPY.credentials.uploadImageHint[lang]}
                      </span>
                      <input
                        id="owner-cert-file"
                        type="file"
                        accept="image/*"
                        onChange={handleLocalFileChange}
                        className="sr-only"
                      />
                    </label>

                    <button
                      type="button"
                      disabled={isUploadingCloud}
                      onClick={handleUploadToCloudinary}
                      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#D4A853]/60 bg-[#D4A853]/12 px-4 text-xs font-semibold text-[#D4A853] transition-colors hover:bg-[#D4A853] hover:text-[#070709] disabled:opacity-50 cursor-pointer"
                    >
                      <CloudUpload className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {isUploadingCloud
                          ? lang === 'ar'
                            ? 'جارٍ الرفع...'
                            : 'Uploading...'
                          : lang === 'ar'
                            ? 'رفع مباشر على Cloudinary'
                            : 'Upload to Cloudinary'}
                      </span>
                    </button>
                  </div>

                  <div>
                    <label htmlFor="owner-cert-image-url" className="block text-[11px] font-medium text-[#9D9FA8]">
                      {lang === 'ar'
                        ? 'أو الصق رابط Cloudinary مباشرة (يتم تحسينه تلقائياً بـ f_auto,q_auto)'
                        : 'Or paste a Cloudinary URL directly (auto-optimized with f_auto,q_auto)'}
                    </label>
                    <input
                      id="owner-cert-image-url"
                      type="url"
                      dir="ltr"
                      value={imageUrl.startsWith('data:') ? '' : imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        if (formError === 'image') setFormError(null);
                      }}
                      placeholder="https://res.cloudinary.com/..."
                      className="mt-1 h-10 w-full rounded-lg border border-[#242731] bg-[#101115] px-3 text-xs text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                    />
                  </div>

                  {cloudinaryStatus && (
                    <p className="text-xs font-medium text-[#D4A853]">{cloudinaryStatus}</p>
                  )}
                  {formError === 'image' && (
                    <p role="alert" className="text-xs text-[#E57373]">
                      {UI_COPY.credentials.uploadErrorImage[lang]}
                    </p>
                  )}
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label htmlFor="owner-cert-linkedin" className="block text-xs font-medium text-[#9D9FA8]">
                    {UI_COPY.credentials.uploadUrlLabel[lang]}
                  </label>
                  <input
                    id="owner-cert-linkedin"
                    type="url"
                    dir="ltr"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/adhamrst/details/certifications/"
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#242731] bg-[#0B0C10] px-3.5 text-sm text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                  />
                </div>

                {/* Ready-to-Commit Export Buttons for GitHub Pages */}
                <div className="flex flex-wrap items-center gap-2.5 border-t border-[#242731] pt-4">
                  <button
                    type="button"
                    onClick={() => handleCopy('ts', credentialExportSnippet)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[#242731] bg-[#0B0C10] px-3.5 py-2 text-xs font-medium text-[#F4F3EF] hover:border-[#D4A853] cursor-pointer"
                  >
                    {copiedKey === 'ts' ? (
                      <Check className="h-3.5 w-3.5 text-[#D4A853]" />
                    ) : (
                      <FileCode2 className="h-3.5 w-3.5 text-[#D4A853]" />
                    )}
                    <span>
                      {copiedKey === 'ts'
                        ? lang === 'ar'
                          ? 'تم نسخ كود الشهادة'
                          : 'Copied profileData entry'
                        : lang === 'ar'
                          ? 'نسخ كود الشهادة لـ GitHub'
                          : 'Copy profileData.ts Entry'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy('jsonld', seoGeoPkg.schemaJsonLd)}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[#242731] bg-[#0B0C10] px-3.5 py-2 text-xs font-medium text-[#F4F3EF] hover:border-[#D4A853] cursor-pointer"
                  >
                    {copiedKey === 'jsonld' ? (
                      <Check className="h-3.5 w-3.5 text-[#D4A853]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-[#D4A853]" />
                    )}
                    <span>
                      {copiedKey === 'jsonld'
                        ? lang === 'ar'
                          ? 'تم نسخ Schema JSON-LD'
                          : 'Copied Schema JSON-LD'
                        : lang === 'ar'
                          ? 'نسخ Schema JSON-LD'
                          : 'Copy Schema JSON-LD'}
                    </span>
                  </button>

                  <button
                    type="submit"
                    className="ms-auto inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#D4A853] px-5 py-2.5 text-xs font-semibold text-[#070709] transition-colors hover:bg-[#E8C478] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>{UI_COPY.credentials.uploadSubmit[lang]}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Tab 2: Google Knowledge Panel (Crunchbase + Wikidata) Authority Builder */
              <div className="mt-5 space-y-4">
                <p className="text-xs leading-6 text-[#9D9FA8]">
                  {lang === 'ar'
                    ? 'أضف روابط حساب Crunchbase الشخصي وحساب شركة RST Central ورابط صفحة Wikidata (Q-ID) لتوليد مصفوفة sameAs الرسمية الجاهزة لرفع قوة Google Knowledge Panel.'
                    : 'Paste your verified Crunchbase Person URL, RST Central Crunchbase Organization URL, and Wikidata Q-ID URL to generate the exact Knowledge Panel sameAs arrays for index.html.'}
                </p>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="kp-cb-person" className="block text-xs font-medium text-[#9D9FA8]">
                      Crunchbase Personal Profile URL
                    </label>
                    <input
                      id="kp-cb-person"
                      type="url"
                      dir="ltr"
                      value={authority.crunchbasePerson}
                      onChange={(e) =>
                        setAuthority((prev) => ({ ...prev, crunchbasePerson: e.target.value }))
                      }
                      placeholder="https://www.crunchbase.com/person/adham-medhat"
                      className="mt-1 h-11 w-full rounded-xl border border-[#242731] bg-[#0B0C10] px-3.5 text-sm text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="kp-cb-org" className="block text-xs font-medium text-[#9D9FA8]">
                      Crunchbase Company URL (RST Central)
                    </label>
                    <input
                      id="kp-cb-org"
                      type="url"
                      dir="ltr"
                      value={authority.crunchbaseOrg}
                      onChange={(e) =>
                        setAuthority((prev) => ({ ...prev, crunchbaseOrg: e.target.value }))
                      }
                      placeholder="https://www.crunchbase.com/organization/rst-central"
                      className="mt-1 h-11 w-full rounded-xl border border-[#242731] bg-[#0B0C10] px-3.5 text-sm text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="kp-wikidata" className="block text-xs font-medium text-[#9D9FA8]">
                      Wikidata Entity URL (Q-ID)
                    </label>
                    <input
                      id="kp-wikidata"
                      type="url"
                      dir="ltr"
                      value={authority.wikidataPerson}
                      onChange={(e) =>
                        setAuthority((prev) => ({ ...prev, wikidataPerson: e.target.value }))
                      }
                      placeholder="https://www.wikidata.org/wiki/Q..."
                      className="mt-1 h-11 w-full rounded-xl border border-[#242731] bg-[#0B0C10] px-3.5 text-sm text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-[#242731] bg-[#0B0C10] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#242731]">
                    <span className="text-xs font-semibold text-[#D4A853]">
                      Updated Knowledge Graph sameAs JSON
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleCopy('llms', llmsAuthoritySnippet)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8C7C1] hover:text-[#D4A853] cursor-pointer"
                      >
                        {copiedKey === 'llms' ? (
                          <Check className="h-3.5 w-3.5 text-[#D4A853]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-[#D4A853]" />
                        )}
                        <span>{copiedKey === 'llms' ? 'Copied llms.txt' : 'Copy llms.txt Lines'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy('kp', knowledgeSnippet)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4A853] hover:text-[#E8C478] cursor-pointer"
                      >
                        {copiedKey === 'kp' ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>{copiedKey === 'kp' ? 'Copied JSON' : 'Copy JSON'}</span>
                      </button>
                    </div>
                  </div>
                  <pre dir="ltr" className="mt-3 max-h-52 overflow-auto text-xs leading-5 text-[#C8C7C1] font-sans whitespace-pre-wrap break-all">
                    {knowledgeSnippet}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
