"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { fadeUp, staggerContainer } from "@lib/animations";

export function HeroText() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -48]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y }}
      className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-20 pt-10 pb-16 md:pt-16 md:pb-24"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="font-serif font-bold text-[2.8rem] sm:text-[3.5rem] lg:text-[4.5rem] leading-[1.05] text-on-surface tracking-tight"
        variants={fadeUp}
      >
        Talent is{" "}
        <span className="underline underline-offset-[6px] decoration-[2px]">
          perhaps
        </span>{" "}
        nothing other than{" "}
        <span className="underline underline-offset-[6px] decoration-[2px]">
          successfully sublimated rage
        </span>
      </motion.h1>

      <motion.div className="flex items-center" variants={fadeUp}>
        <p className="font-sans text-base sm:text-lg text-muted leading-relaxed">
          Duckrates is an editorial platform where writers explore ideas
          across culture, technology, and thought. We publish essays meant to
          last — not just to trend.
        </p>
      </motion.div>
    </motion.section>
  );
}
