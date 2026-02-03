import { prisma } from './src/lib/prisma';

async function test() {
  try {
    console.log('🔍 Testing Prisma connection...');
    
    const count = await prisma.lecture.count();
    console.log(`✅ Found ${count} lectures in database`);
    
    const sample = await prisma.lecture.findFirst({
      include: {
        course: true,
      }
    });
    console.log('📚 Sample lecture:', sample?.course.name);
    
  } catch (error) {
    console.error('❌ Prisma Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();