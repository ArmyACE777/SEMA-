'use client'
import { ContentCard } from '@/components/ui/Card'
import { generateContentExcerpt, getStrapiMediaUrl, formatStrapiDate } from '@/lib/api'

export function NewsGrid({ data }: { data: any[] }) {
  return (
    <section className="mt-12 space-y-6">
      <h2 className="text-3xl font-bold border-l-4 border-primary-600 pl-3 text-gray-900">Berita Terbaru</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((berita) => (
          <ContentCard
            key={berita.id}
            title={berita.title}
            excerpt={generateContentExcerpt(berita.content)}
            image={getStrapiMediaUrl(berita.gambar)}
            author={berita.author}
            date={formatStrapiDate(berita.publishedAt)}
            category={berita.category || 'Umum'}
          />
        ))}
      </div>
    </section>
  )
}
