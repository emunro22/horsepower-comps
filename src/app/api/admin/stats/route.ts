import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, competitions, orders } from '@/lib/db/schema';
import { eq, sql, gte, and } from 'drizzle-orm';

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalUsers] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    const [newUsersThisWeek] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(gte(users.createdAt, weekAgo));

    const [activeCompetitions] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(competitions)
      .where(eq(competitions.status, 'live'));

    const [totalRevenue] = await db
      .select({ total: sql<number>`coalesce(sum(total_pence), 0)::int` })
      .from(orders)
      .where(eq(orders.status, 'paid'));

    const [ticketsSoldToday] = await db
      .select({ count: sql<number>`coalesce(sum(quantity), 0)::int` })
      .from(orders)
      .where(
        and(
          eq(orders.status, 'paid'),
          gte(orders.createdAt, todayStart)
        )
      );

    const recentOrders = await db
      .select({
        id: orders.id,
        quantity: orders.quantity,
        totalPence: orders.totalPence,
        createdAt: orders.createdAt,
        userName: users.name,
        competitionTitle: competitions.title,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .innerJoin(competitions, eq(orders.competitionId, competitions.id))
      .where(eq(orders.status, 'paid'))
      .orderBy(sql`${orders.createdAt} desc`)
      .limit(10);

    const upcomingDraws = await db
      .select()
      .from(competitions)
      .where(eq(competitions.status, 'live'))
      .orderBy(competitions.drawDate)
      .limit(5);

    return Response.json({
      stats: {
        totalUsers: totalUsers.count,
        newUsersThisWeek: newUsersThisWeek.count,
        activeCompetitions: activeCompetitions.count,
        totalRevenuePence: totalRevenue.total,
        ticketsSoldToday: ticketsSoldToday.count,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        user: o.userName,
        competition: o.competitionTitle,
        tickets: o.quantity,
        total: `£${(o.totalPence / 100).toFixed(2)}`,
        time: o.createdAt,
      })),
      upcomingDraws: upcomingDraws.map((c) => ({
        id: c.id,
        competition: c.title,
        date: c.drawDate,
        sold: `${c.ticketsSold.toLocaleString()}/${c.totalTickets.toLocaleString()}`,
        percent: Math.round((c.ticketsSold / c.totalTickets) * 100),
      })),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return Response.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
