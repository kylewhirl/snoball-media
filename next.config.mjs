/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@openai/codex", "@openai/codex-sdk"],
  outputFileTracingIncludes: {
    "/dashboard": ["./demo-sites/**/*"],
    "/api/codex": ["./demo-sites/**/*"],
  },
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
