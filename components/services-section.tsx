"use client"

import type { CSSProperties } from "react"
import type { LucideIcon } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Bot, Code, LayoutDashboard, Rocket, Settings, Workflow } from "lucide-react"

interface Service {
  icon: LucideIcon
  title: string
  description: string
  surface: string
}

const services: Service[] = [
  {
    icon: Rocket,
    title: "Startup Website Launches",
    description: "Conversion-focused marketing websites and landing pages designed to ship quickly and scale confidently.",
    surface: "bg-primary text-black",
  },
  {
    icon: Code,
    title: "Custom Web Development",
    description: "Modern, performant builds with flexible CMS and integrations tailored to your growth stage.",
    surface: "bg-[#dff2ff] text-black",
  },
  {
    icon: LayoutDashboard,
    title: "Employee Dashboards",
    description: "Role-based internal portals that centralize KPIs, tasks, and approvals for smoother team operations.",
    surface: "bg-black text-white",
  },
  {
    icon: Workflow,
    title: "Automation Workflows",
    description: "Automate repetitive admin, reporting, and client communication flows to free your team for higher-value work.",
    surface: "bg-[#b8e3ff] text-black",
  },
  {
    icon: Bot,
    title: "AI-Assisted Tools",
    description: "Purpose-built AI helpers for summaries, support triage, and process acceleration where it actually saves time.",
    surface: "border border-primary/20 bg-background text-foreground",
  },
  {
    icon: Settings,
    title: "Ongoing Optimization",
    description: "Monthly improvements, analytics reviews, and feature iterations that keep your systems useful and effective.",
    surface: "bg-primary text-black",
  },
]

export function ServicesSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="services" className="scroll-mt-24 py-24 md:py-32">
      <div className="container">
        <motion.div
          className="mb-16 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end lg:mb-24"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">What we build</p>
            <h2 className="max-w-4xl text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              From first idea to daily use.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:justify-self-end md:text-lg">
            Public websites and the systems behind them, designed as one useful, connected experience.
          </p>
        </motion.div>

        <div className="relative">
          {services.map((service, index) => {
            const Icon = service.icon
            const style = {
              "--stack-top": `${7 + index * 0.75}rem`,
              zIndex: index + 1,
            } as CSSProperties

            return (
              <motion.article
                key={service.title}
                style={style}
                className={`relative mb-6 min-h-[25rem] overflow-hidden rounded-[1.75rem] p-7 shadow-[0_26px_80px_-55px_rgba(0,0,0,0.65)] last:mb-0 md:sticky md:top-[var(--stack-top)] md:mb-[18vh] md:min-h-[31rem] md:rounded-[2.25rem] md:p-12 lg:p-16 ${service.surface}`}
                initial={{ opacity: 0, clipPath: reduceMotion ? "inset(0 0 0 0 round 2.25rem)" : "inset(8% 0 0 0 round 2.25rem)" }}
                whileInView={{ opacity: 1, clipPath: "inset(0% 0 0 0 round 2.25rem)" }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <Icon className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.65} aria-hidden="true" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-65">Service 0{index + 1}</p>
                  </div>
                  <ArrowUpRight className="h-7 w-7 opacity-60" aria-hidden="true" />
                </div>

                <div className="mt-24 grid gap-8 md:mt-36 md:grid-cols-[1.1fr_0.9fr] md:items-end">
                  <h3 className="custom-font max-w-3xl text-4xl leading-none tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                    {service.title}
                  </h3>
                  <p className="max-w-xl text-base leading-relaxed opacity-75 md:justify-self-end md:text-lg">{service.description}</p>
                </div>
              </motion.article>
            )
          })}
          <div aria-hidden="true" className="hidden h-[55vh] md:block" />
        </div>
      </div>
    </section>
  )
}
