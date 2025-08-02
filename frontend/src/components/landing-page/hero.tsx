"use client";

import React from "react";
import { Button } from "../ui/button";
import { ScrollIcon } from "../ui/icons/icon";

const Hero = () => {
  const handleScrollClick = () => {
    const learningSection = document.getElementById("learning-section");
    if (learningSection) {
      learningSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="relative h-[43.75rem] p-2 flex items-center justify-center overflow-hidden bg-[url('/gradient.svg')] bg-cover bg-no-repeat bg-center w-full lg:h-[50rem] rounded-b-[2.5rem]">
      <div className="absolute inset-0 aspect-square bg-[url(/bg-mobile.svg)] object-fit lg:bg-[url(/bg.svg)] bg-cover w-full h-full bg-no-repeat bg-center mix-blend-color-dodge" />

      <div
        className="absolute w-9 h-9 lg:top-[42.125rem] top-[35rem] opacity-60 cursor-pointer"
        onClick={handleScrollClick}
        aria-label="Scroll down to learn more"
        role="button"
      >
        <ScrollIcon className="w-full h-full" />
      </div>
      <div className="flex flex-col z-20 items-center gap-[3.375rem] w-full max-w-4xl mx-auto py-12">
        <div className="flex flex-col items-center gap-2 w-full">
          <h2 className="w-full capitalize max-w-[18rem] md:max-w-[90%] lg:max-w-[44.25rem] font-clash font-semibold text-white text-[2.125rem] sm:text-5xl lg:text-[5.125rem] text-center tracking-tight leading-tight">
            Unlock Endless Discoveries.
          </h2>

          <p className="max-w-[42.69rem] mx-auto font-jakarta font-normal text-white/80 text-lg text-center tracking-wide leading-relaxed">
            Challenge your mind with a growing world of games designed for
            thinkers, learners, and players who crave more than just fun
          </p>
        </div>

        <Button variant="outline" size="lg">
          Explore Games
        </Button>
      </div>
    </section>
  );
};

export default Hero;
