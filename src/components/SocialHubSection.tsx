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
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.58c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.13.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78Z" />
        </svg>
      );
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="m10 15 5.19-3L10 9v6Zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73Z" />
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
