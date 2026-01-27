'use client';

import { useMemo } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { cs } from 'date-fns/locale';

export function WeekCalendar({ attendances }) {
  const weekStart = startOfWeek(new Date(), { locale: cs, weekStartsOn: 1 });
  const days = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 - 20:00
  
  // Skupina přednášek podle dne
  const lecturesByDay = useMemo(() => {
    return attendances.reduce((acc, att) => {
      const day = att.lecture.dayOfWeek;
      if (!acc[day]) acc[day] = [];
      acc[day].push(att.lecture);
      return acc;
    }, {});
  }, [attendances]);
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-20 border p-2">Čas</th>
            {days.map(day => (
              <th key={day.toString()} className="border p-2">
                {format(day, 'EEEE d.M.', { locale: cs })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map(hour => (
            <tr key={hour} className="h-20">
              <td className="border p-2 text-sm text-gray-600">
                {hour}:00
              </td>
              {days.map((day, dayIndex) => {
                const dayNum = (dayIndex + 1) % 7; // pondělí = 1
                const lectures = lecturesByDay[dayNum]?.filter(
                  l => parseInt(l.startTime.split(':')[0]) === hour
                );
                
                return (
                  <td key={day.toString()} className="border p-1 align-top">
                    {lectures?.map(lecture => (
                      <LectureBlock key={lecture.id} lecture={lecture} />
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