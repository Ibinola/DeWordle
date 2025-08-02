"use client";
import { useState } from "react";
import { LoginForm } from "./LoginModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

import Image from "next/image";
import { MenuIcon } from "./ui/icons/icon";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Games", href: "/games" },
  { label: "Categories", href: "/categories" },
  { label: "Community", href: "/community" },
];

export default function Header() {
  const pathname = usePathname();

  const [modal, setModal] = useState(false);
  const isActive = (href: string) => pathname === href;

  return (
    <div>
      <nav className="flex items-center rounded-[40px]  fixed z-20 top-5 left-1/2 transform -translate-x-1/2 w-full justify-between lg:justify-center max-w-[90%] lg:max-w-[1088px] mx-auto  gap-4 lg:gap-15 p-5 md:px-4.5 md:py-4 bg-dark-100/30 md:rounded-2xl backdrop-blur-[5px]">
        <div className="flex items-center gap-1 md:gap-2">
          <div className="relative w-14 md:w-23 h-4 md:h-6">
            <Image alt="lead studio" src="/logo.svg" width={91} height={24} />
          </div>
          <div className="font-clash font-normal text-white text-base md:text-2xl tracking-widest">
            Studio
          </div>
        </div>

        <MenuIcon className="block md:hidden" />
        <div className="hidden lg:flex items-center justify-center p-2.5 w-[35rem]">
          {navItems.map((item, index) => (
            <div key={item.label} className="flex items-center">
              <Link
                href={item.href}
                className={`font-jakarta font-semibold text-lg tracking-wide whitespace-nowrap ${
                  isActive(item.href) ? "text-white" : "text-gray-400"
                }`}
              >
                {item.label}
              </Link>
              {index < navItems.length - 1 && (
                <div className="h-6 w-0.5 mx-8 bg-[#4b5fff]" />
              )}
            </div>
          ))}
        </div>

        <div className="hidden md:flex">
          <Button variant="outline" onClick={() => setModal(true)}>
            Login / Sign up
          </Button>
          {/* <button
            className="bg-white rounded-2xl text-black px-2 py-1"
            onClick={() => setModal(true)}
          >
            Sign In
          </button> */}
        </div>
      </nav>
      {modal && <LoginForm closeModal={() => setModal(false)} />}
    </div>
  );
}
