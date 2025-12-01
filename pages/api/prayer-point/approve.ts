import { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAccess } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

// PUT /api/prayer-point/approve
// Admin-only endpoint for approving prayer points
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  // Check admin access
  const admin = await checkAdminAccess(req, res);
  if (!admin) {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  const { id, approved } = req.body;

  if (typeof id !== 'number' || typeof approved !== 'boolean') {
    res.status(400).json({ message: 'Invalid request body. id (number) and approved (boolean) are required.' });
    return;
  }

  try {
    const result = await prisma.prayerPoint.update({
      where: { id },
      data: { approved },
    });

    res.json({
      message: `Prayer point ${approved ? 'approved' : 'rejected'} successfully`,
      prayerPoint: result,
    });
  } catch (error) {
    console.error('Error updating prayer point:', error);
    res.status(500).json({ error: 'Error updating prayer point' });
  }
}

