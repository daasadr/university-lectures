import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      select: {
        id: true,
        shortName: true,
        name: true,
      },
      orderBy: { shortName: 'asc' },
    });

    const faculties = await prisma.faculty.findMany({
      select: {
        id: true,
        shortName: true,
        name: true,
        universityId: true,
      },
      orderBy: [
        { universityId: 'asc' },
        { shortName: 'asc' },
      ],
    });

    return NextResponse.json({
      universities,
      faculties,
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
     // Return empty arrays instead of error
     return NextResponse.json({
      universities: [],
      faculties: [],
    });
  }
}