"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function Counter({ value, suffix = "", duration = 1000 }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasStarted.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasStarted.current) return;
      hasStarted.current = true;
      observer.disconnect();

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || value === 0) {
        setDisplayValue(value);
        return;
      }

      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * easedProgress));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }, { threshold: 0.4 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [duration, value]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
}
