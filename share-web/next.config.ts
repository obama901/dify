import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'
import { fileURLToPath } from 'node:url'
import { env } from './src/env'

const isDev = process.env.NODE_ENV === 'development'
const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const srcRoot = fileURLToPath(new URL('./src', import.meta.url))

const nextConfig: NextConfig = {
  basePath: env.NEXT_PUBLIC_BASE_PATH,
  productionBrowserSourceMaps: false,
  output: 'standalone',
  transpilePackages: [
    '@dify/contracts',
    '@dify/iconify-collections',
    '@langgenius/dify-ui',
    '@t3-oss/env-core',
    '@t3-oss/env-nextjs',
    'echarts',
    'zrender',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/chat',
        permanent: false,
      },
    ]
  },
  compiler: {
    removeConsole: isDev ? false : { exclude: ['warn', 'error'] },
  },
  webpack(config: Configuration) {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': srcRoot,
      '~@': srcRoot,
      'loro-crdt$': 'loro-crdt/base64',
    }
    return config
  },
}

export default nextConfig
