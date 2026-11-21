import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Check, Volume2 } from 'lucide-react';
import { AnimatePresence, motion, MotionConfig, useScroll, useSpring } from 'motion/react';
import { CredentialsCarousel } from './components/CredentialsCarousel';
import { EntityFaqSection } from './components/EntityFaqSection';
import { FastScrollThumb } from './components/FastScrollThumb';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { JourneySection } from './components/JourneySection';
import { EDITORIAL_EASE } from './components/MotionPrimitives';
import { Navbar } from './components/Navbar';
import { SocialHubSection } from './components/SocialHubSection';
import { VenturesSection } from './components/VenturesSection';
import { CredentialItem, Language, UI_COPY } from './data/profileData';
import { ambientAudio } from './utils/ambientAudio';
import { buildVCardString, sanitizeStoredCredentials } from './utils/portfolioLogic';

const QrPassModal = lazy(() =>
  import('./components/QrPassModal').then((module) => ({ default: module.QrPassModal })),
);
const OwnerStudioModal = lazy(() =>
  import('./components/OwnerStudioModal').then((module) => ({
    default: module.OwnerStudioModal,
  })),
);

const UPLOADED_CERTS_STORAGE_KEY = 'adham_uploaded_credentials_v1';
const PREFERRED_LANG_STORAGE_KEY = 'adham_preferred_lang_v1';

const SEO_PAGE_TITLES: Record<Language, string> = {
  en: 'Adham Medhat (أدهم مدحت) — Medical Student, Founder & Creative Director',
  ar: 'أدهم مدحت (Adham Medhat) — طالب طب بشري، مؤسس RST Central ومصمم هويات بصرية',
};

const SEO_PAGE_DESCRIPTIONS: Record<Language, string> = {
  en: 'Official personal website of Adham Medhat (Adham Ahmed Medhat · أدهم مدحت) — Medical Student at Horus University, Founder of RST Central, Micro MBA holder, and Graphic Designer.',
  ar: 'الموقع الرسمي لأدهم مدحت (أدهم أحمد مدحت) — طالب طب بشري بجامعة حورس، مؤسس منصة RST Central، حاصل على Micro MBA، ومصمم جرافيك وهويات بصرية.',
};

function loadStoredCredentials(): CredentialItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(UPLOADED_CERTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return sanitizeStoredCredentials(parsed);
  } catch {
    return [];
  }
}

function detectInitialOwnerMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('studio') === '1' || window.location.hash === '#studio';
}

