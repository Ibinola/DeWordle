"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  const mainNavLinks = [
    { label: "Home", href: "/" },
    { label: "All Games", href: "/games" },
    { label: "Community", href: "/community" },
    { label: "Support / Help centre", href: "/support" },
  ];

  const secondaryNavLinks = [
    { label: "Terms of use", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Player agreement", href: "/player-agreement" },
    { label: "Report a bug", href: "/report-bug" },
  ];

  return (
    <footer className="flex flex-col w-full items-center border-t border-[rgba(148,145,153,0)] md:border-transparent justify-center gap-9 lg:gap-10 px-5 lg:py-20 py-7 [background:radial-gradient(50%_50%_at_50%_78%,rgba(23,9,56,1)_0%,rgba(9,1,27,1)_100%)]">
      <div className="flex items-center justify-center gap-12 relative">
        <div className="flex items-center gap-2">
          <div className="relative w-14 md:w-[5.75rem] h-4 md:h-6">
            <Image alt="lead studio" src="/logo.svg" width={91} height={24} />
          </div>
          <div className="font-clash font-normal text-white text-2xl tracking-widest">
            Studio
          </div>
        </div>

        <nav className="md:flex items-start justify-end gap-4 lg:gap-16 hidden" aria-label="Main navigation">
          {mainNavLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-inter font-medium text-base lg:text-lg tracking-wide whitespace-nowrap ${
                isActive(item.href) ? "text-white" : "text-gray-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <nav className="items-start gap-4 lg:gap-16 hidden md:flex" aria-label="Secondary navigation">
        {secondaryNavLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`font-inter font-semibold text-sm lg:text-base tracking-wide whitespace-nowrap ${
              isActive(item.href) ? "text-white" : "text-gray-400"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="md:hidden mt-4">
        <Link
          href="/community"
          className="font-medium text-gray-300 text-base text-center tracking-wide whitespace-nowrap"
        >
          Join our community
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 mt-4">
        <div className="py-2 flex items-center justify-center gap-2 md:hidden">
          <Link
            href="/terms"
            className="font-medium text-gray-300 text-base tracking-wide whitespace-nowrap"
          >
            Terms of Service
          </Link>
          <span className="font-medium text-gray-300 text-base tracking-wide">&nbsp;|&nbsp;</span>
          <Link
            href="/policy"
            className="font-medium text-gray-300 text-base tracking-wide whitespace-nowrap"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="opacity-80 font-medium text-gray-400 text-base whitespace-nowrap">
          Copyright © 2024 Lead Studio
        </div>
      </div>
    </footer>
  );
};

export default Footer;
