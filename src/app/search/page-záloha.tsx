'use client';

import { useState } from 'react';

interface Lecture {
  id: number;
  type: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  course: {
    code: string;
    name: string;
    credits: number;
  };
  room?: {
    number: string;
    building: {
      name: string;
    };
  };
}

export default function SearchPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dayOfWeek: '',
    type: '',
  });
  const [displayCount, setDisplayCount] = useState(20);

  const fetchLectures = async (showAll = false) => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const params = new URLSearchParams();
      
      if (!showAll && searchQuery && searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      }
      if (filters.dayOfWeek) {
        params.set('day', filters.dayOfWeek);
      }
      if (filters.type) {
        params.set('type', filters.type);
      }

      const url = `/api/lectures/search${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      setLectures(data.lectures || []);
      setDisplayCount(20); // Reset pagination
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLectures();
  };

  const handleShowAll = () => {
    setSearchQuery('');
    setFilters({ dayOfWeek: '', type: '' });
    fetchLectures(true);
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({ dayOfWeek: '', type: '' });
    setHasSearched(false);
    setLectures([]);
    setDisplayCount(20);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  const getDayName = (day: number) => {
    const days = ['', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek'];
    return days[day] || '';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LECTURE': return 'bg-blue-500 text-white';
      case 'SEMINAR': return 'bg-purple-500 text-white';
      case 'EXERCISE': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'LECTURE': return 'Přednáška';
      case 'SEMINAR': return 'Seminář';
      case 'EXERCISE': return 'Cvičení';
      default: return type;
    }
  };

  const displayedLectures = lectures.slice(0, displayCount);
  const hasMore = displayCount < lectures.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎓 Vyhledávání přednášek
          </h1>
          <p className="text-gray-600">
            Filozofická fakulta UK • {lectures.length} přednášek v databázi
          </p>
        </div>

        {/* SEARCH BAR - Always visible */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            🔍 Hledat předmět
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Např. Archeologie, Historie, Psychologie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳' : '🔍'} Vyhledat
            </button>
          </div>
        </div>

        {/* FILTERS - Show after search or when user wants to filter all */}
        {hasSearched && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                🎯 Filtrovat výsledky
              </h3>
              <button
                onClick={handleReset}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                ✕ Resetovat vše
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Den v týdnu
                </label>
                <select
                  value={filters.dayOfWeek}
                  onChange={(e) => setFilters({...filters, dayOfWeek: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Všechny dny</option>
                  <option value="1">Pondělí</option>
                  <option value="2">Úterý</option>
                  <option value="3">Středa</option>
                  <option value="4">Čtvrtek</option>
                  <option value="5">Pátek</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📚 Typ výuky
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Všechny typy</option>
                  <option value="LECTURE">Přednáška</option>
                  <option value="SEMINAR">Seminář</option>
                  <option value="EXERCISE">Cvičení</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => fetchLectures()}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
            >
              🎯 Aplikovat filtry
            </button>
          </div>
        )}

        {/* INITIAL STATE - No search yet */}
        {!hasSearched && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-7xl mb-6">🎓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Začněte vyhledávat
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Zadejte název předmětu do vyhledávacího pole nebo zobrazte všechny dostupné přednášky
            </p>
            <button
              onClick={handleShowAll}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg"
            >
              📚 Zobrazit všechny přednášky
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Načítám přednášky...</p>
          </div>
        )}

        {/* RESULTS */}
        {hasSearched && !loading && lectures.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-gray-700">
                Zobrazeno <strong className="text-gray-900">{displayedLectures.length}</strong> z <strong className="text-gray-900">{lectures.length}</strong> přednášek
              </div>
            </div>

            <div className="grid gap-4 mb-6">
              {displayedLectures.map((lecture) => (
                <div 
                  key={lecture.id} 
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-blue-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-mono font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                          {lecture.course.code}
                        </span>
                        <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${getTypeColor(lecture.type)}`}>
                          {getTypeLabel(lecture.type)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {lecture.course.name}
                      </h3>
                      <div className="inline-flex items-center gap-1 text-sm text-gray-600 bg-amber-50 px-3 py-1 rounded-lg">
                        <span className="font-semibold text-amber-700">{lecture.course.credits}</span> kreditů
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 border-t-2 border-gray-100 pt-4">
                    <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
                      <span className="text-2xl">📅</span>
                      <div>
                        <div className="text-sm text-gray-600">Termín</div>
                        <div className="font-semibold text-gray-900">
                          {getDayName(lecture.dayOfWeek)} • {lecture.startTime} - {lecture.endTime}
                        </div>
                      </div>
                    </div>
                    
                    {lecture.room && (
                      <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                        <span className="text-2xl">📍</span>
                        <div>
                          <div className="text-sm text-gray-600">Místnost</div>
                          <div className="font-semibold text-gray-900">
                            {lecture.room.building.name} • <span className="text-purple-700">místnost {lecture.room.number}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-4 border-t-2 border-gray-100">
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-md">
                      ➕ Přidat do rozvrhu
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* LOAD MORE */}
            {hasMore && (
              <div className="text-center mb-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors font-semibold shadow-md"
                >
                  ⬇️ Načíst dalších 20 přednášek
                </button>
              </div>
            )}
          </>
        )}

        {/* EMPTY RESULTS */}
        {hasSearched && !loading && lectures.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Žádné výsledky
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Nenašli jsme žádné přednášky odpovídající vašim kritériím
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReset}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                🔄 Nové hledání
              </button>
              <button
                onClick={handleShowAll}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                📚 Zobrazit vše
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}