function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang');
  if (queryLang === 'ar' || queryLang === 'en') return queryLang;
  try {
    const storedLang = window.localStorage.getItem(PREFERRED_LANG_STORAGE_KEY);
    if (storedLang === 'ar' || storedLang === 'en') return storedLang;
  } catch {
    // Ignore storage access errors
  }
  return 'en';
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => detectInitialLanguage());
  const [vcardSaved, setVcardSaved] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [hasLoadedQrModal, setHasLoadedQrModal] = useState(false);
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => detectInitialOwnerMode());
  const [isOwnerStudioOpen, setIsOwnerStudioOpen] = useState<boolean>(() =>
    detectInitialOwnerMode(),
  );
  const [hasLoadedOwnerModal, setHasLoadedOwnerModal] = useState<boolean>(() =>
    detectInitialOwnerMode(),
  );
  const [customCredentials, setCustomCredentials] = useState<CredentialItem[]>(() =>
    loadStoredCredentials(),
  );

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = SEO_PAGE_TITLES[lang];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', SEO_PAGE_DESCRIPTIONS[lang]);
    }
    try {
      window.localStorage.setItem(PREFERRED_LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage quota errors
    }
  }, [lang]);

  const handleLanguageChange = useCallback((nextLang: Language) => {
    setLang(nextLang);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (nextLang === 'ar') {
          url.searchParams.set('lang', 'ar');
        } else {
          url.searchParams.delete('lang');
        }
        window.history.replaceState(null, '', url.toString());
      } catch {
        // Ignore History API errors
      }
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(UPLOADED_CERTS_STORAGE_KEY, JSON.stringify(customCredentials));
    } catch {
      // Ignore storage quota errors
    }
  }, [customCredentials]);

  // Hidden owner keyboard shortcut (Ctrl+Shift+U or Cmd+Shift+U)
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'u') {
        event.preventDefault();
        setIsOwnerMode(true);
        setHasLoadedOwnerModal(true);
        setIsOwnerStudioOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => {
      ambientAudio.stop();
    };
  }, []);

  // Gracefully fade in calm ambient jazz upon first interaction if not explicitly muted
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('adham_ambient_muted') === 'true') return;

    let isCleanedUp = false;

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;
      window.removeEventListener('click', triggerOnFirstInteraction);
      window.removeEventListener('touchend', triggerOnFirstInteraction);
      window.removeEventListener('pointerup', triggerOnFirstInteraction);
      window.removeEventListener('keydown', triggerOnFirstInteraction);
    };

    const triggerOnFirstInteraction = async () => {
      if (sessionStorage.getItem('adham_ambient_muted') === 'true') {
        cleanup();
        return;
      }

      if (!ambientAudio.getPlayingState()) {
        const started = await ambientAudio.start();
        if (started) {
          setIsAmbientPlaying(true);
          cleanup();
        }
      } else {
        setIsAmbientPlaying(true);
        cleanup();
      }
    };

    // Mobile browsers (Safari/Chrome) accept completed gesture events (click, touchend, pointerup)
    window.addEventListener('click', triggerOnFirstInteraction, { passive: true });
    window.addEventListener('touchend', triggerOnFirstInteraction, { passive: true });
    window.addEventListener('pointerup', triggerOnFirstInteraction, { passive: true });
    window.addEventListener('keydown', triggerOnFirstInteraction, { passive: true });

    return cleanup;
  }, []);

  const handleToggleAmbient = useCallback(async () => {
    if (ambientAudio.getPlayingState()) {
      ambientAudio.stop();
      setIsAmbientPlaying(false);
      try {
        sessionStorage.setItem('adham_ambient_muted', 'true');
      } catch {}
    } else {
      try {
        sessionStorage.removeItem('adham_ambient_muted');
      } catch {}
      const started = await ambientAudio.start();
      setIsAmbientPlaying(started);
    }
  }, []);

  const handleDownloadVCard = useCallback(() => {
    const vcfPayload = buildVCardString();
    const blob = new Blob([vcfPayload], { type: 'text/vcard;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = 'adham-medhat.vcf';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    setVcardSaved(true);
    window.setTimeout(() => setVcardSaved(false), 3500);
  }, []);

  const handleUnlockOwnerStudio = useCallback(() => {
    setIsOwnerMode(true);
    setHasLoadedOwnerModal(true);
    setIsOwnerStudioOpen(true);
  }, []);

  const handleLockOwnerMode = useCallback(() => {
    setIsOwnerStudioOpen(false);
    setIsOwnerMode(false);
  }, []);

  const handleOpenQrPass = useCallback(() => {
    setHasLoadedQrModal(true);
    setIsQrOpen(true);
  }, []);

  const handlePublishPreview = useCallback((credential: CredentialItem) => {
    setCustomCredentials((prev) => [credential, ...prev]);
  }, []);

  const handleRemoveCustomCredential = useCallback((id: string) => {
    setCustomCredentials((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#070709] text-[#F4F3EF]">
        {/* Silky spring-smoothed reading progress hairline */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX }}
          className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-[#B8893A] via-[#D4A853] to-[#F0D390]"
        />

        <Navbar lang={lang} vcardSaved={vcardSaved} onDownloadVCard={handleDownloadVCard} />
        <FastScrollThumb />
        <main>
          <HeroSection
            lang={lang}
            onLanguageChange={handleLanguageChange}
            vcardSaved={vcardSaved}
            onDownloadVCard={handleDownloadVCard}
            isAmbientPlaying={isAmbientPlaying}
            onToggleAmbient={handleToggleAmbient}
            onOpenQrPass={handleOpenQrPass}
          />
          <JourneySection lang={lang} />
          <CredentialsCarousel
            lang={lang}
            customCredentials={customCredentials}
            onRemoveCustomCredential={handleRemoveCustomCredential}
            isOwnerMode={isOwnerMode}
            onOpenOwnerStudio={() => {
              setHasLoadedOwnerModal(true);
              setIsOwnerStudioOpen(true);
            }}
          />
          <VenturesSection lang={lang} />
          <SocialHubSection lang={lang} />
          <EntityFaqSection lang={lang} />
        </main>
        <Footer lang={lang} onOwnerTrigger={handleUnlockOwnerStudio} />

        {/* Interactive Scannable QR Contact Pass Modal (Lazy-loaded) */}
        <Suspense fallback={null}>
          {hasLoadedQrModal && (
            <QrPassModal isOpen={isQrOpen} lang={lang} onClose={() => setIsQrOpen(false)} />
          )}
        </Suspense>

        {/* Private Owner-Only Publisher Studio (Hidden from public visitors, Lazy-loaded) */}
        <Suspense fallback={null}>
          {hasLoadedOwnerModal && (
            <OwnerStudioModal
              isOpen={isOwnerStudioOpen}
              lang={lang}
              onClose={() => setIsOwnerStudioOpen(false)}
              onPublishPreview={handlePublishPreview}
              onLockOwnerMode={handleLockOwnerMode}
            />
          )}
        </Suspense>

        {/* Minimal persistent compact mute control visible only after scrolling past hero */}
        <AnimatePresence>
          {isAmbientPlaying && pastHero && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 12 }}
              transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleToggleAmbient}
              title={UI_COPY.audio.ariaPause[lang]}
              aria-label={UI_COPY.audio.ariaPause[lang]}
              className="fixed bottom-4 end-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A853]/65 bg-[#0B0C10]/92 text-[#D4A853] shadow-lg backdrop-blur-md transition-colors hover:border-[#E8C478] hover:text-[#E8C478] cursor-pointer"
            >
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Luxury Toast Notification for vCard Download */}
        <AnimatePresence>
          {vcardSaved && (
            <motion.aside
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.94 }}
              transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
              className="fixed bottom-5 start-4 sm:start-8 z-50 flex items-center gap-3.5 rounded-xl border border-[#D4A853]/55 bg-[#0C0D12]/96 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl max-w-sm sm:max-w-md pointer-events-auto"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D4A853]/15 text-[#D4A853] border border-[#D4A853]/30">
                <Check className="h-4 w-4 stroke-[2.4]" aria-hidden="true" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-semibold text-[#F4F3EF]">
                  {lang === 'ar' ? 'تم تنزيل بطاقة الاتصال الرسمية (.vcf)' : 'Official Contact Saved (.vcf)'}
                </p>
                <p className="mt-0.5 text-[11px] text-[#9D9FA8]">
                  {lang === 'ar'
                    ? 'أدهم مدحت · جاهزة للإضافة المباشرة لجهات اتصال هاتفك'
                    : 'Adham Medhat · Ready to import to your phone contacts'}
                </p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
