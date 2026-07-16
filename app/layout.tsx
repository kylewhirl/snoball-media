import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import "./fonts.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"

const siteName = "Snoball Media"
const siteTitle = "Snoball Media | Websites, Products & Automation"
const siteDescription =
  "Snoball Media designs and builds high-performing websites, internal tools, and automation for growing teams in Reno and beyond."

export const metadata: Metadata = {
  metadataBase: new URL("https://snoball.media"),
  title: {
    default: siteTitle,
    template: "%s | Snoball Media",
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: "https://snoball.media" }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  keywords: [
    "web design",
    "web development",
    "product design",
    "custom software",
    "internal tools",
    "business automation",
    "Reno web design",
    "Nevada web development",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "How we roll snowball on Snoball blue",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-preview.png",
        alt: "How we roll snowball on Snoball blue",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
