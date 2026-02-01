import type { 
  Berita, 
  Artikel,  
  Staff,  
  SearchResults,
  StrapiMedia,
  Pengumuman
  
} from '@/types';
import type {PengumumanListResponse, PengumumanResponse } from '@/types/pengumuman'

// Interface untuk API Response
interface ApiResponse<T = any> {
  data: T | T[]
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

// ===== CONFIGURATION =====
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://victorious-animal-46b1eb6b21.strapiapp.com/admin';
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ===== TYPE DEFINITIONS =====

type QueryParamValue = string | number | boolean | string[];
type QueryParams = Record<string, QueryParamValue>;

interface MultipleMediaResponse {
  data: StrapiMedia[] | null;
}

// ===== IN-MEMORY CACHE =====
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const MAX_CACHE_SIZE = 50; // maksimal 50 entri
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // default 5 menit

/**
 * Get cached data by key, returns null if not found or expired.
 */
function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key); // Remove expired cache
    return null;
  }
  return entry.data;
}

/**
 * Set cached data with optional TTL (default 5 minutes).
 */
function setCachedData<T>(key: string, data: T, ttl: number = DEFAULT_CACHE_TTL): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry
    const oldestKey = Array.from(cache.keys())[0];
    cache.delete(oldestKey);
  }
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl
  });
}


// ===== CUSTOM ERROR CLASS =====
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// ===== BASE API FUNCTION =====
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${STRAPI_API_URL}/api${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json() as { error?: { message?: string } };
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        // If can't parse JSON, use default message
      }
      
      throw new APIError(errorMessage, response.status, endpoint);
    }

    const data = await response.json() as T;
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      endpoint
    );
  }
}

// ===== QUERY BUILDER HELPER =====
function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams.toString();
}

// ===== BERITA API FUNCTIONS =====

export async function getBeritaList(params: {
  page?: number;
  pageSize?: number;
  featured?: boolean;
  sort?: string;
  search?: string;
} = {}): Promise<ApiResponse<Berita[]>> {
  const queryParams: QueryParams = {
    'populate': 'gambar',
    'sort': params.sort || 'published:desc',
  };

  // Pagination
  if (params.page) queryParams['pagination[page]'] = params.page;
  if (params.pageSize) queryParams['pagination[pageSize]'] = params.pageSize;

  // Filtering
  if (typeof params.featured === 'boolean') {
  queryParams['filters[is_featured][$eq]'] = String(params.featured);
}
  if (params.search) queryParams['filters[title][$containsi]'] = params.search;

  //const queryString = buildQueryString(queryParams);
  const cacheKey = `berita-list`;
  
  // Check cache first

const cachedData = getCachedData<ApiResponse<Berita[]>>(cacheKey);
if (cachedData) return cachedData;

const data = await fetchAPI<ApiResponse<Berita[]>>('/beritas?populate=gambar');
// set cache data dengan TTL 5 menit
setCachedData(cacheKey, data, 5 * 60 * 1000);
return data;
}

