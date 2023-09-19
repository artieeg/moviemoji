"use client";

import { motion } from "framer-motion";
import { HTMLAttributes } from "react";
import { twJoin } from "tailwind-merge";

export function Button({
  onClick,
  variant = "primary",
  children,
  type,
}: {
  onClick?: () => void;
  variant?: "primary" | "secondary";
  children: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <div className="relative w-full sm:max-w-xs mt-1">
      <motion.button
        type={type}
        onClick={onClick}
        whileTap={variant === "primary" ? { translateY: 0 } : { scale: 0.98 }}
        initial={variant === "primary" ? { translateY: -4 } : { scale: 1 }}
        className={twJoin(
          "z-10 relative h-10 w-full font-bold px-4 rounded-full appearance-none font-primary",
          variant === "primary"
            ? "bg-white text-neutral-1"
            : "bg-overlay text-white",
        )}
      >
        {children}
      </motion.button>

      {variant === "primary" && (
        <div className="z-0 absolute h-10 inset-0 bg-red-300 rounded-full bg-gradient-to-r from-orange via-purple-3 to-turquoise" />
      )}
    </div>
  );
}
