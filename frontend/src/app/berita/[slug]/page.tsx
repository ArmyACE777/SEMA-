'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ChevronLeft, Share2, ImageIcon, Copy, Check } from 'lucide-react'

interface Berita {
  id?: number
  title?: string
  slug?: string
  content?: string | any
  author?: string
  publishedAt?: string
  category?: string
  gambar?: any
}

interface RelatedBerita {
  id?: number
  title?: string
  slug?: string
  gambar?: any
}

export default function BeritaDetailPage() {
  const params = useParams()
  const slug = String(params?.slug || '')
  const [berita, setBerita] = useState<Berita | null>(null)
  const [relatedBerita, setRelatedBerita] = useState<RelatedBerita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        if (!slug) {
          setError(true)
          setLoading(false)
          return
        }

        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://victorious-animal-46b1eb6b21.strapiapp.com/admin'
        console.log(`🔍 Fetching berita: ${slug}`)

        let response = await fetch(
          `${STRAPI_URL}/api/beritas?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`,
          { cache: 'no-store' }
        )

        if (response?.ok) {
          const data = await response.json()
          if (data?.data?.length > 0) {
            console.log('✅ Found berita by slug')
            const beritaItem = data.data[0]
            setBerita(beritaItem)
            console.log('📝 Content:', beritaItem.content || beritaItem.attributes?.content)

            try {
              const relatedRes = await fetch(
                `${STRAPI_URL}/api/beritas?pagination[pageSize]=3&filters[slug][$ne]=${encodeURIComponent(slug)}&populate=gambar&sort[0]=publishedAt:desc`,
                { cache: 'no-store' }
              )
              if (relatedRes?.ok) {
                const relatedData = await relatedRes.json()
                setRelatedBerita(relatedData?.data || [])
              }
            } catch (err) {
              console.log('Related berita fetch skipped')
            }

            setLoading(false)
            return
          }
        }

        response = await fetch(`${STRAPI_URL}/api/beritas/${slug}?populate=*`, { cache: 'no-store' })
        if (response?.ok) {
          const data = await response.json()
          if (data?.id) {
            console.log('✅ Found by documentId')
            setBerita(data)
            setLoading(false)
            return
          }
        }

        console.error('❌ Berita not found')
        setError(true)
      } catch (err) {
        console.error('❌ Error:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchBerita()
  }, [slug])

  const getImageUrl = (gambar: any): string | null => {
    if (!gambar) return null
    const url = gambar?.attributes?.url || gambar?.url
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://victorious-animal-46b1eb6b21.strapiapp.com'}${url}`
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // ============ RENDER CONTENT HELPER ============
  const renderContent = (content: any) => {
    if (!content) return <p className="text-gray-600">Konten tidak tersedia</p>

    // Jika string biasa
    if (typeof content === 'string') {
      return <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-justify">{content}</p>
    }

    // Jika object/array (Strapi Rich Text)
    if (Array.isArray(content)) {
      return (
        <div className="space-y-4">
          {content.map((block: any, idx: number) => {
            if (block.type === 'paragraph' && block.children) {
              const text = block.children.map((child: any) => child.text || '').join('')
              return (
                <p key={idx} className="text-gray-800 leading-relaxed text-justify">
                  {text}
                </p>
              )
            }
            if (block.type === 'heading' && block.children) {
              const text = block.children.map((child: any) => child.text || '').join('')
              const level = (block.level as number) || 2
              const headingMap: Record<number, string> = {
                1: 'text-3xl font-bold',
                2: 'text-2xl font-bold',
                3: 'text-xl font-bold',
              }
const headingClass = headingMap[level] || 'text-lg font-bold'  // ✅ FIXED

              return (
                <h2 key={idx} className={`${headingClass} text-gray-900 mt-6 mb-3`}>
                  {text}
                </h2>
              )
            }
            return null
          })}
        </div>
      )
    }

    // Fallback
    return <p className="text-gray-600">Konten tidak dapat ditampilkan</p>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
          <p className="text-gray-600 mt-4">Memuat berita...</p>
        </div>
      </div>
    )
  }

  if (error || !berita?.title) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center py-12 bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Berita Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">Maaf, berita yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali ke Berita
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(berita.gambar)

  function handleCopyLink(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error('Function not implemented.')
  }

  function handleShare(event: React.MouseEvent<HTMLButtonElement>): void {
    const shareData = {
      title: berita?.title || 'Default Title',
      text: berita?.content,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Share successful'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(shareData.url)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        })
        .catch((error) => console.error('Error copying link:', error));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb & Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Berita
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {imageUrl && (
        <div className="relative h-96 md:h-screen/2 w-full bg-gray-200 overflow-hidden">
          <Image
            src={imageUrl}
            alt={berita.title || 'Berita'}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50"></div>
        </div>
      )}

      {/* Content Container */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            {berita.category && (
              <div className="inline-block mb-4">
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                  {berita.category}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {berita.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 text-gray-600 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">{berita.author || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">{formatDate(berita.publishedAt)}</span>
              </div>
              <button
              onClick={handleShare}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors font-medium"
              title="Bagikan atau salin link"
            >
              <Share2 className="w-5 h-5" />
              Bagikan
            </button>
            </div>
          </div>

          {/* Article Content - FIXED RENDERING */}
          <div className="prose prose-lg max-w-none mb-12">
            {renderContent(berita.content || (berita as any)?.attributes?.content)}
          </div>

          {/* Divider */}
          <div className="my-12 border-b border-gray-200"></div>

          {/* ============ AUTHOR CARD - KOMPAK & PRESISI ============ */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-12 border border-green-200">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                {(berita.author || 'A').charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">Tentang Penulis</h3>
                <p className="text-sm text-gray-700 font-semibold mt-0.5">{berita.author || 'Administrator'}</p>
                <p className="text-xs text-gray-600 mt-1">Penulis konten di Senat Mahasiswa IAI Persatuan Islam Garut</p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedBerita.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Berita Lainnya</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBerita.map(item => {
                  const relatedImage = getImageUrl(item.gambar)
                  return (
                    <Link
                      key={item.id}
                      href={`/berita/${item.slug}`}
                      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {relatedImage ? (
                          <Image
                            src={relatedImage}
                            alt={item.title || 'Berita'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ingin membaca berita lainnya?</h2>
          <p className="text-green-100 mb-6">Kunjungi halaman berita untuk melihat konten terbaru dari Senat Mahasiswa</p>
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Lihat Semua Berita
          </Link>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="h-0"></div>
    </div>
  )
}