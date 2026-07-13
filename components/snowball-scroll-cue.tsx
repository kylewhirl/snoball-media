"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown } from "lucide-react"

const ringText = "HOW WE ROLL • HOW WE ROLL • "

interface SnowballScrollCueProps {
  className?: string
}

export function SnowballScrollCue({ className = "" }: SnowballScrollCueProps) {
  const reduceMotion = useReducedMotion()

  const scrollToProcess = () => {
    document.getElementById("process")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
  }

  return (
    <motion.button
      type="button"
      aria-label="How we roll — jump to our process"
      onClick={scrollToProcess}
      className={`group relative flex h-40 w-40 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { scale: 1.04 }}
    >
      <motion.span
        className="absolute inset-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        {ringText.split("").map((character, index) => (
          <span
            key={`${character}-${index}`}
            className="absolute left-1/2 top-0 h-1/2 -translate-x-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${(index / ringText.length) * 360}deg)` }}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </motion.span>

      <span className="relative flex h-[5.75rem] w-[5.75rem] items-center justify-center overflow-hidden rounded-full border border-primary/30 bg-primary shadow-[0_18px_50px_-24px_rgba(72,179,255,0.9)] transition-transform duration-500 group-hover:scale-105">
        <video
          className="absolute inset-0 h-full w-full scale-110 object-cover grayscale contrast-125 mix-blend-screen"
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
        <ArrowDown
          className="relative z-10 h-7 w-7 text-white drop-shadow-sm transition-transform duration-300 group-hover:translate-y-1"
          aria-hidden="true"
        />
      </span>
    </motion.button>
  )
}
