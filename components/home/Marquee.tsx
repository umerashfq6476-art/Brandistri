"use client";

import { motion } from "framer-motion";

const items = [
  "Brand Identity",
  "Web Design",
  "Brand Strategy",
  "Social Branding",
  "Video Content",
  "Digital Growth",
  "UI/UX Design",
  "Rebranding",
];

function Row({ direction = "left" }: { direction?: "left" | "right" }) {
  const sequence = [...items, ...items];
  return (
    <div className="relative flex overflow-hidden border-y border-border bg-surface py-6">
      <motion.div
        className="flex shrink-0 items-center gap-12 whitespace-nowrap pr-12"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {sequence.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-text-primary"
          >
            <span>{label}</span>
            <span className="ml-12 text-accent-secondary">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative w-full">
      <Row direction="left" />
    </div>
  );
}
