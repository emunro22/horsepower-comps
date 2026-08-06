'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface WheelGame {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  pricePerSpin: number;
}

export default function WheelGamesSection() {
  const [games, setGames] = useState<WheelGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wheel-games')
      .then((r) => r.json())
      .then((data) => setGames(data.games || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && games.length === 0) return null;

  return (
    <section id="instawin-games" className="py-8 lg:py-12 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-primary font-bold text-sm">⚡ InstaWin</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
            Win Instantly
          </h2>
          <p className="text-muted text-lg font-medium max-w-2xl mx-auto">
            Pay a small fee to play. No tickets, no waiting for a draw &mdash; match 3 symbols for an instant win.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/instawin/${game.slug}`}
                className="group block bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                {game.imageUrl && (
                  <div className="relative aspect-video">
                    <Image src={game.imageUrl} alt={game.title} fill className="object-cover" sizes="300px" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                    {game.title}
                  </h3>
                  <p className="text-sm font-bold text-primary mb-3">{formatPrice(game.pricePerSpin)} per spin</p>
                  <div className="bg-primary group-hover:bg-primary-light text-background font-bold text-sm text-center py-2.5 rounded-xl transition-all group-hover:scale-105">
                    Play Now
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
