import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { SignJWT } from "jose";
import { createId } from "@paralleldrive/cuid2";
import { env } from "@moviemoji/env";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(z.object({}))
    .mutation(async ({ input: { } }) => {
      //await verifyTurnstileToken(turnstileToken);

      const token = await new SignJWT({ id: createId() })
        .setProtectedHeader({
          alg: "HS256",
        })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

      return {
        token,
      };
    }),
});

async function verifyTurnstileToken(token: string) {
  let formData = new FormData();
  formData.append("secret", env.CLOUDFLARE_SECRET_KEY as string);
  formData.append("response", token);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  const outcome = await result.json();
  if (!outcome.success) {
    console.error(outcome);

    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }
}
