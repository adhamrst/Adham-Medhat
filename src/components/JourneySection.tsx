import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { JOURNEY_PILLARS, Language, UI_COPY } from '../data/profileData';
import { EDITORIAL_EASE, EditorialReveal, LineMaskReveal } from './MotionPrimitives';

interface JourneySectionProps {
  lang: Language;
}

export function JourneySection({ lang }: JourneySectionProps) {
  const [activeId, setActiveId] = useState<string>(JOURNEY_PILLARS[0].id);
  const activePillar =
    JOURNEY_PILLARS.find((pillar) => pillar.id === activeId) ?? JOURNEY_PILLARS[0];

  return (
    <section
      id="journey"
      className="scroll-mt-16 border-b border-[#242731] py-14 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <EditorialReveal>
            <p className="text-xs font-medium tracking-wide text-[#D4A853]">
              {UI_COPY.journey.kicker[lang]}
            </p>
          </EditorialReveal>
          <LineMaskReveal delay={0.06}>
            <h2 className="font-editorial mt-2.5 sm:mt-3 text-balance text-3xl font-semibold leading-tight text-[#F4F3EF] sm:text-5xl">
              {UI_COPY.journey.heading[lang]}
            </h2>
          </LineMaskReveal>
          <EditorialReveal delay={0.12}>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-7 text-[#9D9FA8]">
              {UI_COPY.journey.lead[lang]}
            </p>
          </EditorialReveal>
        </div>

        {/* Mobile Compact Horizontal Chapter Strip (< lg) */}
        <EditorialReveal delay={0.16} className="mt-7 lg:hidden">
          <div
            role="tablist"
            aria-label={UI_COPY.journey.kicker[lang]}
            className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1"
          >
            {JOURNEY_PILLARS.map((pillar) => {
              const isSelected = pillar.id === activePillar.id;
              return (
                <button
                  key={`mobile-${pillar.id}`}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => setActiveId(pillar.id)}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'border-[#D4A853] bg-[#D4A853] text-[#070709]'
                      : 'border-[#242731] bg-[#0B0C10] text-[#9D9FA8] hover:border-[#393D4B] hover:text-[#F4F3EF]'
                  }`}
                >
                  <span className="tabular-nums opacity-80">{pillar.index}</span>
                  <span>{pillar.shortTitle[lang]}</span>
                </button>
              );
            })}
          </div>
        </EditorialReveal>

        {/* Interactive Chapter Selector (Desktop) + Animated Editorial Dossier */}
        <div className="mt-5 lg:mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          {/* Desktop Pillar List (lg+) */}
          <EditorialReveal delay={0.14} className="hidden lg:flex lg:flex-col lg:gap-3 lg:col-span-5">
            <div
              role="tablist"
              aria-label={UI_COPY.journey.kicker[lang]}
              className="flex flex-col gap-3"
            >
              {JOURNEY_PILLARS.map((pillar) => {
                const isSelected = pillar.id === activePillar.id;
                return (
                  <motion.button
                    key={pillar.id}
                    id={`journey-tab-${pillar.id}`}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    aria-controls={`journey-panel-${pillar.id}`}
                    whileHover={{ x: lang === 'ar' ? -4 : 4 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
                    onClick={() => setActiveId(pillar.id)}
                    className={`group w-full rounded-xl border px-5 py-5 text-start transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] ${
                      isSelected
                        ? 'border-[#D4A853]/75 bg-[#14161D]'
                        : 'border-[#242731] bg-[#0B0C10] hover:border-[#393D4B] hover:bg-[#101218]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`font-editorial text-lg font-semibold tabular-nums transition-colors ${
                            isSelected ? 'text-[#D4A853]' : 'text-[#6F7280]'
                          }`}
                        >
                          {pillar.index}.
                        </span>
                        <span className="text-base font-semibold text-[#F4F3EF]">
                          {pillar.title[lang]}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[#9D9FA8]">{pillar.institution[lang]}</p>
                  </motion.button>
                );
              })}
            </div>
          </EditorialReveal>

          {/* Animated Editorial Dossier */}
          <EditorialReveal delay={0.18} className="lg:col-span-7">
            <div
              id={`journey-panel-${activePillar.id}`}
              role="tabpanel"
              aria-labelledby={`journey-tab-${activePillar.id}`}
              className="flex h-full flex-col justify-between rounded-2xl border border-[#242731] bg-[#101115] p-5 sm:p-8 lg:p-10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activePillar.id}-${lang}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.36, ease: EDITORIAL_EASE }}
                  className="flex h-full flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#9D9FA8]">
                      <span className="font-semibold text-[#D4A853] tabular-nums">
                        {activePillar.index} / 04
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{activePillar.institution[lang]}</span>
                    </div>

                    <h3 className="font-editorial mt-3 sm:mt-4 text-2xl sm:text-4xl font-semibold text-[#F4F3EF]">
                      {activePillar.title[lang]}
                    </h3>

                    <p className="mt-3 sm:mt-4 text-sm sm:text-base font-medium leading-7 text-[#E2DFD7]">
                      {activePillar.summary[lang]}
                    </p>

                    <p className="mt-3 text-sm sm:text-base leading-7 text-[#9D9FA8]">
                      {activePillar.narrative[lang]}
                    </p>

                    {/* Focus Areas as Clean Hairline Grid */}
                    <div className="mt-6 sm:mt-8 border-t border-[#242731] pt-5 sm:pt-6">
                      <h4 className="text-xs font-semibold text-[#D4A853]">
                        {UI_COPY.journey.focusHeading[lang]}
                      </h4>
                      <ul className="mt-3.5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                        {activePillar.focusAreas[lang].map((area, index) => (
                          <motion.li
                            key={area}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.35,
                              delay: 0.08 + index * 0.045,
                              ease: EDITORIAL_EASE,
                            }}
                            className="flex items-baseline gap-3 border-b border-[#242731]/60 pb-2 text-sm text-[#E2DFD7]"
                          >
                            <span className="font-editorial text-sm font-semibold text-[#D4A853]/80 tabular-nums">
                              0{index + 1}
                            </span>
                            <span>{area}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Cross-Disciplinary Synthesis Footer */}
                  <div className="mt-6 sm:mt-8 rounded-xl border border-[#242731] bg-[#0B0C10] p-4 sm:p-5">
                    <p className="text-xs font-semibold text-[#D4A853]">
                      {UI_COPY.journey.synthesisHeading[lang]}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-[#C8C7C1]">
                      {activePillar.synthesisNote[lang]}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </EditorialReveal>
        </div>
      </div>
    </section>
  );
}
