import { getSession } from '@/lib/auth';
import { runCampaignNow } from '@/lib/marketing-email';

export async function POST() {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runCampaignNow();
    return Response.json(result);
  } catch (error) {
    console.error('Manual campaign send error:', error);
    return Response.json({ error: 'Failed to send campaign' }, { status: 500 });
  }
}
