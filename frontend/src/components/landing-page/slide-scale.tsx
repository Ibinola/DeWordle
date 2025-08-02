"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { NextIcon } from "../ui/icons/icon";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
const games = [
  {
    id: "spelling-bee",
    title: "SPELLING BEE",
    description:
      "Test your vocabulary skills with our unique word-guessing game. Six attempts to find the hidden word and earn your victory!",
    buttonText: "Play Spelling Bee",
    imageSrc: "/words.svg",
  },
  {
    id: "dewordle",
    title: "DEWORDLE",
    description:
      "Test your vocabulary skills with our unique word-guessing game. Six attempts to find the hidden word and earn your victory!",
    buttonText: "Play Dewordle",
    imageSrc: "/sword.svg",
  },
  {
    id: "tiles",
    title: "TILES",
    description:
      "Test your vocabulary skills with our unique word-guessing game. Six attempts to find the hidden word and earn your victory!",
    buttonText: "Play Tiles",
    imageSrc: "/word.svg",
  },
];
export default function SlideScale() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  console.log("current :", current);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  function handlePrevious() {
    if (!api) return;
    api.scrollPrev();
  }

  function handleNext() {
    if (!api) return;
    api.scrollNext();
  }
  const extendedGames = [...games, ...games];
  return (
    <section className="relative w-full py-24 overflow-hidden">
      <div className="absolute w-full max-w-[97.875rem] h-[44.875rem] top-0 left-1/2 -translate-x-1/2 bg-[#69438e33] rounded-[48.929rem/22.436rem] blur-[7.8125rem]" />

      <div className="relative text-center mb-16">
        <h2 className="font-clash font-normal text-white text-[3.125rem] leading-[3.125rem] mb-6">
          Your next obsession awaits
        </h2>
        <p className="font-jakarta font-normal text-white text-[1.3125rem] leading-[1.8375rem]">
          Challenge your mind with a games more than just fun
        </p>
      </div>
      <Carousel
        setApi={setApi}
        className="w-full mx-auto h-full"
        opts={{ loop: true }}
      >
        <CarouselContent className="">
          {extendedGames.map((game, index) => (
            <CarouselItem
              key={index}
              className={cn("lg:basis-1/3 md:basis-2/4 basis-[70%]", {})}
            >
              <Card
                className={cn(
                  "opacity-100 rounded-[0.897rem] p-0 overflow-hidden backdrop-blur-[0.42rem] border border-[#34E0FF] shadow-lg shadow-[#34E0FF]/20  transition-transform duration-500 h-full min-h-[37.5rem] md:min-h-[46.3125rem]",
                  {
                    "scale-x-[0.9] scale-y-[0.861] opacity-60 p-0 border-[#636363] bg-black/40 blur-[0.175rem]":
                      index !== current - 1,
                  }
                )}
              >
                <CardContent className="flex flex-col aspect-square items-center justify-center p-0">
                  <div
                    className={cn(
                      "relative w-full h-[18.75rem] sm:h-[30.625rem] sm:bg-center bg-top bg-no-repeat bg-cover"
                    )}
                    style={{
                      backgroundImage: `url(${game.imageSrc})`,
                    }}
                  />

                  <div className="flex flex-col items-center gap-6 w-full p-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <h3
                        className={cn(
                          "font-clash font-semibold text-white text-[1.0625rem] lg:text-[2.625rem] leading-[3.125rem] text-center tracking-wider",
                          {
                            "lg:text-[2.25rem] leading-[2.6875rem]":
                              index !== current - 1,
                          }
                        )}
                      >
                        {game.title}
                      </h3>
                      <p
                        className={cn(
                          "font-jakarta font-normal text-lg leading-[1.625rem] text-white/90 text-center max-w-[25rem]",
                          {
                            "text-base leading-6": index !== current - 1,
                          }
                        )}
                      >
                        {game.description}
                      </p>
                    </div>

                    <Button
                      className={cn(
                        "w-full  rounded-lg border border-solid border-white/40 hover:bg-white/5 bg-transparent font-jakarta text-[1.125rem] py-4 px-6 font-medium text-white transition-all duration-300",
                        {
                          " text-base py-3 px-5 ": index !== current - 1,
                        }
                      )}
                    >
                      {game.buttonText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div
          onClick={handleNext}
          className="absolute top-1/2 -translate-y-1/2 left-0 lg:left-14 w-20 h-20 md:w-[8.375rem] md:h-[8.375rem]  opacity-80 hover:opacity-100 transition-opacity cursor-pointer  border-none z-20"
          aria-label="Previous game"
        >
          <div className="relative pointer-events-none rotate-180">
            <NextIcon className="w-12 h-12 lg:w-full lg:h-full" />
          </div>
        </div>

        <div
          onClick={handlePrevious}
          className="absolute top-1/2 -translate-y-1/2  right-0 lg:right-14 w-20 h-20 md:w-[8.375rem] md:h-[8.375rem] opacity-80 hover:opacity-100 transition-opacity cursor-pointer  border-none z-20"
          aria-label="Next game"
        >
          <div className="relative pointer-events-none">
            <NextIcon className=" w-12 h-12 lg:w-full lg:h-full" />
          </div>
        </div>
        <div className="absolute inset-0 w-full h-[45.375rem] top-[3.375rem] left-0 -z-1 [background:radial-gradient(50%_50%_at_50%_0%,rgba(9,1,27,0)_8%,rgba(9,1,27,0.05)_64%,rgba(9,1,27,0.7)_100%)] pointer-events-none" />
      </Carousel>
      <div className="flex justify-center mt-16">
        <Button className="border border-[#34e0ff] px-4 py-2 md:px-8 md:py-4 h-auto rounded-[2.5rem] bg-transparent text-white text-xl lg:text-2xl font-jakarta font-normal leading-[2.1rem] hover:bg-white/5">
          View all Games
        </Button>
      </div>
    </section>
  );
}
