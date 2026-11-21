import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ENTITY_FAQS, Language, UI_COPY } from '../data/profileData';
import { EDITORIAL_EASE, EditorialReveal, LineMaskReveal } from './MotionPrimitives';

interface EntityFaqSectionProps {
  lang: Language;
}

export function EntityFaqSection({ lang }: EntityFaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(ENTITY_FAQS[0]?.id ?? null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="scroll-mt-16 border-b border-[#242731] bg-[#070709] py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <EditorialReveal>
              <p className="text-xs font-medium tracking-wide text-[#D4A853]">
                {UI_COPY.faq.kicker[lang]}
              </p>
            </EditorialReveal>
            <LineMaskReveal delay={0.06}>
              <h2 className="font-editorial mt-2.5 sm:mt-3 text-balance text-3xl font-semibold leading-tight text-[#F4F3EF] sm:text-4xl lg:text-5xl">
                {UI_COPY.faq.heading[lang]}
              </h2>
            </LineMaskReveal>
            <EditorialReveal delay={0.12}>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-7 text-[#9D9FA8]">
                {UI_COPY.faq.lead[lang]}
              </p>
            </EditorialReveal>
          </div>

          <EditorialReveal delay={0.14} className="lg:col-span-7">
            <div className="space-y-3">
              {ENTITY_FAQS.map((item, idx) => {
                const isOpen = openId === item.id;
                const panelId = `faq-panel-${item.id}`;
                const triggerId = `faq-trigger-${item.id}`;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-colors duration-200 ${
                      isOpen
                        ? 'border-[#D4A853]/55 bg-[#101115]'
                        : 'border-[#242731] bg-[#0B0C10] hover:border-[#393D4B]'
                    }`}
                  >
                    <h3>
                      <button
                        id={triggerId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleItem(item.id)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-start cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] rounded-2xl"
                      >
                        <div className="flex items-baseline gap-3">
                          <span
                            className={`font-editorial text-sm sm:text-base font-semibold tabular-nums transition-colors ${
                              isOpen ? 'text-[#D4A853]' : 'text-[#6F7280]'
                            }`}
                          >
                            0{idx + 1}.
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-[#F4F3EF]">
                            {item.question[lang]}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-[#D4A853] transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#242731]/70 px-5 py-4 sm:px-6 sm:py-5">
                            <p className="text-xs sm:text-sm leading-7 text-[#C8C7C1]">
                              {item.answer[lang]}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </EditorialReveal>
        </div>
      </div>
    </section>
  );
}
