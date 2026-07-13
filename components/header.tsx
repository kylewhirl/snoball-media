"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion"
import { ArrowRight, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { href: "#work", label: "Work", detail: "Selected websites and digital products" },
  { href: "#services", label: "Services", detail: "Design, development, and useful systems" },
  { href: "#process", label: "Process", detail: "A clear path from idea to launch" },
  { href: "#contact", label: "Contact", detail: "Tell us what you want to build" },
]

function BrandLink({ forceBlack = false, onClick }: { forceBlack?: boolean; onClick?: () => void }) {
  return (
    <Link href="#home" className="flex items-center" aria-label="Snoball Media home" onClick={onClick}>
      <Image src="/snoball-logo.svg" alt="" width={42} height={42} className="h-9 w-9 sm:h-10 sm:w-10" priority />
      <span className="custom-font ml-2 mt-2 text-lg font-medium text-primary sm:text-xl">
        snoball <span className={forceBlack ? "text-black" : "text-foreground"}>media</span>
      </span>
    </Link>
  )
}

export function Header() {
  const { scrollY } = useScroll()
  const reduceMotion = useReducedMotion()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuPanelRef = useRef<HTMLElement>(null)
  const [isCompact, setIsCompact] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsCompact(latest > 110)
  })

  useEffect(() => {
    if (!isMenuOpen) return

    const previousOverflow = document.body.style.overflow
    const desktopQuery = window.matchMedia("(min-width: 768px)")
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false)

      if (event.key !== "Tab") return

      const panelFocusables = Array.from(
        menuPanelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ).filter((element) => element.getClientRects().length > 0)
      const focusables = menuButtonRef.current ? [menuButtonRef.current, ...panelFocusables] : panelFocusables
      const first = focusables[0]
      const last = focusables.at(-1)

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.body.style.overflow = "hidden"
    desktopQuery.addEventListener("change", closeOnDesktop)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      desktopQuery.removeEventListener("change", closeOnDesktop)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-[70] h-20 w-full md:h-24">
        <div className="container relative flex h-full items-center">
          <div
            className={`relative flex h-14 w-full items-center justify-between rounded-full border px-2.5 shadow-[0_12px_38px_-24px_rgba(0,0,0,0.42)] backdrop-blur-xl md:contents ${
              isMenuOpen ? "border-black/10 bg-white/80" : "border-primary/15 bg-background/75"
            }`}
          >
          <motion.div
            className="pointer-events-auto relative z-10 hidden md:block"
            animate={{ opacity: isCompact ? 0 : 1, x: isCompact ? -18 : 0 }}
            transition={{ duration: 0.28 }}
          >
            <BrandLink />
          </motion.div>

          <div className="pointer-events-auto relative z-10 md:hidden">
            <BrandLink forceBlack={isMenuOpen} onClick={closeMenu} />
          </div>

          <div className="pointer-events-auto absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <motion.nav
              aria-label="Primary navigation"
              className="flex items-center rounded-full border border-primary/15 bg-background/90 px-2 py-2 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              animate={{ y: isCompact ? -4 : 0, scale: isCompact ? 0.96 : 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:px-5"
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          </div>

          <motion.div
            className="pointer-events-auto relative z-10 hidden items-center gap-2 md:flex"
            animate={{ opacity: isCompact ? 0 : 1, x: isCompact ? 18 : 0 }}
            transition={{ duration: 0.28 }}
          >
            <Link
              href="#contact"
              className="hidden h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 lg:inline-flex lg:px-6"
            >
              Start a Project
            </Link>
            <Link
              href="#contact"
              aria-label="Start a project"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-primary transition-transform hover:-translate-y-0.5"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <ThemeToggle />
          </motion.div>

          <button
            ref={menuButtonRef}
            type="button"
            className={`pointer-events-auto relative z-[80] flex h-12 w-12 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:hidden ${
              isMenuOpen
                ? "border-black bg-black text-white"
                : "border-primary/25 bg-primary/15 text-foreground backdrop-blur-xl"
            }`}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 45, scale: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 45, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -45, scale: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.aside
            ref={menuPanelRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[60] overflow-hidden bg-[#d9efff] text-black md:hidden"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            animate={reduceMotion ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 44px) 40px)" }}
            exit={reduceMotion ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
            transition={{ duration: reduceMotion ? 0.18 : 0.68, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              className="container flex min-h-[100svh] flex-col pb-16 pt-28"
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0.18 : 0.5, delay: reduceMotion ? 0 : 0.16, ease: [0.34, 1.35, 0.64, 1] }}
            >
              <nav aria-label="Mobile navigation" className="my-auto">
                <motion.ul
                  className="border-t border-black/15"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    open: { transition: { staggerChildren: reduceMotion ? 0 : 0.07, delayChildren: reduceMotion ? 0 : 0.2 } },
                    closed: { transition: { staggerChildren: reduceMotion ? 0 : 0.035, staggerDirection: -1 } },
                  }}
                >
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      className="border-b border-black/15"
                      variants={{
                        open: { opacity: 1, y: 0 },
                        closed: { opacity: 0, y: reduceMotion ? 0 : 24 },
                      }}
                      transition={{ duration: reduceMotion ? 0.15 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="group flex min-h-[5.25rem] items-center gap-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-inset"
                      >
                        <span className="w-7 text-[11px] font-semibold tabular-nums text-black/45">0{index + 1}</span>
                        <span className="custom-font text-[2.35rem] leading-none tracking-[-0.035em]">{item.label}</span>
                        <span className="ml-auto hidden max-w-32 text-right text-[11px] leading-snug text-black/50 min-[370px]:block">
                          {item.detail}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              <motion.div
                className="mt-6 flex items-end justify-between gap-5"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.48, duration: 0.4 }}
              >
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">Start a conversation</p>
                  <a href="mailto:contact@snoball.media" className="text-sm font-semibold underline decoration-black/25 underline-offset-4">
                    contact@snoball.media
                  </a>
                  <p className="mt-2 text-xs text-black/50">Reno, Nevada · working worldwide</p>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Link
                    href="#contact"
                    onClick={closeMenu}
                    aria-label="Start a project"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white"
                  >
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
