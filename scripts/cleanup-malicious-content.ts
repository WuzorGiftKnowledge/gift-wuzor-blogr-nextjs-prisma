import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script to find and remove malicious content from the database
 * Run this to clean up posts, testimonies, or prayer points with harmful content
 */

async function cleanupMaliciousContent() {
  try {
    console.log('🔍 Scanning for malicious content...\n');

    // Find posts with suspicious patterns
    const suspiciousPosts = await prisma.post.findMany({
      where: {
        OR: [
          { content: { contains: '<script' } },
          { content: { contains: 'javascript:' } },
          { content: { contains: 'onclick=' } },
          { content: { contains: 'onerror=' } },
          { content: { contains: '<iframe' } },
          { content: { contains: 'data:text/html' } },
          { title: { contains: '<script' } },
        ],
      },
    });

    console.log(`Found ${suspiciousPosts.length} suspicious posts:`);
    suspiciousPosts.forEach((post) => {
      console.log(`  - Post ID: ${post.id}, Title: ${post.title}`);
      console.log(`    Content preview: ${post.content?.substring(0, 100)}...`);
    });

    // Find testimonies with suspicious patterns
    const suspiciousTestimonies = await prisma.testimony.findMany({
      where: {
        OR: [
          { testimony: { contains: '<script' } },
          { testimony: { contains: 'javascript:' } },
          { testimony: { contains: 'onclick=' } },
          { testimony: { contains: 'onerror=' } },
          { testimony: { contains: '<iframe' } },
          { testimony: { contains: 'data:text/html' } },
        ],
      },
    });

    console.log(`\nFound ${suspiciousTestimonies.length} suspicious testimonies:`);
    suspiciousTestimonies.forEach((testimony) => {
      console.log(`  - Testimony ID: ${testimony.id}, Name: ${testimony.name}`);
      console.log(`    Content preview: ${testimony.testimony.substring(0, 100)}...`);
    });

    // Find prayer points with suspicious patterns
    const suspiciousPrayerPoints = await prisma.prayerPoint.findMany({
      where: {
        OR: [
          { prayerPoint: { contains: '<script' } },
          { prayerPoint: { contains: 'javascript:' } },
          { prayerPoint: { contains: 'onclick=' } },
          { prayerPoint: { contains: 'onerror=' } },
          { prayerPoint: { contains: '<iframe' } },
          { prayerPoint: { contains: 'data:text/html' } },
        ],
      },
    });

    console.log(`\nFound ${suspiciousPrayerPoints.length} suspicious prayer points:`);
    suspiciousPrayerPoints.forEach((pp) => {
      console.log(`  - Prayer Point ID: ${pp.id}, Name: ${pp.name}`);
      console.log(`    Content preview: ${pp.prayerPoint.substring(0, 100)}...`);
    });

    // Ask for confirmation before deletion
    const totalSuspicious = suspiciousPosts.length + suspiciousTestimonies.length + suspiciousPrayerPoints.length;
    
    if (totalSuspicious === 0) {
      console.log('\n✅ No suspicious content found!');
      return;
    }

    console.log(`\n⚠️  Total suspicious items: ${totalSuspicious}`);
    console.log('\nTo delete these items, uncomment the deletion code below and run again.');
    console.log('Or manually review and delete them through the admin interface.\n');

    // Uncomment to delete suspicious posts
    // if (suspiciousPosts.length > 0) {
    //   await prisma.post.deleteMany({
    //     where: {
    //       id: { in: suspiciousPosts.map(p => p.id) },
    //     },
    //   });
    //   console.log(`✅ Deleted ${suspiciousPosts.length} suspicious posts`);
    // }

    // Uncomment to delete suspicious testimonies
    // if (suspiciousTestimonies.length > 0) {
    //   await prisma.testimony.deleteMany({
    //     where: {
    //       id: { in: suspiciousTestimonies.map(t => t.id) },
    //     },
    //   });
    //   console.log(`✅ Deleted ${suspiciousTestimonies.length} suspicious testimonies`);
    // }

    // Uncomment to delete suspicious prayer points
    // if (suspiciousPrayerPoints.length > 0) {
    //   await prisma.prayerPoint.deleteMany({
    //     where: {
    //       id: { in: suspiciousPrayerPoints.map(pp => pp.id) },
    //     },
    //   });
    //   console.log(`✅ Deleted ${suspiciousPrayerPoints.length} suspicious prayer points`);
    // }

  } catch (error) {
    console.error('❌ Error cleaning up content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupMaliciousContent();

