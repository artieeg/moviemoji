"use client";

import { HTMLAttributes, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

export function UserGuessInput({
  minimized,
  value,
  ...rest
}: { value: string; minimized: boolean } & HTMLAttributes<HTMLInputElement>) {
  const fontSize =
    value.length > 16
      ? 36 - 16 + 6
      : value.length > 6
      ? 36 - value.length + 6
      : 36;

  const ref = useRef(null);

  return (
    <div className="flex bg-overlay h-32 w-full sm:max-w-xs items-center justify-center rounded-4xl">
      <input
        ref={ref}
        type="text"
        placeholder="Your Guess"
        style={{
          fontSize,
        }}
        className={twJoin(
          "space-x-1 transition-all duration-200 w-full placeholder:text-white placeholder:opacity-30 bg-transparent select-none appearance-none focus:outline-none",
          "text-center text-6xl font-secondary",
        )}
        {...rest}
      />
    </div>
  );
}
