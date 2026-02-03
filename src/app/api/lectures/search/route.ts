import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const university = searchParams.get('university');
    const faculty = searchParams.get('faculty');
    const day = searchParams.get('day');
    const type = searchParams.get('type');
    const timeOfDay = searchParams.get('timeOfDay');
    const minCredits = searchParams.get('minCredits');
    const maxCredits = searchParams.get('maxCredits');

    const where: any = {};

    if (query && query.trim()) {
      where.course = {
        ...where.course,
        name: {
          contains: query,
          mode: 'insensitive'
        }
      };
    }

    if (university) {
      where.course = {
        ...where.course,
        faculty: {
          ...where.course?.faculty,
          universityId: parseInt(university)
        }
      };
    }

    if (faculty) {
      where.course = {
        ...where.course,
        facultyId: parseInt(faculty)
      };
    }

    if (day) {
      where.dayOfWeek = parseInt(day);
    }

    if (type) {
      where.type = type;
    }

    if (timeOfDay) {
      const timeRanges: Record<string, [string, string]> = {
        morning: ['08:00', '12:00'],
        afternoon: ['12:00', '18:00'],
        evening: ['18:00', '22:00'],
      };

      if (timeRanges[timeOfDay]) {
        where.startTime = {
          gte: timeRanges[timeOfDay][0],
          lt: timeRanges[timeOfDay][1],
        };
      }
    }

    if (minCredits || maxCredits) {
      where.course = {
        ...where.course,
        credits: {
          ...(minCredits ? { gte: parseInt(minCredits) } : {}),
          ...(maxCredits ? { lte: parseInt(maxCredits) } : {}),
        }
      };
    }

    const lectures = await prisma.lecture.findMany({
      where,
      include: {
        course: {
          include: {
            faculty: {
              include: {
                university: true,
              }
            }
          }
        },
        room: {
          include: {
            building: true,
          },
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
      take: 500,
    });

    return NextResponse.json({ 
      lectures,
      total: lectures.length 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}