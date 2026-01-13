/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: true,
  // Используем относительные пути для статического экспорта
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: '',
}

module.exports = nextConfig

