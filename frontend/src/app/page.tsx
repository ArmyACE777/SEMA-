'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  getFeaturedBerita,
  getBeritaListPaginated,
  getGaleriList,
  getFeaturedPengumuman,
  generateContentExcerpt,
  formatStrapiDate
} from '@/lib/api'
import { Card } from '@/components/ui/Card'
import { Pagination } from '@/components/ui/Pagination'
import { Badge } from '@/components/ui/Badge'
import CardSkeleton from '@/components/ui/Loading'
import { Calendar, User, Search, Clock, Bell, AlertCircle } from 'lucide-react'
import PengumumanModal from '@/components/PengumumanModal'
import { OrganisasiSidebar } from '@/components/ui/layout/OrganisasiSidebar'
import { FooterSection } from '@/components/layout/FooterSection'

/**
 * ============ TYPE DEFINITIONS ============
 * EXACT from original - fully tested & working
 */
interface StrapiItem {
  id: number
  title?: string
  content?: string
  author?: string
  publishedAt?: string
  category?: string
  is_featured?: boolean
  slug?: string
  documentId?: string
  gambar?: {
    id?: number
    attributes?: {
      url?: string
      width?: number
      height?: number
      [key: string]: unknown
    }
  } | null
  attributes?: {
    title?: string
    content?: string
    author?: string
    publishedAt?: string
    category?: string
    is_featured?: boolean
    gambar?: {
      id?: number
      attributes?: {
        url?: string
        width?: number
        height?: number
        [key: string]: unknown
      }
    } | null
  }
  priority?: 'Mendesak' | 'Wajib'
  startDate?: string
  endDate?: string
}


