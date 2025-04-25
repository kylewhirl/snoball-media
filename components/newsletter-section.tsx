"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been added to our newsletter.",
      })
      setEmail("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <section className="bg-primary/5 dark:bg-primary/10 py-16 md:py-24 relative overflow-hidden">
      {/* Add some decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-primary/20 rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-tl-full"></div>

      <div className="container relative z-10">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block mb-4 px-3 py-1 bg-primary/20 rounded-full text-primary font-medium">
            Stay Connected
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Stay Updated</h2>
          <p className="mb-8 text-muted-foreground">
            Subscribe to our newsletter to be the first to know when we launch and receive exclusive updates.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border-primary/20 focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
