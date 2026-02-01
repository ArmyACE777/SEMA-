'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'
import type { BlocksContent } from '@strapi/blocks-react-renderer'
import { getPengumumanBySlug } from '@/lib/api'
import type { Pengumuman } from '@/types/pengumuman'

interface PengumumanDetailPageProps {
  params: {
    slug: string
  }
}

export default function PengumumanDetailPage({
  params,
}: PengumumanDetailPageProps) {
  const { slug } = params
  const [pengumuman, setPengumuman] = useState<Pengumuman | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await getPengumumanBySlug(slug)

        // ✅ TYPE NARROWING: Extract item dari response
        let pengumumanItem: Pengumuman | null = null
        if (res?.data) {
          pengumumanItem = Array.isArray(res.data) ? res.data[0] : res.data
        }

        // ✅ DEBUG: Log untuk lihat struktur
        console.log('🔍 Response pengumuman:', res)
        console.log('📊 Content:', pengumumanItem?.content)
        console.log('🔎 Content type:', typeof pengumumanItem?.content)
        console.log('📋 Is array:', Array.isArray(pengumumanItem?.content))

        if (!pengumumanItem) {
          setError('Pengumuman tidak ditemukan')
          return
        }

        setPengumuman(pengumumanItem)
      } catch (err) {
        console.error('Error fetching pengumuman:', err)
        setError('Gagal memuat pengumuman')
      } finally {
        setLoading(false)
      }
    }

    fetchPengumuman()
  }, [slug])

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    })
  }

  const getPriorityColor = () => {
    switch (pengumuman?.priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800'
      case 'Rutin':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // ✅ TYPE GUARD dengan BlocksContent
  const isValidBlocksContent = (content: any): content is BlocksContent => {
    if (!content) return false
    if (typeof content === 'string') return false
    if (!Array.isArray(content)) return false
    if (content.length === 0) return false
    return content.every((block: any) => block && typeof block === 'object' && block.type)
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </main>
    )
  }

  if (error || !pengumuman) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10 text-center">
        <div className="mb-6">
          <p className="text-red-600 mb-4">{error || 'Pengumuman tidak ditemukan'}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Kembali ke Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Kembali ke Home
      </Link>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {pengumuman.title}
      </h1>

      <div className="mb-8 pb-6 border-b border-gray-200 space-y-2 text-sm text-gray-600">
        {pengumuman.publishedAt && (
          <p>
            <span className="font-semibold">Diposting:</span> {formatDate(pengumuman.publishedAt)}
          </p>
        )}

        {pengumuman.startDate && (
          <p>
            <span className="font-semibold">Tanggal Acara:</span> {formatDate(pengumuman.startDate)}
            {pengumuman.endDate && ` s/d ${formatDate(pengumuman.endDate)}`}
          </p>
        )}

        {pengumuman.priority && (
          <p>
            <span className="font-semibold">Prioritas:</span>{' '}
            <span className={`px-3 py-1 rounded text-xs font-medium ${getPriorityColor()}`}>
              {pengumuman.priority}
            </span>
          </p>
        )}
      </div>

      {/* ✅ MAIN CONTENT - Render BlocksRenderer atau fallback */}
      {isValidBlocksContent(pengumuman.content) ? (
        <article className="prose prose-lg max-w-none prose-headings:scroll-mt-20 mb-10">
          <BlocksRenderer content={pengumuman.content} />
        </article>
      ) : pengumuman.content ? (
        <div className="mb-10 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ Format konten tidak didukung untuk di-render. Debug info:
          </p>
          <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(pengumuman.content, null, 2).slice(0, 300)}...
          </pre>
        </div>
      ) : (
        <p className="text-gray-500 italic mb-10">Tidak ada konten untuk pengumuman ini.</p>
      )}

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Kembali ke Home
        </Link>
      </div>
    </main>
  )
}