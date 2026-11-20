import { useEffect, useRef, useState } from 'react';

/**
 * FastScrollThumb — Luxury gallery-style floating fast-scroll indicator.
 * Fades out completely when idle and smoothly appears when scrolling.
 * Supports interactive dragging on both Desktop (mouse) and Mobile (touch).
 */
export function FastScrollThumb() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hideTimeoutRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync for event callbacks
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const updateScrollMetrics = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;

      if (maxScroll > 10) {
        const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    const triggerVisible = () => {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = window.setTimeout(() => {
        if (!isDraggingRef.current && !isHoveredRef.current) {
          setIsVisible(false);
        }
      }, 1200);
    };

    const handleScroll = () => {
      updateScrollMetrics();
      triggerVisible();
    };

    const handleResize = () => {
      updateScrollMetrics();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    updateScrollMetrics();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setIsVisible(true);
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    const scrollToPointerY = (clientY: number) => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = docHeight - winHeight;
      if (maxScroll <= 0) return;

      const topOffset = 76;
      const bottomOffset = 64;
      const trackSpan = Math.max(winHeight - topOffset - bottomOffset, 100);

      const relativeY = Math.min(Math.max(clientY - topOffset, 0), trackSpan);
      const ratio = relativeY / trackSpan;

      window.scrollTo({
        top: ratio * maxScroll,
        behavior: 'instant' as ScrollBehavior,
      });
    };

    scrollToPointerY(e.clientY);

    const onPointerMove = (moveEvt: PointerEvent) => {
      moveEvt.preventDefault();
      scrollToPointerY(moveEvt.clientY);
    };

    const onPointerUp = (upEvt: PointerEvent) => {
      setIsDragging(false);
      try {
        target.releasePointerCapture(upEvt.pointerId);
      } catch {
        // Ignored if capture already lost
      }
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerup', onPointerUp);
      target.removeEventListener('pointercancel', onPointerUp);

      // Start fade timeout
      hideTimeoutRef.current = window.setTimeout(() => {
        if (!isHoveredRef.current) {
          setIsVisible(false);
        }
      }, 1200);
    };

    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
    target.addEventListener('pointercancel', onPointerUp);
  };

  // Dimensions & bounds
  // We keep safe padding so the thumb doesn't overlap the fixed navbar
  const topBound = 76;
  const bottomBound = 64;
  const thumbHeight = 46;

  return (
    <aside
      aria-label="Fast scroll indicator"
      className="pointer-events-none fixed inset-y-0 right-0 z-40 select-none"
    >
      {/* Invisible guide track */}
      <div
        ref={trackRef}
        style={{ top: `${topBound}px`, bottom: `${bottomBound}px` }}
        className="pointer-events-none absolute right-0 w-8"
      >
        {/* Interactive thumb handle */}
        <div
          role="scrollbar"
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-orientation="vertical"
          onPointerDown={handlePointerDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            if (!isDraggingRef.current && isVisible) {
              hideTimeoutRef.current = window.setTimeout(() => {
                setIsVisible(false);
              }, 1000);
            }
          }}
          style={{
            top: `calc(${scrollProgress} * (100% - ${thumbHeight}px))`,
            height: `${thumbHeight}px`,
          }}
          className={`absolute right-1 md:right-2 flex w-7 sm:w-8 items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-opacity duration-500 ease-out ${
            isVisible || isDragging || isHovered
              ? 'opacity-90 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Visual Luxury Gallery Pill */}
          <div
            className={`flex flex-col items-center justify-center rounded-full transition-all duration-200 ${
              isDragging
                ? 'w-2.5 h-12 bg-[#1A1C24] border border-[#E8C478] shadow-[0_0_14px_rgba(212,168,83,0.5)]'
                : 'w-1.5 hover:w-2.5 h-11 bg-[#16181F]/90 backdrop-blur-md border border-[#D4A853]/40 hover:border-[#D4A853] shadow-[0_2px_10px_rgba(0,0,0,0.6)]'
            }`}
          >
            {/* Subtle inner grip accents */}
            <div className="flex flex-col items-center gap-0.5">
              <span
                className={`w-0.5 rounded-full transition-all ${
                  isDragging ? 'h-3 bg-[#E8C478]' : 'h-2 bg-[#D4A853]/70'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
