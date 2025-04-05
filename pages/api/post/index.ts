import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma'; // Import prisma instance

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  const { title, content } = req.body;
  const session = await getServerSession(req, res, options);
  console.log("Session:", session);

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: session?.user?.email } },
      },
    });
    res.json(result);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: 'Error creating post' });
  }
}