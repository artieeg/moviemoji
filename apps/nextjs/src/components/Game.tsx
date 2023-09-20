import { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import { Button } from "./Button";
import { EmojiDisplay } from "./EmojiDisplay";
import { Input, InputProps } from "./Input";

export function Game() {
  const [minimized, _setMinimized] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);

  const game = api.game.getItems.useInfiniteQuery(
    {},
    {
      initialCursor: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
    },
  );

  const emojis = useMemo(() => {
    return game.data?.pages.flatMap((page) => page.emojis) ?? [];
  }, [game.data?.pages.length]);

  const currentChallenge = emojis[currentChallengeIdx] ?? [];

  useEffect(() => {
    if (currentChallengeIdx === emojis.length - 4) {
      game.fetchNextPage();
    }
  }, [currentChallengeIdx]);

  const [mode, setMode] = useState<InputProps["mode"]>("input");

  function onSubmit() {
    if (mode !== "input") return;

    setMode("correct");

    setTimeout(() => {
      setValue("");
      setMode("input");
      setCurrentChallengeIdx((idx) => idx + 1);
    }, 1000);
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 space-y-8">
      <div className="space-y-3">
        <EmojiDisplay minimized={minimized} emojis={currentChallenge} />
        <Input
          challengeKey={currentChallengeIdx}
          mode={mode}
          value={value}
          onChangeText={(v) => setValue(v)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
        />
      </div>
      <Button variant="secondary" onClick={onSubmit}>
        Submit
      </Button>
    </div>
  );
}
