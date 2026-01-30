'use client';

interface Lecture {
  id: number;
  course: {
    code: string;
    name: string;
  };
  type: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: {
    number: string;
  };
  teacher?: {
    firstName: string;
    lastName: string;
  };
}

interface WeekCalendarProps {
  lectures: Lecture[];
}

export function WeekCalendar({ lectures }: WeekCalendarProps) {
  const days = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek'];
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 - 20:00

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LECTURE':
        return 'bg-blue-500';
      case 'EXERCISE':
        return 'bg-green-500';
      case 'SEMINAR':
        return 'bg-purple-500';
      case 'LAB':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const timeToPixels = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = (hours - 7) * 60 + minutes;
    return (totalMinutes / 60) * 80; // 80px per hour
  };

  const getDuration = (start: string, end: string) => {
    const startMinutes = timeToPixels(start);
    const endMinutes = timeToPixels(end);
    return endMinutes - startMinutes;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Legend */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span>Přednáška</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span>Cvičení</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-purple-500"></div>
            <span>Seminář</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span>Laboratoř</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header */}
          <div className="flex border-b">
            <div className="w-20 flex-shrink-0 border-r bg-gray-50"></div>
            {days.map((day, index) => (
              <div
                key={day}
                className="flex-1 min-w-[150px] p-3 text-center font-semibold border-r last:border-r-0 bg-gray-50"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="relative">
            {/* Time labels */}
            <div className="absolute left-0 top-0 w-20 h-full">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-20 border-b text-xs text-gray-500 pr-2 text-right pt-1"
                >
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Day columns */}
            <div className="ml-20 flex">
              {days.map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="flex-1 min-w-[150px] border-r last:border-r-0 relative"
                  style={{ height: `${hours.length * 80}px` }}
                >
                  {/* Hour lines */}
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="absolute w-full h-20 border-b"
                      style={{ top: `${(hour - 7) * 80}px` }}
                    ></div>
                  ))}

                  {/* Lectures */}
                  {lectures
                    .filter((lecture) => lecture.dayOfWeek === dayIndex + 1)
                    .map((lecture) => {
                      const top = timeToPixels(lecture.startTime);
                      const height = getDuration(lecture.startTime, lecture.endTime);

                      return (
                        <div
                          key={lecture.id}
                          className={`absolute left-1 right-1 ${getTypeColor(
                            lecture.type
                          )} text-white rounded p-2 text-xs overflow-hidden hover:z-10 hover:shadow-lg transition cursor-pointer`}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                          }}
                        >
                          <div className="font-semibold truncate">
                            {lecture.course.code}
                          </div>
                          <div className="truncate text-xs opacity-90">
                            {lecture.course.name}
                          </div>
                          {lecture.room && (
                            <div className="text-xs opacity-75 mt-1">
                              {lecture.room.number}
                            </div>
                          )}
                          {lecture.teacher && (
                            <div className="text-xs opacity-75 truncate">
                              {lecture.teacher.lastName}
                            </div>
                          )}
                          <div className="text-xs opacity-75 mt-1">
                            {lecture.startTime} - {lecture.endTime}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
