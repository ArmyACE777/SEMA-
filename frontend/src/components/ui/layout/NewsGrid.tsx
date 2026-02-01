'use client'

import type { Berita } from '@/types'
import { ContentCard } from '@/components/ui/Card'
import { generateContentExcerpt, getStrapiMediaUrl, formatStrapiDate } from '@/lib/api'

interface NewsGridProps {
  data: Berita[]
}

export function NewsGrid({ data }: NewsGridProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold border-l-4 border-secondary-500 pl-3">
        📰 Berita Terbaru
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Belum ada berita untuk ditampilkan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((berita) => (
            <ContentCard
              key={berita.id}
              title={berita.attributes.title || 'No Title'}
              excerpt={generateContentExcerpt(berita.attributes.content)}
              image={getStrapiMediaUrl(berita.attributes.gambar?.data)} 
              author={berita.attributes.author || 'Unknown'}
              date={formatStrapiDate(berita.attributes.published)}
              category={berita.attributes.category || 'Umum'}
              featured={berita.attributes.is_featured || false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
