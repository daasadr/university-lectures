'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { LectureCard } from '@/components/search/LectureCard';
import { Loader2 } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [lectures, setLectures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsLoading(true);
    
    // TODO: Call API
    // const response = await fetch(`/api/lectures/search?q=${searchQuery}`);
    // const data = await response.json();
    // setLectures(data.lectures);
    
    // Mock data for now
    setTimeout(() => {
      setLectures([]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // TODO: Apply filters and search
  };

  const handleAddToSchedule = async (lectureId: number) => {
    // TODO: Call API to add to schedule
    console.log('Adding lecture to schedule:', lectureId);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Vyhledávání přednášek
          </h1>
          <p className="text-blue-100 mb-8 max-w-2xl">
            Najděte přednášky podle předmětu, oboru, univerzity nebo vyučujícího
          </p>
          <SearchBar onSearch={handleSearch} initialQuery={query} />
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Výsledky vyhledávání</h2>
                {lectures.length > 0 && (
                  <p className="text-gray-600 mt-1">
                    Nalezeno {lectures.length} přednášek
                  </p>
                )}
              </div>
              <select className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                <option>Seřadit podle relevance</option>
                <option>Seřadit podle času</option>
                <option>Seřadit podle názvu</option>
              </select>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {/* No Results */}
            {!isLoading && lectures.length === 0 && query && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 mb-4">
                  Nenalezeny žádné přednášky
                </p>
                <p className="text-gray-500">
                  Zkuste změnit hledaný výraz nebo upravit filtry
                </p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && lectures.length === 0 && !query && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 mb-4">
                  Začněte vyhledáváním
                </p>
                <p className="text-gray-500">
                  Zadejte předmět, obor nebo klíčové slovo
                </p>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && lectures.length > 0 && (
              <div className="grid gap-4">
                {lectures.map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    lecture={lecture}
                    onAddToSchedule={handleAddToSchedule}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {lectures.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex space-x-2">
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    Předchozí
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    1
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    Další
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
