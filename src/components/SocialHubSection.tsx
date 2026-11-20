import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  INQUIRY_TOPICS,
  Language,
  SOCIAL_LINKS,
  SocialLinkItem,
  UI_COPY,
} from '../data/profileData';
import { buildWhatsAppUrl, RST_BOT_WHATSAPP_DIGITS } from '../utils/portfolioLogic';
import {
  EDITORIAL_EASE,
  EditorialReveal,
  LineMaskReveal,
  StaggerGroup,
  StaggerItem,
} from './MotionPrimitives';

interface SocialHubSectionProps {
  lang: Language;
}

function SocialGlyph({ id }: { id: SocialLinkItem['id'] }) {
  switch (id) {
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M20.5 11.8a8.5 8.5 0 0 1-12.5 7.5L3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 20.5 11.8Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.5 9.2c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.5-.1.7l-.5.6c.5.9 1.2 1.6 2.1 2.1l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-.5.3-1.6.5-3.2-.2-1.6-.7-3.4-2.5-4.1-4.1-.7-1.6-.5-2.7-.2-3.2Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 11v5M8 8v.01M12 16v-5m0 2a2.5 2.5 0 0 1 5 0v3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M21 4 3 11.2l6.2 2.3L18.5 7l-6.8 8.3V20l3.2-3.1 4.1 2.6L21 4Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M14 21v-8h3l.6-3.5H14V7.3c0-1 .4-1.8 1.9-1.8H18V2.4c-.4-.1-1.5-.2-2.8-.2-2.9 0-4.7 1.7-4.7 4.9v2.4H7.5V13h3v8h3.5Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
          <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export function SocialHubSection({ lang }: SocialHubSectionProps) {
  const [selectedTopicId, setSelectedTopicId] = useState(INQUIRY_TOPICS[0].id);
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [preparedWhatsApp, setPreparedWhatsApp] = useState<{
    url: string;
    previewText: string;
  } | null>(null);
  const [copiedHandle, setCopiedHandle] = useState(false);

  const activeTopic =
    INQUIRY_TOPICS.find((t) => t.id === selectedTopicId) ?? INQUIRY_TOPICS[0];

  const handleCopyHandle = async () => {
    try {
      await navigator.clipboard.writeText('@adhamrst');
      setCopiedHandle(true);
      window.setTimeout(() => setCopiedHandle(false), 2400);
    } catch {
      setCopiedHandle(true);
      window.setTimeout(() => setCopiedHandle(false), 2400);
    }
  };

  const handleComposerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = buildWhatsAppUrl(activeTopic.label[lang], message, RST_BOT_WHATSAPP_DIGITS);
    if (!result.valid) {
      setValidationError(true);
      setPreparedWhatsApp(null);
      return;
    }
    setValidationError(false);
    setPreparedWhatsApp({ url: result.url, previewText: result.previewText });
  };

  return (
    <section
      id="connect"
      className="scroll-mt-16 border-b border-[#242731] bg-[#090A0E] py-14 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* Header Row */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <EditorialReveal>
              <p className="text-xs font-medium tracking-wide text-[#D4A853]">
                {UI_COPY.connect.kicker[lang]}
              </p>
            </EditorialReveal>
            <LineMaskReveal delay={0.06}>
              <h2 className="font-editorial mt-2.5 sm:mt-3 text-balance text-3xl font-semibold leading-tight text-[#F4F3EF] sm:text-5xl">
                {UI_COPY.connect.heading[lang]}
              </h2>
            </LineMaskReveal>
            <EditorialReveal delay={0.12}>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-7 text-[#9D9FA8]">
                {UI_COPY.connect.lead[lang]}
              </p>
            </EditorialReveal>
          </div>

          <EditorialReveal delay={0.16} className="flex items-center shrink-0">
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopyHandle}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#242731] bg-[#101115] px-5 py-2.5 text-xs font-medium text-[#F4F3EF] transition-colors hover:border-[#D4A853] hover:text-[#D4A853] whitespace-nowrap cursor-pointer"
            >
              {copiedHandle ? (
                <Check className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
              )}
              <span>
                {copiedHandle ? UI_COPY.connect.copiedHandle[lang] : UI_COPY.connect.copyHandle[lang]}
              </span>
            </motion.button>
          </EditorialReveal>
        </div>

        {/* Two-Column Handles Hub + RST Central Business Concierge Composer */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
          {/* Official Social Handles Grid (Compact 2-Column on Mobile, Refined 2-Column on Desktop) */}
          <StaggerGroup
            staggerDelay={0.06}
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7"
          >
            {SOCIAL_LINKS.map((item) => (
              <StaggerItem key={item.id} y={14}>
                <motion.a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                  className="group flex h-full flex-col justify-between rounded-xl border border-[#242731] bg-[#101115] p-4 sm:p-5 transition-colors duration-200 hover:border-[#D4A853]/70 hover:bg-[#14161D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-[#242731] bg-[#0B0C10] text-[#D4A853] transition-colors group-hover:border-[#D4A853]/50">
                      <SocialGlyph id={item.id} />
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 text-[#6F7280] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#D4A853]"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-4 sm:mt-5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
                      <span className="text-sm sm:text-base font-semibold text-[#F4F3EF]">
                        {item.name}
                      </span>
                      <span
                        dir="ltr"
                        className="truncate text-[11px] sm:text-xs font-medium text-[#D4A853] tabular-nums"
                      >
                        {item.handle}
                      </span>
                    </div>
                    <p className="mt-1 hidden sm:block text-xs text-[#9D9FA8]">{item.role[lang]}</p>
                  </div>
                </motion.a>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* RST Central Business Concierge Composer */}
          <EditorialReveal delay={0.18} className="lg:col-span-5">
            <div className="rounded-2xl border border-[#242731] bg-[#101115] p-5 sm:p-8">
              <h3 className="font-editorial text-2xl font-semibold text-[#F4F3EF]">
                {UI_COPY.connect.composerHeading[lang]}
              </h3>
              <p className="mt-2 text-xs leading-5 text-[#9D9FA8]">
                {UI_COPY.connect.composerSubnote[lang]}
              </p>

              <form onSubmit={handleComposerSubmit} noValidate className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
                <div>
                  <span className="block text-xs font-medium text-[#9D9FA8]">
                    {UI_COPY.connect.composerTopicLabel[lang]}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {INQUIRY_TOPICS.map((topic) => {
                      const isSelected = topic.id === selectedTopicId;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            setSelectedTopicId(topic.id);
                            setPreparedWhatsApp(null);
                          }}
                          aria-pressed={isSelected}
                          className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            isSelected
                              ? 'border-[#D4A853] bg-[#D4A853]/15 text-[#F4F3EF]'
                              : 'border-[#242731] bg-[#0B0C10] text-[#9D9FA8] hover:border-[#3A3E4C] hover:text-[#F4F3EF]'
                          }`}
                        >
                          {topic.label[lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="whatsapp-inquiry-message"
                    className="block text-xs font-medium text-[#9D9FA8]"
                  >
                    {UI_COPY.connect.composerMessageLabel[lang]}
                  </label>
                  <textarea
                    id="whatsapp-inquiry-message"
                    rows={3}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (validationError) setValidationError(false);
                      if (preparedWhatsApp) setPreparedWhatsApp(null);
                    }}
                    placeholder={UI_COPY.connect.composerPlaceholder[lang]}
                    aria-invalid={validationError}
                    aria-describedby={validationError ? 'whatsapp-inquiry-error' : undefined}
                    className="mt-2 w-full rounded-xl border border-[#242731] bg-[#0B0C10] px-4 py-3 text-sm text-[#F4F3EF] placeholder:text-[#666977] focus:border-[#D4A853] focus:outline-none"
                  />
                  {validationError && (
                    <p
                      id="whatsapp-inquiry-error"
                      role="alert"
                      className="mt-2 text-xs font-medium text-[#E57373]"
                    >
                      {UI_COPY.connect.composerError[lang]}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#D4A853] px-5 py-3 text-sm font-semibold text-[#070709] transition-colors hover:bg-[#E8C478] cursor-pointer"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>{UI_COPY.connect.composerSubmit[lang]}</span>
                </motion.button>

                <AnimatePresence>
                  {preparedWhatsApp && (
                    <motion.div
                      role="status"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                      className="rounded-xl border border-[#D4A853]/50 bg-[#0B0C10] p-4"
                    >
                      <p className="text-xs font-semibold text-[#D4A853]">
                        {lang === 'ar'
                          ? 'رسالتك جاهزة لبوت RST Central (‎+1 202 978 0356)'
                          : 'Ready for RST Central Bot (+1 202 978 0356)'}
                      </p>
                      <p className="mt-1.5 text-xs leading-5 text-[#C8C7C1]">
                        {preparedWhatsApp.previewText}
                      </p>
                      <a
                        href={preparedWhatsApp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#F4F3EF] underline decoration-[#D4A853] underline-offset-4 hover:text-[#D4A853]"
                      >
                        <span>
                          {lang === 'ar'
                            ? 'اضغط لفتح محادثة بوت RST Central الآن'
                            : 'Launch RST Central WhatsApp Concierge'}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            </div>
          </EditorialReveal>
        </div>
      </div>
    </section>
  );
}
