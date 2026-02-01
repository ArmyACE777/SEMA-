// lib/strapi.ts
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || '${process.env.NEXT_PUBLIC_STRAPI_URL}'

export const strapiImage = (path: string) => {
  return `${STRAPI_URL}${path}`  
}

export const strapiApi = (endpoint: string) => {
  return `${STRAPI_URL}/api${endpoint}`
}
