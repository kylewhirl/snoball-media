"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import {
  siNextdotjs,
  siReact,
  siHtml5,
  siJavascript,
  siCss3,
  siTailwindcss,
  siCanva,
  siWebflow,
  siWix,
  siShopify,
  siAffinitydesigner,
  siAffinityphoto,
  siAffinitypublisher,
  siLottiefiles,
  siOpenai,
  siGithub,
  siVercel,
  siFigma,
  siAffinity,
  siSupabase,
  siGooglecloud,
  siNodedotjs,
} from "simple-icons";

interface LogoProps {
  icon: {
    path: string;
    title: string;
    hex: string;
  };
}

const baseLogos: LogoProps[] = [
  { icon: siNextdotjs },
  { icon: siReact },
  { icon: siHtml5 },
  { icon: siJavascript },
  { icon: siCss3 },
  { icon: siTailwindcss },
  { icon: siCanva },
  { icon: siWebflow },
  { icon: siWix },
  { icon: siShopify },
  { icon: siAffinitydesigner },
  { icon: siAffinityphoto },
  { icon: siAffinitypublisher },
  { icon: siLottiefiles },
  { icon: siOpenai },
  { icon: siGithub },
  { icon: siVercel },
  { icon: siFigma },
  { icon: siAffinity },
  { icon: siSupabase },
  { icon: siGooglecloud },
  { icon: siNodedotjs },
];

export function LogoScroll() {
  // shuffle logos once on mount
  const logos = useMemo<LogoProps[]>(() => {
    const arr = [...baseLogos];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  return (
    <div className="relative w-full bg-primary/5 dark:bg-primary/10 py-10 overflow-hidden">
      {/* gradient edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background/100 dark:from-background/100 to-transparent z-50" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background/100 dark:from-background/100 to-transparent z-50" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto mb-4 text-center relative z-20"
      >
        <span className="text-sm font-medium text-muted-foreground">
          Technologies &amp; Tools We Use
        </span>
      </motion.div>

      <div className="relative z-20">
        <Marquee speed={40} gradient={false} pauseOnHover={false}>
          {logos.map((logo, index) => (
            <div key={index} className="mx-8 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-8 w-8"
                role="img"
                aria-label={logo.icon.title}
                style={{ fill: `#${logo.icon.hex}` }}
              >
                <title>{logo.icon.title}</title>
                <path d={logo.icon.path} />
              </svg>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}