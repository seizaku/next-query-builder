"use client";
import Link from "next/link";
import { MixpanelLogo } from "./mixpanel-logo";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import {
  GearIcon,
  MagnifyingGlassIcon,
  MixIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);
  useEffect(() => {
    setTheme(currentTheme == "light" ? "dark" : "light");
  }, [currentTheme]);
  return (
    <nav className="sticky left-0 top-0 z-50 flex h-16 w-full items-center border-b bg-background">
      <div className="flex h-full w-full items-center justify-between gap-8 px-8">
        <div className="flex items-center gap-8">
          <MixpanelLogo mode={currentTheme!} />
          <ul className="hidden items-center gap-2 md:flex">
            <li>
              <Link href={"/"} className={buttonVariants({ variant: "ghost" })}>
                Boards
              </Link>
            </li>
            <li>
              <Link href={"/"} className={buttonVariants({ variant: "ghost" })}>
                Users
              </Link>
            </li>
            <li>
              <Link href={"/"} className={buttonVariants({ variant: "ghost" })}>
                Events
              </Link>
            </li>
          </ul>
        </div>
        <div className="relative hidden md:flex">
          <Input className="w-96 pl-9" placeholder="Search" />
          <MagnifyingGlassIcon className="absolute left-2 top-2 h-5 w-5" />
        </div>
        <ul className="flex items-center gap-2">
          <li>
            <Link
              href={"/"}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <MixIcon className="h-5 w-5" />
            </Link>
          </li>
          <li>
            <Button
              onClick={() =>
                setCurrentTheme(currentTheme == "light" ? "dark" : "light")
              }
              variant={"ghost"}
              size={"icon"}
            >
              {theme == "light" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
          </li>
          <li>
            <Link
              href={"/"}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <GearIcon className="h-5 w-5" />
            </Link>
          </li>
          <li>
            <Link
              href={"/"}
              className={buttonVariants({ variant: "secondary" })}
            >
              Sign in
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
