import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://snoball.media/sitemap.xml",
    host: "https://snoball.media",
  }
}
