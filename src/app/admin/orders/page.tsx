'use client';

import { useState, useEffect } from 'react';

interface PendingOrder {
  id: string;
  quantity: number;
  totalPence: number;
  status: string;
  paymentReference: string | null;
  createdAt: string;
  userName: string;
  userEmail: string;
  competitionTitle: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMarkPaid = async (order: PendingOrder) => {
    if (!confirm(`Mark this order as paid?\n\n${order.userName} — ${order.competitionTitle} (${order.quantity} tickets)\n£${(order.totalPence / 100).toFixed(2)}\n\nThis will issue their tickets immediately.`)) {
      return;
    }

    setMarkingId(order.id);
    setError('');

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/mark-paid`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to mark order as paid');
        return;
      }
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setMarkingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalOwed = orders.reduce((sum, o) => sum + o.totalPence, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="animate-fade-in-up mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">Pending Orders</h1>
        <p className="text-muted font-medium">
          Bank transfer orders awaiting payment confirmation. Check your bank account for a matching reference, then mark paid to issue tickets.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xl font-black text-foreground">{orders.length}</p>
          <p className="text-xs text-muted font-semibold">Pending Orders</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xl font-black text-foreground">£{(totalOwed / 100).toFixed(2)}</p>
          <p className="text-xs text-muted font-semibold">Awaiting Payment</p>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Customer</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Competition</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Reference</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Tickets</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Amount</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Created</th>
                <th className="text-right text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted">
                    No pending orders — you&apos;re all caught up.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-foreground">{order.userName}</p>
                      <p className="text-xs text-muted font-medium">{order.userEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground font-medium">{order.competitionTitle}</td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs font-black text-primary">{order.paymentReference || '—'}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted hidden md:table-cell font-medium">{order.quantity}</td>
                    <td className="px-5 py-4 text-sm text-foreground font-bold">£{(order.totalPence / 100).toFixed(2)}</td>
                    <td className="px-5 py-4 text-xs text-muted hidden lg:table-cell font-medium">
                      {new Date(order.createdAt).toLocaleString('en-GB')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleMarkPaid(order)}
                        disabled={markingId === order.id}
                        className="text-xs font-bold text-background bg-primary hover:bg-primary-light transition-colors px-3 py-1.5 rounded-lg disabled:opacity-50"
                      >
                        {markingId === order.id ? 'Marking...' : 'Mark Paid'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
