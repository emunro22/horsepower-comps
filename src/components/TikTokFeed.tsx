'use client';

import { useEffect } from 'react';
import FadeIn from './FadeIn';

const videos = [
  {
    id: '7670966291859115286',
    url: 'https://www.tiktok.com/@clutchcompetitions1980/video/7670966291859115286',
    caption: 'WE ARE REBRANDING THE NAME OF THIS COMPETITION PAGE TONIGHT PEOPLE',
  },
  {
    id: '7669387641292360982',
    url: 'https://www.tiktok.com/@clutchcompetitions1980/video/7669387641292360982',
    caption: 'Flyers at truckfest',
  },
  {
    id: '7669361602315013398',
    url: 'https://www.tiktok.com/@clutchcompetitions1980/video/7669361602315013398',
    caption: 'Off to Truckfest',
  },
];

export default function TikTokFeed() {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.tiktok.com/embed.js"]');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <section className="py-8 lg:py-12 bg-surface border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
            Follow Us on <span className="text-primary">TikTok</span>
          </h2>
          <p className="text-muted text-lg font-medium">
            Behind the scenes, live draws, and more @clutchcompetitions1980
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
          {videos.map((video) => (
            <blockquote
              key={video.id}
              className="tiktok-embed w-full"
              cite={video.url}
              data-video-id={video.id}
              style={{ maxWidth: '325px', minWidth: '260px' }}
            >
              <section>
                <a target="_blank" rel="noopener noreferrer" href={`${video.url}?refer=embed`}>
                  {video.caption}
                </a>
              </section>
            </blockquote>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.tiktok.com/@clutchcompetitions1980"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105"
          >
            Follow @clutchcompetitions1980
          </a>
        </div>
      </div>
    </section>
  );
}
