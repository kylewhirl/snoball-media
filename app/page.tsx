import { ComingSoonHero } from "@/components/coming-soon-hero"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LogoScroll } from "@/components/logo-scroll"
import { NewsletterSection } from "@/components/newsletter-section"
import { ProcessSection } from "@/components/process-section"
import { ProjectsSection } from "@/components/projects-section"
import { ServicesSection } from "@/components/services-section"

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://snoball.media/#organization",
      name: "Snoball Media",
      url: "https://snoball.media",
      logo: "https://snoball.media/android-chrome-512x512.png",
      image: "https://snoball.media/og-preview.png",
      description:
        "Snoball Media designs and builds high-performing websites, internal tools, and automation for growing teams in Reno and beyond.",
      email: "contact@snoball.media",
      areaServed: [
        { "@type": "City", name: "Reno" },
        { "@type": "Country", name: "United States" },
      ],
      serviceType: [
        "Website design",
        "Web development",
        "Product design",
        "Custom software",
        "Internal tools",
        "Business automation",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://snoball.media/#website",
      url: "https://snoball.media",
      name: "Snoball Media",
      description:
        "Websites, internal tools, and automation for growing teams.",
      publisher: { "@id": "https://snoball.media/#organization" },
      inLanguage: "en-US",
    },
  ],
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main className="flex-1">
        <ComingSoonHero />
        <ProjectsSection />
        <ServicesSection />
        <ProcessSection />
        <LogoScroll />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
