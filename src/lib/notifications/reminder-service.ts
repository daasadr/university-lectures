import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { addHours, isBefore } from 'date-fns';

export async function sendLectureReminders() {
  const now = new Date();
  const tomorrow = addHours(now, 24);
  
  // Najdi všechny attendances s přednáškami v příštích 24h
  const upcomingAttendances = await prisma.attendance.findMany({
    where: {
      lecture: {
        // Logika pro zjištění, zda je přednáška zítra
        // (složitější kvůli day of week pattern)
      },
      user: {
        preferences: {
          emailNotifications: true
        }
      }
    },
    include: {
      user: { include: { preferences: true } },
      lecture: {
        include: {
          course: true,
          room: { include: { building: true } }
        }
      }
    }
  });
  
  for (const attendance of upcomingAttendances) {
    const reminderHours = attendance.user.preferences?.reminderHours || 24;
    const lectureTime = calculateNextOccurrence(attendance.lecture);
    
    if (isBefore(lectureTime, addHours(now, reminderHours))) {
      await sendEmail({
        to: attendance.user.email,
        subject: `Připomínka: ${attendance.lecture.course.name}`,
        html: renderReminderEmail(attendance)
      });
      
      await prisma.notification.create({
        data: {
          userId: attendance.user.id,
          type: 'lecture_reminder',
          title: `Připomínka přednášky`,
          message: `${attendance.lecture.course.name} začíná zítra v ${attendance.lecture.startTime}`,
          metadata: { lectureId: attendance.lecture.id }
        }
      });
    }
  }
}

// Spouštěj toto každý den pomocí cron job (Vercel Cron neboNode-cron)