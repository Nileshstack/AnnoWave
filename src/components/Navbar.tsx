"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User | undefined = session?.user as User | undefined;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/60 border-b">
      <div className="container relative mx-auto flex items-center justify-between px-4 py-4 md:px-8">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight bg-black bg-clip-text text-transparent"
        >
          AnonWave
        </Link>
         
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11 lg:hidden"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
          <div className="hidden items-center gap-9 lg:flex">
          {session ? (
            <>

              <div className="hidden lg:flex ">
                <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white font-semibold uppercase">
                  {(user?.username || user?.email)?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.username || user?.email}
                </span>
                </Link>
              </div>
              <Link href="/room/create">
              <Button className="rounded-full px-6 transition-all hover:scale-105">
              Squadron
              </Button>
            </Link>
              <Link href="/discover">
              <Button className="rounded-full px-6 transition-all hover:scale-105">
              Discover
              </Button>
            </Link>
              <Button
                onClick={() => signOut()}
                className="rounded-full px-6 transition-all hover:scale-105"
                variant="destructive"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="rounded-full px-6 transition-all hover:scale-105">
                Sign In
              </Button>
            </Link>
          )}
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-50 flex flex-col gap-3 border-b bg-white p-4 shadow-md dark:bg-black lg:hidden">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-gray-700 dark:text-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black font-semibold uppercase text-white">
                    {(user?.username || user?.email)?.charAt(0)}
                  </span>
                  <span className="break-all">{user?.username || user?.email}</span>
                </Link>
                <Link href="/room/create" onClick={() => setIsMenuOpen(false)}>
                  <Button className="min-h-11 w-full rounded-full px-6 transition-all hover:scale-105">
                    Squadron
                  </Button>
                </Link>
                <Link href="/discover" onClick={() => setIsMenuOpen(false)}>
                  <Button className="min-h-11 w-full rounded-full px-6 transition-all hover:scale-105">
                    Discover
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  className="min-h-11 w-full rounded-full px-6 transition-all hover:scale-105"
                  variant="destructive"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                <Button className="min-h-11 w-full rounded-full px-6 transition-all hover:scale-105">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
