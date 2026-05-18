import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [],
  },
  turbopack: {
    root: process.cwd(),
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      '@payloadcms/ui$': path.resolve(
        './node_modules/@payloadcms/ui/dist/exports/client/index.js',
      ),
    }
    return config
  },
}

export default withPayload(nextConfig)
