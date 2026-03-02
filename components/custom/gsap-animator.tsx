"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function GsapReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.8,
  stagger = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let x = 0;
      let y = 0;

      if (direction === "up") y = 50;
      if (direction === "down") y = -50;
      if (direction === "left") x = -50;
      if (direction === "right") x = 50;

      if (stagger > 0 && ref.current?.children) {
        gsap.from(ref.current.children, {
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y,
          x,
          duration,
          delay,
          stagger,
          ease: "power3.out",
        });
      } else {
        gsap.from(ref.current, {
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y,
          x,
          duration,
          delay,
          ease: "power3.out",
        });
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function GsapPageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
