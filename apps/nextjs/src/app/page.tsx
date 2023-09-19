"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/Button";

export const runtime = "edge";

export default function HomePage() {
  const router = useRouter();

  function onStart() {
    router.push("/user/new");
  }

  return (
    <main className="flex h-screen flex-col text-white">
      <div className="space-y-4 flex flex-col">
        <Button onClick={onStart}>Play Now</Button>
      </div>
    </main>
  );
}
