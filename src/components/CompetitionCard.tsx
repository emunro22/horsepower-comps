import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatPriceShort } from '@/lib/utils';
import CountdownTimer from './CountdownTimer';
import ProgressBar from './ProgressBar';
import type { Competition } from '@/lib/mock-data';

interface CompetitionCardProps {
  competition: Competition;
  index?: number;
}

export default function CompetitionCard({ competition, index = 0 }: CompetitionCardProps) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link href={`/competitions/${competition.slug}`} className="group block">
        <div className="border-glow rounded-xl">
        <div className="bg-card rounded-[10px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 card-shine">
          <div className="relative aspect-[4/3] bg-background overflow-hidden">
            <Image
              src={competition.imageUrl}
              alt={competition.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
            {competition.featured && (
              <div className="absolute top-2 left-2 bg-primary text-background text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                Featured
              </div>
            )}
            {!!competition.instantWinsCount && (
              <div
                className={`absolute left-2 bg-accent text-background text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${competition.featured ? 'top-8' : 'top-2'}`}
              >
                ⚡ Instant Wins
              </div>
            )}
            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border border-border/50">
              {competition.category}
            </div>
            {competition.cashAlternative && (
              <div className="absolute bottom-0 left-0 right-0 pb-2 px-3">
                <div className="flex items-end justify-end">
                  <div className="text-right">
                    <p className="text-[9px] text-muted uppercase tracking-wider font-semibold">Cash Alt.</p>
                    <p className="text-xs font-bold text-foreground drop-shadow-lg">
                      {formatPriceShort(competition.cashAlternative)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 space-y-2">
            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {competition.title}
            </h3>

            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success pulse-live" />
              <CountdownTimer endDate={competition.drawDate} compact />
            </div>

            <ProgressBar
              sold={competition.ticketsSold}
              total={competition.totalTickets}
              threshold={competition.minimumSoldPercentage}
            />

            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[9px] text-muted uppercase tracking-wider font-semibold">Ticket Price</p>
                <p className="text-base font-black text-foreground">
                  {formatPrice(competition.ticketPrice)}
                </p>
              </div>
              <div className="w-full text-center bg-primary hover:bg-primary-light text-background font-bold text-xs py-2 rounded-lg transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                Enter Now
              </div>
            </div>
          </div>
        </div>
        </div>
      </Link>
    </div>
  );
}
