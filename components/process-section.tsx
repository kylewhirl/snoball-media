"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll } from "framer-motion"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    title: "Discover",
    description: "We map your goals, bottlenecks, and current workflows so every build decision is grounded in business outcomes.",
  },
  {
    title: "Design",
    description: "We shape the messaging, flows, and interface system together—so feedback stays fast and the direction stays clear.",
  },
  {
    title: "Develop",
    description: "We turn the approved direction into a performant, reliable product with the integrations your team actually needs.",
  },
  {
    title: "Scale",
    description: "We keep improving the work with real usage, analytics, and team feedback instead of treating launch as the finish line.",
  },
]

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start center", "end center"] })

  return (
    <section ref={sectionRef} id="process" className="scroll-mt-24 overflow-hidden bg-primary/[0.055] py-24 dark:bg-white/[0.035] md:py-32">
      <div className="container grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <motion.div
            initial={{ opacity: 0, x: reduceMotion ? 0 : -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">How we roll</p>
            <h2 className="max-w-xl text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">Clear steps. No agency fog.</h2>
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Senior-level execution, direct communication, and a process that keeps decisions moving.
            </p>
            <a
              href="#contact"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Start a project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        <div className="relative pl-7 sm:pl-12">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-primary/20" aria-hidden="true">
            <motion.div
              className="h-full w-px origin-top bg-primary"
              style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
            />
          </div>

          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              className="grid min-h-[17rem] gap-8 border-t border-primary/20 py-10 first:border-t-0 sm:grid-cols-[5rem_1fr] md:min-h-[20rem] md:py-14"
              initial={{ opacity: 0, x: reduceMotion ? 0 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm font-semibold tracking-[0.18em] text-primary">0{index + 1}</p>
              <div>
                <h3 className="custom-font text-4xl tracking-tight sm:text-5xl">{step.title}</h3>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{step.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
