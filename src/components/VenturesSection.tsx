import { useState } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { PUBLIC_MEDIA_ASSETS } from '../data/entityConfig';
import { Language, UI_COPY, VENTURES } from '../data/profileData';
import { RST_BOT_WHATSAPP_DIGITS } from '../utils/portfolioLogic';
import { EDITORIAL_EASE, EditorialReveal, LineMaskReveal } from './MotionPrimitives';

interface VenturesSectionProps {
  lang: Language;
}

export function VenturesSection({ lang }: VenturesSectionProps) {
  const [cardRevealed, setCardRevealed] = useState(false);
  const rstVenture = VENTURES.find((v) => v.size === 'featured') ?? VENTURES[0];

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
            {/* Interactive Obsidian & Gold Executive Business Card */}
            <div className="flex flex-col items-center justify-center lg:col-span-5">
              <button
                type="button"
                dir="ltr"
                aria-pressed={cardRevealed}
                aria-label={
                  lang === 'ar'
                    ? 'بطاقة RST Central التفاعلية — مرّر الماوس أو اضغط لعرض الهوية الذهبية'
                    : 'Interactive RST Central executive business card — hover or tap to reveal'
                }
                onClick={() => setCardRevealed((prev) => !prev)}
                className={`rst-biz-card cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4A853] ${
                  cardRevealed ? 'is-revealed' : ''
                }`}
              >
                <span aria-hidden="true" className="rst-biz-border" />

                <div className="rst-biz-content">
                  {PUBLIC_MEDIA_ASSETS.customRstLogoUrl ? (
                    <div className="flex h-12 items-center justify-center px-4">
                      <img
                        src={PUBLIC_MEDIA_ASSETS.customRstLogoUrl}
                        alt="RST Central official logo"
                        referrerPolicy="no-referrer"
                        className="max-h-11 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="rst-biz-logo-stage">
                      {/* Solid Champagne-Gold RST Geometric Monogram */}
                      <span className="rst-biz-mark" aria-hidden="true">
                        <svg
                          viewBox="0 0 88 36"
                          className="h-9 w-[78px]"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Architectural R */}
                          <path
                            d="M4 32V4h13.5c5.2 0 8.5 3 8.5 7.7 0 3.7-2.1 6.3-5.6 7.2L26.8 32h-5.6l-5.7-12.2H9.2V32H4Zm5.2-16.5h7.8c2.6 0 4.1-1.3 4.1-3.6 0-2.3-1.5-3.6-4.1-3.6H9.2v7.2Z"
                            fill="#D4A853"
                          />
                          {/* Architectural S */}
                          <path
                            d="M42.8 32.5c-6.3 0-10.3-2.9-10.7-7.7h5.1c.4 2.4 2.4 3.6 5.7 3.6 3.1 0 5-1.2 5-3.3 0-2-1.4-2.9-5.4-3.8l-2.4-.5c-4.9-1.1-7.4-3.3-7.4-7.4 0-4.9 4.1-8 10.1-8 5.9 0 9.8 2.9 10.2 7.3h-5c-.4-2.1-2.2-3.2-5.2-3.2-2.9 0-4.8 1.2-4.8 3.2 0 1.8 1.3 2.8 4.9 3.6l2.6.6c5.3 1.2 7.8 3.3 7.8 7.5 0 5-4.1 8.1-10.5 8.1Z"
                            fill="#D4A853"
                          />
                          {/* Architectural T */}
                          <path d="M68.2 32V8.4H59V4h23.6v4.4h-9.2V32h-5.2Z" fill="#D4A853" />
                        </svg>
                      </span>

                      {/* Engraved Hairline CENTRAL Wordmark Revealed on Sweep */}
                      <span className="rst-biz-wordmark" aria-hidden="true">
                        <svg
                          viewBox="0 0 164 36"
                          className="h-9 w-[152px]"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <text
                            x="2"
                            y="26"
                            fill="none"
                            stroke="#D4A853"
                            strokeWidth="1.05"
                            fontFamily="'Plus Jakarta Sans', sans-serif"
                            fontWeight="600"
                            fontSize="24"
                            letterSpacing="4.5"
                          >
                            CENTRAL
                          </text>
                        </svg>
                      </span>

                      <span aria-hidden="true" className="rst-biz-trail" />
                    </div>
                  )}

                  <span className="rst-biz-domain">rstcentral.com</span>
                </div>

                <span className="rst-biz-bottom-caption">FOUNDER · ADHAM MEDHAT</span>
              </button>

              <p className="mt-3 text-center text-[11px] text-[#7D808D]">
                {lang === 'ar'
                  ? 'مرّر المؤشر أو اضغط على البطاقة لاستعراض شعار RST Central'
                  : 'Hover or tap the card to inspect the RST Central crest'}
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
                  <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {rstVenture.capabilities[lang].map((cap, idx) => (
                      <li
                        key={cap}
                        className="flex items-baseline gap-2.5 border-b border-[#242731]/60 pb-2 text-xs sm:text-sm text-[#E2DFD7]"
                      >
                        <span className="font-editorial text-sm font-semibold text-[#D4A853] tabular-nums">
                          0{idx + 1}
                        </span>
                        <span>{cap}</span>
                      </li>
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
                      ? 'بوت طلبات RST Central'
                      : 'RST Central WhatsApp Bot'}
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
