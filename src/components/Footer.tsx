import { useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language, UI_COPY } from '../data/profileData';
import { EditorialReveal } from './MotionPrimitives';

interface FooterProps {
  lang: Language;
  onOwnerTrigger: () => void;
}

export function Footer({ lang, onOwnerTrigger }: FooterProps) {
  const year = new Date().getFullYear();
  const tapCounterRef = useRef<{ count: number; lastTap: number }>({ count: 0, lastTap: 0 });

  const handleCopyrightTap = () => {
    const now = Date.now();
    if (now - tapCounterRef.current.lastTap > 1600) {
      tapCounterRef.current = { count: 1, lastTap: now };
      return;
    }
    tapCounterRef.current = { count: tapCounterRef.current.count + 1, lastTap: now };
    if (tapCounterRef.current.count >= 5) {
      tapCounterRef.current = { count: 0, lastTap: 0 };
      onOwnerTrigger();
    }
  };

  return (
    <footer className="bg-[#070709] py-10 sm:py-12">
      <EditorialReveal className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 sm:gap-8 border-b border-[#242731] pb-6 sm:pb-8 md:flex-row md:items-center">
          <div>
            <p className="font-editorial text-2xl font-semibold text-[#F4F3EF]">
              {lang === 'ar' ? 'أدهم مدحت' : 'Adham Medhat'}
            </p>
            <p className="mt-1.5 text-xs text-[#9D9FA8]">{UI_COPY.footer.affiliations[lang]}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-xs font-medium text-[#9D9FA8]">
            <a
              href="https://rstcentral.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#F4F3EF]"
            >
              RST Central
            </a>
            <a
              href="https://www.horus.edu.eg"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#F4F3EF]"
            >
              {lang === 'ar' ? 'جامعة حورس' : 'Horus University'}
            </a>
            <a
              href="/adham-medhat.vcf"
              download="adham-medhat.vcf"
              className="transition-colors hover:text-[#D4A853]"
            >
              vCard
            </a>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex flex-col items-start justify-between gap-4 text-xs text-[#858894] sm:flex-row sm:items-center">
          <p>
            <span onClick={handleCopyrightTap} className="select-none">
              ©
            </span>{' '}
            <span className="tabular-nums">{year}</span> {UI_COPY.footer.rights[lang]}
          </p>

          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9D9FA8] transition-colors hover:text-[#D4A853]"
          >
            <span>{UI_COPY.footer.backToTop[lang]}</span>
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </EditorialReveal>
    </footer>
  );
}
