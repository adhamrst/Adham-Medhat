import { useState, type MouseEvent } from 'react';
import { AtSign, Check, Download, QrCode, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { ASSETS, IDENTITY_METRICS, Language, UI_COPY } from '../data/profileData';
import { calculateTiltAngles, TiltResult } from '../utils/portfolioLogic';
import { EDITORIAL_EASE, LineMaskReveal, StaggerGroup, StaggerItem } from './MotionPrimitives';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  vcardSaved: boolean;
  onDownloadVCard: () => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  onOpenQrPass: () => void;
}

const DEFAULT_TILT: TiltResult = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };

export function HeroSection({
  lang,
  onLanguageChange,
  vcardSaved,
  onDownloadVCard,
  isAmbientPlaying,
  onToggleAmbient,
  onOpenQrPass,
}: HeroSectionProps) {
  const [portraitTilt, setPortraitTilt] = useState<TiltResult>(DEFAULT_TILT);

  const handlePortraitMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextTilt = calculateTiltAngles(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height,
      5,
    );
    setPortraitTilt(nextTilt);
  };

  const handlePortraitLeave = () => {
    setPortraitTilt(DEFAULT_TILT);
  };

  return (
    <section id="top" className="relative overflow-hidden border-b border-[#242731]">
      {/* Subtle architectural gallery spotlight */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EDITORIAL_EASE }}
        className="pointer-events-none absolute -top-24 right-[10%] h-[380px] w-[380px] rounded-full bg-[#D4A853]/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pt-5 pb-10 sm:px-6 sm:pt-8 sm:pb-12 lg:px-10 lg:pt-10 lg:pb-14">
        {/* Top Row inside Hero: Unboxed Credential Kicker + Ambient Sound & Language Switch */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EDITORIAL_EASE }}
          className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#242731]/70 pb-3.5 sm:pb-4"
        >
          <p className="hidden sm:block text-xs sm:text-sm font-medium tracking-wide text-[#9D9FA8]">
            {UI_COPY.hero.kicker[lang]}
          </p>

          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2.5">
            {/* Luxury Ambient Soundscape Toggle */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onToggleAmbient}
              aria-pressed={isAmbientPlaying}
              aria-label={
                isAmbientPlaying ? UI_COPY.audio.ariaPause[lang] : UI_COPY.audio.ariaPlay[lang]
              }
              className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] ${
                isAmbientPlaying
                  ? 'border-[#D4A853]/70 bg-[#D4A853]/12 text-[#F4F3EF]'
                  : 'border-[#242731] bg-[#101115] text-[#9D9FA8] hover:border-[#3A3E4C] hover:text-[#F4F3EF]'
              }`}
            >
              {isAmbientPlaying ? (
                <span className="inline-flex h-3 items-end gap-[2px]" aria-hidden="true">
                  <span
                    className="eq-bar w-[2px] h-full bg-[#D4A853] rounded-full"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="eq-bar w-[2px] h-full bg-[#D4A853] rounded-full"
                    style={{ animationDelay: '240ms' }}
                  />
                  <span
                    className="eq-bar w-[2px] h-full bg-[#D4A853] rounded-full"
                    style={{ animationDelay: '480ms' }}
                  />
                </span>
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-[#9D9FA8]" aria-hidden="true" />
              )}
              <span>
                {isAmbientPlaying ? UI_COPY.audio.playing[lang] : UI_COPY.audio.play[lang]}
              </span>
              {isAmbientPlaying && (
                <Volume2 className="h-3.5 w-3.5 text-[#D4A853]" aria-hidden="true" />
              )}
            </motion.button>

            {/* Language Segmented Switch */}
            <div
              role="group"
              aria-label={lang === 'ar' ? 'اختيار اللغة' : 'Language selector'}
              className="inline-flex items-center rounded-lg border border-[#242731] bg-[#101115] p-1"
            >
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                aria-pressed={lang === 'en'}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#D4A853] text-[#070709]'
                    : 'text-[#9D9FA8] hover:text-[#F4F3EF]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ar')}
                aria-pressed={lang === 'ar'}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'ar'
                    ? 'bg-[#D4A853] text-[#070709]'
                    : 'text-[#9D9FA8] hover:text-[#F4F3EF]'
                }`}
              >
                العربية
              </button>
            </div>
          </div>
        </motion.div>

        {/* Split-Screen Architectural Hero */}
        <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Typographic Column */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <div>
              <motion.p
                key={`identity-${lang}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: EDITORIAL_EASE }}
                className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#D4A853]"
              >
                <span className="font-[var(--font-arabic)] tracking-normal">أدهم أحمد مدحت</span>
                <span aria-hidden="true" className="text-[#6F7280]">
                  ·
                </span>
                <span className="tracking-wide">Adham Ahmed Medhat</span>
              </motion.p>

              <LineMaskReveal immediate delay={0.14} duration={0.82}>
                <h1
                  key={`h1-${lang}`}
                  className="font-editorial mt-2.5 sm:mt-3.5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-[#F4F3EF] sm:text-6xl lg:text-7xl"
                >
                  {UI_COPY.hero.displayName[lang]}
                </h1>
              </LineMaskReveal>

              <motion.p
                key={`tagline-${lang}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.24, ease: EDITORIAL_EASE }}
                className="mt-4 sm:mt-5 max-w-2xl text-lg sm:text-2xl font-medium leading-relaxed text-[#E2DFD7]"
              >
                {UI_COPY.hero.tagline[lang]}
              </motion.p>

              <motion.p
                key={`desc-${lang}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.32, ease: EDITORIAL_EASE }}
                className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-7 text-[#9D9FA8]"
              >
                {UI_COPY.hero.description[lang]}
              </motion.p>
            </div>

            {/* Quick Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: EDITORIAL_EASE }}
              className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onDownloadVCard}
                className="inline-flex min-h-11 sm:min-h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-[#D4A853] px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-[#070709] transition-colors duration-200 hover:bg-[#E8C478] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8C478]"
              >
                {vcardSaved ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Download className="h-4 w-4" aria-hidden="true" />
                )}
                <span>
                  {vcardSaved ? UI_COPY.nav.vcardSaved[lang] : UI_COPY.hero.ctaPrimary[lang]}
                </span>
              </motion.button>

              <motion.a
                href="#connect"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex min-h-11 sm:min-h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg border border-[#242731] bg-[#101115] px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-[#F4F3EF] transition-colors duration-200 hover:border-[#D4A853] hover:text-[#D4A853] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
              >
                <AtSign className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
                {lang === 'ar' ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span>تواصل عبر</span>
                    <span dir="ltr">@adhamrst</span>
                  </span>
                ) : (
                  <span>{UI_COPY.hero.ctaConnect[lang]}</span>
                )}
              </motion.a>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenQrPass}
                className="inline-flex min-h-11 sm:min-h-12 items-center justify-center gap-2 rounded-lg border border-[#242731] bg-[#0D0E13] px-4 py-2.5 sm:py-3 text-sm font-medium text-[#D5D3CC] transition-colors duration-200 hover:border-[#D4A853] hover:text-[#D4A853] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
              >
                <QrCode className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
                <span>{UI_COPY.qrPass.buttonLabel[lang]}</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Editorial Portrait Column */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.22, ease: EDITORIAL_EASE }}
            className="lg:col-span-5"
          >
            <div
              onMouseMove={handlePortraitMove}
              onMouseLeave={handlePortraitLeave}
              className="portrait-social-card group relative h-[350px] sm:h-[460px] lg:h-[480px] rounded-2xl border border-[#242731] bg-[#101115] p-2.5 sm:p-3 transition-colors duration-300 lg:hover:border-[#D4A853]/60"
              style={{ perspective: '1000px' }}
            >
              <figure
                className="tilt-surface relative h-full w-full overflow-hidden rounded-[12px] bg-[#0C0D11]"
                style={{
                  transform: `rotateX(${portraitTilt.rotateX}deg) rotateY(${portraitTilt.rotateY}deg)`,
                }}
              >
                <ResilientImage
                  src={ASSETS.portrait}
                  alt="Adham Medhat (Adham Ahmed Medhat · أدهم مدحت) — Official Portrait"
                  fallbackLabel="Adham Medhat"
                  loading="eager"
                  fetchPriority="high"
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />

                {/* Subtle architectural sheen responding to pointer */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at ${portraitTilt.glareX}% ${portraitTilt.glareY}%, rgba(212, 168, 83, 0.14), transparent 55%)`,
                  }}
                />

                {/* Desktop-Only Nested Glassmorphic Social Fan on Portrait Hover */}
                <div
                  dir="ltr"
                  aria-label={lang === 'ar' ? 'روابط التواصل السريعة' : 'Quick social profiles'}
                  className="hidden lg:block"
                >
                  {/* Layer 1 (Outermost): LinkedIn */}
                  <a
                    href="https://linkedin.com/in/adhamrst"
                    target="_blank"
                    rel="noopener noreferrer me"
                    title="LinkedIn · in/adhamrst"
                    aria-label="LinkedIn (in/adhamrst)"
                    className="portrait-arc-box portrait-arc-1 focus-visible:outline-none"
                  >
                    <span className="portrait-arc-icon">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <path
                          d="M8 11v5M8 8v.01M12 16v-5m0 2a2.5 2.5 0 0 1 5 0v3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>

                  {/* Layer 2: Telegram */}
                  <a
                    href="https://t.me/adhamrst"
                    target="_blank"
                    rel="noopener noreferrer me"
                    title="Telegram · @adhamrst"
                    aria-label="Telegram (@adhamrst)"
                    className="portrait-arc-box portrait-arc-2 focus-visible:outline-none"
                  >
                    <span className="portrait-arc-icon">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <path
                          d="M21 4 3 11.2l6.2 2.3L18.5 7l-6.8 8.3V20l3.2-3.1 4.1 2.6L21 4Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>

                  {/* Layer 3: Instagram */}
                  <a
                    href="https://instagram.com/adhamrst"
                    target="_blank"
                    rel="noopener noreferrer me"
                    title="Instagram · @adhamrst"
                    aria-label="Instagram (@adhamrst)"
                    className="portrait-arc-box portrait-arc-3 focus-visible:outline-none"
                  >
                    <span className="portrait-arc-icon">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                      </svg>
                    </span>
                  </a>

                  {/* Layer 4 (Innermost): WhatsApp · RST Bot */}
                  <a
                    href="https://wa.me/12029780356?text=Hello%20RST%20Central%20%2F%20Adham%20Medhat%2C%20I%20visited%20adham.rstcentral.com."
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp · @adhamrst · RST Bot"
                    aria-label="WhatsApp (@adhamrst · RST Central Bot)"
                    className="portrait-arc-box portrait-arc-4 focus-visible:outline-none"
                  >
                    <span className="portrait-arc-icon">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.85"
                        aria-hidden="true"
                      >
                        <path
                          d="M20.5 11.8a8.5 8.5 0 0 1-12.5 7.5L3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 20.5 11.8Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.5 9.2c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.5-.1.7l-.5.6c.5.9 1.2 1.6 2.1 2.1l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-.5.3-1.6.5-3.2-.2-1.6-.7-3.4-2.5-4.1-4.1-.7-1.6-.5-2.7-.2-3.2Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>

                  {/* Subtle bottom-right signature appearing smoothly alongside the fan */}
                  <div className="portrait-social-signature text-right">
                    <span className="font-editorial block text-base font-semibold tracking-tight text-[#F4F3EF]">
                      @adhamrst
                    </span>
                    <span className="block text-[10px] tracking-wide text-[#D4A853]">
                      {lang === 'ar' ? 'الحسابات الرسمية' : 'Official Handles'}
                    </span>
                  </div>
                </div>

                {/* Measured scrim caption at base (fades softly on desktop hover so fan breathes) */}
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#070709]/92 via-[#070709]/55 to-transparent px-4 sm:px-5 pt-10 pb-3.5 sm:pb-4 transition-opacity duration-300 lg:group-hover:opacity-0">
                  <div className="flex items-center justify-between gap-3 text-[11px] sm:text-xs text-[#D5D3CC]">
                    <span className="truncate font-medium">{UI_COPY.hero.portraitCaption[lang]}</span>
                    <span className="shrink-0 font-medium text-[#D4A853]">adham.rstcentral.com</span>
                  </div>
                </figcaption>
              </figure>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Identity Strip: Compact 2x2 Grid on Mobile, 4-Column on Desktop */}
        <StaggerGroup
          immediate
          delayChildren={0.45}
          staggerDelay={0.07}
          className="mt-8 sm:mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#242731] bg-[#242731] lg:grid-cols-4"
        >
          {IDENTITY_METRICS.map((item) => (
            <StaggerItem
              key={item.label.en}
              y={14}
              className="bg-[#0B0C10] px-4 py-3.5 sm:px-6 sm:py-5 transition-colors hover:bg-[#101218]"
            >
              <p className="text-[11px] sm:text-xs text-[#9D9FA8]">{item.label[lang]}</p>
              <p className="font-editorial mt-1 text-lg sm:text-2xl font-semibold text-[#F4F3EF]">
                {item.value[lang].startsWith('@') ? (
                  <span dir="ltr" className="inline-block">
                    {item.value[lang]}
                  </span>
                ) : (
                  item.value[lang]
                )}
              </p>
              <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-[#858894] line-clamp-1">
                {item.sublabel[lang]}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
