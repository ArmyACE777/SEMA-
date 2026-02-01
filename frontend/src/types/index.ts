// Strapi Media Types
export interface StrapiMediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string | null;
  url: string;
}

export interface StrapiMediaFormats {
  thumbnail?: StrapiMediaFormat;
  small?: StrapiMediaFormat;
  medium?: StrapiMediaFormat;
  large?: StrapiMediaFormat;
}

export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: StrapiMediaFormats | null;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Base Strapi Response
export interface ApiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// Pagination
export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: PaginationMeta;
  };
}

// Berita Type
export interface Berita {
  id: number;
  documentId?: string;
  attributes: {
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    author: string;
    category?: string;
    tags: string[] | null;
    is_featured: boolean;
    published: string;
    createdAt: string;
    updatedAt: string;
    gambar: {
      data: StrapiMedia | null;
    } | null;
  };
}

// Artikel Type
export interface Artikel {
  id: number;
  documentId?: string;
  attributes: {
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    author: string;
    category?: string;
    tags: string[] | null;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    gambar: {
      data: StrapiMedia | null;
    } | null;
  };
}

// Staff Type
export interface Staff {
  id: number;
  documentId?: string;
  attributes: {
    name: string;
    position: string;
    department?: string;
    email?: string;
    phone?: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
    foto: {
      data: StrapiMedia | null;
    } | null;
  };
}

// Search Results
export interface SearchResults {
  beritas?: Berita[];
  artikels?: Artikel[];
  total?: number;
}

// API Error
export interface APIError {
  error: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

// ===== PENGUMUMAN INTERFACE =====
export interface PengumumanAttributes {
  title: string
  content: string
  startDate: string
  endDate: string | null
  priority: 'low' | 'medium' | 'high'  // ✅ FIXED: enum string not number
  is_active: boolean
  order: number  // ✅ ADDED: for sorting
  publishedAt: string | null  // ✅ ADDED: Strapi auto-generated
  createdAt: string
  updatedAt: string
}

export interface Pengumuman {
  id: number
  documentId?: string  // ✅ ADDED: Strapi V4 format
  attributes: PengumumanAttributes
}

// ===== GALERI INTERFACE =====
export interface GaleriAttributes {
  title: string;
  description: string | null;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
  images: {
    data: StrapiMedia[] | null;
  } | null;
}

export interface Galeri {
  id: number;
  attributes: GaleriAttributes;
}
