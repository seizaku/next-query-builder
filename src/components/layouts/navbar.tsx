import Link from "next/link";
import { MixpanelLogo } from "@/components/mixpanel-logo";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GearIcon, MagnifyingGlassIcon, MixIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@/components";

export function Navbar() {
  return (
    <header className="sticky left-0 top-0 z-50 flex h-16 w-full items-center border-b bg-background">
      <nav className="flex h-full w-full items-center justify-between gap-8 px-8">
        <div className="flex items-center gap-8">
          <MixpanelLogo />
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
            <ModeToggle />
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
      </nav>
    </header>
  );
}
