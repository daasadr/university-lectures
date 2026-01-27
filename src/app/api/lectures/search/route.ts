export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      university: searchParams.get('university'),
      faculty: searchParams.get('faculty'),
      department: searchParams.get('department'),
      dayOfWeek: searchParams.get('day'),
      startTime: searchParams.get('time'),
      subject: searchParams.get('subject'),
      tags: searchParams.getAll('tag'),
    };
    
    const lectures = await prisma.lecture.findMany({
      where: {
        AND: [
          filters.dayOfWeek ? { dayOfWeek: parseInt(filters.dayOfWeek) } : {},
          filters.startTime ? { startTime: { gte: filters.startTime } } : {},
          filters.subject ? {
            course: {
              OR: [
                { name: { contains: filters.subject, mode: 'insensitive' } },
                { code: { contains: filters.subject, mode: 'insensitive' } }
              ]
            }
          } : {},
        ]
      },
      include: {
        course: {
          include: {
            faculty: {
              include: { university: true }
            },
            department: true,
            tags: { include: { tag: true } }
          }
        },
        room: {
          include: { building: true }
        },
        teacher: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });
    
    return Response.json({ lectures });
  }
  
  // app/api/schedules/[userId]/route.ts
  
  export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
  ) {
    const schedule = await prisma.schedule.findFirst({
      where: {
        userId: params.userId,
        isActive: true
      },
      include: {
        attendances: {
          include: {
            lecture: {
              include: {
                course: true,
                room: { include: { building: true } },
                teacher: true
              }
            }
          }
        }
      }
    });
    
    return Response.json({ schedule });
  }