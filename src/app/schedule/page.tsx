'use client';

import { useState } from 'react';
import { WeekCalendar } from '../../components/schedule/WeekCalendar';
import { Calendar, Download, Share2, Settings, Plus, List, Grid } from 'lucide-react';
import Link from 'next/link';

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [lectures, setLectures] = useState<any[]>([]);

  // Mock data - TODO: Replace with API call
  const scheduleName = 'Můj rozvrh - Zimní semestr 2026';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {scheduleName}
              </h1>
              <p className="text-gray-600">
                {lectures.length} {lectures.length === 1 ? 'přednáška' : 'přednášek'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/search"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Přidat přednášku</span>
              </Link>
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                <Share2 className="h-4 w-4" />
                <span>Sdílet</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 bg-white border rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Kalendář</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
              <span>Seznam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-8">
        {lectures.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Váš rozvrh je prázdný
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Začněte přidávat přednášky do svého rozvrhu a mějte přehled o všech
              svých aktivitách na jednom místě
            </p>
            <Link
              href="/search"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Najít přednášky</span>
            </Link>
          </div>
        ) : viewMode === 'calendar' ? (
          /* Calendar View */
          <WeekCalendar lectures={lectures} />
        ) : (
          /* List View */
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Všechny přednášky</h3>
              <div className="space-y-4">
                {lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{lecture.course.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {lecture.course.code} • {lecture.type}
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-700 px-4 py-2">
                      Odebrat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {lectures.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {lectures.length}
              </div>
              <div className="text-gray-600">Celkem přednášek</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                5
              </div>
              <div className="text-gray-600">Dní v týdnu</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                3
              </div>
              <div className="text-gray-600">Fakulty</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
