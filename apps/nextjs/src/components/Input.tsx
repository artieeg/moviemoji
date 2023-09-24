"use client";

import { Challenge } from "@moviemoji/api/src/router/game";
import { AnimatePresence, motion } from "framer-motion";
import { HTMLAttributes, useEffect, useRef } from "react";
import { twJoin } from "tailwind-merge";

export type InputProps = {
  value: string;
  mode: "correct" | "incorrect" | "input";
  onChangeText: (s: string) => void;
  minimized?: boolean;
  challengeKey: number;
  challenge?: Challenge;
} & HTMLAttributes<HTMLInputElement>;

export function Input({
  minimized,
  value,
  challengeKey,
  mode,
  challenge,
  onChangeText,
  ...rest
}: InputProps) {
  const fontSize =
    value.length > 16
      ? 36 - 16 + 6
      : value.length > 6
      ? 36 - value.length + 6
      : 36;

  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className={twJoin(
        "flex relative h-32 w-full sm:max-w-xs items-center justify-center rounded-4xl",
        "transition-all duration-300",
        mode === "correct"
          ? "bg-turquoise"
          : mode === "incorrect"
          ? "bg-red"
          : "bg-overlay",
      )}
    >
      <input
        onBlur={() => {
          //if (mode !== "input") return;

          ref.current?.focus();
        }}
        onChange={(e) => {
          if (mode !== "input") return;

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
          mode === "input" ? "text-white" : "text-black",
        )}
        {...rest}
      />

      {challenge && (
        <div
          className={twJoin(
            "absolute bottom-0 font-primary transition-all duration-700",
            mode === "input" ? "text-white opacity-30" : "text-black",
          )}
        >
          {challenge.expectedWordCount}{" "}
          {challenge.expectedWordCount === 1 ? "word" : "words"},{" "}
          {challenge.expectedLength}{" "}
          {challenge.expectedLength === 1 ? "letter" : "letters"}
        </div>
      )}
    </div>
  );
}
