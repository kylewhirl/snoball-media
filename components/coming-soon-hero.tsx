"use client";

import { useMemo } from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Snowflake } from "lucide-react";
import Snowfall from "react-snowfall";

interface Circle {
  size: number;
  left: string;
  top: string;
  initialOpacity: number;
  animateScale: number;
  animateX: number;
  animateY: number;
  animateOpacity: number;
  duration: number;
  delay: number;
}

export function ComingSoonHero() {
  // start with no circles on the server
  const [circles, setCircles] = useState<Circle[]>([]);

  useEffect(() => {
    // populate once, only in the browser
    const generated = Array.from({ length: 20 }).map<Circle>(() => {
      const size           = 50 + Math.random() * 100;
      const left           = `${Math.random() * 100}%`;
      const top            = `${Math.random() * 100}%`;
      const initialOpacity = 0.1 + Math.random() * 0.3;
      const animateScale   = 0.8 + Math.random() * 0.5;
      const animateX       = Math.random() * 100 - 50;
      const animateY       = Math.random() * 100 - 50;
      const animateOpacity = 0.1 + Math.random() * 0.3;
      const duration       = 10 + Math.random() * 20;
      const delay          = Math.random() * 5;
      return {
        size,
        left,
        top,
        initialOpacity,
        animateScale,
        animateX,
        animateY,
        animateOpacity,
        duration,
        delay,
      };
    });
    setCircles(generated);
  }, []);

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Snowfall layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Snowfall
          snowflakeCount={100}
          radius={[0.5, 2.0]}
          speed={[0.5, 2.0]}
          wind={[-0.5, 1.0]}
          color="#48b3ff"
        />
      </div>

      {/* Main content */}
      <div className="container relative z-20">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.6,
            }}
          >
            <Snowflake className="h-8 w-8 text-primary" />
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl custom-font"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span className="text-primary">snoball</span> media
          </motion.h1>

          <motion.h2
            className="mb-8 text-2xl font-bold tracking-tight text-muted-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Coming Soon
          </motion.h2>

          <motion.p
            className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            We're crafting something special. Our new website is under construction,
            but we're still available for your design needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <a
              href="mailto:contact@snoball.media"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated circles background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {circles.map((c, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: c.size,
              height: c.size,
              left: c.left,
              top: c.top,
            }}
            initial={{ scale: 0, opacity: c.initialOpacity }}
            animate={{
              scale: c.animateScale,
              x: c.animateX,
              y: c.animateY,
              opacity: c.animateOpacity,
            }}
            transition={{
              duration: c.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: c.delay,
            }}
          />
        ))}
      </div>
    </section>
  );
}