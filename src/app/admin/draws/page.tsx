'use client';

import { useState, useEffect } from 'react';
import { percentSold } from '@/lib/utils';

interface Competition {
  id: string;
  title: string;
  totalTickets: number;
  ticketsSold: number;
  drawDate: string;
  originalDrawDate: string | null;
  status: string;
  minimumSoldPercentage: number;
}

const MAX_EXTENSION_DAYS = 30;

function isExtensionCapped(comp: Competition): boolean {
  const baseDate = new Date(comp.originalDrawDate ?? comp.drawDate);
  const capDate = new Date(baseDate.getTime() + MAX_EXTENSION_DAYS * 24 * 60 * 60 * 1000);
  return new Date() >= capDate;
}

interface DrawResult {
  ticketNumber: number;
  winnerName: string;
  winnerEmail: string;
  winnerPhone: string;
  winnerAddressLine1: string;
  winnerAddressLine2: string;
  winnerCity: string;
  winnerPostcode: string;
  competition: string;
}

export default function AdminDrawsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComp, setSelectedComp] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState<DrawResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/competitions')
      .then((r) => r.json())
      .then((data) => setCompetitions(data.competitions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const eligibleComps = competitions.filter((c) => c.status === 'live');

  const runDraw = async () => {
    if (!selectedComp) return;
    setDrawing(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch('/api/admin/draws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitionId: selectedComp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Draw failed');
        setDrawing(false);
        return;
      }

      setResult(data);
      // Remove drawn competition from eligible list
      setCompetitions((prev) =>
        prev.map((c) => c.id === selectedComp ? { ...c, status: 'drawn' } : c)
      );
      setSelectedComp(null);
    } catch {
      setError('Something went wrong');
    } finally {
      setDrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="animate-fade-in-up mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">Draw Manager</h1>
        <p className="text-muted font-medium">Run verified draws for completed competitions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Run a Draw</h2>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Select Competition
              </label>
              <select
                value={selectedComp || ''}
                onChange={(e) => {
                  setSelectedComp(e.target.value || null);
                  setResult(null);
                  setError('');
                }}
                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer font-medium"
              >
                <option value="">Choose a competition...</option>
                {eligibleComps.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({percentSold(c.ticketsSold, c.totalTickets)}% sold)
                  </option>
                ))}
              </select>
            </div>

            {selectedComp && (() => {
              const comp = competitions.find((c) => c.id === selectedComp);
              if (!comp) return null;
              const pct = percentSold(comp.ticketsSold, comp.totalTickets);
              const thresholdMet = pct >= comp.minimumSoldPercentage;
              const capped = !thresholdMet && isExtensionCapped(comp);
              return (
                <div className="bg-background rounded-xl p-4 mb-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-medium">Tickets Sold</span>
                    <span className="text-foreground font-bold">{comp.ticketsSold.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-medium">Total Tickets</span>
                    <span className="text-foreground font-bold">{comp.totalTickets.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-medium">Threshold</span>
                    <span className={`font-bold ${thresholdMet ? 'text-success' : 'text-primary'}`}>
                      {comp.minimumSoldPercentage}%{thresholdMet ? ' ✓ Met' : ', Not met'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-medium">Draw Date</span>
                    <span className="text-foreground font-bold">
                      {new Date(comp.drawDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  {!thresholdMet && capped && (
                    <div className="mt-2 bg-danger/10 border border-danger/20 rounded-lg p-3">
                      <p className="text-xs text-danger font-bold">
                        30-day extension limit reached at {pct}% sold. You can now force a draw on tickets actually sold, or refund customers instead — outside this system for now.
                      </p>
                    </div>
                  )}
                  {!thresholdMet && !capped && (
                    <div className="mt-2 bg-primary/10 border border-primary/20 rounded-lg p-3">
                      <p className="text-xs text-primary font-bold">
                        Draw blocked, {comp.minimumSoldPercentage}% threshold not reached ({pct}% sold)
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3 mb-5">
                {error}
              </div>
            )}

            <button
              onClick={runDraw}
              disabled={!selectedComp || drawing}
              className="w-full py-4 bg-primary hover:bg-primary-light text-background font-black text-lg rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-primary"
            >
              {drawing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Drawing winner...
                </span>
              ) : (
                'Run Draw'
              )}
            </button>

            {result && (
              <div className="animate-fade-in-up mt-6 bg-success/10 border border-success/30 rounded-xl p-6 text-center">
                <p className="text-sm text-success font-bold mb-2">Winner Selected!</p>
                <p className="text-3xl font-black text-foreground font-mono mb-1">
                  Ticket #{String(result.ticketNumber).padStart(4, '0')}
                </p>
                <p className="text-lg font-bold text-foreground mt-3">{result.winnerName}</p>
                <div className="mt-3 pt-3 border-t border-success/20 text-left space-y-1">
                  <p className="text-sm text-muted font-medium">
                    <span className="text-foreground font-bold">Email: </span>{result.winnerEmail}
                  </p>
                  <p className="text-sm text-muted font-medium">
                    <span className="text-foreground font-bold">Phone: </span>{result.winnerPhone}
                  </p>
                  <p className="text-sm text-muted font-medium">
                    <span className="text-foreground font-bold">Address: </span>
                    {[result.winnerAddressLine1, result.winnerAddressLine2, result.winnerCity, result.winnerPostcode]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
                <p className="text-xs text-muted mt-3 font-medium">{result.competition}</p>
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-bold text-foreground mb-4">Upcoming Draws</h2>
          <div className="space-y-3">
            {eligibleComps.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-6 text-center text-sm text-muted">
                No live competitions to draw
              </div>
            ) : (
              eligibleComps
                .sort((a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime())
                .map((comp) => {
                  const pct = percentSold(comp.ticketsSold, comp.totalTickets);
                  const thresholdMet = pct >= comp.minimumSoldPercentage;
                  return (
                    <div key={comp.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-foreground line-clamp-1">{comp.title}</h3>
                          <p className="text-xs text-muted mt-0.5 font-medium">
                            {new Date(comp.drawDate).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {thresholdMet && (
                            <span className="text-[10px] text-success font-bold">✓</span>
                          )}
                          <span className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ${
                            pct >= 80 ? 'bg-danger/10 text-danger' : pct >= 50 ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                          }`}>
                            {pct}%
                          </span>
                        </div>
                      </div>
                      <div className="relative w-full h-1.5 bg-background rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pct >= 80 ? 'bg-danger' : pct >= 50 ? 'bg-primary' : 'bg-success'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-primary/60"
                          style={{ left: `${comp.minimumSoldPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted mt-2 font-medium">
                        {comp.ticketsSold.toLocaleString()} / {comp.totalTickets.toLocaleString()} tickets sold
                        <span className="text-muted/60"> · {comp.minimumSoldPercentage}% threshold</span>
                      </p>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
