import { getSession } from '@/lib/auth';
import { markOrderPaid } from '@/lib/orders';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getSession();
  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await markOrderPaid(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Mark order paid error:', error);
    return Response.json({ error: 'Failed to mark order as paid' }, { status: 500 });
  }
}
