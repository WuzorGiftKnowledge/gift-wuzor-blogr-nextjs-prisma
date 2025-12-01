import { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAccess } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

// GET /api/prayer-point/pending
// Admin-only endpoint for viewing pending prayer points
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  // Check admin access
  const admin = await checkAdminAccess(req, res);
  if (!admin) {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [prayerPoints, total] = await Promise.all([
      prisma.prayerPoint.findMany({
        where: { approved: false },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.prayerPoint.count({
        where: { approved: false },
      }),
    ]);

    res.json({
      prayerPoints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching pending prayer points:', error);
    res.status(500).json({ error: 'Error fetching pending prayer points' });
  }
}

