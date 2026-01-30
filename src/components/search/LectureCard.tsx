'use client';

import { useState } from 'react';
import { MapPin, User, Clock, BookOpen, Plus, Check } from 'lucide-react';
import Link from 'next/link';

interface LectureCardProps {
  lecture: {
    id: number;
    course: {
      code: string;
      name: string;
      credits: number;
    };
    type: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: {
      number: string;
      building: {
        name: string;
      };
    };
    teacher?: {
      firstName: string;
      lastName: string;
      title?: string;
    };
  };
  onAddToSchedule?: (id: number) => void;
}

export function LectureCard({ lecture, onAddToSchedule }: LectureCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = async () => {
    if (!onAddToSchedule) return;
    
    setIsAdding(true);
    await onAddToSchedule(lecture.id);
    setIsAdding(false);
    setIsAdded(true);
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LECTURE':
        return 'bg-blue-100 text-blue-700';
      case 'EXERCISE':
        return 'bg-green-100 text-green-700';
      case 'SEMINAR':
        return 'bg-purple-100 text-purple-700';
      case 'LAB':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'LECTURE': return 'Přednáška';
      case 'EXERCISE': return 'Cvičení';
      case 'SEMINAR': return 'Seminář';
      case 'LAB': return 'Laboratoř';
      default: return type;
    }
  };

  const getDayName = (day: number) => {
    const days = ['', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek'];
    return days[day] || '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-mono text-gray-500">
              {lecture.course.code}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(lecture.type)}`}>
              {getTypeName(lecture.type)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {lecture.course.name}
          </h3>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>{lecture.course.credits} kreditů</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {/* Time */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            {getDayName(lecture.dayOfWeek)} {lecture.startTime} - {lecture.endTime}
          </span>
        </div>

        {/* Location */}
        {lecture.room && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              {lecture.room.building.name}, místnost {lecture.room.number}
            </span>
          </div>
        )}

        {/* Teacher */}
        {lecture.teacher && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>
              {lecture.teacher.title && `${lecture.teacher.title} `}
              {lecture.teacher.firstName} {lecture.teacher.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleAdd}
          disabled={isAdding || isAdded}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition ${
            isAdded
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Přidáno</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>{isAdding ? 'Přidávám...' : 'Přidat do rozvrhu'}</span>
            </>
          )}
        </button>
        <Link
          href={`/lectures/${lecture.id}`}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
        >
          Více info
        </Link>
      </div>
    </div>
  );
}
