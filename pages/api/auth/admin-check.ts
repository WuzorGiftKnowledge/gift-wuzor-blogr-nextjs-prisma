import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { options } from './[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const session = await getServerSession(req, res, options);

  if (!session || !session.user?.email) {
    return res.json({ isAdmin: false });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    res.json({ isAdmin: user?.isAdmin || false });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.json({ isAdmin: false });
  }
}

