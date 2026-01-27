'use client';

import { useState, useEffect } from 'react';
import { LectureCard } from '@/components/LectureCard';
import { FilterPanel } from '@/components/FilterPanel';

export default function SearchPage() {
  const [filters, setFilters] = useState({
    university: '',
    faculty: '',
    day: '',
    time: '',
    subject: '',
    tags: []
  });
  
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    searchLectures();
  }, [filters]);
  
  async function searchLectures() {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const res = await fetch(`/api/lectures/search?${params}`);
    const data = await res.json();
    setLectures(data.lectures);
    setLoading(false);
  }
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Najdi svou přednášku
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <FilterPanel 
            filters={filters} 
            onChange={setFilters} 
          />
        </aside>
        
        <main className="lg:col-span-3">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-4">
              {lectures.map(lecture => (
                <LectureCard 
                  key={lecture.id} 
                  lecture={lecture}
                  onAddToSchedule={handleAddToSchedule}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}