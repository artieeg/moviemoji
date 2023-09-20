"use client";

import { HTMLAttributes, useRef } from "react";
import { twJoin } from "tailwind-merge";

export function Input({
  minimized,
  value,
  onChangeText,
  ...rest
}: {
  value: string;
  onChangeText: (s: string) => void;
  minimized?: boolean;
} & HTMLAttributes<HTMLInputElement>) {
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
        onChange={(e) => {
          onChangeText(e.target.value);
        }}
        ref={ref}
        type="text"
        placeholder="Your Guess"
        value={value}
        style={{
          fontSize,
        }}
        className={twJoin(
          "space-x-1 transition-all h-full duration-700 w-full placeholder:text-white placeholder:opacity-30 bg-transparent select-none appearance-none focus:outline-none",
          "text-center text-6xl font-primary",
        )}
        {...rest}
      />
    </div>
  );
}
