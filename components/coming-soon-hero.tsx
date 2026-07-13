"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import Snowfall from "react-snowfall"
import { SnowballScrollCue } from "@/components/snowball-scroll-cue"

export function ComingSoonHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
  const leftCircleY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const rightCircleY = useTransform(scrollYProgress, [0, 1], [0, 70])
  const leftProjectY = useTransform(scrollYProgress, [0, 1], [0, -45])
  const rightProjectY = useTransform(scrollYProgress, [0, 1], [0, 65])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate overflow-hidden pb-12 pt-14 sm:pt-16 lg:pb-8 lg:pt-0"
    >
      <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
        <Snowfall snowflakeCount={115} radius={[0.5, 2]} speed={[0.35, 1.7]} wind={[-0.35, 0.8]} color="#48b3ff" />
      </div>

      <motion.div
        className="pointer-events-none absolute -left-[18rem] top-12 z-0 h-[46rem] w-[46rem] rounded-full bg-primary/[0.08] sm:-left-40 lg:left-4 lg:top-0"
        style={reduceMotion ? undefined : { y: leftCircleY }}
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="pointer-events-none absolute -right-72 bottom-0 z-0 h-[42rem] w-[42rem] rounded-full bg-primary/[0.1] lg:-right-12 lg:bottom-[-8rem]"
        style={reduceMotion ? undefined : { y: rightCircleY }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.25, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="container relative z-10 mx-auto min-h-[650px] lg:min-h-[max(650px,calc(100svh-7rem))] lg:pt-16">
        <h1 className="custom-font relative z-10 uppercase leading-[0.8] tracking-[-0.055em] text-foreground lg:h-[31rem]">
          <motion.span
            className="block max-w-[6ch] text-[clamp(4.5rem,8vw,8rem)] lg:absolute lg:left-0 lg:top-0"
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">Build</span>
            <span className="block">better.</span>
          </motion.span>
          <motion.span
            className="ml-auto mt-10 block max-w-[6ch] text-right text-[clamp(4.5rem,8vw,8rem)] sm:mt-4 lg:absolute lg:right-0 lg:top-[18rem] lg:mt-0"
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">Move</span>
            <span className="block">faster.</span>
          </motion.span>
        </h1>

        <motion.a
          href="https://corksom.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute bottom-12 left-5 z-20 hidden w-[22rem] overflow-hidden rounded-[1.75rem] border-4 border-background bg-black shadow-[0_24px_70px_-40px_rgba(0,0,0,0.75)] lg:block"
          style={reduceMotion ? undefined : { y: leftProjectY }}
          initial={{ opacity: 0, x: -50, rotate: -2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          aria-label="View Corksom project"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src="/projects/corksom-desktop-crop.png"
              alt="Corksom website"
              fill
              priority
              sizes="352px"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
        </motion.a>

        <motion.a
          href="https://passage.cards"
          target="_blank"
          rel="noopener noreferrer"
          className="group absolute right-8 top-20 z-20 hidden w-[19rem] overflow-hidden rounded-[1.75rem] border-4 border-background bg-white shadow-[0_24px_70px_-40px_rgba(0,0,0,0.5)] min-[1380px]:block"
          style={reduceMotion ? undefined : { y: rightProjectY }}
          initial={{ opacity: 0, x: 45, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
          aria-label="View Passage project"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/projects/passage-cards-desktop-crop.png"
              alt="Passage website"
              fill
              priority
              sizes="304px"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
        </motion.a>

        <motion.p
          className="relative z-20 mx-auto mt-10 max-w-sm text-center text-base leading-relaxed text-muted-foreground sm:text-lg lg:absolute lg:bottom-24 lg:left-[59%] lg:m-0 lg:max-w-xs lg:text-left"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.78 }}
        >
          Websites, internal tools, and automation for growing teams.
        </motion.p>

        <div className="relative z-30 mx-auto mt-8 flex justify-center lg:absolute lg:bottom-4 lg:left-1/2 lg:m-0 lg:-translate-x-1/2">
          <SnowballScrollCue />
        </div>
      </div>
    </section>
  )
}
