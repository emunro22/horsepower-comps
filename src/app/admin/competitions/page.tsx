'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice, percentSold } from '@/lib/utils';

interface Competition {
  id: string;
  title: string;
  slug: string;
  category: string;
  ticketPrice: number;
  totalTickets: number;
  ticketsSold: number;
  drawDate: string;
  status: string;
  featured: boolean;
}

export default function AdminCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'draft' | 'drawn'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadCompetitions = () => {
    fetch('/api/admin/competitions')
      .then((r) => r.json())
      .then((data) => setCompetitions(data.competitions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCompetitions();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also permanently delete any orders, tickets, and winner records tied to it. This cannot be undone.`)) return;

    setError('');
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/competitions/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCompetitions((prev) => prev.filter((c) => c.id !== id));
      } else {
        setError(data.error || 'Failed to delete competition');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete competition');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = filter === 'all' ? competitions : competitions.filter((c) => c.status === filter);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="animate-fade-in-up flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">Competitions</h1>
          <p className="text-muted font-medium">Manage all your competitions in one place.</p>
        </div>
        <Link
          href="/admin/competitions/new"
          className="px-5 py-2.5 bg-primary hover:bg-primary-light text-background font-bold text-sm rounded-xl transition-all hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Competition
        </Link>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3 mb-6">
          {error}
        </div>
      )}

      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 w-fit">
        {(['all', 'live', 'draft', 'drawn'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors capitalize ${
              filter === f ? 'bg-primary text-background' : 'text-muted hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Competition</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Price</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Sold</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted">
                    No competitions found
                  </td>
                </tr>
              ) : (
                filtered.map((comp) => {
                  const pct = percentSold(comp.ticketsSold, comp.totalTickets);
                  return (
                    <tr key={comp.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-foreground truncate max-w-[250px]">{comp.title}</p>
                        <p className="text-xs text-muted font-medium">Draw: {new Date(comp.drawDate).toLocaleDateString('en-GB')}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs font-bold bg-background border border-border rounded-lg px-2.5 py-1 capitalize">
                          {comp.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-foreground">{formatPrice(comp.ticketPrice)}</td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 80 ? 'bg-danger' : pct >= 50 ? 'bg-primary' : 'bg-success'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted font-bold">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          comp.status === 'live' ? 'bg-success/10 text-success' :
                          comp.status === 'coming_soon' ? 'bg-primary/10 text-primary' :
                          comp.status === 'sold_out' ? 'bg-danger/10 text-danger' :
                          comp.status === 'draft' ? 'bg-muted/10 text-muted' :
                          'bg-muted/10 text-muted'
                        }`}>
                          {comp.status === 'live' ? 'Live' :
                           comp.status === 'coming_soon' ? 'Soon' :
                           comp.status === 'sold_out' ? 'Sold Out' :
                           comp.status === 'draft' ? 'Draft' : 'Drawn'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/competitions/${comp.id}/edit`}
                            className="text-xs text-primary hover:text-primary-light font-bold transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(comp.id, comp.title)}
                            disabled={deleting === comp.id}
                            className="text-xs text-danger hover:text-danger/80 font-bold transition-colors disabled:opacity-50"
                          >
                            {deleting === comp.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
