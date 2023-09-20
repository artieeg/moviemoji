import { useState } from "react";
import { EmojiDisplay } from "./EmojiDisplay";
import { Input } from "./Input";

export function Game() {
  const [minimized, setMinimized] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center flex-1 space-y-3">
      <EmojiDisplay minimized={minimized} emojis={["👋", "👋", "👋", "👋"]} />
      <Input value={value} onChangeText={(v) => setValue(v)} />
    </div>
  );
}
