export interface StrapiMedia {
  data?: {
    id?: number
    attributes?: {
      url?: string
      width?: number
      height?: number
      [key: string]: unknown
    }
  }
}

export interface StrapiItem {
  id: number
  title?: string
  content?: string
  author?: string
  publishedAt?: string
  category?: string
  is_featured?: boolean
  slug?: string
  documentId?: string
  gambar?: StrapiMedia | null
  attributes?: {
    title?: string
    content?: string
    author?: string
    publishedAt?: string
    category?: string
    is_featured?: boolean
    gambar?: StrapiMedia | null
  }
  priority?: 'Mendesak' | 'Wajib'
  startDate?: string
  endDate?: string
}
