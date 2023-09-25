import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';

import "~/styles/globals.css";

import { headers } from "next/headers";

import { TRPCReactProvider } from "./providers";
import { twJoin } from "tailwind-merge";
import { IconoirProvider } from "iconoir-react";

const montserrat = Montserrat({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["700"],
});

const poppins = Poppins({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Moviemoji",
  description: "Guess the movie by emojis",
  openGraph: {
    title: "Moviemoji",
    description: "Play with your friends, guess the movie by emojis",
    url: "https://moviemoji.app/",
    siteName: "Moviemoji",
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={twJoin(
          [montserrat.variable, poppins.variable].join(" "),
          "bg-gradient-to-t from-purple-1 to-purple-2",
        )}
      >
        <IconoirProvider
          iconProps={{
            color: "#ffffff",
            width: 32,
            height: 32,
            strokeWidth: 2,
          }}
        >
          <TRPCReactProvider headers={headers()}>
            {props.children}
          </TRPCReactProvider>
        </IconoirProvider>

        <Analytics />
      </body>
    </html>
  );
}
