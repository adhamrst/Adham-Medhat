import { useEffect, useState } from 'react';
import { Check, Download, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Language, UI_COPY } from '../data/profileData';
import { EDITORIAL_EASE } from './MotionPrimitives';

interface NavbarProps {
  lang: Language;
  vcardSaved: boolean;
  onDownloadVCard: () => void;
}

export function Navbar({ lang, vcardSaved, onDownloadVCard }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const navItems = [
    { href: '#journey', id: 'journey', label: UI_COPY.nav.journey[lang] },
    { href: '#credentials', id: 'credentials', label: UI_COPY.nav.credentials[lang] },
    { href: '#ventures', id: 'ventures', label: UI_COPY.nav.ventures[lang] },
    { href: '#connect', id: 'connect', label: UI_COPY.nav.connect[lang] },
  ];

  useEffect(() => {
    const sectionIds = ['journey', 'credentials', 'ventures', 'connect'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: 0,
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 240) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
      className="sticky top-0 z-40 border-b border-[#242731]/90 bg-[#070709]/88 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-6 lg:px-10">
        {/* Zone 1: Single-element wordmark */}
        <a
          href="#top"
          className="font-editorial text-xl sm:text-2xl font-semibold tracking-tight text-[#F4F3EF] transition-colors hover:text-[#D4A853] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4A853]"
        >
          {lang === 'ar' ? 'أدهم مدحت' : 'Adham Medhat'}
        </a>

        {/* Zone 2: Premium Segmented Navigation with spring layoutId gliding indicator */}
        <nav
          aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'}
          className="hidden md:flex items-center gap-1.5 rounded-full border border-[#242731]/80 bg-[#101218]/80 p-1 backdrop-blur-md"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] ${
                  isActive ? 'text-[#F4F3EF]' : 'text-[#9D9FA8] hover:text-[#F4F3EF]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[#D4A853]/15 border border-[#D4A853]/40 shadow-[0_0_12px_rgba(212,168,83,0.12)]"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (plus mobile menu button only below md) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDownloadVCard}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#D4A853] px-4 py-2 text-xs font-semibold text-[#070709] transition-colors duration-200 hover:bg-[#E8C478] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C478]"
          >
            {vcardSaved ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{vcardSaved ? UI_COPY.nav.vcardSaved[lang] : UI_COPY.nav.vcard[lang]}</span>
          </motion.button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={
              mobileMenuOpen
                ? lang === 'ar'
                  ? 'إغلاق القائمة'
                  : 'Close navigation menu'
                : lang === 'ar'
                  ? 'فتح القائمة'
                  : 'Open navigation menu'
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#242731] text-[#F4F3EF] transition-colors hover:border-[#D4A853] md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-navigation-drawer"
            aria-label={lang === 'ar' ? 'قائمة الجوال' : 'Mobile navigation'}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
            className="border-t border-[#242731] bg-[#0B0C10]/98 px-5 py-4 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: lang === 'ar' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.24, delay: idx * 0.04, ease: EDITORIAL_EASE }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-11 items-center text-sm font-medium text-[#F4F3EF] transition-colors hover:text-[#D4A853]"
                >
                  {item.label}
                </motion.a>
              ))}
              <button
                type="button"
                onClick={() => {
                  onDownloadVCard();
                  setMobileMenuOpen(false);
                }}
                className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#D4A853] px-4 py-2.5 text-sm font-semibold text-[#070709] cursor-pointer"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>{vcardSaved ? UI_COPY.nav.vcardSaved[lang] : UI_COPY.nav.vcard[lang]}</span>
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
