import { useState, type MouseEvent } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PUBLIC_MEDIA_ASSETS } from '../data/entityConfig';
import { Language, UI_COPY, VENTURES } from '../data/profileData';
import { calculateTiltAngles, RST_BOT_WHATSAPP_DIGITS, TiltResult } from '../utils/portfolioLogic';
import { EDITORIAL_EASE, EditorialReveal, LineMaskReveal } from './MotionPrimitives';

interface VenturesSectionProps {
  lang: Language;
}

const DEFAULT_CARD_TILT: TiltResult = { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 };

export function VenturesSection({ lang }: VenturesSectionProps) {
  const [cardTilt, setCardTilt] = useState<TiltResult>(DEFAULT_CARD_TILT);
  const rstVenture = VENTURES.find((v) => v.size === 'featured') ?? VENTURES[0];

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
            {/* Interactive Luxury RST Central 3D Executive Metal Card */}
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
                    ? 'بطاقة RST Central التنفيذية — اضغط لزيارة المنصة الرسمية'
                    : 'RST Central executive card — tap to visit official website'
                }
                style={{
                  transform: `perspective(1000px) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
                }}
                className="rst-biz-card group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4A853]"
              >
                {/* Dynamic Specular Metallic Light Reflection */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(232, 196, 120, 0.28), transparent 58%)`,
                  }}
                />

                {/* Top Zone: Logo Brandmark & Contactless Executive NFC Chip */}
                <div className="relative z-20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <svg viewBox="0 0 88 36" className="h-7 w-auto fill-[#D4A853]" aria-hidden="true">
                      <path d="M4 32V4h13.5c5.2 0 8.5 3 8.5 7.7 0 3.7-2.1 6.3-5.6 7.2L26.8 32h-5.6l-5.7-12.2H9.2V32H4Zm5.2-16.5h7.8c2.6 0 4.1-1.3 4.1-3.6 0-2.3-1.5-3.6-4.1-3.6H9.2v7.2Z" />
                      <path d="M42.8 32.5c-6.3 0-10.3-2.9-10.7-7.7h5.1c.4 2.4 2.4 3.6 5.7 3.6 3.1 0 5-1.2 5-3.3 0-2-1.4-2.9-5.4-3.8l-2.4-.5c-4.9-1.1-7.4-3.3-7.4-7.4 0-4.9 4.1-8 10.1-8 5.9 0 9.8 2.9 10.2 7.3h-5c-.4-2.1-2.2-3.2-5.2-3.2-2.9 0-4.8 1.2-4.8 3.2 0 1.8 1.3 2.8 4.9 3.6l2.6.6c5.3 1.2 7.8 3.3 7.8 7.5 0 5-4.1 8.1-10.5 8.1Z" />
                      <path d="M68.2 32V8.4H59V4h23.6v4.4h-9.2V32h-5.2Z" />
                    </svg>
                    <div className="flex flex-col text-start">
                      <span className="font-sans text-[13px] font-bold tracking-[0.24em] text-[#F4F3EF] uppercase">
                        CENTRAL
                      </span>
                      <span className="text-[8.5px] font-semibold tracking-[0.26em] text-[#D4A853] uppercase">
                        Venture Studio
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-[#D4A853]/35 bg-[#07070A]/70 px-2.5 py-1 backdrop-blur-sm">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 stroke-[#D4A853]" fill="none" strokeWidth="2" aria-hidden="true">
                      <path d="M8.5 16.5a5 5 0 0 1 0-9" strokeLinecap="round" />
                      <path d="M12 19a8.5 8.5 0 0 0 0-14" strokeLinecap="round" />
                      <path d="M15.5 21.5a12 12 0 0 0 0-19" strokeLinecap="round" />
                    </svg>
                    <span className="text-[9px] font-bold tracking-wider text-[#D4A853]">NFC</span>
                  </div>
                </div>

                {/* Middle Zone: Precision Hairline Divider with Architectural Disciplines */}
                <div className="relative z-20 my-auto py-2">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4A853]/40 to-transparent" />
                  <div className="mt-2.5 flex items-center justify-between text-[8px] sm:text-[8.5px] font-medium tracking-[0.24em] text-[#9D9FA8] uppercase">
                    <span>DIGITAL FABRICATION</span>
                    <span className="text-[#D4A853]">·</span>
                    <span>E-COMMERCE</span>
                    <span className="text-[#D4A853]">·</span>
                    <span>STUDIO LABS</span>
                  </div>
                </div>

                {/* Bottom Zone: Founder Title & Domain Jump */}
                <div className="relative z-20 flex items-end justify-between border-t border-[#242731]/80 pt-3">
                  <div className="text-start">
                    <p className="text-xs font-semibold tracking-wider text-[#F4F3EF] uppercase">
                      ADHAM MEDHAT
                    </p>
                    <p className="text-[9.5px] font-medium tracking-wide text-[#D4A853]">
                      FOUNDER & CREATIVE DIRECTOR
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4A853] transition-colors group-hover:text-[#E8C478]">
                    <span>rstcentral.com</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                </div>
              </a>

              <p className="mt-3 text-center text-xs text-[#858894]">
                {lang === 'ar'
                  ? 'البطاقة التنفيذية لشركة RST Central · اضغط لزيارة المنصة الرسمية'
                  : 'Official Executive Card · Tap to open rstcentral.com'}
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
      </div>
    </section>
  );
}
