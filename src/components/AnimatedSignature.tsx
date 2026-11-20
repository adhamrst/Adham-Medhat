import { useState } from 'react';
import { motion } from 'motion/react';
import { EDITORIAL_EASE } from './MotionPrimitives';

interface AnimatedSignatureProps {
  className?: string;
  lang?: 'en' | 'ar';
  showLabel?: boolean;
  interactive?: boolean;
}

export function AnimatedSignature({
  className = '',
  lang = 'en',
  showLabel = true,
  interactive = true,
}: AnimatedSignatureProps) {
  const [animationKey, setAnimationKey] = useState(0);

  const handleReplay = () => {
    if (interactive) {
      setAnimationKey((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`relative inline-flex flex-col items-start ${className}`}
      onClick={handleReplay}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleReplay();
        }
      }}
      title={interactive ? (lang === 'ar' ? 'إعادة رسم التوقيع' : 'Click to replay signature') : undefined}
      aria-label={lang === 'ar' ? 'توقيع أدهم مدحت المعتمد' : 'Official signature of Adham Medhat'}
    >
      <svg
        key={animationKey}
        viewBox="0 0 380 95"
        className="h-16 w-auto sm:h-20 select-none overflow-visible drop-shadow-[0_2px_12px_rgba(212,168,83,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="signatureGold" x1="0%" y1="0%" x2="100%" y2="0%">
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
            stroke: 'url(#signatureGold)',
            strokeWidth: '1.25px',
            fill: '#D4A853',
            letterSpacing: '0.02em',
            strokeDasharray: 500,
            strokeDashoffset: 500,
            animation: 'signatureDraw 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          }}
        >
          Adham Medhat
        </text>

        {/* Sweeping Paraph / Underline Flourish */}
        <motion.path
          d="M 16 68 Q 140 92 330 58 Q 345 56 354 62"
          stroke="url(#signatureGold)"
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

      {showLabel && (
        <div className="flex items-center gap-2 pt-0.5 text-[10px] tracking-wider uppercase text-[#858894]">
          <span className="h-1 w-1 rounded-full bg-[#D4A853]" />
          <span>
            {lang === 'ar' ? 'التوقيع الرقمي المعتمد' : 'Authenticated Signature'}
          </span>
        </div>
      )}
    </div>
  );
}
