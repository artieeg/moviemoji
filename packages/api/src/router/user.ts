import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import * as jwt from "jsonwebtoken";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        turnstileToken: z.string(),
        username: z.string(),
      }),
    )
    .mutation(async ({ input: { username, turnstileToken }, ctx }) => {
      await verifyTurnstileToken(turnstileToken);

      const token = jwt.sign(
        {
          username,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1d",
        },
      );

      return {
        token,
      };
    }),
});

async function verifyTurnstileToken(token: string) {
  let formData = new FormData();
  formData.append("secret", process.env.CLOUDFLARE_TURNSTILE_SECRET as string);
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
