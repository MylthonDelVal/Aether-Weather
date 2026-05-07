import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '../store/weatherStore';
import { useDebounce } from '../hooks/useDebounce';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const { suggestions, fetchSuggestions, fetchByCity, fetchByCoords, clearSuggestions } = useWeatherStore();
  const debouncedQuery = useDebounce(query, 400);
  const containerRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery.trim()) fetchSuggestions(debouncedQuery);
    else clearSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        clearSuggestions();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (item) => {
    fetchByCoords(item.lat, item.lon);
    setQuery('');
    clearSuggestions();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchByCity(query.trim());
      setQuery('');
      clearSuggestions();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[520px] mx-auto mb-6">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search icon */}
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ciudad..."
            className="w-full glass-card pl-12 pr-5 py-4 rounded-2xl text-sm text-white placeholder-white/25 outline-none focus:border-white/20 transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>
      </form>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full glass-card rounded-2xl overflow-hidden z-50"
          >
            {suggestions.map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-5 py-3 text-sm hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  <svg className="w-3.5 h-3.5 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/90">{item.name}</span>
                  <span className="text-white/35 ml-auto">{item.state ? `${item.state}, ` : ''}{item.country}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
