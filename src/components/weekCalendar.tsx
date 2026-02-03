import { useMemo } from 'react';
import { startOfWeek, addDays, parseISO } from 'date-fns';
import { cs } from 'date-fns/locale';

interface Lecture {
  id: number;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  course?: {
    name: string;
    code: string;
  };
  room?: {
    number: string;
  };
}

interface Attendance {
  lecture: Lecture;
  dayOfWeek: number;
}

interface WeekCalendarProps {
  attendances: Attendance[];
}

export function WeekCalendar({ attendances }: WeekCalendarProps) {
  const weekStart = startOfWeek(new Date(), { locale: cs, weekStartsOn: 1 });
  const days = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 - 20:00

  const lecturesByDay = useMemo(() => {
    return attendances.reduce((acc: Record<number, Attendance[]>, att) => {
      const day = att.lecture.dayOfWeek;
      if (!acc[day]) acc[day] = [];
      acc[day].push(att);
      return acc;
    }, {});
  }, [attendances]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100">Čas</th>
            {days.map((day, dayIndex) => (
              <td key={dayIndex} className="border p-2 text-sm text-gray-600">
                {day.toLocaleDateString('cs-CZ', { weekday: 'short', day: 'numeric' })}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour} className="h-20">
              <td className="border p-2 text-sm text-gray-600">
                {hour}:00
              </td>
              {days.map((day, dayIndex) => {
                const dayNum = (dayIndex + 1) % 7; // Monday = 1
                const lectures = lecturesByDay[dayNum] || [];
                const hourLectures = lectures.filter((l) => {
                  const startHour = parseInt(l.lecture.startTime.split(':')[0]);
                  return startHour === hour;
                });

                return (
                  <td key={day.toString()} className="border p-1 align-top">
                    {hourLectures?.map((lecture) => (
                      <div key={lecture.lecture.id} className="text-xs bg-blue-100 p-1 mb-1 rounded">
                        <div className="font-semibold">{lecture.lecture.course?.code}</div>
                        <div>{lecture.lecture.startTime} - {lecture.lecture.endTime}</div>
                        {lecture.lecture.room && <div>Místnost: {lecture.lecture.room.number}</div>}
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
