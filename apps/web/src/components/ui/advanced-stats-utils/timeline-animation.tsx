"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TimelineAnimationProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
};

export function TimelineAnimation({
  children,
  className,
  delay = 0,
  as = "div",
}: TimelineAnimationProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 12 }
      }
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
