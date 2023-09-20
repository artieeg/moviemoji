"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";
import { Game } from "~/components/Game";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { token } from "./providers";

export const runtime = "edge";

export default function HomePage() {
  const [isLoading, setLoading] = useState<boolean>(true);

  const ref = useRef<HTMLDivElement & { reset: () => void }>();
  const createUser = api.user.createUser.useMutation({
    onSuccess(data) {
      token.current = data.token;

      setLoading(false);
    },
  });

  function onTurnstileSuccess(turnstileToken: string) {
    createUser.mutate({
      turnstileToken,
    });
  }

  return (
    <main className="flex h-screen flex-col text-white">
      <div className="flex flex-col flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <span className="font-primary text-white opacity-50 text-lg">
              Loading...
            </span>

            <Turnstile
              as="aside"
              onExpire={() => ref.current?.reset()}
              onSuccess={onTurnstileSuccess}
              siteKey={env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY}
              className="fixed bottom-4 right-4"
              options={{
                theme: "light",
                appearance: "interaction-only",
              }}
              scriptOptions={{
                appendTo: "body",
              }}
            />
          </div>
        ) : (
          <Game />
        )}
      </div>
    </main>
  );
}
