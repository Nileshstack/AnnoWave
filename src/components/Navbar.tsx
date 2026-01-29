"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User | undefined = session?.user as User | undefined;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/60 border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight bg-black bg-clip-text text-transparent"
        >
          AnonWave
        </Link>

        <div className="flex items-center gap-9">
          {session ? (
            <>

              <div className="hidden md:flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white font-semibold uppercase">
                  {(user?.username || user?.email)?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.username || user?.email}
                </span>
              </div>

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
    </nav>
  );
};

export default Navbar;
