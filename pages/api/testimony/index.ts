import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

// POST /api/testimony
// Public endpoint for submitting testimonies
// Required fields in body: testimony
// Optional fields in body: name, email
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  const { testimony, name, email } = req.body;

  // Validate required fields
  if (!testimony || typeof testimony !== 'string' || testimony.trim().length === 0) {
    res.status(400).json({ message: 'Testimony is required' });
    return;
  }

  try {
    const result = await prisma.testimony.create({
      data: {
        testimony: testimony.trim(),
        name: name ? name.trim() : null,
        email: email ? email.trim() : null,
      },
    });

    res.status(201).json({
      message: 'Testimony submitted successfully',
      id: result.id,
    });
  } catch (error) {
    console.error('Error creating testimony:', error);
    res.status(500).json({ error: 'Error submitting testimony' });
  }
}

