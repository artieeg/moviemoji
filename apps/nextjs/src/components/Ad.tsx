import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "./Button";

export function Ad({ onHideAd }: { onHideAd: () => void }) {
  async function onIOS() {
    window.location.href =
      "https://apps.apple.com/us/app/moviepals-watch-together/id6461212763";
  }

  async function onAndroid() {
    window.location.href =
      "https://play.google.com/store/apps/details?id=io.moviepals";
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center flex-1 space-y-8"
    >
      <div className="w-full flex-col sm:max-w-xs text-center items-center justify-center flex">
        <p className="font-secondary text-lg text-white">Psst 🤫</p>
        <p className="font-secondary mt-3 text-lg text-white">
          If your like Moviemoji, you should also check out another app I’ve
          made
        </p>

        <Image
          width={100}
          height={100}
          className="rounded-4xl mt-6"
          alt="moviepals logo"
          src="/logo.png"
        />
        <p className="font-primary text-2xl mt-6 text-white">MoviePals</p>
        <p className="font-secondary mt-3 text-lg text-white opacity-70">
          swipe and find dozens of movies to watch together
        </p>

        <div className="flex space-x-3 w-full mt-3">
          <div className="flex-1">
            <Button onClick={onIOS}>IOS</Button>
          </div>

          <div className="flex-1">
            <Button onClick={onAndroid}>Android</Button>
          </div>
        </div>

        <div className="mt-3 w-full">
          <Button onClick={onHideAd} variant="secondary">Keep Playing</Button>
        </div>
      </div>
    </motion.div>
  );
}
