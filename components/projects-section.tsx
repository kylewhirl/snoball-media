"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

interface Project {
  name: string
  category: string
  description: string
  url: string
  image: string
  darkImage?: string
}

const projects: Project[] = [
  {
    name: "Corksom",
    category: "AI wine intelligence",
    description: "An intelligent sommelier platform built to improve guest recommendations and hospitality workflows.",
    url: "https://corksom.com",
    image: "/projects/corksom-desktop-crop.png",
  },
  {
    name: "the qr code co.",
    category: "QR code platform",
    description: "A focused web app for creating, customizing, and managing QR codes without the usual friction.",
    url: "https://theqrcode.co",
    image: "/projects/theqrcode-desktop-crop-light.png",
    darkImage: "/projects/theqrcode-desktop-crop-dark.png",
  },
  {
    name: "Salon Platinum",
    category: "Beauty & hospitality",
    description: "A polished service and booking experience for a luxury hair salon in Midtown Reno.",
    url: "https://salonplatinumreno.com",
    image: "/projects/salon-platinum-reno-desktop-crop.png",
  },
  {
    name: "Taco Shop Reno",
    category: "Restaurant website",
    description: "A lively local restaurant site that makes the menu, hours, location, and ordering paths easy to find.",
    url: "https://tacoshopreno.com",
    image: "/projects/taco-shop-reno-desktop-crop.png",
  },
  {
    name: "Dinowalls",
    category: "iOS app",
    description: "A product and discovery experience for dynamic iPhone wallpapers that change with the sun.",
    url: "https://dinowalls.app",
    image: "/projects/dinowalls-desktop-crop-light.png",
    darkImage: "/projects/dinowalls-desktop-crop-dark.png",
  },
  {
    name: "Rewrapped",
    category: "Spotify companion",
    description: "Personalized Spotify playlists that update year-round across short, medium, and long-term listening.",
    url: "https://rewrapped.kylewhirl.com",
    image: "/projects/rewrapped-desktop-crop-light.png",
    darkImage: "/projects/rewrapped-desktop-crop-dark.png",
  },
  {
    name: "Passage",
    category: "Wallet pass studio",
    description: "A focused studio for designing, issuing, and updating cards for Apple Wallet and Google Wallet.",
    url: "https://passage.cards",
    image: "/projects/passage-cards-desktop-crop.png",
  },
  {
    name: "Reform Cue",
    category: "Fitness SaaS",
    description: "A streamlined interval timer for creating and running polished Lagree, HIIT, and custom classes.",
    url: "https://reformcue.com",
    image: "/projects/reformcue-desktop-crop-light.png",
    darkImage: "/projects/reformcue-desktop-crop-dark.png",
  },
  {
    name: "Whispering Vine Wine Co.",
    category: "Wine & hospitality",
    description: "A rich hospitality and retail experience for exploring wine, dining, events, and two Reno locations.",
    url: "https://whisperingvinewine.com",
    image: "/projects/whispering-vine-wine-desktop-crop.png",
  },
  {
    name: "Atlas Landing",
    category: "Cocktail bar",
    description: "An atmospheric website for a Midtown Reno cocktail bar, with its menu, story, private events, and location up front.",
    url: "https://atlaslanding.bar",
    image: "/projects/atlas-landing-desktop-crop.png",
  },
]

export function ProjectsSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="work" className="scroll-mt-24 bg-primary/[0.055] py-24 dark:bg-white/[0.035] md:py-32">
      <div className="container">
        <motion.div
          className="mb-16 grid items-end gap-8 md:grid-cols-[1.2fr_0.8fr] lg:mb-24"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Selected work</p>
            <h2 className="max-w-4xl text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Products and places we&apos;ve helped bring online.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:justify-self-end md:text-lg">
            Customer-facing businesses, focused software products, and internal systems—each shaped around a clear job to be done.
          </p>
        </motion.div>

        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-16 lg:gap-y-24">
          {projects.map((project, index) => (
            <motion.article
              key={project.name}
              className={index % 2 === 1 ? "md:pt-24" : ""}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="group block">
                <motion.div
                  className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-muted sm:rounded-[2.25rem]"
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={project.image}
                    alt={`${project.name} homepage`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={`object-cover object-top transition-transform duration-700 group-hover:scale-[1.035] ${project.darkImage ? "dark:hidden" : ""}`}
                  />
                  {project.darkImage ? (
                    <Image
                      src={project.darkImage}
                      alt={`${project.name} homepage in dark mode`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="hidden object-cover object-top transition-transform duration-700 group-hover:scale-[1.035] dark:block"
                    />
                  ) : null}
                  <span className="absolute right-5 top-5 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-background text-foreground opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </motion.div>

                <div className="mt-6 flex items-start justify-between gap-5">
                  <div>
                    <h3 className="custom-font text-3xl tracking-tight sm:text-4xl">{project.name}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{project.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-primary/20 bg-background px-4 py-2 text-xs font-semibold text-primary sm:text-sm">
                    {project.category}
                  </span>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
