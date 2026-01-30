'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: any) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    university: true,
    time: false,
    type: false,
    tags: false,
  });

  const [filters, setFilters] = useState({
    university: '',
    faculty: '',
    dayOfWeek: '',
    startTime: '',
    type: '',
    tags: [] as string[],
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilter('tags', newTags);
  };

  const clearFilters = () => {
    const emptyFilters = {
      university: '',
      faculty: '',
      dayOfWeek: '',
      startTime: '',
      type: '',
      tags: [],
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => 
    Array.isArray(v) ? v.length > 0 : v !== ''
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filtry</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Vymazat vše</span>
          </button>
        )}
      </div>

      {/* University & Faculty */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => toggleSection('university')}
          className="w-full flex items-center justify-between py-2"
        >
          <span className="font-medium">Univerzita a fakulta</span>
          {expandedSections.university ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.university && (
          <div className="space-y-3 mt-3">
            <select
              value={filters.university}
              onChange={(e) => updateFilter('university', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Všechny univerzity</option>
              <option value="uk">Univerzita Karlova</option>
              <option value="cvut">ČVUT</option>
              <option value="muni">Masarykova univerzita</option>
            </select>
            <select
              value={filters.faculty}
              onChange={(e) => updateFilter('faculty', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              disabled={!filters.university}
            >
              <option value="">Všechny fakulty</option>
              <option value="ff">Filozofická fakulta</option>
              <option value="prf">Přírodovědecká fakulta</option>
              <option value="mff">Matematicko-fyzikální fakulta</option>
            </select>
          </div>
        )}
      </div>

      {/* Time */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => toggleSection('time')}
          className="w-full flex items-center justify-between py-2"
        >
          <span className="font-medium">Čas</span>
          {expandedSections.time ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.time && (
          <div className="space-y-3 mt-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Den v týdnu</label>
              <select
                value={filters.dayOfWeek}
                onChange={(e) => updateFilter('dayOfWeek', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Libovolný den</option>
                <option value="1">Pondělí</option>
                <option value="2">Úterý</option>
                <option value="3">Středa</option>
                <option value="4">Čtvrtek</option>
                <option value="5">Pátek</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Začátek</label>
              <select
                value={filters.startTime}
                onChange={(e) => updateFilter('startTime', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Libovolný čas</option>
                <option value="08:00">8:00</option>
                <option value="09:00">9:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Lecture Type */}
      <div className="border-b pb-4 mb-4">
        <button
          onClick={() => toggleSection('type')}
          className="w-full flex items-center justify-between py-2"
        >
          <span className="font-medium">Typ přednášky</span>
          {expandedSections.type ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.type && (
          <div className="space-y-2 mt-3">
            {['LECTURE', 'EXERCISE', 'SEMINAR', 'LAB'].map(type => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={filters.type === type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm">
                  {type === 'LECTURE' && 'Přednáška'}
                  {type === 'EXERCISE' && 'Cvičení'}
                  {type === 'SEMINAR' && 'Seminář'}
                  {type === 'LAB' && 'Laboratoř'}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <button
          onClick={() => toggleSection('tags')}
          className="w-full flex items-center justify-between py-2"
        >
          <span className="font-medium">Témata</span>
          {expandedSections.tags ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.tags && (
          <div className="flex flex-wrap gap-2 mt-3">
            {['AI', 'Programování', 'Historie', 'Filosofie', 'Matematika', 'Fyzika'].map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  filters.tags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
