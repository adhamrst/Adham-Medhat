import { useState, type MouseEvent } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PUBLIC_MEDIA_ASSETS } from '../data/entityConfig';
import { Language, UI_COPY, VENTURES } from '../data/profileData';
import { calculateTiltAngles, RST_BOT_WHATSAPP_DIGITS, TiltResult } from '../utils/portfolioLogic';
import { EDITORIAL_EASE, EditorialReveal, LineMaskReveal } from './MotionPrimitives';
import { ResilientImage } from './ResilientImage';

interface VenturesSectionProps {
  lang: Language;
}

const DEFAULT_CARD_TILT: TiltResult = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };

export function VenturesSection({ lang }: VenturesSectionProps) {
  const [cardTilt, setCardTilt] = useState<TiltResult>(DEFAULT_CARD_TILT);
  const rstVenture = VENTURES.find((v) => v.size === 'featured') ?? VENTURES[0];
  const secondaryVentures = VENTURES.filter((v) => v.id !== rstVenture.id);

  const handleCardMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextTilt = calculateTiltAngles(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect.width,
      rect.height,
      7,
    );
    setCardTilt(nextTilt);
  };

  const handleCardLeave = () => {
    setCardTilt(DEFAULT_CARD_TILT);
  };

  const rstConciergeUrl = `https://wa.me/${RST_BOT_WHATSAPP_DIGITS}?text=${encodeURIComponent(
    lang === 'ar'
      ? 'مرحباً RST Central، أتواصل معكم عبر الموقع الرسمي للمؤسس أدهم مدحت (adham.rstcentral.com).'
      : 'Hello RST Central, reaching out via founder Adham Medhat’s official site (adham.rstcentral.com).',
  )}`;

  return (
    <section
      id="ventures"
      className="scroll-mt-16 border-b border-[#242731] py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* Focused Flagship Header */}
        <div className="max-w-3xl">
          <EditorialReveal>
            <p className="text-xs font-medium tracking-wide text-[#D4A853]">
              {UI_COPY.ventures.kicker[lang]}
            </p>
          </EditorialReveal>
          <LineMaskReveal delay={0.06}>
            <h2 className="font-editorial mt-2.5 sm:mt-3 text-balance text-3xl font-semibold leading-tight text-[#F4F3EF] sm:text-5xl">
              {UI_COPY.ventures.heading[lang]}
            </h2>
          </LineMaskReveal>
        </div>

        {/* Single Zero-Bloat Flagship Spread: Interactive RST Central Gold Business Card + Directly Indexable Brief */}
        <EditorialReveal delay={0.12}>
          <article className="mt-8 sm:mt-12 grid grid-cols-1 items-center gap-8 rounded-2xl border border-[#242731] bg-[#101115] p-6 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-12">
            {/* Minimal Luxury Matte-Black & Gold Foil Print Card */}
            <div
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
              className="flex flex-col items-center justify-center lg:col-span-5"
            >
              <a
                href="https://rstcentral.com"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                aria-label={
                  lang === 'ar'
                    ? 'بطاقة RST Central — اضغط لزيارة الموقع الرسمي rstcentral.com'
                    : 'RST Central card — tap to visit official website rstcentral.com'
                }
                style={{
                  transform: `perspective(1000px) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
                }}
                className="rst-print-card group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4A853]"
              >
                {/* Spot UV Lacquer Texture Layer (Catches specular light as card tilts) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 opacity-35 transition-opacity duration-300 group-hover:opacity-90"
                  style={{
                    background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(232, 196, 120, 0.22) 0%, rgba(212, 168, 83, 0.06) 40%, transparent 68%)`,
                  }}
                />

                {/* Spot UV Micro-Watermark (Gleams gently on hover) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-4.5 z-20 flex justify-between text-[8px] font-semibold tracking-[0.28em] text-transparent transition-colors duration-400 group-hover:text-[#D4A853]/60 uppercase"
                >
                  <span>STUDIO LABS</span>
                  <span>EST. 2020</span>
                </div>

                {/* Dead Center: Official RST Central Logo Stamped in Luxury Gold Foil */}
                <div className="absolute inset-0 z-20 flex items-center justify-center p-8 pointer-events-none">
                  <div className="relative flex items-center justify-center transition-transform duration-400 ease-out group-hover:scale-[1.03]">
                    <img
                      src={PUBLIC_MEDIA_ASSETS.customRstLogoUrl || '/images/rst-central-logo.png'}
                      alt="RST Central Official Logo"
                      loading="lazy"
                      className="rst-gold-foil max-h-9 sm:max-h-10 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Bottom Details: Smooth Luxury Reveal on Hover */}
                <div className="absolute inset-x-6 bottom-4.5 z-20 flex items-end justify-between border-t border-transparent pt-2 transition-colors duration-400 group-hover:border-[#242731]/70">
                  {/* Founder Credit (Fades in smoothly on hover) */}
                  <div className="text-start opacity-0 transform translate-y-1.5 transition-all duration-400 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                    <p className="text-[11px] font-semibold tracking-wider text-[#F4F3EF] uppercase">
                      ADHAM MEDHAT
                    </p>
                    <p className="text-[9px] font-medium tracking-widest text-[#D4A853] uppercase">
                      FOUNDER & CREATIVE DIRECTOR
                    </p>
                  </div>

                  {/* Domain Jump (Fades in smoothly on hover) */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4A853] opacity-0 transform translate-y-1.5 transition-all duration-400 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-[#E8C478]">
                    <span>rstcentral.com</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                </div>
              </a>

              <p className="mt-3 text-center text-xs text-[#858894]">
                {lang === 'ar'
                  ? 'بطاقة RST Central الرسمية · اضغط لزيارة المنصة'
                  : 'Official RST Central Card · Tap to visit rstcentral.com'}
              </p>
            </div>

            {/* Directly Indexable RST Central Brief (No Hidden Modal Text) */}
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <p className="text-xs font-medium text-[#D4A853]">{rstVenture.eyebrow[lang]}</p>
                <h3 className="font-editorial mt-2 text-2xl sm:text-4xl font-semibold text-[#F4F3EF]">
                  {rstVenture.title[lang]}
                </h3>
                <p className="mt-1.5 text-sm font-medium text-[#C8C7C1]">
                  {rstVenture.role[lang]}
                </p>
                <p className="mt-4 text-sm sm:text-base leading-7 text-[#9D9FA8]">
                  {rstVenture.detailBody[lang]}
                </p>

                <div className="mt-6 border-t border-[#242731] pt-5">
                  <h4 className="text-xs font-semibold text-[#D4A853]">
                    {UI_COPY.ventures.capabilitiesHeading[lang]}
                  </h4>
                  <ul className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {rstVenture.capabilities[lang].map((cap, idx) => (
                      <motion.li
                        key={cap}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
                        className="group/cap flex items-center gap-3 rounded-xl border border-[#242731] bg-[#0C0D12] p-3 transition-colors hover:border-[#D4A853]/55 hover:bg-[#12141C]"
                      >
                        <span className="font-editorial flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#D4A853]/30 bg-[#D4A853]/10 text-xs font-semibold text-[#D4A853] tabular-nums transition-colors group-hover/cap:bg-[#D4A853] group-hover/cap:text-[#070709]">
                          0{idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-[#E2DFD7] transition-colors group-hover/cap:text-[#F4F3EF]">
                          {cap}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {rstVenture.externalUrl && rstVenture.externalLabel && (
                  <motion.a
                    href={rstVenture.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#D4A853] px-5 py-2.5 text-xs font-semibold text-[#070709] transition-colors hover:bg-[#E8C478] whitespace-nowrap"
                  >
                    <span>{rstVenture.externalLabel[lang]}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </motion.a>
                )}

                <motion.a
                  href={rstConciergeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#242731] bg-[#16181F] px-5 py-2.5 text-xs font-medium text-[#F4F3EF] transition-colors hover:border-[#D4A853] hover:text-[#D4A853] whitespace-nowrap"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-[#D4A853]" aria-hidden="true" />
                  <span>
                    {lang === 'ar'
                      ? 'الخط المباشر لـ RST Central'
                      : 'RST Central WhatsApp Line'}
                  </span>
                </motion.a>
              </div>
            </div>
          </article>
        </EditorialReveal>

        {/* Secondary Disciplines Grid: Creative Design Practice & Medical Academic Pillar */}
        {secondaryVentures.length > 0 && (
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {secondaryVentures.map((venture, idx) => (
              <EditorialReveal key={venture.id} delay={0.16 + idx * 0.06}>
                <article className="flex h-full flex-col justify-between rounded-2xl border border-[#242731] bg-[#101115] p-5 sm:p-7 transition-colors duration-200 hover:border-[#D4A853]/45">
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#242731] bg-[#0B0C10]">
                      <ResilientImage
                        src={venture.image}
                        alt={venture.imageAlt[lang]}
                        fallbackLabel={venture.title.en}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <p className="mt-5 text-xs font-medium text-[#D4A853]">
                      {venture.eyebrow[lang]}
                    </p>
                    <h3 className="font-editorial mt-1.5 text-2xl sm:text-3xl font-semibold text-[#F4F3EF]">
                      {venture.title[lang]}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-[#C8C7C1]">
                      {venture.role[lang]}
                    </p>
                    <p className="mt-3 text-xs sm:text-sm leading-6 text-[#9D9FA8]">
                      {venture.detailBody[lang]}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#242731] pt-4">
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {venture.capabilities[lang].map((cap, capIdx) => (
                        <li
                          key={cap}
                          className="flex items-baseline gap-2.5 text-xs text-[#E2DFD7]"
                        >
                          <span className="font-editorial text-xs font-semibold text-[#D4A853] tabular-nums">
                            0{capIdx + 1}
                          </span>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </EditorialReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