export async function getBeritaBySlug(slug: string): Promise<ApiResponse> {
  try {
    if (!slug || slug.trim() === '') {
      console.log('⚠️ Slug is empty')
      return { data: [] } as ApiResponse
    }

    console.log(`🔍 Fetching berita: ${slug}`)

    // TRY 1: Check if numeric ID
    if (!isNaN(Number(slug))) {
      console.log('📌 Trying as numeric ID...')
      try {
        const response = await fetchAPI(
          `/beritas?filters[id][$eq]=${slug}&pagination[pageSize]=1&populate=*`
        ) as ApiResponse
        if (response?.data?.length > 0) {
          console.log('✅ Found by ID')
          return response
        }
      } catch (err) {
        console.log('⚠️ ID search failed:', err)
      }
    }

    // TRY 2: By documentId (direct endpoint)
    try {
      console.log('📌 Trying as documentId...')
      const response = await fetchAPI(`/beritas/${slug}?populate=*`) as any
      if (response?.id) {
        console.log('✅ Found by documentId')
        return { data: [response] } as ApiResponse
      }
    } catch (err) {
      console.log('⚠️ documentId endpoint failed')
    }

    // TRY 3: By slug field (exact match)
    try {
      console.log('📌 Trying by slug field...')
      const response = await fetchAPI(
        `/beritas?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
      ) as ApiResponse
      
      if (response?.data?.length > 0) {
        console.log('✅ Found by slug')
        return response
      }
    } catch (err) {
      console.log('⚠️ Slug search failed:', err)
    }

    // TRY 4: By slug field (contains - fallback)
    try {
      console.log('📌 Trying by slug contains...')
      const response = await fetchAPI(
        `/beritas?filters[slug][$containsi]=${encodeURIComponent(slug)}&populate=*`
      ) as ApiResponse
      
      if (response?.data?.length > 0) {
        console.log('✅ Found by slug contains')
        return response
      }
    } catch (err) {
      console.log('⚠️ Slug contains failed:', err)
    }

    console.warn(`❌ Berita not found: ${slug}`)
    return { data: [] } as ApiResponse
  } catch (err) {
    console.error('❌ Error in getBeritaBySlug:', err)
    return { data: [] } as ApiResponse
  }
}

// =====  API FUNCTIONS =====

// ===== STAFF API FUNCTIONS =====

export async function getStaffList(): Promise<ApiResponse<Staff[]>> {
  const cacheKey = 'staff-list';
  const cachedData = getCachedData<ApiResponse<Staff[]>>(cacheKey);
  if (cachedData) return cachedData;
  
  // ✅ Ganti 'gambar' dengan nama field yang benar untuk staff, misal 'foto'
  const data = await fetchAPI<ApiResponse<Staff[]>>('/staffs?filters[is_active][$eq]=true&populate=photo&sort=order:asc');
  setCachedData(cacheKey, data);
  return data;
}

export async function getStaffByDepartment(department: string): Promise<ApiResponse<Staff[]>> {
  return fetchAPI<ApiResponse<Staff[]>>(`/staffs?filters[department][$eq]=${department}&filters[is_active][$eq]=true&populate=photo&sort=order:asc`);
}

// ===== SEARCH FUNCTIONS =====

export async function searchContent(
  query: string, 
  contentTypes: string[] = ['beritas', 'artikels']
): Promise<SearchResults> {
  console.log('🔍 searchContent called with:', { query, contentTypes });
  
  if (!query.trim()) {
    console.log('❌ Empty query, returning empty results');
    return { total: 0 };
  }

  const searchPromises = contentTypes.map(async (type): Promise<Record<string, Berita[] | Artikel[]>> => {
    try {
      const endpoint = `/${type}?filters[title][$containsi]=${encodeURIComponent(query)}&populate=gambar&pagination[pageSize]=10`;
      console.log(`🌐 Searching ${type} with endpoint:`, endpoint);
      console.log(`🌐 Full URL:`, `${STRAPI_API_URL}/api${endpoint}`);
      
      if (type === 'beritas') {
      const result = await fetchAPI<PaginatedResponse<Berita>>(endpoint);  // ✅ Gunakan PaginatedResponse
      console.log(`✅ ${type} search result:`, { 
        dataLength: result.data?.length || 0, 
        total: result.meta?.pagination?.total || 0,
        data: result.data 
      });
        return { [type]: result.data || [] };
      } else if (type === 'artikels') {
        const result = await fetchAPI<PaginatedResponse<Artikel>>(endpoint);
        console.log(`✅ ${type} search result:`, { 
          dataLength: result.data?.length || 0, 
          total: result.meta?.pagination?.total || 0,
          data: result.data 
        });
        return { [type]: result.data || [] };
      } else {
        console.log(`⚠️ Unknown content type: ${type}`);
        return { [type]: [] };
      }
    } catch (error) {
      console.error(`❌ Error searching ${type}:`, error);
      return { [type]: [] };
    }
  });

  const results = await Promise.all(searchPromises);
  const combinedResults = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  
  // Calculate total results
  const total = Object.values(combinedResults).reduce((sum, items) => {
    return sum + (Array.isArray(items) ? items.length : 0);
  }, 0);

  console.log('🎯 Final search results:', { combinedResults, total });
  return { ...combinedResults, total } as SearchResults;
}


// ===== UTILITY FUNCTIONS =====

export function getStrapiMediaUrl(media: StrapiMedia | null | undefined): string {
  if (!media) return '';

  try {
    // Handle Strapi V4 media object
    if (media.attributes?.url) {
      const url = media.attributes.url;
      return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
    }
  } catch (error) {
    console.error('Error processing media URL:', error);
  }
  
  // Check if it's the new direct media object format (like your berita.gambar)
  if (typeof media === 'object' && media !== null && 'url' in media) {
    const mediaObj = media as { url: string; formats?: Record<string, { url: string }> };
    const url = mediaObj.url;
    return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
  }
  
  // Handle old nested format (data.attributes.url) - fallback
  if (typeof media === 'object' && media !== null && 'data' in media) {
    const oldFormat = media as { data: { attributes: { url: string } } | null };
    if (!oldFormat.data?.attributes?.url) return '';
    const url = oldFormat.data.attributes.url;
    return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
  }
  
  return '';
}

export function getStrapiMediaUrls(media: MultipleMediaResponse | null | undefined): string[] {
  if (!media?.data || !Array.isArray(media.data)) return [];
  
  return media.data.map((item: StrapiMedia) => {
    const url = item.attributes?.url;
    return url ? (url.startsWith('http') ? url : `${STRAPI_API_URL}${url}`) : '';
  }).filter(Boolean);
}

export function formatStrapiDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  });
}

export function formatStrapiDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  });
}

export function generateContentExcerpt(content: unknown, maxLength: number = 160): string {
  if (!content) return '';
  
  // Handle new Strapi V4 JSON content structure
  if (Array.isArray(content)) {
    const textContent = content
      .filter(block => block && typeof block === 'object' && block.type === 'paragraph')
      .map(block => {
        if (block.children && Array.isArray(block.children)) {
          return block.children
            .filter((child: { type: string; text?: string }) => child.type === 'text' && child.text)
            .map((child: { text: string }) => child.text)
            .join(' ');
        }
        return '';
      })
      .join(' ')
      .trim();
    
    if (textContent.length <= maxLength) return textContent;
    
    // Use substring instead of deprecated substr
    const truncated = textContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }
  
  // Handle string content (fallback)
  if (typeof content === 'string') {
    const cleanContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    if (cleanContent.length <= maxLength) return cleanContent;
    
    // Use substring instead of deprecated substr
    const truncated = cleanContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }
  return '';
}

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  
  return formatStrapiDateShort(dateString);
}

// ===== HEALTH CHECK =====

export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${STRAPI_API_URL}/api/beritas?pagination[pageSize]=1`);
    return response.ok;
  } catch {
    return false;
  }
}

// ===== CACHE MANAGEMENT =====

export function clearAPICache(): void {
  cache.clear();
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}

// Add new interface
export interface AdvancedSearchParams {
  query?: string;
  contentType?: 'all' | 'beritas' | 'artikels';
  category?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  featured?: boolean | null;
  pageSize?: number;
  page?: number;
}

// Enhanced search function
export async function advancedSearchContent(
  params: AdvancedSearchParams
): Promise<SearchResults> {
  console.log('🔍 advancedSearchContent called with params:', params);

  const {
    query = '',
    contentType = 'all',
    category,
    author,
    dateFrom,
    dateTo,
    featured,
    pageSize = 20,
    page = 1
  } = params;

  // If no search criteria, return empty
  if (!query.trim() && !category && !author && !dateFrom && !dateTo && featured === null) {
    return { total: 0 };
  }

  const contentTypes = contentType === 'all' ? ['beritas', 'artikels'] : [contentType];
  
  const searchPromises = contentTypes.map(async (type): Promise<Record<string, Berita[] | Artikel[]>> => {
    try {
      // Build query parameters
      const queryParams: Record<string, string> = {
        'populate': 'gambar',
        'pagination[page]': page.toString(),
        'pagination[pageSize]': pageSize.toString(),
        'sort[0]': 'publishedAt:desc'
      };

      let filterCount = 0;

      // Text search
      if (query.trim()) {
        queryParams[`filters[$or][${filterCount}][title][$containsi]`] = query;
        queryParams[`filters[$or][${filterCount}][content][$containsi]`] = query;
        filterCount++;
      }

      // Category filter
      if (category) {
        queryParams[`filters[category][$eq]`] = category;
      }

      // Author filter
      if (author) {
        queryParams[`filters[author][$containsi]`] = author;
      }

      // Date range filter
      if (dateFrom) {
        queryParams[`filters[publishedAt][$gte]`] = `${dateFrom}T00:00:00.000Z`;
      }
      if (dateTo) {
        queryParams[`filters[publishedAt][$lte]`] = `${dateTo}T23:59:59.999Z`;
      }

      // Featured filter
      if (typeof featured === 'boolean') {
      queryParams[`filters[isFeatured][$eq]`] = String(featured);
    }

      const queryString = new URLSearchParams(queryParams).toString();
      const endpoint = `/${type}?${queryString}`;
      
      console.log(`🌐 Advanced searching ${type} with endpoint:`, endpoint);

      if (type === 'beritas') {
        const result = await fetchAPI<PaginatedResponse<Berita>>(endpoint);
        console.log(`✅ ${type} advanced search result:`, { 
          dataLength: result.data?.length || 0, 
          total: result.meta?.pagination?.total || 0
        });
        return { [type]: result.data || [] };
      } else if (type === 'artikels') {
        const result = await fetchAPI<PaginatedResponse<Artikel>>(endpoint);
        console.log(`✅ ${type} advanced search result:`, { 
          dataLength: result.data?.length || 0, 
          total: result.meta?.pagination?.total || 0
        });
        return { [type]: result.data || [] };
      }
      
      return { [type]: [] };
    } catch (error) {
      console.error(`❌ Error advanced searching ${type}:`, error);
      return { [type]: [] };
    }
  });

  const results = await Promise.all(searchPromises);
  const combinedResults = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  
  // Calculate total results
  const total = Object.values(combinedResults).reduce((sum, items) => {
    return sum + (Array.isArray(items) ? items.length : 0);
  }, 0);

  console.log('🎯 Final advanced search results:', { combinedResults, total });
  return { ...combinedResults, total } as SearchResults;
}

// Enhanced pagination support with metadata
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

// Enhanced getBeritaList with full pagination
export async function getBeritaListPaginated(params: {
  page?: number;
  pageSize?: number;
  featured?: boolean;
  category?: string;
  author?: string;
  sort?: string;
  search?: string;
} = {}): Promise<PaginatedResponse<Berita>> {
  const queryParams: Record<string, string> = {
    populate: 'gambar',
    'pagination[page]': (params.page || 1).toString(),
    'pagination[pageSize]': (params.pageSize || 12).toString(),
    'sort[0]': params.sort || 'publishedAt:desc'
  };

  if (typeof params.featured === 'boolean') {
  queryParams['filters[is_featured][$eq]'] = String(params.featured);
}

  if (params.category) {
    queryParams[`filters[category][$eq]`] = params.category;
  }

  if (params.author) {
    queryParams[`filters[author][$containsi]`] = params.author;
  }

  if (params.search) {
    queryParams[`filters[$or][0][title][$containsi]`] = params.search;
    queryParams[`filters[$or][1][content][$containsi]`] = params.search;
  }

  const queryString = new URLSearchParams(queryParams).toString();
  const cacheKey = `berita-paginated-${queryString}`;

  const cachedData = getCachedData<PaginatedResponse<Berita>>(cacheKey);
  if (cachedData) {
    console.log('✅ Using cached berita data:', cacheKey);
    return cachedData;
  }

  const data = await fetchAPI<PaginatedResponse<Berita>>(`/beritas?${queryString}`);
  setCachedData(cacheKey, data, 5 * 60 * 1000); // Cache 5 minutes
  return data;
}

// Enhanced getArtikelList with pagination
export async function getArtikelListPaginated(params: {
  page?: number;
  pageSize?: number;
  category?: string;
  author?: string;
  sort?: string;
  search?: string;
} = {}): Promise<PaginatedResponse<Artikel>> {
  const queryParams: Record<string, string> = {
    populate: 'gambar',
    'pagination[page]': (params.page || 1).toString(),
    'pagination[pageSize]': (params.pageSize || 12).toString(),
    'sort[0]': params.sort || 'publishedAt:desc'
  };

  if (params.category) {
    queryParams[`filters[category][$eq]`] = params.category;
  }

  if (params.author) {
    queryParams[`filters[author][$containsi]`] = params.author;
  }

  if (params.search) {
    queryParams[`filters[$or][0][title][$containsi]`] = params.search;
    queryParams[`filters[$or][1][content][$containsi]`] = params.search;
  }

  const queryString = new URLSearchParams(queryParams).toString();
  const cacheKey = `artikel-paginated-${queryString}`;

  const cachedData = getCachedData<PaginatedResponse<Artikel>>(cacheKey);
  if (cachedData) {
    console.log('✅ Using cached artikel data:', cacheKey);
    return cachedData;
  }

  const data = await fetchAPI<PaginatedResponse<Artikel>>(`/artikels?${queryString}`);
  setCachedData(cacheKey, data, 5 * 60 * 1000); // Cache 5 minutes
  return data;
  
}

export async function getPengumumanList(params: {
  page?: number
  pageSize?: number
  sort?: string
} = {}): Promise<PengumumanListResponse> {
  const pageSize = params.pageSize || 5
  const cacheKey = `pengumuman-list-${pageSize}`

  const cached = getCachedData<PengumumanListResponse>(cacheKey)
  if (cached) return cached

  const endpoint = `/pengumumen?filters[is_active][$eq]=true&populate=*&sort=publishedAt:desc&pagination[pageSize]=${pageSize}`

  try {
    const data = await fetchAPI<PengumumanListResponse>(endpoint)
    setCachedData(cacheKey, data, 5 * 60 * 1000)
    console.log('✅ Pengumuman loaded:', data.data?.length || 0)
    return data
  } catch (error) {
    console.error('❌ Error fetching pengumuman:', error)
    return {
      data: [],
      meta: {
        pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 }
      }
    }
  }
}


