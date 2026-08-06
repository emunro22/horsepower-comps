'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCompetitions, useStore } from '@/lib/store';
import { formatPrice, formatPriceShort, percentSold, getTimeRemaining } from '@/lib/utils';
import CountdownTimer from './CountdownTimer';
import type { Competition } from '@/lib/mock-data';

function useCountdown(endDate: string) {
  const [time, setTime] = useState(() => getTimeRemaining(endDate));
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeRemaining(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);
  return time;
}

function CarouselSlide({
  competition,
  slideRef,
  onNavigate,
  priority,
}: {
  competition: Competition;
  slideRef: (el: HTMLDivElement | null) => void;
  onNavigate: (e: MouseEvent) => void;
  priority?: boolean;
}) {
  const time = useCountdown(competition.drawDate);
  const percent = percentSold(competition.ticketsSold, competition.totalTickets);
  const isHot = percent >= 80;

  return (
    <div
      ref={slideRef}
      className="border-glow shrink-0 snap-center w-[72%] sm:w-[52%] lg:w-[40%] xl:w-[32%] rounded-2xl"
    >
    <Link
      href={`/competitions/${competition.slug}`}
      onClickCapture={onNavigate}
      draggable={false}
      className="group relative block rounded-[14px] overflow-hidden bg-card transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={competition.imageUrl}
          alt={competition.title}
          fill
          draggable={false}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 38vw"
        />

        {competition.featured && (
          <div className="absolute top-3 left-3 bg-primary text-background text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            Featured
          </div>
        )}

        <div className="absolute top-3 right-3 bg-background/85 backdrop-blur-sm text-white text-[11px] sm:text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
          {time.total <= 0 ? 'Draw Complete' : time.days > 0 ? `Ends in ${time.days} day${time.days === 1 ? '' : 's'}` : 'Ends today'}
        </div>

        {isHot && (
          <div className="absolute inset-x-0 bottom-0 bg-danger text-white text-center text-[10px] sm:text-xs font-black py-1.5 tracking-wide uppercase">
            Selling fast &mdash; {competition.totalTickets - competition.ticketsSold} left
          </div>
        )}
      </div>

      <div className="relative px-4 pt-6 pb-4 text-center">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-background text-sm font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
          {formatPrice(competition.ticketPrice)}
        </div>

        <h3 className="text-base sm:text-lg font-black text-foreground leading-snug line-clamp-2 mt-2">
          {competition.title}
        </h3>

        {competition.cashAlternative && (
          <p className="text-muted text-xs sm:text-sm font-medium mt-1">
            {formatPriceShort(competition.cashAlternative)} Cash Alternative
          </p>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-success pulse-live" />
          <CountdownTimer endDate={competition.drawDate} compact />
        </div>

        <div className="mt-4 w-full py-3 rounded-xl bg-primary group-hover:bg-primary-light text-background font-bold text-sm sm:text-base transition-colors">
          Enter Now
        </div>
      </div>
    </Link>
    </div>
  );
}

export default function CompetitionsCarousel() {
  const competitions = useCompetitions();
  const { competitionsLoading } = useStore();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDraggingRef = useRef(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, moved: false, pointerId: 0 });

  const items = [...competitions]
    .filter((c) => c.status === 'live')
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveIndex(idx);
          }
        }
      },
      { root: scroller, threshold: 0.6 }
    );

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  const scrollToIndex = useCallback((index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const next = direction === 'left' ? Math.max(activeIndex - 1, 0) : Math.min(activeIndex + 1, items.length - 1);
    scrollToIndex(next);
  };

  // Mouse-only drag-to-scroll; touch input is left untouched so native
  // swipe/scroll-snap keeps working on mobile. Pointer capture is deferred
  // until real movement is detected — capturing on every mousedown would
  // retarget the resulting click (even a plain, non-drag click) away from
  // the card link, silently breaking navigation.
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    isDraggingRef.current = true;
    dragState.current = { startX: e.clientX, scrollLeft: scroller.scrollLeft, moved: false, pointerId: e.pointerId };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const delta = e.clientX - dragState.current.startX;
    if (!dragState.current.moved && Math.abs(delta) > 4) {
      dragState.current.moved = true;
      scroller.style.scrollSnapType = 'none';
      scroller.setPointerCapture(dragState.current.pointerId);
    }
    if (dragState.current.moved) {
      scroller.scrollLeft = dragState.current.scrollLeft - delta;
    }
  };

  const endDrag = () => {
    const scroller = scrollerRef.current;
    isDraggingRef.current = false;
    if (scroller) scroller.style.scrollSnapType = 'x mandatory';
  };

  const handleNavigate = (e: MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!competitionsLoading && items.length === 0) return null;

  return (
    <section className="pt-2 pb-6 lg:pt-3 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-foreground">Live Competitions</h2>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={activeIndex === 0}
            aria-label="Previous competition"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border hover:border-primary/50 text-foreground transition-colors disabled:opacity-30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={activeIndex >= items.length - 1}
            aria-label="Next competition"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border hover:border-primary/50 text-foreground transition-colors disabled:opacity-30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pt-4 pb-2 px-4 sm:px-6 lg:px-8 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
      >
        {competitionsLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="snap-center shrink-0 w-[72%] sm:w-[52%] lg:w-[40%] xl:w-[32%] rounded-2xl bg-card border border-border animate-pulse aspect-[4/3]"
            />
          ))}

        {!competitionsLoading &&
          items.map((comp, i) => (
            <CarouselSlide
              key={comp.id}
              competition={comp}
              priority={i === 0}
              slideRef={(el) => {
                slideRefs.current[i] = el;
              }}
              onNavigate={handleNavigate}
            />
          ))}
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {items.map((comp, i) => (
            <button
              key={comp.id}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to competition ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-primary w-6' : 'bg-border w-1.5 hover:bg-muted'
              }`}
            />
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        <Link
          href="/competitions"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-light font-bold text-sm transition-colors"
        >
          See All Competitions
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
