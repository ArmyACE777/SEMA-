import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  placeholder = "Cari...",
  onSearch,
  defaultValue = "",
  className,
  debounceMs = 300,
}: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Di searchContent function, cek query parameter
  // const endpoint = `/${type}?filters[title][$containsi]=${encodeURIComponent(query)}&populate=gambar&pagination[pageSize]=10`;


  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onSearch(searchQuery);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }

  function handleClear() {
    setQuery("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearch("");
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
