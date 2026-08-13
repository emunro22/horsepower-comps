import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { competitions, competitionImages } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { slugify, isVideoUrl } from '@/lib/utils';

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allComps = await db
    .select()
    .from(competitions)
    .orderBy(sql`${competitions.createdAt} desc`);

  const allImages = await db
    .select()
    .from(competitionImages)
    .orderBy(competitionImages.sortOrder);

  const imagesByCompetition = new Map<string, string[]>();
  for (const img of allImages) {
    const list = imagesByCompetition.get(img.competitionId) ?? [];
    list.push(img.url);
    imagesByCompetition.set(img.competitionId, list);
  }

  return Response.json({
    competitions: allComps.map((c) => ({
      ...c,
      images: imagesByCompetition.get(c.id) ?? (c.imageUrl ? [c.imageUrl] : []),
    })),
  });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      images,
      cashAlternative,
      ticketPrice,
      totalTickets,
      drawDate,
      category,
      status,
      featured,
      maxPerPerson,
      minimumSoldPercentage,
      instaWin,
      instaWinDisplayMode,
    } = body;

    if (!title || !description || !ticketPrice || !totalTickets || !drawDate || !category) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = uuid();
    const slug = slugify(title);
    const imageList: string[] = Array.isArray(images) ? images : [];
    const coverImage = imageList.find((url) => !isVideoUrl(url)) || imageList[0];

    await db.insert(competitions).values({
      id,
      title,
      slug,
      description,
      imageUrl: coverImage || imageUrl || null,
      cashAlternative: cashAlternative || null,
      ticketPrice,
      totalTickets,
      drawDate: new Date(drawDate),
      originalDrawDate: new Date(drawDate),
      category,
      status: status || 'draft',
      featured: featured || false,
      maxPerPerson: maxPerPerson || 100,
      minimumSoldPercentage: minimumSoldPercentage || 85,
      instaWin: instaWin || false,
      instaWinDisplayMode: instaWinDisplayMode || 'countdown',
    });

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

    return Response.json({ id, slug }, { status: 201 });
  } catch (error) {
    console.error('Create competition error:', error);
    return Response.json({ error: 'Failed to create competition' }, { status: 500 });
  }
}
