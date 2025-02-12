"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

function Header() {
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Image src="/logo.png" alt="logo" width={50} height={50} />

      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <ul
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 right-0 bg-secondary md:bg-transparent p-4 md:p-0 gap-6 shadow-md md:shadow-none`}
      >
        <Link href={"/"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all
      cursor-pointer
      ${path == "/" && "text-primary font-bold"}
      `}
          >
            Home
          </li>
        </Link>
        <Link href={"/gradschool"}>
          <li
            className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/gradschool" && "text-primary font-bold"}
            `}
          >
            GradSchool
          </li>
        </Link>

        <Link href={"/about"}></Link>
        <li
          className={`hover:text-primary hover:font-bold transition-all
            cursor-pointer
            ${path == "/about" && "text-primary font-bold"}
            `}
        >
          About
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