export default function HomePage() {
  // ============ STATE - Extended with Pengumuman & Galeri ============
  const [featured, setFeatured] = useState<StrapiItem[]>([])
  const [berita, setBerita] = useState<StrapiItem[]>([])
  const [pengumuman, setPengumuman] = useState<StrapiItem[]>([])
  const [galeri, setGaleri] = useState<StrapiItem[]>([])
  const [beritaPagination, setBeritaPagination] = useState({
    page: 1,
    pageSize: 8,
    pageCount: 1,
    total: 0
  })
  const [loading, setLoading] = useState({
    featured: false,
    berita: false,
    galeri: false,
    pengumuman: false
  })
  const [selectedPengumuman, setSelectedPengumuman] = useState<{
    id: number
    title: string
    content: string
    priority?: 'Mendesak' | 'Penting' | 'Rutin'    
    publishedAt?: string
    startDate?: string
    endDate?: string
    documentId?: string
  } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ============ SAFE GETTER FUNCTIONS - Original & Working ============
  const getTitle = (item: StrapiItem): string => {
    if (!item) return 'Tanpa Judul'
    return item.title || item.attributes?.title || 'Tanpa Judul'
  }

  const getContent = (item: StrapiItem): string => {
    if (!item) return ''
    return item.content || item.attributes?.content || ''
  }

  const getImage = (item: StrapiItem): string => {
    try {
      if (!item) return '/images/placeholder.jpg'
      const gambar = item.gambar || item.attributes?.gambar
      if (!gambar) return '/images/placeholder.jpg'
      if (typeof gambar === 'object' && gambar !== null) {
        const url = (gambar as Record<string, unknown>).url
        if (typeof url === 'string') {
          if (url.startsWith('http')) return url
          return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || '${process.env.NEXT_PUBLIC_STRAPI_URL}'}${url}`
        }
      }
      return '/images/placeholder.jpg'
    } catch {
      return '/images/placeholder.jpg'
    }
  }

  const handlePengumumanClick = (item: StrapiItem) => {
  setSelectedPengumuman({
    id: item.id,
    title: getTitle(item),
    content: getContent(item),
    priority: item.priority as 'Mendesak' | 'Penting' | 'Rutin' | undefined,
    publishedAt: item.publishedAt,
    startDate: item.startDate,
    endDate: item.endDate,
    documentId: item.documentId
  })
  setIsModalOpen(true)
}


  const getAuthor = (item: StrapiItem): string => {
    if (!item) return 'Unknown'
    return item.author || item.attributes?.author || 'Unknown'
  }

  const getDate = (item: StrapiItem): string => {
    try {
      if (!item) return ''
      const date = item.publishedAt || item.attributes?.publishedAt || ''
      return date ? formatStrapiDate(date) : ''
    } catch {
      return ''
    }
  }

  const getCategory = (item: StrapiItem): string => {
    if (!item) return 'Umum'
    return item.category || item.attributes?.category || 'Umum'
  }

  const getSlug = (item: StrapiItem): string => {
    if (!item) return ''
    return item.slug || item.documentId || ''
  }
const getPriorityColor = (priority?: string): string => {
  const colors: Record<string, string> = {
    'Mendesak': 'border-l-4 border-red-500 hover:bg-red-50',
    'Wajib': 'border-l-4 border-green-500 hover:bg-green-50',
    'Penting': 'border-l-4 border-green-300 hover:bg-green-50'
  }
  return colors[priority || 'Normal'] || colors.Normal
}

const getPriorityIcon = (priority?: string) => {
  if (priority === 'Mendesak') return <AlertCircle className="w-4 h-4 text-red-500" />
  if (priority === 'Wajib') return <Bell className="w-4 h-4 text-green-500" />
  return <Clock className="w-4 h-4 text-gray-500" />
}


const isValidDateRange = (item: StrapiItem): boolean => {
  const now = new Date()
  const start = item.startDate ? new Date(item.startDate) : null
  const end = item.endDate ? new Date(item.endDate) : null

  return (!start || now >= start) && (!end || now <= end)
}


  // ============ FILTER FUNCTION - Original & Working ============
  const safeFilter = (items: unknown[]): StrapiItem[] => {
    if (!Array.isArray(items)) return []
    return items.filter((item): item is StrapiItem => {
      if (!item || typeof item !== 'object') return false
      const typedItem = item as StrapiItem
      return Boolean(typedItem.id)
    })
  }

    // ============ DATA FETCHING - Extended ============
  const fetchData = useCallback(async () => {
  setLoading({ featured: true, berita: true, galeri: true, pengumuman: true })
  try {
    const [featuredResult, beritaResult, galeriResult, pengumumanResult] = await Promise.allSettled([
      getFeaturedBerita(1),
      getBeritaListPaginated({ page: 1, pageSize: 8 }),
      getGaleriList({ page: 1, pageSize: 6 }),
      getFeaturedPengumuman(3)
    ])

    const featuredData = featuredResult.status === 'fulfilled'
      ? (featuredResult as PromiseFulfilledResult<any>).value?.data
      : []

    const beritaData = beritaResult.status === 'fulfilled'
      ? (beritaResult as PromiseFulfilledResult<any>).value
      : null

    const galeriData = galeriResult.status === 'fulfilled'
      ? (galeriResult as PromiseFulfilledResult<any>).value?.data
      : []

    const pengumumanData = pengumumanResult.status === 'fulfilled'
      ? (pengumumanResult as PromiseFulfilledResult<any>).value?.data
      : []

    const filteredFeatured = safeFilter(featuredData || [])
    const filteredBerita = safeFilter(beritaData?.data || [])
    const filteredGaleri = safeFilter(galeriData || [])
      const filteredPengumuman = safeFilter(pengumumanData || [])
      .filter(isValidDateRange)
      .sort((a, b) => {
    const priorityOrder: Record<string, number> = { 'Mendesak': 0, 'Penting': 1, 'Rutin': 2 }
        return (priorityOrder[a.priority || 'Rutin'] || 2) - (priorityOrder[b.priority || 'Rutin'] || 2)
      })

    setFeatured(safeFilter(featuredData || []))
    setBerita(safeFilter(beritaData?.data || []))
    setGaleri(safeFilter(galeriData || []))
    setPengumuman(filteredPengumuman.slice(0, 3))
    setBeritaPagination(beritaData?.meta?.pagination || { page: 1, pageSize: 8, pageCount: 0, total: 0 })

    console.log('✅ Homepage loaded:', {
      featured: filteredFeatured.length,
      berita: filteredBerita.length,
      galeri: filteredGaleri.length,
      pengumuman: filteredPengumuman.length
    })
  } catch (err) {
    console.error('❌ Fetch error:', err)
  } finally {
    setLoading({ featured: false, berita: false, galeri: false, pengumuman: false })
  }
}, [])

  const handlePageChange = async (page: number) => {
    setLoading(prev => ({ ...prev, berita: true }))
    try {
      const response = await getBeritaListPaginated({ page, pageSize: 8 })
      setBerita(safeFilter(response.data || []))
      setBeritaPagination(response.meta?.pagination || beritaPagination)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('❌ Pagination error:', error)
    } finally {
      setLoading(prev => ({ ...prev, berita: false }))
    }
  }

  // ============ EFFECTS ============
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ============ MAIN CONTENT - 2 COLUMN LAYOUT ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ============ LEFT COLUMN - MAIN CONTENT ============ */}
          <div className="lg:col-span-2">
            {/* Featured Article - LARGE */}
            {loading.featured ? (
              <CardSkeleton />
            ) : featured.length > 0 && featured[0] ? (
              <Link href={`/berita/${getSlug(featured[0])}`}>
                <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative w-full h-96">
                    <Image
                      src={getImage(featured[0])}
                      alt={getTitle(featured[0])}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge>{getCategory(featured[0])}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">
                      {getTitle(featured[0])}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {generateContentExcerpt(getContent(featured[0]), 150)}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={16} />
                        {getAuthor(featured[0])}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {getDate(featured[0])}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ) : null}

            {/* Berita Grid 2-Column */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Berita Terbaru</h2>
              {loading.berita ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
                </div>
              ) : berita.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {berita.map(item => (
                      <Link key={item.id} href={`/berita/${getSlug(item)}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <div className="relative w-full h-48">
                            <Image
                              src={getImage(item)}
                              alt={getTitle(item)}
                              fill
                              className="object-cover"
                            />
                            {getCategory(item) && (
                              <div className="absolute top-3 left-3">
                                <Badge>{getCategory(item)}</Badge>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                              {getTitle(item)}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {generateContentExcerpt(getContent(item), 80)}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User size={14} />
                                {getAuthor(item)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {getDate(item)}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                  {beritaPagination.pageCount > 1 && (
                    <Pagination
                      currentPage={beritaPagination.page}
                      totalPages={beritaPagination.pageCount}
                      totalItems={beritaPagination.total}
                      pageSize={beritaPagination.pageSize}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Belum ada berita tersedia</p>
                </div>
              )}
            </div>
          </div>

          {/* ============ RIGHT COLUMN - SIDEBAR ============ */}
          <div className="lg:col-span-1">
            {/* Pengumuman Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 px-4 py-2">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Pengumuman
                </h3>
              </div>

              {loading.pengumuman ? (
                <div className="p-6 space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : pengumuman.length > 0 ? (
                <div className="divide-y">
                  {pengumuman.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handlePengumumanClick(item)}
                      className={`p-2 cursor-pointer transition-all duration-200 ${getPriorityColor(item.priority)} hover:shadow-md`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                            {getTitle(item)}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getDate(item)}
                          </p>
                          {item.priority && (
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                                item.priority === 'Mendesak' ? 'bg-red-100 text-red-800' :
                                item.priority === 'Wajib' ? 'bg-green-100 text-green-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {item.priority}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-sm">Tidak ada pengumuman</p>
                </div>
              )}
            </div>

            {/* Organisasi Kampus Sidebar */}
            <OrganisasiSidebar />
          </div>
        </div>

        {/* ============ GALERI SECTION - FULL WIDTH BOTTOM ============ */}
        {!loading.galeri && galeri.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Galeri Terbaru</h2>
              <Link href="/galeri" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galeri.map(item => (
                <Link key={item.id} href={`/galeri/${getSlug(item)}`}>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <Image
                      src={getImage(item)}
                      alt={getTitle(item)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                      <p className="text-white text-sm font-medium p-3 line-clamp-1">
                        {getTitle(item)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    
      {/* Modal untuk detail pengumuman */}
       {selectedPengumuman && (
        <PengumumanModal
          item={selectedPengumuman}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedPengumuman(null)
          }}
        />
      )}
    </div>
  )
}


