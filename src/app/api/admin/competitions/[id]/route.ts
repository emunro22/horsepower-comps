import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { competitions, competitionImages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { slugify, isVideoUrl } from '@/lib/utils';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (body.title) {
      updates.title = body.title;
      updates.slug = slugify(body.title);
    }
    if (body.description !== undefined) updates.description = body.description;
    if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl;

    const imageList: string[] | undefined = Array.isArray(body.images) ? body.images : undefined;
    if (imageList !== undefined) {
      updates.imageUrl = imageList.find((url) => !isVideoUrl(url)) || imageList[0] || null;
    }

    if (body.cashAlternative !== undefined) updates.cashAlternative = body.cashAlternative;
    if (body.ticketPrice !== undefined) updates.ticketPrice = body.ticketPrice;
    if (body.totalTickets !== undefined) updates.totalTickets = body.totalTickets;
    if (body.drawDate !== undefined) {
      // A manual admin edit resets the 30-day auto-extension window, since
      // it's a deliberate reschedule rather than an automatic extension.
      updates.drawDate = new Date(body.drawDate);
      updates.originalDrawDate = new Date(body.drawDate);
    }
    if (body.category !== undefined) updates.category = body.category;
    if (body.status !== undefined) updates.status = body.status;
    if (body.featured !== undefined) updates.featured = body.featured;
    if (body.maxPerPerson !== undefined) updates.maxPerPerson = body.maxPerPerson;
    if (body.minimumSoldPercentage !== undefined) updates.minimumSoldPercentage = body.minimumSoldPercentage;
    if (body.instaWin !== undefined) updates.instaWin = body.instaWin;
    if (body.instaWinDisplayMode !== undefined) updates.instaWinDisplayMode = body.instaWinDisplayMode;

    await db
      .update(competitions)
      .set(updates)
      .where(eq(competitions.id, id));

    if (imageList !== undefined) {
      await db.delete(competitionImages).where(eq(competitionImages.competitionId, id));
      if (imageList.length > 0) {
        await db.insert(competitionImages).values(
          imageList.map((url, index) => ({
            id: uuid(),
            competitionId: id,
            url,
            sortOrder: index,
          }))
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Update competition error:', error);
    return Response.json({ error: 'Failed to update competition' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.delete(competitions).where(eq(competitions.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete competition error:', error);
    return Response.json({ error: 'Failed to delete competition' }, { status: 500 });
  }
}
