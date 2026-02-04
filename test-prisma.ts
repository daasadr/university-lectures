import { prisma } from './src/lib/prisma';

async function test() {
  try {
    const count = await prisma.university.count();
    console.log('✅ Works! Universities:', count);
  } catch (error: any) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();