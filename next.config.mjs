/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@openai/codex", "@openai/codex-sdk"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
