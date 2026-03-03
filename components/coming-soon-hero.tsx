"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Snowflake } from "lucide-react"
import Snowfall from "react-snowfall"

interface Circle {
  size: number
  left: string
  top: string
  initialOpacity: number
  animateScale: number
  animateX: number
  animateY: number
  animateOpacity: number
  duration: number
  delay: number
}

export function ComingSoonHero() {
  const [circles, setCircles] = useState<Circle[]>([])

  const scrollToContact = () => {
    const contact = document.getElementById("contact")
    if (!contact) return
    contact.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map<Circle>(() => {
      const size = 50 + Math.random() * 100
      const left = `${Math.random() * 100}%`
      const top = `${Math.random() * 100}%`
      const initialOpacity = 0.1 + Math.random() * 0.3
      const animateScale = 0.8 + Math.random() * 0.5
      const animateX = Math.random() * 100 - 50
      const animateY = Math.random() * 100 - 50
      const animateOpacity = 0.1 + Math.random() * 0.3
      const duration = 10 + Math.random() * 20
      const delay = Math.random() * 5
      return {
        size,
        left,
        top,
        initialOpacity,
        animateScale,
        animateX,
        animateY,
        animateOpacity,
        duration,
        delay,
      }
    })

    setCircles(generated)
  }, [])

  return (
    <section id="home" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 z-10">
        <Snowfall snowflakeCount={100} radius={[0.5, 2]} speed={[0.5, 2]} wind={[-0.5, 1]} color="#48b3ff" />
      </div>

      <div className="container relative z-20">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 }}
          >
            <Snowflake className="h-8 w-8 text-primary" />
          </motion.div>

          <motion.h1
            className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl custom-font"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span className="text-primary">snoball</span> media
          </motion.h1>

          <motion.p
            className="mb-4 text-base font-medium uppercase tracking-[0.2em] text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Full-Service Product & Development Studio
          </motion.p>

          <motion.h2
            className="mx-auto mb-6 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            We build websites and internal tools that help your business grow.
          </motion.h2>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Strategy, design, development, and automation in one team so you can launch faster with less overhead.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <button
              type="button"
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-lg transition-colors hover:bg-primary/90"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-md border border-primary/30 px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Explore Services
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        {circles.map((c, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: c.size,
              height: c.size,
              left: c.left,
              top: c.top,
            }}
            initial={{ scale: 0, opacity: c.initialOpacity }}
            animate={{
              scale: c.animateScale,
              x: c.animateX,
              y: c.animateY,
              opacity: c.animateOpacity,
            }}
            transition={{
              duration: c.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: c.delay,
            }}
          />
        ))}
      </div>
    </section>
  )
}
