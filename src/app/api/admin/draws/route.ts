import { getSession } from '@/lib/auth';
import { runDraw } from '@/lib/draws';

export async function POST(request: Request) {
  const admin = await getSession();
  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { competitionId } = await request.json();

    const result = await runDraw(competitionId);
    if ('error' in result) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json(result);
  } catch (error) {
    console.error('Draw error:', error);
    return Response.json({ error: 'Draw failed' }, { status: 500 });
  }
}
