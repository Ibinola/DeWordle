import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Image from "next/image";

const ExploreGames = () => {
  return (
    <section className="p-4">
      <Card className="flex flex-col pointer-events-none relative lg:flex-row items-center bg-[linear-gradient(314deg,rgba(24,27,58,1)_0%,rgba(43,4,82,1)_100%)] justify-center max-w-[81.25rem] mx-auto w-full h-auto gap-6 lg:gap-[9.25rem] p-4 sm:px-6 lg:px-10 py-8 lg:py-0 rounded-[1.25rem] lg:rounded-[2.5rem]">
        <Image
          className="object-cover w-full h-full inset-0"
          alt="background"
          fill
          src="/bg-2.svg"
        />
        <div className="flex flex-col items-start w-full lg:w-auto gap-6 lg:gap-10 py-8 lg:py-[9.5rem]">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="w-full max-w-[35.44rem] font-jakarta font-semibold text-white text-2xl md:text-left text-center lg:text-[1.75rem] tracking-wide leading-relaxed">
              Engage your mind with skill-based game. Earn rewards, discover new
              words, and level up your knowledge in every session.
            </p>
          </div>

          <Button className="px-4 py-3 self-center md:self-start lg:px-6 lg:py-4 bg-primary-500 rounded-xl w-40 lg:w-[11rem] font-jakarta font-bold text-white text-base lg:text-lg tracking-wide border border-white hover:bg-primary-600">
            Learn More
          </Button>
        </div>

        <div className="py-4 lg:py-[3.25rem] w-full lg:w-auto max-w-full lg:max-w-[26.94rem] flex items-center justify-center">
          <Image
            className="object-contain w-full h-full max-w-[21.88rem] lg:max-w-[26.94rem]"
            width={431}
            height={478}
            alt="Game interface preview"
            src="/interface.svg"
          />
        </div>
      </Card>
    </section>
  );
};

export default ExploreGames;
