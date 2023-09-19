"use client";

import { motion } from "framer-motion";
import { twJoin } from "tailwind-merge";

export function UserGuessInput({ minimized }: { minimized: boolean }) {
  return (
    <input
      className={twJoin(
        "space-x-1 flex bg-overlay w-full sm:max-w-xs items-center justify-center select-none rounded-4xl appearance-none focus:outline-none",
        "text-center text-3xl font-secondary",
        minimized ? "p-6" : "p-8",
      )}
    />
  );
}
