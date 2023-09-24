import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import { Ad } from "./Ad";
import { Button } from "./Button";
import { EmojiDisplay, EmojiDisplaySkeleton } from "./EmojiDisplay";
import { Input, InputProps } from "./Input";

export function Game() {
  const [minimized, _setMinimized] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const [showAd, setShowAd] = useState<boolean>(false);

  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);

  useEffect(() => {
    setShowAd(currentChallengeIdx === 12);
  }, [currentChallengeIdx]);

  function onHideAd() {
    setShowAd(false);
  }

  const game = api.game.getItems.useInfiniteQuery(
    {},
    {
      initialCursor: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor;
      },
    },
  );

  const challenges = useMemo(() => {
    return game.data?.pages.flatMap((page) => page.challenges) ?? [];
  }, [game.data?.pages.length]);

  const challenge = challenges[currentChallengeIdx];

  useEffect(() => {
    if (currentChallengeIdx === challenges.length - 4) {
      game.fetchNextPage();
    }
  }, [currentChallengeIdx]);

  const [mode, setMode] = useState<InputProps["mode"]>("input");

  const submit = api.game.submitAnswer.useMutation();

  async function onSubmit() {
    if (mode !== "input") return;

    const result = await submit.mutateAsync({
      movieId: challenge?.id as string,
      answer: value,
    });

    if (result.correct) {
      setMode("correct");
    } else {
      setValue(result.answer ? result.answer : value);
      setMode("incorrect");
    }

    setTimeout(() => {
      setValue("");
      setMode("input");
      setCurrentChallengeIdx((idx) => idx + 1);
    }, 1000);
  }

  const getHint = api.game.getHints.useQuery(
    {
      movieId: challenge?.id as string,
    },
    {
      enabled: false,
    },
  );

  async function onGetHint() {
    const { data } = await getHint.refetch();

    if (data?.hint) {
      setValue(data.hint);
    }
  }

  function onSkip() {
    setCurrentChallengeIdx((idx) => idx + 1);
  }

  return (
    <AnimatePresence mode="wait">
      {showAd ? (
        <Ad onHideAd={onHideAd} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center flex-1 space-y-8"
        >
          <div className="space-y-3">
            {challenge ? (
              <EmojiDisplay minimized={minimized} challenge={challenge} />
            ) : (
              <EmojiDisplaySkeleton />
            )}

            <Input
              challenge={challenge}
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

          <div className="w-full sm:max-w-xs">
            <Button
              variant="secondary"
              onClick={value.length === 0 ? onGetHint : onSubmit}
            >
              {value.length === 0 ? "Get a hint" : "Submit"}
            </Button>

            <Button variant="text" onClick={onSkip}>
              Skip
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
