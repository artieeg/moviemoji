"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useRef, useState } from "react";
import { Game } from "~/components/Game";
import { api } from "~/utils/api";
import { token } from "./providers";
import { env } from "@moviemoji/env";

//export const runtime = "edge";

export default function HomePage() {
  const [isLoading, setLoading] = useState<boolean>(true);

  const ref = useRef<HTMLDivElement & { reset: () => void }>();
  const createUser = api.user.createUser.useMutation({
    onSuccess(data) {
      token.current = data.token;

      setLoading(false);
    },
  });

  useEffect(() => {
    createUser.mutate({});
  }, []);

  return (
    <main className="flex flex-col min-h-screen text-white">
      <div className="flex flex-col flex-1 sm:px-0 px-8">
        {isLoading ? (
          <div className="flex h-screen items-center justify-center flex-1">
            <span className="font-primary text-white opacity-50 text-lg">
              Loading...
            </span>
          </div>
        ) : (
          <div>
            <div className="h-screen flex-col flex">
              <Game />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
