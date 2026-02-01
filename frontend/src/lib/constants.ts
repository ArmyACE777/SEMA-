export const PAGINATION = {
  NEWS: 8,
  ARTICLES: 4,
  COMMENTS: 10,
  SIDEBAR: 5,
  SEARCH_RESULTS: 20
} as const

// FEATURED SETTINGS
export const FEATURED = {
  LIMIT: 3,
  EXCERPT_LENGTH: 150
} as const

// GRID SETTINGS
export const GRID = {
  NEWS_COLS: 2,
  ARTICLE_COLS: 2,
  SIDEBAR_COLS: 1
} as const

// IMAGE CONFIGURATION
export const IMAGE = {
  PLACEHOLDER: '/images/placeholder.jpg',
  SIZES: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ASPECT_RATIOS: {
    FEATURED: 'aspect-video',
    GRID: 'aspect-video',
    THUMBNAIL: 'aspect-square',
    PORTRAIT: 'aspect-[3/4]'
  }
} as const

// EXCERPT LENGTHS
export const EXCERPT = {
  FEATURED: 150,
  GRID: 80,
  SIDEBAR: 60
} as const

// API ENDPOINTS
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337',
  ENDPOINTS: {
    BERITA: '/beritas',
    ARTIKEL: '/artikels',
    PENGUMUMAN: '/pengumans',
    GALERI: '/galeris',
    FEATURED: '/beritas?filters[is_featured][$eq]=true'
  }
} as const

// TIME INTERVALS
export const INTERVALS = {
  REFETCH_FEATURED: 60000, // 1 menit
  REFETCH_NEWS: 120000, // 2 menit
  CACHE_DURATION: 300000 // 5 menit
} as const

// LOADING STATES
export const LOADING_STATE = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const

// ERROR MESSAGES
export const ERROR_MESSAGES = {
  FETCH_FEATURED: 'Gagal memuat artikel featured',
  FETCH_NEWS: 'Gagal memuat berita',
  FETCH_ARTICLES: 'Gagal memuat artikel',
  FETCH_PENGUMUMAN: 'Gagal memuat pengumuman',
  FETCH_GALERI: 'Gagal memuat galeri',
  FETCH_SIDEBAR: 'Gagal memuat sidebar',
  SEARCH_FAILED: 'Pencarian gagal',
  GENERAL: 'Terjadi kesalahan'
} as const

// SUCCESS MESSAGES
export const SUCCESS_MESSAGES = {
  SEARCH_COMPLETED: 'Pencarian selesai',
  DATA_LOADED: 'Data berhasil dimuat'
} as const

// CONTENT TYPES
export const CONTENT_TYPE = {
  NEWS: 'beritas',
  ARTICLE: 'artikels',
  PENGUMUMAN: 'pengumans',
  GALERI: 'galeris',
  ALL: 'all'
} as const

// CATEGORIES
export const CATEGORIES = {
  AKADEMIK: 'Akademik',
  ORGANISASI: 'Organisasi',
  KEMAHASISWAAN: 'Kemahasiswaan',
  UMUM: 'Umum'
} as const

// DATE FORMAT
export const DATE_FORMAT = {
  LOCALE: 'id-ID',
  OPTIONS: {
    year: 'numeric' as const,
    month: 'long' as const,
    day: 'numeric' as const
  }
} as const