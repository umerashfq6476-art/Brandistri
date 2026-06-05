"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

type Props = {
  value: string;
  duration?: number;
  className?: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

export default function CountUp({ value, duration = 1.6, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const parsed = parseValue(value);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    formatNumber(latest, parsed?.decimals ?? 0),
  );
  const [display, setDisplay] = useState<string>(parsed ? "0" : value);

  useEffect(() => {
    if (!parsed) return;
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [parsed, rounded]);

  useEffect(() => {
    if (!parsed || !inView) return;
    const controls = animate(motionValue, parsed.number, {
      duration,
      ease,
    });
    return () => controls.stop();
  }, [parsed, inView, motionValue, duration]);

  if (!parsed) {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.7, ease }}
        className={className}
      >
        {value}
      </motion.span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      {display}
      {parsed.suffix}
    </span>
  );
}

function parseValue(
  raw: string,
): { number: number; decimals: number; prefix: string; suffix: string } | null {
  const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  const decimals = num.includes(".") ? (num.split(".")[1]?.length ?? 0) : 0;
  return {
    prefix: prefix || "",
    number: Number(num),
    decimals,
    suffix: suffix || "",
  };
}

function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
