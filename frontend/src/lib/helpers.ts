import { EXCERPT, IMAGE } from './constants'

interface StrapiItem {
  id: number
  title?: string
  content?: string | Array<any>
  author?: string
  publishedAt?: string
  category?: string
  is_featured?: boolean
  slug?: string
  documentId?: string
  gambar?: any
  attributes?: any
}

/**
 * SAFE GETTERS - Extracted from page.tsx
 * Usage: Reuse di berita, artikel, pages lainnya
 */

export const getTitle = (item: StrapiItem | null): string => {
  if (!item) return 'Tanpa Judul'
  return item.title || item.attributes?.title || 'Tanpa Judul'
}

export const getContent = (item: StrapiItem | null): string => {
  if (!item) return ''
  
  let content = item.content || item.attributes?.content || ''
  
  // Handle Rich Text Array format
  if (Array.isArray(content)) {
    return content
      .map((block: any) => {
        if (block.type === 'paragraph' && block.children) {
          return block.children
            .map((child: any) => child.text || '')
            .join('')
        }
        return ''
      })
      .filter((text: string) => text.trim())
      .join('\n\n')
  }
  
  // Handle string format
  if (typeof content === 'string') {
    return content
  }
  
  return ''
}

export const getImage = (item: StrapiItem | null): string => {
  try {
    if (!item) return IMAGE.PLACEHOLDER
    
    // Get gambar object (support both direct and attributes)
    const gambar = item.gambar || item.attributes?.gambar
    if (!gambar) return IMAGE.PLACEHOLDER
    
    let url: string | undefined
    
    // Check if gambar is an object
    if (typeof gambar === 'object' && gambar !== null) {
      const gambarObj = gambar as Record<string, any>
      
      // ✅ FLAT structure: gambar.url (homepage)
      url = gambarObj.url
      
      // ✅ NESTED structure: gambar.data.attributes.url (berita slug)
      if (!url && gambarObj.data?.attributes?.url) {
        url = gambarObj.data.attributes.url
      }
    }
    
    // Fallback
    if (!url || typeof url !== 'string') return IMAGE.PLACEHOLDER
    
    // Return full URL
    if (url.startsWith('http')) return url
    
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://victorious-animal-46b1eb6b21.strapiapp.com'}${url}`
    
  } catch (error) {
    console.error('getImage error:', error)
    return IMAGE.PLACEHOLDER
  }
}


export const getAuthor = (item: StrapiItem | null): string => {
  if (!item) return 'Unknown'
  return item.author || item.attributes?.author || 'Unknown'
}

export const getDate = (item: StrapiItem | null): string => {
  try {
    if (!item) return ''
    const date = item.publishedAt || item.attributes?.publishedAt || ''
    return date ? new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : ''
  } catch {
    return ''
  }
}

export const getCategory = (item: StrapiItem | null): string => {
  if (!item) return 'Umum'
  return item.category || item.attributes?.category || 'Umum'
}

export const getSlug = (item: StrapiItem | null): string => {
  if (!item) return ''
  return item.slug || item.documentId || ''
}

export const isFeatured = (item: StrapiItem | null): boolean => {
  if (!item) return false
  return item.is_featured || item.attributes?.is_featured || false
}

/**
 * CONTENT EXCERPT - Generate preview text
 */
export const generateExcerpt = (
  content: string,
  length: number = EXCERPT.GRID
): string => {
  if (!content) return ''
  
  // Remove HTML tags if any
  const clean = content.replace(/<[^>]*>/g, '')
  
  // Remove extra whitespace
  const normalized = clean.replace(/\s+/g, ' ').trim()
  
  // Truncate dan add ellipsis
  if (normalized.length > length) {
    return normalized.substring(0, length) + '...'
  }
  
  return normalized
}

/**
 * FILTER & VALIDATION
 */
export const safeFilter = (items: unknown[]): StrapiItem[] => {
  if (!Array.isArray(items)) return []
  return items.filter((item): item is StrapiItem => {
    if (!item || typeof item !== 'object') return false
    const typedItem = item as StrapiItem
    return Boolean(typedItem.title || typedItem.attributes?.title)
  })
}

/**
 * ERROR HANDLING
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Terjadi kesalahan yang tidak diketahui'
}

/**
 * API URL BUILDER
 */
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, any>
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://victorious-animal-46b1eb6b21.strapiapp.com'
  const url = new URL(`${baseUrl}${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }
  
  return url.toString()
}

/**
 * LOCAL STORAGE HELPERS
 */
export const cacheData = (key: string, data: any, duration: number = 300000) => {
  const wrapper = {
    data,
    timestamp: Date.now(),
    duration
  }
  localStorage.setItem(key, JSON.stringify(wrapper))
}

export const getCachedData = (key: string) => {
  try {
    const wrapper = localStorage.getItem(key)
    if (!wrapper) return null
    
    const { data, timestamp, duration } = JSON.parse(wrapper)
    
    if (Date.now() - timestamp > duration) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
  } catch {
    return null
  }
}

export const clearCache = (key?: string) => {
  if (key) {
    localStorage.removeItem(key)
  } else {
    localStorage.clear()
  }
}