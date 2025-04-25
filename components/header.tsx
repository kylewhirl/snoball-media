"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <Image src="/snoball-logo.svg" alt="Snoball Media Logo" width={40} height={40} className="h-10 w-10" />
            <span className="ml-2 mt-2 text-xl font-medium text-primary custom-font">snoball <span className="text-foreground">media</span></span>
          </div>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="mailto:contact@snoball.media" className="text-primary transition-colors hover:text-primary/80">
              Contact Us
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </motion.header>
  )
}
