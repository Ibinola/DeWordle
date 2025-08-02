import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const GameEngagement = () => {
  return (
    <section className="p-4 md:p-10 h-auto lg:px-[8.688rem] relative">
      <Card className="p-0 max-w-[72.625rem] h-fit mx-auto w-full rounded-[2rem] border border-white/20 bg-[linear-gradient(180deg,_#261352_-78.24%,_rgba(38,_19,_82,_0)_67.33%)] relative before:absolute before:inset-0 before:p-[0.0313rem] before:rounded-[2rem] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:z-[1] before:pointer-events-none">
        <CardContent className="flex flex-col items-center gap-8 p-10">
          <div className="flex flex-col items-center gap-4 py-2.5">
            <h2 className="font-clash max-w-[15.375rem] mx-auto md:max-w-none font-semibold text-white text-[3rem] w-full md:text-[2.688rem] text-center tracking-wide leading-tight">
              Want to play?
            </h2>
            <p className="w-full max-w-[45.5rem] mx-auto font-jakarta md:font-inter font-medium text-white text-[2.375rem] md:text-2xl text-center tracking-wide leading-relaxed">
              Discover a unique world of unlimited learning built the on
              adventure. Jump in and explore
            </p>
          </div>

          <Button
            variant="outline"
            className="px-6 py-4 w-44 rounded-xl border border-white bg-transparent hover:bg-white/10 font-jakarta font-medium text-white text-lg tracking-wide"
          >
            Explore Games
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default GameEngagement;
