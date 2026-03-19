import Link from "next/link";
import React from "react";
import { SITE_INFO } from "@/lib/data";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <Link href="/" className="logo-link">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE_INFO.logoUrl} alt="Logo" className="logo-img" />
      </Link>

      {/* Center nav links */}
      <div className="nav-center">
        <Link href="/generator" className="nav-link">Tools</Link>
        <Link href="/palettes" className="nav-link">Explore</Link>
      </div>

      {/* Right actions */}
      <div className="nav-right ">
        <Link href="/generator" className="nav-signin">Sign in</Link>
        <Link href="/generator" className="nav-signup">Sign up</Link>
      </div>
    </nav>
  );
}
