"use client";

import { Mic } from "iconoir-react";
import { Button } from "~/components/Button";
import { EmojiDisplay } from "~/components/EmojiDisplay";
import { IconButton } from "~/components/IconButton";
import { UserGuessInput } from "~/components/UserGuessInput";

export const runtime = "edge";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col text-white">
      <div className="flex flex-col items-center justify-center flex-1">
        <EmojiDisplay minimized={false} emojis={["🕵️", "🏃‍♂️", "💰", "🛫"]} />
        <UserGuessInput value="hello" minimized={false} />
        <Button />
        <IconButton icon={Mic} />
      </div>
    </main>
  );
}
