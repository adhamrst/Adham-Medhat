import { useCallback, useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { AnimatePresence, motion, MotionConfig, useScroll, useSpring } from 'motion/react';
import { CredentialsCarousel } from './components/CredentialsCarousel';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { JourneySection } from './components/JourneySection';
import { EDITORIAL_EASE } from './components/MotionPrimitives';
import { Navbar } from './components/Navbar';
import { OwnerStudioModal } from './components/OwnerStudioModal';
import { QrPassModal } from './components/QrPassModal';
import { SocialHubSection } from './components/SocialHubSection';
import { VenturesSection } from './components/VenturesSection';
import { CredentialItem, Language, UI_COPY } from './data/profileData';
import { ambientAudio } from './utils/ambientAudio';
import { buildVCardString } from './utils/portfolioLogic';

const UPLOADED_CERTS_STORAGE_KEY = 'adham_uploaded_credentials_v1';

function loadStoredCredentials(): CredentialItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(UPLOADED_CERTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CredentialItem[]) : [];
  } catch {
    return [];
  }
}

function detectInitialOwnerMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('studio') === '1' || window.location.hash === '#studio';
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [vcardSaved, setVcardSaved] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => detectInitialOwnerMode());
  const [isOwnerStudioOpen, setIsOwnerStudioOpen] = useState<boolean>(() =>
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
  }, [lang]);

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

  const handleToggleAmbient = useCallback(async () => {
    if (ambientAudio.getPlayingState()) {
      ambientAudio.stop();
      setIsAmbientPlaying(false);
    } else {
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
    setIsOwnerStudioOpen(true);
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
        <main>
          <HeroSection
            lang={lang}
            onLanguageChange={setLang}
            vcardSaved={vcardSaved}
            onDownloadVCard={handleDownloadVCard}
            isAmbientPlaying={isAmbientPlaying}
            onToggleAmbient={handleToggleAmbient}
            onOpenQrPass={() => setIsQrOpen(true)}
          />
          <JourneySection lang={lang} />
          <CredentialsCarousel
            lang={lang}
            customCredentials={customCredentials}
            onRemoveCustomCredential={handleRemoveCustomCredential}
            isOwnerMode={isOwnerMode}
            onOpenOwnerStudio={() => setIsOwnerStudioOpen(true)}
          />
          <VenturesSection lang={lang} />
          <SocialHubSection lang={lang} />
        </main>
        <Footer lang={lang} onOwnerTrigger={handleUnlockOwnerStudio} />

        {/* Interactive Scannable QR Contact Pass Modal */}
        <QrPassModal isOpen={isQrOpen} lang={lang} onClose={() => setIsQrOpen(false)} />

        {/* Private Owner-Only Publisher Studio (Hidden from public visitors) */}
        <OwnerStudioModal
          isOpen={isOwnerStudioOpen}
          lang={lang}
          onClose={() => setIsOwnerStudioOpen(false)}
          onPublishPreview={handlePublishPreview}
        />

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
      </div>
    </MotionConfig>
  );
}
