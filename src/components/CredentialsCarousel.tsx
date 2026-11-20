import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  GalleryHorizontal,
  LayoutGrid,
  Maximize2,
  Pause,
  Play,
  ShieldCheck,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CREDENTIAL_CATEGORIES,
  CredentialCategoryId,
  CredentialItem,
  CREDENTIALS,
  Language,
  LINKEDIN_CERTIFICATIONS_URL,
  UI_COPY,
} from '../data/profileData';
import {
  calculateTiltAngles,
  filterCredentialsByCategory,
  getCarouselCardTransform,
  mergeCredentials,
  TiltResult,
} from '../utils/portfolioLogic';
import { EDITORIAL_EASE, EditorialReveal, LineMaskReveal } from './MotionPrimitives';
import { ResilientImage } from './ResilientImage';

interface CredentialsCarouselProps {
  lang: Language;
  customCredentials: CredentialItem[];
  onRemoveCustomCredential: (id: string) => void;
  isOwnerMode: boolean;
  onOpenOwnerStudio: () => void;
}

const DEFAULT_TILT: TiltResult = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };

export function CredentialsCarousel({
  lang,
  customCredentials,
  onRemoveCustomCredential,
  isOwnerMode,
  onOpenOwnerStudio,
}: CredentialsCarouselProps) {
  const [selectedCategory, setSelectedCategory] = useState<CredentialCategoryId>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [isPausedByInteraction, setIsPausedByInteraction] = useState(false);
  const [tilt, setTilt] = useState<TiltResult>(DEFAULT_TILT);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const allCredentials = useMemo(
    () => mergeCredentials(CREDENTIALS, customCredentials),
    [customCredentials],
  );

  const visibleCredentials = useMemo(
    () => filterCredentialsByCategory(allCredentials, selectedCategory),
    [allCredentials, selectedCategory],
  );

  const total = visibleCredentials.length;
  const safeActiveIndex = total > 0 ? activeIndex % total : 0;
  const isRtl = lang === 'ar';

  const lightboxIndex = useMemo(() => {
    if (!lightboxId) return null;
    const idx = allCredentials.findIndex((c) => c.id === lightboxId);
    return idx >= 0 ? idx : null;
  }, [allCredentials, lightboxId]);

  // Reset to first card when owner previews a newly added certificate
  useEffect(() => {
    if (customCredentials.length > 0) {
      setSelectedCategory('all');
      setActiveIndex(0);
    }
  }, [customCredentials.length]);

  const handleCategoryChange = (categoryId: CredentialCategoryId) => {
    setSelectedCategory(categoryId);
    setActiveIndex(0);
    setTilt(DEFAULT_TILT);
  };

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setSlideDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
    setTilt(DEFAULT_TILT);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setSlideDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setTilt(DEFAULT_TILT);
  }, [total]);

  useEffect(() => {
    if (!isAutoplayEnabled || isPausedByInteraction || lightboxIndex !== null || total <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setSlideDirection(1);
      setActiveIndex((prev) => (prev + 1) % total);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [isAutoplayEnabled, isPausedByInteraction, lightboxIndex, total]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxId(null);
        setIsZoomed(false);
      } else if (event.key === 'ArrowRight') {
        const nextIdx = (lightboxIndex + 1) % allCredentials.length;
        setLightboxId(allCredentials[nextIdx].id);
        setIsZoomed(false);
      } else if (event.key === 'ArrowLeft') {
        const prevIdx = (lightboxIndex - 1 + allCredentials.length) % allCredentials.length;
        setLightboxId(allCredentials[prevIdx].id);
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allCredentials, lightboxIndex]);

  const handleStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (isRtl) goPrev();
      else goNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (isRtl) goNext();
      else goPrev();
    }
  };

  const handleActiveCardMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt(
      calculateTiltAngles(
        event.clientX - rect.left,
        event.clientY - rect.top,
        rect.width,
        rect.height,
        7,
      ),
    );
  };

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
    setIsPausedByInteraction(true);
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current !== null) {
      const delta = clientX - touchStartX.current;
      if (Math.abs(delta) > 36) {
        if (delta < 0) {
          if (isRtl) goPrev();
          else goNext();
        } else {
          if (isRtl) goNext();
          else goPrev();
        }
      }
    }
    touchStartX.current = null;
    setIsPausedByInteraction(false);
  };

  const activeCredential: CredentialItem = visibleCredentials[safeActiveIndex] ?? allCredentials[0];
  const lightboxCredential: CredentialItem | null =
    lightboxIndex !== null ? allCredentials[lightboxIndex] : null;

  return (
    <section
      id="credentials"
      className="scroll-mt-16 border-b border-[#242731] bg-[#090A0E] py-14 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* Header + Clean Visitor Playback Controls (Owner button hidden unless unlocked) */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <EditorialReveal>
              <p className="text-xs font-medium tracking-wide text-[#D4A853]">
                {UI_COPY.credentials.kicker[lang]}
              </p>
            </EditorialReveal>
            <LineMaskReveal delay={0.06}>
              <h2 className="font-editorial mt-2.5 sm:mt-3 text-balance text-3xl font-semibold leading-tight text-[#F4F3EF] sm:text-5xl">
                {UI_COPY.credentials.heading[lang]}
              </h2>
            </LineMaskReveal>
            <EditorialReveal delay={0.12}>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-7 text-[#9D9FA8]">
                {UI_COPY.credentials.lead[lang]}
              </p>
            </EditorialReveal>
          </div>

          <EditorialReveal delay={0.16} className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View Mode Switcher: Full Grid Gallery vs 3D Executive Carousel */}
            <div
              role="group"
              aria-label={lang === 'ar' ? 'طريقة عرض الشهادات' : 'Credentials display mode'}
              className="inline-flex items-center rounded-lg border border-[#242731] bg-[#101115] p-1"
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#D4A853] text-[#070709]'
                    : 'text-[#9D9FA8] hover:text-[#F4F3EF]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{lang === 'ar' ? 'معرض شامل' : 'Grid'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                aria-pressed={viewMode === 'carousel'}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#D4A853] text-[#070709]'
                    : 'text-[#9D9FA8] hover:text-[#F4F3EF]'
                }`}
              >
                <GalleryHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{lang === 'ar' ? 'سلايدر 3D' : 'Carousel'}</span>
              </button>
            </div>

            {/* Only visible when private Owner Mode is explicitly unlocked */}
            {isOwnerMode && (
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenOwnerStudio}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#D4A853] px-4 text-xs font-semibold text-[#070709] transition-colors hover:bg-[#E8C478] whitespace-nowrap cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>{UI_COPY.credentials.addCertificate[lang]}</span>
              </motion.button>
            )}

            {viewMode === 'carousel' ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsAutoplayEnabled((prev) => !prev)}
                  aria-pressed={!isAutoplayEnabled}
                  aria-label={
                    isAutoplayEnabled
                      ? UI_COPY.credentials.autoplayPause[lang]
                      : UI_COPY.credentials.autoplayPlay[lang]
                  }
                  className="hidden sm:inline-flex h-11 items-center gap-2 rounded-lg border border-[#242731] bg-[#101115] px-3.5 text-xs font-medium text-[#D5D3CC] transition-colors hover:border-[#D4A853] hover:text-[#F4F3EF] whitespace-nowrap cursor-pointer"
                >
                  {isAutoplayEnabled ? (
                    <Pause className="h-3.5 w-3.5 text-[#D4A853]" aria-hidden="true" />
                  ) : (
                    <Play className="h-3.5 w-3.5 text-[#D4A853]" aria-hidden="true" />
                  )}
                  <span>
                    {isAutoplayEnabled
                      ? UI_COPY.credentials.autoplayPause[lang]
                      : UI_COPY.credentials.autoplayPlay[lang]}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label={UI_COPY.credentials.prevLabel[lang]}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#242731] bg-[#101115] text-[#F4F3EF] transition-colors hover:border-[#D4A853] hover:text-[#D4A853] cursor-pointer"
                  >
                    <ChevronLeft className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label={UI_COPY.credentials.nextLabel[lang]}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#242731] bg-[#101115] text-[#F4F3EF] transition-colors hover:border-[#D4A853] hover:text-[#D4A853] cursor-pointer"
                  >
                    <ChevronRight
                      className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-lg border border-[#242731] bg-[#101115] text-xs font-medium text-[#D4A853]">
                <span>
                  {total} {lang === 'ar' ? 'اعتمادات معروضة' : 'Credentials'}
                </span>
              </div>
            )}
          </EditorialReveal>
        </div>

        {/* Filter Bar + Direct LinkedIn Link (Horizontally scrollable on mobile) */}
        <EditorialReveal
          delay={0.18}
          className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-y border-[#242731] py-3.5 sm:py-4"
        >
          <div
            role="group"
            aria-label={lang === 'ar' ? 'تصفية الشهادات حسب المجال' : 'Filter credentials by discipline'}
            className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-0.5"
          >
            {CREDENTIAL_CATEGORIES.map((category) => {
              const isSelected = category.id === selectedCategory;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  aria-pressed={isSelected}
                  className={`min-h-9 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#D4A853] text-[#070709] font-semibold'
                      : 'bg-[#101115] text-[#9D9FA8] border border-[#242731] hover:border-[#3A3E4C] hover:text-[#F4F3EF]'
                  }`}
                >
                  {category.label[lang]}
                </button>
              );
            })}
          </div>

          <a
            href={LINKEDIN_CERTIFICATIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4A853] transition-colors hover:text-[#E8C478] whitespace-nowrap shrink-0"
          >
            <span>{UI_COPY.credentials.viewAllLinkedin[lang]}</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </EditorialReveal>

        {/* VIEW CONDITIONAL: GRID vs 3D CAROUSEL */}
        {viewMode === 'grid' ? (
          <EditorialReveal delay={0.2} className="mt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCredentials.map((credential, idx) => (
                <motion.div
                  key={credential.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: EDITORIAL_EASE }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#242731] bg-[#101115] p-2.5 sm:p-3 transition-all duration-300 hover:border-[#D4A853]/60 hover:shadow-xl hover:shadow-[#D4A853]/5"
                >
                  <div>
                    {/* Media Thumbnail with Quick Lightbox Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        setLightboxId(credential.id);
                        setIsZoomed(false);
                      }}
                      aria-label={`${UI_COPY.credentials.inspectButton[lang]}: ${credential.title[lang]}`}
                      className="relative aspect-[1.38/1] w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#13151F] via-[#0B0C10] to-[#07070A] flex items-center justify-center p-2 sm:p-2.5 cursor-pointer block text-start"
                    >
                      <ResilientImage
                        src={credential.image}
                        alt={credential.imageAlt[lang]}
                        fallbackLabel={credential.title.en}
                        loading="lazy"
                        className="h-full w-full object-contain rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.65)] ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-[1.01]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070709]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-[#242731] bg-[#070709]/85 px-2.5 py-1 text-xs font-medium text-[#F4F3EF] backdrop-blur-sm">
                        <Maximize2 className="h-3 w-3 text-[#D4A853]" aria-hidden="true" />
                        <span>{UI_COPY.credentials.inspectButton[lang]}</span>
                      </div>

                      <div className="absolute bottom-2.5 start-3 inline-flex items-center rounded-md bg-[#070709]/85 px-2 py-0.5 text-[10px] font-medium text-[#D4A853] backdrop-blur-sm border border-[#242731]">
                        {credential.category[lang]}
                      </div>
                    </button>

                    {/* Metadata Header */}
                    <div className="px-2 pt-3.5 pb-2">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-[#D4A853] truncate">
                          {credential.issuer[lang]}
                        </span>
                        <span className="text-[11px] tabular-nums text-[#9D9FA8] shrink-0">
                          {credential.year}
                        </span>
                      </div>

                      <h3 className="font-editorial mt-1.5 text-xl font-semibold leading-snug text-[#F4F3EF] group-hover:text-[#D4A853] transition-colors">
                        {credential.title[lang]}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-[#9D9FA8] line-clamp-3">
                        {credential.description[lang]}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Identity Alignment & LinkedIn Direct Link */}
                  <div className="mt-3 flex items-center justify-between border-t border-[#242731]/70 px-2 pt-3 text-[11px]">
                    <span className="text-[#858894] truncate">{credential.issuedTo}</span>
                    <a
                      href={credential.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#D4A853] hover:text-[#E8C478] transition-colors shrink-0"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </EditorialReveal>
        ) : (
          <>
            {/* MOBILE UNIFIED SHOWCASE (< md) */}
            <EditorialReveal delay={0.2} className="mt-6 md:hidden">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={UI_COPY.credentials.kicker[lang]}
            onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
            className="relative overflow-hidden rounded-2xl border border-[#242731] bg-[#101115]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeCredential.id}-${lang}`}
                initial={{ opacity: 0, x: slideDirection * (isRtl ? -26 : 26) }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection * (isRtl ? 26 : -26) }}
                transition={{ duration: 0.34, ease: EDITORIAL_EASE }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLightboxId(activeCredential.id);
                    setIsZoomed(false);
                  }}
                  aria-label={`${UI_COPY.credentials.inspectButton[lang]}: ${activeCredential.title[lang]}`}
                  className="group block w-full text-start cursor-pointer"
                >
                  <div className="relative aspect-[1.38/1] w-full overflow-hidden bg-gradient-to-b from-[#13151F] via-[#0B0C10] to-[#07070A] flex items-center justify-center p-2 sm:p-2.5">
                    <ResilientImage
                      src={activeCredential.image}
                      alt={activeCredential.imageAlt[lang]}
                      fallbackLabel={activeCredential.title.en}
                      loading="eager"
                      className="h-full w-full object-contain rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.65)] ring-1 ring-white/10"
                    />
                    <div className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-[#242731] bg-[#070709]/85 px-2.5 py-1.5 text-xs font-medium text-[#F4F3EF] backdrop-blur-sm">
                      <Maximize2 className="h-3.5 w-3.5 text-[#D4A853]" aria-hidden="true" />
                      <span>{UI_COPY.credentials.inspectButton[lang]}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#9D9FA8]">
                      <span className="truncate font-medium text-[#D4A853]">
                        {activeCredential.issuer[lang]}
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {String(safeActiveIndex + 1).padStart(2, '0')} /{' '}
                        {String(total).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="font-editorial mt-2 text-2xl font-semibold leading-snug text-[#F4F3EF]">
                      {activeCredential.title[lang]}
                    </h3>

                    <p className="mt-2.5 text-xs leading-6 text-[#9D9FA8]">
                      {activeCredential.description[lang]}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#242731] pt-3 text-[11px] text-[#C8C7C1]">
                      <span>{activeCredential.issuedTo}</span>
                      <span className="tabular-nums text-[#D4A853]">{activeCredential.year}</span>
                    </div>
                  </div>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </EditorialReveal>

        {/* DESKTOP UNIFIED SHOWCASE (md+) */}
        <EditorialReveal delay={0.2} className="hidden md:block">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={UI_COPY.credentials.kicker[lang]}
            tabIndex={0}
            onKeyDown={handleStageKeyDown}
            onMouseEnter={() => setIsPausedByInteraction(true)}
            onMouseLeave={() => {
              setIsPausedByInteraction(false);
              setTilt(DEFAULT_TILT);
            }}
            onFocus={() => setIsPausedByInteraction(true)}
            onBlur={() => setIsPausedByInteraction(false)}
            onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
            className="carousel-stage relative mt-8 flex h-[560px] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#242731] bg-[#0B0C10] px-4 py-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
          >
            {visibleCredentials.map((credential, index) => {
              const cardTransform = getCarouselCardTransform(index, safeActiveIndex, total, isRtl);
              const isFront = cardTransform.isActive;
              const outerTransform = `translate3d(${cardTransform.translateXPercent}%, 0, ${cardTransform.translateZPx}px) rotateY(${cardTransform.rotateYDeg}deg) scale(${cardTransform.scale})`;

              return (
                <div
                  key={credential.id}
                  aria-hidden={!cardTransform.isVisible}
                  style={{
                    transform: outerTransform,
                    opacity: cardTransform.opacity,
                    zIndex: cardTransform.zIndex,
                    pointerEvents: cardTransform.isVisible ? 'auto' : 'none',
                  }}
                  className="carousel-card-3d absolute w-full max-w-[460px] lg:max-w-[480px]"
                >
                  <div
                    onMouseMove={isFront ? handleActiveCardMove : undefined}
                    onMouseLeave={isFront ? () => setTilt(DEFAULT_TILT) : undefined}
                    style={
                      isFront
                        ? {
                            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                          }
                        : undefined
                    }
                    className={`tilt-surface relative overflow-hidden rounded-2xl border bg-[#111319] transition-colors ${
                      isFront
                        ? 'border-[#D4A853]/70 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)]'
                        : 'border-[#242731] hover:border-[#3A3E4C]'
                    }`}
                  >
                    {isFront ? (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 opacity-70"
                        style={{
                          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(212, 168, 83, 0.13), transparent 55%)`,
                        }}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-20 bg-[#0B0C10]/65 backdrop-blur-[1.5px] transition-opacity duration-300"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (isFront) {
                          setLightboxId(credential.id);
                          setIsZoomed(false);
                        } else {
                          setActiveIndex(index);
                          setTilt(DEFAULT_TILT);
                        }
                      }}
                      aria-label={
                        isFront
                          ? `${UI_COPY.credentials.inspectButton[lang]}: ${credential.title[lang]}`
                          : credential.title[lang]
                      }
                      className="group block w-full text-start cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D4A853]"
                    >
                      <div className="relative aspect-[1.38/1] w-full overflow-hidden bg-gradient-to-b from-[#13151F] via-[#0B0C10] to-[#07070A] flex items-center justify-center p-2 sm:p-2.5">
                        <ResilientImage
                          src={credential.image}
                          alt={credential.imageAlt[lang]}
                          fallbackLabel={credential.title.en}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          className="h-full w-full object-contain rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.65)] ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-[1.01]"
                        />
                        {isFront && (
                          <div className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-[#242731] bg-[#070709]/85 px-2.5 py-1.5 text-xs font-medium text-[#F4F3EF] backdrop-blur-sm">
                            <Maximize2 className="h-3.5 w-3.5 text-[#D4A853]" aria-hidden="true" />
                            <span>{UI_COPY.credentials.inspectButton[lang]}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#9D9FA8]">
                          <span className="font-medium text-[#D4A853]">
                            {credential.category[lang]}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[200px]">{credential.issuer[lang]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{credential.year}</span>
                        </div>

                        <h3 className="font-editorial mt-2 text-xl sm:text-2xl font-semibold text-[#F4F3EF] line-clamp-2">
                          {credential.title[lang]}
                        </h3>

                        <p className="mt-3 border-t border-[#242731] pt-3 text-xs font-medium text-[#C8C7C1] truncate">
                          {credential.issuedTo}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </EditorialReveal>

        {/* Unified Bottom Strip: Active Description + Compact Thumbnail Jump Rail */}
        <div className="mt-5 sm:mt-6 flex flex-col gap-5">
          <div className="hidden md:flex items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-sm leading-6 text-[#C8C7C1]">
                {activeCredential.description[lang]}
              </p>
              <p className="mt-1 text-xs text-[#858894]">
                {UI_COPY.credentials.entityAlignmentNote[lang]}
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium text-[#D4A853] tabular-nums">
              {String(safeActiveIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>

          <div
            role="tablist"
            aria-label={lang === 'ar' ? 'التنقل السريع بين الشهادات' : 'Quick jump between certificates'}
            className="no-scrollbar flex items-center gap-2.5 overflow-x-auto pb-1"
          >
            {visibleCredentials.map((item, idx) => {
              const isSelected = idx === safeActiveIndex;
              return (
                <button
                  key={`thumb-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`${idx + 1}: ${item.title[lang]}`}
                  onClick={() => {
                    setSlideDirection(idx >= safeActiveIndex ? 1 : -1);
                    setActiveIndex(idx);
                    setTilt(DEFAULT_TILT);
                  }}
                  className={`group flex shrink-0 items-center gap-2.5 rounded-lg border p-1.5 pe-3 text-start transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#D4A853] bg-[#161820]'
                      : 'border-[#242731] bg-[#0D0E13] opacity-75 hover:opacity-100 hover:border-[#3A3E4C]'
                  }`}
                >
                  <div className="h-9 w-12 shrink-0 overflow-hidden rounded bg-[#070709]">
                    <ResilientImage
                      src={item.image}
                      alt=""
                      fallbackLabel={item.title.en}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="max-w-[140px]">
                    <p
                      className={`truncate text-xs font-medium ${
                        isSelected ? 'text-[#F4F3EF]' : 'text-[#9D9FA8]'
                      }`}
                    >
                      {item.title[lang]}
                    </p>
                    <p className="truncate text-[10px] text-[#7D808D] tabular-nums">{item.year}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </>
    )}
      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      <AnimatePresence>
        {lightboxCredential && lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="credential-lightbox-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#040406]/92 p-3 sm:p-8 backdrop-blur-md"
            onClick={() => {
              setLightboxId(null);
              setIsZoomed(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.34, ease: EDITORIAL_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#242731] bg-[#0D0E13]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[#242731] px-4 py-3.5 sm:px-7 sm:py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#9D9FA8]">
                    <span className="font-semibold text-[#D4A853] tabular-nums">
                      {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                      {String(allCredentials.length).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{lightboxCredential.issuer[lang]}</span>
                  </div>
                  <h3
                    id="credential-lightbox-title"
                    className="font-editorial truncate text-lg font-semibold text-[#F4F3EF] sm:text-2xl"
                  >
                    {lightboxCredential.title[lang]}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsZoomed((z) => !z)}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#242731] bg-[#14161D] px-3 text-xs font-medium text-[#F4F3EF] transition-colors hover:border-[#D4A853] cursor-pointer"
                  >
                    {isZoomed ? (
                      <ZoomOut className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
                    ) : (
                      <ZoomIn className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
                    )}
                    <span className="hidden sm:inline">
                      {isZoomed
                        ? UI_COPY.credentials.lightboxZoomOut[lang]
                        : UI_COPY.credentials.lightboxZoomIn[lang]}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLightboxId(null);
                      setIsZoomed(false);
                    }}
                    aria-label={UI_COPY.credentials.lightboxClose[lang]}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#242731] bg-[#14161D] text-[#F4F3EF] transition-colors hover:border-[#D4A853] hover:text-[#D4A853] cursor-pointer"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
                <div className="flex items-center justify-center overflow-auto bg-[#070709] p-4 sm:p-6 lg:col-span-7">
                  <div
                    className={`transition-transform duration-300 ${
                      isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed((z) => !z)}
                  >
                    <ResilientImage
                      src={lightboxCredential.image}
                      alt={lightboxCredential.imageAlt[lang]}
                      fallbackLabel={lightboxCredential.title.en}
                      loading="eager"
                      className="max-h-[54vh] w-full rounded-xl object-contain"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between border-t border-[#242731] p-5 sm:p-6 lg:col-span-5 lg:border-s lg:border-t-0">
                  <div>
                    <p className="text-xs font-medium text-[#D4A853]">
                      {lightboxCredential.category[lang]}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#C8C7C1]">
                      {lightboxCredential.description[lang]}
                    </p>

                    <ul className="mt-5 space-y-2 border-t border-[#242731] pt-4">
                      {lightboxCredential.highlights[lang].map((point, idx) => (
                        <li key={point} className="flex items-baseline gap-3 text-sm text-[#E2DFD7]">
                          <span className="font-editorial text-sm font-semibold text-[#D4A853] tabular-nums">
                            0{idx + 1}
                          </span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <a
                        href={lightboxCredential.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4A853] hover:text-[#E8C478]"
                      >
                        <span>{UI_COPY.credentials.viewAllLinkedin[lang]}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>

                      {isOwnerMode && lightboxCredential.isUserUploaded && (
                        <button
                          type="button"
                          onClick={() => {
                            onRemoveCustomCredential(lightboxCredential.id);
                            setLightboxId(null);
                            setIsZoomed(false);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E57373] hover:underline cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{UI_COPY.credentials.removeUploaded[lang]}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 border-t border-[#242731] pt-5">
                    <div>
                      <p className="text-xs font-semibold text-[#F4F3EF]">
                        {lightboxCredential.issuedTo}
                      </p>
                      <p className="mt-1 text-xs text-[#858894]">
                        {UI_COPY.credentials.entityAlignmentNote[lang]}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const prevIdx =
                            (lightboxIndex - 1 + allCredentials.length) % allCredentials.length;
                          setLightboxId(allCredentials[prevIdx].id);
                          setIsZoomed(false);
                        }}
                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#242731] px-3.5 text-xs font-medium text-[#F4F3EF] transition-colors hover:border-[#D4A853] cursor-pointer"
                      >
                        <ChevronLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
                        <span>{UI_COPY.credentials.prevLabel[lang]}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx = (lightboxIndex + 1) % allCredentials.length;
                          setLightboxId(allCredentials[nextIdx].id);
                          setIsZoomed(false);
                        }}
                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#242731] px-3.5 text-xs font-medium text-[#F4F3EF] transition-colors hover:border-[#D4A853] cursor-pointer"
                      >
                        <span>{UI_COPY.credentials.nextLabel[lang]}</span>
                        <ChevronRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
