'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const quickFilters = [
    'Informatika',
    'Filosofie',
    'Matematika',
    'Psychologie',
    'Historie',
    'Právo',
  ];

  return (
    <div className="w-full">
      {/* Main Search */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat přednášky, předměty, vyučující..."
            className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {/* Quick Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 py-2">Rychlé filtry:</span>
        {quickFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setQuery(filter);
              onSearch(filter);
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full transition"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
