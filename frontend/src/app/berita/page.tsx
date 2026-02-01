'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getBeritaListPaginated, generateContentExcerpt, formatStrapiDate } from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Pagination } from '@/components/ui/Pagination'
import { Badge } from '@/components/ui/Badge'
import CardSkeleton from '@/components/ui/Loading'
import { Calendar, User, Search, ChevronRight, ArrowRight, Zap } from 'lucide-react'

interface StrapiItem {
  id: number
  title?: string
  content?: string
  author?: string
  publishedAt?: string
  category?: string
  slug?: string
  gambar?: { attributes?: { url?: string } } | null
}

export default function BeritaPage() {
  const [berita, setBerita] = useState<StrapiItem[]>([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 9, pageCount: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const getImageUrl = (item: StrapiItem): string => {
    const gambar = item.gambar
    if (!gambar) return '/images/placeholder.jpg'
    const url = (gambar as any)?.attributes?.url || (gambar as any)?.url
    if (!url) return '/images/placeholder.jpg'
    if (url.startsWith('http')) return url
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${url}`
  }

  const fetchBerita = useCallback(async (page: number) => {
    setLoading(true)
    try {
      const response = await getBeritaListPaginated({ page, pageSize: 9 })
      setBerita(response?.data || [])
      setPagination(response?.meta?.pagination || { page: 1, pageSize: 9, pageCount: 0, total: 0 })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const filteredBerita = searchQuery.trim() === ''
    ? berita
    : berita.filter(item => {
        const title = String(item.title ?? '').toLowerCase()
        const content = String(item.content ?? '').toLowerCase()
        const category = String(item.category ?? '').toLowerCase()
        const query = searchQuery.toLowerCase()
        
        return (
          title.includes(query) ||
          content.includes(query) ||
          category.includes(query)
        )
      })


  useEffect(() => {
    fetchBerita(1)
  }, [fetchBerita])

  const handlePageChange = (page: number) => {
    fetchBerita(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50">
      {/* ============ HEADER ============ */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-2 transition-colors">
            ← Kembali Beranda
          </Link>
        </div>
      </div>

      {/* ============ HERO SECTION ============ */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6" />
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold backdrop-blur">
                Berita Terbaru
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Berita & Informasi
            </h1>
            <p className="text-xl text-green-100">
              Dapatkan update terbaru dari Senat Mahasiswa IAI Persatuan Islam Garut
            </p>
          </div>
        </div>
      </div>

      {/* ============ SEARCH BAR ============ */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 mb-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={handleSearch}              
              className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all shadow-lg placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* ============ CONTENT ============ */}
      <div className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : berita.length > 0 ? (
          <>
            {/* Stats */}
            <div className="mb-8 flex items-center gap-4 flex-wrap">
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                Total: {filteredBerita.length} berita
                {searchQuery && ` (hasil pencarian: "${searchQuery}")`}

              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                Halaman {pagination.page} dari {pagination.pageCount}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredBerita.map((item, index) => (

                <Link key={item.id} href={`/berita/${item.slug}`}>
                  <Card hover className="overflow-hidden h-full group flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-105">
                    {/* Image Container */}
                    <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                      <Image
                        src={getImageUrl(item)}
                        alt={item.title || 'Berita'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Category Badge */}
                      {item.category && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="success" className="shadow-lg">
                            {item.category}
                          </Badge>
                        </div>
                      )}

                      {/* Index Badge */}
                      <div className="absolute top-3 right-3 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                        {(index % 9) + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-3">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                        {generateContentExcerpt(item.content || '', 100)}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-200 mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate">{item.author || 'Admin'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatStrapiDate(item.publishedAt || '')}</span>
                        </div>
                      </div>

                      {/* Read More Button */}
                      <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-3 transition-all">
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {!searchQuery && pagination.pageCount > 1 && (
            <div className="mt-12">
              <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pageCount}
                  totalItems={pagination.total}
                  pageSize={pagination.pageSize}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-600 text-lg">
                {searchQuery
                  ? `Tidak ada hasil untuk "${searchQuery}"`
                  : 'Belum ada berita tersedia'
                }
              </p>

            </div>
          </div>
        )}
      </div>

      {/* ============ CTA SECTION ============ */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Tertarik Berkontribusi?</h2>
          <p className="text-green-100 mb-8 text-lg">Bagikan berita atau informasi penting Anda bersama kami</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-lg"
          >
            Hubungi Kami
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}