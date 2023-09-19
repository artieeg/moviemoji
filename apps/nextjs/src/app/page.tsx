import { Button } from "~/components/Button";
import { EmojiDisplay } from "~/components/EmojiDisplay";
import { UserGuessInput } from "~/components/UserGuessInput";

export const runtime = "edge";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col text-white">
      <div className="flex flex-col items-center justify-center flex-1">
          <EmojiDisplay minimized={false} emojis={["🕵️", "🏃‍♂️", "💰", "🛫"]} />
        <UserGuessInput minimized={false} />
        <Button />
      </div>
    </main>
  );
}
