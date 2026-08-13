'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { isVideoUrl } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export default function NewCompetitionPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('draft');
  const [cashAlternative, setCashAlternative] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [maxPerPerson, setMaxPerPerson] = useState('100');
  const [drawDate, setDrawDate] = useState('');
  const [featured, setFeatured] = useState(false);
  const [instaWin, setInstaWin] = useState(false);
  const [instaWinDisplayMode, setInstaWinDisplayMode] = useState<'countdown' | 'prize_count' | 'jackpot'>('countdown');

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((data) => {
        const cats: Category[] = data.categories || [];
        setCategories(cats);
        setCategory((prev) => prev || cats[0]?.slug || '');
      })
      .catch(console.error);
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    try {
      for (const file of files) {
        const blob = await upload(`competitions/${Date.now()}-${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          multipart: true,
        });
        setImages((prev) => [...prev, blob.url]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/admin/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          status,
          images,
          cashAlternative: cashAlternative ? Math.round(parseFloat(cashAlternative) * 100) : null,
          ticketPrice: Math.round(parseFloat(ticketPrice) * 100),
          totalTickets: parseInt(totalTickets),
          maxPerPerson: parseInt(maxPerPerson),
          drawDate: new Date(drawDate).toISOString(),
          featured,
          instaWin,
          instaWinDisplayMode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create competition');
        setSaving(false);
        return;
      }

      router.push('/admin/competitions');
    } catch {
      setError('Something went wrong');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 text-sm text-muted mb-6 font-medium">
          <Link href="/admin/competitions" className="hover:text-foreground transition-colors">
            Competitions
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-foreground">New Competition</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-8">Create Competition</h1>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Basic Information</h2>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Competition Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="e.g., Win a BMW M4 or £60,000 Cash" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
              <textarea required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Describe the prize and competition details..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-foreground">Category</label>
                  <Link href="/admin/categories" className="text-xs text-primary hover:text-primary-light font-bold transition-colors">
                    Manage categories
                  </Link>
                </div>
                <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
                  {categories.length === 0 && <option value="">No categories yet</option>}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </div>
            </div>

            {status === 'draft' && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-start gap-2.5">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-primary font-semibold">
                  This competition is set to <span className="font-bold">Draft</span> and won&apos;t appear on the public site. Set Status to <span className="font-bold">Live</span> to publish it.
                </p>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Prize Details</h2>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Cash Alternative (£, optional)</label>
              <input type="number" step="0.01" value={cashAlternative} onChange={(e) => setCashAlternative(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="60000.00" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Prize Images &amp; Videos</label>
              <p className="text-xs text-muted mb-3 font-medium">
                Upload one or more photos or videos. The first photo is used as the cover shown on cards and in the cart, so keep it as an image.
              </p>
              <input type="file" ref={fileRef} accept="image/*,video/*" multiple onChange={handleUpload} className="hidden" />

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {images.map((url, index) => (
                    <div key={url + index} className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                      {isVideoUrl(url) ? (
                        <video src={url} className="absolute inset-0 w-full h-full object-cover" controls muted playsInline />
                      ) : (
                        <Image src={url} alt={`Prize ${index + 1}`} fill className="object-cover" sizes="300px" />
                      )}
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-primary text-background text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg">
                          Cover
                        </span>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(index, -1)}
                            className="w-7 h-7 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-background transition-colors"
                            aria-label="Move earlier"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                            </svg>
                          </button>
                        )}
                        {index < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(index, 1)}
                            className="w-7 h-7 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-background transition-colors"
                            aria-label="Move later"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                            </svg>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="w-7 h-7 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-danger hover:bg-danger hover:text-background transition-colors"
                          aria-label="Remove image"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-muted font-medium">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-10 h-10 mx-auto text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-muted font-medium">
                      {images.length > 0 ? 'Click to add more photos or videos' : 'Click to upload photos or videos'}
                    </p>
                    <p className="text-xs text-muted mt-1">Select up to 5 at once &middot; large iPhone videos are supported</p>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Ticket Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Ticket Price (£)</label>
                <input type="number" required step="0.01" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="1.99" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Total Tickets</label>
                <input type="number" required value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="4999" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Max Per Person</label>
                <input type="number" required value={maxPerPerson} onChange={(e) => setMaxPerPerson(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="100" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Draw Date & Time</label>
              <input type="datetime-local" required value={drawDate} onChange={(e) => setDrawDate(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary" />
              <label htmlFor="featured" className="text-sm text-foreground font-medium">
                Feature this competition on the homepage
              </label>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">InstaWin Listing</h2>
              <p className="text-xs text-muted font-medium mt-0.5">
                List this competition on the dedicated /instawin page instead of (or as well as) the standard listings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="instaWin" checked={instaWin} onChange={(e) => setInstaWin(e.target.checked)} className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary" />
              <label htmlFor="instaWin" className="text-sm text-foreground font-medium">
                Show on the InstaWin page
              </label>
            </div>

            {instaWin && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Card Display Mode</label>
                <select
                  value={instaWinDisplayMode}
                  onChange={(e) => setInstaWinDisplayMode(e.target.value as 'countdown' | 'prize_count' | 'jackpot')}
                  className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="countdown">Countdown (Ends in X days)</option>
                  <option value="prize_count">Prize Count (e.g. 200,000 Prizes remaining)</option>
                  <option value="jackpot">Rolling Jackpot (prize pot vs. amount already won)</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/competitions" className="px-5 py-2.5 text-sm font-bold text-muted hover:text-foreground transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary hover:bg-primary-light text-background font-bold text-sm rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {saving ? 'Creating...' : 'Create Competition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
