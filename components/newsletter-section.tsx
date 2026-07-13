"use client"

import type React from "react"
import { useState } from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const Cal = dynamic(() => import("@calcom/embed-react"), { ssr: false })

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [bookingEmail, setBookingEmail] = useState("")
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const { toast } = useToast()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setBookingEmail(email)
    setIsBookingOpen(true)
    toast({
      title: "Choose a time that works for you",
      description: "Your email is prefilled in the booking window.",
    })
  }

  return (
    <section id="contact" className="scroll-mt-24 bg-primary/[0.055] pb-24 pt-8 dark:bg-white/[0.035] md:pb-32">
      <div className="container">
        <motion.div
          className="relative isolate overflow-hidden rounded-[2rem] bg-primary/25 px-6 py-14 sm:px-10 md:rounded-[2.75rem] md:px-14 md:py-20 lg:min-h-[36rem] lg:px-20"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 50, clipPath: reduceMotion ? "inset(0 0 0 0 round 2.75rem)" : "inset(8% 0 0 0 round 2.75rem)" }}
          whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0 round 2.75rem)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute -right-24 -top-16 h-96 w-96 rounded-full bg-white/35 dark:bg-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-36 right-52 hidden h-80 w-80 rounded-full border-[4rem] border-white/30 lg:block" aria-hidden="true" />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12">
            <div className="max-w-3xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Let&apos;s build</p>
              <h2 className="text-5xl leading-[0.94] tracking-[-0.04em] sm:text-6xl lg:text-7xl">Let&apos;s get your project rolling.</h2>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-foreground/65 md:text-lg">
                Tell us what your team is trying to launch or automate, and we&apos;ll follow up with a tailored implementation plan.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Your work email"
                  aria-label="Your work email"
                  className="h-14 min-h-14 shrink-0 rounded-full border-white/60 bg-background px-6 text-base shadow-none focus-visible:ring-primary sm:flex-1"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <Button type="submit" className="h-14 min-h-14 shrink-0 rounded-full bg-primary px-7 text-base font-semibold text-white hover:bg-primary/90">
                  View available times
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
            </div>

            <motion.div
              className="relative mx-auto hidden aspect-square w-full max-w-[19rem] lg:block"
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <div className="absolute inset-[2%] rounded-full bg-white/35 blur-2xl" />
              <div className="absolute inset-[6%] overflow-hidden rounded-full border border-primary/30 bg-primary shadow-[0_24px_70px_-30px_rgba(72,179,255,0.75)]">
                <video
                  className="h-full w-full scale-105 object-cover grayscale contrast-125 mix-blend-screen"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/snoball-rotation-poster.jpg"
                  aria-hidden="true"
                >
                  <source src="/snoball-rotation.webm" type="video/webm" />
                  <source src="/snoball-rotation.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          {bookingEmail && (
            <DialogContent className="max-h-[95vh] w-[calc(100%-1rem)] max-w-5xl overflow-y-auto p-2 sm:p-4">
              <Cal
                calLink="kyle-worrall/snoball-intro"
                config={{ email: bookingEmail, layout: "month_view" }}
                className="min-h-[650px] w-full"
              />
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  )
}
