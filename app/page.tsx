import { ComingSoonHero } from "@/components/coming-soon-hero"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LogoScroll } from "@/components/logo-scroll"
import { NewsletterSection } from "@/components/newsletter-section"
import { ServicesSection } from "@/components/services-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ComingSoonHero />
        <LogoScroll />
        <ServicesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
