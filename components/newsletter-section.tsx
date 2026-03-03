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

    setTimeout(() => {
      toast({
        title: "Thanks for reaching out!",
        description: "We'll contact you shortly to schedule a strategy call.",
      })
      setEmail("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-primary/5 py-16 dark:bg-primary/10 md:py-24">
      <div className="absolute left-0 top-0 h-24 w-24 rounded-br-full bg-primary/20" />
      <div className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-full bg-primary/10" />

      <div className="container relative z-10">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-4 inline-block rounded-full bg-primary/20 px-3 py-1 font-medium text-primary">Let's Build</div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Need a Website or Internal Tool That Actually Saves Time?</h2>
          <p className="mb-8 text-muted-foreground">
            Tell us what your team is trying to launch or automate, and we'll follow up with a tailored implementation
            plan.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="Your work email"
              className="flex-1 border-primary/20 focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white hover:bg-primary/90">
              {isSubmitting ? "Sending..." : "Request a Strategy Call"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
