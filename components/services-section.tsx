"use client"

import { motion } from "framer-motion"
import { Brush, Code, Layout, Clapperboard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    icon: <Brush className="h-6 w-6" />,
    title: "Graphic Design",
    description: "Eye-catching visuals that communicate your brand's message effectively.",
  },
  {
    icon: <Layout className="h-6 w-6" />,
    title: "Web Design",
    description: "Beautiful, responsive websites that provide exceptional user experiences.",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Web Development",
    description: "Custom web solutions built with modern technologies and best practices.",
  },
  {
    icon: <Clapperboard className="h-6 w-6" />,
    title: "Logo Animation",
    description: "Bring your brand to life with captivating logo animations and motion graphics.",
  },
]

export function ServicesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full text-primary font-medium">
            What We Do
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
          <p className="text-muted-foreground">
            We specialize in creating digital experiences that elevate your brand and engage your audience.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full transition-all hover:shadow-md group">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
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
