"use client"

import Marquee from "react-fast-marquee"
import {
  siFigma,
  siGooglecloud,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siOpenai,
  siReact,
  siShopify,
  siSupabase,
  siTailwindcss,
  siVercel,
  siWebflow,
} from "simple-icons"

const tools = [
  siNextdotjs,
  siReact,
  siTailwindcss,
  siJavascript,
  siHtml5,
  siNodedotjs,
  siSupabase,
  siOpenai,
  siVercel,
  siFigma,
  siShopify,
  siWebflow,
  siGooglecloud,
]

export function LogoScroll() {
  return (
    <section className="overflow-hidden border-y border-primary/15 bg-background py-8 md:py-10" aria-label="Technologies and tools we use">
      <div className="container mb-6 flex items-end justify-between gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Tools we build with</p>
        <p className="hidden max-w-sm text-right text-sm text-muted-foreground sm:block">A flexible stack chosen around the job, not a rigid agency template.</p>
      </div>

      <Marquee speed={34} gradient={false} pauseOnHover>
        {tools.map((tool) => (
          <div
            key={tool.slug}
            className="group mx-2 flex h-24 min-w-44 items-center gap-4 rounded-[1.5rem] border border-primary/15 bg-primary/[0.045] px-6 text-foreground transition-colors hover:bg-primary hover:text-white md:h-28 md:min-w-52"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 fill-current" role="img" aria-label={tool.title}>
              <title>{tool.title}</title>
              <path d={tool.path} />
            </svg>
            <span className="text-sm font-semibold">{tool.title}</span>
          </div>
        ))}
      </Marquee>
    </section>
  )
}
