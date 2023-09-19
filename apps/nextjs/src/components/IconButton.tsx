"use client";

import { motion } from "framer-motion";
import { HTMLAttributes } from "react";

export function IconButton({
  onClick,
  icon: Icon,
}: {
  onClick?: () => void;
  icon: React.ComponentType<HTMLAttributes<SVGElement>>;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 1 }}
      className="h-10 w-10 rounded-full appearance-none font-primary bg-overlay items-center justify-center flex"
      onClick={onClick}
    >
      <Icon />
    </motion.button>
  );
}
