import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

// GET /api/testimony/approved
// Public endpoint for viewing approved testimonies
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [testimonies, total] = await Promise.all([
      prisma.testimony.findMany({
        where: { approved: true },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.testimony.count({
        where: { approved: true },
      }),
    ]);

    res.json({
      testimonies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching approved testimonies:', error);
    res.status(500).json({ error: 'Error fetching approved testimonies' });
  }
}

