import { useEffect, useState } from 'react';
import { Check, Copy, Download, Globe, QrCode, UserRound, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import QRCode from 'qrcode';
import { Language, UI_COPY } from '../data/profileData';
import { buildVCardString } from '../utils/portfolioLogic';
import { EDITORIAL_EASE } from './MotionPrimitives';

interface QrPassModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

type QrMode = 'website' | 'vcard';

const OFFICIAL_URL = 'https://adham.rstcentral.com/';

export function QrPassModal({ isOpen, lang, onClose }: QrPassModalProps) {
  const [mode, setMode] = useState<QrMode>('website');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    const payload = mode === 'website' ? OFFICIAL_URL : buildVCardString();

    QRCode.toDataURL(payload, {
      errorCorrectionLevel: mode === 'website' ? 'H' : 'M',
      margin: 2,
      width: 440,
      color: {
        dark: '#070709',
        light: '#F8F7F2',
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        if (active) setQrDataUrl('');
      });

    return () => {
      active = false;
    };
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const anchor = document.createElement('a');
    anchor.href = qrDataUrl;
    anchor.download =
      mode === 'website' ? 'adham-medhat-website-qr.png' : 'adham-medhat-contact-vcard-qr.png';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-pass-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#040406]/90 p-4 sm:p-6 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.34, ease: EDITORIAL_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-[#242731] bg-[#101115]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#242731] px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#D4A853]">
                  <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>@adhamrst</span>
                </div>
                <h3
                  id="qr-pass-modal-title"
                  className="font-editorial mt-1 text-2xl font-semibold text-[#F4F3EF]"
                >
                  {UI_COPY.qrPass.modalTitle[lang]}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={UI_COPY.qrPass.close[lang]}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#242731] bg-[#0B0C10] text-[#F4F3EF] transition-colors hover:border-[#D4A853] hover:text-[#D4A853] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6">
              <p className="text-xs leading-5 text-[#9D9FA8]">{UI_COPY.qrPass.modalSubtitle[lang]}</p>

              {/* Mode Switcher */}
              <div
                role="tablist"
                aria-label={UI_COPY.qrPass.modalTitle[lang]}
                className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-[#242731] bg-[#0B0C10] p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'website'}
                  onClick={() => setMode('website')}
                  className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    mode === 'website'
                      ? 'bg-[#D4A853] text-[#070709]'
                      : 'text-[#9D9FA8] hover:text-[#F4F3EF]'
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{UI_COPY.qrPass.modeWebsite[lang]}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'vcard'}
                  onClick={() => setMode('vcard')}
                  className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    mode === 'vcard'
                      ? 'bg-[#D4A853] text-[#070709]'
                      : 'text-[#9D9FA8] hover:text-[#F4F3EF]'
                  }`}
                >
                  <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{UI_COPY.qrPass.modeVcard[lang]}</span>
                </button>
              </div>

              {/* Scannable High-Contrast Ivory QR Stage */}
              <div className="mt-5 flex flex-col items-center rounded-2xl border border-[#D4A853]/45 bg-[#0B0C10] p-5">
                <div className="overflow-hidden rounded-xl bg-[#F8F7F2] p-3 shadow-md">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={
                        mode === 'website'
                          ? 'QR code for https://adham.rstcentral.com/'
                          : 'QR code for Adham Medhat vCard contact'
                      }
                      className="h-52 w-52 sm:h-56 sm:w-56 object-contain"
                    />
                  ) : (
                    <div className="flex h-52 w-52 sm:h-56 sm:w-56 items-center justify-center text-xs text-[#070709]">
                      Loading QR…
                    </div>
                  )}
                </div>

                <p className="font-editorial mt-4 text-xl font-semibold text-[#F4F3EF]">
                  {lang === 'ar' ? 'أدهم مدحت' : 'Adham Medhat'}
                </p>
                <p className="mt-0.5 text-xs text-[#D4A853]" dir="ltr">
                  {mode === 'website' ? 'adham.rstcentral.com' : '@adhamrst · Horus University · RST Central'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#242731] bg-[#16181F] px-4 py-2.5 text-xs font-medium text-[#F4F3EF] transition-colors hover:border-[#D4A853] hover:text-[#D4A853] cursor-pointer"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4 text-[#D4A853]" aria-hidden="true" />
                  )}
                  <span>{copied ? UI_COPY.qrPass.copiedUrl[lang] : UI_COPY.qrPass.copyUrl[lang]}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#D4A853] px-4 py-2.5 text-xs font-semibold text-[#070709] transition-colors hover:bg-[#E8C478] cursor-pointer"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>{UI_COPY.qrPass.downloadPng[lang]}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
