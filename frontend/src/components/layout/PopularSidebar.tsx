'use client';

import Link from 'next/link';
import { formatStrapiDate } from '@/lib/api';
import type { Berita } from '@/types';

interface PopularSidebarProps {
  data: Berita[];
}

export function PopularSidebar({ data }: PopularSidebarProps) {
  return (
    <aside className="bg-gray-50 border rounded-xl p-4 space-y-4">
      <h3 className="font-semibold text-lg text-primary-700 border-b pb-2">
        📈 Berita Populer
      </h3>
      
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada berita populer.</p>
      ) : (
        <div className="space-y-3">
          {data.slice(0, 5).map((item) => (
            <Link 
              key={item.id} 
              href={`/berita/${item.attributes?.slug || item.id}`} 
              className="block group"
            >
              <div className="p-3 rounded-lg hover:bg-white transition-colors duration-200">
                <h4 className="text-sm font-medium group-hover:text-primary-600 transition line-clamp-2 mb-1">
                  {item.attributes?.title || 'No Title'}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{item.attributes?.author || 'Unknown'}</span>
                  <span>{formatStrapiDate(item.attributes?.published || '')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
