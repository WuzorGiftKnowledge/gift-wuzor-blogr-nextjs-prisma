import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

// POST /api/prayer-point
// Public endpoint for submitting prayer points
// Required fields in body: prayerPoint
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

  const { prayerPoint, name, email } = req.body;

  // Validate required fields
  if (!prayerPoint || typeof prayerPoint !== 'string' || prayerPoint.trim().length === 0) {
    res.status(400).json({ message: 'Prayer point is required' });
    return;
  }

  try {
    const result = await prisma.prayerPoint.create({
      data: {
        prayerPoint: prayerPoint.trim(),
        name: name ? name.trim() : null,
        email: email ? email.trim() : null,
      },
    });

    res.status(201).json({
      message: 'Prayer point submitted successfully',
      id: result.id,
    });
  } catch (error) {
    console.error('Error creating prayer point:', error);
    res.status(500).json({ error: 'Error submitting prayer point' });
  }
}

