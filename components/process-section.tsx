"use client"

import { motion } from "framer-motion"

const steps = [
  {
    title: "Discover",
    description: "We map your goals, bottlenecks, and current workflows so every build decision is grounded in business outcomes.",
  },
  {
    title: "Design",
    description: "We craft messaging, UX, and interface systems that fit your brand while guiding users toward meaningful actions.",
  },
  {
    title: "Develop",
    description: "We ship performant frontends and reliable backend tools with integrations that reduce manual effort from day one.",
  },
  {
    title: "Scale",
    description: "We iterate using analytics and team feedback to improve conversion, adoption, and operational efficiency over time.",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="py-16 md:py-24">
      <div className="container">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">How We Work</div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">A Practical Process for Small Teams</h2>
          <p className="text-muted-foreground">
            You get senior-level execution without agency bloat: clear milestones, fast feedback loops, and measurable
            progress.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              className="rounded-xl border border-primary/20 bg-primary/5 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">0{index + 1}</p>
              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
