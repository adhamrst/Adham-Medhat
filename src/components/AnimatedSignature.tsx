import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { EDITORIAL_EASE } from './MotionPrimitives';

interface AnimatedSignatureProps {
  className?: string;
  lang?: 'en' | 'ar';
  showLabel?: boolean;
  interactive?: boolean;
  autoReplayInterval?: number; // ms, default 7500ms
}

export function AnimatedSignature({
  className = '',
  lang = 'en',
  showLabel = true,
  interactive = true,
  autoReplayInterval = 7500,
}: AnimatedSignatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Track visibility with 10% threshold so it starts as soon as it enters viewport
  const isInView = useInView(containerRef, {
    amount: 0.1,
  });

  const [cycleKey, setCycleKey] = useState(0);

  // Trigger re-play when entering viewport or changing language
  useEffect(() => {
    if (isInView) {
      setCycleKey((prev) => prev + 1);
    }
  }, [isInView, lang]);

  // Periodic automatic replay while the signature is in view
  useEffect(() => {
    if (!isInView || autoReplayInterval <= 0) return;

    const interval = setInterval(() => {
      setCycleKey((prev) => prev + 1);
    }, autoReplayInterval);

    return () => clearInterval(interval);
  }, [isInView, autoReplayInterval]);

  const handleManualClick = () => {
    if (interactive) {
      setCycleKey((prev) => prev + 1);
    }
  };

  const isArabic = lang === 'ar';

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-start select-none cursor-pointer ${className}`}
      onClick={handleManualClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleManualClick();
        }
      }}
      title={interactive ? (isArabic ? 'انقر لإعادة رسم التوقيع' : 'Click to replay signature') : undefined}
      aria-label={isArabic ? 'توقيع أدهم مدحت المعتمد' : 'Official signature of Adham Medhat'}
    >
      {isArabic ? (
        /* Arabic Authentic Calligraphic Signature (Aref Ruqaa) */
        <svg
          key={`ar-${cycleKey}`}
          viewBox="0 0 290 95"
          className="h-14 sm:h-18 w-auto select-none overflow-visible drop-shadow-[0_2px_12px_rgba(212,168,83,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sigGoldAr" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#E8C478" />
              <stop offset="60%" stopColor="#D4A853" />
              <stop offset="100%" stopColor="#C8973A" />
            </linearGradient>
          </defs>

          {/* Connected Arabic Calligraphy with Stroke Draw Animation */}
          <text
            x="270"
            y="54"
            direction="rtl"
            unicodeBidi="embed"
            textAnchor="start"
            className="font-signature-ar select-none cursor-pointer"
            style={{
              fontFamily: "'Aref Ruqaa', serif",
              fontSize: '52px',
              fontWeight: 700,
              stroke: 'url(#sigGoldAr)',
              strokeWidth: '1.2px',
              fill: '#D4A853',
              strokeDasharray: 450,
              strokeDashoffset: 450,
              animation: 'signatureDrawAr 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            }}
          >
            أدهم مدحت
          </text>

          {/* Sweeping Arabic Underline Flourish from Right to Left */}
          <motion.path
            d="M 275 68 Q 145 88 28 64 Q 18 62 10 66"
            stroke="url(#sigGoldAr)"
            strokeWidth="1.9"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.8, ease: EDITORIAL_EASE }}
          />

          {/* End Flourish Seal Dot */}
          <motion.circle
            cx="7"
            cy="67.5"
            r="2.2"
            fill="#E8C478"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, delay: 1.75, ease: 'easeOut' }}
          />
        </svg>
      ) : (
        /* English Aristocratic Signature (Pinyon Script SVG) */
        <svg
          key={`en-${cycleKey}`}
          viewBox="0 0 380 95"
          className="h-14 sm:h-18 w-auto select-none overflow-visible drop-shadow-[0_2px_12px_rgba(212,168,83,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="signatureGoldEn" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E8C478" />
              <stop offset="60%" stopColor="#D4A853" />
              <stop offset="100%" stopColor="#C8973A" />
            </linearGradient>
          </defs>

          {/* Cursive Name Text with Live Stroke Draw */}
          <text
            x="12"
            y="56"
            className="font-signature select-none cursor-pointer"
            style={{
              fontFamily: "'Pinyon Script', cursive",
              fontSize: '54px',
              stroke: 'url(#signatureGoldEn)',
              strokeWidth: '1.25px',
              fill: '#D4A853',
              letterSpacing: '0.02em',
              strokeDasharray: 500,
              strokeDashoffset: 500,
              animation: 'signatureDrawEn 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          >
            Adham Medhat
          </text>

          {/* Sweeping Paraph / Underline Flourish */}
          <motion.path
            d="M 16 68 Q 140 92 330 58 Q 345 56 354 62"
            stroke="url(#signatureGoldEn)"
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.9, ease: EDITORIAL_EASE }}
          />

          {/* End Flourish Seal Dot */}
          <motion.circle
            cx="358"
            cy="63.5"
            r="2.2"
            fill="#E8C478"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.85, ease: 'easeOut' }}
          />
        </svg>
      )}

      {showLabel && (
        <div className="flex items-center gap-2 pt-1 text-[10px] tracking-wider uppercase text-[#858894]">
          <span className="h-1 w-1 rounded-full bg-[#D4A853]" />
          <span>
            {isArabic ? 'التوقيع الرقمي المعتمد • أدهم مدحت' : 'Authenticated Signature • Adham Medhat'}
          </span>
        </div>
      )}
    </div>
  );
}
