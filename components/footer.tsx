"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <motion.footer
      className="bg-black py-14 text-white md:py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[1.2fr_0.8fr] md:items-end md:pb-20">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Snoball Media</p>
            <p className="custom-font max-w-4xl text-4xl leading-[0.95] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Websites, dashboards, and automations for teams that need to move faster.
            </p>
          </div>
          <Link
            href="mailto:contact@snoball.media"
            className="group inline-flex items-center gap-3 text-xl font-medium text-primary md:justify-self-end md:text-2xl"
          >
            contact@snoball.media
            <ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col gap-8 pt-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Snoball Media. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link
              href="mailto:contact@snoball.media"
              aria-label="Email Snoball Media"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-primary hover:bg-primary"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Snoball Media on LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-primary hover:bg-primary"
            >
              <Linkedin className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
