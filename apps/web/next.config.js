/** @type {import('next').NextConfig} */
const repoName = 'fangyan-jianghu';

const nextConfig = {
  transpilePackages: ['@fangyan/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  output: 'export',
  trailingSlash: true,
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  env: {
    NEXT_PUBLIC_API_URL: '/api',
  },
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;