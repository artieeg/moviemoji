"use client";

import { motion } from "framer-motion";

export function Button() {
  return (
    <div className="relative w-full sm:max-w-xs mt-1">
      <motion.button
        whileTap={{ translateY: 0 }}
        initial={{ translateY: -3 }}
        className="z-10 relative bg-white h-10 w-full text-neutral-1 font-bold px-4 rounded-full appearance-none"
      >
        Play
      </motion.button>
      <div className="z-0 absolute h-10 inset-0 bg-red-300 rounded-full bg-gradient-to-r from-orange via-purple-3 to-turquoise" />
    </div>
  );
}