export async function getFeaturedPengumuman(limit: number = 3): Promise<PengumumanListResponse> {
  const cacheKey = `pengumuman-featured-${limit}`
  const cached = getCachedData<PengumumanListResponse>(cacheKey)
  if (cached) return cached

  const endpoint = `/pengumumen?pagination[pageSize]=${limit}&populate=*&sort[0]=publishedAt:desc`

  try {
    console.log('🔍 Fetching featured pengumuman...')
    const data = await fetchAPI<PengumumanListResponse>(endpoint)
    console.log('✅ Pengumuman loaded:', data.data?.length || 0)
    setCachedData(cacheKey, data, 5 * 60 * 1000)
    return data
  } catch (error) {
    console.error('❌ Error in getFeaturedPengumuman:', error)
    return { data: [], meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } } }
  }
}


export async function getFeaturedBerita(limit: number = 3): Promise<ApiResponse> {
  try {
    console.log(`🔍 Fetching featured berita (limit: ${limit})`)

    // TRY 1: Filter by is_featured = true
    try {
      const response = await fetchAPI(
        `/beritas?filters[is_featured][$eq]=true&pagination[pageSize]=${limit}&populate=*&sort[0]=publishedAt:desc`
      ) as ApiResponse

      if (response?.data?.length > 0) {
        console.log(`✅ Found ${response.data.length} featured berita`)
        return response
      }
    } catch (err) {
      console.log('⚠️ Featured filter failed, trying fallback...')
    }

    // FALLBACK: Get latest berita jika tidak ada featured
    console.log('📌 Using fallback: getting latest berita...')
    const response = await fetchAPI(
      `/beritas?pagination[pageSize]=${limit}&populate=*&sort[0]=publishedAt:desc`
    ) as ApiResponse

    console.log(`✅ Got ${response?.data?.length || 0} latest berita as fallback`)
    return response || ({ data: [] } as ApiResponse)
  } catch (err) {
    console.error('❌ Error in getFeaturedBerita:', err)
    return { data: [] } as ApiResponse
  }
}
export async function getGaleriList(params: {
  page?: number;
  pageSize?: number;
  search?: string;
} = {}): Promise<ApiResponse<any>> {
  try {
    const page = params.page || 1
    const pageSize = params.pageSize || 6
    const search = params.search 
      ? `&filters[title][$containsi]=${encodeURIComponent(params.search)}` 
      : ''

    const queryParams: QueryParams = {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'populate': 'gambar',
      'sort[0]': 'publishedAt:desc'
    }

    console.log(`🔍 Fetching galeri list (page ${page}, pageSize ${pageSize})`)

    const response = await fetchAPI(
      `/galeris${search}`,
      queryParams
    ) as ApiResponse<any>

    console.log(`✅ Loaded ${response?.data?.length || 0} galeri items`)
    return response || { data: [] } as ApiResponse<any>
  } catch (err) {
    console.error('❌ Error in getGaleriList:', err)
    return { data: [] } as ApiResponse<any>
  }
}

