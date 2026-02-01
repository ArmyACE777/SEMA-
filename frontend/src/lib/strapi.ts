// lib/strapi.ts
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://victorious-animal-46b1eb6b21.strapiapp.com/admin'

export const strapiImage = (path: string) => {
  return `${STRAPI_URL}${path}`  
}

export const strapiApi = (endpoint: string) => {
  return `${STRAPI_URL}/api${endpoint}`
}
