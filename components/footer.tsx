"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <motion.footer
      className="border-t border-primary/10 bg-background py-8 md:py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Snoball Media. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">Websites, dashboards, and automations for teams that need to move faster.</p>
            <p className="text-sm">
              <Link href="mailto:contact@snoball.media" className="text-primary hover:underline">
                contact@snoball.media
              </Link>
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="mailto:contact@snoball.media" aria-label="Email">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary hover:text-white">
                <Mail className="h-5 w-5" />
              </div>
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary hover:text-white">
                <Linkedin className="h-5 w-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
