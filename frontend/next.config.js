/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // domains lama sebenarnya sudah tidak perlu, tapi boleh dibiarkan atau dihapus
    // domains: ['localhost'],

    remotePatterns: [
      // 🔹 Strapi lokal (kalau masih dipakai di dev)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // 🔹 Strapi Cloud (production)
      {
        protocol: 'https',
        hostname: 'victorious-animal-46b1eb6b21.strapiapp.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'victorious-animal-46b1eb6b21.media.strapiapp.com',
        pathname: '/**',
      },
      // 🔹 Placeholder eksternal (kalau kamu pakai, opsional)
      {
        protocol: 'https',
        hostname: 'placeholder.svg',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
