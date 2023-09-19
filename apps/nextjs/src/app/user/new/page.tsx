"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { AccessTokenContext, token } from "~/app/providers";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

export const runtime = "edge";

export default function HomePage() {
  const ref = useRef<any>();

  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const createUser = api.user.createUser.useMutation({
    onSuccess(data) {
      token.current = data.token;

      router.push("/game");
    },
  });

  function onCreateAccount() {
    if (!turnstileToken) {
      return;
    }

    createUser.mutate({
      username,
      turnstileToken: turnstileToken,
    });
  }

  return (
    <main className="flex h-screen flex-col text-white">
      <div className="space-y-4 flex flex-col">
        <Input
          placeholder="Username"
          value={username}
          onChangeText={(e) => setUsername(e)}
        />

        <Button onClick={onCreateAccount}>Play</Button>

        <Turnstile
          ref={ref}
          options={{ refreshExpired: "manual", appearance: "interaction-only" }}
          onSuccess={(token) => {
            setTurnstileToken(token);
          }}
          siteKey={env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY}
          onExpire={() => ref.current?.reset()}
        />
      </div>
    </main>
  );
}
