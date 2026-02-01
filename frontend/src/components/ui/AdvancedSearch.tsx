'use client';

import React, { useState } from 'react';
import { Search, Filter, X, Calendar, Tag, User } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '@/lib/utils';

interface SearchFilters {
  query: string;
  contentType: 'all' | 'beritas' | 'artikels';
  category: string;
  author: string;
  dateRange: {
    from: string;
    to: string;
  };
  featured: boolean | null;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  loading?: boolean;
  className?: string;
}

export function AdvancedSearch({ 
  onSearch, 
  onReset, 
  loading = false, 
  className 
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    contentType: 'all',
    category: '',
    author: '',
    dateRange: { from: '', to: '' },
    featured: null
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      contentType: 'all',
      category: '',
      author: '',
      dateRange: { from: '', to: '' },
      featured: null
    });
    onReset();
  };

  const updateFilter = (key: keyof SearchFilters, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== '');
    }
    return value !== null && value !== 'all';
  }).length - (filters.query ? 1 : 0);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <label htmlFor="main-search" className="sr-only">
            Search content
          </label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
          <input
            id="main-search"
            type="text"
            placeholder="Search content..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            Enter keywords to search for content. Press Enter to search or use the Search button.
          </div>
          {filters.query && (
            <button
              type="button"
              onClick={() => updateFilter('query', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search query"
              title="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <Button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="outline"
          icon={<Filter className="w-4 h-4" />}
          className="relative"
          aria-expanded={showAdvanced}
          aria-controls="advanced-filters"
          title={showAdvanced ? 'Hide advanced filters' : 'Show advanced filters'}
        >
          Filters
          {activeFiltersCount > 0 && (
            <Badge 
              variant="primary" 
              size="xs" 
              className="absolute -top-2 -right-2 min-w-5 h-5 text-xs"
              aria-label={`${activeFiltersCount} active filters`}
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <Button 
          onClick={handleSearch} 
          loading={loading}
          aria-describedby="search-button-help"
        >
          Search
        </Button>
        <div id="search-button-help" className="sr-only">
          Click to perform search with current filters
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div 
          id="advanced-filters"
          className="bg-gray-50 p-4 rounded-lg space-y-4 border"
          role="region"
          aria-labelledby="advanced-filters-heading"
        >
          <div className="flex items-center justify-between">
            <h3 id="advanced-filters-heading" className="font-medium text-gray-900">
              Advanced Filters
            </h3>
            <Button 
              onClick={handleReset} 
              variant="ghost" 
              size="sm"
              title="Reset all filters to default values"
            >
              Reset All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Content Type Filter */}
            <div className="space-y-2">
              <label htmlFor="content-type-filter" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" aria-hidden="true" />
                Content Type
              </label>
              <select
                id="content-type-filter"
                value={filters.contentType}
                onChange={(e) => updateFilter('contentType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-describedby="content-type-help"
              >
                <option value="all">All Content</option>
                <option value="beritas">Berita Only</option>
                <option value="artikels">Artikel Only</option>
              </select>
              <div id="content-type-help" className="sr-only">
                Filter results by content type: all content, news articles, or regular articles only
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label htmlFor="category-filter" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" aria-hidden="true" />
                Category
              </label>
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-describedby="category-help"
              >
                <option value="">All Categories</option>
                <option value="akademik">Akademik</option>
                <option value="organisasi">Organisasi</option>
                <option value="kemahasiswaan">Kemahasiswaan</option>
                <option value="umum">Umum</option>
              </select>
              <div id="category-help" className="sr-only">
                Filter results by content category
              </div>
            </div>

            {/* Author Filter */}
            <div className="space-y-2">
              <label htmlFor="author-filter" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" aria-hidden="true" />
                Author
              </label>
              <input
                id="author-filter"
                type="text"
                placeholder="Author name..."
                value={filters.author}
                onChange={(e) => updateFilter('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-describedby="author-help"
              />
              <div id="author-help" className="sr-only">
                Filter results by author name. Type partial names for broader search.
              </div>
            </div>

            {/* Date Range From */}
            <div className="space-y-2">
              <label htmlFor="date-from-filter" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Date From
              </label>
              <input
                id="date-from-filter"
                type="date"
                value={filters.dateRange.from}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, from: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-describedby="date-from-help"
              />
              <div id="date-from-help" className="sr-only">
                Filter results published on or after this date
              </div>
            </div>

            {/* Date Range To */}
            <div className="space-y-2">
              <label htmlFor="date-to-filter" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Date To
              </label>
              <input
                id="date-to-filter"
                type="date"
                value={filters.dateRange.to}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-describedby="date-to-help"
              />
              <div id="date-to-help" className="sr-only">
                Filter results published on or before this date
              </div>
            </div>

            {/* Featured Filter */}
            <div className="space-y-2">
              <fieldset>
                <legend className="text-sm font-medium text-gray-700 mb-2">Featured Content</legend>
                <div className="flex gap-2" role="group" aria-describedby="featured-help">
                  <button
                    type="button"
                    onClick={() => updateFilter('featured', null)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition-colors',
                      filters.featured === null 
                        ? 'bg-primary-100 border-primary-300 text-primary-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                    aria-pressed={filters.featured === null}
                    title="Show all content, both featured and regular"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFilter('featured', true)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition-colors',
                      filters.featured === true 
                        ? 'bg-primary-100 border-primary-300 text-primary-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                    aria-pressed={filters.featured === true}
                    title="Show only featured content"
                  >
                    Featured
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFilter('featured', false)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition-colors',
                      filters.featured === false 
                        ? 'bg-primary-100 border-primary-300 text-primary-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                    aria-pressed={filters.featured === false}
                    title="Show only regular, non-featured content"
                  >
                    Regular
                  </button>
                </div>
                <div id="featured-help" className="sr-only">
                  Filter by featured status: all content, only featured content, or only regular content
                </div>
              </fieldset>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="pt-2 border-t">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.contentType !== 'all' && (
                  <Badge variant="primary" size="sm">
                    Type: {filters.contentType}
                    <button 
                      type="button"
                      onClick={() => updateFilter('contentType', 'all')}
                      className="ml-1 hover:text-primary-800"
                      aria-label={`Remove content type filter: ${filters.contentType}`}
                      title="Remove content type filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" size="sm">
                    Category: {filters.category}
                    <button 
                      type="button"
                      onClick={() => updateFilter('category', '')}
                      className="ml-1 hover:text-gray-800"
                      aria-label={`Remove category filter: ${filters.category}`}
                      title="Remove category filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.author && (
                  <Badge variant="info" size="sm">
                    Author: {filters.author}
                    <button 
                      type="button"
                      onClick={() => updateFilter('author', '')}
                      className="ml-1 hover:text-blue-800"
                      aria-label={`Remove author filter: ${filters.author}`}
                      title="Remove author filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.featured !== null && (
                  <Badge variant="success" size="sm">
                    {filters.featured ? 'Featured' : 'Regular'} Only
                    <button 
                      type="button"
                      onClick={() => updateFilter('featured', null)}
                      className="ml-1 hover:text-green-800"
                      aria-label={`Remove featured filter: ${filters.featured ? 'Featured' : 'Regular'} only`}
                      title="Remove featured content filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export type { SearchFilters };
