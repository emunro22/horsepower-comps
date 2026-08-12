import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, users, competitions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const admin = await getSession();
  if (!admin || admin.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await db
    .select({
      id: orders.id,
      quantity: orders.quantity,
      totalPence: orders.totalPence,
      status: orders.status,
      paymentReference: orders.paymentReference,
      createdAt: orders.createdAt,
      userName: users.name,
      userEmail: users.email,
      competitionTitle: competitions.title,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .innerJoin(competitions, eq(orders.competitionId, competitions.id))
    .where(eq(orders.status, 'pending'))
    .orderBy(desc(orders.createdAt));

  return Response.json({ orders: rows });
}
