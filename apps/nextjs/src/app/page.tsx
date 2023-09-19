"use client";

import { Button } from "~/components/Button";
import {env} from "~/env.mjs";

export const runtime = "edge";

export default function HomePage() {
  function onCaptchaComplete(c: any) {
    console.log("Captcha complete!", c);
  }


  return (
    <main className="flex h-screen flex-col text-white">
      <div
        className="cf-turnstile checkbox"
        data-sitekey={env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY}
        data-callback="onCaptchaComplete"
      />
      <div className="flex flex-col items-center justify-center flex-1 space-y-3">
        <Button>Hello World</Button>
      </div>
    </main>
  );
}
