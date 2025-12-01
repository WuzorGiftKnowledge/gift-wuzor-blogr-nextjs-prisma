import { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAccess } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

// GET /api/admin/users - Get all users (admin only)
// PUT /api/admin/users - Update user admin status (admin only)
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check admin access
  const admin = await checkAdminAccess(req, res);
  if (!admin) {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  } else if (req.method === 'PUT') {
    const { userId, isAdmin } = req.body;

    if (typeof userId !== 'number' || typeof isAdmin !== 'boolean') {
      res.status(400).json({ message: 'Invalid request body. userId (number) and isAdmin (boolean) are required.' });
      return;
    }

    // Prevent removing admin access from yourself
    if (userId === admin.id && isAdmin === false) {
      res.status(400).json({ message: 'You cannot remove admin access from yourself' });
      return;
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isAdmin },
        select: {
          id: true,
          name: true,
          email: true,
          isAdmin: true,
        },
      });

      res.json({
        message: `User ${isAdmin ? 'granted' : 'revoked'} admin access successfully`,
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

