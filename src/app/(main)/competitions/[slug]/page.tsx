'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatPriceShort, percentSold, isVideoUrl } from '@/lib/utils';
import { useCompetition } from '@/lib/store';
import CountdownTimer from '@/components/CountdownTimer';
import ProgressBar from '@/components/ProgressBar';
import TicketSelector from '@/components/TicketSelector';

export default function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const competition = useCompetition(slug);
  const [activeImage, setActiveImage] = useState(0);

  if (!competition) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-black text-foreground mb-4">Competition Not Found</h1>
        <p className="text-muted mb-8 font-medium">This competition may have ended or been removed.</p>
        <Link
          href="/competitions"
          className="inline-flex px-6 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary-light transition-colors"
        >
          Browse Competitions
        </Link>
      </div>
    );
  }

  const images = competition.images && competition.images.length > 0 ? competition.images : [competition.imageUrl];
  const remaining = competition.totalTickets - competition.ticketsSold;
  const soldPct = percentSold(competition.ticketsSold, competition.totalTickets);
  const thresholdMet = soldPct >= competition.minimumSoldPercentage;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
      <nav className="animate-fade-in flex items-center gap-2 text-sm text-muted mb-8 font-medium">
        <Link href="/competitions" className="hover:text-foreground transition-colors">
          Competitions
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-foreground truncate">{competition.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="animate-fade-in-up lg:col-span-3 space-y-6">
          <div className="relative aspect-[16/10] bg-card rounded-2xl overflow-hidden border border-border">
            {isVideoUrl(images[activeImage] ?? images[0]) ? (
              <video
                src={images[activeImage] ?? images[0]}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                playsInline
              />
            ) : (
              <Image
                src={images[activeImage] ?? images[0]}
                alt={competition.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            )}
            {competition.featured && (
              <div className="absolute top-4 left-4 bg-primary text-background text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg">
                Featured
              </div>
            )}
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-border/50">
              {competition.category}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, index) => (
                <button
                  key={img + index}
                  onClick={() => setActiveImage(index)}
                  className={`relative shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    index === activeImage ? 'border-primary' : 'border-border hover:border-primary/50'
                  }`}
                  aria-label={`Show image ${index + 1}`}
                >
                  {isVideoUrl(img) ? (
                    <>
                      <video src={img} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <Image src={img} alt={`${competition.title} ${index + 1}`} fill className="object-cover" sizes="80px" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {competition.cashAlternative && (
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted uppercase tracking-wider mb-1 font-semibold">Cash Alternative</p>
                <p className="text-2xl font-black text-foreground">{formatPriceShort(competition.cashAlternative)}</p>
              </div>
            )}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted uppercase tracking-wider mb-1 font-semibold">Max Tickets</p>
              <p className="text-2xl font-black text-foreground">{competition.totalTickets.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-4">
              {competition.title}
            </h1>
            <p className="text-muted leading-relaxed whitespace-pre-line font-medium">
              {competition.description}
            </p>
          </div>

          {/* Threshold Notice */}
          <div className={`border rounded-2xl p-5 ${thresholdMet ? 'bg-success/5 border-success/20' : 'bg-primary/5 border-primary/20'}`}>
            <div className="flex items-start gap-3">
              <div className="text-xl mt-0.5">{thresholdMet ? '✅' : '🛡️'}</div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">
                  {thresholdMet ? 'Draw Threshold Met!' : `${competition.minimumSoldPercentage}% Minimum Threshold`}
                </h3>
                <p className="text-xs text-muted font-medium leading-relaxed">
                  {thresholdMet
                    ? `This competition has passed the ${competition.minimumSoldPercentage}% minimum threshold. The draw will proceed as scheduled.`
                    : `This competition requires ${competition.minimumSoldPercentage}% of tickets to be sold for the draw to go ahead. If the threshold is not met by the draw date, the competition will be automatically extended, up to a maximum of 30 days.`
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Competition Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Ticket Price', value: formatPrice(competition.ticketPrice) },
                { label: 'Total Tickets', value: competition.totalTickets.toLocaleString() },
                { label: 'Tickets Remaining', value: remaining.toLocaleString() },
                { label: 'Max Per Person', value: competition.maxPerPerson.toString() },
                { label: 'Draw Threshold', value: `${competition.minimumSoldPercentage}%` },
                { label: 'Draw Date', value: new Date(competition.drawDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted font-medium">{item.label}</span>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up lg:col-span-2" style={{ animationDelay: '200ms' }}>
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-success pulse-live" />
                <span className="text-sm font-bold text-success">Live Now</span>
              </div>
              <p className="text-sm text-muted mb-3 font-medium">Draw closes in</p>
              <div className="flex justify-center">
                <CountdownTimer endDate={competition.drawDate} />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <ProgressBar
                sold={competition.ticketsSold}
                total={competition.totalTickets}
                threshold={competition.minimumSoldPercentage}
              />
            </div>

            <TicketSelector
              competitionId={competition.id}
              competitionTitle={competition.title}
              imageUrl={competition.imageUrl}
              ticketPrice={competition.ticketPrice}
              maxPerPerson={competition.maxPerPerson}
              remainingTickets={remaining}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
