'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  newUsersThisWeek: number;
  activeCompetitions: number;
  totalRevenuePence: number;
  ticketsSoldToday: number;
}

interface RecentOrder {
  id: string;
  user: string;
  competition: string;
  tickets: number;
  total: string;
  time: string;
}

interface UpcomingDraw {
  id: string;
  competition: string;
  date: string;
  sold: string;
  percent: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [upcomingDraws, setUpcomingDraws] = useState<UpcomingDraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setUpcomingDraws(data.upcomingDraws || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: 'Active Competitions', value: stats.activeCompetitions.toString(), color: 'text-primary' },
        { label: 'Total Revenue', value: `£${(stats.totalRevenuePence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`, color: 'text-success' },
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'text-accent-light' },
        { label: 'Tickets Sold Today', value: stats.ticketsSoldToday.toString(), color: 'text-primary' },
      ]
    : [];

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="animate-fade-in-up mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">Dashboard</h1>
        <p className="text-muted font-medium">Welcome back. Here&apos;s what&apos;s happening with Horse Power Competitions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className="animate-fade-in-up bg-card border border-border rounded-xl p-5"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="text-sm text-muted mb-1 font-semibold">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="animate-fade-in-up lg:col-span-2" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
            <span className="text-xs text-muted font-semibold">Live feed</span>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Order</th>
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">User</th>
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Competition</th>
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Total</th>
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted">No orders yet</td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                        <td className="px-5 py-3.5 text-sm font-mono text-primary font-bold truncate max-w-[100px]">{order.id.slice(0, 8)}</td>
                        <td className="px-5 py-3.5 text-sm text-foreground font-medium">{order.user}</td>
                        <td className="px-5 py-3.5 text-sm text-muted hidden sm:table-cell truncate max-w-[200px] font-medium">{order.competition}</td>
                        <td className="px-5 py-3.5 text-sm font-bold text-foreground">{order.total}</td>
                        <td className="px-5 py-3.5 text-xs text-muted font-medium">{timeAgo(order.time)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Upcoming Draws</h2>
            <Link href="/admin/draws" className="text-xs text-primary hover:text-primary-light font-bold transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingDraws.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-6 text-center text-sm text-muted">
                No upcoming draws
              </div>
            ) : (
              upcomingDraws.map((draw) => (
                <div key={draw.id} className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-bold text-foreground mb-1 truncate">{draw.competition}</h3>
                  <p className="text-xs text-muted mb-3 font-medium">
                    {new Date(draw.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted font-medium">{draw.sold} sold</span>
                    <span className={`text-xs font-black ${draw.percent >= 80 ? 'text-danger' : draw.percent >= 50 ? 'text-primary' : 'text-success'}`}>
                      {draw.percent}%
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        draw.percent >= 80
                          ? 'bg-gradient-to-r from-primary to-danger'
                          : draw.percent >= 50
                          ? 'bg-gradient-to-r from-success to-primary'
                          : 'bg-gradient-to-r from-accent to-success'
                      }`}
                      style={{ width: `${draw.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/competitions/new"
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/50 transition-colors"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-foreground">New Competition</span>
              </Link>
              <Link
                href="/admin/draws"
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/50 transition-colors"
              >
                <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center text-accent-light">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-foreground">Run a Draw</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
