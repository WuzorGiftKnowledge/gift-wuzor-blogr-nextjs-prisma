import { getServerSession } from 'next-auth/next';
import { options } from '../pages/api/auth/[...nextauth]';
import { prisma } from './prisma';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Check if the current user is an admin
 * @param req - Next.js API request
 * @param res - Next.js API response
 * @returns The user object if admin, null otherwise
 */
export async function checkAdminAccess(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ id: number; email: string; name: string | null } | null> {
  const session = await getServerSession(req, res, options);

  if (!session || !session.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, name: true, isAdmin: true },
  });

  if (!user || !user.isAdmin) {
    return null;
  }

  return { id: user.id, email: user.email, name: user.name };
}

