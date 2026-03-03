"use client"

import { motion } from "framer-motion"
import { Bot, Code, LayoutDashboard, Rocket, Settings, Workflow } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Startup Website Launches",
    description: "Conversion-focused marketing websites and landing pages designed to ship quickly and scale confidently.",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Custom Web Development",
    description: "Modern, performant builds with flexible CMS and integrations tailored to your growth stage.",
  },
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: "Employee Dashboards",
    description: "Role-based internal portals that centralize KPIs, tasks, and approvals for smoother team operations.",
  },
  {
    icon: <Workflow className="h-6 w-6" />,
    title: "Automation Workflows",
    description: "Automate repetitive admin, reporting, and client communication flows to free your team for higher-value work.",
  },
  {
    icon: <Bot className="h-6 w-6" />,
    title: "AI-Assisted Tools",
    description: "Purpose-built AI helpers for summaries, support triage, and process acceleration where it actually saves time.",
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "Ongoing Optimization",
    description: "Monthly improvements, analytics reviews, and feature iterations that keep your systems useful and effective.",
  },
]

export function ServicesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container">
        <motion.div
          className="mx-auto mb-12 max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">What We Build</div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Services Built for Lean, Fast-Moving Teams</h2>
          <p className="text-muted-foreground">
            From your public-facing website to the internal tools behind it, we design and develop systems that reduce
            friction and create momentum.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={item}>
              <Card className="group h-full transition-all hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
