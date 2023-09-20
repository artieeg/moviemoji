"use client";

import { motion } from "framer-motion";
import { twJoin } from "tailwind-merge";

export function EmojiDisplay({
  emojis,
  minimized,
}: {
  emojis: string[];
  minimized: boolean;
}) {
  return (
    <div
      key={emojis.join("")}
      className={twJoin(
        "space-x-1 h-32 px-8 flex bg-overlay w-full sm:max-w-xs items-center  select-none rounded-4xl",
      )}
    >
      {emojis.map((e, idx) => (
        <motion.div
          className="flex-1"
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{ delay: 0.1 + idx * 0.1, duration: 0.2 }}
          animate={{
            scale: [null, 1.2, 1],
            opacity: [null, 0.8, 1],
          }}
        >
          <span
            key={e}
            className={twJoin(
              "transition-all duration-200",
              minimized ? "text-4xl" : "text-5xl",
            )}
          >
            {e}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
