"use client";

import { motion } from "framer-motion";
import { twJoin } from "tailwind-merge";
import type { Challenge } from "@moviemoji/api/src/router/game";

export function EmojiDisplay({
  challenge: { emojis },
  minimized,
}: {
  challenge: Challenge;
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

export function EmojiDisplaySkeleton() {
  const items = [1, 2, 3, 4, 5];

  return (
    <div
      key={"emoji-display-skeleton"}
      className={twJoin(
        "space-x-1 h-32 px-8 flex bg-overlay w-full sm:max-w-xs items-center  select-none rounded-4xl",
      )}
    >
      {items.map((e, idx) => (
        <motion.div
          key={e}
          className="flex-1"
          initial={{ opacity: 0 }}
          transition={{
            delay: 0.4 + idx * 0.4,
            duration: 0.8,
          }}
          animate={{
            opacity: [null, 0.15],
          }}
        >
          <div className="transition-all aspect-square rounded-full bg-white duration-200 h-12 w-12" />
        </motion.div>
      ))}
    </div>
  );
}
