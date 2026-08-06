import { runScheduledCampaignIfDue } from '@/lib/marketing-email';

// Vercel Cron runs this daily. The handler only actually sends once
// intervalDays has elapsed since the last send (or immediately if it has
// never sent before), so a daily trigger produces a rolling N-day cadence
// starting from whenever the campaign was first enabled.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runScheduledCampaignIfDue();
    return Response.json({ ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Marketing email cron error:', error);
    return Response.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
