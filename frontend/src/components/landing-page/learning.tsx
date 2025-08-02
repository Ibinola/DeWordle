import React, { ReactNode } from "react";
import { Card, CardContent } from "../ui/card";
import { ConnectCardIcon, PlayCardIcon, TrackCardIcon } from "../ui/icons/icon";
import Image from "next/image";

interface FeatureCard {
  title: string;
  description: string;
  background: string;
  icon: ReactNode;
}

const Learning = () => {
  const featureCards: FeatureCard[] = [
    {
      title: "Play, Earn And Learn",
      description:
        "Lorem Ipsum Dolor Sit Amet Cotetur. Amet Id Est Quam Pulvinar Enim Non. Metus Purus Suspendisse Tincidunt",
      background: "bg-[linear-gradient(93deg,#815207_-8.58%,#372602_97.64%)]",
      icon: <PlayCardIcon />,
    },
    {
      title: "Connect And Compete",
      description:
        "Lorem Ipsum Dolor Sit Amet Cotetur. Amet Id Est Quam Pulvinar Enim Non. Metus Purus Suspendisse Tincidunt",
      background: "bg-[linear-gradient(96deg,#4667A6_0%,#001421_97.4%)]",
      icon: <ConnectCardIcon />,
    },
    {
      title: "Track Your Mastery",
      description:
        "Lorem Ipsum Dolor Sit Amet Cotetur. Amet Id Est Quam Pulvinar Enim Non. Metus Purus Suspendisse Tincidunt",
      background: "bg-[linear-gradient(95deg,#7B1971_0.54%,#1D001A_79.22%)]",
      icon: <TrackCardIcon />,
    },
  ];

  return (
    <section className="w-full max-w-7xl relative mx-auto py-8 md:py-16 lg:py-[7.75rem] px-4 sm:px-6 lg:px-8">
      <Image
        className="object-cover absolute top-0 left-0 inset-0 -z-10"
        alt="gradient"
        fill
        src="/side-gradient.svg"
      />
      <div className="relative flex flex-col items-center mb-8 md:mb-12 max-w-[16.69rem] sm:max-w-none mx-auto">
        <h2 className="font-clash font-semibold text-white text-[2.5rem] lg:text-[3.125rem] text-center leading-tight">
          Elevate Your Play
        </h2>
        <p className="font-inter font-normal text-white text-lg sm:text-xl md:text-2xl lg:text-[2rem] text-center leading-6 sm:leading-7 md:leading-8 max-w-[59.63rem] mt-2.5 px-4">
          Dive into a world of skill-based word and puzzle games
        </p>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:flex-wrap justify-center md:justify-between w-full gap-6 md:gap-8 lg:gap-12">
        {featureCards.map((card, index) => (
          <Card
            key={index}
            className={`border-none flex-1 max-w-[31.25rem] mx-auto md:max-w-[21.875rem] w-full p-4 md:p-6 ${card.background}`}
            style={{ borderRadius: "1.533rem" }} // 24.574px to rem for custom radius
          >
            <CardContent className="p-0">
              <div className="flex flex-col items-start justify-center gap-6 md:gap-8">
                {card.icon}
                <div className="flex flex-col items-start gap-4 md:gap-5 w-full">
                  <h3 className="font-clash font-semibold text-white text-lg md:text-xl tracking-wide">
                    {card.title}
                  </h3>
                  <p className="font-jakarta font-medium text-gray-200 text-sm md:text-base leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Learning;