/**
 * Get single galeri by slug
 */
export async function getGaleriBySlug(slug: string): Promise<ApiResponse<any>> {
  try {
    if (!slug || slug.trim() === '') {
      console.log('⚠️ Slug is empty')
      return { data: [] } as ApiResponse<any>
    }

    console.log(`🔍 Fetching galeri: ${slug}`)

    // Try multiple methods to find galeri
    const methods = [
      {
        name: 'numeric ID',
        fn: () => fetchAPI(
          `/galeris?filters[id][$eq]=${slug}&pagination[pageSize]=1&populate=*`
        ) as Promise<ApiResponse<any>>
      },
      {
        name: 'documentId',
        fn: () => fetchAPI(`/galeris/${slug}?populate=*`) as Promise<any>
      },
      {
        name: 'slug (exact)',
        fn: () => fetchAPI(
          `/galeris?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
        ) as Promise<ApiResponse<any>>
      }
    ]

    for (const method of methods) {
      try {
        console.log(`📌 Trying: ${method.name}...`)
        const response = await method.fn()

        if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`✅ Found by ${method.name}`)
          return response
        } else if (response?.id) {
          console.log(`✅ Found by ${method.name}`)
          return { data: [response] } as ApiResponse<any>
        }
      } catch (err) {
        console.log(`⚠️ ${method.name} failed, trying next...`)
      }
    }

    console.warn(`❌ Galeri not found: ${slug}`)
    return { data: [] } as ApiResponse<any>
  } catch (err) {
    console.error('❌ Error in getGaleriBySlug:', err)
    return { data: [] } as ApiResponse<any>
  }
}

/**
 * Get featured galeri items
 */
export async function getFeaturedGaleri(limit: number = 6): Promise<ApiResponse<any>> {
  try {
    console.log(`🔍 Fetching featured galeri (limit: ${limit})`)

    // Try featured first
    try {
      const response = await fetchAPI(
        `/galeris?filters[is_featured][$eq]=true&pagination[pageSize]=${limit}&populate=*&sort[0]=publishedAt:desc`
      ) as ApiResponse<any>

      if (response?.data?.length > 0) {
        console.log(`✅ Found ${response.data.length} featured galeri`)
        return response
      }
    } catch (err) {
      console.log('⚠️ Featured filter failed, trying fallback...')
    }

    // Fallback to latest
    console.log('📌 Using fallback: getting latest galeri...')
    const response = await fetchAPI(
      `/galeris?pagination[pageSize]=${limit}&populate=*&sort[0]=publishedAt:desc`
    ) as ApiResponse<any>

    console.log(`✅ Got ${response?.data?.length || 0} latest galeri as fallback`)
    return response || { data: [] } as ApiResponse<any>
  } catch (err) {
    console.error('❌ Error in getFeaturedGaleri:', err)
    return { data: [] } as ApiResponse<any>
  }
}

// ===== PENGUMUMAN API FUNCTIONS =====

export async function getPengumumanById(
  id: string | number
): Promise<PengumumanResponse> {
  try {
    if (!id) {
      console.log('⚠️ ID pengumuman kosong')
      return { data: null }
    }

    console.log(`🔍 Fetching pengumuman by ID: ${id}`)

    // TRY 1: Direct endpoint dengan documentId
    try {
      console.log(`📌 Trying dokumentId endpoint...`)
      const response = await fetchAPI<any>(`/pengumumen/${id}?populate=*`)
      if (response?.id) {
        console.log('✅ Pengumuman found by documentId')
        return { data: response }
      }
    } catch (err) {
      console.log('⚠️ DocumentId endpoint failed')
    }

    // TRY 2: By numeric ID filter
    try {
      console.log(`📌 Trying numeric ID filter...`)
      const response = await fetchAPI<PengumumanListResponse>(
        `/pengumumen?filters[id][$eq]=${id}&pagination[pageSize]=1&populate=*`
      )
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log('✅ Pengumuman found by numeric ID')
        return { data: response.data[0] }
      }
    } catch (err) {
      console.log('⚠️ Numeric ID search failed:', err)
    }

    console.warn(`❌ Pengumuman not found with ID: ${id}`)
    return { data: null }
  } catch (err) {
    console.error('❌ Error in getPengumumanById:', err)
    return { data: null }
  }
}

/**
 * Get pengumuman by slug
 * Untuk dynamic routes: /pengumuman/[slug]
 */
export async function getPengumumanBySlug(
  slug: string
): Promise<PengumumanResponse> {
  try {
    if (!slug || slug.trim() === '') {
      console.log('⚠️ Slug pengumuman kosong')
      return { data: null }
    }

    console.log(`🔍 Fetching pengumuman: ${slug}`)

    // STEP 1: Check if slug adalah numeric (berarti ID)
    if (!isNaN(Number(slug))) {
      console.log('📌 Slug is numeric, trying as ID...')
      return getPengumumanById(slug)
    }

    // STEP 2: Try documentId (direct endpoint)
    try {
      console.log('📌 Trying as documentId...')
      const response = await fetchAPI<any>(`/pengumumen/${slug}?populate=*`)
      if (response?.id) {
        console.log('✅ Found by documentId')
        return { data: response }
      }
    } catch (err) {
      console.log('⚠️ DocumentId search failed')
    }

    // STEP 3: Try slug field (exact match)
    try {
      console.log('📌 Trying by slug field (exact)...')
      const response = await fetchAPI<PengumumanListResponse>(
        `/pengumumen?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
      )
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log('✅ Found by slug field')
        return { data: response.data[0] }
      }
    } catch (err) {
      console.log('⚠️ Slug field exact search failed')
    }

    // STEP 4: Try slug contains (fallback)
    try {
      console.log('📌 Trying by slug contains...')
      const response = await fetchAPI<PengumumanListResponse>(
        `/pengumumen?filters[slug][$containsi]=${encodeURIComponent(slug)}&populate=*`
      )
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log('✅ Found by slug contains')
        return { data: response.data[0] }
      }
    } catch (err) {
      console.log('⚠️ Slug contains failed')
    }

    console.warn(`❌ Pengumuman not found: ${slug}`)
    return { data: null }
  } catch (err) {
    console.error('❌ Error in getPengumumanBySlug:', err)
    return { data: null }
  }
}

