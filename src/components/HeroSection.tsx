import { useState, type MouseEvent } from 'react';
import { AtSign, Check, Download, QrCode, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { ASSETS, IDENTITY_METRICS, Language, UI_COPY } from '../data/profileData';
import { calculateTiltAngles, TiltResult } from '../utils/portfolioLogic';
import { EDITORIAL_EASE, LineMaskReveal, StaggerGroup, StaggerItem } from './MotionPrimitives';
import { ResilientImage } from './ResilientImage';
import { AnimatedSignature } from './AnimatedSignature';

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
                  width={1440}
                  height={1439}
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
                        className="h-5 w-5 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78Z" />
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
                        className="h-5 w-5 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37Z" />
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
                        className="h-5 w-5 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                      </svg>
                    </span>
                  </a>

                  {/* Layer 4 (Innermost): WhatsApp · RST Central Direct Line */}
                  <a
                    href="https://wa.me/12029780356?text=Hello%20RST%20Central%20%2F%20Adham%20Medhat%2C%20I%20visited%20adham.rstcentral.com."
                    target="_blank"
                    rel="noopener noreferrer"
                    title="WhatsApp · RST Central Line (+1 202-978-0356)"
                    aria-label="WhatsApp (RST Central Direct Line)"
                    className="portrait-arc-box portrait-arc-4 focus-visible:outline-none"
                  >
                    <span className="portrait-arc-icon">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4.5 w-4.5 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.58c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
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
              </figure>
            </div>

            {/* Executive Hand-Drawn Signature Seal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease: EDITORIAL_EASE }}
              className="mt-3.5 flex items-center px-2"
            >
              <AnimatedSignature lang={lang} />
            </motion.div>
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
