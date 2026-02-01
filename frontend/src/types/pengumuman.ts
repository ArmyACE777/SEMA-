import type { BlocksContent } from '@strapi/blocks-react-renderer'

export interface RichTextChild {
  type: 'text' | 'bold' | 'italic' | 'underline' | 'strikethrough'
  text?: string
  children?: RichTextChild[]
}

export interface Pengumuman {
  id: number
  documentId: string
  title: string
  content?: BlocksContent  // ✅ CORRECT - dari @strapi/blocks-react-renderer
  startDate?: string
  endDate?: string
  priority?: 'Rutin' | 'Urgent' | 'Normal'
  is_active?: boolean
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
  order?: number
  slug?: string
  description?: string
  author?: string
}

export interface PengumumanListResponse {
  data: Pengumuman[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
  error?: any
}

export interface PengumumanResponse {
  data: Pengumuman | Pengumuman[] | null
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
  error?: any
}