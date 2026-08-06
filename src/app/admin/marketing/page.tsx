'use client';

import { useState, useEffect, useCallback } from 'react';

interface CampaignStatus {
  enabled: boolean;
  intervalDays: number;
  lastSentAt: string | null;
  lastRecipientCount: number;
  nextSendAt: string;
  recipientCount: number;
  popularCompetition: { id: string; title: string } | null;
  newestCompetition: { id: string; title: string } | null;
}

function formatDate(value: string | null) {
  if (!value) return 'Never';
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminMarketingPage() {
  const [status, setStatus] = useState<CampaignStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [intervalInput, setIntervalInput] = useState(30);
  const [confirmSend, setConfirmSend] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    fetch('/api/admin/marketing-campaign')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStatus(data);
        setIntervalInput(data.intervalDays);
      })
      .catch(() => setError('Failed to load campaign status'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateSettings = async (updates: { enabled?: boolean; intervalDays?: number }) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/marketing-campaign', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      setError('Failed to update campaign settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSendNow = async () => {
    setSending(true);
    setSendResult(null);
    setError('');
    try {
      const res = await fetch('/api/admin/marketing-campaign/send', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.reason === 'no_live_competitions') {
        setSendResult('No live competitions to feature — nothing was sent.');
      } else if (data.reason === 'no_recipients') {
        setSendResult('No verified users to email — nothing was sent.');
      } else {
        setSendResult(`Sent to ${data.sent} customer${data.sent === 1 ? '' : 's'}.`);
      }
      setConfirmSend(false);
      load();
    } catch {
      setError('Failed to send campaign');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in-up mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">Marketing Emails</h1>
        <p className="text-muted font-medium">
          Automatically email every verified customer about the most popular and newest live competitions.
        </p>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3 mb-4">
          {error}
        </div>
      )}

      {sendResult && (
        <div className="bg-success/10 border border-success/20 text-success text-sm font-semibold rounded-xl p-3 mb-4">
          {sendResult}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Popular &amp; Newest Competition Email</h2>
            <p className="text-sm text-muted font-medium mt-0.5">Runs automatically on a recurring schedule.</p>
          </div>
          <button
            onClick={() => status && updateSettings({ enabled: !status.enabled })}
            disabled={saving}
            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
              status?.enabled ? 'bg-primary' : 'bg-border'
            } disabled:opacity-50`}
            aria-label="Toggle campaign"
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                status?.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Status</p>
            <p className={`text-sm font-bold ${status?.enabled ? 'text-success' : 'text-muted'}`}>
              {status?.enabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Recipients</p>
            <p className="text-sm font-bold text-foreground">{status?.recipientCount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Last Sent</p>
            <p className="text-sm font-bold text-foreground">{formatDate(status?.lastSentAt ?? null)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Next Scheduled</p>
            <p className="text-sm font-bold text-foreground">{formatDate(status?.nextSendAt ?? null)}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6 pb-6 border-b border-border">
          <div className="flex-1">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              Repeat every (days)
            </label>
            <input
              type="number"
              min={1}
              value={intervalInput}
              onChange={(e) => setIntervalInput(Number(e.target.value))}
              className="w-full h-11 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={() => updateSettings({ intervalDays: intervalInput })}
            disabled={saving || intervalInput === status?.intervalDays}
            className="h-11 px-5 bg-background border border-border hover:border-primary/50 text-foreground font-bold text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Interval
          </button>
        </div>

        <div className="mb-6">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">This email will feature</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary">🔥</span>
              <span className="text-muted">Most popular:</span>
              <span className="text-foreground font-semibold">
                {status?.popularCompetition?.title ?? 'No live competitions'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary">🆕</span>
              <span className="text-muted">Newest:</span>
              <span className="text-foreground font-semibold">
                {status?.newestCompetition?.title ?? '—'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setConfirmSend(true)}
          className="w-full py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-[1.01]"
        >
          Send Now
        </button>
      </div>

      {confirmSend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !sending && setConfirmSend(false)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 w-full max-w-md animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h2 className="text-xl font-black text-foreground mb-2">Send Campaign Now?</h2>
              <p className="text-sm text-muted font-medium">
                This will immediately email{' '}
                <span className="text-foreground font-bold">{status?.recipientCount.toLocaleString()} customers</span>{' '}
                and reset the {status?.intervalDays}-day schedule to start from today.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSend(false)}
                disabled={sending}
                className="flex-1 py-3 bg-background border border-border text-foreground font-bold rounded-xl hover:bg-card transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNow}
                disabled={sending}
                className="flex-1 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
